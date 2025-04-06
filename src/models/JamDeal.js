const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * JamDeal Schema
 * Represents group buying deals in the Jam3a platform
 */
const JamDealSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  titleAr: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  descriptionAr: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  discount: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [1, 'Discount must be at least 1%'],
    max: [99, 'Discount cannot exceed 99%']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Maximum participants is required'],
    min: [2, 'At least 2 participants are required']
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'expired'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  termsAndConditions: {
    type: String
  },
  termsAndConditionsAr: {
    type: String
  },
  minimumParticipants: {
    type: Number,
    default: 2
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
JamDealSchema.index({ category: 1 });
JamDealSchema.index({ status: 1 });
JamDealSchema.index({ featured: 1 });
JamDealSchema.index({ createdBy: 1 });
JamDealSchema.index({ participants: 1 });
JamDealSchema.index({ endDate: 1 });

// Pre-save hook to check if deal should be expired
JamDealSchema.pre('save', function(next) {
  const now = new Date();
  
  // If end date has passed, mark as expired
  if (this.endDate < now && this.status === 'active') {
    this.status = 'expired';
  }
  
  // If deal is full, mark as completed
  if (this.currentParticipants >= this.maxParticipants && this.status === 'active') {
    this.status = 'completed';
  }
  
  next();
});

// Virtual for progress percentage
JamDealSchema.virtual('progress').get(function() {
  return (this.currentParticipants / this.maxParticipants) * 100;
});

// Virtual for time remaining
JamDealSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const endDate = new Date(this.endDate);
  const diff = endDate - now;
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
});

// Method to check if deal is active
JamDealSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Method to check if deal is full
JamDealSchema.methods.isFull = function() {
  return this.currentParticipants >= this.maxParticipants;
};

// Method to check if user has joined
JamDealSchema.methods.hasUserJoined = function(userId) {
  return this.participants.some(participant => 
    participant.toString() === userId.toString()
  );
};

// Create and export the JamDeal model
const JamDeal = mongoose.model('JamDeal', JamDealSchema);
module.exports = JamDeal;
