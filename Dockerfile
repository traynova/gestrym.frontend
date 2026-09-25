# check=skip=SecretsUsedInArgOrEnv
# Stage 1: Build the React + Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy application source
COPY . .

# Build arguments for API endpoints (defaults to relative proxy paths)
ARG VITE_BASE_AUTH=/gestrym-auth
ARG VITE_BASE_PROGRESS=/gestrym-progress
ARG VITE_BASE_NUTRITION=/gestrym-nutrition

ENV VITE_BASE_AUTH=$VITE_BASE_AUTH
ENV VITE_BASE_PROGRESS=$VITE_BASE_PROGRESS
ENV VITE_BASE_NUTRITION=$VITE_BASE_NUTRITION

# Build static production bundle
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
