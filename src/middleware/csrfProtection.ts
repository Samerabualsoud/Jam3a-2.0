/**
 * CSRF Protection middleware for Jam3a-2.0
 * Implements Cross-Site Request Forgery protection for API endpoints
 */

import { createError, ErrorType } from '@/utils/errorHandler';
import { v4 as uuidv4 } from 'uuid';

// CSRF token storage key
const CSRF_TOKEN_KEY = 'jam3a_csrf_token';

// Generate a new CSRF token
export const generateCsrfToken = (): string => {
  const token = uuidv4();
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  
  return token;
};

// Get the current CSRF token or generate a new one
export const getCsrfToken = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  let token = localStorage.getItem(CSRF_TOKEN_KEY);
  
  if (!token) {
    token = generateCsrfToken();
  }
  
  return token;
};

// Add CSRF token to request headers
export const addCsrfTokenToRequest = (config: any): any => {
  const token = getCsrfToken();
  
  if (token) {
    config.headers = {
      ...config.headers,
      'X-CSRF-Token': token
    };
  }
  
  return config;
};

// Verify CSRF token in responses
export const verifyCsrfToken = (response: any): any => {
  // Check if response contains a new CSRF token
  const newToken = response.headers?.['x-csrf-token'];
  
  if (newToken && typeof window !== 'undefined') {
    localStorage.setItem(CSRF_TOKEN_KEY, newToken);
  }
  
  return response;
};

// Handle CSRF errors
export const handleCsrfError = (error: any): never => {
  if (error.response?.status === 403 && 
      error.response?.data?.error === 'CSRF token validation failed') {
    
    // Generate a new token on CSRF error
    generateCsrfToken();
    
    throw createError(
      ErrorType.AUTHORIZATION,
      'Security validation failed',
      'Your session has expired or is invalid. Please refresh the page and try again.',
      'CSRF_VALIDATION_FAILED',
      error
    );
  }
  
  throw error;
};

// Initialize CSRF protection
export const initCsrfProtection = (): void => {
  // Generate initial token if not exists
  if (typeof window !== 'undefined' && !localStorage.getItem(CSRF_TOKEN_KEY)) {
    generateCsrfToken();
  }
};

// Export default object with all functions
const csrfProtection = {
  generateCsrfToken,
  getCsrfToken,
  addCsrfTokenToRequest,
  verifyCsrfToken,
  handleCsrfError,
  initCsrfProtection
};

export default csrfProtection;
