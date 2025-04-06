const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const JamDeal = require('../models/JamDeal');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin)
 */
router.get('/dashboard', [auth, admin], async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Get order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    
    // Get revenue statistics
    const revenueResult = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          status: { $nin: ['cancelled', 'refunded'] },
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format monthly revenue
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      revenue: item.total
    }));
    
    // Get deal statistics
    const totalDeals = await JamDeal.countDocuments();
    const activeDeals = await JamDeal.countDocuments({ status: 'active' });
    const completedDeals = await JamDeal.countDocuments({ status: 'completed' });
    
    // Get product statistics
    const totalProducts = await Product.countDocuments({ active: true });
    const totalCategories = await Category.countDocuments();
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();
    
    // Get popular products
    const popularProducts = await Order.aggregate([
      { $unwind: '$items' },
      { 
        $group: { 
          _id: '$items.product', 
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' }
        } 
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    
    // Populate product details
    const populatedPopularProducts = await Promise.all(
      popularProducts.map(async (item) => {
        const product = await Product.findById(item._id).lean();
        return {
          product: {
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category
          },
          totalSold: item.totalSold,
          totalRevenue: item.totalRevenue
        };
      })
    );
    
    res.json({
      users: {
        total: totalUsers,
        new: newUsers
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders
      },
      revenue: {
        total: totalRevenue,
        monthly: formattedMonthlyRevenue
      },
      deals: {
        total: totalDeals,
        active: activeDeals,
        completed: completedDeals
      },
      products: {
        total: totalProducts,
        categories: totalCategories
      },
      recentOrders,
      popularProducts: populatedPopularProducts
    });
  } catch (err) {
    console.error('Admin dashboard error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin)
 */
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (role) {
      filter.roles = role;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const users = await User.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-password -refreshTokens')
      .lean();

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin)
 */
router.put('/users/:id/role', [
  auth,
  admin,
  [
    check('roles', 'Roles are required').isArray({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update roles
    const { roles } = req.body;
    user.roles = roles;
    
    // Update role flags
    user.isAdmin = roles.includes('admin');
    user.isSeller = roles.includes('seller');
    
    await user.save();
    
    res.json({
      msg: 'User roles updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller
      }
    });
  } catch (err) {
    console.error('Update user role error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Activate or deactivate user
 * @access  Private (Admin)
 */
router.put('/users/:id/status', [
  auth,
  admin,
  [
    check('active', 'Active status is required').isBoolean()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Prevent deactivating super admin
    if (user.roles.includes('admin') && !req.body.active) {
      return res.status(400).json({ msg: 'Cannot deactivate admin user' });
    }
    
    // Update active status
    user.active = req.body.active;
    
    await user.save();
    
    res.json({
      msg: `User ${req.body.active ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        active: user.active
      }
    });
  } catch (err) {
    console.error('Update user status error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/admin/analytics/sales
 * @desc    Get sales analytics
 * @access  Private (Admin)
 */
router.get('/analytics/sales', [auth, admin], async (req, res) => {
  try {
    const { period = 'monthly', start, end } = req.query;
    
    // Set date range
    let startDate, endDate, groupBy;
    const now = new Date();
    
    if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      // Default ranges based on period
      switch (period) {
        case 'daily':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
          endDate = now;
          groupBy = { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
          break;
        case 'weekly':
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          endDate = now;
          groupBy = { week: { $week: '$createdAt' }, year: { $year: '$createdAt' } };
          break;
        case 'monthly':
        default:
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
          endDate = now;
          groupBy = { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
          break;
      }
    }
    
    // Get sales data
    const salesData = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $nin: ['cancelled', 'refunded'] }
        } 
      },
      {
        $group: {
          _id: groupBy,
          sales: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ]);
    
    // Format sales data
    let formattedSalesData;
    
    switch (period) {
      case 'daily':
        formattedSalesData = salesData.map(item => ({
          date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
          sales: item.sales,
          count: item.count
        }));
        break;
      case 'weekly':
        formattedSalesData = salesData.map(item => ({
          date: `${item._id.year}-W${item._id.week.toString().padStart(2, '0')}`,
          sales: item.sales,
          count: item.count
        }));
        break;
      case 'monthly':
      default:
        formattedSalesData = salesData.map(item => ({
          date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
          sales: item.sales,
          count: item.count
        }));
        break;
    }
    
    // Get total sales in period
    const totalSales = formattedSalesData.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = formattedSalesData.reduce((sum, item) => sum + item.count, 0);
    
    // Get average order value
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    res.json({
      period,
      startDate,
      endDate,
      totalSales,
      totalOrders,
      averageOrderValue,
      data: formattedSalesData
    });
  } catch (err) {
    console.error('Sales analytics error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/admin/analytics/deals
 * @desc    Get deals analytics
 * @access  Private (Admin)
 */
router.get('/analytics/deals', [auth, admin], async (req, res) => {
  try {
    // Get deals by status
    const dealsByStatus = await JamDeal.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format deals by status
    const formattedDealsByStatus = {};
    dealsByStatus.forEach(item => {
      formattedDealsByStatus[item._id] = item.count;
    });
    
    // Get deals by category
    const dealsByCategory = await JamDeal.aggregate([
      { 
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      { $unwind: '$categoryData' },
      { 
        $group: { 
          _id: '$category', 
          name: { $first: '$categoryData.name' },
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get average discount
    const discountResult = await JamDeal.aggregate([
      { $group: { _id: null, avgDiscount: { $avg: '$discount' } } }
    ]);
    
    const averageDiscount = discountResult.length > 0 ? discountResult[0].avgDiscount : 0;
    
    // Get average participants
    const participantsResult = await JamDeal.aggregate([
      { $group: { _id: null, avgParticipants: { $avg: '$currentParticipants' } } }
    ]);
    
    const averageParticipants = participantsResult.length > 0 ? participantsResult[0].avgParticipants : 0;
    
    // Get completion rate
    const totalDeals = await JamDeal.countDocuments({ status: { $in: ['completed', 'expired'] } });
    const completedDeals = await JamDeal.countDocuments({ status: 'completed' });
    const completionRate = totalDeals > 0 ? (completedDeals / totalDeals) * 100 : 0;
    
    res.json({
      dealsByStatus: formattedDealsByStatus,
      dealsByCategory,
      averageDiscount,
      averageParticipants,
      completionRate,
      totalDeals: await JamDeal.countDocuments(),
      activeDeals: await JamDeal.countDocuments({ status: 'active' })
    });
  } catch (err) {
    console.error('Deals analytics error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/admin/analytics/users
 * @desc    Get user analytics
 * @access  Private (Admin)
 */
router.get('/analytics/users', [auth, admin], async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get users by role
    const usersByRole = await User.aggregate([
      { $unwind: '$roles' },
      { $group: { _id: '$roles', count: { $sum: 1 } } }
    ]);
    
    // Format users by role
    const formattedUsersByRole = {};
    usersByRole.forEach(item => {
      formattedUsersByRole[item._id] = item.count;
    });
    
    // Get new users by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const newUsersByMonth = await User.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format new users by month
    const formattedNewUsersByMonth = newUsersByMonth.map(item => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      count: item.count
    }));
    
    // Get active users (users who placed orders in the last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const activeUsers = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      { $group: { _id: '$user' } },
      { $count: 'activeUsers' }
    ]);
    
    const activeUsersCount = activeUsers.length > 0 ? activeUsers[0].activeUsers : 0;
    
    res.json({
      totalUsers,
      usersByRole: formattedUsersByRole,
      newUsersByMonth: formattedNewUsersByMonth,
      activeUsers: activeUsersCount,
      activeUsersPercentage: totalUsers > 0 ? (activeUsersCount / totalUsers) * 100 : 0
    });
  } catch (err) {
    console.error('User analytics error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
