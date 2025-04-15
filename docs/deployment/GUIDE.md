# Jam3a Hub Deployment Guide

This comprehensive guide covers all aspects of deploying the Jam3a Hub application to Digital Ocean.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Deployment Process](#deployment-process)
- [Configuration Files](#configuration-files)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## Prerequisites

Before deploying the Jam3a Hub application, ensure you have:

1. A Digital Ocean account with billing set up
2. Access to the GitHub repository
3. Basic familiarity with Digital Ocean App Platform

## Deployment Process

### Step 1: Log in to Digital Ocean
1. Navigate to https://cloud.digitalocean.com/
2. Sign in with your Digital Ocean credentials
3. From the dashboard, click on "Apps" in the left sidebar

### Step 2: Create a New App
1. Click the "Create App" button
2. Select "GitHub" as your source provider
3. If prompted, authorize Digital Ocean to access your GitHub repositories
4. Search for and select the Jam3a Hub repository
5. Select the "main" branch
6. Click "Next"

### Step 3: Configure App Settings
1. In the "Resources" section:
   - Ensure the "Web Service" resource type is selected
   - Verify the source directory is set to `/` (root)
   - Confirm the Dockerfile path is set to `/Dockerfile`
   - Make sure HTTP port is set to `80`

2. Click "Next" to proceed to the "Environment Variables" section

### Step 4: Configure Environment Variables
1. Add the following environment variables:
   - `NODE_ENV`: Set value to `production`
   - `VITE_API_URL`: Set value to `${APP_URL}/api`
   - `NPM_CONFIG_FORCE`: Set value to `true`
   - `NPM_CONFIG_EXTRA_ARGS`: Set value to `--no-audit --no-fund --prefix=. install @radix-ui/react-separator@1.1.2`

2. Click "Next" to proceed to the "App Info" section

### Step 5: Configure App Info
1. Name your app (e.g., "jam3a-hub")
2. Select the appropriate region closest to your target users
3. Choose the "Basic" plan (or higher if needed)
4. Select "Basic" instance type (or higher if needed)
5. Set instance count to 1 (can be scaled later if needed)
6. Click "Next" to proceed to the "Review" section

### Step 6: Review and Launch
1. Review all settings to ensure they match the following:
   - Source: GitHub repository, main branch
   - Build Command: Uses Dockerfile at root
   - Environment Variables: NODE_ENV=production, etc.
   - Resources: Web service on port 80
   - Plan: Basic (or as selected)

2. Click "Create Resources" to start the deployment process

### Step 7: Monitor Deployment
1. Digital Ocean will now build and deploy your application
2. Monitor the build logs for any issues
3. The build and deployment process typically takes 5-10 minutes

## Configuration Files

The repository contains several important configuration files for deployment:

### Dockerfile
The Dockerfile is configured for a multi-stage build process:
1. First stage builds the application with Node.js
2. Second stage serves the built application with Nginx

Key features:
- Multiple layers of dependency installation to ensure '@radix-ui/react-separator' is properly installed
- Pre-build script to verify dependencies
- Nginx configuration for serving a Single Page Application
- Health check endpoint for monitoring

### digitalocean.app.yaml
This file configures the Digital Ocean App Platform service:
- Service name and region
- Environment variables for build and runtime
- Build and run commands
- HTTP port and routes
- Health check configuration
- Instance size and count

### .do/app.json
This file configures the Digital Ocean App Platform static site:
- Repository and branch information
- Build command and output directory
- Environment variables
- Routes and catchall document

### nginx.conf
This file configures the Nginx server:
- SPA routing with fallback to index.html
- Health check endpoint
- Caching for static assets
- Compression for improved performance

## Troubleshooting

### Common Issues and Solutions

#### Missing Dependencies
If you encounter errors related to missing dependencies during the build process:

1. Check the build logs to identify which dependency is missing
2. Verify that the environment variables for dependency installation are correctly set
3. If needed, update the Dockerfile to explicitly install the missing dependency

#### Build Process Failures
If the build process fails:

1. Check the build logs for specific error messages
2. Verify that the Dockerfile is being used (not buildpacks)
3. Ensure the build command in digitalocean.app.yaml is correct
4. Test the build process locally before deploying

#### Runtime Errors
If the application deploys but doesn't run correctly:

1. Check the application logs in the Digital Ocean dashboard
2. Verify all environment variables are correctly set
3. Check for any runtime errors in the browser console

## Maintenance

### Updating the Application

When you need to update your application:

1. Push changes to your GitHub repository
2. Digital Ocean will automatically detect changes and start a new deployment
3. Monitor the build and deployment process
4. Verify the updated application works as expected

### Scaling the Application

To scale your application:

1. In your app's dashboard, click on the "Settings" tab
2. Under "Resources", find your web service
3. Click "Edit" and adjust the instance count or size
4. Click "Save" to apply the changes

### Monitoring

Digital Ocean App Platform provides monitoring tools:

1. In your app's dashboard, click on the "Insights" tab
2. View metrics such as CPU usage, memory usage, and request rates
3. Set up alerts for critical metrics to be notified of potential issues
