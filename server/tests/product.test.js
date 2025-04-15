const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const testUtils = require('./testUtils');

describe('Enhanced Product API Routes', () => {
  let testUser;
  let testAdmin;
  let testSeller;
  let testProduct;
  let testCategory;
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
  
  // Create test users and product before each test
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
    
    userToken = testUtils.generateToken(testUser);
    adminToken = testUtils.generateToken(testAdmin);
    sellerToken = testUtils.generateToken(testSeller);
  });
  
  // Clean up after each test
  afterEach(async () => {
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
  
  // Test get all products with pagination and filtering
  describe('GET /api/products', () => {
    it('should get all products with pagination', async () => {
      // Create additional test products
      const additionalProducts = [];
      for (let i = 0; i < 5; i++) {
        additionalProducts.push(await Product.create({
          name: `Additional Product ${i}`,
          description: `Description for additional product ${i}`,
          price: 50 + i * 10,
          category: testCategory._id,
          stock: 50,
          createdBy: testAdmin._id
        }));
      }
      
      const res = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 3 });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.length).to.equal(3); // Limited to 3 items
      
      // Clean up additional products
      await Product.deleteMany({
        _id: { $in: additionalProducts.map(p => p._id) }
      });
    });
    
    it('should get products with category filter', async () => {
      // Create a different category
      const anotherCategory = await Category.create({
        name: 'Another Category',
        description: 'Another category for testing'
      });
      
      // Create product in different category
      const anotherProduct = await Product.create({
        name: 'Product in Another Category',
        description: 'This product belongs to another category',
        price: 79.99,
        category: anotherCategory._id,
        stock: 30,
        createdBy: testAdmin._id
      });
      
      const res = await request(app)
        .get('/api/products')
        .query({ category: testCategory._id.toString() });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
      
      // All returned products should be in the specified category
      res.body.data.forEach(product => {
        expect(product.category._id).to.equal(testCategory._id.toString());
      });
      
      // Clean up
      await Product.findByIdAndDelete(anotherProduct._id);
      await Category.findByIdAndDelete(anotherCategory._id);
    });
    
    it('should get featured products only', async () => {
      // Create featured product
      const featuredProduct = await Product.create({
        name: 'Featured Product',
        description: 'This is a featured product',
        price: 149.99,
        category: testCategory._id,
        featured: true,
        stock: 25,
        createdBy: testAdmin._id
      });
      
      const res = await request(app)
        .get('/api/products/featured');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.length).to.be.at.least(1);
      
      // All returned products should be featured
      res.body.data.forEach(product => {
        expect(product.featured).to.be.true;
      });
      
      // Clean up
      await Product.findByIdAndDelete(featuredProduct._id);
    });
    
    it('should include request ID in response headers', async () => {
      const res = await request(app)
        .get('/api/products');
      
      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property('x-request-id');
      expect(res.headers['x-request-id']).to.be.a('string');
    });
  });
  
  // Test get product by ID with enhanced validation
  describe('GET /api/products/:id', () => {
    it('should get product by ID with populated category', async () => {
      const res = await request(app)
        .get(`/api/products/${testProduct._id}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('_id', testProduct._id.toString());
      expect(res.body.data).to.have.property('name', testProduct.name);
      expect(res.body.data).to.have.property('price', testProduct.price);
      
      // Category should be populated
      expect(res.body.data).to.have.property('category');
      expect(res.body.data.category).to.have.property('_id', testCategory._id.toString());
      expect(res.body.data.category).to.have.property('name', testCategory.name);
    });
    
    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/products/${fakeId}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'RESOURCE_NOT_FOUND');
      expect(res.body.message).to.include('not found');
    });
    
    it('should return 400 for invalid MongoDB ID format', async () => {
      const res = await request(app)
        .get('/api/products/invalid-id-format');
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
    });
  });
  
  // Test create product with enhanced validation and authentication
  describe('POST /api/products', () => {
    it('should allow admin to create product with valid data', async () => {
      const newProduct = {
        name: 'New Test Product',
        description: 'This is a new test product with detailed description',
        price: 129.99,
        category: testCategory._id.toString(),
        stock: 50,
        featured: true,
        imageUrl: 'https://example.com/new-test-image.jpg',
        tags: ['new', 'test', 'premium']
      };
      
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', newProduct.name);
      expect(res.body.data).to.have.property('price', newProduct.price);
      expect(res.body.data).to.have.property('featured', newProduct.featured);
      expect(res.body.data).to.have.property('tags').that.deep.equals(newProduct.tags);
      expect(res.body.data).to.have.property('createdBy', testAdmin._id.toString());
      
      // Category should be populated
      expect(res.body.data).to.have.property('category');
      expect(res.body.data.category).to.have.property('_id', testCategory._id.toString());
      
      // Clean up created product
      await Product.findByIdAndDelete(res.body.data._id);
    });
    
    it('should allow seller to create product', async () => {
      const newProduct = {
        name: 'Seller Product',
        description: 'This is a product created by a seller',
        price: 89.99,
        category: testCategory._id.toString(),
        stock: 30
      };
      
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(newProduct);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', newProduct.name);
      expect(res.body.data).to.have.property('createdBy', testSeller._id.toString());
      
      // Clean up created product
      await Product.findByIdAndDelete(res.body.data._id);
    });
    
    it('should not allow regular user to create product', async () => {
      const newProduct = {
        name: 'Unauthorized Product',
        description: 'This product should not be created',
        price: 99.99,
        category: testCategory._id.toString()
      };
      
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
    });
    
    it('should validate product data thoroughly', async () => {
      const invalidProduct = {
        name: '', // Empty name
        description: 'Missing name and invalid price',
        price: -10, // Negative price
        category: 'invalid-category-id', // Invalid category ID
        stock: 'not-a-number' // Invalid stock
      };
      
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidProduct);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors.length).to.be.at.least(3); // At least 3 validation errors
      
      // Check specific validation errors
      const errorFields = res.body.errors.map(err => err.param);
      expect(errorFields).to.include.members(['name', 'price', 'category']);
    });
    
    it('should sanitize product data to prevent XSS attacks', async () => {
      const productWithXSS = {
        name: '<script>alert("XSS")</script>Product Name',
        description: 'Description with <img src="x" onerror="alert(\'XSS\')">',
        price: 99.99,
        category: testCategory._id.toString()
      };
      
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productWithXSS);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      
      // Verify sanitization
      expect(res.body.data.name).to.not.include('<script>');
      expect(res.body.data.description).to.not.include('onerror=');
      
      // Clean up created product
      await Product.findByIdAndDelete(res.body.data._id);
    });
  });
  
  // Test update product with enhanced validation and authentication
  describe('PUT /api/products/:id', () => {
    it('should allow admin to update any product', async () => {
      const updateData = {
        name: 'Updated Product Name',
        price: 149.99,
        featured: true
      };
      
      const res = await request(app)
        .put(`/api/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', updateData.name);
      expect(res.body.data).to.have.property('price', updateData.price);
      expect(res.body.data).to.have.property('featured', updateData.featured);
      expect(res.body.data).to.have.property('description', testProduct.description);
      expect(res.body.data).to.have.property('updatedBy', testAdmin._id.toString());
    });
    
    it('should allow seller to update their own products', async () => {
      // Create a product owned by the seller
      const sellerProduct = await Product.create({
        name: 'Seller\'s Product',
        description: 'This product belongs to the seller',
        price: 79.99,
        category: testCategory._id,
        createdBy: testSeller._id
      });
      
      const updateData = {
        name: 'Seller Updated Name',
        price: 89.99
      };
      
      const res = await request(app)
        .put(`/api/products/${sellerProduct._id}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', updateData.name);
      expect(res.body.data).to.have.property('price', updateData.price);
      expect(res.body.data).to.have.property('updatedBy', testSeller._id.toString());
      
      // Clean up
      await Product.findByIdAndDelete(sellerProduct._id);
    });
    
    it('should not allow seller to update products they don\'t own', async () => {
      const updateData = {
        name: 'Unauthorized Update',
        price: 199.99
      };
      
      const res = await request(app)
        .put(`/api/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
    });
    
    it('should not allow regular user to update any product', async () => {
      const updateData = {
        name: 'User Update Attempt',
        price: 199.99
      };
      
      const res = await request(app)
        .put(`/api/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
    });
    
    it('should validate update data', async () => {
      const invalidUpdateData = {
        name: '', // Empty name
        price: -50, // Negative price
        stock: 'not-a-number' // Invalid stock
      };
      
      const res = await request(app)
        .put(`/api/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidUpdateData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
      expect(res.body).to.have.property('errors');
    });
    
    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        name: 'Update Non-existent',
        price: 99.99
      };
      
      const res = await request(app)
        .put(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'RESOURCE_NOT_FOUND');
    });
  });
  
  // Test delete product with enhanced authentication
  describe('DELETE /api/products/:id', () => {
    it('should allow admin to delete any product', async () => {
      const productToDelete = await Product.create({
        name: 'Product to Delete',
        description: 'This product will be deleted',
        price: 59.99,
        category: testCategory._id,
        createdBy: testAdmin._id
      });
      
      const res = await request(app)
        .delete(`/api/products/${productToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('message').that.includes('deleted');
      
      // Verify product is deleted
      const deletedProduct = await Product.findById(productToDelete._id);
      expect(deletedProduct).to.be.null;
    });
    
    it('should not allow seller to delete products', async () => {
      // Even their own products (assuming the business rule is that only admins can delete)
      const sellerProduct = await Product.create({
        name: 'Seller\'s Product',
        description: 'This product belongs to the seller',
        price: 79.99,
        category: testCategory._id,
        createdBy: testSeller._id
      });
      
      const res = await request(app)
        .delete(`/api/products/${sellerProduct._id}`)
        .set('Authorization', `Bearer ${sellerToken}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
      
      // Clean up
      await Product.findByIdAndDelete(sellerProduct._id);
    });
    
    it('should not allow regular user to delete any product', async () => {
      const res = await request(app)
        .delete(`/api/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
      
      // Verify product still exists
      const checkProduct = await Product.findById(testProduct._id);
      expect(checkProduct).to.exist;
    });
    
    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'RESOURCE_NOT_FOUND');
    });
  });
  
  // Test bulk operations with enhanced validation and authentication
  describe('Bulk Operations', () => {
    it('should allow admin to perform bulk updates', async () => {
      // Create multiple test products
      const bulkProducts = [];
      for (let i = 0; i < 3; i++) {
        bulkProducts.push(await Product.create({
          name: `Bulk Product ${i}`,
          description: `Description for bulk product ${i}`,
          price: 50 + i * 10,
          category: testCategory._id,
          featured: false,
          createdBy: testAdmin._id
        }));
      }
      
      const bulkUpdateData = {
        ids: bulkProducts.map(p => p._id.toString()),
        data: {
          featured: true,
          stock: 25
        }
      };
      
      const res = await request(app)
        .put('/api/products/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(bulkUpdateData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('count', 3);
      
      // Verify updates
      for (const product of bulkProducts) {
        const updatedProduct = await Product.findById(product._id);
        expect(updatedProduct.featured).to.be.true;
        expect(updatedProduct.stock).to.equal(25);
      }
      
      // Clean up
      await Product.deleteMany({
        _id: { $in: bulkProducts.map(p => p._id) }
      });
    });
    
    it('should allow admin to perform bulk deletes', async () => {
      // Create multiple test products
      const bulkProducts = [];
      for (let i = 0; i < 3; i++) {
        bulkProducts.push(await Product.create({
          name: `Bulk Delete Product ${i}`,
          description: `Description for bulk delete product ${i}`,
          price: 40 + i * 10,
          category: testCategory._id,
          createdBy: testAdmin._id
        }));
      }
      
      const bulkDeleteData = {
        ids: bulkProducts.map(p => p._id.toString())
      };
      
      const res = await request(app)
        .post('/api/products/bulk-delete')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(bulkDeleteData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('count', 3);
      
      // Verify deletions
      for (const product of bulkProducts) {
        const deletedProduct = await Product.findById(product._id);
        expect(deletedProduct).to.be.null;
      }
    });
    
    it('should validate bulk operation data', async () => {
      const invalidBulkData = {
        ids: 'not-an-array', // Should be an array
        data: {
          price: -10 // Invalid price
        }
      };
      
      const res = await request(app)
        .put('/api/products/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidBulkData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
    });
    
    it('should not allow non-admin users to perform bulk operations', async () => {
      const bulkData = {
        ids: [testProduct._id.toString()],
        data: {
          featured: true
        }
      };
      
      const res = await request(app)
        .put('/api/products/bulk')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(bulkData);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('code', 'AUTH_INSUFFICIENT_PERMISSIONS');
    });
  });
});
