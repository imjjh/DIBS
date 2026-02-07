# 1. Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Run Stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# node:alpine 이미지에는 이미 UID/GID 1000인 'node' 사용자가 존재함
# 별도로 생성하지 않고 기존 'node' 사용자를 활용 (EC2 유저와 UID 일치)

# standalone 빌드 파일 복사 및 권한 설정
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000
CMD ["node", "server.js"]
