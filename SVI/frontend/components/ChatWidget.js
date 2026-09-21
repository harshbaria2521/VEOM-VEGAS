'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askTherapist } from '../lib/api';
import { useAuth } from '../lib/authContext';
import { translations, supportedLanguages, getSpeechRecognitionLang } from '../lib/translations';
import NearbySupportModal from './NearbySupportModal';
import { Send, PhoneCall, HeartHandshake, MapPin, Mic, MicOff, AlertTriangle, ShieldCheck, UserCheck, RotateCcw } from 'lucide-react';

// Helper to format inline markdown elements: bold (**...**), italic (*...*), and code (`...`)
function formatInlineText(text) {
  if (!text) return null;

  // Split by bold patterns: ***...***, **...**, or __...__
  const boldParts = text.split(/(\*\*\*[^\n*]+?\*\*\*|\*\*[^\n*]+?\*\*|__[^_\n]+?__)/g);

  return boldParts.map((part, bIdx) => {
    // Bold + Italic
    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      return (
        <strong key={`bi-${bIdx}`} className="font-bold italic text-inherit">
          {part.slice(3, -3)}
        </strong>
      );
    }
    // Bold
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      return (
        <strong key={`b-${bIdx}`} className="font-bold text-inherit">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return formatItalicAndCode(part, `p-${bIdx}`);
  });
}

