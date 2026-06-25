import React, { useRef, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import FlowCanvas from './components/FlowCanvas';
import "react-toastify/dist/ReactToastify.css";
import { ReactFlowProvider } from 'reactflow';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function MainContent() {
  const canvasRef = useRef<{
    execute: () => void,
    undo: () => void,
    redo: () => void,
    copy: () => void,
    paste: () => void,
    selectAll: () => void,
    canUndo: boolean,
    canRedo: boolean
  } | null>(null);

  const [historyStatus, setHistoryStatus] = React.useState({ canUndo: false, canRedo: false });
  const [isRunning, setIsRunning] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (window.localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  React.useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

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

  const onCopy = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.copy();
    }
  }, []);

  const onPaste = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.paste();
    }
  }, []);

  const onSelectAll = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.selectAll();
    }
  }, []);

  // Keyboard Shortcuts for Undo/Redo/Copy/Paste
  useKeyboardShortcuts({
    onUndo,
    onRedo,
    onCopy,
    onPaste,
    onSelectAll,
  });

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-sans ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-950'}`}>
      <Header
        onRun={onRun}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={historyStatus.canUndo}
        canRedo={historyStatus.canRedo}
        isRunning={isRunning}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />
      <main className="flex-1 flex overflow-hidden">
        <Sidebar theme={theme} />
        <div className="flex-1 h-full relative">
          <FlowCanvas ref={canvasRef} onHistoryChange={updateStatus} theme={theme} />
        </div>
      </main>
      <Footer theme={theme} />
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
