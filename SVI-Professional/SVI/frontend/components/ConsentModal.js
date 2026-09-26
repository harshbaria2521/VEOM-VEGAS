'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/authContext';
import { translations } from '../lib/translations';
import { ShieldCheck, Lock, AlertCircle, Phone, CheckCircle2 } from 'lucide-react';

export default function ConsentModal({ onConsentComplete, isOpen = true }) {
  const { lang } = useAuth();
  const t = translations[lang] || translations.en;

  const [textConsent, setTextConsent] = useState(true);
  const [voiceConsent, setVoiceConsent] = useState(false);
  const [declined, setDeclined] = useState(false);

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

  const handleAccept = () => {
    const consentPayload = {
      textConsent,
      voiceConsent,
      timestamp: new Date().toISOString(),
      version: '1.0-MoSJE-NHAA',
    };
    try {
      localStorage.setItem('svi_victim_consent', JSON.stringify(consentPayload));
    } catch (e) {}
    onConsentComplete(consentPayload);
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 max-w-xl w-full rounded-xl shadow-2xl border border-gov-border dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gov-navy dark:bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-gov-border dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">{t.consentTitle}</h3>
              <p className="text-xs text-slate-300 dark:text-slate-400 font-medium">National Helpline Against Atrocities (14566)</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm text-gov-textMain dark:text-slate-200 max-h-[75vh] overflow-y-auto">
          {declined ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-lg space-y-3 text-gov-navy dark:text-slate-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200">Direct Helpline Access Available</h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                    Declining automated AI assessment will never block your access to human care. You can immediately reach out to our trained officers via phone:
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200 dark:border-amber-800/50 flex flex-col gap-2">
                <a
                  href="tel:14566"
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-md border border-amber-200 dark:border-amber-800/40 font-bold text-gov-navy dark:text-slate-100 hover:bg-amber-100/50 dark:hover:bg-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gov-teal dark:text-teal-400" /> National Helpline (NHAA)
                  </span>
                  <span className="text-gov-teal dark:text-teal-400 font-mono">14566</span>
                </a>
                <a
                  href="tel:14416"
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-md border border-amber-200 dark:border-amber-800/40 font-bold text-gov-navy dark:text-slate-100 hover:bg-amber-100/50 dark:hover:bg-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gov-teal dark:text-teal-400" /> Tele-MANAS (Psychological Support)
                  </span>
                  <span className="text-gov-teal dark:text-teal-400 font-mono">14416</span>
                </a>
              </div>
              <div className="text-center pt-2">
                <button
                  onClick={() => setDeclined(false)}
                  className="text-xs text-gov-teal dark:text-teal-400 underline font-medium hover:text-gov-navy dark:hover:text-teal-300"
                >
                  Back to consent options
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-gov-textMuted dark:text-slate-400 leading-relaxed">
                {t.consentSubtitle}
              </p>

              {/* Text Consent Option */}
              <label className="flex items-start gap-3 p-3.5 bg-gov-cream dark:bg-slate-900/60 rounded-lg border border-gov-border dark:border-slate-700 cursor-pointer hover:border-gov-teal/50 dark:hover:border-teal-500 transition-colors">
                <input
                  type="checkbox"
                  checked={textConsent}
                  onChange={(e) => setTextConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 text-gov-teal rounded border-gray-300 focus:ring-gov-teal cursor-pointer"
                />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-gov-navy dark:text-slate-100 block">Text-Based Interaction & Triage</span>
                  <span className="text-gov-textMuted dark:text-slate-400 block">{t.consentTextAnalysis}</span>
                </div>
              </label>

              {/* Voice Emotion Consent Option (Distinct Toggle) */}
              <label className="flex items-start gap-3 p-3.5 bg-gov-cream dark:bg-slate-900/60 rounded-lg border border-gov-border dark:border-slate-700 cursor-pointer hover:border-gov-teal/50 dark:hover:border-teal-500 transition-colors">
                <input
                  type="checkbox"
                  checked={voiceConsent}
                  onChange={(e) => setVoiceConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 text-gov-teal rounded border-gray-300 focus:ring-gov-teal cursor-pointer"
                />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-gov-navy dark:text-slate-100 block">Voice Emotion & Tone Analysis (Optional)</span>
                  <span className="text-gov-textMuted dark:text-slate-400 block">{t.consentVoiceAnalysis}</span>
                </div>
              </label>

              {/* Privacy guarantees */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Lock className="w-4 h-4 text-gov-teal dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <p>{t.consentPrivacyNote}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleAccept}
                  disabled={!textConsent}
                  className="w-full sm:w-2/3 py-2.5 px-4 bg-gov-teal hover:bg-gov-navy dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  {t.consentAccept}
                </button>
                <button
                  onClick={handleDecline}
                  className="w-full sm:w-1/3 py-2.5 px-4 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 transition-colors"
                >
                  {t.consentDecline}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
