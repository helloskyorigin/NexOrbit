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
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between border-b border-slate-100 pb-4',
        className
      )}
    >
      <div className="space-y-0.5">
        <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-sans">
          Ask My World
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight">
          Talk to your world.
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onToggleHistory}
          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-0 cursor-pointer"
        >
          History
        </button>

        <button
          onClick={onToggleContextPanel}
          className={cn(
            'px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border-0 cursor-pointer',
            isContextPanelOpen
              ? 'text-indigo-600 bg-indigo-50/50'
              : 'text-slate-500 hover:text-slate-900'
          )}
        >
          Context
        </button>

        <button
          onClick={onNewConversation}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-950 text-indigo-100 hover:bg-indigo-900 transition-all cursor-pointer shadow-sm ml-1"
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

