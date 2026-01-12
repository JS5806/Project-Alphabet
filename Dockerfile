# Build Stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ .

# Production Stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

# 환경변수 설정 (실제 런타임시 주입 권장)
ENV PORT=3000
EXPOSE 3000

# 실행
CMD ["node", "app.js"]