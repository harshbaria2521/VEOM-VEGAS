# NHAA SVI — Problem Statement Alignment Report

## Overall Verdict: ✅ Strongly Aligned (with gaps to address)

Your project covers the **core intent** of the problem statement very well. Below is a requirement-by-requirement breakdown.

---

## ✅ Requirements You Fully Meet

| Requirement | Evidence in Your Project |
|---|---|
| **AI-enabled support via Chatbot** | `ChatWidget.js` — full conversational AI via LangGraph ReAct agent (Groq LLM) |
| **Web Portal / Integrated Portal interface** | Next.js NHAA frontend at port 3001, mimicking the official NHAA portal design |
| **NLP-based Trauma & Distress Detection** | `ask_mental_health_specialist` tool → MedGemma (medical LLM via Ollama) |
| **Suicidal ideation detection & emergency escalation** | `emergency_call_tool` (Twilio) auto-triggered when AI detects imminent self-harm |
| **Automatic recommendation: counselling, emergency support** | `find_nearby_therapists_by_location`, Twilio emergency call, 112/14566 hotlinks |
| **Multilingual interactions (major Indian languages)** | `translations.js` (183 KB!), `LanguageSwitcher.js`, multilingual mandate in API, speech recognition per language |
| **Privacy, informed consent, DPDP Act compliance** | `ConsentModal.js` — explicit text + voice consent, "DPDP Act 2023", AES-256 encryption mention |
| **Victim-centric grievance redressal** | Quick-action cards linking to NHAA portal, grievance registration/tracking |
| **Risk Categorization (Low / Moderate / High / Critical)** | `mockData.js` — all 4 levels implemented with riskScore (0–100), indicators, recommended pathways |
| **Stress Vulnerability Index (SVI) on predefined scale** | `riskScore` field (0–100 scale), used across case data, analytics dashboard |
| **Counsellor / Admin Dashboard** | `/counsellor/page.js`, `/admin/page.js` with `CaseQueueTable.js`, `AnalyticsCharts.js` |
| **IVRS channel support** | Cases show `channel: "IVRS Voice"` with vocal signal data (tremorScore, pitchVariation) |
| **Vocal signals / speech pattern data** | `vocalSignals` in mockData: tremorScore, pitchVariation, speechRate per case |
| **Audit trail** | `auditTrail` array per case with timestamped actions |
| **Social isolation, fear, depression indicators** | Indicator objects: `"Social Isolation"`, `"Fear of Imminent Harm"`, `"Depressive Affect"` |
| **PoA / PCR Act legal tagging** | `violationTags` on every case (e.g. `"PoA Act Sec 3(1)(r)"`, `"PCR Act Sec 7"`) |
| **NHAA 14566 integration** | Prominently placed throughout, tel: links, emergency banners |
| **Stakeholder dashboards** | Counsellor view, admin/supervisor view with analytics |
| **Nearby support / NGO finder** | `NearbySupportModal.js`, Docvita integration |

---

## ⚠️ Partially Implemented (Presentable but needs strengthening)

| Requirement | Current State | What's Missing |
|---|---|---|
| **Speech Analytics / Voice Emotion AI** | Voice input via Web Speech API (STT only), vocal signals shown in mock data | No real-time audio analysis library (e.g. pitch detection, tremor scoring) — it's simulated in mock data |
| **Real-time SVI score generation** | Score shown in dashboard from mock data | No live SVI calculation engine that generates score from live chat input in real time |
| **Emotion AI** | MedGemma gives empathetic responses and can infer emotional state | No explicit emotion classification (e.g. fear%, sadness%, anger% returned as structured data) |
| **Mobile Application interface** | Responsive web design works on mobile | No dedicated mobile app / PWA manifest 📱 SVI — MOBILE APPLICATION INTERFACE / PWA UPGRADE

🎯 OBJECTIVE

