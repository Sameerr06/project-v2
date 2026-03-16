# ──────────────────────────────────────────────────────────────
# Frontend Dockerfile — React + Vite (multi-stage build)
# ──────────────────────────────────────────────────────────────

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .

# Set the API URL for the Docker environment (backend service name)
ENV VITE_API_URL=http://localhost:8000
RUN npm run build

# ── Stage 2: Serve with nginx ──────────────────────────────
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
