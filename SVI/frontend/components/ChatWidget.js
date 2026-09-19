'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
        const bulletMatch = trimmed.match(/^([*\-•])\s+(.+)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-[#075E54] font-bold select-none leading-5">•</span>
              <span className="flex-1">{formatInlineText(bulletMatch[2])}</span>
            </div>
          );
        }

        // Numbered lists (1. item, 2. item)
        const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.+)$/);
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

export default function ChatWidget() {
  const { lang, victim } = useAuth();
  const t = translations[lang] || translations.en;

  const getInitialGreeting = useCallback(() => [
    {
      id: 1,
      sender: 'assistant',
      text: t.initialGreeting || (lang === 'hi' 
        ? "नमस्ते। यह राष्ट्रीय अत्याचार विरोधी हेल्पलाइन (NHAA 14566) का सुरक्षित एवं गोपनीय सहायता केंद्र है। आप अपनी समस्या बिना किसी हिचकिचाहट के साझा कर सकते हैं। हम आपकी सहायता के लिए उपस्थित हैं।"
        : "Welcome to the National Helpline Against Atrocities (NHAA 14566) confidential support portal. Please feel free to share what is on your mind. We are here to listen and help you navigate safety and support."),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ], [lang, t.initialGreeting]);

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

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
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
            ? "हमें आपसे कनेक्ट करने में थोड़ा समय लग रहा है। सहायता के लिए आप सीधे हमारी 24x7 राष्ट्रीय हेल्पलाइन 14566 या आपातकालीन 112 पर तुरंत कॉल कर सकते हैं।"
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
        ? "हमने आपके अनुरोध को प्राथमिकता पर दर्ज कर लिया है। आप तुरंत हमारे प्रशिक्षित अधिकारी से 14566 पर बात कर सकते हैं, या निकटतम सहायता केंद्र की जानकारी ले सकते हैं।"
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
          ? 'आपके ब्राउज़र में वॉइस रिकग्निशन समर्थित नहीं है। कृपया क्रोम या एज ब्राउज़र का उपयोग करें।'
          : 'Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      );
      return;
    }

    const speechCode = getSpeechRecognitionLang(lang);
    if (!speechCode) {
      alert(
        t.speechLangUnavailable ||
        (lang === 'hi'
          ? 'इस भाषा के लिए वर्तमान में वॉइस रिकग्निशन समर्थित नहीं है। कृपया चैट बॉक्स में संदेश टाइप करें।'
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
    <div className="flex flex-col h-[78vh] sm:h-[82vh] bg-white dark:bg-[#111b21] rounded-2xl shadow-xl border border-gov-border dark:border-slate-800 overflow-hidden transition-colors">
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
                Active • Confidential
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
            aria-label={t.newChatAria || (lang === 'hi' ? 'नई चैट प्रारंभ करें' : 'Start Fresh Chat Session')}
            title={t.newChatAria || (lang === 'hi' ? 'नई चैट प्रारंभ करें' : 'Start Fresh Chat Session')}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-2.5 py-1.5 rounded-full transition-colors border border-white/20 focus:ring-2 focus:ring-white"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
            <span className="hidden sm:inline">{t.newChat || (lang === 'hi' ? 'नई चैट' : 'New Chat')}</span>
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

              {msg.toolCalled === 'emergency_call_tool' && (
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
                  <span className="text-[#53bdeb] text-[11px] font-bold" aria-label="Delivered">✓✓</span>
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

        <div ref={chatEndRef} />
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
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs focus:ring-2 focus:ring-[#008069] ${
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
            className="flex-1 bg-white dark:bg-[#2a3942] border border-slate-300 dark:border-slate-700 rounded-full px-5 py-2.5 text-xs sm:text-sm text-[#111B21] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#008069] shadow-xs transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            aria-label="Send message"
            disabled={!inputMessage.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-[#008069] hover:bg-[#075E54] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0 focus:ring-2 focus:ring-[#075E54]"
          >
            <Send className="w-4 h-4 ml-0.5" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 px-2 max-w-4xl mx-auto">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#008069] dark:text-emerald-400" aria-hidden="true" />
            AI Real-Time Trauma Triage • 256-bit Encrypted & Confidential
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
