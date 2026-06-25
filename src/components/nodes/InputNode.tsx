import React, { useCallback, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Type, Trash2 } from 'lucide-react';

export default function InputNode({ id, data, theme }: { id: string, data: any, theme?: 'light' | 'dark' }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const onChange = useCallback(() => {
        if (inputRef.current) {
            data.onChange(id, inputRef.current.value);
        }
    }, [id, data]);

    const isDark = theme !== 'light';

    return (
        <div className={`w-56 ${isDark ? 'bg-slate-900/90 border border-slate-700 text-slate-100' : 'bg-white border border-slate-200 text-slate-900'} backdrop-blur rounded-xl shadow-2xl p-4`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                        <Type className="text-blue-400 w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Text Updater</span>
                </div>
                <button
                    onClick={() => data.onDelete(id)}
                    className={`p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all ${isDark ? 'text-slate-600' : 'text-slate-700' } group/del`}
                    title="Delete Node"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                    <label className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Input Value</label>
                    <input
                        type="text"
                        defaultValue={data.value ?? 0}
                        onChange={onChange}
                        ref={inputRef}
                        className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono ${isDark ? 'bg-slate-950 border border-slate-800 text-slate-100' : 'bg-white border border-slate-200 text-slate-900'}`}
                        placeholder="0"
                    />
                </div>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Node Status</span>
                    <span className="text-emerald-500 font-mono">Synced</span>
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
}
