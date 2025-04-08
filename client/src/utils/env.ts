/**
 * Environment variable utility for Jam3a-2.0
 * 
 * This utility provides a consistent way to access environment variables
 * in the application, with fallbacks for development.
 */

// API URL from environment variable with fallback
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get any environment variable with type safety
export function getEnv<T>(key: string, fallback: T): T {
  const value = import.meta.env[`VITE_${key}`];
  return value !== undefined ? value as unknown as T : fallback;
}

// Common environment variables used in the application
export const ENV = {
  // API URL for backend communication
  apiUrl: API_URL,
  
  // Environment mode (development, production, etc.)
  mode: import.meta.env.MODE,
  
  // Flag to determine if running in production
  isProduction: import.meta.env.PROD,
  
  // Flag to determine if running in development
  isDevelopment: import.meta.env.DEV,
  
  // Google Analytics ID (if configured)
  gaTrackingId: getEnv('GA_TRACKING_ID', ''),
  
  // Public URL for assets (if configured)
  publicUrl: getEnv('PUBLIC_URL', ''),
};

export default ENV;
