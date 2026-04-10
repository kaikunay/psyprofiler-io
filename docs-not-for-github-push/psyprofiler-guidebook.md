# PSYPROFILER.IO — The Complete Guidebook
### From Zero to Launched, Day by Day
**For:** Kai · Kunaya Labs · Solo Founder Edition  
**Last Updated:** March 2025  
**Estimated Read Time:** 30 minutes · Save this file

---

## 📌 READ THIS FIRST — The Big Answer

**You asked: Where do I actually build the profiler? GCP Agent Builder or n8n?**

Here's the honest answer:

```
VERTEX AI ADK  =  The BRAIN  (intelligence, reasoning, agents)
n8n            =  The NERVOUS SYSTEM  (triggers, delivery, automation)
Appwrite       =  The BODY  (auth, database, storage, hosting)
```

**You need all three. They each do different things.**

- You build the psychological intelligence engine inside **Vertex AI ADK** using Python
- You trigger it, glue it to the world, and handle delivery using **n8n**
- You store users, reports, and files in **Appwrite**

Think of it this way:

> A customer pays on your website → **Appwrite** records the transaction → **n8n** detects it and sends the data to your agent → **Vertex AI ADK** runs 6 specialist agents and generates the intelligence report → the report goes back through **n8n** → gets stored in **Appwrite** → customer gets an email with the download link

None of these three can replace the others. You fuse them.

---

## 🗺️ THE FULL ROADMAP AT A GLANCE

```
PHASE 0 — CLAIM YOUR WEAPONS        (Day 0, 2–3 hours)
PHASE 1 — BUILD YOUR ENVIRONMENT    (Day 1–2)
PHASE 2 — BUILD THE AI BRAIN        (Day 3–6)
PHASE 3 — BUILD THE BACKEND         (Day 7–9)
PHASE 4 — WIRE EVERYTHING TOGETHER  (Day 10–12)
PHASE 5 — POLISH & QUALITY TEST     (Day 13–14)
PHASE 6 — LAUNCH                    (Day 15–21)
PHASE 7 — FIRST B2B CLIENT          (Day 22–30)
```

---

# PHASE 0 — CLAIM YOUR WEAPONS
## Day 0 · 2–3 Hours · Do This Today, Right Now

This phase is just admin. But it unlocks thousands of dollars of free infrastructure. Do not skip it.

---

### Step 0.1 — Claim GitHub Student Pack

1. Go to → `https://education.github.com/pack`
2. Click **"Get student benefits"**
3. Verify with your Vishwakarma University student email
4. Wait for approval (usually instant to 24 hours)

Once approved, claim these specific benefits IN THIS ORDER:

---

### Step 0.2 — Claim Appwrite Education
> **Why first:** This is your entire backend — auth, database, storage, hosting

1. Go to → `https://appwrite.io/education`
2. Connect your GitHub student account
3. You get **Pro plan free for your entire student career** (~$160/month value)
4. Create your Appwrite account at `cloud.appwrite.io`
5. Create one Organization called `kunaya-labs`
6. Create one Project called `psyprofiler`
7. Note down your **Project ID** — you'll need it later

---

### Step 0.3 — Claim DigitalOcean $200 Credit
> **Why:** This pays for your n8n server for 4–6 months

1. In GitHub Pack → find DigitalOcean
2. Click the unique referral link → create your DigitalOcean account
3. $200 credit is automatically applied
4. Don't create any Droplets yet — just have the account ready

---

### Step 0.4 — Claim MongoDB Atlas $200 Credit
> **Why:** This is your profile data warehouse

1. In GitHub Pack → find MongoDB Atlas
2. Apply the promo code or click through to MongoDB
3. Create an Atlas account
4. Create a **Free M0 cluster** called `psyprofiler-db` (region: Mumbai — `ap-south-1`)
5. Create a database user (note the username + password)
6. Add your IP to the allowlist (use `0.0.0.0/0` for now, tighten later)
7. Note your **Connection String** — looks like: `mongodb+srv://username:password@cluster.mongodb.net/`

---

### Step 0.5 — Claim Namecheap Domain
> **Why:** Your product needs a real domain from Day 1

1. In GitHub Pack → find Namecheap
2. Get **1 year free .me domain** OR use the discount on `.io`
3. Register `psyprofiler.io` (this is your primary product domain)
4. Also register `kunayalabs.com` if not already done
5. In Namecheap DNS → you'll point this to Appwrite later

