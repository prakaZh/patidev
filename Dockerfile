# Stage 1: Build the Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
# Explicitly copy from the frontend subfolder
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve the App via Backend
FROM node:20-slim
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

# Copy backend source code
COPY backend/ ./backend/

# Move the frontend build into the backend's public folder
# Check if your frontend build folder is named 'dist' (Vite) or 'build' (CRA)
COPY --from=frontend-build /app/frontend/dist ./backend/public

# Cloud Run environment variables
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["node", "backend/index.js"]
