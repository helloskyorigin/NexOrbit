'use client';

import React from 'react';
import { Link2, Plus, Sparkles, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export interface EmptyConnectStateProps {
  onConnectGoogle: () => void;
  onExploreApps?: () => void;
  className?: string;
}

export const EmptyConnectState: React.FC<EmptyConnectStateProps> = ({
  onConnectGoogle,
  onExploreApps,
  className,
}) => {
  return (
    <div className={cn('py-12 px-4 max-w-lg mx-auto text-center space-y-6 animate-fadeIn', className)}>
      <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto shadow-2xs text-indigo-600">
        <Globe className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Connect your world
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Start with the apps where your important information lives. NEXORBIT will bring relevant context together.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
        <Button
          variant="primary"
          size="md"
          onClick={onConnectGoogle}
          leftIcon={<Plus className="h-4 w-4" />}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm h-10 px-5 shadow-xs w-full sm:w-auto"
        >
          Connect Google
        </Button>

        {onExploreApps && (
          <Button
            variant="outline"
            size="md"
            onClick={onExploreApps}
            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm h-10 px-5 w-full sm:w-auto"
          >
            Explore apps
          </Button>
        )}
      </div>
    </div>
  );
};
