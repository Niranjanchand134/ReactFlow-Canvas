import { Handle, Position } from 'reactflow';
import { LogIn, MoreVertical } from 'lucide-react';

export default function InputNode({ data }: { data: any }) {
  return (
    <div className="w-56 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <LogIn className="text-blue-400 w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-100 uppercase tracking-tight">Input</span>
        </div>
        <MoreVertical className="text-slate-600 w-4 h-4" />
      </div>
      
      <div className="space-y-2">
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-1/3"></div>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-500">Buffer usage</span>
          <span className="text-slate-300 font-mono">33%</span>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 rounded-full shadow-lg !right-[-7px]" 
      />
    </div>
  );
}
