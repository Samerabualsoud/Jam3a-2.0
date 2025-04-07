// Server-side error handling middleware
import { Request, Response, NextFunction } from 'express';

// Error types
export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

// Create custom error class
export class CustomError extends Error implements AppError {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for debugging
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode
  });

  // Different error responses based on environment
  if (process.env.NODE_ENV === 'development') {
    // Detailed error for development
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Simplified error for production
    // For operational errors, send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    
    // For programming or unknown errors, send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

// Not found middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  // For API routes, return 404 JSON response
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      status: 'fail',
      message: `Cannot find ${req.method} ${req.path} on this server`
    });
  }
  
  // For other routes, let the SPA handle it
  next();
};

// Rate limiting middleware
export const createRateLimiter = (windowMs: number, max: number) => {
  const requestCounts = new Map<string, { count: number, resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Get or create record for this IP
    let record = requestCounts.get(ip);
    if (!record) {
      record = { count: 0, resetTime: now + windowMs };
      requestCounts.set(ip, record);
    }
    
    // Reset if time window has passed
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    
    // Increment count
    record.count++;
    
    // Set headers
    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());
    
    // Check if over limit
    if (record.count > max) {
      return res.status(429).json({
        status: 'fail',
        message: 'Too many requests, please try again later'
      });
    }
    
    next();
  };
};

// Export all middleware
export default {
  errorHandler,
  notFoundHandler,
  createRateLimiter,
  CustomError
};
