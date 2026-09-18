# Step1: Setup FastAPI backend
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

from backend.ai_agent import graph, SYSTEM_PROMPT, parse_response

app = FastAPI()


# Step2: Receive and validate request from Frontend
class Query(BaseModel):
    message: str


@app.post("/ask")
async def ask(query: Query):
    try:
        inputs = {"messages": [("system", SYSTEM_PROMPT), ("user", query.message)]}
        stream = graph.stream(inputs, stream_mode="updates")
        tool_called_name, final_response = parse_response(stream)
        if not final_response:
            final_response = (
                "I'm here with you, though I had trouble putting a reply together. "
                "If this feels urgent, please call 112 or Tele-MANAS at 14416."
            )
        return {"response": final_response, "tool_called": tool_called_name}
    except Exception as e:
        # Whatever went wrong (a tool failure, a misconfigured integration, a
        # model error), the person must never just see a broken connection —
        # especially since this endpoint can be reached mid-crisis. Log it
        # for debugging, but always answer with real guidance.
        print(f"[SVI] /ask failed: {e}")
        return {
            "response": (
                "I'm having trouble processing that right now. If you need help "
                "urgently, please call 112 or Tele-MANAS at 14416 directly."
            ),
            "tool_called": "None",
        }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
