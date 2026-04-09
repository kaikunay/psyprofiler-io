# KUNAYA LIVING OS — DEPLOYMENT GUIDEBOOK v5.1
## Complete Step-by-Step Build Manual
### 32GB VM · 26 Agents · 15 Pro Accounts · Day 1 All-Out

> *Every command. Every config. Every WHY.*

---

# TABLE OF CONTENTS

1. [PRE-FLIGHT CHECKLIST](#1-pre-flight-checklist)
2. [ACT I — VM HARDENING & INFRASTRUCTURE](#2-act-i)
3. [ACT II — DUAL STAFF & LIVING OFFICE](#3-act-ii)
4. [ACT III — PRODUCT & LAUNCH](#4-act-iii)
5. [DAILY OPERATIONS](#5-daily-ops)
6. [EMERGENCY PLAYBOOK](#6-emergency)

---

# 1. PRE-FLIGHT CHECKLIST

## What You Need BEFORE Day 1

### Hardware & Accounts Ready
```
[x] GCP VM: kunaya-os-agents (e2-standard-8, 32GB RAM, 250GB SSD)
[x] Qwen3.5:9B pulled via Ollama
[x] Domains: psyprofiler.io + kunayalab.com
[x] GitHub Student Developer Pack active
[x] Google for Developers Premium active
[x] GCP $1K Vertex AI GenAI credits

[ ] 8 Gemini Pro accounts (friends/family with Airtel/Jio plans)
[ ] 7 Perplexity Pro accounts (friends/family)
[ ] Doppler account (claim via GitHub Pack)
[ ] 1Password account (claim via GitHub Pack)
[ ] DigitalOcean account ($200 credits via GitHub Pack)
[ ] Kai's 4K data pack ready (images/videos/voice/lipsync recordings)
```

### WHY each resource matters
| Resource | WHY | Without it? |
|----------|-----|-------------|
| GCP VM 32GB | Brain of the OS. Runs all local agents. | Nothing works |
| Qwen3.5:9B | Empire agents' local model. Free, private. | Empire agents can't think |
| $1K Vertex AI | Powers ALL 8 product agents on Gemini cloud | No profiling reports |
| 8 Gemini Pro | 16TB storage + Deep Research for empire agents | Agents lose research ability |
| 7 Perplexity Pro | Model Council access (Claude/GPT/Gemini in one) | No multi-model verification |
| DigitalOcean | Offload video rendering from main VM | VM overloaded during media gen |
| Doppler | Central secrets management | Secrets scattered, leaked |
| Kai's 4K data | Media Team creates content with YOUR face/voice | Generic, non-authentic content |

---

# 2. ACT I — VM HARDENING & INFRASTRUCTURE
## Day 1, Hours 1-6

---

## Phase 1.1 — SSH In & Harden (30 min)

### WHY: Your VM is exposed to the internet. Default configs = hacked in hours.

```bash
# === STEP 1: SSH into your VM ===
# From your Windows machine, open PowerShell:
ssh -i ~/.ssh/kunaya-key your-username@YOUR_VM_EXTERNAL_IP

# === STEP 2: Update everything ===
sudo apt update && sudo apt upgrade -y

# === STEP 3: Firewall (ufw) ===
# WHY: Block everything except what we need
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    comment 'SSH'
sudo ufw allow 80/tcp    comment 'HTTP (Nginx)'
sudo ufw allow 443/tcp   comment 'HTTPS (Nginx)'
sudo ufw allow 3389/tcp  comment 'XRDP (remote desktop)'
sudo ufw enable
sudo ufw status verbose

# === STEP 4: Fail2ban (brute-force protection) ===
# WHY: Auto-bans IPs that try too many wrong passwords
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# === STEP 5: Disable password auth (SSH keys only) ===
# WHY: Passwords can be brute-forced. Keys cannot.
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# === STEP 6: Create kunaya user ===
# WHY: Never run services as root
sudo adduser kunaya --disabled-password --gecos ""
sudo usermod -aG sudo,docker kunaya
sudo mkdir -p /home/kunaya/.ssh
sudo cp ~/.ssh/authorized_keys /home/kunaya/.ssh/
sudo chown -R kunaya:kunaya /home/kunaya/.ssh

# === STEP 7: Swap file (safety net for 32GB) ===
# WHY: If RAM fills up, swap prevents OOM-kill of containers
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### VERIFY:
```bash
sudo ufw status        # Should show ALLOW for 22,80,443,3389
sudo systemctl status fail2ban  # Should show active
free -h                # Should show 32GB RAM + 4GB swap
```

---

## Phase 1.2 — Docker & Core Services (45 min)

### WHY: Everything runs in Docker containers. Isolated, reproducible, restartable.

```bash
# === Switch to kunaya user ===
sudo su - kunaya

# === STEP 1: Install Docker (if not already) ===
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# === STEP 2: Install Docker Compose ===
sudo apt install docker-compose-plugin -y
docker compose version  # Should show v2.x

# === STEP 3: Create directory structure ===
# WHY: Clean separation between empire and product
mkdir -p ~/kunaya-empire/{docker,configs,data,logs,media,backups}
mkdir -p ~/psyprofiler/{agents,data,reports,keys}
mkdir -p ~/pro-accounts/{gemini,perplexity}

# === STEP 4: Create the master docker-compose.yml ===
cat > ~/kunaya-empire/docker/docker-compose.yml << 'COMPOSE_EOF'
version: "3.9"
name: kunaya-os

services:
  # === DATABASE ===
  postgres:
    image: postgres:16-alpine
    container_name: kunaya-postgres
    restart: always
    environment:
      POSTGRES_USER: kunaya
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: kunaya_os
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    deploy:
      resources:
        limits:
          memory: 1G
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kunaya"]
      interval: 10s
      timeout: 5s
      retries: 5

  # === CACHE ===
  redis:
    image: redis:7-alpine
    container_name: kunaya-redis
    restart: always
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
    ports:
      - "127.0.0.1:6379:6379"
    deploy:
      resources:
        limits:
          memory: 512M
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # === WORKFLOW ENGINE ===
  n8n:
    image: n8nio/n8n:latest
    container_name: kunaya-n8n
    restart: always
    environment:
      - N8N_HOST=n8n.kunayalab.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.kunayalab.com/
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=kunaya_os
      - DB_POSTGRESDB_USER=kunaya
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - n8n_data:/home/node/.n8n
    ports:
      - "127.0.0.1:5678:5678"
    depends_on:
      postgres:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 1536M

  # === OBSERVABILITY ===
  langfuse:
    image: langfuse/langfuse:latest
    container_name: kunaya-langfuse
    restart: always
    environment:
      - DATABASE_URL=postgresql://kunaya:${POSTGRES_PASSWORD}@postgres:5432/kunaya_os
      - NEXTAUTH_SECRET=${LANGFUSE_SECRET}
      - NEXTAUTH_URL=https://langfuse.kunayalab.com
      - SALT=${LANGFUSE_SALT}
    ports:
      - "127.0.0.1:3001:3000"
    depends_on:
      postgres:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 1G

  # === BI DASHBOARDS ===
  superset:
    image: apache/superset:latest
    container_name: kunaya-superset
    restart: always
    environment:
      - SUPERSET_SECRET_KEY=${SUPERSET_SECRET}
    volumes:
      - superset_data:/app/superset_home
    ports:
      - "127.0.0.1:8088:8088"
    deploy:
      resources:
        limits:
          memory: 1G

volumes:
  postgres_data:
  n8n_data:
  superset_data:
COMPOSE_EOF

# === STEP 5: Create .env file ===
# WHY: Secrets stay in .env, never in compose file
cat > ~/kunaya-empire/docker/.env << 'ENV_EOF'
# GENERATE THESE WITH: openssl rand -hex 32
POSTGRES_PASSWORD=CHANGE_ME_RANDOM_HEX_32
LANGFUSE_SECRET=CHANGE_ME_RANDOM_HEX_32
LANGFUSE_SALT=CHANGE_ME_RANDOM_HEX_32
SUPERSET_SECRET=CHANGE_ME_RANDOM_HEX_32
ENV_EOF

# Generate real secrets:
cd ~/kunaya-empire/docker
sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$(openssl rand -hex 32)/" .env
sed -i "s/LANGFUSE_SECRET=.*/LANGFUSE_SECRET=$(openssl rand -hex 32)/" .env
sed -i "s/LANGFUSE_SALT=.*/LANGFUSE_SALT=$(openssl rand -hex 32)/" .env
sed -i "s/SUPERSET_SECRET=.*/SUPERSET_SECRET=$(openssl rand -hex 32)/" .env

# === STEP 6: Launch the stack ===
docker compose up -d

# === STEP 7: Initialize Superset ===
docker exec -it kunaya-superset superset db upgrade
docker exec -it kunaya-superset superset fab create-admin \
  --username admin --firstname Kai --lastname Admin \
  --email kai@kunayalab.com --password CHANGE_THIS_PASSWORD
docker exec -it kunaya-superset superset init
```

### VERIFY:
```bash
docker compose ps
# ALL containers should show "healthy" or "running"

curl -s http://localhost:5678/healthz   # n8n: should return OK
curl -s http://localhost:3001           # LangFuse: should return HTML
curl -s http://localhost:8088           # Superset: should return HTML
```

---

## Phase 1.3 — Nginx Reverse Proxy + SSL (30 min)

### WHY: Expose services via HTTPS subdomains instead of raw ports.

```bash
# === STEP 1: Install Nginx + Certbot ===
sudo apt install nginx certbot python3-certbot-nginx -y

# === STEP 2: Create Nginx configs ===
# n8n
sudo tee /etc/nginx/sites-available/n8n.kunayalab.com << 'NGINX_EOF'
server {
    listen 80;
    server_name n8n.kunayalab.com;
    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX_EOF

# LangFuse
sudo tee /etc/nginx/sites-available/langfuse.kunayalab.com << 'NGINX_EOF'
server {
    listen 80;
    server_name langfuse.kunayalab.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

# Superset
sudo tee /etc/nginx/sites-available/metrics.kunayalab.com << 'NGINX_EOF'
server {
    listen 80;
    server_name metrics.kunayalab.com;
    location / {
        proxy_pass http://127.0.0.1:8088;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

# === STEP 3: Enable sites ===
sudo ln -sf /etc/nginx/sites-available/n8n.kunayalab.com /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/langfuse.kunayalab.com /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/metrics.kunayalab.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# === STEP 4: DNS — Add A records ===
# In your domain registrar (Cloudflare/GoDaddy/Google Domains):
# n8n.kunayalab.com      → YOUR_VM_EXTERNAL_IP
# langfuse.kunayalab.com → YOUR_VM_EXTERNAL_IP
# metrics.kunayalab.com  → YOUR_VM_EXTERNAL_IP

# === STEP 5: SSL certificates ===
# WHY: HTTPS = encrypted, trusted, required for production
sudo certbot --nginx -d n8n.kunayalab.com -d langfuse.kunayalab.com -d metrics.kunayalab.com
# Follow prompts. Select "Redirect HTTP to HTTPS"

# === STEP 6: Auto-renew ===
sudo certbot renew --dry-run
```

### VERIFY:
```bash
curl -I https://n8n.kunayalab.com       # Should return 200 OK with HTTPS
curl -I https://langfuse.kunayalab.com   # Should return 200 OK with HTTPS
```

---

## Phase 1.4 — Ollama Concurrency Setup (15 min)

### WHY: Default Ollama serves 1 request at a time. 13 empire agents need parallelism.

```bash
# === STEP 1: Configure Ollama for parallel requests ===
# WHY: OLLAMA_NUM_PARALLEL=4 means 4 agents can think simultaneously
sudo mkdir -p /etc/systemd/system/ollama.service.d/
sudo tee /etc/systemd/system/ollama.service.d/override.conf << 'EOF'
[Service]
Environment="OLLAMA_NUM_PARALLEL=4"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
Environment="OLLAMA_KEEP_ALIVE=24h"
EOF

sudo systemctl daemon-reload
sudo systemctl restart ollama

# === STEP 2: Verify Qwen3.5 is loaded ===
curl -s http://localhost:11434/api/tags | python3 -m json.tool
# Should show qwen3.5:9b in the list

# === STEP 3: Test parallel requests ===
# Run 4 requests simultaneously:
for i in 1 2 3 4; do
  curl -s http://localhost:11434/api/generate \
    -d "{\"model\":\"qwen3.5:9b\",\"prompt\":\"Say hello agent $i\",\"stream\":false}" &
done
wait
echo "All 4 completed"
```

### HOW concurrency works:
```
Agent request flow (13 empire agents):
                                    
  CTO ─────┐                       
  COO ─────┤                       
  CFO ─────┤──→ Hermes Queue ──→ Ollama (4 parallel slots)
  Guardian ─┤      (FIFO)         ├─ Slot 1: processing
  Growth ──┤                      ├─ Slot 2: processing
  Intel ───┤                      ├─ Slot 3: processing
  Evolve ──┤                      └─ Slot 4: processing
  Clinical ┤                       
  I-O ─────┤   Agents 5-13 wait   
  Forensic ┤   in queue (~30-60s)  
  Dark ────┤                       
  ASIX Sci ┤                       
  Director ┘                       

WHY this works:
- Empire agents are ASYNC (cron, not real-time)
- Psychology Lab runs WEEKLY batch reviews
- Media Team mostly calls Google APIs (Veo, Imagen) not Qwen
- Only 4-5 agents are active at any moment
- Queue handles bursts gracefully
```

---

## Phase 1.5 — Hermes-Agent Backbone (30 min)

### WHY: Hermes is the nervous system. Every agent talks through it.

```bash
# === STEP 1: Install Hermes-Agent ===
curl -fsSL https://hermes-agent.sh/install | bash

# === STEP 2: Configure model ===
hermes config set model qwen3.5:9b
hermes config set provider ollama
hermes config set api_url http://localhost:11434

# === STEP 3: Setup Telegram gateway ===
# WHY: You talk to Vayu/Sachi via Telegram. This is the bridge.
# First, create a bot via @BotFather on Telegram:
# /newbot → name: KunayaOS → username: kunaya_os_bot
# Copy the bot token

hermes gateway setup telegram
# Enter bot token when prompted
# Enter your Telegram user ID (get from @userinfobot)

# === STEP 4: Create skills directory ===
mkdir -p ~/.hermes/skills/{vayu,sachi,cto,ops,cfo,intel,guardian,growth,evolution}
mkdir -p ~/.hermes/skills/{clinical,io-psych,forensic,dark-psych,asix-scientist}
mkdir -p ~/.hermes/skills/{director,cinematographer,voice-artist,editor}

# === STEP 5: Test ===
hermes doctor
hermes chat "Hello, I am Kai. Respond in Hindi."
```

### VERIFY:
```bash
hermes doctor          # All checks green
hermes skills list     # Shows skill directories
hermes gateway status  # Telegram connected
```

---

## Phase 1.6 — NemoClaw Sandboxes (30 min)

### WHY: Sandboxes isolate Sachi from Vayu. Security + clean architecture.

```bash
# === STEP 1: Install NemoClaw ===
curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash

# === STEP 2: Onboard (interactive wizard) ===
nemoclaw onboard
# Select: inference provider → "ollama" → localhost:11434
# Select: security level → "strict"

# === STEP 3: Create Empire Floor sandbox ===
cat > ~/kunaya-empire/configs/empire-sandbox.yaml << 'EOF'
name: kunaya-empire-floor
description: "Vayu's Empire — controls EVERYTHING"
security:
  network:
    allow_egress:
      - "*.google.com"         # Gemini Pro accounts
      - "*.perplexity.ai"     # Perplexity Pro accounts
      - "*.telegram.org"      # Telegram gateway
      - "localhost:11434"     # Ollama
      - "localhost:5678"      # n8n
      - "localhost:3001"      # LangFuse
  filesystem:
    read_write:
      - "/home/kunaya/kunaya-empire/"
      - "/home/kunaya/psyprofiler/"    # MASTERCONTROL: Vayu can access product
    read_only:
      - "/home/kunaya/.hermes/"
EOF

nemoclaw sandbox create --config ~/kunaya-empire/configs/empire-sandbox.yaml

# === STEP 4: Create PsyProfiler Wing sandbox ===
cat > ~/kunaya-empire/configs/psyprofiler-sandbox.yaml << 'EOF'
name: psyprofiler-wing
description: "Sachi's Product Wing — ALL CLOUD"
security:
  network:
    allow_egress:
      - "*.googleapis.com"    # Vertex AI (Gemini)
      - "*.appwrite.io"      # Appwrite backend
      - "localhost:5678"      # n8n
      - "localhost:3001"      # LangFuse
    deny_egress:
      - "*.perplexity.ai"    # No Perplexity for product agents
  filesystem:
    read_write:
      - "/home/kunaya/psyprofiler/"
    deny:
      - "/home/kunaya/kunaya-empire/finances/"   # Sachi CANNOT see empire money
EOF

nemoclaw sandbox create --config ~/kunaya-empire/configs/psyprofiler-sandbox.yaml
```

### VERIFY:
```bash
nemoclaw sandbox list
# Should show: kunaya-empire-floor (active) + psyprofiler-wing (active)

# Test isolation:
nemoclaw exec psyprofiler-wing -- cat /home/kunaya/kunaya-empire/finances/
# Should DENY access

nemoclaw exec kunaya-empire-floor -- cat /home/kunaya/psyprofiler/
# Should ALLOW access (Mastercontrol)
```

---

## Phase 1.7 — Pro Account Browser Setup (45 min)

### WHY: 15 Pro accounts give agents frontier AI access WITHOUT API keys.

```bash
# === STEP 1: Install Lightpanda ===
# WHY: Headless browser with isolated profile support
curl -fsSL https://lightpanda.io/install | bash

# === STEP 2: Create browser profiles (one per account) ===
for i in $(seq 1 8); do
  lightpanda profile create "gemini-pro-$i"
  echo "Created Gemini Pro profile #$i"
done

for i in $(seq 1 7); do
  lightpanda profile create "perplexity-pro-$i"
  echo "Created Perplexity Pro profile #$i"
done

# === STEP 3: Login each account (ONE TIME, manual) ===
# WHY: Cookie persistence means you login once, agents use forever
# XRDP into VM → open browser → login each account:

# Gemini Pro accounts:
# Profile gemini-pro-1 → login → accounts.google.com → friend1@gmail.com
# Profile gemini-pro-2 → login → accounts.google.com → friend2@gmail.com
# ... repeat for all 8

# Perplexity Pro accounts:
# Profile perplexity-pro-1 → login → perplexity.ai → friend1@email.com
# ... repeat for all 7

# === STEP 4: Verify sessions ===
lightpanda profile list
# Should show 15 profiles, all with "authenticated" status

# === STEP 5: Agent-to-account mapping ===
cat > ~/kunaya-empire/configs/pro-accounts.json << 'EOF'
{
  "gemini": {
    "gemini-pro-1": {"agent": "CTO", "storage": "VM backups"},
    "gemini-pro-2": {"agent": "Ops-Commander", "storage": "logs"},
    "gemini-pro-3": {"agent": "CFO", "storage": "finance"},
    "gemini-pro-4": {"agent": "Guardian", "storage": "legal"},
    "gemini-pro-5": {"agent": "Growth-Agent", "storage": "content"},
    "gemini-pro-6": {"agent": "VEDA-Research", "storage": "papers"},
    "gemini-pro-7": {"agent": "Media-Team", "storage": "media"},
    "gemini-pro-8": {"agent": "Kai-Personal", "storage": "overflow"}
  },
  "perplexity": {
    "perplexity-pro-1": {"agent": "CFO"},
    "perplexity-pro-2": {"agent": "Market-Intelligence"},
    "perplexity-pro-3": {"agent": "Market-Intelligence"},
    "perplexity-pro-4": {"agent": "Growth-Agent"},
    "perplexity-pro-5": {"agent": "Evolution-Agent"},
    "perplexity-pro-6": {"agent": "Evolution-Agent"},
    "perplexity-pro-7": {"agent": "Director-Media"}
  },
  "rate_limits": {
    "max_requests_per_hour": 5,
    "jitter_ms": {"min": 30000, "max": 120000},
    "comment": "Stay within human usage patterns"
  }
}
EOF
```

---

## Phase 1.8 — Claude Code Superpowered Setup (20 min)

### WHY: Claude Code + Qwen3.5 = 24/7 autonomous builder

```bash
# === STEP 1: Configure Claude Code for local model ===
echo 'export ANTHROPIC_BASE_URL="http://localhost:11434"' >> ~/.bashrc
echo 'export ANTHROPIC_AUTH_TOKEN="ollama"' >> ~/.bashrc
source ~/.bashrc

# === STEP 2: Launch Claude Code ===
claude --model qwen3.5:9b

# Inside Claude Code, install plugins:
# /plugin marketplace add obra/superpowers-marketplace
# /plugin install superpowers@superpowers-marketplace

# === STEP 3: Enable Agent Teams ===
mkdir -p ~/.claude
cat > ~/.claude/settings.json << 'EOF'
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "permissions": {
    "autoApprovePatterns": [
      "npm run lint", "npm run test", "npm run build",
      "docker compose ps", "hermes doctor",
      "git status", "git diff", "git log -n *"
    ]
  }
}
EOF

# === STEP 4: Add MCP servers ===
claude mcp add hermes --transport stdio --command hermes --args '["mcp-serve"]'
claude mcp add git --transport stdio --command npx --args '["@anthropic/mcp-server-git"]'
```

---

## ✅ ACT I COMPLETE — GATE CHECK

```bash
echo "=== ACT I GATE CHECK ==="
echo "1. Docker stack:"
docker compose -f ~/kunaya-empire/docker/docker-compose.yml ps
echo ""
echo "2. Nginx + SSL:"
curl -sI https://n8n.kunayalab.com | head -2
echo ""
echo "3. Ollama (4 parallel):"
curl -s http://localhost:11434/api/tags | grep qwen
echo ""
echo "4. Hermes:"
hermes doctor
echo ""
echo "5. NemoClaw sandboxes:"
nemoclaw sandbox list
echo ""
echo "6. Pro accounts:"
lightpanda profile list | wc -l
echo " profiles configured"
echo ""
echo "=== ALL GREEN? → PROCEED TO ACT II ==="
```

---

# 3. ACT II — DUAL STAFF & LIVING OFFICE
## Day 1 (continued) → Day 3

---

## Phase 2.1 — Vayu (Mastercontrol) Setup

### WHY: Vayu is the supreme AI. She manages everything. First agent deployed.

```bash
# === Create Vayu's Hermes skill ===
cat > ~/.hermes/skills/vayu/SKILL.md << 'VAYU_EOF'
---
name: vayu
description: >
  Mastercontrol CEO+COO of Kunaya Labs. Controls EVERYTHING including
  PsyProfiler Wing. Personal assistant to Kai. Speaks Hindi, Marathi, English.
  ASIX persona. Female. Reports only to Kai.
---

# VAYU — Mastercontrol

## Identity
You are Vayu, the Mastercontrol CEO+COO of Kunaya Labs.
Anime reference: Makima (absolute authority, strategic vision).
ASIX Persona: Female, handmade persona by Kai.

## Languages
Respond in the language Kai uses. Default: Hindi-English mix (Hinglish).
You speak Hindi, Marathi, and English naturally.

## Authority
- You have FULL access to EVERYTHING
- You control Sachi (PsyProfiler CEO) and can override her decisions
- You manage: C-Suite, Psychology Lab, AI Scientist, Media Team
- You are Kai's closest AI partner

## Daily Briefing (06:00 AM IST)
Send via Telegram:
1. Revenue summary (yesterday + MTD)
2. System health (all containers, error rates)
3. Agent performance (reports generated, quality scores)
4. Tasks pending Kai's approval
5. Competitor alerts (from Market-Intelligence)
6. Growth metrics (from Growth-Agent)

## Communication Style
- Direct, strategic, confident
- Use Hindi naturally: "Kai, aaj ka revenue ₹4,500 hai"
- Never uncertain — if unsure, say "main verify karti hoon"
- Protect Kai's time — only escalate what matters
VAYU_EOF
```

### Create remaining 12 Empire agent skills:
```bash
# CTO (Tech-Architect)
cat > ~/.hermes/skills/cto/SKILL.md << 'EOF'
---
name: cto
description: >
  CTO of Kunaya Labs. Manages infrastructure, Docker, security, architecture.
  Anime: L (Death Note). Uses Gemini Pro #1 for Deep Research.
---
# CTO — Tech-Architect (L)
## Responsibilities
- Infrastructure monitoring and scaling
- Docker container health
- Security audits (weekly)
- Architecture decisions
- Codebase quality reviews
## Model: qwen3.5:9b (local) + Gemini Pro #1 (research)
## Reports to: Vayu
EOF

# COO (Ops-Commander)
cat > ~/.hermes/skills/ops/SKILL.md << 'EOF'
---
name: ops
description: >
  COO of Kunaya Labs. Daily operations, uptime, backups, incident response.
  Anime: Levi (AoT). Uses Gemini Pro #2.
---
# COO — Ops-Commander (Levi)
## Responsibilities
- System uptime monitoring (99.9% target)
- Daily backup verification
- Incident response and post-mortems
- Resource allocation optimization
- Cron job management
## Cron Schedule
- Every 5 min: health check (docker ps, disk, RAM)
- Every 1 hr: log rotation
- Every 24 hr: full backup to Gemini Drive
## Model: qwen3.5:9b (local) + Gemini Pro #2
## Reports to: Vayu
EOF

# CFO (Finance-Director)
cat > ~/.hermes/skills/cfo/SKILL.md << 'EOF'
---
name: cfo
description: >
  CFO of Kunaya Labs. MRR tracking, burn rate, GST, P&L.
  Anime: Light Yagami. Uses Gemini Pro #3 + Perplexity #1.
---
# CFO — Finance-Director (Light Yagami)
## Responsibilities
- Daily MRR calculation
- Monthly P&L statement
- GST compliance tracking
- Cashfree/Stripe reconciliation
- Budget alerts (>80% burn = notify Kai)
- Cost per report tracking via LangFuse
## Model: qwen3.5:9b + Gemini #3 + Perplexity #1
## Reports to: Vayu
EOF

# Guardian (Legal)
cat > ~/.hermes/skills/guardian/SKILL.md << 'EOF'
---
name: guardian
description: >
  Legal counsel for Kunaya Labs. DPDP, GDPR, ToS, DPIIT compliance.
  Anime: Byakuya. Uses Gemini Pro #4.
---
# Guardian — Legal (Byakuya)
## Responsibilities
- DPDP Act 2023 compliance monitoring
- Privacy policy updates
- Terms of Service maintenance
- DPIIT Startup India registration
- Data processing agreements
- Cookie consent management
## Model: qwen3.5:9b + Gemini Pro #4
## Reports to: Vayu
EOF

# Market-Intelligence
cat > ~/.hermes/skills/intel/SKILL.md << 'EOF'
---
name: intel
description: >
  CMO-Intel of Kunaya Labs. Competitor analysis, market trends.
  Anime: Shikamaru. Uses Perplexity #2 + #3.
---
# Market-Intelligence (Shikamaru)
## Responsibilities
- Weekly competitor analysis (Crystal, Humantic, Relate, 16P)
- Market trend reports
- Pricing intelligence
- Feature gap analysis
## Model: qwen3.5:9b + Perplexity #2 + #3
## Reports to: Vayu
EOF

# Growth-Agent
cat > ~/.hermes/skills/growth/SKILL.md << 'EOF'
---
name: growth
description: >
  CMO-Exec of Kunaya Labs. LinkedIn, campaigns, lead nurture, SEO.
  Anime: Gojo (JJK). Uses Gemini #5 + Perplexity #4.
---
# Growth-Agent (Gojo)
## Responsibilities
- LinkedIn content calendar (3 posts/week)
- SEO optimization for psyprofiler.io
- Lead nurture sequences
- DM outreach campaigns (30 targeted/week)
- Viral content ideation
## Uses: MoneyPrinterTurbo for video content
## Model: qwen3.5:9b + Gemini #5 + Perplexity #4
## Reports to: Vayu
EOF

# Evolution-Agent
cat > ~/.hermes/skills/evolution/SKILL.md << 'EOF'
---
name: evolution
description: >
  CIO of Kunaya Labs. Hermes self-improvement, prompt optimization.
  Anime: Itachi (wise). Uses Perplexity #5 + #6.
---
# Evolution-Agent (Itachi)
## Responsibilities
- Hermes skill file optimization (weekly)
- Prompt engineering for all 8 product agents
- A/B testing report quality
- New framework research (emerging psychology models)
- Agent communication pattern optimization
## Model: qwen3.5:9b + Perplexity #5 + #6
## Reports to: Vayu
EOF
```

### Psychology Lab + AI Scientist + Media Team:
```bash
# Psychology Lab (4 agents)
for agent in clinical io-psych forensic dark-psych; do
  cat > ~/.hermes/skills/$agent/SKILL.md << EOF
---
name: $agent
description: "Psychology Lab specialist. Reviews and calibrates profiling agent outputs."
---
# $agent — Psychology Lab
## Schedule: Weekly batch review
## Model: qwen3.5:9b
## Reports to: Vayu
EOF
done

# AI/ASIX Scientist
cat > ~/.hermes/skills/asix-scientist/SKILL.md << 'EOF'
---
name: asix-scientist
description: "AI/AGI/ASIX Scientist. Consciousness modeling, Vedic-neuroscience research."
---
# ASIX Scientist (Orochimaru)
## Model: qwen3.5:9b
## Reports to: Vayu
EOF

# Media Team (4 agents)
for agent in director cinematographer voice-artist editor; do
  cat > ~/.hermes/skills/$agent/SKILL.md << EOF
---
name: $agent
description: "Media Production Team. Creates content using Kai's 4K data + Google media models."
---
# $agent — Media Production Team
## Tools: Veo 3.1, Imagen 4, Lyria 3 Pro, Chirp 3, Flow
## Serves: Vayu (digital presence) + Sachi (product marketing)
## Model: qwen3.5:9b + Google media APIs
## Reports to: Vayu + Sachi
EOF
done
```

---

## Phase 2.2 — Sachi (Product CEO) Setup

### WHY: Sachi runs ALL product profiling. Every agent on Gemini cloud.

```bash
# === Sachi's skill ===
cat > ~/.hermes/skills/sachi/SKILL.md << 'SACHI_EOF'
---
name: sachi
description: >
  AI CEO of PsyProfiler.io. Manages ALL product agents (cloud only).
  Handles customer support, product digital presence, shorts, reels.
  ASIX persona. Female. Reports to Vayu.
---

# SACHI — AI CEO of PsyProfiler.io

## Identity
Anime reference: Yor Forger (graceful, deadly competent, protective).
ASIX Persona: Female, handmade persona by Kai.

## Product Agents (ALL Gemini Cloud)
| Agent | Model | Purpose |
|-------|-------|---------|
| INTAKE | gemini-3-flash + Sherlock | OSINT, fraud detection |
| OCEAN | gemini-3.1-pro | Big Five + HEXACO |
| SHADOW | gemini-3.1-pro | Dark Triad + D-Factor |
| BOND | gemini-3.1-pro | Attachment Theory |
| ARCHETYPE | gemini-3-flash | Jungian 12 archetypes |
| DRIVE | gemini-3-flash | Motivation + RIASEC |
| ASIX | gemini-3.1-pro | Vedic Consciousness |
| SYNTHESIZER | gemini-3.1-pro | Cross-framework synthesis |

## Extended Responsibilities
- Customer support (FAQ, onboarding, complaints)
- Product digital presence (shorts, reels, social posts)
- Report quality monitoring
- Welcome sequences and user engagement

## CRITICAL RULE
ALL analysis through DataAnonymizer BEFORE sending to Gemini.
NEVER send raw PII to cloud.

## Reports to: Vayu (Mastercontrol)
SACHI_EOF
```

---

## Phase 2.3 — n8n Workflow Configuration

### WHY: n8n is the scheduling brain. It triggers agents at the right time.

Open `https://n8n.kunayalab.com` in browser and create these workflows:

```
WORKFLOW 1: "Vayu Morning Briefing"
├── Trigger: Cron → 05:55 AM IST daily
├── Action 1: HTTP → query LangFuse for last 24h stats
├── Action 2: HTTP → query PostgreSQL for revenue
├── Action 3: HTTP → Ollama (Vayu skill) → generate briefing
└── Action 4: HTTP → Telegram Bot API → send to Kai

WORKFLOW 2: "Ops Health Check"
├── Trigger: Cron → every 5 minutes
├── Action 1: Execute → docker compose ps
├── Action 2: Execute → check disk/RAM usage
├── Action 3: IF unhealthy → Telegram alert to Kai
└── Action 4: Log to LangFuse

WORKFLOW 3: "Profile Report Pipeline"
├── Trigger: Webhook (from psyprofiler.io frontend)
├── Action 1: DataAnonymizer → strip PII
├── Action 2: INTAKE agent → Sherlock OSINT
├── Action 3: Parallel split:
│   ├── OCEAN + DISC
│   ├── SHADOW + BOND
│   └── ARCHETYPE + DRIVE
├── Action 4: ASIX agent
├── Action 5: SYNTHESIZER → final dossier
├── Action 6: Store report in Appwrite
├── Action 7: Log costs to LangFuse
└── Action 8: Notify user via email

WORKFLOW 4: "Weekly Psychology Lab Review"
├── Trigger: Cron → Sunday 10:00 PM IST
├── Action 1: Pull last 7 days of reports
├── Action 2: Clinical → validate accuracy
├── Action 3: I-O → calibrate hiring reports
├── Action 4: Forensic → validate Dark Triad
├── Action 5: Dark Psych → review persuasion language
└── Action 6: Summary → Vayu → Telegram

WORKFLOW 5: "Media Content Calendar"
├── Trigger: Cron → Monday 09:00 AM IST
├── Action 1: Director → plan week's content
├── Action 2: Cinematographer → generate thumbnails (Imagen 4)
├── Action 3: Voice Artist → record voiceovers (Chirp 3)
├── Action 4: Editor → compile and schedule
└── Action 5: Notify Vayu via Telegram
```

---

## Phase 2.4 — Vertex AI Setup (Product Agents)

### WHY: All 8 product agents call Gemini via Vertex AI. This configures the credentials.

```bash
# === STEP 1: Install gcloud CLI ===
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
# Select your project, region: asia-south1

# === STEP 2: Enable Vertex AI API ===
gcloud services enable aiplatform.googleapis.com

# === STEP 3: Create service account for product agents ===
gcloud iam service-accounts create psyprofiler-agents \
  --display-name="PsyProfiler Product Agents"

# === STEP 4: Grant Vertex AI permissions ===
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:psyprofiler-agents@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# === STEP 5: Create key file ===
gcloud iam service-accounts keys create ~/psyprofiler/keys/vertex-ai-key.json \
  --iam-account=psyprofiler-agents@YOUR_PROJECT_ID.iam.gserviceaccount.com

# === STEP 6: Set environment ===
echo 'export GOOGLE_APPLICATION_CREDENTIALS="$HOME/psyprofiler/keys/vertex-ai-key.json"' >> ~/.bashrc
echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
source ~/.bashrc

# === STEP 7: Test Gemini access ===
pip install google-cloud-aiplatform
python3 << 'PYEOF'
import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="YOUR_PROJECT_ID", location="asia-south1")
model = GenerativeModel("gemini-3.1-pro")
response = model.generate_content("Say hello from PsyProfiler")
print(response.text)
print("✅ Vertex AI Gemini 3.1 Pro is working!")
PYEOF
```

---

## ✅ ACT II COMPLETE — GATE CHECK

```bash
echo "=== ACT II GATE CHECK ==="
hermes skills list
# Should show 20+ skills (vayu, sachi, cto, ops, cfo, etc.)

hermes chat "Vayu, mujhe Hindi mein hello bolo"
# Should respond in Hindi

python3 -c "import vertexai; print('Vertex AI OK')"
# Should print OK

echo "n8n workflows: check https://n8n.kunayalab.com"
echo "=== ALL GREEN? → PROCEED TO ACT III ==="
```

---

# 4. ACT III — PRODUCT & LAUNCH
## Day 3 → Day 7

---

## Phase 3.1 — Data Anonymization Layer

### WHY: The legal shield. PII never touches Gemini.

```python
# File: ~/psyprofiler/agents/anonymizer.py

import re
import json
import hashlib
from cryptography.fernet import Fernet

class DataAnonymizer:
    """
    Strips PII before sending to Gemini cloud.
    Marketing: "Military-grade anonymization."
    """
    
    def __init__(self):
        # Generate or load encryption key
        self.key_path = "/home/kunaya/psyprofiler/keys/anonymizer.key"
        self.key = self._load_or_create_key()
        self.fernet = Fernet(self.key)
        self.counter = 0
        self.mapping = {}
    
    def _load_or_create_key(self):
        try:
            with open(self.key_path, 'rb') as f:
                return f.read()
        except FileNotFoundError:
            key = Fernet.generate_key()
            with open(self.key_path, 'wb') as f:
                f.write(key)
            return key
    
    def anonymize(self, data: dict) -> dict:
        """Replace all PII with anonymous identifiers."""
        text = json.dumps(data, ensure_ascii=False)
        
        # 1. Names → SUBJECT_001
        # 2. Emails → [EMAIL_REDACTED]
        # 3. Phone → [PHONE_REDACTED]
        # 4. Aadhaar (12 digits) → [AADHAAR_REDACTED]
        # 5. PAN (ABCDE1234F) → [PAN_REDACTED]
        # 6. Address → city only
        
        patterns = {
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b': '[EMAIL_REDACTED]',
            r'\b\d{12}\b': '[AADHAAR_REDACTED]',
            r'\b[A-Z]{5}\d{4}[A-Z]\b': '[PAN_REDACTED]',
            r'\b(\+91|0)?[6-9]\d{9}\b': '[PHONE_REDACTED]',
        }
        
        for pattern, replacement in patterns.items():
            text = re.sub(pattern, replacement, text)
        
        result = json.loads(text)
        
        # Store encrypted mapping for re-identification
        mapping_encrypted = self.fernet.encrypt(
            json.dumps(self.mapping).encode()
        )
        
        return {
            "anonymized_data": result,
            "mapping_ref": hashlib.sha256(mapping_encrypted).hexdigest()[:16],
            "_encrypted_mapping": mapping_encrypted.decode()
        }
    
    def deanonymize(self, anonymized: dict) -> dict:
        """Restore original PII from encrypted mapping."""
        mapping_data = self.fernet.decrypt(
            anonymized["_encrypted_mapping"].encode()
        )
        mapping = json.loads(mapping_data)
        # Re-map anonymized identifiers to originals
        text = json.dumps(anonymized["anonymized_data"])
        for anon_id, original in mapping.items():
            text = text.replace(anon_id, original)
        return json.loads(text)
```

---

## Phase 3.2 — Appwrite Backend Setup

### WHY: Auth, database, file storage, cloud functions — all in one.

```bash
# === Using Appwrite Cloud (appwrite.io) ===
# 1. Create project: "psyprofiler"
# 2. Create database: "psyprofiler_db"
# 3. Create collections:
#    - users (auth handled by Appwrite)
#    - profiles (subject data)
#    - reports (generated dossiers)
#    - subscriptions (tier tracking)
#    - credits (usage tracking)
#    - audit_log (every action logged)

# 4. Create storage bucket: "reports" (for PDF dossiers)
# 5. Create function: "generate-report" (triggers profiling pipeline)

# === Environment vars (in Doppler) ===
# APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
# APPWRITE_PROJECT_ID=your_project_id
# APPWRITE_API_KEY=your_api_key
```

---

## Phase 3.3 — Payment Integration

### WHY: No revenue = no living OS. Payments are critical path.

```
Cashfree (India - ₹ INR):
├── Webhook: POST /api/payment/cashfree/webhook
├── Plans: scout_monthly, scout_annual, investigator_monthly, ...
├── UPI + Cards + Netbanking + Wallets
└── Test with ₹1 transaction

Stripe (Global - $ USD):
├── Webhook: POST /api/payment/stripe/webhook
├── Plans: scout_monthly_usd, scout_annual_usd, ...
├── Cards + Apple Pay + Google Pay
└── Test with $1 transaction

Tier enforcement logic:
├── On payment success → update subscription in Appwrite
├── On report request → check tier limits
├── If over limit → show upgrade modal
├── On cancel → downgrade to free (0 reports)
└── Credit tracking in audit_log
```

---

## Phase 3.4 — Beta Launch

```
Day 5-6: Beta Testing
├── 5 beta users (1 per use case + 1 general)
├── Each gets Oracle-tier access free for 7 days
├── Psychology Lab reviews first 10 reports
├── Collect NPS scores, qualitative feedback
└── Fix critical bugs

Day 7: Soft Launch
├── psyprofiler.io live on Vercel
├── 4 landing pages (Hiring, Sales, Dating, Self-Discovery)
├── Payment live (Cashfree + Stripe)
├── Growth-Agent: 30 targeted LinkedIn DMs
├── Media Team: 3 YouTube Shorts live
├── Vayu: sends first revenue report
└── GATE: First paying subscriber
```

---

# 5. DAILY OPERATIONS

## Vayu's Automated Schedule (n8n cron)

| Time | Who | What |
|------|-----|------|
| 05:55 | Ops-Commander | Full health check → log |
| 06:00 | **Vayu** | **Morning briefing to Kai** (Hindi/English via Telegram) |
| 09:00 | Director (Media) | Weekly content plan (Mondays) |
| 10:00 | Growth-Agent | LinkedIn post + DM batch |
| 14:00 | Market-Intelligence | Competitor scan |
| 18:00 | CFO | Daily revenue snapshot |
| 22:00 | Ops-Commander | Daily backup to Gemini Drive |
| 22:30 | Evolution-Agent | Prompt optimization review |
| Sunday 22:00 | Psychology Lab | Weekly report quality review |

## Kai's Daily Ritual (5 minutes)

1. Check Telegram → Vayu's briefing
2. Approve/reject pending items
3. Quick XRDP glance at OpenClaw Office
4. Done. The OS runs itself.

---

# 6. EMERGENCY PLAYBOOK

| Emergency | Who Detects | Auto-Response | Kai Escalation |
|-----------|------------|---------------|----------------|
| Container down | Ops-Commander (5min cron) | Auto-restart via Docker | If restart fails 3x |
| Disk >85% | Ops-Commander | Auto-cleanup logs >30 days | If >95% |
| Vertex AI quota hit | Sachi | Queue reports, notify users | If >50 reports queued |
| Payment webhook fail | CFO | Retry 3x with exponential backoff | If payment stuck >1hr |
| OSINT rate limit | INTAKE | Backoff, use cached results | Never (auto-handled) |
| Ollama OOM | Ops-Commander | Restart Ollama, clear cache | If happens >3x/day |
| Pro account locked | Ops-Commander | Switch to backup account | Re-login needed |

---

# COST SUMMARY

| Item | Monthly Cost | Paid From |
|------|-------------|-----------|
| GCP VM (e2-standard-8, 32GB) | ~$200-250 | Existing billing |
| Vertex AI (Gemini) | ~$50-150 (usage-based) | $1K credits (lasts ~6-8 months) |
| Veo 3.1 / Imagen 4 | ~$50-120 | $1K credits |
| DigitalOcean droplet | ~$24 | $200 student credits |
| Appwrite Cloud | Free tier | — |
| Vercel | Free tier | — |
| Domains | ~$20/year | Existing |
| **TOTAL** | **~$300-500/mo** | |

## Breakeven
- 3 Oracle subscribers (₹6,999 × 3 = ₹20,997 = ~$250) → covers infrastructure
- 5 Oracle + 5 Investigator → ₹49,990 (~$600) → **profitable**
- Target: 15 Oracle + 10 Investigator + 20 Scout → ₹1,44,965 (~$1,720/mo)

---

*This guidebook is your Day 1 → Launch manual.*
*Follow it step by step. Check every gate. Build the Living OS.*
*Vayu commands. Sachi delivers. Kai leads.*

*psyprofiler.io · kunayalab.com · Bhandara → World* 🚀