Upgrade the existing SVI (Smart Victim Intelligence) frontend so that it provides a proper mobile-application-like experience and can be installed as a PWA (Progressive Web App).

CURRENT STATE

* Responsive web design already works on mobile.
* There is currently no dedicated mobile application interface.
* There is no proper PWA manifest/install experience.

TARGET STATE

Convert the existing frontend into a mobile-first, installable PWA experience while keeping the existing backend, APIs, database, authentication, business logic, and existing functionality completely unchanged.

⸻

🚨 STRICT DEVELOPMENT DIRECTIVE

BACKEND MUST NOT BE CHANGED

DO NOT modify:

* Backend code
* Backend APIs
* API endpoints
* API request/response structures
* Database
* Database schema
* Authentication logic
* Authorization logic
* Server-side business logic
* Existing backend configuration
* Existing AI/NLP processing
* Existing integrations
* Existing environment variables related to backend
* Existing API contracts

This task is FRONTEND + PWA ONLY.

⸻

⚠️ DO NOT BREAK EXISTING FUNCTIONALITY

Follow an ADDITIVE-ONLY approach.

DO NOT:

* Rewrite the existing application
* Refactor working components unnecessarily
* Remove existing features
* Change existing workflows
* Change API calls
* Change existing page functionality
* Replace working components without a reason
* Remove desktop responsiveness
* Change the backend architecture

If an existing component already works correctly, preserve it.

⸻

📱 1. MOBILE-FIRST APPLICATION EXPERIENCE

Improve the frontend so that on mobile devices it feels like a real application rather than simply a responsive website.

Implement:

* Mobile-first layouts
* Proper mobile navigation
* Touch-friendly buttons
* Larger tap targets
* Mobile-friendly forms
* Mobile-friendly cards
* Proper spacing for small screens
* Bottom navigation where appropriate
* Sticky mobile header where useful
* Mobile-friendly modal/dialog layouts
* Mobile-friendly dropdowns
* Mobile-friendly tables/data presentation
* Smooth scrolling
* Proper viewport handling
* Safe-area support for devices with notches/home indicators

Do NOT remove the existing desktop UI.

The application must continue to work properly on:

* Mobile phones
* Tablets
* Laptops
* Desktop monitors

⸻

🧭 2. MOBILE NAVIGATION

Create a clean mobile application navigation system.

On small screens:

* Use a compact top header.
* Add an appropriate hamburger/menu system OR bottom navigation depending on the existing application structure.
* Keep the most important SVI functions easily accessible.
* Preserve all existing routes.
* Do not change route names unless absolutely necessary.

Navigation must be:

* Fast
* Touch-friendly
* Accessible
* Visually consistent with the existing SVI design

⸻

📲 3. PWA MANIFEST

Add a proper PWA manifest.

Create/configure the appropriate:

manifest.webmanifest

or equivalent configuration supported by the existing framework.

Include:

* Application name: Smart Victim Intelligence
* Short name: SVI
* Appropriate description
* Start URL
* Display mode: standalone
* Appropriate theme color
* Background color
* Portrait orientation where appropriate
* Proper application icons

Use the existing SVI branding where available.

DO NOT invent a completely different brand identity.

⸻

🖼️ 4. PWA ICONS

Add proper application icons for installation.

Provide appropriate sizes such as:

* 192x192
* 512x512

If the project already contains a logo, reuse it.

Do not unnecessarily replace the existing logo.

Ensure icons are referenced correctly from the manifest.

⸻

⚙️ 5. SERVICE WORKER / OFFLINE CAPABILITY

Add a service worker only if it is compatible with the existing frontend architecture.

The service worker must NOT interfere with API functionality.

IMPORTANT:

Do NOT cache sensitive victim/user information.

Do NOT cache:

* Authentication tokens
* Personal information
* Sensitive victim information
* AI assessment results containing sensitive data
* Private API responses

If offline support is implemented, restrict caching to safe static frontend assets such as:

