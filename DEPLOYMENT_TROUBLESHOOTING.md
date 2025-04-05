# Digital Ocean Deployment Troubleshooting Guide

This guide provides detailed troubleshooting steps for common issues when deploying the Jam3a application to Digital Ocean App Platform.

## Common Issues and Solutions

### 1. Blank Page After Deployment

If you're seeing a blank page after deployment, try these solutions in order:

#### Solution 1: Check the Browser Console
- Open your browser's developer tools (F12 or right-click > Inspect)
- Check the Console tab for errors
- Look for 404 errors on script or asset files which indicate path issues

#### Solution 2: Verify Build Configuration
- Ensure `vite.config.ts` has `base: "./"` to use relative paths
- Make sure all asset references in `index.html` use relative paths (`./`)
- Check that the server is properly serving static files from the `dist` directory

#### Solution 3: Check Server Logs
- In Digital Ocean dashboard, go to your app > Logs
- Look for any errors during the build or runtime process
- Check for missing dependencies or permission issues

#### Solution 4: Rebuild and Redeploy
- Sometimes a clean rebuild resolves caching issues:
  ```
  npm run build
  ```
- Then redeploy to Digital Ocean

#### Solution 5: Try Static Site Configuration
If the app still shows a blank page, try deploying as a static site:
1. In Digital Ocean dashboard, go to your app > Settings
2. Change the app type to "Static Site"
3. Set the build command to `npm run build`
4. Set the output directory to `dist`
5. Add a custom route to handle SPA routing:
   - Source path: `/*`
   - Destination path: `/index.html`

### 2. Missing Dependencies

If you encounter errors about missing dependencies:

#### Solution 1: Check package.json
- Ensure all dependencies are properly listed in `package.json`
- Make sure dependencies are not in `devDependencies` if needed at runtime

#### Solution 2: Update Server.js
- Modify `server.js` to handle missing dependencies gracefully
- Implement feature detection instead of assuming packages exist

#### Solution 3: Use Try/Catch for Imports
- Wrap imports in try/catch blocks to handle missing packages
- Provide fallback implementations for critical functionality

### 3. Routing Issues

If routes work locally but not in production:

#### Solution 1: Verify Router Configuration
- Ensure you're using `BrowserRouter` (not `HashRouter`) for clean URLs
- Check that the server redirects all routes to `index.html`

#### Solution 2: Add Custom Routes in Digital Ocean
- In Digital Ocean dashboard, add custom routes:
  - Source path: `/*`
  - Destination path: `/index.html`

#### Solution 3: Use Relative Paths for Assets
- Update all asset references to use relative paths
- Ensure `vite.config.ts` has `base: "./"` configured

### 4. Environment Variables

If environment variables aren't working:

#### Solution 1: Check Environment Configuration
- In Digital Ocean dashboard, go to your app > Settings > Environment Variables
- Verify all required environment variables are set
- Ensure variable names match what the application expects

#### Solution 2: Use Runtime Environment Variables
- Access environment variables at runtime instead of build time
- Use `window.ENV` or similar pattern for client-side access

## Advanced Troubleshooting

### Debugging Build Process

To debug the build process locally:

```bash
# Build with verbose logging
NODE_ENV=production npm run build -- --debug

# Analyze bundle size
npm run build -- --report
```

### Testing Production Build Locally

Test your production build locally before deploying:

```bash
# Build for production
npm run build

# Install serve globally if not already installed
npm install -g serve

# Serve the production build
serve -s dist
```

### Checking for Path Alias Issues

Path aliases (like `@/components`) can cause issues in production:

1. Ensure `vite.config.ts` has proper alias configuration:
   ```typescript
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     },
   }
   ```

2. Verify `tsconfig.json` has matching paths configuration:
   ```json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```

## Contact Support

If you continue to experience issues after trying these solutions, please contact support at support@jam3a.sa or open an issue on the GitHub repository.
