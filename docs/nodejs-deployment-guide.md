# Node.js Deployment Guide for Jam3a-2.0

## Overview

This guide provides step-by-step instructions for deploying the Jam3a-2.0 frontend as a Node.js application on DigitalOcean App Platform.

## Prerequisites

- A DigitalOcean account
- Access to the Jam3a-2.0 GitHub repository
- Basic understanding of Node.js applications

## Step 1: Configure DigitalOcean App Platform

1. Log in to your DigitalOcean account
2. Navigate to the App Platform section
3. Click "Create App" or "Create" button
4. Select "GitHub" as the source
5. Connect your GitHub account if not already connected
6. Select the "Samerabualsoud/Jam3a-2.0" repository
7. Select the branch you want to deploy (usually "main")

## Step 2: Configure the App as a Web Service

1. In the "Resources" section, select the client directory:
   - Source Directory: `/client`
   - Type: **Web Service** (not Static Site)
   - HTTP Port: `8080`
   - Health Check Path: `/` (default)

2. Click "Next" to proceed to the Environment Variables section

## Step 3: Configure Environment Variables

1. In the "Environment Variables" section, add the following:
   - `VITE_API_URL`: Set this to your backend API URL (e.g., `https://your-backend-app.ondigitalocean.app`)
   - Add any other environment variables your application needs (all prefixed with `VITE_`)

2. Click "Next" to proceed to the Plan section

## Step 4: Select a Plan and Region

1. Choose an appropriate plan for your web service (Basic plan is usually sufficient)
2. Select a region close to your target audience
3. Click "Next" to proceed to the Review section

## Step 5: Review and Launch

1. Review all your settings
2. Give your app a name (e.g., "jam3a-frontend")
3. Click "Create Resources" to start the deployment process

## Step 6: Monitor Deployment

1. DigitalOcean will now build and deploy your Node.js application
2. You can monitor the build process in the "Deployments" tab
3. Once deployment is complete, DigitalOcean will provide a URL for your application

## Troubleshooting Common Issues

### Missing Start Script

If you see an error about a missing start script, verify that your package.json includes:
```json
"scripts": {
  "start": "vite --host 0.0.0.0 --port 8080",
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Connection Refused Errors

If you see "connection refused" errors, check:
1. The HTTP port in DigitalOcean matches the port in your start script (8080)
2. Your application is binding to 0.0.0.0 (all interfaces) and not localhost/127.0.0.1

### Build Failures

If your build fails, check the build logs for errors:
1. Navigate to the "Deployments" tab
2. Click on the failed deployment
3. Check the build logs for error messages

Common issues include:
- Missing dependencies
- Missing component files
- TypeScript errors

## Using Environment Variables

Access environment variables in your code using:

```typescript
// Import the environment utility
import ENV from '../utils/env';

// Use the API URL in your API calls
const response = await fetch(`${ENV.apiUrl}/your-endpoint`);
```

## Next Steps

After successful deployment, consider:
1. Setting up a custom domain
2. Configuring SSL/TLS for secure connections
3. Setting up automatic deployments from GitHub
4. Implementing monitoring and analytics
