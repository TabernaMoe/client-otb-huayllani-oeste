FROM node:22.18.0-alpine AS base

WORKDIR /app
COPY package*.json ./

    # ─── Etapa desarrollo ─────────────────────────
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ─── Etapa build ──────────────────────────────
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# ─── Etapa producción ─────────────────────────
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]