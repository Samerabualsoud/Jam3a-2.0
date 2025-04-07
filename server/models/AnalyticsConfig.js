// Analytics Config model for Jam3a-2.0
import mongoose from 'mongoose';

const analyticsConfigSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    trim: true
  },
  ipAnonymization: {
    type: Boolean,
    default: true
  },
  trackPageViews: {
    type: Boolean,
    default: true
  },
  trackEvents: {
    type: Boolean,
    default: true
  },
  ecommerceTracking: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
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
analyticsConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AnalyticsConfig = mongoose.model('AnalyticsConfig', analyticsConfigSchema);

export default AnalyticsConfig;
