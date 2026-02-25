import React, { useCallback, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Type, Trash2 } from 'lucide-react';

export default function InputNode({ id, data }: { id: string, data: any }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const onChange = useCallback(() => {
        if (inputRef.current) {
            data.onChange(id, inputRef.current.value);
        }
    }, [id, data]);

    return (
        <div className="w-56 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl shadow-2xl p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                        <Type className="text-blue-400 w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-100 uppercase tracking-tight">Text Updater</span>
                </div>
                <button
                    onClick={() => data.onDelete(id)}
                    className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all text-slate-600 group/del"
                    title="Delete Node"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Input Value</label>
                    <input
                        type="text"
                        defaultValue={data.value ?? 0}
                        onChange={onChange}
                        ref={inputRef}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
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
                className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 rounded-full shadow-lg !right-[-7px]"
            />
        </div>
    );
}
