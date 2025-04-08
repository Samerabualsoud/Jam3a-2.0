# DigitalOcean Static Site Deployment Guide for Jam3a-2.0

## Overview

This guide provides step-by-step instructions for deploying the Jam3a-2.0 frontend as a static site on DigitalOcean App Platform. This approach is more reliable than running a Node.js server for frontend hosting.

## Step 1: Create a New App on DigitalOcean App Platform

1. Log in to your DigitalOcean account
2. Navigate to the App Platform section
3. Click "Create App" or "Create" button
4. Select "GitHub" as the source
5. Connect your GitHub account if not already connected
6. Select the "Samerabualsoud/Jam3a-2.0" repository
7. Select the branch you want to deploy (usually "main")

## Step 2: Configure the App as a Static Site

1. In the "Resources" section, select the client directory:
   - Source Directory: `/client`
   - Type: **Static Site** (this is crucial - do not select Web Service)
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`

2. Click "Next" to proceed to the Environment Variables section

## Step 3: Configure Environment Variables

1. In the "Environment Variables" section, add the following:
   - `VITE_API_URL`: Set this to your backend API URL (e.g., `https://your-backend-app.ondigitalocean.app`)
   - Add any other environment variables your application needs (all prefixed with `VITE_`)

2. Click "Next" to proceed to the Plan section

## Step 4: Select a Plan and Region

1. Choose an appropriate plan for your static site (Basic plan is usually sufficient)
2. Select a region close to your target audience
3. Click "Next" to proceed to the Review section

## Step 5: Review and Launch

1. Review all your settings
2. Give your app a name (e.g., "jam3a-frontend")
3. Click "Create Resources" to start the deployment process

## Step 6: Monitor Deployment

1. DigitalOcean will now build and deploy your static site
2. You can monitor the build process in the "Deployments" tab
3. Once deployment is complete, DigitalOcean will provide a URL for your static site

## Step 7: Test Your Deployment

1. Visit the provided URL to verify your frontend is working correctly
2. Test API calls to ensure the frontend can communicate with your backend
3. Check that all features are working as expected

## Troubleshooting Common Issues

### Build Failures

If your build fails, check the build logs for errors:
1. Navigate to the "Deployments" tab
2. Click on the failed deployment
3. Check the build logs for error messages

Common issues include:
- Missing dependencies
- Build script errors
- Environment variable issues

### API Connection Issues

If your frontend cannot connect to the backend:
1. Verify that `VITE_API_URL` is correctly set in your environment variables
2. Ensure the backend API is running and accessible
3. Check for CORS issues if the frontend and backend are on different domains

### Custom Domain Setup

To use a custom domain:
1. Go to the "Settings" tab of your app
2. Click "Edit" in the "Domains" section
3. Add your custom domain
4. Follow the instructions to configure DNS settings

## Next Steps

After successful deployment, consider:
1. Setting up a custom domain
2. Configuring SSL/TLS for secure connections
3. Setting up automatic deployments from GitHub
4. Implementing monitoring and analytics

## Using Environment Variables in Your Code

We've added an environment variable utility to make it easy to access your backend API URL:

```typescript
// Import the environment utility
import ENV from '../utils/env';

// Use the API URL in your API calls
const response = await fetch(`${ENV.apiUrl}/your-endpoint`);
```

This ensures your application will work correctly in both development and production environments.
