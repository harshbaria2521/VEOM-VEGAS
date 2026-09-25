'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCaseStore } from '../../lib/caseStore';
import CaseQueueTable from '../../components/CaseQueueTable';
import VulnerabilityHeatmap from '../../components/VulnerabilityHeatmap';
import { useAuth } from '../../lib/authContext';
import { translations } from '../../lib/translations';
import { UserCheck, AlertOctagon, CheckCircle2, Clock, BellRing, X, Bell, BellOff, MapPin, ListFilter } from 'lucide-react';

export default function CounsellorDashboardPage() {
  const { cases, claimCase } = useCaseStore();
  const { lang, user } = useAuth();
  const t = translations[lang] || translations.en;

  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [dashboardTab, setDashboardTab] = useState('queue'); // 'queue' or 'heatmap'
  const [newCriticalAlertCount, setNewCriticalAlertCount] = useState(0);
  const prevCriticalCountRef = useRef(0);

  // --- Task 3: Audio Alert Toggle ---
  const [alertEnabled, setAlertEnabled] = useState(() => {
    // Persist preference across page loads
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('svi_critical_alert') !== 'off'; } catch (_) {}
    }
    return true;
  });

  // Tracks which Critical case IDs have already triggered an alert this session.
  // Using a ref (not state) so updates do NOT cause re-renders and cannot create alert loops.
  const alertedCaseIdsRef = useRef(new Set());

  // Tracks whether the user has interacted with the page (for browser autoplay policy).
  const hasInteractedRef = useRef(false);

  // Record user interaction once (for browser autoplay policy compliance)
  useEffect(() => {
    const markInteracted = () => { hasInteractedRef.current = true; };
    window.addEventListener('click', markInteracted, { once: true });
    window.addEventListener('keydown', markInteracted, { once: true });
    return () => {
      window.removeEventListener('click', markInteracted);
      window.removeEventListener('keydown', markInteracted);
    };
  }, []);

  // Persist alert preference to localStorage
  useEffect(() => {
    try { localStorage.setItem('svi_critical_alert', alertEnabled ? 'on' : 'off'); } catch (_) {}
  }, [alertEnabled]);

  // Play a short generic notification beep using Web Audio API (no library, no sensitive info)
  const playAlertBeep = useCallback(() => {
    if (!hasInteractedRef.current) return; // Respect browser autoplay policy
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.35);
      // Clean up AudioContext after beep finishes
      oscillator.onended = () => { try { ctx.close(); } catch (_) {} };
    } catch (_) {
      // Silently ignore if audio is blocked or unavailable — do not break the queue
    }
  }, []);

  // On mount: silently register all currently-visible Critical cases WITHOUT beeping.
  // This prevents startup noise for cases already in the queue when the page loads.
  // MUST run before the detection effect (order matters in React's effect execution).
  useEffect(() => {
    cases.forEach((c) => {
      if (c.riskLevel === 'Critical') {
        alertedCaseIdsRef.current.add(c.id);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty deps — runs once on mount only

  // Detect newly-appearing Critical cases and alert (at most once per case ID).
  // The mount effect above pre-populates the set, so only truly new arrivals beep.
  useEffect(() => {
    if (!alertEnabled) return;
    cases.forEach((c) => {
      if (c.riskLevel === 'Critical' && !alertedCaseIdsRef.current.has(c.id)) {
        alertedCaseIdsRef.current.add(c.id);
        playAlertBeep();
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases, alertEnabled, playAlertBeep]);

  const criticalCount = cases.filter((c) => c.riskLevel === 'Critical').length;
  const highCount = cases.filter((c) => c.riskLevel === 'High').length;
  const inReviewCount = cases.filter((c) => c.status === 'In Review').length;
  const newCount = cases.filter((c) => c.status === 'New').length;

  // Frontend-side periodic interval check for new incoming critical cases
  useEffect(() => {
    prevCriticalCountRef.current = criticalCount;

    const interval = setInterval(() => {
      // Periodic check against current state to ensure alert banner reflects any new critical/high cases
      const currentCrit = cases.filter((c) => c.riskLevel === 'Critical' && c.status === 'New').length;
      if (currentCrit > 0) {
        setNewCriticalAlertCount(currentCrit);
        setShowAlertBanner(true);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [cases, criticalCount]);

  return (
    <div className="space-y-6">
      {/* Real-Time Critical / High Case Alert Banner */}
      {showAlertBanner && (criticalCount > 0 || highCount > 0) && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50 dark:bg-red-950/50 border-l-4 border-red-600 p-4 rounded-r-xl shadow-sm flex items-center justify-between gap-3 animate-fadeIn transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-3 h-3 bg-red-600 rounded-full inline-block animate-ping absolute -top-0.5 -right-0.5" />
              <BellRing className="w-5 h-5 text-red-700 dark:text-red-400 flex-shrink-0 relative" aria-hidden="true" />
            </div>
            <div>
              <span className="font-bold text-xs text-red-900 dark:text-red-200 uppercase tracking-wide flex items-center gap-2">
                <span>🔴 Urgent Triage Notice</span>
                <span className="bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  {criticalCount} Critical • {highCount} High Priority
                </span>
              </span>
              <p className="text-xs text-red-800 dark:text-red-300 font-medium mt-0.5">
                Immediate officer review required for severe trauma / atrocity flagged cases.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Dismiss critical alert notification"
            onClick={() => setShowAlertBanner(false)}
            className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors focus:ring-2 focus:ring-red-600"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-gov-border dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-gov-tealSoft dark:bg-teal-950/60 text-gov-teal dark:text-teal-300 px-2 py-0.5 rounded border border-gov-teal/20 dark:border-teal-800/40">
              NHAA 14566 Triage
            </span>
            <span className="text-xs text-gov-textMuted dark:text-slate-400">
              National Helpline Against Atrocities
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gov-navy dark:text-slate-100 mt-1">
            {t.queueTitle}
          </h1>
          <p className="text-xs text-gov-textMuted dark:text-slate-400 mt-0.5">
            Real-time stress &amp; trauma risk prioritized queue for authorized officers and counsellors.
          </p>
        </div>

        {/* Quick Officer Info + Audio Alert Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Audio Alert Toggle (Task 3) */}
          <button
            type="button"
            id="svi-audio-alert-toggle"
            aria-pressed={alertEnabled}
            aria-label={alertEnabled ? 'Disable critical case audio alert' : 'Enable critical case audio alert'}
            title={alertEnabled ? 'Audio Alert On — click to disable' : 'Audio Alert Off — click to enable'}
            onClick={() => {
              hasInteractedRef.current = true; // mark interaction for browser autoplay policy
              setAlertEnabled((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors focus:ring-2 focus:ring-gov-teal ${
              alertEnabled
                ? 'bg-gov-tealSoft dark:bg-teal-950/60 text-gov-teal dark:text-teal-300 border-gov-teal/30 dark:border-teal-700 hover:bg-gov-teal hover:text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {alertEnabled
              ? <Bell className="w-3.5 h-3.5" aria-hidden="true" />
              : <BellOff className="w-3.5 h-3.5" aria-hidden="true" />
            }
            <span>{alertEnabled ? '🔔 Alert On' : '🔕 Alert Off'}</span>
          </button>

          <div className="flex items-center gap-3 bg-gov-cream dark:bg-slate-800 p-3 rounded-lg border border-gov-border dark:border-slate-700 text-xs">
            <UserCheck className="w-5 h-5 text-gov-teal dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
            <div>
              <div className="font-bold text-gov-navy dark:text-slate-100">{user?.name || 'Officer Sharma'}</div>
              <div className="text-[11px] text-gov-textMuted dark:text-slate-400">Badge: NHAA-OFFICER-412</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-gov-border dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Cases in Queue</div>
          <div className="text-xl font-bold text-gov-navy dark:text-slate-100 mt-1">{cases.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-gov-border dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-xs text-red-700 dark:text-red-400 font-bold flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-red-600 dark:text-red-400" aria-hidden="true" /> Critical Risk Cases
          </div>
          <div className="text-xl font-bold text-red-700 dark:text-red-400 mt-1">{criticalCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-gov-border dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" /> Active in Review
          </div>
          <div className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-1">{inReviewCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-gov-border dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-xs text-blue-800 dark:text-blue-300 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" aria-hidden="true" /> Unassigned / New
          </div>
          <div className="text-xl font-bold text-blue-800 dark:text-blue-300 mt-1">{newCount}</div>
        </div>
      </div>

      {/* View Mode Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-gov-border dark:border-slate-800 pb-2">
        <button
          onClick={() => setDashboardTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            dashboardTab === 'queue'
              ? 'bg-gov-navy dark:bg-teal-700 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-gov-navy'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Priority Case Queue ({cases.length})</span>
        </button>

        <button
          onClick={() => setDashboardTab('heatmap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            dashboardTab === 'heatmap'
              ? 'bg-gov-navy dark:bg-teal-700 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-gov-navy'
          }`}
        >
          <MapPin className="w-4 h-4 text-red-500" />
          <span>National Vulnerability Heatmap (GIS)</span>
        </button>
      </div>

      {/* Main View: Queue Table OR GIS Heatmap */}
      {dashboardTab === 'queue' ? (
        <CaseQueueTable cases={cases} onClaimCase={claimCase} />
      ) : (
        <VulnerabilityHeatmap
          onSelectDistrict={(districtName) => {
            setDashboardTab('queue');
          }}
        />
      )}
    </div>
  );
}
