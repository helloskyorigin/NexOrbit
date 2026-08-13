'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, FileText } from 'lucide-react';
import { InsightCardData, ConnectorType } from './types';
import { cn } from '../../lib/utils';

export interface InsightCardProps {
  insight: InsightCardData;
  onSelectSource?: (sourceId: string) => void;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onSelectSource,
  className,
}) => {
  const getConnectorBadge = (connector: ConnectorType) => {
    switch (connector) {
      case 'gmail':
        return <Mail className="h-3 w-3 text-red-500" />;
      case 'calendar':
        return <Calendar className="h-3 w-3 text-blue-500" />;
      case 'drive':
        return <HardDrive className="h-3 w-3 text-amber-500" />;
      case 'notion':
        return <FileText className="h-3 w-3 text-slate-600" />;
      case 'github':
        return <FileText className="h-3 w-3 text-purple-500" />;
      default:
        return <FileText className="h-3 w-3 text-slate-500" />;
    }
  };

  return (
    <div
      className={cn(
        'py-3 px-3.5 rounded-xl bg-slate-50/60 border border-slate-200/60 hover:bg-white hover:border-slate-200 transition-all space-y-1.5',
        insight.priority === 'high' && 'border-amber-200/80 bg-amber-50/30',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2 w-2 rounded-full shrink-0',
              insight.priority === 'high' && 'bg-amber-500 ring-2 ring-amber-100',
              insight.priority === 'medium' && 'bg-indigo-500',
              insight.priority === 'info' && 'bg-sky-500'
            )}
          />
          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
            {insight.title}
          </h4>
        </div>
        {insight.priority === 'high' && (
          <span className="text-[10px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
            Attention Needed
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed pl-4">{insight.content}</p>

      {/* Sources footer badge */}
      {insight.sources && insight.sources.length > 0 && (
        <div className="flex items-center gap-2 pl-4 pt-1">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Via:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {insight.sources.map((src) => (
              <button
                key={src.id}
                onClick={() => onSelectSource?.(src.id)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200/70 text-[10px] font-normal text-slate-600 transition-colors"
              >
                {getConnectorBadge(src.connector)}
                <span>{src.connectorName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

