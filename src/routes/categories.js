const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Import models
const Category = require('../models/Category');
const Product = require('../models/Product');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ name: 1 })
      .lean();
    
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error('Get category error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (Admin)
 */
router.post('/', [
  auth,
  admin,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { name, nameAr, description, descriptionAr, icon, image, featured } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ msg: 'Category already exists' });
    }
    
    // Create new category
    const newCategory = new Category({
      name,
      nameAr,
      description,
      descriptionAr,
      icon,
      image,
      featured: featured || false
    });
    
    const category = await newCategory.save();
    
    res.status(201).json(category);
  } catch (err) {
    console.error('Create category error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private (Admin)
 */
router.put('/:id', [
  auth,
  admin,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    // Update fields
    const { name, nameAr, description, descriptionAr, icon, image, featured } = req.body;
    
    if (name) category.name = name;
    if (nameAr) category.nameAr = nameAr;
    if (description) category.description = description;
    if (descriptionAr) category.descriptionAr = descriptionAr;
    if (icon) category.icon = icon;
    if (image) category.image = image;
    if (featured !== undefined) category.featured = featured;
    
    const updatedCategory = await category.save();
    
    res.json(updatedCategory);
  } catch (err) {
    console.error('Update category error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private (Admin)
 */
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    // Check if category has associated products
    const productsCount = await Product.countDocuments({ category: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete category with associated products',
        count: productsCount
      });
    }
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    await category.remove();
    
    res.json({ msg: 'Category removed successfully' });
  } catch (err) {
    console.error('Delete category error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/categories/:id/products
 * @desc    Get products by category
 * @access  Public
 */
router.get('/:id/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Verify category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    // Build sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    // Find products in this category
    const products = await Product.find({ 
      category: req.params.id,
      active: true
    })
    .sort(sortOptions)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .lean();
    
    // Get total count for pagination
    const total = await Product.countDocuments({ 
      category: req.params.id,
      active: true
    });
    
    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      category: {
        id: category._id,
        name: category.name,
        nameAr: category.nameAr,
        description: category.description
      }
    });
  } catch (err) {
    console.error('Get products by category error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/categories/featured
 * @desc    Get featured categories
 * @access  Public
 */
router.get('/featured/list', async (req, res) => {
  try {
    const categories = await Category.find({ featured: true })
      .sort({ name: 1 })
      .lean();
    
    res.json(categories);
  } catch (err) {
    console.error('Get featured categories error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
