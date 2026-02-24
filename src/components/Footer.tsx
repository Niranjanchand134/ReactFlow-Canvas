import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="h-8 bg-slate-950 border-t border-slate-800 text-slate-500 flex items-center px-4 justify-between text-[10px] font-medium shrink-0">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2 text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
          Live
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3 h-3" /> 
          Sync: 8ms
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800/50">Staging Environment</span>
        <span className="font-mono">Nodes: 12 · Connections: 11</span>
      </div>
    </footer>
  );
}
