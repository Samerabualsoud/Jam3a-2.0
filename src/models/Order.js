const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Order Schema
 * Represents customer orders in the Jam3a platform
 */
const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'cash', 'moyasser'],
    default: 'cash'
  },
  paymentDetails: {
    transactionId: String,
    status: String,
    provider: String,
    amount: Number,
    currency: String,
    paymentDate: Date,
    cardLast4: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    },
    date: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  dealId: {
    type: Schema.Types.ObjectId,
    ref: 'JamDeal',
    default: null
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  invoiceNumber: String
}, {
  timestamps: true
});

// Index for faster queries
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: 1 });
OrderSchema.index({ 'paymentDetails.transactionId': 1 });
OrderSchema.index({ dealId: 1 });

// Pre-save hook to generate invoice number
OrderSchema.pre('save', function(next) {
  if (!this.invoiceNumber && this.isNew) {
    const prefix = 'JAM';
    const timestamp = Date.now().toString().substring(7, 13);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoiceNumber = `${prefix}-${timestamp}-${random}`;
  }
  
  // Initialize status history if new order
  if (this.isNew && !this.statusHistory.length) {
    this.statusHistory.push({
      status: this.status,
      date: Date.now(),
      updatedBy: this.user
    });
  }
  
  next();
});

// Virtual for subtotal (before tax, shipping, discount)
OrderSchema.virtual('subtotal').get(function() {
  return this.items.reduce((sum, item) => sum + item.total, 0);
});

// Virtual for grand total (after tax, shipping, discount)
OrderSchema.virtual('grandTotal').get(function() {
  return this.total + this.shippingCost + this.tax - this.discount;
});

// Method to check if order can be cancelled
OrderSchema.methods.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.status);
};

// Method to check if order is complete
OrderSchema.methods.isComplete = function() {
  return this.status === 'delivered';
};

// Method to add status history
OrderSchema.methods.addStatusHistory = function(status, userId, notes) {
  this.status = status;
  this.statusHistory.push({
    status,
    date: Date.now(),
    updatedBy: userId,
    notes: notes || ''
  });
};

// Create and export the Order model
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
