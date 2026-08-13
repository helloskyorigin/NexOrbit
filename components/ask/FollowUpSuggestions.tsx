'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FollowUpSuggestionsProps {
  onSelectFollowUp: (prompt: string) => void;
  className?: string;
}

export const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  onSelectFollowUp,
  className,
}) => {
  const suggestions = [
    { label: 'Show me the sources', prompt: 'Show me the exact source details for this answer.' },
    { label: "What's the biggest risk?", prompt: 'What is the biggest potential risk identified here?' },
    { label: 'Summarize this', prompt: 'Give me a 2-sentence summary of these insights.' },
  ];

  return (
    <div className={cn('pt-1 space-y-1.5', className)}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
        Suggested follow-ups
      </span>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectFollowUp(item.prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200/60 hover:border-indigo-200 text-xs font-medium text-slate-700 transition-all flex items-center gap-1.5 group"
          >
            <Sparkles className="h-3 w-3 text-indigo-500 shrink-0" />
            <span>{item.label}</span>
            <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

