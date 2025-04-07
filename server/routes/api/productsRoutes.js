const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    // Find the highest ID to ensure uniqueness
    const maxIdProduct = await Product.findOne().sort('-id');
    const newId = maxIdProduct ? maxIdProduct.id + 1 : 1;
    
    const newProduct = new Product({
      id: newId,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock || 0,
      sku: req.body.sku,
      featured: req.body.featured || false,
      currentAmount: req.body.currentAmount,
      targetAmount: req.body.targetAmount,
      imageUrl: req.body.imageUrl
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      { 
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk operations
router.post('/bulk', async (req, res) => {
  try {
    const { action, ids, data } = req.body;
    
    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }
    
    if (action === 'update') {
      if (!data) {
        return res.status(400).json({ message: 'Data is required for bulk update' });
      }
      
      const updateResult = await Product.updateMany(
        { id: { $in: ids } },
        { 
          ...data,
          updatedAt: Date.now()
        }
      );
      
      return res.json({ updated: updateResult.modifiedCount });
    }
    
    if (action === 'delete') {
      const deleteResult = await Product.deleteMany({ id: { $in: ids } });
      return res.json({ deleted: deleteResult.deletedCount });
    }
    
    return res.status(400).json({ message: 'Invalid action' });
  } catch (err) {
    console.error('Error performing bulk operation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true });
    res.json(featuredProducts);
  } catch (err) {
    console.error('Error fetching featured products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Jam3a products
router.get('/jam3a/deals', async (req, res) => {
  try {
    const jam3aProducts = await Product.find({ 
      currentAmount: { $exists: true, $ne: null },
      targetAmount: { $exists: true, $ne: null }
    });
    res.json(jam3aProducts);
  } catch (err) {
    console.error('Error fetching Jam3a products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
