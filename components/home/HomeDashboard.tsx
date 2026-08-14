'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Calendar,
  Mail,
  FileText,
  Video,
  Bell,
  Sparkles,
  CheckCircle2,
  X,
  Brain,
  Menu,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ConnectorId } from '../shell/ConnectorModal';
import { useToast } from '../ui/Toast';

export interface HomeDashboardProps {
  onNavigate: (pageId: string) => void;
  onOpenConnector: (connectorId: ConnectorId) => void;
  onOpenMobileMenu?: () => void;
  userName?: string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenConnector,
  onOpenMobileMenu,
  userName = 'Aryan',
}) => {
  const { addToast } = useToast();
  const [commandText, setCommandText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    prompt: string;
    text: string;
    sources: string[];
    timestamp: string;
  } | null>(null);

  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandText.trim()) return;

    setIsGenerating(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsGenerating(false);
      setAiResponse({
        prompt: commandText,
        text: `Based on your connected Gmail, Calendar, and Notion memory, here is the synthesis for "${commandText}":

• Project Alpha deadline is Friday 5:00 PM in Gmail, but your Calendar shows a 4:30 PM conflict.
• Rahul replied to your security spec thread with approval notes.
• 3 priority tasks require your attention before the 10:00 AM sync.`,
        sources: [
          'Gmail: "Project Alpha Spec Update"',
          'Calendar: "Project Alpha Sync"',
          'Drive: "Proposal_v2.pdf"',
        ],
        timestamp: 'Just now',
      });
      addToast({
        type: 'info',
        title: 'NEXORBIT AI Response',
        description: 'Synthesized personal context from connected sources.',
      });
    }, 700);
  };

  const handleNotificationClick = () => {
    addToast({
      type: 'info',
      title: 'Notifications',
      description: '2 new context updates from Gmail & Google Calendar.',
    });
  };

  return (
    <div className="relative min-h-full w-full flex flex-col justify-between overflow-hidden pb-8 select-none">
      {/* 1. COSMIC AMBIENT ORBITAL BACKGROUND (SVG + CSS) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Radial Center Glow */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-br from-indigo-100/40 via-purple-50/25 to-transparent blur-3xl" />

        {/* Ambient Orbital SVG Curves */}
        <svg
          viewBox="0 0 1400 900"
          className="absolute inset-0 w-full h-full object-cover opacity-65"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="orbitStroke1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.05" />
              <stop offset="45%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#a855f7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="orbitStroke2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
            <radialGradient id="planetGlow1" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4338ca" />
            </radialGradient>
            <radialGradient id="planetGlow2" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </radialGradient>
            <radialGradient id="planetGlow3" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
          </defs>

          {/* Large Upper Arc */}
          <path
            d="M -100 280 C 350 80, 1050 80, 1500 280"
            fill="none"
            stroke="url(#orbitStroke1)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Sweeping Center Orbit Ellipse */}
          <ellipse
            cx="700"
            cy="410"
            rx="620"
            ry="180"
            fill="none"
            stroke="url(#orbitStroke1)"
            strokeWidth="1.2"
            transform="rotate(-4 700 410)"
          />

          {/* Secondary Counter Orbit Ellipse */}
          <ellipse
            cx="700"
            cy="420"
            rx="510"
            ry="140"
            fill="none"
            stroke="url(#orbitStroke2)"
            strokeWidth="1"
            strokeDasharray="2 6"
            transform="rotate(6 700 420)"
          />

          {/* Ambient Floating Planet Beads */}
          <circle cx="210" cy="220" r="5" fill="url(#planetGlow1)" filter="drop-shadow(0 0 6px #818cf8)" />
          <circle cx="1180" cy="240" r="6" fill="url(#planetGlow2)" filter="drop-shadow(0 0 8px #c084fc)" />
          <circle cx="340" cy="460" r="4.5" fill="url(#planetGlow3)" filter="drop-shadow(0 0 6px #38bdf8)" />
          <circle cx="1060" cy="480" r="5.5" fill="url(#planetGlow1)" filter="drop-shadow(0 0 7px #818cf8)" />
          <circle cx="780" cy="260" r="3.5" fill="url(#planetGlow2)" />
        </svg>
      </div>

      {/* 2. TOP ROW: GREETING (LEFT) & STATUS / PROFILE (RIGHT) */}
      <div className="flex items-start justify-between gap-4 pt-1 sm:pt-2 px-1">
        {/* Left: Greeting */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="p-1.5 -ml-1.5 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-1.5">
              <span>Good morning, {userName}</span>
              <span className="text-indigo-600 font-normal inline-block text-xl sm:text-2xl animate-pulse">
                ✦
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            NEXORBIT is ready.
          </p>
        </div>

        {/* Right: Synced Status Pill + Notification Bell + Profile Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Synced Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200/70 rounded-full px-3.5 py-1.5 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Synced</span>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={handleNotificationClick}
            className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/70 text-slate-600 hover:text-slate-950 hover:bg-slate-50 flex items-center justify-center shadow-2xs transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => onNavigate('settings')}
            className="h-9 w-9 rounded-full overflow-hidden border border-slate-200/80 shadow-2xs cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all shrink-0 bg-indigo-50 flex items-center justify-center"
            title="User Settings"
          >
            {/* Elegant SVG avatar */}
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <rect width="36" height="36" fill="#f1f5f9" />
              <circle cx="18" cy="14" r="7" fill="#cbd5e1" />
              <path d="M6 34 C6 25 12 23 18 23 C24 23 30 25 30 34" fill="#94a3b8" />
              <circle cx="18" cy="13" r="6" fill="#475569" />
              <path d="M18 7 C14 7 13 10 13 13 C14 13 15 11 18 11 C21 11 22 13 23 13 C23 10 22 7 18 7 Z" fill="#0f172a" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. HERO COMMAND SURFACE (SIGNATURE ANIMATED BORDER) */}
      <div className="w-full max-w-2xl mx-auto my-6 sm:my-8 px-1">
        <form onSubmit={handleCommandSubmit} className="relative group">
          {/* Glowing Animated Gradient Perimeter */}
          <div className="absolute -inset-[1.5px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 blur-[2px] transition-all duration-500 animate-gradient-x" />

          {/* Command Pill Surface */}
          <div className="relative flex items-center justify-between rounded-full bg-white/95 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 shadow-[0_8px_30px_rgba(99,102,241,0.08)] border border-indigo-100/90 gap-3">
            <input
              type="text"
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              placeholder="Ask anything. NEXORBIT will handle the rest."
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-[15px] focus:outline-none pr-2 font-normal"
            />

            {/* Circular Send Action Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              aria-label="Send command"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Real-time AI Generation Loading */}
        {isGenerating && (
          <div className="mt-3 p-3.5 rounded-2xl border border-indigo-100 bg-white/90 backdrop-blur-sm shadow-xs flex items-center gap-3 animate-pulse">
            <Brain className="h-4 w-4 text-indigo-600 animate-bounce" />
            <span className="text-xs font-semibold text-slate-800">
              NEXORBIT is synthesizing personal context across your apps...
            </span>
          </div>
        )}

        {/* AI Synthesis Result Panel */}
        {aiResponse && !isGenerating && (
          <div className="mt-3 p-4 rounded-3xl border border-indigo-100 bg-white shadow-sm space-y-3 relative animate-fadeIn">
            <button
              onClick={() => setAiResponse(null)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950">NEXORBIT Personal AI Synthesis</h4>
                <p className="text-[10px] text-slate-400">{aiResponse.timestamp}</p>
              </div>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              {aiResponse.text}
            </div>

            <div className="flex flex-wrap gap-2 pt-0.5">
              {aiResponse.sources.map((src, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium bg-indigo-50/80 text-indigo-800 px-2.5 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1"
                >
                  <CheckCircle2 className="h-3 w-3 text-indigo-600" />
                  {src}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. CENTRAL ORBITAL CORE ("NEXORBIT BRAIN") */}
      <div className="flex flex-col items-center justify-center my-2 sm:my-4 relative">
        <div className="relative w-64 h-40 sm:h-44 flex items-center justify-center">
          {/* 3D Tilted Perspective Ellipse Orbit Rings */}
          <svg viewBox="0 0 320 200" className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="coreRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
                <stop offset="40%" stopColor="#818cf8" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#6366f1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="coreRingGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Orbit Ellipse 1 (Horizontal wide) */}
            <ellipse
              cx="160"
              cy="100"
              rx="135"
              ry="38"
              fill="none"
              stroke="url(#coreRingGrad1)"
              strokeWidth="1.6"
              transform="rotate(-12 160 100)"
            />

            {/* Orbit Ellipse 2 (Cross tilt) */}
            <ellipse
              cx="160"
              cy="100"
              rx="125"
              ry="32"
              fill="none"
              stroke="url(#coreRingGrad2)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              transform="rotate(18 160 100)"
            />

            {/* Orbit Ellipse 3 (Subtle inner) */}
            <ellipse
              cx="160"
              cy="100"
              rx="90"
              ry="24"
              fill="none"
              stroke="rgba(129, 140, 248, 0.4)"
              strokeWidth="1"
              transform="rotate(-5 160 100)"
            />

            {/* Orbiting Planetary Bead Nodes */}
            <circle cx="50" cy="115" r="5" fill="#818cf8" filter="drop-shadow(0 0 6px #6366f1)" />
            <circle cx="270" cy="85" r="5.5" fill="#c084fc" filter="drop-shadow(0 0 6px #a855f7)" />
            <circle cx="215" cy="130" r="4" fill="#38bdf8" filter="drop-shadow(0 0 5px #38bdf8)" />
            <circle cx="105" cy="72" r="3.5" fill="#fb7185" filter="drop-shadow(0 0 5px #fb7185)" />
          </svg>

          {/* Central Glowing Celestial Core Sphere */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center group cursor-pointer">
            {/* Outer Diffuse Halo Aura */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/25 blur-xl group-hover:bg-indigo-500/40 transition-all duration-500 animate-pulse" />

            {/* Inner Shaded Celestial Orb */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-300 via-indigo-500 to-purple-700 shadow-[0_0_35px_rgba(99,102,241,0.45)] border border-indigo-200/50 flex items-center justify-center overflow-hidden">
              {/* Highlight Glint */}
              <div className="absolute top-2 left-3 w-7 h-4 rounded-full bg-white/40 blur-[1px] transform -rotate-45" />

              {/* Internal Organic Flow Pattern */}
              <svg viewBox="0 0 64 64" className="w-full h-full opacity-40 mix-blend-overlay">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3 2" />
                <ellipse cx="32" cy="32" rx="28" ry="12" fill="none" stroke="#fff" strokeWidth="1" transform="rotate(30 32 32)" />
                <ellipse cx="32" cy="32" rx="28" ry="12" fill="none" stroke="#fff" strokeWidth="1" transform="rotate(-30 32 32)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Below the Core */}
        <div className="text-center space-y-0.5 -mt-2">
          <div className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-slate-900 tracking-tight">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>NEXORBIT is up to date</span>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Your digital world is in sync
          </p>
        </div>
      </div>

      {/* 5. THREE LOWER CONTENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 sm:mt-8 px-1">
        {/* CARD 1: WHAT CHANGED */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-indigo-100 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[15px] text-slate-950 tracking-tight">
                  What Changed
                </h3>
                <span className="bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100/80">
                  6 new
                </span>
              </div>
              <button
                onClick={() => onNavigate('what-changed')}
                className="h-7 w-7 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Go to What Changed"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-2.5">
              {/* Item 1 */}
              <div
                onClick={() => onNavigate('what-changed')}
                className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 group-hover:bg-indigo-100/80 transition-colors">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-900 truncate">
                    Project Alpha deadline changed
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">2m ago</span>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => onNavigate('what-changed')}
                className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 group-hover:bg-indigo-100/80 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-900 truncate">
                    Rahul replied to your email
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">15m ago</span>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => onNavigate('what-changed')}
                className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 group-hover:bg-indigo-100/80 transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-900 truncate">
                    Proposal v2 updated
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">1h ago</span>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigate('what-changed')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>See all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: CLEAN MY DAY */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-indigo-100 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[15px] text-slate-950 tracking-tight">
                Clean My Day
              </h3>
              <button
                onClick={() => onNavigate('clean-my-day')}
                className="h-7 w-7 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Go to Clean My Day"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Subtitle and Dominant Headline */}
            <div className="space-y-0.5">
              <div className="text-xs text-slate-500 font-normal">
                You have 11 things today
              </div>
              <div className="text-base sm:text-[17px] font-extrabold text-slate-950 tracking-tight leading-tight">
                Only 3 need your attention
              </div>
            </div>

            {/* Segmented Priority Indicator */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="flex flex-col items-center">
                <div className="w-full bg-indigo-500 text-white font-bold text-xs py-2 rounded-2xl text-center shadow-xs">
                  3
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-1">Important</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full bg-slate-100 text-slate-700 font-semibold text-xs py-2 rounded-2xl text-center">
                  5
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-1">Later</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full bg-slate-100 text-slate-700 font-semibold text-xs py-2 rounded-2xl text-center">
                  3
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-1">Ignore</span>
              </div>
            </div>
          </div>

          {/* Full-width Button */}
          <div className="pt-2">
            <button
              onClick={() => onNavigate('clean-my-day')}
              className="w-full bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-600 font-semibold text-xs py-2.5 px-4 rounded-2xl flex items-center justify-between transition-all duration-150 cursor-pointer border border-indigo-100/60"
            >
              <span>See your day</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CARD 3: UPCOMING */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-indigo-100 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[15px] text-slate-950 tracking-tight">
                Upcoming
              </h3>
              <button
                onClick={() => onOpenConnector('calendar')}
                className="h-7 w-7 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Open Calendar"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-2.5">
              {/* Item 1 */}
              <div
                onClick={() => onOpenConnector('calendar')}
                className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 group-hover:bg-indigo-100/80 transition-colors">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-900 truncate">
                    Project Alpha Sync
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">10:00 AM</span>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => onOpenConnector('calendar')}
                className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 group-hover:bg-indigo-100/80 transition-colors">
                    <Video className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-900 truncate">
                    Client Call
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">01:30 PM</span>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => onOpenConnector('calendar')}
                className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 group-hover:bg-indigo-100/80 transition-colors">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-900 truncate">
                    Product Review
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">04:00 PM</span>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onOpenConnector('calendar')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View calendar</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM BRAND STATEMENT */}
      <div className="relative text-center mt-10 pt-4 px-4">
        {/* Sweeping Orbital Under-Line SVG */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-6 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 600 24" className="w-full h-full">
            <path
              d="M 20 18 C 180 4, 420 4, 580 18"
              fill="none"
              stroke="rgba(99, 102, 241, 0.2)"
              strokeWidth="1.2"
            />
            <circle cx="300" cy="8" r="2.5" fill="#818cf8" />
          </svg>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 font-normal tracking-tight">
          <strong className="font-bold text-slate-900">NEXORBIT</strong> works across your world to deliver clarity.{' '}
          <span className="text-indigo-600 font-normal">✦</span>
        </p>
      </div>
    </div>
  );
};
