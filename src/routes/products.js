const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Group = require('../models/Group');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// Import middleware (to be implemented)
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      status, 
      minPrice, 
      maxPrice,
      search,
      page = 1, 
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (status) filter.status = status;
    if (minPrice) filter.price = { $gte: Number(minPrice) };
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      featured: true,
      status: 'active'
    }).limit(6);
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private/Admin
 */
router.post('/', [
  // auth, admin,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('price', 'Price is required and must be a number').isNumeric(),
    check('stock', 'Stock must be a number').optional().isNumeric()
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
      category,
      price,
      originalPrice,
      stock,
      description,
      descriptionAr,
      image,
      images,
      targetAmount,
      featured,
      discount,
      supplier,
      sku,
      status,
      tags
    } = req.body;

    // Create new product
    const product = new Product({
      name,
      nameAr,
      category,
      price,
      originalPrice,
      stock,
      description,
      descriptionAr,
      image,
      images,
      targetAmount,
      featured,
      discount,
      supplier,
      sku,
      status,
      tags
    });

    await product.save();
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private/Admin
 */
router.put('/:id', [
  // auth, admin,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('price', 'Price must be a number').optional().isNumeric(),
    check('stock', 'Stock must be a number').optional().isNumeric()
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
    
    // Update fields
    const updateFields = req.body;
    Object.keys(updateFields).forEach(field => {
      product[field] = updateFields[field];
    });
    
    await product.save();
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
router.delete('/:id', [
  // auth, admin
], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    await product.remove();
    
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/products/bulk
 * @desc    Bulk operations on products
 * @access  Private/Admin
 */
router.post('/bulk', [
  // auth, admin,
  [
    check('operation', 'Operation is required').not().isEmpty(),
    check('ids', 'Product IDs are required').isArray(),
    check('data', 'Data object is required for update operations').optional()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { operation, ids, data } = req.body;
    
    switch (operation) {
      case 'delete':
        await Product.deleteMany({ _id: { $in: ids } });
        return res.json({ msg: `${ids.length} products deleted` });
        
      case 'update':
        if (!data) {
          return res.status(400).json({ msg: 'Data object is required for update operations' });
        }
        
        const result = await Product.updateMany(
          { _id: { $in: ids } },
          { $set: data }
        );
        
        return res.json({ 
          msg: `${result.nModified} products updated`,
          result
        });
        
      default:
        return res.status(400).json({ msg: 'Invalid operation' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
