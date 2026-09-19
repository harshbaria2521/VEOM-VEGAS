'use client';

import React, { useState, useEffect } from 'react';
import ChatWidget from '../components/ChatWidget';
import ConsentModal from '../components/ConsentModal';
import { useAuth } from '../lib/authContext';
import { translations } from '../lib/translations';
import { Shield, Phone, HeartHandshake, Lock, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.en;

  const [hasConsented, setHasConsented] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('svi_victim_consent');
      if (stored) {
        setHasConsented(true);
        setShowConsentModal(false);
      } else {
        setShowConsentModal(true);
      }
    } catch (e) {
      setShowConsentModal(true);
    }
  }, []);

  const handleConsentComplete = () => {
    setHasConsented(true);
    setShowConsentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Consent Modal Trigger */}
      {showConsentModal && (
        <ConsentModal
          isOpen={showConsentModal}
          onConsentComplete={handleConsentComplete}
        />
      )}

      {/* Hero / Information Header */}
      <div className="bg-gradient-to-r from-gov-navy to-gov-teal dark:from-slate-900 dark:to-teal-950 rounded-xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-transparent dark:border-slate-800 transition-colors">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest bg-amber-400 text-gov-navyDark px-2.5 py-0.5 rounded">
              Official Ministry Portal
            </span>
            <span className="text-xs text-amber-200">
              National Helpline Against Atrocities (14566)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t.portalTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {t.portalDescription || (lang === 'hi'
              ? "यदि आप या आपका कोई परिचित किसी भेदभाव, उत्पीड़न या संकट का सामना कर रहा है, तो SVI आपको तत्काल मनोवैज्ञानिक सहायता और उचित अधिकारियों से जोड़ने में मदद करता है।"
              : "A dedicated, confidential support channel providing real-time emotional triage, legal aid connection, and trauma-informed care for victims.")}
          </p>
        </div>

        {/* Quick Consent Status & Info */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-teal-100">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>DPDP Encrypted & Anonymized</span>
          </div>
          <Link
            href="/consent"
            className="text-amber-300 hover:underline text-xs font-semibold flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Manage Consent Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Chat Intake Widget */}
      <ChatWidget />
    </div>
  );
}
