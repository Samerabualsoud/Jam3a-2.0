const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const app = require('../server');
const Deal = require('../models/Deal');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const testUtils = require('./testUtils');

describe('Enhanced Deal API Routes', () => {
  let testUser;
  let testAdmin;
  let testSeller;
  let testProduct;
  let testCategory;
  let testDeal;
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
    
    // Create a test category
    testCategory = await Category.create({
      name: 'Test Category',
      description: 'Category for testing'
    });
  });
  
  // Create test users, product, and deal before each test
  beforeEach(async () => {
    testUser = await testUtils.createTestUser();
    testAdmin = await testUtils.createTestAdmin();
    testSeller = await User.create({
      name: 'Test Seller',
      email: `seller${Date.now()}@example.com`,
      password: 'password123',
      role: 'seller'
    });
    
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'This is a test product with detailed description',
      price: 99.99,
      category: testCategory._id,
      imageUrl: 'https://example.com/test-image.jpg',
      stock: 100,
      featured: false,
      createdBy: testAdmin._id
    });
    
    testDeal = await Deal.create({
      jam3aId: `JAM-${Date.now().toString().substring(7)}`,
      title: 'Test Deal',
      description: 'This is a test deal with detailed description',
      category: testCategory._id,
      regularPrice: 99.99,
      jam3aPrice: 79.99,
      discountPercentage: 20,
      currentParticipants: 0,
      maxParticipants: 10,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'active',
      createdBy: testAdmin._id
    });
    
    userToken = testUtils.generateToken(testUser);
    adminToken = testUtils.generateToken(testAdmin);
    sellerToken = testUtils.generateToken(testSeller);
  });
  
  // Clean up after each test
  afterEach(async () => {
    await Deal.findByIdAndDelete(testDeal._id);
    await Product.findByIdAndDelete(testProduct._id);
    await User.deleteMany({
      _id: { $in: [testUser._id, testAdmin._id, testSeller._id] }
    });
  });
  
  // Disconnect after all tests
  after(async () => {
    await Category.findByIdAndDelete(testCategory._id);
    await testUtils.teardownTestDB();
  });
  
  // Test get all deals with pagination and filtering
  describe('GET /api/deals', () => {
    it('should get all deals with optional authentication', async () => {
      // Test without authentication
      const resUnauthenticated = await request(app)
        .get('/api/deals');
      
      expect(resUnauthenticated.status).to.equal(200);
      expect(resUnauthenticated.body).to.be.an('array');
      expect(resUnauthenticated.body.length).to.be.at.least(1);
      
      // Test with authentication
      const resAuthenticated = await request(app)
        .get('/api/deals')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(resAuthenticated.status).to.equal(200);
      expect(resAuthenticated.body).to.be.an('array');
      expect(resAuthenticated.body.length).to.be.at.least(1);
      
      // Both responses should contain the test deal
      const unauthDeal = resUnauthenticated.body.find(d => d._id === testDeal._id.toString());
      const authDeal = resAuthenticated.body.find(d => d._id === testDeal._id.toString());
      
      expect(unauthDeal).to.exist;
      expect(authDeal).to.exist;
    });
    
    it('should get featured deals only', async () => {
      // Create featured deal
      const featuredDeal = await Deal.create({
        jam3aId: `JAM-${Date.now().toString().substring(7)}`,
        title: 'Featured Deal',
        description: 'This is a featured deal',
        category: testCategory._id,
        regularPrice: 149.99,
        jam3aPrice: 119.99,
        discountPercentage: 20,
        maxParticipants: 15,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        featured: true,
        status: 'active',
        createdBy: testAdmin._id
      });
      
      const res = await request(app)
        .get('/api/deals/featured');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      
      // All returned deals should be featured
      res.body.forEach(deal => {
        expect(deal.featured).to.be.true;
      });
      
      // Clean up
      await Deal.findByIdAndDelete(featuredDeal._id);
    });
    
    it('should filter deals by search criteria', async () => {
      // Create additional deals with different properties
      const additionalDeals = [
        await Deal.create({
          jam3aId: `JAM-PHONE-${Date.now().toString().substring(7)}`,
          title: 'Phone Deal',
          description: 'This is a deal for phones',
          category: testCategory._id,
          regularPrice: 899.99,
          jam3aPrice: 799.99,
          discountPercentage: 11.11,
          maxParticipants: 20,
          currentParticipants: 5,
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          status: 'active',
          createdBy: testAdmin._id
        }),
        await Deal.create({
          jam3aId: `JAM-LAPTOP-${Date.now().toString().substring(7)}`,
          title: 'Laptop Deal',
          description: 'This is a deal for laptops',
          category: testCategory._id,
          regularPrice: 1299.99,
          jam3aPrice: 1099.99,
          discountPercentage: 15.38,
          maxParticipants: 10,
          currentParticipants: 2,
          expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: 'pending',
          createdBy: testAdmin._id
        })
      ];
      
      // Test search by title
      const resTitle = await request(app)
        .get('/api/deals/search/filter')
        .query({ query: 'Phone' });
      
      expect(resTitle.status).to.equal(200);
      expect(resTitle.body).to.have.property('success', true);
      expect(resTitle.body.data).to.be.an('array');
      expect(resTitle.body.data.length).to.be.at.least(1);
      expect(resTitle.body.data[0].title).to.include('Phone');
      
      // Test filter by status
      const resStatus = await request(app)
        .get('/api/deals/search/filter')
        .query({ status: 'pending' });
      
      expect(resStatus.status).to.equal(200);
      expect(resStatus.body).to.have.property('success', true);
      expect(resStatus.body.data).to.be.an('array');
      expect(resStatus.body.data.length).to.be.at.least(1);
      expect(resStatus.body.data[0].status).to.equal('pending');
      
      // Test filter by participants range
      const resParticipants = await request(app)
        .get('/api/deals/search/filter')
        .query({ minParticipants: 3, maxParticipants: 10 });
      
      expect(resParticipants.status).to.equal(200);
      expect(resParticipants.body).to.have.property('success', true);
      expect(resParticipants.body.data).to.be.an('array');
      
      // Clean up
      await Deal.deleteMany({
        _id: { $in: additionalDeals.map(d => d._id) }
      });
    });
    
    it('should include request ID in response headers', async () => {
      const res = await request(app)
        .get('/api/deals');
      
      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property('x-request-id');
      expect(res.headers['x-request-id']).to.be.a('string');
    });
  });
  
  // Test get deal by ID with enhanced validation
  describe('GET /api/deals/:id', () => {
    it('should get deal by ID with populated category', async () => {
      const res = await request(app)
        .get(`/api/deals/${testDeal._id}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', testDeal._id.toString());
      expect(res.body).to.have.property('title', testDeal.title);
      expect(res.body).to.have.property('jam3aPrice', testDeal.jam3aPrice);
      
      // Category should be populated
      expect(res.body).to.have.property('category');
      expect(res.body.category).to.have.property('_id', testCategory._id.toString());
      expect(res.body.category).to.have.property('name', testCategory.name);
    });
    
    it('should return 404 for non-existent deal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/deals/${fakeId}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'RESOURCE_NOT_FOUND');
      expect(res.body.message).to.include('not found');
    });
    
    it('should return 400 for invalid MongoDB ID format', async () => {
      const res = await request(app)
        .get('/api/deals/invalid-id-format');
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
    });
  });
  
  // Test create deal with enhanced validation and authentication
  describe('POST /api/deals', () => {
    it('should allow admin to create deal with valid data', async () => {
      const newDeal = {
        title: 'New Test Deal',
        description: 'This is a new test deal with detailed description',
        categoryId: testCategory._id.toString(),
        regularPrice: 129.99,
        jam3aPrice: 99.99,
        maxParticipants: 15,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true,
        image: 'https://example.com/new-deal-image.jpg',
        status: 'pending'
      };
      
      const res = await request(app)
        .post('/api/deals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newDeal);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('title', newDeal.title);
      expect(res.body.data).to.have.property('regularPrice', newDeal.regularPrice);
      expect(res.body.data).to.have.property('jam3aPrice', newDeal.jam3aPrice);
      expect(res.body.data).to.have.property('discountPercentage');
      expect(res.body.data).to.have.property('maxParticipants', newDeal.maxParticipants);
      expect(res.body.data).to.have.property('featured', newDeal.featured);
      expect(res.body.data).to.have.property('status', newDeal.status);
      expect(res.body.data).to.have.property('createdBy', testAdmin._id.toString());
      expect(res.body.data).to.have.property('jam3aId').that.includes('JAM-');
      
      // Category should be populated
      expect(res.body.data).to.have.property('category');
      expect(res.body.data.category).to.have.property('_id', testCategory._id.toString());
      
      // Clean up created deal
      await Deal.findByIdAndDelete(res.body.data._id);
    });
    
    it('should allow seller to create deal', async () => {
      const newDeal = {
        title: 'Seller Deal',
        description: 'This is a deal created by a seller',
        categoryId: testCategory._id.toString(),
        regularPrice: 89.99,
        jam3aPrice: 69.99,
        maxParticipants: 8,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const res = await request(app)
        .post('/api/deals')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(newDeal);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('title', newDeal.title);
      expect(res.body.data).to.have.property('createdBy', testSeller._id.toString());
      
      // Clean up created deal
      await Deal.findByIdAndDelete(res.body.data._id);
    });
    
    it('should not allow regular user to create deal', async () => {
      const newDeal = {
        title: 'Unauthorized Deal',
        description: 'This deal should not be created',
        categoryId: testCategory._id.toString(),
        regularPrice: 99.99,
        jam3aPrice: 79.99,
        maxParticipants: 10,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const res = await request(app)
        .post('/api/deals')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newDeal);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
    });
    
    it('should validate deal data thoroughly', async () => {
      const invalidDeal = {
        title: '', // Empty title
        description: 'Missing title and invalid price',
        categoryId: 'invalid-category-id', // Invalid category ID
        regularPrice: 50,
        jam3aPrice: 60, // Higher than regular price (invalid)
        maxParticipants: 1, // Too few participants
        expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Past date (invalid)
      };
      
      const res = await request(app)
        .post('/api/deals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidDeal);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors.length).to.be.at.least(4); // At least 4 validation errors
      
      // Check specific validation errors
      const errorFields = res.body.errors.map(err => err.param);
      expect(errorFields).to.include.members(['title', 'categoryId', 'jam3aPrice', 'maxParticipants', 'expiryDate']);
    });
    
    it('should sanitize deal data to prevent XSS attacks', async () => {
      const dealWithXSS = {
        title: '<script>alert("XSS")</script>Deal Title',
        description: 'Description with <img src="x" onerror="alert(\'XSS\')">',
        categoryId: testCategory._id.toString(),
        regularPrice: 99.99,
        jam3aPrice: 79.99,
        maxParticipants: 10,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const res = await request(app)
        .post('/api/deals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(dealWithXSS);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      
      // Verify sanitization
      expect(res.body.data.title).to.not.include('<script>');
      expect(res.body.data.description).to.not.include('onerror=');
      
      // Clean up created deal
      await Deal.findByIdAndDelete(res.body.data._id);
    });
  });
  
  // Test update deal with enhanced validation and authentication
  describe('PUT /api/deals/:id', () => {
    it('should allow admin to update any deal', async () => {
      const updateData = {
        title: 'Updated Deal Title',
        maxParticipants: 20,
        featured: true,
        status: 'completed'
      };
      
      const res = await request(app)
        .put(`/api/deals/${testDeal._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('title', updateData.title);
      expect(res.body.data).to.have.property('maxParticipants', updateData.maxParticipants);
      expect(res.body.data).to.have.property('featured', updateData.featured);
      expect(res.body.data).to.have.property('status', updateData.status);
      expect(res.body.data).to.have.property('updatedBy', testAdmin._id.toString());
    });
    
    it('should allow creator to update their own deals', async () => {
      // Create a deal owned by the seller
      const sellerDeal = await Deal.create({
        jam3aId: `JAM-SELLER-${Date.now().toString().substring(7)}`,
        title: 'Seller\'s Deal',
        description: 'This deal belongs to the seller',
        category: testCategory._id,
        regularPrice: 79.99,
        jam3aPrice: 59.99,
        discountPercentage: 25,
        maxParticipants: 8,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: testSeller._id
      });
      
      const updateData = {
        title: 'Seller Updated Title',
        maxParticipants: 12
      };
      
      const res = await request(app)
        .put(`/api/deals/${sellerDeal._id}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('title', updateData.title);
      expect(res.body.data).to.have.property('maxParticipants', updateData.maxParticipants);
      expect(res.body.data).to.have.property('updatedBy', testSeller._id.toString());
      
      // Clean up
      await Deal.findByIdAndDelete(sellerDeal._id);
    });
    
    it('should not allow user to update deals they don\'t own', async () => {
      const updateData = {
        title: 'Unauthorized Update',
        maxParticipants: 25
      };
      
      const res = await request(app)
        .put(`/api/deals/${testDeal._id}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
    });
    
    it('should validate update data', async () => {
      const invalidUpdateData = {
        title: '', // Empty title
        maxParticipants: 0, // Too few participants
        expiryDate: 'not-a-date' // Invalid date
      };
      
      const res = await request(app)
        .put(`/api/deals/${testDeal._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidUpdateData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
      expect(res.body).to.have.property('errors');
    });
    
    it('should return 404 for non-existent deal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        title: 'Update Non-existent',
        maxParticipants: 15
      };
      
      const res = await request(app)
        .put(`/api/deals/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'RESOURCE_NOT_FOUND');
    });
  });
  
  // Test delete deal with enhanced authentication
  describe('DELETE /api/deals/:id', () => {
    it('should allow admin to delete any deal', async () => {
      const dealToDelete = await Deal.create({
        jam3aId: `JAM-DELETE-${Date.now().toString().substring(7)}`,
        title: 'Deal to Delete',
        description: 'This deal will be deleted',
        category: testCategory._id,
        regularPrice: 59.99,
        jam3aPrice: 49.99,
        discountPercentage: 16.67,
        maxParticipants: 5,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: testAdmin._id
      });
      
      const res = await request(app)
        .delete(`/api/deals/${dealToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('message').that.includes('deleted');
      
      // Verify deal is deleted
      const deletedDeal = await Deal.findById(dealToDelete._id);
      expect(deletedDeal).to.be.null;
    });
    
    it('should not allow regular users to delete deals', async () => {
      const res = await request(app)
        .delete(`/api/deals/${testDeal._id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
      
      // Verify deal still exists
      const checkDeal = await Deal.findById(testDeal._id);
      expect(checkDeal).to.exist;
    });
    
    it('should not allow sellers to delete deals', async () => {
      // Create a deal owned by the seller
      const sellerDeal = await Deal.create({
        jam3aId: `JAM-SELLER-${Date.now().toString().substring(7)}`,
        title: 'Seller\'s Deal',
        description: 'This deal belongs to the seller',
        category: testCategory._id,
        regularPrice: 79.99,
        jam3aPrice: 59.99,
        discountPercentage: 25,
        maxParticipants: 8,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: testSeller._id
      });
      
      const res = await request(app)
        .delete(`/api/deals/${sellerDeal._id}`)
        .set('Authorization', `Bearer ${sellerToken}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
      
      // Verify deal still exists
      const checkDeal = await Deal.findById(sellerDeal._id);
      expect(checkDeal).to.exist;
      
      // Clean up
      await Deal.findByIdAndDelete(sellerDeal._id);
    });
    
    it('should return 404 for non-existent deal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/deals/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'RESOURCE_NOT_FOUND');
    });
  });
  
  // Test join deal functionality
  describe('POST /api/deals/:id/join', () => {
    it('should allow authenticated user to join deal', async () => {
      const res = await request(app)
        .post(`/api/deals/${testDeal._id}/join`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: testUser._id.toString() });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('participants').that.includes(testUser._id.toString());
      expect(res.body.data).to.have.property('currentParticipants', 1);
    });
    
    it('should not allow unauthenticated user to join deal', async () => {
      const res = await request(app)
        .post(`/api/deals/${testDeal._id}/join`)
        .send({ userId: testUser._id.toString() });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_NO_TOKEN');
    });
    
    it('should not allow joining a deal that is already full', async () => {
      // Create a deal that is already at max capacity
      const fullDeal = await Deal.create({
        jam3aId: `JAM-FULL-${Date.now().toString().substring(7)}`,
        title: 'Full Deal',
        description: 'This deal is already at max capacity',
        category: testCategory._id,
        regularPrice: 69.99,
        jam3aPrice: 49.99,
        discountPercentage: 28.57,
        maxParticipants: 2,
        currentParticipants: 2, // Already full
        participants: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()], // Two random participants
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: testAdmin._id
      });
      
      const res = await request(app)
        .post(`/api/deals/${fullDeal._id}/join`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: testUser._id.toString() });
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('full');
      
      // Clean up
      await Deal.findByIdAndDelete(fullDeal._id);
    });
    
    it('should not allow joining an expired deal', async () => {
      // Create an expired deal
      const expiredDeal = await Deal.create({
        jam3aId: `JAM-EXPIRED-${Date.now().toString().substring(7)}`,
        title: 'Expired Deal',
        description: 'This deal has already expired',
        category: testCategory._id,
        regularPrice: 59.99,
        jam3aPrice: 39.99,
        discountPercentage: 33.34,
        maxParticipants: 10,
        currentParticipants: 0,
        expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        status: 'active',
        createdBy: testAdmin._id
      });
      
      const res = await request(app)
        .post(`/api/deals/${expiredDeal._id}/join`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: testUser._id.toString() });
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('expired');
      
      // Clean up
      await Deal.findByIdAndDelete(expiredDeal._id);
    });
    
    it('should not allow joining a deal that is not active', async () => {
      // Create a pending deal
      const pendingDeal = await Deal.create({
        jam3aId: `JAM-PENDING-${Date.now().toString().substring(7)}`,
        title: 'Pending Deal',
        description: 'This deal is still pending',
        category: testCategory._id,
        regularPrice: 79.99,
        jam3aPrice: 59.99,
        discountPercentage: 25,
        maxParticipants: 10,
        currentParticipants: 0,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending', // Not active
        createdBy: testAdmin._id
      });
      
      const res = await request(app)
        .post(`/api/deals/${pendingDeal._id}/join`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: testUser._id.toString() });
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('active');
      
      // Clean up
      await Deal.findByIdAndDelete(pendingDeal._id);
    });
    
    it('should not allow joining a deal twice', async () => {
      // First join
      await request(app)
        .post(`/api/deals/${testDeal._id}/join`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: testUser._id.toString() });
      
      // Second join attempt
      const res = await request(app)
        .post(`/api/deals/${testDeal._id}/join`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: testUser._id.toString() });
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('already joined');
    });
  });
});
