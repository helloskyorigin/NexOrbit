'use client';

import React, { useState } from 'react';
import { Layers, Folder, User, Mail, Calendar, FileText, ChevronRight, X, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
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
        return <Folder className="h-4 w-4 text-indigo-500" />;
      case 'person':
        return <User className="h-4 w-4 text-sky-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-red-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'doc':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <Layers className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Card
      title="Context Graph"
      description="Connected entities & workspace relationships"
      action={
        <div className="flex items-center gap-1">
          <Badge variant="indigo" size="sm" className="text-[10px]">
            Synthesized
          </Badge>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      }
      className={cn('w-full', className)}
    >
      <div className="space-y-2 mt-2">
        {CONTEXT_ENTITIES.map((entity) => {
          const isExpanded = expandedEntityId === entity.id;
          return (
            <div
              key={entity.id}
              className={cn(
                'rounded-xl border transition-all duration-150 overflow-hidden',
                isExpanded
                  ? 'bg-indigo-50/40 border-indigo-200'
                  : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
              )}
            >
              <button
                onClick={() => setExpandedEntityId(isExpanded ? '' : entity.id)}
                className="w-full text-left p-3 flex items-center justify-between gap-2.5 text-xs font-semibold text-slate-900"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200/90 shrink-0">
                    {getEntityIcon(entity.type)}
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate font-bold text-slate-900">{entity.title}</span>
                    <span className="text-[10px] text-slate-500 font-normal block">
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
                <div className="px-3 pb-3 pt-1 border-t border-indigo-100/80 space-y-1.5 text-[11px] text-slate-600 animate-fadeIn">
                  {entity.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 pl-7">
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
    </Card>
  );
};