function formatItalicAndCode(text, keyPrefix) {
  if (!text) return text;

  // Split by code backticks `...`
  const codeParts = text.split(/(`[^`\n]+?`)/g);
  return codeParts.map((cPart, cIdx) => {
    if (cPart.startsWith('`') && cPart.endsWith('`') && cPart.length >= 2) {
      return (
        <code
          key={`${keyPrefix}-c-${cIdx}`}
          className="bg-black/5 px-1 py-0.5 rounded text-[11px] font-mono text-inherit"
        >
          {cPart.slice(1, -1)}
        </code>
      );
    }

    // Split by single asterisk/underscore italics (*...* or _..._)
    const italicParts = cPart.split(/(\*[^*\s\n][^*\n]*?\*|_[^_\s\n][^_\n]*?_)/g);
    if (italicParts.length > 1) {
      return (
        <React.Fragment key={`${keyPrefix}-i-frag-${cIdx}`}>
          {italicParts.map((sub, iIdx) => {
            if (
              (sub.startsWith('*') && sub.endsWith('*') && sub.length >= 2) ||
              (sub.startsWith('_') && sub.endsWith('_') && sub.length >= 2)
            ) {
              return (
                <em key={`${keyPrefix}-i-${iIdx}`} className="italic text-inherit">
                  {sub.slice(1, -1)}
                </em>
              );
            }
            return sub;
          })}
        </React.Fragment>
      );
    }

    return cPart;
  });
}

function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = String(text).split('\n');

  return (
    <div className="space-y-1 leading-relaxed text-inherit">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line -> small vertical spacing
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Markdown headings (# Title, ## Title, ### Title)
        const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (headingMatch) {
          return (
            <div key={idx} className="font-bold text-inherit text-[13px] sm:text-sm mt-1 mb-0.5">
              {formatInlineText(headingMatch[2])}
            </div>
          );
        }

        // Bullet lists (* item, - item, • item)
        const bulletMatch = trimmed.match(/^([*\-\u2022])\s+(.+)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-[#075E54] font-bold select-none leading-5">{'\u2022'}</span>
              <span className="flex-1">{formatInlineText(bulletMatch[2])}</span>
            </div>
          );
        }

        // Numbered lists (1. item, 2. item)
        const numMatch = trimmed.match(/^(\d+[\.)])\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-[#075E54] font-semibold text-xs select-none leading-5">
                {numMatch[1]}
              </span>
              <span className="flex-1">{formatInlineText(numMatch[2])}</span>
            </div>
          );
        }

        // Standard line
        return (
          <div key={idx}>
            {formatInlineText(line)}
          </div>
        );
      })}
    </div>
  );
}

// =====================================================================
// EMERGENCY KEYWORD DETECTION - Multilingual (All Indian Scheduled Languages)
// When ANY of these keywords are found in the user's message, the frontend
// bypasses AI completely and triggers direct emergency call action.
// =====================================================================
const EMERGENCY_KEYWORDS = [
  // -- English --
  'suicide', 'kill myself', 'kill me', 'killing myself', 'want to die', 'wanna die',
  'end my life', 'end it all', 'take my life', 'i want to die', 'i will die',
  'murder', 'murdered', 'murdering', 'being killed', 'someone killed',
  'kill', 'killed', 'killing', 'stabbed', 'stabbing',
  'attack', 'attacked', 'attacking', 'ongoing attack', 'being attacked',
  'rape', 'raped', 'raping', 'being raped', 'sexual assault', 'molested', 'molestation',
  'acid attack', 'acid thrown', 'burn', 'burned', 'burning me', 'set on fire',
  'kidnap', 'kidnapped', 'kidnapping', 'abducted', 'abduction',
  'gun', 'gunshot', 'shot', 'shooting', 'bomb', 'blast', 'explosion',
  'bleeding', 'blood', 'dying', 'help me', 'save me', 'please save',
  'hanging', 'hang myself', 'poison', 'poisoned', 'overdose',
  'drown', 'drowning', 'jump off', 'jumping off',
  'domestic violence', 'beating me', 'hitting me', 'throttling', 'strangling', 'choking me',
  'hostage', 'held captive', 'locked up', 'trapped',
  'threat to life', 'life in danger', 'going to kill', 'will kill',
  'slit wrist', 'cut myself', 'self harm', 'self-harm', 'hurting myself',

  // -- Hindi (Devanagari) --
  '\u0906\u0924\u094D\u092E\u0939\u0924\u094D\u092F\u093E',       // आत्महत्या
  '\u0916\u0941\u0926\u0915\u0941\u0936\u0940',                   // खुदकुशी
  '\u092E\u093E\u0930 \u0921\u093E\u0932\u094B',                  // मार डालो
  '\u092E\u093E\u0930 \u0926\u094B',                              // मार दो
  '\u092E\u093E\u0930 \u0926\u093F\u092F\u093E',                  // मार दिया
  '\u092E\u093E\u0930\u0928\u093E',                               // मारना
  '\u092E\u093E\u0930 \u0930\u0939\u093E',                        // मार रहा
  '\u092E\u093E\u0930 \u0930\u0939\u0940',                        // मार रही
  '\u092E\u093E\u0930 \u0930\u0939\u0947',                        // मार रहे
  '\u0939\u0924\u094D\u092F\u093E',                               // हत्या
  '\u0915\u0924\u094D\u0932',                                     // कत्ल
  '\u092E\u0930\u0928\u093E \u091A\u093E\u0939\u0924\u093E',      // मरना चाहता
  '\u092E\u0930\u0928\u093E \u091A\u093E\u0939\u0924\u0940',      // मरना चाहती
  '\u092E\u0930 \u091C\u093E\u0909\u0902\u0917\u093E',            // मर जाऊंगा
  '\u092E\u0930 \u091C\u093E\u0909\u0902\u0917\u0940',            // मर जाऊंगी
  '\u092E\u0930 \u091C\u093E\u0928\u093E',                        // मर जाना
  '\u091C\u093E\u0928 \u0926\u0947 \u0926\u0942\u0902\u0917\u093E', // जान दे दूंगा
  '\u091C\u093E\u0928 \u0926\u0947 \u0926\u0942\u0902\u0917\u0940', // जान दे दूंगी
  '\u091C\u093E\u0928 \u0938\u0947 \u092E\u093E\u0930',            // जान से मार
  '\u0939\u092E\u0932\u093E',                                     // हमला
  '\u092C\u0932\u093E\u0924\u094D\u0915\u093E\u0930',              // बलात्कार
  '\u0930\u0947\u092A',                                           // रेप
  '\u091B\u0947\u0921\u093C\u0916\u093E\u0928\u0940',              // छेड़खानी
  '\u091B\u0947\u0921\u093C\u091B\u093E\u0921\u093C',              // छेड़छाड़
  '\u092F\u094C\u0928 \u0936\u094B\u0937\u0923',                   // यौन शोषण
  '\u0924\u0947\u091C\u093C\u093E\u092C',                          // तेज़ाब
  '\u0924\u0947\u091C\u093E\u092C',                               // तेजाब
  '\u091C\u0932\u093E \u0926\u093F\u092F\u093E',                   // जला दिया
  '\u0906\u0917 \u0932\u0917\u093E \u0926\u0940',                  // आग लगा दी
  '\u0905\u092A\u0939\u0930\u0923',                               // अपहरण
  '\u0915\u093F\u0921\u0928\u0948\u092A',                          // किडनैप
  '\u092C\u0902\u0927\u0915',                                     // बंधक
  '\u092C\u0902\u0926\u0942\u0915',                               // बंदूक
  '\u0917\u094B\u0932\u0940',                                     // गोली
  '\u091A\u093E\u0915\u0942',                                     // चाकू
  '\u091B\u0941\u0930\u093E',                                     // छुरा
  '\u0916\u0942\u0928',                                           // खून
  '\u092E\u0930 \u0930\u0939\u093E',                              // मर रहा
  '\u092E\u0930 \u0930\u0939\u0940',                              // मर रही
  '\u092C\u091A\u093E\u0913',                                     // बचाओ
  '\u092C\u091A\u093E \u0932\u094B',                              // बचा लो
  '\u092E\u0926\u0926 \u0915\u0930\u094B',                         // मदद करो
  '\u092E\u0926\u0926',                                           // मदद
  '\u092B\u093E\u0902\u0938\u0940',                               // फांसी
  '\u091C\u0939\u0930',                                           // जहर
  '\u0921\u0942\u092C \u0930\u0939\u093E',                         // डूब रहा
  '\u0921\u0942\u092C \u0930\u0939\u0940',                         // डूब रही
  '\u0915\u0942\u0926 \u091C\u093E\u0909\u0902\u0917\u093E',       // कूद जाऊंगा
  '\u092E\u093E\u0930 \u092A\u0940\u091F',                        // मार पीट
  '\u092A\u0940\u091F \u0930\u0939\u093E',                         // पीट रहा
  '\u0917\u0932\u093E \u0926\u092C\u093E \u0930\u0939\u093E',      // गला दबा रहा
  '\u0917\u0932\u093E \u0918\u094B\u0902\u091F',                   // गला घोंट
  '\u0918\u0930\u0947\u0932\u0942 \u0939\u093F\u0902\u0938\u093E', // घरेलू हिंसा
  '\u092A\u094D\u0930\u0924\u093E\u0921\u093C\u0928\u093E',        // प्रताड़ना
  '\u0909\u0924\u094D\u092A\u0940\u0921\u093C\u0928',              // उत्पीड़न

  // -- Hindi (Transliterated / Romanized) --
  'aatmhatya', 'khudkushi', 'maar dalo', 'maar do', 'maar diya', 'maarna',
  'maar raha', 'maar rahi', 'hatya', 'qatl', 'katal',
  'marna chahta', 'marna chahti', 'mar jaunga', 'mar jaungi', 'mar jana',
  'jaan de dunga', 'jaan de dungi', 'jaan se maar', 'jaan se maarna',
  'hamla', 'hamla ho raha', 'hamla kar raha', 'hamla kar diya',
  'balatkar', 'chedkhani', 'chedchad', 'yaun shoshan',
  'tezaab', 'jala diya', 'jala raha', 'aag laga di',
  'apaharan', 'bandhak', 'bandook', 'goli',
  'chaaku', 'chaaku maara', 'chhura', 'ghonpa',
  'khoon', 'khoon bah raha', 'mar raha', 'mar rahi',
  'bachao', 'bacha lo', 'madad karo', 'madad',
  'phansi', 'fansi', 'zahar', 'zeher', 'nasha',
  'doob raha', 'doob rahi', 'kood jaunga', 'kood jaungi',
  'maar peet', 'peet raha', 'peet rahi', 'gala daba raha', 'gala ghont',
  'gharelu hinsa', 'pratadna', 'utpidan',
  'mujhe maar', 'mujhe bachao', 'koi maar raha', 'mujhe maaro mat',

  // -- Gujarati --
  '\u0A86\u0AA4\u0ACD\u0AAE\u0AB9\u0AA4\u0ACD\u0AAF\u0ABE',       // આત્મહત્યા
  '\u0AAE\u0ABE\u0AB0\u0AC0 \u0AA8\u0ABE\u0A96\u0ACB',            // મારી નાખો
  '\u0AB9\u0AA4\u0ACD\u0AAF\u0ABE',                               // હત્યા
  '\u0A96\u0AC2\u0AA8',                                           // ખૂન
  '\u0AAE\u0AB0\u0AB5\u0AC1\u0A82 \u0A9B\u0AC7',                   // મરવું છે
  '\u0AAE\u0AB0\u0AC0 \u0A9C\u0A88\u0AB6',                        // મરી જઈશ
  '\u0AB9\u0AC1\u0AAE\u0AB2\u0ACB',                               // હુમલો
  '\u0AAC\u0AB3\u0ABE\u0AA4\u0ACD\u0A95\u0ABE\u0AB0',              // બળાત્કાર
  '\u0A9B\u0AC7\u0AA1\u0A9B\u0ABE\u0AA1',                         // છેડછાડ
  '\u0AA4\u0AC7\u0A9C\u0ABE\u0AAC',                               // તેજાબ
  '\u0AAC\u0ABE\u0AB3\u0AC0 \u0AA8\u0ABE\u0A96\u0ACD\u0AAF\u0ACB', // બાળી નાખ્યો
  '\u0A85\u0AAA\u0AB9\u0AB0\u0AA3',                               // અપહરણ
  '\u0AAC\u0A82\u0AA7\u0A95',                                     // બંધક
  '\u0AAC\u0A82\u0AA6\u0AC2\u0A95',                               // બંદૂક
  '\u0A97\u0ACB\u0AB3\u0AC0',                                     // ગોળી
  '\u0A9B\u0AB0\u0AC0',                                           // છરી
  '\u0A9A\u0ABE\u0A95\u0AC1',                                     // ચાકુ
  '\u0AB2\u0ACB\u0AB9\u0AC0',                                     // લોહી
  '\u0AAC\u0A9A\u0ABE\u0AB5\u0ACB',                               // બચાવો
  '\u0AAE\u0AA6\u0AA6',                                           // મદદ
  '\u0AAB\u0ABE\u0A82\u0AB8\u0AC0',                               // ફાંસી
  '\u0A9D\u0AC7\u0AB0',                                           // ઝેર
  '\u0A98\u0AB0\u0AC7\u0AB2\u0AC1\u0A82 \u0AB9\u0ABF\u0A82\u0AB8\u0ABE', // ઘરેલું હિંસા

  // -- Marathi --
  '\u092E\u093E\u0930\u0942\u0928 \u091F\u093E\u0915\u093E',       // मारून टाका
  '\u092E\u093E\u0930\u0932\u0902',                               // मारलं
  '\u092E\u093E\u0930\u0924\u094B\u092F',                          // मारतोय
  '\u092E\u0930\u093E\u092F\u091A\u0902\u092F',                    // मरायचंय
  '\u092E\u0930\u0923\u093E\u0930',                               // मरणार
  '\u092E\u0930\u0924\u094B\u092F',                               // मरतोय
  '\u0939\u0932\u094D\u0932\u093E',                               // हल्ला
  '\u091B\u0947\u0921\u091B\u093E\u0921',                          // छेडछाड
  '\u0935\u093F\u0928\u092F\u092D\u0902\u0917',                    // विनयभंग
  '\u091C\u093E\u0933\u0932\u0902',                               // जाळलं
  '\u0938\u0941\u0930\u093E',                                     // सुरा
  '\u0930\u0915\u094D\u0924',                                     // रक्त
  '\u0935\u093E\u091A\u0935\u093E',                               // वाचवा
  '\u092E\u0926\u0924 \u0915\u0930\u093E',                         // मदत करा
  '\u092B\u093E\u0936\u0940',                                     // फाशी
  '\u0935\u093F\u0937',                                           // विष
  '\u092C\u0941\u0921\u0924\u094B\u092F',                          // बुडतोय
  '\u092E\u093E\u0930\u0939\u093E\u0923',                          // मारहाण
  '\u0918\u0930\u0917\u0941\u0924\u0940 \u0939\u093F\u0902\u0938\u093E', // घरगुती हिंसा

  // -- Bengali --
  '\u0986\u09A4\u09CD\u09AE\u09B9\u09A4\u09CD\u09AF\u09BE',       // আত্মহত্যা
  '\u09AE\u09C7\u09B0\u09C7 \u09AB\u09C7\u09B2\u09CB',            // মেরে ফেলো
  '\u0996\u09C1\u09A8',                                           // খুন
  '\u09B9\u09A4\u09CD\u09AF\u09BE',                               // হত্যা
  '\u09AE\u09B0\u09A4\u09C7 \u099A\u09BE\u0987',                   // মরতে চাই
  '\u09AE\u09B0\u09C7 \u09AF\u09BE\u09AC',                        // মরে যাব
  '\u09AE\u09B0\u099B\u09BF',                                     // মরছি
  '\u0986\u0995\u09CD\u09B0\u09AE\u09A3',                          // আক্রমণ
  '\u09A7\u09B0\u09CD\u09B7\u09A3',                               // ধর্ষণ
  '\u09AC\u09BE\u0981\u099A\u09BE\u0993',                          // বাঁচাও
  '\u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09CB', // সাহায্য করো
  '\u09AB\u09BE\u0981\u09B8\u09BF',                               // ফাঁসি
  '\u09AC\u09BF\u09B7',                                           // বিষ
  '\u09A1\u09C1\u09AC\u099B\u09BF',                               // ডুবছি
  '\u09AE\u09BE\u09B0\u099B\u09C7',                               // মারছে
  '\u09AE\u09BE\u09B0\u09A7\u09B0',                               // মারধর
  '\u0997\u09C3\u09B9 \u09B9\u09BF\u0982\u09B8\u09BE',             // গৃহ হিংসা

  // -- Tamil --
  '\u0BA4\u0BB1\u0BCD\u0B95\u0BCA\u0BB2\u0BC8',                   // தற்கொலை
  '\u0B95\u0BCA\u0BB2\u0BC8',                                     // கொலை
  '\u0B95\u0BCA\u0BB2\u0BCD\u0BB2',                               // கொல்ல
  '\u0B9A\u0BBE\u0B95\u0BA3\u0BC1\u0BAE\u0BCD',                   // சாகணும்
  '\u0BA4\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BA4\u0BB2\u0BCD',       // தாக்குதல்
  '\u0B95\u0BB1\u0BCD\u0BAA\u0BB4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1', // கற்பழிப்பு
  '\u0B95\u0BA4\u0BCD\u0BA4\u0BBF',                               // கத்தி
  '\u0BB0\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD',                         // ரத்தம்
  '\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD', // காப்பாற்றுங்கள்
  '\u0B89\u0BA4\u0BB5\u0BBF',                                     // உதவி
  '\u0BA4\u0BC2\u0B95\u0BCD\u0B95\u0BC1',                          // தூக்கு
  '\u0BA8\u0B9E\u0BCD\u0B9A\u0BC1',                               // நஞ்சு
  '\u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA \u0BB5\u0BA9\u0BCD\u0BAE\u0BC1\u0BB1\u0BC8', // குடும்ப வன்முறை

  // -- Telugu --
  '\u0C06\u0C24\u0C4D\u0C2E\u0C39\u0C24\u0C4D\u0C2F',             // ఆత్మహత్య
  '\u0C39\u0C24\u0C4D\u0C2F',                                     // హత్య
  '\u0C1A\u0C02\u0C2A\u0C47\u0C36\u0C3E\u0C30\u0C41',              // చంపేశారు
  '\u0C1A\u0C1A\u0C4D\u0C1A\u0C3F\u0C2A\u0C4B\u0C24\u0C3E',       // చచ్చిపోతా
  '\u0C26\u0C3E\u0C21\u0C3F',                                     // దాడి
  '\u0C05\u0C24\u0C4D\u0C2F\u0C3E\u0C1A\u0C3E\u0C30\u0C02',       // అత్యాచారం
  '\u0C15\u0C3E\u0C2A\u0C3E\u0C21\u0C02\u0C21\u0C3F',              // కాపాడండి
  '\u0C38\u0C39\u0C3E\u0C2F\u0C02',                               // సహాయం
  '\u0C17\u0C43\u0C39 \u0C39\u0C3F\u0C02\u0C38',                   // గృహ హింస

  // -- Kannada --
  '\u0C86\u0CA4\u0CCD\u0CAE\u0CB9\u0CA4\u0CCD\u0CAF\u0CC6',       // ಆತ್ಮಹತ್ಯೆ
  '\u0C95\u0CCA\u0CB2\u0CC6',                                     // ಕೊಲೆ
  '\u0CB8\u0CBE\u0CAF\u0CAC\u0CC7\u0C95\u0CC1',                   // ಸಾಯಬೇಕು
  '\u0CA6\u0CBE\u0CB3\u0CBF',                                     // ದಾಳಿ
  '\u0C85\u0CA4\u0CCD\u0CAF\u0CBE\u0C9A\u0CBE\u0CB0',              // ಅತ್ಯಾಚಾರ
  '\u0C89\u0CB3\u0CBF\u0CB8\u0CBF',                               // ಉಳಿಸಿ
  '\u0CB8\u0CB9\u0CBE\u0CAF',                                     // ಸಹಾಯ
  '\u0C95\u0CCC\u0C9F\u0CC1\u0C82\u0CAC\u0CBF\u0C95 \u0CB9\u0CBF\u0C82\u0CB8\u0CC6', // ಕೌಟುಂಬಿಕ ಹಿಂಸೆ

  // -- Malayalam --
  '\u0D06\u0D24\u0D4D\u0D2E\u0D39\u0D24\u0D4D\u0D2F',             // ആത്മഹത്യ
  '\u0D15\u0D4A\u0D32\u0D2A\u0D3E\u0D24\u0D15\u0D02',              // കൊലപാതകം
  '\u0D2E\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D3E\u0D28\u0D4D',       // മരിക്കാൻ
  '\u0D06\u0D15\u0D4D\u0D30\u0D2E\u0D23\u0D02',                   // ആക്രമണം
  '\u0D2C\u0D32\u0D3E\u0D24\u0D4D\u0D38\u0D02\u0D17\u0D02',       // ബലാത്സംഗം
  '\u0D30\u0D15\u0D4D\u0D37\u0D3F\u0D15\u0D4D\u0D15\u0D42',       // രക്ഷിക്കൂ
  '\u0D38\u0D39\u0D3E\u0D2F\u0D3F\u0D15\u0D4D\u0D15\u0D42',       // സഹായിക്കൂ
  '\u0D17\u0D3E\u0D7C\u0D39\u0D3F\u0D15 \u0D2A\u0D40\u0D21\u0D28\u0D02', // ഗാർഹിക പീഡനം

  // -- Punjabi --
  '\u0A06\u0A24\u0A2E\u0A39\u0A71\u0A24\u0A3F\u0A06',             // ਆਤਮਹੱਤਿਆ
  '\u0A15\u0A24\u0A32',                                           // ਕਤਲ
  '\u0A2E\u0A3E\u0A30 \u0A26\u0A3F\u0A71\u0A24\u0A3E',            // ਮਾਰ ਦਿੱਤਾ
  '\u0A2E\u0A30\u0A28\u0A3E',                                     // ਮਰਨਾ
  '\u0A39\u0A2E\u0A32\u0A3E',                                     // ਹਮਲਾ
  '\u0A2C\u0A32\u0A3E\u0A24\u0A15\u0A3E\u0A30',                   // ਬਲਾਤਕਾਰ
  '\u0A2C\u0A1A\u0A3E\u0A13',                                     // ਬਚਾਓ
  '\u0A2E\u0A26\u0A26',                                           // ਮਦਦ
  '\u0A18\u0A30\u0A47\u0A32\u0A42 \u0A39\u0A3F\u0A02\u0A38\u0A3E', // ਘਰੇਲੂ ਹਿੰਸਾ

  // -- Odia --
  '\u0B06\u0B24\u0B4D\u0B2E\u0B39\u0B24\u0B4D\u0B2F\u0B3E',       // ଆତ୍ମହତ୍ୟା
  '\u0B39\u0B24\u0B4D\u0B2F\u0B3E',                               // ହତ୍ୟା
  '\u0B06\u0B15\u0B4D\u0B30\u0B2E\u0B23',                          // ଆକ୍ରମଣ
  '\u0B27\u0B30\u0B4D\u0B37\u0B23',                               // ଧର୍ଷଣ
  '\u0B2C\u0B1E\u0B4D\u0B1A\u0B3E\u0B05',                         // ବଞ୍ଚାଅ
  '\u0B38\u0B3E\u0B39\u0B3E\u0B2F\u0B4D\u0B2F',                   // ସାହାଯ୍ୟ
  '\u0B18\u0B30\u0B4B\u0B07 \u0B39\u0B3F\u0B02\u0B38\u0B3E',       // ଘରୋଇ ହିଂସା

  // -- Urdu --
  '\u062E\u0648\u062F\u06A9\u0634\u06CC',                          // خودکشی
  '\u0642\u062A\u0644',                                           // قتل
  '\u0645\u0627\u0631 \u0688\u0627\u0644\u0648',                   // مار ڈالو
  '\u0645\u0627\u0631 \u062F\u06CC\u0627',                         // مار دیا
  '\u062D\u0645\u0644\u06C1',                                     // حملہ
  '\u0639\u0635\u0645\u062A \u062F\u0631\u06CC',                   // عصمت دری
  '\u0628\u0686\u0627\u0624',                                     // بچاؤ
  '\u0645\u062F\u062F',                                           // مدد
  '\u06AF\u06BE\u0631\u06CC\u0644\u0648 \u062A\u0634\u062F\u062F', // گھریلو تشدد
];

/**
 * Checks if the user message contains any emergency keyword.
 * Uses word-boundary-aware matching for short English words, and
 * simple includes() for non-Latin scripts to avoid regex issues.
 * Returns the matched keyword or null.
 */
function detectEmergency(message) {
  if (!message) return null;
  const lowerMsg = message.toLowerCase().trim();

  for (const keyword of EMERGENCY_KEYWORDS) {
    const lowerKeyword = keyword.toLowerCase();

    // For Latin-script keywords, use word boundary regex to avoid false positives
    // (e.g., "skill" matching "kill")
    const isLatin = /^[a-z0-9\s\-']+$/i.test(keyword);
    if (isLatin) {
      // Escape special regex chars in keyword
      const escaped = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\s|[^a-z])${escaped}(?:$|\\s|[^a-z])`, 'i');
      // Also check if the message exactly equals the keyword
      if (regex.test(` ${lowerMsg} `) || lowerMsg === lowerKeyword) {
        return keyword;
      }
    } else {
      // For Devanagari, Bengali, Tamil, etc. - simple substring match
      if (lowerMsg.includes(lowerKeyword)) {
        return keyword;
      }
    }
  }
  return null;
}

