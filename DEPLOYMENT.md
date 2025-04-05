# Jam3a 2.0 Deployment Guide for Digital Ocean

This guide provides step-by-step instructions for deploying the Jam3a 2.0 platform on Digital Ocean.

## Prerequisites

- A Digital Ocean account
- Git installed on your local machine
- Access to the Jam3a 2.0 GitHub repository

## Deployment Steps

### 1. Create a Digital Ocean App

1. Log in to your Digital Ocean account
2. Navigate to the Apps section
3. Click "Create App"
4. Select "GitHub" as the source
5. Connect to your GitHub account if not already connected
6. Select the `Samerabualsoud/Jam3a-2.0` repository
7. Select the `main` branch

### 2. Configure the App

1. **Environment Variables**: Add the following environment variables:
   - `NODE_ENV`: `production`
   - `MOYASSER_API_KEY`: Your Moyasser API key
   - `MOYASSER_SECRET_KEY`: Your Moyasser secret key
   - `MOYASSER_API_URL`: `https://api.moyasser.com/v1`
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `MONGODB_URI`: Your MongoDB connection string
   - `EMAIL_SERVICE`: `outlook`
   - `EMAIL_USER`: Your email address for sending emails
   - `EMAIL_PASSWORD`: Your email password or app password

2. **Resources**: Select the appropriate plan based on your needs
   - Recommended: Basic plan with 1 GB RAM / 1 vCPU

3. **Region**: Select the region closest to your target audience
   - Recommended for Middle East: `fra1` (Frankfurt)

### 3. Configure Build and Run Commands

1. **Build Command**: `npm install && npm run build`
2. **Run Command**: `npm start`

### 4. Deploy the App

1. Review your configuration
2. Click "Create Resources"
3. Wait for the deployment to complete (this may take a few minutes)

### 5. Verify Deployment

1. Once deployment is complete, Digital Ocean will provide a URL for your app
2. Visit the URL to verify that the app is running correctly
3. Test the following functionality:
   - User registration and login
   - Product browsing
   - Group creation
   - Payment processing
   - Admin panel access

## Troubleshooting

### Common Issues

1. **Authentication Error**: If you see "ri.clearToken is not a function", ensure you're using the latest code from the main branch.

2. **Payment Integration Issues**: Verify that your Moyasser API keys are correctly set in the environment variables.

3. **Email Sending Failures**: Check that your email service credentials are correct and that the email service allows sending from apps.

### Logs and Monitoring

1. Access logs from the Digital Ocean dashboard:
   - Navigate to your app
   - Click on "Components"
   - Select the component you want to check
   - Click "Logs"

2. Set up monitoring:
   - In the Digital Ocean dashboard, navigate to your app
   - Click "Insights" to view performance metrics
   - Set up alerts for critical metrics

## Updating the Application

To update the application after making changes:

1. Push your changes to the GitHub repository
2. Digital Ocean will automatically detect the changes and rebuild the app
3. Monitor the build process in the Digital Ocean dashboard

## Security Considerations

1. Ensure your JWT_SECRET is strong and unique
2. Regularly rotate API keys and passwords
3. Enable HTTPS for all traffic
4. Implement rate limiting for API endpoints
5. Regularly update dependencies to patch security vulnerabilities

## Support

For additional support, contact the Jam3a development team or refer to the documentation in the GitHub repository.
