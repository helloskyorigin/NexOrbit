'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MemoryHeader } from './MemoryHeader';
import { MemoryCategoryTabs, CategoryTabOption } from './MemoryCategoryTabs';
import { MemorySummary } from './MemorySummary';
import { MemoryTimeline } from './MemoryTimeline';
import { MemoryDetailPanel } from './MemoryDetailPanel';
import { EditMemoryModal } from './EditMemoryModal';
import { ForgetMemoryModal } from './ForgetMemoryModal';
import { AddMemoryModal } from './AddMemoryModal';
import { INITIAL_MEMORIES } from './mockData';
import { MemoryItem } from './types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
import {
  subscribeToMemories,
  createMemory,
  updateMemory,
  deleteMemory,
} from '../../services/firestore/memories';
import { Sparkles, Plus, Database } from 'lucide-react';

export const MemoryView: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Primary state
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTabOption>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [memoryToForget, setMemoryToForget] = useState<MemoryItem | null>(null);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  // Subscribe to real-time Firestore memory records
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToMemories(
      user.uid,
      (fetchedMems) => {
        const mapped = fetchedMems.map((m) => ({
          ...m,
          id: m.id || '',
          timestamp: m.timestamp || 'Just now',
          dateGroup: m.dateGroup || 'Earlier this week',
          dotColor: m.dotColor || 'blue',
        })) as MemoryItem[];
        setMemories(mapped);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading memories:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Seed initial high-quality workspace memories
  const handleSeedDemoMemories = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      for (const mem of INITIAL_MEMORIES) {
        const { id, ...cleanMem } = mem;
        await createMemory(user.uid, cleanMem as any);
      }
      addToast({
        title: 'Memory Seeded',
        description: 'Demo memory synapses populated in Firestore.',
        type: 'success',
      });
    } catch (err) {
      console.error('Error seeding memories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter memories list based on category & search term
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      // Category match
      if (activeCategoryTab !== 'All' && m.category !== activeCategoryTab) {
        return false;
      }

      // Search match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const titleMatch = m.title.toLowerCase().includes(query);
        const descMatch = m.description.toLowerCase().includes(query);
        const categoryMatch = m.category.toLowerCase().includes(query);
        const sourceMatch = m.source.name.toLowerCase().includes(query);
        const detailMatch = m.source.detail?.toLowerCase().includes(query);

        return titleMatch || descMatch || categoryMatch || sourceMatch || detailMatch;
      }

      return true;
    });
  }, [memories, activeCategoryTab, searchTerm]);

  // Handlers
  const handleSelectMemory = (memory: MemoryItem) => {
    if (selectedMemory?.id === memory.id) {
      setSelectedMemory(null);
    } else {
      setSelectedMemory(memory);
    }
  };

  const handleEditMemory = (memory: MemoryItem) => {
    setEditingMemory(memory);
  };

  const handleSaveEdit = async (updated: MemoryItem) => {
    try {
      const { id, ...cleanMem } = updated;
      await updateMemory(id, cleanMem as any);
      if (selectedMemory?.id === id) {
        setSelectedMemory(updated);
      }
      setEditingMemory(null);
      addToast({
        title: 'Memory Updated',
        description: `Saved changes for "${updated.title}".`,
        type: 'success',
      });
    } catch (err) {
      console.error('Error updating memory:', err);
    }
  };

  const handleForgetMemory = (memory: MemoryItem) => {
    setMemoryToForget(memory);
  };

  const handleConfirmForget = async (memory: MemoryItem) => {
    try {
      await deleteMemory(memory.id);
      if (selectedMemory?.id === memory.id) {
        setSelectedMemory(null);
      }
      setMemoryToForget(null);
      addToast({
        title: 'Memory Forgotten',
        description: `NexOrbit will no longer use "${memory.title}".`,
        type: 'info',
      });
    } catch (err) {
      console.error('Error deleting memory:', err);
    }
  };

  const handleAddMemorySubmit = async (newMem: MemoryItem) => {
    if (!user?.uid) return;
    try {
      const { id, ...cleanMem } = newMem;
      await createMemory(user.uid, cleanMem as any);
    } catch (err) {
      console.error('Error saving new memory:', err);
    }
  };

  const handleSelectRelated = (relatedIdOrTitle: string) => {
    const found = memories.find(
      (m) => m.id === relatedIdOrTitle || m.title.toLowerCase() === relatedIdOrTitle.toLowerCase()
    );
    if (found) {
      setSelectedMemory(found);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategoryTab('All');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-28 antialiased">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <MemoryHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenFilters={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
            isFiltersActive={searchTerm.length > 0 || activeCategoryTab !== 'All'}
          />

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs hover:shadow-sm transition-all cursor-pointer self-start md:self-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Memory</span>
          </button>
        </div>

        {/* Category Tabs: All | People | Projects | Preferences | Knowledge | Decisions */}
        <MemoryCategoryTabs
          activeTab={activeCategoryTab}
          onSelectTab={setActiveCategoryTab}
        />

        {/* Single-line subtle summary count */}
        <MemorySummary
          totalCount={memories.length}
          filteredCount={filteredMemories.length}
        />

        {/* Dynamic Workspace Layout */}
        {memories.length === 0 && !loading ? (
          /* PREMIUM EMPTY STATE */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-xs space-y-4 max-w-2xl mx-auto flex flex-col items-center justify-center">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-3xs">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Your workspace memory is empty.</h3>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Saved details about people, projects, and preferences will appear here. Anchor key insights, client decisions, or preferences.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Record a Memory</span>
              </button>

              <button
                onClick={handleSeedDemoMemories}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <Database className="h-3.5 w-3.5 text-indigo-600" />
                <span>Seed Demo Memories</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main List Column */}
            <div className={cn(selectedMemory ? 'lg:col-span-7' : 'lg:col-span-12', 'transition-all duration-200')}>
              <MemoryTimeline
                memories={filteredMemories}
                selectedMemory={selectedMemory}
                onSelectMemory={handleSelectMemory}
                onResetFilters={handleResetFilters}
              />
            </div>

            {/* Right Detail Inspector (Dismissible) */}
            {selectedMemory && (
              <div className="lg:col-span-5 sticky top-6">
                <MemoryDetailPanel
                  memory={selectedMemory}
                  onClose={() => setSelectedMemory(null)}
                  onEdit={handleEditMemory}
                  onForget={handleForgetMemory}
                  onSelectRelated={handleSelectRelated}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMemory={handleAddMemorySubmit}
      />

      {/* Edit Memory Modal */}
      <EditMemoryModal
        memory={editingMemory}
        isOpen={!!editingMemory}
        onClose={() => setEditingMemory(null)}
        onSave={handleSaveEdit}
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
