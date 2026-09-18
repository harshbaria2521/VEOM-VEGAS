'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { translations } from '../../lib/translations';
import { ShieldCheck, User, Lock, MessageSquare, Phone, LogOut, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';

export default function VictimProfilePage() {
  const router = useRouter();
  const { victim, logoutVictim, lang } = useAuth();
  const t = translations[lang] || translations.en;

  const [consentInfo, setConsentInfo] = useState(null);
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    try {
      const storedConsent = localStorage.getItem('svi_victim_consent');
      if (storedConsent) {
        setConsentInfo(JSON.parse(storedConsent));
      }
      const chatHist = localStorage.getItem('svi_active_chat_history');
      if (chatHist) {
        const parsed = JSON.parse(chatHist);
        setChatCount(parsed.length);
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    logoutVictim();
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-teal dark:text-teal-400 hover:text-gov-navy dark:hover:text-teal-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'hi' ? 'चैट पर वापस जाएं' : 'Back to SVI Support Portal'}</span>
      </Link>

      <div className="bg-white dark:bg-slate-800/95 rounded-xl border border-gov-border dark:border-slate-700 shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy dark:bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-amber-300">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                {victim?.name || (lang === 'hi' ? 'पीड़ित / शिकायतकर्ता प्रोफ़ाइल' : 'Complainant Profile')}
              </h1>
              <p className="text-xs text-slate-300 dark:text-slate-400">
                {lang === 'hi' ? 'आपकी पंजीकृत जानकारी एवं सहमति स्थिति' : 'Your Submitted Information & Protected Record'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs sm:text-sm text-gov-textMain dark:text-slate-200">
          {/* Unique Case / Ticket ID Badge */}
          <div className="p-4 bg-gov-cream dark:bg-slate-900/60 rounded-xl border border-gov-border dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-gov-textMuted dark:text-slate-400 text-xs font-medium block">
                {lang === 'hi' ? 'आपका यूनिक केस / टिकट आईडी' : 'Your Unique Case Ticket ID'}
              </span>
              <span className="font-mono text-base font-bold text-gov-navy dark:text-slate-100">
                {victim?.id || 'SVI-NHAA-ACTIVE'}
              </span>
            </div>
            <span className="text-[11px] font-bold bg-gov-tealSoft dark:bg-teal-950/50 text-gov-teal dark:text-teal-300 px-2.5 py-1 rounded border border-gov-teal/20 dark:border-teal-800/40">
              NHAA 14566 Verified
            </span>
          </div>

          {/* Privacy & Safety Guarantee */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5 text-slate-700 dark:text-slate-300 text-xs">
            <div className="flex items-center gap-2 font-bold text-gov-navy dark:text-slate-100">
              <Lock className="w-4 h-4 text-gov-teal dark:text-teal-400" />
              <span>{lang === 'hi' ? 'डेटा सुरक्षा एवं NHAA गोपनीयता' : 'Data Privacy & NHAA Shield'}</span>
            </div>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'आपकी जानकारी केवल NHAA के अधिकृत अधिकारियों के साथ सहायता प्रदान करने हेतु साझा की जाती है। आपका डेटा किसी भी तृतीय-पक्ष या वाणिज्यिक उपयोग के लिए सुरक्षित है।'
                : 'Your data is strictly shared with authorized NHAA protection officers for grievance redressal and psychological aid. It is encrypted and protected under DPDP Act.'}
            </p>
          </div>

          {/* Consent Status Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gov-navy dark:text-slate-200">
              {lang === 'hi' ? 'सक्रिय सहमति अनुमतियाँ (Consent Status)' : 'Active Consent Permissions'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gov-cream dark:bg-slate-900/60 rounded-lg border border-gov-border dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold text-xs text-gov-navy dark:text-slate-200">Text Analysis:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              </div>
              <div className="p-3 bg-gov-cream dark:bg-slate-900/60 rounded-lg border border-gov-border dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold text-xs text-gov-navy dark:text-slate-200">Voice Emotion Triage:</span>
                <span className={`font-bold flex items-center gap-1 ${consentInfo?.voiceConsent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {consentInfo?.voiceConsent ? <CheckCircle2 className="w-3.5 h-3.5" /> : '•'}
                  {consentInfo?.voiceConsent ? 'Opted-In' : 'Not Opted'}
                </span>
              </div>
            </div>
          </div>

          {/* Chat Session Activity */}
          <div className="p-4 bg-white dark:bg-slate-900/50 border border-gov-border dark:border-slate-700 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gov-navy dark:text-slate-100">
                <MessageSquare className="w-4 h-4 text-gov-teal dark:text-teal-400" />
                <span>{lang === 'hi' ? 'सत्र संवाद इतिहास' : 'Active Session Interactions'}</span>
              </div>
              <span className="text-xs text-gov-textMuted dark:text-slate-400">
                {chatCount > 0 ? `${chatCount} messages recorded` : 'No messages yet'}
              </span>
            </div>
            <p className="text-xs text-gov-textMuted dark:text-slate-400">
              {lang === 'hi'
                ? 'आपके सभी प्रश्न और काउंसलर सिफारिशें इस सत्र में सुरक्षित रूप से दर्ज हैं।'
                : 'Your session exchanges are linked to your case ticket for officer review upon request.'}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 bg-gov-teal hover:bg-gov-navy dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold rounded-lg text-center shadow transition-colors"
            >
              {lang === 'hi' ? 'सहायता चैट जारी रखें' : 'Continue Support Chat'}
            </Link>
            <Link
              href="/consent"
              className="py-2.5 px-4 bg-gov-cream dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-gov-navy dark:text-slate-200 text-xs font-bold rounded-lg border border-gov-border dark:border-slate-600 text-center transition-colors"
            >
              {lang === 'hi' ? 'सहमति बदलें' : 'Manage Consent'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
