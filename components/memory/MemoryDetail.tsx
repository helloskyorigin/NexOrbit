'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MemoryItem } from './types';
import { Trash2, Save } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface MemoryDetailProps {
  memory: MemoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveEdit: (updated: MemoryItem) => void;
  onRequestForget: (memory: MemoryItem) => void;
}

export const MemoryDetail: React.FC<MemoryDetailProps> = ({
  memory,
  isOpen,
  onClose,
  onSaveEdit,
  onRequestForget,
}) => {
  const { addToast } = useToast();
  const [text, setText] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('Work');

  const [prevMemoryId, setPrevMemoryId] = useState<string | null>(null);

  if (memory && memory.id !== prevMemoryId) {
    setPrevMemoryId(memory.id);
    setText(memory.text);
    setWhyItMatters(memory.whyItMatters);
    setCategory(memory.category);
  }

  if (!memory) return null;

  const handleSave = () => {
    if (!text.trim() || !whyItMatters.trim()) return;

    onSaveEdit({
      ...memory,
      text: text.trim(),
      whyItMatters: whyItMatters.trim(),
      category,
    });

    addToast({
      type: 'success',
      title: 'Synapse Updated',
      description: 'Your changes were saved to active recall successfully.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Synapse"
      description="Refine facts and reasoning contextualizers"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Category selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Category
          </label>
          <div className="flex gap-2">
            {(['Work', 'Preference', 'Project', 'Personal'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  category === cat
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            What Nexorbit Remembers
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="w-full p-2.5 bg-white text-xs text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Why It Matters */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Why It Matters (Reasoning Context)
          </label>
          <textarea
            value={whyItMatters}
            onChange={(e) => setWhyItMatters(e.target.value)}
            rows={2}
            className="w-full p-2.5 bg-white text-xs text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Metadata section */}
        <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1 text-slate-500">
          <div className="flex justify-between">
            <span className="font-semibold">Source connection:</span>
            <span className="font-bold text-slate-700">{memory.source || 'Manual Input'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Captured:</span>
            <span className="font-medium text-slate-600">{memory.timestamp}</span>
          </div>
        </div>

        {/* Action button controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRequestForget(memory)}
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold cursor-pointer text-xs"
          >
            Forget Memory
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="h-3.5 w-3.5" />}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4 cursor-pointer"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
