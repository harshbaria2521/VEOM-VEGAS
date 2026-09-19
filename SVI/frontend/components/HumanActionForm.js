'use client';

import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { translations } from '../lib/translations';
import { CheckCircle2, RefreshCw, AlertOctagon, FileText, Send, ShieldCheck } from 'lucide-react';

export default function HumanActionForm({ currentCase, onPerformAction }) {
  const { lang, user } = useAuth();
  const t = translations[lang] || translations.en;

  const [activeAction, setActiveAction] = useState('approve');
  const [overrideRisk, setOverrideRisk] = useState('Moderate');
  const [reason, setReason] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeAction === 'override' && !reason.trim()) {
      alert('Mandatory justification is required for overriding the AI assessment.');
      return;
    }

    onPerformAction({
      actionType: activeAction,
      newRiskLevel: activeAction === 'override' ? overrideRisk : currentCase.riskLevel,
      reason: reason.trim(),
      notes: internalNotes.trim(),
      officerName: user?.name || 'Officer Sharma (ID: 4120)',
    });

    setSuccessMessage(`Action recorded successfully under officer audit trail.`);
    setReason('');
    setInternalNotes('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gov-border dark:border-slate-800 shadow-sm p-5 space-y-4 transition-colors">
      <div className="flex items-center justify-between border-b border-gov-border dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gov-teal dark:text-teal-400" />
          <h3 className="font-bold text-sm sm:text-base text-gov-navy dark:text-slate-100">
            {t.humanActionsTitle}
          </h3>
        </div>
        <span className="text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded">
          Logged Officer: {user?.name || 'Officer Sharma'}
        </span>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Action Selector Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveAction('approve')}
          className={`py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
            activeAction === 'approve'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-gov-cream dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-gov-navy dark:text-slate-200 border-gov-border dark:border-slate-700'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t.btnApprove}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAction('override')}
          className={`py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
            activeAction === 'override'
              ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
              : 'bg-gov-cream dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-gov-navy dark:text-slate-200 border-gov-border dark:border-slate-700'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.btnOverride}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAction('escalate')}
          className={`py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
            activeAction === 'escalate'
              ? 'bg-red-600 text-white border-red-700 shadow-sm'
              : 'bg-gov-cream dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-gov-navy dark:text-slate-200 border-gov-border dark:border-slate-700'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{t.btnEscalate}</span>
        </button>
      </div>

      {/* Action Specific Fields */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        {activeAction === 'override' && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/60 space-y-3">
            <div>
              <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                Select New Officer-Validated Risk Level:
              </label>
              <select
                value={overrideRisk}
                onChange={(e) => setOverrideRisk(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg p-2 text-xs font-semibold text-gov-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Low">Low Risk (Standard Counseling / Informational)</option>
                <option value="Moderate">Moderate Risk (Follow-up Trauma Support)</option>
                <option value="High">High Risk (Legal Aid + Senior Triage)</option>
                <option value="Critical">Critical Risk (Immediate Emergency Intervention)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                {t.overrideReasonLabel} <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.overrideReasonPlaceholder}
                className="w-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg p-2.5 text-xs text-gov-textMain dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {activeAction === 'escalate' && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-800/60 text-xs text-red-900 dark:text-red-200 space-y-2">
            <p className="font-bold">
              Escalating this case will immediately notify the District Emergency Police Cell (112) and Senior Protection Officers.
            </p>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State emergency dispatch reason and location notes..."
              className="w-full bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 rounded-lg p-2 text-xs text-gov-textMain dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gov-textMain dark:text-slate-200 mb-1">
            Officer Case Notes / Action Summary:
          </label>
          <textarea
            rows={2}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Add internal observations, outreach attempts, or referral notes..."
            className="w-full bg-gov-cream/70 dark:bg-slate-800 border border-gov-border dark:border-slate-700 rounded-lg p-2.5 text-xs text-gov-textMain dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-teal"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-gov-navy dark:bg-teal-800 hover:bg-gov-teal dark:hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submit & Commit Decision to Audit Log</span>
        </button>
      </form>
    </div>
  );
}
