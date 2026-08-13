'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AskResponseData, SourceItem } from './types';
import { InsightCard } from './InsightCard';
import { FollowUpSuggestions } from './FollowUpSuggestions';
import { cn } from '../../lib/utils';

export interface AIResponseProps {
  data: AskResponseData;
  timestamp: string;
  onSelectFollowUp: (prompt: string) => void;
  onSelectSource: (source: SourceItem) => void;
  className?: string;
}

export const AIResponse: React.FC<AIResponseProps> = ({
  data,
  timestamp,
  onSelectFollowUp,
  onSelectSource,
  className,
}) => {
  const [activeDisclosure, setActiveDisclosure] = useState<'reasoning' | 'sources' | 'why' | null>(null);

  const toggleDisclosure = (type: 'reasoning' | 'sources' | 'why') => {
    setActiveDisclosure((prev) => (prev === type ? null : type));
  };

  return (
    <div className={cn('my-6 space-y-6 relative max-w-2xl mx-auto w-full animate-fadeIn', className)}>
      {/* Subtle Orbital Signature Arc (Minimal, Elegant Brand Detail) */}
      <div className="absolute -left-6 -top-6 -right-6 -bottom-6 rounded-3xl border border-indigo-500/[0.04] pointer-events-none bg-radial from-indigo-500/[0.01] to-transparent">
        <div className="absolute top-1/4 right-0 h-1.5 w-1.5 rounded-full bg-indigo-400/40 shadow-[0_0_6px_#6366f1] animate-pulse" />
      </div>

      {/* Top Header & Identity */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-2 border-b border-slate-100/60">
        <div className="flex items-center gap-2">
          {/* Custom Orbital AI Mark */}
          <svg className="h-4 w-4 text-indigo-600 animate-spin shrink-0" style={{ animationDuration: '6s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(-30 12 12)" strokeLinecap="round" />
          </svg>
          <div>
            <h3 className="text-[11px] font-bold text-slate-900 tracking-tight">
              NEXORBIT AI Brain
            </h3>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-400 font-normal">{timestamp}</span>
      </div>

      {/* Dominant Statement */}
      <div className="relative z-10 space-y-1 pl-1">
        <h2 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight leading-snug">
          {data.summaryText}
        </h2>
      </div>

      {/* Progressive Disclosure Controls (Answer Depth) */}
      <div className="relative z-10 pl-1 flex flex-wrap gap-2 pt-0.5">
        <button
          onClick={() => toggleDisclosure('reasoning')}
          className={cn(
            'px-2.5 py-1 rounded-xl text-[10.5px] font-semibold transition-colors cursor-pointer border',
            activeDisclosure === 'reasoning'
              ? 'bg-slate-900 text-white border-slate-950'
              : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
          )}
        >
          Show reasoning
        </button>
        <button
          onClick={() => toggleDisclosure('sources')}
          className={cn(
            'px-2.5 py-1 rounded-xl text-[10.5px] font-semibold transition-colors cursor-pointer border',
            activeDisclosure === 'sources'
              ? 'bg-slate-900 text-white border-slate-950'
              : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
          )}
        >
          Show sources
        </button>
        <button
          onClick={() => toggleDisclosure('why')}
          className={cn(
            'px-2.5 py-1 rounded-xl text-[10.5px] font-semibold transition-colors cursor-pointer border',
            activeDisclosure === 'why'
              ? 'bg-slate-900 text-white border-slate-950'
              : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
          )}
        >
          Why this matters
        </button>
      </div>

      {/* Progressive Disclosure Content Areas */}
      {activeDisclosure && (
        <div className="relative z-10 pl-1">
          {activeDisclosure === 'reasoning' && (
            <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl animate-fadeIn font-normal">
              I synthesized connected Gmail messages, calendar timelines, and documents matching Project Alpha. Rahul recently requested a Friday spec delivery, but the active scope brief lists Monday, highlighting a core schedule mismatch before the Monday sync.
            </p>
          )}

          {activeDisclosure === 'sources' && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 animate-fadeIn space-y-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Evidence Files
              </span>
              <div className="flex flex-col gap-1.5">
                {data.sources.map((src) => (
                  <button
                    key={src.id}
                    onClick={() => onSelectSource(src)}
                    className="w-full text-left p-2 rounded-lg bg-white border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 transition-colors text-xs font-medium flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="truncate">{src.connectorName}: {src.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0 font-mono">{src.timestamp}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeDisclosure === 'why' && (
            <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl animate-fadeIn font-normal">
              Resolving this prevents client friction or delivery delays. Conflicting dates across active folders leads to team planning drift, making alignment the highest immediate priority.
            </p>
          )}
        </div>
      )}

      {/* Findings - Open Vertical List with Subtle Separators */}
      {data.insights && data.insights.length > 0 && (
        <div className="relative z-10 divide-y divide-slate-100/60 pl-1">
          {data.insights.map((insight, index) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              index={index}
              onSelectSource={(sourceId: string) => {
                const match = data.sources.find((s) => s.id === sourceId);
                if (match) onSelectSource(match);
              }}
            />
          ))}
        </div>
      )}

      {/* Recommended Next Step - Subtle Blue-Violet AI Surface */}
      {data.recommendedNextStep && (
        <div className="relative z-10 p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100/30 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
            <span className="font-semibold text-slate-800">
              Recommended: <span className="text-slate-600 font-normal">{data.recommendedNextStep.text}</span>
            </span>
          </div>
          <button
            onClick={() =>
              onSelectFollowUp(
                data.recommendedNextStep?.actionLabel === 'Prepare response'
                  ? 'Draft a follow-up response email to Rahul regarding the deadline.'
                  : `Execute recommended action: ${data.recommendedNextStep?.text}`
              )
            }
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors shrink-0 flex items-center gap-1 cursor-pointer border-0 bg-transparent"
          >
            <span>{data.recommendedNextStep.actionLabel || 'Prepare response'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Suggested Follow-ups */}
      <FollowUpSuggestions onSelectFollowUp={onSelectFollowUp} />
    </div>
  );
};


