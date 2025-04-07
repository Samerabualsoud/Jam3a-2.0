// server.js for master branch (backend)
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const emailRoutes = require('./server/routes/emailRoutes');
const dealsRoutes = require('./server/routes/api/dealsRoutes');
const productsRoutes = require('./server/routes/api/productsRoutes');
const analyticsRoutes = require('./server/routes/api/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use('/api/email', emailRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve the app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
