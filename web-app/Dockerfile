# Builder Image
FROM node:22.9.0-bookworm AS builder
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
RUN npm run build

# Container
FROM nginxinc/nginx-unprivileged:1.27.5-bookworm
COPY --from=builder /app/dist /usr/share/nginx/html
USER nginx
