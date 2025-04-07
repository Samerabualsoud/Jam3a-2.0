// Development environment configuration for Jam3a frontend
const DEVELOPMENT_CONFIG = {
  // API base URL for development
  API_BASE_URL: 'http://localhost:5000/api',
  
  // Frontend base URL
  FRONTEND_URL: 'http://localhost:3000',
  
  // Moyasser payment configuration
  MOYASSER_PUBLIC_KEY: process.env.REACT_APP_MOYASSER_PUBLIC_KEY,
  
  // Feature flags
  FEATURES: {
    ANALYTICS_ENABLED: false,
    NOTIFICATIONS_ENABLED: true,
    CHAT_SUPPORT_ENABLED: false
  },
  
  // Cache configuration
  CACHE: {
    PRODUCTS_TTL: 60, // 1 minute in seconds (shorter for development)
    CATEGORIES_TTL: 300, // 5 minutes in seconds
    DEALS_TTL: 60 // 1 minute in seconds
  },
  
  // Performance settings
  PERFORMANCE: {
    IMAGE_OPTIMIZATION: false,
    LAZY_LOADING: true,
    CODE_SPLITTING: true
  }
};

export default DEVELOPMENT_CONFIG;
