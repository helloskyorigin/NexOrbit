'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Brain,
  Bell,
  CheckCircle2,
  Lock,
  HardDrive,
  Trash2,
  Sliders,
} from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface SettingsViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate, className }) => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'brain' | 'notifications'>('brain');

  // Toggle states
  const [autoIndexEmail, setAutoIndexEmail] = useState(true);
  const [autoIndexCalendar, setAutoIndexCalendar] = useState(true);
  const [autoIndexDrive, setAutoIndexDrive] = useState(true);
  const [allowMemoryRecall, setAllowMemoryRecall] = useState(true);
  const [dailyDigestNotifications, setDailyDigestNotifications] = useState(true);
  const [conflictAlerts, setConflictAlerts] = useState(true);

  const handleSaveSettings = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      description: 'Your workspace preferences have been updated.',
    });
  };

  return (
    <div className={cn('space-y-6 animate-fadeIn pb-12', className)}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <SectionHeader
          title="Settings"
          subtitle="Configure account preferences, workspace privacy, and brain context index."
          badge={
            <Badge variant="indigo" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-100">
              <SettingsIcon className="h-3 w-3 mr-1 text-indigo-600 inline" />
              Workspace Config
            </Badge>
          }
        />

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveSettings}
          leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4 self-start sm:self-auto"
        >
          Save Preferences
        </Button>
      </div>

      {/* Settings Tab Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl border border-slate-200 text-xs font-medium w-full sm:w-auto overflow-x-auto">
        <button
          onClick={() => setActiveTab('brain')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0',
            activeTab === 'brain'
              ? 'bg-white text-slate-900 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Brain className="h-3.5 w-3.5 text-indigo-600" />
          <span>AI Brain &amp; Index</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0',
            activeTab === 'privacy'
              ? 'bg-white text-slate-900 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Shield className="h-3.5 w-3.5 text-emerald-600" />
          <span>Privacy &amp; Security</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0',
            activeTab === 'notifications'
              ? 'bg-white text-slate-900 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Bell className="h-3.5 w-3.5 text-amber-600" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0',
            activeTab === 'profile'
              ? 'bg-white text-slate-900 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <User className="h-3.5 w-3.5 text-slate-600" />
          <span>Account Profile</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'brain' && (
        <div className="space-y-4">
          <Card title="Context Indexing Controls">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">Gmail Auto-Indexing</span>
                  <span className="text-slate-500 text-[11px]">Allow NEXORBIT to index relevant email threads.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoIndexEmail}
                  onChange={(e) => setAutoIndexEmail(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">Google Calendar Conflict Monitoring</span>
                  <span className="text-slate-500 text-[11px]">Track upcoming events for scheduling conflicts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoIndexCalendar}
                  onChange={(e) => setAutoIndexCalendar(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">Google Drive Document Parsing</span>
                  <span className="text-slate-500 text-[11px]">Extract key project specifications for Ask My World.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoIndexDrive}
                  onChange={(e) => setAutoIndexDrive(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-bold text-slate-900 block">Active Memory Statement Recall</span>
                  <span className="text-slate-500 text-[11px]">Incorporate user preferences into AI answers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowMemoryRecall}
                  onChange={(e) => setAllowMemoryRecall(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-4">
          <Card title="Data Privacy & Retention">
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100/90 text-emerald-950 font-medium">
                <span className="font-bold block text-sm">Isolated Vector Storage</span>
                <p className="text-[11px] text-emerald-900 mt-0.5">
                  Your indexed workspace data is stored in isolated tenant spaces and is never used to train public models.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-900 block">Data Deletion Options</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: 'Memory Index Cleared',
                      description: 'Reset local index embeddings for testing.',
                    });
                  }}
                  leftIcon={<Trash2 className="h-3.5 w-3.5 text-red-500" />}
                  className="text-red-700 bg-red-50 hover:bg-red-100 border-red-200 text-xs font-semibold h-8"
                >
                  Clear Vector Memory Embeddings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Card title="Notification Preferences">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">Daily Focus Digest</span>
                  <span className="text-slate-500 text-[11px]">Receive morning briefing on key tasks.</span>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigestNotifications}
                  onChange={(e) => setDailyDigestNotifications(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-bold text-slate-900 block">Deadline Conflict Alerts</span>
                  <span className="text-slate-500 text-[11px]">Instant notifications when meetings conflict with deadlines.</span>
                </div>
                <input
                  type="checkbox"
                  checked={conflictAlerts}
                  onChange={(e) => setConflictAlerts(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-4">
          <Card title="Account Profile">
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg">
                  S
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Satyam Origin</h4>
                  <p className="text-slate-500 text-xs font-mono">hello.skyorigin@gmail.com</p>
                  <Badge variant="indigo" size="sm" className="mt-1">
                    NEXORBIT Pro Plan
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
