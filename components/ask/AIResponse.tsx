'use client';

import React, { useState } from 'react';
import { Brain, ArrowRight, HelpCircle } from 'lucide-react';
import { AskResponseData, SourceItem } from './types';
import { InsightCard } from './InsightCard';
import { WhyPanel } from './WhyPanel';
import { FollowUpSuggestions } from './FollowUpSuggestions';
import { Button } from '../ui/Button';
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
  const [isWhyOpen, setIsWhyOpen] = useState(false);

  return (
    <div className={cn('my-6 space-y-6 relative max-w-2xl mx-auto w-full animate-fadeIn', className)}>
      {/* Subtle Orbital Signature Arc (Minimal, Elegant Brand Detail) */}
      <div className="absolute -left-6 -top-6 -right-6 -bottom-6 rounded-3xl border border-indigo-500/[0.04] pointer-events-none bg-radial from-indigo-500/[0.01] to-transparent">
        <div className="absolute top-1/4 right-0 h-1.5 w-1.5 rounded-full bg-indigo-400/40 shadow-[0_0_6px_#6366f1] animate-pulse" />
      </div>

      {/* Top Header & Identity */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-2 border-b border-slate-100/60">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-indigo-50/80 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100/40">
            <Brain className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-indigo-900 tracking-tight">
              NEXORBIT Workspace AI
            </h3>
            <p className="text-[10px] text-slate-400 font-normal">{timestamp}</p>
          </div>
        </div>

        <button
          onClick={() => setIsWhyOpen(true)}
          className="text-[10px] font-normal text-slate-400 hover:text-indigo-600 transition-colors"
        >
          Why am I seeing this?
        </button>
      </div>

      {/* Dominant Statement */}
      <div className="relative z-10 space-y-1 pl-1">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
          {data.summaryText}
        </h2>
      </div>

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

      {/* Recommended Next Step - Compact Horizontal Bar */}
      {data.recommendedNextStep && (
        <div className="relative z-10 p-3 sm:p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/40 text-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-none">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block">
              Recommended Next Step
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {data.recommendedNextStep.text}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onSelectFollowUp(
                data.recommendedNextStep?.actionLabel === 'Prepare response'
                  ? 'Draft a follow-up response email to Rahul regarding the deadline.'
                  : `Execute recommended action: ${data.recommendedNextStep?.text}`
              )
            }
            rightIcon={<ArrowRight className="h-3 w-3" />}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100/50 text-[11px] font-semibold h-7 px-2.5 shrink-0 rounded-lg transition-colors"
          >
            {data.recommendedNextStep.actionLabel || 'Prepare response'} →
          </Button>
        </div>
      )}

      {/* Suggested Follow-ups */}
      <FollowUpSuggestions onSelectFollowUp={onSelectFollowUp} />

      {/* Why Explanation Modal */}
      <WhyPanel
        isOpen={isWhyOpen}
        onClose={() => setIsWhyOpen(false)}
        whyExplanation={data.whyExplanation}
        sources={data.sources}
        onSelectSource={onSelectSource}
      />
    </div>
  );
};


