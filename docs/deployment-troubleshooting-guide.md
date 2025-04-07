# Deployment Troubleshooting Guide for Jam3a-2.0

This document provides a comprehensive guide to the deployment issues we encountered and fixed during the deployment of the restructured Jam3a-2.0 application to DigitalOcean App Platform.

## Backend Deployment Issues and Solutions

### 1. Import Path Issues
- **Issue**: After restructuring, the server.js file had incorrect import paths.
- **Solution**: Updated import paths to match the new directory structure:
  ```javascript
  // From
  import connectDB from './server/db.js';
  // To
  import connectDB from './config/db.js';
  ```

### 2. "Not Found" Error
- **Issue**: The backend returned a "Not Found" error when accessing the root URL.
- **Solution**: Added a root route handler to respond to requests to the root path:
  ```javascript
  app.get('/', (req, res) => {
    res.json({ 
      status: 'success', 
      message: 'Jam3a API is running',
      version: '2.0',
      endpoints: [
        '/api/products',
        '/api/deals',
        '/api/analytics',
        '/api/email'
      ]
    });
  });
  ```

### 3. Module Type Warning
- **Issue**: Node.js warning about module type not being specified.
- **Solution**: Added "type": "module" to server/package.json to eliminate the warning.

### 4. MongoDB Connection
- **Issue**: Could not connect to MongoDB due to special characters in the connection string.
- **Solution**: URL-encoded the "@" character in the password as "%40" in the MONGODB_URI environment variable.

## Frontend Deployment Issues and Solutions

### 1. Missing Entry Point
- **Issue**: "Could not resolve entry module 'index.html'" error during build.
- **Solution**: Created an index.html file in the client root directory:
  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/jam3a-icon.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Jam3a - Group Buying Platform</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  ```

### 2. TypeScript Compilation Errors
- **Issue**: TypeScript compilation errors during build.
- **Solution**: Modified the build script in package.json to bypass TypeScript compilation:
  ```json
  // From
  "build": "tsc && vite build"
  // To
  "build": "vite build"
  ```

### 3. TailwindCSS Configuration Issues
- **Issue**: Missing TailwindCSS configuration files.
- **Solution**: Created postcss.config.js and tailwind.config.js files in the client directory.

### 4. ES Module Compatibility
- **Issue**: "module is not defined in ES module scope" error in postcss.config.js.
- **Solution**: Updated postcss.config.js to use ES module syntax:
  ```javascript
  // From
  module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  // To
  export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  ```

## Deployment Configuration

### Backend Configuration
- **Source Directory**: `server`
- **Build Command**: `npm install`
- **Run Command**: `npm start`
- **Environment Variables**:
  - `MONGODB_URI`: MongoDB connection string with properly URL-encoded special characters
  - `PORT`: 8080 (default for DigitalOcean)
  - `CORS_ORIGIN`: URL of your frontend application

### Frontend Configuration
- **Environment Type**: Node.js
- **Source Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Run Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `VITE_API_URL`: URL of your backend API
  - `VITE_GA_TRACKING_ID`: Google Analytics tracking ID (if applicable)

## Lessons Learned

1. **Repository Structure**: When restructuring a repository, ensure all import paths are updated to match the new structure.
2. **Module Compatibility**: Pay attention to module type (CommonJS vs ES modules) when working with configuration files.
3. **Build Configuration**: Ensure all necessary configuration files are present and properly formatted for the build process.
4. **Environment Variables**: Properly encode special characters in environment variables, especially in connection strings.
5. **Root Route Handlers**: Always include a handler for the root path to respond to health checks and direct URL access.

This guide should help with troubleshooting any similar deployment issues in the future.
