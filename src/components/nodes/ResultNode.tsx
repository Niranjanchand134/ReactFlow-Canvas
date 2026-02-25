import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from 'reactflow';
import { LogOut, Trash2 } from 'lucide-react';

const controlStyle = {
    background: 'transparent',
    border: 'none',
    zIndex: 1000,
};

function ResizeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#10b981"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', right: 5, bottom: 5 }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="16 20 20 20 20 16" />
            <line x1="14" y1="14" x2="20" y2="20" />
            <polyline points="8 4 4 4 4 8" />
            <line x1="4" y1="4" x2="10" y2="10" />
        </svg>
    );
}

const ResultNode = ({ id, data, selected }: NodeProps) => {
    const hasImage = !!data.image;

    return (
        <div
            className={`group relative p-2 bg-slate-900/90 backdrop-blur border ${hasImage ? 'border-emerald-500 ring-8 ring-emerald-500/5' : 'border-slate-700'} rounded-xl shadow-2xl transition-all h-full w-full`}
        >
            {hasImage && (
                <NodeResizeControl style={controlStyle} minWidth={150} minHeight={100}>
                    <ResizeIcon />
                </NodeResizeControl>
            )}

            {/* Inner Clipped Content */}
            <div className={`absolute inset-0 overflow-hidden rounded-lg flex flex-col pointer-events-none ${!hasImage ? 'relative pointer-events-auto' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-800 shrink-0 pointer-events-auto bg-slate-900/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                            <LogOut className="text-emerald-400 w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-100 uppercase tracking-tight">Result</span>
                    </div>
                    <button
                        onClick={() => data.onDelete(id)}
                        className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all text-slate-600"
                        title="Delete Node"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Content Area */}
                <div className={`flex-1 flex flex-col overflow-hidden min-h-0 pointer-events-auto ${hasImage ? 'p-0' : 'p-4 space-y-4'}`}>
                    <div className={`bg-slate-950 flex-1 flex items-center justify-center overflow-hidden ${!hasImage ? 'p-4 rounded-lg border border-slate-800' : ''}`}>
                        {hasImage ? (
                            <img
                                src={data.image}
                                alt="Result"
                                className="w-full h-full object-contain pointer-events-none"
                            />
                        ) : (
                            <span className="text-2xl font-bold font-mono text-emerald-400 whitespace-nowrap overflow-x-auto w-full text-center scrollbar-hide">
                                {data.value !== undefined ? data.value : '---'}
                            </span>
                        )}
                    </div>
                    {!hasImage && (
                        <div className="flex justify-between items-center text-[10px] shrink-0">
                            <span className="text-slate-500">Execution Status</span>
                            <span className={data.value !== undefined ? "text-emerald-500" : "text-amber-500"}>
                                {data.value !== undefined ? "Success" : "Pending"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-lg !left-[-7px] z-[1001]"
                style={{ top: '50%' }}
            />
        </div>
    );
};

export default memo(ResultNode);
