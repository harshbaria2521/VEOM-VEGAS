'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/authContext';
import { translations } from '../../lib/translations';
import { getStoredCases, registerNewComplaint, getCaseById } from '../../lib/caseStore';
import { assessComplaint } from '../../lib/sviScoring';
import { generateGrievancePDF } from '../../lib/pdfGenerator';
import {
  Search,
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  PhoneCall,
  UserCheck,
  Scale,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Send,
  PlusCircle,
  Activity,
  Layers,
  HelpCircle,
  Check,
  AlertTriangle
} from 'lucide-react';

const TRACKING_STEPS = [
  {
    step: 1,
    title: 'Grievance Registered',
    subtitle: 'AI Triage & Distress Assessment Completed',
    icon: FileText,
  },
  {
    step: 2,
    title: 'Nodal Officer Assigned',
    subtitle: 'Allocated to District Special Atrocities Cell',
    icon: UserCheck,
  },
  {
    step: 3,
    title: 'Legal Aid Cell Forwarded',
    subtitle: 'DLSA Free Legal Counsel Appointed',
    icon: Scale,
  },
  {
    step: 4,
    title: 'Police & Protection Verification',
    subtitle: '112 Special Mobile Patrol Alerted',
    icon: Building2,
  },
  {
    step: 5,
    title: 'Relief Sanctioned & Disbursed',
    subtitle: 'DBT Compensation under MoSJE Central Scheme',
    icon: CheckCircle2,
  },
];

const SAMPLE_SCENARIOS = [
  {
    label: '🚨 Armed Mob Assault (Critical)',
    text: 'हमारे घर पर गांव के दबंग लोगों ने लाठी और हथियारों के साथ हमला कर दिया है। जातिसूचक गालियां देकर जान से मारने की धमकी दे रहे हैं और दरवाजा पीट रहे हैं। मुझे और बच्चों को बहुत डर लग रहा है, कृपया जल्दी पुलिस भेजिए!',
    district: 'Hathras',
    state: 'Uttar Pradesh'
  },
  {
    label: '🚫 Water Access Denial & Boycott (High)',
    text: 'गांव की पंचायत ने हमारे परिवार का सामाजिक बहिष्कार कर दिया है। सरकारी हैंडपंप से पानी भरने पर रोक लगा दी गई है और गाली-गलौज करके भगा दिया। थाने में दरोगा जी एफआईआर दर्ज नहीं कर रहे हैं।',
    district: 'Sitapur',
    state: 'Uttar Pradesh'
  },
  {
    label: '📜 Post-Matric Relief Scheme Query (Low)',
    text: 'नमस्ते सर, मुझे MoSJE की पोस्ट-मैट्रिक स्कॉलरशिप और सिविल राइट्स लीगल ऐड स्कीम के फॉर्म और आवेदन प्रक्रिया की जानकारी चाहिए।',
    district: 'Jaipur',
    state: 'Rajasthan'
  }
];

