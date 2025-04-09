// MongoDB connection utility for serverless functions
import mongoose from 'mongoose';

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://samer:2141991Sam@jam3a.yfuimdi.mongodb.net/?retryWrites=true&w=majority&appName=Jam3a';

// Track connection status
let isConnected = false;

// Connect to MongoDB
const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    isConnected = false;
    throw error;
  }
};

export default connectDB;
