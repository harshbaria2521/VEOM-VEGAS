from __future__ import annotations

from typing import Optional

from langchain_groq import ChatGroq
from pydantic import SecretStr
from twilio.rest import Client

from .config import (
    EMERGENCY_CONTACT,
    GROQ_API_KEY,
    GROQ_MODEL,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER,
)

MENTAL_HEALTH_SYSTEM_PROMPT = """
You are SVI, a warm and empathetic mental-health support assistant for people
in India.

Your role is to listen, support, and help the user take a sensible next step.
You are not a replacement for a licensed mental-health professional and must
not diagnose medical or psychiatric conditions.

Communication style:
- Be warm, calm, respectful, and human.
- Acknowledge the user's feelings before giving advice.
- Use simple, natural language.
- Do not sound robotic, repetitive, or overly formal.
- Do not claim to be a real doctor or psychologist.
- Do not use fake professional credentials or a fictional clinician name.
- Give practical suggestions when appropriate.
- Ask one relevant open-ended follow-up question when useful.
- Match the user's language and level of detail where possible.
- Keep ordinary responses concise and useful.

Safety:
- This service supports people in India.
- If the user appears to be in immediate danger, is currently attempting
  self-harm, expresses suicidal intent, or says they may act on self-harm
  thoughts, clearly encourage them to call India's emergency number 112 now.
- For 24/7 mental-health support in India, mention Tele-MANAS at 14416 or
  1-800-891-4416 when appropriate.
- Encourage the person to stay with a trusted person and move away from
  anything they could use to hurt themselves when there is immediate risk.
- Never provide instructions for self-harm or suicide.
- Never mention crisis numbers from other countries.
"""


def _create_groq_client() -> Optional[ChatGroq]:
    """Create the Groq model when the API key is configured."""
    if not GROQ_API_KEY or GROQ_API_KEY.startswith("your_"):
        print("[SVI] GROQ_API_KEY is missing.")
        return None

    try:
        return ChatGroq(
            model=GROQ_MODEL,
            temperature=0.7,
            api_key=SecretStr(GROQ_API_KEY),
        )
    except Exception as exc:
        print(f"[SVI] Failed to initialize Groq: {exc}")
        return None


def query_medgemma(prompt: str) -> str:

    prompt = (prompt or "").strip()

    if not prompt:
        return (
            "I'm here with you. Tell me a little about what has " "been on your mind."
        )

    llm = _create_groq_client()

    if llm is None:
        return (
            "I'm having trouble connecting to my support service right now. "
            "Please try again shortly. If you are in immediate danger, "
            "call 112 or Tele-MANAS at 14416."
        )

    try:
        response = llm.invoke(
            [
                ("system", MENTAL_HEALTH_SYSTEM_PROMPT),
                ("human", prompt),
            ]
        )

        content = getattr(response, "content", "")

        if isinstance(content, list):
            parts = []
            for item in content:
                if isinstance(item, dict):
                    text = item.get("text")
                    if text:
                        parts.append(str(text))
                elif item:
                    parts.append(str(item))
            content = " ".join(parts)

        content = str(content).strip()

        if content:
            return content

        return (
            "I'm here with you, but I couldn't generate a response just now. "
            "Please tell me again what you're going through."
        )

    except Exception as exc:
        print(f"[SVI] Groq mental-health response failed: {exc}")
        return (
            "I'm having trouble processing that right now. "
            "Please try again in a moment. If you are in immediate danger, "
            "call 112 or Tele-MANAS at 14416."
        )


def call_emergency() -> bool:

    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print("[SVI] Twilio credentials are not configured.")
        return False

    if not TWILIO_FROM_NUMBER:
        print("[SVI] TWILIO_FROM_NUMBER is not configured.")
        return False

    if not EMERGENCY_CONTACT:
        print("[SVI] EMERGENCY_CONTACT is not configured.")
        return False

    try:
        client = Client(
            TWILIO_ACCOUNT_SID,
            TWILIO_AUTH_TOKEN,
        )

        call = client.calls.create(
            to=EMERGENCY_CONTACT,
            from_=TWILIO_FROM_NUMBER,
            url="http://demo.twilio.com/docs/voice.xml",
        )

        print(f"[SVI] Emergency call queued successfully: {call.sid}")
        return True

    except Exception as exc:
        print("[SVI] Emergency call failed. " f"Check Twilio configuration: {exc}")
        return False


def find_nearby_therapists(location: str) -> str:

    location = (location or "India").strip()

    return (
        f"For professional mental-health support in or near {location}, "
        "consider contacting a licensed mental-health professional.\n\n"
        "For 24/7 mental-health support in India, you can contact "
        "Tele-MANAS at 14416 or 1-800-891-4416.\n\n"
        "If you are in immediate danger, please call 112."
    )
