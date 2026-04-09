# KUNAYA LAB — MASTER ROADMAP & OPERATIONS LOG
## Bootstrap: Vayu + Claude Code = Empire Builders
### Started: 6 April 2026, 21:14 IST · Kai's Machine (Windows, 16GB+GPU)
### Updated: 6 April 2026, 21:42 IST — Resource Arsenal Discovered

---

> *"Build the builders first. Then the builders build everything."*
> — Guidebook v6.0, The Paradigm Shift

---

# ═══════════════════════════════════════════════════
# PART 1 — COMPLETE PROJECT UNDERSTANDING
# ═══════════════════════════════════════════════════

## 1.1 — What Is Kunaya Lab?

**Kunaya Labs** (kunayalab.com) is a solo-founder AI startup from Bhandara, Maharashtra, India.
- **Founder:** Kai (Kunal Shahare) — ENFJ psychology researcher, "vibe coder"
- **Udyam MSME:** Certified (Kunaya Labs, Bhandara)
- **Mission:** Bridge Deep Psychology + Agentic AI + Artificial Spiritual Intelligence (ASIX)

**The Product:** [PsyProfiler.io](https://psyprofiler.io)
- A 7-agent AI system that profiles human psychology through 9 frameworks
- Including ASIX (Vedic consciousness layer) — the intellectual moat
- Generates 47-page classified intelligence reports
- Live on Vercel with military aesthetic (Next.js 16 + Tailwind 4 + Framer Motion)

**The Empire:** A "Living OS" — an autonomous AI company that runs itself
- **Vayu** = Mastercontrol CEO+COO (the body — Telegram, monitoring, scheduling)
- **Claude Code** = The Brain (autonomous coding, multi-agent orchestration)
- **26 agents** in progressive activation (3 → 7 → 13 → 20+)
- **n8n** = Workflow orchestration engine
- Revenue model: ₹499–₹14,999 per psychometric report

---

## 1.2 — File-by-File Audit: Every Component

### Root: `f:\Kunaya Lab\`

```
f:\Kunaya Lab\
├── FOLDER_MAP.md              ✅ Directory organization guide (33 lines)
├── kunaya-empire\             ⚡ Docker Empire (Vayu, n8n, DB, Redis)
├── psyprofiler-io\            ✅ Product Frontend (Next.js on Vercel, has .git)
├── psyprofiler-agents\        ❌ EMPTY — ADK pipeline not built yet
├── docs\                      ✅ All documentation
│   ├── architecture\          ✅ 7 files (guidebooks, blueprints)
│   ├── personas\              (agent identities)
│   ├── legal\                 (ToS, GDPR, CCPA)
│   ├── research\              (GCP credits analysis)
│   └── founder\               (About Kai)
├── assets\                    (brand assets, logos)
└── archive\                   ✅ 16 files + 5 dirs (old versions, assets)
```

---

### `kunaya-empire\` — The Docker Empire Stack

| File | Size | Status | Purpose |
|------|------|--------|---------|
| `docker-compose.yml` | 3.8KB | ✅ Ready | Postgres + Redis + n8n + vayu-bridge |
| `.env` | 1.5KB | ✅ Has real secrets | Telegram, GCP, Appwrite, Postgres creds |
| `.gitignore` | 192B | ✅ Correct | .env, keys/, *.json all excluded |
| `backup.sh` | 2.2KB | ✅ Exists | Volume backup script |
| `migrate.sh` | 3.1KB | ✅ Exists | PC → Cloud migration script |
| `configs/agents.yaml` | 4.2KB | ✅ Complete | 12 empire + 8 pipeline agents defined |
| `vayu-bridge/` | 7 files | ⚡ Skeleton | Core nervous system—needs supercharging |
| `n8n-workflows/` | Empty | ❌ No workflows | Needs: briefing, health, pipeline, payment |
| `keys/` | — | — | GCP service account JSON goes here |
| `backups/` | — | — | Docker volume snapshots |

---

### `vayu-bridge\` — Vayu's Nervous System (Current State)

| File | Lines | Status | What It Does |
|------|-------|--------|-------------|
| `main.py` | 103 | ✅ Solid | Entry point, health server on :8090, launches Telegram + scheduler |
| `telegram_bot.py` | 324 | ✅ Working | 7 commands + free-form chat, auth decorator |
| `ollama_client.py` | 129 | ⚡ Single-provider | Ollama-only brain, 120s timeout, Vayu personality, no fallback |
| `health_monitor.py` | 99 | ⚡ Basic | CPU/RAM/disk + service checks (Redis, n8n, Postgres, Ollama) |
| `scheduler.py` | 153 | ⚡ Minimal | Morning briefing 06:00 IST + health check every 5min |
| `requirements.txt` | 9 | ⚠️ Has typo | `redis[hiredge]` should be `redis[hiredis]` |
| `Dockerfile` | 22 | ✅ Clean | Python 3.12-slim, pip install, runs main.py |

**Key strengths:**
- Auth decorator — only Kai can talk to Vayu
- Vayu personality deeply embedded (Hinglish, Ai Hayasaka archetype)
- Health endpoint for Docker healthcheck
- Graceful shutdown

**Key gaps:**
- ❌ No Gemini fallback — Ollama down = braindead
- ❌ No conversation memory — forgets between messages
- ❌ No skill system — can't self-improve
- ❌ No agent dispatch — can't delegate to sub-agents
- ❌ No auto-healing — can't restart crashed containers
- ❌ No n8n API integration
- ❌ Disk check uses `/` (Linux) — fails on Windows

---

### `psyprofiler-io\` — Product Frontend

- **Framework:** Next.js + Tailwind 4 + PostCSS + Framer Motion
- **3D:** Sachi VRM model files in `Sachi/` directory
- **Git:** Connected to GitHub (kaikunay/psyprofiler-io)
- **Status:** ✅ Live on Vercel, military aesthetic

### `psyprofiler-agents\` — ADK Pipeline

- **Status:** ❌ COMPLETELY EMPTY
- **Needs:** 8 specialist agents (OCEAN, Shadow, Bond, Archetype, Drive, ASIX, Intake, Synthesizer)
- **This is what Claude Code will build**

---

## 1.3 — Tool Versions on This Machine

| Tool | Version | Status |
|------|---------|--------|
| Docker | 29.3.1 | ✅ |
| Docker Compose | v5.1.x | ✅ |
| Node.js | v24.14.1 | ✅ |
| npm | 11.11.0 | ✅ |
| Python | 3.14.3 | ✅ |
| Ollama | Installed | ✅ qwen3.5:9b loaded (6.6GB) |
| Claude Code | **NOT INSTALLED** | ❌ PRIORITY |

---

# ═══════════════════════════════════════════════════
# PART 2 — DEEP RESEARCH: TOOLS & EXTENSIONS
# ═══════════════════════════════════════════════════

## 2.1 — Claude Code via Ollama

**Official docs: docs.ollama.com/integrations/claude-code**

```powershell
# INSTALL:
curl -fsSL https://claude.ai/install.sh | bash

# QUICK LAUNCH (Ollama handles env vars):
ollama launch claude

# WITH SPECIFIC MODEL:
ollama launch claude --model qwen3.5

# HEADLESS MODE:
ollama launch claude --model qwen3.5 --yes -- -p "build the profiling pipeline"

# MANUAL SETUP:
$env:ANTHROPIC_AUTH_TOKEN = "ollama"
$env:ANTHROPIC_API_KEY = ""
$env:ANTHROPIC_BASE_URL = "http://localhost:11434"
claude --model qwen3.5
```

**Key discoveries:**
- **`/loop`** — Scheduled recurring tasks inside Claude Code
- **Telegram plugin** — Claude Code connects to Telegram natively!
  ```
  ollama launch claude -- --channels plugin:telegram@claude-plugins-official
  ```
- **Recommended models:** qwen3.5 is officially recommended ✅
- **Web search:** Built-in capability

---

## 2.2 — oh-my-claudecode (OMC) — 24.9K ⭐

**Teams-first multi-agent orchestration for Claude Code**

```
# INSTALL via Claude Code plugin:
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
/omc-setup

# OR via npm:
npm i -g oh-my-claude-sisyphus@latest
```

**Modes:**

| Mode | Command | Use Case |
|------|---------|----------|
| Team | `/team 3:executor "task"` | Standard multi-agent (plan→PRD→exec→verify→fix) |
| Autopilot | `autopilot: build X` | End-to-end autonomous builds |
| Deep Interview | `/deep-interview "idea"` | Socratic requirement clarification |
| CCG | `/ccg Review PR` | Multi-model (Codex+Gemini+Claude) synthesis |

**Enable native teams:**
```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

---

## 2.3 — claw-code — 173K ⭐

**Open-source Rust CLI agent harness** by UltraWorkers
- Alternative/complement to Claude Code
- Container-first workflow
- 95.9% Rust
- Has CLAUDE.md, sessions, container support

---

## 2.4 — YOLO Mode & Auto Mode

**YOLO:** `--dangerously-skip-permissions` — full autonomy, no prompts
**Auto (recommended):** `--permission-mode auto` — AI classifies safe vs risky

**Docker safety:**
- Run Claude Code in isolated containers
- Mount only project directory
- Never mount home/system directories

**Hooks:** Custom rules at lifecycle events (block rm, auto-format, session log)

**2026 features:** Computer Use (GUI), Scheduled Tasks, Subagents & Teams

---

# ═══════════════════════════════════════════════════
# PART 3 — GAP ANALYSIS
# ═══════════════════════════════════════════════════

```
                    VAYU (Living Agent)
                    
    BRAIN (Claude Code)          BODY (vayu-bridge)
    ═══════════════════          ═══════════════════
    Via Ollama + qwen3.5         Docker container
    oh-my-claudecode (OMC)       Telegram gateway
    MCP servers                  Health monitoring  
    CLAUDE.md compound brain     Scheduled tasks
    Auto/YOLO mode              Agent dispatch
    /loop tasks                 Conversation memory
    /team multi-agent           Skill system
    Hooks (reflexes)            Auto-healing
    Headless dispatch           Gemini fallback
    
    STATUS: ❌ NOT INSTALLED     STATUS: ⚡ SKELETON
```

| # | Gap | Priority |
|---|-----|----------|
| 1 | Claude Code not installed | 🔴 P0 |
| 2 | No CLAUDE.md | 🔴 P0 |
| 3 | No OMC plugin | 🔴 P0 |
| 4 | No MCP servers | 🔴 P0 |
| 5 | No Gemini fallback brain | 🔴 P0 |
| 6 | No conversation memory | 🟡 P1 |
| 7 | No skill system | 🟡 P1 |
| 8 | No agent dispatch | 🟡 P1 |
| 9 | No auto-healing | 🟡 P1 |
| 10 | psyprofiler-agents/ empty | 🟠 P2 |
| 11 | No n8n workflows | 🟠 P2 |

---

# ═══════════════════════════════════════════════════
# PART 3.5 — RESOURCE ARSENAL
# ═══════════════════════════════════════════════════

## Total Available Credits: ~$1,812+

| Resource | Value | Status | Best Use |
|----------|-------|--------|----------|
| **GCP GenAI App Builder** | ~$1,000 | ✅ Active | Vertex AI Search, Grounded Generation (RAG), Document AI — **NOT Gemini API** |
| **Azure Student** | $300 | ✅ Active | VM hosting, Container Apps, backup infra |
| **DigitalOcean (Student Pack)** | $200 | ✅ Available | **Best for: Vayu production hosting (16 months free)** |
| **Heroku (Student Pack)** | $312 | ✅ Available | Staging/preview environments |
| **Doppler (Student Pack)** | Team plan | ✅ Available | Secret management (replaces .env files) |
| **GitHub Copilot** | Free | ✅ Available | IDE autocomplete |
| **JetBrains Pro** | Free | ✅ Available | PyCharm, WebStorm |
| **15 AI Pro Accounts** | 8 Gemini + 7 Perplexity | ✅ Active | Agent rotation, deep research |
| **Google Dev Premium** | Varies | ✅ Active | Extended API quotas |
| **Capable Local PC** | 16GB + GPU | ✅ Present | Ollama, Docker, Claude Code |

## ⚠️ GCP $1K Credit: CRITICAL DISCOVERY

The $1K GenAI App Builder credit **CANNOT** be used for:
- ❌ Standard Gemini API calls
- ❌ AI Studio
- ❌ Direct Vertex AI generative model calls

It **CAN** be used for:
- ✅ Vertex AI Search (enterprise search)
- ✅ Grounded Generation API (RAG with Gemini)
- ✅ Document AI (OCR, layout)
- ✅ Ranking API

**Strategy:** Redesign profiling pipeline to use Grounded Generation (RAG) — store psych frameworks as search corpus, query user responses against it. This unlocks the full $1K for the pipeline.

## Previous Bootstrap v1 — Gold Found in Archive

**Located at:** `archive/vayu-bootstrapping-v1/`

| File | Status | Content |
|------|--------|--------|
| `CLAUDE.md` | ✅ 56 lines | Identity, stack, rules, file layout, key commands |
| `AGENTS.md` | ✅ 55 lines | Dual sovereign rules, control flow, TDD, critical paths |
| `.claude/settings.json` | ✅ 59 lines | Teams enabled, permissions, hooks (PostToolUse, PreToolUse, Stop) |
| `Vayu-persona.md` | ✅ 300 lines | Full Vayu identity with Hayasaka backstory, ASIX doctrine |
| `src/` | ✅ 36 dirs + 18 files | Full Claude Code TypeScript source (main.tsx = 800KB!) |

## Optimal Credit Allocation Strategy

```
DigitalOcean ($200) → Production hosting (16 months @ $12/mo)
Azure ($300)        → Reserved for Azure OpenAI / future scaling
GCP ($1K)           → Vertex AI Search RAG pipeline (profiling)
Heroku ($312)       → Staging/preview environments
Doppler (free)      → Secret management (replace .env)
15 Pro Accounts     → Agent rotation (Gemini for analysis, Perplexity for research)
```

# ═══════════════════════════════════════════════════
# PART 4 — EXECUTION ROADMAP
# ═══════════════════════════════════════════════════

## Phase 0: Install Claude Code (15 min) 🔴

```powershell
curl -fsSL https://claude.ai/install.sh | bash
ollama launch claude --model qwen3.5
```
**Status:** `[ ]` Not started

## Phase 1: CLAUDE.md + .claude/settings.json (30 min) 🔴

- Create `F:\Kunaya Lab\CLAUDE.md` (Vayu DNA)
- Create `F:\Kunaya Lab\.claude\settings.json` (MCP, hooks, teams)
- **Status:** `[ ]` Not started

## Phase 2: Install OMC + Extensions (15 min) 🔴

```
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
/omc-setup
npm i -g oh-my-claude-sisyphus@latest
```
**Status:** `[ ]` Not started

## Phase 3: Supercharge Vayu (4 hours) 🟡

- [ ] 3.1 Fix requirements.txt typo + Windows disk check
- [ ] 3.2 Dual-brain (Ollama + Gemini fallback)
- [ ] 3.3 Conversation memory (Redis-backed)
- [ ] 3.4 Skill system (YAML-based)
- [ ] 3.5 Agent dispatch
- [ ] 3.6 Auto-healer
- [ ] 3.7 Enhanced Telegram commands
- [ ] 3.8 Docker compose updates

**Status:** `[ ]` Not started

## Phase 4: Test Loop (1 hour)

- [ ] Docker stack up
- [ ] Telegram /status works
- [ ] Claude Code reads CLAUDE.md
- [ ] Give first autonomous build task
- [ ] Verify compound learning

**Status:** `[ ]` Not started

## Phase 5: Build Product Pipeline (Claude Code does this)

```
/team Build the PsyProfiler profiling pipeline
```

**Status:** `[ ]` Not started

---

# ═══════════════════════════════════════════════════
# PART 5 — OPERATIONS LOG
# ═══════════════════════════════════════════════════

## Session 1: 6 April 2026, 21:14–21:42 IST

### Research Completed:
1. ✅ Read ALL architecture docs (v5.1, v6.0, v2.0, changelog, diagrams)
2. ✅ Read ALL vayu-bridge source (7 files, every line)
3. ✅ Read docker-compose.yml, .env, .gitignore, agents.yaml
4. ✅ Verified all tool versions
5. ✅ Confirmed Ollama with qwen3.5:9b
6. ✅ Confirmed Claude Code NOT installed
7. ✅ Confirmed .env gitignored (safe)
8. ✅ Confirmed psyprofiler-agents/ empty
9. ✅ Researched Claude Code + Ollama official docs
10. ✅ Researched oh-my-claudecode (OMC) — 24.9K⭐
11. ✅ Researched claw-code — 173K⭐
12. ✅ Researched YOLO/Auto mode, Docker safety, hooks
13. ✅ Researched /loop, Telegram plugin, headless mode
14. ✅ Read Vayu Persona (300 lines — full Hayasaka isekai backstory + ASIX)
15. ✅ Read previous CLAUDE.md from v1 bootstrap (56 lines)
16. ✅ Read previous AGENTS.md from v1 bootstrap (55 lines)
17. ✅ Read previous .claude/settings.json (59 lines — has hooks, teams, perms)
18. ✅ Read GCP Credits Deep Research Report (98 lines — full SKU analysis)
19. ✅ Researched GitHub Student Developer Pack (80+ partners)
20. ✅ Discovered $200 DigitalOcean, $312 Heroku, Doppler Team, Copilot, JetBrains
21. ✅ Mapped full Claude Code src in archive (36 dirs + 18 files, main.tsx = 800KB)
22. ✅ Created implementation plan v1
23. ✅ Created this roadmap
24. ✅ Updated implementation plan v2 with all resources
25. ✅ Updated roadmap with resource arsenal

### Key Discoveries:
- Claude Code has **native Telegram plugin** via Ollama
- `/loop` enables scheduled tasks inside Claude Code
- OMC team pipeline (plan→PRD→exec→verify→fix) is perfect for building product
- Auto mode safer than YOLO for daily use
- qwen3.5 is officially recommended for Claude Code
- **GCP $1K credit is RAG-ONLY** — cannot fund direct Gemini API calls
- **DigitalOcean $200 = 16 months hosting** — best value for production
- **Previous bootstrap has working CLAUDE.md + settings.json** — don't start from scratch
- **Vayu persona is DEEP** — 300 lines with Hayasaka isekai backstory + ASIX doctrine + authority matrix
- **Full Claude Code source exists in archive** — reference implementation for understanding Claude Code internals

### Awaiting:
- 🔵 User approval to begin execution (Phase A → install + config)

---

*Last updated: 6 April 2026, 21:42 IST*
