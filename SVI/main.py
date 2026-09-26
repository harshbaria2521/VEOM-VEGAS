# Step 1: Setup FastAPI backend
import os
import socket
import threading
import uuid
from collections import OrderedDict
from typing import Optional

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.ai_agent import (
    SYSTEM_PROMPT,
    build_agent_messages,
    graph,
    parse_response,
)

app = FastAPI()

# Allow cross-origin requests from any frontend (Vercel, localhost, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Conversation memory
# ---------------------------------------------------------------------------
# Memory is isolated by a random session_id supplied by the Next.js proxy.
# It is intentionally bounded and in-memory; no conversation is shared
# between users and nothing is written to disk by this layer.
MAX_SESSIONS = 100
MAX_HISTORY_MESSAGES = 20  # 10 user/assistant turns
conversation_store = OrderedDict()
conversation_lock = threading.Lock()


def get_session_history(session_id: str):
    with conversation_lock:
        if session_id not in conversation_store:
            conversation_store[session_id] = []

        conversation_store.move_to_end(session_id, last=True)
        return list(conversation_store[session_id])


def save_session_turn(session_id: str, user_message: str, assistant_message: str):
    """Append one completed user/assistant turn and enforce memory limits."""
    with conversation_lock:
        history = conversation_store.setdefault(session_id, [])
        history.append({"role": "user", "content": user_message})
        history.append({"role": "assistant", "content": assistant_message})

        # Keep only the newest turns.
        if len(history) > MAX_HISTORY_MESSAGES:
            del history[:-MAX_HISTORY_MESSAGES]

        conversation_store.move_to_end(session_id, last=True)

        # Prevent an unbounded number of abandoned browser sessions.
        while len(conversation_store) > MAX_SESSIONS:
            conversation_store.popitem(last=False)


# Step 2: Receive and validate request from Frontend
class Query(BaseModel):
    message: str = Field(min_length=1)
    language: Optional[str] = "English"
    lang_code: Optional[str] = "en"
    native_name: Optional[str] = None
    session_id: Optional[str] = None


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Smart Victim Intelligence (SVI)",
        "message": "SVI API is running successfully",
    }


