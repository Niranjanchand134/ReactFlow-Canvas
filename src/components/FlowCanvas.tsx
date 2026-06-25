import React, { useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  getIncomers,
  BackgroundVariant,
  Panel,
  useReactFlow,
  useViewport,
  MiniMap
} from 'reactflow';
import InputNode from './nodes/InputNode';
import OperationNode from './nodes/OperationNode';
import ResultNode from './nodes/ResultNode';
import ImageNode from './nodes/ImageNode';
import CumulativeNode from './nodes/CumulativeNode';
import FilterNode from './nodes/FilterNode';
import CompositeNode from './nodes/CompositeNode';
import { Plus, Minus, Scan, Maximize } from 'lucide-react';
import { CustomEdge } from './edges/CustomEdge';
import ContextMenu from './ContextMenu';
import { SuccesfulMessageToast, ErrorMessageToast, WarningMessageToast } from '../utils/Tostify.util';

// Build nodeTypes per-theme so node components receive the `theme` prop
const BASE_NODE_TYPES = {
  textUpdater: InputNode,
  additionNode: OperationNode,
  subtractionNode: OperationNode,
  multiplicationNode: OperationNode,
  divisionNode: OperationNode,
  resultNode: ResultNode,
  imageNode: ImageNode,
  filterNode: FilterNode,
  compositeNode: CompositeNode,
  cumulativeNode: CumulativeNode,
};

const EDGE_TYPES = {
  custom: CustomEdge,
};

function CustomControls({ theme }: { theme: 'light' | 'dark' }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <Panel position="bottom-right" className={`flex items-center rounded-lg p-1.5 shadow-2xl backdrop-blur gap-1 ${theme === 'dark' ? 'bg-slate-900 border border-slate-700/50' : 'bg-white/80 border border-slate-200'}`}>
      <button onClick={() => zoomIn()} className={`p-2 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-800'}`}>
        <Plus className="w-4 h-4" />
      </button>
      <div className={`${theme === 'dark' ? 'w-px h-5 bg-slate-800 mx-1' : 'w-px h-5 bg-slate-200 mx-1'}`}></div>
      <button onClick={() => zoomOut()} className={`p-2 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-800'}`}>
        <Minus className="w-4 h-4" />
      </button>
      <div className={`${theme === 'dark' ? 'w-px h-5 bg-slate-800 mx-1' : 'w-px h-5 bg-slate-200 mx-1'}`}></div>
      <button onClick={() => fitView()} className={`p-2 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-800'}`}>
        <Scan className="w-4 h-4" />
      </button>
      <div className={`${theme === 'dark' ? 'w-px h-5 bg-slate-800 mx-1' : 'w-px h-5 bg-slate-200 mx-1'}`}></div>
      <span className={`text-xs font-bold px-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-700'}`}>{Math.round(zoom * 100)}%</span>
    </Panel>
  );
}

function CustomMinimap({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <MiniMap
      position="bottom-left"
      nodeStrokeColor={theme === 'dark' ? '#6366f1' : '#1e293b'}
      nodeColor={(n) => {
        if (n.type === 'textUpdater') return theme === 'dark' ? '#3b82f6' : '#1e40af';
        if (n.type === 'resultNode') return theme === 'dark' ? '#10b981' : '#047857';
        return theme === 'dark' ? '#f97316' : '#c2410c';
      }}
      nodeBorderRadius={8}
      maskColor={theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255,255,255,0.6)'}
      className={`${theme === 'dark' ? '!bg-slate-900/80 !border-slate-700' : '!bg-white/90 !border-slate-200'} !rounded-xl !shadow-2xl !backdrop-blur-md !m-4 !w-44 !h-28`}
    />
  );
}

