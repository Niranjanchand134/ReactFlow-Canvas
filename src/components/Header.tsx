import {
  Undo,
  Redo,
  Play,
  Save,
  UploadCloud,
  User,
  Workflow,
  Loader2
} from 'lucide-react';


export default function Header({
  onRun,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isRunning
}: {
  onRun?: () => void,
  onUndo?: () => void,
  onRedo?: () => void,
  canUndo?: boolean,
  canRedo?: boolean,
  isRunning?: boolean
}) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4 z-50 shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20">
            <Workflow className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-100 leading-none">Flow_Processor_v2</span>
            <span className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Editor · Active</span>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-800"></div>
        <nav className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all">Project</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all">Settings</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all">History</button>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-800 rounded-lg p-1 mr-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${canUndo ? 'hover:bg-slate-800 text-slate-200 cursor-pointer' : 'text-slate-700 cursor-not-allowed'}`}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${canRedo ? 'hover:bg-slate-800 text-slate-200 cursor-pointer' : 'text-slate-700 cursor-not-allowed'}`}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${isRunning
            ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.2)]'
            : 'text-slate-300 bg-slate-800 hover:bg-slate-700 border-slate-700'
            }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Flow</span>
            </>
          )}
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all">
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md shadow-indigo-900/10">
          <UploadCloud className="w-3.5 h-3.5" />
          Deploy
        </button>
        <div className="w-px h-6 bg-slate-800 mx-2"></div>
        <button className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden hover:border-slate-400 transition-colors">
          <User className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
