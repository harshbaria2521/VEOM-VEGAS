'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/authContext';
import { translations } from '../lib/translations';
import { MessageSquare, Lock, PhoneCall, UserCheck, BarChart3, User, LogIn } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, victim, lang } = useAuth();
  const t = translations[lang] || translations.en;

  // Determine dashboard link based on role
  let dashboardHref = '/counsellor';
  let dashboardLabel = 'Officer';
  let DashboardIcon = UserCheck;
  if (user?.role === 'admin') {
    dashboardHref = '/admin';
    dashboardLabel = 'Admin';
    DashboardIcon = BarChart3;
  } else if (!user && !victim) {
    dashboardHref = '/login';
    dashboardLabel = 'Officer';
  }

  // Determine profile link
  let profileHref = '/login';
  let profileLabel = t.navLogin || 'Login';
  if (victim) {
    profileHref = '/profile';
    profileLabel = 'Profile';
  } else if (user) {
    profileHref = user.role === 'admin' ? '/admin' : '/counsellor';
    profileLabel = user.role === 'admin' ? 'Admin' : 'Officer';
  }

  const isHome = pathname === '/';
  const isConsent = pathname === '/consent';
  const isDashboard = pathname.startsWith('/counsellor') || pathname === '/admin';
  const isProfile = pathname === '/profile' || (pathname === '/login' && !user && !victim);

  return (
    <nav
      aria-label="Mobile Application Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-colors"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-1">
        {/* 1. Home / Chat */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-1 min-w-[56px] transition-colors ${
            isHome
              ? 'text-gov-teal dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label="Home AI Triage Chat"
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gov-teal dark:bg-teal-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Chat</span>
        </Link>

        {/* 2. Consent */}
        <Link
          href="/consent"
          className={`flex-1 flex flex-col items-center justify-center py-1 min-w-[56px] transition-colors ${
            isConsent
              ? 'text-gov-teal dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label="Consent & Privacy"
        >
          <div className="relative">
            <Lock className={`w-5 h-5 ${isConsent ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isConsent && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gov-teal dark:bg-teal-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Consent</span>
        </Link>

        {/* 3. Call 14566 Emergency Trigger (Center Action) */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-3">
          <a
            href="tel:14566"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-white shadow-md hover:shadow-lg flex items-center justify-center active:scale-95 transition-all ring-3 ring-white dark:ring-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-400"
            aria-label="Call National Toll-Free Helpline 14566"
            title="Call National Toll-Free Helpline 14566"
          >
            <PhoneCall className="w-5 h-5 text-white animate-pulse" />
          </a>
          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 tracking-tight mt-0.5">
            14566
          </span>
        </div>

        {/* 4. Officer / Queue */}
        <Link
          href={dashboardHref}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-w-[56px] transition-colors ${
            isDashboard
              ? 'text-gov-teal dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label="Officer Queue"
        >
          <div className="relative">
            <DashboardIcon className={`w-5 h-5 ${isDashboard ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isDashboard && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gov-teal dark:bg-teal-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{dashboardLabel}</span>
        </Link>

        {/* 5. Profile / Login */}
        <Link
          href={profileHref}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-w-[56px] transition-colors ${
            isProfile
              ? 'text-gov-teal dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label="Account Profile or Login"
        >
          <div className="relative">
            {victim ? (
              <User className={`w-5 h-5 ${isProfile ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            ) : (
              <LogIn className={`w-5 h-5 ${isProfile ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            )}
            {isProfile && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gov-teal dark:bg-teal-400" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{profileLabel}</span>
        </Link>
      </div>
    </nav>
  );
}
