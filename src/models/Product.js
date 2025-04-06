const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Product Schema
 * Represents products in the Jam3a platform
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
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  descriptionAr: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  images: [{
    type: String
  }],
  specifications: {
    type: Object,
    default: {}
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  brand: {
    type: String
  },
  weight: {
    type: Number
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ active: 1 });
ProductSchema.index({ createdBy: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });

// Pre-save hook to generate slug if not provided
ProductSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate average rating
  if (this.ratings && this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
  }
  
  next();
});

// Method to check if product is in stock
ProductSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Method to add a rating
ProductSchema.methods.addRating = function(userId, rating, review) {
  // Check if user already rated
  const existingRatingIndex = this.ratings.findIndex(
    r => r.user.toString() === userId.toString()
  );
  
  if (existingRatingIndex >= 0) {
    // Update existing rating
    this.ratings[existingRatingIndex].rating = rating;
    this.ratings[existingRatingIndex].review = review;
    this.ratings[existingRatingIndex].date = Date.now();
  } else {
    // Add new rating
    this.ratings.push({
      user: userId,
      rating,
      review,
      date: Date.now()
    });
  }
  
  // Recalculate average
  const totalRating = this.ratings.reduce((sum, item) => sum + item.rating, 0);
  this.averageRating = totalRating / this.ratings.length;
};

// Create and export the Product model
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
