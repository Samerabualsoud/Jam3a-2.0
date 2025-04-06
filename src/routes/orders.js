const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Import models
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   GET /api/orders
 * @desc    Get all orders (admin only)
 * @access  Private (Admin)
 */
router.get('/', [auth, admin], async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (status) {
      filter.status = status;
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const orders = await Order.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .lean();

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
    console.error('Get orders error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/orders/user
 * @desc    Get orders for current user
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = { user: req.user.id };
    
    if (status) {
      filter.status = status;
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const orders = await Order.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('items.product', 'name price images')
      .lean();

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
    console.error('Get user orders error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email profile')
      .populate('items.product', 'name price images description')
      .lean();

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    console.error('Get order error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', [
  auth,
  [
    check('items', 'Items are required').isArray({ min: 1 }),
    check('items.*.product', 'Product ID is required').not().isEmpty(),
    check('items.*.quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
    check('shippingAddress', 'Shipping address is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, shippingAddress, paymentMethod, dealId } = req.body;

    // Validate products and calculate total
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(400).json({ msg: `Product ${item.product} not found` });
      }
      
      if (!product.active) {
        return res.status(400).json({ msg: `Product ${product.name} is no longer available` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          msg: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      
      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal
      });
      
      total += itemTotal;
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create new order
    const newOrder = new Order({
      user: req.user.id,
      items: validatedItems,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash',
      dealId: dealId || null,
      status: 'pending'
    });

    const order = await newOrder.save();

    // Populate product details for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name price images')
      .lean();

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin)
 */
router.put('/:id/status', [
  auth,
  admin,
  [
    check('status', 'Status is required').isIn([
      'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    ])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    const { status } = req.body;
    const oldStatus = order.status;
    
    // Handle stock updates for cancellations
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      // Return items to inventory
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
    
    // Handle stock updates when un-cancelling an order
    if (oldStatus === 'cancelled' && status !== 'cancelled') {
      // Remove items from inventory again
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock -= item.quantity;
          if (product.stock < 0) product.stock = 0;
          await product.save();
        }
      }
    }
    
    // Update status and add to status history
    order.status = status;
    order.statusHistory.push({
      status,
      date: Date.now(),
      updatedBy: req.user.id
    });
    
    await order.save();

    res.json({ 
      msg: 'Order status updated successfully',
      order: {
        id: order._id,
        status: order.status,
        statusHistory: order.statusHistory
      }
    });
  } catch (err) {
    console.error('Update order status error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel an order (user)
 * @access  Private
 */
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Check if user is owner
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to cancel this order' });
    }
    
    // Check if order can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ 
        msg: `Cannot cancel order in ${order.status} status` 
      });
    }
    
    // Return items to inventory
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    
    // Update status and add to status history
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      date: Date.now(),
      updatedBy: req.user.id
    });
    
    await order.save();

    res.json({ 
      msg: 'Order cancelled successfully',
      order: {
        id: order._id,
        status: order.status
      }
    });
  } catch (err) {
    console.error('Cancel order error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/orders/stats/summary
 * @desc    Get order statistics
 * @access  Private (Admin)
 */
router.get('/stats/summary', [auth, admin], async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get orders by status
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format status counts
    const ordersByStatus = {};
    statusCounts.forEach(item => {
      ordersByStatus[item._id] = item.count;
    });
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .lean();
    
    res.json({
      totalOrders,
      ordersByStatus,
      totalRevenue,
      recentOrders
    });
  } catch (err) {
    console.error('Get order stats error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
