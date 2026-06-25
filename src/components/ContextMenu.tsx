import React, { useCallback } from 'react';
import { Copy, Trash2, Download, X } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    nodeId?: string;
    hasImage?: boolean;
    theme: 'light' | 'dark';
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
    onDownloadImage: (id: string) => void;
    onExport: () => void;
    onClose: () => void;
}

export default function ContextMenu({
    x,
    y,
    nodeId,
    hasImage,
    theme,
    onDuplicate,
    onDelete,
    onDownloadImage,
    onExport,
    onClose,
}: ContextMenuProps) {
    return (
        <div
            style={{ top: y, left: x }}
            className={`fixed z-[100] w-48 backdrop-blur-xl border rounded-xl shadow-2xl py-1 animate-in fade-in zoom-in duration-100 origin-top-left ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white border-slate-200'}`}
            onClick={onClose}
            onContextMenu={(e) => {
                e.preventDefault();
                onClose();
            }}
        >
            <div className={`px-3 py-2 flex items-center justify-between mb-1 ${theme === 'dark' ? 'border-b border-slate-800/50' : 'border-b border-slate-200'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {nodeId ? 'Node Actions' : 'Canvas Actions'}
                </span>
                <button
                    onClick={onClose}
                    className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                    <X size={10} />
                </button>
            </div>

            {nodeId && (
                <>
                    <button
                        onClick={() => onDuplicate(nodeId)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-slate-200 hover:bg-indigo-600 hover:text-white transition-all group"
                    >
                        <Copy size={14} className="text-slate-500 group-hover:text-white" />
                        Duplicate
                    </button>
                    <button
                        onClick={() => onDelete(nodeId)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500 hover:text-white transition-all group"
                    >
                        <Trash2 size={14} className="text-red-500/70 group-hover:text-white" />
                        Delete
                    </button>
                    <div className="h-px bg-slate-800/50 mx-2 my-1"></div>

                    {hasImage && (
                        <button
                            onClick={() => onDownloadImage(nodeId)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all group"
                        >
                            <Download size={14} className="text-emerald-500/70 group-hover:text-white" />
                            Download Image
                        </button>
                    )}
                </>
            )}
            {/* 
            {(!nodeId || !hasImage) && (
                <button
                    onClick={onExport}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-all group"
                >
                    <Download size={14} className="text-slate-500 group-hover:text-white" />
                    Save as JSON
                </button>
            )} */}
        </div>
    );
}
