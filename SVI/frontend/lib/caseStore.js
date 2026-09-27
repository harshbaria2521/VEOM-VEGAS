'use client';

import { useState, useEffect } from 'react';
import { initialCases } from './mockData';
import { assessComplaint } from './sviScoring';

const STORAGE_KEY = 'svi_cases_state_v7';

export function getStoredCases() {
  if (typeof window === 'undefined') return initialCases;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
      return initialCases;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      const parsedIds = new Set(parsed.map((c) => c.id));
      const missingInitial = initialCases.filter((c) => !parsedIds.has(c.id));
      return [...parsed, ...missingInitial];
    }
    return initialCases;
  } catch (e) {
    return initialCases;
  }
}

export function saveStoredCases(cases) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (e) {
    console.error('Failed to save cases to storage', e);
  }
}

export function getCaseById(id) {
  if (!id) return null;
  const cases = getStoredCases();
  return cases.find((c) => c.id.toLowerCase() === id.toLowerCase().trim()) || null;
}

export function registerNewComplaint({
  complaintText,
  messages = null,   // optional structured transcript from AI chat
  victimName = 'Anonymous Complainant',
  district = 'Unspecified',
  state = 'India',
  channel = 'Web Portal',
  preferredLanguage = 'Hindi',
  voiceConsented = true,
  victimId = '',
  victimPhone = '',
}) {
  const assessment = assessComplaint(complaintText);
  const now = new Date();
  const timestampStr = now.toISOString();
  const dateStr = timestampStr.replace('T', ' ').substring(0, 19);

  // Generate unique docket ID (e.g. SVI-2026-4812)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newId = `SVI-2026-${randomSuffix}`;

  const newCase = {
    id: newId,
    victimName: victimName || 'Anonymous Complainant',
    victimId,
    victimPhone,
    district,
    state,
    channel,
    channelIcon: channel && channel.includes('Chatbot') ? 'message-square' : 'file-text',
    riskLevel: assessment.riskLevel,
    riskScore: assessment.score,
    language: preferredLanguage,
    flaggedAt: 'Just now',
    timestamp: timestampStr,
    status: 'New',
    assignedTo: assessment.riskLevel === 'Critical' ? 'Officer R. Sharma (ID: 412)' : null,
    voiceConsented,
    audioUrl: null,
    violationTags: assessment.sections,
    reliefEntitlement: assessment.reliefEntitlement,
    sectionDetails: assessment.sectionDetails,
    complaintText: complaintText,
    indicators: [
      { name: 'Threat & Violence Indicator', severity: assessment.riskLevel.toLowerCase(), confidence: Math.min(assessment.score + 2, 99) },
      { name: 'PoA / Statutory Offence', severity: assessment.score > 60 ? 'critical' : 'high', confidence: 94 },
      { name: 'Trauma & Distress Intensity', severity: assessment.score > 75 ? 'critical' : assessment.score > 40 ? 'high' : 'medium', confidence: 90 },
      { name: 'Procedural Vulnerability', severity: assessment.score > 50 ? 'high' : 'medium', confidence: 85 },
    ],
    vocalSignals: {
      tremorScore: assessment.score > 75 ? '0.88 (Elevated Panic / Distress)' : assessment.score > 50 ? '0.62 (Moderate Stress)' : '0.24 (Controlled)',
      pitchVariation: assessment.score > 75 ? 'High instability / panic spikes detected' : 'Standard conversational baseline',
      speechRate: assessment.score > 75 ? 'Rapid / breathless sobbing' : 'Steady reporting',
    },
    recommendedPathway: assessment.recommendedPathway,
    // Use structured AI chat messages if provided, otherwise build a simple one-entry transcript
    transcript: messages && messages.length > 0
      ? messages
      : [
          { sender: 'Victim', text: complaintText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          {
            sender: 'SVI AI',
            text: `Case ${newId} registered. Risk score: ${assessment.score}/100 (${assessment.riskLevel}). Sections: ${assessment.sections.join(', ')}. Nodal officer and DLSA alerted.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ],
    auditTrail: [
      {
        action: 'AI Assessment Completed',
        actor: 'SVI AI Engine v2',
        timestamp: dateStr,
        details: `Classified as ${assessment.riskLevel} (Score: ${assessment.score}/100). Keywords: ${assessment.detectedKeywords.join(', ') || 'Natural language report'}. Sections: ${assessment.sections.join(', ')}.`
      },
      {
        action: 'Grievance Registered',
        actor: 'Citizen Intake',
        timestamp: dateStr,
        details: `Submitted via ${channel}. District: ${district}, State: ${state}. Relieved Slab: ${assessment.reliefEntitlement}.`
      }
    ]
  };

  const existing = getStoredCases();
  const updated = [newCase, ...existing];
  saveStoredCases(updated);

  return { newCase, assessment };
}

export function useCaseStore() {
  const [cases, setCases] = useState(initialCases);

  // Load from localStorage on mount
  useEffect(() => {
    setCases(getStoredCases());
  }, []);

  // Cross-tab sync: listen for storage events from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        setCases(getStoredCases());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Same-tab polling: pick up new complaints written by ChatWidget in the same tab
  useEffect(() => {
    const interval = setInterval(() => {
      const latest = getStoredCases();
      setCases((prev) => {
        // Only update if the count changed (new complaint added or case modified)
        if (latest.length !== prev.length) return latest;
        // Also check if any case data changed (status, assignedTo, etc.)
        const prevJson = JSON.stringify(prev.map(c => c.id + c.status + (c.assignedTo || '')));
        const latestJson = JSON.stringify(latest.map(c => c.id + c.status + (c.assignedTo || '')));
        if (prevJson !== latestJson) return latest;
        return prev;
      });
    }, 2000); // poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const refreshCases = () => {
    setCases(getStoredCases());
  };

  const claimCase = (caseId, officerName = 'Officer Sharma') => {
    // Re-read from storage to get the absolute latest (includes newly registered complaints)
    const freshCases = getStoredCases();
    const updated = freshCases.map((c) => {
      if (c.id === caseId) {
        const newAudit = {
          action: 'Case Claimed',
          actor: officerName,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          details: `Assigned to ${officerName} for active investigation and counselling support.`
        };
        return {
          ...c,
          status: 'In Review',
          assignedTo: officerName,
          auditTrail: [newAudit, ...(c.auditTrail || [])]
        };
      }
      return c;
    });

    setCases(updated);
    saveStoredCases(updated);
  };

  // Admin function: reassign a case to a different officer
  const reassignOfficer = (caseId, newOfficerName, adminName = 'Admin') => {
    const freshCases = getStoredCases();
    const updated = freshCases.map((c) => {
      if (c.id === caseId) {
        const newAudit = {
          action: 'Officer Reassigned',
          actor: adminName,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          details: `Case reassigned from ${c.assignedTo || 'Unassigned'} to ${newOfficerName} by administrator.`
        };
        return {
          ...c,
          assignedTo: newOfficerName,
          auditTrail: [newAudit, ...(c.auditTrail || [])]
        };
      }
      return c;
    });

    setCases(updated);
    saveStoredCases(updated);
  };

  const applyHumanAction = (caseId, { actionType, newRiskLevel, reason, notes, officerName = 'Officer Sharma' }) => {
    const freshCases = getStoredCases();
    const updated = freshCases.map((c) => {
      if (c.id === caseId) {
        let updatedStatus = c.status;
        let updatedRisk = c.riskLevel;
        let actionLabel = actionType;

        if (actionType === 'approve') {
          updatedStatus = 'In Review';
          actionLabel = 'Assessment Approved';
        } else if (actionType === 'override') {
          updatedRisk = newRiskLevel || c.riskLevel;
          actionLabel = `Risk Overridden to ${newRiskLevel}`;
        } else if (actionType === 'escalate') {
          updatedStatus = 'Escalated';
          updatedRisk = 'Critical';
          actionLabel = 'Emergency Escalated (112/Police)';
        } else if (actionType === 'resolve') {
          updatedStatus = 'Resolved';
          actionLabel = 'Case Closed & Resolved';
        }

        const newAudit = {
          action: actionLabel,
          actor: officerName,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          details: reason ? `Reason: ${reason}. Notes: ${notes || 'None'}` : `Notes: ${notes || 'Action recorded'}`
        };

        return {
          ...c,
          status: updatedStatus,
          riskLevel: updatedRisk,
          auditTrail: [newAudit, ...(c.auditTrail || [])]
        };
      }
      return c;
    });

    setCases(updated);
    saveStoredCases(updated);
  };

  return {
    cases,
    claimCase,
    applyHumanAction,
    reassignOfficer,
    refreshCases,
    registerComplaint: registerNewComplaint,
  };
}
