'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  ChevronDown,
  Mail,
  Calendar as CalendarIcon,
  HardDrive
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SubChange {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  timestamp: string;
}

export interface ChangeItem {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  summary: string;
  timestamp: string;
  timeSection: 'JUST NOW' | 'TODAY' | 'YESTERDAY' | 'EARLIER';
  urgency: 'high' | 'medium' | 'low';
  category: string;
  whyItMatters?: string;
  actionLabel?: string;
  isRead?: boolean;
  subChanges?: SubChange[];
}

const ENHANCED_MOCK_CHANGES: ChangeItem[] = [
  {
    id: 'grp-1',
    sourceId: 'multi',
    sourceName: 'Gmail · Drive',
    title: 'Project Alpha',
    summary: 'Client deadline changed. "Friday" → "Monday". Proposal modified.',
    timestamp: '12 min ago',
    timeSection: 'JUST NOW',
    urgency: 'high',
    category: 'Project Update',
    whyItMatters: 'This conflicts with the date mentioned in the latest project email. Team planning drift detected.',
    actionLabel: 'Review conflict',
    isRead: false,
    subChanges: [
      {
        id: 'chg-1',
        title: 'Deadline Update from Rahul',
        summary: 'Rahul confirmed the revised delivery date for Project Alpha phase 1 specs is Friday at 5:00 PM.',
        sourceName: 'Gmail',
        timestamp: '12 min ago'
      },
      {
        id: 'chg-3',
        title: 'New Doc Shared: "Alpha_Launch_Doc_v2.pdf"',
        summary: 'Design specifications and user journey maps uploaded by Product Lead.',
        sourceName: 'Google Drive',
        timestamp: '2 hours ago'
      }
    ]
  },
  {
    id: 'chg-2',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Schedule Shift: Product Sync',
    summary: 'Moved to 4:30 PM due to conflict.',
    timestamp: '35 min ago',
    timeSection: 'TODAY',
    urgency: 'medium',
    category: 'Calendar Event',
    whyItMatters: 'This overlaps with your scheduled Focus Block.',
    actionLabel: 'Reschedule block',
    isRead: false,
  },
  {
    id: 'chg-4',
    sourceId: 'gmail',
    sourceName: 'Gmail',
    title: 'Client Inquiry regarding SLA terms',
    summary: 'Enterprise client requested clarification on support response times in new contract draft.',
    timestamp: '3 hours ago',
    timeSection: 'TODAY',
    urgency: 'low',
    category: 'Email Thread',
    whyItMatters: 'SLA questions typically require a response within 24 hours.',
    actionLabel: 'Prepare response',
    isRead: true,
  },
  {
    id: 'chg-5',
    sourceId: 'calendar',
    sourceName: 'Google Calendar',
    title: 'Design Review RSVP confirmed',
    summary: '4 out of 5 attendees confirmed attendance for tomorrow morning design review.',
    timestamp: '5 hours ago',
    timeSection: 'EARLIER',
    urgency: 'low',
    category: 'Calendar Event',
    whyItMatters: 'Key decision makers are present for approval.',
    actionLabel: 'See meeting',
    isRead: true,
  },
];

export interface WhatChangedViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const WhatChangedView: React.FC<WhatChangedViewProps> = ({ className }) => {
  const [changes, setChanges] = useState<ChangeItem[]>(ENHANCED_MOCK_CHANGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    // Only toggle if not clicking the action button
    if ((e.target as HTMLElement).closest('button.action-btn')) return;
    
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    // Mark as read when expanded
    setChanges(prev => prev.map(c => c.id === id ? { ...c, isRead: true } : c));
  };

  const filteredChanges = changes.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sections = ['JUST NOW', 'TODAY', 'YESTERDAY', 'EARLIER'] as const;
  
