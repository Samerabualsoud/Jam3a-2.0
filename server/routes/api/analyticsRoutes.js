const express = require('express');
const router = express.Router();
const AnalyticsConfig = require('../models/AnalyticsConfig');

// Get analytics configuration
router.get('/config', async (req, res) => {
  try {
    // Get the first config or create a default one if none exists
    let config = await AnalyticsConfig.findOne();
    
    if (!config) {
      config = new AnalyticsConfig({
        trackingId: 'UA-123456789-1',
        ipAnonymization: true,
        trackPageViews: true,
        trackEvents: true,
        lastUpdated: new Date()
      });
      await config.save();
    }
    
    res.json(config);
  } catch (err) {
    console.error('Error fetching analytics configuration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update analytics configuration
router.post('/config', async (req, res) => {
  try {
    const { trackingId, ipAnonymization, trackPageViews, trackEvents } = req.body;
    
    // Find existing config or create a new one
    let config = await AnalyticsConfig.findOne();
    
    if (config) {
      // Update existing config
      config.trackingId = trackingId;
      config.ipAnonymization = ipAnonymization;
      config.trackPageViews = trackPageViews;
      config.trackEvents = trackEvents;
      config.lastUpdated = new Date();
    } else {
      // Create new config
      config = new AnalyticsConfig({
        trackingId,
        ipAnonymization,
        trackPageViews,
        trackEvents,
        lastUpdated: new Date()
      });
    }
    
    await config.save();
    res.json(config);
  } catch (err) {
    console.error('Error updating analytics configuration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data
router.get('/data', async (req, res) => {
  try {
    const { startDate, endDate, metric } = req.query;
    
    // In a real implementation, this would fetch data from Google Analytics API
    // For now, we'll generate mock data
    
    // Parse dates
    const start = new Date(startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const end = new Date(endDate || new Date());
    
    // Calculate number of days
    const days = Math.ceil((end - start) / (24 * 60 * 60 * 1000));
    
    // Generate data points
    const data = [];
    let total = 0;
    let min = Infinity;
    let max = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      
      // Generate random value based on metric
      let value;
      if (metric === 'pageviews') {
        value = Math.floor(Math.random() * 500) + 100;
      } else if (metric === 'users') {
        value = Math.floor(Math.random() * 200) + 50;
      } else {
        value = Math.floor(Math.random() * 100) + 10;
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        value
      });
      
      total += value;
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
    
    // Calculate average
    const average = Math.round(total / days);
    
    res.json({
      metric,
      timeRange: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        days
      },
      data,
      summary: {
        total,
        average,
        min,
        max
      }
    });
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get top pages
router.get('/top-pages', async (req, res) => {
  try {
    // In a real implementation, this would fetch data from Google Analytics API
    // For now, we'll return mock data
    
    const topPages = [
      {
        path: '/',
        pageviews: 1245,
        uniquePageviews: 987,
        avgTimeOnPage: 120,
        bounceRate: 45
      },
      {
        path: '/products',
        pageviews: 876,
        uniquePageviews: 654,
        avgTimeOnPage: 95,
        bounceRate: 38
      },
      {
        path: '/deals',
        pageviews: 743,
        uniquePageviews: 521,
        avgTimeOnPage: 110,
        bounceRate: 42
      },
      {
        path: '/about',
        pageviews: 432,
        uniquePageviews: 321,
        avgTimeOnPage: 85,
        bounceRate: 51
      },
      {
        path: '/contact',
        pageviews: 321,
        uniquePageviews: 234,
        avgTimeOnPage: 65,
        bounceRate: 60
      }
    ];
    
    res.json(topPages);
  } catch (err) {
    console.error('Error fetching top pages:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get demographics
router.get('/demographics', async (req, res) => {
  try {
    // In a real implementation, this would fetch data from Google Analytics API
    // For now, we'll return mock data
    
    const demographics = {
      countries: [
        { name: 'Saudi Arabia', users: 1245, percentage: 45 },
        { name: 'UAE', users: 876, percentage: 25 },
        { name: 'Kuwait', users: 432, percentage: 15 },
        { name: 'Qatar', users: 321, percentage: 10 },
        { name: 'Other', users: 123, percentage: 5 }
      ],
      devices: [
        { type: 'Mobile', users: 1876, percentage: 65 },
        { type: 'Desktop', users: 765, percentage: 25 },
        { type: 'Tablet', users: 321, percentage: 10 }
      ],
      browsers: [
        { name: 'Chrome', users: 1543, percentage: 55 },
        { name: 'Safari', users: 876, percentage: 30 },
        { name: 'Firefox', users: 234, percentage: 8 },
        { name: 'Edge', users: 123, percentage: 4 },
        { name: 'Other', users: 87, percentage: 3 }
      ]
    };
    
    res.json(demographics);
  } catch (err) {
    console.error('Error fetching demographics:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events data
router.get('/events', async (req, res) => {
  try {
    // In a real implementation, this would fetch data from Google Analytics API
    // For now, we'll return mock data
    
    const events = [
      { name: 'Product View', count: 2345, uniqueUsers: 1876 },
      { name: 'Add to Cart', count: 1234, uniqueUsers: 987 },
      { name: 'Checkout', count: 765, uniqueUsers: 654 },
      { name: 'Purchase', count: 432, uniqueUsers: 432 },
      { name: 'Join Jam3a', count: 321, uniqueUsers: 321 },
      { name: 'Create Jam3a', count: 123, uniqueUsers: 123 }
    ];
    
    res.json(events);
  } catch (err) {
    console.error('Error fetching events data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
