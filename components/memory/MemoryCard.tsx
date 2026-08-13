'use client';

import React from 'react';
import { Mail, Calendar, FileText, Globe, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { MemoryItem } from './types';
import { cn } from '../../lib/utils';

interface MemoryCardProps {
  memory: MemoryItem;
  onSelect: (m: MemoryItem) => void;
  onEdit: (m: MemoryItem, e: React.MouseEvent) => void;
  onForget: (m: MemoryItem, e: React.MouseEvent) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onSelect,
  onEdit,
  onForget,
}) => {
  const getSourceIcon = (source?: string) => {
    if (!source) return <Globe className="h-3.5 w-3.5 text-slate-400" />;
    const srcLower = source.toLowerCase();
    if (srcLower.includes('gmail') || srcLower.includes('mail')) {
      return <Mail className="h-3.5 w-3.5 text-rose-500" />;
    }
    if (srcLower.includes('calendar') || srcLower.includes('event')) {
      return <Calendar className="h-3.5 w-3.5 text-indigo-500" />;
    }
    if (srcLower.includes('drive') || srcLower.includes('pdf') || srcLower.includes('doc')) {
      return <FileText className="h-3.5 w-3.5 text-amber-500" />;
    }
    return <Globe className="h-3.5 w-3.5 text-slate-400" />;
  };

  const strengthStars = Array.from({ length: 5 }, (_, idx) => idx < (memory.strength || 3));

  return (
    <div
      onClick={() => onSelect(memory)}
      className="group relative bg-white border border-slate-200/80 hover:border-indigo-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-2xs cursor-pointer flex flex-col justify-between gap-3"
    >
      <div className="space-y-2">
        {/* Category & Status Indicator */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
              memory.category === 'Preference' && 'bg-indigo-50 text-indigo-700 border border-indigo-100/50',
              memory.category === 'Project' && 'bg-emerald-50 text-emerald-700 border border-emerald-100/50',
              memory.category === 'Work' && 'bg-blue-50 text-blue-700 border border-blue-100/50',
              memory.category === 'Personal' && 'bg-purple-50 text-purple-700 border border-purple-100/50'
            )}
          >
            {memory.category}
          </span>

          <div className="flex items-center gap-1" title="Recall Confidence Level">
            {strengthStars.map((isLit, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  isLit ? 'bg-indigo-600' : 'bg-slate-200'
                )}
              />
            ))}
          </div>
        </div>

        {/* Fact Text */}
        <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed group-hover:text-slate-950">
          &quot;{memory.text}&quot;
        </p>

        {/* "Why it matters" explaining purpose */}
        <div className="pl-2 border-l-2 border-indigo-100 space-y-0.5">
          <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">
            Why It Matters
          </span>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
            {memory.whyItMatters}
          </p>
        </div>
      </div>

      {/* Footer Details & Action controls */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100/60 pt-2.5 mt-1">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium min-w-0">
          <span className="shrink-0">{getSourceIcon(memory.source)}</span>
          <span className="truncate">{memory.source || 'Manual Synapse'}</span>
          <span className="select-none text-slate-200">·</span>
          <span className="shrink-0">{memory.timestamp}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => onEdit(memory, e)}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all cursor-pointer"
            title="Edit Fact"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => onForget(memory, e)}
            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-all cursor-pointer"
            title="Forget Fact"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
