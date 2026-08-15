'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  History,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  AIMode,
  ChatConversation,
  ChatMessage,
  SourceReference,
  ChatAction,
  ChatAttachment,
} from './types';
import { ChatHeader } from './ChatHeader';
import { ModeSelector } from './ModeSelector';
import { UserMessage, AssistantMessage, TypingIndicator } from './MessageItem';
import { RightContextPanel } from './RightContextPanel';
import { ChatComposer } from './ChatComposer';
import { useToast } from '../ui/Toast';
import { useAuth } from '../auth/AuthContext';
import {
  subscribeToConversations,
  subscribeToMessages,
  createConversation,
  addMessage,
} from '../../services/firestore/chat';
import {
  ConflictDetailDrawer,
  EmailDrawer,
  MeetingDrawer,
  SourcePreviewDrawer,
  VoiceModal,
  AttachmentModal,
} from '../ask/DetailDrawers';

export interface ChatViewProps {
  onNavigate?: (pageId: string) => void;
  initialMode?: AIMode;
  initialQuery?: string;
  className?: string;
}

const SUGGESTED_FOLLOW_UPS = [
  'Show my action items',
  'What are my current goals?',
  'Draft a project update email',
];

export const ChatView: React.FC<ChatViewProps> = ({
  onNavigate,
  initialMode = 'auto',
  initialQuery = '',
  className,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMode, setCurrentMode] = useState<AIMode>(initialMode);
  const [inputText, setInputText] = useState(initialQuery);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Drawers & Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConflictDrawerOpen, setIsConflictDrawerOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
  const [selectedSourceForPreview, setSelectedSourceForPreview] =
    useState<SourceReference | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Auto-scroll when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // Subscribe to real-time conversations
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToConversations(
      user.uid,
      (fetchedConvs) => {
        const mapped = fetchedConvs.map((c) => ({
          id: c.id || '',
          title: c.title,
          updatedAt: c.updatedAt
            ? new Date(c.updatedAt.seconds * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Just now',
          mode: (c.mode || 'auto') as AIMode,
          messages: [],
        }));
        setConversations(mapped);
        setLoadingConversations(false);
        if (mapped.length > 0 && !activeConversationId) {
          setActiveConversationId(mapped[0].id);
        }
      },
      (err) => {
        console.error('Error in subscribeToConversations:', err);
        setLoadingConversations(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, activeConversationId]);

  // Subscribe to real-time messages for active conversation
  useEffect(() => {
    if (!activeConversationId) {
      setTimeout(() => {
        setMessages([]);
      }, 0);
      return;
    }

    const unsubscribe = subscribeToMessages(
      activeConversationId,
      (fetchedMsgs) => {
        const mapped = fetchedMsgs.map((m) => ({
          id: m.id || '',
          sender: m.sender,
          text: m.text,
          timestamp: m.timestamp
            ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Just now',
          modeUsed: (m.modeUsed || 'auto') as AIMode,
        }));
        setMessages(mapped);
      },
      (err) => {
        console.error('Error in subscribeToMessages:', err);
      }
    );

    return () => unsubscribe();
  }, [activeConversationId]);

  // Base message sending / execution function
  const handleSendMessageWithQuery = useCallback(async (queryText: string) => {
    if (!user?.uid || isThinking) return;
    setIsThinking(true);

    try {
      let convId = activeConversationId;
      if (!convId) {
        // Create new conversation
        const title = queryText.slice(0, 40) + (queryText.length > 40 ? '...' : '');
        convId = await createConversation(user.uid, title, currentMode);
        setActiveConversationId(convId);
      }

      // 1. Add User Message
      await addMessage(convId, user.uid, {
        sender: 'user',
        text: queryText,
        modeUsed: currentMode,
      });

      // 2. Mock small delay then add honest System message
      setTimeout(async () => {
        try {
          await addMessage(convId!, user.uid, {
            sender: 'ai',
            text: 'AI reasoning is not connected yet in this build phase.',
            modeUsed: currentMode,
          });
        } catch (err) {
          console.error('Error adding system response:', err);
        } finally {
          setIsThinking(false);
        }
      }, 700);

    } catch (err) {
      console.error('Error handling message:', err);
      setIsThinking(false);
      addToast({
        type: 'error',
        title: 'Send Failed',
        description: 'Failed to record message in Firestore.',
      });
    }
  }, [user, activeConversationId, currentMode, isThinking, addToast]);

  // Submit current input from composer
  const handleSendMessage = (e?: React.FormEvent, submitAttachments?: ChatAttachment[]) => {
    if (e) e.preventDefault();
    const pendingAttachments = submitAttachments || attachments;
    if ((!inputText.trim() && pendingAttachments.length === 0) || isThinking) return;

    const query = inputText.trim();
    setInputText('');
    setAttachments([]);

    handleSendMessageWithQuery(query);
  };

  // Handle new conversation click
  const handleStartNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setInputText('');
  }, []);

  // Handle incoming command from Home screen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingCommand = sessionStorage.getItem('pending_ask_command');
      const pendingMode = sessionStorage.getItem(
        'pending_chat_mode'
      ) as AIMode | null;
      if (pendingCommand) {
        sessionStorage.removeItem('pending_ask_command');
        if (pendingMode) {
          sessionStorage.removeItem('pending_chat_mode');
          setTimeout(() => {
            setCurrentMode(pendingMode);
          }, 0);
        }
        const timer = setTimeout(() => {
          handleSendMessageWithQuery(pendingCommand);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [handleSendMessageWithQuery]);

  // Handle action triggers from context panel or assistant message
  const handleActionClick = (action: ChatAction) => {
    switch (action.actionType) {
      case 'share':
        addToast({
          type: 'success',
          title: 'Link Copied',
          description: 'Shareable proposal link copied to clipboard.',
        });
        break;
      case 'draft_reply':
        setIsEmailDrawerOpen(true);
        break;
      case 'review_conflict':
        setIsConflictDrawerOpen(true);
        break;
      case 'view_meeting':
        setIsMeetingDrawerOpen(true);
        break;
      default:
        addToast({
          type: 'info',
          title: 'Action Triggered',
          description: `Executed: ${action.label}`,
        });
        break;
    }
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col font-sans transition-colors duration-200',
        className
      )}
    >
      {/* 1. HEADER ROW */}
      <ChatHeader
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNavigateHome={() => onNavigate && onNavigate('home')}
      />

      {/* 2. THREE-COLUMN DESKTOP WORKSPACE (Center Conversation + Right Panel) */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-8 lg:gap-10 pt-2">
        {/* CENTER CONVERSATION COLUMN */}
        <div className="flex-1 min-w-0 w-full flex flex-col space-y-6">
          {/* AI Mode Selector Segment Bar */}
          <div className="w-full flex justify-center pb-1">
            <ModeSelector
              currentMode={currentMode}
              onChangeMode={(mode) => {
                setCurrentMode(mode);
                addToast({
                  type: 'info',
                  title: `Mode: ${
                    mode === 'auto'
                      ? 'Auto'
                      : mode === 'general'
                      ? 'NEXORBIT AI'
                      : 'My Connected World'
                  }`,
                  description:
                    mode === 'auto'
                      ? 'NEXORBIT automatically determines context.'
                      : mode === 'general'
                      ? 'Conversational reasoning without app search.'
                      : 'Prioritizing information from your connected apps.',
                });
              }}
            />
          </div>

          {/* Conversation Stream */}
          <div className="space-y-6 min-h-[320px]">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.sender === 'user' ? (
                  <UserMessage message={msg} userInitial={user?.displayName?.[0] || 'U'} />
                ) : (
                  <AssistantMessage
                    message={msg}
                    onOpenDocument={(docTitle) =>
                      addToast({
                        type: 'info',
                        title: 'Document Preview',
                        description: `Previewing ${docTitle} is not active in this phase.`,
                      })
                    }
                    onOpenSource={(src) => setSelectedSourceForPreview(src)}
                  />
                )}
              </div>
            ))}

            {/* Empty state when no conversations or messages */}
            {messages.length === 0 && !isThinking && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
                <Sparkles className="h-10 w-10 text-indigo-500 mb-4 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">No messages yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                  Start your first real workspace conversation with NEXORBIT by entering a query below.
                </p>
              </div>
            )}

            {/* Thinking Indicator */}
            {isThinking && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up Suggestion Chips & Refresh Button */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2 select-none">
            {SUGGESTED_FOLLOW_UPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessageWithQuery(chip)}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200/80 shadow-3xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                {chip}
              </button>
            ))}

            {/* Regenerate / Refresh Button */}
            <button
              type="button"
              onClick={() => {
                const lastUser = messages
                  .slice()
                  .reverse()
                  .find((m) => m.sender === 'user');
                if (lastUser) {
                  handleSendMessageWithQuery(lastUser.text);
                } else {
                  handleSendMessageWithQuery("Show my action items");
                }
              }}
              className="p-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-200/80 shadow-3xs transition-all active:scale-95 cursor-pointer"
              title="Regenerate response"
              aria-label="Regenerate response"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Chat Composer Surface */}
          <div className="pt-2 sticky bottom-4 z-10 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pb-2">
            <ChatComposer
              inputText={inputText}
              onChangeText={setInputText}
              onSubmit={handleSendMessage}
              attachments={attachments}
              onAddAttachments={(files) =>
                setAttachments((prev) => [...prev, ...files])
              }
              onRemoveAttachment={(id) =>
                setAttachments((prev) => prev.filter((a) => a.id !== id))
              }
              isThinking={isThinking}
            />
          </div>
        </div>

        {/* RIGHT CONTEXT PANEL */}
        <RightContextPanel
          sources={[]}
          actions={[]}
          memory={undefined}
          onNavigateToMemory={() => onNavigate && onNavigate('memory')}
          onOpenSource={(src) => setSelectedSourceForPreview(src)}
          onExecuteAction={handleActionClick}
          onCreateWatch={() => {
            addToast({
              type: 'success',
              title: 'Proactive Watch Created',
              description: 'NEXORBIT is now monitoring for updates.',
            });
          }}
        />
      </div>

      {/* CONVERSATION HISTORY DRAWER */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-slate-100">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Chat History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="p-3 space-y-2 flex-1 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setIsHistoryOpen(false);
                  handleStartNewConversation();
                }}
                className="w-full p-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                <span>Start New Conversation</span>
              </button>

              <div className="pt-2 space-y-1.5">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveConversationId(c.id);
                      setIsHistoryOpen(false);
                    }}
                    className={cn(
                      'w-full text-left p-3 rounded-2xl transition-all cursor-pointer block',
                      c.id === activeConversationId
                        ? 'bg-indigo-50/90 border border-indigo-200/80 text-indigo-950 font-medium'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">
                        {c.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {c.updatedAt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWERS & MODALS */}
      <ConflictDetailDrawer
        isOpen={isConflictDrawerOpen}
        onClose={() => setIsConflictDrawerOpen(false)}
        onPrepareResponse={() => setIsEmailDrawerOpen(true)}
        onOpenSource={(src) => setSelectedSourceForPreview(src)}
        sources={[]}
      />

      <EmailDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        onPrepareReply={() => {
          setIsEmailDrawerOpen(false);
          addToast({
            type: 'success',
            title: 'Reply Draft Dispatched',
            description: 'Draft reply prepared successfully.',
          });
        }}
      />

      <MeetingDrawer
        isOpen={isMeetingDrawerOpen}
        onClose={() => setIsMeetingDrawerOpen(false)}
      />

      <SourcePreviewDrawer
        source={selectedSourceForPreview}
        onClose={() => setSelectedSourceForPreview(null)}
      />

      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSubmitVoice={(query) => {
          setIsVoiceModalOpen(false);
          handleSendMessageWithQuery(query);
        }}
      />

      <AttachmentModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        onAttachFile={(fileName) => {
          setIsAttachModalOpen(false);
          addToast({
            type: 'info',
            title: 'File Attached',
            description: `Attached ${fileName} to chat workspace context.`,
          });
        }}
      />
    </div>
  );
};
