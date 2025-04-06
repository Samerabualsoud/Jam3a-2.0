const mongoose = require('mongoose');
const config = require('./config');

// MongoDB connection function
const connectDB = async () => {
  try {
    // Configure MongoDB connection options
    const options = config.database.options;
    
    // Connect to MongoDB
    const conn = await mongoose.connect(config.database.uri, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    // Handle when the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Attempt to reconnect if not in test mode
      if (process.env.NODE_ENV !== 'test') {
        console.log('Attempting to reconnect to MongoDB...');
        setTimeout(connectDB, 5000); // Retry after 5 seconds
      }
    });
    
    // If Node process ends, close the MongoDB connection
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return conn;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    // Exit process with failure in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    // In development, throw the error for better debugging
    throw err;
  }
};

module.exports = connectDB;
