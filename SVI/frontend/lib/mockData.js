export const initialCases = [
  {
    id: "SVI-2026-9041",
    channel: "Chatbot",
    channelIcon: "message-square",
    riskLevel: "Critical",
    riskScore: 92,
    language: "Hindi",
    flaggedAt: "3 mins ago",
    timestamp: "2026-09-11T11:35:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(r)", "PoA Act Sec 3(1)(s)"],
    indicators: [
      { name: "Severe Acute Distress", severity: "high", confidence: 96 },
      { name: "Fear of Imminent Harm", severity: "critical", confidence: 91 },
      { name: "Social Isolation", severity: "medium", confidence: 74 }
    ],
    vocalSignals: {
      tremorScore: "0.84 (Elevated)",
      pitchVariation: "High instability",
      speechRate: "Rapid / breathless"
    },
    recommendedPathway: "Immediate High-Priority Human Counsellor Routing & Emergency Protocol Standby (112)",
    transcript: [
      { sender: "Victim", text: "मुझे बहुत डर लग रहा है, वो लोग फिर से मेरे घर के बाहर आ गए हैं और धमकियाँ दे रहे हैं। मुझे नहीं पता मैं क्या करूँ।" },
      { sender: "SVI AI", text: "आप इस समय सुरक्षित स्थान पर रहने का प्रयास करें। यदि कोई तत्काल खतरा है तो हम तुरंत 112 और निकटतम सहायता से संपर्क कर रहे हैं।" },
      { sender: "Victim", text: "कृपया मेरी बात किसी अधिकारी या काउंसलर से करवाएं, मुझे बहुत घबराहट हो रही है।" }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-11 11:35:12", details: "Classified as Critical (Score: 92/100)" }
    ]
  },
  {
    id: "SVI-2026-9042",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "High",
    riskScore: 78,
    language: "English",
    flaggedAt: "12 mins ago",
    timestamp: "2026-09-11T11:26:00Z",
    status: "In Review",
    assignedTo: "Officer R. Sharma (ID: 412)",
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(za)"],
    indicators: [
      { name: "Continuous Harassment Trauma", severity: "high", confidence: 85 },
      { name: "Depressive Affect", severity: "high", confidence: 79 },
      { name: "Legal Aid Requirement", severity: "medium", confidence: 88 }
    ],
    vocalSignals: {
      tremorScore: "0.62 (Moderate)",
      pitchVariation: "Subdued / low energy",
      speechRate: "Slow"
    },
    recommendedPathway: "Assign to Senior Trauma Counsellor & DLSA Free Legal Aid Cell",
    transcript: [
      { sender: "Victim", text: "I have been facing constant discrimination and verbal intimidation in my locality for 2 weeks now. I feel completely overwhelmed and unable to sleep." },
      { sender: "SVI AI", text: "I hear how heavy and distressing this situation has been for you. You have a right to safety and respect. We are here to support you through this." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-11 11:26:04", details: "Classified as High (Score: 78/100)" },
      { action: "Case Claimed", actor: "Officer R. Sharma", timestamp: "2026-09-11 11:30:15", details: "Claimed for active triage & intake." }
    ]
  },
  {
    id: "SVI-2026-9043",
    channel: "Web Portal",
    channelIcon: "globe",
    riskLevel: "Moderate",
    riskScore: 54,
    language: "Marathi",
    flaggedAt: "28 mins ago",
    timestamp: "2026-09-11T11:10:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PCR Act Sec 7"],
    indicators: [
      { name: "Procedural Anxiety", severity: "medium", confidence: 71 },
      { name: "Complaint Follow-up Stress", severity: "medium", confidence: 66 }
    ],
    vocalSignals: null,
    recommendedPathway: "Standard Counselling Session & Grievance Tracking Assistance",
    transcript: [
      { sender: "Victim", text: "मी आधी तक्रार दाखल केली होती पण मला अजून काही उत्तर मिळालेले नाही, मला खूप चिंता वाटते आहे." },
      { sender: "SVI AI", text: "तुमची काळजी समजण्यासारखी आहे. आम्ही तुमच्या तक्रारीची स्थिती तपासण्यासाठी आणि तुम्हाला मार्गदर्शन करण्यासाठी मदत करू." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-11 11:10:08", details: "Classified as Moderate (Score: 54/100)" }
    ]
  },
  {
    id: "SVI-2026-9044",
    channel: "IVRS Voice",
    channelIcon: "mic",
    riskLevel: "Critical",
    riskScore: 95,
    language: "Hindi",
    flaggedAt: "45 mins ago",
    timestamp: "2026-09-11T10:53:00Z",
    status: "Escalated",
    assignedTo: "Supervisor K. Patel",
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(2)(v)", "PoA Act Sec 3(1)(u)"],
    indicators: [
      { name: "Imminent Danger Indicator", severity: "critical", confidence: 97 },
      { name: "High Vocal Agitation", severity: "critical", confidence: 93 }
    ],
    vocalSignals: {
      tremorScore: "0.91 (Severe)",
      pitchVariation: "Extreme spike",
      speechRate: "Distressed crying / breathless"
    },
    recommendedPathway: "Direct Emergency Dispatch & On-Ground Quick Response Team Notification",
    transcript: [
      { sender: "Victim", text: "कृपया कोई मेरी मदद करे, यहाँ कुछ लोग जबरदस्ती दरवाज़ा तोड़ने की कोशिश कर रहे हैं।" },
      { sender: "SVI AI", text: "तत्काल आपातकालीन नियंत्रण कक्ष 112 को सूचित किया जा रहा है। अपने आप को अंदर से सुरक्षित रखें।" }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-11 10:53:11", details: "Classified as Critical (Score: 95/100)" },
      { action: "Emergency Escalated", actor: "Supervisor K. Patel", timestamp: "2026-09-11 10:55:00", details: "Dispatched to District Control Room & 112." }
    ]
  },
  {
    id: "SVI-2026-9045",
    channel: "Chatbot",
    channelIcon: "message-square",
    riskLevel: "Low",
    riskScore: 24,
    language: "English",
    flaggedAt: "1 hour ago",
    timestamp: "2026-09-11T10:38:00Z",
    status: "Resolved",
    assignedTo: "Officer M. Sen",
    voiceConsented: false,
    audioUrl: null,
    violationTags: [],
    indicators: [
      { name: "General Scheme Inquiry", severity: "low", confidence: 92 },
      { name: "Mild Hesitation", severity: "low", confidence: 55 }
    ],
    vocalSignals: null,
    recommendedPathway: "Provide NHAA Documentation & Welfare Scheme Information",
    transcript: [
      { sender: "Victim", text: "Hello, I wanted to know the procedure to file a grievance under the PCR Act and what documents are required." },
      { sender: "SVI AI", text: "Under the Protection of Civil Rights Act, you can submit your grievance online or via your nearest Sub-Divisional Magistrate office. Here are the step-by-step guidelines." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-11 10:38:05", details: "Classified as Low (Score: 24/100)" },
      { action: "Resolved & Closed", actor: "Officer M. Sen", timestamp: "2026-09-11 10:48:30", details: "Information provided to complainant. Case closed." }
    ]
  }
];

export const aggregateAnalytics = {
  totalTriaged: 1428,
  avgResponseTimeSec: 84,
  highRiskCount: 328,
  highRiskPct: 23,
  overrideCount: 91,
  overridePct: 6.4,
  resolvedCount: 1185,
  resolutionRatePct: 83,
  channelDistribution: [
    { name: "Helpline (14566)", percentage: 46, count: 657 },
    { name: "Chatbot Widget", percentage: 28, count: 400 },
    { name: "Web Portal Intake", percentage: 16, count: 228 },
    { name: "IVRS Telephony", percentage: 10, count: 143 }
  ],
  riskDistribution: [
    { level: "Critical", percentage: 9, count: 128, color: "bg-red-700 text-white" },
    { level: "High", percentage: 23, count: 328, color: "bg-red-500 text-white" },
    { level: "Moderate", percentage: 38, count: 543, color: "bg-amber-500 text-white" },
    { level: "Low", percentage: 30, count: 429, color: "bg-emerald-600 text-white" }
  ],
  languageBreakdown: [
    { lang: "Hindi (हिन्दी)", percentage: 48 },
    { lang: "English", percentage: 22 },
    { lang: "Marathi (मराठी)", percentage: 11 },
    { lang: "Tamil (தமிழ்)", percentage: 8 },
    { lang: "Bengali (বাংলা)", percentage: 6 },
    { lang: "Others", percentage: 5 }
  ],
  weeklyTrend: [
    { day: "Mon", total: 180, highRisk: 42 },
    { day: "Tue", total: 210, highRisk: 48 },
    { day: "Wed", total: 195, highRisk: 39 },
    { day: "Thu", total: 230, highRisk: 55 },
    { day: "Fri", total: 245, highRisk: 61 },
    { day: "Sat", total: 190, highRisk: 44 },
    { day: "Sun", total: 178, highRisk: 39 }
  ]
};
