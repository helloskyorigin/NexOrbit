'use client';

import React from 'react';
import { AlertTriangle, Clock, Calendar, Mail, HardDrive, FileText, CheckCircle2 } from 'lucide-react';
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
        'p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-2.5',
        insight.priority === 'high' && 'border-amber-200 bg-amber-50/20',
        insight.priority === 'medium' && 'border-indigo-200 bg-indigo-50/10',
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
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">{insight.title}</h4>
        </div>
        {insight.priority === 'high' && (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            Attention Needed
          </span>
        )}
      </div>

      <p className="text-xs text-slate-700 leading-relaxed pl-4">{insight.content}</p>

      {/* Sources footer badge */}
      {insight.sources && insight.sources.length > 0 && (
        <div className="flex items-center gap-2 pl-4 pt-1 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Sources:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {insight.sources.map((src) => (
              <button
                key={src.id}
                onClick={() => onSelectSource?.(src.id)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200/80 text-[10px] font-medium text-slate-700 transition-colors"
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
