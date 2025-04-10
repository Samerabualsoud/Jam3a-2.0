const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from request headers and adds user data to request object
 * Enhanced with better error handling and logging
 */
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied',
      code: 'AUTH_NO_TOKEN'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret || 'jam3a_jwt_secret');
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired',
        code: 'AUTH_TOKEN_EXPIRED'
      });
    }
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    
    // Provide more specific error messages based on error type
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format',
        code: 'AUTH_INVALID_TOKEN'
      });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired',
        code: 'AUTH_TOKEN_EXPIRED'
      });
    }
    
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid',
      code: 'AUTH_INVALID_TOKEN'
    });
  }
};

/**
 * Role-based authorization middleware
 * Checks if the authenticated user has the required role
 * Enhanced with support for multiple roles and permissions
 * @param {Array|String} roles - Array of allowed roles or single role
 */
const authorize = (roles = []) => {
  // Convert string to array if single role provided
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!req.user.role) {
      return res.status(403).json({ 
        success: false,
        message: 'User role not defined',
        code: 'AUTH_NO_ROLE'
      });
    }

    // If no specific roles required or user is admin, allow access
    if (roles.length === 0 || req.user.role === 'admin') {
      return next();
    }
    
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: insufficient permissions',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    }

    // User has required role, proceed
    next();
  };
};

/**
 * Token refresh middleware
 * Generates a new token if the current one is about to expire
 */
const refreshToken = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // If no token, just proceed (auth middleware will handle this)
  if (!token) {
    return next();
  }
  
  try {
    // Decode token without verification to check expiration
    const decoded = jwt.decode(token);
    
    // Check if token will expire soon (within 15 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const refreshThreshold = 15 * 60; // 15 minutes in seconds
    
    if (decoded.exp && (decoded.exp - currentTime < refreshThreshold)) {
      // Generate new token with same payload but extended expiration
      const newToken = jwt.sign(
        { user: decoded.user },
        config.jwtSecret || 'jam3a_jwt_secret',
        { expiresIn: '1h' }
      );
      
      // Add new token to response headers
      res.setHeader('X-New-Token', newToken);
      res.setHeader('Access-Control-Expose-Headers', 'X-New-Token');
    }
    
    next();
  } catch (err) {
    // If any error occurs during refresh, just proceed (auth middleware will handle this)
    console.error('Token refresh error:', err.message);
    next();
  }
};

/**
 * Optional authentication middleware
 * Verifies JWT token if present but doesn't require it
 * Useful for routes that can be accessed by both authenticated and unauthenticated users
 */
const optionalAuth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If no token, just proceed without setting req.user
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret || 'jam3a_jwt_secret');
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    // If token is invalid, just proceed without setting req.user
    console.error('Optional auth token verification failed:', err.message);
    next();
  }
};

module.exports = { 
  auth, 
  authorize, 
  refreshToken,
  optionalAuth
};
