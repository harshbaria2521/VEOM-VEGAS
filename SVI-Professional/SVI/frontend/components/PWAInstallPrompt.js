'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share2, PlusSquare, Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(true); // default true to avoid flash

  useEffect(() => {
    // 1. Register service worker safely
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Service worker registered successfully
          })
          .catch((err) => {
            // Silently fail if SW registration fails (do not break app)
          });
      });
    }

    // 2. Check if already installed in standalone mode
    const checkStandalone = () => {
      const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isNavStandalone = window.navigator.standalone === true;
      return isDisplayStandalone || isNavStandalone;
    };

    if (checkStandalone()) {
      setIsStandalone(true);
      return;
    }

    // 3. Check if recently dismissed
    try {
      const lastDismissed = localStorage.getItem('svi_pwa_dismissed');
      if (lastDismissed) {
        const timeDiff = Date.now() - parseInt(lastDismissed, 10);
        // Only re-show after 3 days
        if (timeDiff < 3 * 24 * 60 * 60 * 1000) {
          return;
        }
      }
    } catch (e) {}

    // 4. Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    if (isIOSDevice && isSafari) {
      setIsIOS(true);
      setDismissed(false);
      return;
    }

    // 5. Capture standard beforeinstallprompt for Chrome / Android / Edge
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setDismissed(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 6. Handle app installed event
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setDismissed(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('svi_pwa_dismissed', Date.now().toString());
    } catch (e) {}
  };

  // If already standalone or dismissed or not installable & not iOS, don't show
  if (isStandalone || dismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  return (
    <div
      role="banner"
      aria-label="Install SVI Application"
      className="fixed top-2.5 left-3 right-3 sm:left-auto sm:right-6 sm:top-16 z-50 max-w-sm bg-gov-navy dark:bg-slate-900 text-white rounded-xl p-3.5 shadow-xl border border-slate-700/80 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <img
          src="/icon-192.png"
          alt="SVI App Icon"
          className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400/40 flex-shrink-0 shadow-xs"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-slate-100 truncate">
              Install SVI Application
            </h4>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss install prompt"
              className="text-slate-400 hover:text-white p-1 -mr-1 -mt-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            {isIOS
              ? 'Install on your iPhone for faster access and offline emergency helpline access.'
              : 'Add SVI to your home screen for quick 24x7 support and offline helplines.'}
          </p>

          {/* Action Row */}
          <div className="mt-2.5 flex items-center gap-2">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 bg-gov-teal hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            )}

            {isIOS && (
              <div className="text-[10px] text-amber-200 bg-amber-950/50 border border-amber-800/60 rounded px-2 py-1 flex items-center gap-1">
                <span>Tap</span>
                <Share2 className="w-3 h-3 inline text-amber-300" />
                <span>then "Add to Home Screen"</span>
                <PlusSquare className="w-3 h-3 inline text-amber-300" />
              </div>
            )}

            <button
              onClick={handleDismiss}
              className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
