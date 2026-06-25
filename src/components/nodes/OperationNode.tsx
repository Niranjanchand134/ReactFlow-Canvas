import React from 'react';
import { Handle, Position } from 'reactflow';
import { Plus, Minus, X, Percent, Settings, Trash2 } from 'lucide-react';

const operationIcons: Record<string, React.ReactNode> = {
    additionNode: <Plus className="text-orange-400 w-4 h-4" />,
    subtractionNode: <Minus className="text-orange-400 w-4 h-4" />,
    multiplicationNode: <X className="text-orange-400 w-4 h-4" />,
    divisionNode: <Percent className="text-orange-400 w-4 h-4" />,
};

const operationLabels: Record<string, string> = {
    additionNode: 'Addition',
    subtractionNode: 'Subtraction',
    multiplicationNode: 'Multiplication',
    divisionNode: 'Division',
};

export default function OperationNode({ id, type, data, theme }: { id: string, type: string, data: any, theme?: 'light' | 'dark' }) {
    const isError = data.error;
    const isDark = theme !== 'light';

    return (
        <div className={`w-56 ${isDark ? 'bg-slate-900' : 'bg-white'} border-2 ${isError ? 'border-red-500 ring-8 ring-red-500/5' : 'border-indigo-500 ring-8 ring-indigo-500/5'} rounded-xl shadow-2xl p-4`}>
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '50%' }}
                className={`w-5 h-5 rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-110 active:scale-95 !left-[-9px] ${isDark ? 'bg-slate-700 border-2 border-slate-900' : 'bg-white border-2 border-slate-200'}`}
            />

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        {operationIcons[type] || <Plus className="text-orange-400 w-4 h-4" />}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        {operationLabels[type] || 'Operation'}
                    </span>
                </div>
                <button
                    onClick={() => data.onDelete(id)}
                    className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all text-slate-600"
                    title="Delete Node"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className={`${isDark ? 'bg-slate-950/80 rounded-lg p-2 border border-slate-800' : 'bg-white rounded-lg p-2 border border-slate-200'}`}>
                {isError ? (
                    <span className="text-[10px] font-mono text-red-400">{isError}</span>
                ) : (
                    <span className={`text-[10px] font-mono ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>
                        {data.value !== undefined ? `Result: ${data.value}` : 'Waiting for Run...'}
                    </span>
                )}
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
