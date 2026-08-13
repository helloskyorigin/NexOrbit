'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MemoryItem, MemoryCategory } from './types';
import { Plus, BrainCircuit } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (newMemory: MemoryItem) => void;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
}) => {
  const { addToast } = useToast();
  const [text, setText] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('Work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !whyItMatters.trim()) return;

    const newMemory: MemoryItem = {
      id: `mem-${Date.now()}`,
      text: text.trim(),
      category,
      whyItMatters: whyItMatters.trim(),
      timestamp: 'Just now',
      source: 'User Synthesis',
      strength: 5,
    };

    onAddMemory(newMemory);

    // Clear and close
    setText('');
    setWhyItMatters('');
    setCategory('Work');
    
    addToast({
      type: 'success',
      title: 'Synapse Created',
      description: 'The facts are stored for active context recall.',
    });
    
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Synapse Memory"
      description="Record critical facts, preferences, or project rules manually"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Category
          </label>
          <div className="flex gap-2">
            {(['Work', 'Preference', 'Project', 'Personal'] as const).map((cat) => (
              <button
                type="button"
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

        {/* What to remember */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Synapse Fact / Rule
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Client wants standard weekly syncs scheduled on Tuesdays at 2 PM EST."
            rows={3}
            required
            className="w-full p-2.5 bg-white text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Why it matters */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Why It Matters (Reasoning Context)
          </label>
          <textarea
            value={whyItMatters}
            onChange={(e) => setWhyItMatters(e.target.value)}
            placeholder="e.g., Helps prevent meeting conflicts and respects client work hours."
            rows={2}
            required
            className="w-full p-2.5 bg-white text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!text.trim() || !whyItMatters.trim()}
            leftIcon={<BrainCircuit className="h-3.5 w-3.5" />}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4 cursor-pointer"
          >
            Create Synapse
          </Button>
        </div>
      </form>
    </Modal>
  );
};