---

### Step 0.6 — Set Up GCP Project

1. Go to → `console.cloud.google.com`
2. Create a new project → name it `psyprofiler-prod`
3. Enable billing (your $1K credit is already there)
4. Set billing alerts: **$200, $500, $800** — go to Billing → Budgets & Alerts
5. Enable these APIs:
   - Vertex AI API
   - Cloud Storage API
   - Cloud Build API
   - Artifact Registry API
6. Note your **Project ID** (different from project name — check top of console)

---

### Step 0.7 — Install Your Local Dev Tools

On your laptop/PC, install these in order:

```bash
# 1. Python 3.11+ (check: python --version)
# Download from python.org if needed

# 2. Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init  # login with your Google account, select psyprofiler-prod

# 3. ADK (Vertex AI Agent Development Kit)
pip install --upgrade google-cloud-aiplatform[agent_engines,adk]

# 4. Verify ADK installed
adk --version

# 5. Git (you probably have this)
git --version
```

> ✅ **Checkpoint:** You should now have GCP project ready, ADK installed, Appwrite Education project live, MongoDB cluster running, DigitalOcean account with $200 credit, and your domain registered.

---

# PHASE 1 — BUILD YOUR ENVIRONMENT
## Day 1–2 · Setting Up The Foundation

---

### Step 1.1 — Create Your Project Structure

On your laptop, create this exact folder structure:

```
psyprofiler/
├── agents/
│   ├── __init__.py
│   ├── commander.py          ← root orchestrator agent
│   ├── intake_agent.py       ← data validation
│   ├── ocean_agent.py        ← Big Five + HEXACO
│   ├── shadow_agent.py       ← Dark Triad
│   ├── bond_agent.py         ← Attachment Theory
│   ├── archetype_agent.py    ← Jungian
│   ├── drive_agent.py        ← Motivation + RIASEC
│   └── asix_agent.py         ← Vedic/ASIX layer
├── tools/
│   ├── __init__.py
│   ├── scoring.py            ← psychometric scoring functions
│   └── pdf_generator.py      ← report PDF builder
├── prompts/
│   ├── commander_prompt.txt
│   ├── ocean_prompt.txt
│   ├── shadow_prompt.txt
│   └── (one per agent)
├── requirements.txt
├── .env                       ← never commit this
└── main.py
```

```bash
mkdir psyprofiler
cd psyprofiler
mkdir agents tools prompts
touch agents/__init__.py tools/__init__.py
touch requirements.txt .env main.py
```

---

### Step 1.2 — Create requirements.txt

```txt
google-cloud-aiplatform[agent_engines,adk]>=1.112
google-adk>=0.4.0
python-dotenv>=1.0.0
pymongo>=4.6.0
fpdf2>=2.7.0
requests>=2.31.0
```

Install them:
```bash
pip install -r requirements.txt
```

---

### Step 1.3 — Create .env File

```bash
# .env — NEVER commit this to GitHub
GCP_PROJECT_ID=your-project-id-here
GCP_LOCATION=us-central1
STAGING_BUCKET=gs://psyprofiler-staging-YOUR_PROJECT_ID
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/psyprofiler
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-appwrite-project-id
APPWRITE_API_KEY=your-appwrite-api-key
```

Create the GCS staging bucket (ADK needs this for deployment):
```bash
gsutil mb -p YOUR_PROJECT_ID -l us-central1 gs://psyprofiler-staging-YOUR_PROJECT_ID
```

---

### Step 1.4 — Set Up Appwrite Database Schema

In your Appwrite console (`cloud.appwrite.io`):

**Create these Collections inside your `psyprofiler` project:**

**Collection 1: `profiles`**
| Attribute | Type | Required |
|---|---|---|
| user_id | String | Yes |
| submission_id | String | Yes |
| tier | String | Yes (recon/deep/oracle) |
| use_case | String | Yes (hiring/dating/self) |
| status | String | Yes (pending/processing/complete) |
| report_url | String | No |
| created_at | DateTime | Yes |

**Collection 2: `submissions`**
| Attribute | Type | Required |
|---|---|---|
| profile_id | String | Yes |
| raw_responses | String | Yes (JSON string) |
| processed | Boolean | Yes |

**Create a Storage Bucket:**
- Name: `reports`
- Permissions: Only authenticated users can read their own files
- Max file size: 10MB

**Enable Email/Password Auth:**
- Go to Auth → Settings → Enable Email/Password

