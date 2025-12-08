# Base image légère
FROM node:20-alpine AS base
WORKDIR /app/front
RUN apk add --no-cache libc6-compat wget

# Builder - build de l'application Next.js static export
FROM base AS builder
COPY front/package.json front/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY front/ ./
ENV NODE_ENV=production
RUN npm run build

# Production - contient uniquement les fichiers statiques exportés avec Nginx
FROM nginx:alpine AS production
COPY --from=builder --chown=nginx:nginx /app/front/out /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /app/front/public /usr/share/nginx/html/public
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    chmod -R 755 /var/cache/nginx
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

# Development - image avec hot-reload
FROM base AS dev
ENV NODE_ENV=development
COPY front/package.json front/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY front/ ./
EXPOSE 3000
CMD ["npm", "run", "dev"]