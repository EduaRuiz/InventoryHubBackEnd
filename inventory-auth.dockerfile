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
RUN npm run build:aut

## Ejecución de la aplicación
FROM node:18-alpine3.20 AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.1.1 && pnpm install --prod
COPY --from=builder /app/dist/apps/inventory-auth .

# RUN mkdir -p /var/www/auth-app
# WORKDIR /var/www/auth-app
# RUN adduser -D authuser
# RUN chown -R authuser .
# USER authuser
# RUN npm cache clean --force

EXPOSE 3003
EXPOSE 81
CMD ["node", "main.js"]

# docker build -t auth-app -f inventory-auth.dockerfile .
# docker tag auth-app eduarandres/auth-app:latest
# docker push eduarandres/auth-app:latest