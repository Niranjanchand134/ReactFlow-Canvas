import React, { useRef, useState } from 'react';
import {
  Search,
  Database,
  ChevronDown,
  LogIn,
  LogOut,
  Calculator,
  Plus,
  Minus,
  X,
  Percent,
  Box,
  GripVertical,
  Image,
  Sigma,
  SlidersHorizontal,
  Layers,
  Download,
} from 'lucide-react';
import { useDraggable } from '@neodrag/react';

interface SidebarItemProps {
  type: string;
  label: string;
  sublabel?: string;
  icon: React.ReactElement;
  iconBg: string;
  iconColor: string;
  key?: React.Key;
  theme?: 'light' | 'dark';
}

function SidebarItem({ type, label, sublabel, icon, iconBg, iconColor, theme }: SidebarItemProps & { theme: 'light' | 'dark' }) {
  const itemRef = useRef<HTMLDivElement>(null);
  useDraggable(itemRef as React.RefObject<HTMLElement>, { handle: '.handle' });

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      ref={itemRef}
      className={`flex items-center justify-between p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all group/node shadow-sm z-10 ${theme === 'dark' ? 'bg-slate-900 border border-slate-800 hover:border-indigo-500/50' : 'bg-white border border-slate-200 hover:border-indigo-300'}`}
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-3 pointer-events-none">
        <div className={`p-1.5 ${iconBg} rounded-md`}>
          {React.cloneElement(icon as React.ReactElement<any, any>, ({ className: `${iconColor} w-4 h-4` } as any))}
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{label}</span>
          {sublabel && <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} leading-none`}>{sublabel}</span>}
        </div>
      </div>
      <div className={`handle p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
        <GripVertical className={`${theme === 'dark' ? 'text-slate-700 group-hover/node:text-slate-500' : 'text-slate-500 group-hover/node:text-slate-700'} w-4 h-4`} />
      </div>
    </div>
  );
}

interface ItemDefinition {
  type: string;
  label: string;
  sublabel?: string;
  icon: React.ReactElement;
  iconBg: string;
  iconColor: string;
}

interface CategoryDefinition {
  id: string;
  title: string;
  icon: React.ReactElement;
  isGrid?: boolean;
  items: ItemDefinition[];
}

const SIDEBAR_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'data',
    title: 'Data Operations',
    icon: <Database className="text-blue-400 w-4 h-4" />,
    items: [
      {
        type: 'textUpdater',
        label: 'Input',
        sublabel: 'Number value',
        icon: <LogIn />,
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
      },
      {
        type: 'resultNode',
        label: 'Result',
        sublabel: 'Display output',
        icon: <LogOut />,
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400',
      },
      {
        type: 'imageNode',
        label: 'Image',
        sublabel: 'Upload media',
        icon: <Image />,
        iconBg: 'bg-indigo-500/10',
        iconColor: 'text-indigo-400',
      }
    ]
  },
  {
    id: 'image',
    title: 'Image Pipeline',
    icon: <Image className="text-indigo-400 w-4 h-4" />,
    items: [
      {
        type: 'filterNode',
        label: 'Filter',
        sublabel: 'Apply color, blur, and tone',
        icon: <SlidersHorizontal />,
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-400',
      },
      {
        type: 'compositeNode',
        label: 'Composite',
        sublabel: 'Blend two images',
        icon: <Layers />,
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400',
      }
    ]
  },
  {
    id: 'math',
    title: 'Mathematical Functions',
    icon: <Calculator className="text-amber-400 w-4 h-4" />,
    isGrid: true,
    items: [
      {
        type: 'additionNode',
        label: 'Addition',
        icon: <Plus />,
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
      },
      {
        type: 'subtractionNode',
        label: 'Subtraction',
        icon: <Minus />,
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
      },
      {
        type: 'multiplicationNode',
        label: 'Multiplication',
        icon: <X />,
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
      },
      {
        type: 'divisionNode',
        label: 'Division',
        icon: <Percent />,
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
      },
      {
        type: 'cumulativeNode',
        label: 'Cumulative',
        icon: <Sigma />,
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
      }
    ]
  }
];

export default function Sidebar({ theme }: { theme: 'light' | 'dark' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = SIDEBAR_CATEGORIES.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sublabel && item.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => category.items.length > 0);

  return (
    <aside className={`w-80 flex flex-col shrink-0 ${theme === 'dark' ? 'bg-slate-950 border-r border-slate-800' : 'bg-white border-r border-slate-200'}`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-200'}`}>
        <div className="relative group">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${theme === 'dark' ? 'text-slate-500 group-focus-within:text-indigo-500' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
          <input
            className={`w-full rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none placeholder:text-slate-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-white border border-slate-200 text-slate-900'}`}
            placeholder="Search functions..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scroll">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <details key={category.id} className="group" open>
              <summary className={`flex items-center justify-between p-2 cursor-pointer rounded-lg transition-colors list-none ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center gap-2">
                  {React.cloneElement(category.icon as React.ReactElement<any, any>, ({ className: `${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'} w-4 h-4` } as any))}
                  <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{category.title}</span>
                </div>
                <ChevronDown className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'} w-4 h-4 group-open:rotate-180 transition-transform`} />
              </summary>
              <div className="pt-2 pb-4 px-1 space-y-2">
                {category.isGrid ? (
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((item) => (
                      <SidebarItem
                        key={item.type}
                        type={item.type}
                        label={item.label}
                        sublabel={item.sublabel}
                        icon={item.icon}
                        iconBg={item.iconBg}
                        iconColor={item.iconColor}
                        theme={theme}
                      />
                    ))}
                  </div>
                ) : (
                  category.items.map((item) => (
                    <SidebarItem
                      key={item.type}
                      type={item.type}
                      label={item.label}
                      sublabel={item.sublabel}
                      icon={item.icon}
                      iconBg={item.iconBg}
                      iconColor={item.iconColor}
                      theme={theme}
                    />
                  ))
                )}
              </div>
            </details>
          ))
        ) : (
          <div className="p-8 text-center">
            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>No results found for "{searchTerm}"</span>
          </div>
        )}

        {searchTerm === '' && (
          <div className={`mt-4 pt-4 border-t px-2 ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Box className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} w-4 h-4`} />
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>Global Constants</h3>
            </div>
            <div className="space-y-2">
              <div className={`flex flex-col gap-1 p-2 rounded border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800/50' : 'bg-white/90 border-slate-200'}`}>
                <span className={`text-[10px] font-mono uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>Batch_Size</span>
                <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>128</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white/90'}`}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-700'}`}>System Ready</span>
        </div>
      </div>
    </aside>
  );
}
