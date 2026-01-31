# GCP Deployment Guide for Pati Devta Quiz

## Overview
This guide covers deploying the backend (FastAPI) on Google Cloud Platform with MongoDB Atlas.

---

## Option 1: Google Cloud Run (Recommended - Serverless)

### Prerequisites
- Google Cloud account with billing enabled
- `gcloud` CLI installed
- Docker installed locally
- MongoDB Atlas account (free tier available)

### Step 1: Set Up MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**: Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up
2. **Create a Free Cluster**: 
   - Choose "Shared" (free tier)
   - Select a region close to your users
3. **Create Database User**:
   - Go to Database Access → Add New Database User
   - Note down username and password
4. **Whitelist IP Address**:
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` to allow all IPs (for Cloud Run)
5. **Get Connection String**:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Create Dockerfile for Backend

Create `/app/backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Step 3: Deploy to Cloud Run

```bash
# Set your project ID
export PROJECT_ID="your-gcp-project-id"

# Authenticate with GCP
gcloud auth login
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Navigate to backend directory
cd /app/backend

# Build and deploy
gcloud run deploy pati-devta-api \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority" \
  --set-env-vars "DB_NAME=pati_devta_quiz" \
  --set-env-vars "CORS_ORIGINS=*"
```

### Step 4: Update Frontend Environment

After deployment, Cloud Run will give you a URL like:
`https://pati-devta-api-xxxxx-uc.a.run.app`

Update `/app/frontend/.env`:
```
REACT_APP_BACKEND_URL=https://pati-devta-api-xxxxx-uc.a.run.app
```

### Step 5: Deploy Frontend (Options)

**Option A: Firebase Hosting (Google)**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Build frontend
cd /app/frontend
yarn build

# Initialize Firebase
firebase login
firebase init hosting

# Deploy
firebase deploy
```

**Option B: Vercel (Easiest)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /app/frontend
vercel --prod
```

---

## Option 2: Google Compute Engine (VM)

### Step 1: Create VM Instance

```bash
# Create VM
gcloud compute instances create pati-devta-server \
  --zone=asia-south1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server

# Allow HTTP/HTTPS traffic
gcloud compute firewall-rules create allow-http \
  --allow tcp:80,tcp:443,tcp:8001 \
  --target-tags=http-server
```

### Step 2: SSH into VM and Set Up

```bash
# SSH into VM
gcloud compute ssh pati-devta-server --zone=asia-south1-a

# Update and install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nginx certbot python3-certbot-nginx

# Clone or upload your code
# Then set up Python environment
cd /app/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=pati_devta_quiz
CORS_ORIGINS=*
EOF

# Run with gunicorn
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001
```

### Step 3: Set Up Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/pati-devta
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/pati-devta /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Set Up SSL (Optional but Recommended)

```bash
sudo certbot --nginx -d your-domain.com
```

---

## Option 3: Google Kubernetes Engine (GKE) - For Scale

For larger deployments, use GKE with Kubernetes manifests. Contact for detailed K8s deployment guide.

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DB_NAME` | Database name | `pati_devta_quiz` |
| `CORS_ORIGINS` | Allowed origins | `*` or `https://yourdomain.com` |

---

## Cost Estimates (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Cloud Run | 2M requests free | ~$5-10 |
| MongoDB Atlas | 512MB free | ~$10+ |
| Compute Engine | $0 (f1-micro) | $5-15 |
| Firebase Hosting | 10GB free | ~$0.15/GB |

---

## Quick Commands Reference

```bash
# View Cloud Run logs
gcloud run services logs read pati-devta-api --region asia-south1

# Update Cloud Run
gcloud run deploy pati-devta-api --source . --region asia-south1

# View deployed URL
gcloud run services describe pati-devta-api --region asia-south1 --format='value(status.url)'
```

---

## Need Help?

- [Google Cloud Run Docs](https://cloud.google.com/run/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
