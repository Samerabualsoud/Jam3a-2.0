# DigitalOcean Deployment Guide for Jam3a-2.0

This guide provides specific instructions for deploying the Jam3a-2.0 application on DigitalOcean's App Platform.

## Prerequisites

- A DigitalOcean account
- GitHub repository access to Jam3a-2.0
- MongoDB database instance (can be MongoDB Atlas or DigitalOcean Managed MongoDB)

## Backend Deployment

### Step 1: Create a New App

1. Log in to your DigitalOcean account
2. Navigate to the App Platform section
3. Click "Create App"

### Step 2: Connect to GitHub

1. Select GitHub as your source
2. Connect your GitHub account if not already connected
3. Select the Jam3a-2.0 repository
4. Choose the `main` branch

### Step 3: Configure the App

1. Configure the source directory:
   - Set the source directory to `/server`
   - Select Node.js as the environment

2. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`

3. Set environment variables:
   ```
   PORT=8080 (App Platform uses this port by default)
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   EMAIL_FROM=Jam3a <noreply@jam3a.me>
   CORS_ORIGIN=https://your-frontend-app-url.ondigitalocean.app
   ```

4. Choose your plan:
   - Select Basic or Pro plan based on your needs
   - Configure auto-scaling if needed (Pro plan only)

5. Review and launch:
   - Review your configuration
   - Click "Launch App"

## Frontend Deployment

### Step 1: Create Another App

1. Navigate to the App Platform section
2. Click "Create App"

### Step 2: Connect to GitHub

1. Select the same Jam3a-2.0 repository
2. Choose the `main` branch

### Step 3: Configure the App

1. Configure the source directory:
   - Set the source directory to `/client`
   - Select Static Site as the environment

2. Configure build settings:
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`

3. Set environment variables:
   ```
   VITE_API_URL=https://your-backend-app-url.ondigitalocean.app
   VITE_GA_TRACKING_ID=your_google_analytics_id
   ```

4. Choose your plan:
   - Basic plan is usually sufficient for static sites

5. Review and launch:
   - Review your configuration
   - Click "Launch App"

## Connecting Frontend and Backend

After both apps are deployed:

1. Update the backend environment variables:
   - Go to your backend app settings
   - Update the CORS_ORIGIN to match your frontend app URL
   - Example: `CORS_ORIGIN=https://your-frontend-app-url.ondigitalocean.app`

2. Verify the frontend environment variables:
   - Go to your frontend app settings
   - Ensure VITE_API_URL points to your backend app URL
   - Example: `VITE_API_URL=https://your-backend-app-url.ondigitalocean.app`

3. Redeploy both apps to apply the changes

## Setting Up a Custom Domain (Optional)

1. Go to your app settings
2. Navigate to the Domains tab
3. Click "Add Domain"
4. Enter your domain name
5. Follow the instructions to configure DNS settings

## Monitoring and Logs

1. Access logs:
   - Go to your app's dashboard
   - Click on the "Logs" tab
   - View console logs, build logs, and deployment logs

2. Set up alerts:
   - Go to your app's dashboard
   - Click on the "Alerts" tab
   - Configure alerts for various metrics

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs for errors
   - Ensure all dependencies are properly listed in package.json
   - Verify that build commands are correct

2. **Runtime Errors**:
   - Check console logs for errors
   - Verify environment variables are correctly set
   - Ensure MongoDB connection string is valid

3. **CORS Issues**:
   - Verify CORS_ORIGIN in backend matches frontend URL exactly
   - Check for protocol mismatch (http vs https)

## Maintenance

### Updates and Rollbacks

1. To update your app:
   - Push changes to your GitHub repository
   - DigitalOcean will automatically rebuild and deploy

2. To rollback:
   - Go to your app's dashboard
   - Click on the "Deployments" tab
   - Select a previous deployment
   - Click "Revert to this Deployment"

## Conclusion

Following this guide should result in a successfully deployed Jam3a-2.0 application on DigitalOcean's App Platform with both frontend and backend components working together. The App Platform will automatically handle scaling, SSL certificates, and other infrastructure concerns, allowing you to focus on your application.
