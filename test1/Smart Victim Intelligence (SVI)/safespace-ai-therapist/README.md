AI Mental Health Therapist – SafeSpace

Your compassionate AI companion for emotional support, built with care and real-world tools. SafeSpace listens, understands, and responds with empathy — and knows when to escalate to emergency help.

Equipped with an AI agent architecture, specialist healthcare models (MedGemma), and life-saving tools like emergency calling via Twilio, SafeSpace is designed to support mental well-being — safely and responsibly.

▶️ Watch the Setup Video 🎥 How to Build SafeSpace – Full Tutorial:

🚀 Quick Start

Clone the repo and run:

```
git clone https://github.com/AIwithhassan/safespace-ai-therapist.git
```

# Setup UV if not already:

https://www.youtube.com/watch?v=Dgf7Lp0B_hI

```
uv sync
```

Start the backend in one terminal:

```powershell
uv run uvicorn main:app --host 127.0.0.1 --port 8000
```

Start the Streamlit frontend in a second terminal:

```powershell
uv run streamlit run frontend.py
```

That’s it. This command:

Creates a virtual environment (if needed)
Installs all dependencies from uv.lock
Sets up the full environment exactly as intended
