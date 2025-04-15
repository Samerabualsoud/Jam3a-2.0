# Jam3a Deployment Guide

This comprehensive guide covers all aspects of deploying the Jam3a application to various platforms, with a focus on Digital Ocean deployment.

## Table of Contents
- [Digital Ocean Deployment](#digital-ocean-deployment)
- [Deployment Troubleshooting](#deployment-troubleshooting)
- [Vercel Deployment](#vercel-deployment)
- [Environment Configuration](#environment-configuration)

## Digital Ocean Deployment

### Prerequisites
- A Digital Ocean account with billing set up
- Access to your GitHub repository (Jam3a)
- Basic familiarity with Digital Ocean App Platform

### Step 1: Log in to Digital Ocean
1. Navigate to https://cloud.digitalocean.com/
2. Sign in with your Digital Ocean credentials
3. From the dashboard, click on "Apps" in the left sidebar

### Step 2: Create a New App
1. Click the "Create App" button
2. Select "GitHub" as your source provider
3. If prompted, authorize Digital Ocean to access your GitHub repositories
4. Search for and select your Jam3a repository
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
   - Add any other environment variables your application requires

2. Click "Next" to proceed to the "App Info" section

### Step 5: Configure App Info
1. Name your app (e.g., "jam3a-app")
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
3. Pay special attention to the dependency installation phase
4. The build and deployment process typically takes 5-10 minutes

## Deployment Troubleshooting

### Common Issues and Solutions

#### Missing Dependencies
If you encounter errors related to missing dependencies during the build process:

1. Ensure all dependencies are properly listed in package.json files
2. Check that the Dockerfile correctly installs dependencies from both root and client directories
3. Verify that the prebuild script in package.json includes installation of critical dependencies
4. Check for any version conflicts between dependencies

#### Build Process Failures
If the build process fails:

1. Check the build logs for specific error messages
2. Verify that the build command in digitalocean.app.yaml is correct
3. Ensure the Dockerfile is properly configured for your application structure
4. Test the build process locally before deploying

#### Runtime Errors
If the application deploys but doesn't run correctly:

1. Check the application logs in the Digital Ocean dashboard
2. Verify all environment variables are correctly set
3. Ensure the application is properly configured for production environment
4. Check for any runtime errors in the browser console

## Vercel Deployment

For deploying to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set up environment variables
4. Deploy the application

## Environment Configuration

Ensure these environment variables are properly set for production deployment:

- `NODE_ENV`: Set to `production`
- `VITE_API_URL`: API endpoint URL
- `DATABASE_URL`: Connection string for your database
- `JWT_SECRET`: Secret key for JWT authentication
- `EMAIL_SERVICE_API_KEY`: API key for email service (if applicable)

For local development, create a `.env` file in the root directory with these variables.
