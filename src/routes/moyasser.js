const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import services
const MoyasserService = require('../services/MoyasserService');

// Import models
const Order = require('../models/Order');
const User = require('../models/User');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   POST /api/payments/moyasser/create
 * @desc    Create a new Moyasser payment
 * @access  Private
 */
router.post('/moyasser/create', [
  auth,
  [
    check('amount', 'Amount is required').isNumeric(),
    check('orderId', 'Order ID is required').not().isEmpty(),
    check('source', 'Payment source is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { amount, orderId, source, callbackUrl } = req.body;
    
    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to pay for this order' });
    }
    
    // Create payment
    const paymentData = {
      amount,
      description: `Payment for Order #${order.invoiceNumber || orderId}`,
      callbackUrl: callbackUrl || `${process.env.FRONTEND_URL}/payment/verify`,
      source,
      metadata: {
        orderId,
        userId: req.user.id
      }
    };
    
    const payment = await MoyasserService.createPayment(paymentData);
    
    // Update order with payment details
    order.paymentDetails = {
      transactionId: payment.id,
      status: payment.status,
      provider: 'moyasser',
      amount: MoyasserService.formatAmount(payment.amount),
      currency: payment.currency,
      paymentDate: new Date(),
      cardLast4: payment.source?.type === 'creditcard' ? payment.source.last4 : null
    };
    
    await order.save();
    
    res.json({
      payment,
      order: {
        id: order._id,
        invoiceNumber: order.invoiceNumber,
        status: order.status,
        paymentDetails: order.paymentDetails
      }
    });
  } catch (err) {
    console.error('Create Moyasser payment error:', err.message);
    res.status(500).json({ msg: 'Payment creation failed', error: err.message });
  }
});

/**
 * @route   POST /api/payments/moyasser/verify
 * @desc    Verify a Moyasser payment
 * @access  Public
 */
router.post('/moyasser/verify', [
  check('paymentId', 'Payment ID is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentId } = req.body;
    
    // Verify payment
    const payment = await MoyasserService.verifyPayment(paymentId);
    
    // Find order by payment ID
    const order = await Order.findOne({
      'paymentDetails.transactionId': paymentId
    });
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found for this payment' });
    }
    
    // Update order status based on payment status
    if (payment.status === 'paid') {
      order.paymentDetails.status = 'paid';
      
      // Update order status if it was pending
      if (order.status === 'pending') {
        order.status = 'processing';
        order.statusHistory.push({
          status: 'processing',
          date: new Date(),
          notes: 'Payment confirmed'
        });
      }
    } else if (payment.status === 'failed') {
      order.paymentDetails.status = 'failed';
    }
    
    await order.save();
    
    res.json({
      payment,
      order: {
        id: order._id,
        invoiceNumber: order.invoiceNumber,
        status: order.status,
        paymentDetails: order.paymentDetails
      }
    });
  } catch (err) {
    console.error('Verify Moyasser payment error:', err.message);
    res.status(500).json({ msg: 'Payment verification failed', error: err.message });
  }
});

/**
 * @route   POST /api/payments/moyasser/refund
 * @desc    Refund a Moyasser payment
 * @access  Private (Admin)
 */
router.post('/moyasser/refund', [
  auth,
  admin,
  [
    check('paymentId', 'Payment ID is required').not().isEmpty(),
    check('reason', 'Refund reason is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentId, amount, reason } = req.body;
    
    // Find order by payment ID
    const order = await Order.findOne({
      'paymentDetails.transactionId': paymentId
    });
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found for this payment' });
    }
    
    // Process refund
    const refund = await MoyasserService.refundPayment(paymentId, amount, reason);
    
    // Update order status
    order.status = 'refunded';
    order.statusHistory.push({
      status: 'refunded',
      date: new Date(),
      updatedBy: req.user.id,
      notes: reason
    });
    
    order.paymentDetails.status = 'refunded';
    
    await order.save();
    
    res.json({
      refund,
      order: {
        id: order._id,
        invoiceNumber: order.invoiceNumber,
        status: order.status,
        paymentDetails: order.paymentDetails
      }
    });
  } catch (err) {
    console.error('Refund Moyasser payment error:', err.message);
    res.status(500).json({ msg: 'Payment refund failed', error: err.message });
  }
});

/**
 * @route   POST /api/payments/moyasser/webhook
 * @desc    Handle Moyasser webhook events
 * @access  Public
 */
