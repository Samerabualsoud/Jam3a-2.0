# Jam3a-2.0 Deployment Guide

This guide provides comprehensive instructions for deploying both the frontend and backend components of the restructured Jam3a-2.0 application.

## Prerequisites

- Node.js 16+ installed on your deployment environment
- Access to your hosting platforms (for both frontend and backend)
- MongoDB database instance (Atlas or self-hosted)
- Git access to the repository

## Frontend Deployment (Client)

### Building the Application

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend application:
   ```bash
   npm run build
   ```
   This will create a `dist` directory with optimized production files.

### Deployment Options

#### Vercel Deployment
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to production
vercel --prod
```

#### Netlify Deployment
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Deploy to production
netlify deploy --prod
```

#### Traditional Static Hosting
Upload the contents of the `dist` directory to your web server's public directory.

### Environment Variables

Make sure to set the following environment variables in your hosting platform:

- `VITE_API_URL`: URL of your backend API (e.g., https://api.jam3a.me)
- `VITE_GA_TRACKING_ID`: Your Google Analytics tracking ID

## Backend Deployment (Server)

### Preparing the Application

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   EMAIL_FROM=Jam3a <noreply@jam3a.me>
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

### Deployment Options

#### Heroku Deployment
```bash
# Install Heroku CLI if not already installed
npm install -g heroku

# Create a new Heroku app
heroku create jam3a-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set EMAIL_HOST=your_email_host
# ... set all other environment variables

# Deploy to Heroku
git push heroku main
```

#### DigitalOcean App Platform
1. Create a new app in the DigitalOcean App Platform
2. Connect to your GitHub repository
3. Set the source directory to `/server`
4. Configure environment variables in the app settings
5. Deploy the application

#### AWS Elastic Beanstalk
```bash
# Install EB CLI if not already installed
pip install awsebcli

# Initialize EB application
eb init

# Create an environment
eb create jam3a-api-prod

# Deploy the application
eb deploy
```

#### Traditional VPS Deployment with PM2
```bash
# Install PM2 if not already installed
npm install -g pm2

# Start the server with PM2
pm2 start server.js --name jam3a-server

# Save the PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
```

## Connecting Frontend to Backend

After deployment, ensure your frontend is correctly pointing to your backend API:

1. Verify that `client/src/services/api.ts` is using the environment variable for the API URL:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

2. Ensure CORS is properly configured on the backend to accept requests from your frontend domain:
   ```javascript
   // In server.js or a middleware file
   app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true
   }));
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the CORS_ORIGIN environment variable on the backend matches your frontend domain exactly.

2. **Database Connection Issues**: Verify your MongoDB connection string and ensure your IP address is whitelisted if using Atlas.

3. **Email Service Errors**: Check your email service credentials and ensure the service allows sending from your deployment environment.

4. **Environment Variables**: Confirm all environment variables are correctly set in your hosting platform.

### Monitoring and Logs

- For the backend, check the application logs in your hosting platform
- For PM2 deployments, use `pm2 logs jam3a-server` to view logs
- For Heroku, use `heroku logs --tail` to stream logs

## Maintenance

### Updates and Rollbacks

1. To update the application:
   ```bash
   git pull origin main
   cd client && npm install && npm run build
   cd ../server && npm install
   # Restart your server or redeploy
   ```

2. To rollback to a previous version:
   ```bash
   git checkout <previous-commit-hash>
   # Follow the deployment steps again
   ```

### Database Backups

Regularly backup your MongoDB database:

```bash
# For MongoDB Atlas, backups are automatic
# For self-hosted MongoDB
mongodump --uri="mongodb://username:password@host:port/database" --out=/path/to/backup/directory
```

## Security Considerations

1. Ensure all API endpoints are properly secured
2. Use HTTPS for both frontend and backend
3. Keep dependencies updated regularly
4. Implement rate limiting on sensitive endpoints
5. Store sensitive information only in environment variables, never in code

## Conclusion

Following this guide should result in a successfully deployed Jam3a-2.0 application with both frontend and backend components working together. If you encounter any issues during deployment, refer to the troubleshooting section or consult the documentation for your specific hosting platform.
