'use client';

import { useState, useEffect } from 'react';

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

export default function Home() {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSystemState() {
      try {
        const [healthRes, testRes] = await Promise.all([
          fetch('/api/health').then((r) => r.json()),
          fetch('/api/tests').then((r) => r.json()),
        ]);
        setHealth(healthRes);
        if (testRes.results) {
          setTestResults(testRes.results);
        }
      } catch (err) {
        console.error('Phase 0 load error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSystemState();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-mono font-medium px-3 py-1 rounded-full mb-3 border border-indigo-500/20">
            PHASE 0 ARCHITECTURAL FOUNDATION
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">NEXORBIT</h1>
          <p className="text-slate-400 mt-1">Your AI Brain for the Digital World.</p>
        </div>

        {/* Phase 0 Scope Notice */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
          <h2 className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Phase 0 Foundation Complete
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            The core server-side architecture, user isolation mechanisms, credit system (500 Free / 15,000 Pro), AI gateway model routing, connector abstractions, personal brain context boundaries, and multi-stage action verification state machines are now active. Visual dashboard UI and connectors will be built in Phase 1.
          </p>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">System Specifications</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Application</span>
                <span className="text-slate-200 font-medium">NEXORBIT</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Environment</span>
                <span className="text-emerald-400 font-medium">Cloud Run / Server Engine</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">V1 Free Allowance</span>
                <span className="text-slate-200 font-medium">500 credits / mo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">V1 Pro Allowance</span>
                <span className="text-indigo-400 font-medium">15,000 credits / mo (₹1,499)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">V1 Connectors</span>
                <span className="text-slate-200 font-medium">Gmail, Calendar, Drive, Notion, GitHub</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Architecture Boundaries</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300">User Data Isolation & Firestore Rules</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300">Server-Authoritative Credit System</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300">GoogleGenAI Model Gateway Router</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300">Personal Brain & Memory Service</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-300">Action Verification Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 0 Test Suite Verification */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Phase 0 Architectural Test Suite</h3>
            {loading ? (
              <span className="text-xs text-indigo-400 animate-pulse">Running verification...</span>
            ) : (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
                {testResults.filter((t) => t.passed).length} / {testResults.length} Passed
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {testResults.map((res, i) => (
              <div
                key={i}
                className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="font-medium text-slate-200 flex items-center gap-2">
                    <span className={res.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {res.passed ? '●' : '✕'}
                    </span>
                    {res.test}
                  </div>
                  <div className="text-slate-400 text-[11px] pl-4">{res.message}</div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded self-start sm:self-auto ${
                    res.passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950 text-rose-300'
                  }`}
                >
                  {res.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
