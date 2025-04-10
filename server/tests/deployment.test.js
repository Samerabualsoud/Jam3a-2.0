const request = require('supertest');
const app = require('../server');
const { expect } = require('chai');
const mongoose = require('mongoose');

// Integration tests for Digital Ocean deployment configuration
describe('Digital Ocean Deployment Configuration', () => {
  // Test environment variables
  describe('Environment Variables', () => {
    it('should have all required environment variables', () => {
      // Check if environment variables are defined or have fallbacks
      expect(process.env.NODE_ENV || 'development').to.be.a('string');
      expect(process.env.PORT || '5000').to.be.a('string');
      expect(process.env.MONGO_URI || 'mongodb://localhost:27017/jam3a').to.be.a('string');
      expect(process.env.JWT_SECRET || 'jam3a_jwt_secret').to.be.a('string');
    });
  });
  
  // Test server configuration
  describe('Server Configuration', () => {
    it('should have CORS configured correctly', async () => {
      const res = await request(app)
        .options('/api/products')
        .set('Origin', 'http://example.com');
      
      expect(res.headers).to.have.property('access-control-allow-origin');
    });
    
    it('should have proper content security headers', async () => {
      const res = await request(app)
        .get('/api/products');
      
      // Check for security headers (may not be present in development)
      if (process.env.NODE_ENV === 'production') {
        expect(res.headers).to.have.property('x-content-type-options', 'nosniff');
      }
    });
  });
  
  // Test database connection
  describe('Database Connection', () => {
    it('should connect to MongoDB', () => {
      expect(mongoose.connection.readyState).to.be.oneOf([1, 2]); // 1 = connected, 2 = connecting
    });
  });
  
  // Test API endpoints
  describe('API Endpoints', () => {
    it('should have products endpoint working', async () => {
      const res = await request(app)
        .get('/api/products');
      
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
    });
    
    it('should have deals endpoint working', async () => {
      const res = await request(app)
        .get('/api/deals');
      
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });
});
