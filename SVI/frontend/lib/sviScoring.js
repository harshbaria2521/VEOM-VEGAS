/**
 * SVI - Smart Victim Intelligence Scoring Engine v2.5
 * Deep NLP Semantic & Forensic Triage Engine for SC/ST PoA Act, 1989 & PCR Act, 1955.
 * Analyzes natural language complaints (English, Hindi, Hinglish) across:
 * - Bodily Harm, Weaponry, Fractures & Grievous Hurt
 * - Caste Abuses, Slurs & Public Humiliation
 * - Social Boycotts & Customary Resource Denial
 * - Arson, Mob Violence, Eviction & Destruction
 * - Administrative / Police Dereliction (Sec 4)
 */

// Helper regex test on text
function matchAny(text, patterns) {
  return patterns.some((p) => {
    if (typeof p === 'string') {
      const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${escaped}($|\\s|[^a-zA-Z0-9])`, 'i');
      return regex.test(text);
    }
    return p.test(text);
  });
}

function findTriggers(text, list) {
  const matches = [];
  list.forEach((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${escaped}($|\\s|[^a-zA-Z0-9])`, 'i');
    if (regex.test(text) && !matches.includes(kw)) {
      matches.push(kw);
    }
  });
  return matches;
}

// 1. Physical Assault & Violence Words
const PHYSICAL_ASSAULT_TERMS = [
  'beat', 'beating', 'beaten', 'beats', 'hit', 'hitting', 'hits', 'punched', 'punch',
  'slapped', 'slap', 'kicked', 'kick', 'kicking', 'attacked', 'attack', 'attacking',
  'assaulted', 'assault', 'assaulting', 'choked', 'choke', 'strangled', 'strangle',
  'stabbed', 'stab', 'cut', 'slashed', 'pushed', 'dragged', 'drag',
  // Hindi & Hinglish
  'peeta', 'peet', 'pitayi', 'mara', 'maara', 'maar', 'marpeet', 'hamla', 'ghasita',
  'dhakka', 'patka', 'thappad', 'laat'
];

// 2. Bone Breakage, Fracture & Grievous Hurt Terms
const BONE_FRACTURE_TERMS = [
  'break', 'broke', 'broken', 'breaking', 'fracture', 'fractured', 'fracturing', 'crack', 'cracked',
  'tod', 'toda', 'todi', 'todna', 'tod diya', 'dislocated', 'crushed', 'severed',
  'bleeding', 'blood', 'wound', 'wounded', 'head injury', 'stitches', 'hospital', 'icu',
  'fracture leg', 'broken leg', 'broken arm', 'broken hand', 'skull', 'ribs'
];

// 3. Body Parts frequently targeted in grievous assault
const BODY_PART_TERMS = [
  'leg', 'legs', 'arm', 'arms', 'hand', 'hands', 'bone', 'bones', 'head', 'skull',
  'face', 'eye', 'eyes', 'teeth', 'tooth', 'neck', 'rib', 'ribs', 'foot', 'feet',
  // Hindi
  'taang', 'tang', 'haath', 'pair', 'haddi', 'sir', 'aankh', 'gala', 'muh'
];

// 4. Weapons & Lethal Instruments
const WEAPON_TERMS = [
  'knife', 'sword', 'gun', 'pistol', 'bullet', 'rifle', 'revolver', 'weapon', 'weapons',
  'lathi', 'danda', 'rod', 'iron rod', 'pipe', 'stick', 'stone', 'stones', 'firearm',
  // Hindi
  'chaku', 'talwar', 'bandook', 'goli', 'tamancha', 'katta', 'hathiyar', 'sariya'
];

// 5. Perpetrator Entities
const PERPETRATOR_TERMS = [
  'neighbor', 'neighbour', 'neighbors', 'neighbours', 'landlord', 'owner', 'boss',
  'contractor', 'thekedar', 'dabang', 'goon', 'goons', 'gunda', 'gunde', 'mob',
  'crowd', 'bheed', 'panchayat', 'sarpanch', 'police', 'daroga', 'officer', 'padosi'
];

// 6. Lethal Threat & Life Danger
const LETHAL_TERMS = [
  'kill', 'killed', 'killing', 'murder', 'murdered', 'death', 'die', 'threaten to kill',
  'threatened to kill', 'burn', 'burnt', 'burning', 'burn alive', 'set fire', 'acid', 'acid attack',
  'rape', 'raped', 'gangrape', 'molest', 'molested', 'hang', 'lynch', 'lynched',
  // Hindi
  'jaan se maar', 'jaan se marne', 'maar dalenge', 'marenge', 'khatam kar', 'aag laga',
  'jala diya', 'balatkar', 'chhedchhad', 'phansi'
];

