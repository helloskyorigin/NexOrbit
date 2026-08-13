'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';

export interface PrivacyPanelProps {
  className?: string;
  onManagePermissionsClick?: () => void;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({
  className,
  onManagePermissionsClick,
}) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          'p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs',
          className
        )}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white border border-indigo-100 shrink-0 text-indigo-600 shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight">
              Your data. Your control.
            </h4>
            <p className="text-slate-600 font-medium leading-relaxed max-w-xl">
              NEXORBIT only uses connected information to provide the features you request. You can review permissions or disconnect an app at any time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-semibold text-xs h-8"
          >
            Privacy
          </Button>

          {onManagePermissionsClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onManagePermissionsClick}
              className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-semibold text-xs h-8"
            >
              Manage permissions
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Privacy & Data Control Principles"
        description="How NEXORBIT protects workspace context"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">
            NEXORBIT operates on strict zero-retention principles for unauthorized external sharing. Connected data is indexed exclusively to power your personal AI brain.
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 block">Isolated Workspace Context</span>
              <p className="text-[11px] text-slate-500">
                Your email threads, documents, and calendar events are never mixed with other users or used to train public foundational AI models.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 block">Instant Disconnection</span>
              <p className="text-[11px] text-slate-500">
                When you disconnect an app, NEXORBIT immediately halts further polling and synchronization of new context items.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
