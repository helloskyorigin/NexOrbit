'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  User,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  ChevronDown,
  Clock,
  Loader2,
  Globe,
  Languages,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';
import { Language, SUPPORTED_LANGUAGES } from '../translations';
import { COUNTRIES, Country, getSensibleDetectedTimezone } from '../countries';
import { validateNameInput } from '../authErrors';
import { cn } from '../../../lib/utils';

export const ProfileSetupView: React.FC = () => {
  const { user, completeProfileSetup, loading, authErrorInfo, clearError } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [displayName, setDisplayName] = useState(() => {
    if (user?.displayName && user.displayName !== 'User') {
      return user.displayName;
    }
    if (typeof window !== 'undefined') {
      try {
        const tempName = localStorage.getItem('nexorbit_temp_fullname');
        if (tempName) return tempName;
      } catch (e) {}
    }
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return '';
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => user?.language || 'en');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    () => COUNTRIES.find((c) => c.code === 'IN') || COUNTRIES[0]
  );
  const [selectedTimezone, setSelectedTimezone] = useState<string>(() => getSensibleDetectedTimezone().timezone);

  // Country dropdown state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const q = searchQuery.toLowerCase().trim();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    if (country.timezone) {
      setSelectedTimezone(country.timezone);
    }
    setIsCountryOpen(false);
    setSearchQuery('');
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    const validation = validateNameInput(displayName);
    if (!validation.isValid) {
      setNameError(validation.error || 'Enter your name.');
      nameInputRef.current?.focus();
      return;
    }
    clearError();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const validation = validateNameInput(displayName);
    if (!validation.isValid) {
      setStep(1);
      setNameError(validation.error || 'Enter your name.');
      return;
    }
    clearError();
    completeProfileSetup({
      displayName: validation.cleanName,
      country: selectedCountry ? `${selectedCountry.name} ${selectedCountry.flag}` : 'India 🇮🇳',
      language: selectedLanguage,
      timezone: selectedTimezone,
    });
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Step Indicator Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>
            {step === 1 && 'Step 1 of 3: Your Name'}
            {step === 2 && 'Step 2 of 3: Country / Region'}
            {step === 3 && 'Step 3 of 3: Language'}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {step === 1 && '33%'}
            {step === 2 && '66%'}
            {step === 3 && '100%'}
          </span>
        </div>
        {/* Multi-segment Progress Bar */}
        <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
          <div className={cn('h-full rounded-full transition-all duration-300', step >= 1 ? 'bg-slate-950' : 'bg-slate-200')} />
          <div className={cn('h-full rounded-full transition-all duration-300', step >= 2 ? 'bg-slate-950' : 'bg-slate-200')} />
          <div className={cn('h-full rounded-full transition-all duration-300', step >= 3 ? 'bg-slate-950' : 'bg-slate-200')} />
        </div>
      </div>

      {authErrorInfo && (
        <AuthErrorBanner error={authErrorInfo} onDismiss={clearError} />
      )}

      {/* ================= STEP 1: NAME ================= */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-6 animate-in fade-in duration-150" noValidate>
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
              What&apos;s your name?
            </h1>
            <p className="text-[15px] text-slate-500 font-normal leading-relaxed">
              We&apos;ll use this name across your workspace profile.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                ref={nameInputRef}
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="e.g. Alex Morgan"
                className={cn(
                  'w-full h-[52px] pl-[42px] pr-4 text-[15px] bg-white text-slate-900 placeholder:text-slate-400 rounded-[16px] border focus:outline-none transition-all duration-150',
                  nameError
                    ? 'border-red-300 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/10'
                    : 'border-slate-200 focus:border-slate-950 focus:ring-[3px] focus:ring-slate-950/10'
                )}
                autoFocus
              />
            </div>
            {nameError && (
              <p className="text-[13px] text-red-600 font-medium animate-in fade-in-50 pt-1">
                {nameError}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-[52px] px-5 rounded-[16px] bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      )}

      {/* ================= STEP 2: COUNTRY / REGION ================= */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-6 animate-in fade-in duration-150" noValidate>
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
              Where are you based?
            </h1>
            <p className="text-[15px] text-slate-500 font-normal leading-relaxed">
              Select your country or region for localized settings.
            </p>
          </div>

          <div className="space-y-1.5" ref={dropdownRef}>
            <label className="text-[13px] font-medium text-slate-700 block">
              Country / Region
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setSearchQuery('');
                }}
                className="w-full h-[52px] px-4 text-[15px] bg-white hover:bg-slate-50 text-slate-900 rounded-[16px] border border-slate-200 focus:border-slate-950 focus:ring-[3px] focus:ring-slate-950/10 focus:outline-none text-left flex items-center justify-between transition-all duration-150 cursor-pointer"
              >
                {selectedCountry ? (
                  <span className="flex items-center gap-3">
                    <span className="text-[22px] leading-none select-none">{selectedCountry.flag}</span>
                    <span className="font-medium text-slate-900 text-[15px]">{selectedCountry.name}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-[15px]">Select country</span>
                )}
                <ChevronDown className="h-5 w-5 text-slate-400" />
              </button>

              {isCountryOpen && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-[16px] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="relative border-b border-slate-100 p-2">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full h-10 pl-9 pr-3 bg-slate-50 text-[13px] text-slate-900 placeholder:text-slate-400 rounded-xl border-none focus:ring-2 focus:ring-slate-950 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={cn(
                            'w-full px-4 py-2.5 text-[15px] text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer',
                            selectedCountry?.code === country.code
                              ? 'bg-slate-50 text-slate-950 font-semibold'
                              : 'text-slate-700'
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-lg leading-none select-none">{country.flag}</span>
                            <span>{country.name}</span>
                          </span>
                          {selectedCountry?.code === country.code && (
                            <Check className="h-4 w-4 text-slate-950 shrink-0" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-[13px] text-center text-slate-400 font-medium">
                        No country found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-[52px] px-5 rounded-[16px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[15px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="flex-1 h-[52px] px-5 rounded-[16px] bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      )}

      {/* ================= STEP 3: PREFERRED LANGUAGE ================= */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-6 animate-in fade-in duration-150" noValidate>
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
              Preferred Language
            </h1>
            <p className="text-[15px] text-slate-500 font-normal leading-relaxed">
              Choose your primary language for the application interface.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={cn(
                    'p-4 rounded-[16px] border text-left flex items-center justify-between transition-all cursor-pointer h-[60px]',
                    isSelected
                      ? 'border-slate-950 bg-slate-950 text-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-[15px]'
                  )}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Languages className="h-5 w-5 opacity-70 shrink-0" />
                    <span className="truncate text-[15px] font-medium">{lang.nativeName}</span>
                  </span>
                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setStep(2)}
              className="h-[52px] px-5 rounded-[16px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[15px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-[52px] px-5 rounded-[16px] bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <span>Complete setup</span>
                  <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
