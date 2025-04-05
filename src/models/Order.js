const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Order Schema
 * Represents purchase orders created by users, either individually or as part of group buying
 */
const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  products: [{
    productId: {
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
      required: true,
      min: [0, 'Price cannot be negative']
    },
    name: {
      type: String,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  },
  paymentMethod: {
    type: String
  },
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postalCode: {
      type: String
    },
    phone: {
      type: String,
      required: true
    }
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
OrderSchema.index({ userId: 1 });
OrderSchema.index({ groupId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: 1 });

// Method to calculate total order amount
OrderSchema.methods.calculateTotal = function() {
  return this.products.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Method to update order status
OrderSchema.methods.updateStatus = function(status) {
  const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  
  this.status = status;
  return this.save();
};

// Method to generate invoice data
OrderSchema.methods.generateInvoice = function() {
  return {
    orderId: this._id,
    customerName: this.shippingAddress.name,
    customerAddress: this.shippingAddress.address,
    customerCity: this.shippingAddress.city,
    customerCountry: this.shippingAddress.country,
    customerPhone: this.shippingAddress.phone,
    orderDate: this.createdAt,
    items: this.products.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    subtotal: this.calculateTotal(),
    total: this.totalAmount
  };
};

// Pre-save hook to calculate total amount if not provided
OrderSchema.pre('save', function(next) {
  if (!this.totalAmount) {
    this.totalAmount = this.calculateTotal();
  }
  next();
});

// Create and export the Order model
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
