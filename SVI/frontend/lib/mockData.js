/**
 * SVI - Smart Victim Intelligence (NHAA 14566)
 * Real-World Data-Mined Mock Case Records
 *
 * Grounded in:
 * - NCRB "Crime in India" Atrocities Against Scheduled Castes & Scheduled Tribes
 * - Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 (Amended 2015/2018)
 * - Protection of Civil Rights Act, 1955 (PCR Act)
 * - Ministry of Social Justice and Empowerment (MoSJE) NHAA 14566 Grievance Redressal Architecture
 * - Supreme Court Landmark Precedents (Patan Jamal Vali, Lalita Kumari, Ramkrishna Chauhan)
 */

export const initialCases = [
  // 1. CRITICAL - SPEECH (Helpline 14566)
  {
    id: "SVI-2026-9041",
    victimName: "Rameshwar Paswan",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "Critical",
    riskScore: 95,
    language: "Hindi",
    flaggedAt: "3 mins ago",
    timestamp: "2026-09-21T12:55:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(r)", "PoA Act Sec 3(1)(s)", "PoA Act Sec 3(2)(v)"],
    indicators: [
      { name: "Severe Acute Panic & Distress", severity: "high", confidence: 97 },
      { name: "Imminent Armed Mob Violence", severity: "critical", confidence: 95 },
      { name: "Arson & Life Threat", severity: "critical", confidence: 93 },
      { name: "Vocal Acoustic Breakdown", severity: "high", confidence: 91 }
    ],
    vocalSignals: {
      tremorScore: "0.89 (Severe Acoustic Instability)",
      pitchVariation: "Extreme jitter & rapid pitch spikes",
      speechRate: "Rapid, breathless & audible weeping"
    },
    recommendedPathway: "Immediate 112 Emergency Police Dispatch + District SP Alert + High-Priority Trauma Counsellor Routing",
    transcript: [
      { sender: "Victim", text: "नमस्ते... मुझे बहुत डर लग रहा है, वो लोग फिर से हमारे घर के बाहर लाठी और हथियार लेकर आ गए हैं। जातिसूचक गालियाँ दे रहे हैं और दरवाज़ा तोड़ने की कोशिश कर रहे हैं।" },
      { sender: "SVI AI", text: "आप तुरंत घर के सबसे सुरक्षित अंदरूनी कमरे में चले जाएँ और दरवाज़ा बंद रखें। हम तत्काल 112 पुलिस नियंत्रण कक्ष और स्थानीय पुलिस उपाधीक्षक को आपकी लोकेशन भेज रहे हैं।" },
      { sender: "Victim", text: "कृपया जल्दी पुलिस भेजिए, वे कह रहे हैं कि पूरे परिवार को जिंदा जला देंगे। मेरे छोटे बच्चे बहुत रो रहे हैं।" },
      { sender: "SVI AI", text: "आपातकालीन 112 मोबाइल रिस्पांस यूनिट आपकी ओर रवाना कर दी गई है। एक वरिष्ठ नोडल अधिकारी को कॉल ट्रांसफर कर दिया गया है। कॉल न काटें।" }
    ],
    auditTrail: [
      { action: "Voice Acoustic AI Triaged", actor: "SVI Acoustic Engine v2", timestamp: "2026-09-21 12:55:10", details: "Critical distress, pitch jitter (0.89) and lethal threat keywords detected." },
      { action: "Emergency SOS Alert Generated", actor: "SVI AI System", timestamp: "2026-09-21 12:55:15", details: "Ready for officer claim and urgent dispatch." }
    ]
  },

  // 2. CRITICAL - AI CHATBOT
  {
    id: "SVI-2026-9042",
    victimName: "Sunil Kumar Valmiki",
    channel: "SVI Chatbot",
    channelIcon: "message-square",
    riskLevel: "Critical",
    riskScore: 92,
    language: "English",
    flaggedAt: "12 mins ago",
    timestamp: "2026-09-21T12:45:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(2)(v)", "PoA Act Sec 4", "BNS Sec 115(2)"],
    indicators: [
      { name: "Grievous Bodily Harm & Bone Fracture", severity: "critical", confidence: 98 },
      { name: "Police Dereliction & FIR Refusal", severity: "high", confidence: 94 },
      { name: "Perpetrator Intimidation", severity: "high", confidence: 89 }
    ],
    vocalSignals: null,
    recommendedPathway: "Special SC/ST Cell DIG Intervention + Statutory FIR Mandate + DLSA Medical Relocation",
    transcript: [
      { sender: "Victim", text: "I am writing from a district hospital in Bareilly. The local contractor's men attacked me with iron rods because I asked for my daily wages. My left leg is fractured in two places." },
      { sender: "SVI AI", text: "Under Section 3(2)(v) of the PoA Act, grievous bodily harm carries stringent life-imprisonment provisions. Have the doctors recorded the Medico-Legal Certificate (MLC)?" },
      { sender: "Victim", text: "The hospital recorded the MLC, but the local police station officer refused to register an FIR and threatened to file a fake counter-case if I didn't reach a compromise." },
      { sender: "SVI AI", text: "Under Section 4 of the PoA Act, a police officer refusing to register an FIR commits a punishable non-bailable offense. Your complaint is being escalated to the District Superintendent of Police." }
    ],
    auditTrail: [
      { action: "NLP Semantic Triage Completed", actor: "SVI NLP Engine v2.5", timestamp: "2026-09-21 12:45:22", details: "Grievous injury and Sec 4 police dereliction detected. Class: Critical (92/100)." }
    ]
  },

  // 3. HIGH - SPEECH (Helpline 14566)
  {
    id: "SVI-2026-9043",
    victimName: "Govindbhai Vankar",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "High",
    riskScore: 78,
    language: "Gujarati",
    flaggedAt: "35 mins ago",
    timestamp: "2026-09-21T12:20:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(za)(E)", "PoA Act Sec 3(1)(r)", "PCR Act Sec 4"],
    indicators: [
      { name: "Organized Social Boycott", severity: "high", confidence: 95 },
      { name: "Denial of Drinking Water Source", severity: "high", confidence: 92 },
      { name: "Community Transport Stoppage", severity: "medium", confidence: 84 }
    ],
    vocalSignals: {
      tremorScore: "0.68 (Elevated Stress)",
      pitchVariation: "Noticeable voice trembling and stress pauses",
      speechRate: "Moderately hesitant / anxious"
    },
    recommendedPathway: "District Magistrate Inspection + Sub-Divisional Police Officer (SDPO) Protection Bandobast",
    transcript: [
      { sender: "Victim", text: "અમારા સુરેન્દ્રનગર જિલ્લાના ગામમાં પંચાયતે અમારા વાસનો સામાજિક બહિષ્કાર કર્યો છે. અમને ગામના જાહેર કૂવામાંથી પીવાનું પાણી ભરવા દેતા નથી." },
      { sender: "SVI AI", text: "PoA કાયદાની કલમ 3(1)(za) અને PCR કલમ 4 મુજબ પીવાના પાણીના સ્ત્રોત પર રોક લગાવવી એ ગંભીર દંડનીય ગુનો છે. શું રાશન અથવા અન્ય આવશ્યક સેવાઓ પણ રોકવામાં આવી છે?" },
      { sender: "Victim", text: "હા, ગામની કરિયાણાની દુકાનોમાંથી અમને સામાન આપવાની મનાઈ કરી છે અને બાળકોની સ્કૂલ વાન પણ રોકી દેવામાં આવી છે." },
      { sender: "SVI AI", text: "જિલ્લા કલેક્ટર અને સમાજ કલ્યાણ અધિકારીને ત્વરિત મુલાકાત અને સુરક્ષા ટીમ મોકલવા માટે પ્રાથમિકતા ચેતવણી મોકલાઈ છે." }
    ],
    auditTrail: [
      { action: "Voice Intake & Audio Acoustic Assessed", actor: "SVI Speech AI", timestamp: "2026-09-21 12:20:18", details: "Systematic social boycott indicators flagged. Vocal stress: 0.68." }
    ]
  },

  // 4. HIGH - AI CHATBOT
  {
    id: "SVI-2026-9044",
    victimName: "Kailash Meghwal",
    channel: "SVI Chatbot",
    channelIcon: "message-square",
    riskLevel: "High",
    riskScore: 74,
    language: "Hindi",
    flaggedAt: "50 mins ago",
    timestamp: "2026-09-21T12:05:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(g)", "PoA Act Sec 3(1)(f)", "PoA Act Sec 3(1)(r)"],
    indicators: [
      { name: "Unlawful Land Encroachment", severity: "high", confidence: 93 },
      { name: "Standing Crop Destruction", severity: "high", confidence: 90 },
      { name: "Public Intimidation & Caste Abuses", severity: "medium", confidence: 85 }
    ],
    vocalSignals: null,
    recommendedPathway: "Sub-Divisional Magistrate (SDM) Demarcation Order + Revenue Department Injunction",
    transcript: [
      { sender: "Victim", text: "गाँव के दबंगों ने हमारी पट्टा शुदा पुश्तैनी ज़मीन पर जबरन ट्रैक्टर चलाकर हमारी खड़ी मक्का और बाजरे की फसल बर्बाद कर दी है और चारदीवारी तोड़ दी है।" },
      { sender: "SVI AI", text: "अनुसूचित जाति के व्यक्ति की भूमि से बेदखली या फसल का विनाश PoA अधिनियम की धारा 3(1)(g) के तहत दंडनीय अपराध है जिसमें न्यूनतम ₹4,00,000 की वैधानिक राहत देय है।" },
      { sender: "Victim", text: "वे लोग जातिसूचक शब्दों का प्रयोग कर कह रहे हैं कि इस ज़मीन पर तुम्हारा कोई हक़ नहीं है, दोबारा यहाँ दिखे तो जान से हाथ धोना पड़ेगा।" },
      { sender: "SVI AI", text: "राजस्व तहसीलदार और उपमंडल दंडाधिकारी (SDM) को स्थगन आदेश और सुरक्षा सुनिश्चित करने हेतु मामला दर्ज कर अग्रसारित किया गया है।" }
    ],
    auditTrail: [
      { action: "Chatbot Intake Completed", actor: "SVI Conversational Agent", timestamp: "2026-09-21 12:05:30", details: "Land alienation & Section 3(1)(g) violation tagged. Class: High (74/100)." }
    ]
  },

  // 5. MODERATE - SPEECH (Helpline 14566)
  {
    id: "SVI-2026-9045",
    victimName: "M. Murugan",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "Moderate",
    riskScore: 54,
    language: "Tamil",
    flaggedAt: "1 hour ago",
    timestamp: "2026-09-21T11:45:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(za)(B)", "PCR Act Sec 3"],
    indicators: [
      { name: "Temple Entry & Community Space Denial", severity: "medium", confidence: 92 },
      { name: "Customary Festival Exclusion", severity: "medium", confidence: 88 }
    ],
    vocalSignals: {
      tremorScore: "0.42 (Controlled Distress)",
      pitchVariation: "Mild pitch tension, stable speech cadence",
      speechRate: "Normal conversational pace"
    },
    recommendedPathway: "District Social Welfare Officer Conciliation + Revenue Divisional Officer (RDO) Mandate",
    transcript: [
      { sender: "Victim", text: "வணக்கம். எங்கள் கிராமத்து பொது மாரியம்மன் கோயில் திருவிழாவில் எங்கள் பகுதி மக்களை வழிபட விடாமல் ஊர் பெரியவர்கள் தடுத்து நிறுத்துகிறார்கள்." },
      { sender: "SVI AI", text: "பொது வழிபாட்டுத் தலங்களில் வழிபடத் தடை விதிப்பது குடிமை உரிமைகள் பாதுகாப்புச் சட்டம் பிரிவு 3 மற்றும் PoA சட்டத்தின்படி சட்டவிரோதமாகும்." },
      { sender: "Victim", text: "நாங்கள் அமைதியான முறையில் பங்குபெற விரும்புகிறோம், ஆனால் அவர்கள் வழிபாட்டு மண்டபத்திற்கு பூட்டு போட்டு விட்டனர்." },
      { sender: "SVI AI", text: "வருவாய்க் கோட்டாட்சியர் மற்றும் சமூக நீதிப் பிரிவு கண்காணிப்பாளருக்கு உடனடி தலையீடு கோரி அறிவிப்பு அனுப்பப்பட்டுள்ளது." }
    ],
    auditTrail: [
      { action: "Helpline Call Audio Analysed", actor: "SVI Voice Engine", timestamp: "2026-09-21 11:45:15", details: "Temple exclusion logged under PCR Sec 3. Vocal stress controlled (0.42)." }
    ]
  },

  // 6. MODERATE - AI CHATBOT
  {
    id: "SVI-2026-9046",
    victimName: "Deepak Rajak",
    channel: "SVI Chatbot",
    channelIcon: "message-square",
    riskLevel: "Moderate",
    riskScore: 48,
    language: "English",
    flaggedAt: "1.5 hours ago",
    timestamp: "2026-09-21T11:15:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(r)", "PoA Act Sec 3(1)(s)"],
    indicators: [
      { name: "Public Workplace Caste Harassment", severity: "medium", confidence: 91 },
      { name: "Derogatory Verbal Insult in Public View", severity: "medium", confidence: 87 }
    ],
    vocalSignals: null,
    recommendedPathway: "Internal Complaints Committee (ICC) Escalation + District Vigilance Officer Inquiry",
    transcript: [
      { sender: "Victim", text: "I work at a municipal department office. During the staff review meeting yesterday, a senior supervisor used casteist slurs against me in front of all colleagues because of a file delay." },
      { sender: "SVI AI", text: "Under Section 3(1)(r) of the SC/ST PoA Act, intentional insult or intimidation with intent to humiliate in any place within public view is a cognizable offense." },
      { sender: "Victim", text: "I submitted an internal memo to the Municipal Commissioner, but no action was taken and the supervisor is now mocking me publicly." },
      { sender: "SVI AI", text: "We are logging a formal administrative complaint record with the State SC/ST Commission and Municipal Oversight Board for formal disciplinary hearing." }
    ],
    auditTrail: [
      { action: "Chatbot Triage Completed", actor: "SVI NLP Engine v2.5", timestamp: "2026-09-21 11:15:40", details: "Workplace insult in public view tagged under Sec 3(1)(r). Score: 48/100." }
    ]
  },

  // 7. LOW - SPEECH (Helpline 14566)
  {
    id: "SVI-2026-9047",
    victimName: "Adv. Devendra Prakash",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "Low",
    riskScore: 24,
    language: "English",
    flaggedAt: "2 hours ago",
    timestamp: "2026-09-21T10:30:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["Legal Services Authorities Act Sec 12", "PoA Rules Rule 15(5)"],
    indicators: [
      { name: "Legal Aid Advocate Requisition", severity: "low", confidence: 96 },
      { name: "Witness Allowance / TA-DA Procedural Inquiry", severity: "low", confidence: 91 }
    ],
    vocalSignals: {
      tremorScore: "0.14 (Calm / Baseline)",
      pitchVariation: "Composed, steady cadence without vocal strain",
      speechRate: "Standard professional cadence"
    },
    recommendedPathway: "District Legal Services Authority (DLSA) Empanelled Special Counsel Nomination + Form IV Assistance",
    transcript: [
      { sender: "Victim", text: "Hello, good morning. Our pending court matter is scheduled for hearing next month in the Special Atrocities Court. We wish to appoint an empanelled senior counsel under Rule 15(5). What is the official procedure?" },
      { sender: "SVI AI", text: "Under Rule 15(5) of the SC/ST PoA Rules, the District Magistrate is empowered to engage an eminent Senior Advocate of the victim's choice at state expense. You can submit Form IV to the DLSA Secretary." },
      { sender: "Victim", text: "Does the department also cover witness travel and food allowances for family members who need to testify?" },
      { sender: "SVI AI", text: "Yes, under Rule 11 of the PoA Rules, daily maintenance allowance and travel reimbursement are directly provided through the Special Court Nazir for all hearing dates." }
    ],
    auditTrail: [
      { action: "Helpline Inquiry Logged", actor: "SVI Acoustic Engine v2", timestamp: "2026-09-21 10:30:20", details: "Procedural legal guidance request. Vocal tremor baseline (0.14). Low Risk (24/100)." }
    ]
  },

  // 8. LOW - AI CHATBOT
  {
    id: "SVI-2026-9048",
    victimName: "Pooja Jatav",
    channel: "SVI Chatbot",
    channelIcon: "message-square",
    riskLevel: "Low",
    riskScore: 20,
    language: "Hindi",
    flaggedAt: "2.5 hours ago",
    timestamp: "2026-09-21T10:00:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["MoSJE Central Sector Scheme Guidelines"],
    indicators: [
      { name: "Scholarship & Education Grant Inquiry", severity: "low", confidence: 98 },
      { name: "Central Portal Certificate Authentication", severity: "low", confidence: 94 }
    ],
    vocalSignals: null,
    recommendedPathway: "Ministry of Social Justice & Empowerment (MoSJE) Portal Guidance + Welfare Desk",
    transcript: [
      { sender: "Victim", text: "नमस्ते। अनुसूचित जाति के विद्यार्थियों के लिए उच्च शिक्षा पोस्ट-मैट्रिक स्कॉलरशिप स्कीम और कोचिंग योजना के लिए आवेदन करने की अंतिम तिथि और पात्रता की जानकारी चाहिए।" },
      { sender: "SVI AI", text: "MoSJE नेशनल स्कॉलरशिप पोर्टल (scholarships.gov.in) पर पोस्ट-मैट्रिक स्कॉलरशिप के आवेदन खुले हैं। पारिवारिक वार्षिक आय सीमा ₹2.5 लाख तक होनी चाहिए।" },
      { sender: "Victim", text: "क्या जाति प्रमाण पत्र के डिजिटल सत्यापन के लिए तहसील जाने की आवश्यकता है या ऑनलाइन हो जाता है?" },
      { sender: "SVI AI", text: "डिजीलॉकर और स्टेट सर्विस पोर्टल के माध्यम से डिजिटल जाति प्रमाण पत्र का स्वतः सत्यापन हो जाता है। आप ऑनलाइन आवेदन पत्र डाउनलोड कर सकते हैं।" }
    ],
    auditTrail: [
      { action: "Chatbot Guidance Fulfilled", actor: "SVI NLP Engine v2.5", timestamp: "2026-09-21 10:00:15", details: "Educational scheme informational assistance provided. Low Risk (20/100)." }
    ]
  }
];

