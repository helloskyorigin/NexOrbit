'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface MemoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  counts: Record<string, number>;
}

export const MemoryFilters: React.FC<MemoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  const categories = [
    { id: 'all', label: 'All Synapses' },
    { id: 'Work', label: 'Work' },
    { id: 'Preference', label: 'Preferences' },
    { id: 'Project', label: 'Projects' },
    { id: 'Personal', label: 'Personal' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {categories.map((cat) => {
        const count = counts[cat.id] || 0;
        const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border',
              isActive
                ? 'bg-indigo-950 text-indigo-100 border-indigo-950 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300'
            )}
          >
            <span>{cat.label}</span>
            <span
              className={cn(
                'text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full',
                isActive
                  ? 'bg-indigo-900 text-indigo-200'
                  : 'bg-slate-100 text-slate-500'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
