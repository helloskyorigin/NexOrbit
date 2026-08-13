'use client';

import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Circle, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { useToast } from '../ui/Toast';
import { Modal } from '../ui/Modal';

export interface GoalItem {
  id: string;
  title: string;
  category: 'Project' | 'Client' | 'Personal' | 'Work';
  progress: number;
  targetDate: string;
  description: string;
  status: 'active' | 'completed';
}

interface GoalsViewProps {
  onNavigate?: (pageId: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = () => {
  const { addToast } = useToast();
  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: 'goal-1',
      title: 'Finalize Project Alpha deliverables',
      category: 'Project',
      progress: 65,
      targetDate: 'Oct 15, 2026',
      description: 'Ensure all primary engineering items, client presentation docs, and roadmap timelines are strictly locked before the final review.',
      status: 'active',
    },
    {
      id: 'goal-2',
      title: 'Establish weekly Client review loop with Rahul',
      category: 'Client',
      progress: 90,
      targetDate: 'Ongoing',
      description: 'Set up Friday morning recurring presentation cycles and coordinate brief summary emails directly with Rahul to maximize review efficiency.',
      status: 'active',
    },
    {
      id: 'goal-3',
      title: 'Configure Nexorbit contextual memory integrations',
      category: 'Work',
      progress: 40,
      targetDate: 'Oct 1, 2026',
      description: 'Sync Workspace Gmail, Calendar, and Drive files to build a highly optimized local synaptic profile for personal reasoning.',
      status: 'active',
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalItem['category']>('Project');
  const [newProgress, setNewProgress] = useState(0);
  const [newTargetDate, setNewTargetDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      progress: newProgress,
      targetDate: newTargetDate.trim() || 'Ongoing',
      description: newDescription.trim(),
      status: 'active',
    };

    setGoals((prev) => [newGoal, ...prev]);
    setIsAddModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewCategory('Project');
    setNewProgress(0);
    setNewTargetDate('');
    setNewDescription('');

    addToast({
      type: 'success',
      title: 'Goal Established',
      description: 'Added new alignment target to Nexorbit.',
    });
  };

  const handleCompleteGoal = (goalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const isCompleted = g.status === 'completed';
          return {
            ...g,
            status: isCompleted ? 'active' : 'completed',
            progress: isCompleted ? 50 : 100,
          };
        }
        return g;
      })
    );
    addToast({
      type: 'success',
      title: 'Alignment Updated',
      description: 'Synapse goal status synchronized successfully.',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Goals Alignment Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Define objectives and track active contextual alignment parsed from your workspace.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-4 font-semibold rounded-xl shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer self-start sm:self-center"
        >
          Add Alignment Goal
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">
              {goals.filter((g) => g.status === 'active').length} Active
            </div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Alignment Targets
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">
              {goals.filter((g) => g.status === 'completed').length} Complete
            </div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Objectives Resolved
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/30 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">78% Average</div>
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Workspace Sync Level
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => setSelectedGoal(goal)}
            className="group bg-white border border-slate-200/80 hover:border-indigo-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-2xs cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="space-y-2.5">
              {/* Category & Checkbox */}
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/40">
                  {goal.category}
                </span>

                <button
                  onClick={(e) => handleCompleteGoal(goal.id, e)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  title={goal.status === 'completed' ? 'Mark Active' : 'Mark Completed'}
                >
                  {goal.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Circle className="h-5 w-5 hover:text-indigo-500" />
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className={`text-xs sm:text-sm font-semibold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors ${goal.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                  {goal.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                  {goal.description}
                </p>
              </div>
            </div>

            {/* Progress Bar & Target Date */}
            <div className="space-y-2 pt-2 border-t border-slate-100/60">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Target: {goal.targetDate}</span>
                </div>
                <span>{goal.progress}% aligned</span>
              </div>
              <ProgressBar value={goal.progress} className="h-1 bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Goal Details Modal */}
      {selectedGoal && (
        <Modal
          isOpen={!!selectedGoal}
          onClose={() => setSelectedGoal(null)}
          title="Goal Details"
          description="Synthesized Goal Alignment Overview"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                {selectedGoal.category}
              </span>
              <span className="text-slate-400 font-medium">Due: {selectedGoal.targetDate}</span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-950">{selectedGoal.title}</h4>
              <p className="leading-relaxed text-slate-600">{selectedGoal.description}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200/40">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Alignment Progress</span>
                <span>{selectedGoal.progress}% Complete</span>
              </div>
              <ProgressBar value={selectedGoal.progress} className="h-1.5 bg-slate-100" />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="primary" size="sm" onClick={() => setSelectedGoal(null)} className="cursor-pointer bg-indigo-600 text-white font-semibold">
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Alignment Target"
          description="Establish custom long-term objectives for Nexorbit to align suggestions against"
          maxWidth="md"
        >
          <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Goal Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Deliver complete Project Alpha designs on schedule"
                className="w-full px-3 py-2 bg-white text-xs text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as GoalItem['category'])}
                  className="w-full px-3 py-2 bg-white text-xs text-slate-950 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="Project">Project</option>
                  <option value="Client">Client</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              {/* Target Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Target Date
                </label>
                <input
                  type="text"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  placeholder="e.g., Oct 15, 2026 or Ongoing"
                  className="w-full px-3 py-2 bg-white text-xs text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Goal Description
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Briefly describe what this goal entails..."
                rows={3}
                required
                className="w-full p-2.5 bg-white text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newTitle.trim() || !newDescription.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4 cursor-pointer"
              >
                Establish Target
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
