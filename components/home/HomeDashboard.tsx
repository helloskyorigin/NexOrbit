'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Brain,
  CheckCircle2,
  X,
  MessageSquare,
  Calendar as CalendarIcon,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { AICommandInput } from '../ui/AICommandInput';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConnectorId } from '../shell/ConnectorModal';
import { useToast } from '../ui/Toast';

export interface HomeDashboardProps {
  onNavigate: (pageId: string) => void;
  onOpenConnector: (connectorId: ConnectorId) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenConnector,
}) => {
  const { addToast } = useToast();
  const [commandText, setCommandText] = useState('');
  
  // Local state for mock AI responses
  const [aiResponse, setAiResponse] = useState<{
    prompt: string;
    text: string;
    sources: string[];
    timestamp: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Modal States for Focus items
  const [activeModalItem, setActiveModalItem] = useState<{
    id: string;
    title: string;
    description: string;
    type: 'deadline' | 'client' | 'meeting';
  } | null>(null);

  const quickPrompts = [
    'What changed since yesterday?',
    'Do I have any deadline conflicts?',
    'What should I focus on today?',
  ];

  const handleCommandSubmit = (text: string) => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsGenerating(false);
      setAiResponse({
        prompt: text,
        text: `Based on your connected Gmail, Calendar, and Drive memory, here is the synthesis for "${text}":

• Project Alpha deadline is listed as Friday 5:00 PM in your Gmail thread with Rahul, but Google Calendar shows a conflict at 4:30 PM.
• You have 2 unanswered emails from last night regarding product specs.
• Recommended action: Confirm revised timeline with Rahul before today's 10:00 AM sync.`,
        sources: ['Gmail: Thread "Project Alpha Spec Update"', 'Calendar: Event "Project Alpha Sync"', 'Drive: "Alpha_Launch_Doc_v2.pdf"'],
        timestamp: 'Just now',
      });
      addToast({
        type: 'info',
        title: 'NEXORBIT AI Response',
        description: 'Synthesized personal context from connected sources.',
      });
    }, 800);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-6 max-w-5xl mx-auto">
      {/* 1. TOP AREA */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
        <div className="space-y-0.5">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Good morning, Satyam 👋
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Here&apos;s what matters in your world today.
          </p>
        </div>
      </div>

      {/* 2. AI COMMAND HERO */}
      <div className="space-y-2">
        <AICommandInput
          value={commandText}
          onChange={setCommandText}
          onSubmit={handleCommandSubmit}
          placeholder="What do you want to know, solve, or accomplish?"
          suggestedPrompts={quickPrompts}
        />

        {/* Generating Loading State */}
        {isGenerating && (
          <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center gap-3 animate-pulse">
            <Brain className="h-4 w-4 text-indigo-600 animate-bounce" />
            <div className="text-xs font-semibold text-slate-800">
              Synthesizing personal context across Gmail, Calendar &amp; Drive...
            </div>
          </div>
        )}

        {/* AI Response Panel */}
        {aiResponse && !isGenerating && (
          <div className="p-4 rounded-2xl border border-indigo-200 bg-white shadow-xs space-y-3 relative animate-fadeIn">
            <button
              onClick={() => setAiResponse(null)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-xs">
                <Brain className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">NEXORBIT Personal AI Synthesis</h4>
                <p className="text-[10px] text-slate-400">{aiResponse.timestamp}</p>
              </div>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
              {aiResponse.text}
            </div>

            <div className="flex flex-wrap gap-2 pt-0.5">
              {aiResponse.sources.map((src, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-md border border-indigo-100/80 flex items-center gap-1"
                >
                  <CheckCircle2 className="h-3 w-3 text-indigo-600" />
                  {src}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. SUMMARY STRIP */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-6 py-2 px-3 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-600 font-medium shadow-2xs">
        <button
          onClick={() => onNavigate('clean-my-day')}
          className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group cursor-pointer"
        >
          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
          <span className="font-semibold text-slate-900 group-hover:text-indigo-600">2</span>
          <span className="text-slate-500 text-xs">Need attention</span>
        </button>

        <span className="text-slate-300 hidden sm:inline">•</span>

        <button
          onClick={() => onNavigate('what-changed')}
          className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group cursor-pointer"
        >
          <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
          <span className="font-semibold text-slate-900 group-hover:text-indigo-600">3</span>
          <span className="text-slate-500 text-xs">Changed</span>
        </button>

        <span className="text-slate-300 hidden sm:inline">•</span>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />
          <span className="font-semibold text-slate-900">2</span>
          <span className="text-slate-500 text-xs">Upcoming</span>
        </div>

        <span className="text-slate-300 hidden sm:inline">•</span>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-semibold text-slate-900">6</span>
          <span className="text-slate-500 text-xs">Completed</span>
        </div>
      </div>

      {/* 4. MAIN CONTENT (TWO COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start pt-1">
        {/* LEFT COLUMN: TODAY'S FOCUS & CLEAN MY DAY */}
        <div className="space-y-4">
          <div className="space-y-2.5">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                Today&apos;s Focus
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Things that may need your attention.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              {/* Item 1 */}
              <div className="p-3.5 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      Deadline conflict detected
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-4">
                    Project Alpha has different dates across your connected sources.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setActiveModalItem({
                      id: '1',
                      title: 'Deadline conflict detected',
                      description:
                        'Project Alpha deadline is Friday 5:00 PM in Gmail, but Google Calendar has a meeting conflict at 4:30 PM.',
                      type: 'deadline',
                    })
                  }
                  className="text-xs font-medium h-7 px-2.5 shrink-0 bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                >
                  Review
                </Button>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      Client hasn&apos;t replied
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-4">
                    Rahul hasn&apos;t replied to your recent conversation.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setActiveModalItem({
                      id: '2',
                      title: 'Client hasn\'t replied',
                      description:
                        'Last message sent 24 hours ago regarding Phase 1 security sign-off. Click Open to generate follow-up draft.',
                      type: 'client',
                    })
                  }
                  className="text-xs font-medium h-7 px-2.5 shrink-0 bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                >
                  Open
                </Button>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      Meeting tomorrow
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-4">
                    Project Alpha sync at 10:00 AM.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setActiveModalItem({
                      id: '3',
                      title: 'Meeting tomorrow: Project Alpha Sync',
                      description:
                        'Agenda: Q3 Roadmap preview & Alpha spec review with Sarah and Marcus. Click Prepare to synthesize briefing note.',
                      type: 'meeting',
                    })
                  }
                  className="text-xs font-medium h-7 px-2.5 shrink-0 bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                >
                  Prepare
                </Button>
              </div>
            </div>
          </div>

          {/* CLEAN MY DAY SHORTCUT */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/60 via-slate-50/30 to-purple-50/30 border border-indigo-100/80 shadow-2xs flex items-center justify-between gap-3 transition-all duration-200">
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Need a clearer day?</span>
              </h4>
              <p className="text-xs text-slate-500 font-normal">
                See what matters most today.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('clean-my-day')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium h-7.5 px-3.5 shrink-0 rounded-lg shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              ✨ Clean My Day
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: WHAT CHANGED & TODAY'S AGENDA */}
        <div className="space-y-4">
          {/* WHAT CHANGED */}
          <div className="space-y-2.5">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                What changed
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Important updates since your last visit.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-normal">
                <MessageSquare className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                <span><strong className="font-semibold text-slate-900">3</strong> important conversations</span>
              </div>
              <div className="flex items-center gap-2 font-normal">
                <CalendarIcon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span><strong className="font-semibold text-slate-900">1</strong> meeting rescheduled</span>
              </div>
              <div className="flex items-center gap-2 font-normal">
                <FileText className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span><strong className="font-semibold text-slate-900">2</strong> files updated</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onNavigate('what-changed')}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <span>View all changes</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* TODAY'S AGENDA */}
          <div className="space-y-2.5">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                Today&apos;s Agenda
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Scheduled events for today.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between py-0.5 border-b border-slate-100 pb-1.5">
                <span className="font-mono text-slate-400 font-medium text-[11px]">10:00</span>
                <span className="font-semibold text-slate-900">Project Alpha Sync</span>
                <Badge variant="indigo" size="sm" className="text-[10px]">Upcoming</Badge>
              </div>

              <div className="flex items-center justify-between py-0.5 border-b border-slate-100 pb-1.5">
                <span className="font-mono text-slate-400 font-medium text-[11px]">13:30</span>
                <span className="font-semibold text-slate-900">Product Review</span>
                <Badge variant="default" size="sm" className="text-[10px]">Calendar</Badge>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="font-mono text-slate-400 font-medium text-[11px]">16:00</span>
                <span className="font-semibold text-slate-900">Planning</span>
                <Badge variant="default" size="sm" className="text-[10px]">Calendar</Badge>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onOpenConnector('calendar')}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <span>View calendar</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ITEM DETAIL MODAL */}
      <Modal
        isOpen={!!activeModalItem}
        onClose={() => setActiveModalItem(null)}
        title={activeModalItem?.title || 'Action Detail'}
        description="NEXORBIT Personal AI Intelligence"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="sm" onClick={() => setActiveModalItem(null)}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                addToast({
                  type: 'success',
                  title: 'Action Triggered',
                  description: `Processed: ${activeModalItem?.title}`,
                });
                setActiveModalItem(null);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
            >
              Take Action
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-700">
          <p className="leading-relaxed font-medium">{activeModalItem?.description}</p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-600 font-mono text-[11px]">
            Connected Context: Gmail, Calendar, Drive Synced
          </div>
        </div>
      </Modal>
    </div>
  );
};
