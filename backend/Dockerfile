# Builder
FROM golang:1.23.2-bookworm AS builder
WORKDIR /app
COPY go.mod go.sum /app/
RUN go mod download
COPY *.go /app/
RUN go build -o app

# Container
FROM debian:12.7-slim
WORKDIR /app
COPY --from=builder /app/app .
CMD [ "./app" ]
