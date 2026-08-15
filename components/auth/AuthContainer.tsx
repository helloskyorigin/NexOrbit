'use client';

import React, { useState } from 'react';
import { Shield, Zap, Lock, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from './AuthContext';
import { WelcomeView } from './views/WelcomeView';
import { CreateAccountView } from './views/CreateAccountView';
import { PasswordInputView } from './views/PasswordInputView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { ProfileSetupView } from './views/ProfileSetupView';
import { AuthenticatingView } from './views/AuthenticatingView';
import { AuthErrorView } from './views/AuthErrorView';
import { AuthSuccessView } from './views/AuthSuccessView';
import { NexOrbitLogo } from './NexOrbitLogo';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';

export interface AuthContainerProps {
  className?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ className }) => {
  const { authView, language, setLanguage } = useAuth();
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const renderCurrentView = () => {
    switch (authView) {
      case 'welcome':
      case 'email-signin':
        return <WelcomeView />;
      case 'create-account':
        return <CreateAccountView />;
      case 'password':
        return <PasswordInputView />;
      case 'forgot-password':
        return <ForgotPasswordView />;
      case 'profile-setup':
        return <ProfileSetupView />;
      case 'authenticating':
        return <AuthenticatingView />;
      case 'error':
        return <AuthErrorView />;
      case 'success':
        return <AuthSuccessView />;
      default:
        return <WelcomeView />;
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between antialiased selection:bg-slate-200 selection:text-slate-900',
        className
      )}
    >
      {/* Top Right Language Selector */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-12 z-50">
        <div className="flex items-center p-1 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 rounded-full transition-colors">
          <button 
            onClick={() => setLanguage('en')}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all", language === 'en' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>English</span>
            <ChevronDown className="h-3 w-3 ml-0.5 opacity-50" />
          </button>
          <button 
            onClick={() => setLanguage('hi')}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", language === 'hi' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            हिन्दी
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen p-4 sm:p-8 lg:p-12 items-center">
        {/* Left Column: Brand Hero & Orbital Visuals (Desktop) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between h-full pr-8 xl:pr-16 py-6 select-none relative">
          {/* Top Brand Logo */}
          <div className="flex items-center justify-between w-full">
            <NexOrbitLogo variant="full" size="md" />
          </div>

          {/* Center Content Panel with Vertical Hierarchy */}
          <div className="my-auto py-8 flex flex-col gap-8">
            
            {/* 1. Brand Greeting & Typography (Eyebrow, Headline, Subtext) */}
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/50 text-indigo-600 text-xs font-semibold select-none w-fit">
                <Zap className="h-3.5 w-3.5 text-indigo-500 fill-indigo-100" />
                <span>Welcome to NexOrbit</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your AI workspace <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">for the future.</span>
              </h1>
              <p className="text-[15px] text-slate-500 font-normal leading-relaxed max-w-md">
                One secure place for all your work, AI agents, and integrations.
              </p>
            </div>

            {/* 2. Dedicated Orbital Visual Zone (Ensures ZERO overlap with text) */}
            <div className="relative w-full max-w-lg aspect-[1.85/1] bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner p-4">
              {/* High-Precision Orbital SVG */}
              <svg viewBox="0 0 480 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[220px]">
                {/* Defs for glow filters and rich gradients */}
                <defs>
                  <linearGradient id="orbGradientLeft" x1="40" y1="20" x2="440" y2="220" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" stopOpacity="0.35" />
                    <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#94A3B8" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="nucleusGrad" x1="220" y1="100" x2="260" y2="140" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#2563EB" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Subtle outer orbit track */}
                <ellipse cx="240" cy="120" rx="180" ry="76" stroke="url(#orbGradientLeft)" strokeWidth="1" strokeDasharray="3 5" className="opacity-60" />
                
                {/* Inner principal orbit track */}
                <ellipse cx="240" cy="120" rx="110" ry="46" stroke="url(#orbGradientLeft)" strokeWidth="1.5" />

                {/* Micro orbit track (inclined) */}
                <ellipse cx="240" cy="120" rx="60" ry="25" transform="rotate(-15 240 120)" stroke="url(#orbGradientLeft)" strokeWidth="1" strokeDasharray="2 2" />

                {/* Glowing Nucleus Core (NexOrbit Brain) */}
                <circle cx="240" cy="120" r="14" fill="url(#nucleusGrad)" filter="url(#glow)" className="opacity-95" />
                <circle cx="240" cy="120" r="6" fill="#FFFFFF" />

                {/* Floating Intelligence Nodes */}
                {/* Node 1: Connector (Google) on outer ring */}
                <g className="translate-x-[60px] translate-y-[120px]">
                  <circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#6366F1" strokeWidth="1.5" filter="url(#glow)" />
                  <circle cx="0" cy="0" r="3.5" fill="#6366F1" />
                </g>

                {/* Node 2: GitHub on inner ring */}
                <g className="translate-x-[310px] translate-y-[86px]">
                  <circle cx="0" cy="0" r="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="3" fill="#1E293B" />
                </g>

                {/* Node 3: AI Agent on inner ring */}
                <g className="translate-x-[150px] translate-y-[145px]">
                  <circle cx="0" cy="0" r="8" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2" />
                  <polygon points="150,143 152,148 147,146" transform="translate(-149.5, -145.5)" fill="#4F46E5" />
                </g>

                {/* Node 4: Calendar Node on outer ring */}
                <g className="translate-x-[400px] translate-y-[135px]">
                  <circle cx="0" cy="0" r="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2.5" fill="#3B82F6" />
                </g>

                {/* Connective Linker Rays */}
                <line x1="240" y1="120" x2="60" y2="120" stroke="#818CF8" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
                <line x1="240" y1="120" x2="310" y2="86" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
                <line x1="240" y1="120" x2="150" y2="145" stroke="#818CF8" strokeWidth="1" strokeDasharray="3 3" className="opacity-45" />
              </svg>
            </div>

            {/* 3. Three Benefits (Icon + Title + Description) */}
            <div className="grid grid-cols-1 gap-5 max-w-lg mt-2">
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5 shadow-sm">
                  <Shield className="h-4.5 w-4.5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    Enterprise-grade security
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                    Your data is encrypted and always protected.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 shadow-sm">
                  <Zap className="h-4.5 w-4.5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    Seamless &amp; fast
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                    Built for speed, simplicity, and productivity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-blue-600 shrink-0 mt-0.5 shadow-sm">
                  <Lock className="h-4.5 w-4.5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    Privacy first
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                    You own your data. We respect that.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Footer Copyright */}
          <div className="text-xs text-slate-400 font-normal">
            &copy; 2025 NexOrbit. All rights reserved.
          </div>
        </div>

        {/* Right Column: Centered Elevated Auth Card (Desktop & Mobile) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center w-full py-4 sm:py-8">
          {/* Mobile Top Brand Header */}
          <div className="flex lg:hidden flex-col items-center justify-center mb-8 text-center select-none">
            <NexOrbitLogo variant="full" size="md" />
          </div>

          {/* Elevated Auth Card */}
          <div className="w-full max-w-[460px] bg-white rounded-3xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-200/70 transition-all duration-200">
            {renderCurrentView()}
          </div>

          {/* Terms and Privacy Policy Note below Card */}
          <div className="mt-6 text-center max-w-sm px-4">
            <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
              By continuing, you agree to our{' '}
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="text-slate-600 hover:text-slate-950 font-medium underline underline-offset-2 cursor-pointer transition-colors"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="text-slate-600 hover:text-slate-950 font-medium underline underline-offset-2 cursor-pointer transition-colors"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Terms of Service & Privacy Policy Modals */}
      <Modal
        isOpen={legalModal !== null}
        onClose={() => setLegalModal(null)}
        title={legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        description={`NexOrbit ${legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'} Agreement`}
      >
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-80 overflow-y-auto pr-1">
          {legalModal === 'terms' ? (
            <>
              <p>
                Welcome to NexOrbit. By accessing or using our personal AI workspace platform and associated services, you agree to be bound by these Terms of Service.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">1. Your AI Workspace</h4>
              <p>
                NexOrbit provides a privacy-first personal AI intelligence engine. You retain full ownership and intellectual property rights to all prompts, data, context vectors, and workspace contents.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">2. Acceptable Use</h4>
              <p>
                You agree not to misuse the NexOrbit services or assist anyone else in doing so, including attempting unauthorized access to any system or automated rate abuse.
              </p>
            </>
          ) : (
            <>
              <p>
                At NexOrbit, your privacy and data sovereignty are paramount. We design all AI workspaces with strict boundary isolation.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">1. Data Ownership</h4>
              <p>
                Your personal notes, emails, documents, and brain context memory vectors are strictly isolated to your authenticated account and are never used to train public machine learning foundation models.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">2. Encryption</h4>
              <p>
                All workspace data is encrypted at rest and in transit using modern cryptographic standards.
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
