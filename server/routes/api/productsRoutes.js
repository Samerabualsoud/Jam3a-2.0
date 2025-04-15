// API routes for products
import express from 'express';
import mongoose from 'mongoose';
import Product from '../../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth, authorize, optionalAuth, refreshToken } from '../../middleware/auth.js';
import { validate, validationRules, sanitizeInputs } from '../../middleware/validation.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apply token refresh middleware to all routes
router.use(refreshToken);

// Apply sanitization middleware to all routes
router.use(sanitizeInputs);

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

// Get all products - Public route with optional auth
router.get('/', optionalAuth, validate(validationRules.pagination), async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find().populate('category').sort({ createdAt: -1 });
      return res.json({
        success: true,
        data: products
      });
    } else {
      // Fallback to JSON file
      const products = getProductsFromFile();
      return res.json({
        success: true,
        data: products
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to JSON file on error
    const products = getProductsFromFile();
    return res.json({
      success: true,
      data: products
    });
  }
});

// Get featured products - Public route with optional auth
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const featuredProducts = await Product.find({ featured: true }).populate('category').sort({ createdAt: -1 });
      return res.json({
        success: true,
        data: featuredProducts
      });
    } else {
      // Fallback to JSON file
      const products = getProductsFromFile();
      const featuredProducts = products.filter(product => product.featured);
      return res.json({
        success: true,
        data: featuredProducts
      });
    }
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Fallback to JSON file on error
    const products = getProductsFromFile();
    const featuredProducts = products.filter(product => product.featured);
    return res.json({
      success: true,
      data: featuredProducts
    });
  }
});

// Get product by ID - Public route with optional auth
router.get('/:id', optionalAuth, validate(validationRules.id), async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id).populate('category');
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      return res.json({
        success: true,
        data: product
      });
    } else {
      // Fallback to JSON file
      const products = getProductsFromFile();
      const product = products.find(p => p._id === req.params.id);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      return res.json({
        success: true,
        data: product
      });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to JSON file on error
    const products = getProductsFromFile();
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found',
        code: 'RESOURCE_NOT_FOUND'
      });
    }
    return res.json({
      success: true,
      data: product
    });
  }
});

// Create a new product - Admin or seller only
router.post('/', auth, authorize(['admin', 'seller']), validate(validationRules.product.create), async (req, res) => {
  try {
    // Add creator reference to the product
    const productData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();
      const populatedProduct = await Product.findById(savedProduct._id).populate('category');
      return res.status(201).json({
        success: true,
        data: populatedProduct
      });
    } else {
      // Mock response for when MongoDB is not available
      const mockProduct = {
        ...productData,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return res.status(201).json({
        success: true,
        data: mockProduct
      });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Update a product - Admin or creator only
router.put('/:id', auth, validate(validationRules.id), validate(validationRules.product.update), async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // First check if user is authorized to update this product
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      
      // Check if user is admin or the creator of the product
      if (req.user.role !== 'admin' && (!product.createdBy || product.createdBy.toString() !== req.user.id)) {
        return res.status(403).json({ 
          success: false,
          message: 'Not authorized to update this product',
          code: 'AUTH_INSUFFICIENT_PERMISSIONS'
        });
      }
      
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { 
          ...req.body, 
          updatedAt: Date.now(),
          updatedBy: req.user.id
        },
        { new: true }
      ).populate('category');
      
      return res.json({
        success: true,
        data: updatedProduct
      });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({
        success: true,
        data: {
          ...req.body,
          _id: req.params.id,
          updatedAt: new Date(),
          updatedBy: req.user.id
        }
      });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Delete a product - Admin only
router.delete('/:id', auth, authorize(['admin']), validate(validationRules.id), async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      
      if (!deletedProduct) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      
      return res.json({ 
        success: true, 
        message: 'Product deleted successfully' 
      });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({ 
        success: true, 
        message: 'Product deleted successfully' 
      });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Bulk operations - Admin only
router.put('/bulk', auth, authorize(['admin']), async (req, res) => {
  try {
    const { ids, data } = req.body;
    
    // Validate IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required',
        code: 'VALIDATION_ERROR'
      });
    }
    
    // Validate data
    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Update data object is required',
        code: 'VALIDATION_ERROR'
      });
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const result = await Product.updateMany(
        { _id: { $in: ids } },
        { 
          $set: { 
            ...data, 
            updatedAt: Date.now(),
            updatedBy: req.user.id
          } 
        }
      );
      
      return res.json({
        success: true,
        data: { count: result.modifiedCount }
      });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({
        success: true,
        data: { count: ids.length }
      });
    }
  } catch (error) {
    console.error('Error bulk updating products:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

router.post('/bulk-delete', auth, authorize(['admin']), async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Validate IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required',
        code: 'VALIDATION_ERROR'
      });
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const result = await Product.deleteMany({ _id: { $in: ids } });
      
      return res.json({
        success: true,
        data: { count: result.deletedCount }
      });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({
        success: true,
        data: { count: ids.length }
      });
    }
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Import products - Admin only
router.post('/import', auth, authorize(['admin']), async (req, res) => {
  try {
    const { products } = req.body;
    
    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required',
        code: 'VALIDATION_ERROR'
      });
    }
    
    // Add creator reference to all products
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: req.user.id,
      updatedBy: req.user.id
    }));
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const result = await Product.insertMany(productsWithCreator);
      
      return res.json({
        success: true,
        data: { count: result.length }
      });
    } else {
      // Mock response for when MongoDB is not available
      return res.json({
        success: true,
        data: { count: products.length }
      });
    }
  } catch (error) {
    console.error('Error importing products:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Export products - Admin only
router.post('/export', auth, authorize(['admin']), async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      let products;
      
      if (ids && Array.isArray(ids) && ids.length > 0) {
        products = await Product.find({ _id: { $in: ids } }).populate('category');
      } else {
        products = await Product.find().populate('category');
      }
      
      return res.json({
        success: true,
        data: products
      });
    } else {
      // Fallback to JSON file
      const allProducts = getProductsFromFile();
      let products;
      
      if (ids && Array.isArray(ids) && ids.length > 0) {
        products = allProducts.filter(p => ids.includes(p._id));
      } else {
        products = allProducts;
      }
      
      return res.json({
        success: true,
        data: products
      });
    }
  } catch (error) {
    console.error('Error exporting products:', error);
    // Fallback to JSON file on error
    const allProducts = getProductsFromFile();
    return res.json({
      success: true,
      data: allProducts
    });
  }
});

export default router;