@app.post("/ask")
async def ask(query: Query):
    session_id = (query.session_id or "").strip() or str(uuid.uuid4())

    try:
        user_message = query.message.strip()
        lang_name = (query.language or "English").strip()
        lang_code = (query.lang_code or "en").strip().lower()
        native_name = (query.native_name or "").strip()

        # Build multilingual system instructions.
        if lang_code and lang_code != "en":
            target_lang = f"{lang_name} ({native_name})" if native_name else lang_name
            multilingual_rule = (
                "\n\n=======================================================\n"
                "CRITICAL MULTILINGUAL MANDATE:\n"
                f"1. The user has selected the language: {target_lang} (Language Code: '{lang_code}').\n"
                f"2. You MUST write your ENTIRE final response to the user in {target_lang}.\n"
                f"3. Use the authentic, standard native script of {lang_name} (for example: Devanagari script for Hindi/Marathi, Gujarati script for Gujarati, Tamil script for Tamil, Bengali script for Bengali, Gurmukhi for Punjabi, Telugu script for Telugu, Malayalam script for Malayalam, Kannada script for Kannada, etc.). Never respond in English when a regional language is specified.\n"
                f"4. Even if internal tools or context return English text, you MUST translate and synthesize all therapeutic advice, coping exercises, empathy, and steps into {target_lang}.\n"
                "5. Maintain all Indian emergency numbers clearly: 112, Tele-MANAS 14416 / 1-800-891-4416, and NHAA 14566.\n"
                "=======================================================\n"
            )
            enhanced_system_prompt = SYSTEM_PROMPT + multilingual_rule
        else:
            multilingual_rule = (
                "\n\nLANGUAGE ATTUNEMENT:\n"
                "- If the user communicates in Hindi, Marathi, Gujarati, or any Indian regional language, reply naturally in that same language and script.\n"
                "- If communicating in English, reply in warm, empathetic English.\n"
            )
            enhanced_system_prompt = SYSTEM_PROMPT + multilingual_rule

        # IMPORTANT: replay the previous user/assistant turns before the new
        # message. This is what gives Tara actual conversational memory.
        history = get_session_history(session_id)
        inputs = {
            "messages": build_agent_messages(
                enhanced_system_prompt,
                history,
                user_message,
                max_history_messages=MAX_HISTORY_MESSAGES,
            )
        }

        stream = graph.stream(
            inputs,
            stream_mode="updates",
            config={"recursion_limit": 6},
        )
        tool_called_name, final_response = parse_response(stream)

        if not final_response:
            if lang_code == "hi":
                final_response = (
                    "मैं आपकी सहायता के लिए यहाँ उपस्थित हूँ। यदि आप अत्यधिक तनाव या संकट में हैं, "
                    "तो कृपया सीधे 112 या टेली-मानस 14416 (1-800-891-4416) या 14566 पर कॉल करें।"
                )
            elif lang_code == "mr":
                final_response = (
                    "मी आपल्या मदतीसाठी येथे उपस्थित आहे. जर ही तातडीची परिस्थिती असेल तर कृपया "
                    "त्वरित 112 किंवा 14566 / 14416 वर संपर्क साधा."
                )
            elif lang_code == "gu":
                final_response = (
                    "હું આપની સહાય માટે અહીં ઉપસ્થિત છું. જો આપ મુશ્કેલીમાં હોવ, તો કૃપા કરીને તરત જ "
                    "112 અથવા 14566 / 14416 પર સંપર્ક કરો."
                )
            else:
                final_response = (
                    "I'm here with you, though I had trouble putting a reply together. "
                    "If this feels urgent, please call 112 or Tele-MANAS at 14416."
                )

        # Save only the completed conversational turn. Tool internals are not
        # stored, so the next turn sees a clean user <-> Tara conversation.
        save_session_turn(session_id, user_message, final_response)

        return {
            "response": final_response,
            "tool_called": tool_called_name,
            "session_id": session_id,
        }

    except Exception as e:
        print(f"[SVI] /ask failed: {e}")
        fallback_msg = (
            "I'm having trouble processing that right now. If you need help "
            "urgently, please call 112 or Tele-MANAS at 14416 directly."
        )
        if query.lang_code == "hi":
            fallback_msg = (
                "मुझे आपकी बात समझने में तकनीकी समस्या आ रही है। यदि आपको तुरंत सहायता चाहिए, "
                "तो कृपया 112 या राष्ट्रीय हेल्पलाइन 14566 / टेली-मानस 14416 पर कॉल करें।"
            )
        elif query.lang_code == "gu":
            fallback_msg = (
                "મને અત્યારે પ્રક્રિયા કરવામાં તકનીકી મુશ્કેલી આવી રહી છે. આપત્કાલીન સહાય માટે કૃપા કરીને "
                "112 અથવા 14566 પર સીધો સંપર્ક કરો."
            )
        elif query.lang_code == "mr":
            fallback_msg = (
                "मला सध्या उत्तर देण्यात तांत्रिक अडचण येत आहे. तातडीच्या मदतीसाठी कृपया 112 किंवा "
                "14566 वर संपर्क साधा."
            )
        return {
            "response": fallback_msg,
            "tool_called": "None",
            "session_id": session_id,
        }


def get_available_port(preferred_port: int) -> int:
    """Return the preferred port when free; otherwise choose an available one."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        try:
            sock.bind(("0.0.0.0", preferred_port))
            return preferred_port
        except OSError:
            sock.bind(("0.0.0.0", 0))
            free_port = sock.getsockname()[1]
            print(
                f"[SVI] Port {preferred_port} is busy. Falling back to port {free_port}."
            )
            return free_port


if __name__ == "__main__":
    port = get_available_port(int(os.environ.get("PORT", 8000)))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
