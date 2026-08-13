'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { ShieldCheck, Eye, Brain, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PermissionPanelProps {
  connector: ConnectorItem;
  className?: string;
}

export const PermissionPanel: React.FC<PermissionPanelProps> = ({ connector, className }) => {
  const { permissions } = connector;

  return (
    <div className={cn('space-y-4 text-xs text-slate-800', className)}>
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
        <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
          <ConnectorIcon id={connector.id} size="sm" />
        </div>
        <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
          {connector.name} permissions
        </h4>
      </div>

      {/* ACCESS SECTION */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase tracking-wider text-[10px]">
          <Eye className="h-3.5 w-3.5 text-indigo-600" />
          <span>Access</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          {permissions.access.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* USE SECTION */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase tracking-wider text-[10px]">
          <Brain className="h-3.5 w-3.5 text-indigo-600" />
          <span>Use</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          {permissions.use.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CONTROL SECTION */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase tracking-wider text-[10px]">
          <Lock className="h-3.5 w-3.5 text-indigo-600" />
          <span>Control</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          {permissions.control.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
