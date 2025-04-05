const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Payment Schema
 * Represents payment transactions for orders, integrated with the Moyasser payment gateway
 */
const PaymentSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order reference is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'SAR',
    enum: ['SAR', 'USD', 'AED', 'EUR']
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'apple_pay', 'mada']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  moyasserPaymentId: {
    type: String
  },
  moyasserResponse: {
    type: Object
  },
  transactionFee: {
    type: Number,
    min: [0, 'Transaction fee cannot be negative']
  },
  refundId: {
    type: String
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ moyasserPaymentId: 1 });

// Method to process payment through Moyasser
PaymentSchema.methods.processPayment = async function() {
  // This would be implemented with actual Moyasser API integration
  this.status = 'processing';
  return this.save();
};

// Method to verify payment status with Moyasser
PaymentSchema.methods.verifyPayment = async function() {
  // This would be implemented with actual Moyasser API integration
  // For now, we'll simulate a successful payment
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to process refund through Moyasser
PaymentSchema.methods.refundPayment = async function(amount) {
  // Validate refund amount
  if (!amount || amount <= 0 || amount > this.amount) {
    throw new Error('Invalid refund amount');
  }
  
  // This would be implemented with actual Moyasser API integration
  this.status = 'refunded';
  return this.save();
};

// Pre-save hook to update timestamps
PaymentSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Create and export the Payment model
const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
