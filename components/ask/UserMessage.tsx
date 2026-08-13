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
    <div className={cn('flex justify-end my-2 animate-fadeIn', className)}>
      <div className="max-w-lg space-y-1 text-right">
        <div className="inline-block bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm font-medium shadow-2xs leading-relaxed text-left">
          {text}
        </div>
        <div className="text-[10px] text-slate-400 font-normal pr-1">{timestamp}</div>
      </div>
    </div>
  );
};

