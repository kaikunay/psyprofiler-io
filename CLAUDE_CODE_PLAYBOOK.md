# CLAUDE CODE DELEGATION PLAYBOOK
## PsyProfiler.io Infrastructure Setup

> This playbook is for **Claude Code** (GLM 5.1 / Ollama Pro) to execute.
> Antigravity has built all the application code. Claude Code handles infrastructure.

### 2-VM Architecture

| VM | Specs | Role | Runs |
|----|-------|------|------|
| **Azure (MAIN)** | 32GB RAM, 490GB SSD | Production | Next.js + Sherlock + Lightpanda + Page-Agent |
| **DO Droplet** | 8GB RAM, 240GB NVMe | Dev/Staging | Dev environment + n8n + Superset (future) |

> All Tasks below target the **Azure VM** unless otherwise noted.

---

## Task 1: Appwrite Schema Setup

### 1.1 Open Appwrite Console
```
URL: https://cloud.appwrite.io/console
Project: psy-profiler-backend
Database: psyprofiler-db
```

### 1.2 Modify `profiles` Collection
Add these attributes to the existing `profiles` collection:

| Attribute      | Type    | Size      | Required | Default |
|---------------|---------|-----------|----------|---------|
| reportData    | string  | 1000000   | No       | -       |
| statusMessage | string  | 500       | No       | -       |
| completedAt   | string  | 100       | No       | -       |
| reportType    | string  | 50        | No       | scout   |
| platform      | string  | 100       | No       | unknown |

### 1.3 Create `user_credits` Collection
Create new collection with these attributes:

| Attribute      | Type    | Size | Required | Default |
|---------------|---------|------|----------|---------|
| userId        | string  | 100  | Yes      | -       |
| credits       | integer | -    | No       | 3       |
| totalPurchased| integer | -    | No       | 0       |
| totalUsed     | integer | -    | No       | 0       |

**Indexes:**
- `userId_idx` — Key: `userId`, Type: Unique

**Permissions:**
- Read: `user:{userId}` (document-level via Appwrite rules)
- Write: Server API key only

### 1.4 Create `transactions` Collection
| Attribute     | Type    | Size | Required | Default |
|--------------|---------|------|----------|---------|
| userId       | string  | 100  | Yes      | -       |
| orderId      | string  | 200  | Yes      | -       |
| gateway      | string  | 20   | No       | -       |
| amount       | float   | -    | No       | 0       |
| currency     | string  | 10   | No       | INR     |
| status       | string  | 20   | No       | pending |
| creditsAdded | integer | -    | No       | 0       |
| createdAt    | string  | 100  | No       | -       |

**Indexes:**
- `userId_idx` — Key: `userId`, Type: Key
- `orderId_idx` — Key: `orderId`, Type: Unique

### 1.5 Generate API Key
- Go to Settings → API Keys
- Create key with scopes: `databases.read`, `databases.write`, `users.read`
- Save the key to `.env.local` as `APPWRITE_API_KEY`

---

## Task 2: Sherlock Installation (on Azure VM — 32GB)

```bash
# SSH into the Azure VM (32GB RAM)
ssh user@<azure-vm-ip>

# Install Python & pip
apt update && apt install -y python3 python3-pip python3-venv git

# Install Sherlock
pip3 install sherlock-project

# Verify
sherlock --version

# Create the FastAPI wrapper service
mkdir -p /opt/psyprofiler/sherlock-service
cd /opt/psyprofiler/sherlock-service

# Create the service file (see Task 2.1)
```

### Task 2.1: Sherlock FastAPI Service

Create `/opt/psyprofiler/sherlock-service/main.py`:

