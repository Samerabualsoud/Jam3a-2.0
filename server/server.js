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
// Create Express app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to MongoDB
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    ]
  });
});

// API routes
app.use('/api/products', productsRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/email', emailRoutes);
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
  console.log(`Server running on port ${PORT}`);
});
