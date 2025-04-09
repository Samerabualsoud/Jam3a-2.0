// MongoDB models for serverless functions
import mongoose from 'mongoose';

// Define Analytics Config Schema
const AnalyticsConfigSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },
  trackingId: {
    type: String,
    default: 'G-G3N8DYCLBM'
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

// Create or retrieve model
export const getAnalyticsConfigModel = () => {
  // Check if model already exists to prevent model overwrite error in serverless environment
  return mongoose.models.AnalyticsConfig || mongoose.model('AnalyticsConfig', AnalyticsConfigSchema);
};

// Export all models
export default {
  getAnalyticsConfigModel
};
