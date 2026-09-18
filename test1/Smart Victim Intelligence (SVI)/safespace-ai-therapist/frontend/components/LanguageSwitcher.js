'use client';

import React from 'react';
import { useAuth } from '../lib/authContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useAuth();

  return (
    <div className="flex items-center gap-1.5 bg-gov-cream/80 dark:bg-slate-800 border border-gov-border dark:border-slate-700 px-2.5 py-1 rounded-md text-xs font-medium text-gov-textMain dark:text-slate-200 shadow-xs">
      <Globe className="w-3.5 h-3.5 text-gov-teal dark:text-teal-400" />
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-gov-textMain dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
        aria-label="Select Language"
      >
        <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">English</option>
        <option value="hi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">हिन्दी (Hindi)</option>
      </select>
    </div>
  );
}
