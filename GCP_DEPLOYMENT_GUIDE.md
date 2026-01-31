# Pati Devta Quiz - GCP Cloud Run Deployment

This guide explains how to deploy this app to Google Cloud Run.

## Architecture
- **Backend**: FastAPI (Python) → Cloud Run
- **Frontend**: React → Firebase Hosting / Cloud Run
- **Database**: MongoDB Atlas (cloud)

---

## Step 1: Setup MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user with password
4. Whitelist IP: `0.0.0.0/0` (allow all for Cloud Run)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/pati_devta_db`

---

## Step 2: Prepare GitHub Repository

Your repo structure should be:
```
your-repo/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
└── README.md
```

Create `.env.example` files (DO NOT commit actual .env):

**backend/.env.example:**
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=pati_devta_db
CORS_ORIGINS=https://your-frontend-url.web.app,https://your-cloudrun-url.run.app
```

**frontend/.env.example:**
```
REACT_APP_BACKEND_URL=https://patidevgcp-xxxxx-el.a.run.app
```

---

## Step 3: Deploy Backend to Cloud Run

### Option A: Deploy from Source (Recommended)

```bash
# Navigate to backend directory
cd backend

# Authenticate with GCP
gcloud auth login
gcloud config set project plan-my-concert

# Deploy to existing Cloud Run service
gcloud run deploy patidevgcp \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "MONGO_URL=mongodb+srv://USER:PASS@cluster.mongodb.net/" \
  --set-env-vars "DB_NAME=pati_devta_db" \
  --set-env-vars "CORS_ORIGINS=*"
```

### Option B: Deploy using Cloud Build + GitHub

1. Connect GitHub repo to Cloud Build:
   - Go to [Cloud Build](https://console.cloud.google.com/cloud-build)
   - Click "Triggers" → "Create Trigger"
   - Connect your GitHub repository
   
2. Create `cloudbuild.yaml` in your repo root:

```yaml
steps:
  # Build the backend Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/patidevgcp-backend', './backend']
  
  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/patidevgcp-backend']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'patidevgcp'
      - '--image'
      - 'gcr.io/$PROJECT_ID/patidevgcp-backend'
      - '--region'
      - 'asia-south1'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/patidevgcp-backend'
```

3. Set environment variables in Cloud Run Console:
   - Go to your service → "Edit & Deploy New Revision"
   - Under "Variables & Secrets", add:
     - `MONGO_URL`: Your MongoDB Atlas connection string
     - `DB_NAME`: `pati_devta_db`
     - `CORS_ORIGINS`: `*` or your frontend URLs

---

## Step 4: Deploy Frontend

### Option A: Firebase Hosting (Recommended)

```bash
cd frontend

# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# When prompted:
# - Select your project (plan-my-concert)
# - Public directory: build
# - Single-page app: Yes
# - Don't overwrite index.html

# Set environment variable
echo "REACT_APP_BACKEND_URL=https://patidevgcp-xxxxx-el.a.run.app" > .env.production

# Build and deploy
yarn build
firebase deploy --only hosting
```

### Option B: Cloud Run (Full-stack on Cloud Run)

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:
```nginx
server {
    listen 8080;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Deploy:
```bash
cd frontend
gcloud run deploy patidevgcp-frontend \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "REACT_APP_BACKEND_URL=https://patidevgcp-xxxxx-el.a.run.app"
```

---

## Step 5: Update CORS

After deploying frontend, update backend CORS:

```bash
gcloud run services update patidevgcp \
  --region asia-south1 \
  --set-env-vars "CORS_ORIGINS=https://your-frontend-url.web.app"
```

---

## Quick Commands Reference

```bash
# View service URL
gcloud run services describe patidevgcp --region asia-south1 --format='value(status.url)'

# View logs
gcloud run services logs read patidevgcp --region asia-south1

# Update environment variable
gcloud run services update patidevgcp --region asia-south1 --set-env-vars "KEY=value"

# Redeploy
gcloud run deploy patidevgcp --source ./backend --region asia-south1
```

---

## Troubleshooting

1. **CORS errors**: Make sure `CORS_ORIGINS` includes your frontend URL
2. **Database connection fails**: Check MongoDB Atlas IP whitelist (0.0.0.0/0)
3. **Cold start slow**: Consider setting minimum instances to 1
4. **Build fails**: Check `requirements.txt` has all dependencies

---

## Cost Estimate (Monthly)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Cloud Run | 2M requests | First 180,000 vCPU-seconds free |
| MongoDB Atlas | 512MB | M0 cluster is free forever |
| Firebase Hosting | 10GB/month | Free tier sufficient for most |

Your service: **patidevgcp** in **asia-south1** region, project: **plan-my-concert**
