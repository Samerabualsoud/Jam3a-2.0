const jest = require('jest');
const supertest = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Deal = require('../models/Deal');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Test utilities for API testing
 */
const testUtils = {
  /**
   * Generate a valid JWT token for testing authenticated routes
   * @param {Object} user - User object to encode in the token
   * @returns {String} JWT token
   */
  generateToken: (user) => {
    const payload = {
      user: {
        id: user.id || user._id,
        role: user.role || 'user'
      }
    };
    
    return jwt.sign(payload, config.jwtSecret || 'jam3a_jwt_secret', { expiresIn: '1h' });
  },
  
  /**
   * Create a test user in the database
   * @returns {Promise<Object>} Created user object
   */
  createTestUser: async () => {
    const testUser = new User({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'user'
    });
    
    await testUser.save();
    return testUser;
  },
  
  /**
   * Create a test admin user in the database
   * @returns {Promise<Object>} Created admin user object
   */
  createTestAdmin: async () => {
    const testAdmin = new User({
      name: 'Test Admin',
      email: `admin${Date.now()}@example.com`,
      password: 'password123',
      role: 'admin'
    });
    
    await testAdmin.save();
    return testAdmin;
  },
  
  /**
   * Create a test product in the database
   * @returns {Promise<Object>} Created product object
   */
  createTestProduct: async () => {
    const testProduct = new Product({
      name: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      category: 'Test Category',
      imageUrl: 'https://example.com/test-image.jpg'
    });
    
    await testProduct.save();
    return testProduct;
  },
  
  /**
   * Create a test deal in the database
   * @param {String} productId - ID of the product for the deal
   * @returns {Promise<Object>} Created deal object
   */
  createTestDeal: async (productId) => {
    const testDeal = new Deal({
      title: 'Test Deal',
      description: 'This is a test deal',
      productId: productId,
      minParticipants: 3,
      discountPercentage: 15,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    
    await testDeal.save();
    return testDeal;
  },
  
  /**
   * Clean up test data from the database
   * @param {Array} ids - Array of document IDs to delete
   * @param {Object} model - Mongoose model to delete from
   */
  cleanupTestData: async (ids, model) => {
    await model.deleteMany({ _id: { $in: ids } });
  },
  
  /**
   * Connect to test database before tests
   */
  setupTestDB: async () => {
    // Use a separate test database
    const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/jam3a_test';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },
  
  /**
   * Disconnect from test database after tests
   */
  teardownTestDB: async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
};

module.exports = testUtils;
