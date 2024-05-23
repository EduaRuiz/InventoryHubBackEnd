## Dependencias solo si hay nuevas dependencias
FROM node:18-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.1.1 && pnpm install --frozen-lockfile

## Construcción de la aplicación
FROM node:18-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:pro

## Ejecución de la aplicación
FROM node:18-alpine3.20 AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.1.1 && pnpm install --prod
COPY --from=builder /app/dist/apps/inventory-proxy .

# RUN mkdir -p /var/www/proxy-app
# WORKDIR /var/www/proxy-app
# RUN adduser -D authuser
# RUN chown -R authuser .
# USER authuser
# RUN npm cache clean --force

EXPOSE 3002
CMD ["node", "main.js"]

# docker build -t proxy-app -f inventory-proxy.dockerfile .
# docker tag proxy-app eduarandres/proxy-app:latest
# docker push eduarandres/proxy-app:latest