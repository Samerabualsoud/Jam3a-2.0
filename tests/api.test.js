const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const jwt = require('jsonwebtoken');

// Mock user for testing
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Mock admin user for testing
const testAdmin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  isAdmin: true,
  roles: ['user', 'admin']
};

// Mock product for testing
const testProduct = {
  name: 'Test Product',
  nameAr: 'منتج اختبار',
  category: 'Electronics',
  price: 999,
  stock: 10,
  description: 'This is a test product',
  image: 'test-image.jpg',
  status: 'active'
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id } },
    process.env.JWT_SECRET || 'jwtSecret',
    { expiresIn: '1h' }
  );
};

describe('API Tests', () => {
  let userToken;
  let adminToken;
  let userId;
  let adminId;
  let productId;

  // Before all tests, set up the database
  beforeAll(async () => {
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jam3a_test');
    }

    // Clear test collections
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create test users
    const user = new User(testUser);
    await user.save();
    userId = user._id;
    userToken = generateToken(user);

    const admin = new User(testAdmin);
    await admin.save();
    adminId = admin._id;
    adminToken = generateToken(admin);

    // Create test product
    const product = new Product({
      ...testProduct,
      createdBy: adminId
    });
    await product.save();
    productId = product._id;
  });

  // After all tests, clean up
  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  // Auth routes tests
  describe('Auth Routes', () => {
    test('POST /api/auth/register - Register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    test('POST /api/auth/login - Login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    test('POST /api/auth/login - Reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });
  });

  // Product routes tests
  describe('Product Routes', () => {
    test('GET /api/products - Get all products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('products');
      expect(res.body.products).toBeInstanceOf(Array);
    });

    test('GET /api/products/:id - Get product by ID', async () => {
      const res = await request(app).get(`/api/products/${productId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', productId.toString());
      expect(res.body).toHaveProperty('name', testProduct.name);
    });

    test('POST /api/products - Create product (admin only)', async () => {
      const newProduct = {
        name: 'New Test Product',
        category: 'Electronics',
        price: 1299,
        stock: 5,
        description: 'This is a new test product'
      };

      const res = await request(app)
        .post('/api/products')
        .set('x-auth-token', adminToken)
        .send(newProduct);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', newProduct.name);
      expect(res.body).toHaveProperty('price', newProduct.price);
    });

    test('PUT /api/products/:id - Update product (admin only)', async () => {
      const updateData = {
        price: 899,
        stock: 15
      };

      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('x-auth-token', adminToken)
        .send(updateData);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('price', updateData.price);
      expect(res.body).toHaveProperty('stock', updateData.stock);
    });
  });

  // Moyasser payment tests (mocked)
  describe('Moyasser Payment Routes', () => {
    test('POST /api/moyasser/create-payment - Create payment', async () => {
      // This test would normally interact with the Moyasser API
      // For testing purposes, we'll mock the response
      
      // First create an order to reference
      const orderRes = await request(app)
        .post('/api/orders')
        .set('x-auth-token', userToken)
        .send({
          userId: userId,
          products: [
            {
              productId: productId,
              quantity: 1
            }
          ],
          shippingAddress: {
            name: 'Test User',
            address: '123 Test St',
            city: 'Test City',
            country: 'Test Country',
            phone: '1234567890'
          }
        });
      
      expect(orderRes.statusCode).toEqual(200);
      const orderId = orderRes.body._id;
      
      // Now create a payment for this order
      const paymentRes = await request(app)
        .post('/api/moyasser/create-payment')
        .set('x-auth-token', userToken)
        .send({
          userId: userId,
          orderId: orderId,
          amount: 899,
          currency: 'SAR',
          description: 'Test payment',
          source: 'credit_card'
        });
      
      // In a real test, we'd check the actual response
      // Here we're just checking that the route works
      expect(paymentRes.statusCode).toEqual(200);
      expect(paymentRes.body).toHaveProperty('payment');
      expect(paymentRes.body).toHaveProperty('moyasserPaymentUrl');
    });
  });
});
