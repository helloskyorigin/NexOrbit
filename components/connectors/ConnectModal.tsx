'use client';

import React, { useState } from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Check, ShieldCheck, Info, Sparkles, X } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface ConnectModalProps {
  connector: ConnectorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmConnect: (connectorId: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  connector,
  isOpen,
  onClose,
  onConfirmConnect,
}) => {
  const { addToast } = useToast();
  const [showNextPhaseNotice, setShowNextPhaseNotice] = useState(false);

  if (!connector) return null;

  const handleContinue = () => {
    setShowNextPhaseNotice(true);
  };

  const handleFinishMockConnect = () => {
    onConfirmConnect(connector.id);
    addToast({
      type: 'success',
      title: `${connector.name} Connected`,
      description: `Simulated connection for ${connector.name}. Workspace context is now available.`,
    });
    setShowNextPhaseNotice(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setShowNextPhaseNotice(false);
        onClose();
      }}
      title={`Connect ${connector.name}`}
      description={`Give NEXORBIT permission to use relevant ${connector.name} context.`}
      maxWidth="md"
    >
      {!showNextPhaseNotice ? (
        <div className="space-y-5 text-xs text-slate-800">
          {/* Top Info Header */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
              <ConnectorIcon id={connector.id} size="lg" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{connector.name}</h4>
              <p className="text-slate-600 font-medium leading-relaxed">{connector.description}</p>
            </div>
          </div>

          {/* WHAT NEXORBIT WILL USE */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[11px]">
              What NEXORBIT will use
            </h5>
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100/90 space-y-2">
              {connector.uses.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-emerald-950 font-medium">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT NEXORBIT WON'T DO */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[11px]">
              What NEXORBIT won&apos;t do
            </h5>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              {connector.wonts.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleContinue}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4"
            >
              Continue
            </Button>
          </div>
        </div>
      ) : (
        /* Next Phase Mock State Notice */
        <div className="space-y-5 text-xs text-slate-800 text-center py-2">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <h4 className="font-extrabold text-slate-900 text-base tracking-tight">
              Connection Ready
            </h4>
            <p className="text-slate-600 font-medium leading-relaxed">
              Connector setup will be available in the next build phase.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-900 block">Simulating Connection</span>
            <p>
              Clicking close will mark <strong>{connector.name}</strong> as connected in this UI prototype for testing.
            </p>
          </div>

          <div className="flex justify-center pt-2 border-t border-slate-100">
            <Button
              variant="primary"
              size="sm"
              onClick={handleFinishMockConnect}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-6"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
