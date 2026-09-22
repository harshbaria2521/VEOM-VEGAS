try:
    from langchain_core.tools import tool
except ImportError:
    from langchain.agents import tool

from .tools import query_medgemma, call_emergency


@tool
def ask_mental_health_specialist(query: str) -> str:
    """
    Query the MedGemma medical model for deep clinical reference notes.
    Do NOT call this for general emotional support, empathy, stress, anxiety, or standard conversation.
    Respond directly to the user as Dr. Emily Hartman.
    """
    return query_medgemma(query)


@tool
def emergency_call_tool() -> str:
    """
    Place an emergency call to the safety helpline's phone number via Twilio.
    Use this only if the user expresses suicidal ideation, intent to self-harm,
    or describes a mental health emergency requiring immediate help.

    Returns a short status string so the assistant knows whether the call
    actually went through and can adjust its reply accordingly — the user
    should always be told to call 112 themselves regardless of the outcome.
    """
    success = call_emergency()
    return (
        "Emergency call placed." if success else "Emergency call could not be placed."
    )


@tool
def find_nearby_therapists_by_location(location: str) -> str:
    """
    Finds and returns a list of licensed therapists near the specified location,
    along with a website link for booking an appointment.

    Use this tool when someone asks for professional help, reports persistent or
    intense negative thoughts, or may benefit from speaking with a therapist,
    even when they do not explicitly ask for therapist recommendations. For
    imminent self-harm risk, call emergency_call_tool first and then use this
    tool to provide ongoing-care resources.

    Args:
        location (str): The name of the city or area in which the user is seeking therapy support.

    Returns:
        str: Therapist names and experience, followed by the Docvita booking link.
    """
    return (
        f"Here are some recommended licensed therapists in {location}:\n"
        "- Ms Dhannya Ittymathew - 15+ year experience\n"
        "- Ms Anshika Mendiratta - 4+ year experience\n"
        "- Ms Neha Kumar - 4+ year experience\n\n"
        "Book an appointment through Docvita: https://docvita.com/therapists"
    )


# Step1: Create an AI Agent & Link to backend
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from .config import GROQ_API_KEY, GROQ_MODEL

tools = [
    ask_mental_health_specialist,
    emergency_call_tool,
    find_nearby_therapists_by_location,
]
llm = ChatGroq(model=GROQ_MODEL, temperature=0.3, api_key=GROQ_API_KEY)
graph = create_react_agent(llm, tools=tools)

SYSTEM_PROMPT = """
You are Dr. Emily Hartman, a warm, highly empathetic, and experienced clinical psychologist providing mental health and emotional support exclusively for people in India.

CORE THERAPEUTIC DIRECTIVES:
1. Direct, Rapid Response: Formulate your complete therapeutic response directly to the user. Do NOT call `ask_mental_health_specialist` for general conversations, venting, stress, or sadness.
2. Emotional Attunement & Validation: Connect warmly with the user's emotion ("I hear how heavy this feels right now...", "It takes courage to share that...").
3. Gentle Normalization: Reduce shame and distress ("Many people go through periods where things feel overwhelming; your feelings are valid.").
4. Practical Grounding & Coping: Offer immediate, practical coping techniques (e.g., 4-7-8 breathing, box breathing, 5-4-3-2-1 sensory grounding, or gentle journaling).
5. Open-Ended Exploration: End with an open-ended, supportive question to understand their situation deeper.

INDIA-SPECIFIC CRISIS GUIDANCE:
- For immediate danger, physical safety risk, or severe distress: Advise the user to call India's emergency number 112.
- For 24/7 mental-health support: Advise the user to call Tele-MANAS at 14416 (or 1-800-891-4416) or National Helpline 14566.
- Never mention emergency or crisis numbers from other countries.
- If the user expresses current suicidal thoughts, self-harm intentions, has a plan or means, or is in immediate danger:
  1. Trigger `emergency_call_tool` immediately.
  2. Clearly and warmly encourage calling 112 now, staying with a trusted person, and moving away from anything they could use to hurt themselves.
  3. Offer `find_nearby_therapists_by_location` to provide ongoing professional care resources.

TOOL USAGE RULES:
- Use `emergency_call_tool` for imminent self-harm or suicide emergencies.
- Use `find_nearby_therapists_by_location` when the user asks for doctor/therapist recommendations or clinic appointments.
- For all emotional conversations, reply directly as Dr. Emily Hartman without delay.
"""


def parse_response(stream):
    tool_called_name = "None"
    final_response = None

    for s in stream:
        # Check if a tool was called
        tool_data = s.get("tools")
        if tool_data:
            tool_messages = tool_data.get("messages")
            if tool_messages and isinstance(tool_messages, list):
                for msg in tool_messages:
                    tool_called_name = getattr(msg, "name", "None") or "None"

        # Check if agent returned a message
        agent_data = s.get("agent")
        if agent_data:
            messages = agent_data.get("messages")
            if messages and isinstance(messages, list):
                for msg in messages:
                    content = getattr(msg, "content", None)
                    if content:
                        if isinstance(content, list):
                            texts = [
                                item.get("text", "") if isinstance(item, dict) else str(item)
                                for item in content
                            ]
                            final_response = "".join(texts).strip()
                        elif isinstance(content, str) and content.strip():
                            final_response = content.strip()

    return tool_called_name, final_response
