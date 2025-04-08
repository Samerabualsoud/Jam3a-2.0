# Environment Variables Guide for Jam3a-2.0

## Overview

This document explains how to configure environment variables for the Jam3a-2.0 application when deploying as a static site on DigitalOcean App Platform.

## Environment Variables for Static Site Deployment

When deploying a React application built with Vite as a static site, environment variables must be:

1. Prefixed with `VITE_` to be exposed to the frontend code
2. Set during the build process, as they are embedded into the static files
3. Configured in the DigitalOcean App Platform settings before deployment

## Required Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_URL` | URL of the backend API | `https://api.jam3a.com` or `https://your-backend-app.ondigitalocean.app` |
| `VITE_GA_TRACKING_ID` | Google Analytics tracking ID (optional) | `G-XXXXXXXXXX` |
| `VITE_PUBLIC_URL` | Base URL for assets (optional) | `/` |

## Setting Environment Variables in DigitalOcean

1. Go to your App in the DigitalOcean App Platform
2. Click on the "Settings" tab
3. Scroll down to "Environment Variables"
4. Add each variable with its key and value
5. Click "Save"
6. Redeploy your application for the changes to take effect

## Using Environment Variables in Code

We've created a utility to access environment variables consistently throughout the application:

```typescript
// Import the environment utility
import ENV from '../utils/env';

// Use environment variables in your components
function MyComponent() {
  const apiUrl = ENV.apiUrl;
  
  // Example API call using the environment variable
  const fetchData = async () => {
    const response = await fetch(`${apiUrl}/some-endpoint`);
    // ...
  };
  
  return (
    // Your component JSX
  );
}
```

## Troubleshooting

If your application cannot connect to the backend API after deployment:

1. Verify that `VITE_API_URL` is correctly set in your DigitalOcean environment variables
2. Ensure the backend API is running and accessible
3. Check for CORS issues if the frontend and backend are on different domains
4. Verify that the environment variable is being used correctly in your API calls

## Local Development

For local development, you can create a `.env.local` file in the client directory with your environment variables:

```
VITE_API_URL=http://localhost:5000
```

This file should not be committed to the repository as it may contain sensitive information.
