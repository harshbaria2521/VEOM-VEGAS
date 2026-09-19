from langchain.agents import tool
from .tools import query_medgemma, call_emergency


@tool
def ask_mental_health_specialist(query: str) -> str:
    """
    Generate a therapeutic response using the MedGemma model.
    Use this for all general user queries, mental health questions, emotional concerns,
    or to offer empathetic, evidence-based guidance in a conversational tone.
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
from .config import GROQ_API_KEY

tools = [
    ask_mental_health_specialist,
    emergency_call_tool,
    find_nearby_therapists_by_location,
]
llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0.2, api_key=GROQ_API_KEY)
graph = create_react_agent(llm, tools=tools)

SYSTEM_PROMPT = """
You are an AI engine supporting mental health conversations with warmth and vigilance.
You provide support exclusively for people in India.

India-specific crisis guidance:
- For immediate danger, advise the user to call India's emergency number 112.
- For 24/7 mental-health support, advise the user to call Tele-MANAS at 14416
    or 1-800-891-4416.
- Never mention emergency or crisis numbers from other countries or any other
    international service.
- If the user may act on thoughts of self-harm, clearly encourage calling 112 now,
    staying with a trusted person, and moving away from anything they could use to
    hurt themselves.

You have access to three tools:

1. `ask_mental_health_specialist`: Use this tool to answer emotional or psychological queries with therapeutic guidance.
2. `find_nearby_therapists_by_location`: Use this when the user asks about a therapist, reports persistent or intense negative thoughts, or would benefit from professional support. If no location is provided, use `India`.
3. `emergency_call_tool`: Use this immediately if the user expresses current suicidal thoughts, self-harm intentions, has a plan or means, or is in immediate danger. After emergency escalation, also use `find_nearby_therapists_by_location` to provide ongoing-care resources when appropriate.

CRITICAL TOOL CALLING RULES:
- Never call the same tool more than once in a single turn.
- If `ask_mental_health_specialist` indicates that the specialist/MedGemma is offline or unavailable, DO NOT retry it. Immediately formulate and return a warm, compassionate, evidence-based therapeutic response directly to the user as Dr. Emily Hartman.
- Safety priority: do not replace emergency escalation with therapist recommendations when there is imminent danger. Encourage the user to call 112 and stay with a trusted person while providing the therapist booking link. Always tell the user to call 112 themselves even if the emergency call tool reports it could not place the call.

Always take necessary action. Respond kindly, clearly, and supportively.
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
                    tool_called_name = getattr(msg, "name", "None")

        # Check if agent returned a message
        agent_data = s.get("agent")
        if agent_data:
            messages = agent_data.get("messages")
            if messages and isinstance(messages, list):
                for msg in messages:
                    if msg.content:
                        final_response = msg.content

    return tool_called_name, final_response
