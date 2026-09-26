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
  {
    id: "SVI-2026-9041",
    channel: "Chatbot",
    channelIcon: "message-square",
    riskLevel: "Critical",
    riskScore: 94,
    language: "Hindi",
    flaggedAt: "2 mins ago",
    timestamp: "2026-09-21T12:55:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(r)", "PoA Act Sec 3(1)(s)", "PoA Act Sec 3(2)(v)"],
    indicators: [
      { name: "Severe Acute Distress", severity: "high", confidence: 96 },
      { name: "Fear of Imminent Harm", severity: "critical", confidence: 94 },
      { name: "Armed Mob Aggression", severity: "critical", confidence: 91 },
      { name: "Social Isolation", severity: "medium", confidence: 78 }
    ],
    vocalSignals: {
      tremorScore: "0.88 (Severe)",
      pitchVariation: "Extreme instability / high panic spike",
      speechRate: "Rapid / breathless sobbing"
    },
    recommendedPathway: "Immediate Emergency Dispatch (112) + District SP Alert + High-Priority Trauma Counsellor Routing",
    transcript: [
      { sender: "Victim", text: "नमस्ते... मुझे बहुत डर लग रहा है, वो लोग फिर से हमारे घर के बाहर लाठी और हथियार लेकर आ गए हैं। जातिसूचक गालियाँ दे रहे हैं और दरवाज़ा पीटने लगे हैं।" },
      { sender: "SVI AI", text: "आप इस समय घर के सबसे सुरक्षित अंदरूनी कमरे में रहें और खिड़की-दरवाजे बंद रखें। हम तत्काल आपातकालीन पुलिस नियंत्रण कक्ष (112) और स्थानीय पुलिस उपाधीक्षक को आपकी लोकेशन भेज रहे हैं।" },
      { sender: "Victim", text: "कृपया जल्दी पुलिस भेजिए, वे लोग कह रहे हैं कि मजदूरी मांगने की हिम्मत कैसे की। मुझे अपनी और बच्चों की जान का खतरा है।" },
      { sender: "SVI AI", text: "112 कंट्रोल रूम को हाई-प्रायोरिटी अलर्ट भेजा जा चुका है। एक वरिष्ठ काउंसलर और पुलिस रिस्पांस टीम आपसे तुरंत संपर्क कर रही है। लाइन पर बने रहें।" }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 12:55:14", details: "Classified as Critical (Score: 94/100). Imminent threat & vocal tremor detected." }
    ]
  },
  {
    id: "SVI-2026-9042",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "High",
    riskScore: 79,
    language: "English",
    flaggedAt: "14 mins ago",
    timestamp: "2026-09-21T12:42:00Z",
    status: "In Review",
    assignedTo: "Officer R. Sharma (ID: 412)",
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(r)", "PoA Act Sec 3(1)(u)", "UGC Equity Reg."],
    indicators: [
      { name: "Institutional Caste Harassment", severity: "high", confidence: 89 },
      { name: "Prolonged Depressive Affect", severity: "high", confidence: 82 },
      { name: "Insomnia & Panic Episodes", severity: "medium", confidence: 76 },
      { name: "Legal Aid Requirement", severity: "medium", confidence: 91 }
    ],
    vocalSignals: {
      tremorScore: "0.64 (Moderate)",
      pitchVariation: "Subdued / low energy monotone",
      speechRate: "Slow / punctuated by deep sighs"
    },
    recommendedPathway: "Assign to Senior Trauma Counsellor + DLSA Legal Aid Cell + Grievance Filing to NCSC State Directorate",
    transcript: [
      { sender: "Victim", text: "I am an Assistant Professor at a state technical institute in Bengaluru Rural. For the past four months, the department head has subjected me to relentless humiliation, public slurs about reservation, and withheld my lab approvals." },
      { sender: "SVI AI", text: "I hear how exhausting and deeply painful this hostile environment has been for you. Under the PoA Act and institutional equity guidelines, this constitutes unlawful harassment. You are not alone." },
      { sender: "Victim", text: "I cannot sleep, I get chest palpitations before entering campus, and internal committee complaints have been suppressed. I need legal and psychological help." },
      { sender: "SVI AI", text: "We are routing your file to Officer R. Sharma and the District Legal Services Authority (DLSA) for free confidential legal support, along with Tele-MANAS psychological care." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 12:42:08", details: "Classified as High (Score: 79/100). Persistent psychological impact detected." },
      { action: "Case Claimed", actor: "Officer R. Sharma", timestamp: "2026-09-21 12:47:30", details: "Assigned for active triage, DLSA legal notice drafting, and counsellor consultation." }
    ]
  },
  {
    id: "SVI-2026-9043",
    channel: "Web Portal",
    channelIcon: "globe",
    riskLevel: "Moderate",
    riskScore: 58,
    language: "Marathi",
    flaggedAt: "26 mins ago",
    timestamp: "2026-09-21T12:30:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PCR Act Sec 4", "PoA Act Sec 3(1)(za)(A)"],
    indicators: [
      { name: "Denial of Potable Water Source", severity: "high", confidence: 93 },
      { name: "Social Exclusion / Untouchability", severity: "high", confidence: 88 },
      { name: "Procedural Distress & Inaction", severity: "medium", confidence: 75 }
    ],
    vocalSignals: null,
    recommendedPathway: "Grievance Docket Forwarding to Sub-Divisional Magistrate (SDM) & Jal Jeevan Mission Grievance Officer",
    transcript: [
      { sender: "Victim", text: "आमच्या गावात दुष्काळ परिस्थिती असताना नवीन सरकारी सार्वजनिक विहिरीवरून अनुसूचित जातीच्या वस्तीतील महिलांना पाणी भरू दिले जात नाही. गावातील काही दबंग लोक विहिरीवर पहारा ठेवून धमकावत आहेत." },
      { sender: "SVI AI", text: "नागरी हक्क संरक्षण कायदा (PCR Act) कलम ४ अन्वये सार्वजनिक पाणवठ्यावरून पाणी भरण्यास मज्जाव करणे हा दखलपात्र गुन्हा आहे. आम्ही तुमची तक्रार नोंदवून घेत आहोत." },
      { sender: "Victim", text: "आम्ही स्थानिक ग्रामपंचायतीकडे तक्रार केली पण काही कारवाई झाली नाही. वस्तीत पिण्याच्या पाण्याचे दुर्भिक्ष झाले आहे. कृपया त्वरित शासकीय हस्तक्षेप मिळवून द्या." },
      { sender: "SVI AI", text: "तुमच्या तक्रारीचा अधिकृत NHAA डॉकेट क्रमांक जनरेट करण्यात आला आहे. तहसीलदारांना व जिल्हा समाजकल्याण अधिकाऱ्यांना तातडीच्या पाहणीसाठी आदेश पाठवला जात आहे." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 12:30:22", details: "Classified as Moderate (Score: 58/100). PCR Act water discrimination verified." }
    ]
  },
  {
    id: "SVI-2026-9044",
    channel: "IVRS Voice",
    channelIcon: "mic",
    riskLevel: "Critical",
    riskScore: 97,
    language: "Hindi",
    flaggedAt: "38 mins ago",
    timestamp: "2026-09-21T12:18:00Z",
    status: "Escalated",
    assignedTo: "Supervisor K. Patel",
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(za)(C)", "PoA Act Sec 3(2)(v)", "BNS Sec 189"],
    indicators: [
      { name: "Wedding Procession Obstruction", severity: "critical", confidence: 98 },
      { name: "Physical Assault in Public View", severity: "critical", confidence: 95 },
      { name: "High Vocal Tremor & Hysteria", severity: "critical", confidence: 94 }
    ],
    vocalSignals: {
      tremorScore: "0.93 (Extreme)",
      pitchVariation: "Peak vocal dissonance / screaming",
      speechRate: "Fragmented / hyperventilating"
    },
    recommendedPathway: "District Magistrate Emergency Mobilization + SP Quick Response Team (QRT) + 112 PCR Van Dispatch",
    transcript: [
      { sender: "Victim", text: "सर मदद कीजिये! मेरी बेटी की बारात पर हमला हो गया है! वो लोग दूल्हे को घोड़ी से उतार कर मार रहे हैं और पत्थरबाजी कर रहे हैं! टेंट तोड़ दिया है!" },
      { sender: "SVI AI", text: "कृपया शांति बनाए रखने की कोशिश करें और सुरक्षित आड़ लें। आपातकालीन नियंत्रण कक्ष 112 और निकटतम पुलिस उपाधीक्षक को तत्काल घटना स्थल पर भेजा जा रहा है।" },
      { sender: "Victim", text: "हमारे कई रिश्तेदार घायल हो गए हैं, वो लोग कह रहे हैं कि इस गाँव में दलित दूल्हा घोड़ी नहीं चढ़ सकता! कोई एम्बुलेंस और फ़ोर्स भेजो जल्दी!" },
      { sender: "SVI AI", text: "अलवर जिला पुलिस नियंत्रण कक्ष एवं 108 एम्बुलेंस सेवा को तत्काल आपातकालीन संदेश प्रेषित कर दिया गया है। पुलिस उपाधीक्षक मय जाब्ता मौके के लिए रवाना हो चुके हैं।" }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 12:18:15", details: "Classified as Critical (Score: 97/100). Extreme vocal distress & mass violence alert." },
      { action: "Emergency Escalated", actor: "Supervisor K. Patel", timestamp: "2026-09-21 12:20:00", details: "QRT mobilized with SP Alwar and 108 ambulance dispatch." }
    ]
  },
  {
    id: "SVI-2026-9045",
    channel: "Chatbot",
    channelIcon: "message-square",
    riskLevel: "Low",
    riskScore: 22,
    language: "English",
    flaggedAt: "52 mins ago",
    timestamp: "2026-09-21T12:04:00Z",
    status: "Resolved",
    assignedTo: "Officer M. Sen",
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PoA Rules Rule 12(4)"],
    indicators: [
      { name: "Victim Compensation Inquiry", severity: "low", confidence: 95 },
      { name: "Procedural Clarification", severity: "low", confidence: 91 }
    ],
    vocalSignals: null,
    recommendedPathway: "Direct Benefit Transfer (DBT) Relief Guideline Sharing & District Social Welfare Portal Guidance",
    transcript: [
      { sender: "Victim", text: "Hello SVI, our FIR under Section 3(1)(r) was registered last week at the Special Atrocities Police Station. I wanted to understand the process to apply for interim compensation under Rule 12(4)." },
      { sender: "SVI AI", text: "Under Rule 12(4) of the SC/ST (PoA) Rules, you are entitled to 25% of the statutory relief fund upon FIR registration and charge-sheet stage via DBT. Here are the required bank details and verification steps." },
      { sender: "Victim", text: "Thank you, that is very clear. Do I need to visit the District Collectorate in person?" },
      { sender: "SVI AI", text: "The District Welfare Officer processes this directly through the Special Court report. You can track your sanction order online using your FIR docket number on the state DBT portal." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 12:04:05", details: "Classified as Low (Score: 22/100). Informational assistance query." },
      { action: "Resolved & Closed", actor: "Officer M. Sen", timestamp: "2026-09-21 12:12:30", details: "Provided official PoA Rule 12(4) compensation schedule documentation." }
    ]
  },
  {
    id: "SVI-2026-9046",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "High",
    riskScore: 84,
    language: "Tamil",
    flaggedAt: "1 hour ago",
    timestamp: "2026-09-21T11:50:00Z",
    status: "In Review",
    assignedTo: "Officer P. Muthu (ID: 308)",
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(u)", "PoA Act Sec 3(1)(r)", "BNS Sec 351"],
    indicators: [
      { name: "Inter-Caste Marriage Persecution", severity: "high", confidence: 94 },
      { name: "Katta Panchayat Death Threat", severity: "critical", confidence: 89 },
      { name: "Acute Helplessness & Panic", severity: "high", confidence: 86 }
    ],
    vocalSignals: {
      tremorScore: "0.76 (Elevated)",
      pitchVariation: "Trembling / rapid pitch drops",
      speechRate: "Stammering / tearful"
    },
    recommendedPathway: "Immediate Safehouse Shelter Transfer via District Protection Officer + Police Protection Order",
    transcript: [
      { sender: "Victim", text: "வணக்கம் ஐயா... நாங்கள் கலப்பு திருமணம் செய்து கொண்டோம். என் மனைவியின் குடும்பத்தினர் மற்றும் ஊர் கட்டப்பஞ்சாயத்து எங்களை கொன்றுவிடுவதாக மிரட்டுகிறார்கள். நாங்கள் இப்போது ஒரு மறைவிடத்தில் இருக்கிறோம்." },
      { sender: "SVI AI", text: "உங்கள் பாதுகாப்பே எங்களின் முதல் முன்னுரிமை. உச்ச நீதிமன்ற வழிகாட்டுதலின்படி கலப்பு தம்பதிகளுக்கு அரசு காப்பகமும் போலீஸ் பாதுகாப்பும் வழங்கப்பட வேண்டும். உங்கள் தற்போதைய இடத்தை பகிருங்கள்." },
      { sender: "Victim", text: "எங்கள் பெற்றோரை அவர்கள் வீட்டில் அடைத்து வைத்து துன்புறுத்துகிறார்கள். தயவுசெய்து எங்களையும் என் பெற்றோர்களையும் காப்பாற்றுங்கள்." },
      { sender: "SVI AI", text: "மதுரை மாவட்ட காவல் கண்காணிப்பாளர் மற்றும் சிறப்பு பிரிவுக்கு அவசர பாதுகாப்பு கோரிக்கை அனுப்பப்பட்டுள்ளது. பாதுகாப்பான அரசு காப்பகத்திற்கு மாற்ற ஏற்பாடு செய்யப்படுகிறது." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 11:50:11", details: "Classified as High (Score: 84/100). Inter-caste honour violence indicators verified." },
      { action: "Case Claimed", actor: "Officer P. Muthu", timestamp: "2026-09-21 11:56:00", details: "Coordinating safehouse transfer with District Social Welfare Officer." }
    ]
  },
  {
    id: "SVI-2026-9047",
    channel: "IVRS Voice",
    channelIcon: "mic",
    riskLevel: "Critical",
    riskScore: 96,
    language: "Telugu",
    flaggedAt: "1 hour ago",
    timestamp: "2026-09-21T11:32:00Z",
    status: "Escalated",
    assignedTo: "Supervisor A. Reddy",
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(w)(i)", "PoA Act Sec 3(2)(v)", "BNS Sec 74"],
    indicators: [
      { name: "Sexual Assault & Intimidation", severity: "critical", confidence: 97 },
      { name: "Police Station FIR Refusal", severity: "high", confidence: 91 },
      { name: "Profound Traumatic Shock", severity: "critical", confidence: 95 }
    ],
    vocalSignals: {
      tremorScore: "0.91 (Severe)",
      pitchVariation: "Sharp acoustic turbulence / weeping",
      speechRate: "Choked / breathless"
    },
    recommendedPathway: "Direct Escalation to DIG / SP Guntur + Mahila Police Station FIR Mandate under Lalita Kumari Guidelines",
    transcript: [
      { sender: "Victim", text: "నమస్కారం సార్... పొలంలో కూలి పని చేస్తుండగా భూయజమాని నాపై లైంగిక దాడికి యత్నించాడు. కులం పేరుతో దూషిస్తూ ఎవరికైనా చెబితే చంపేస్తానని బెదిరించాడు. స్థానిక స్టేషన్‌కి వెళ్తే పోలీసులు కేసు రాయడం లేదు." },
      { sender: "SVI AI", text: "మేము మీతో ఉన్నాము. ఎస్సీ/ఎస్టీ చట్టం మరియు సుప్రీం కోర్టు ఆదేశాల ప్రకారం ఎఫ్ఐఆర్ నమోదు చేయడం పోలీసుల బాధ్యత. రాజీ పడాల్సిన అవసరం లేదు." },
      { sender: "Victim", text: "నన్ను స్టేషన్ బయటే కూర్చోబెట్టారు, అవతలి వాళ్ళు వచ్చి బెదిరిస్తున్నారు. నాకు రక్షణ కావాలి." },
      { sender: "SVI AI", text: "గుంటూరు జిల్లా ఎస్పీ మరియు మహిళా రక్షక్ టీమ్‌కు తక్షణ అత్యవసర నివేదిక పంపబడింది. డీఎస్పీ స్థాయి అధికారి విచారణకు ఆదేశించబడింది." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 11:32:09", details: "Classified as Critical (Score: 96/100). Sexual violence & dereliction of duty flagged." },
      { action: "Emergency Escalated", actor: "Supervisor A. Reddy", timestamp: "2026-09-21 11:35:40", details: "Escalated to Guntur SP & AP Women's Commission for immediate FIR enforcement." }
    ]
  },
  {
    id: "SVI-2026-9048",
    channel: "Web Portal",
    channelIcon: "globe",
    riskLevel: "Moderate",
    riskScore: 56,
    language: "Bengali",
    flaggedAt: "2 hours ago",
    timestamp: "2026-09-21T10:45:00Z",
    status: "In Review",
    assignedTo: "Officer B. Banerjee (ID: 219)",
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(f)", "PoA Act Sec 3(1)(g)", "Forest Rights Act"],
    indicators: [
      { name: "Dispossession of Tribal Patta Land", severity: "high", confidence: 91 },
      { name: "Destruction of Standing Crops", severity: "medium", confidence: 84 },
      { name: "Livelihood Insecurity Distress", severity: "medium", confidence: 79 }
    ],
    vocalSignals: null,
    recommendedPathway: "District Land Revenue Officer (DLRO) Spot Inspection + Special Atrocities Court Compensation Petiton",
    transcript: [
      { sender: "Victim", text: "আমরা পুরুলিয়ার সাঁওতাল আদিবাসী পরিবার। বন অধিকার আইনের পাট্টা জমিতে আমরা চাষ করছিলাম। বালি মাফিয়ারা আমাদের ফসল কেটে ফেলে জোর করে জমি দখল করছে এবং বাধা দিলে বন্দুক দেখিয়ে হুমকি দিচ্ছে।" },
      { sender: "SVI AI", text: "তপশিলি উপজাতি (PoA) আইনের ধারা ৩(১)(f) এবং ৩(১)(g) অনুযায়ী আদিবাসীদের জমি অবৈধভাবে দখল বা উচ্ছেদ করা গুরুতর শাস্তিযোগ্য অপরাধ। আমরা প্রয়োজনীয় প্রমাণ নথিবদ্ধ করছি।" },
      { sender: "Victim", text: "আমাদের কাছে জমির বৈধ পাট্টা ও রসিদ আছে। অবিলম্বে জমি পুনরুদ্ধার এবং ক্ষতিপূরণের জন্য সরকারি সাহায্য প্রার্থনা করছি।" },
      { sender: "SVI AI", text: "আপনার সমস্ত নথি সহ জেলা শাসক (DM) এবং পুলিশ সুপারিনের কাছে আনুষ্ঠানিক অভিযোগপত্র পাঠানো হচ্ছে। একজন আধিকারিক শীঘ্রই আপনার সাথে যোগাযোগ করবেন।" }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 10:45:18", details: "Classified as Moderate (Score: 56/100). Land alienation under Sec 3(1)(g) confirmed." },
      { action: "Case Claimed", actor: "Officer B. Banerjee", timestamp: "2026-09-21 11:05:00", details: "Cross-verifying Patta records with Purulia DLRO office." }
    ]
  },
  {
    id: "SVI-2026-9049",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "High",
    riskScore: 81,
    language: "Gujarati",
    flaggedAt: "2 hours ago",
    timestamp: "2026-09-21T10:15:00Z",
    status: "In Review",
    assignedTo: "Officer J. Patel (ID: 504)",
    voiceConsented: true,
    audioUrl: null,
    violationTags: ["PCR Act Sec 7", "PoA Act Sec 3(1)(zc)"],
    indicators: [
      { name: "Economic & Social Boycott", severity: "high", confidence: 95 },
      { name: "Denial of Essential Provisions", severity: "high", confidence: 89 },
      { name: "Community-Wide Anxiety", severity: "medium", confidence: 83 }
    ],
    vocalSignals: {
      tremorScore: "0.71 (Moderate)",
      pitchVariation: "Strained / suppressed indignation",
      speechRate: "Cautious / whispered"
    },
    recommendedPathway: "District Magistrate Section 144 Imposition + Joint Peace Committee Formation + Section 3(1)(zc) FIR",
    transcript: [
      { sender: "Victim", text: "સુરેન્દ્રનગર જિલ્લાના અમારા ગામમાં પંચાયતે દલિત સમાજનો હુક્કા-પાણી બંધ (સામાજિક બહિષ્કાર) જાહેર કર્યો છે. કરિયાણાની દુકાનોમાંથી રાશન આપવાની ના પાડી દીધી છે અને દૂધ ડેરીમાં દૂધ લેતા નથી." },
      { sender: "SVI AI", text: "સામાજિક કે આર્થિક બહિષ્કાર લાદવો એ PoA કાયદાની કલમ ૩(૧)(zc) અને નાગરિક અધિકાર સંરક્ષણ અધિનિયમ હેઠળ સખત ગુનો છે. અમે તાત્કાલિક વહીવટી તંત્રને જાણ કરી રહ્યા છીએ." },
      { sender: "Victim", text: "અમારા બાળકોને સ્કૂલની રિક્ષામાં બેસવા દેતા નથી. ગામમાં ભારે તણાવ છે, જો તરત જ અધિકારીઓ નહીં આવે તો પરિસ્થિતિ વણસી શકે છે." },
      { sender: "SVI AI", text: "કલેક્ટર અને ડીવાયએસપીને તાત્કાલિક ગ્રામ્ય મુલાકાત માટે નોટિસ મોકલી દેવામાં આવી છે. તમને રક્ષણ અને રાશન પુરવઠો સુનિશ્ચિત કરવામાં આવશે." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 10:15:10", details: "Classified as High (Score: 81/100). Systematic social boycott detected." },
      { action: "Case Claimed", actor: "Officer J. Patel", timestamp: "2026-09-21 10:28:15", details: "Connecting with Surendranagar District Collectorate & Social Justice Officer." }
    ]
  },
  {
    id: "SVI-2026-9050",
    channel: "Chatbot",
    channelIcon: "message-square",
    riskLevel: "Critical",
    riskScore: 93,
    language: "Hindi",
    flaggedAt: "3 hours ago",
    timestamp: "2026-09-21T09:40:00Z",
    status: "Escalated",
    assignedTo: "Supervisor K. Patel",
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PoA Act Section 4", "PoA Act Sec 3(1)(p)", "PoA Act Sec 3(1)(r)"],
    indicators: [
      { name: "Police Neglect of Duty (Sec 4)", severity: "critical", confidence: 96 },
      { name: "Coerced False Counter-Complaint", severity: "high", confidence: 92 },
      { name: "Threat of Custodial Torture", severity: "critical", confidence: 94 }
    ],
    vocalSignals: null,
    recommendedPathway: "State Vigilance Commission Escalation + DIG Range Intervention + Video-Recorded Statement under Sec 164 CrPC",
    transcript: [
      { sender: "Victim", text: "मैं गया (बिहार) से लिख रहा हूँ। दबंग मुखिया ने मनरेगा मजदूरी मांगने पर मुझे पीटा। जब मैं थाने गया तो SHO ने मेरी FIR दर्ज करने से मना कर दिया और उल्टे मुझे हवालात में बंद करने और चोरी का झूठा केस लगाने की धमकी दी।" },
      { sender: "SVI AI", text: "PoA एक्ट की धारा 4 के तहत लोक सेवक (पुलिस अधिकारी) द्वारा अपने कर्तव्य में लापरवाही करना या शिकायत दर्ज न करना स्वयं एक गैर-जमानती अपराध है जिसमें 1 वर्ष तक के कारावास का प्रावधान है।" },
      { sender: "Victim", text: "SHO मुखिया का रिश्तेदार है। मुझे डर है कि वे लोग रात में मुझे या मेरे परिवार को उठा लेंगे। मेरी जान बचाइए।" },
      { sender: "SVI AI", text: "आपकी शिकायत की प्रति सीधे पुलिस महानिदेशक (DGP) बिहार, आईजी मानवाधिकार तथा राष्ट्रीय अनुसूचित जाति आयोग (NCSC) को उच्च प्राथमिकता के साथ अग्रेषित कर दी गई है।" }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 09:40:08", details: "Classified as Critical (Score: 93/100). Statutory Section 4 violation & police coercion." },
      { action: "Emergency Escalated", actor: "Supervisor K. Patel", timestamp: "2026-09-21 09:45:00", details: "DGP Control Room alerted for departmental inquiry against erring SHO." }
    ]
  },
  {
    id: "SVI-2026-9051",
    channel: "Web Portal",
    channelIcon: "globe",
    riskLevel: "Moderate",
    riskScore: 61,
    language: "Hindi",
    flaggedAt: "3 hours ago",
    timestamp: "2026-09-21T09:12:00Z",
    status: "New",
    assignedTo: null,
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["PoA Act Sec 3(1)(za)(D)", "PCR Act Sec 3"],
    indicators: [
      { name: "Denial of Cremation Ground Access", severity: "high", confidence: 94 },
      { name: "Grave Emotional Desecration", severity: "high", confidence: 87 },
      { name: "Public Roadside Blockade", severity: "medium", confidence: 79 }
    ],
    vocalSignals: null,
    recommendedPathway: "Sub-Divisional Magistrate (SDM) Immediate Police Force Dispatch for Dignified Last Rites",
    transcript: [
      { sender: "Victim", text: "सागर (मध्य प्रदेश) के हमारे गाँव में मेरे 72 वर्षीय पिता का देहांत हो गया। भारी बारिश के कारण हमारे पारंपरिक स्थान पर पानी भरा है, लेकिन सार्वजनिक मुक्तिधाम में गाँव के अन्य लोग शवदाह करने से रोक रहे हैं।" },
      { sender: "SVI AI", text: "मृत्यु के उपरांत सम्मानजनक अंतिम संस्कार का अधिकार संविधान के अनुच्छेद 21 का अभिन्न अंग है और मुक्तिधाम पर रोक लगाना PoA एक्ट की धारा 3(1)(za)(D) के तहत अपराध है।" },
      { sender: "Victim", text: "हम पिछले 6 घंटे से शव लेकर सड़क पर बारिश में खड़े हैं। कृपया तत्काल एसडीएम साहब को निर्देश दिलवाएं ताकि अंतिम संस्कार शांतिपूर्ण हो सके।" },
      { sender: "SVI AI", text: "एसडीएम सागर एवं स्थानीय तहसीलदार को त्वरित पुलिस बल के साथ मौके पर पहुँचकर सम्मानजनक दाह-संस्कार सुनिश्चित करने हेतु फ़्लैश अलर्ट भेजा गया है।" }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 09:12:15", details: "Classified as Moderate (Score: 61/100). Cremation ground discrimination flagged." }
    ]
  },
  {
    id: "SVI-2026-9052",
    channel: "Helpline (14566)",
    channelIcon: "phone",
    riskLevel: "Low",
    riskScore: 26,
    language: "English",
    flaggedAt: "4 hours ago",
    timestamp: "2026-09-21T08:30:00Z",
    status: "Resolved",
    assignedTo: "Officer M. Sen",
    voiceConsented: false,
    audioUrl: null,
    violationTags: ["Legal Services Auth. Act Sec 12"],
    indicators: [
      { name: "Special Public Prosecutor Request", severity: "low", confidence: 94 },
      { name: "Witness Protection Inquiries", severity: "low", confidence: 88 }
    ],
    vocalSignals: null,
    recommendedPathway: "District Legal Services Authority (DLSA) Empanelled Special Counsel Nomination",
    transcript: [
      { sender: "Victim", text: "Good morning. Our case is pending before the Special Atrocities Court in Hyderabad. We wish to engage a senior empanelled advocate under Section 15(5) of the PoA Act. What is the procedure?" },
      { sender: "SVI AI", text: "Under Section 15(5) of the PoA Act, the District Magistrate is empowered to engage an eminent Senior Advocate of the victim's choice at state expense. You can submit form Form-IV to the DLSA Secretary." },
      { sender: "Victim", text: "That is extremely helpful. Does the government also provide witness travel allowances for court appearances?" },
      { sender: "SVI AI", text: "Yes, under Rule 11 of the SC/ST (PoA) Rules, full TA/DA and daily maintenance allowance are reimbursable by the Special Court Nazir for all hearing dates." }
    ],
    auditTrail: [
      { action: "AI Assessment Completed", actor: "SVI AI Engine v2", timestamp: "2026-09-21 08:30:04", details: "Classified as Low (Score: 26/100). Legal procedural guidance fulfilled." },
      { action: "Resolved & Closed", actor: "Officer M. Sen", timestamp: "2026-09-21 08:42:10", details: "Form-IV legal aid requisition template shared with complainant." }
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
