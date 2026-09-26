# Smart Victim Intelligence (SVI)

AI-enabled real-time stress and trauma support platform for victims and complainants in India.

SVI combines a Next.js support portal with a FastAPI + LangGraph backend, Groq-powered conversational intelligence, multilingual guidance, consent-aware intake, nearby-support discovery, and optional Twilio emergency escalation.

> **Safety note:** SVI is a support and triage system, not a replacement for emergency services or qualified mental-health professionals. In an immediate emergency in India, call **112**. Tele-MANAS: **14416 / 1-800-891-4416**. National Helpline Against Atrocities: **14566**.

## Architecture

```text
User
  │
  ▼
Next.js Frontend
  │
  ├── /api/ask ───────────────┐
  └── /api/nearby-support     │
                              ▼
                        FastAPI Backend
                              │
                              ▼
                         LangGraph Agent
                              │
                         ┌────┴────┐
                         ▼         ▼
                       Groq      Safety Tools
                                  ├─ Twilio
                                  └─ Support Resources
```

## Project Structure

```text
SVI/
├── backend/
│   ├── __init__.py
│   ├── ai_agent.py
│   ├── config.py
│   └── tools.py
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ask/route.js
│   │   │   └── nearby-support/route.js
│   │   ├── admin/
│   │   ├── consent/
│   │   ├── counsellor/
│   │   ├── login/
│   │   ├── profile/
│   │   ├── track/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── .env.example
│   ├── next.config.js
│   ├── package.json
│   └── package-lock.json
├── docs/
├── .env.example
├── .gitignore
├── main.py
├── pyproject.toml
├── requirements.txt
└── README.md
```

The legacy root `frontend.py` Streamlit application is intentionally removed. The production frontend is the `frontend/` Next.js application.

## Local Development

### 1. Backend

From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create `.env` from `.env.example` and add your credentials.

Start FastAPI:

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Verify:

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

### 2. Frontend

Open a second terminal:

```powershell
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
TAVILY_API_KEY=your_tavily_api_key_here
```

Start Next.js:

```powershell
npm run dev
```

Open `http://localhost:3000`.

The browser talks to the Next.js `/api/ask` route. That server-side route forwards the request to FastAPI, so the browser does not need to call the backend directly.

## Production Deployment

### Backend — Render

Use the repository root as the service root.

Build command:

```text
pip install -r requirements.txt
```

Start command:

```text
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set these Render environment variables:

```text
GROQ_API_KEY
GROQ_MODEL
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_FROM_NUMBER
EMERGENCY_CONTACT
```

### Frontend — Render / Vercel

Set the frontend service root directory to:

```text
frontend
```

Build command:

```text
npm run build
```

Start command:

```text
npm start
```

Set:

```text
NEXT_PUBLIC_API_BASE_URL=https://YOUR-BACKEND-SERVICE.onrender.com
```

If nearby-support live search is enabled, also set:

```text
TAVILY_API_KEY=your_tavily_api_key
```

## API

### Health Check

```http
GET /
```

### AI Support

```http
POST /ask
Content-Type: application/json
```

Example:

```json
{
  "message": "I am stressed",
  "language": "English",
  "lang_code": "en",
  "native_name": "English"
}
```

Example response:

```json
{
  "response": "...",
  "tool_called": "None"
}
```

## Security

- Never commit `.env` files or API keys.
- Keep production credentials in Render/Vercel environment variables.
- Do not cache chat or sensitive API responses in the service worker.
- Emergency automation must never replace the instruction to call 112 directly.
- Validate and review any third-party search results before treating them as authoritative.

## Important Implementation Note

The backend uses Groq for the deployed conversational model. Ollama/MedGemma is not required for the Render deployment.

## Documentation

The `docs/` directory contains the SIH presentation material, technical architecture, roadmap, judge/viva preparation, and supporting project documents.