export default function ChatWidget() {
  const { lang, victim } = useAuth();
  const t = translations[lang] || translations.en;

  const getInitialGreeting = () => [
    {
      id: 1,
      sender: 'assistant',
      text: t.initialGreeting || (lang === 'hi' 
        ? "\u0928\u092E\u0938\u094D\u0924\u0947\u0964 \u092F\u0939 \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0905\u0924\u094D\u092F\u093E\u091A\u093E\u0930 \u0935\u093F\u0930\u094B\u0927\u0940 \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928 (NHAA 14566) \u0915\u093E \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u090F\u0935\u0902 \u0917\u094B\u092A\u0928\u0940\u092F \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947\u0902\u0926\u094D\u0930 \u0939\u0948\u0964 \u0906\u092A \u0905\u092A\u0928\u0940 \u0938\u092E\u0938\u094D\u092F\u093E \u092C\u093F\u0928\u093E \u0915\u093F\u0938\u0940 \u0939\u093F\u091A\u0915\u093F\u091A\u093E\u0939\u091F \u0915\u0947 \u0938\u093E\u091D\u093E \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964 \u0939\u092E \u0906\u092A\u0915\u0940 \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u0938\u094D\u0925\u093F\u0924 \u0939\u0948\u0902\u0964"
        : "Welcome to the National Helpline Against Atrocities (NHAA 14566) confidential support portal. Please feel free to share what is on your mind. We are here to listen and help you navigate safety and support."),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ];

  const [messages, setMessages] = useState(getInitialGreeting);

  // Dynamically update greeting when language changes if no user messages sent yet
  useEffect(() => {
    setMessages((prev) => {
      const hasUserMessage = prev.some((m) => m.sender === 'user');
      if (!hasUserMessage) {
        return getInitialGreeting();
      }
      return prev;
    });
  }, [lang, t.initialGreeting]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [humanRequested, setHumanRequested] = useState(false);

  const chatContainerRef = useRef(null);
  const widgetRef = useRef(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = (behavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // Align screen bottom to the bottom of the chat bot shape
  useEffect(() => {
    const alignScreenBottomToChatbot = (behavior = 'instant') => {
      if (widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect();
        const chatBottomInDoc = window.scrollY + rect.bottom;
        const targetScrollY = Math.max(0, chatBottomInDoc - window.innerHeight);

        const prevBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = behavior;
        window.scrollTo({
          top: targetScrollY,
          behavior,
        });
        document.documentElement.style.scrollBehavior = prevBehavior;
      }
    };

    const timer1 = setTimeout(() => alignScreenBottomToChatbot('instant'), 50);
    const timer2 = setTimeout(() => alignScreenBottomToChatbot('instant'), 200);
    const handleResize = () => alignScreenBottomToChatbot('instant');
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Prevent scrolling on initial page load / entry so it stays at the chatbot
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    scrollToBottom();
    try {
      if (messages.length > 1) {
        localStorage.setItem('svi_active_chat_history', JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setMessages(getInitialGreeting());
    setInputMessage('');
    setHumanRequested(false);
    try {
      localStorage.removeItem('svi_active_chat_history');
    } catch (e) {}
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // =================================================================
    // EMERGENCY INTERCEPT - Check for crisis keywords BEFORE calling AI
    // If detected -> skip backend entirely -> show emergency card -> auto-dial
    // =================================================================
    const emergencyMatch = detectEmergency(trimmed);
    if (emergencyMatch) {
      const emergencyText = {
        'hi': '\uD83D\uDEA8 \u0906\u092A\u093E\u0924\u0915\u093E\u0932\u0940\u0928 \u0938\u094D\u0925\u093F\u0924\u093F \u0915\u093E \u092A\u0924\u093E \u091A\u0932\u093E \u0939\u0948\u0964 \u0906\u092A\u0915\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0938\u0930\u094D\u0935\u094B\u092A\u0930\u093F \u0939\u0948\u0964\n\n\u0915\u0943\u092A\u092F\u093E \u0905\u092D\u0940 \u0924\u0941\u0930\u0902\u0924 112 (\u092A\u0941\u0932\u093F\u0938) \u092F\u093E 14566 (NHAA \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928) \u092A\u0930 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902\u0964\n\n\u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0938\u094D\u0935\u091A\u093E\u0932\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0906\u092A\u093E\u0924\u0915\u093E\u0932\u0940\u0928 \u0915\u0949\u0932 \u0936\u0941\u0930\u0942 \u0915\u0940 \u091C\u093E \u0930\u0939\u0940 \u0939\u0948...',
        'gu': '\uD83D\uDEA8 \u0A95\u0A9F\u0ACB\u0A95\u0A9F\u0AC0\u0AA8\u0AC0 \u0AB8\u0ACD\u0AA5\u0ABF\u0AA4\u0ABF \u0AAE\u0AB3\u0AC0 \u0A9B\u0AC7\u0964 \u0AA4\u0AAE\u0ABE\u0AB0\u0AC0 \u0AB8\u0AB2\u0ABE\u0AAE\u0AA4\u0AC0 \u0AB8\u0ACC\u0AA5\u0AC0 \u0AAE\u0AB9\u0AA4\u0ACD\u0AB5\u0AAA\u0AC2\u0AB0\u0ACD\u0AA3 \u0A9B\u0AC7\u0964\n\n\u0A95\u0AC3\u0AAA\u0ABE \u0A95\u0AB0\u0AC0\u0AA8\u0AC7 \u0A85\u0AA4\u0ACD\u0AAF\u0ABE\u0AB0\u0AC7 \u0A9C 112 (\u0AAA\u0ACB\u0AB2\u0AC0\u0AB8) \u0A85\u0AA5\u0AB5\u0ABE 14566 (NHAA \u0AB9\u0AC7\u0AB2\u0ACD\u0AAA\u0AB2\u0ABE\u0A87\u0AA8) \u0AAA\u0AB0 \u0A95\u0AC9\u0AB2 \u0A95\u0AB0\u0ACB\u0964\n\n\u0AA4\u0AAE\u0ABE\u0AB0\u0ABE \u0AAE\u0ABE\u0A9F\u0AC7 \u0A88\u0AAE\u0AB0\u0ACD\u0A9C\u0AA8\u0ACD\u0AB8\u0AC0 \u0A95\u0AC9\u0AB2 \u0A86\u0AAA\u0ACB\u0A86\u0AAA \u0AB6\u0AB0\u0AC2 \u0AA5\u0A88 \u0AB0\u0AB9\u0ACD\u0AAF\u0ACB \u0A9B\u0AC7...',
        'mr': '\uD83D\uDEA8 \u0906\u092A\u0924\u094D\u0915\u093E\u0932\u0940\u0928 \u092A\u0930\u093F\u0938\u094D\u0925\u093F\u0924\u0940 \u0906\u0922\u0933\u0932\u0940. \u0906\u092A\u0932\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924\u0924\u093E \u0938\u0930\u094D\u0935\u093E\u0924 \u092E\u0939\u0924\u094D\u0924\u094D\u0935\u093E\u091A\u0940 \u0906\u0939\u0947\u0964\n\n\u0915\u0943\u092A\u092F\u093E \u0906\u0924\u094D\u0924\u093E \u0932\u0917\u0947\u091A 112 (\u092A\u094B\u0932\u0940\u0938) \u0915\u093F\u0902\u0935\u093E 14566 (NHAA \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928) \u0935\u0930 \u0915\u0949\u0932 \u0915\u0930\u093E\u0964\n\n\u0906\u092A\u0924\u094D\u0915\u093E\u0932\u0940\u0928 \u0915\u0949\u0932 \u0938\u094D\u0935\u092F\u0902\u091A\u0932\u093F\u0924\u092A\u0923\u0947 \u0938\u0941\u0930\u0942 \u0915\u0947\u0932\u0940 \u091C\u093E\u0924 \u0906\u0939\u0947...',
      };

      const defaultText = '\uD83D\uDEA8 EMERGENCY DETECTED \u2014 Your safety is the top priority.\n\nPlease call 112 (Police) or 14566 (NHAA Helpline) RIGHT NOW.\n\nAuto-initiating emergency call for you...';

      const emergencyMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        isEmergency: true,
        text: emergencyText[lang] || defaultText,
        toolCalled: 'emergency_call_tool',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, emergencyMsg]);

      // Auto-trigger phone dialer to 112 after a brief moment
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = 'tel:112';
        }
      }, 800);

      return; // Skip AI backend entirely
    }

    // =================================================================
    // Normal flow - no emergency keyword detected, send to AI backend
    // =================================================================
    setIsTyping(true);

    const currentLangObj = supportedLanguages.find((l) => l.code === lang) || {
      name: 'English',
      nativeName: 'English',
      code: 'en',
    };

    try {
      // Call FastAPI backend /ask endpoint with user selected language
      const result = await askTherapist(trimmed, {
        language: currentLangObj.name,
        languageCode: currentLangObj.code,
        nativeName: currentLangObj.nativeName,
      });
      
      const replyMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: result.response || "We have received your message and are processing assistance.",
        toolCalled: result.tool_called,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          isFallback: true,
          text: t.networkError || (lang === 'hi'
            ? "\u0939\u092E\u0947\u0902 \u0906\u092A\u0938\u0947 \u0915\u0928\u0947\u0915\u094D\u091F \u0915\u0930\u0928\u0947 \u092E\u0947\u0902 \u0925\u094B\u0921\u093C\u093E \u0938\u092E\u092F \u0932\u0917 \u0930\u0939\u093E \u0939\u0948\u0964 \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947 \u0932\u093F\u090F \u0906\u092A \u0938\u0940\u0927\u0947 \u0939\u092E\u093E\u0930\u0940 24x7 \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928 14566 \u092F\u093E \u0906\u092A\u093E\u0924\u0915\u093E\u0932\u0940\u0928 112 \u092A\u0930 \u0924\u0941\u0930\u0902\u0924 \u0915\u0949\u0932 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964"
            : "We are experiencing a temporary network delay. For immediate confidential support, please call our 24x7 toll-free helpline 14566 or emergency 112 directly."),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTalkToHuman = () => {
    setHumanRequested(true);
    const escalationMsg = {
      id: Date.now(),
      sender: 'assistant',
      text: t.humanEscalationMsg || (lang === 'hi'
        ? "\u0939\u092E\u0928\u0947 \u0906\u092A\u0915\u0947 \u0905\u0928\u0941\u0930\u094B\u0927 \u0915\u094B \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E \u092A\u0930 \u0926\u0930\u094D\u091C \u0915\u0930 \u0932\u093F\u092F\u093E \u0939\u0948\u0964 \u0906\u092A \u0924\u0941\u0930\u0902\u0924 \u0939\u092E\u093E\u0930\u0947 \u092A\u094D\u0930\u0936\u093F\u0915\u094D\u0937\u093F\u0924 \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u0938\u0947 14566 \u092A\u0930 \u092C\u093E\u0924 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902, \u092F\u093E \u0928\u093F\u0915\u091F\u0924\u092E \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947\u0902\u0926\u094D\u0930 \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0932\u0947 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964"
        : "A human counsellor connection has been initiated. For immediate 1-on-1 voice assistance, please call our 24x7 toll-free helpline 14566, or select a nearby support center below."),
      isEscalation: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, escalationMsg]);
  };

  const recognitionRef = useRef(null);

  const toggleVoice = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        t.speechNotSupported ||
        (lang === 'hi'
          ? '\u0906\u092A\u0915\u0947 \u092C\u094D\u0930\u093E\u0909\u091C\u093C\u0930 \u092E\u0947\u0902 \u0935\u0949\u0907\u0938 \u0930\u093F\u0915\u0917\u094D\u0928\u093F\u0936\u0928 \u0938\u092E\u0930\u094D\u0925\u093F\u0924 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u0915\u094D\u0930\u094B\u092E \u092F\u093E \u090F\u091C \u092C\u094D\u0930\u093E\u0909\u091C\u093C\u0930 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964'
          : 'Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      );
      return;
    }

    const speechCode = getSpeechRecognitionLang(lang);
    if (!speechCode) {
      alert(
        t.speechLangUnavailable ||
        (lang === 'hi'
          ? '\u0907\u0938 \u092D\u093E\u0937\u093E \u0915\u0947 \u0932\u093F\u090F \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092E\u0947\u0902 \u0935\u0949\u0907\u0938 \u0930\u093F\u0915\u0917\u094D\u0928\u093F\u0936\u0928 \u0938\u092E\u0930\u094D\u0925\u093F\u0924 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u091A\u0948\u091F \u092C\u0949\u0915\u094D\u0938 \u092E\u0947\u0902 \u0938\u0902\u0926\u0947\u0936 \u091F\u093E\u0907\u092A \u0915\u0930\u0947\u0902\u0964'
          : 'Voice input is not currently supported for this language. Please type your message in the chat box.')
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechCode;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  return (
    <div
      ref={widgetRef}
      className="flex flex-col h-[calc(100dvh-180px)] sm:h-[82vh] min-h-[460px] bg-white dark:bg-[#111b21] rounded-2xl shadow-xl border border-gov-border dark:border-slate-800 overflow-hidden transition-colors"
    >
      {/* WhatsApp Style Top Chat Bar */}
      <div className="bg-[#075E54] dark:bg-[#064e46] text-white p-3.5 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center font-bold text-white shadow-inner">
              <HeartHandshake className="w-5 h-5 text-emerald-100" />
            </div>
            <span className="w-3 h-3 bg-[#25D366] border-2 border-[#075E54] rounded-full absolute bottom-0 right-0" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-2">
              <span>{t.chatHeader}</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-200 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Active {'\u2022'} Confidential
              </span>
            </h2>
            <p className="text-xs text-emerald-100/90 font-normal hidden sm:block">
              {t.chatSubtitle}
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewChat}
            aria-label={t.newChatAria || (lang === 'hi' ? '\u0928\u0908 \u091A\u0948\u091F \u092A\u094D\u0930\u093E\u0930\u0902\u092D \u0915\u0930\u0947\u0902' : 'Start Fresh Chat Session')}
            title={t.newChatAria || (lang === 'hi' ? '\u0928\u0908 \u091A\u0948\u091F \u092A\u094D\u0930\u093E\u0930\u0902\u092D \u0915\u0930\u0947\u0902' : 'Start Fresh Chat Session')}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-2.5 py-1.5 rounded-full transition-colors border border-white/20 focus:ring-2 focus:ring-white"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
            <span className="hidden sm:inline">{t.newChat || (lang === 'hi' ? '\u0928\u0908 \u091A\u0948\u091F' : 'New Chat')}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            aria-label={t.findNearbyBtn}
            title={t.findNearbyBtn}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-2.5 py-1.5 rounded-full transition-colors border border-white/20 focus:ring-2 focus:ring-white"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
            <span className="hidden sm:inline">{t.findNearbyBtn}</span>
          </button>
          <button
            type="button"
            onClick={handleTalkToHuman}
            aria-label={t.talkToHumanBtn}
            className="flex items-center gap-1 text-xs bg-[#25D366] hover:bg-[#20bd5a] text-[#075E54] font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm focus:ring-2 focus:ring-[#25D366]"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#075E54]" aria-hidden="true" />
            <span>{t.talkToHumanBtn}</span>
          </button>
        </div>
      </div>

      {/* Emergency Notice Ribbon */}
      <div className="bg-[#FFF8E7] dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-800/60 px-4 py-2 flex items-center justify-between text-xs text-amber-950 dark:text-amber-200 font-medium transition-colors">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0" aria-hidden="true" />
          <span>{t.crisisBanner}</span>
        </div>
        <div className="flex gap-2">
          <a
            href="tel:112"
            aria-label="Call Emergency Police Helpline 112"
            className="bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold hover:bg-red-700 text-[11px] shadow-xs focus:ring-2 focus:ring-red-600"
          >
            Call 112
          </a>
          <a
            href="tel:14566"
            aria-label="Call National Helpline Against Atrocities 14566"
            className="bg-[#075E54] text-white px-2.5 py-0.5 rounded-full font-bold hover:bg-[#128C7E] text-[11px] shadow-xs focus:ring-2 focus:ring-[#075E54]"
          >
            NHAA 14566
          </a>
        </div>
      </div>

      {/* WhatsApp Chat Body */}
      <div
        ref={chatContainerRef}
        dir="ltr"
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#EFEAE2] dark:bg-[#0b141a] text-slate-400 dark:text-slate-600 transition-colors"
        style={{
          backgroundImage: 'radial-gradient(currentColor 0.75px, transparent 0.75px)',
          backgroundSize: '16px 16px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} svi-msg-animate`}
          >
            <div
              dir="auto"
              className={`max-w-[85%] sm:max-w-[75%] p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#D9FDD3] dark:bg-[#005c4b] text-[#111B21] dark:text-emerald-50 rounded-2xl rounded-tr-xs'
                  : msg.isEmergency
                  ? 'bg-red-50 dark:bg-red-950/80 text-red-900 dark:text-red-100 rounded-2xl rounded-tl-xs border-2 border-red-500 dark:border-red-600 ring-2 ring-red-300 dark:ring-red-800'
                  : 'bg-white dark:bg-[#202c33] text-[#111B21] dark:text-slate-100 rounded-2xl rounded-tl-xs border border-black/5 dark:border-white/10'
              }`}
            >
              <FormattedMessage text={msg.text} />

              {/* Graceful Fallback Direct Action Card */}
              {msg.isFallback && (
                <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-2">
                  <div className="text-xs text-slate-700 font-semibold">
                    Direct Helpline Options:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="tel:14566"
                      aria-label="Call 24x7 NHAA Helpline 14566"
                      className="inline-flex items-center gap-1.5 bg-[#075E54] hover:bg-[#128C7E] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                      <span>Call NHAA 14566</span>
                    </a>
                    <a
                      href="tel:112"
                      aria-label="Call Emergency Police 112"
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      <span>Call 112</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Emergency Direct Call Buttons - shown on emergency-intercepted messages */}
              {msg.isEmergency && (
                <div className="mt-3 pt-3 border-t-2 border-red-300 dark:border-red-700 space-y-2.5">
                  <div className="text-xs font-bold text-red-800 dark:text-red-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                    <span>{lang === 'hi' ? '\u0924\u0941\u0930\u0902\u0924 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902:' : 'Call Now Immediately:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="tel:112"
                      aria-label="Call Emergency Police 112"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md animate-pulse"
                    >
                      <PhoneCall className="w-5 h-5" aria-hidden="true" />
                      <span>{lang === 'hi' ? '\u092A\u0941\u0932\u093F\u0938 112 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902' : 'Call Police 112'}</span>
                    </a>
                    <a
                      href="tel:14566"
                      aria-label="Call NHAA Helpline 14566"
                      className="inline-flex items-center gap-2 bg-[#075E54] hover:bg-[#128C7E] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md"
                    >
                      <PhoneCall className="w-5 h-5 text-amber-300" aria-hidden="true" />
                      <span>{lang === 'hi' ? 'NHAA 14566 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902' : 'Call NHAA 14566'}</span>
                    </a>
                    <a
                      href="tel:14416"
                      aria-label="Call Tele-MANAS 14416"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md"
                    >
                      <PhoneCall className="w-5 h-5" aria-hidden="true" />
                      <span>{lang === 'hi' ? '\u091F\u0947\u0932\u0940-\u092E\u093E\u0928\u0938 14416' : 'Tele-MANAS 14416'}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Tool / Action Specific Recommendations */}
              {msg.toolCalled === 'find_nearby_therapists_by_location' && (
                <div className="mt-2.5 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsSupportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075E54] hover:underline focus:ring-2 focus:ring-[#075E54] rounded"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                    Open Verified Support Center Directory
                  </button>
                </div>
              )}

              {msg.toolCalled === 'emergency_call_tool' && !msg.isEmergency && (
                <div className="mt-2.5 pt-2 border-t border-red-200 bg-red-50 p-2 rounded-lg text-red-900 font-medium">
                  Emergency escalation triggered. Please call 112 or stay with a trusted individual immediately.
                </div>
              )}

              <div
                className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                  msg.sender === 'user' ? 'text-slate-600' : 'text-slate-500'
                }`}
              >
                <span suppressHydrationWarning>{msg.timestamp}</span>
                {msg.sender === 'user' && (
                  <span className="text-[#53bdeb] text-[11px] font-bold" aria-label="Delivered">{'\u2713\u2713'}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#202c33] rounded-2xl rounded-tl-xs p-3 shadow-xs border border-black/5 dark:border-white/10 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 bg-[#008069] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#008069] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#008069] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-1 text-[11px] font-medium">{t.chatTyping}</span>
            </div>
          </div>
        )}

        {/* Bottom spacer for message list */}
        <div />
      </div>

      {/* WhatsApp Style Bottom Input Bar */}
      <div className="p-3 bg-[#F0F2F5] dark:bg-[#202c33] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={isRecording ? t.voiceInputListening : t.voiceInputStart}
            title={isRecording ? t.voiceInputListening : t.voiceInputStart}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-xs focus:ring-2 focus:ring-[#008069] flex-shrink-0 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-white dark:bg-[#2a3942] text-[#54656F] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#32444f] border border-slate-300 dark:border-slate-700'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" aria-hidden="true" /> : <Mic className="w-5 h-5 text-[#008069] dark:text-emerald-400" aria-hidden="true" />}
          </button>

          {/* Pill Input Box */}
          <input
            type="text"
            aria-label="Message input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isRecording ? t.voiceInputListening : t.chatPlaceholder}
            className="flex-1 bg-white dark:bg-[#2a3942] border border-slate-300 dark:border-slate-700 rounded-full px-4 sm:px-5 py-2.5 sm:py-2.5 text-sm text-[#111B21] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#008069] shadow-xs transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            aria-label="Send message"
            disabled={!inputMessage.trim() || isTyping}
            className="w-11 h-11 rounded-full bg-[#008069] hover:bg-[#075E54] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0 focus:ring-2 focus:ring-[#075E54]"
          >
            <Send className="w-4 h-4 ml-0.5" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 px-2 max-w-4xl mx-auto">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#008069] dark:text-emerald-400" aria-hidden="true" />
            AI Real-Time Trauma Triage {'\u2022'} 256-bit Encrypted & Confidential
          </span>
          <span className="hidden md:inline font-medium">
            Ministry of Social Justice & Empowerment (14566)
          </span>
        </div>
      </div>

      {/* Nearby Support Modal */}
      <NearbySupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
