try:
    from langchain_core.tools import tool
except ImportError:
    from langchain.agents import tool

from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from pydantic import SecretStr

from .config import GROQ_API_KEY, GROQ_MODEL
from .tools import call_emergency, find_nearby_therapists, query_medgemma


@tool
def ask_mental_health_specialist(query: str) -> str:
    """
    Generate a focused supportive response using the configured Groq model.
    Use when additional specialist-style conversational guidance is useful.
    """
    return query_medgemma(query)


@tool
def emergency_call_tool() -> str:
    """
    Attempt an emergency call through Twilio for an imminent safety crisis.

    The user must still be explicitly instructed to call India's emergency
    number 112 themselves.
    """
    success = call_emergency()
    return (
        "Emergency call placed."
        if success
        else "Emergency call could not be placed."
    )


@tool
def find_nearby_therapists_by_location(location: str) -> str:
    """Provide professional-support guidance for the requested location."""
    return find_nearby_therapists(location)


TOOLS = [
    ask_mental_health_specialist,
    emergency_call_tool,
    find_nearby_therapists_by_location,
]


if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not configured. Add it to the environment before starting SVI."
    )


llm = ChatGroq(
    model=GROQ_MODEL,
    temperature=0.3,
    api_key=SecretStr(GROQ_API_KEY),
)

graph = create_react_agent(llm, tools=TOOLS)


SYSTEM_PROMPT = """
You are SVI, an empathetic AI support assistant for people in India.

You provide emotional support, stress/trauma triage, practical coping guidance,
and connections to appropriate human support. You are not a doctor or therapist,
and you must never claim to be one or use a fictional professional identity.

CORE RESPONSE GUIDELINES:
1. Respond directly and naturally to ordinary emotional conversations.
2. Acknowledge the user's feelings before giving practical guidance.
3. Keep responses warm, calm, concise, and non-judgmental.
4. Do not diagnose medical or psychiatric conditions.
5. Ask a gentle open-ended question when it would help understand the situation.
6. Never provide instructions for self-harm, suicide, or violence.
7. If the user asks for professional support, use the support-resource tool.

INDIA-SPECIFIC SAFETY GUIDANCE:
- Immediate danger or severe safety risk: clearly advise calling 112 now.
- 24/7 mental-health support: Tele-MANAS 14416 or 1-800-891-4416.
- National Helpline Against Atrocities: 14566.
- Never mention emergency or crisis numbers from other countries.
- If the user expresses current suicidal thoughts, self-harm intent, a plan,
  access to means, or immediate danger, use `emergency_call_tool` immediately.
  Then encourage the user to call 112 themselves, stay with a trusted person,
  and move away from anything they could use to hurt themselves.

TOOL USAGE:
- Use `emergency_call_tool` for imminent self-harm/suicide emergencies.
- Use `find_nearby_therapists_by_location` for requests for professional care,
  therapists, counselling, or clinic support.
- Use `ask_mental_health_specialist` only when additional focused support is
  useful; do not call it for every ordinary message.
"""


def parse_response(stream):
    """Extract the latest tool name and final agent response from a stream."""
    tool_called_name = "None"
    final_response = None

    for state in stream:
        tool_data = state.get("tools")
        if tool_data:
            tool_messages = tool_data.get("messages")
            if isinstance(tool_messages, list):
                for message in tool_messages:
                    tool_called_name = getattr(message, "name", None) or tool_called_name

        agent_data = state.get("agent")
        if agent_data:
            messages = agent_data.get("messages")
            if isinstance(messages, list):
                for message in messages:
                    content = getattr(message, "content", None)
                    if isinstance(content, list):
                        texts = [
                            item.get("text", "") if isinstance(item, dict) else str(item)
                            for item in content
                        ]
                        candidate = "".join(texts).strip()
                    elif isinstance(content, str):
                        candidate = content.strip()
                    else:
                        candidate = ""

                    if candidate:
                        final_response = candidate

    return tool_called_name, final_response
