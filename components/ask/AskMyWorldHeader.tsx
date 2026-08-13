'use client';

import React from 'react';
import { Plus, History, PanelRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export interface AskMyWorldHeaderProps {
  onNewConversation: () => void;
  onToggleHistory: () => void;
  onToggleContextPanel: () => void;
  isContextPanelOpen?: boolean;
  activeConversationTitle?: string;
  className?: string;
}

export const AskMyWorldHeader: React.FC<AskMyWorldHeaderProps> = ({
  onNewConversation,
  onToggleHistory,
  onToggleContextPanel,
  isContextPanelOpen = true,
  activeConversationTitle,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3',
        className
      )}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Ask My World
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600/90 bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3 text-indigo-500 fill-indigo-500" />
            <span>Workspace Reasoning</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 font-normal">
          {activeConversationTitle
            ? `Active: ${activeConversationTitle}`
            : 'Ask questions across your connected world.'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleHistory}
          leftIcon={<History className="h-3.5 w-3.5 text-slate-600" />}
          className="text-xs h-7.5 px-2.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          History
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleContextPanel}
          leftIcon={<PanelRight className="h-3.5 w-3.5 text-slate-600" />}
          className={cn(
            'text-xs h-7.5 px-2.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
            isContextPanelOpen && 'border-indigo-300 bg-indigo-50/50 text-indigo-900 font-medium'
          )}
        >
          Context
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onNewConversation}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          className="text-xs h-7.5 px-3 font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-2xs"
        >
          New Chat
        </Button>
      </div>
    </div>
  );
};

