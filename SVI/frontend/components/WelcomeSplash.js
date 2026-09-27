'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, ArrowRight, Lock, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2);
  const [statusStage, setStatusStage] = useState(1);

  // Check if splash should run: only ONCE per user
  useEffect(() => {
    try {
      const alreadySeen =
        localStorage.getItem('svi_landing_splash_seen') ||
        sessionStorage.getItem('svi_landing_splash_seen');

      if (alreadySeen) {
        setIsVisible(false);
        return;
      }

      // Mark as seen immediately so it will never show again on logout or subsequent visits
      localStorage.setItem('svi_landing_splash_seen', 'true');
      sessionStorage.setItem('svi_landing_splash_seen', 'true');
      setIsVisible(true);
    } catch (e) {
      setIsVisible(false);
      return;
    }

    const DURATION = 2000; // 2 seconds
    const INTERVAL = 30; // update every 30ms
    const totalSteps = DURATION / INTERVAL;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(100, Math.round((currentStep / totalSteps) * 100));
      setProgress(currentProgress);

      const remaining = Math.max(0, Math.ceil((DURATION - currentStep * INTERVAL) / 1000));
      setTimeLeft(remaining);

      if (currentStep < totalSteps * 0.35) {
        setStatusStage(1); // Initializing
      } else if (currentStep < totalSteps * 0.75) {
        setStatusStage(2); // Connecting NHAA
      } else {
        setStatusStage(3); // Ready
      }

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        dismissSplash();
      }
    }, INTERVAL);

    // Global event listener to allow manual replay anytime if triggered explicitly
    const handleReplay = () => {
      setIsFadingOut(false);
      setIsVisible(true);
      setProgress(0);
      setTimeLeft(2);
      setStatusStage(1);
      
      let step = 0;
      const replayTimer = setInterval(() => {
        step++;
        const p = Math.min(100, Math.round((step / totalSteps) * 100));
        setProgress(p);
        setTimeLeft(Math.max(0, Math.ceil((DURATION - step * INTERVAL) / 1000)));

        if (step < totalSteps * 0.35) setStatusStage(1);
        else if (step < totalSteps * 0.75) setStatusStage(2);
        else setStatusStage(3);

        if (step >= totalSteps) {
          clearInterval(replayTimer);
          dismissSplash();
        }
      }, INTERVAL);
    };

    window.addEventListener('svi-replay-welcome', handleReplay);

    return () => {
      clearInterval(timer);
      window.removeEventListener('svi-replay-welcome', handleReplay);
    };
  }, []);

  const dismissSplash = () => {
    try {
      localStorage.setItem('svi_landing_splash_seen', 'true');
      sessionStorage.setItem('svi_landing_splash_seen', 'true');
    } catch (e) {}
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col justify-between items-center select-none transition-all duration-700 ease-out overflow-y-auto bg-[#FAF8F5] dark:bg-[#07162C] text-[#0B2545] dark:text-[#ffffff] ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute inset-0 block dark:hidden pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 15% 20%, rgba(217, 119, 6, 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(19, 78, 67, 0.08) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(250, 248, 245, 0.9) 0%, transparent 70%)` }} />
      <div className="absolute inset-0 hidden dark:block pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 15% 20%, rgba(217, 119, 6, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(19, 78, 67, 0.28) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(11, 37, 69, 0.75) 0%, transparent 70%)` }} />
      
      {/* Top Tricolor Government Strip */}
      <div className="w-full relative z-10">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-md shadow-orange-500/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-[11px] text-amber-700 dark:text-amber-300">
              National Helpline Against Atrocities • 14566
            </span>
          </div>
          <button
            onClick={dismissSplash}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer bg-gov-navy/10 hover:bg-gov-navy/20 text-gov-navy hover:text-gov-navy border-gov-navy/20 dark:bg-white/10 dark:hover:bg-white/20 dark:text-amber-200 dark:hover:text-white dark:border-white/15"
          >
            <span>Skip ({timeLeft}s)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-auto flex flex-col items-center text-center animate-fadeIn relative z-10">
        {/* National Crest Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-amber-100 border border-amber-300 text-amber-800 dark:bg-amber-400/10 dark:border-amber-400/30 dark:text-amber-300">
          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Official Support Portal</span>
          <span className="text-slate-400 dark:text-white/40">•</span>
          <span>NHAA 14566</span>
        </div>

        {/* FULL WEBSITE NAME */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="inline dark:hidden text-gov-navy" style={{ WebkitTextStroke: '0.5px rgba(11,37,69,0.15)' }}>
              SVI
            </span>
            <span className="hidden dark:inline bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
              SVI
            </span>
            <span className="font-light mx-3 text-amber-600 dark:text-amber-400">|</span>
            <span className="text-gov-navy dark:text-white">Smart Victim Intelligence</span>
          </h1>
          <p className="text-base sm:text-xl font-medium tracking-wide text-amber-700/80 dark:text-amber-200/90">
            स्मार्ट विक्टिम इंटेलिजेंस
          </p>
        </div>

        {/* Helpline Title */}
        <div className="mt-5 p-3.5 sm:p-4 rounded-xl shadow-inner max-w-xl w-full bg-white border border-slate-200 shadow-sm dark:bg-slate-900/80 dark:border-slate-700/70">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            <PhoneCall className="w-4 h-4 animate-bounce text-amber-600 dark:text-amber-400" />
            <span>National Helpline Against Atrocities (NHAA - 14566)</span>
          </div>
          <p className="text-xs mt-1 font-medium text-slate-600 dark:text-slate-300">
            राष्ट्रीय अत्याचार निवारण हेल्पलाइन — टोल फ्री २४x७ सहायता
          </p>
        </div>

        {/* Description & Feature Pills */}
        <p className="mt-4 text-xs sm:text-sm max-w-xl leading-relaxed text-slate-600 dark:text-slate-300">
          AI-Powered Real-Time Emotional Triage, Legal Redressal Support & Trauma-Informed Assistance under the PCR & PoA Acts.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            DPDP 2023 Compliant
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-700/50">
            <Lock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            256-Bit Anonymized
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            23 Constitutional Languages
          </span>
        </div>
      </div>

      {/* Bottom 2-Second Progress & Enter CTA */}
      <div className="w-full max-w-2xl mx-auto px-4 pb-6 pt-2 relative z-10">
        <div className="space-y-2">
          {/* Progress Bar Label & Countdown */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full animate-ping bg-amber-600 dark:bg-amber-400" />
              {statusStage === 1 && 'Initializing Secure National Gateway...'}
              {statusStage === 2 && 'Connecting Helpline 14566 & Tele-MANAS...'}
              {statusStage >= 3 && 'Welcome to SVI Portal... Opening Now'}
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-200">
              {progress}% ({timeLeft}s)
            </span>
          </div>

          {/* Animated Tricolor Progress Bar */}
          <div className="h-2.5 w-full rounded-full overflow-hidden p-0.5 border shadow-inner bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] transition-all duration-75 ease-linear shadow-sm shadow-amber-400/30"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Enter Button (Instant Access) */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={dismissSplash}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border bg-gradient-to-r from-gov-navy to-gov-teal hover:from-gov-teal hover:to-teal-600 text-white shadow-gov-navy/30 hover:shadow-gov-navy/50 border-gov-navy/30 dark:from-gov-teal dark:to-teal-700 dark:hover:from-teal-600 dark:hover:to-teal-800 dark:shadow-teal-900/50 dark:hover:shadow-teal-800/80 dark:border-teal-400/30"
            >
              <span>Enter Official Portal Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
