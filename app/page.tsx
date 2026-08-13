'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Layers,
  Shield,
  Activity,
  Cpu,
  Brain,
  Link2,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Sliders,
  Bell,
  RefreshCw,
  Search,
  Code2,
  Palette,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { AICommandInput } from '@/components/ui/AICommandInput';
import { Card } from '@/components/ui/Card';
import { GlassSurface, SoftSurface } from '@/components/ui/Surfaces';
import { Badge } from '@/components/ui/Badge';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { Tooltip } from '@/components/ui/Tooltip';
import { Dropdown } from '@/components/ui/Dropdown';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { Tabs } from '@/components/ui/Tabs';
import { Toggle } from '@/components/ui/Toggle';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/components/ui/Toast';
import { Divider } from '@/components/ui/Divider';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ConnectorStatus } from '@/components/ui/ConnectorStatus';
import { CreditUsageIndicator } from '@/components/ui/CreditUsageIndicator';

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

export default function ShowcasePage() {
  const { addToast } = useToast();

  // Navigation tab
  const [activeTab, setActiveTab] = useState('design-system');

  // Interactive state demos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toggleState, setToggleState] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [commandText, setCommandText] = useState('');
  const [selectedTask, setSelectedTask] = useState('ASK_MY_WORLD');

  // Backend test suite state
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [healthInfo, setHealthInfo] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    async function fetchSystemState() {
      try {
        const [healthRes, testRes] = await Promise.all([
          fetch('/api/health').then((r) => r.json()),
          fetch('/api/tests').then((r) => r.json()),
        ]);
        setHealthInfo(healthRes);
        if (testRes.results) {
          setTestResults(testRes.results);
        }
      } catch (err) {
        console.error('Phase 0 load error:', err);
      } finally {
        setLoadingTests(false);
      }
    }
    fetchSystemState();
  }, []);

  const triggerSampleToast = (type: 'success' | 'error' | 'info') => {
    if (type === 'success') {
      addToast({
        type: 'success',
        title: 'Action Approved & Executed',
        description: 'Successfully dispatched payload via Gmail Connector.',
      });
    } else if (type === 'error') {
      addToast({
        type: 'error',
        title: 'Credit Limit Reached',
        description: 'Deep research requires 35 credits. Upgrade to Pro Plan.',
      });
    } else {
      addToast({
        type: 'info',
        title: 'Brain Context Synced',
        description: 'Loaded 4 new preference memories into current context vector.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">NEXORBIT</h1>
                <Badge variant="indigo" size="sm">Phase 1 Foundations</Badge>
              </div>
              <p className="text-xs text-slate-500">Your AI Brain for the Digital World • Design System & Architectural Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tabs
              items={[
                { id: 'design-system', label: 'Design System Tokens & UI' },
                { id: 'phase0-tests', label: 'Phase 0 Backend Verification' },
              ]}
              activeId={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {activeTab === 'design-system' ? (
          <div className="space-y-10">
            {/* Design Principles / System Tokens Banner */}
            <GlassSurface className="p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-indigo-100">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">NEXORBIT Visual System Specification</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  High-Precision Light Luxury Aesthetic
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clean neutral canvas (<code className="text-indigo-600 font-mono">bg-slate-50</code>), crisp typography hierarchy, soft micro-interactions, subtle borders, and vivid status indicators. Built with strict WCAG AA contrast and tokenized values.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <CreditUsageIndicator used={240} total={500} tier="V1 Free Plan" className="w-64" />
              </div>
            </GlassSurface>

            {/* Section 1: Buttons & Interactive Controls */}
            <section className="space-y-4">
              <SectionHeader
                title="Buttons & Controls"
                subtitle="Primary, secondary, outline, ghost, and danger buttons with left/right icons and state variations."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Button Variants" description="All standard design system buttons">
                  <div className="flex flex-wrap gap-2.5">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </Card>

                <Card title="Sizes & Icons" description="Small, medium, large with lucide icons">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button size="sm" leftIcon={<Zap className="h-3.5 w-3.5" />}>Small</Button>
                    <Button size="md" leftIcon={<Sparkles className="h-4 w-4" />}>Medium</Button>
                    <Button size="lg" rightIcon={<Shield className="h-4 w-4" />}>Large</Button>
                    <Button size="sm" loading>Loading</Button>
                  </div>
                </Card>

                <Card title="Icon Buttons & Tooltips" description="Quick operational triggers">
                  <div className="flex items-center gap-3">
                    <Tooltip content="Sync all connectors">
                      <IconButton icon={<RefreshCw className="h-4 w-4" />} variant="outline" label="Sync" />
                    </Tooltip>
                    <Tooltip content="System settings">
                      <IconButton icon={<Sliders className="h-4 w-4" />} variant="secondary" label="Settings" />
                    </Tooltip>
                    <Tooltip content="Active notifications">
                      <IconButton icon={<Bell className="h-4 w-4" />} variant="primary" label="Notifications" />
                    </Tooltip>
                    <Toggle checked={toggleState} onChange={setToggleState} label="Auto-Sync" />
                  </div>
                </Card>
              </div>
            </section>

            {/* Section 2: AI Command Input & Forms */}
            <section className="space-y-4">
              <SectionHeader
                title="AI Command Input & Form Controls"
                subtitle="Multimodal AI Command input with task selector and credit badges."
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Card title="AI Command Bar" description="Unified operational interface for Ask My World, Connect the Dots, Deep Research, and Heavy Agent tasks.">
                    <AICommandInput
                      value={commandText}
                      onChange={setCommandText}
                      selectedTask={selectedTask}
                      onTaskChange={setSelectedTask}
                      onSubmit={(prompt) => {
                        addToast({
                          type: 'info',
                          title: 'AI Command Sent',
                          description: `Processing prompt: "${prompt}" via task router.`,
                        });
                        setCommandText('');
                      }}
                      placeholder="Ask NEXORBIT anything, search personal brain, or invoke an action..."
                    />
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card title="Standard Inputs & Textarea" description="Crisp inputs with labels and hints">
                    <div className="space-y-3">
                      <Input
                        label="User Email"
                        placeholder="user@nexorbit.ai"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        leftIcon={<Search className="h-4 w-4" />}
                      />
                      <Textarea
                        label="Brain Prompt / Context Note"
                        placeholder="Add specific user instructions..."
                        rows={2}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 3: Status, Badges & Indicators */}
            <section className="space-y-4">
              <SectionHeader
                title="Badges, Status & Feedback Indicators"
                subtitle="Real-time connectivity badges, status dots, and credit consumption tags."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card title="Badges">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="indigo">Indigo</Badge>
                    <Badge variant="success" dot>Connected</Badge>
                    <Badge variant="warning" dot>Degraded</Badge>
                    <Badge variant="danger" dot>Offline</Badge>
                  </div>
                </Card>

                <Card title="Status Indicators">
                  <div className="space-y-2 text-xs">
                    <StatusIndicator status="active" text="AI Gateway Active" />
                    <StatusIndicator status="degraded" text="Notion Connector Degraded" />
                    <StatusIndicator status="offline" text="GitHub Token Expired" />
                    <StatusIndicator status="syncing" text="Embedding Context..." />
                  </div>
                </Card>

                <Card title="Avatars">
                  <div className="flex items-center gap-3">
                    <Avatar name="Nexus User" size="sm" status="online" />
                    <Avatar name="Alex Vance" size="md" status="busy" />
                    <Avatar name="NEXORBIT AI" size="lg" status="online" />
                  </div>
                </Card>

                <Card title="Progress Bars">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Brain Sync</span>
                        <span>75%</span>
                      </div>
                      <ProgressBar value={75} size="sm" variant="indigo" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Free Tier Credits</span>
                        <span>90%</span>
                      </div>
                      <ProgressBar value={90} size="sm" variant="danger" />
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Section 4: Connectors & Surfaces */}
            <section className="space-y-4">
              <SectionHeader
                title="Connectors & Glass Surfaces"
                subtitle="Health states for Gmail, Calendar, Drive, Notion, and GitHub connectors."
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ConnectorStatus
                  name="Google Workspace"
                  type="OAuth 2.0"
                  status="connected"
                  lastSyncedAt="2 mins ago"
                  onSync={() => triggerSampleToast('info')}
                />
                <ConnectorStatus
                  name="Notion Workspace"
                  type="API Token"
                  status="degraded"
                  errorMessage="Rate limit reached on database query. Sync delayed."
                  lastSyncedAt="1 hour ago"
                  onSync={() => triggerSampleToast('info')}
                />
                <ConnectorStatus
                  name="GitHub Developer"
                  type="PAT Auth"
                  status="disconnected"
                  errorMessage="Token expired. Please reconnect authentication."
                  onReconnect={() => triggerSampleToast('error')}
                />
              </div>
            </section>

            {/* Section 5: Overlays, Modals, Drawers & Toast Actions */}
            <section className="space-y-4">
              <SectionHeader
                title="Overlays, Drawers & Toast Feedback"
                subtitle="Test interactive overlay dialogs, sliding context drawers, and instant toast notifications."
              />
              <Card title="Interactive Overlays Trigger" description="Click buttons below to preview modal, drawer, and system toast notifications.">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => setIsModalOpen(true)} leftIcon={<Maximize2 className="h-4 w-4" />}>
                    Open Action Modal
                  </Button>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(true)} leftIcon={<Layers className="h-4 w-4" />}>
                    Open Side Drawer
                  </Button>
                  <Button variant="secondary" onClick={() => triggerSampleToast('success')} leftIcon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}>
                    Trigger Success Toast
                  </Button>
                  <Button variant="secondary" onClick={() => triggerSampleToast('error')} leftIcon={<AlertCircle className="h-4 w-4 text-rose-600" />}>
                    Trigger Error Toast
                  </Button>
                </div>
              </Card>

              {/* Sample Modals and Drawers */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Verify High-Impact Action"
                description="This action requires explicit user approval before executing."
                footer={
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setIsModalOpen(false);
                        triggerSampleToast('success');
                      }}
                    >
                      Confirm Execution
                    </Button>
                  </>
                }
              >
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
                  <p className="font-semibold">Target Action: Send Team Executive Summary</p>
                  <p>Target Connector: Gmail Connector</p>
                  <p>Payload Recipient: team@nexorbit.ai</p>
                </div>
              </Modal>

              <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Brain Context Memories"
                subtitle="Managed preferences and user knowledge items"
              >
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Below are active long-term context memories attached to current user context:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                      <span className="font-semibold text-slate-900 block">Summary Preference</span>
                      <span className="text-slate-600 text-[11px]">User prefers bulleted executive summaries with bold key metrics.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                      <span className="font-semibold text-slate-900 block">Workspace Mapping</span>
                      <span className="text-slate-600 text-[11px]">Primary workspace ID mapped to &quot;Engineering &amp; Product Strategy&quot;.</span>
                    </div>
                  </div>
                </div>
              </Drawer>
            </section>

            {/* Section 6: States (Empty, Error, Loading) */}
            <section className="space-y-4">
              <SectionHeader
                title="System States (Empty, Error, Loading)"
                subtitle="Standardized layout states for edge cases and async loading."
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EmptyState
                  title="No Context Memories Found"
                  description="Use the command bar or connect external services to build your personal brain context."
                  actionLabel="Add Memory"
                  onAction={() => triggerSampleToast('info')}
                />
                <ErrorState
                  title="Gateway Timeout"
                  message="Failed to contact model router within 5000ms. Check API key configuration."
                  onRetry={() => triggerSampleToast('info')}
                />
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-900">Skeleton Loading Preview</h4>
                  <SkeletonLoader variant="card" />
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Tab 2: Phase 0 Backend Verification Suite */
          <div className="space-y-6">
            <GlassSurface className="p-6 rounded-2xl border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-slate-900">Phase 0 Backend Architectural Test Suite</h2>
                </div>
                {loadingTests ? (
                  <span className="text-xs text-indigo-600 animate-pulse font-medium">Running suite...</span>
                ) : (
                  <Badge variant="success" dot size="sm">
                    {testResults.filter((t) => t.passed).length} / {testResults.length} Tests Passed
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verifies user data isolation, Firestore security rule generation, credit calculation & consumption (500 Free / 15,000 Pro), AI model routing, personal brain context retriever, connector abstraction, and 6-stage action lifecycle.
              </p>
            </GlassSurface>

            {/* Specs & Boundaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="System Specifications">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Application</span>
                    <span className="text-slate-900 font-semibold">NEXORBIT</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Free Credit Allowance</span>
                    <span className="text-slate-900 font-medium">500 credits / mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Pro Credit Allowance</span>
                    <span className="text-indigo-600 font-semibold">15,000 credits / mo (₹1,499)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Connectors Supported</span>
                    <span className="text-slate-900 font-medium">Gmail, Calendar, Drive, Notion, GitHub</span>
                  </div>
                </div>
              </Card>

              <Card title="Architecture Boundaries">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-800">User Data Isolation & Firestore Rules Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-800">Server-Authoritative Credit Billing & Deduction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-800">GoogleGenAI Gateway Router & Model Selectors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-800">Personal Brain & Vector Context Retrieval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-800">6-Stage Action Lifecycle Verification Engine</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Results Table */}
            <Card title="Test Execution Log">
              <div className="space-y-2.5">
                {testResults.map((res, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span className={res.passed ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                          {res.passed ? '✓' : '✕'}
                        </span>
                        {res.test}
                      </div>
                      <div className="text-slate-500 text-[11px] pl-4 leading-relaxed">{res.message}</div>
                    </div>
                    <Badge variant={res.passed ? 'success' : 'danger'} size="sm">
                      {res.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
