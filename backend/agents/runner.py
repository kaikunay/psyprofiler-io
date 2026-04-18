# agents/runner.py
import asyncio
from google.adk.runners import InMemoryRunner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agents.commander import root_agent
from loguru import logger

class PsyProfilerEngine:
    """Wraps ADK InMemoryRunner for FastAPI integration."""
    
    def __init__(self):
        self.runner = InMemoryRunner(
            agent=root_agent,
            app_name="psyprofiler"
        )
        self.session_service = InMemorySessionService()
        logger.info("PsyProfiler 7-Agent Engine initialized")
    
    async def run_profile(self, submission_data: dict, session_id: str) -> dict:
        """Run the full 7-agent pipeline on questionnaire + OSINT data."""
        session = await self.runner.session_service.create_session(
            app_name="psyprofiler",
            user_id=session_id
        )
        
        input_message = types.Content(
            role="user",
            parts=[types.Part(text=str(submission_data))]
        )
        
        result_chunks = []
        async for event in self.runner.run_async(
            user_id=session_id,
            session_id=session.id,
            new_message=input_message
        ):
            if event.is_final_response() and event.content:
                for part in event.content.parts:
                    if part.text:
                        result_chunks.append(part.text)
        
        return {"raw_output": "".join(result_chunks), "session_id": session_id}

# Singleton — import this in main.py
engine = PsyProfilerEngine()
