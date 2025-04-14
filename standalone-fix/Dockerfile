# Use Node.js LTS version
FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install root dependencies and explicitly install the missing dependency
RUN npm install && npm install @radix-ui/react-separator@1.1.2

# Copy client package.json
COPY client/package*.json ./client/

# Install client dependencies
WORKDIR /app/client
RUN npm install && npm install @radix-ui/react-separator@1.1.2

# Return to root directory
WORKDIR /app

# Copy source code
COPY . .

# Create a pre-build script to ensure dependencies are installed
RUN echo "#!/bin/sh\nnpm install @radix-ui/react-separator@1.1.2\ncd client && npm install @radix-ui/react-separator@1.1.2\ncd .." > ensure-deps.sh && chmod +x ensure-deps.sh

# Run the pre-build script
RUN ./ensure-deps.sh

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=base /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
