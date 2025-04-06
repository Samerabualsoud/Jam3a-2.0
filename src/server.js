const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config/config');

// Connect to MongoDB
connectDB();

// Start server
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.server.env} mode on port ${PORT}`);
  console.log(`API Documentation available at ${config.server.apiUrl}/docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  
  // Log detailed error information in development
  if (config.server.env !== 'production') {
    console.error(err);
  }
  
  // Close server & exit process in production
  if (config.server.env === 'production') {
    // Close server
    server.close(() => {
      console.log('Server closed due to unhandled promise rejection');
      process.exit(1);
    });
    
    // If server doesn't close in 5 seconds, force exit
    setTimeout(() => {
      console.error('Server shutdown timed out, forcing exit');
      process.exit(1);
    }, 5000);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  
  // Log detailed error information in development
  if (config.server.env !== 'production') {
    console.error(err);
  }
  
  // Exit process in production
  if (config.server.env === 'production') {
    process.exit(1);
  }
});

module.exports = server;
