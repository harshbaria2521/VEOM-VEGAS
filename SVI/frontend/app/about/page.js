'use client';

import React from 'react';
import { Shield, Info, HeartHandshake, FileText, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gov-tealSoft dark:bg-teal-900/30 text-gov-teal dark:text-teal-400 mb-6 shadow-sm ring-4 ring-white dark:ring-slate-900">
          <Info className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gov-navy dark:text-slate-100 tracking-tight mb-4">
          About SVI Portal
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          The Smart Victim Intelligence (SVI) Portal is a unified platform for providing immediate, trauma-informed assistance, legal guidance, and grievance redressal under the PoA/PCR Acts.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-gov-navy dark:text-slate-200 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gov-teal dark:text-teal-400" />
              Our Mission
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              To empower and protect vulnerable communities by providing a seamless, real-time interface for reporting atrocities, accessing immediate emergency response, and securing legal and psychological support. We aim to bridge the gap between citizens in distress and law enforcement.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">24x7 Support</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Continuous AI-driven triage and human counseling.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Legal Aid Access</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Direct integration with DLSA for legal counsel.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Anonymity & Privacy</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Strict adherence to DPDP Act to protect complainant identity.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Relief Tracking</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">End-to-end status tracking for compensation and FIRs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50">
            <HeartHandshake className="w-8 h-8 text-amber-600 dark:text-amber-500 mb-4" />
            <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">Trauma-Informed Approach</h2>
            <p className="text-sm text-amber-800/80 dark:text-amber-200/70 leading-relaxed">
              Our AI chatbot, Tara, is fine-tuned to communicate with high empathy, de-escalate distress, and guide victims through the reporting process in their native languages.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-500 mb-4" />
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">Statutory Compliance</h2>
            <p className="text-sm text-blue-800/80 dark:text-blue-200/70 leading-relaxed">
              Operating firmly under the guidelines of the SC/ST (Prevention of Atrocities) Act, 1989 and Protection of Civil Rights Act, 1955.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
