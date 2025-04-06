const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import services
const NotificationService = require('../services/NotificationService');

// Import models
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const JamDeal = require('../models/JamDeal');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   POST /api/notifications/test-email
 * @desc    Send a test email (admin only)
 * @access  Private (Admin)
 */
router.post('/test-email', [
  auth,
  admin,
  [
    check('email', 'Valid email is required').isEmail()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, subject, text, html } = req.body;
    
    const emailData = {
      to: email,
      subject: subject || 'Jam3a Platform - Test Email',
      text: text || 'This is a test email from Jam3a Platform.',
      html: html || '<h1>Jam3a Platform</h1><p>This is a test email from Jam3a Platform.</p>'
    };
    
    const result = await NotificationService.sendEmail(emailData);
    
    res.json({
      success: true,
      messageId: result.messageId,
      message: 'Test email sent successfully'
    });
  } catch (err) {
    console.error('Test email error:', err.message);
    res.status(500).json({ msg: 'Failed to send test email', error: err.message });
  }
});

/**
 * @route   POST /api/notifications/welcome
 * @desc    Send welcome email to user (admin only)
 * @access  Private (Admin)
 */
router.post('/welcome', [
  auth,
  admin,
  [
    check('userId', 'User ID is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const result = await NotificationService.sendWelcomeEmail(user);
    
    res.json({
      success: true,
      messageId: result.messageId,
      message: 'Welcome email sent successfully'
    });
  } catch (err) {
    console.error('Welcome email error:', err.message);
    res.status(500).json({ msg: 'Failed to send welcome email', error: err.message });
  }
});

/**
 * @route   POST /api/notifications/order-confirmation
 * @desc    Send order confirmation email
 * @access  Private
 */
router.post('/order-confirmation', [
  auth,
  [
    check('orderId', 'Order ID is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { orderId } = req.body;
    
    // Find order
    const order = await Order.findById(orderId)
      .populate('items.product', 'name price images description')
      .lean();
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if user is authorized
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to send this notification' });
    }
    
    // Find user
    const user = await User.findById(order.user);
    
    const result = await NotificationService.sendOrderConfirmationEmail({
      user,
      order: {
        ...order,
        _id: orderId
      }
    });
    
    res.json({
      success: true,
      messageId: result.messageId,
      message: 'Order confirmation email sent successfully'
    });
  } catch (err) {
    console.error('Order confirmation email error:', err.message);
    res.status(500).json({ msg: 'Failed to send order confirmation email', error: err.message });
  }
});

/**
 * @route   POST /api/notifications/deal-join
 * @desc    Send deal join confirmation email
 * @access  Private
 */
router.post('/deal-join', [
  auth,
  [
    check('dealId', 'Deal ID is required').not().isEmpty(),
    check('userId', 'User ID is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { dealId, userId } = req.body;
    
    // Check if user is authorized
    if (userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to send this notification' });
    }
    
    // Find deal
    const deal = await JamDeal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }
    
    // Find product
    const product = await Product.findById(deal.product);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const result = await NotificationService.sendDealJoinConfirmationEmail({
      user,
      deal: {
        ...deal.toObject(),
        _id: dealId
      },
      product
    });
    
    res.json({
      success: true,
      messageId: result.messageId,
      message: 'Deal join confirmation email sent successfully'
    });
  } catch (err) {
    console.error('Deal join confirmation email error:', err.message);
    res.status(500).json({ msg: 'Failed to send deal join confirmation email', error: err.message });
  }
});

/**
 * @route   POST /api/notifications/deal-completion
 * @desc    Send deal completion notification to all participants
 * @access  Private (Admin)
 */
router.post('/deal-completion', [
  auth,
  admin,
  [
    check('dealId', 'Deal ID is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { dealId } = req.body;
    
    // Find deal
    const deal = await JamDeal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }
    
    // Find product
    const product = await Product.findById(deal.product);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    // Get all participants
    const participants = deal.participants;
    
    // Send email to each participant
    const results = [];
    for (const participantId of participants) {
      const user = await User.findById(participantId);
      if (user) {
        try {
          const result = await NotificationService.sendDealCompletionEmail({
            user,
            deal: {
              ...deal.toObject(),
              _id: dealId
            },
            product
          });
          
          results.push({
            userId: user._id,
            email: user.email,
            success: true,
            messageId: result.messageId
          });
        } catch (error) {
          results.push({
            userId: user._id,
            email: user.email,
            success: false,
            error: error.message
          });
        }
      }
    }
    
    res.json({
      success: true,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
      results
    });
  } catch (err) {
    console.error('Deal completion notification error:', err.message);
    res.status(500).json({ msg: 'Failed to send deal completion notifications', error: err.message });
  }
});

/**
 * @route   POST /api/notifications/order-status-update
 * @desc    Send order status update email
 * @access  Private (Admin)
 */
router.post('/order-status-update', [
  auth,
  admin,
  [
    check('orderId', 'Order ID is required').not().isEmpty(),
    check('oldStatus', 'Old status is required').not().isEmpty(),
    check('newStatus', 'New status is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { orderId, oldStatus, newStatus } = req.body;
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Find user
    const user = await User.findById(order.user);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const result = await NotificationService.sendOrderStatusUpdateEmail({
      user,
      order: {
        ...order.toObject(),
        _id: orderId
      },
      oldStatus,
      newStatus
    });
    
    res.json({
      success: true,
      messageId: result.messageId,
      message: 'Order status update email sent successfully'
    });
  } catch (err) {
    console.error('Order status update email error:', err.message);
    res.status(500).json({ msg: 'Failed to send order status update email', error: err.message });
  }
});

/**
 * @route   POST /api/notifications/password-reset
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/password-reset', [
  check('email', 'Valid email is required').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that the email doesn't exist
      return res.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link'
      });
    }
    
    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();
    
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    await NotificationService.sendPasswordResetEmail({
      user,
      resetToken,
      resetUrl
    });
    
    res.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link'
    });
  } catch (err) {
    console.error('Password reset email error:', err.message);
    res.status(500).json({ msg: 'Failed to send password reset email', error: err.message });
  }
});

/**
 * @route   POST /api/notifications/waiting-list
 * @desc    Send waiting list notification
 * @access  Private (Admin)
 */
router.post('/waiting-list', [
  auth,
  admin,
  [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('userIds', 'User IDs are required').isArray({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId, userIds } = req.body;
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    // Send email to each user
    const results = [];
    for (const userId of userIds) {
      const user = await User.findById(userId);
      if (user) {
        try {
          const result = await NotificationService.sendWaitingListNotification({
            user,
            product
          });
          
          results.push({
            userId: user._id,
            email: user.email,
            success: true,
            messageId: result.messageId
          });
        } catch (error) {
          results.push({
            userId: user._id,
            email: user.email,
            success: false,
            error: error.message
          });
        }
      }
    }
    
    res.json({
      success: true,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
      results
    });
  } catch (err) {
    console.error('Waiting list notification error:', err.message);
    res.status(500).json({ msg: 'Failed to send waiting list notifications', error: err.message });
  }
});

module.exports = router;
