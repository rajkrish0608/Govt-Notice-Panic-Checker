# Multi-stage build for React + Node.js

# Stage 1: Build React App
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app

# Copy package files for backend
COPY package.json package-lock.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy backend source
COPY server/ ./server/
COPY .env ./

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Environment variables (default)
ENV PORT=3000
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server/index.js"]
