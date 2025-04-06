const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config/config');

// Initialize Express app
const app = express();

// Security middleware
// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors(config.cors));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan(config.logging.format));

// Trust proxy for secure cookies in production
if (config.server.env === 'production') {
  app.set('trust proxy', 1);
}

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/moyasser', require('./routes/moyasser'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Jam3a API',
    version: '1.0.0',
    status: 'online',
    environment: config.server.env,
    documentation: '/api/docs'
  });
});

// API Documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    apiName: 'Jam3a Platform API',
    version: '1.0.0',
    description: 'API for the Jam3a group buying platform',
    baseUrl: config.server.apiUrl,
    endpoints: {
      auth: {
        register: { method: 'POST', path: '/api/auth/register', description: 'Register a new user' },
        login: { method: 'POST', path: '/api/auth/login', description: 'Login a user' },
        me: { method: 'GET', path: '/api/auth/me', description: 'Get current user' },
        refresh: { method: 'POST', path: '/api/auth/refresh', description: 'Refresh access token' },
        logout: { method: 'POST', path: '/api/auth/logout', description: 'Logout a user' }
      },
      products: {
        getAll: { method: 'GET', path: '/api/products', description: 'Get all products' },
        getById: { method: 'GET', path: '/api/products/:id', description: 'Get product by ID' },
        create: { method: 'POST', path: '/api/products', description: 'Create a new product' },
        update: { method: 'PUT', path: '/api/products/:id', description: 'Update a product' },
        delete: { method: 'DELETE', path: '/api/products/:id', description: 'Delete a product' },
        featured: { method: 'GET', path: '/api/products/featured/list', description: 'Get featured products' },
        search: { method: 'GET', path: '/api/products/search/:query', description: 'Search products' }
      },
      categories: {
        getAll: { method: 'GET', path: '/api/categories', description: 'Get all categories' },
        getById: { method: 'GET', path: '/api/categories/:id', description: 'Get category by ID' },
        create: { method: 'POST', path: '/api/categories', description: 'Create a new category' },
        update: { method: 'PUT', path: '/api/categories/:id', description: 'Update a category' },
        delete: { method: 'DELETE', path: '/api/categories/:id', description: 'Delete a category' },
        getProducts: { method: 'GET', path: '/api/categories/:id/products', description: 'Get products by category' },
        featured: { method: 'GET', path: '/api/categories/featured/list', description: 'Get featured categories' }
      },
      deals: {
        getAll: { method: 'GET', path: '/api/deals', description: 'Get all deals' },
        getById: { method: 'GET', path: '/api/deals/:id', description: 'Get deal by ID' },
        create: { method: 'POST', path: '/api/deals', description: 'Create a new deal' },
        update: { method: 'PUT', path: '/api/deals/:id', description: 'Update a deal' },
        join: { method: 'POST', path: '/api/deals/:id/join', description: 'Join a deal' },
        leave: { method: 'POST', path: '/api/deals/:id/leave', description: 'Leave a deal' },
        active: { method: 'GET', path: '/api/deals/active', description: 'Get active deals' },
        userDeals: { method: 'GET', path: '/api/deals/user', description: 'Get deals for current user' }
      },
      orders: {
        getAll: { method: 'GET', path: '/api/orders', description: 'Get all orders (admin)' },
        getById: { method: 'GET', path: '/api/orders/:id', description: 'Get order by ID' },
        create: { method: 'POST', path: '/api/orders', description: 'Create a new order' },
        updateStatus: { method: 'PUT', path: '/api/orders/:id/status', description: 'Update order status' },
        cancel: { method: 'PUT', path: '/api/orders/:id/cancel', description: 'Cancel an order' },
        userOrders: { method: 'GET', path: '/api/orders/user', description: 'Get orders for current user' },
        stats: { method: 'GET', path: '/api/orders/stats/summary', description: 'Get order statistics' }
      },
      payments: {
        methods: { method: 'GET', path: '/api/payments/methods', description: 'Get available payment methods' },
        process: { method: 'POST', path: '/api/payments/process', description: 'Process a payment' },
        verify: { method: 'POST', path: '/api/payments/verify', description: 'Verify a payment' }
      },
      moyasser: {
        create: { method: 'POST', path: '/api/moyasser/create', description: 'Create a Moyasser payment' },
        verify: { method: 'POST', path: '/api/moyasser/verify', description: 'Verify a Moyasser payment' },
        refund: { method: 'POST', path: '/api/moyasser/refund', description: 'Refund a Moyasser payment' },
        webhook: { method: 'POST', path: '/api/moyasser/webhook', description: 'Handle Moyasser webhook events' },
        config: { method: 'GET', path: '/api/moyasser/config', description: 'Get Moyasser payment form configuration' }
      },
      admin: {
        dashboard: { method: 'GET', path: '/api/admin/dashboard', description: 'Get admin dashboard statistics' },
        users: { method: 'GET', path: '/api/admin/users', description: 'Get all users with pagination and filtering' },
        updateUserRole: { method: 'PUT', path: '/api/admin/users/:id/role', description: 'Update user role' },
        updateUserStatus: { method: 'PUT', path: '/api/admin/users/:id/status', description: 'Activate or deactivate user' },
        salesAnalytics: { method: 'GET', path: '/api/admin/analytics/sales', description: 'Get sales analytics' },
        dealsAnalytics: { method: 'GET', path: '/api/admin/analytics/deals', description: 'Get deals analytics' },
        usersAnalytics: { method: 'GET', path: '/api/admin/analytics/users', description: 'Get user analytics' }
      },
      notifications: {
        testEmail: { method: 'POST', path: '/api/notifications/test-email', description: 'Send a test email (admin)' },
        welcome: { method: 'POST', path: '/api/notifications/welcome', description: 'Send welcome email to user (admin)' },
        orderConfirmation: { method: 'POST', path: '/api/notifications/order-confirmation', description: 'Send order confirmation email' },
        dealJoin: { method: 'POST', path: '/api/notifications/deal-join', description: 'Send deal join confirmation email' },
        dealCompletion: { method: 'POST', path: '/api/notifications/deal-completion', description: 'Send deal completion notification to all participants' },
        orderStatusUpdate: { method: 'POST', path: '/api/notifications/order-status-update', description: 'Send order status update email' },
        passwordReset: { method: 'POST', path: '/api/notifications/password-reset', description: 'Send password reset email' },
        waitingList: { method: 'POST', path: '/api/notifications/waiting-list', description: 'Send waiting list notification' }
      },
      analytics: {
        overview: { method: 'GET', path: '/api/analytics/overview', description: 'Get platform overview statistics' },
        sales: { method: 'GET', path: '/api/analytics/sales', description: 'Get sales analytics' },
        deals: { method: 'GET', path: '/api/analytics/deals', description: 'Get deals analytics' },
        users: { method: 'GET', path: '/api/analytics/users', description: 'Get user analytics' },
        products: { method: 'GET', path: '/api/analytics/products', description: 'Get product analytics' }
      }
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Customize error response based on environment
  const error = {
    message: err.message || 'Something went wrong!',
    status: err.statusCode || 500,
    error: config.server.env === 'production' ? {} : err
  };
  
  res.status(error.status).json(error);
});

module.exports = app;
