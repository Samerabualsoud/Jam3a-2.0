const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const testUtils = require('./testUtils');

describe('Enhanced User API Routes', () => {
  let testUser;
  let testAdmin;
  let testSeller;
  let userToken;
  let adminToken;
  let sellerToken;
  let sandbox;
  
  // Setup sandbox for stubs and spies
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  // Setup before tests
  before(async () => {
    await testUtils.setupTestDB();
  });
  
  // Create test users before each test
  beforeEach(async () => {
    testUser = await testUtils.createTestUser();
    testAdmin = await testUtils.createTestAdmin();
    testSeller = await User.create({
      name: 'Test Seller',
      email: `seller${Date.now()}@example.com`,
      password: 'password123',
      role: 'seller'
    });
    
    userToken = testUtils.generateToken(testUser);
    adminToken = testUtils.generateToken(testAdmin);
    sellerToken = testUtils.generateToken(testSeller);
  });
  
  // Clean up after each test
  afterEach(async () => {
    await testUtils.cleanupTestData([testUser._id, testAdmin._id, testSeller._id], User);
  });
  
  // Disconnect after all tests
  after(async () => {
    await testUtils.teardownTestDB();
  });
  
  // Test user registration with enhanced validation
  describe('POST /api/users/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'New Test User',
        email: 'newtestuser@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        phone: '+1234567890',
        address: '123 Test Street, Test City'
      };
      
      const res = await request(app)
        .post('/api/users/register')
        .send(userData);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', userData.name);
      expect(res.body.data).to.have.property('email', userData.email);
      expect(res.body.data).to.not.have.property('password');
      expect(res.body.data).to.have.property('role', 'user'); // Default role
      
      // Verify user was created in database
      const createdUser = await User.findOne({ email: userData.email });
      expect(createdUser).to.exist;
      expect(createdUser.name).to.equal(userData.name);
      
      // Clean up
      await User.findByIdAndDelete(createdUser._id);
    });
    
    it('should return validation errors for invalid input', async () => {
      const invalidUserData = {
        name: 'a', // Too short
        email: 'invalid-email',
        password: 'short', // Too short and missing requirements
        confirmPassword: 'different', // Doesn't match
        phone: 'not-a-phone'
      };
      
      const res = await request(app)
        .post('/api/users/register')
        .send(invalidUserData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors.length).to.be.greaterThan(0);
      
      // Check specific validation errors
      const errorFields = res.body.errors.map(err => err.param);
      expect(errorFields).to.include.members(['name', 'email', 'password', 'confirmPassword', 'phone']);
    });
    
    it('should sanitize user input to prevent XSS attacks', async () => {
      const userData = {
        name: '<script>alert("XSS")</script>Test User',
        email: 'xsstest@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        address: '<img src="x" onerror="alert(\'XSS\')">'
      };
      
      const res = await request(app)
        .post('/api/users/register')
        .send(userData);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      
      // Verify sanitization
      const createdUser = await User.findOne({ email: userData.email });
      expect(createdUser.name).to.not.include('<script>');
      expect(createdUser.address).to.not.include('onerror=');
      
      // Clean up
      await User.findByIdAndDelete(createdUser._id);
    });
    
    it('should not allow duplicate email registration', async () => {
      // Use existing test user's email
      const userData = {
        name: 'Duplicate User',
        email: testUser.email,
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      
      const res = await request(app)
        .post('/api/users/register')
        .send(userData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.error).to.include('already exists');
    });
    
    it('should enforce password complexity requirements', async () => {
      const weakPasswordData = {
        name: 'Weak Password User',
        email: 'weakpass@example.com',
        password: 'password', // Missing uppercase, number, and special char
        confirmPassword: 'password'
      };
      
      const res = await request(app)
        .post('/api/users/register')
        .send(weakPasswordData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('errors');
      
      // Check for password complexity error
      const passwordError = res.body.errors.find(err => err.param === 'password');
      expect(passwordError).to.exist;
      expect(passwordError.msg).to.include('uppercase');
    });
  });
  
  // Test user login with enhanced authentication
  describe('POST /api/users/login', () => {
    it('should login user and return token with user data', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'password123'
        });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('token').that.is.a('string');
      expect(res.body.data).to.have.property('name', testUser.name);
      expect(res.body.data).to.have.property('email', testUser.email);
      expect(res.body.data).to.have.property('role', 'user');
      expect(res.body.data).to.not.have.property('password');
      
      // Verify token contains correct user data
      const decodedToken = jwt.verify(res.body.token, 'jam3a_jwt_secret');
      expect(decodedToken).to.have.property('user');
      expect(decodedToken.user).to.have.property('id', testUser._id.toString());
      expect(decodedToken.user).to.have.property('role', 'user');
    });
    
    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INVALID_CREDENTIALS');
      expect(res.body).to.not.have.property('token');
    });
    
    it('should not login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INVALID_CREDENTIALS');
      expect(res.body).to.not.have.property('token');
    });
    
    it('should handle rate limiting for multiple failed attempts', async () => {
      // This test is conceptual since we can't easily trigger rate limiting in tests
      // In a real implementation, we would use a mock for the rate limiter
      const loginAttempt = () => {
        return request(app)
          .post('/api/users/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword'
          });
      };
      
      // Make first attempt
      const res1 = await loginAttempt();
      expect(res1.status).to.equal(401);
      
      // In a real test, we would verify rate limiting headers
      expect(res1.headers).to.have.property('ratelimit-limit');
      expect(res1.headers).to.have.property('ratelimit-remaining');
    });
  });
  
  // Test protected routes with enhanced authentication
  describe('GET /api/users/:id', () => {
    it('should allow user to access their own profile', async () => {
      const res = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('_id', testUser._id.toString());
      expect(res.body.data).to.have.property('name', testUser.name);
      expect(res.body.data).to.have.property('email', testUser.email);
      expect(res.body.data).to.not.have.property('password');
    });
    
    it('should allow admin to access any user profile', async () => {
      const res = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('_id', testUser._id.toString());
      expect(res.body.data).to.have.property('name', testUser.name);
    });
    
    it('should not allow user to access another user\'s profile', async () => {
      // Create another regular user
      const anotherUser = await testUtils.createTestUser();
      
      const res = await request(app)
        .get(`/api/users/${anotherUser._id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
      
      // Clean up
      await User.findByIdAndDelete(anotherUser._id);
    });
    
    it('should not allow access without token', async () => {
      const res = await request(app)
        .get(`/api/users/${testUser._id}`);
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_NO_TOKEN');
    });
    
    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body.error).to.include('not found');
    });
  });
  
  // Test user update with enhanced validation and authentication
  describe('PUT /api/users/:id', () => {
    it('should allow user to update their own profile', async () => {
      const updateData = {
        name: 'Updated User Name',
        phone: '+9876543210',
        address: 'New Address'
      };
      
      const res = await request(app)
        .put(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', updateData.name);
      expect(res.body.data).to.have.property('phone', updateData.phone);
      expect(res.body.data).to.have.property('address', updateData.address);
      
      // Verify update in database
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.name).to.equal(updateData.name);
    });
    
    it('should allow admin to update any user profile', async () => {
      const updateData = {
        name: 'Admin Updated Name',
        role: 'seller' // Only admin should be able to change roles
      };
      
      const res = await request(app)
        .put(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', updateData.name);
      expect(res.body.data).to.have.property('role', updateData.role);
      
      // Verify update in database
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.role).to.equal('seller');
    });
    
    it('should not allow user to update another user\'s profile', async () => {
      // Create another regular user
      const anotherUser = await testUtils.createTestUser();
      
      const updateData = {
        name: 'Unauthorized Update'
      };
      
      const res = await request(app)
        .put(`/api/users/${anotherUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
      
      // Clean up
      await User.findByIdAndDelete(anotherUser._id);
    });
    
    it('should not allow regular user to update role', async () => {
      const updateData = {
        name: 'Valid Update',
        role: 'admin' // Should not be allowed
      };
      
      const res = await request(app)
        .put(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
      
      // Verify role was not changed
      const unchangedUser = await User.findById(testUser._id);
      expect(unchangedUser.role).to.equal('user');
    });
    
    it('should validate update data', async () => {
      const invalidUpdateData = {
        name: '', // Empty name
        email: 'invalid-email',
        phone: 'not-a-phone'
      };
      
      const res = await request(app)
        .put(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidUpdateData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
      expect(res.body).to.have.property('errors');
    });
  });
  
  // Test user deletion with enhanced authentication
  describe('DELETE /api/users/:id', () => {
    it('should allow admin to delete user', async () => {
      const userToDelete = await testUtils.createTestUser();
      
      const res = await request(app)
        .delete(`/api/users/${userToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('message').that.includes('deleted');
      
      // Verify user was deleted
      const deletedUser = await User.findById(userToDelete._id);
      expect(deletedUser).to.be.null;
    });
    
    it('should not allow regular user to delete any user', async () => {
      const res = await request(app)
        .delete(`/api/users/${testAdmin._id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
      
      // Verify user was not deleted
      const notDeletedUser = await User.findById(testAdmin._id);
      expect(notDeletedUser).to.exist;
    });
    
    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body.error).to.include('not found');
    });
  });
  
  // Test admin routes with enhanced role-based authorization
  describe('GET /api/users', () => {
    it('should allow admin to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.length).to.be.at.least(3); // At least our test users
      
      // Verify user data format
      const userData = res.body.data[0];
      expect(userData).to.have.property('_id');
      expect(userData).to.have.property('name');
      expect(userData).to.have.property('email');
      expect(userData).to.have.property('role');
      expect(userData).to.not.have.property('password');
    });
    
    it('should not allow regular user to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
    });
    
    it('should not allow seller to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${sellerToken}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
    });
  });
  
  // Test token refresh mechanism
  describe('Token Refresh Mechanism', () => {
    it('should include new token in response header when token is about to expire', async () => {
      // Create a token that expires in 4 minutes (below the 5-minute threshold)
      const expiringToken = jwt.sign(
        { 
          user: { id: testUser._id.toString(), role: 'user' },
          exp: Math.floor(Date.now() / 1000) + 240 // 4 minutes
        }, 
        'jam3a_jwt_secret'
      );
      
      const res = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${expiringToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property('x-new-token');
      
      // Verify new token is valid and has extended expiration
      const newToken = res.headers['x-new-token'];
      const decodedToken = jwt.verify(newToken, 'jam3a_jwt_secret');
      expect(decodedToken).to.have.property('user');
      expect(decodedToken.user).to.have.property('id', testUser._id.toString());
      
      // New token should expire later than the original
      expect(decodedToken.exp).to.be.greaterThan(Math.floor(Date.now() / 1000) + 240);
    });
  });
});
