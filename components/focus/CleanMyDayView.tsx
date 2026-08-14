'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Brain,
  Mail,
  Calendar as CalendarIcon,
  HardDrive,
  ChevronDown,
  Info
} from 'lucide-react';
import { ConnectorIcon } from '../connectors/ConnectorIcon';
import { ConnectorId } from '../connectors/types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface FocusTask {
  id: string;
  number: string;
  sourceId: ConnectorId;
  sourceName: string;
  title: string;
  why: string;
  whyDetail: string;
  timeEstimate: string;
  priority: 'high' | 'medium' | 'low';
  section: 'DO FIRST' | 'THEN' | 'LATER' | 'IGNORE';
  isCleared?: boolean;
}

const INITIAL_FOCUS_TASKS: FocusTask[] = [
  {
    id: 'f-1',
    number: '01',
    sourceId: 'gmail',
    sourceName: 'Gmail · Calendar',
    title: 'Resolve Project Alpha deadline',
    why: 'Your client email and calendar contain conflicting dates.',
    whyDetail: 'Your deadline conflict affects tomorrow\'s client meeting. Rahul\'s email expects Friday at 5:00 PM, but the Google Calendar invitation is set for Thursday at 12:00 PM.',
    timeEstimate: '10 min',
    priority: 'high',
    section: 'DO FIRST',
    isCleared: false,
  },
  {
    id: 'f-2',
    number: '02',
    sourceId: 'gmail',
    sourceName: 'Gmail',
    title: 'Reply to Rahul',
    why: 'The conversation is waiting for your response.',
    whyDetail: 'Rahul sent a follow-up inquiry regarding SLA terms that has been pending for more than 4 hours in your inbox.',
    timeEstimate: '5 min',
    priority: 'medium',
    section: 'DO FIRST',
    isCleared: false,
  },
  {
    id: 'f-3',
    number: '03',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Prepare for Project Alpha Sync',
    why: 'Meeting starts at 10:00 AM.',
    whyDetail: 'Review the updated launch document spec "Alpha_Launch_Doc_v2.pdf" uploaded in your Drive folder before alignment.',
    timeEstimate: '15 min',
    priority: 'low',
    section: 'DO FIRST',
    isCleared: false,
  },
  {
    id: 'f-4',
    number: '04',
    sourceId: 'drive',
    sourceName: 'Google Drive',
    title: 'Review proposal spec',
    why: 'Design specifications updated by the product lead.',
    whyDetail: 'Contains 12 new screen mocks and component states requiring approval.',
    timeEstimate: '15 min',
    priority: 'medium',
    section: 'THEN',
    isCleared: false,
  },
  {
    id: 'f-5',
    number: '05',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Schedule follow-up session',
    why: 'SLA discussion needs a separate calendar block.',
    whyDetail: 'Reserve a 15-minute slot to finalize tier-1 SLA responses with Legal.',
    timeEstimate: '5 min',
    priority: 'low',
    section: 'THEN',
    isCleared: false,
  },
  {
    id: 'f-6',
    number: '06',
    sourceId: 'drive',
    sourceName: 'Google Drive',
    title: 'Review Q3 roadmap document',
    why: 'Quarterly objective alignment plan.',
    whyDetail: 'Verify roadmap alignment with the launch goal of Alpha Web Workspace.',
    timeEstimate: '30 min',
    priority: 'low',
    section: 'LATER',
    isCleared: false,
  },
  {
    id: 'f-7',
    number: '07',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Plan next week\'s tasks',
    why: 'Weekly focus organization.',
    whyDetail: 'Organize core delivery buckets for the upcoming dev cycle.',
    timeEstimate: '20 min',
    priority: 'low',
    section: 'LATER',
    isCleared: false,
  },
  {
    id: 'f-8',
    number: '08',
    sourceId: 'gmail',
    sourceName: 'Gmail',
    title: 'Newsletter: AI Weekly Digests',
    why: 'Auto-categorized newsletter digest.',
    whyDetail: 'Weekly reading compilation, safe to review during weekend downtime.',
    timeEstimate: '2 min',
    priority: 'low',
    section: 'IGNORE',
    isCleared: false,
  },
  {
    id: 'f-9',
    number: '09',
    sourceId: 'drive',
    sourceName: 'Google Drive',
    title: 'Invoice Draft copy file',
    why: 'Duplicate system asset upload.',
    whyDetail: 'System detected duplicate asset. No actions needed.',
    timeEstimate: '1 min',
    priority: 'low',
    section: 'IGNORE',
    isCleared: false,
  },
  {
    id: 'f-10',
    number: '10',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Coffee catch-up RSVP',
    why: 'Optional networking invitation.',
    whyDetail: 'RSVP pending. Non-blocking social check-in.',
    timeEstimate: '5 min',
    priority: 'low',
    section: 'IGNORE',
    isCleared: false,
  },
  {
    id: 'f-11',
    number: '11',
    sourceId: 'gmail',
    sourceName: 'Gmail',
    title: 'Status Update: Server migrations',
    why: 'Successful DevOps log digest.',
    whyDetail: 'Standard technical log notification requiring no developer intervention.',
    timeEstimate: '1 min',
    priority: 'low',
    section: 'IGNORE',
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
  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({});
  const [showIgnoreSection, setShowIgnoreSection] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const activeTasks = tasks.filter((t) => !t.isCleared);
  const clearedTasks = tasks.filter((t) => t.isCleared);

  const doFirstTasks = activeTasks.filter((t) => t.section === 'DO FIRST');
  const thenTasks = activeTasks.filter((t) => t.section === 'THEN');
  const laterTasks = activeTasks.filter((t) => t.section === 'LATER');
  const ignoreTasks = activeTasks.filter((t) => t.section === 'IGNORE');

  const handleClearSingleTask = (id: string, title: string) => {
    setCompletingTaskId(id);
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCleared: true } : t))
      );
      setCompletingTaskId(null);
      addToast({
        type: 'success',
        title: 'Task Cleared',
        description: `Successfully prioritized and cleared: "${title}"`,
      });
    }, 400);
  };

  const handleResetTasks = () => {
    setTasks(INITIAL_FOCUS_TASKS);
    setExpandedWhy({});
    setShowIgnoreSection(false);
    addToast({
      type: 'info',
      title: 'Daily Agenda Restored',
      description: 'Reset all priorities back to initial state.',
    });
  };

  const toggleWhy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedWhy((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Timeline events representing the day (Compact, chronological)
  const timelineEvents = [
    { time: '09:00', title: 'Focus Block', type: 'focus' },
    { time: '10:00', title: 'Project Alpha Sync', type: 'sync', active: true },
    { time: '13:30', title: 'Product Review', type: 'review' },
    { time: '16:00', title: 'Planning Slot', type: 'planning' },
  ];

  return (
    <div className={cn("min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24 text-slate-900", className)}>
      <style>{`
        @keyframes orbitTravel {
          0% { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: -240; }
        }
        .animate-orbit {
          animation: orbitTravel 6s linear infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100/80 mb-10">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-950 tracking-tight">Clean My Day</h1>
            <p className="text-sm text-slate-500 font-medium tracking-tight">Let NEXORBIT decide what deserves your attention.</p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto text-xs font-semibold text-slate-500">
            <span className="font-mono bg-white border border-slate-200/50 px-3 py-1.5 rounded-xl shadow-xs text-slate-700">
              Thursday · August 13, 2026
            </span>
            {clearedTasks.length > 0 && (
              <button
                onClick={handleResetTasks}
                className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Reset view
              </button>
            )}
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Core Priorities Workspace */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* AI Summary Hero */}
            <div className="relative py-6 px-8 rounded-2xl bg-white border border-indigo-100/60 shadow-xs overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent opacity-80 pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">
                  Your Day, Simplified
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight leading-tight">
                  You have {activeTasks.length + clearedTasks.length} things today.<br />
                  <span className="text-indigo-600 font-extrabold">Only {activeTasks.filter(t => t.section !== 'IGNORE').length} need your attention.</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                  Based on your calendar, conversations, files, goals and recent activity.
                </p>

                {/* AI Confidence Sources bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-medium">
                  <span>Analyzed across:</span>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> Gmail
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-slate-400" /> Calendar
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3.5 w-3.5 text-slate-400" /> Drive
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-slate-400" /> Notion
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DO FIRST SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pl-1">
                <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Do First
                </h3>
                <span className="text-[10.5px] text-slate-400 font-medium">Top high-leverage steps</span>
              </div>

              {doFirstTasks.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">Your top priorities are cleared!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Excellent alignment. Everything in your main checklist has been completed.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence initial={false}>
                    {doFirstTasks.map((task, idx) => {
                      const isFirst = idx === 0;
                      const isExpanded = !!expandedWhy[task.id];
                      const isCompleting = completingTaskId === task.id;

                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                          layout
                          className={cn(
                            "relative pl-10 pr-5 py-4 rounded-2xl transition-all border border-transparent text-left",
                            isFirst && !isExpanded ? "bg-white border-slate-100 shadow-xs" : "",
                            isExpanded ? "bg-white border-indigo-100/80 shadow-xs" : "hover:bg-slate-50"
                          )}
                        >
                          {/* Left boundary marker indicating ranking signature */}
                          <div className={cn(
                            "absolute left-3.5 top-[23px] flex items-center justify-center z-10"
                          )}>
                            <button
                              onClick={() => handleClearSingleTask(task.id, task.title)}
                              disabled={isCompleting}
                              className="group/btn h-4 w-4 rounded-full border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            >
                              <div className={cn(
                                "h-2 w-2 rounded-full transition-all scale-0 group-hover/btn:scale-100 bg-emerald-500",
                                isCompleting ? "scale-100 bg-emerald-500" : ""
                              )} />
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold text-slate-300 select-none">
                                  {task.number}
                                </span>
                                <h4 className={cn(
                                  "text-[13.5px] font-semibold text-slate-950 tracking-tight leading-snug",
                                  isCompleting ? "line-through text-slate-400" : ""
                                )}>
                                  {task.title}
                                </h4>
                              </div>

                              <p className="text-xs text-slate-600 font-normal leading-relaxed pr-6">
                                {task.why}
                              </p>

                              {/* Core meta line */}
                              <div className="flex items-center gap-3 text-[10.5px] text-slate-400 font-medium pt-0.5">
                                <span className="flex items-center gap-1 shrink-0">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  ~{task.timeEstimate}
                                </span>
                                <span>·</span>
                                <span className="flex items-center gap-1.5">
                                  {task.sourceId === 'gmail' && <Mail className="h-3 w-3" />}
                                  {task.sourceId === 'calendar' && <CalendarIcon className="h-3 w-3" />}
                                  {task.sourceId === 'drive' && <HardDrive className="h-3 w-3" />}
                                  {task.sourceName}
                                </span>
                                <span>·</span>
                                <button
                                  onClick={(e) => toggleWhy(task.id, e)}
                                  className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                                >
                                  {isExpanded ? 'Hide context' : 'Why is this first?'}
                                </button>
                              </div>
                            </div>

                            {/* Actions area */}
                            <div className="shrink-0 flex items-center gap-2 pt-1 self-end sm:self-start">
                              <button
                                onClick={() => handleClearSingleTask(task.id, task.title)}
                                className="text-[11px] font-bold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              >
                                {task.id === 'f-1' ? 'Review conflict' : task.id === 'f-2' ? 'Open conversation' : 'Prepare'}
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded detail box (Progressive disclosure) */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                                  <div className="flex items-start gap-2 bg-indigo-50/30 border border-indigo-100/30 p-3 rounded-xl">
                                    <Brain className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                    <div className="space-y-1">
                                      <span className="font-bold text-indigo-900 block">NEXORBIT insight</span>
                                      <p className="text-slate-700 leading-relaxed font-medium">
                                        {task.whyDetail}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* THEN SECTION */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2 pl-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Then
              </h3>

              {thenTasks.length === 0 ? (
                <p className="text-xs text-slate-400 pl-1 font-medium">No secondary items remaining.</p>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence initial={false}>
                    {thenTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-all text-left"
                      >
                        <div className="space-y-1 flex-1 min-w-0 pr-4">
                          <h4 className="text-[13px] font-semibold text-slate-800 truncate">{task.title}</h4>
                          <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {task.timeEstimate}
                            </span>
                            <span>·</span>
                            <span>{task.why}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleClearSingleTask(task.id, task.title)}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          Clear
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* LATER SECTION */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                Later
              </h3>

              {laterTasks.length === 0 ? (
                <p className="text-xs text-slate-400 pl-1 font-medium">No lower priority items remaining.</p>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence initial={false}>
                    {laterTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-all text-left"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0 pr-4">
                          <h4 className="text-[13px] font-medium text-slate-600 truncate">{task.title}</h4>
                          <span className="text-[10.5px] text-slate-400 font-normal block">{task.why}</span>
                        </div>
                        <button
                          onClick={() => handleClearSingleTask(task.id, task.title)}
                          className="text-[10px] font-semibold text-slate-400 hover:text-slate-800 cursor-pointer shrink-0"
                        >
                          Clear
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* IGNORE FOR NOW SECTION */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowIgnoreSection(!showIgnoreSection)}
                className="flex items-center justify-between w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest pl-1 cursor-pointer"
              >
                <span>{ignoreTasks.length} low-priority notifications can wait</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showIgnoreSection && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showIgnoreSection && ignoreTasks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pl-1 pr-1 pt-2 space-y-1"
                  >
                    {ignoreTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 text-xs text-slate-500"
                      >
                        <div className="flex-1 min-w-0 pr-4 space-y-0.5">
                          <span className="font-semibold text-slate-700 block truncate">{task.title}</span>
                          <span className="text-[10px] text-slate-400 block">{task.why}</span>
                        </div>
                        <button
                          onClick={() => handleClearSingleTask(task.id, task.title)}
                          className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Compact Ask Action wrapper */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100/60 border border-slate-200/40 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Info className="h-4 w-4 text-slate-400" />
                <span>Want to ask something specific about your priorities?</span>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('ask-my-world')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Ask NEXORBIT <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

          </div>

          {/* RIGHT: Calendar Timeline & Recommendation */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Day Timeline */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Day Timeline
              </h3>
              
              <div className="relative pl-4 space-y-6">
                {/* Visual Rail track line */}
                <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-slate-200" />

                {timelineEvents.map((evt) => (
                  <div key={evt.time} className="relative flex gap-4 text-xs">
                    {/* Circle marker node */}
                    <div className={cn(
                      "absolute -left-[16px] top-1.5 h-2 w-2 rounded-full border-2 border-white",
                      evt.active ? "bg-indigo-600 ring-4 ring-indigo-50" : "bg-slate-300"
                    )} />
                    
                    <span className="font-mono text-[11px] text-slate-400 font-bold shrink-0 w-10">
                      {evt.time}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <span className={cn(
                        "font-semibold block truncate",
                        evt.active ? "text-indigo-950 font-bold" : "text-slate-800"
                      )}>
                        {evt.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Box with the premium traveling orbital line */}
            <div className="relative border border-indigo-100/50 bg-indigo-50/20 p-5 rounded-2xl overflow-hidden shadow-xs">
              {/* Thin blue-violet orbital curve */}
              <div className="absolute inset-0 pointer-events-none opacity-60">
                <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                  <path
                    d="M -20,90 Q 160,-10 340,90"
                    fill="none"
                    stroke="url(#orbitGradient)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M -20,90 Q 160,-10 340,90"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeDasharray="15 150"
                    className="animate-orbit"
                  />
                  <defs>
                    <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0" />
                      <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="relative z-10 space-y-3.5 text-xs text-slate-800">
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  NEXORBIT Recommends
                </span>
                
                <p className="font-semibold text-slate-950 leading-relaxed text-[12.5px]">
                  Finish the Project Alpha conflict before your 10:00 meeting.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const alphaTask = tasks.find(t => t.id === 'f-1');
                      if (alphaTask) {
                        setExpandedWhy(prev => ({ ...prev, 'f-1': true }));
                        addToast({
                          type: 'info',
                          title: 'Recommendation Selected',
                          description: 'Expanded Project Alpha deadline conflict details.',
                        });
                      }
                    }}
                    className="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                  >
                    Start <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Empty state when everything has been cleared */}
        {activeTasks.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <svg className="h-12 w-12 text-indigo-400 mx-auto animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(-30 12 12)" strokeLinecap="round" />
            </svg>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-950 tracking-tight">Your day is clear.</h4>
              <p className="text-xs text-slate-500 font-medium">Nothing important needs your attention right now.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
