'use client';

import React from 'react';
import { Plus, History, PanelRight, Search, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4',
        className
      )}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Ask My World
          </h1>
          <Badge variant="indigo" size="sm" className="hidden sm:inline-flex bg-indigo-50 text-indigo-700 border-indigo-200">
            <Sparkles className="h-3 w-3 mr-1 text-indigo-500 fill-indigo-500" />
            Workspace Reasoning
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
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
          className="text-xs h-8 bg-white"
        >
          History
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleContextPanel}
          leftIcon={<PanelRight className="h-3.5 w-3.5 text-slate-600" />}
          className={cn(
            'text-xs h-8 bg-white hidden md:inline-flex',
            isContextPanelOpen && 'border-indigo-300 bg-indigo-50/50 text-indigo-900'
          )}
        >
          Context
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onNewConversation}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          className="text-xs h-8 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          New Chat
        </Button>
      </div>
    </div>
  );
};
