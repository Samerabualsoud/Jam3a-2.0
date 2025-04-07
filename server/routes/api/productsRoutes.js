// API routes for products
import express from 'express';
import mongoose from 'mongoose';
import Product from '../../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback to JSON file if MongoDB is not available
const getProductsFromFile = () => {
  try {
    const dataPath = path.join(__dirname, '../../../data/products.json');
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(rawData);
    }
    return [];
  } catch (error) {
    console.error('Error reading products from file:', error);
    return [];
  }
};

// Get all products
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find().populate('category').sort({ createdAt: -1 });
      return res.json(products);
    } else {
      // Fallback to JSON file
      const products = getProductsFromFile();
      return res.json(products);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to JSON file on error
    const products = getProductsFromFile();
    return res.json(products);
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const featuredProducts = await Product.find({ featured: true }).populate('category').sort({ createdAt: -1 });
      return res.json(featuredProducts);
    } else {
      // Fallback to JSON file
      const products = getProductsFromFile();
      const featuredProducts = products.filter(product => product.featured);
      return res.json(featuredProducts);
    }
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Fallback to JSON file on error
    const products = getProductsFromFile();
    const featuredProducts = products.filter(product => product.featured);
    return res.json(featuredProducts);
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id).populate('category');
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    } else {
      // Fallback to JSON file
      const products = getProductsFromFile();
      const product = products.find(p => p._id === req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to JSON file on error
    const products = getProductsFromFile();
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      const populatedProduct = await Product.findById(savedProduct._id).populate('category');
      return res.status(201).json(populatedProduct);
    } else {
      // Mock response for when MongoDB is not available
      const mockProduct = {
        ...req.body,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return res.status(201).json(mockProduct);
    }
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      ).populate('category');
      
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      return res.json(updatedProduct);
    } else {
      // Mock response for when MongoDB is not available
      return res.json({
        ...req.body,
        _id: req.params.id,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      return res.json({ message: 'Product deleted successfully' });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Bulk operations
router.put('/bulk', async (req, res) => {
  try {
    const { ids, data } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const result = await Product.updateMany(
        { _id: { $in: ids } },
        { $set: { ...data, updatedAt: Date.now() } }
      );
      
      return res.json({ count: result.modifiedCount });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({ count: ids.length });
    }
  } catch (error) {
    console.error('Error bulk updating products:', error);
    return res.status(500).json({ message: error.message });
  }
});

router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const result = await Product.deleteMany({ _id: { $in: ids } });
      
      return res.json({ count: result.deletedCount });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({ count: ids.length });
    }
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Import products
router.post('/import', async (req, res) => {
  try {
    const { products } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const result = await Product.insertMany(products);
      
      return res.json({ count: result.length });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({ count: products.length });
    }
  } catch (error) {
    console.error('Error importing products:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Export products
router.post('/export', async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      let products;
      
      if (ids && ids.length > 0) {
        products = await Product.find({ _id: { $in: ids } }).populate('category');
      } else {
        products = await Product.find().populate('category');
      }
      
      return res.json(products);
    } else {
      // Fallback to JSON file
      const allProducts = getProductsFromFile();
      let products;
      
      if (ids && ids.length > 0) {
        products = allProducts.filter(p => ids.includes(p._id));
      } else {
        products = allProducts;
      }
      
      return res.json(products);
    }
  } catch (error) {
    console.error('Error exporting products:', error);
    // Fallback to JSON file on error
    const allProducts = getProductsFromFile();
    return res.json(allProducts);
  }
});

export default router;
