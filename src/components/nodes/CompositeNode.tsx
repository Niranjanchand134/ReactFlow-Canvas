import React, { useState, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Layers, Trash2 } from 'lucide-react';

const blendModes = [
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
] as const;

const CompositeNode = ({ id, data, selected, theme }: NodeProps & { theme?: 'light' | 'dark' }) => {
  const isDark = theme !== 'light';
  const [blend, setBlend] = useState<string>(data.blend || 'multiply');

  const updateSettings = (next: { blend?: string }) => {
    if (data.onChange) {
      data.onChange(id, { ...data, ...next });
    }
  };

  return (
    <div className={`group relative ${isDark ? 'bg-slate-900' : 'bg-white'} border-2 ${selected ? (isDark ? 'border-indigo-500 ring-8 ring-indigo-500/5' : 'border-indigo-500 ring-4 ring-indigo-100') : (isDark ? 'border-slate-700' : 'border-slate-200')} rounded-xl shadow-2xl transition-all p-4`}> 
      <div className={`flex items-center justify-between mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        <div className="flex items-center gap-2">
          <div className="p-1 bg-emerald-500/10 rounded">
            <Layers className="text-emerald-400 w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tight">Composite</span>
        </div>
        <button
          onClick={() => data.onDelete(id)}
          className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all text-slate-600"
          title="Delete Node"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className={`space-y-3 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
        <label className="text-[10px] uppercase tracking-wider text-slate-500">Blend Mode</label>
        <select
          value={blend}
          onChange={(event) => {
            setBlend(event.target.value);
            updateSettings({ blend: event.target.value });
          }}
          className={`w-full rounded-lg py-2 px-3 border ${isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}
        >
          {blendModes.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Blends top image over bottom image on run.</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="bottom"
        style={{ top: '30%' }}
        className={`w-5 h-5 rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-110 active:scale-95 !left-[-9px] ${isDark ? 'bg-white/10 border-2 border-slate-800' : 'bg-slate-100 border-2 border-slate-200'}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="top"
        style={{ top: '70%' }}
        className={`w-5 h-5 rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-110 active:scale-95 !left-[-9px] ${isDark ? 'bg-white/10 border-2 border-slate-800' : 'bg-slate-100 border-2 border-slate-200'}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '50%' }}
        className={`w-5 h-5 rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-110 active:scale-95 !right-[-9px] ${isDark ? 'bg-slate-700 border-2 border-slate-900' : 'bg-white border-2 border-slate-200'}`}
      />
    </div>
  );
};

export default memo(CompositeNode);
