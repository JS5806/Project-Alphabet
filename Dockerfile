# Build Stage (예: Go Lang 기반 가정)
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .

# Runtime Stage
FROM alpine:3.18
WORKDIR /app
# 보안을 위해 Root가 아닌 사용자로 실행
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/main .

# 환경변수는 런타임/배포 시 주입
ENV DB_HOST=localhost
ENV DB_PORT=5432

EXPOSE 8080
CMD ["./main"]