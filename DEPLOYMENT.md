# Jam3a Backend Deployment Guide

This document provides instructions for deploying the Jam3a backend API.

## Prerequisites

- Node.js 14+ or Docker
- MongoDB 4.4+
- Moyasser payment gateway account

## Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/Samerabualsoud/Jam3a-2.0.git
   cd Jam3a-2.0/backend
   ```

2. Create a `.env` file based on the `.env.example` template:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your specific configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Add your Moyasser API credentials
   - Configure email settings if needed

## Deployment Options

### Option 1: Standard Deployment

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. For development with auto-reload:
   ```
   npm run dev
   ```

### Option 2: Docker Deployment

1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. To stop the containers:
   ```
   docker-compose down
   ```

### Option 3: Digital Ocean Deployment

1. Create a new app on Digital Ocean App Platform
2. Connect your GitHub repository
3. Configure environment variables based on `.env.example`
4. Deploy the application

## Testing

Run the test suite to verify functionality:
```
npm test
```

## Monitoring

Once deployed, you can monitor the API status by visiting:
```
https://your-api-domain.com/
```

This should return a JSON response with status information.

## Troubleshooting

- If you encounter database connection issues, verify your MongoDB URI and ensure the database server is running
- For payment integration issues, check your Moyasser API credentials
- For authentication problems, ensure your JWT_SECRET is properly set

## Security Considerations

- Always use HTTPS in production
- Regularly rotate your JWT secret
- Keep your Moyasser API credentials secure
- Set appropriate CORS settings for production
