# Digital Ocean Deployment Configuration for Jam3a-2.0

This directory contains configuration files and scripts for deploying the Jam3a-2.0 application to Digital Ocean.

## Deployment Options

1. **App Platform**: Simple PaaS solution with automatic deployments
2. **Droplet**: More control with a virtual machine
3. **Kubernetes**: For scalable, container-based deployment

## Recommended Setup: App Platform

For Jam3a-2.0, we recommend using Digital Ocean's App Platform for the following reasons:
- Simplified deployment process
- Built-in CI/CD pipeline
- Automatic HTTPS
- Easy scaling
- Managed database integration

## Configuration Files

- `app.yaml`: App Platform configuration
- `.do/deploy.template.yaml`: Deployment template
- `Dockerfile`: Container configuration (if using containers)
- `nginx.conf`: Nginx configuration for production
- `deploy.sh`: Automated deployment script

## Deployment Instructions

### Prerequisites

1. Install the Digital Ocean CLI (doctl):
   ```
   # macOS
   brew install doctl
   
   # Linux
   snap install doctl
   
   # Windows
   scoop install doctl
   ```

2. Authenticate with Digital Ocean:
   ```
   doctl auth init
   ```

3. Ensure you have Node.js and npm installed.

### Automated Deployment

1. Navigate to the project root directory:
   ```
   cd /path/to/Jam3a-2.0
   ```

2. Run the deployment script:
   ```
   ./deployment/deploy.sh
   ```

3. The script will:
   - Validate deployment files
   - Build the application
   - Run tests
   - Deploy to Digital Ocean App Platform

### Manual Deployment

If you prefer to deploy manually:

1. Build the application:
   ```
   npm install
   npm run build
   ```

2. Deploy using the Digital Ocean CLI:
   ```
   doctl apps create --spec ./deployment/app.yaml
   ```

3. Monitor deployment status:
   ```
   doctl apps list
   ```

## Environment Variables

The following environment variables are configured for production:

### Frontend
- `NODE_ENV`: Set to "production"
- `VITE_API_URL`: Backend API URL (automatically configured)

### Backend
- `NODE_ENV`: Set to "production"
- `MONGO_URI`: MongoDB connection string (automatically configured)
- `JWT_SECRET`: Secret for JWT authentication
- `PORT`: Server port (5000)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds (15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window (100)
- `LOG_LEVEL`: Logging level for production ("info")
- `LOG_RETENTION_DAYS`: Log retention period in days (14)
- `CORS_ORIGIN`: Frontend URL for CORS configuration

## Troubleshooting

If you encounter issues during deployment:

1. Check the deployment logs:
   ```
   doctl apps logs <app-id>
   ```

2. Verify environment variables:
   ```
   doctl apps get <app-id>
   ```

3. Ensure MongoDB connection is working:
   ```
   doctl databases list
   ```

For additional help, refer to the [Digital Ocean App Platform documentation](https://docs.digitalocean.com/products/app-platform/).
