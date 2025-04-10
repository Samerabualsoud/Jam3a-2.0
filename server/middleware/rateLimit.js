const rateLimit = require('express-rate-limit');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

/**
 * Enhanced rate limiting middleware to prevent abuse
 * Different limiters for different types of routes with improved configuration
 */
const rateLimiters = {
  // General API rate limiter - 100 requests per minute
  api: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count successful requests against the rate limit
    keyGenerator: (req) => {
      // Use IP address as default, but allow for custom keys (e.g., API key or user ID)
      return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(60 - (Date.now() % 60000) / 1000) // Time in seconds until next window
      });
    }
  }),
  
  // Authentication routes - 10 requests per minute
  auth: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count successful requests against the rate limit
    keyGenerator: (req) => {
      // Use IP address and username/email if available for more targeted rate limiting
      const identifier = req.body.email || req.body.username || '';
      return `${req.ip}-${identifier}`;
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many authentication attempts, please try again later.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(60 - (Date.now() % 60000) / 1000) // Time in seconds until next window
      });
    }
  }),
  
  // User creation routes - 5 requests per hour
  userCreation: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count successful requests against the rate limit
    keyGenerator: (req) => {
      // Use IP address as default, but allow for custom keys
      return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Account creation limit reached, please try again later.',
        code: 'CREATION_RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(3600 - (Date.now() % 3600000) / 1000) // Time in seconds until next window
      });
    }
  }),
  
  // Product creation routes - 20 requests per hour
  productCreation: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Product creation limit reached, please try again later.',
        code: 'CREATION_RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(3600 - (Date.now() % 3600000) / 1000)
      });
    }
  }),
  
  // Deal creation routes - 10 requests per hour
  dealCreation: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Deal creation limit reached, please try again later.',
        code: 'CREATION_RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(3600 - (Date.now() % 3600000) / 1000)
      });
    }
  })
};

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define custom log format with structured data
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.json()
);

// Configure daily rotate file transport for log rotation
const dailyRotateFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, '%DATE%-combined.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for 14 days
  format: logFormat
});

const errorRotateFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, '%DATE%-error.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d', // Keep error logs for 30 days
  level: 'error',
  format: logFormat
});

/**
 * Enhanced Winston logger configuration
 * With structured logging format and log rotation
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { 
    service: 'jam3a-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Rotate log files daily
    dailyRotateFileTransport,
    errorRotateFileTransport
  ],
  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, '%DATE%-exceptions.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, '%DATE%-rejections.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ],
  exitOnError: false // Don't exit on handled exceptions
});

// If we're not in production, also log to the console with colorized output
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...metadata }) => {
        let metaStr = '';
        if (metadata && Object.keys(metadata).length > 0) {
          if (metadata.metadata) {
            metaStr = JSON.stringify(metadata.metadata);
          } else {
            metaStr = JSON.stringify(metadata);
          }
        }
        return `${timestamp} ${level}: ${message} ${metaStr}`;
      })
    )
  }));
}

/**
 * Request tracking middleware
 * Adds unique request ID to each request for tracking
 */
const requestTracker = (req, res, next) => {
  // Generate unique request ID
  const requestId = uuidv4();
  
  // Add request ID to request object
  req.requestId = requestId;
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

/**
 * Enhanced request logging middleware
 * Logs detailed information about each request with unique ID
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Ensure request has an ID (should be set by requestTracker middleware)
  if (!req.requestId) {
    req.requestId = uuidv4();
    res.setHeader('X-Request-ID', req.requestId);
  }
  
  // Log when the request completes
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Prepare log data with structured format
    const logData = {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: duration,
      durationMs: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user ? req.user.id : undefined,
      userRole: req.user ? req.user.role : undefined,
      contentLength: res.get('content-length'),
      referrer: req.get('referer') || req.get('referrer')
    };
    
    // Log at appropriate level based on status code
    if (res.statusCode >= 500) {
      logger.error('Server error response', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Client error response', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
};

/**
 * Enhanced error logging middleware
 * Logs detailed error information with request context
 */
const errorLogger = (err, req, res, next) => {
  // Ensure request has an ID
  const requestId = req.requestId || uuidv4();
  
  // Prepare error log data with structured format
  const errorData = {
    requestId,
    error: {
      message: err.message,
      name: err.name,
      stack: err.stack,
      code: err.code
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('user-agent')
    },
    user: req.user ? {
      id: req.user.id,
      role: req.user.role
    } : undefined
  };
  
  // Log the error
  logger.error('Request error', errorData);
  
  // Determine appropriate status code
  const statusCode = err.statusCode || 500;
  
  // Send error response with consistent format
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred'
      : err.message,
    code: err.code || 'SERVER_ERROR',
    requestId // Include request ID for reference
  });
};

/**
 * Performance monitoring middleware
 * Logs slow requests for performance optimization
 */
const performanceMonitor = (threshold = 1000) => {
  return (req, res, next) => {
    const start = Date.now();
    
    // Log when the request completes
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      // Log slow requests
      if (duration > threshold) {
        logger.warn('Slow request detected', {
          requestId: req.requestId,
          method: req.method,
          url: req.originalUrl,
          duration: duration,
          durationMs: `${duration}ms`,
          threshold: threshold
        });
      }
    });
    
    next();
  };
};

module.exports = {
  rateLimiters,
  logger,
  requestTracker,
  requestLogger,
  errorLogger,
  performanceMonitor
};
