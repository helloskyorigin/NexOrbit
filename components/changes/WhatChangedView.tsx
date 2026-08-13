'use client';

import React, { useState } from 'react';
import {
  History,
  Filter,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Mail,
  Calendar as CalendarIcon,
  HardDrive,
  AlertCircle,
  CheckCircle2,
  Brain,
  ChevronRight,
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

export interface ChangeItem {
  id: string;
  sourceId: ConnectorId;
  sourceName: string;
  title: string;
  summary: string;
  details: string[];
  timestamp: string;
  urgency: 'high' | 'medium' | 'low';
  category: 'Email Thread' | 'Calendar Event' | 'Drive Spec' | 'Team Note';
  isRead?: boolean;
}

const MOCK_CHANGES: ChangeItem[] = [
  {
    id: 'chg-1',
    sourceId: 'gmail',
    sourceName: 'Gmail',
    title: 'Project Alpha Deadline Update from Rahul',
    summary: 'Rahul confirmed the revised delivery date for Project Alpha phase 1 specs is Friday at 5:00 PM.',
    details: [
      'Original deadline was set for Thursday 12:00 PM.',
      'Reason: Waiting on final security audit sign-off.',
      'Impact: Gives engineering team 28 extra hours to refine tests.',
    ],
    timestamp: '12 min ago',
    urgency: 'high',
    category: 'Email Thread',
    isRead: false,
  },
  {
    id: 'chg-2',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Schedule Shift: Product Sync moved to 4:30 PM',
    summary: 'The Product Sync meeting with Sarah and Marcus was shifted 30 minutes later due to conflict.',
    details: [
      'New time block: 4:30 PM - 5:15 PM today.',
      'Google Meet link updated in calendar invitation.',
      'Agenda items: Q3 Roadmap preview & Alpha spec review.',
    ],
    timestamp: '35 min ago',
    urgency: 'medium',
    category: 'Calendar Event',
    isRead: false,
  },
  {
    id: 'chg-3',
    sourceId: 'drive',
    sourceName: 'Google Drive',
    title: 'New Doc Shared: "Alpha_Launch_Doc_v2.pdf"',
    summary: 'Design specifications and user journey maps uploaded by Product Lead.',
    details: [
      'File size: 4.2 MB in Drive folder /Projects/Alpha.',
      'Contains 12 new screen mocks and component states.',
      'Direct relevance to Goal: "Launch Alpha Web Workspace".',
    ],
    timestamp: '2 hours ago',
    urgency: 'medium',
    category: 'Drive Spec',
    isRead: true,
  },
  {
    id: 'chg-4',
    sourceId: 'gmail',
    sourceName: 'Gmail',
    title: 'Client Inquiry regarding SLA terms',
    summary: 'Enterprise client requested clarification on support response times in new contract draft.',
    details: [
      'Sender: Enterprise Account Manager.',
      'Requires legal review or standard SLA documentation response.',
      'Suggested action: Prepare response in Ask My World.',
    ],
    timestamp: '3 hours ago',
    urgency: 'low',
    category: 'Email Thread',
    isRead: true,
  },
  {
    id: 'chg-5',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Design Review RSVP confirmed',
    summary: '4 out of 5 attendees confirmed attendance for tomorrow morning design review.',
    details: [
      'Confirmed: Sarah, Alex, Dev Lead, Rahul.',
      'Pending: Design Ops Lead.',
      'Location: Conference Room B & Video Link.',
    ],
    timestamp: '5 hours ago',
    urgency: 'low',
    category: 'Calendar Event',
    isRead: true,
  },
];

export interface WhatChangedViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const WhatChangedView: React.FC<WhatChangedViewProps> = ({ onNavigate, className }) => {
  const { addToast } = useToast();
  const [changes, setChanges] = useState<ChangeItem[]>(MOCK_CHANGES);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChangeModal, setActiveChangeModal] = useState<ChangeItem | null>(null);

  const filteredChanges = changes.filter((item) => {
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'unread' && !item.isRead) ||
      item.sourceId === selectedFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMarkAsRead = (id: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isRead: true } : c))
    );
  };

  const handleAskBrainAboutChange = (change: ChangeItem) => {
    setActiveChangeModal(null);
    addToast({
      type: 'info',
      title: 'Brain Context Linked',
      description: `Navigating to Ask My World with context: "${change.title}"`,
    });
    if (onNavigate) {
      onNavigate('ask-my-world');
    }
  };

  const unreadCount = changes.filter((c) => !c.isRead).length;

  return (
    <div className={cn('space-y-6 animate-fadeIn pb-12', className)}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <SectionHeader
          title="What Changed"
          subtitle="Chronological synthesis of context updates across your connected workspace."
          badge={
            <Badge variant="indigo" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-100">
              <History className="h-3 w-3 mr-1 text-indigo-600 inline" />
              Live Feed
            </Badge>
          }
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge
            variant={unreadCount > 0 ? 'warning' : 'success'}
            size="md"
            className="font-semibold"
          >
            {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
          </Badge>
        </div>
      </div>

      {/* Top Filter & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        {/* Source Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-xl transition-all',
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            )}
          >
            All updates ({changes.length})
          </button>

          <button
            onClick={() => setSelectedFilter('unread')}
            className={cn(
              'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5',
              selectedFilter === 'unread'
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="h-4 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedFilter('gmail')}
            className={cn(
              'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5',
              selectedFilter === 'gmail'
                ? 'bg-red-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            )}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Gmail</span>
          </button>

          <button
            onClick={() => setSelectedFilter('calendar')}
            className={cn(
              'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5',
              selectedFilter === 'calendar'
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setSelectedFilter('drive')}
            className={cn(
              'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5',
              selectedFilter === 'drive'
                ? 'bg-amber-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            )}
          >
            <HardDrive className="h-3.5 w-3.5" />
            <span>Drive</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search context changes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Changes Timeline List */}
      <div className="space-y-3">
        {filteredChanges.length === 0 ? (
          <div className="py-12 text-center space-y-2 bg-white rounded-2xl border border-slate-200/90 p-6">
            <History className="h-8 w-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No context updates match criteria</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your filter or search terms to explore changes across connected apps.
            </p>
          </div>
        ) : (
          filteredChanges.map((change) => (
            <div
              key={change.id}
              onClick={() => {
                handleMarkAsRead(change.id);
                setActiveChangeModal(change);
              }}
              className={cn(
                'p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-2xs hover:border-indigo-300 hover:shadow-xs relative',
                !change.isRead ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200/90'
              )}
            >
              {!change.isRead && (
                <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              )}

              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs shrink-0 mt-0.5">
                  <ConnectorIcon id={change.sourceId} size="md" />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                      {change.title}
                    </span>

                    <Badge
                      variant={
                        change.urgency === 'high'
                          ? 'danger'
                          : change.urgency === 'medium'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                      className="text-[10px]"
                    >
                      {change.category}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {change.summary}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {change.timestamp}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 font-semibold">{change.sourceName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 h-8"
                >
                  <span>Details</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!activeChangeModal}
        onClose={() => setActiveChangeModal(null)}
        title={activeChangeModal?.title || 'Context Detail'}
        description={`Source: ${activeChangeModal?.sourceName} • ${activeChangeModal?.timestamp}`}
        maxWidth="md"
      >
        {activeChangeModal && (
          <div className="space-y-5 text-xs text-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
              <span className="font-extrabold text-slate-900 text-sm block">Summary</span>
              <p className="text-slate-700 font-medium leading-relaxed">{activeChangeModal.summary}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                Key Observations &amp; Details
              </span>
              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                {activeChangeModal.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-indigo-950 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveChangeModal(null)}
              >
                Close
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAskBrainAboutChange(activeChangeModal)}
                leftIcon={<Brain className="h-3.5 w-3.5" />}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4"
              >
                Ask Brain About This
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