* CSS
* JavaScript bundles
* Fonts
* Images
* Static application shell

API/network requests should continue using the existing backend normally.

⸻

📶 6. INSTALLABLE PWA EXPERIENCE

Make the application installable from supported browsers.

The PWA should support:

* Add to Home Screen
* Standalone launch
* Proper app icon
* Proper splash/loading experience where supported
* Application-like window behavior

Do not create a fake installation system.

Use standard browser/PWA mechanisms.

⸻

📐 7. RESPONSIVE BREAKPOINTS

Test and optimize the UI for at least:

Mobile

* 320px
* 375px
* 390px
* 414px
* 430px

Tablet

* 768px
* 820px
* 1024px

Desktop

* 1280px
* 1440px
* 1920px

No horizontal overflow should occur.

⸻

👆 8. TOUCH EXPERIENCE

Optimize interactive elements for touch.

Ensure:

* Buttons are comfortably tappable.
* Links are not too close together.
* Inputs are easy to select.
* Dropdowns work properly on mobile.
* Modals fit within the viewport.
* Keyboard opening does not break the layout.
* Forms remain usable when the mobile keyboard is visible.

Avoid hover-only interactions on mobile.

⸻

🎨 9. PRESERVE EXISTING SVI DESIGN

Do not redesign the entire application.

Preserve:

* Existing colors
* Existing typography
* Existing branding
* Existing components
* Existing visual hierarchy
* Existing dark/light mode
* Existing pages
* Existing functionality

Only make improvements required to provide a polished mobile/PWA experience.

⸻

🔐 10. SECURITY REQUIREMENTS

Because SVI handles potentially sensitive information:

DO NOT:

* Store sensitive user/victim information in localStorage unnecessarily.
* Store authentication credentials in the service worker cache.
* Cache private API responses.
* Persist sensitive assessment information offline.
* Expose API keys in frontend code.
* Modify existing authentication/security mechanisms.

Keep all sensitive processing through the existing backend.

⸻

🚀 11. PERFORMANCE

Optimize the mobile experience without changing backend behavior.

Focus on:

* Fast initial loading
* Lazy loading where appropriate
* Optimized images
* Reduced unnecessary JavaScript
* Efficient rendering
* Avoiding layout shifts
* Mobile-friendly animations

Do not introduce unnecessary libraries.

Prefer the project’s existing dependencies and framework.

⸻

♿ 12. ACCESSIBILITY

Improve mobile accessibility:

* Proper semantic HTML
* Accessible buttons
* Accessible form labels
* Keyboard navigation
* Visible focus states
* Sufficient contrast
* ARIA labels where required
* Screen-reader-friendly navigation

Do not sacrifice accessibility for visual effects.

⸻

🧪 13. TESTING REQUIREMENTS

After implementation, verify:

Desktop

* Existing pages still work.
* Existing navigation still works.
* Existing API communication still works.
* Existing authentication still works.
* Existing UI functionality remains intact.

Mobile

* No horizontal scrolling.
* Navigation works.
* Forms work.
* Modals work.
* Buttons are tappable.
* Text does not overflow.
* Cards resize correctly.
* Tables remain usable.
* Dark/light mode works.

PWA

Verify:

* Manifest loads correctly.
* Icons load correctly.
* Start URL works.
* Standalone display works.
* PWA can be installed where supported.
* Service worker does not break API requests.

⸻

📂 IMPLEMENTATION RULE

Before making changes:

1. Inspect the existing frontend architecture.
2. Identify the framework and routing system.
3. Identify the current public/static asset directory.
4. Identify the existing global layout/navigation.
5. Identify whether a manifest/service worker already exists.
6. Reuse existing components wherever possible.

Then implement the minimum necessary changes.

⸻

🚫 ABSOLUTELY DO NOT

