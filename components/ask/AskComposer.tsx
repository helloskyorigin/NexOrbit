'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Sparkles, Send, Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { ContextIndicator } from './ContextIndicator';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/Toast';

export interface AskComposerProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const AskComposer: React.FC<AskComposerProps> = ({
  onSend,
  isLoading = false,
  className,
}) => {
  const { addToast } = useToast();
  const [text, setText] = useState('');
  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [selectedTask, setSelectedTask] = useState('Ask My World');
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const taskOptions = [
    { label: 'Ask My World', desc: 'Cross-app personal context query' },
    { label: 'What Changed', desc: 'Delta report on recent updates' },
    { label: 'Clean My Day', desc: 'Task & focus synthesis' },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleToggleVoice = () => {
    setIsVoiceRecording(!isVoiceRecording);
    if (!isVoiceRecording) {
      addToast({
        type: 'info',
        title: 'Voice Input Active',
        description: 'Listening for voice prompt... (Mock mode)',
      });
      setTimeout(() => {
        setText('Is there anything important I should know about Project Alpha?');
        setIsVoiceRecording(false);
      }, 1500);
    }
  };

  const handleAttach = () => {
    addToast({
      type: 'info',
      title: 'Attachment Selected',
      description: 'Attached mock document: Project_Alpha_Spec_v2.pdf',
    });
  };

  return (
    <div className={cn('space-y-2 sticky bottom-0 z-10 bg-slate-50/95 backdrop-blur-md pt-2 pb-1', className)}>
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-md focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all space-y-3">
        {/* Multiline Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your world..."
          rows={1}
          className="w-full bg-transparent resize-none border-none outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed min-h-[38px] max-h-[160px]"
        />

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Task Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTaskDropdownOpen(!isTaskDropdownOpen)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="h-3 w-3 text-indigo-600 fill-indigo-600" />
                <span>{selectedTask}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isTaskDropdownOpen && (
                <div className="absolute left-0 bottom-full mb-1 w-52 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 z-20 space-y-1 animate-fadeIn">
                  {taskOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setSelectedTask(opt.label);
                        setIsTaskDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors',
                        selectedTask === opt.label
                          ? 'bg-indigo-50 text-indigo-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      )}
                    >
                      <div>
                        <span className="block">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{opt.desc}</span>
                      </div>
                      {selectedTask === opt.label && <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attach Button */}
            <button
              onClick={handleAttach}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title="Attach File"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            {/* Voice Button */}
            <button
              onClick={handleToggleVoice}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                isVoiceRecording
                  ? 'bg-red-50 text-red-600 animate-pulse'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
              )}
              title="Voice Input"
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Deep Research Toggle */}
            <button
              onClick={() => setIsDeepResearch(!isDeepResearch)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors border',
                isDeepResearch
                  ? 'bg-indigo-900 text-indigo-200 border-indigo-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              )}
            >
              <Globe className="h-3 w-3" />
              <span>Deep Research</span>
            </button>
          </div>

          {/* Right Controls: Send Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              leftIcon={<Send className="h-3.5 w-3.5" />}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-8"
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Context Indicator near composer */}
      <div className="px-1 flex items-center justify-between">
        <ContextIndicator />
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
          Press Enter to send • Shift+Enter for newline
        </span>
      </div>
    </div>
  );
};
