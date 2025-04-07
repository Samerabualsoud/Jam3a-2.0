// db.js - MongoDB connection setup
const mongoose = require('mongoose');

// MongoDB connection string
// Note: The @ in the password needs to be properly encoded in the connection string
const MONGODB_URI = 'mongodb+srv://samer:2141991%40Sam@cluster0.60nmnqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
