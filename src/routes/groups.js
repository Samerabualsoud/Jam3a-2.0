const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const User = require('../models/User');
const Group = require('../models/Group');
const Product = require('../models/Product');

// Import middleware (to be implemented)
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

/**
 * @route   GET /api/groups
 * @desc    Get all groups with filtering and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      productId, 
      status, 
      page = 1, 
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (productId) filter.productId = productId;
    if (status) filter.status = status;

    // Build sort object
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with population
    const groups = await Group.find(filter)
      .populate('productId', 'name nameAr image price')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Group.countDocuments(filter);
    
    res.json({
      groups,
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
 * @route   GET /api/groups/:id
 * @desc    Get group by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('productId', 'name nameAr description descriptionAr image price originalPrice discount')
      .populate('participants.userId', 'name');
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/groups
 * @desc    Create a new group
 * @access  Private
 */
router.post('/', [
  // auth,
  [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('targetParticipants', 'Target participants is required and must be a number').isNumeric(),
    check('expiresAt', 'Expiration date is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId, targetParticipants, expiresAt } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Create new group
    const group = new Group({
      productId,
      name: `${product.name} Group`,
      targetParticipants,
      expiresAt: new Date(expiresAt),
      participants: []
    });

    await group.save();
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/groups/:id/join
 * @desc    Join a group
 * @access  Private
 */
router.post('/:id/join', [
  // auth,
  [
    check('amount', 'Amount is required and must be a number').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { amount } = req.body;
    const userId = req.body.userId; // This would come from auth middleware in production
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if group is open
    if (group.status !== 'open') {
      return res.status(400).json({ msg: `Group is ${group.status}, cannot join` });
    }
    
    // Check if user is already a participant
    const existingParticipant = group.participants.find(p => 
      p.userId.toString() === userId.toString()
    );
    
    if (existingParticipant) {
      return res.status(400).json({ msg: 'User is already a participant in this group' });
    }
    
    // Add participant
    await group.addParticipant(userId, amount);
    
    // Check if group is now complete
    if (group.isComplete()) {
      // In a real implementation, this would trigger order creation
      // and payment processing for all participants
    }
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/groups/user/:userId
 * @desc    Get groups for a user
 * @access  Private
 */
router.get('/user/:userId', [
  // auth
], async (req, res) => {
  try {
    // Ensure user can only access their own groups unless admin
    // This would be handled by auth middleware in production
    
    // Find groups where user is a participant
    const groups = await Group.find({
      'participants.userId': req.params.userId
    })
    .populate('productId', 'name nameAr image price')
    .sort({ createdAt: -1 });
    
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
