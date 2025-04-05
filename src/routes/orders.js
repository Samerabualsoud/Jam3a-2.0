const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Group = require('../models/Group');

// Import middleware (to be implemented)
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

/**
 * @route   GET /api/orders
 * @desc    Get all orders (admin only)
 * @access  Private/Admin
 */
router.get('/', [
  // auth, admin
], async (req, res) => {
  try {
    const { 
      status, 
      userId,
      page = 1, 
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    // Build sort object
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query
    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .populate('groupId', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Order.countDocuments(filter);
    
    res.json({
      orders,
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
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', [
  // auth
], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('groupId', 'name')
      .populate('products.productId', 'name image');
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // In production, ensure user can only access their own orders unless admin
    // const userId = req.user.id;
    // if (order.userId.toString() !== userId && !req.user.isAdmin) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', [
  // auth,
  [
    check('products', 'Products are required').isArray(),
    check('products.*.productId', 'Product ID is required').not().isEmpty(),
    check('products.*.quantity', 'Quantity must be a number').isNumeric(),
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
    check('shippingAddress.name', 'Recipient name is required').not().isEmpty(),
    check('shippingAddress.address', 'Address is required').not().isEmpty(),
    check('shippingAddress.city', 'City is required').not().isEmpty(),
    check('shippingAddress.country', 'Country is required').not().isEmpty(),
    check('shippingAddress.phone', 'Phone is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      products, 
      groupId, 
      shippingAddress, 
      notes 
    } = req.body;
    
    // In production, userId would come from auth middleware
    const userId = req.body.userId;
    
    // Validate products and get details
    const productDetails = [];
    let totalAmount = 0;
    
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ msg: `Product ${item.productId} not found` });
      }
      
      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          msg: `Not enough stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      // Calculate item price
      const price = product.price;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;
      
      productDetails.push({
        productId: product._id,
        name: product.name,
        price,
        quantity: item.quantity
      });
      
      // Update stock (in production, this would be done in a transaction)
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Create new order
    const order = new Order({
      userId,
      groupId: groupId || null,
      products: productDetails,
      totalAmount,
      shippingAddress,
      notes,
      status: 'pending'
    });
    
    await order.save();
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/orders/:id
 * @desc    Update order status (admin only)
 * @access  Private/Admin
 */
router.put('/:id', [
  // auth, admin,
  [
    check('status', 'Status is required').isIn([
      'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
    ])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Update status
    order.status = status;
    await order.save();
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

module.exports = router;
