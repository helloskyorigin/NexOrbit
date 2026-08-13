'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Brain,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  X,
  Bot,
  Layers,
  Search,
} from 'lucide-react';
import { AICommandInput } from '../ui/AICommandInput';
import { SummaryCards } from './SummaryCards';
import { TodayFocus, FocusItem } from './TodayFocus';
import { CleanMyDayCard } from './CleanMyDayCard';
import { RightRail } from './RightRail';
import { RecentConversations, ConversationItem } from './RecentConversations';
import { GoalsPreview } from './GoalsPreview';
import { ConnectedAppsSummary } from './ConnectedAppsSummary';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GlassSurface } from '../ui/Surfaces';
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
  const [selectedTask, setSelectedTask] = useState('ASK_MY_WORLD');
  
  // Local state for mock AI responses
  const [aiResponse, setAiResponse] = useState<{
    prompt: string;
    text: string;
    sources: string[];
    timestamp: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Focus Item Modal state
  const [selectedFocusItem, setSelectedFocusItem] = useState<FocusItem | null>(null);

  // Conversation Detail Modal state
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);

  const quickPrompts = [
    'What changed since yesterday?',
    'Do I have any deadline conflicts?',
    'What should I focus on today?',
    'Prepare my next meeting.',
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
        description: 'Synthesized personal context from 3 connected apps.',
      });
    }, 800);
  };

  const handleSelectQuickPrompt = (promptText: string) => {
    setCommandText(promptText);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 1. HOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            Good morning, Satyam 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Here&apos;s what matters in your world today.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="indigo" size="md" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            AI Brain Synced
          </Badge>
        </div>
      </div>

      {/* 2. HERO AI COMMAND AREA */}
      <div className="space-y-3">
        <AICommandInput
          value={commandText}
          onChange={setCommandText}
          onSubmit={handleCommandSubmit}
          selectedTask={selectedTask}
          onTaskChange={setSelectedTask}
          placeholder="What do you want to know, solve, or accomplish?"
        />

        {/* Quick Prompts Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Suggestions:
          </span>
          {quickPrompts.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuickPrompt(promptText)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-900 text-xs font-medium text-slate-600 transition-all duration-150 shadow-xs"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Generating Loading State */}
        {isGenerating && (
          <GlassSurface className="p-5 rounded-2xl border border-indigo-200 flex items-center gap-3 animate-pulse">
            <Bot className="h-5 w-5 text-indigo-600 animate-bounce" />
            <div className="text-xs font-semibold text-slate-800">
              Synthesizing personal context across Gmail, Calendar &amp; Drive...
            </div>
          </GlassSurface>
        )}

        {/* Mock AI Response Panel */}
        {aiResponse && !isGenerating && (
          <GlassSurface className="p-6 rounded-2xl border border-indigo-200 bg-white shadow-sm space-y-4 relative animate-fadeIn">
            <button
              onClick={() => setAiResponse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-xs">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">NEXORBIT Personal AI Synthesis</h4>
                <p className="text-[10px] text-slate-400">{aiResponse.timestamp}</p>
              </div>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {aiResponse.text}
            </div>

            {/* Source Citations */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Context Sources Used
              </span>
              <div className="flex flex-wrap gap-2">
                {aiResponse.sources.map((src, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3 w-3 text-indigo-600" />
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </GlassSurface>
        )}
      </div>

      {/* 3. SUMMARY ROW */}
      <SummaryCards onCardClick={(type) => onNavigate('what-changed')} />

      {/* 4. MAIN LAYOUT GRID (2 COLUMNS ON DESKTOP, RIGHT RAIL IN SECOND COLUMN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / PRIMARY COLUMN (2 SPANS ON DESKTOP) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Focus */}
          <TodayFocus onItemAction={(item) => setSelectedFocusItem(item)} />

          {/* Clean My Day Feature Card */}
          <CleanMyDayCard />

          {/* Recent Conversations */}
          <RecentConversations
            onSelectConversation={(item) => setSelectedConversation(item)}
          />

          {/* Goals Preview */}
          <GoalsPreview onNavigate={onNavigate} />

          {/* Connected Apps Summary */}
          <ConnectedAppsSummary onOpenConnector={onOpenConnector} />
        </div>

        {/* RIGHT INFORMATION RAIL (1 SPAN ON DESKTOP) */}
        <div className="lg:col-span-1">
          <RightRail
            onSelectPrompt={handleSelectQuickPrompt}
            onNavigate={onNavigate}
            onOpenConnector={onOpenConnector}
          />
        </div>
      </div>

      {/* FOCUS ITEM ACTION MODAL */}
      <Modal
        isOpen={!!selectedFocusItem}
        onClose={() => setSelectedFocusItem(null)}
        title={selectedFocusItem?.title || 'Focus Item Details'}
        description="NEXORBIT Context & Action Options"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" size="sm" onClick={() => setSelectedFocusItem(null)}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                addToast({
                  type: 'success',
                  title: 'Action Executed',
                  description: `Resolved: ${selectedFocusItem?.title}`,
                });
                setSelectedFocusItem(null);
              }}
            >
              Confirm Resolution
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">{selectedFocusItem?.description}</p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-semibold text-slate-900 block">Synthesized Recommendation</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              NEXORBIT detected a timing gap between your Google Calendar invitation and Gmail thread comments. Aligning these will prevent participant confusion during today&apos;s sync.
            </p>
          </div>
        </div>
      </Modal>

      {/* CONVERSATION DETAIL MODAL */}
      <Modal
        isOpen={!!selectedConversation}
        onClose={() => setSelectedConversation(null)}
        title={selectedConversation?.title || 'Conversation History'}
        description={`Saved query from ${selectedConversation?.timestamp}`}
        maxWidth="md"
        footer={
          <Button variant="primary" size="sm" onClick={() => setSelectedConversation(null)}>
            Close History
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">AI Context Summary</span>
            <p className="text-slate-600 leading-relaxed">{selectedConversation?.summary}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
