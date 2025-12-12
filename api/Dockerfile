# Base image légère
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat wget

# Builder - build de l'application
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build && \
    npm prune --production --legacy-peer-deps

# Production - image minimale
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache wget dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
# USER nestjs
EXPOSE 3001
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/main.js"]

# Development - image avec hot-reload
FROM base AS dev
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]