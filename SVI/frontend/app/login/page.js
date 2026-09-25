'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { translations } from '../../lib/translations';
import { Shield, UserCheck, BarChart3, Lock, LogIn, User, HeartHandshake } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginStaff, loginVictim, lang } = useAuth();
  const t = translations[lang] || translations.en;

  const [role, setRole] = useState('victim');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'victim') {
      loginVictim(name || 'Anonymous Complainant', contact || 'Protected');
      router.push('/profile');
    } else if (role === 'counsellor') {
      loginStaff('counsellor', name || 'Officer Sharma (ID: 4120)');
      router.push('/counsellor');
    } else if (role === 'admin') {
      loginStaff('admin', name || 'Supervisor Verma (Admin)');
      router.push('/admin');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-6 space-y-6">
      <div className="bg-white dark:bg-slate-800/95 rounded-xl border border-gov-border dark:border-slate-700 shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy dark:bg-slate-900 text-white p-6 text-center space-y-2 border-b border-slate-700/50">
          <img
            src="/svi_app_icon.jpg"
            alt="SVI Logo"
            className="w-14 h-14 rounded-2xl mx-auto shadow-md ring-2 ring-amber-300/40 object-cover"
          />
          <h1 className="text-lg font-bold">
            {lang === 'hi' ? 'SVI पहचान एवं लॉगिन पोर्टल' : 'SVI Access & Login Portal'}
          </h1>
          <p className="text-xs text-slate-300 dark:text-slate-400">
            National Support Portal • NHAA 14566
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gov-navy dark:text-slate-200 mb-2">
              {lang === 'hi' ? 'लॉगिन प्रकार चुनें:' : 'Select Login Type:'}
            </label>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Select User Role">
              {/* Victim Button */}
              <button
                type="button"
                aria-pressed={role === 'victim'}
                aria-label="Login as Victim / Citizen"
                onClick={() => {
                  setRole('victim');
                  setName('Anonymous Complainant');
                }}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all focus:outline-none focus:ring-2 focus:ring-gov-teal ${
                  role === 'victim'
                    ? 'border-gov-teal dark:border-teal-400 bg-gov-tealSoft/60 dark:bg-teal-950/50 ring-1 ring-gov-teal'
                    : 'border-gov-border dark:border-slate-700 bg-gov-cream dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-xs text-gov-navy dark:text-slate-100">
                  <User className="w-3.5 h-3.5 text-gov-teal dark:text-teal-400" aria-hidden="true" />
                  <span>Victim</span>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">My case & consent</span>
              </button>

              {/* Counsellor Button */}
              <button
                type="button"
                aria-pressed={role === 'counsellor'}
                aria-label="Login as Counsellor Officer"
                onClick={() => {
                  setRole('counsellor');
                  setName('Officer Sharma (ID: 4120)');
                }}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all focus:outline-none focus:ring-2 focus:ring-gov-teal ${
                  role === 'counsellor'
                    ? 'border-gov-teal dark:border-teal-400 bg-gov-tealSoft/60 dark:bg-teal-950/50 ring-1 ring-gov-teal'
                    : 'border-gov-border dark:border-slate-700 bg-gov-cream dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-xs text-gov-navy dark:text-slate-100">
                  <UserCheck className="w-3.5 h-3.5 text-gov-teal dark:text-teal-400" aria-hidden="true" />
                  <span>Officer</span>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">Case queue</span>
              </button>

              {/* Admin Button */}
              <button
                type="button"
                aria-pressed={role === 'admin'}
                aria-label="Login as Admin Supervisor"
                onClick={() => {
                  setRole('admin');
                  setName('Supervisor Verma (Admin)');
                }}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all focus:outline-none focus:ring-2 focus:ring-gov-navy ${
                  role === 'admin'
                    ? 'border-gov-navy dark:border-amber-400 bg-amber-50 dark:bg-amber-950/40 ring-1 ring-gov-navy dark:ring-amber-400'
                    : 'border-gov-border dark:border-slate-700 bg-gov-cream dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-xs text-gov-navy dark:text-slate-100">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span>Admin</span>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">Analytics</span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="login-name-input" className="block text-xs font-bold text-gov-navy dark:text-slate-200 mb-1">
              {role === 'victim'
                ? (lang === 'hi' ? 'नाम / छद्म नाम (वैकल्पिक):' : 'Name / Pseudonym (Optional):')
                : (lang === 'hi' ? 'अधिकारी नाम एवं पद:' : 'Officer Designation & ID:')}
            </label>
            <input
              id="login-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'victim' ? 'e.g., Complainant / Citizen' : 'Officer Sharma (ID: 4120)'}
              className="w-full p-2.5 bg-gov-cream dark:bg-slate-900/70 border border-gov-border dark:border-slate-700 rounded-lg text-xs font-medium text-gov-navy dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gov-teal"
            />
          </div>

          {role === 'victim' && (
            <div>
              <label htmlFor="login-contact-input" className="block text-xs font-bold text-gov-navy dark:text-slate-200 mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर (सुरक्षित/वैकल्पिक - No OTP needed):' : 'Phone Number (Protected/Optional - No OTP needed):'}
              </label>
              <input
                id="login-contact-input"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g., 9876543210 (Optional for follow-up)"
                className="w-full p-2.5 bg-gov-cream dark:bg-slate-900/70 border border-gov-border dark:border-slate-700 rounded-lg text-xs font-medium text-gov-navy dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gov-teal"
              />
            </div>
          )}

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <Lock className="w-4 h-4 text-gov-teal dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
            <span>
              {role === 'victim'
                ? 'No password or OTP required. Your session is protected and kept strictly confidential.'
                : 'Staff access is logged with actor identification and timestamps for audit compliance.'}
            </span>
          </div>

          <button
            type="submit"
            aria-label={role === 'victim' ? 'Enter & View Case Record' : 'Authenticate & Access Dashboard'}
            className="w-full py-2.5 px-4 bg-gov-navy hover:bg-gov-teal dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gov-teal"
          >
            <LogIn className="w-4 h-4 text-amber-300" aria-hidden="true" />
            <span>
              {role === 'victim'
                ? (lang === 'hi' ? 'प्रवेश करें एवं प्रोफ़ाइल देखें' : 'Enter & View Case Record')
                : 'Authenticate & Access Dashboard'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