---

# PHASE 2 — BUILD THE AI BRAIN
## Day 3–6 · This Is The Core Product

> **Important concept:** In ADK, you have a ROOT AGENT that controls everything. Under it, you have SUB-AGENTS for specific tasks. The root agent is called `commander.py`. The sub-agents are specialists.

---

### Step 2.1 — Understanding ADK Agent Structure

An ADK agent is created like this:

```python
from google.adk.agents import Agent

my_agent = Agent(
    name="agent_name",
    model="gemini-3.1-pro-preview", 
    description="What this agent does",
    instruction="The detailed system prompt goes here"
)
```

That's it. The `instruction` parameter IS the system prompt — this is where all your psychology science lives.

For parallel agents (running multiple specialists at once):
```python
from google.adk.agents import ParallelAgent

parallel_specialists = ParallelAgent(
    name="specialist_council",
    sub_agents=[ocean_agent, shadow_agent, bond_agent, 
                archetype_agent, drive_agent, asix_agent]
)
```

---

### Step 2.2 — Write the Specialist Agent Prompts

This is the most important work you will do. The quality of these prompts = the quality of your product.

**Create `prompts/ocean_prompt.txt`:**

```
You are the Big Five (OCEAN) + HEXACO Specialist Psychologist.

Your task is to analyze the provided questionnaire responses and produce a precise, 
clinically-grounded personality profile based on:

1. OCEAN Framework (Costa & McCrae, 1992):
   - Openness to Experience (O): intellectual curiosity, creativity, aesthetic sensitivity
   - Conscientiousness (C): self-discipline, organization, dependability
   - Extraversion (E): sociability, assertiveness, positive emotionality  
   - Agreeableness (A): compassion, cooperation, trust
   - Neuroticism (N): emotional instability, anxiety, vulnerability

2. HEXACO Extension (Ashton & Lee, 2007):
   - Honesty-Humility (H): sincerity, fairness, modesty, greed-avoidance
   
For each dimension, you MUST provide:
- A score from 1-10 (e.g., O: 7.8)
- A confidence level: HIGH / MEDIUM / LOW
- 2-3 sentences of behavioral interpretation
- 1 key behavioral prediction in the subject's likely context

OUTPUT FORMAT (strict JSON):
{
  "framework": "OCEAN_HEXACO",
  "scores": {
    "openness": {"score": 0.0, "confidence": "", "interpretation": "", "prediction": ""},
    "conscientiousness": {"score": 0.0, "confidence": "", "interpretation": "", "prediction": ""},
    "extraversion": {"score": 0.0, "confidence": "", "interpretation": "", "prediction": ""},
    "agreeableness": {"score": 0.0, "confidence": "", "interpretation": "", "prediction": ""},
    "neuroticism": {"score": 0.0, "confidence": "", "interpretation": "", "prediction": ""},
    "honesty_humility": {"score": 0.0, "confidence": "", "interpretation": "", "prediction": ""}
  },
  "key_insight": "One paragraph synthesis of the most important finding",
  "flag": "Any response bias or unusual patterns detected (or null)"
}

Be rigorous. Be scientific. Do not speculate beyond what the data supports. 
If confidence is LOW, say so and explain why.
```

> 📝 **You need to write one prompt file for each specialist agent.** Follow the same pattern — tell each agent exactly what framework to use, what scoring system to apply, and what JSON to return. This structured output is what makes the synthesis work.

---

### Step 2.3 — Write the Commander Agent

Create `agents/commander.py`:

