# Step1: Setup FastAPI backend
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from backend.ai_agent import graph, SYSTEM_PROMPT, parse_response

app = FastAPI()

# Allow cross-origin requests from any frontend (Vercel, localhost, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from typing import Optional


# Step2: Receive and validate request from Frontend
class Query(BaseModel):
    message: str
    language: Optional[str] = "English"
    lang_code: Optional[str] = "en"
    native_name: Optional[str] = None


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Smart Victim Intelligence (SVI)",
        "message": "SVI API is running successfully",
    }


@app.post("/ask")
async def ask(query: Query):
    try:
        lang_name = (query.language or "English").strip()
        lang_code = (query.lang_code or "en").strip().lower()
        native_name = (query.native_name or "").strip()

        # Build multilingual system instructions
        if lang_code and lang_code != "en":
            target_lang = f"{lang_name} ({native_name})" if native_name else lang_name
            multilingual_rule = (
                f"\n\n=======================================================\n"
                f"CRITICAL MULTILINGUAL MANDATE:\n"
                f"1. The user has selected the language: {target_lang} (Language Code: '{lang_code}').\n"
                f"2. You MUST write your ENTIRE final response to the user in {target_lang}.\n"
                f"3. Use the authentic, standard native script of {lang_name} (for example: Devanagari script for Hindi/Marathi, Gujarati script for Gujarati, Tamil script for Tamil, Bengali script for Bengali, Gurmukhi for Punjabi, Telugu script for Telugu, Malayalam script for Malayalam, Kannada script for Kannada, etc.). Never respond in English when a regional language is specified.\n"
                f"4. Even if internal tools or context return English text, you MUST translate and synthesize all therapeutic advice, coping exercises, empathy, and steps into {target_lang}.\n"
                f"5. Maintain all Indian emergency numbers clearly: 112, Tele-MANAS 14416 / 1-800-891-4416, and NHAA 14566.\n"
                f"=======================================================\n"
            )
            enhanced_system_prompt = SYSTEM_PROMPT + multilingual_rule
        else:
            multilingual_rule = (
                f"\n\nLANGUAGE ATTUNEMENT:\n"
                f"- If the user communicates in Hindi, Marathi, Gujarati, or any Indian regional language, reply naturally in that same language and script.\n"
                f"- If communicating in English, reply in warm, empathetic English.\n"
            )
            enhanced_system_prompt = SYSTEM_PROMPT + multilingual_rule

        inputs = {
            "messages": [("system", enhanced_system_prompt), ("user", query.message)]
        }
        stream = graph.stream(
            inputs, stream_mode="updates", config={"recursion_limit": 6}
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
        return {"response": final_response, "tool_called": tool_called_name}
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
        }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5500))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
