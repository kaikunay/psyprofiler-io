# GUIDEBOOK v5.1 → v6.0 — CHANGELOG

## Why v6.0 Was Rewritten From Scratch

v5.1 was designed for a 32GB GCP VM that no longer exists. Every assumption about hardware, local LLMs, NemoClaw sandboxes, and browser automation was invalidated by the pivot to borrowed PC → cheap cloud.

v6.0 was rebuilt from first principles using deep research on:
- Hermes Agent latest (self-improving skills, Docker `/opt/data` volume, Telegram gateway, subagent delegation, agentskills.io marketplace)
- Azure B2s VM constraints (2 vCPU, 4GB RAM, burstable)
- DPIIT February 2026 Deep Tech framework (20-year recognition, ₹300cr limit, requires Pvt Ltd/LLP)
- Google for Startups 2026 tiers (Start: $2K, Scale: $200K, AI-First: $350K)
- Cashfree KYC for sole proprietors (~24hr with MSME)
- LangFuse Cloud free tier (10K traces/mo, saves 1.5GB RAM)
- Docker memory optimization for 4GB VMs (Postgres tuning, n8n binary data mode, Node.js heap caps)

## What Was KILLED

| Killed | Reason |
|--------|--------|
| NemoClaw sandboxes | Requires NVIDIA GPUs |
| Lightpanda browser automation | Requires persistent XRDP VM |
| Local Ollama/Qwen3.5:9b | 4GB Azure VM can't run LLMs |
| 26 agents on Day 1 | Progressive activation (3→7→13→20+) |
| Self-hosted LangFuse | Too heavy (~1.5GB RAM) for 4GB VM |
| Self-hosted Superset | Same. Add Month 4+ |
| GCP VM as primary | No VM. Azure Startup $200 → DigitalOcean $200 |
| OpenClaw Office | Fantasy. Remove until Month 6+ |
| Sole proprietorship = DPIIT | Feb 2026 requires Pvt Ltd or LLP |

## What Was ADDED

| Added | Why |
|-------|-----|
| 4-day borrowed PC build strategy | Actual hardware constraint |
| Docker-portable architecture | Build once, deploy anywhere |
| Memory-optimized Compose (4GB budget) | Postgres shared_buffers, Redis maxmem, Node heap |
| Progressive agent activation (5 phases) | Sanity preservation |
| LangFuse Cloud free tier | 10K traces/mo, zero RAM |
| DPIIT 2026 Deep Tech framework | 20yr recognition, ₹300cr, needs company |
| Google for Startups credit ladder | $2K→$200K→$350K progression |
| OPC entity upgrade path | Revenue-funded legal → DPIIT eligibility |
| Azure → DO → GCP migration path | Credit-optimized cloud hopping |
| Hermes Docker container | Vayu is portable |
| Realistic cost: $47-82/mo | Not $300-500/mo |
| v5.1 vs v6.0 comparison tables | Clear what changed and why |

## Key Architecture Decisions

1. **Hermes Agent = empire backbone** (not CrewAI/LangGraph)
   - Built-in Telegram, persistent memory, self-improving skills
   - Docker single-volume persistence `/opt/data`
   - Subagent delegation for parallel teams

2. **ADK System B first** (questionnaire, not OSINT scraping)
   - No external API dependencies
   - Complete code already in v2.md
   - Revenue in 4 days, not 4 weeks

3. **All agents → Gemini API** (no local LLMs)
   - 4GB VM can't run Ollama
   - gemini-2.0-flash: fast + cheap for ops tasks
   - gemini-2.5-pro: reasoning for synthesizer only

4. **LangFuse Cloud, not self-hosted**
   - 10K traces/month free
   - Saves 1.5GB RAM
   - Add self-hosted in Month 4 after VM upgrade