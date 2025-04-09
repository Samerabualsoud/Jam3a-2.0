// MongoDB connection module for Jam3a-2.0
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://samer:2141991Sam@jam3a.yfuimdi.mongodb.net/?retryWrites=true&w=majority&appName=Jam3a';

// Connect to MongoDB
const connectDB = async () => {
  try {
    // If we can't connect to a local MongoDB, use mock data instead
    try {
      const conn = await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (connError) {
      console.log('Could not connect to MongoDB, using mock data instead');
      // We'll handle this in the routes by checking if mongoose.connection.readyState !== 1
      return null;
    }
  } catch (error) {
    console.error(`Error in database module: ${error.message}`);
    return null;
  }
};

export default connectDB;
