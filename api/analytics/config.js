// Serverless function for analytics configuration
import connectDB from '../utils/connectDB.js';

// Default analytics configuration
const defaultConfig = {
  active: true,
  trackingId: 'G-G3N8DYCLBM', // Using the provided Google Analytics ID
  ipAnonymization: true,
  trackPageViews: true,
  trackEvents: true,
  ecommerceTracking: true
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to connect to MongoDB
    try {
      await connectDB();
      
      // In a full implementation, we would fetch from MongoDB here
      // For now, we'll use the default config
      // const AnalyticsConfig = mongoose.model('AnalyticsConfig');
      // const config = await AnalyticsConfig.findOne({ active: true });
      
      // Return the config (either from DB or default)
      return res.status(200).json(defaultConfig);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // If DB connection fails, return default config
      return res.status(200).json(defaultConfig);
    }
  } catch (error) {
    console.error('Error in analytics config API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
