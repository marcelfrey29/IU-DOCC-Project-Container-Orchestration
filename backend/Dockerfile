# Builder
FROM golang:1.24.5-bookworm AS builder
WORKDIR /app
COPY go.mod go.sum /app/
RUN go mod download
COPY *.go /app/
RUN go build -o app

# Container
FROM debian:12.10-slim
USER nobody
WORKDIR /app
COPY --from=builder /app/app .
CMD [ "./app" ]
