import React, { useState, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { SlidersHorizontal, Trash2 } from 'lucide-react';

const filterOptions = [
  { value: 'grayscale', label: 'Grayscale' },
  { value: 'blackWhite', label: 'Black & White' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'invert', label: 'Invert' },
  { value: 'rgb', label: 'RGB Boost' },
  { value: 'red', label: 'Red Tone' },
  { value: 'green', label: 'Green Tone' },
  { value: 'blue', label: 'Blue Tone' },
  { value: 'brightness', label: 'Brightness' },
  { value: 'contrast', label: 'Contrast' },
  { value: 'blur', label: 'Blur' },
] as const;

const FilterNode = ({ id, data, selected, theme }: NodeProps & { theme?: 'light' | 'dark' }) => {
  const isDark = theme !== 'light';
  const [filter, setFilter] = useState<string>(data.filter || 'grayscale');
  const [amount, setAmount] = useState<number>(data.amount ?? 50);

  const updateSettings = (next: { filter?: string; amount?: number }) => {
    if (data.onChange) {
      data.onChange(id, { ...data, ...next });
    }
  };

  return (
    <div className={`group relative ${isDark ? 'bg-slate-900' : 'bg-white'} border-2 ${selected ? (isDark ? 'border-indigo-500 ring-8 ring-indigo-500/5' : 'border-indigo-500 ring-4 ring-indigo-100') : (isDark ? 'border-slate-700' : 'border-slate-200')} rounded-xl shadow-2xl transition-all p-4`}> 
      <div className={`flex items-center justify-between mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        <div className="flex items-center gap-2">
          <div className="p-1 bg-amber-500/10 rounded">
            <SlidersHorizontal className="text-amber-400 w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tight">Filter</span>
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
        <label className="text-[10px] uppercase tracking-wider text-slate-500">Mode</label>
        <select
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
            updateSettings({ filter: event.target.value });
          }}
          className={`w-full rounded-lg py-2 px-3 border ${isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        {(filter === 'blur' || filter === 'brightness' || filter === 'contrast') && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider">
              <span>{filter === 'blur' ? 'Radius' : filter === 'brightness' ? 'Brightness' : 'Contrast'}</span>
              <span>{amount}</span>
            </div>
            <input
              type="range"
              min={filter === 'blur' ? 0 : 0}
              max={filter === 'blur' ? 20 : 200}
              value={amount}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                setAmount(nextValue);
                updateSettings({ amount: nextValue });
              }}
              className="w-full"
            />
          </div>
        )}
        <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Outgoing image is filtered on run</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%' }}
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

export default memo(FilterNode);
