'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Globe, Send } from 'lucide-react';
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn('space-y-2 pt-2 pb-1 bg-slate-50/50', className)}>
      {/* NEXORBIT Signature Command-Box Treatment with Orbit Glow Border Interaction */}
      <div
        className={cn(
          'relative rounded-2xl transition-all duration-300',
          isFocused
            ? 'shadow-[0_0_20px_-3px_rgba(99,102,241,0.18)] bg-white border border-indigo-400/80'
            : 'border border-slate-200/80 bg-white/70 hover:bg-white hover:border-slate-300'
        )}
      >
        {/* Soft traveling light animated overlay on focus */}
        {isFocused && (
          <div className="absolute inset-0 p-[1.5px] pointer-events-none rounded-[15px] overflow-hidden">
            <div className="absolute inset-[-1000%] animate-spin [animation-duration:6s] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(99,102,241,0)_0%,#818cf8_45%,rgba(99,102,241,0.9)_50%,#818cf8_55%,rgba(99,102,241,0)_100%)] opacity-35" />
          </div>
        )}

        <div className="relative z-10 p-3 sm:p-3.5 space-y-2.5">
          {/* Multiline Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything about your world..."
            rows={1}
            className="w-full bg-transparent resize-none border-none outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed min-h-[38px] max-h-[160px] focus:ring-0"
          />

          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-2 border-t border-slate-100/60 pt-2">
            <div className="flex items-center gap-1.5">
              {/* Attach Button */}
              <button
                onClick={handleAttach}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100/80 transition-colors cursor-pointer"
                title="Attach File"
              >
                <Paperclip className="h-3.5 w-3.5" />
              </button>

              {/* Voice Button */}
              <button
                onClick={handleToggleVoice}
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer',
                  isVoiceRecording
                    ? 'bg-red-50 text-red-600 animate-pulse'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100/80'
                )}
                title="Voice Input"
              >
                <Mic className="h-3.5 w-3.5" />
              </button>

              {/* Deep Research Toggle */}
              <button
                onClick={() => setIsDeepResearch(!isDeepResearch)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors border cursor-pointer',
                  isDeepResearch
                    ? 'bg-indigo-950 text-indigo-200 border-indigo-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
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
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs h-7.5 px-3.5 rounded-lg shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Indicator near composer */}
      <div className="px-1 flex items-center justify-between">
        <ContextIndicator />
        <span className="text-[10px] text-slate-400 font-normal hidden sm:inline-block">
          Press Enter to send • Shift+Enter for newline
        </span>
      </div>
    </div>
  );
};

