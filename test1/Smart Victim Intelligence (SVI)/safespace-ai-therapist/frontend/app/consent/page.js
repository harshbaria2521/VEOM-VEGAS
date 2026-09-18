'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/authContext';
import { translations } from '../../lib/translations';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, Phone, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ConsentPage() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.en;

  const [textConsent, setTextConsent] = useState(true);
  const [voiceConsent, setVoiceConsent] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('svi_victim_consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        setTextConsent(parsed.textConsent ?? true);
        setVoiceConsent(parsed.voiceConsent ?? false);
      }
    } catch (e) {}
  }, []);

  const handleSave = () => {
    const payload = {
      textConsent,
      voiceConsent,
      timestamp: new Date().toISOString(),
      version: '1.0-MoSJE-NHAA',
    };
    try {
      localStorage.setItem('svi_victim_consent', JSON.stringify(payload));
      setSavedMessage('Your consent preferences have been updated.');
      setTimeout(() => setSavedMessage(''), 4000);
    } catch (e) {}
  };

  const handleRevokeAll = () => {
    setTextConsent(false);
    setVoiceConsent(false);
    try {
      localStorage.removeItem('svi_victim_consent');
      setSavedMessage('All AI analysis consent has been withdrawn. You can still use the 14566 phone helpline.');
      setTimeout(() => setSavedMessage(''), 4000);
    } catch (e) {}
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gov-teal dark:text-teal-400 hover:text-gov-navy dark:hover:text-teal-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to SVI Support Portal</span>
      </Link>

      {/* Main Consent Card */}
      <div className="bg-white dark:bg-slate-800/95 rounded-xl border border-gov-border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="bg-gov-navy dark:bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-lg text-amber-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">{t.consentTitle}</h1>
              <p className="text-xs text-slate-300 dark:text-slate-400 font-medium">
                {t.ministry} • DPDP Compliance
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 text-sm text-gov-textMain dark:text-slate-200">
          {savedMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{savedMessage}</span>
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-2">
            <h2 className="font-bold text-gov-navy dark:text-slate-100 text-sm sm:text-base">Why We Collect Data & How It Protects You</h2>
            <p className="text-xs text-gov-textMuted dark:text-slate-400 leading-relaxed">
              Under the National Helpline Against Atrocities (14566) framework, automated emotional analysis is used solely to assess the urgency of distress and connect you with human counsellors faster. We never sell, advertise, or commercially exploit any interaction data.
            </p>
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-2">
            {/* Text Toggle */}
            <div className="p-4 bg-gov-cream dark:bg-slate-900/50 rounded-lg border border-gov-border dark:border-slate-700 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-gov-navy dark:text-slate-100 text-sm block">1. Text-Based Trauma Assessment</span>
                <p className="text-xs text-gov-textMuted dark:text-slate-400">
                  Enables real-time natural language triage to flag acute distress, discrimination trauma, or emergency risk.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={textConsent}
                  onChange={(e) => setTextConsent(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gov-teal"></div>
              </label>
            </div>

            {/* Voice Toggle */}
            <div className="p-4 bg-gov-cream dark:bg-slate-900/50 rounded-lg border border-gov-border dark:border-slate-700 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-gov-navy dark:text-slate-100 text-sm block">2. Voice Tone & Emotion Analysis (Optional)</span>
                <p className="text-xs text-gov-textMuted dark:text-slate-400">
                  Analyzes pitch, cadence, and vocal tremors during voice helpline interactions to detect panic or distress.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={voiceConsent}
                  onChange={(e) => setVoiceConsent(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gov-teal"></div>
              </label>
            </div>
          </div>

          {/* Privacy Notice Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-gov-navy dark:text-slate-100">
              <Lock className="w-4 h-4 text-gov-teal dark:text-teal-400" />
              <span>Right to Withdraw & Pseudonymity</span>
            </div>
            <p className="leading-relaxed">
              You retain the right to withdraw your consent at any time. When consent is withdrawn, your previous session data is pseudonymized and de-linked. Withdrawing AI consent does not prevent you from receiving manual assistance from our human counsellors.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gov-border dark:border-slate-700">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-2.5 bg-gov-teal hover:bg-gov-navy dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Save Consent Preferences</span>
            </button>

            <button
              onClick={handleRevokeAll}
              className="w-full sm:w-auto px-4 py-2.5 bg-transparent hover:bg-red-50 dark:hover:bg-red-950/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg border border-red-200 dark:border-red-800/50 transition-colors"
            >
              Revoke All AI Consent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