export const aggregateAnalytics = {
  totalTriaged: 2845,
  avgResponseTimeSec: 68,
  highRiskCount: 654,
  highRiskPct: 23,
  overrideCount: 178,
  overridePct: 6.2,
  resolvedCount: 2360,
  resolutionRatePct: 83,
  channelDistribution: [
    { name: "Helpline (14566)", percentage: 44, count: 1252 },
    { name: "Chatbot Widget", percentage: 31, count: 882 },
    { name: "Web Portal Intake", percentage: 15, count: 427 },
    { name: "IVRS Telephony", percentage: 10, count: 284 }
  ],
  riskDistribution: [
    { level: "Critical", percentage: 11, count: 313, color: "bg-red-700 text-white" },
    { level: "High", percentage: 22, count: 626, color: "bg-red-500 text-white" },
    { level: "Moderate", percentage: 39, count: 1110, color: "bg-amber-500 text-white" },
    { level: "Low", percentage: 28, count: 796, color: "bg-emerald-600 text-white" }
  ],
  languageBreakdown: [
    { lang: "Hindi (हिन्दी)", percentage: 44 },
    { lang: "English", percentage: 19 },
    { lang: "Marathi (मराठी)", percentage: 12 },
    { lang: "Tamil (தமிழ்)", percentage: 9 },
    { lang: "Telugu (తెలుగు)", percentage: 7 },
    { lang: "Bengali (বাংলা)", percentage: 5 },
    { lang: "Gujarati (ગુજરાતી)", percentage: 4 }
  ],
  weeklyTrend: [
    { day: "Mon", total: 380, highRisk: 86 },
    { day: "Tue", total: 420, highRisk: 98 },
    { day: "Wed", total: 395, highRisk: 82 },
    { day: "Thu", total: 450, highRisk: 112 },
    { day: "Fri", total: 485, highRisk: 124 },
    { day: "Sat", total: 370, highRisk: 78 },
    { day: "Sun", total: 345, highRisk: 74 }
  ]
};

