/**
 * Rate limiting middleware for Jam3a-2.0
 * Implements rate limiting for API endpoints to prevent abuse
 */

// Rate limit configuration
interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Maximum number of requests allowed in the window
  message: string;  // Message to show when rate limit is exceeded
}

// Rate limit storage (in-memory for client-side)
class RateLimitStorage {
  private storage: Map<string, { count: number, resetTime: number }> = new Map();
  
  // Get current count for a key
  get(key: string): { count: number, resetTime: number } {
    const now = Date.now();
    const record = this.storage.get(key);
    
    // If no record or reset time has passed, return 0
    if (!record || now > record.resetTime) {
      return { count: 0, resetTime: 0 };
    }
    
    return record;
  }
  
  // Increment count for a key
  increment(key: string, windowMs: number): { count: number, resetTime: number } {
    const now = Date.now();
    const record = this.storage.get(key);
    
    // If no record or reset time has passed, create new record
    if (!record || now > record.resetTime) {
      const newRecord = { count: 1, resetTime: now + windowMs };
      this.storage.set(key, newRecord);
      return newRecord;
    }
    
    // Increment existing record
    record.count += 1;
    return record;
  }
  
  // Reset count for a key
  reset(key: string): void {
    this.storage.delete(key);
  }
}

// Create singleton storage instance
const rateLimitStorage = new RateLimitStorage();

// Default configurations for different endpoints
const defaultConfigs: Record<string, RateLimitConfig> = {
  auth: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 10,  // 10 requests per 15 minutes
    message: 'Too many login attempts. Please try again later.'
  },
  api: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 60,  // 60 requests per minute
    message: 'Too many requests. Please try again later.'
  },
  payment: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 10,  // 10 payment requests per hour
    message: 'Too many payment attempts. Please try again later.'
  }
};

// Check if request exceeds rate limit
export const checkRateLimit = (
  endpoint: string,
  key: string = 'default',
  customConfig?: Partial<RateLimitConfig>
): { limited: boolean, message: string, remaining: number, resetTime: number } => {
  // Get config for endpoint
  const config = {
    ...defaultConfigs[endpoint] || defaultConfigs.api,
    ...customConfig
  };
  
  // Create unique key for this endpoint and key
  const uniqueKey = `${endpoint}:${key}`;
  
  // Get current count
  const record = rateLimitStorage.get(uniqueKey);
  
  // If reset time has passed, increment from 0
  if (record.resetTime === 0) {
    const newRecord = rateLimitStorage.increment(uniqueKey, config.windowMs);
    return {
      limited: false,
      message: '',
      remaining: config.maxRequests - newRecord.count,
      resetTime: newRecord.resetTime
    };
  }
  
  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    return {
      limited: true,
      message: config.message,
      remaining: 0,
      resetTime: record.resetTime
    };
  }
  
  // Increment count
  const updatedRecord = rateLimitStorage.increment(uniqueKey, config.windowMs);
  
  return {
    limited: false,
    message: '',
    remaining: config.maxRequests - updatedRecord.count,
    resetTime: updatedRecord.resetTime
  };
};

// Apply rate limiting to a function
export const applyRateLimit = async <T>(
  fn: () => Promise<T>,
  endpoint: string,
  key: string = 'default',
  customConfig?: Partial<RateLimitConfig>
): Promise<T> => {
  const result = checkRateLimit(endpoint, key, customConfig);
  
  if (result.limited) {
    throw new Error(result.message);
  }
  
  return fn();
};

// Reset rate limit for a key
export const resetRateLimit = (endpoint: string, key: string = 'default'): void => {
  const uniqueKey = `${endpoint}:${key}`;
  rateLimitStorage.reset(uniqueKey);
};

// Export default object with all functions
const rateLimit = {
  checkRateLimit,
  applyRateLimit,
  resetRateLimit
};

export default rateLimit;