router.post('/moyasser/webhook', async (req, res) => {
  try {
    const signature = req.headers['moyasar-signature'];
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    const isValid = MoyasserService.verifyWebhookSignature(signature, payload);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ msg: 'Invalid signature' });
    }
    
    const event = req.body;
    
    // Handle different event types
    switch (event.type) {
      case 'payment.created':
        // Payment was created, no action needed
        break;
        
      case 'payment.paid':
        // Payment was successful
        await handleSuccessfulPayment(event.data);
        break;
        
      case 'payment.failed':
        // Payment failed
        await handleFailedPayment(event.data);
        break;
        
      case 'payment.refunded':
        // Payment was refunded
        await handleRefundedPayment(event.data);
        break;
        
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }
    
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    res.status(500).json({ msg: 'Webhook processing failed', error: err.message });
  }
});

/**
 * @route   GET /api/payments/moyasser/config
 * @desc    Get Moyasser payment form configuration
 * @access  Private
 */
router.get('/moyasser/config', auth, async (req, res) => {
  try {
    const { orderId } = req.query;
    
    if (!orderId) {
      return res.status(400).json({ msg: 'Order ID is required' });
    }
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if user is authorized
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to access this order' });
    }
    
    // Get user details
    const user = await User.findById(req.user.id);
    
    // Generate form config
    const config = MoyasserService.generateFormConfig({
      amount: order.total,
      orderId: order.invoiceNumber || order._id,
      customerName: user.name,
      customerEmail: user.email
    });
    
    res.json(config);
  } catch (err) {
    console.error('Get Moyasser config error:', err.message);
    res.status(500).json({ msg: 'Failed to get payment configuration', error: err.message });
  }
});

/**
 * Handle successful payment webhook
 * @param {Object} paymentData - Payment data from webhook
 */
async function handleSuccessfulPayment(paymentData) {
  try {
    // Extract order ID from metadata
    const orderId = paymentData.metadata?.orderId;
    
    if (!orderId) {
      console.error('Order ID not found in payment metadata');
      return;
    }
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }
    
    // Update order status
    order.paymentDetails = {
      transactionId: paymentData.id,
      status: 'paid',
      provider: 'moyasser',
      amount: MoyasserService.formatAmount(paymentData.amount),
      currency: paymentData.currency,
      paymentDate: new Date(),
      cardLast4: paymentData.source?.type === 'creditcard' ? paymentData.source.last4 : null
    };
    
    // Update order status if it was pending
    if (order.status === 'pending') {
      order.status = 'processing';
      order.statusHistory.push({
        status: 'processing',
        date: new Date(),
        notes: 'Payment confirmed via webhook'
      });
    }
    
    await order.save();
    
    console.log(`Order ${orderId} updated with successful payment`);
  } catch (err) {
    console.error('Error handling successful payment webhook:', err.message);
  }
}

/**
 * Handle failed payment webhook
 * @param {Object} paymentData - Payment data from webhook
 */
async function handleFailedPayment(paymentData) {
  try {
    // Extract order ID from metadata
    const orderId = paymentData.metadata?.orderId;
    
    if (!orderId) {
      console.error('Order ID not found in payment metadata');
      return;
    }
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }
    
    // Update payment details
    order.paymentDetails = {
      transactionId: paymentData.id,
      status: 'failed',
      provider: 'moyasser',
      amount: MoyasserService.formatAmount(paymentData.amount),
      currency: paymentData.currency,
      paymentDate: new Date(),
      cardLast4: paymentData.source?.type === 'creditcard' ? paymentData.source.last4 : null
    };
    
    await order.save();
    
    console.log(`Order ${orderId} updated with failed payment`);
  } catch (err) {
    console.error('Error handling failed payment webhook:', err.message);
  }
}

/**
 * Handle refunded payment webhook
 * @param {Object} paymentData - Payment data from webhook
 */
async function handleRefundedPayment(paymentData) {
  try {
    // Find order by payment ID
    const order = await Order.findOne({
      'paymentDetails.transactionId': paymentData.id
    });
    
    if (!order) {
      console.error(`Order not found for payment: ${paymentData.id}`);
      return;
    }
    
    // Update order status
    order.status = 'refunded';
    order.statusHistory.push({
      status: 'refunded',
      date: new Date(),
      notes: 'Refund processed via webhook'
    });
    
    order.paymentDetails.status = 'refunded';
    
    await order.save();
    
    console.log(`Order ${order._id} updated with refund`);
  } catch (err) {
    console.error('Error handling refunded payment webhook:', err.message);
  }
}

module.exports = router;
