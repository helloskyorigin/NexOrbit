'use client';

import React from 'react';
import { User } from 'lucide-react';
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
    <div className={cn('flex justify-end my-3 animate-fadeIn', className)}>
      <div className="max-w-xl space-y-1 text-right">
        <div className="inline-block bg-slate-900 text-white p-3.5 px-4 rounded-2xl rounded-tr-xs text-xs font-medium shadow-sm leading-relaxed text-left">
          {text}
        </div>
        <div className="text-[10px] text-slate-400 font-medium pr-1">{timestamp}</div>
      </div>
    </div>
  );
};
