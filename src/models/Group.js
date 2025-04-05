const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Group Schema
 * Represents group buying instances where multiple users join together to purchase products
 */
const GroupSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required']
  },
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  targetParticipants: {
    type: Number,
    required: [true, 'Target participants is required'],
    min: [2, 'Group must have at least 2 target participants']
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: [0, 'Current participants cannot be negative']
  },
  participants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    }
  }],
  status: {
    type: String,
    enum: ['open', 'complete', 'expired'],
    default: 'open'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for frequently queried fields
GroupSchema.index({ productId: 1 });
GroupSchema.index({ status: 1 });
GroupSchema.index({ expiresAt: 1 });
GroupSchema.index({ 'participants.userId': 1 });

// Virtual for progress percentage
GroupSchema.virtual('progress').get(function() {
  if (!this.targetParticipants) return 0;
  return Math.min(100, Math.round((this.currentParticipants / this.targetParticipants) * 100));
});

// Method to add a participant to the group
GroupSchema.methods.addParticipant = async function(userId, amount) {
  // Check if user is already a participant
  const existingParticipant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (existingParticipant) {
    throw new Error('User is already a participant in this group');
  }
  
  // Add participant
  this.participants.push({ userId, amount });
  this.currentParticipants = this.participants.length;
  
  // Check if group is now complete
  if (this.currentParticipants >= this.targetParticipants) {
    this.status = 'complete';
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Method to check if group is complete
GroupSchema.methods.isComplete = function() {
  return this.status === 'complete' || this.currentParticipants >= this.targetParticipants;
};

// Method to check if group has expired
GroupSchema.methods.isExpired = function() {
  return this.status === 'expired' || (this.expiresAt && this.expiresAt < new Date());
};

// Method to get remaining participants needed
GroupSchema.methods.getRemainingParticipants = function() {
  return Math.max(0, this.targetParticipants - this.currentParticipants);
};

// Pre-save hook to update currentParticipants count
GroupSchema.pre('save', function(next) {
  this.currentParticipants = this.participants.length;
  next();
});

// Pre-save hook to check if group is complete or expired
GroupSchema.pre('save', function(next) {
  // Check if group is complete
  if (this.currentParticipants >= this.targetParticipants && this.status !== 'complete') {
    this.status = 'complete';
    this.completedAt = new Date();
  }
  
  // Check if group has expired
  if (this.status !== 'complete' && this.expiresAt && this.expiresAt < new Date()) {
    this.status = 'expired';
  }
  
  next();
});

// Create and export the Group model
const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
