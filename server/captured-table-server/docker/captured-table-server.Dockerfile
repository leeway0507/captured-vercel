# Use the official Golang image as a builder
FROM golang:alpine as builder
WORKDIR /app
RUN apk update && apk upgrade && apk add --no-cache ca-certificates
RUN update-ca-certificates

# Copy the source from the current directory to the Working Directory inside the container
COPY . .


# Use a minimal base image
FROM scratch

# Set the working directory
WORKDIR /app

# Copy the compiled binary and CA certificates from the builder stage
COPY /compiler/GO_DEPLOYMENT .
COPY /lib/currency/data /Users/yangwoolee/repo/captured-all-in-one/captured-table-server/lib/currency/data
# COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/


# Copy additional files if needed
COPY .env.production go.mod /

# Expose the desired port
EXPOSE 8090

# Command to run the application
CMD ["./GO_DEPLOYMENT"]
