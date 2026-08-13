'use client';

import React, { useState } from 'react';
import { Layers, Folder, User, Mail, Calendar, FileText, ChevronRight, X, Sparkles } from 'lucide-react';
import { CONTEXT_ENTITIES } from './mockData';
import { ContextEntity } from './types';
import { cn } from '../../lib/utils';

export interface ContextPanelProps {
  onClose?: () => void;
  className?: string;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ onClose, className }) => {
  const [expandedEntityId, setExpandedEntityId] = useState<string>('entity-1');

  const getEntityIcon = (type: ContextEntity['type']) => {
    switch (type) {
      case 'project':
        return <Folder className="h-3.5 w-3.5 text-indigo-600" />;
      case 'person':
        return <User className="h-3.5 w-3.5 text-sky-600" />;
      case 'email':
        return <Mail className="h-3.5 w-3.5 text-red-500" />;
      case 'event':
        return <Calendar className="h-3.5 w-3.5 text-blue-500" />;
      case 'doc':
        return <FileText className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div className={cn('p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Context</h3>
            <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
              Synthesized
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-normal">Connected context</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Connected Entities with Subtle Connector Lines */}
      <div className="relative pl-1 space-y-2">
        {/* Subtle Vertical Connector Guide Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-indigo-100/70 rounded-full" />

        {CONTEXT_ENTITIES.map((entity, index) => {
          const isExpanded = expandedEntityId === entity.id;
          return (
            <div
              key={entity.id}
              className={cn(
                'relative z-10 rounded-xl border transition-all duration-150 overflow-hidden text-xs',
                isExpanded
                  ? 'bg-indigo-50/40 border-indigo-200'
                  : 'bg-slate-50/60 border-slate-200/60 hover:bg-white hover:border-slate-300'
              )}
            >
              <button
                onClick={() => setExpandedEntityId(isExpanded ? '' : entity.id)}
                className="w-full text-left p-2.5 flex items-center justify-between gap-2 font-medium text-slate-900"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200/80 shrink-0 shadow-2xs">
                    {getEntityIcon(entity.type)}
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate font-semibold text-slate-900 text-xs">
                      {entity.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal block truncate">
                      {entity.countText}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  className={cn(
                    'h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform',
                    isExpanded && 'rotate-90 text-indigo-600'
                  )}
                />
              </button>

              {isExpanded && (
                <div className="px-2.5 pb-2.5 pt-1 border-t border-indigo-100/80 space-y-1 text-[11px] text-slate-600 animate-fadeIn">
                  {entity.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 pl-6">
                      <span className="h-1 w-1 rounded-full bg-indigo-500 shrink-0" />
                      <span className="truncate">{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

