import React, { useState, useRef, memo } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl } from 'reactflow';
import { Image as ImageIcon, Upload, Trash2 } from 'lucide-react';

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
            stroke="#3b82f6"
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

const ImageNode = ({ id, data, selected }: NodeProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(data.image || null);

    const onUploadClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
                if (data.onChange) {
                    data.onChange(id, base64String);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`group relative bg-slate-900 border-2 ${selected ? 'border-indigo-500 ring-8 ring-indigo-500/5' : 'border-slate-700'} rounded-xl shadow-2xl transition-all h-full w-full`}>
            {/* Custom Resizer - Only shown when image is present */}
            {preview && (
                <NodeResizeControl style={controlStyle} minWidth={150} minHeight={100}>
                    <ResizeIcon />
                </NodeResizeControl>
            )}

            {/* Clipped Inner Content */}
            <div className="absolute inset-0 overflow-hidden rounded-lg flex flex-col pointer-events-none">
                {/* Header */}
                <div className="flex items-center justify-between p-2 bg-slate-900/50 border-b border-slate-800 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-indigo-500/10 rounded">
                            <ImageIcon className="text-indigo-400 w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-100 uppercase tracking-tight">Image</span>
                    </div>
                    <button
                        onClick={() => data.onDelete(id)}
                        className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all text-slate-600"
                        title="Delete Node"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 relative flex items-center justify-center bg-slate-950/50 min-h-0 pointer-events-auto">
                    {preview ? (
                        <div className="w-full h-full p-2 flex items-center justify-center">
                            <img
                                src={preview}
                                alt="Uploaded"
                                className="max-w-full max-h-full object-contain pointer-events-none"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 p-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">No image uploaded</p>
                        </div>
                    )}

                    {/* Hover Upload Overlay */}
                    <div className={`absolute inset-0 bg-slate-900/60 flex items-center justify-center transition-opacity duration-200 ${preview ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                        <button
                            onClick={onUploadClick}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-semibold transition-all shadow-lg active:scale-95"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            {preview ? 'Change Image' : 'Upload Image'}
                        </button>
                    </div>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Handle outside the clipping container */}
            <Handle
                type="source"
                position={Position.Right}
                className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 rounded-full shadow-lg !right-[-7px] z-[1001]"
                style={{ top: '50%' }}
            />
        </div>
    );
};

export default memo(ImageNode);
