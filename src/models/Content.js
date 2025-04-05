const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Content Schema
 * Represents website content that can be managed through the admin panel
 */
const ContentSchema = new Schema({
  type: {
    type: String,
    required: [true, 'Content type is required'],
    enum: ['page', 'section', 'banner', 'faq', 'testimonial'],
    index: true
  },
  key: {
    type: String,
    required: [true, 'Content key is required'],
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true
  },
  titleAr: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content body is required']
  },
  contentAr: {
    type: String
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft',
    index: true
  },
  metadata: {
    description: {
      type: String
    },
    keywords: {
      type: String
    },
    author: {
      type: String
    },
    image: {
      type: String
    }
  },
  position: {
    type: Number,
    default: 0
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    index: true
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create text index for search
ContentSchema.index({ title: 'text', content: 'text' });

// Method to publish content
ContentSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

// Method to unpublish content
ContentSchema.methods.unpublish = function() {
  this.status = 'draft';
  return this.save();
};

// Method to archive content
ContentSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Method to get localized content
ContentSchema.methods.getLocalizedContent = function(language) {
  if (language === 'ar' && this.contentAr) {
    return {
      title: this.titleAr || this.title,
      content: this.contentAr
    };
  }
  
  return {
    title: this.title,
    content: this.content
  };
};

// Pre-save hook to set publishedAt when status changes to published
ContentSchema.pre('save', function(next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Create and export the Content model
const Content = mongoose.model('Content', ContentSchema);
module.exports = Content;
