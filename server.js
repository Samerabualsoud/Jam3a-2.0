import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import compression from 'compression';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Enable compression
app.use(compression());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

// Health check endpoint for Digital Ocean
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Custom middleware to inject React directly into HTML responses
app.use((req, res, next) => {
  // Only intercept HTML requests
  if (req.path.endsWith('.html') || req.path === '/' || !req.path.match(/\.\w+$/)) {
    const originalSend = res.send;
    
    res.send = function(body) {
      // Only process HTML responses
      if (typeof body === 'string' && body.includes('<!DOCTYPE html>')) {
        // Inject React directly before the closing head tag
        const reactScripts = `
          <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          <script>
            // Verify React is loaded
            window.addEventListener('DOMContentLoaded', function() {
              if (typeof React === 'undefined') {
                console.error('React failed to load. Attempting to reload from CDN...');
                var reactScript = document.createElement('script');
                reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
                reactScript.onload = function() {
                  var reactDOMScript = document.createElement('script');
                  reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
                  document.head.appendChild(reactDOMScript);
                };
                document.head.appendChild(reactScript);
              } else {
                console.log('React successfully loaded:', React.version);
              }
            });
          </script>
        `;
        
        // Insert scripts before closing head tag
        body = body.replace('</head>', `${reactScripts}</head>`);
      }
      
      return originalSend.call(this, body);
    };
  }
  
  next();
});

// Handle all routes for SPA
app.get('*', (req, res) => {
  // Check if the request is for a static file
  const filePath = resolve(join(__dirname, 'dist', req.path.substring(1)));
  
  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    return res.sendFile(filePath);
  }
  
  // Otherwise, serve the index.html for client-side routing
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something went wrong! Please try again later.');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server time: ${new Date().toISOString()}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application continues running
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Application continues running
});
