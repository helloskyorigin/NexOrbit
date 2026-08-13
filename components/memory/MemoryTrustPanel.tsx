'use client';

import React from 'react';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export const MemoryTrustPanel: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/40 space-y-2 text-xs relative overflow-hidden">
      {/* Subtle Arc Background Overlay */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full border border-indigo-200/20 pointer-events-none" />

      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
        <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px]">
          Privacy & Trust Guarantee
        </span>
      </div>

      <p className="text-slate-600 leading-relaxed max-w-2xl font-medium">
        Synapses are extracted locally from your active Gmail threads, Calendar events, and Drive documents. 
        Nexorbit utilizes this contextual fabric strictly to tailor summaries and highlight workspace risks. 
        You have complete authority to edit, add, or forget any synapse instantly.
      </p>

      <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 font-normal">
        <div className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Local Contextual Only</span>
        </div>
        <span>·</span>
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3 text-slate-400" />
          <span>No external training data</span>
        </div>
      </div>
    </div>
  );
};
