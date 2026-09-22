'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, ArrowRight, Lock, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [statusStage, setStatusStage] = useState(0);

  // Check if splash should run
  useEffect(() => {
    // Show splash on load
    setIsVisible(true);

    const DURATION = 3000; // 3 seconds
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

    // Global event listener to allow manual replay anytime
    const handleReplay = () => {
      setIsFadingOut(false);
      setIsVisible(true);
      setProgress(0);
      setTimeLeft(3);
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
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col justify-between items-center bg-[#07162C] text-white select-none transition-all duration-700 ease-out overflow-y-auto ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(217, 119, 6, 0.18) 0%, transparent 45%),
          radial-gradient(circle at 85% 80%, rgba(19, 78, 67, 0.28) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(11, 37, 69, 0.75) 0%, transparent 70%)
        `,
      }}
    >
      {/* Top Tricolor Government Strip */}
      <div className="w-full">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-md shadow-orange-500/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-amber-300 tracking-wider uppercase text-[11px]">
              सत्यमेव जयते • Government of India
            </span>
          </div>
          <button
            onClick={dismissSplash}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white px-3 py-1 rounded-full text-xs font-medium border border-white/15 transition-colors cursor-pointer"
          >
            <span>Skip ({timeLeft}s)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT PHOTO: State Emblem & Ministry Seal */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center order-2 lg:order-1 animate-fadeInLeft">
            <div className="relative group">
              {/* Decorative Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition duration-500" />
              
              <div className="relative bg-gradient-to-b from-white via-slate-50 to-amber-50/80 p-3 rounded-2xl shadow-2xl border border-amber-300/40 flex flex-col items-center text-center max-w-[240px] sm:max-w-[260px]">
                <div className="w-40 h-44 sm:w-44 sm:h-48 overflow-hidden rounded-xl bg-white flex items-center justify-center p-1.5">
                  <img
                    src="/emblem_ministry.jpg"
                    alt="Ministry of Social Justice and Empowerment Emblem"
                    className="w-full h-full object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200 w-full">
                  <p className="text-[11px] font-bold text-gov-navy uppercase tracking-wider">
                    Government of India
                  </p>
                  <p className="text-[10px] font-semibold text-slate-700 leading-tight mt-0.5">
                    Ministry of Social Justice & Empowerment
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    सामाजिक न्याय और अधिकारिता मंत्रालय
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Full Website Name & Official Branding */}
          <div className="lg:col-span-6 flex flex-col items-center text-center order-1 lg:order-2 px-2 sm:px-4">
            {/* National Crest Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Government Portal</span>
              <span className="text-white/40">•</span>
              <span>NHAA 14566</span>
            </div>

            {/* FULL WEBSITE NAME */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                <span className="bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
                  SVI
                </span>
                <span className="text-amber-400 font-light mx-2.5">|</span>
                <span className="text-white">Smart Victim Intelligence</span>
              </h1>
              <p className="text-base sm:text-lg text-amber-200/90 font-medium tracking-wide">
                स्मार्ट विक्टिम इंटेलिजेंस
              </p>
            </div>

            {/* Helpline Title */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700/70 shadow-inner max-w-xl w-full">
              <div className="flex items-center justify-center gap-2 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <PhoneCall className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>National Helpline Against Atrocities (NHAA - 14566)</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                राष्ट्रीय अत्याचार निवारण हेल्पलाइन — टोल फ्री २४x७ सहायता
              </p>
            </div>

            {/* Description & Feature Pills */}
            <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              AI-Powered Real-Time Emotional Triage, Legal Redressal Support & Trauma-Informed Assistance under the PCR & PoA Acts.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                DPDP 2023 Compliant
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-teal-950/60 text-teal-300 border border-teal-700/50 px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3 text-teal-400" />
                256-Bit Anonymized
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-950/60 text-amber-300 border border-amber-700/50 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                23 Constitutional Languages
              </span>
            </div>
          </div>

          {/* RIGHT PHOTO: Hon'ble Prime Minister Narendra Modi */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center order-3 animate-fadeInRight">
            <div className="relative group">
              {/* Decorative Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition duration-500" />
              
              <div className="relative bg-gradient-to-b from-white via-slate-50 to-amber-50/80 p-3 rounded-2xl shadow-2xl border border-amber-300/40 flex flex-col items-center text-center max-w-[240px] sm:max-w-[260px]">
                <div className="w-40 h-44 sm:w-44 sm:h-48 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-0.5">
                  <img
                    src="/pm_modi.jpg"
                    alt="Hon'ble Prime Minister Shri Narendra Modi"
                    className="w-full h-full object-cover object-top rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200 w-full">
                  <p className="text-[11px] font-bold text-gov-navy uppercase tracking-wider">
                    Shri Narendra Modi
                  </p>
                  <p className="text-[10px] font-semibold text-slate-700 leading-tight mt-0.5">
                    Hon&apos;ble Prime Minister of India
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    माननीय प्रधानमंत्री, भारत
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom 3-Second Progress & Enter CTA */}
      <div className="w-full max-w-2xl mx-auto px-4 pb-6 pt-2">
        <div className="space-y-2">
          {/* Progress Bar Label & Countdown */}
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              {statusStage === 1 && 'Initializing Secure National Gateway...'}
              {statusStage === 2 && 'Connecting Helpline 14566 & Tele-MANAS...'}
              {statusStage >= 3 && 'Welcome to SVI Portal... Opening Now'}
            </span>
            <span className="font-mono text-amber-200">
              {progress}% ({timeLeft}s)
            </span>
          </div>

          {/* Animated Tricolor Progress Bar */}
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] transition-all duration-75 ease-linear shadow-sm shadow-amber-400/30"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Enter Button (Instant Access) */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={dismissSplash}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gov-teal to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-teal-900/50 hover:shadow-teal-800/80 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-teal-400/30"
            >
              <span>Enter Official Portal Now (प्रवेश करें)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
