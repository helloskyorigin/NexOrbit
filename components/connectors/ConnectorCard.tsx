'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { ConnectorStatus } from './ConnectorStatus';
import { Button } from '../ui/Button';
import { Clock, Layers, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConnectorCardProps {
  connector: ConnectorItem;
  onConnect: (connector: ConnectorItem) => void;
  onManage: (connector: ConnectorItem) => void;
  className?: string;
}

export const ConnectorCard: React.FC<ConnectorCardProps> = ({
  connector,
  onConnect,
  onManage,
  className,
}) => {
  const isConnected = connector.status !== 'not_connected';

  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group',
        isConnected ? 'border-slate-200/90' : 'bg-slate-50/30',
        className
      )}
    >
      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs shrink-0">
              <ConnectorIcon id={connector.id} size="lg" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                {connector.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium block -mt-0.5">
                {connector.category}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <ConnectorStatus status={connector.status} customLabel={connector.statusLabel} />
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {connector.description}
        </p>
      </div>

      {/* Middle Context / Sync metadata */}
      {isConnected ? (
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600 font-medium text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Layers className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>Context available:</span>
            </span>
            <span className="font-extrabold text-slate-900">{connector.contextCount || 'Active'}</span>
          </div>

          {connector.lastSynced && (
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-200/60">
              <span>Last synced</span>
              <span className="flex items-center gap-1 font-sans text-slate-500 font-medium">
                <Clock className="h-3 w-3 text-slate-400" />
                {connector.lastSynced}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-100/60 border border-dashed border-slate-200 text-xs text-slate-500 font-medium">
          Connect {connector.name} to allow NEXORBIT to query relevant workspace context.
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium">
          {isConnected ? 'Permissions configured' : 'Ready to connect'}
        </span>

        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManage(connector)}
            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-800 font-semibold text-xs h-8 px-3.5"
          >
            Manage
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConnect(connector)}
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-8 px-3.5"
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};
