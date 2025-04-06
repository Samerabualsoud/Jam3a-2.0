const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Category Schema
 * Represents product categories in the Jam3a platform
 */
const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  nameAr: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Category description is required']
  },
  descriptionAr: {
    type: String
  },
  icon: {
    type: String
  },
  image: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
CategorySchema.index({ name: 1 });
CategorySchema.index({ featured: 1 });
CategorySchema.index({ active: 1 });
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });

// Pre-save hook to generate slug if not provided
CategorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for getting full path (for nested categories)
CategorySchema.virtual('path').get(async function() {
  if (!this.parent) {
    return this.name;
  }
  
  try {
    const parent = await this.model('Category').findById(this.parent);
    if (parent) {
      return `${await parent.path} > ${this.name}`;
    }
    return this.name;
  } catch (err) {
    return this.name;
  }
});

// Create and export the Category model
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
