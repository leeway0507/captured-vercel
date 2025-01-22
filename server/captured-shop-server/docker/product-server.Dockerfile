FROM golang:alpine as builder
WORKDIR /app
RUN apk update && apk upgrade && apk add --no-cache ca-certificates
RUN update-ca-certificates

FROM scratch

# Copy our compiled executable from the last stage.
COPY compiler/GO_DEPLOYMENT .
COPY .env.production /
COPY go.mod /
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Run application and expose port 8080.
EXPOSE 8080
CMD ["./GO_DEPLOYMENT"]
