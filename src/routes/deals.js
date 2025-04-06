const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Import models
const JamDeal = require('../models/JamDeal');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const seller = require('../middleware/seller');

/**
 * @route   GET /api/deals
 * @desc    Get all deals with pagination and filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      minDiscount, 
      maxDiscount,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (category) {
      filter.category = mongoose.Types.ObjectId(category);
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (minDiscount || maxDiscount) {
      filter.discount = {};
      if (minDiscount) filter.discount.$gte = Number(minDiscount);
      if (maxDiscount) filter.discount.$lte = Number(maxDiscount);
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const deals = await JamDeal.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('category', 'name')
      .populate('createdBy', 'name')
      .lean();

    // Get total count for pagination
    const total = await JamDeal.countDocuments(filter);

    res.json({
      deals,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Get deals error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/deals/featured
 * @desc    Get featured deals
 * @access  Public
 */
router.get('/featured', async (req, res) => {
  try {
    const deals = await JamDeal.find({ 
      status: 'active',
      featured: true 
    })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('category', 'name')
    .lean();

    // Calculate progress and time remaining for each deal
    const dealsWithProgress = deals.map(deal => {
      const progress = (deal.currentParticipants / deal.maxParticipants) * 100;
      
      // Calculate time remaining
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const timeRemaining = getTimeRemaining(now, endDate);
      
      return {
        ...deal,
        progress,
        timeRemaining
      };
    });

    res.json(dealsWithProgress);
  } catch (err) {
    console.error('Get featured deals error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/deals/:id
 * @desc    Get deal by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const deal = await JamDeal.findById(req.params.id)
      .populate('category', 'name')
      .populate('createdBy', 'name')
      .lean();

    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }

    // Calculate progress and time remaining
    const progress = (deal.currentParticipants / deal.maxParticipants) * 100;
    
    // Calculate time remaining
    const endDate = new Date(deal.endDate);
    const now = new Date();
    const timeRemaining = getTimeRemaining(now, endDate);
    
    // Get participants
    const participants = await User.find({
      _id: { $in: deal.participants }
    }).select('name profile.avatar').lean();

    res.json({
      ...deal,
      progress,
      timeRemaining,
      participants
    });
  } catch (err) {
    console.error('Get deal error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/deals
 * @desc    Create a new deal
 * @access  Private (Seller or Admin)
 */
router.post('/', [
  auth,
  seller,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('discount', 'Discount is required').isNumeric(),
    check('maxParticipants', 'Maximum participants is required').isNumeric(),
    check('endDate', 'End date is required').isISO8601()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      category,
      discount,
      maxParticipants,
      endDate,
      image,
      featured
    } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ msg: 'Category not found' });
    }

    // Create new deal
    const newDeal = new JamDeal({
      title,
      titleAr,
      description,
      descriptionAr,
      category,
      discount,
      maxParticipants,
      endDate,
      image,
      featured: featured || false,
      createdBy: req.user.id,
      status: 'active',
      currentParticipants: 0,
      participants: []
    });

    const deal = await newDeal.save();

    res.status(201).json(deal);
  } catch (err) {
    console.error('Create deal error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/deals/:id
 * @desc    Update a deal
 * @access  Private (Seller or Admin)
 */
router.put('/:id', [
  auth,
  seller,
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('category', 'Category is required').optional().not().isEmpty(),
    check('discount', 'Discount is required').optional().isNumeric(),
    check('maxParticipants', 'Maximum participants is required').optional().isNumeric(),
    check('endDate', 'End date is required').optional().isISO8601(),
    check('status', 'Status is required').optional().isIn(['active', 'completed', 'cancelled'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const deal = await JamDeal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }

    // Check if user is creator or admin
    if (deal.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to update this deal' });
    }

    // Update fields
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      category,
      discount,
      maxParticipants,
      endDate,
      image,
      featured,
      status
    } = req.body;

    if (title) deal.title = title;
    if (titleAr) deal.titleAr = titleAr;
    if (description) deal.description = description;
    if (descriptionAr) deal.descriptionAr = descriptionAr;
    if (category) {
      // Verify category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ msg: 'Category not found' });
      }
      deal.category = category;
    }
    if (discount) deal.discount = discount;
    if (maxParticipants) deal.maxParticipants = maxParticipants;
    if (endDate) deal.endDate = endDate;
    if (image) deal.image = image;
    if (featured !== undefined) deal.featured = featured;
    if (status) deal.status = status;

    const updatedDeal = await deal.save();

    res.json(updatedDeal);
  } catch (err) {
    console.error('Update deal error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   DELETE /api/deals/:id
 * @desc    Delete a deal
 * @access  Private (Admin or deal creator)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const deal = await JamDeal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }

    // Check if user is creator or admin
    if (deal.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to delete this deal' });
    }

    // If deal has participants, mark as cancelled instead of deleting
    if (deal.currentParticipants > 0) {
      deal.status = 'cancelled';
      await deal.save();
      return res.json({ msg: 'Deal cancelled successfully' });
    }

    await deal.remove();
    res.json({ msg: 'Deal removed successfully' });
  } catch (err) {
    console.error('Delete deal error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/deals/:id/join
 * @desc    Join a deal
 * @access  Private
 */
router.post('/:id/join', [
  auth,
  [
    check('productId', 'Product ID is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Find the deal
    const deal = await JamDeal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }

    // Check if deal is active
    if (deal.status !== 'active') {
      return res.status(400).json({ msg: 'This deal is no longer active' });
    }

    // Check if deal is full
    if (deal.currentParticipants >= deal.maxParticipants) {
      return res.status(400).json({ msg: 'This deal is already full' });
    }

    // Check if user already joined
    if (deal.participants.includes(userId)) {
      return res.status(400).json({ msg: 'You have already joined this deal' });
    }

    // Verify product exists and belongs to the deal's category
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    if (product.category.toString() !== deal.category.toString()) {
      return res.status(400).json({ msg: 'Product does not belong to this deal category' });
    }

    // Add user to participants
    deal.participants.push(userId);
    deal.currentParticipants = deal.participants.length;

    // Check if deal is now full
    if (deal.currentParticipants >= deal.maxParticipants) {
      deal.status = 'completed';
    }

    // Save the updated deal
    await deal.save();

    // Return the updated deal
    res.json({
      msg: 'Successfully joined the deal',
      deal: {
        id: deal._id,
        title: deal.title,
        discount: deal.discount,
        currentParticipants: deal.currentParticipants,
        maxParticipants: deal.maxParticipants,
        status: deal.status
      }
    });
  } catch (err) {
    console.error('Join deal error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/deals/categories/:categoryId
 * @desc    Get deals by category
 * @access  Public
 */
router.get('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Find deals in this category
    const deals = await JamDeal.find({ 
      category: categoryId,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .populate('category', 'name')
    .lean();

    // Get total count for pagination
    const total = await JamDeal.countDocuments({ 
      category: categoryId,
      status: 'active'
    });

    // Calculate progress and time remaining for each deal
    const dealsWithProgress = deals.map(deal => {
      const progress = (deal.currentParticipants / deal.maxParticipants) * 100;
      
      // Calculate time remaining
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const timeRemaining = getTimeRemaining(now, endDate);
      
      return {
        ...deal,
        progress,
        timeRemaining
      };
    });

    res.json({
      deals: dealsWithProgress,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Get deals by category error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/deals/:id/products
 * @desc    Get products for a deal
 * @access  Public
 */
router.get('/:id/products', async (req, res) => {
  try {
    const deal = await JamDeal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }

    // Find products in the deal's category
    const products = await Product.find({ 
      category: deal.category,
      active: true
    }).lean();

    // Calculate discounted price for each product
    const productsWithDiscount = products.map(product => {
      const discountedPrice = product.price * (1 - (deal.discount / 100));
      return {
        ...product,
        originalPrice: product.price,
        discountedPrice: Math.round(discountedPrice * 100) / 100,
        discount: deal.discount
      };
    });

    res.json({
      data: productsWithDiscount,
      dealId: deal._id,
      categoryId: deal.category
    });
  } catch (err) {
    console.error('Get deal products error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/deals/user/joined
 * @desc    Get deals joined by current user
 * @access  Private
 */
router.get('/user/joined', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find deals where user is a participant
    const deals = await JamDeal.find({ 
      participants: userId 
    })
    .sort({ createdAt: -1 })
    .populate('category', 'name')
    .lean();

    // Calculate progress and time remaining for each deal
    const dealsWithProgress = deals.map(deal => {
      const progress = (deal.currentParticipants / deal.maxParticipants) * 100;
      
      // Calculate time remaining
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const timeRemaining = getTimeRemaining(now, endDate);
      
      return {
        ...deal,
        progress,
        timeRemaining
      };
    });

    res.json(dealsWithProgress);
  } catch (err) {
    console.error('Get joined deals error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/deals/user/created
 * @desc    Get deals created by current user
 * @access  Private
 */
router.get('/user/created', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find deals created by user
    const deals = await JamDeal.find({ 
      createdBy: userId 
    })
    .sort({ createdAt: -1 })
    .populate('category', 'name')
    .lean();

    // Calculate progress and time remaining for each deal
    const dealsWithProgress = deals.map(deal => {
      const progress = (deal.currentParticipants / deal.maxParticipants) * 100;
      
      // Calculate time remaining
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const timeRemaining = getTimeRemaining(now, endDate);
      
      return {
        ...deal,
        progress,
        timeRemaining
      };
    });

    res.json(dealsWithProgress);
  } catch (err) {
    console.error('Get created deals error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Helper function to calculate time remaining
function getTimeRemaining(now, endDate) {
  const diff = endDate - now;
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}

module.exports = router;