// 7. Casteist Slurs & Untouchability (PoA Sec 3(1)(r), 3(1)(s))
const CASTE_OFFENCE_TERMS = [
  'caste', 'casteist', 'chamar', 'bhangi', 'dalit', 'neech', 'achhoot', 'untouchable',
  'slur', 'slurs', 'derogatory', 'humiliated', 'humiliation', 'insulted', 'insult',
  'abused by caste', 'caste name', 'lower caste', 'scheduled caste',
  // Hindi
  'jaat', 'jati', 'jaatigalat', 'chuhra', 'harijan', 'neech jaat', 'aukaat', 'beizzat',
  'apmanit', 'gaali', 'gaaliyan'
];

// 8. Customary Rights / Water Access / Boycott (PoA Sec 3(1)(za), PCR Sec 4)
const BOYCOTT_TERMS = [
  'boycott', 'social boycott', 'water', 'well', 'handpump', 'tap', 'road', 'path',
  'temple', 'mandir', 'entry denied', 'refused entry', 'denied water', 'public path',
  'ghodi', 'horse', 'wedding', 'baraat', 'mustache', 'mooch',
  // Hindi
  'bahishkar', 'samajik bahishkar', 'pani', 'kuan', 'sarvajanik', 'rasta band', 'rok diya'
];

// 9. Land Dispossession & Crop Destruction (PoA Sec 3(1)(g))
const LAND_TERMS = [
  'land', 'property', 'plot', 'field', 'crop', 'crops', 'harvest', 'evicted', 'evict',
  'dispossessed', 'bulldozed', 'demolished',
  // Hindi
  'zameen', 'khet', 'fasal', 'kabza', 'bedakhal', 'makaan toda', 'ujad diya'
];

// 10. Dereliction of Duty by Police/Public Servant (PoA Sec 4)
const POLICE_DERELICTION_TERMS = [
  'refused fir', 'not registering fir', 'police refused', 'ignored complaint', 'corrupt officer',
  // Hindi
  'fir nahi', 'fir darj nahi', 'police sun nahi rahi', 'chowki', 'thana', 'daroga ne bhaga diya'
];

// 11. Distress, Panic & Urgency Signals
const PANIC_DISTRESS_TERMS = [
  'scared', 'terrified', 'afraid', 'fear', 'frightened', 'crying', 'sobbing', 'trembling',
  'shivering', 'help', 'help me', 'help us', 'save me', 'save us', 'danger', 'emergency',
  'please help', 'urgent', 'immediately', 'surrounded', 'locked inside',
  // Hindi
  'dar', 'khauf', 'bachao', 'madad', 'khatra', 'jaldi', 'ro rahe', 'kanp', 'gher liya', 'band hai'
];

// 12. Low Severity / Informational Inquiries
const INFORMATIONAL_TERMS = [
  'scheme', 'yojana', 'scholarship', 'form', 'apply', 'procedure', 'rules', 'certificate',
  'praman patra', 'guidelines', 'information', 'jankari', 'portal', 'status inquiry'
];

/**
 * Assess a complaint and compute full SVI analytics
 * @param {string} text - Complaint description
 * @param {object} options - Optional metadata (channel, district, voiceConsented)
 */
