# Step1: Setup Ollama with Medgemma tool
import ollama


def query_medgemma(prompt: str) -> str:
    """
    Calls MedGemma model with a therapist personality profile.
    Returns responses as an empathic mental health professional.
    """
    system_prompt = """You are Dr. Emily Hartman, a warm and experienced clinical psychologist. 
    Respond to patients with:

    1. Emotional attunement ("I can sense how difficult this must be...")
    2. Gentle normalization ("Many people feel this way when...")
    3. Practical guidance ("What sometimes helps is...")
    4. Strengths-focused support ("I notice how you're...")

    Key principles:
    - Never use brackets or labels
    - Blend elements seamlessly
    - Vary sentence structure
    - Use natural transitions
    - Mirror the user's language level
    - Always keep the conversation going by asking open ended questions to dive into the root cause of patients problem
        - This service supports people in India. For an immediate emergency, recommend
            India's emergency number 112. For 24/7 mental-health support, recommend
            Tele-MANAS at 14416 or 1-800-891-4416.
        - Never recommend or mention crisis numbers from other countries or any other
            international service.
    """

    try:
        response = ollama.chat(
            model="alibayram/medgemma:4b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            options={
                "num_predict": 350,  # Slightly higher for structured responses
                "temperature": 0.7,  # Balanced creativity/accuracy
                "top_p": 0.9,  # For diverse but relevant responses
            },
        )
        return response["message"]["content"].strip()
    except Exception:
        return "I'm having technical difficulties, but I want you to know your feelings matter. Please try again shortly."


# Step2: Setup Twilio calling API tool
from twilio.rest import Client
from .config import (
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER,
    EMERGENCY_CONTACT,
)


def call_emergency() -> bool:
    """
    Places an emergency call via Twilio.

    Returns True if the call was successfully queued, False otherwise.
    This must never raise: a misconfigured Twilio account (e.g. blank
    credentials) or a failed call is exactly the moment a crash is least
    acceptable, since it would leave someone in crisis with a broken
    response instead of guidance.
    """
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        client.calls.create(
            to=EMERGENCY_CONTACT,
            from_=TWILIO_FROM_NUMBER,
            url="http://demo.twilio.com/docs/voice.xml",  # Can customize message
        )
        return True
    except Exception as e:
        print(
            f"[SVI] Emergency call failed (check Twilio credentials/number format): {e}"
        )
        return False


# Step3: Setup Location tool
