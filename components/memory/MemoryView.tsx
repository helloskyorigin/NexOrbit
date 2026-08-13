'use client';

import React, { useState, useMemo } from 'react';
import { MemoryItem, MemoryCategory } from './types';
import { INITIAL_MOCK_MEMORIES } from './mockData';
import { MemoryHeader } from './MemoryHeader';
import { MemoryTrustPanel } from './MemoryTrustPanel';
import { MemoryFilters } from './MemoryFilters';
import { MemorySearch } from './MemorySearch';
import { MemoryCard } from './MemoryCard';
import { MemoryDetail } from './MemoryDetail';
import { AddMemoryModal } from './AddMemoryModal';
import { ForgetMemoryModal } from './ForgetMemoryModal';
import { Cpu } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface MemoryViewProps {
  onNavigate?: (pageId: string) => void;
}

export const MemoryView: React.FC<MemoryViewProps> = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MOCK_MEMORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [memoryToForget, setMemoryToForget] = useState<MemoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Filter memories locally
  const filteredMemories = useMemo(() => {
    return memories.filter((mem) => {
      const matchesCat =
        selectedCategory === 'all' ||
        mem.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchTerm.trim() ||
        mem.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mem.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mem.whyItMatters.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [memories, selectedCategory, searchTerm]);

  // Compute category counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: memories.length };
    memories.forEach((mem) => {
      c[mem.category] = (c[mem.category] || 0) + 1;
    });
    return c;
  }, [memories]);

  const handleAddMemory = (newMem: MemoryItem) => {
    setMemories((prev) => [newMem, ...prev]);
  };

  const handleSaveEdit = (updated: MemoryItem) => {
    setMemories((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    if (selectedMemory?.id === updated.id) {
      setSelectedMemory(updated);
    }
  };

  const handleConfirmForget = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (selectedMemory?.id === id) {
      setSelectedMemory(null);
    }
    setMemoryToForget(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <MemoryHeader onAddMemory={() => setIsAddModalOpen(true)} />

      {/* Trust Message Panel */}
      <MemoryTrustPanel />

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <MemorySearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <MemoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={counts}
        />
      </div>

      {/* Memory Cards Grid */}
      {filteredMemories.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200/90 p-6">
          <Cpu className="h-8 w-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No memories found</h4>
          <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
            Try adjusting your search terms or category filters, or add a new memory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => (
            <MemoryCard
              key={mem.id}
              memory={mem}
              onSelect={(m) => setSelectedMemory(m)}
              onEdit={(m, e) => {
                e.stopPropagation();
                setSelectedMemory(m);
              }}
              onForget={(m, e) => {
                e.stopPropagation();
                setMemoryToForget(m);
              }}
            />
          ))}
        </div>
      )}

      {/* Memory Detail Modal */}
      <MemoryDetail
        memory={selectedMemory}
        isOpen={!!selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onSaveEdit={handleSaveEdit}
        onRequestForget={(m) => {
          setSelectedMemory(null);
          setMemoryToForget(m);
        }}
      />

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMemory={handleAddMemory}
      />

      {/* Forget Memory Confirmation Modal */}
      <ForgetMemoryModal
        memory={memoryToForget}
        isOpen={!!memoryToForget}
        onClose={() => setMemoryToForget(null)}
        onConfirmForget={handleConfirmForget}
      />
    </div>
  );
};
