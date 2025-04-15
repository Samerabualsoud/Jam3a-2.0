const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const app = require('../server');
const { rateLimiters, logger, requestTracker, requestLogger, errorLogger, performanceMonitor } = require('../middleware/rateLimit');
const { auth, authorize, optionalAuth, refreshToken } = require('../middleware/auth');
const { validate, validateWithJoi, sanitizeInputs, isValidObjectId } = require('../middleware/validation');

describe('Enhanced Middleware Integration Tests', () => {
  // Test authentication middleware
  describe('Authentication Middleware', () => {
    let mockReq, mockRes, mockNext, mockToken, mockUser;
    
    beforeEach(() => {
      mockUser = { id: '123456789012', role: 'user' };
      mockToken = jwt.sign({ user: mockUser }, 'jam3a_jwt_secret', { expiresIn: '1h' });
      
      mockReq = { 
        header: sinon.stub(),
        user: null
      };
      
      mockRes = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
        setHeader: sinon.stub()
      };
      
      mockNext = sinon.spy();
    });
    
    it('should reject requests without token', () => {
      mockReq.header.returns(null);
      
      auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status.calledWith(401)).to.be.true;
      expect(mockRes.json.calledOnce).to.be.true;
      expect(mockRes.json.args[0][0].success).to.be.false;
      expect(mockRes.json.args[0][0].message).to.include('authorization denied');
      expect(mockNext.called).to.be.false;
    });
    
    it('should reject requests with invalid token', () => {
      mockReq.header.returns('Bearer invalid-token');
      
      auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status.calledWith(401)).to.be.true;
      expect(mockRes.json.calledOnce).to.be.true;
      expect(mockRes.json.args[0][0].success).to.be.false;
      expect(mockRes.json.args[0][0].message).to.include('not valid');
      expect(mockNext.called).to.be.false;
    });
    
    it('should accept requests with valid token', () => {
      mockReq.header.returns(`Bearer ${mockToken}`);
      
      auth(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(mockReq.user).to.deep.equal(mockUser);
      expect(mockRes.status.called).to.be.false;
      expect(mockRes.json.called).to.be.false;
    });
    
    it('should refresh token if it is about to expire', () => {
      // Create a token that expires in 4 minutes (below the 5-minute threshold)
      const expiringToken = jwt.sign({ user: mockUser, exp: Math.floor(Date.now() / 1000) + 240 }, 'jam3a_jwt_secret');
      mockReq.header.returns(`Bearer ${expiringToken}`);
      
      refreshToken(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(mockRes.setHeader.calledWith('X-New-Token')).to.be.true;
    });
    
    it('should authorize users with correct role', () => {
      mockReq.user = { id: '123', role: 'admin' };
      
      authorize(['admin', 'superadmin'])(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(mockRes.status.called).to.be.false;
      expect(mockRes.json.called).to.be.false;
    });
    
    it('should reject users with incorrect role', () => {
      mockReq.user = { id: '123', role: 'user' };
      
      authorize(['admin', 'superadmin'])(mockReq, mockRes, mockNext);
      
      expect(mockRes.status.calledWith(403)).to.be.true;
      expect(mockRes.json.calledOnce).to.be.true;
      expect(mockRes.json.args[0][0].success).to.be.false;
      expect(mockRes.json.args[0][0].code).to.equal('AUTH_INSUFFICIENT_PERMISSIONS');
      expect(mockNext.called).to.be.false;
    });
    
    it('should make authentication optional with optionalAuth', () => {
      // Test with no token
      mockReq.header.returns(null);
      
      optionalAuth(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(mockReq.user).to.be.undefined;
      expect(mockRes.status.called).to.be.false;
      expect(mockRes.json.called).to.be.false;
      
      // Reset mocks
      mockNext = sinon.spy();
      
      // Test with valid token
      mockReq.header.returns(`Bearer ${mockToken}`);
      
      optionalAuth(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(mockReq.user).to.deep.equal(mockUser);
      expect(mockRes.status.called).to.be.false;
      expect(mockRes.json.called).to.be.false;
    });
  });
  
  // Test validation middleware
  describe('Validation Middleware', () => {
    let mockReq, mockRes, mockNext;
    
    beforeEach(() => {
      mockReq = {
        body: {},
        params: {},
        query: {}
      };
      
      mockRes = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      
      mockNext = sinon.spy();
    });
    
    it('should validate request data with express-validator', async () => {
      // Create a simple validation rule
      const mockValidation = {
        run: async (req) => {
          if (!req.body.name) {
            req._validationErrors = [{ param: 'name', msg: 'Name is required' }];
          }
          return true;
        }
      };
      
      const middleware = validate([mockValidation]);
      
      // Test with invalid data
      mockReq.body = { email: 'test@example.com' };
      
      await middleware(mockReq, mockRes, mockNext);
      
      expect(mockRes.status.calledWith(400)).to.be.true;
      expect(mockRes.json.calledOnce).to.be.true;
      expect(mockRes.json.args[0][0].success).to.be.false;
      expect(mockRes.json.args[0][0].code).to.equal('VALIDATION_ERROR');
      expect(mockNext.called).to.be.false;
      
      // Reset mocks
      mockRes.status = sinon.stub().returnsThis();
      mockRes.json = sinon.stub().returnsThis();
      mockNext = sinon.spy();
      
      // Test with valid data
      mockReq.body = { name: 'Test User', email: 'test@example.com' };
      mockReq._validationErrors = null;
      
      await middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(mockRes.status.called).to.be.false;
      expect(mockRes.json.called).to.be.false;
    });
    
    it('should validate request data with Joi', () => {
      // Create a simple Joi schema
      const schema = {
        validate: (data, options) => {
          if (!data.name) {
            return {
              error: {
                details: [{ path: ['name'], message: 'Name is required' }]
              }
            };
          }
          return { value: data };
        }
      };
      
      const middleware = validateWithJoi(schema);
      
      // Test with invalid data
      mockReq.body = { email: 'test@example.com' };
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockRes.status.calledWith(400)).to.be.true;
      expect(mockRes.json.calledOnce).to.be.true;
      expect(mockRes.json.args[0][0].success).to.be.false;
      expect(mockRes.json.args[0][0].code).to.equal('VALIDATION_ERROR');
      expect(mockNext.called).to.be.false;
      
      // Reset mocks
      mockRes.status = sinon.stub().returnsThis();
      mockRes.json = sinon.stub().returnsThis();
      mockNext = sinon.spy();
      
      // Test with valid data
      mockReq.body = { name: 'Test User', email: 'test@example.com' };
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(mockRes.status.called).to.be.false;
      expect(mockRes.json.called).to.be.false;
    });
    
    it('should sanitize input to prevent XSS attacks', () => {
      mockReq.body = {
        name: '<script>alert("XSS")</script>Test User',
        description: 'Normal text with <img src="x" onerror="alert(\'XSS\')">',
        nested: {
          field: '<a href="javascript:alert(\'XSS\')">Click me</a>'
        }
      };
      
      sanitizeInputs(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(mockReq.body.name).to.not.include('<script>');
      expect(mockReq.body.description).to.not.include('onerror=');
      expect(mockReq.body.nested.field).to.not.include('javascript:');
    });
    
    it('should validate MongoDB ObjectId', () => {
      // Valid ObjectId
      const validId = '507f1f77bcf86cd799439011';
      expect(isValidObjectId(validId)).to.be.true;
      
      // Invalid ObjectId
      const invalidId = 'not-an-object-id';
      expect(isValidObjectId(invalidId)).to.be.false;
    });
  });
  
  // Test rate limiting middleware
  describe('Rate Limiting Middleware', () => {
    it('should have different rate limiters for different routes', () => {
      expect(rateLimiters).to.have.property('api');
      expect(rateLimiters).to.have.property('auth');
      expect(rateLimiters).to.have.property('userCreation');
      expect(rateLimiters).to.have.property('productCreation');
      expect(rateLimiters).to.have.property('dealCreation');
      
      // Check rate limiter configurations
      expect(rateLimiters.api.max).to.be.greaterThan(rateLimiters.auth.max);
      expect(rateLimiters.auth.max).to.be.greaterThan(rateLimiters.userCreation.max);
    });
    
    it('should have consistent error response format', () => {
      const mockReq = { ip: '127.0.0.1' };
      const mockRes = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      
      // Test API rate limiter handler
      rateLimiters.api.handler(mockReq, mockRes);
      
      expect(mockRes.status.calledWith(429)).to.be.true;
      expect(mockRes.json.calledOnce).to.be.true;
      expect(mockRes.json.args[0][0].success).to.be.false;
      expect(mockRes.json.args[0][0].code).to.equal('RATE_LIMIT_EXCEEDED');
      expect(mockRes.json.args[0][0]).to.have.property('retryAfter');
    });
  });
  
  // Test logging and request tracking middleware
  describe('Logging and Request Tracking Middleware', () => {
    let mockReq, mockRes, mockNext, logSpy;
    
    beforeEach(() => {
      mockReq = {
        method: 'GET',
        originalUrl: '/api/test',
        ip: '127.0.0.1',
        get: sinon.stub().returns('Test User Agent'),
        user: { id: '123', role: 'user' }
      };
      
      mockRes = {
        statusCode: 200,
        get: sinon.stub().returns('1024'),
        setHeader: sinon.stub(),
        on: sinon.stub().callsFake((event, callback) => {
          if (event === 'finish') {
            callback();
          }
        })
      };
      
      mockNext = sinon.spy();
      
      // Spy on logger methods
      logSpy = {
        info: sinon.spy(logger, 'info'),
        warn: sinon.spy(logger, 'warn'),
        error: sinon.spy(logger, 'error')
      };
    });
    
    afterEach(() => {
      // Restore logger methods
      logSpy.info.restore();
      logSpy.warn.restore();
      logSpy.error.restore();
    });
    
    it('should add request ID to request and response', () => {
      requestTracker(mockReq, mockRes, mockNext);
      
      expect(mockReq.requestId).to.be.a('string');
      expect(mockRes.setHeader.calledWith('X-Request-ID', mockReq.requestId)).to.be.true;
      expect(mockNext.calledOnce).to.be.true;
    });
    
    it('should log request information on completion', () => {
      // Add request ID
      mockReq.requestId = uuidv4();
      
      requestLogger(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(logSpy.info.calledOnce).to.be.true;
      expect(logSpy.info.args[0][0]).to.equal('Request completed');
      expect(logSpy.info.args[0][1]).to.have.property('requestId', mockReq.requestId);
      expect(logSpy.info.args[0][1]).to.have.property('method', mockReq.method);
      expect(logSpy.info.args[0][1]).to.have.property('url', mockReq.originalUrl);
      expect(logSpy.info.args[0][1]).to.have.property('status', mockRes.statusCode);
    });
    
    it('should log client errors with warning level', () => {
      // Add request ID and set status to client error
      mockReq.requestId = uuidv4();
      mockRes.statusCode = 404;
      
      requestLogger(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(logSpy.warn.calledOnce).to.be.true;
      expect(logSpy.warn.args[0][0]).to.equal('Client error response');
      expect(logSpy.warn.args[0][1]).to.have.property('status', 404);
    });
    
    it('should log server errors with error level', () => {
      // Add request ID and set status to server error
      mockReq.requestId = uuidv4();
      mockRes.statusCode = 500;
      
      requestLogger(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(logSpy.error.calledOnce).to.be.true;
      expect(logSpy.error.args[0][0]).to.equal('Server error response');
      expect(logSpy.error.args[0][1]).to.have.property('status', 500);
    });
    
    it('should log detailed error information', () => {
      // Add request ID
      mockReq.requestId = uuidv4();
      
      const mockError = new Error('Test error');
      mockError.code = 'TEST_ERROR';
      mockError.statusCode = 500;
      
      errorLogger(mockError, mockReq, mockRes, mockNext);
      
      expect(logSpy.error.calledOnce).to.be.true;
      expect(logSpy.error.args[0][0]).to.equal('Request error');
      expect(logSpy.error.args[0][1]).to.have.property('requestId', mockReq.requestId);
      expect(logSpy.error.args[0][1].error).to.have.property('message', 'Test error');
      expect(logSpy.error.args[0][1].error).to.have.property('code', 'TEST_ERROR');
      expect(mockRes.status.calledWith(500)).to.be.true;
      expect(mockRes.json.args[0][0].success).to.be.false;
      expect(mockRes.json.args[0][0].code).to.equal('TEST_ERROR');
      expect(mockRes.json.args[0][0].requestId).to.equal(mockReq.requestId);
    });
    
    it('should detect and log slow requests', () => {
      // Add request ID
      mockReq.requestId = uuidv4();
      
      // Create performance monitor with low threshold
      const monitor = performanceMonitor(10);
      
      // Mock Date.now to simulate elapsed time
      const originalNow = Date.now;
      Date.now = sinon.stub();
      Date.now.onFirstCall().returns(1000);
      Date.now.onSecondCall().returns(1020); // 20ms elapsed (> 10ms threshold)
      
      monitor(mockReq, mockRes, mockNext);
      
      expect(mockNext.calledOnce).to.be.true;
      expect(logSpy.warn.calledOnce).to.be.true;
      expect(logSpy.warn.args[0][0]).to.equal('Slow request detected');
      expect(logSpy.warn.args[0][1]).to.have.property('requestId', mockReq.requestId);
      expect(logSpy.warn.args[0][1]).to.have.property('duration', 20);
      
      // Restore Date.now
      Date.now = originalNow;
    });
  });
});
