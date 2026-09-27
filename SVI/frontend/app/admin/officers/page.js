'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../lib/authContext';
import { Shield, UserPlus, Trash2, ShieldCheck, Mail, Key } from 'lucide-react';

export default function ManageOfficersPage() {
  const { user } = useAuth();
  
  // Dummy local state for demonstration
  const [officers, setOfficers] = useState([
    { id: 'O-4120', name: 'Officer Sharma', role: 'counsellor', email: 'sharma@nhaa.gov.in' },
    { id: 'O-4121', name: 'Officer Reddy', role: 'counsellor', email: 'reddy@nhaa.gov.in' },
  ]);
  
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Access Denied. Administrator privileges required.
      </div>
    );
  }

  const handleAddOfficer = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const newId = `O-${Math.floor(1000 + Math.random() * 9000)}`;
    setOfficers([...officers, { id: newId, name: newName, role: 'counsellor', email: newEmail }]);
    setNewName('');
    setNewEmail('');
  };

  const handleRemoveOfficer = (id) => {
    setOfficers(officers.filter(o => o.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <ShieldCheck className="w-8 h-8 text-gov-navy dark:text-teal-400" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manage Officers</h1>
          <p className="text-sm text-slate-500">Add or revoke access for Counsellors / Nodal Officers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form to add officer */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-gov-border dark:border-slate-700 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-gov-teal" />
            Provision New Officer
          </h2>
          <form onSubmit={handleAddOfficer} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Officer Singh"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-gov-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@nhaa.gov.in"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-gov-teal focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-gov-navy hover:bg-gov-teal dark:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-lg text-sm font-bold transition-colors"
            >
              Generate Credentials
            </button>
          </form>
        </div>

        {/* List of active officers */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-gov-border dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Active Personnel Directory</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {officers.map(officer => (
              <div key={officer.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                    {officer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{officer.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{officer.id}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {officer.email}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveOfficer(officer.id)}
                  title="Revoke Access"
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {officers.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No active officers found in the system.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
