'use client';

import { MemoryItem } from './types';

export const INITIAL_MOCK_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    text: 'Rahul (Client Lead) prefers succinct summary emails rather than long threaded briefs.',
    category: 'Preference',
    whyItMatters: 'Guarantees Rahul reads and responds to project updates efficiently.',
    timestamp: '2 hours ago',
    source: 'Gmail Thread with Rahul',
    strength: 5,
  },
  {
    id: 'mem-2',
    text: 'Project Alpha final deliverables must be locked by October 15, 2026.',
    category: 'Project',
    whyItMatters: 'Avoids missed milestones and aligns the development runway.',
    timestamp: 'Yesterday',
    source: 'Drive / Project Roadmap PDF',
    strength: 4,
  },
  {
    id: 'mem-3',
    text: 'The client review meetings are always scheduled on Friday mornings.',
    category: 'Work',
    whyItMatters: 'Aligns the workspace prep goals for Thursday afternoon review cycles.',
    timestamp: '3 days ago',
    source: 'Calendar Event Series',
    strength: 5,
  },
  {
    id: 'mem-4',
    text: 'The team uses Slack for ad-hoc blocker discussions and Gmail for formal sign-offs.',
    category: 'Work',
    whyItMatters: 'Ensures proper documentation trails for audits and sign-offs.',
    timestamp: '4 days ago',
    source: 'Workspace Integration Guide',
    strength: 4,
  },
  {
    id: 'mem-5',
    text: 'User prefers dark-mode previews during presentation prep cycles.',
    category: 'Preference',
    whyItMatters: 'Saves user preferences when drafting UI presentation reviews.',
    timestamp: 'Last week',
    source: 'User Settings Flow',
    strength: 3,
  }
];
