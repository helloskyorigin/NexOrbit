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
    <div className={cn('my-6 animate-fadeIn max-w-2xl mx-auto w-full border-b border-slate-100/40 pb-5', className)}>
      <div className="space-y-1.5 pl-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
          User Query
        </span>
        <h1 className="text-[15px] sm:text-[17px] font-medium text-slate-800 tracking-tight leading-relaxed">
          “{text}”
        </h1>
        <div className="text-[10px] text-slate-400 font-normal mt-1 block">{timestamp}</div>
      </div>
    </div>
  );
};

