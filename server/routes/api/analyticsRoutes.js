// API routes for analytics
import express from 'express';
import mongoose from 'mongoose';
import AnalyticsConfig from '../../models/AnalyticsConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth, authorize, refreshToken } from '../../middleware/auth.js';
import { validate, validationRules, sanitizeInputs } from '../../middleware/validation.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apply token refresh middleware to all routes
router.use(refreshToken);

// Apply sanitization middleware to all routes
router.use(sanitizeInputs);

// Fallback to JSON file if MongoDB is not available
const getAnalyticsConfigFromFile = () => {
  try {
    const dataPath = path.join(__dirname, '../../../data/analytics.json');
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(rawData);
    }
    return {
      trackingId: 'G-G3N8DYCLBM',
      ipAnonymization: true,
      trackPageViews: true,
      trackEvents: true,
      ecommerceTracking: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error reading analytics config from file:', error);
    return {
      trackingId: 'G-G3N8DYCLBM',
      ipAnonymization: true,
      trackPageViews: true,
      trackEvents: true,
      ecommerceTracking: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

// Get analytics configuration - Public route for client-side tracking
router.get('/config', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      let config = await AnalyticsConfig.findOne();
      
      // If no config exists, create a default one
      if (!config) {
        config = await AnalyticsConfig.create({
          trackingId: 'G-G3N8DYCLBM',
          ipAnonymization: true,
          trackPageViews: true,
          trackEvents: true,
          ecommerceTracking: true,
          active: true
        });
      }
      
      // Only return public fields for client-side tracking
      const publicConfig = {
        trackingId: config.trackingId,
        ipAnonymization: config.ipAnonymization,
        trackPageViews: config.trackPageViews,
        trackEvents: config.trackEvents,
        ecommerceTracking: config.ecommerceTracking,
        active: config.active
      };
      
      return res.json({
        success: true,
        data: publicConfig
      });
    } else {
      // Fallback to JSON file
      const config = getAnalyticsConfigFromFile();
      
      // Only return public fields for client-side tracking
      const publicConfig = {
        trackingId: config.trackingId,
        ipAnonymization: config.ipAnonymization,
        trackPageViews: config.trackPageViews,
        trackEvents: config.trackEvents,
        ecommerceTracking: config.ecommerceTracking,
        active: config.active
      };
      
      return res.json({
        success: true,
        data: publicConfig
      });
    }
  } catch (error) {
    console.error('Error fetching analytics config:', error);
    // Fallback to default config on error
    const config = getAnalyticsConfigFromFile();
    
    // Only return public fields for client-side tracking
    const publicConfig = {
      trackingId: config.trackingId,
      ipAnonymization: config.ipAnonymization,
      trackPageViews: config.trackPageViews,
      trackEvents: config.trackEvents,
      ecommerceTracking: config.ecommerceTracking,
      active: config.active
    };
    
    return res.json({
      success: true,
      data: publicConfig
    });
  }
});

