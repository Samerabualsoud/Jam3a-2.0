// Main server file for Jam3a-2.0
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
// Import routes
import productsRoutes from './routes/api/productsRoutes.js';
import dealsRoutes from './routes/api/dealsRoutes.js';
import analyticsRoutes from './routes/api/analyticsRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
// Import middleware
import { 
  rateLimiters, 
  logger, 
  requestTracker, 
  requestLogger, 
  errorLogger, 
  performanceMonitor 
} from './middleware/rateLimit.js';
import { sanitizeInputs } from './middleware/validation.js';

// Create Express app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to MongoDB
connectDB();

// CORS configuration - allow all origins in development
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID', 'X-New-Token'],
  credentials: true
};

// Apply global middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply enhanced middleware
app.use(requestTracker); // Add unique request ID to each request
app.use(requestLogger); // Log all requests with detailed information
app.use(performanceMonitor(1000)); // Monitor slow requests (>1000ms)
app.use(sanitizeInputs); // Sanitize all request inputs

// Apply rate limiting to specific routes
app.use('/api/auth', rateLimiters.auth);
app.use('/api/users/register', rateLimiters.userCreation);
app.use('/api/products/create', rateLimiters.productCreation);
app.use('/api/deals/create', rateLimiters.dealCreation);
app.use('/api', rateLimiters.api); // General API rate limiting

// Add a route handler for the root path
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
    ],
    requestId: req.requestId // Include request ID in response
  });
});

// API routes
app.use('/api/products', productsRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware (must be after all routes)
app.use(errorLogger);

// 404 handler for undefined routes
app.use((req, res) => {
  logger.warn('Route not found', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl
  });
  
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    requestId: req.requestId
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
  console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    }
  });
  
  // Give logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection', {
    reason: reason instanceof Error ? {
      message: reason.message,
      stack: reason.stack,
      name: reason.name
    } : reason,
    promise
  });
});

export default app;
