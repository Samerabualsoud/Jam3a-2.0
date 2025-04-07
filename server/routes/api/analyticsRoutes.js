// analyticsRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to our data file
const dataPath = path.join(__dirname, '../../data/analytics.json');

// Ensure data directory exists
const ensureDataDirExists = () => {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize analytics data file if it doesn't exist
const initializeAnalyticsData = () => {
  ensureDataDirExists();
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({
      trackingId: '',
      ipAnonymization: true,
      trackPageViews: true,
      trackEvents: true,
      lastUpdated: new Date().toISOString()
    }, null, 2));
  }
};

// Get analytics configuration
router.get('/config', (req, res) => {
  try {
    initializeAnalyticsData();
    const analyticsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(analyticsData);
  } catch (error) {
    console.error('Error reading analytics configuration:', error);
    res.status(500).json({ error: 'Failed to fetch analytics configuration' });
  }
});

// Update analytics configuration
router.post('/config', (req, res) => {
  try {
    initializeAnalyticsData();
    const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    const updatedData = {
      ...currentData,
      ...req.body,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
    res.json(updatedData);
  } catch (error) {
    console.error('Error updating analytics configuration:', error);
    res.status(500).json({ error: 'Failed to update analytics configuration' });
  }
});

// Get analytics data (mock data for demonstration)
router.get('/data', (req, res) => {
  try {
    const { startDate, endDate, metric } = req.query;
    
    // Generate mock analytics data
    const mockData = generateMockAnalyticsData(startDate, endDate, metric);
    
    res.json(mockData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Helper function to generate mock analytics data
function generateMockAnalyticsData(startDate, endDate, metric) {
  // Parse dates or use defaults
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  
  // Calculate number of days in the range
  const dayDiff = Math.ceil((end - start) / (24 * 60 * 60 * 1000));
  const dataPoints = [];
  
  // Generate data for each day
  for (let i = 0; i < dayDiff; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    let value;
    switch (metric) {
      case 'pageviews':
        value = Math.floor(Math.random() * 500) + 100;
        break;
      case 'users':
        value = Math.floor(Math.random() * 200) + 50;
        break;
      case 'sessions':
        value = Math.floor(Math.random() * 300) + 80;
        break;
      case 'bounce_rate':
        value = Math.floor(Math.random() * 40) + 30;
        break;
      case 'avg_session_duration':
        value = Math.floor(Math.random() * 180) + 60;
        break;
      default:
        value = Math.floor(Math.random() * 100);
    }
    
    dataPoints.push({
      date: currentDate.toISOString().split('T')[0],
      value
    });
  }
  
  // Generate summary metrics
  const totalPageviews = dataPoints.reduce((sum, point) => sum + point.value, 0);
  const avgDailyPageviews = Math.round(totalPageviews / dayDiff);
  
  return {
    metric,
    timeRange: {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      days: dayDiff
    },
    data: dataPoints,
    summary: {
      total: totalPageviews,
      average: avgDailyPageviews,
      min: Math.min(...dataPoints.map(p => p.value)),
      max: Math.max(...dataPoints.map(p => p.value))
    }
  };
}

// Get top pages (mock data)
router.get('/top-pages', (req, res) => {
  try {
    const topPages = [
      { path: '/', pageviews: 1245, uniquePageviews: 987, avgTimeOnPage: 120, bounceRate: 35 },
      { path: '/products', pageviews: 876, uniquePageviews: 654, avgTimeOnPage: 95, bounceRate: 42 },
      { path: '/about', pageviews: 543, uniquePageviews: 432, avgTimeOnPage: 75, bounceRate: 48 },
      { path: '/contact', pageviews: 432, uniquePageviews: 321, avgTimeOnPage: 60, bounceRate: 52 },
      { path: '/blog', pageviews: 321, uniquePageviews: 234, avgTimeOnPage: 180, bounceRate: 38 }
    ];
    
    res.json(topPages);
  } catch (error) {
    console.error('Error fetching top pages:', error);
    res.status(500).json({ error: 'Failed to fetch top pages data' });
  }
});

// Get user demographics (mock data)
router.get('/demographics', (req, res) => {
  try {
    const demographics = {
      countries: [
        { name: 'Saudi Arabia', users: 1245, percentage: 45 },
        { name: 'United Arab Emirates', users: 654, percentage: 24 },
        { name: 'Kuwait', users: 321, percentage: 12 },
        { name: 'Qatar', users: 234, percentage: 9 },
        { name: 'Other', users: 276, percentage: 10 }
      ],
      devices: [
        { type: 'Mobile', users: 1654, percentage: 60 },
        { type: 'Desktop', users: 827, percentage: 30 },
        { type: 'Tablet', users: 276, percentage: 10 }
      ],
      browsers: [
        { name: 'Chrome', users: 1378, percentage: 50 },
        { name: 'Safari', users: 827, percentage: 30 },
        { name: 'Firefox', users: 276, percentage: 10 },
        { name: 'Edge', users: 138, percentage: 5 },
        { name: 'Other', users: 138, percentage: 5 }
      ]
    };
    
    res.json(demographics);
  } catch (error) {
    console.error('Error fetching demographics data:', error);
    res.status(500).json({ error: 'Failed to fetch demographics data' });
  }
});

// Get events data (mock data)
router.get('/events', (req, res) => {
  try {
    const events = [
      { name: 'join_jam3a_group', count: 87, uniqueUsers: 76 },
      { name: 'create_jam3a_group', count: 45, uniqueUsers: 42 },
      { name: 'purchase', count: 32, uniqueUsers: 30 },
      { name: 'add_to_cart', count: 156, uniqueUsers: 123 },
      { name: 'view_item', count: 543, uniqueUsers: 321 }
    ];
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events data:', error);
    res.status(500).json({ error: 'Failed to fetch events data' });
  }
});

module.exports = router;
