'use client';

import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gov-tealSoft dark:bg-teal-900/30 text-gov-teal dark:text-teal-400 mb-6 shadow-sm ring-4 ring-white dark:ring-slate-900">
          <Phone className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gov-navy dark:text-slate-100 tracking-tight mb-4">
          Contact & Support
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          We are here to help. If you are in immediate danger, please use the emergency contacts below. For general inquiries, reach out to our nodal offices.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border border-red-200 dark:border-red-900/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle className="w-24 h-24 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            24x7 Emergency Helplines
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">Police Emergency (Pan-India)</p>
                <a href="tel:112" className="text-red-600 dark:text-red-400 font-bold text-lg hover:underline">112</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">National Helpline Against Atrocities</p>
                <a href="tel:14566" className="text-red-600 dark:text-red-400 font-bold text-lg hover:underline">14566</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">Tele-MANAS Psychological Support</p>
                <a href="tel:14416" className="text-red-600 dark:text-red-400 font-bold text-lg hover:underline">14416 / 1800-891-4416</a>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-gov-navy dark:text-slate-200 mb-6">Nodal Office Details</h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gov-teal mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Ministry of Social Justice & Empowerment</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  Shastri Bhawan, Dr. Rajendra Prasad Road,<br />
                  New Delhi - 110001
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gov-teal mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Email Inquiries</p>
                <a href="mailto:support-nhaa@gov.in" className="text-sm text-gov-teal hover:underline mt-1 inline-block">support-nhaa@gov.in</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-gov-teal mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Official Web Portal</p>
                <a href="https://socialjustice.gov.in" target="_blank" rel="noreferrer" className="text-sm text-gov-teal hover:underline mt-1 inline-block">socialjustice.gov.in</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
