'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/authContext';
import { translations } from '../lib/translations';
import {
  AlertTriangle,
  Phone,
  MessageSquare,
  Globe,
  Mic,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert
} from 'lucide-react';

export default function CaseQueueTable({ cases, onClaimCase }) {
  const { lang, user } = useAuth();
  const t = translations[lang] || translations.en;

  const [riskFilter, setRiskFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [timeRangeFilter, setTimeRangeFilter] = useState('ALL');

  // Extract unique languages from case data
  const availableLanguages = Array.from(new Set(cases.map((c) => c.language).filter(Boolean)));

  const filteredCases = cases.filter((c) => {
    if (riskFilter !== 'ALL' && c.riskLevel !== riskFilter) return false;
    if (channelFilter !== 'ALL' && !c.channel.toLowerCase().includes(channelFilter.toLowerCase())) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (languageFilter !== 'ALL' && c.language !== languageFilter) return false;
    
    // Time-range filter logic against flaggedAt / timestamp
    if (timeRangeFilter !== 'ALL') {
      const flagged = (c.flaggedAt || '').toLowerCase();
      if (timeRangeFilter === '1hr') {
        const isUnder1Hr = flagged.includes('min') || flagged.includes('sec') || flagged === '1 hour ago';
        if (!isUnder1Hr) return false;
      } else if (timeRangeFilter === 'today') {
        const isToday = flagged.includes('min') || flagged.includes('sec') || flagged.includes('hour') || flagged.includes('today');
        if (!isToday) return false;
      } else if (timeRangeFilter === 'week') {
        const isWeek = flagged.includes('min') || flagged.includes('sec') || flagged.includes('hour') || flagged.includes('today') || flagged.includes('yesterday') || flagged.includes('day') || (flagged.includes('week') && (flagged.includes('1 week') || flagged.includes('this week')));
        if (!isWeek) return false;
      }
    }

    return true;
  });

  // Sort order: Critical > High > Moderate > Low
  const riskPriority = { Critical: 4, High: 3, Moderate: 2, Low: 1 };
  const sortedCases = [...filteredCases].sort((a, b) => {
    return (riskPriority[b.riskLevel] || 0) - (riskPriority[a.riskLevel] || 0);
  });

  const criticalCount = cases.filter((c) => c.riskLevel === 'Critical' || c.riskLevel === 'High').length;

  const getRiskBadge = (level, score) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-700 dark:bg-red-400" />
            Critical ({score || 90}+)
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400" />
            High ({score || 75})
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400" />
            Moderate ({score || 50})
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            Low ({score || 25})
          </span>
        );
    }
  };

  const getChannelIcon = (channel) => {
    if (channel.includes('Helpline')) return <Phone className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
    if (channel.includes('Chatbot')) return <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    if (channel.includes('IVRS')) return <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    return <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Critical Alert Ribbon */}
      {criticalCount > 0 && (
        <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-600 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 animate-bounce" />
            <div>
              <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                {criticalCount} {t.activeAlerts}
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300">
                Cases flagged with acute trauma indicators or imminent risk require immediate officer triage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRiskFilter('Critical')}
            className="text-xs font-bold bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
          >
            Show Critical Only
          </button>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gov-border dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-gov-navy dark:text-slate-200">
          <Filter className="w-4 h-4 text-gov-teal dark:text-teal-400" />
          <span>Queue Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Risk Level Filter */}
          <select
            aria-label="Filter by Risk Level"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-gov-cream dark:bg-slate-800 border border-gov-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-gov-textMain dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-gov-teal cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Critical">Critical Risk</option>
            <option value="High">High Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          {/* Channel Filter */}
          <select
            aria-label="Filter by Intake Channel"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="bg-gov-cream dark:bg-slate-800 border border-gov-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-gov-textMain dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-gov-teal cursor-pointer"
          >
            <option value="ALL">All Channels</option>
            <option value="Helpline">Helpline (14566)</option>
            <option value="Chatbot">Chatbot Widget</option>
            <option value="Web Portal">Web Portal</option>
            <option value="IVRS">IVRS Voice</option>
          </select>

          {/* Language Filter */}
          <select
            aria-label="Filter by Language"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-gov-cream dark:bg-slate-800 border border-gov-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-gov-textMain dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-gov-teal cursor-pointer"
          >
            <option value="ALL">All Languages</option>
            {availableLanguages.map((langOpt) => (
              <option key={langOpt} value={langOpt}>
                {langOpt}
              </option>
            ))}
          </select>

          {/* Time-Range Filter */}
          <select
            aria-label="Filter by Time Range"
            value={timeRangeFilter}
            onChange={(e) => setTimeRangeFilter(e.target.value)}
            className="bg-gov-cream dark:bg-slate-800 border border-gov-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-gov-textMain dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-gov-teal cursor-pointer"
          >
            <option value="ALL">All Time</option>
            <option value="1hr">Last 1 hour</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>

          {/* Status Filter */}
          <select
            aria-label="Filter by Case Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gov-cream dark:bg-slate-800 border border-gov-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-gov-textMain dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-gov-teal cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New / Unassigned</option>
            <option value="In Review">In Review</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>

          {(riskFilter !== 'ALL' || channelFilter !== 'ALL' || statusFilter !== 'ALL' || languageFilter !== 'ALL' || timeRangeFilter !== 'ALL') && (
            <button
              onClick={() => {
                setRiskFilter('ALL');
                setChannelFilter('ALL');
                setStatusFilter('ALL');
                setLanguageFilter('ALL');
                setTimeRangeFilter('ALL');
              }}
              className="text-xs text-gov-teal dark:text-teal-400 underline px-2 py-1 hover:text-gov-navy dark:hover:text-teal-200 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gov-border dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gov-cream dark:bg-slate-800/90 border-b border-gov-border dark:border-slate-700 text-gov-navy dark:text-slate-200 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t.caseId}</th>
                <th className="py-3 px-4">{t.channel}</th>
                <th className="py-3 px-4">{t.riskLevel}</th>
                <th className="py-3 px-4">Violation Tag</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">{t.flaggedTime}</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">{t.status}</th>
                <th className="py-3 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-border dark:divide-slate-800">
              {sortedCases.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-gov-sand/40 dark:hover:bg-slate-800/60 transition-colors ${
                    c.riskLevel === 'Critical' ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                  }`}
                >
                  {/* Case ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-gov-navy dark:text-slate-100">
                    {c.id}
                  </td>

                  {/* Channel */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(c.channel)}
                      <span className="font-medium text-gov-textMain dark:text-slate-200">{c.channel}</span>
                    </div>
                  </td>

                  {/* Risk Badge */}
                  <td className="py-3.5 px-4">
                    {getRiskBadge(c.riskLevel, c.riskScore)}
                  </td>

                  {/* PoA / PCR Violation Tags */}
                  <td className="py-3.5 px-4">
                    {Array.isArray(c.violationTags) && c.violationTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {c.violationTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </td>

                  {/* Language */}
                  <td className="py-3.5 px-4 text-gov-textMuted dark:text-slate-400 font-medium">
                    {c.language}
                  </td>

                  {/* Time Flagged */}
                  <td className="py-3.5 px-4 text-gov-textMuted dark:text-slate-400">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.flaggedAt}</span>
                    </div>
                  </td>

                  {/* Assigned Officer */}
                  <td className="py-3.5 px-4">
                    {c.assignedTo ? (
                      <span className="text-xs font-semibold text-gov-navy dark:text-slate-200 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gov-teal dark:text-teal-400" />
                        {c.assignedTo}
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaimCase(c.id, user?.name || 'Officer Sharma')}
                        className="text-[11px] bg-gov-tealSoft dark:bg-teal-950/60 hover:bg-gov-teal hover:text-white text-gov-teal dark:text-teal-300 border border-gov-teal/30 dark:border-teal-700 px-2 py-1 rounded font-bold transition-colors"
                      >
                        {t.claimCase}
                      </button>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        c.status === 'New'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : c.status === 'In Review'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : c.status === 'Escalated'
                          ? 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/counsellor/${c.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gov-navy dark:bg-teal-800 hover:bg-gov-teal dark:hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      <span>{t.viewDetails}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedCases.length === 0 && (
          <div className="py-12 text-center text-gov-textMuted text-xs">
            No cases match the selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