  return (
    <div className={cn("min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24", className)}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">What Changed</h1>
            <p className="text-sm text-slate-500 font-medium tracking-tight">Important updates across your connected world.</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
              <svg className="h-3.5 w-3.5 text-indigo-500 animate-spin shrink-0" style={{ animationDuration: '8s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(-30 12 12)" strokeLinecap="round" />
              </svg>
              NEXORBIT is up to date
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-end">
            <div className="flex items-center p-1 bg-white border border-slate-200/60 rounded-xl shadow-xs text-[11px] font-semibold">
              <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-900 shadow-xs cursor-pointer">Today</button>
              <button className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">7 days</button>
              <button className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">All</button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-colors border border-slate-200/60 shadow-xs text-[11px] font-bold cursor-pointer h-[32px]">
              <Filter className="h-3 w-3" />
              Filter
            </button>
          </div>
        </header>

        {/* Connected World Signal & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 pl-1">
            <div className="flex items-center gap-1">
               <Mail className="h-3 w-3"/>
               <CalendarIcon className="h-3 w-3"/>
               <HardDrive className="h-3 w-3"/>
            </div>
            <span>5 sources · Synced recently</span>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search changes..."
              className="w-full bg-transparent border-b border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors font-medium"
            />
          </div>
        </div>

        {/* Hero Summary */}
        <div className="relative mb-12 py-5 px-6 overflow-hidden rounded-2xl border border-indigo-100/60 bg-indigo-50/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/60 via-transparent to-transparent opacity-80 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                4 meaningful changes since your last visit.
              </h2>
              <p className="text-[13px] font-medium text-slate-600">
                <span className="text-indigo-600 font-bold">1</span> may need your attention.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {filteredChanges.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <svg className="h-10 w-10 text-slate-300 mx-auto animate-spin" style={{ animationDuration: '10s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(-30 12 12)" strokeLinecap="round" />
            </svg>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">Your world is quiet.</h4>
              <p className="text-xs text-slate-500 font-medium">Nothing important changed since your last visit.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline orbital track */}
            <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-indigo-100/80 via-slate-200/60 to-transparent pointer-events-none" />
            
            <div className="space-y-10">
              {sections.map(section => {
                const sectionChanges = filteredChanges.filter(c => c.timeSection === section);
                if (sectionChanges.length === 0) return null;

                return (
                  <div key={section} className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-6 w-6 bg-[#fafafa] flex items-center justify-center shrink-0 z-10 ml-[0px]">
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      </div>
                      <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest">{section}</h3>
                    </div>

                    <div className="space-y-1">
                      {sectionChanges.map((change, idx) => (
                        <ChangeRow 
                          key={change.id} 
                          item={change} 
                          isExpanded={expandedItems[change.id]} 
                          onToggle={(e) => toggleExpand(change.id, e)}
                          staggerDelay={idx * 0.1}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChangeRow = ({ item, isExpanded, onToggle, staggerDelay }: { item: ChangeItem, isExpanded: boolean, onToggle: (e: React.MouseEvent) => void, staggerDelay: number }) => {
  const urgencyColor = item.urgency === 'high' ? 'bg-rose-500' : item.urgency === 'medium' ? 'bg-indigo-500' : 'bg-slate-300';
  const hasDetails = item.whyItMatters || item.subChanges;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: staggerDelay, ease: [0.23, 1, 0.32, 1] }}
      layout
      className={cn(
        "relative pl-[36px] pr-4 py-4 group rounded-2xl transition-colors cursor-pointer text-left w-full border border-transparent",
        isExpanded ? "bg-white shadow-xs border-slate-100" : "hover:bg-slate-50"
      )}
      onClick={onToggle}
    >
      {/* Timeline Node - Orbital Connection Point */}
      <div className="absolute left-[8px] top-[24px] flex items-center justify-center z-10">
         <div className={cn(
           "h-2 w-2 rounded-full ring-4 ring-[#fafafa] transition-all duration-300", 
           urgencyColor,
           !item.isRead && item.urgency === 'high' ? "shadow-[0_0_10px_rgba(244,63,94,0.5)]" : ""
         )} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-1.5">
           <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn(
                "text-[13px] tracking-tight leading-snug font-sans",
                item.urgency === 'high' ? "font-bold text-slate-950" : "font-semibold text-slate-900"
              )}>
                {item.title}
              </h3>
              {item.subChanges && (
                <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-widest">
                  {item.subChanges.length} changes
                </span>
              )}
           </div>
           <p className="text-xs text-slate-600 leading-relaxed pr-4 font-normal">
             {item.summary}
           </p>

           <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1">
                {item.sourceName.toLowerCase().includes('gmail') && <Mail className="h-2.5 w-2.5" />}
                {item.sourceName.toLowerCase().includes('calendar') && <CalendarIcon className="h-2.5 w-2.5" />}
                {item.sourceName.toLowerCase().includes('drive') && <HardDrive className="h-2.5 w-2.5" />}
                {item.sourceName}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-[9.5px]">{item.timestamp}</span>
           </div>
        </div>

        {/* Action Button */}
        <div className={cn(
          "shrink-0 pt-1 transition-all duration-200 flex flex-row sm:flex-col items-center sm:items-end gap-3",
          !isExpanded ? "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0" : "opacity-100"
        )}>
           {item.actionLabel && (
              <button 
                className="action-btn text-[11px] font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100/50 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // Action handling would go here
                }}
              >
                 {item.actionLabel} <ArrowRight className="h-3 w-3" />
              </button>
           )}
           {hasDetails && (
             <ChevronDown className={cn("hidden sm:block h-3.5 w-3.5 text-slate-300 transition-transform duration-300", isExpanded && "rotate-180")} />
           )}
        </div>
      </div>

      {/* Expanded State (Accordion) */}
      <AnimatePresence>
        {isExpanded && hasDetails && (
           <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
             className="overflow-hidden"
           >
              <div className="pt-5 pb-1 space-y-5">
                 {/* WHY IT MATTERS */}
                 {item.whyItMatters && (
                    <div className="pl-3.5 border-l-2 border-indigo-200 bg-indigo-50/40 py-3 pr-4 rounded-r-xl">
                       <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="h-3 w-3" /> Why it matters
                       </span>
                       <p className="text-xs text-slate-800 leading-relaxed font-medium">
                         {item.whyItMatters}
                       </p>
                    </div>
                 )}

                 {/* Grouped sub-items or details */}
                 {item.subChanges && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Related Evidence</span>
                       {item.subChanges.map(sub => (
                          <div key={sub.id} className="flex items-start gap-3 text-xs py-1">
                             <div className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                             <div className="flex-1 min-w-0">
                                <span className="font-semibold text-slate-900 mr-2">{sub.title}</span>
                                <span className="text-slate-500 font-normal leading-relaxed">{sub.summary}</span>
                                <div className="flex items-center gap-1 text-[9.5px] font-medium text-slate-400 mt-1 font-mono">
                                  {sub.sourceName.toLowerCase().includes('gmail') && <Mail className="h-2.5 w-2.5" />}
                                  {sub.sourceName.toLowerCase().includes('calendar') && <CalendarIcon className="h-2.5 w-2.5" />}
                                  {sub.sourceName.toLowerCase().includes('drive') && <HardDrive className="h-2.5 w-2.5" />}
                                  <span>{sub.sourceName}</span>
                                  <span>·</span>
                                  <span>{sub.timestamp}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
