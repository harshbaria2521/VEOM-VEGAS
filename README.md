# VEOM VEGAS — Smart Victim Intelligence (SVI)

Flagship mental health grievance redressal, trauma-informed assessment, and emergency escalation intelligence system developed for the **National Helpline Against Atrocities (NHAA 14566)** initiative.

---

## 📂 Repository Structure

```
.
├── SVI/
│   ├── backend/             # FastAPI backend, LangGraph ReAct agent & tools
│   │   ├── ai_agent.py      # Groq AI agent with crisis detection & routing
│   │   ├── config.py        # Configuration & environment variable validation
│   │   └── tools.py         # Emergency calling (Twilio), MedGemma, location tools
│   ├── frontend/            # Next.js 16 (App Router) + TailwindCSS
│   │   ├── app/             # Pages: Chat portal, Counsellor dashboard, Admin, Consent
│   │   ├── components/      # ChatWidget, CaseQueueTable, NearbySupportModal, etc.
│   │   └── lib/             # API client, case store, translations, mock data
│   ├── pdfs/                # Project documentation, architecture & gap analysis reports
│   ├── main.py              # FastAPI application server entry point
│   ├── requirements.txt     # Python backend dependencies
│   └── README.md            # Detailed setup instructions
└── README.md                # Project overview
```

---

## 🚀 Quick Launch

### Backend
```bash
cd SVI
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 -m uvicorn main:app --host 127.0.0.1 --port 5500 --reload
```

### Frontend
```bash
cd SVI/frontend
npm install
npm run dev
```

Visit **http://localhost:3000** in your browser.
