'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCaseStore } from '../../../lib/caseStore';
import HumanActionForm from '../../../components/HumanActionForm';
import { useAuth } from '../../../lib/authContext';
import { translations } from '../../../lib/translations';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Eye,
  EyeOff,
  Activity,
  Mic,
  Clock,
  UserCheck,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  PhoneCall,
  Download
} from 'lucide-react';
import { generateGrievancePDF } from '../../../lib/pdfGenerator';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.caseId;
  const { cases, applyHumanAction } = useCaseStore();
  const { lang, user } = useAuth();
  const t = translations[lang] || translations.en;

  const [showSensitiveTranscript, setShowSensitiveTranscript] = useState(false);


  const currentCase = cases.find((c) => c.id === caseId) || cases[0];

  if (!currentCase) {
    return (
      <div className="py-12 text-center text-gov-textMuted text-sm">
        Case not found.{' '}
        <Link href="/counsellor" className="text-gov-teal underline">
          Return to queue
        </Link>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-700 text-white';
      case 'High':
        return 'bg-rose-600 text-white';
      case 'Moderate':
        return 'bg-amber-600 text-white';
      case 'Low':
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  const deriveSuggestedPathway = (c) => {
    if (c.recommendedPathway) return c.recommendedPathway;
    switch (c.riskLevel) {
      case 'Critical':
        return 'Emergency escalation recommended — Immediate dispatch to 112 / Local Police & Emergency Safe Shelter';
      case 'High':
        return 'Immediate counselling recommended — Assign specialized trauma & legal aid officer within 30 minutes';
      case 'Moderate':
        return 'Follow-up counselling suggested — Schedule Tele-MANAS (14416) session and legal rights consultation';
      case 'Low':
      default:
        return 'Monitor / self-help resources — Provide digital informational guide, NGO directory, and helpline contact';
    }
  };

  const suggestedPathway = deriveSuggestedPathway(currentCase);

  return (
    <div className="space-y-6">

      {/* Top Breadcrumb / Back Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/counsellor"
          aria-label="Back to Case Priority Queue"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-teal hover:text-gov-navy transition-colors focus:ring-2 focus:ring-gov-teal rounded print:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Priority Queue</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => generateGrievancePDF(currentCase)}
            aria-label="Download Official Grievance Docket PDF"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
            <span>Official Grievance Docket (PDF)</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-gov-textMuted dark:text-slate-400">
            <span>Current Case:</span>
            <span className="font-mono font-bold text-gov-navy dark:text-slate-100 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-gov-border dark:border-slate-700">
              {currentCase.id}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-600 p-4 rounded-r-xl shadow-sm flex items-start gap-3 transition-colors">
        <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs text-amber-950 dark:text-amber-200">
          <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-900 dark:text-amber-300">
            Decision Support Notice (NHAA Protocol)
          </span>
          <p className="mt-0.5 leading-relaxed font-medium">
            {t.nonDiagnosticWarning} All routing decisions and risk determinations must be validated by an authorized officer.
          </p>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gov-border dark:border-slate-800 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-gov-navy dark:text-slate-100">
              {currentCase.id}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRiskColor(
                currentCase.riskLevel
              )}`}
            >
              {currentCase.riskLevel} Risk ({currentCase.riskScore || 85}/100)
            </span>
            <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
              Status: {currentCase.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gov-textMuted dark:text-slate-400">
            <span>Channel: <strong className="text-slate-800 dark:text-slate-200">{currentCase.channel}</strong></span>
            <span>•</span>
            <span>Language: <strong className="text-slate-800 dark:text-slate-200">{currentCase.language}</strong></span>
            <span>•</span>
            <span>Flagged: <strong className="text-slate-800 dark:text-slate-200">{currentCase.flaggedAt}</strong></span>
            <span>•</span>
            <span>Voice Consented: <strong className="text-slate-800 dark:text-slate-200">{currentCase.voiceConsented ? 'Yes' : 'No'}</strong></span>
          </div>
        </div>

        {/* AI Suggested Pathway Card */}
        <div className="bg-gov-cream dark:bg-slate-800/80 p-4 rounded-xl border border-gov-border dark:border-slate-700 text-xs max-w-md w-full shadow-xs transition-colors">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-bold text-gov-navy dark:text-slate-100 flex items-center gap-1.5 text-xs">
              <FileCheck className="w-4 h-4 text-gov-teal dark:text-teal-400" aria-hidden="true" />
              AI Suggested Pathway
            </span>
            <span className="text-[10px] bg-gov-teal/15 dark:bg-teal-900/60 text-gov-teal dark:text-teal-300 px-2 py-0.5 rounded font-semibold border border-gov-teal/30 dark:border-teal-700">
              Suggestion Only
            </span>
          </div>
          <p className="text-gov-textMain dark:text-slate-200 leading-relaxed font-semibold text-xs">
            {suggestedPathway}
          </p>
          <div className="mt-2 pt-1.5 border-t border-slate-300/60 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400 italic">
            * AI-generated, non-diagnostic suggestion only — requires officer confirmation.
          </div>
        </div>
      </div>

      {/* Grid: Contributing Signals & Human Validation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Contributing Indicators & Vocal Features */}
        <div className="space-y-6">
          {/* Contributing Indicators Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gov-border dark:border-slate-800 shadow-sm p-5 space-y-4 transition-colors">
            <div className="flex items-center gap-2 border-b border-gov-border dark:border-slate-800 pb-3">
              <Activity className="w-5 h-5 text-gov-teal dark:text-teal-400" />
              <h3 className="font-bold text-sm sm:text-base text-gov-navy dark:text-slate-100">
                {t.signalsDetected}
              </h3>
            </div>

            <div className="space-y-3">
              {(currentCase.indicators || []).map((ind, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-gov-cream dark:bg-slate-800/70 rounded-lg border border-gov-border dark:border-slate-700/80 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-bold text-xs text-gov-navy dark:text-slate-100 block">
                      {ind.name}
                    </span>
                    <span className="text-[11px] text-gov-textMuted dark:text-slate-400">
                      AI Confidence: {ind.confidence}%
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded uppercase border ${
                      ind.severity === 'critical'
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                        : ind.severity === 'high'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {ind.severity}
                  </span>
                </div>
              ))}
            </div>

            {/* Vocal Signals (If consented) */}
            {currentCase.voiceConsented && currentCase.vocalSignals && (
              <div className="mt-4 pt-3 border-t border-gov-border dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gov-navy dark:text-slate-100">
                  <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Acoustic / Speech Emotion Indicators (Consented)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-800/40">
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 block">Vocal Tremor</span>
                    <span className="font-bold text-purple-900 dark:text-purple-200">{currentCase.vocalSignals.tremorScore}</span>
                  </div>
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-800/40">
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 block">Pitch Stability</span>
                    <span className="font-bold text-purple-900 dark:text-purple-200">{currentCase.vocalSignals.pitchVariation}</span>
                  </div>
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-800/40">
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 block">Speech Cadence</span>
                    <span className="font-bold text-purple-900 dark:text-purple-200">{currentCase.vocalSignals.speechRate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gated Sensitive Content / Transcript Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gov-border dark:border-slate-800 shadow-sm p-5 space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-gov-border dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base text-gov-navy dark:text-slate-100">
                  {t.sensitiveTranscript}
                </h3>
              </div>
              <button
                type="button"
                aria-label={showSensitiveTranscript ? 'Hide sensitive case transcript' : 'Show sensitive case transcript'}
                aria-expanded={showSensitiveTranscript}
                onClick={() => setShowSensitiveTranscript(!showSensitiveTranscript)}
                className="text-xs font-bold bg-gov-cream dark:bg-slate-700/80 hover:bg-gov-sand dark:hover:bg-slate-700 text-gov-navy dark:text-slate-200 border border-gov-border dark:border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-gov-teal print:hidden"
              >
                {showSensitiveTranscript ? <EyeOff className="w-3.5 h-3.5" aria-hidden="true" /> : <Eye className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{showSensitiveTranscript ? t.hideTranscript : t.showTranscript}</span>
              </button>
            </div>

            {showSensitiveTranscript ? (
              <div className="space-y-3 bg-gov-cream/40 dark:bg-slate-900/60 p-4 rounded-lg border border-gov-border dark:border-slate-700 max-h-80 overflow-y-auto print:max-h-none print:overflow-visible">
                <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-800/50 mb-2 flex items-center justify-between">
                  <span>Officer Access Logged: Viewing raw complainant interaction for case {currentCase.id}.</span>
                  <span className="font-bold">{(currentCase.transcript || []).length} Messages</span>
                </div>

                {/* Gated Audio Playback (Voice-Consented Sessions) */}
                {currentCase.voiceConsented && (
                  <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 rounded-lg space-y-1.5 mb-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" aria-hidden="true" />
                        Voice Session Audio Playback
                      </span>
                      <span className="text-[10px] text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded font-semibold">
                        Voice Consented
                      </span>
                    </div>
                    {currentCase.audioUrl ? (
                      <audio
                        controls
                        aria-label="Play session audio recording"
                        className="w-full h-8 mt-1 print:hidden"
                        src={currentCase.audioUrl}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-800 p-2 rounded border border-purple-100 dark:border-purple-900/40 italic">
                        Audio recording not available for this session.
                      </div>
                    )}
                  </div>
                )}

                {(currentCase.transcript || []).map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      item.sender === 'Victim' || item.sender === 'user'
                        ? 'bg-white dark:bg-slate-800 border border-gov-border dark:border-slate-700 text-gov-navy dark:text-slate-200 font-medium'
                        : 'bg-gov-tealSoft dark:bg-teal-950/40 text-gov-teal dark:text-teal-300 border border-gov-teal/20 dark:border-teal-800/40'
                    }`}
                  >
                    <div className="font-bold mb-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {item.sender === 'user' ? 'Victim / Complainant' : item.sender}
                    </div>
                    <div>{item.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gov-textMuted dark:text-slate-400 text-xs space-y-2 bg-gov-cream/30 dark:bg-slate-900/40 rounded-lg border border-dashed border-gov-border dark:border-slate-700">
                <p>
                  To protect victim privacy and prevent unnecessary secondary trauma exposure, raw transcripts are gated.
                </p>
                <button
                  onClick={() => setShowSensitiveTranscript(true)}
                  className="text-xs font-bold text-gov-teal dark:text-teal-400 underline hover:text-gov-navy dark:hover:text-teal-300 print:hidden"
                >
                  Click to unlock sensitive dialogue
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Human-in-the-loop validation & Audit trail */}
        <div className="space-y-6">
          {/* Human Action Controls */}
          <div className="print:hidden">
            <HumanActionForm
              currentCase={currentCase}
              onPerformAction={(actionData) => applyHumanAction(currentCase.id, actionData)}
            />
          </div>

          {/* Audit Trail Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gov-border dark:border-slate-800 shadow-sm p-5 space-y-4 transition-colors">
            <div className="flex items-center gap-2 border-b border-gov-border dark:border-slate-800 pb-3">
              <Clock className="w-5 h-5 text-gov-teal dark:text-teal-400" />
              <h3 className="font-bold text-sm sm:text-base text-gov-navy dark:text-slate-100">
                {t.auditTrail}
              </h3>
            </div>

            <div className="space-y-3">
              {(currentCase.auditTrail || []).map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gov-cream dark:bg-slate-800/60 rounded-lg border border-gov-border dark:border-slate-700/80 text-xs space-y-1 transition-colors"
                >
                  <div className="flex items-center justify-between font-bold text-gov-navy dark:text-slate-200">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{log.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-gov-teal dark:text-teal-400 font-semibold">
                    Actor: {log.actor}
                  </div>
                  <p className="text-gov-textMain dark:text-slate-300 text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
