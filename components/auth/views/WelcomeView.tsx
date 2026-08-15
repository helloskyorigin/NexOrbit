'use client';

import React, { useState, useRef } from 'react';
import { Mail, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';
import { validateEmailInput } from '../authErrors';

export const WelcomeView: React.FC = () => {
  const {
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    setAuthView,
    authView,
    loading,
    oauthLoading,
    authErrorInfo,
    clearError,
    pendingEmail,
  } = useAuth();

  const [emailInput, setEmailInput] = useState(pendingEmail || '');
  const [localEmailError, setLocalEmailError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const isEmailError = localEmailError !== null || (authErrorInfo?.targetField === 'email');
  const emailErrorMessage = localEmailError || (authErrorInfo?.targetField === 'email' ? authErrorInfo.message : null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || oauthLoading) return;

    if (!emailInput || emailInput.trim().length === 0) {
      setLocalEmailError('Enter your email address.');
      emailInputRef.current?.focus();
      return;
    }

    const validation = validateEmailInput(emailInput);
    if (!validation.isValid) {
      setLocalEmailError(validation.error || 'Enter a valid email address.');
      emailInputRef.current?.focus();
      return;
    }

    setLocalEmailError(null);
    clearError();
    signInWithEmail(validation.cleanEmail);
  };

  const isAnyLoading = loading || oauthLoading !== null;

  if (authView === 'email-signin') {
    return (
      <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-2">
          <button 
            onClick={() => {
              clearError();
              setAuthView('welcome');
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
            Sign in with email
          </h1>
          <p className="text-[15px] text-slate-500 font-normal leading-relaxed">
            Enter your email to continue.
          </p>
        </div>

        {authErrorInfo && authErrorInfo.targetField !== 'email' && (
          <AuthErrorBanner
            error={authErrorInfo}
            onDismiss={clearError}
          />
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="welcome-email" className="text-[13px] font-medium text-slate-700 block">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                ref={emailInputRef}
                id="welcome-email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck="false"
                value={emailInput}
                disabled={isAnyLoading}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (localEmailError) setLocalEmailError(null);
                  if (authErrorInfo) clearError();
                }}
                placeholder="name@company.com"
                required
                autoFocus
                className={`w-full h-[52px] pl-[42px] pr-4 text-[15px] bg-white text-slate-900 placeholder:text-slate-400 rounded-[16px] border transition-all duration-200 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                  isEmailError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-[3px] focus:ring-rose-500/15'
                    : 'border-slate-200 focus:border-slate-950 focus:ring-[3px] focus:ring-slate-950/10'
                }`}
              />
            </div>

            {isEmailError && emailErrorMessage && (
              <div className="flex items-center justify-between pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <p className="text-[13px] text-rose-600 font-medium">
                  {emailErrorMessage}
                </p>
                {authErrorInfo?.actionType === 'signup' && (
                  <button
                    type="button"
                    onClick={() => {
                      clearError();
                      setAuthView('create-account');
                    }}
                    className="text-[13px] text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
                  >
                    Create account
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isAnyLoading}
            className="w-full h-[52px] px-5 rounded-[16px] bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
          >
            {loading && !oauthLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            ) : (
              <span>Continue with email</span>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
          Sign in to NexOrbit
        </h1>
        <p className="text-[15px] text-slate-500 font-normal leading-relaxed">
          Access your AI workspace
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mt-8 mb-6">
        <button className="flex-1 pb-3 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 relative">
          Sign in
        </button>
        <button 
          onClick={() => {
            clearError();
            setAuthView('create-account');
          }}
          className="flex-1 pb-3 text-sm font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-colors"
        >
          Sign up
        </button>
      </div>

      {/* General (Non-field-specific) Error Banner */}
      {authErrorInfo && authErrorInfo.targetField !== 'email' && (
        <AuthErrorBanner
          error={authErrorInfo}
          onDismiss={clearError}
          onAction={(actionType) => {
            if (actionType === 'signup') {
              clearError();
              setAuthView('create-account');
            }
          }}
        />
      )}

      {/* Social Alternative Options */}
      <div className="space-y-3.5 mt-6">
        {/* Google Primary */}
        <button
          onClick={signInWithGoogle}
          disabled={isAnyLoading}
          type="button"
          className="w-full h-[52px] px-5 rounded-[16px] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            {oauthLoading === 'google' ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            ) : (
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </div>
          <svg className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* GitHub Primary */}
        <button
          onClick={signInWithGitHub}
          disabled={isAnyLoading}
          type="button"
          className="w-full h-[52px] px-5 rounded-[16px] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            {oauthLoading === 'github' ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
            ) : (
              <svg className="h-5 w-5 shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            )}
            <span>Continue with GitHub</span>
          </div>
          <svg className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <span className="relative bg-white px-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
          OR
        </span>
      </div>

      {/* Primary Email Flow (as button taking to email view) */}
      <button
        onClick={() => {
          clearError();
          setAuthView('email-signin');
        }}
        disabled={isAnyLoading}
        type="button"
        className="w-full h-[52px] px-5 rounded-[16px] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 flex items-center justify-between cursor-pointer group mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-5 w-5 text-indigo-600">
             <Mail className="h-5 w-5" />
          </div>
          <span>Continue with Email</span>
        </div>
        <svg className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Footer Security Note */}
      <div className="pt-6 border-t border-slate-100 mt-4 text-center flex items-center justify-center gap-1.5 text-slate-400">
        <Lock className="h-3.5 w-3.5" />
        <span className="text-[13px] font-medium">Secured by industry-leading encryption</span>
      </div>
    </div>
  );
};
