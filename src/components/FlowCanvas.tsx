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
import TextUpdaterNode from './nodes/TextUpdaterNode';
import OperationNode from './nodes/OperationNode';
import ResultNode from './nodes/ResultNode';
import { Plus, Minus, Scan, Maximize } from 'lucide-react';
import ImageNode from './nodes/ImageNode';
import { CustomEdge } from './edges/CustomEdge';

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  additionNode: OperationNode,
  subtractionNode: OperationNode,
  multiplicationNode: OperationNode,
  divisionNode: OperationNode,
  resultNode: ResultNode,
  imageNode: ImageNode,
};

const edgeTypes = {
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
      </ReactFlow>
    </div>
  );
});

export default FlowCanvas;
