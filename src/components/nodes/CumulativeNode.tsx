import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sigma, Trash2 } from 'lucide-react';

const CumulativeNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className={`w-48 bg-slate-900/90 backdrop-blur border ${selected ? 'border-orange-500 ring-8 ring-orange-500/5' : 'border-slate-700'} rounded-xl shadow-2xl transition-all`}>
            {/* Custom Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-slate-700 border-2 border-slate-900 rounded-full !left-[-6px]"
            />

            <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-500/10 rounded-lg">
                            <Sigma className="text-orange-400 w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider">Cumulative</span>
                    </div>
                    <button
                        onClick={() => data.onDelete(id)}
                        className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all text-slate-600"
                        title="Delete Node"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-center">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Formula</div>
                    <div className="text-xs font-mono text-slate-300">
                        Σ (i=0 to n-1)
                    </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-[9px]">
                    <span className="text-slate-500 font-medium">Execution</span>
                    <span className="text-amber-500 font-bold uppercase tracking-tighter">Manual</span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 rounded-full shadow-lg !right-[-7px]"
            />
        </div>
    );
};

export default memo(CumulativeNode);
