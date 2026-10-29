# --- Stage 1: Build Vite React Application ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies cleanly
RUN npm install

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx template into Nginx's template directory
# Render dynamically passes $PORT at runtime, which Nginx's entrypoint will substitute
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Default fallback port (Render typically uses 10000)
ENV PORT=10000
EXPOSE 10000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