const FlowCanvas = forwardRef(({ onHistoryChange, theme }: { onHistoryChange: (status: any) => void; theme: 'light' | 'dark' }, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [menu, setMenu] = React.useState<{ x: number, y: number, nodeId?: string, hasImage?: boolean } | null>(null);

  // Memoize nodeTypes and edgeTypes to satisfy React Flow warnings and optimize renders
  const nodeTypes = React.useMemo(() => {
    const map: Record<string, any> = {};
    Object.keys(BASE_NODE_TYPES).forEach((key) => {
      const Cmp: any = (BASE_NODE_TYPES as any)[key];
      map[key] = (props: any) => <Cmp {...props} theme={theme} />;
    });
    return map;
  }, [theme]);

  const edgeTypes = React.useMemo(() => EDGE_TYPES, []);

  const { screenToFlowPosition, getNodes, getEdges, setViewport } = useReactFlow();

  const history = useRef<{ nodes: any[], edges: any[] }[]>([]);
  const future = useRef<{ nodes: any[], edges: any[] }[]>([]);
  const copyBuffer = useRef<any[]>([]);
  const pasteCount = useRef(0);

  const pushToHistory = useCallback(() => {
    history.current.push({ nodes: getNodes(), edges: getEdges() });
    future.current = [];
    onHistoryChange({ canUndo: history.current.length > 0, canRedo: false });
  }, [getNodes, getEdges, onHistoryChange]);

  const undo = useCallback(() => {
    if (history.current.length === 0) return;
    const currentState = { nodes: getNodes(), edges: getEdges() };
    future.current.push(currentState);
    const prevState = history.current.pop();
    if (prevState) {
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
    }
    onHistoryChange({ canUndo: history.current.length > 0, canRedo: future.current.length > 0 });
  }, [getNodes, getEdges, setNodes, setEdges, onHistoryChange]);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    const currentState = { nodes: getNodes(), edges: getEdges() };
    history.current.push(currentState);
    const nextState = future.current.pop();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
    }
    onHistoryChange({ canUndo: history.current.length > 0, canRedo: future.current.length > 0 });
  }, [getNodes, getEdges, setNodes, setEdges, onHistoryChange]);

  const onConnect = useCallback((params: Edge | Connection) => {
    pushToHistory();
    setEdges((eds) => addEdge({
      ...params,
      type: 'custom',
      animated: true,
    }, eds));
  }, [setEdges, pushToHistory]);

  const onDeleteNode = useCallback((id: string) => {
    pushToHistory();
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    WarningMessageToast("Node Deleted Successfully");
  }, [setNodes, setEdges, pushToHistory]);

  const onNodeValueChange = useCallback((id: string, newValue: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          if (typeof newValue === 'string' && newValue.startsWith('data:image')) {
            return {
              ...node,
              data: { ...node.data, image: newValue, value: undefined },
            };
          }
          if (typeof newValue === 'object' && newValue !== null) {
            return {
              ...node,
              data: { ...node.data, ...newValue },
            };
          }
          return {
            ...node,
            data: { ...node.data, value: newValue },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault();
      const hasImage = !!node.data.image;
      setMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        hasImage,
      });
    },
    [setMenu]
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setMenu({
        x: event.clientX,
        y: event.clientY,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const onDuplicate = useCallback((id: string) => {
    const node = getNodes().find((n) => n.id === id);
    if (!node) return;

    const newNode = {
      ...node,
      id: `node_dup_${Date.now()}`,
      position: {
        x: node.position.x + 40,
        y: node.position.y + 40,
      },
      selected: true,
      data: {
        ...node.data,
        onChange: onNodeValueChange,
        onDelete: onDeleteNode,
      },
    };

    pushToHistory();
    setNodes((nds) => nds.map(n => ({ ...n, selected: false })).concat(newNode));
    setMenu(null);
    SuccesfulMessageToast("Node Duplicated Successfully");
  }, [getNodes, setNodes, pushToHistory, onNodeValueChange, onDeleteNode]);

  const onExport = useCallback(() => {
    const flowData = {
      nodes: getNodes(),
      edges: getEdges(),
    };

    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flow-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMenu(null);
  }, [getNodes, getEdges]);

  const onDownloadImage = useCallback((id: string) => {
    const node = getNodes().find((n) => n.id === id);
    if (!node || !node.data.image) return;

    const link = document.createElement('a');
    link.href = node.data.image;
    link.download = `exported-image-${id}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMenu(null);
    SuccesfulMessageToast("Image Downloaded Successfully");
  }, [getNodes]);

  const copy = useCallback(() => {
    const selectedNodes = getNodes().filter((n) => n.selected);
    if (selectedNodes.length > 0) {
      copyBuffer.current = selectedNodes;
      pasteCount.current = 0; // Reset offset count on new copy
      SuccesfulMessageToast("Nodes Copied to Clipboard");
    }
  }, [getNodes]);

  const selectAll = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
  }, [setNodes]);

  const paste = useCallback(() => {
    if (copyBuffer.current.length === 0) return;

    pasteCount.current += 1;
    const offset = 20 * pasteCount.current;

    const newNodes = copyBuffer.current.map((node) => ({
      ...node,
      id: `node_paste_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: node.position.x + offset,
        y: node.position.y + offset,
      },
      selected: true,
      data: {
        ...node.data,
        onChange: onNodeValueChange,
        onDelete: onDeleteNode,
      },
    }));

    pushToHistory();
    // Deselect current nodes and add new ones
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })).concat(newNodes));
  }, [getNodes, setNodes, pushToHistory, onNodeValueChange, onDeleteNode]);

  const isValidConnection = useCallback((connection: Connection) => {
    const targetNode = getNodes().find((n) => n.id === connection.target);
    const sourceNode = getNodes().find((n) => n.id === connection.source);

    if (!targetNode || !sourceNode) return false;

    // Rule: More than two incoming edges into any operation node
    if (['additionNode', 'subtractionNode', 'multiplicationNode', 'divisionNode'].includes(targetNode.type || '')) {
      const incomingEdges = getEdges().filter((e) => e.target === targetNode.id);
      if (incomingEdges.length >= 2) return false;
    }

    // Rule: Result node can only have one incoming edge
    if (targetNode.type === 'resultNode') {
      const incomingEdges = getEdges().filter((e) => e.target === targetNode.id);
      if (incomingEdges.length >= 1) return false;
    }

    // Rule: Prevent Result -> Input, Input -> Input
    if (sourceNode.type === 'resultNode' && targetNode.type === 'textUpdater') return false;
    if (sourceNode.type === 'textUpdater' && targetNode.type === 'textUpdater') return false;

    return true;
  }, [getNodes, getEdges]);

  const onExecute = useCallback(async () => {
    const currentNodes = [...getNodes()];
    const currentEdges = getEdges();

    const results: Record<string, any> = {};
    const cache = new Map<string, string | number | null>();

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });

    const applyFilter = async (src: string, filter: string, amount: number): Promise<string | null> => {
      if (!src) return null;
      try {
        const image = await loadImage(src);
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        switch (filter) {
          case 'grayscale':
            ctx.filter = 'grayscale(100%)';
            ctx.drawImage(image, 0, 0, image.width, image.height);
            break;
          case 'blackWhite':
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const bwData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < bwData.data.length; i += 4) {
              const avg = (bwData.data[i] + bwData.data[i + 1] + bwData.data[i + 2]) / 3;
              const value = avg < 128 ? 0 : 255;
              bwData.data[i] = value;
              bwData.data[i + 1] = value;
              bwData.data[i + 2] = value;
            }
            ctx.putImageData(bwData, 0, 0);
            break;
          case 'sepia':
            ctx.filter = 'sepia(1)';
            ctx.drawImage(image, 0, 0, image.width, image.height);
            break;
          case 'invert':
            ctx.filter = 'invert(100%)';
            ctx.drawImage(image, 0, 0, image.width, image.height);
            break;
          case 'rgb':
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const rgbData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < rgbData.data.length; i += 4) {
              rgbData.data[i] = Math.min(255, rgbData.data[i] * 1.2);
              rgbData.data[i + 1] = Math.min(255, rgbData.data[i + 1] * 1.2);
              rgbData.data[i + 2] = Math.min(255, rgbData.data[i + 2] * 1.2);
            }
            ctx.putImageData(rgbData, 0, 0);
            break;
          case 'red':
          case 'green':
          case 'blue': {
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const toneData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < toneData.data.length; i += 4) {
              if (filter === 'red') {
                toneData.data[i] = Math.min(255, toneData.data[i] * 1.4);
              }
              if (filter === 'green') {
                toneData.data[i + 1] = Math.min(255, toneData.data[i + 1] * 1.4);
              }
              if (filter === 'blue') {
                toneData.data[i + 2] = Math.min(255, toneData.data[i + 2] * 1.4);
              }
            }
            ctx.putImageData(toneData, 0, 0);
            break;
          }
          case 'brightness':
            ctx.filter = `brightness(${amount / 100})`;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            break;
          case 'contrast':
            ctx.filter = `contrast(${amount / 100})`;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            break;
          case 'blur':
            ctx.filter = `blur(${amount}px)`;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            break;
          default:
            ctx.drawImage(image, 0, 0, image.width, image.height);
            break;
        }

        return canvas.toDataURL();
      } catch {
        return null;
      }
    };

    const compositeImages = async (bottomSrc: string | null, topSrc: string | null, blend: string): Promise<string | null> => {
      if (!bottomSrc && !topSrc) return null;
      if (!bottomSrc && topSrc) return topSrc;
      if (!topSrc && bottomSrc) return bottomSrc;

      try {
        const bottom = await loadImage(bottomSrc as string);
        const top = await loadImage(topSrc as string);
        const width = Math.max(bottom.width, top.width);
        const height = Math.max(bottom.height, top.height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(bottom, 0, 0, width, height);
        ctx.globalCompositeOperation = blend as GlobalCompositeOperation;
        ctx.drawImage(top, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        return canvas.toDataURL();
      } catch {
        return null;
      }
    };

    const evaluateNode = async (nodeId: string): Promise<any> => {
      if (cache.has(nodeId)) {
        return cache.get(nodeId);
      }

      const node = currentNodes.find((n) => n.id === nodeId);
      if (!node) return null;

      const incomingNodes = getIncomers(node, currentNodes, currentEdges) || [];
      const inputValues = await Promise.all(incomingNodes.map((inputNode) => evaluateNode(inputNode.id)));

      let value: any = null;
      let image: any = undefined;
      let error: any = null;

      switch (node.type) {
        case 'textUpdater': {
          const val = Number(node.data.value);
          value = isNaN(val) ? 0 : val;
          break;
        }

        case 'imageNode': {
          image = node.data.image || null;
          break;
        }

        case 'filterNode': {
          const source = inputValues.find((v) => typeof v === 'string' && v?.startsWith('data:image')) || null;
          image = await applyFilter(source, node.data.filter || 'grayscale', node.data.amount ?? 50);
          break;
        }

        case 'compositeNode': {
          const bottomEdge = currentEdges.find((e) => e.target === nodeId && e.targetHandle === 'bottom');
          const topEdge = currentEdges.find((e) => e.target === nodeId && e.targetHandle === 'top');
          const bottomSrc = bottomEdge ? await evaluateNode(bottomEdge.source) : null;
          const topSrc = topEdge ? await evaluateNode(topEdge.source) : null;
          image = await compositeImages(bottomSrc, topSrc, node.data.blend || 'multiply');
          break;
        }

        case 'resultNode': {
          const incoming = inputValues[0];
          if (typeof incoming === 'string' && incoming?.startsWith('data:image')) {
            image = incoming;
          } else {
            value = incoming ?? 0;
          }
          break;
        }

        default: {
          if (['additionNode', 'subtractionNode', 'multiplicationNode', 'divisionNode', 'cumulativeNode'].includes(node.type || '')) {
            const inputs = inputValues;
            switch (node.type) {
              case 'additionNode':
                value = (inputs[0] ?? 0) + (inputs[1] ?? 0);
                break;
              case 'subtractionNode':
                value = (inputs[0] ?? 0) - (inputs[1] ?? 0);
                break;
              case 'multiplicationNode':
                value = (inputs[0] ?? 0) * (inputs[1] ?? 0);
                break;
              case 'divisionNode':
                if (inputs[1] === 0) {
                  error = 'Cannot divide by zero';
                } else {
                  value = (inputs[0] ?? 0) / (inputs[1] ?? 1);
                }
                break;
              case 'cumulativeNode': {
                const n = Number(inputs[0] ?? 0);
                value = (n * (n - 1)) / 2;
                break;
              }
            }
          }
          break;
        }
      }

      const result = error ? { error } : { value, image };
      cache.set(nodeId, image !== undefined ? image : value);
      results[nodeId] = result;

      if (error) {
        ErrorMessageToast(error);
      }

      return image !== undefined ? image : value;
    };

    await Promise.all(currentNodes.map((node) => evaluateNode(node.id)));

    setNodes((nds) =>
      nds.map((n) => {
        if (results[n.id] !== undefined) {
          return {
            ...n,
            data: {
              ...n.data,
              ...results[n.id],
            },
          };
        }
        return n;
      })
    );
  }, [getNodes, getEdges, setNodes]);

  useImperativeHandle(ref, () => ({
    execute: onExecute,
    undo,
    redo,
    copy,
    paste,
    selectAll,
    canUndo: history.current.length > 0,
    canRedo: future.current.length > 0
  }));

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeData: any = {
        label: label || `${type}`,
        onChange: onNodeValueChange,
        onDelete: onDeleteNode,
      };

      if (type === 'textUpdater') {
        nodeData.value = 0;
      }
      if (type === 'imageNode') {
        nodeData.image = null;
      }
      if (type === 'filterNode') {
        nodeData.filter = 'grayscale';
        nodeData.amount = 50;
      }
      if (type === 'compositeNode') {
        nodeData.blend = 'multiply';
      }

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: nodeData,
        ...(type === 'imageNode' || type === 'filterNode' || type === 'compositeNode' || type === 'resultNode' ? { style: { width: 280, height: 220 } } : {})
      };

      pushToHistory();
      setNodes((nds) => nds.concat(newNode));
      
      // Set viewport zoom to 75%
      setViewport({ x: 0, y: 0, zoom: 0.75 });
    },
    [screenToFlowPosition, setNodes, onNodeValueChange, onDeleteNode, pushToHistory]
  );

  const backgroundDotColor = theme === 'dark' ? '#0f172a' : '#e6eef8';

  return (
    <div className={`flex-1 h-full relative ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesDelete={pushToHistory}
        onEdgesDelete={pushToHistory}
        onNodeDragStop={pushToHistory}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        onMoveStart={onPaneClick}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'custom',
          animated: true,
        }}
        fitView
        className={theme === 'dark' ? 'bg-slate-950' : 'bg-white'}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={backgroundDotColor}
        />
        <CustomControls theme={theme} />
        <CustomMinimap theme={theme} />
        {menu && (
          <ContextMenu
            x={menu.x}
            y={menu.y}
            nodeId={menu.nodeId}
            hasImage={menu.hasImage}
            theme={theme}
            onDuplicate={onDuplicate}
            onDelete={onDeleteNode}
            onDownloadImage={onDownloadImage}
            onExport={onExport}
            onClose={() => setMenu(null)}
          />
        )}
      </ReactFlow>
    </div>
  );
});

export default FlowCanvas;