```python
from google.adk.agents import Agent, ParallelAgent, SequentialAgent
from dotenv import load_dotenv
import os

load_dotenv()

# Load prompts
def load_prompt(filename):
    with open(f"prompts/{filename}", "r") as f:
        return f.read()

# ── SPECIALIST AGENTS ──────────────────────────────────────

ocean_agent = Agent(
    name="ocean_specialist",
    model="gemini-3.1-pro-preview",
    description="Big Five OCEAN + HEXACO personality analysis specialist",
    instruction=load_prompt("ocean_prompt.txt")
)

shadow_agent = Agent(
    name="shadow_specialist", 
    model="gemini-3.1-pro-preview",
    description="Dark Triad and D-Factor analysis specialist",
    instruction=load_prompt("shadow_prompt.txt")
)

bond_agent = Agent(
    name="bond_specialist",
    model="gemini-3.1-pro-preview", 
    description="Attachment Theory analysis specialist",
    instruction=load_prompt("bond_prompt.txt")
)

archetype_agent = Agent(
    name="archetype_specialist",
    model="gemini-3.1-pro-preview",
    description="Jungian Archetype identification specialist", 
    instruction=load_prompt("archetype_prompt.txt")
)

drive_agent = Agent(
    name="drive_specialist",
    model="gemini-3.1-pro-preview",
    description="Motivational Architecture and RIASEC Holland Codes specialist",
    instruction=load_prompt("drive_prompt.txt")
)

asix_agent = Agent(
    name="asix_specialist",
    model="gemini-3.1-pro-preview",
    description="ASIX Vedic consciousness layer specialist — Guna profiling",
    instruction=load_prompt("asix_prompt.txt")
)

# ── PARALLEL EXECUTION ─────────────────────────────────────

specialist_council = ParallelAgent(
    name="specialist_council",
    description="Runs all six specialist analyses simultaneously",
    sub_agents=[ocean_agent, shadow_agent, bond_agent, 
                archetype_agent, drive_agent, asix_agent]
)

# ── SYNTHESIS AGENT ────────────────────────────────────────

synthesizer = Agent(
    name="synthesizer",
    model="gemini-3.1-pro-preview",   # PRO for the synthesis — this justifies premium pricing
    description="Cross-framework psychological synthesis intelligence",
    instruction=load_prompt("synthesizer_prompt.txt")
)

# ── ROOT COMMANDER ─────────────────────────────────────────

root_agent = Agent(
    name="commander",
    model="gemini-3.1-pro-preview",
    description="Master orchestrator for PsyProfiler intelligence pipeline",
    instruction="""
    You are the Commander of the PsyProfiler Intelligence System.
    
    You receive subject questionnaire data and orchestrate the full analysis.
    
    Your sequence:
    1. First, pass the data to the specialist_council (all 6 agents run in parallel)
    2. Collect all 6 JSON outputs from the specialists  
    3. Pass all outputs to the synthesizer agent
    4. Return the final synthesized intelligence report
    
    Always maintain the JSON structure throughout. Do not add commentary outside the JSON.
    If any specialist returns LOW confidence, flag this in your final output.
    """,
    sub_agents=[specialist_council, synthesizer]
)
```

---

### Step 2.4 — Test Locally

```bash
# From your psyprofiler/ directory
adk web

# This opens a browser UI at http://localhost:8000
# You can chat with your agent and see it work in real time
# Test it with sample questionnaire data
```

This is your local development environment. Spend time here. Get the agents working perfectly before you deploy.

---

### Step 2.5 — Deploy to Vertex AI Agent Engine

Once your agents work locally, deploy to production:

```python
# deploy.py

import vertexai
from vertexai import agent_engines
from agents.commander import root_agent
import os
from dotenv import load_dotenv

load_dotenv()

vertexai.init(
    project=os.getenv("GCP_PROJECT_ID"),
    location=os.getenv("GCP_LOCATION")
)

# Wrap your ADK agent
app = agent_engines.AdkApp(agent=root_agent)

# Deploy — this takes 5–10 minutes
remote_agent = agent_engines.create(
    agent=app,
    config={
        "requirements": ["google-cloud-aiplatform[agent_engines,adk]>=1.112"],
        "staging_bucket": os.getenv("STAGING_BUCKET"),
    }
)

print(f"✅ Agent deployed!")
print(f"Resource name: {remote_agent.resource_name}")
# Save this resource name — you'll need it in n8n
```

Run it:
```bash
python deploy.py
```

> ✅ **Checkpoint:** Your agent is now live on Vertex AI Agent Engine with a real API endpoint. The hardest part is done.

---

# PHASE 3 — BUILD THE BACKEND
## Day 7–9 · Your Product's Spine

---

### Step 3.1 — Set Up n8n on DigitalOcean

> **Why n8n on DigitalOcean and not something else?** Because n8n gives you a visual interface to connect your Vertex AI agent to Appwrite, email, Razorpay, and everything else — without writing custom API integration code for each one. It's your automation glue.

**Create the DigitalOcean Droplet:**

