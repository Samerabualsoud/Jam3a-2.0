const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Product Schema
 * Represents products available for purchase on the Jam3a platform
 */
const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  nameAr: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  description: {
    type: String
  },
  descriptionAr: {
    type: String
  },
  image: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  targetAmount: {
    type: Number,
    min: [0, 'Target amount cannot be negative']
  },
  participants: {
    type: Number,
    default: 0,
    min: [0, 'Participants cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  averageJoinRate: {
    type: Number,
    min: [0, 'Average join rate cannot be negative']
  },
  supplier: {
    type: String
  },
  sku: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for frequently queried fields
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Virtual for discounted price
ProductSchema.virtual('discountedPrice').get(function() {
  if (this.discount && this.originalPrice) {
    return this.originalPrice * (1 - this.discount / 100);
  }
  return this.price;
});

// Method to check if product is in stock
ProductSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Method to check if group buying is active
ProductSchema.methods.isGroupBuyingActive = function() {
  return this.targetAmount > 0 && this.currentAmount < this.targetAmount;
};

// Method to calculate progress percentage for group buying
ProductSchema.methods.getGroupProgress = function() {
  if (!this.targetAmount) return 0;
  return Math.min(100, Math.round((this.currentAmount / this.targetAmount) * 100));
};

// Pre-save hook to update lastUpdated timestamp
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the Product model
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
