'use client';

import { useState, useEffect } from 'react';
import { initialCases } from './mockData';

const STORAGE_KEY = 'svi_cases_state_v1';

export function getStoredCases() {
  if (typeof window === 'undefined') return initialCases;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
      return initialCases;
    }
    return JSON.parse(data);
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

export function useCaseStore() {
  const [cases, setCases] = useState(initialCases);

  useEffect(() => {
    setCases(getStoredCases());
  }, []);

  const claimCase = (caseId, officerName = 'Officer Sharma') => {
    const updated = cases.map((c) => {
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
          auditTrail: [newAudit, ...c.auditTrail]
        };
      }
      return c;
    });

    setCases(updated);
    saveStoredCases(updated);
  };

  const applyHumanAction = (caseId, { actionType, newRiskLevel, reason, notes, officerName = 'Officer Sharma' }) => {
    const updated = cases.map((c) => {
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
          auditTrail: [newAudit, ...c.auditTrail]
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
  };
}
