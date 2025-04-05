# Digital Ocean Deployment Guide for Jam3a

This guide provides specific instructions for deploying the Jam3a application to Digital Ocean App Platform.

## Prerequisites

- A Digital Ocean account
- Git repository with your Jam3a project

## Deployment Steps

### 1. Prepare Your Application

Ensure your application is ready for deployment:

- The server.js file is configured to listen on all network interfaces (`0.0.0.0`)
- The default port is set to 8080 (Digital Ocean's preferred port)
- Security headers are properly configured
- The package.json has the correct start script: `"start": "node server.js"`

### 2. Deploy to Digital Ocean App Platform

#### Option 1: Using the Digital Ocean Dashboard

1. Log in to your [Digital Ocean Dashboard](https://cloud.digitalocean.com/)
2. Navigate to the App Platform section
3. Click "Create App"
4. Connect your GitHub repository
5. Configure your app with the following settings:
   - Source Directory: `/`
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
   - HTTP Port: `8080`
6. Add environment variables:
   - `NODE_ENV`: `production`
7. Click "Next" and then "Create Resources"

#### Option 2: Using the Digital Ocean CLI

1. Install the Digital Ocean CLI:
   ```
   brew install doctl  # macOS
   # or
   snap install doctl  # Ubuntu
   ```

2. Authenticate with your API token:
   ```
   doctl auth init
   ```

3. Deploy using the configuration file:
   ```
   doctl apps create --spec digitalocean.config.json
   ```

### 3. Verify Deployment

After deployment:

1. Check the deployment logs for any errors
2. Verify that the application is running by visiting the provided URL
3. Test all routes to ensure client-side routing is working correctly

### 4. Troubleshooting

If you encounter a blank screen:

1. Check the application logs in the Digital Ocean dashboard
2. Verify that the server is listening on the correct port (8080)
3. Ensure the server is listening on all network interfaces (`0.0.0.0`)
4. Check that all routes are being redirected to index.html
5. Verify that the build process completed successfully

### 5. Scaling and Monitoring

- Use Digital Ocean's built-in monitoring to track application performance
- Configure auto-scaling if needed for higher traffic
- Set up alerts for any critical issues

## Contact Support

If you continue to experience issues with deployment, please contact support at support@jam3a.sa or open an issue on the GitHub repository.