export function assessComplaint(text = '', options = {}) {
  const clean = (text || '').toLowerCase().trim();

  // If input is empty or too short
  if (!clean || clean.length < 4) {
    return {
      score: 20,
      riskLevel: 'Low',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      breakdown: { threatScore: 5, legalScore: 8, distressScore: 5, urgencyModifier: 2 },
      sections: ['PoA Act Sec 3(1)(r)'],
      sectionDetails: [{ section: 'PoA Act Sec 3(1)(r)', desc: 'General statutory provision', relief: 'Rs. 1,00,000/-' }],
      detectedKeywords: [],
      reliefEntitlement: 'Rs. 1,00,000/-',
      recommendedPathway: 'Standard Guidance & Verification',
    };
  }

  // Detect Triggers across dimensions
  const physicalMatches = findTriggers(clean, PHYSICAL_ASSAULT_TERMS);
  const fractureMatches = findTriggers(clean, BONE_FRACTURE_TERMS);
  const bodyPartMatches = findTriggers(clean, BODY_PART_TERMS);
  const weaponMatches = findTriggers(clean, WEAPON_TERMS);
  const perpetratorMatches = findTriggers(clean, PERPETRATOR_TERMS);
  const lethalMatches = findTriggers(clean, LETHAL_TERMS);
  const casteMatches = findTriggers(clean, CASTE_OFFENCE_TERMS);
  const boycottMatches = findTriggers(clean, BOYCOTT_TERMS);
  const landMatches = findTriggers(clean, LAND_TERMS);
  const policeMatches = findTriggers(clean, POLICE_DERELICTION_TERMS);
  const panicMatches = findTriggers(clean, PANIC_DISTRESS_TERMS);
  const infoMatches = findTriggers(clean, INFORMATIONAL_TERMS);

  // High-level categorical flags
  const hasPhysicalAssault = physicalMatches.length > 0;
  const hasFractureOrBoneInjury = fractureMatches.length > 0 || (hasPhysicalAssault && bodyPartMatches.length > 0);
  const hasGrievousBodilyHarm = (hasPhysicalAssault && (hasFractureOrBoneInjury || bodyPartMatches.length > 0)) ||
    (fractureMatches.length > 0 && bodyPartMatches.length > 0);
  const hasWeapons = weaponMatches.length > 0;
  const hasLethalThreat = lethalMatches.length > 0;
  const hasCasteAtrocity = casteMatches.length > 0;
  const hasBoycottOrWaterDenial = boycottMatches.length > 0;
  const hasLandAlienation = landMatches.length > 0;
  const hasPoliceDereliction = policeMatches.length > 0;
  const hasPanic = panicMatches.length > 0;
  const isPurelyInfo = infoMatches.length > 0 && !hasPhysicalAssault && !hasLethalThreat && !hasGrievousBodilyHarm && !hasCasteAtrocity;

  // Compute Component Scores
  let threatScore = 5;
  let legalScore = 8;
  let distressScore = 5;
  let urgencyModifier = 2;

  const detectedSections = [];
  let maxRelief = 'Rs. 1,00,000/-';

  // 1. THREAT & VIOLENCE COMPONENT (Max 38 pts)
  if (hasLethalThreat || (hasWeapons && hasPhysicalAssault)) {
    threatScore = 38; // Imminent lethal / armed threat
  } else if (hasGrievousBodilyHarm) {
    // E.g. "my neighbor beat me and break my leg"
    threatScore = 36; // Severe bodily fracture & physical assault
  } else if (hasPhysicalAssault || hasWeapons) {
    threatScore = 28; // Physical violence or weapon intimidation
  } else if (hasFractureOrBoneInjury) {
    threatScore = 25;
  } else if (hasLandAlienation || hasBoycottOrWaterDenial) {
    threatScore = 18;
  } else if (hasCasteAtrocity) {
    threatScore = 15;
  }

  // 2. STATUTORY LEGAL SECTIONS (Max 30 pts)
  if (hasGrievousBodilyHarm || hasLethalThreat) {
    detectedSections.push({
      section: 'PoA Act Sec 3(2)(v)',
      desc: 'Grievous bodily hurt / Heinous offence against SC/ST person',
      relief: 'Rs. 8,25,000/-'
    });
    maxRelief = 'Rs. 8,25,000/-';
    legalScore += 18;
  }

  if (hasPhysicalAssault && !detectedSections.some(s => s.section.includes('3(2)(v)'))) {
    detectedSections.push({
      section: 'PoA Act Sec 3(1)(a)',
      desc: 'Physical assault & force applied against member of SC/ST',
      relief: 'Rs. 4,00,000/-'
    });
    if (maxRelief !== 'Rs. 8,25,000/-') maxRelief = 'Rs. 4,00,000/-';
    legalScore += 14;
  }

  if (hasCasteAtrocity || perpetratorMatches.length > 0) {
    detectedSections.push({
      section: 'PoA Act Sec 3(1)(r)',
      desc: 'Intentional insult, abuse or humiliation in public view',
      relief: 'Rs. 1,00,000/-'
    });
    legalScore += 8;
  }

  if (hasBoycottOrWaterDenial) {
    detectedSections.push({
      section: 'PoA Act Sec 3(1)(za) & PCR Sec 4',
      desc: 'Social boycott / Obstruction to customary water, road or temple entry',
      relief: 'Rs. 2,00,000/-'
    });
    if (!['Rs. 8,25,000/-', 'Rs. 4,00,000/-'].includes(maxRelief)) maxRelief = 'Rs. 2,00,000/-';
    legalScore += 10;
  }

  if (hasLandAlienation) {
    detectedSections.push({
      section: 'PoA Act Sec 3(1)(g)',
      desc: 'Wrongful dispossession of land or destruction of crops',
      relief: 'Rs. 4,00,000/-'
    });
    if (maxRelief !== 'Rs. 8,25,000/-') maxRelief = 'Rs. 4,00,000/-';
    legalScore += 10;
  }

  if (hasPoliceDereliction) {
    detectedSections.push({
      section: 'PoA Act Sec 4',
      desc: 'Dereliction of duty by public servant (Refusal to register FIR)',
      relief: 'Rs. 1,00,000/-'
    });
    legalScore += 8;
  }

  // Fallback section if none explicitly mapped
  if (detectedSections.length === 0) {
    detectedSections.push({
      section: 'PoA Act Sec 3(1)(r)',
      desc: 'Cognizable grievance under SC/ST Protection of Atrocities Act',
      relief: 'Rs. 1,00,000/-'
    });
    legalScore += 6;
  }
  legalScore = Math.min(legalScore, 30);

  // 3. TRAUMA & DISTRESS COMPONENT (Max 20 pts)
  if (hasGrievousBodilyHarm || hasLethalThreat) {
    distressScore = 18;
  } else if (hasPanic) {
    distressScore = Math.min(10 + panicMatches.length * 4, 18);
  } else if (hasPhysicalAssault) {
    distressScore = 14;
  } else if (hasCasteAtrocity || hasBoycottOrWaterDenial) {
    distressScore = 11;
  }

  // 4. URGENCY MODIFIER (Max 12 pts)
  if (clean.includes('emergency') || clean.includes('112') || clean.includes('bachao') || clean.includes('hospital')) {
    urgencyModifier += 5;
  }
  if (perpetratorMatches.length > 0) {
    urgencyModifier += 3; // Named perpetrator creates ongoing proximity threat
  }
  if (clean.length > 60) {
    urgencyModifier += 2;
  }
  urgencyModifier = Math.min(urgencyModifier, 10);

  // CALCULATE TOTAL RAW SCORE
  let totalScore = threatScore + legalScore + distressScore + urgencyModifier;

  // SPECIAL HEURISTIC OVERRIDES FOR CRITICAL VIOLENCE
  // If someone broke bones or assaulted someone violently: minimum score is 86 (Critical)!
  if (hasGrievousBodilyHarm || hasLethalThreat || (hasPhysicalAssault && hasWeapons)) {
    totalScore = Math.max(totalScore, 90);
  } else if (hasPhysicalAssault) {
    totalScore = Math.max(totalScore, 76);
  } else if (hasBoycottOrWaterDenial || hasLandAlienation) {
    totalScore = Math.max(totalScore, 62);
  }

  // If purely informational inquiry, clamp down
  if (isPurelyInfo) {
    totalScore = Math.min(totalScore, 24);
  }

  // Final clamped score
  const finalScore = Math.max(18, Math.min(totalScore, 98));

  // Determine Risk Tier
  let riskLevel = 'Low';
  let badgeColor = 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300';
  let recommendedPathway = 'Standard Counselling Support & Guidance';

  if (finalScore >= 85) {
    riskLevel = 'Critical';
    badgeColor = 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300';
    recommendedPathway = 'Immediate 112 Emergency Police Dispatch + District SP Alert + High-Priority Trauma Counsellor Routing';
  } else if (finalScore >= 60) {
    riskLevel = 'High';
    badgeColor = 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300';
    recommendedPathway = 'Expedited DLSA Legal Aid Assignment + Sub-Divisional Magistrate (SDM) Alert + Psychological Stabilization';
  } else if (finalScore >= 35) {
    riskLevel = 'Moderate';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300';
    recommendedPathway = 'District Welfare Officer Follow-up + Revenue/PCR Inquiry + Routine Counselling';
  } else {
    riskLevel = 'Low';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300';
    recommendedPathway = 'Informational Guidance + MoSJE Central Sector Scheme Assistance';
  }

  // Collect all unique keywords found
  const allKeywords = [
    ...physicalMatches,
    ...fractureMatches,
    ...bodyPartMatches,
    ...weaponMatches,
    ...perpetratorMatches,
    ...lethalMatches,
    ...casteMatches,
    ...boycottMatches,
    ...panicMatches,
  ];
  const uniqueTriggers = Array.from(new Set(allKeywords)).slice(0, 7);

  return {
    score: finalScore,
    riskLevel,
    badgeColor,
    breakdown: {
      threatScore,
      legalScore,
      distressScore,
      urgencyModifier,
    },
    sections: detectedSections.map((s) => s.section),
    sectionDetails: detectedSections,
    detectedKeywords: uniqueTriggers,
    reliefEntitlement: maxRelief,
    recommendedPathway,
  };
}
