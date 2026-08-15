'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Calendar,
  Mail,
  FileText,
  Bell,
  Sparkles,
  CheckCircle2,
  Menu,
  Mic,
  MicOff,
  Plus,
  X,
  Globe,
  Bot,
  AlertCircle,
  Clock,
  Check,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ConnectorId } from '../shell/ConnectorModal';
import { useToast } from '../ui/Toast';
import { AIMode } from '../chat/types';
import { useAuth } from '../auth/AuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  Task,
  createTask,
  updateTask,
  subscribeToTasks,
} from '../../services/firestore/tasks';
import {
  Activity,
  logActivity,
  subscribeToActivities,
} from '../../services/firestore/activity';

export interface AttachmentItem {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface HomeDashboardProps {
  onNavigate: (pageId: string) => void;
  onOpenConnector: (connectorId: ConnectorId) => void;
  onOpenMobileMenu?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenConnector,
  onOpenMobileMenu,
}) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [commandText, setCommandText] = useState('');
  const [currentMode, setCurrentMode] = useState<AIMode>('auto');

  // Dynamic user name generation with robust fallbacks
  const getActiveUserName = () => {
    if (user?.displayName && user.displayName.trim() !== '') {
      return user.displayName.trim();
    }
    if (user?.email && user.email.trim() !== '') {
      const parts = user.email.split('@')[0];
      if (parts && parts.trim() !== '') {
        return parts.trim();
      }
    }
    return 'there';
  };

  const activeUserName = getActiveUserName();

  // Connection states from Firestore
  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  // Real tasks & activities states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Task creation form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Agent connectivity status overlay
  const [isConnectingAgent, setIsConnectingAgent] = useState(false);
  const [submittedCommand, setSubmittedCommand] = useState('');

  // Voice recognition references
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Multimodal attachments
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  // Fetch real connection configuration
  useEffect(() => {
    if (!user?.uid) return;

    const fetchConnections = async () => {
      try {
        const colRef = collection(db, 'users', user.uid, 'connections');
        const snapshot = await getDocs(colRef);
        const connectedIds: string[] = [];
        snapshot.forEach((doc) => {
          if (doc.data().connected === true) {
            connectedIds.push(doc.id);
          }
        });
        setActiveConnections(connectedIds);
      } catch (e) {
        console.warn('Error loading dashboard connections:', e);
      } finally {
        setLoadingConnections(false);
      }
    };

    fetchConnections();
  }, [user?.uid]);

  // Subscribe to real Tasks (Cost Optimized - Limit 10)
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToTasks(
      user.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoadingTasks(false);
      },
      (error) => {
        console.error('Error loading tasks:', error);
        setLoadingTasks(false);
      },
      10
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Subscribe to real Activities (Cost Optimized - Limit 8)
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToActivities(
      user.uid,
      (fetchedActivities) => {
        setActivities(fetchedActivities);
        setLoadingActivities(false);
      },
      (error) => {
        console.error('Error loading activities:', error);
        setLoadingActivities(false);
      },
      8
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Close attach menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
        setIsAttachMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    const newAttachments: AttachmentItem[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        addToast({
          type: 'warning',
          title: 'File Too Large',
          description: `"${file.name}" exceeds the 15 MB limit.`,
        });
        return;
      }

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const previewUrl = event.target?.result as string;
          setAttachments((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              size: file.size,
              type: file.type,
              previewUrl,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        newAttachments.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    });

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
    e.target.value = '';
    setIsAttachMenuOpen(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast({
        type: 'warning',
        title: 'Voice Input Unsupported',
        description: 'Your browser does not support voice input. Try Chrome or Edge.',
      });
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        addToast({
          type: 'info',
          title: 'Voice Input Active',
          description: 'Listening... Speak now to populate your command.',
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setCommandText(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Intercepting submitting queries (Unsupported actions show Connecting overlay instead of generating fake chat)
  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryToSubmit = commandText.trim();
    if (!queryToSubmit && attachments.length === 0) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    setSubmittedCommand(queryToSubmit || 'Multimodal analysis');
    setIsConnectingAgent(true);
    setCommandText('');
    setAttachments([]);
  };

  const submitQuerySuggestion = (queryStr: string) => {
    setSubmittedCommand(queryStr);
    setIsConnectingAgent(true);
  };

  // Add a real task in Firestore
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user?.uid) return;

    try {
      setIsSubmittingTask(true);
      const taskId = await createTask(user.uid, {
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim(),
        status: 'pending',
        priority: newTaskPriority,
      });

      // Log real activity
      await logActivity(user.uid, {
        title: `Created task "${newTaskTitle.trim()}"`,
        description: `Priority: ${newTaskPriority}`,
        actionType: 'task_created',
        source: 'system',
      });

      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskPriority('medium');
      setIsAddingTask(false);

      addToast({
        type: 'success',
        title: 'Task Added',
        description: 'Successfully registered in Firestore.',
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Operation Failed',
        description: 'Could not create task. Check network or rules.',
      });
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Update real task status
  const handleToggleTask = async (task: Task) => {
    if (!task.id || !user?.uid) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      await updateTask(task.id, { status: newStatus });

      // Log real activity
      await logActivity(user.uid, {
        title: newStatus === 'completed' ? `Completed task "${task.title}"` : `Reopened task "${task.title}"`,
        description: `Status changed to ${newStatus}`,
        actionType: 'task_completed',
        source: 'system',
      });

      addToast({
        type: 'success',
        title: newStatus === 'completed' ? 'Task Completed' : 'Task Reopened',
        description: `Successfully modified task status.`,
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Update Failed',
        description: 'Could not update status.',
      });
    }
  };

  return (
    <div className="relative min-h-full w-full flex flex-col justify-between overflow-x-hidden pb-12 select-none">
      {/* COSMIC AMBIENT ORBITAL BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] md:top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[700px] h-[300px] md:h-[500px] rounded-full bg-gradient-to-br from-indigo-100/30 via-purple-50/15 to-transparent blur-3xl" />
        <svg
          viewBox="0 0 1400 900"
          className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-50"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="orbitStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.04" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M -100 280 C 350 80, 1050 80, 1500 280"
            fill="none"
            stroke="url(#orbitStroke)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <ellipse
            cx="700"
            cy="410"
            rx="620"
            ry="180"
            fill="none"
            stroke="url(#orbitStroke)"
            strokeWidth="1"
            transform="rotate(-4 700 410)"
          />
        </svg>
      </div>

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between gap-4 pt-2 sm:pt-4 px-1 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="p-1.5 -ml-1.5 rounded-xl text-slate-600 hover:bg-slate-50 lg:hidden cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-widest text-indigo-600 uppercase">NEXORBIT</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">Workspace</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 mt-1 flex items-center gap-2">
            <span>Good morning, {activeUserName}</span>
            <span className="text-indigo-600 font-normal inline-block text-lg animate-pulse">✦</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'No Notifications',
                description: 'You are completely up to date.',
              });
            }}
            className="h-9 w-9 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-slate-950 hover:bg-slate-50 flex items-center justify-center shadow-xs transition-all cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div
            onClick={() => onNavigate('settings')}
            className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shadow-2xs cursor-pointer hover:ring-2 hover:ring-indigo-300/60 transition-all shrink-0 bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs uppercase"
            title="User Profile Settings"
          >
            {activeUserName.charAt(0)}
          </div>
        </div>
      </div>

      {/* HERO COMMAND AREA */}
      <div className="w-full max-w-3xl mx-auto my-8 px-1">
        <form onSubmit={handleCommandSubmit} className="relative group flex flex-col">
          <div className="absolute -inset-[1px] rounded-[1.5rem] bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 opacity-40 group-hover:opacity-70 group-focus-within:opacity-80 blur-[1px] transition-all duration-300" />

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.txt,.csv,.json,.xlsx,.pptx,.md,text/*,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="relative flex flex-col rounded-[1.5rem] bg-white p-4 sm:p-5 shadow-xs border border-indigo-100/60 gap-3">
            {attachments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 px-1 pt-0.5">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-800"
                  >
                    <div className="h-5 w-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                      <FileText className="h-3 w-3" />
                    </div>
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.id)}
                      className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              placeholder={isListening ? 'Listening... Speak now' : 'What can I help you get done?'}
              className={cn(
                'w-full bg-transparent text-slate-950 placeholder:text-slate-400 text-base focus:outline-none px-2 font-medium',
                isListening && 'placeholder:text-indigo-600 placeholder:font-semibold'
              )}
            />

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-0.5 rounded-xl flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setCurrentMode('auto')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer',
                    currentMode === 'auto'
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Auto</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="relative" ref={attachMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsAttachMenuOpen((prev) => !prev)}
                    className={cn(
                      'p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 cursor-pointer',
                      isAttachMenuOpen && 'bg-slate-50 text-indigo-600'
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </button>

                  {isAttachMenuOpen && (
                    <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-xl p-1 shadow-md border border-slate-100 z-30 space-y-0.5 text-xs font-bold text-slate-700">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-left"
                      >
                        <span>Photo / Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-left"
                      >
                        <span>File / Document</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={cn(
                    'p-2 rounded-xl transition-all cursor-pointer',
                    isListening
                      ? 'bg-rose-50 text-rose-600 animate-pulse'
                      : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                  )}
                >
                  {isListening ? <MicOff className="h-4 w-4 text-rose-600" /> : <Mic className="h-4 w-4" />}
                </button>

                <button
                  type="submit"
                  disabled={!commandText.trim() && attachments.length === 0}
                  className="h-8 w-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* CONNECTION GATES WARNING STATE */}
        {isConnectingAgent && (
          <div className="mt-3 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950 font-medium">
            <div className="flex items-start gap-2.5">
              <Bot className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Agent capabilities are being connected</p>
                <p className="text-slate-500 font-normal mt-0.5">
                  NEXORBIT is preparing your workspace. Running commands like <code className="font-mono text-indigo-700 font-semibold bg-white px-1 rounded">&ldquo;{submittedCommand}&rdquo;</code> will become available once the core integrations are synchronized.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsConnectingAgent(false)}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer self-end sm:self-center"
            >
              Got it
            </button>
          </div>
        )}

        {/* COMMAND EXAMPLES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {[
            { text: 'Summarize my latest emails', icon: Mail },
            { text: 'Find a file in Drive', icon: FileText },
            { text: 'Review my GitHub repository', icon: Bot },
            { text: 'Prepare a report', icon: FileText },
          ].map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => submitQuerySuggestion(item.text)}
              className="p-3 rounded-xl bg-white/70 hover:bg-white border border-slate-200/60 hover:border-indigo-100 text-slate-700 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-2.5 text-left group"
            >
              <item.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />
              <span className="truncate">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS DECK */}
      <div className="my-6 px-1">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3 uppercase">Workspace Capabilities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: 'gmail', name: 'Gmail', isComing: false },
            { id: 'drive', name: 'Drive', isComing: false },
            { id: 'calendar', name: 'Calendar', isComing: false },
            { id: 'github', name: 'GitHub', isComing: false },
            { id: 'write', name: 'Write', isComing: true },
            { id: 'research', name: 'Research', isComing: true },
          ].map((card) => {
            const isConnected = activeConnections.includes(card.id);
            return (
              <div
                key={card.id}
                onClick={() => {
                  if (card.isComing) {
                    addToast({
                      type: 'info',
                      title: 'Coming Soon',
                      description: `${card.name} core engines will arrive in Phase 3.`,
                    });
                  } else {
                    onOpenConnector(card.id as ConnectorId);
                  }
                }}
                className={cn(
                  'p-4 rounded-2xl border bg-white shadow-2xs flex flex-col justify-between items-start cursor-pointer transition-all hover:shadow-xs',
                  isConnected ? 'border-emerald-100/80 hover:border-emerald-200' : 'border-slate-100 hover:border-slate-200'
                )}
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-950">{card.name}</div>
                </div>
                <div className="mt-4">
                  {card.isComing ? (
                    <span className="text-[9px] font-extrabold tracking-wide text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                      Soon
                    </span>
                  ) : isConnected ? (
                    <span className="text-[9px] font-extrabold tracking-wide text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                      <Check className="h-2.5 w-2.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-extrabold tracking-wide text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase">
                      Offline
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DUAL CORE REGION: REAL WORKSPACE TASKS & REAL ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1 mt-4">
        {/* REAL FIRESTORE TASKS PANEL */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-950 tracking-tight">Workspace Tasks</h3>
              <p className="text-xs text-slate-500">Real-time goals backed by cloud Firestore.</p>
            </div>
            {!isAddingTask && (
              <button
                onClick={() => setIsAddingTask(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors border border-indigo-100/60"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </button>
            )}
          </div>

          {/* ADD TASK COMPACT FORM */}
          {isAddingTask && (
            <form onSubmit={handleAddTask} className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/15 space-y-3">
              <div className="flex justify-between items-center pb-1">
                <span className="text-xs font-bold text-indigo-950">New Workspace Task</span>
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Read draft proposal"
                    className="w-full p-2 bg-white rounded-lg border border-slate-200 outline-none focus:border-indigo-500 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                  <textarea
                    maxLength={400}
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Provide additional details..."
                    rows={2}
                    className="w-full p-2 bg-white rounded-lg border border-slate-200 outline-none focus:border-indigo-500 font-medium text-slate-900 resize-none"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block font-bold text-slate-700 mb-1">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e: any) => setNewTaskPriority(e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 outline-none focus:border-indigo-500 font-bold text-slate-700"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="self-end flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingTask}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {isSubmittingTask ? 'Creating...' : 'Save Task'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* REAL TASKS LIST */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {loadingTasks ? (
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task)}
                  className={cn(
                    'flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100/80 cursor-pointer transition-all hover:bg-slate-50 group',
                    task.status === 'completed' && 'bg-slate-50/60 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors',
                        task.status === 'completed'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-slate-300 group-hover:border-indigo-500'
                      )}
                    >
                      {task.status === 'completed' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={cn(
                          'text-xs font-bold text-slate-900 truncate',
                          task.status === 'completed' && 'line-through text-slate-500'
                        )}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{task.description}</div>
                      )}
                    </div>
                  </div>

                  <span
                    className={cn(
                      'text-[9px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded shrink-0',
                      task.priority === 'high'
                        ? 'text-rose-600 bg-rose-50'
                        : task.priority === 'medium'
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-500 bg-slate-100'
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs space-y-2">
                <p className="font-bold text-slate-800">Your workspace is ready.</p>
                <p className="max-w-xs mx-auto text-slate-400 font-normal">
                  No registered goals found. Create your first task to get started!
                </p>
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold inline-block"
                >
                  + Add task now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* REAL ACTIVITIES TIMELINE */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-950 tracking-tight">Recent Activity</h3>
            <p className="text-xs text-slate-500">Real-time log of workspace state changes.</p>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {loadingActivities ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex gap-3 animate-pulse">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-slate-100 rounded w-1/2" />
                      <div className="h-2.5 bg-slate-100 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 text-xs p-1">
                  <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 text-indigo-500 flex items-center justify-center shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-850 leading-tight">{activity.title}</div>
                    {activity.description && (
                      <div className="text-[10.5px] text-slate-400 mt-0.5">{activity.description}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs py-12">
                <p className="font-bold text-slate-800">Nothing here yet.</p>
                <p className="text-slate-400 font-normal mt-1 max-w-[200px] mx-auto leading-normal">
                  When you complete work with NEXORBIT, your activity feed logs updates here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER STATEMENT */}
      <div className="text-center mt-12 px-4">
        <p className="text-xs text-slate-400 font-normal tracking-tight">
          <strong className="font-black text-slate-600">NEXORBIT</strong> works securely across your workspace. ✦
        </p>
      </div>
    </div>
  );
};
