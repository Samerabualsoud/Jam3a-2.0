#!/bin/bash

# Jam3a-2.0 Digital Ocean Deployment Script
# This script automates the deployment process to Digital Ocean App Platform

# Exit on error
set -e

echo "=== Jam3a-2.0 Digital Ocean Deployment ==="
echo "Starting deployment process..."

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "Error: doctl is not installed. Please install Digital Ocean CLI first."
    echo "Visit: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if user is authenticated with Digital Ocean
if ! doctl account get &> /dev/null; then
    echo "Error: Not authenticated with Digital Ocean."
    echo "Please run 'doctl auth init' and try again."
    exit 1
fi

# Validate deployment files
echo "Validating deployment configuration files..."
if [ ! -f "./deployment/app.yaml" ]; then
    echo "Error: app.yaml not found in deployment directory."
    exit 1
fi

if [ ! -f "./deployment/.do/deploy.template.yaml" ]; then
    echo "Error: deploy.template.yaml not found in deployment/.do directory."
    exit 1
fi

# Build the application
echo "Building application..."
npm install
npm run build

# Run tests to ensure everything is working
echo "Running tests..."
cd server && npm test

# If tests pass, proceed with deployment
if [ $? -eq 0 ]; then
    echo "Tests passed. Proceeding with deployment..."
    
    # Deploy using App Platform
    echo "Deploying to Digital Ocean App Platform..."
    doctl apps create --spec ./deployment/app.yaml
    
    echo "Deployment initiated successfully!"
    echo "You can check the status with: doctl apps list"
    echo "Once deployed, your app will be available at the URL provided by Digital Ocean."
else
    echo "Tests failed. Deployment aborted."
    exit 1
fi

echo "=== Deployment process completed ==="
