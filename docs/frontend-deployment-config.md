# Frontend Deployment Configuration for DigitalOcean

This document provides specific configuration instructions for deploying the Jam3a-2.0 frontend application to DigitalOcean App Platform.

## Environment Configuration

When deploying the frontend client to DigitalOcean App Platform, use the following configuration:

### Basic Settings

- **Environment Type**: Node.js
- **Source Directory**: `client` (without the leading slash)
- **Branch**: `main`

### Build Configuration

- **Build Command**: 
  ```
  npm install && npm run build
  ```

- **Run Command**:
  ```
  npm run preview -- --host 0.0.0.0 --port $PORT
  ```

### Environment Variables

Set the following environment variables in your DigitalOcean App Platform dashboard:

- `VITE_API_URL`: URL of your backend API (e.g., https://your-backend-app.ondigitalocean.app)
- `VITE_GA_TRACKING_ID`: Your Google Analytics tracking ID (if applicable)

## Package.json Requirements

Ensure your client's package.json has the following scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

## Vite Configuration

The vite.config.ts file has been updated with the following settings to ensure proper deployment:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.', // Explicitly set the root directory
  base: './', // This helps with routing in production
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

## Deployment Process

1. Ensure all changes are committed and pushed to your GitHub repository
2. Create a new app in DigitalOcean App Platform
3. Connect to your GitHub repository
4. Configure the app using the settings above
5. Deploy the application

## Troubleshooting

If you encounter issues with the deployment:

1. **Blank Page**: Check that the base path is set correctly in vite.config.ts
2. **API Connection Issues**: Verify that VITE_API_URL is set correctly and points to your deployed backend
3. **Build Failures**: Check the build logs for specific errors related to missing dependencies or configuration issues

## Connecting to Backend

After both frontend and backend are deployed:

1. Set the VITE_API_URL environment variable in your frontend app to point to your backend URL
2. Set the CORS_ORIGIN environment variable in your backend app to allow requests from your frontend URL
3. Redeploy both applications if necessary

This configuration ensures that your Jam3a-2.0 frontend application will deploy successfully to DigitalOcean App Platform and connect properly to your backend API.
