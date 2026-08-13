'use client';

export type MemoryCategory = 'Work' | 'Preference' | 'Project' | 'Personal';

export interface MemoryItem {
  id: string;
  text: string;
  category: MemoryCategory;
  whyItMatters: string;
  timestamp: string;
  source?: string;
  strength?: number; // 1-5 scale of confidence/recall
}
