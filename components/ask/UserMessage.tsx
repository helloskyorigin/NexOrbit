'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface UserMessageProps {
  text: string;
  timestamp: string;
  className?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  text,
  timestamp,
  className,
}) => {
  return (
    <div className={cn('my-6 animate-fadeIn max-w-2xl mx-auto w-full', className)}>
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>User Question</span>
          <span className="font-normal font-mono normal-case">{timestamp}</span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-950 leading-relaxed font-sans">
          {text}
        </p>
      </div>
    </div>
  );
};

