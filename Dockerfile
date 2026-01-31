# Stage 1: Build the Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Backend & Final Image
FROM node:20-slim
WORKDIR /app
# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

# Copy backend source code
COPY backend/ ./backend/

# Copy the built frontend files into the backend's static/public folder
# Note: Adjust './backend/public' if your Express server uses a different static folder name
COPY --from=frontend-build /app/frontend/dist ./backend/public

# Set environment variables
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "backend/index.js"]
