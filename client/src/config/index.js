// Environment-specific configuration for Jam3a frontend
import productionConfig from './production';
import developmentConfig from './development';

// Determine current environment
const isProduction = process.env.NODE_ENV === 'production';

// Select the appropriate configuration based on environment
const config = isProduction ? productionConfig : developmentConfig;

// Export the configuration
export default config;

// Export individual configuration values for easy access
export const API_BASE_URL = config.API_BASE_URL;
export const FRONTEND_URL = config.FRONTEND_URL;
export const MOYASSER_PUBLIC_KEY = config.MOYASSER_PUBLIC_KEY;
export const FEATURES = config.FEATURES;
export const CACHE = config.CACHE;
export const PERFORMANCE = config.PERFORMANCE;
