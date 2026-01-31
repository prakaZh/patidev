# --- Stage 1: Build the React Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run buildfff

# --- Stage 2: Build the Python Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Move the React build files into the backend static folder
# Note: This moves the 'dist' folder content into a folder called 'static' in your backend
COPY --from=frontend-builder /app/frontend/dist ./backend/static

# Set the working directory to backend to run the server
WORKDIR /app/backend

ENV PORT=8080
EXPOSE 8080

# Start the server (adjust 'server:app' if your Flask/FastAPI instance is named differently)
CMD ["gunicorn", "--bind", ":8080", "server:app"]
