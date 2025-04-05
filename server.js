import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';
import helmet from 'helmet';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Enable gzip compression for all responses
app.use(compression());

// Add security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for now as it might block some resources
    crossOriginEmbedderPolicy: false, // Allow embedding from different origins
  })
);

// Log environment information
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Server starting...');

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Add cache control for static assets
app.use((req, res, next) => {
  // Skip for HTML files
  if (req.path.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-cache');
    return next();
  }
  
  // For JS, CSS, and other assets
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    return next();
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle all other routes by serving index.html (for SPA client-side routing)
app.get('*', (req, res) => {
  console.log(`Serving index.html for path: ${req.path}`);
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Get port from environment or use default
const PORT = process.env.PORT || 8080;

// Listen on all network interfaces (important for containers)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Keep the server running despite errors
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the server running despite errors
});
