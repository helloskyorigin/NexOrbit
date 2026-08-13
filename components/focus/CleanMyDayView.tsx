'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Brain,
  Mail,
  Calendar,
  HardDrive,
  Trash2,
} from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { ConnectorIcon } from '../connectors/ConnectorIcon';
import { ConnectorId } from '../connectors/types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface FocusTask {
  id: string;
  sourceId: ConnectorId;
  sourceName: string;
  title: string;
  description: string;
  suggestedAction: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
  isCleared?: boolean;
}

const INITIAL_FOCUS_TASKS: FocusTask[] = [
  {
    id: 'f-1',
    sourceId: 'gmail',
    sourceName: 'Gmail',
    title: 'Confirm Project Alpha Deadline with Rahul',
    description: 'Email thread received requesting delivery window confirmation for Friday 5:00 PM.',
    suggestedAction: 'Send 1-line reply accepting Friday 5:00 PM revised target.',
    priority: 'high',
    timeEstimate: '2 mins',
    isCleared: false,
  },
  {
    id: 'f-2',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Accept Product Sync 4:30 PM Reschedule',
    description: 'Meeting invitation moved 30 minutes later to resolve attendee conflict.',
    suggestedAction: 'Accept updated invitation and review agenda.',
    priority: 'medium',
    timeEstimate: '1 min',
    isCleared: false,
  },
  {
    id: 'f-3',
    sourceId: 'drive',
    sourceName: 'Google Drive',
    title: 'Review "Alpha_Launch_Doc_v2.pdf"',
    description: 'New design spec uploaded by product lead containing 12 new screen mocks.',
    suggestedAction: 'Scan section 3 for Goal alignment requirements.',
    priority: 'medium',
    timeEstimate: '5 mins',
    isCleared: false,
  },
  {
    id: 'f-4',
    sourceId: 'gmail',
    sourceName: 'Gmail',
    title: 'Draft SLA Clarification Response',
    description: 'Enterprise account manager asked for clarification on tier 1 support SLAs.',
    suggestedAction: 'Synthesize standard SLA terms via Ask My World.',
    priority: 'low',
    timeEstimate: '4 mins',
    isCleared: false,
  },
];

export interface CleanMyDayViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const CleanMyDayView: React.FC<CleanMyDayViewProps> = ({ onNavigate, className }) => {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<FocusTask[]>(INITIAL_FOCUS_TASKS);
  const [isCleaning, setIsCleaning] = useState(false);
  const [selectedTaskModal, setSelectedTaskModal] = useState<FocusTask | null>(null);

  const activeTasks = tasks.filter((t) => !t.isCleared);
  const clearedTasks = tasks.filter((t) => t.isCleared);

  const handleRunAutoClean = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setIsCleaning(false);
      // Automatically clear low priority tasks for demo
      setTasks((prev) =>
        prev.map((t) => (t.priority === 'low' ? { ...t, isCleared: true } : t))
      );
      addToast({
        type: 'success',
        title: 'Day Cleaned & Optimized',
        description: 'Auto-resolved 1 low-priority item and organized top 3 priorities.',
      });
    }, 1200);
  };

  const handleClearSingleTask = (id: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCleared: true } : t))
    );
    setSelectedTaskModal(null);
    addToast({
      type: 'success',
      title: 'Item Cleared',
      description: `Cleared: "${title}" from today's focus agenda.`,
    });
  };

  const handleResetTasks = () => {
    setTasks(INITIAL_FOCUS_TASKS);
    addToast({
      type: 'info',
      title: 'Agenda Reset',
      description: 'Restored all daily focus items.',
    });
  };

  return (
    <div className={cn('space-y-6 animate-fadeIn pb-12', className)}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <SectionHeader
          title="Clean My Day"
          subtitle="Your daily focus, task clearing, and schedule optimization assistant."
          badge={
            <Badge variant="indigo" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-100">
              <CheckSquare className="h-3 w-3 mr-1 text-indigo-600 inline" />
              Daily Focus
            </Badge>
          }
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {clearedTasks.length > 0 && (
            <button
              onClick={handleResetTasks}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline mr-2"
            >
              Reset view
            </button>
          )}

          <Badge variant="success" size="md" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 inline" />
            {clearedTasks.length} Cleared Today
          </Badge>
        </div>
      </div>

      {/* Main Auto-Clean Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 fill-indigo-400" />
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                AI Workspace Cleaner
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              NEXORBIT scans connected Gmail, Calendar, and Drive context to identify noise, suggest resolution steps, and organize your core priorities.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleRunAutoClean}
              disabled={isCleaning}
              leftIcon={
                isCleaning ? (
                  <RefreshCw className="h-4 w-4 text-indigo-200 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-indigo-200" />
                )
              }
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm h-11 px-6 shadow-md border-indigo-500/50"
            >
              {isCleaning ? 'Cleaning Day Context...' : 'Clean My Day Now'}
            </Button>
          </div>
        </div>
      </div>

      {/* Active Focus Tasks Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Pending Focus Priorities</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {activeTasks.length}
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Sorted by priority &amp; workspace urgency
          </span>
        </div>

        {activeTasks.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200/90 p-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <h4 className="text-base font-extrabold text-slate-900">Your day is clean &amp; focused!</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All pending tasks and meeting conflicts have been resolved or cleared.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0">
                        <ConnectorIcon id={task.sourceId} size="md" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {task.sourceName}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                          {task.title}
                        </h4>
                      </div>
                    </div>

                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'danger'
                          : task.priority === 'medium'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                    >
                      {task.priority} priority
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {task.description}
                  </p>

                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/90 text-xs text-indigo-950 font-medium flex items-start gap-2">
                    <Brain className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Suggested:</strong> {task.suggestedAction}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Takes ~{task.timeEstimate}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClearSingleTask(task.id, task.title)}
                      className="bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 font-semibold text-xs h-8 px-3"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cleared Items Archive */}
      {clearedTasks.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Cleared Today ({clearedTasks.length})
          </h4>
          <div className="space-y-2">
            {clearedTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs text-slate-500"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="line-through font-medium text-slate-600">{task.title}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Cleared</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
