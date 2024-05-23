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
RUN npm run build:com

## Ejecución de la aplicación
FROM node:18-alpine3.20 AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.1.1 && pnpm install --prod
COPY --from=builder /app/dist/apps/inventory-command .

# RUN mkdir -p /var/www/command-app
# WORKDIR /var/www/command-app
# RUN adduser -D authuser
# RUN chown -R authuser .
# USER authuser
# RUN npm cache clean --force

EXPOSE 3000
CMD ["node", "main.js"]

# docker build -t command-app -f inventory-command.dockerfile .
# docker tag command-app eduarandres/command-app:latest
# docker push eduarandres/command-app:latest