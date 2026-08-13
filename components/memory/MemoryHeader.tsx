'use client';

import React from 'react';
import { Plus, BrainCircuit } from 'lucide-react';
import { Button } from '../ui/Button';

interface MemoryHeaderProps {
  onAddMemory: () => void;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({ onAddMemory }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Memory & Synapses
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Manage facts and preferences synthesized by Nexorbit to personalize your workspace reasoning.
        </p>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={onAddMemory}
        leftIcon={<Plus className="h-4 w-4" />}
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-4 font-semibold rounded-xl shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer self-start sm:self-center"
      >
        Add Synapse Memory
      </Button>
    </div>
  );
};
