const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import services
const MoyasserService = require('../services/MoyasserService');

// Import models
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Import middleware (to be implemented)
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');

/**
 * @route   POST /api/moyasser/create-payment
 * @desc    Create a new payment with Moyasser
 * @access  Private
 */
router.post('/create-payment', [
  // auth,
  [
    check('orderId', 'Order ID is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('currency', 'Currency is required').isIn(['SAR', 'USD', 'AED', 'EUR']),
    check('description', 'Description is required').not().isEmpty(),
    check('source', 'Payment source is required').isIn(['credit_card', 'debit_card', 'mada', 'apple_pay'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { orderId, amount, currency, description, source } = req.body;
    
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
    
    // Generate callback URL
    const callbackUrl = `${req.protocol}://${req.get('host')}/api/moyasser/callback`;
    
    // Create payment with Moyasser
    const moyasserResponse = await MoyasserService.createPayment({
      amount,
      currency,
      description,
      callbackUrl,
      source
    });
    
    // Create new payment record
    const payment = new Payment({
      orderId,
      userId,
      amount,
      currency,
      method: source,
      status: 'pending',
      moyasserPaymentId: moyasserResponse.id,
      moyasserResponse,
      transactionFee: moyasserResponse.fee
    });
    
    await payment.save();
    
    // Return payment with Moyasser payment URL
    res.json({
      payment,
      moyasserPaymentUrl: moyasserResponse.url
    });
  } catch (err) {
    console.error('Moyasser payment creation error:', err.message);
    res.status(500).json({ msg: 'Failed to create payment', error: err.message });
  }
});

/**
 * @route   POST /api/moyasser/callback
 * @desc    Handle Moyasser payment callback
 * @access  Public
 */
router.post('/callback', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['moyasser-signature'];
    const payload = JSON.stringify(req.body);
    
    const isValid = MoyasserService.verifyWebhookSignature(signature, payload);
    if (!isValid) {
      return res.status(400).json({ msg: 'Invalid signature' });
    }
    
    const { id, status, amount, fee } = req.body;
    
    // Find payment by Moyasser payment ID
    const payment = await Payment.findOne({ moyasserPaymentId: id });
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    // Update payment status based on Moyasser status
    if (status === 'paid') {
      payment.status = 'completed';
      payment.completedAt = new Date();
      payment.transactionFee = fee;
      
      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = 'paid';
        order.paymentId = payment._id;
        order.paymentMethod = payment.method;
        await order.save();
      }
    } else if (status === 'failed') {
      payment.status = 'failed';
    }
    
    // Update Moyasser response
    payment.moyasserResponse = req.body;
    
    await payment.save();
    
    res.json({ success: true });
  } catch (err) {
    console.error('Moyasser callback error:', err.message);
    res.status(500).json({ msg: 'Failed to process callback', error: err.message });
  }
});

/**
 * @route   GET /api/moyasser/verify/:paymentId
 * @desc    Verify payment status with Moyasser
 * @access  Private
 */
router.get('/verify/:paymentId', [
  // auth
], async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    // In production, ensure user can only access their own payments unless admin
    // const userId = req.user.id;
    // if (payment.userId.toString() !== userId && !req.user.isAdmin) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }
    
    // Verify payment with Moyasser
    const moyasserResponse = await MoyasserService.verifyPayment(payment.moyasserPaymentId);
    
    // Update payment status based on Moyasser status
    if (moyasserResponse.status === 'paid') {
      payment.status = 'completed';
      payment.completedAt = new Date();
      payment.transactionFee = moyasserResponse.fee;
      
      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = 'paid';
        order.paymentId = payment._id;
        order.paymentMethod = payment.method;
        await order.save();
      }
    } else if (moyasserResponse.status === 'failed') {
      payment.status = 'failed';
    }
    
    // Update Moyasser response
    payment.moyasserResponse = moyasserResponse;
    
    await payment.save();
    
    res.json({
      payment,
      moyasserResponse
    });
  } catch (err) {
    console.error('Moyasser verification error:', err.message);
    res.status(500).json({ msg: 'Failed to verify payment', error: err.message });
  }
});

/**
 * @route   POST /api/moyasser/refund/:paymentId
 * @desc    Process refund through Moyasser
 * @access  Private/Admin
 */
router.post('/refund/:paymentId', [
  // auth, admin,
  [
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('reason', 'Reason is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { amount, reason } = req.body;
    
    const payment = await Payment.findById(req.params.paymentId);
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
    
    // Process refund with Moyasser
    const refundResponse = await MoyasserService.processRefund(payment.moyasserPaymentId, {
      amount,
      reason
    });
    
    // Update payment
    payment.status = 'refunded';
    payment.refundId = refundResponse.id;
    payment.moyasserResponse = {
      ...payment.moyasserResponse,
      refund: refundResponse
    };
    
    await payment.save();
    
    // Update order status
    const order = await Order.findById(payment.orderId);
    if (order) {
      order.status = 'cancelled';
      await order.save();
    }
    
    res.json({
      payment,
      refundResponse
    });
  } catch (err) {
    console.error('Moyasser refund error:', err.message);
    res.status(500).json({ msg: 'Failed to process refund', error: err.message });
  }
});

/**
 * @route   GET /api/moyasser/client-form/:orderId
 * @desc    Generate payment form data for client-side integration
 * @access  Private
 */
router.get('/client-form/:orderId', [
  // auth
], async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // In production, ensure user can only access their own orders unless admin
    // const userId = req.user.id;
    // if (order.userId.toString() !== userId && !req.user.isAdmin) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }
    
    // Generate payment form data
    const formData = MoyasserService.generatePaymentForm({
      amount: order.totalAmount,
      currency: 'SAR',
      description: `Payment for order #${order._id}`,
      orderId: order._id
    });
    
    res.json(formData);
  } catch (err) {
    console.error('Moyasser form generation error:', err.message);
    res.status(500).json({ msg: 'Failed to generate payment form', error: err.message });
  }
});

module.exports = router;
