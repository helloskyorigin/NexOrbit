'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { CheckCircle2, Circle } from 'lucide-react';
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
  const availableList = connectors.filter((c) => c.status === 'not_connected');

  const total = connectors.length;
  const connectedCount = connectedList.length;

  return (
    <div
      className={cn(
        'p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4',
        className
      )}
    >
      {/* Left Stat Counter */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center font-extrabold text-sm shrink-0 shadow-2xs">
          {connectedCount}/{total}
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            {connectedCount} of {total} connected
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Connected tools continuously provide context to your Brain.
          </p>
        </div>
      </div>

      {/* Right Connector Chips */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {/* Connected section */}
        {connectedList.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Connected:
            </span>
            <div className="flex items-center gap-1.5">
              {connectedList.map((conn) => (
                <div
                  key={conn.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-100 text-emerald-950 font-medium text-[11px]"
                >
                  <ConnectorIcon id={conn.id} size="sm" />
                  <span className="font-semibold">{conn.name}</span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 ml-0.5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available section */}
        {availableList.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Available:
            </span>
            <div className="flex items-center gap-1.5">
              {availableList.map((conn) => (
                <div
                  key={conn.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600 font-medium text-[11px]"
                >
                  <ConnectorIcon id={conn.id} size="sm" />
                  <span>{conn.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
