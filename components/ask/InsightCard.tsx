'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, FileText } from 'lucide-react';
import { InsightCardData, ConnectorType } from './types';
import { cn } from '../../lib/utils';

export interface InsightCardProps {
  insight: InsightCardData;
  index: number;
  onSelectSource?: (sourceId: string) => void;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  index,
  onSelectSource,
  className,
}) => {
  const formattedNumber = String(index + 1).padStart(2, '0');
  const isPrimary = index === 0;

  return (
    <div
      className={cn(
        'py-4 flex flex-col space-y-2.5 transition-all',
        isPrimary && 'bg-slate-50/50 -mx-4 px-4 rounded-xl border border-indigo-100/30 shadow-2xs',
        className
      )}
    >
      {/* Number, Title, & Priority Dot */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-[13px] font-bold text-indigo-600/90 font-mono tracking-tight">
            {formattedNumber}
          </span>
          <span className="text-slate-300 font-light select-none">—</span>
          <h4
            className={cn(
              'text-xs sm:text-sm tracking-tight text-slate-900',
              isPrimary ? 'font-bold text-slate-950 sm:text-[15px]' : 'font-semibold'
            )}
          >
            {insight.title}
          </h4>
        </div>

        {/* Priority Badge Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full shrink-0',
              insight.priority === 'high' && 'bg-rose-500 animate-pulse',
              insight.priority === 'medium' && 'bg-indigo-500',
              insight.priority === 'info' && 'bg-sky-500'
            )}
          />
          <span className="capitalize">{insight.priority} urgency</span>
        </div>
      </div>

      {/* Description Explanation */}
      <p
        className={cn(
          'text-xs leading-relaxed pl-7 text-slate-600',
          isPrimary && 'sm:text-[13.5px] text-slate-700 font-medium'
        )}
      >
        {insight.content}
      </p>

      {/* Sources & Optional Actions Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pl-7 pt-0.5">
        {insight.sources && insight.sources.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-normal">Sources:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {insight.sources.map((src, idx) => (
                <React.Fragment key={src.id}>
                  <button
                    onClick={() => onSelectSource?.(src.id)}
                    className="hover:text-indigo-600 hover:underline transition-colors font-medium cursor-pointer"
                  >
                    {src.connectorName}
                  </button>
                  {idx < insight.sources.length - 1 && (
                    <span className="text-slate-300 select-none">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Quick action helper when relevant */}
        {insight.priority === 'high' && (
          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded">
            Action Recommended
          </span>
        )}
      </div>
    </div>
  );
};


