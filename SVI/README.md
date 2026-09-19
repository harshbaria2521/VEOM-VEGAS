# 🛡️ SVI (Smart Victim Intelligence) — SafeSpace AI

An AI-driven grievance redressal, trauma-informed assessment, and emergency escalation platform supporting the National Helpline Against Atrocities (NHAA 14566) initiative.

---

## 🌟 Features

- **Empathetic AI Conversational Agent:** Powered by LangChain, LangGraph, and Groq high-speed LLM inference (`openai/gpt-oss-120b`).
- **Emergency Helpline Escalation:** Automatic protocol escalation with Twilio telephony integration and 112 / Tele-MANAS (14416) safety recommendations.
- **Multilingual Support:** English, Hindi (हिंदी), Gujarati (ગુજરાતી), Marathi (मराठी), and more.
- **Nearby Support Service Discovery:** Live search for verified local NGOs, trauma counsellors, and legal aid cells via Tavily.
- **Counsellor Triage Dashboard:** Real-time queue, risk prioritization (Critical, High, Moderate, Low), audio signal analysis, and case claim audit trails.

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.9+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to SVI directory
cd SVI

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start backend server (Port 5500)
python3 -m uvicorn main:app --host 127.0.0.1 --port 5500 --reload
```

### 3. Frontend Setup
```bash
# In a new terminal, navigate to the frontend directory
cd SVI/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your TAVILY_API_KEY in .env.local

# Start Next.js development server (Port 3000)
npm run dev
```

### 4. Access the Applications
- **Victim Support Portal & Chat:** [http://localhost:3000](http://localhost:3000)
- **Counsellor Triage Dashboard:** [http://localhost:3000/counsellor](http://localhost:3000/counsellor)
- **FastAPI Interactive API Docs:** [http://127.0.0.1:5500/docs](http://127.0.0.1:5500/docs)
