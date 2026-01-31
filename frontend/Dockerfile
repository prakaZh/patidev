# Build stage - CHANGED from 18 to 20
FROM node:20-alpine as build
WORKDIR /app

# Install dependencies
COPY package.json ./
# Run yarn install (this will generate a fresh lockfile)
RUN yarn install

# Copy source code
COPY . .

# --- FIX: Prevent warnings from breaking the build ---
ENV CI=false 
# ---------------------------------------------------

# Build argument for backend URL
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Build the app
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]