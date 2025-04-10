// Script to add scraped products to MongoDB
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://samer:2141991Sam@jam3a.yfuimdi.mongodb.net/?retryWrites=true&w=majority&appName=Jam3a';

// Import product data
const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'scraped_phones.json'), 'utf8'));

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAr: { type: String, required: true },
  description: { type: String, required: true },
  descriptionAr: { type: String, required: true },
  category: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    nameAr: { type: String, required: true }
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true },
  featured: { type: Boolean, default: false },
  imageUrl: { type: String, required: true },
  specifications: {
    display: { type: String },
    processor: { type: String },
    camera: { type: String },
    battery: { type: String },
    storage: { type: String },
    colors: [{ type: String }]
  },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  discount: {
    original: { type: Number },
    current: { type: Number },
    percentage: { type: Number }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create Product model
const Product = mongoose.model('Product', productSchema);

// Connect to MongoDB and add products
async function addProductsToDatabase() {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Add new products
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`Added ${insertedProducts.length} products to database`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    return insertedProducts;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the function
addProductsToDatabase();
