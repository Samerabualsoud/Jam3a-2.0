// Production environment configuration for Jam3a frontend
const PRODUCTION_CONFIG = {
  // API base URL for production
  API_BASE_URL: 'https://jam3a-backend-yf7ml.ondigitalocean.app/api',
  
  // Frontend base URL
  FRONTEND_URL: 'https://jam3a.me',
  
  // Moyasser payment configuration
  MOYASSER_PUBLIC_KEY: process.env.REACT_APP_MOYASSER_PUBLIC_KEY,
  
  // Feature flags
  FEATURES: {
    ANALYTICS_ENABLED: true,
    NOTIFICATIONS_ENABLED: true,
    CHAT_SUPPORT_ENABLED: true
  },
  
  // Cache configuration
  CACHE: {
    PRODUCTS_TTL: 3600, // 1 hour in seconds
    CATEGORIES_TTL: 86400, // 24 hours in seconds
    DEALS_TTL: 300 // 5 minutes in seconds
  },
  
  // Performance settings
  PERFORMANCE: {
    IMAGE_OPTIMIZATION: true,
    LAZY_LOADING: true,
    CODE_SPLITTING: true
  }
};

export default PRODUCTION_CONFIG;
