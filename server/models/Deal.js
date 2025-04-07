// Deal model for Jam3a-2.0
import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const dealSchema = new mongoose.Schema({
  jam3aId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleAr: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  descriptionAr: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  regularPrice: {
    type: Number,
    required: true,
    min: 0
  },
  jam3aPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 2
  },
  expiryDate: {
    type: Date,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'cancelled'],
    default: 'active'
  },
  participants: [participantSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
dealSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for time remaining
dealSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const expiryDate = new Date(this.expiryDate);
  const diff = expiryDate - now;
  
  if (diff <= 0) {
    return '00:00:00';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Set toJSON option to include virtuals
dealSchema.set('toJSON', { virtuals: true });
dealSchema.set('toObject', { virtuals: true });

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
