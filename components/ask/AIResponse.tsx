'use client';

import React, { useState } from 'react';
import { Brain, Sparkles, HelpCircle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { AskResponseData, SourceItem } from './types';
import { InsightCard } from './InsightCard';
import { SourceCard } from './SourceCard';
import { WhyPanel } from './WhyPanel';
import { FollowUpSuggestions } from './FollowUpSuggestions';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
    <div className={cn('my-4 max-w-2xl animate-fadeIn space-y-3', className)}>
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5 relative">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Brain className="h-4.5 w-4.5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                  NEXORBIT Workspace AI
                </h3>
                <Badge variant="indigo" size="sm" className="text-[10px] bg-indigo-50 text-indigo-700">
                  Cross-App Synthesized
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{timestamp}</p>
            </div>
          </div>

          <button
            onClick={() => setIsWhyOpen(true)}
            className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 px-2.5 py-1 rounded-lg transition-colors shrink-0"
          >
            <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
            <span>Why am I seeing this?</span>
          </button>
        </div>

        {/* Main Summary Statement */}
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          {data.summaryText}
        </p>

        {/* Insight Cards List */}
        {data.insights && data.insights.length > 0 && (
          <div className="space-y-3">
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
        )}

        {/* Recommended Next Step Banner */}
        {data.recommendedNextStep && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
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
              className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs h-8 font-semibold shrink-0"
            >
              {data.recommendedNextStep.actionLabel}
            </Button>
          </div>
        )}

        {/* Evidence Sources Toggle Area */}
        {data.sources && data.sources.length > 0 && (
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Context Evidence ({data.sources.length})
              </span>
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
