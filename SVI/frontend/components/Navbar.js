'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/authContext';
import { translations } from '../lib/translations';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { Shield, PhoneCall, UserCheck, BarChart3, MessageSquare, Lock, LogOut, Sparkles, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, victim, logoutStaff, logoutVictim, lang } = useAuth();
  const t = translations[lang] || translations.en;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-gov-border dark:border-slate-800 transition-colors">
      {/* Tricolor Government Top Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Top Official Banner */}
      <div className="bg-gov-navyDark dark:bg-slate-950 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-300 tracking-wide">National Helpline Against Atrocities</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-200">SVI Portal (14566)</span>
          </div>
          <div className="flex items-center gap-3 text-amber-200 font-medium">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              NHAA: <a href="tel:14566" className="underline font-bold">14566</a>
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline">
              Tele-MANAS: <a href="tel:14416" className="underline font-bold">14416</a>
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline">
              Emergency: <a href="tel:112" className="underline font-bold">112</a>
            </span>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('svi-replay-welcome'));
                }
              }}
              className="inline-flex items-center gap-1 text-[11px] bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 hover:text-white px-2 py-0.5 rounded border border-amber-400/30 transition-all font-semibold cursor-pointer ml-1"
              title="Replay 3-Second Welcome Animation"
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Welcome Intro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/svi_app_icon.jpg"
            alt="SVI Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-sm ring-1 ring-gov-border dark:ring-slate-700 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gov-navy dark:text-slate-100 text-lg tracking-tight">SVI</span>
              <span className="text-xs bg-gov-tealSoft dark:bg-teal-950/60 text-gov-teal dark:text-teal-300 font-semibold px-2 py-0.5 rounded border border-gov-teal/20 dark:border-teal-800/40">
                NHAA 14566
              </span>
            </div>
            <p className="text-xs text-gov-textMuted dark:text-slate-400 font-medium hidden sm:block">
              {t.portalSubtitle}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop-only Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-gov-teal text-white'
                  : 'text-gov-textMain dark:text-slate-200 hover:bg-gov-sand/60 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.navHome}</span>
            </Link>

            <Link
              href="/consent"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === '/consent'
                  ? 'bg-gov-teal text-white'
                  : 'text-gov-textMain dark:text-slate-200 hover:bg-gov-sand/60 dark:hover:bg-slate-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{t.navConsent}</span>
            </Link>

            <Link
              href="/track"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === '/track'
                  ? 'bg-gov-teal text-white'
                  : 'text-gov-textMain dark:text-slate-200 hover:bg-gov-sand/60 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4 text-amber-500" />
              <span>Track Grievance</span>
            </Link>

            {/* Counsellor Link */}
            <Link
              href="/counsellor"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith('/counsellor')
                  ? 'bg-gov-navy dark:bg-teal-800 text-white'
                  : 'text-gov-textMain dark:text-slate-200 hover:bg-gov-sand/60 dark:hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span className="hidden lg:inline">{t.navCounsellor}</span>
            </Link>

            {/* Admin Link */}
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === '/admin'
                  ? 'bg-gov-navy dark:bg-teal-800 text-white'
                  : 'text-gov-textMain dark:text-slate-200 hover:bg-gov-sand/60 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline">{t.navAdmin}</span>
            </Link>
          </nav>

          <div className="hidden md:block h-5 w-px bg-gov-border dark:bg-slate-700 mx-0.5" />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Adaptive Theme Toggle (Beside Language Selection) */}
          <ThemeToggle />

          {/* Desktop User / Staff / Victim Status */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <span className="hidden xl:inline text-xs font-semibold text-gov-navy dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logoutStaff}
                  title={t.navLogout}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                  aria-label="Logout Staff"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : victim ? (
              <div className="flex items-center gap-2 pl-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-xs font-bold text-gov-navy dark:text-teal-200 bg-gov-tealSoft dark:bg-teal-950/60 border border-gov-teal/30 dark:border-teal-700 px-2.5 py-1 rounded hover:bg-gov-teal hover:text-white transition-colors"
                >
                  <span>{victim.name}</span>
                  <span className="text-[10px] font-mono opacity-80 font-normal">({victim.id})</span>
                </Link>
                <button
                  onClick={logoutVictim}
                  title="Logout Profile"
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                  aria-label="Logout Victim"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-gov-teal dark:text-teal-300 border border-gov-teal/40 dark:border-teal-700 hover:bg-gov-tealSoft dark:hover:bg-teal-950/40 px-2.5 py-1.5 rounded-md transition-colors"
              >
                {t.navLogin}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
