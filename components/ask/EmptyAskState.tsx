'use client';

import React from 'react';
import { Brain, Search, GitMerge, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_EMPTY_SUGGESTIONS } from './mockData';
import { cn } from '../../lib/utils';

export interface EmptyAskStateProps {
  onSelectSuggestion: (promptText: string) => void;
  className?: string;
}

export const EmptyAskState: React.FC<EmptyAskStateProps> = ({
  onSelectSuggestion,
  className,
}) => {
  const categoryIcons: Record<string, React.ReactNode> = {
    Understand: <Brain className="h-4 w-4 text-indigo-500" />,
    Find: <Search className="h-4 w-4 text-sky-500" />,
    Connect: <GitMerge className="h-4 w-4 text-amber-500" />,
    Act: <Zap className="h-4 w-4 text-emerald-500" />,
  };

  return (
    <div className={cn('py-8 sm:py-12 px-2 max-w-3xl mx-auto space-y-8 animate-fadeIn', className)}>
      {/* Centered Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-1">
          <Sparkles className="h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
          <span>Ask Anything Across Your Connected World</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          What can I help you understand?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
          Ask about your work, projects, conversations, meetings, files, or goals. NEXORBIT synthesizes context across your apps.
        </p>
      </div>

      {/* Categorized Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_EMPTY_SUGGESTIONS.map((cat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 shrink-0">
                {categoryIcons[cat.category] || <Sparkles className="h-4 w-4 text-indigo-500" />}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {cat.category}
              </h3>
            </div>

            <div className="space-y-1.5">
              {cat.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={() => onSelectSuggestion(item.prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50/80 hover:bg-indigo-50/70 border border-slate-200/60 hover:border-indigo-200 transition-all text-xs text-slate-700 hover:text-indigo-900 font-medium flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{item.text}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