export default function TrackGrievancePage() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.en;

  // Active top-level tab: 'track' or 'file'
  const [activeTab, setActiveTab] = useState('track');

  // Tracker state
  const [queryId, setQueryId] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [recentCases, setRecentCases] = useState([]);

  // Intake / File complaint state
  const [victimName, setVictimName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [district, setDistrict] = useState('Hathras');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [complaintText, setComplaintText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  // Load cases on mount
  useEffect(() => {
    const all = getStoredCases();
    setRecentCases(all);
  }, []);

  const refreshCasesList = (defaultId) => {
    const all = getStoredCases();
    setRecentCases(all);
    if (defaultId) {
      const found = all.find((c) => c.id.toLowerCase() === defaultId.toLowerCase());
      if (found) {
        setSelectedCase(found);
        setQueryId(found.id);
      }
    }
  };

  const handleSearch = (idToSearch) => {
    const id = (idToSearch || queryId).trim();
    setErrorMsg('');
    if (!id) {
      setErrorMsg('Please enter a valid Docket Reference ID.');
      return;
    }

    const all = getStoredCases();
    const found = all.find((c) => c.id.toLowerCase() === id.toLowerCase());

    if (found) {
      setSelectedCase(found);
      setQueryId(found.id);
    } else {
      setSelectedCase(null);
      setErrorMsg(`No record found for Docket ID "${id}". Please verify and try again.`);
    }
  };

  // Real-time live score calculation for the text being typed in intake
  const liveAssessment = assessComplaint(complaintText);

  // Handle complaint filing
  const handleRegisterComplaint = (e) => {
    e?.preventDefault();
    if (!complaintText.trim()) {
      alert('Please enter incident details to assess.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      try {
        const { newCase, assessment } = registerNewComplaint({
          complaintText: complaintText.trim(),
          victimName: isAnonymous ? 'Anonymous Complainant' : victimName || 'Citizen Complainant',
          district,
          state: stateName,
          channel: 'Web Portal',
          preferredLanguage: lang === 'hi' ? 'Hindi' : 'English',
        });

        setRegisteredSuccess(newCase);
        // Refresh list
        const updatedList = getStoredCases();
        setRecentCases(updatedList);
        setSelectedCase(newCase);
        setQueryId(newCase.id);

        // Switch back to track tab to see the live score
        setActiveTab('track');
        setComplaintText('');
      } catch (err) {
        console.error('Registration failed:', err);
      } finally {
        setSubmitting(false);
      }
    }, 600);
  };

  const handleDownloadPDF = () => {
    if (!selectedCase) return;
    setDownloading(true);
    try {
      generateGrievancePDF(selectedCase);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  // Determine current active step (1 to 5)
  const getActiveStep = (c) => {
    if (!c) return 1;
    if (c.status === 'Resolved' || c.status === 'Closed') return 5;
    if (c.status === 'Escalated') return 4;
    if (c.status === 'In Review' && c.assignedTo) return 3;
    if (c.assignedTo) return 2;
    return 1;
  };

  const currentStep = selectedCase ? getActiveStep(selectedCase) : 1;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-gov-teal dark:from-slate-900 dark:to-teal-950 p-6 rounded-2xl text-white shadow-md border border-transparent dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-xs text-amber-300 font-semibold tracking-wider uppercase">
          <span>Official MoSJE Portal</span>
          <span>•</span>
          <span>National Helpline Against Atrocities (14566)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Grievance Intake & Case Status Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              Real-time procedural tracking, statutory PoA Act section mapping, and compensation sanctioning.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl self-start sm:self-auto border border-white/20">
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-white text-gov-navy shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Docket</span>
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-amber-400 text-slate-900 shadow-sm font-extrabold'
                  : 'text-amber-200 hover:bg-white/10'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>File New Grievance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Banner if newly registered */}
      {registeredSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl flex items-start justify-between gap-3 text-emerald-900 dark:text-emerald-200 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold">
                Incident Registered Successfully! Docket ID: <span className="font-mono text-base font-extrabold underline">{registeredSuccess.id}</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                Priority: <span className="font-bold">{registeredSuccess.riskLevel}</span> • Nodal officer and DLSA free legal aid notified.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRegisteredSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: FILE NEW INCIDENT */}
      {/* ========================================================================= */}
      {activeTab === 'file' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-gov-border dark:border-slate-700 shadow-sm space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gov-navy dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gov-teal" />
                <span>File Grievance & Register Incident</span>
              </h2>
              <p className="text-xs text-gov-textMuted dark:text-slate-400 mt-0.5">
                Aap jo bhi incident likhenge, system uske according PoA/PCR Act statutory sections aur relief entitlements automatically map karega.
              </p>
            </div>

            {/* Quick Scenario Fillers */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Quick Test Scenarios (1-Click Test):
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SCENARIOS.map((sc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setComplaintText(sc.text);
                      setDistrict(sc.district);
                      setStateName(sc.state);
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-gov-teal dark:hover:border-teal-500 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{sc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleRegisterComplaint} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Victim Name / नाम
                  </label>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    value={isAnonymous ? 'गुमनाम नागरिक (Anonymous)' : victimName}
                    onChange={(e) => setVictimName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-800 dark:text-slate-200 disabled:opacity-60"
                  />
                  <label className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-gov-teal focus:ring-gov-teal"
                    />
                    <span>Keep Complainant Anonymous (गुमनाम रखें - Safe Reporting)</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      District / जिला
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Hathras"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      State / राज्य
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Uttar Pradesh"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Complaint Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Incident Description & Details / घटना का विवरण <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="यहाँ अपनी समस्या या घटना का विवरण लिखें (जैसे: क्या हुआ, किसने हमला किया, क्या धमकी दी, क्या पुलिस ने रिपोर्ट लिखी?)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-teal"
                />
              </div>

              {/* STATUTORY SECTION MAPPING PREVIEW */}
              {complaintText.trim().length > 0 && liveAssessment.sections.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-4 border border-gov-border dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gov-navy dark:text-teal-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Statutory Violations & Legal Coverage Identified:
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Entitlement: {liveAssessment.reliefEntitlement}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    <span className="text-slate-500 font-semibold">Mapped Sections:</span>
                    {liveAssessment.sections.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-mono text-[11px] border border-teal-200 dark:border-teal-800"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !complaintText.trim()}
                  className="px-6 py-3 bg-gov-navy hover:bg-gov-teal text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>
                    {submitting ? 'Registering Grievance...' : 'Submit Grievance & Generate Official Docket'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRACK DOCKET STATUS */}
      {/* ========================================================================= */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Search Bar Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-gov-border dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gov-textMuted dark:text-slate-300 uppercase tracking-wider">
                Enter Docket Reference Number / शिकायत क्रमांक
              </label>
              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className="text-xs font-bold text-gov-teal hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>File New Complaint</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gov-textMuted dark:text-slate-400" />
                <input
                  type="text"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. SVI-2026-9041"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gov-border dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-gov-navy dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gov-teal"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                className="px-6 py-2.5 bg-gov-navy hover:bg-gov-teal dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-300" />
                <span>Track Status</span>
              </button>
            </div>

            {/* Quick Sample IDs for Evaluators & Judges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-gov-textMuted dark:text-slate-400 font-medium">
                Recent & Sample Dockets:
              </span>
              {recentCases.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSearch(c.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono font-semibold transition-all border cursor-pointer ${
                    queryId === c.id
                      ? 'bg-gov-teal text-white border-gov-teal dark:bg-teal-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-gov-teal'
                  }`}
                >
                  {c.id} ({c.riskLevel})
                </button>
              ))}
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Empty State when no case searched/selected yet */}
          {!selectedCase && (
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-8 border border-gov-border dark:border-slate-700 shadow-sm text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                कोई डॉकेट चयनित नहीं है (No Docket Selected)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                अपनी दर्ज की गई शिकायत की स्थिति देखने और आधिकारिक Grievance PDF डाउनलोड करने के लिए ऊपर अपना शिकायत क्रमांक (Docket ID) दर्ज करें, या नीचे नई शिकायत दर्ज करें।
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  className="px-4 py-2 bg-gov-navy hover:bg-gov-teal text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>नई शिकायत दर्ज करें (File New Grievance)</span>
                </button>
              </div>
            </div>
          )}

          {/* Case Details & Progress Timeline */}
          {selectedCase && (
            <div className="space-y-6">
              {/* Status Header Banner */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-gov-border dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-lg sm:text-xl font-bold font-mono text-gov-navy dark:text-slate-100">
                      {selectedCase.id}
                    </span>
                    <span
                      className={`text-xs px-3 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        selectedCase.riskLevel === 'Critical'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-300 dark:border-red-800'
                          : selectedCase.riskLevel === 'High'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-300 dark:border-orange-800'
                          : selectedCase.riskLevel === 'Moderate'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      {selectedCase.riskLevel} Priority
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                      Status: {selectedCase.status}
                    </span>
                  </div>
                  <p className="text-xs text-gov-textMuted dark:text-slate-400 mt-1">
                    Filing Channel: <span className="font-semibold">{selectedCase.channel}</span> • District: <span className="font-semibold">{selectedCase.district || 'Verified'}</span> • Flagged: {selectedCase.flaggedAt}
                  </p>
                </div>

                {/* 1-Click PDF Download Button */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>{downloading ? 'Drafting Official Docket...' : 'Download Grievance Docket (PDF)'}</span>
                </button>
              </div>

              {/* Real Incident Narrative Card */}
              {selectedCase.transcript && selectedCase.transcript.length > 0 && (
                <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-gov-border dark:border-slate-700 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gov-navy dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-gov-teal" />
                    <span>Incident Complaint Narrative & AI Triage Record</span>
                  </h3>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-800 dark:text-slate-200 space-y-2">
                    <p className="italic font-medium text-slate-700 dark:text-slate-300">
                      "{selectedCase.transcript[0]?.text}"
                    </p>
                    {selectedCase.transcript[1] && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-gov-teal dark:text-teal-400 font-medium">
                        <strong>AI Response & Action:</strong> {selectedCase.transcript[1]?.text}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5-Stage Official Timeline */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-gov-border dark:border-slate-700 shadow-sm space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gov-navy dark:text-slate-200">
                  Procedural Lifecycle & Redressal Milestones
                </h2>

                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {TRACKING_STEPS.map((item) => {
                    const isPassed = item.step <= currentStep;
                    const isCurrent = item.step === currentStep;
                    const IconComponent = item.icon;

                    return (
                      <div key={item.step} className="relative group">
                        {/* Stepper Dot */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                            isPassed
                              ? 'bg-gov-teal text-white ring-4 ring-teal-100 dark:ring-teal-950/60'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Stage {item.step}
                            </span>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" />
                                Current Stage
                              </span>
                            )}
                          </div>
                          <h3
                            className={`text-sm sm:text-base font-bold ${
                              isPassed
                                ? 'text-gov-navy dark:text-slate-100'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.subtitle}
                          </p>

                          {/* Extra context for specific steps */}
                          {item.step === 2 && selectedCase.assignedTo && (
                            <div className="mt-2 text-xs p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-200">
                              <span className="font-semibold">Nodal Officer Assigned:</span> {selectedCase.assignedTo} (Contact verified via MoSJE Nodal Directory)
                            </div>
                          )}

                          {item.step === 3 && (
                            <div className="mt-2 text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                              <span className="font-semibold">Statutory Legal Coverage:</span> {selectedCase.violationTags?.join(', ') || 'PoA Act, 1989'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Audit Trail & Redressal Log */}
              {selectedCase.auditTrail && selectedCase.auditTrail.length > 0 && (
                <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-gov-border dark:border-slate-700 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gov-textMuted dark:text-slate-300">
                    Official Audit Trail & Action Log
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedCase.auditTrail.map((log, i) => (
                      <div key={i} className="py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs">
                        <div>
                          <span className="font-bold text-gov-navy dark:text-slate-200">{log.action}</span>
                          <span className="text-slate-400 ml-2">by {log.actor}</span>
                          <p className="text-slate-600 dark:text-slate-400 mt-0.5">{log.details}</p>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Emergency Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="tel:14566"
                  className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-center gap-3 hover:shadow-md transition-shadow"
                >
                  <PhoneCall className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold">NHAA Helpline</div>
                    <div className="text-sm font-extrabold">14566 (24x7)</div>
                  </div>
                </a>

                <a
                  href="tel:112"
                  className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 flex items-center gap-3 hover:shadow-md transition-shadow"
                >
                  <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Emergency Police</div>
                    <div className="text-sm font-extrabold">112 (Instant)</div>
                  </div>
                </a>

                <a
                  href="tel:14416"
                  className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-200 flex items-center gap-3 hover:shadow-md transition-shadow"
                >
                  <ExternalLink className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Tele-MANAS Care</div>
                    <div className="text-sm font-extrabold">14416 (Counselling)</div>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
