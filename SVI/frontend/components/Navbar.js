'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/authContext';
import { translations } from '../lib/translations';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { Shield, PhoneCall, UserCheck, BarChart3, MessageSquare, Lock, LogOut, Sparkles, Search, Bot, ShieldCheck, FileWarning, LayoutDashboard, Settings, Info, Phone } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, victim, logoutStaff, logoutVictim, lang } = useAuth();
  const t = { ...translations.en, ...(translations[lang] || {}) };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-gov-border dark:border-slate-800 transition-colors">
      {/* Tricolor Government Top Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Top Official Banner */}
      <div className="bg-gov-navyDark dark:bg-slate-950 text-slate-100 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
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

          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4 w-full">
        {/* Brand / Logo */}
        <div className="flex justify-start min-w-0 z-10">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
          <img
            src="/svi_app_icon.jpg"
            alt="SVI Logo"
            className="w-8 h-8 xl:w-11 xl:h-11 rounded-xl object-cover shadow-sm ring-1 ring-gov-border dark:ring-slate-700 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gov-navy dark:text-slate-100 text-lg tracking-tight">SVI</span>
              <span className="whitespace-nowrap text-xs bg-gov-tealSoft dark:bg-teal-950/60 text-gov-teal dark:text-teal-300 font-semibold px-2 py-0.5 rounded border border-gov-teal/20 dark:border-teal-800/40">
                NHAA 14566
              </span>
            </div>
            <p className="text-xs text-gov-textMuted dark:text-slate-400 font-medium hidden xl:block w-[210px] whitespace-normal leading-tight">
              {t.portalSubtitle}
            </p>
          </div>
        </Link>
        </div>



        {/* Navigation Links - Centered */}
        <div className="hidden lg:flex justify-center items-center w-full">
          <nav className="flex items-center gap-1.5 xl:gap-4">
            {(!user || user.role === 'victim') && (
              <>
                <Link
                  href="/"
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                    pathname === '/'
                      ? 'bg-gov-teal border-gov-teal text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bot className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap leading-tight">{t.navHome}</span>
                </Link>

                <Link
                  href="/track"
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                    pathname === '/track'
                      ? 'bg-gov-teal border-gov-teal text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileWarning className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap leading-tight">Grievance</span>
                </Link>

                {(!user && !victim) && (
                  <>
                    <Link
                      href="/about"
                      className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                        pathname === '/about'
                          ? 'bg-gov-teal border-gov-teal text-white shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Info className="w-5 h-5 shrink-0" />
                      <span className="whitespace-nowrap leading-tight">About</span>
                    </Link>

                    <Link
                      href="/contact"
                      className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                        pathname === '/contact'
                          ? 'bg-gov-teal border-gov-teal text-white shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Phone className="w-5 h-5 shrink-0" />
                      <span className="whitespace-nowrap leading-tight">Contact</span>
                    </Link>
                  </>
                )}

                {victim && (
                  <Link
                    href="/profile"
                    className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                      pathname === '/profile'
                        ? 'bg-gov-teal border-gov-teal text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                    <span className="whitespace-nowrap leading-tight">Dashboard</span>
                  </Link>
                )}
              </>
            )}

            {user?.role === 'counsellor' && (
              <>
                <Link
                  href="/track"
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                    pathname === '/track'
                      ? 'bg-gov-teal border-gov-teal text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileWarning className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap leading-tight">Grievance</span>
                </Link>
                <Link
                  href="/counsellor"
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                    pathname === '/counsellor'
                      ? 'bg-gov-navy border-gov-navy dark:bg-teal-800 dark:border-teal-800 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap leading-tight text-center">{t.navCounsellor}</span>
                </Link>
                <Link
                  href="/counsellor/register"
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                    pathname === '/counsellor/register'
                      ? 'bg-gov-navy border-gov-navy dark:bg-teal-800 dark:border-teal-800 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap leading-tight text-center">Register Victim</span>
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link
                  href="/counsellor"
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                    pathname === '/counsellor'
                      ? 'bg-gov-navy border-gov-navy dark:bg-teal-800 dark:border-teal-800 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap leading-tight text-center">Officers Dashboard</span>
                </Link>
                <Link
                  href="/admin"
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                    pathname === '/admin'
                      ? 'bg-gov-navy border-gov-navy dark:bg-teal-800 dark:border-teal-800 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap leading-tight text-center">{t.navAdmin}</span>
                </Link>
                <Link
                  href="/admin/officers"
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-xl border text-xs xl:text-sm font-medium transition-all ${
                    pathname === '/admin/officers'
                      ? 'bg-gov-navy border-gov-navy dark:bg-teal-800 dark:border-teal-800 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Shield className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap leading-tight text-center">Manage Officers</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex justify-end items-center gap-1 sm:gap-2">
          {/* Adaptive Theme Toggle */}
          <ThemeToggle />

          {/* Settings Button */}
          <Link
            href="/settings"
            title="Settings"
            className="p-1.5 xl:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* User / Staff / Victim Status */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-1">
                <span className="hidden sm:inline text-xs font-semibold text-gov-navy dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded">
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
              <div className="flex items-center gap-1 sm:gap-2 pl-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-xs font-bold text-gov-navy dark:text-teal-200 bg-gov-tealSoft dark:bg-teal-950/60 border border-gov-teal/30 dark:border-teal-700 px-2 sm:px-2.5 py-1 rounded hover:bg-gov-teal hover:text-white transition-colors"
                >
                  <span className="max-w-[70px] sm:max-w-[120px] truncate">{victim.name}</span>
                  <span className="hidden sm:inline text-[10px] font-mono opacity-80 font-normal">({victim.id})</span>
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
                className="whitespace-nowrap text-xs font-semibold text-gov-teal dark:text-teal-300 border border-gov-teal/40 dark:border-teal-700 hover:bg-gov-tealSoft dark:hover:bg-teal-950/40 px-2 sm:px-2.5 py-1.5 rounded-md transition-colors"
              >
                {t.navLogin || 'Sign Up / Login'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
