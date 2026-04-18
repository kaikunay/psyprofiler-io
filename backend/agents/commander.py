# agents/commander.py
from google.adk.agents import Agent, ParallelAgent, SequentialAgent
import os
from dotenv import load_dotenv

load_dotenv()

def load_prompt(name: str) -> str:
    path = os.path.join(os.path.dirname(__file__), "..", "prompts", f"{name}.txt")
    with open(path) as f:
        return f.read()

# ── 6 SPECIALIST AGENTS (run in parallel) ──────────────────
ocean_agent = Agent(
    name="ocean_hexaco_specialist",
    model="gemini-2.5-flash-preview-05-20",
    description="Big Five OCEAN + HEXACO personality analyst. Scores all 6 dimensions with confidence bands.",
    instruction=load_prompt("ocean")
)

shadow_agent = Agent(
    name="shadow_dark_triad_specialist",
    model="gemini-2.5-flash-preview-05-20",
    description="Dark Triad (Narcissism, Machiavellianism, Psychopathy) + D-Factor analyst.",
    instruction=load_prompt("shadow")
)

bond_agent = Agent(
    name="attachment_specialist",
    model="gemini-2.5-flash-preview-05-20",
    description="Attachment Theory analyst — Secure, Anxious, Avoidant, Disorganized styles.",
    instruction=load_prompt("bond")
)

archetype_agent = Agent(
    name="jungian_archetype_specialist",
    model="gemini-2.5-flash-preview-05-20",
    description="Jungian depth psychologist — identifies primary + shadow archetypes, individuation stage.",
    instruction=load_prompt("archetype")
)

drive_agent = Agent(
    name="motivation_riasec_specialist",
    model="gemini-2.5-flash-preview-05-20",
    description="Motivational Architecture + Holland RIASEC career personality analyst.",
    instruction=load_prompt("drive")
)

asix_agent = Agent(
    name="asix_vedic_specialist",
    model="gemini-2.5-flash-preview-05-20",
    description="ASIX Vedic Consciousness layer — Guna profiling (Sattva/Rajas/Tamas), Swabhava, Dharmic career type.",
    instruction=load_prompt("asix")
)

# ── PARALLEL COUNCIL (all 6 run simultaneously) ────────────
specialist_council = ParallelAgent(
    name="specialist_council",
    description="Six-agent parallel analysis council",
    sub_agents=[ocean_agent, shadow_agent, bond_agent, archetype_agent, drive_agent, asix_agent]
)

# ── SYNTHESIZER (Gemini Pro for premium quality) ───────────
synthesizer = Agent(
    name="grand_synthesizer",
    model="gemini-2.5-pro-preview-05-06",  # Pro for synthesis quality
    description="Cross-framework synthesizer — weaves all 6 specialist outputs into unified psychological portrait.",
    instruction=load_prompt("synthesizer")
)

# ── ROOT COMMANDER ─────────────────────────────────────────
root_agent = Agent(
    name="commander",
    model="gemini-2.5-flash-preview-05-20",
    description="Master orchestrator of PsyProfiler Intelligence System",
    instruction="""
You are COMMANDER — the orchestrating intelligence of the PsyProfiler system.

You receive a JSON object containing:
- questionnaire_responses: answers to the psychometric questionnaire
- osint_data: scraped public digital footprint (bio, posts, social patterns) — may be empty
- use_case: "hiring" | "sales" | "dating" | "self"
- tier: "recon" | "deep" | "oracle"

Your pipeline:
1. Pass the COMPLETE input to specialist_council (all 6 agents run in parallel automatically)
2. Collect all 6 JSON analysis outputs
3. Pass ALL 6 outputs + original input to grand_synthesizer
4. Return the synthesizer's final unified report as your output

Rules:
- Maintain strict JSON throughout the pipeline
- If osint_data is present, explicitly flag that this is a behavioral-enhanced profile
- If any specialist returns LOW confidence, preserve that flag in final output
- For "recon" tier: pass only to ocean_agent (skip others)
- For "deep" tier: run all 6 in parallel (standard flow)
- For "oracle" tier: run all 6 + request synthesizer to include hiring/sales/dating tactical playbook

Output: the complete synthesizer JSON report only. No additional commentary.
""",
    sub_agents=[specialist_council, synthesizer]
)
