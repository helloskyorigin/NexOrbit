'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MemoryItem } from './types';
import { useToast } from '../ui/Toast';

export interface ForgetMemoryModalProps {
  memory: MemoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmForget: (memoryId: string) => void;
}

export const ForgetMemoryModal: React.FC<ForgetMemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  onConfirmForget,
}) => {
  const { addToast } = useToast();

  if (!memory) return null;

  const handleForget = () => {
    onConfirmForget(memory.id);
    addToast({
      type: 'info',
      title: 'Memory Forgotten',
      description: 'Removed memory statement from active recall.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Forget this memory?"
      description="NEXORBIT Memory Removal"
      maxWidth="sm"
    >
      <div className="space-y-4 text-xs text-slate-700">
        <p className="leading-relaxed">
          This information will no longer be used by Nexorbit to contextualize your answers or goals.
        </p>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 italic font-medium text-slate-800">
          &quot;{memory.text}&quot;
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleForget}
            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 font-semibold text-xs h-9 px-4"
          >
            Forget
          </Button>
        </div>
      </div>
    </Modal>
  );
};
