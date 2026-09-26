'use client';

import React from 'react';
import { useAuth } from '../lib/authContext';
import { supportedLanguages } from '../lib/translations';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useAuth();

  return (
    <div className="flex items-center gap-1.5 bg-gov-cream/80 dark:bg-slate-800 border border-gov-border dark:border-slate-700 px-2.5 py-1 rounded-md text-xs font-medium text-gov-textMain dark:text-slate-200 shadow-xs">
      <Globe className="w-3.5 h-3.5 text-gov-teal dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-gov-textMain dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-gov-teal rounded cursor-pointer pr-1 max-w-[120px] sm:max-w-none text-xs font-medium"
        aria-label="Select language"
        title="Select language"
      >
        {supportedLanguages.map((l) => (
          <option
            key={l.code}
            value={l.code}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1"
          >
            {l.nativeName}{l.code !== 'en' ? ` (${l.name})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
