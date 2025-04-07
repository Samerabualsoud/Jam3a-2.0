const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./server/db');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/deals', require('./server/routes/api/dealsRoutes'));
app.use('/api/products', require('./server/routes/api/productsRoutes'));
app.use('/api/analytics', require('./server/routes/api/analyticsRoutes'));

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