// Update analytics configuration (PUT) - Admin only
router.put('/config', auth, authorize(['admin']), validate(validationRules.analytics), async (req, res) => {
  try {
    const {
      trackingId,
      ipAnonymization,
      trackPageViews,
      trackEvents,
      ecommerceTracking,
      active
    } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      let config = await AnalyticsConfig.findOne();
      
      if (config) {
        // Update existing config
        config.trackingId = trackingId;
        config.ipAnonymization = ipAnonymization;
        config.trackPageViews = trackPageViews;
        config.trackEvents = trackEvents;
        config.ecommerceTracking = ecommerceTracking;
        config.active = active;
        config.updatedAt = Date.now();
        config.updatedBy = req.user.id; // Add updater reference
        
        await config.save();
      } else {
        // Create new config
        config = await AnalyticsConfig.create({
          trackingId,
          ipAnonymization,
          trackPageViews,
          trackEvents,
          ecommerceTracking,
          active,
          createdBy: req.user.id, // Add creator reference
          updatedBy: req.user.id
        });
      }
      
      return res.json({
        success: true,
        data: config
      });
    } else {
      // Mock response for when MongoDB is not available
      const updatedConfig = {
        _id: new mongoose.Types.ObjectId().toString(),
        trackingId,
        ipAnonymization,
        trackPageViews,
        trackEvents,
        ecommerceTracking,
        active,
        createdBy: req.user.id,
        updatedBy: req.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Try to save to JSON file
      try {
        const dataPath = path.join(__dirname, '../../../data/analytics.json');
        fs.writeFileSync(dataPath, JSON.stringify(updatedConfig, null, 2));
      } catch (writeError) {
        console.error('Error writing analytics config to file:', writeError);
      }
      
      return res.json({
        success: true,
        data: updatedConfig
      });
    }
  } catch (error) {
    console.error('Error updating analytics config:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Add POST endpoint for analytics configuration (same functionality as PUT) - Admin only
router.post('/config', auth, authorize(['admin']), validate(validationRules.analytics), async (req, res) => {
  try {
    const {
      trackingId,
      ipAnonymization,
      trackPageViews,
      trackEvents,
      ecommerceTracking,
      active
    } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      let config = await AnalyticsConfig.findOne();
      
      if (config) {
        // Update existing config
        config.trackingId = trackingId;
        config.ipAnonymization = ipAnonymization;
        config.trackPageViews = trackPageViews;
        config.trackEvents = trackEvents;
        config.ecommerceTracking = ecommerceTracking;
        config.active = active;
        config.updatedAt = Date.now();
        config.updatedBy = req.user.id; // Add updater reference
        
        await config.save();
      } else {
        // Create new config
        config = await AnalyticsConfig.create({
          trackingId,
          ipAnonymization,
          trackPageViews,
          trackEvents,
          ecommerceTracking,
          active,
          createdBy: req.user.id, // Add creator reference
          updatedBy: req.user.id
        });
      }
      
      return res.json({
        success: true,
        data: config
      });
    } else {
      // Mock response for when MongoDB is not available
      const updatedConfig = {
        _id: new mongoose.Types.ObjectId().toString(),
        trackingId,
        ipAnonymization,
        trackPageViews,
        trackEvents,
        ecommerceTracking,
        active,
        createdBy: req.user.id,
        updatedBy: req.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Try to save to JSON file
      try {
        const dataPath = path.join(__dirname, '../../../data/analytics.json');
        fs.writeFileSync(dataPath, JSON.stringify(updatedConfig, null, 2));
      } catch (writeError) {
        console.error('Error writing analytics config to file:', writeError);
      }
      
      return res.json({
        success: true,
        data: updatedConfig
      });
    }
  } catch (error) {
    console.error('Error saving analytics config:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

// Get analytics data - Admin only
router.get('/data', auth, authorize(['admin']), async (req, res) => {
  try {
    // Mock analytics data (in a real app, this would come from Google Analytics API)
    const analyticsData = {
      pageViews: {
        total: 12500,
        daily: [320, 350, 400, 420, 380, 450, 500],
        topPages: [
          { path: '/', views: 4200 },
          { path: '/shop-all-deals', views: 3100 },
          { path: '/start-jam3a', views: 2800 },
          { path: '/join-jam3a', views: 1400 },
          { path: '/about', views: 1000 }
        ]
      },
      visitors: {
        total: 5200,
        newVsReturning: { new: 3800, returning: 1400 },
        countries: [
          { name: 'Saudi Arabia', count: 3200 },
          { name: 'UAE', count: 800 },
          { name: 'Kuwait', count: 500 },
          { name: 'Qatar', count: 400 },
          { name: 'Other', count: 300 }
        ]
      },
      conversions: {
        total: 850,
        rate: 16.3,
        bySource: [
          { source: 'Direct', count: 320 },
          { source: 'Organic Search', count: 250 },
          { source: 'Social Media', count: 180 },
          { source: 'Referral', count: 100 }
        ]
      },
      revenue: {
        total: 425000,
        average: 500,
        byProduct: [
          { product: 'iPhone 16 Pro Max', amount: 120000 },
          { product: 'Samsung Galaxy S25', amount: 95000 },
          { product: 'MacBook Pro', amount: 85000 },
          { product: 'AirPods Pro', amount: 65000 },
          { product: 'Other', amount: 60000 }
        ]
      }
    };
    
    return res.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

export default router;
