const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const seller = require('../middleware/seller');

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = { active: true };
    
    if (category) {
      filter.category = mongoose.Types.ObjectId(category);
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('category', 'name nameAr')
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Get products error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name nameAr description')
      .lean();

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Get product error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin or Seller)
 */
router.post('/', [
  auth,
  seller,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      nameAr,
      description,
      descriptionAr,
      price,
      category,
      images,
      specifications,
      stock,
      featured,
      sku
    } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ msg: 'Category not found' });
    }

    // Create new product
    const newProduct = new Product({
      name,
      nameAr,
      description,
      descriptionAr,
      price,
      category,
      images: images || [],
      specifications: specifications || {},
      stock: stock || 0,
      featured: featured || false,
      sku: sku || generateSKU(name),
      createdBy: req.user.id
    });

    const product = await newProduct.save();

    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private (Admin or product creator)
 */
router.put('/:id', [
  auth,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('price', 'Price is required').optional().isNumeric(),
    check('category', 'Category is required').optional().not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if user is creator or admin
    if (product.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to update this product' });
    }

    // Update fields
    const {
      name,
      nameAr,
      description,
      descriptionAr,
      price,
      category,
      images,
      specifications,
      stock,
      featured,
      sku,
      active
    } = req.body;

    if (name) product.name = name;
    if (nameAr) product.nameAr = nameAr;
    if (description) product.description = description;
    if (descriptionAr) product.descriptionAr = descriptionAr;
    if (price) product.price = price;
    if (category) {
      // Verify category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ msg: 'Category not found' });
      }
      product.category = category;
    }
    if (images) product.images = images;
    if (specifications) product.specifications = specifications;
    if (stock !== undefined) product.stock = stock;
    if (featured !== undefined) product.featured = featured;
    if (sku) product.sku = sku;
    if (active !== undefined) product.active = active;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    console.error('Update product error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private (Admin or product creator)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if user is creator or admin
    if (product.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to delete this product' });
    }

    // Instead of deleting, mark as inactive
    product.active = false;
    await product.save();

    res.json({ msg: 'Product removed successfully' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ 
      featured: true,
      active: true
    })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('category', 'name nameAr')
    .lean();

    res.json(products);
  } catch (err) {
    console.error('Get featured products error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/products/search/:query
 * @desc    Search products
 * @access  Public
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const filter = {
      active: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('category', 'name nameAr')
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Search products error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/products/seller/list
 * @desc    Get products created by current user
 * @access  Private
 */
router.get('/seller/list', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('category', 'name nameAr')
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments({ createdBy: req.user.id });

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Get seller products error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/products/:id/stock
 * @desc    Update product stock
 * @access  Private (Admin or product creator)
 */
router.put('/:id/stock', [
  auth,
  [
    check('stock', 'Stock is required').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if user is creator or admin
    if (product.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to update this product' });
    }

    // Update stock
    product.stock = req.body.stock;
    await product.save();

    res.json({ 
      msg: 'Stock updated successfully',
      product: {
        id: product._id,
        name: product.name,
        stock: product.stock
      }
    });
  } catch (err) {
    console.error('Update stock error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Helper function to generate SKU
function generateSKU(name) {
  const prefix = 'JAM';
  const namePrefix = name.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().substring(9, 13);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}-${namePrefix}-${timestamp}${random}`;
}

module.exports = router;
