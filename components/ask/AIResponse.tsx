'use client';

import React, { useState } from 'react';
import { Brain, HelpCircle, ArrowRight, ChevronDown, ChevronUp, Sparkles, Layers } from 'lucide-react';
import { AskResponseData, SourceItem } from './types';
import { InsightCard } from './InsightCard';
import { SourceCard } from './SourceCard';
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
  const [showSourcesList, setShowSourcesList] = useState(false);

  return (
    <div className={cn('my-4 animate-fadeIn space-y-4 relative', className)}>
      {/* NEXORBIT Response Surface with Subtle Orbital Signature */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-indigo-100/90 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.07)] space-y-5 relative overflow-hidden group">
        {/* Subtle Orbital Arc Overlay */}
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full border border-indigo-200/40 pointer-events-none bg-radial from-indigo-50/40 to-transparent" />
        <div className="absolute top-2 right-6 h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366f1] animate-pulse" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7.5 w-7.5 rounded-xl bg-indigo-950 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              <Brain className="h-4 w-4 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                  NEXORBIT Workspace AI
                </h3>
                <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-full border border-indigo-100/60">
                  Cross-App Synthesized
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal">{timestamp}</p>
            </div>
          </div>

          <button
            onClick={() => setIsWhyOpen(true)}
            className="text-[11px] font-normal text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/60 px-2 py-0.5 rounded-md transition-colors shrink-0"
          >
            <HelpCircle className="h-3 w-3 text-indigo-500" />
            <span className="hidden sm:inline">Why am I seeing this?</span>
            <span className="sm:hidden">Why?</span>
          </button>
        </div>

        {/* Dominant AI Answer Statement */}
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-snug">
            {data.summaryText}
          </h2>
        </div>

        {/* Key Findings Vertical List */}
        {data.insights && data.insights.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Key Insights & Reasoning
            </div>
            <div className="space-y-2">
              {data.insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onSelectSource={(sourceId) => {
                    const match = data.sources.find((s) => s.id === sourceId);
                    if (match) onSelectSource(match);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Context Evidence Section */}
        {data.sources && data.sources.length > 0 && (
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Layers className="h-3.5 w-3.5 text-indigo-600" />
                <span>Context Evidence</span>
                <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full ml-1">
                  {data.sources.length} sources active
                </span>
              </div>
              <button
                onClick={() => setShowSourcesList(!showSourcesList)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <span>{showSourcesList ? 'Hide details' : 'View sources'}</span>
                {showSourcesList ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            {showSourcesList && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                {data.sources.map((src) => (
                  <SourceCard key={src.id} source={src} onClick={onSelectSource} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recommended Next Step Banner */}
        {data.recommendedNextStep && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs border border-indigo-900/30">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Recommended next step
              </span>
              <span className="text-xs font-semibold text-white block">
                {data.recommendedNextStep.text}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                onSelectFollowUp(
                  `Action: ${data.recommendedNextStep?.actionLabel || 'Prepare response'}`
                )
              }
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7.5 px-3 font-medium shrink-0 rounded-lg shadow-2xs"
            >
              {data.recommendedNextStep.actionLabel || 'Prepare response'} →
            </Button>
          </div>
        )}
      </div>

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