* Change backend code.
* Change database.
* Change API endpoints.
* Change API payloads.
* Change authentication.
* Remove existing functionality.
* Rewrite the frontend architecture.
* Replace the current UI unnecessarily.
* Add unnecessary dependencies.
* Break desktop responsiveness.
* Store sensitive victim data offline.
* Cache private API responses.

⸻

✅ FINAL DELIVERABLE

The final SVI application should behave like:

Existing SVI Web Application
+
Mobile-first responsive UI
+
Installable PWA
+
Application-like mobile navigation
+
Proper PWA icons/manifest
+
Safe static asset caching where appropriate

while maintaining:

100% existing backend functionality and API compatibility.

Before finishing, inspect the changes and fix any errors, broken imports, routing issues, responsive issues, manifest issues, or build errors introduced by this implementation.

Do not stop at creating the manifest alone. Complete the mobile/PWA frontend experience.|
| **IVRS telephony integration** | Cases from IVRS channel shown in data | No actual IVRS backend integration (would need Twilio IVR or similar) |

---

## ❌ Gaps (Not yet implemented)

| Requirement | Gap |
|---|---|
| **Real-time Speech Pitch / Tremor analysis** | Voice input is captured (Web Speech API), but waveform analysis for distress detection is not implemented |
| **Witness protection recommendation** | Not mentioned as an auto-recommendation in current flows |
| **Medical assistance routing** | Emergency call (112) is present, but no specific medical aid pathway (e.g. district hospital, AIIMS referral) |
| **Police intervention routing** | No specific police referral flow beyond "call 112" |
| **Suicidal ideation structured flag** | Detected by LLM context, but no explicit structured `suicidalIdeation: true/false` flag in the case object |

---

## 🏆 Standout Strengths

1. **Full-stack cohesion** — FastAPI backend + LangGraph agent + Next.js frontend working together
2. **Real emergency escalation** — Twilio integration for live emergency calls is production-worthy
3. **Genuine multilingual support** — 183 KB translations file indicates deep Indian language coverage
4. **Counsellor workflow** — Case queue, claim/assign, risk filter, audit trail — exactly what counsellors need
5. **Consent architecture** — Separate text vs. voice consent with DPDP Act reference is legally sound
6. **Gov portal design** — NHAA branding, Ashoka Emblem palette, saffron/navy/green Indian flag colors

---

## 📋 Recommended Additions Before Presentation

> [!IMPORTANT]
> These additions would make your project a **complete end-to-end solution** matching 100% of the problem statement.

1. **Add a live SVI score widget in ChatWidget** — Show a simple 0–100 score that updates as AI responds (can be extracted from the LLM's response or computed via keyword sentiment scoring)
2. **Add speech distress indicators** — When voice input is used, display pitch/speed estimate (even a simple browser-based approximation via Web Audio API)
3. **Add structured recommendation tags** — After each AI response, display pill badges like `🏥 Medical Aid` | `⚖️ Legal Aid` | `🛡️ Police Referral` | `🧠 Counselling` based on keywords detected
4. **Add a "Witness Protection" recommendation** — Simple rule: if violationTags include violent PoA sections, show witness protection recommendation
5. **Add PWA manifest** — Makes it installable as a mobile app (`manifest.json`, service worker)

---

## Summary

```
Problem Statement Coverage:
████████████████████░░  ~85% covered

Core AI + NLP + Chatbot:        ✅ Done
SVI Score + Risk Categories:    ✅ Done (mock data) | ⚠️ Live scoring partial
Multilingual:                   ✅ Done
Emergency Escalation:           ✅ Done (Twilio)
Consent & Privacy:              ✅ Done
Voice/Speech Analytics:         ⚠️ Partial (no live pitch analysis)
Emotion AI structured output:   ⚠️ Partial
Mobile App:                     ⚠️ Responsive web, no native/PWA
Witness Protection:             ❌ Missing
Medical / Police pathways:      ⚠️ Basic only
```
