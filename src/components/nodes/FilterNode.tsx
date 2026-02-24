import { Handle, Position } from 'reactflow';
import { Filter, Settings } from 'lucide-react';

export default function FilterNode({ data }: { data: any }) {
  return (
    <div className="w-56 bg-slate-900 border-2 border-indigo-500 ring-8 ring-indigo-500/5 rounded-xl shadow-2xl p-4">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 rounded-full shadow-lg !left-[-7px]" 
      />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-purple-500/10 rounded-lg">
            <Filter className="text-purple-400 w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-100 uppercase tracking-tight">Filter</span>
        </div>
        <Settings className="text-indigo-400 w-4 h-4" />
      </div>
      
      <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-800">
        <span className="text-[10px] font-mono text-purple-300">value &gt; 100</span>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 rounded-full shadow-lg !right-[-7px]" 
      />
    </div>
  );
}
