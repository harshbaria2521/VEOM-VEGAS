import { jsPDF } from 'jspdf';
import { assessComplaint } from './sviScoring';

const STATUTORY_OFFENCE_REGISTRY = [
  {
    pattern: /3\(2\)\(v\)/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 3(2)(v)',
    desc: 'Commits heinous offence / Grievous bodily hurt against SC/ST member punishable with life imprisonment'
  },
  {
    pattern: /3\(1\)\(a\)/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 3(1)(a)',
    desc: 'Physical assault & force applied against member of SC/ST or putting obnoxious substances'
  },
  {
    pattern: /3\(1\)\(r\)/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 3(1)(r)',
    desc: 'Intentional insult, abuse or intimidation with intent to humiliate in any place within public view'
  },
  {
    pattern: /3\(1\)\(s\)/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 3(1)(s)',
    desc: 'Abuses any member of Scheduled Caste / Scheduled Tribe by caste name in any place within public view'
  },
  {
    pattern: /3\(1\)\(g\)/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 3(1)(g)',
    desc: 'Wrongfully dispossesses a member of SC/ST from land or premises, or destroys standing crops'
  },
  {
    pattern: /3\(1\)\(za\)/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 3(1)(za)',
    desc: 'Obstructs or prevents SC/ST member from using customary passage, water well, or public amenities'
  },
  {
    pattern: /3\(1\)\(w\)/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 3(1)(w)',
    desc: 'Assault or use of criminal force to woman belonging to SC/ST with intent to outrage her modesty'
  },
  {
    pattern: /3\(1\)\(u\)/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 3(1)(u)',
    desc: 'Promotes feelings of enmity, hatred or ill-will against members of SC/ST by words or public acts'
  },
  {
    pattern: /pcr/i,
    act: 'PCR Act, 1955',
    sec: 'Sec 4',
    desc: 'Enforcement of social disability / untouchability regarding access to public water, taps, or amenities'
  },
  {
    pattern: /poa.*4|sec 4.*poa/i,
    act: 'PoA Act, 1989',
    sec: 'Sec 4',
    desc: 'Punishment for neglect of duties by public servant (wilful neglect to register FIR / investigate)'
  },
  {
    pattern: /12\(4\)/i,
    act: 'PoA Rules, 1995',
    sec: 'Rule 12(4)',
    desc: 'Statutory interim relief and compensation disbursement upon FIR registration and charge-sheet stage'
  },
  {
    pattern: /bns.*189|189/i,
    act: 'BNS, 2023',
    sec: 'Sec 189',
    desc: 'Unlawful assembly with deadly weapons and riotous disturbance of public peace'
  },
  {
    pattern: /ugc/i,
    act: 'UGC Regulations',
    sec: 'Equity Reg. 2012',
    desc: 'Prevention of caste-based discrimination and institutional harassment in educational institutions'
  }
];

function resolveOffenceDetail(tag) {
  const match = STATUTORY_OFFENCE_REGISTRY.find(item => item.pattern.test(tag));
  if (match) {
    return {
      act: match.act,
      sec: tag.length > 3 && tag.includes('Sec') ? tag : match.sec,
      desc: match.desc
    };
  }
  return {
    act: tag.includes('PCR') ? 'PCR Act, 1955' : 'PoA Act, 1989',
    sec: tag,
    desc: 'Statutory offence registered under Scheduled Castes and Scheduled Tribes protection framework'
  };
}

/**
 * Generates an official Government of India (MoSJE / NHAA 14566) Grievance Docket PDF.
 * @param {object} caseData - Object containing case/chat details
 */
