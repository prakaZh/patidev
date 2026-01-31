# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-build
WORKDIR /app
# Note: Copying from the frontend subfolder
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# --- Stage 2: Final Production Image ---
FROM node:20-slim
WORKDIR /app
# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production
COPY backend/ ./backend/

# Move frontend 'dist' to backend 'public' folder
COPY --from=frontend-build /app/frontend/dist ./backend/public

ENV PORT=8080
EXPOSE 8080

# Start from the backend file
CMD ["node", "backend/index.js"]
