const mongoose = require('mongoose');

const AnalyticsConfigSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true
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
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnalyticsConfig', AnalyticsConfigSchema);
