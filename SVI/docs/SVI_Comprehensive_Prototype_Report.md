# Comprehensive Prototype & Future Scope Report
**Smart Victim Intelligence (SVI)**

**Team:** Veom Vegas | **PS ID:** SIH26093
**Prepared For:** Smart India Hackathon (SIH) Mentors & Jury
**Domain:** MedTech / BioTech / HealthTech (Software)
**Ministry:** Ministry of Social Justice & Empowerment | NHAA 14566

---

## 1. Executive Summary
**Smart Victim Intelligence (SVI)** is an AI-enabled, real-time stress and trauma support platform designed for victims and complainants accessing the National Helpline Against Atrocities (14566) in India. 

The platform operates as a triage system that assesses conversational signals to generate non-diagnostic stress/trauma risk scores. It intelligently prioritizes cases for human counselors, offers multilingual guidance, performs nearby-support discovery, and includes an emergency escalation protocol. The system ensures privacy through a consent-driven, DPDP-compliant architecture.

---

## 2. Technical Architecture & Stack
The prototype utilizes a modular, API-driven architecture dividing the client interface from the heavy AI processing workload.

### 2.1 Core Stack
*   **Frontend:** Next.js (App Router), React 18, Tailwind CSS, Lucide React
*   **Backend:** FastAPI (Python), Uvicorn
*   **AI & Orchestration:** LangGraph, LangChain, Groq API (gpt-oss-120b)
*   **Search & Telephony:** Tavily Search API (Nearby Support), Twilio SDK (Emergency Escalation)

### 2.2 System Flow
1. **User Interface:** Victim interacts with the Next.js portal (Chat UI/Voice).
2. **API Layer:** Next.js `/api/ask` route securely forwards requests to the FastAPI backend.
3. **AI Assessment:** The LangGraph agent analyzes the conversational context, extracting distress indicators and generating a risk priority score (Low/Moderate/High/Critical).
4. **Action Routing:** The backend returns an AI Suggested Pathway. If critical, it can trigger the Twilio tool for emergency intervention.
5. **Counsellor Triage:** The Counselor portal updates its live queue, pushing high-risk cases to the top for immediate human review.

---

## 3. Core Features Implemented in the Prototype

### 3.1 Victim Chat Portal (Front-facing)
*   **WhatsApp-Style Chat UI:** Familiar and accessible interface with typing indicators and graceful server fallbacks.
*   **Bilingual Text & Voice Input:** Users can communicate in English (en-IN) or Hindi (hi-IN) using the browser's native Web Speech API.
*   **Crisis Ribbon & Alerts:** Direct tap-to-call integrations for 112 (Emergency) and 14566 (NHAA).
*   **Nearby Support Lookup:** Integrated Tavily Search to dynamically find local support resources for the victim.

### 3.2 Counsellor Portal (Triage & Management)
*   **Real-Time Priority Queue:** Cases are sorted by the AI-generated risk score. Includes 5-category filters (Risk Level, Channel, Language, Time Range, Status).
*   **Audio Alerts:** Critical cases trigger an audio alert beep (with a user toggle) to ensure immediate attention.
*   **Case Detail & AI Insights:** Displays AI-detected contributing indicators (stress, anxiety) and acoustic emotion indicators (simulated in prototype) if voice consent is provided.
*   **Human Override & Audit:** Counselors can override AI suggestions, but the system mandates written justification, creating a secure officer audit trail.
*   **Printable Summaries:** Native browser printing with CSS `@media print` rules to instantly generate official PDF case reports minus the UI clutter.

### 3.3 Privacy, Consent & Admin
*   **DPDP Consent Modal:** Mandatory first-visit consent gate controlling data processing and voice analysis permissions.
*   **Admin Dashboard:** KPI cards tracking total cases, high-risk percentages, and resolution rates with visual analytics and anonymized CSV exports.
*   **Accessibility (a11y):** WAI-ARIA labels, keyboard navigation, and `prefers-reduced-motion` compliance to align with GIGW and WCAG standards.

