import React, { useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Panel,
  useReactFlow,
  useViewport,
  MiniMap
} from 'reactflow';
import InputNode from './nodes/InputNode';
import OperationNode from './nodes/OperationNode';
import ResultNode from './nodes/ResultNode';
import { Plus, Minus, Scan, Maximize } from 'lucide-react';
import ImageNode from './nodes/ImageNode';
import CumulativeNode from './nodes/CumulativeNode';
import { CustomEdge } from './edges/CustomEdge';
import ContextMenu from './ContextMenu';

// Move nodeTypes and edgeTypes outside or memoize them
const INITIAL_NODE_TYPES = {
  textUpdater: InputNode,
  additionNode: OperationNode,
  subtractionNode: OperationNode,
  multiplicationNode: OperationNode,
  divisionNode: OperationNode,
  resultNode: ResultNode,
  imageNode: ImageNode,
  cumulativeNode: CumulativeNode,
};

const INITIAL_EDGE_TYPES = {
  custom: CustomEdge,
};

function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <Panel position="bottom-right" className="flex items-center bg-slate-900 border border-slate-700/50 rounded-lg p-1.5 shadow-2xl backdrop-blur gap-1">
      <button onClick={() => zoomIn()} className="p-2 hover:bg-slate-800 text-slate-400 rounded-md transition-colors">
        <Plus className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-slate-800 mx-1"></div>
      <button onClick={() => zoomOut()} className="p-2 hover:bg-slate-800 text-slate-400 rounded-md transition-colors">
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-slate-800 mx-1"></div>
      <button onClick={() => fitView()} className="p-2 hover:bg-slate-800 text-slate-400 rounded-md transition-colors">
        <Scan className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-slate-800 mx-1"></div>
      <span className="text-xs font-bold text-slate-500 px-3">{Math.round(zoom * 100)}%</span>
    </Panel>
  );
}

function CustomMinimap() {
  return (
    <MiniMap
      position="bottom-left"
      nodeStrokeColor="#6366f1"
      nodeColor={(n) => {
        if (n.type === 'textUpdater') return '#3b82f6';
        if (n.type === 'resultNode') return '#10b981';
        return '#f97316';
      }}
      nodeBorderRadius={8}
      maskColor="rgba(15, 23, 42, 0.6)"
      className="!bg-slate-900/80 !border-slate-700 !rounded-xl !shadow-2xl !backdrop-blur-md !m-4 !w-44 !h-28"
    />
  );
}

const FlowCanvas = forwardRef(({ onHistoryChange }: { onHistoryChange: (status: any) => void }, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [menu, setMenu] = React.useState<{ x: number, y: number, nodeId?: string, hasImage?: boolean } | null>(null);

  // Memoize nodeTypes and edgeTypes to satisfy React Flow warnings and optimize renders
  const nodeTypes = React.useMemo(() => INITIAL_NODE_TYPES, []);
  const edgeTypes = React.useMemo(() => INITIAL_EDGE_TYPES, []);

  const { screenToFlowPosition, getNodes, getEdges } = useReactFlow();

  const history = useRef<{ nodes: any[], edges: any[] }[]>([]);
  const future = useRef<{ nodes: any[], edges: any[] }[]>([]);

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
  }, [setNodes, setEdges, pushToHistory]);

  const onNodeValueChange = useCallback((id: string, newValue: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          // If newValue is a string representing image data, update the image field
          if (typeof newValue === 'string' && newValue.startsWith('data:image')) {
            return {
              ...node,
              data: { ...node.data, image: newValue, value: undefined },
            };
          }
          // Default behavior for text/number inputs
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
  }, [getNodes]);

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

  const onExecute = useCallback(() => {
    const currentNodes = [...getNodes()];
    const currentEdges = getEdges();

    const results: Record<string, any> = {};

    const evaluate = (nodeId: string): any => {
      // Return cached result if exist
      if (results[nodeId] !== undefined) {
        return results[nodeId].value !== undefined ? results[nodeId].value : results[nodeId].image;
      }

      const node = currentNodes.find((n) => n.id === nodeId);
      if (!node) return 0;

      // Leaf nodes
      if (node.type === 'textUpdater') {
        const val = Number(node.data.value);
        return isNaN(val) ? 0 : val;
      }
      if (node.type === 'imageNode') {
        return node.data.image || null;
      }

      // Recursively get inputs
      const incomingEdges = currentEdges.filter((e) => e.target === nodeId);
      const inputs = incomingEdges.map((e) => evaluate(e.source));

      let value: any = 0;
      let image: any = undefined;
      let error = null;

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
        case 'cumulativeNode':
          const n = Number(inputs[0] ?? 0);
          // CS(n) = 0 + 1 + ... + (n-1) = n(n-1)/2
          value = (n * (n - 1)) / 2;
          break;
        case 'resultNode':
          const input = inputs[0];
          if (typeof input === 'string' && input.startsWith('data:image')) {
            image = input;
            value = undefined;
          } else {
            value = input ?? 0;
            image = undefined;
          }
          break;

      }

      results[nodeId] = error ? { error } : { value, image };
      return value !== undefined ? value : image;
    };

    // Find all result nodes and trigger evaluation
    const resultNodes = currentNodes.filter((n) => n.type === 'resultNode');
    const opNodes = currentNodes.filter((n) => ['additionNode', 'subtractionNode', 'multiplicationNode', 'divisionNode'].includes(n.type || ''));

    // Evaluate all terminal/operation nodes
    [...resultNodes, ...opNodes].forEach(n => evaluate(n.id));

    // Update nodes with results
    setNodes((nds) =>
      nds.map((n) => {
        if (results[n.id] !== undefined) {
          // Merge results into node data, ensuring we don't keep stale values/images
          return {
            ...n,
            data: {
              ...n.data,
              ...results[n.id]
            }
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

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: {
          label: label || `${type}`,
          value: type === 'textUpdater' ? 0 : undefined,
          image: type === 'imageNode' ? null : undefined,
          onChange: onNodeValueChange,
          onDelete: onDeleteNode
        },
        // Use style for initial dimensions to ensure node is "open" and visible
        ...(type === 'imageNode' || type === 'resultNode' ? { style: { width: 250, height: 200 } } : {})
      };

      pushToHistory();
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, onNodeValueChange, onDeleteNode, pushToHistory]
  );

  return (
    <div className="flex-1 h-full bg-slate-950 relative">
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
        className="bg-slate-950"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e293b"
        />
        <CustomControls />
        <CustomMinimap />
        {menu && (
          <ContextMenu
            x={menu.x}
            y={menu.y}
            nodeId={menu.nodeId}
            hasImage={menu.hasImage}
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