1. Log into DigitalOcean
2. Create Droplet → **Marketplace** tab → search "Docker"
3. Choose the Docker on Ubuntu image
4. Size: **Basic shared CPU, 2GB RAM / 1 vCPU / 50GB** ($12/month, covered by your $200 credit)
5. Region: Bangalore (`blr1`) — closest to Pune
6. Add your SSH key (create one if you don't have one)
7. Click Create Droplet
8. Note the Droplet's **IP address**

**SSH into your server:**
```bash
ssh root@YOUR_DROPLET_IP
```

**Install n8n with Docker Compose:**

```bash
# Create directory structure
mkdir -p /opt/n8n
cd /opt/n8n

# Create docker-compose.yml
nano docker-compose.yml
```

Paste this exactly:
```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: CHANGE_THIS_STRONG_PASSWORD
      POSTGRES_DB: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U n8n"]
      interval: 5s
      timeout: 5s
      retries: 5

  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.YOUR_DOMAIN.com/
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=CHANGE_THIS_STRONG_PASSWORD
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=CHANGE_THIS_STRONG_PASSWORD
      - N8N_ENCRYPTION_KEY=GENERATE_A_RANDOM_32_CHAR_STRING
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  n8n_data:
```

```bash
# Start n8n
docker compose up -d

# Check it's running
docker compose ps

# View logs
docker compose logs -f n8n
```

**Set up the domain (n8n.yourdomain.com):**

1. In Namecheap DNS → Add an `A` record:
   - Host: `n8n`
   - Value: Your Droplet IP address
2. Install Caddy for HTTPS (automatic SSL):

```bash
apt install caddy -y

nano /etc/caddy/Caddyfile
```

Paste:
```
n8n.yourdomain.com {
    reverse_proxy localhost:5678
}
```

```bash
systemctl reload caddy
```

Now access n8n at: `https://n8n.yourdomain.com`

> ✅ **Checkpoint:** n8n is live, secured with HTTPS, on your own server.

---

### Step 3.2 — Set Up Appwrite for psyprofiler.io

Back in your Appwrite console:

**Enable Email Auth:**
- Auth → Settings → Email/Password → Enable

**Create API Key:**
- Overview → API Keys → Create Key
- Name: `psyprofiler-backend`
- Scopes: databases.read, databases.write, storage.read, storage.write, users.read
- Copy the key → save in your `.env`

**Set up SMTP for email delivery:**
- Auth → SMTP Settings
- Use Gmail (App Password) or SendGrid free tier
- This enables the "your report is ready" emails

**Create the Storage Bucket:**
- Storage → Create Bucket
- Name: `reports`
- ID: `reports`
- Permissions: Users can only access their own files

---

### Step 3.3 — Set Up MongoDB for Analytics

In MongoDB Atlas:

1. Connect to your cluster using MongoDB Compass (free GUI tool)
2. Create database: `psyprofiler`
3. Create these collections:
   - `reports` — stores completed profile data (anonymized)
   - `analytics` — aggregate behavioral patterns
   - `revenue_events` — payment confirmations

The data schema for `reports`:
```json
{
  "submission_id": "uuid",
  "timestamp": "ISO datetime",
  "tier": "deep_profile",
  "use_case": "hiring",
  "scores": {
    "ocean": {},
    "dark_triad": {},
    "attachment": {},
    "archetype": {},
    "drive": {},
    "asix": {}
  },
  "synthesis_summary": "text",
  "processing_time_ms": 0
}
```

> This is your data flywheel. After 500 profiles this becomes valuable training data.

---

# PHASE 4 — WIRE EVERYTHING TOGETHER
## Day 10–12 · The Integration Layer

This is where n8n does its job — connecting all the pieces.

---

### Step 4.1 — The Main Profiling Workflow in n8n

Open n8n at `https://n8n.yourdomain.com`.

Build this workflow (each item is one n8n node):

```
[WEBHOOK TRIGGER]
    ↓
Receives: {submission_id, tier, use_case, responses}
    ↓
[APPWRITE NODE — Get Submission]
    Gets the full questionnaire responses from Appwrite
    ↓
[HTTP REQUEST NODE — Call Vertex AI Agent]
    POST to your Agent Engine endpoint
    Body: {user_id, message: JSON.stringify(responses)}
    Headers: {Authorization: Bearer TOKEN}
    ↓
[WAIT NODE — 90 second timeout with polling]
    Agent Engine returns the full analysis JSON
    ↓
[CODE NODE — Parse Response]
    Extract the synthesized profile from the agent response
    ↓
[HTTP REQUEST NODE — Generate PDF]
    Call your PDF generator (Cloud Run function or local script)
    ↓
[APPWRITE NODE — Upload PDF to Storage]
    Upload the generated PDF to the 'reports' bucket
    Creates a signed URL valid for 7 days
    ↓
[APPWRITE NODE — Update Profile Status]
    Update profiles collection: status = "complete", report_url = signed_url
    ↓
[EMAIL NODE — Send to Customer]
    Subject: "Your PsyProfiler Report Is Ready"
    Body: "Download your report: [link]"
    ↓
[MONGODB NODE — Log Analytics]
    Store anonymized profile data for your data flywheel
    ↓
[TELEGRAM NODE — Notify You]
    Message yourself: "New report delivered! Tier: DEEP | Revenue: ₹1,999"
```

**To call Vertex AI Agent Engine from n8n (HTTP Request node):**

```
Method: POST
URL: https://us-central1-aiplatform.googleapis.com/v1/{AGENT_RESOURCE_NAME}:query
Headers:
  Authorization: Bearer {{$credentials.googleOAuth2Api.accessToken}}
  Content-Type: application/json
Body:
{
  "input": {
    "text": "{{JSON.stringify($json.responses)}}"
  },
  "user_id": "{{$json.user_id}}",
  "session_id": "{{$json.submission_id}}"
}
```

---

### Step 4.2 — The Payment Webhook Workflow

Create a second n8n workflow:

```
[RAZORPAY WEBHOOK TRIGGER]
    ↓
Receives payment confirmation
    ↓
[CODE NODE — Verify Signature]
    Verify Razorpay webhook signature (security check)
    ↓
[APPWRITE NODE — Create Profile Record]
    status = "pending"
    tier = from payment metadata
    ↓
[EXECUTE WORKFLOW NODE]
    Trigger the Main Profiling Workflow
    ↓
[MONGODB NODE — Log Revenue Event]
```

---

### Step 4.3 — The PDF Generator

You have two options for generating the PDF report:

**Option A (Simpler, recommended to start):**
Write a Python script that uses the `fpdf2` library. Host it as a simple Flask endpoint on DigitalOcean.

**Option B (Better long-term):**
Design your report template in Canva Pro, export as PDF, then use `pypdf` to fill in the dynamic content.

For starting out, here is a minimal PDF generator structure:

```python
# tools/pdf_generator.py
from fpdf import FPDF
import json

class PsyProfilerReport(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 20)
        self.set_text_color(15, 20, 40)
        self.cell(0, 15, "PSYCHOLOGICAL INTELLIGENCE REPORT", align="C", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 10)
        self.set_text_color(100, 90, 80)
        self.cell(0, 8, "PsyProfiler.io · Kunaya Labs", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(5)

    def add_framework_section(self, title, scores, description):
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(139, 26, 26)  # dark red
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 11)
        self.set_text_color(30, 25, 20)
        self.multi_cell(0, 6, description)
        self.ln(3)
        # Add scores, etc.

def generate_report(profile_data: dict, output_path: str):
    pdf = PsyProfilerReport()
    pdf.add_page()
    # Build report from profile_data
    pdf.output(output_path)
```

---

# PHASE 5 — POLISH & QUALITY TEST
## Day 13–14 · This Phase Makes You Trustworthy

> **Do not rush this phase.** Your product is competing on quality. A mediocre report destroys trust. An exceptional report creates word-of-mouth.

---

### Step 5.1 — Run 10 Full Test Reports

Write 10 different "test subjects" yourself — 10 different sets of questionnaire responses representing different personality types:

- A highly narcissistic person
- A highly conscientious, low-neuroticism person
- A fearful-avoidant attachment style person
- An extreme introvert with high openness
- etc.

Run each through the full pipeline. For each one, ask yourself:

- Does the report accurately describe the psychological profile I intended?
- Does the synthesis agent catch the interesting cross-framework interactions?
- Is the language clinical enough to feel premium, yet clear enough to be useful?
- Would I pay ₹1,999 for this report?

If the answer to any question is "no" — fix the prompt for that agent and rerun.

---

### Step 5.2 — The Quality Bar Checklist

Before launch, every Deep Profile report must:

- [ ] Score all 9 framework dimensions
- [ ] Have a "Key Insight" paragraph that isn't generic
- [ ] Contain at least one cross-framework finding (e.g., "Your low H-factor combined with high O suggests...")
- [ ] Have specific behavioral predictions, not just trait descriptions
- [ ] Include the ASIX layer with at least 3 sentences of Vedic analysis
- [ ] Be minimum 2,500 words for Deep Profile tier
- [ ] Have zero hallucinated facts or made-up correlations
- [ ] Be formatted cleanly — headers, spacing, readable

---

### Step 5.3 — Beta Test with 5 Real People

Ask 5 people you trust (friends, classmates, former colleagues) to:

1. Complete your questionnaire honestly
2. Receive the Deep Profile report
3. Rate accuracy from 1–10
4. Give you one thing that felt wrong and one that felt spot-on

Target: **Average accuracy rating of 7.5/10 before launch.** If you're below this, your prompts need refinement.

---

# PHASE 6 — LAUNCH
## Day 15–21 · First Money In

---

### Step 6.1 — Build psyprofiler.io Frontend

> **Where to host:** Appwrite Sites (included in your Education plan). It's like Vercel but inside Appwrite.

Your frontend needs exactly these pages:

1. **Home** — What is PsyProfiler? Who is it for? Pricing. CTA.
2. **Assessment** — The questionnaire (adaptive, branching based on previous answers)
3. **Checkout** — Razorpay payment for the selected tier
4. **Dashboard** — User's past reports, download links
5. **Report Viewer** — PDF viewer embedded in browser

**For the frontend stack, use whatever you're most comfortable with:**
- If you know React → Vite + React
- If you prefer simpler → plain HTML + JS with Appwrite's Web SDK
- The Appwrite Web SDK handles all auth and API calls

**Appwrite Web SDK example:**
```javascript
import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID');

const account = new Account(client);
const databases = new Databases(client);

// Register user
const user = await account.create('unique()', email, password, name);

// Get their reports
const reports = await databases.listDocuments(
    'psyprofiler', 
    'profiles',
    [Query.equal('user_id', userId)]
);
```

---

### Step 6.2 — Set Up Razorpay

1. Register at `razorpay.com` — requires Kunaya Labs business details
2. Get your API Key + Secret
3. Create three payment links (or use Razorpay's hosted checkout):
   - Recon: ₹499
   - Deep Profile: ₹1,999
   - Oracle: ₹4,999
4. Configure webhooks → point to your n8n payment webhook URL
5. Pass `submission_id` and `tier` as metadata in each payment

---

### Step 6.3 — The Launch Sequence (Days 15–21)

**Day 15 — Publish the product**
- Push psyprofiler.io live
- Do a final end-to-end test: pay ₹1 → receive report → confirm pipeline works

**Day 15 — Write your launch LinkedIn post**
Write it yourself, in your own voice. The frame:

> "I just built something I've wanted to exist for years. A psychological profiling system that combines Big Five, Dark Triad, Attachment Theory, Jungian Archetypes, Holland Codes, and a Vedic consciousness layer — all in one report. No company in the world offers this combination. Here's why I built it, and what it means for hiring/relationships/self-understanding... [link to psyprofiler.io]"

This is not hype. This is a genuine thesis statement. It will attract exactly the right people.

**Day 16–17 — DM 30 targeted people**

Find these specific people on LinkedIn:
- HR managers at tech startups in Pune, Mumbai, Bangalore
- Therapists and psychologists who might refer clients
- Entrepreneurs who care about team composition

Template:
> "Hi [Name], I've built a psychological profiling tool that combines 9 validated frameworks in one report — including a layer no other tool offers. Would you be willing to try a free Recon report and give me honest feedback? Takes 15 minutes."

**Day 18–19 — Convert feedback to paid**

Follow up with everyone who received the free report:
> "I'm glad the report was useful. For your next candidate assessment / personal clarity session, the Deep Profile (₹1,999) covers all 9 dimensions including the detailed synthesis. Happy to answer any questions."

**Day 20–21 — First revenue review**
- Check MongoDB analytics: which tier sold?
- Check Deepnote: what type of questionnaire responses are coming in?
- What's the conversion rate from landing page to payment?
- Fix the weakest link

---

# PHASE 7 — FIRST B2B CLIENT
## Day 22–30 · Where The Real Money Is

One B2B retainer (₹15,000–40,000/month) equals 8–20 individual report sales. This is where you compound.

---

### Step 7.1 — The B2B Pitch

Create a 1-page PDF (Canva Pro) showing:

1. What PsyProfiler.io does in 2 sentences
2. The 9 frameworks — show the depth
3. Sample report excerpt (real but anonymized)
4. Pricing: ₹12,000/month for 10 profiles, ₹25,000/month for unlimited
5. "Book a 20-minute call" CTA

Target companies for your first outreach:
- HR consulting firms in Pune, Mumbai
- Recruitment agencies (they hire hundreds of people — each needs a profile)
- Matchmaking/matrimonial apps (dating vertical — high volume, ₹3/API call at scale)
- Corporate L&D teams (leadership development)

---

### Step 7.2 — The API Tier (Month 2–3)

Once you have B2B interest, build the API access tier:

- Create an API endpoint in Appwrite (or a simple Flask app on DigitalOcean)
- Generate API keys per client
- Rate limiting via Appwrite or Nginx
- Simple documentation page (one page HTML is fine)
- Pricing: ₹2–5 per profile generated

This is the machine that scales. At 1,000 API calls/day from one dating app = ₹2,000/day = ₹60,000/month from one client.

---

# QUICK REFERENCE — THE COMPLETE TECH STACK

| Layer | Tool | What It Does | Cost |
|---|---|---|---|
| AI Brain | Vertex AI ADK + Gemini 2.5 | The 9-framework profiling engine | $1K GCP credit |
| Automation | n8n (self-hosted, DigitalOcean) | Connects everything | DigitalOcean $200 |
| Backend | Appwrite Education | Auth, DB, Storage, Hosting | Free (GitHub Pack) |
| Database | MongoDB Atlas | Profile analytics, data flywheel | Free + $200 |
| Domain | Namecheap | psyprofiler.io | Free (GitHub Pack) |
| IDE | JetBrains PyCharm | Python development | Free (GitHub Pack) |
| Code AI | GitHub Copilot | Accelerates coding | Free (GitHub Pack) |
| Payments | Razorpay | Indian payment processing | 2% per transaction |
| PDF | fpdf2 / custom | Report generation | Free |
| Email | Appwrite SMTP / SendGrid | Report delivery | Free tier |

---

# HONEST WARNINGS — READ BEFORE YOU START

**Warning 1 — Vertex AI Agent Engine costs to watch**

Agent Engine Memory costs ₹0.65/GB-hour after December 2025. Code Execution costs are similar. These are covered by your $1K credit but monitor them. Set your billing alert at $200 first.

**Warning 2 — n8n self-hosting is not for complete beginners**

If you've never SSH'd into a server, the DigitalOcean setup will feel difficult. Budget an extra day for this. The official n8n documentation and DigitalOcean's tutorials are very good — use them.

**Warning 3 — The questionnaire design is critical**

The psychological quality of your output is only as good as the quality of your input questions. Use validated psychometric items — the IPIP item bank (ipip.ori.org) has over 3,000 validated personality items, all free to use for research and commercial applications. Do not write your own items from scratch.

**Warning 4 — Gemini 2.0 Flash is being deprecated June 1, 2026**

Use Gemini 2.5 Flash from the start. Don't build on 2.0.

**Warning 5 — Appwrite free tier pauses after inactivity**

The GitHub Student Pack gives you Education (Pro). Always use that, not the free tier. Free tier projects pause after 1 week of no activity.

---

# YOUR IMMEDIATE NEXT ACTIONS (In Order)

Here is exactly what to do today, tomorrow, and this week. No ambiguity.

**TODAY (2 hours):**
1. Go to `education.github.com/pack` and apply
2. Open `console.cloud.google.com` and create project `psyprofiler-prod`
3. Set the 3 billing alerts ($200, $500, $800)
4. Install Python 3.11, gcloud CLI, and ADK on your laptop

**TOMORROW (4 hours):**
1. Claim Appwrite Education, DigitalOcean, MongoDB Atlas from GitHub Pack
2. Create Appwrite project and database schema
3. Create your project folder structure
4. Write your first agent prompt file: `prompts/ocean_prompt.txt`

**THIS WEEK (Day 3–7):**
1. Write all 6 specialist agent prompts (most important work)
2. Build `commander.py`
3. Test with `adk web` locally
4. Deploy to Vertex AI Agent Engine

**NEXT WEEK (Day 8–14):**
1. Set up n8n on DigitalOcean
2. Build Appwrite backend
3. Wire the full pipeline in n8n
4. Beta test with 5 people

**WEEK 3 (Day 15–21):**
1. Launch
2. First revenue

---

*psyprofiler.io · Kunaya Labs · Built by Kai · Pune → World*
