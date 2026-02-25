import React, { useRef, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import FlowCanvas from './components/FlowCanvas';
import { ReactFlowProvider, useReactFlow } from 'reactflow';

function MainContent() {
  const canvasRef = useRef<{
    execute: () => void,
    undo: () => void,
    redo: () => void,
    canUndo: boolean,
    canRedo: boolean
  } | null>(null);

  const [historyStatus, setHistoryStatus] = React.useState({ canUndo: false, canRedo: false });
  const [isRunning, setIsRunning] = React.useState(false);

  const onRun = useCallback(async () => {
    if (canvasRef.current) {
      setIsRunning(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      canvasRef.current.execute();
      setIsRunning(false);
    }
  }, []);

  const onUndo = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  }, []);

  const onRedo = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  }, []);

  // Update history status periodically or via a callback from child
  const updateStatus = useCallback((status: { canUndo: boolean, canRedo: boolean }) => {
    setHistoryStatus(status);
  }, []);

  // Keyboard Shortcuts for Undo/Redo
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      if (modifier && event.key === 'z') {
        if (event.shiftKey) {
          // Redo: Cmd+Shift+Z (Mac)
          event.preventDefault();
          onRedo();
        } else {
          // Undo: Ctrl+Z or Cmd+Z
          event.preventDefault();
          onUndo();
        }
      } else if (modifier && event.key === 'y') {
        // Redo: Ctrl+Y or Cmd+Y
        event.preventDefault();
        onRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo]);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Header
        onRun={onRun}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={historyStatus.canUndo}
        canRedo={historyStatus.canRedo}
        isRunning={isRunning}
      />
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full relative">
          <FlowCanvas ref={canvasRef} onHistoryChange={updateStatus} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <MainContent />
    </ReactFlowProvider>
  );
}
