const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');

// Import middleware (to be implemented)
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

/**
 * @route   POST /api/payments/moyasser/create
 * @desc    Create a new Moyasser payment
 * @access  Private
 */
router.post('/moyasser/create', [
  // auth,
  [
    check('orderId', 'Order ID is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('method', 'Payment method is required').isIn([
      'credit_card', 'debit_card', 'bank_transfer', 'apple_pay', 'mada'
    ])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { orderId, amount, currency = 'SAR', method } = req.body;
    
    // In production, userId would come from auth middleware
    const userId = req.body.userId;
    
    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Ensure user owns the order or is admin
    // if (order.userId.toString() !== userId && !req.user.isAdmin) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }
    
    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({ 
        msg: 'Payment already exists for this order',
        payment: existingPayment
      });
    }
    
    // Create new payment
    const payment = new Payment({
      orderId,
      userId,
      amount,
      currency,
      method,
      status: 'pending'
    });
    
    await payment.save();
    
    // In a real implementation, this would integrate with Moyasser API
    // For now, we'll simulate the integration
    
    // Simulate Moyasser payment ID
    const moyasserPaymentId = 'moy_' + Math.random().toString(36).substring(2, 15);
    
    // Simulate Moyasser response
    const moyasserResponse = {
      id: moyasserPaymentId,
      status: 'initiated',
      amount: amount,
      currency: currency,
      fee: amount * 0.025, // 2.5% fee
      description: `Payment for order ${orderId}`,
      url: `https://moyasser.com/payments/${moyasserPaymentId}`,
      created_at: new Date().toISOString()
    };
    
    // Update payment with Moyasser details
    payment.moyasserPaymentId = moyasserPaymentId;
    payment.moyasserResponse = moyasserResponse;
    payment.transactionFee = moyasserResponse.fee;
    
    await payment.save();
    
    // Return payment with Moyasser payment URL
    res.json({
      payment,
      moyasserPaymentUrl: moyasserResponse.url
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/payments/moyasser/callback
 * @desc    Moyasser payment callback
 * @access  Public
 */
router.post('/moyasser/callback', async (req, res) => {
  try {
    // In a real implementation, this would verify the callback with Moyasser
    // and update the payment status accordingly
    
    const { moyasserPaymentId, status } = req.body;
    
    // Find payment by Moyasser payment ID
    const payment = await Payment.findOne({ moyasserPaymentId });
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    // Update payment status
    if (status === 'completed') {
      payment.status = 'completed';
      payment.completedAt = new Date();
      
      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = 'paid';
        order.paymentId = payment._id;
        await order.save();
      }
    } else if (status === 'failed') {
      payment.status = 'failed';
    }
    
    await payment.save();
    
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment details
 * @access  Private
 */
router.get('/:id', [
  // auth
], async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId')
      .populate('userId', 'name email');
    
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    // In production, ensure user can only access their own payments unless admin
    // const userId = req.user.id;
    // if (payment.userId.toString() !== userId && !req.user.isAdmin) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/payments/:id/verify
 * @desc    Verify payment status with Moyasser
 * @access  Private
 */
router.post('/:id/verify', [
  // auth
], async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    // In production, ensure user can only access their own payments unless admin
    // const userId = req.user.id;
    // if (payment.userId.toString() !== userId && !req.user.isAdmin) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }
    
    // In a real implementation, this would verify the payment status with Moyasser API
    // For now, we'll simulate the verification
    
    // Simulate verification result (80% chance of success)
    const isSuccessful = Math.random() < 0.8;
    
    if (isSuccessful) {
      payment.status = 'completed';
      payment.completedAt = new Date();
      
      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = 'paid';
        order.paymentId = payment._id;
        await order.save();
      }
    } else {
      payment.status = 'failed';
    }
    
    await payment.save();
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Process refund through Moyasser
 * @access  Private/Admin
 */
router.post('/:id/refund', [
  // auth, admin,
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
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    // Check if payment is completed
    if (payment.status !== 'completed') {
      return res.status(400).json({ msg: `Cannot refund payment with status: ${payment.status}` });
    }
    
    // Check if refund amount is valid
    if (amount <= 0 || amount > payment.amount) {
      return res.status(400).json({ msg: 'Invalid refund amount' });
    }
    
    // In a real implementation, this would process the refund through Moyasser API
    // For now, we'll simulate the refund
    
    // Simulate refund ID
    const refundId = 'ref_' + Math.random().toString(36).substring(2, 15);
    
    // Update payment
    payment.status = 'refunded';
    payment.refundId = refundId;
    
    await payment.save();
    
    // Update order status
    const order = await Order.findById(payment.orderId);
    if (order) {
      order.status = 'cancelled';
      await order.save();
    }
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

module.exports = router;
