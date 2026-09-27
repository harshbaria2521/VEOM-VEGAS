'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../lib/authContext';
import { translations } from '../../../lib/translations';
import { Shield, UserPlus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterVictimPage() {
  const { lang, user } = useAuth();
  const t = { ...translations.en, ...(translations[lang] || {}) };
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  if (user?.role !== 'counsellor' && user?.role !== 'admin') {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Access Denied. You must be an authorized officer to register victims.
      </div>
    );
  }

  const handleRegister = (e) => {
    e.preventDefault();
    const newId = `V-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedId(newId);
    setSuccess(true);
    // In a real app, this would dispatch an API call to save the user to the DB.
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 border border-gov-border dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gov-teal dark:bg-teal-900 p-6 text-white text-center">
          <UserPlus className="w-10 h-10 mx-auto mb-2 text-teal-100" />
          <h1 className="text-xl font-bold">Register New Victim</h1>
          <p className="text-teal-100 text-xs mt-1">Generate official SVI Victim ID</p>
        </div>
        
        {success ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Victim Registered Successfully!</h2>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 mb-1">Generated Victim ID:</p>
              <p className="text-3xl font-mono font-bold text-gov-navy dark:text-teal-400">{generatedId}</p>
            </div>
            <p className="text-xs text-slate-500">Provide this ID to the victim for future login and case tracking.</p>
            <button
              onClick={() => {
                setSuccess(false);
                setName('');
                setPhone('');
              }}
              className="mt-4 px-6 py-2 bg-gov-navy hover:bg-gov-teal text-white rounded-lg text-sm font-bold transition-colors"
            >
              Register Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Victim Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-gov-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number (Primary Contact)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-gov-teal focus:outline-none"
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex gap-3 text-xs text-blue-800 dark:text-blue-300">
              <Shield className="w-5 h-5 shrink-0" />
              <p>By registering this victim, you confirm you have their consent to store their contact details in the SVI secure database.</p>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gov-navy hover:bg-gov-teal dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold rounded-xl transition-colors"
            >
              Generate Victim ID
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
