const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

/**
 * Authentication Service
 * Handles token generation, verification, and user authentication logic
 */
class AuthService {
  /**
   * Generate access token for a user
   * @param {Object} user - User object
   * @returns {String} JWT token
   */
  generateAccessToken(user) {
    const payload = {
      user: {
        id: user.id
      }
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'jwtSecret',
      { expiresIn: '1h' }
    );
  }

  /**
   * Generate refresh token for a user
   * @param {Object} user - User object
   * @returns {String} JWT refresh token
   */
  generateRefreshToken(user) {
    const payload = {
      user: {
        id: user.id
      }
    };

    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'jwtRefreshSecret',
      { expiresIn: '7d' }
    );
  }

  /**
   * Verify refresh token
   * @param {String} token - Refresh token
   * @returns {Object} Decoded token payload
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'jwtRefreshSecret');
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Generate password reset token
   * @returns {String} Reset token
   */
  generateResetToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  /**
   * Generate email verification token
   * @returns {String} Verification token
   */
  generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  /**
   * Check if user has required role
   * @param {Object} user - User object
   * @param {String} role - Role to check
   * @returns {Boolean} True if user has role
   */
  hasRole(user, role) {
    return user.roles.includes(role);
  }

  /**
   * Check if user has any of the required roles
   * @param {Object} user - User object
   * @param {Array} roles - Array of roles to check
   * @returns {Boolean} True if user has any of the roles
   */
  hasAnyRole(user, roles) {
    return user.roles.some(role => roles.includes(role));
  }

  /**
   * Check if user has all of the required roles
   * @param {Object} user - User object
   * @param {Array} roles - Array of roles to check
   * @returns {Boolean} True if user has all of the roles
   */
  hasAllRoles(user, roles) {
    return roles.every(role => user.roles.includes(role));
  }
}

module.exports = new AuthService();
