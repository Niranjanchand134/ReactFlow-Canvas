import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sigma, Trash2 } from 'lucide-react';

const CumulativeNode = ({ id, data, selected, theme }: NodeProps & { theme?: 'light' | 'dark' }) => {
    const isDark = theme !== 'light';
    return (
        <div className={`w-48 ${isDark ? 'bg-slate-900/90 backdrop-blur border' : 'bg-white border'} ${selected ? (isDark ? 'border-orange-500 ring-8 ring-orange-500/5' : 'border-orange-400 ring-4 ring-orange-100') : (isDark ? 'border-slate-700' : 'border-slate-200')} rounded-xl shadow-2xl transition-all`}>
            {/* Custom Handles */}
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '50%' }}
                className={`w-10 h-10 rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-110 active:scale-95 !left-[-9px] ${isDark ? 'bg-slate-700 border-2 border-slate-900' : 'bg-white border-2 border-slate-200'}`}
            />

            <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'} rounded-lg`}>
                            <Sigma className="text-orange-400 w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Cumulative</span>
                    </div>
                    <button
                        onClick={() => data.onDelete(id)}
                        className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all text-slate-600"
                        title="Delete Node"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className={`${isDark ? 'bg-slate-950/50 border border-slate-800' : 'bg-white/90 border border-slate-200'} rounded-lg p-3 text-center`}>
                    <div className={`text-[10px] uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Formula</div>
                    <div className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Σ (i=0 to n-1)
                    </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-[9px]">
                    <span className={`${isDark ? 'text-slate-500' : 'text-slate-600'} font-medium`}>Execution</span>
                    <span className="text-amber-500 font-bold uppercase tracking-tighter">Manual</span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '50%' }}
                className={`w-5 h-5 rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-110 active:scale-95 !right-[-9px] ${isDark ? 'bg-slate-700 border-2 border-slate-900' : 'bg-white border-2 border-slate-200'}`}
            />
        </div>
    );
};

export default memo(CumulativeNode);