export const districtHotspots = [
  {
    id: "DH-01",
    district: "Hathras",
    state: "Uttar Pradesh",
    x: 37.5,
    y: 35.5,
    avgSvi: 92,
    riskLevel: "Critical",
    totalCases: 48,
    criticalCount: 14,
    primaryViolation: "PoA Act Sec 3(2)(v) - Physical Atrocity & Intimidation",
    nodalOfficer: "Superintendent of Police (Special Cell) / DLSA Secy",
    contact: "05662-232100",
    activeAlerts: 3
  },
  {
    id: "DH-02",
    district: "Sitapur",
    state: "Uttar Pradesh",
    x: 44.2,
    y: 36.8,
    avgSvi: 88,
    riskLevel: "Critical",
    totalCases: 39,
    criticalCount: 11,
    primaryViolation: "PoA Act Sec 3(1)(r) - Public Humiliation / Armed Mob Threat",
    nodalOfficer: "DySP Social Justice & Welfare Wing",
    contact: "05862-242201",
    activeAlerts: 2
  },
  {
    id: "DH-03",
    district: "Jaipur",
    state: "Rajasthan",
    x: 31.8,
    y: 37.2,
    avgSvi: 84,
    riskLevel: "Critical",
    totalCases: 42,
    criticalCount: 9,
    primaryViolation: "PoA Act Sec 3(1)(s) - Caste Slurs & Tenancy Dispossession",
    nodalOfficer: "Adv. R. Meena (District Legal Services Authority)",
    contact: "0141-2227456",
    activeAlerts: 1
  },
  {
    id: "DH-04",
    district: "Muzaffarpur",
    state: "Bihar",
    x: 60.5,
    y: 39.8,
    avgSvi: 91,
    riskLevel: "Critical",
    totalCases: 45,
    criticalCount: 13,
    primaryViolation: "PoA Act Sec 3(1)(f) - Forced Crop & Land Eviction",
    nodalOfficer: "Sub-Divisional Magistrate (Sadar)",
    contact: "0621-2212300",
    activeAlerts: 2
  },
  {
    id: "DH-05",
    district: "Gwalior",
    state: "Madhya Pradesh",
    x: 39.5,
    y: 41.5,
    avgSvi: 86,
    riskLevel: "Critical",
    totalCases: 36,
    criticalCount: 10,
    primaryViolation: "PoA Act Sec 3(1)(g) - Agricultural Tenancy Harassment",
    nodalOfficer: "SP CID (Atrocities Investigation Wing)",
    contact: "0751-2445100",
    activeAlerts: 2
  },
  {
    id: "DH-06",
    district: "Jalna",
    state: "Maharashtra",
    x: 34.5,
    y: 57.5,
    avgSvi: 79,
    riskLevel: "High",
    totalCases: 34,
    criticalCount: 8,
    primaryViolation: "PCR Act Sec 4 - Drinking Water Source Social Exclusion",
    nodalOfficer: "District Social Welfare Officer",
    contact: "02482-220450",
    activeAlerts: 1
  },
  {
    id: "DH-07",
    district: "Bengaluru Rural",
    state: "Karnataka",
    x: 37.8,
    y: 77.2,
    avgSvi: 77,
    riskLevel: "High",
    totalCases: 26,
    criticalCount: 6,
    primaryViolation: "PoA Act Sec 3(1)(u) - Institutional / Higher Education Bias",
    nodalOfficer: "Officer R. Sharma (NHAA Nodal Atrocity Desk)",
    contact: "080-22942111",
    activeAlerts: 1
  },
  {
    id: "DH-08",
    district: "Madurai",
    state: "Tamil Nadu",
    x: 39.2,
    y: 87.5,
    avgSvi: 81,
    riskLevel: "High",
    totalCases: 31,
    criticalCount: 7,
    primaryViolation: "PCR Act Sec 3 - Religious / Temple Entry Discrimination",
    nodalOfficer: "Revenue Divisional Officer (RDO)",
    contact: "0452-2531120",
    activeAlerts: 1
  },
  {
    id: "DH-09",
    district: "Ahmedabad",
    state: "Gujarat",
    x: 22.8,
    y: 48.5,
    avgSvi: 68,
    riskLevel: "Moderate",
    totalCases: 22,
    criticalCount: 4,
    primaryViolation: "PoA Act Sec 3(1)(za)(C) - Wedding Procession Obstruction",
    nodalOfficer: "District Vigilance Officer",
    contact: "079-27551230",
    activeAlerts: 0
  },
  {
    id: "DH-10",
    district: "Nagpur",
    state: "Maharashtra",
    x: 43.8,
    y: 54.8,
    avgSvi: 72,
    riskLevel: "Moderate",
    totalCases: 28,
    criticalCount: 5,
    primaryViolation: "PoA Act Sec 3(1)(r) - Verbal Degradation in Public Office",
    nodalOfficer: "Special Public Prosecutor (PoA Special Court)",
    contact: "0712-2560120",
    activeAlerts: 0
  }
];