---

## 4. Current Gap Analysis (Prototype Limitations)
To set clear expectations for the current hackathon deliverable, the following components are currently simulated or limited in the prototype:
*   **Acoustic Analysis:** Vocal Tremor, Pitch Stability, and Speech Cadence indicators are currently mock variables in the UI rather than extracted from live audio.
*   **Database Persistence:** The prototype utilizes an in-memory `caseStore` and mock data. Refreshing the server resets the queue.
*   **Authentication:** The 3-way login (Victim/Counsellor/Admin) relies on frontend context and localStorage rather than secure JWT backend sessions.
*   **Speech-to-Text (STT):** Relies solely on the client-side browser Web Speech API rather than a robust server-side STT pipeline.

---

## 5. Future Scope & Scalability Roadmap
Moving from the SIH prototype to a production-grade national deployment requires transitioning into deep multimodal AI, omnichannel accessibility, and enterprise security.

### 5.1 Advanced AI & Multimodal Intelligence
*   **Multimodal AI Fusion Pipeline:** We will build a weighted ensemble risk scorer that combines:
    *   **Text & Semantic Analysis:** Fine-tuned NLP models (e.g., IndicBERT, MuRIL) to detect distress, fear, and emotional overload instead of relying purely on LLMs.
    *   **Real-time Acoustic Analysis:** Server-side extraction of prosodic features (vocal tremor, speech cadence, and pitch stability) using libraries like `librosa`.
    *   **Visual Modality (Future):** Optional computer vision integration (OpenCV) for analyzing visual indicators in video counseling sessions, subject to strict consent.
*   **Model Fairness & Bias Mitigation:** Establishing a continuous evaluation pipeline to ensure demographic parity across diverse Indian populations.

### 5.2 Omnichannel Deployment & IVRS Integration
*   **IVRS (Interactive Voice Response System):** Deep integration with Twilio Programmable Voice to bridge standard phone calls directly to the AI backend. Caller audio will be converted via STT, assessed by the AI, and routed to a human counselor based on risk priority.
*   **Progressive Web App (PWA) / Mobile:** Evolving the Next.js web portal into an installable PWA or React Native mobile application for offline capabilities.
*   **Government Portal Integration:** API-level integration with the MoSJE Integrated Portal for seamless case lifecycle management.

### 5.3 Pan-India Multilingual Support
*   **Bhashini Deep Integration:** Transitioning to server-side STT pipelines powered by **Bhashini** or **OpenAI Whisper** to natively support the 22 scheduled Indian languages.
*   **Automatic Language Detection:** Implementing AI-driven dialect recognition to instantly adapt the UI and conversational models without manual intervention.

### 5.4 Enterprise-Grade Security & DPDP Compliance
*   **Persistent & Secure Database:** Migrating to a robust **PostgreSQL** database (e.g., AWS RDS) with strictly defined schemas for users, cases, transcripts, and audit logs.
*   **Robust Authentication (RBAC):** Implementing JWT-based authentication and strict Role-Based Access Control (RBAC) across all FastAPI endpoints.
*   **Data Encryption & Minimization:** Enforcing strict at-rest encryption for all PII and transcripts, and automated data retention policies that purge sensitive data once a case is resolved.

### 5.5 Cloud Infrastructure
*   **Containerization & Orchestration:** Dockerizing the frontend and backend for consistent deployments, with future scaling via Kubernetes (K8s).
*   **Government Cloud Hosting:** Preparing the architecture for deployment on **AWS GovCloud** or **NIC (National Informatics Centre)** infrastructure to meet data sovereignty requirements.

---
**Conclusion**
The SVI prototype proves the technical feasibility of AI-driven triage for crisis support. Our future roadmap guarantees the transformation of this prototype into a highly scalable, secure, multimodal, and multilingual platform capable of operating on a national scale.
