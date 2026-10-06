# ─── Stage 1: Build React/Vite application ───────────────────────────────────
FROM node:22-alpine AS builder

LABEL maintainer="ARIS Team"
LABEL description="ARIS React 19 + Vite Frontend — Builder"

WORKDIR /app

# Install dependencies first (layer cache optimization)
COPY aris-frontend/package*.json ./
RUN npm ci

# Copy source and build
COPY aris-frontend/ .

# VITE_API_URL / VITE_API_BASE_URL is injected at build time from GitHub Actions secrets
# React/Vite bakes env vars into the static bundle at compile time
ARG VITE_API_BASE_URL
ARG VITE_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Stage 2: Serve static files with Nginx ──────────────────────────────────
FROM nginx:1.27-alpine

LABEL maintainer="ARIS Team"
LABEL description="ARIS React 19 Frontend — Production Nginx"

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy SPA-aware Nginx config
COPY docker/nginx/spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
