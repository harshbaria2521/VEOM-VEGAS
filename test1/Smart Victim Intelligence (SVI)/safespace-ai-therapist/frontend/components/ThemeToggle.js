'use client';

import React from 'react';
import { useTheme } from '../lib/themeContext';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-md bg-gov-cream/80 dark:bg-slate-800 border border-gov-border dark:border-slate-700 animate-pulse" />
    );
  }

  const getLabel = () => {
    if (theme === 'system') return 'Theme: Adaptive (System)';
    if (theme === 'dark') return 'Theme: Dark';
    return 'Theme: Light';
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={getLabel()}
      aria-label={getLabel()}
      className="relative flex items-center justify-center w-8 h-8 rounded-md bg-gov-cream/80 dark:bg-slate-800 hover:bg-gov-sand/80 dark:hover:bg-slate-700 border border-gov-border dark:border-slate-700 text-gov-textMain dark:text-slate-200 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-gov-teal"
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="w-4 h-4 text-amber-300 transition-transform rotate-0 scale-100" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 transition-transform rotate-0 scale-100" aria-hidden="true" />
      )}

      {/* Tiny indicator pill if currently following system */}
      {theme === 'system' && (
        <span
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gov-teal text-white flex items-center justify-center text-[7px] font-bold border border-white dark:border-slate-900"
          title="Auto Adaptive"
        >
          A
        </span>
      )}
    </button>
  );
}
