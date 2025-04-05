# Jam3a Deployment Guide

This guide provides detailed instructions for deploying the Jam3a application to various platforms.

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git

## Important Note About ES Modules

This project uses ES Modules (ESM) instead of CommonJS. The `package.json` file includes `"type": "module"`, which means:

- All `.js` files are treated as ES modules by default
- Use `import` instead of `require()` for importing modules
- The `server.js` file uses ES module syntax for compatibility

If you need to modify the server code, remember to use ES module syntax:
```javascript
// Correct (ES Modules):
import express from 'express';
import { join } from 'path';

// Incorrect (CommonJS):
const express = require('express');
const path = require('path');
```

## Deployment Options

### Option 1: Deploying to Vercel (Recommended)

1. **Fork or clone the repository**
   ```
   git clone https://github.com/Samerabualsoud/Jam3a-2.0.git
   cd Jam3a-2.0
   ```

2. **Install Vercel CLI (optional)**
   ```
   npm install -g vercel
   ```

3. **Deploy to Vercel**
   - Using Vercel Dashboard:
     1. Go to [vercel.com](https://vercel.com) and sign in
     2. Click "New Project" and import your GitHub repository
     3. Select the Jam3a repository
     4. Configure as follows:
        - Framework Preset: Vite
        - Build Command: `npm run build`
        - Output Directory: `dist`
        - Install Command: `npm install`
     5. Click "Deploy"

   - Using Vercel CLI:
     ```
     vercel
     ```

### Option 2: Deploying to Netlify

1. **Fork or clone the repository**
   ```
   git clone https://github.com/Samerabualsoud/Jam3a-2.0.git
   cd Jam3a-2.0
   ```

2. **Deploy to Netlify**
   - Using Netlify Dashboard:
     1. Go to [netlify.com](https://netlify.com) and sign in
     2. Click "New site from Git" and select your GitHub repository
     3. Configure as follows:
        - Build Command: `npm run build`
        - Publish Directory: `dist`
     4. Click "Deploy site"

   - Using Netlify CLI:
     ```
     npm install -g netlify-cli
     netlify deploy
     ```

3. **Configure Netlify for SPA routing**
   - Create a file named `_redirects` in the `public` folder with the following content:
     ```
     /* /index.html 200
     ```

### Option 3: Deploying to Heroku

1. **Fork or clone the repository**
   ```
   git clone https://github.com/Samerabualsoud/Jam3a-2.0.git
   cd Jam3a-2.0
   ```

2. **Create a new Heroku app**
   ```
   heroku create jam3a-app
   ```

3. **Deploy to Heroku**
   ```
   git push heroku main
   ```

4. **Open the deployed app**
   ```
   heroku open
   ```

### Option 4: Deploying to DigitalOcean App Platform

1. **Fork or clone the repository**
   ```
   git clone https://github.com/Samerabualsoud/Jam3a-2.0.git
   ```

2. **Deploy to DigitalOcean**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App" and connect your GitHub repository
   - Configure as follows:
     - Type: Web Service
     - Source Directory: `/`
     - Build Command: `npm run build`
     - Run Command: `npm start`
   - Click "Next" and then "Create Resources"

## Troubleshooting Deployment Issues

### ES Module Errors

If you see errors like `require is not defined in ES module scope` or `Cannot use import statement outside a module`:

1. **Check server.js syntax**
   - Ensure server.js uses ES module syntax (import/export) not CommonJS (require)
   - The project uses `"type": "module"` in package.json, so all .js files are ES modules

2. **Check for CommonJS dependencies**
   - Some packages may not be compatible with ES modules
   - You may need to use dynamic imports for such packages

### Blank Screen After Deployment

If you encounter a blank screen after deployment:

1. **Check browser console for errors**
   - Open browser developer tools (F12) and look for errors in the console

2. **Verify build output**
   - Run `npm run build` locally to ensure it builds successfully
   - Check that the `dist` directory contains all necessary files

3. **Check routing configuration**
   - Ensure your deployment platform is configured for SPA routing
   - For Netlify: Add the `_redirects` file as mentioned above
   - For Vercel: Routing should work automatically
   - For other platforms: Ensure all routes redirect to index.html

4. **Environment variables**
   - Make sure any required environment variables are set in your deployment platform

### Common Issues and Solutions

1. **404 errors for routes**
   - Solution: Configure your hosting platform to redirect all requests to index.html

2. **Missing assets**
   - Solution: Ensure the base path in vite.config.ts is set correctly

3. **API connection issues**
   - Solution: Check CORS configuration and API endpoint URLs

4. **Performance issues**
   - Solution: Enable compression on your server and optimize bundle size

## Contact Support

If you continue to experience issues with deployment, please contact support at support@jam3a.sa or open an issue on the GitHub repository.