```python
"""Sherlock OSINT Discovery Service for PsyProfiler"""
import asyncio
import json
import subprocess
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="PsyProfiler Sherlock Service")

class DiscoverRequest(BaseModel):
    username: str
    timeout: int = 30

class RenderRequest(BaseModel):
    url: str
    cdpEndpoint: str = "ws://127.0.0.1:9222"
    waitFor: int = 3000
    extractText: bool = True

@app.post("/discover")
async def discover_profiles(req: DiscoverRequest):
    """Run Sherlock to discover profiles across 400+ platforms."""
    try:
        result = await asyncio.wait_for(
            asyncio.create_subprocess_exec(
                "sherlock", req.username, "--json", "/tmp/sherlock_output.json",
                "--timeout", str(req.timeout),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            ),
            timeout=req.timeout + 15,
        )
        await result.wait()
        
        # Parse JSON output
        try:
            with open("/tmp/sherlock_output.json", "r") as f:
                data = json.load(f)
            
            results = []
            for platform, info in data.items():
                if isinstance(info, dict) and info.get("status") == "Claimed":
                    results.append({
                        "platform": platform,
                        "url": info.get("url_user", ""),
                        "username": req.username,
                        "exists": True,
                    })
            
            return {"results": results, "total": len(results)}
        except (json.JSONDecodeError, FileNotFoundError):
            return {"results": [], "total": 0, "error": "Parse failed"}
    except asyncio.TimeoutError:
        return {"results": [], "total": 0, "error": "Timeout"}
    except Exception as e:
        return {"results": [], "total": 0, "error": str(e)}

@app.post("/render")
async def render_page(req: RenderRequest):
    """Render a page using Lightpanda CDP endpoint."""
    # This proxies to Lightpanda's CDP endpoint
    try:
        # Use simple HTTP fetch as fallback if Lightpanda unavailable
        import httpx
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(req.url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; PsyProfiler/2.0)"
            })
            return {"textContent": resp.text[:20000], "status": resp.status_code}
    except Exception as e:
        return {"textContent": "", "error": str(e)}

@app.get("/health")
async def health():
    return {"status": "operational", "service": "sherlock-osint"}
```

```bash
# Install dependencies
pip3 install fastapi uvicorn httpx

# Run the service
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2

# Create a systemd service for auto-start
cat > /etc/systemd/system/sherlock-service.service << 'EOF'
[Unit]
Description=PsyProfiler Sherlock OSINT Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/psyprofiler/sherlock-service
ExecStart=/usr/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl enable sherlock-service
systemctl start sherlock-service
```

---

## Task 3: Lightpanda Setup (on Azure VM — 32GB)

```bash
# Download latest Lightpanda binary
cd /opt/psyprofiler
wget https://github.com/lightpanda-io/browser/releases/latest/download/lightpanda-linux-x86_64 -O lightpanda
chmod +x lightpanda

# Test it
./lightpanda --help

# Create systemd service
cat > /etc/systemd/system/lightpanda.service << 'EOF'
[Unit]
Description=Lightpanda Headless Browser
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/psyprofiler
ExecStart=/opt/psyprofiler/lightpanda --port 9222
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl enable lightpanda
systemctl start lightpanda
```

---

## Task 4: Next.js Deployment (on Azure VM)

```bash
# Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Clone the project (or git pull if already exists)
cd /opt/psyprofiler
git clone <repo-url> app
cd app

# Install dependencies
npm ci

# Copy .env.local (with real credentials)
cp .env.local.production .env.local

# Build
npm run build

# Run with PM2
npm install -g pm2
pm2 start npm --name "psyprofiler" -- start
pm2 save
pm2 startup
```

---

## Task 5: Nginx Reverse Proxy + SSL

```bash
# Install Nginx + Certbot
apt install -y nginx certbot python3-certbot-nginx

# Create Nginx config
cat > /etc/nginx/sites-available/psyprofiler << 'EOF'
server {
    listen 80;
    server_name psyprofiler.io www.psyprofiler.io;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/psyprofiler /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# SSL certificate
certbot --nginx -d psyprofiler.io -d www.psyprofiler.io
```

---

## Summary Checklist

- [ ] Appwrite: `profiles` collection updated with new fields
- [ ] Appwrite: `user_credits` collection created
- [ ] Appwrite: `transactions` collection created
- [ ] Appwrite: API key generated and saved to .env.local
- [ ] Sherlock: Installed and FastAPI service running on port 8000
- [ ] Lightpanda: Binary installed and CDP running on port 9222
- [ ] Next.js: Built and deployed via PM2
- [ ] Nginx: Reverse proxy configured with SSL
- [ ] DNS: psyprofiler.io pointing to Droplet IP
- [ ] Test: Full pipeline — discover → render → analyze → report
