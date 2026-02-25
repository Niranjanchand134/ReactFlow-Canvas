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
} from 'lucide-react';
import { useDraggable } from '@neodrag/react';

interface SidebarItemProps {
  type: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  key?: React.Key;
}

function SidebarItem({ type, label, sublabel, icon, iconBg, iconColor }: SidebarItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  useDraggable(itemRef, { handle: '.handle' });

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      ref={itemRef}
      className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-lg cursor-grab active:cursor-grabbing transition-all group/node shadow-sm z-10"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-3 pointer-events-none">
        <div className={`p-1.5 ${iconBg} rounded-md`}>
          {React.cloneElement(icon as React.ReactElement, { className: `${iconColor} w-4 h-4` })}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-200">{label}</span>
          {sublabel && <span className="text-[10px] text-slate-500 leading-none">{sublabel}</span>}
        </div>
      </div>
      <div className="handle p-1 hover:bg-slate-800 rounded">
        <GripVertical className="text-slate-700 group-hover/node:text-slate-500 w-4 h-4" />
      </div>
    </div>
  );
}

interface ItemDefinition {
  type: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface CategoryDefinition {
  id: string;
  title: string;
  icon: React.ReactNode;
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

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = SIDEBAR_CATEGORIES.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sublabel && item.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => category.items.length > 0);

  return (
    <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800/50">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
          <input
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 transition-all text-slate-200"
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
              <summary className="flex items-center justify-between p-2 cursor-pointer hover:bg-slate-800/50 rounded-lg transition-colors list-none">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{category.title}</span>
                </div>
                <ChevronDown className="text-slate-500 w-4 h-4 group-open:rotate-180 transition-transform" />
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
                    />
                  ))
                )}
              </div>
            </details>
          ))
        ) : (
          <div className="p-8 text-center">
            <span className="text-xs text-slate-500">No results found for "{searchTerm}"</span>
          </div>
        )}

        {searchTerm === '' && (
          <div className="mt-4 pt-4 border-t border-slate-800/50 px-2">
            <div className="flex items-center gap-2 mb-3">
              <Box className="text-slate-500 w-4 h-4" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Constants</h3>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-1 p-2 bg-slate-900/30 rounded border border-slate-800/50">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Batch_Size</span>
                <span className="text-[11px] text-slate-300 font-mono">128</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-slate-800 bg-slate-900/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-medium text-slate-500">System Ready</span>
        </div>
      </div>
    </aside>
  );
}
