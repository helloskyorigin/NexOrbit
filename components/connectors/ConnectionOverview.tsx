'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ShieldCheck, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface ConnectionOverviewProps {
  connectors: ConnectorItem[];
  className?: string;
}

export const ConnectionOverview: React.FC<ConnectionOverviewProps> = ({
  connectors,
  className,
}) => {
  const connectedList = connectors.filter((c) => c.status !== 'not_connected');
  const connectedCount = connectedList.length;
  const totalCount = connectors.length;

  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-lg border border-indigo-800/40 relative overflow-hidden',
        className
      )}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Brain Context Synapses
            </span>
            <Badge variant="indigo" size="sm" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
              <Sparkles className="h-3 w-3 mr-1 inline" />
              {connectedCount} of {totalCount} Connected
            </Badge>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Workspace Intelligence Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            NEXORBIT dynamically indexes authorized emails, documents, and calendar events to deliver context-aware answers, daily cleanup, and goal insights.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
          <div className="space-y-0.5 text-right">
            <span className="text-[11px] text-slate-300 font-medium block">Active Health</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All Synced
            </span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-300 font-medium block">Privacy Standard</span>
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              Zero Training
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