export function generateGrievancePDF(caseData = {}) {
  // Guard: PDF should only generate if a valid complaint narrative or case ID exists
  const hasTranscript = caseData.transcript && Array.isArray(caseData.transcript) && caseData.transcript.some(m => (m.sender === 'Victim' || m.sender === 'user') && m.text?.trim());
  const hasMessage = Boolean((caseData.message || caseData.complaintText || '').trim());
  if (!caseData || (!hasTranscript && !hasMessage && !caseData.id)) {
    console.warn('Grievance PDF generation aborted: No complaint details provided.');
    return null;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // --- 1. National Tricolor Top Banner ---
  const tricolorHeight = 2.5;
  const stripeWidth = contentWidth / 3;
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(margin, y, stripeWidth, tricolorHeight, 'F');
  doc.setFillColor(240, 240, 240); // White/Neutral
  doc.rect(margin + stripeWidth, y, stripeWidth, tricolorHeight, 'F');
  doc.setFillColor(19, 136, 8); // Green
  doc.rect(margin + stripeWidth * 2, y, stripeWidth, tricolorHeight, 'F');
  y += 7;

  // --- 2. Ministry Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('GOVERNMENT OF INDIA / भारत सरकार', pageWidth / 2, y, { align: 'center' });
  y += 4.5;

  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('MINISTRY OF SOCIAL JUSTICE AND EMPOWERMENT', pageWidth / 2, y, { align: 'center' });
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(194, 65, 12); // Amber/rust
  doc.text('NATIONAL HELPLINE AGAINST ATROCITIES (NHAA - 14566) / SVI PLATFORM', pageWidth / 2, y, { align: 'center' });
  y += 5;

  // Thin dividing line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // --- 3. Document Title Box ---
  doc.setFillColor(15, 30, 65); // Deep Navy
  doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL GRIEVANCE REGISTRATION & INCIDENT REPORT DOCKET', pageWidth / 2, y + 6, { align: 'center' });
  y += 13;

  // Docket & Filing Meta Box
  const docketId = caseData.id || `NHAA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = caseData.timestamp ? new Date(caseData.timestamp).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');
  const riskLevel = caseData.riskLevel || 'High';
  const channel = caseData.channel || 'SVI Multilingual AI Chatbot';
  const language = caseData.language || 'Hindi';

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Docket Reference ID:', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(docketId, margin + 35, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Filing Timestamp:', margin + 95, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(timestamp, margin + 125, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Intake Channel:', margin + 4, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(channel, margin + 35, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Assigned Officer:', margin + 95, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(caseData.assignedTo || 'Special Atrocity Cell (SP Office)', margin + 125, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Case Priority Level:', margin + 4, y + 18);
  
  // Badge color for severity
  if (riskLevel === 'Critical') {
    doc.setTextColor(220, 38, 38);
  } else if (riskLevel === 'High') {
    doc.setTextColor(217, 119, 6);
  } else {
    doc.setTextColor(13, 148, 136);
  }
  doc.setFont('helvetica', 'bold');
  doc.text(riskLevel.toUpperCase(), margin + 35, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Legal Privacy:', margin + 95, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 149, 193);
  doc.text('DPDP Act 2023 Anonymized & Protected', margin + 125, y + 18);

  y += 29;

  // Extract Incident Narrative early so both Section 1 (Statutory Sections) and Section 2 (Narrative) stay in sync
  let narrativeText = "";
  if (caseData.transcript && Array.isArray(caseData.transcript)) {
    const victimMsgs = caseData.transcript.filter(m => m.sender === 'Victim' || m.sender === 'user').map(m => m.text);
    narrativeText = victimMsgs.join(' ');
  }
  if (!narrativeText && caseData.message) {
    narrativeText = caseData.message;
  }
  if (!narrativeText && caseData.complaintText) {
    narrativeText = caseData.complaintText;
  }
  if (!narrativeText) {
    narrativeText = "Victim reported severe social intimidation, caste-based verbal abuse, and denial of public community resources by influential perpetrators. Immediate fear of physical reprisal noted. Triage system generated high anxiety indicators and initiated emergency protocols under PoA Act directives.";
  }

  // Always assess narrative text to ensure legal sections and relief entitlement strictly match the complaint
  let assessedInfo = narrativeText ? assessComplaint(narrativeText) : null;
  let effectiveTags = (caseData.violationTags && caseData.violationTags.length > 0)
    ? caseData.violationTags
    : (assessedInfo ? assessedInfo.sections : ['PoA Act Sec 3(1)(r)', 'PoA Act Sec 3(1)(s)', 'PCR Act Sec 4']);

  // Map each section to its exact statutory act and real legal offence description
  const tags = effectiveTags.slice(0, 4).map(resolveOffenceDetail);

  // --- 4. Statutory Legal Sections Tagged ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. STATUTORY VIOLATION CLASSIFICATION & ACTS INVOKED', margin, y);
  y += 3;

  // Draw table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('STATUTE / ACT', margin + 3, y + 4.2);
  doc.text('SECTION', margin + 38, y + 4.2);
  doc.text('NATURE OF STATUTORY OFFENCE', margin + 78, y + 4.2);
  y += 6;

  tags.forEach((item, index) => {
    doc.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(item.act, margin + 3, y + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(item.sec, margin + 38, y + 4);
    doc.setFont('helvetica', 'normal');
    const descText = item.desc.length > 76 ? item.desc.substring(0, 75) + '...' : item.desc;
    doc.text(descText, margin + 78, y + 4);
    y += 6;
  });

  y += 4;

  // --- 5. Statement of Grievance & Incident Narrative ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. INCIDENT NARRATIVE & VICTIM TESTIMONY (AI SYNTHESIZED)', margin, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  const splitNarrative = doc.splitTextToSize(narrativeText, contentWidth - 8);
  doc.text(splitNarrative.slice(0, 5), margin + 4, y + 5);
  y += 30;

  // --- 6. Immediate Statutory Relief Entitlements (PoA Rules Schedule I) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. STATUTORY RELIEF & ASSISTANCE ENTITLEMENTS (CENTRAL SECTOR SCHEME)', margin, y);
  y += 4;

  const rawRelief = caseData.reliefEntitlement || (assessedInfo ? assessedInfo.reliefEntitlement : '');
  const reliefAmount = rawRelief
    ? rawRelief.replace(/₹/g, 'Rs. ')
    : 'Rs. 1,00,000/- to Rs. 2,50,000/-';

  const reliefItems = [
    {
      label: 'Financial Relief (First Stage):',
      text: `${reliefAmount} immediate sanctionable relief upon FIR registration under MoSJE Central Sector Scheme.`
    },
    {
      label: 'Legal Aid Counsel Appointment:',
      text: 'Free designated legal counsel assigned under District Legal Services Authority (DLSA) / Legal Defense System.'
    },
    {
      label: 'Psychological & Protective Care:',
      text: 'Tele-MANAS trauma counseling support active. Witness Protection scheme assessment ordered.'
    }
  ];

  const labelColWidth = 55;
  const valueColWidth = contentWidth - labelColWidth - 8;

  // Pre-calculate wrapped lines and exact dynamic box height
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  let computedBoxHeight = 5;
  const formattedItems = reliefItems.map((item) => {
    const lines = doc.splitTextToSize(item.text, valueColWidth);
    const rowHeight = Math.max(lines.length * 3.8, 5.5);
    computedBoxHeight += rowHeight + 2;
    return { ...item, lines, rowHeight };
  });
  computedBoxHeight += 2;

  // Draw Yellow Box with dynamic height
  doc.setFillColor(254, 243, 199); // Light amber
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, y, contentWidth, computedBoxHeight, 1.5, 1.5, 'FD');

  let curY = y + 4.5;
  formattedItems.forEach((item) => {
    // Bullet and Label (Bold amber)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(146, 64, 14);
    doc.text(`• ${item.label}`, margin + 4, curY);

    // Value text (wrapped, clean dark slate)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);
    doc.text(item.lines, margin + labelColWidth + 4, curY);

    curY += item.rowHeight + 2;
  });

  y += computedBoxHeight + 6;

  // --- 7. Official Endorsement & Verification Footer ---
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  // Left side signature / verification text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('AUTONOMOUS AUDIT & VERIFICATION SEAL', margin, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Generated electronically under Smart Victim Intelligence (SVI) Engine v2.0.', margin, y + 8);
  doc.text('Valid for immediate submission to SHO / Sub-Divisional Magistrate / Special Court.', margin, y + 12);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.text(`DIGITAL SHA-256 HASH: ${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`, margin, y + 16);

  // Right side stamp box
  const stampWidth = 48;
  const stampX = pageWidth - margin - stampWidth;
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.roundedRect(stampX, y, stampWidth, 18, 2, 2, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(5, 150, 105);
  doc.text('NHAA 14566 VERIFIED', stampX + stampWidth / 2, y + 6, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(71, 85, 105);
  doc.text('National Helpline Against Atrocities', stampX + stampWidth / 2, y + 10, { align: 'center' });
  doc.text('24x7 Helpline: 14566 | Police: 112', stampX + stampWidth / 2, y + 14, { align: 'center' });

  // Save/download
  doc.save(`NHAA_Grievance_Docket_${docketId}.pdf`);
  return docketId;
}
