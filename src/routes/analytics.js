const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Import models
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const JamDeal = require('../models/JamDeal');

/**
 * @route   GET /api/analytics/overview
 * @desc    Get platform overview statistics
 * @access  Private (Admin)
 */
router.get('/overview', [auth, admin], async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Get order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Get revenue statistics
    const revenueResult = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Get deal statistics
    const totalDeals = await JamDeal.countDocuments();
    const activeDeals = await JamDeal.countDocuments({ status: 'active' });
    
    // Get product statistics
    const totalProducts = await Product.countDocuments({ active: true });
    
    res.json({
      users: {
        total: totalUsers,
        new: newUsers
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders
      },
      revenue: totalRevenue,
      deals: {
        total: totalDeals,
        active: activeDeals
      },
      products: totalProducts
    });
  } catch (err) {
    console.error('Analytics overview error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/analytics/sales
 * @desc    Get sales analytics
 * @access  Private (Admin)
 */
router.get('/sales', [auth, admin], async (req, res) => {
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
    
    // Get payment method breakdown
    const paymentMethods = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $nin: ['cancelled', 'refunded'] }
        } 
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ]);
    
    // Get top products
    const topProducts = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $nin: ['cancelled', 'refunded'] }
        } 
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          count: { $sum: '$items.quantity' },
          total: { $sum: '$items.total' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Populate product details
    const populatedTopProducts = await Promise.all(
      topProducts.map(async (item) => {
        const product = await Product.findById(item._id).lean();
        if (!product) return null;
        
        return {
          product: {
            id: product._id,
            name: product.name,
            price: product.price
          },
          count: item.count,
          total: item.total
        };
      })
    );
    
    // Filter out null values (products that might have been deleted)
    const filteredTopProducts = populatedTopProducts.filter(item => item !== null);
    
    res.json({
      period,
      startDate,
      endDate,
      salesData: formattedSalesData,
      paymentMethods,
      topProducts: filteredTopProducts
    });
  } catch (err) {
    console.error('Sales analytics error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/analytics/deals
 * @desc    Get deals analytics
 * @access  Private (Admin)
 */
router.get('/deals', [auth, admin], async (req, res) => {
  try {
    // Get deals by status
    const dealsByStatus = await JamDeal.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
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
      { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
      { 
        $group: { 
          _id: '$category', 
          name: { $first: { $ifNull: ['$categoryData.name', 'Uncategorized'] } },
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get completion rate
    const totalDeals = await JamDeal.countDocuments({ status: { $in: ['completed', 'expired'] } });
    const completedDeals = await JamDeal.countDocuments({ status: 'completed' });
    const completionRate = totalDeals > 0 ? (completedDeals / totalDeals) * 100 : 0;
    
    // Get average discount
    const discountResult = await JamDeal.aggregate([
      { $group: { _id: null, avgDiscount: { $avg: '$discount' } } }
    ]);
    
    const averageDiscount = discountResult.length > 0 ? discountResult[0].avgDiscount : 0;
    
    // Get top deals by participants
    const topDeals = await JamDeal.find()
      .sort({ currentParticipants: -1 })
      .limit(5)
      .populate('product', 'name price')
      .lean();
    
    res.json({
      dealsByStatus,
      dealsByCategory,
      completionRate,
      averageDiscount,
      topDeals
    });
  } catch (err) {
    console.error('Deals analytics error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/analytics/users
 * @desc    Get user analytics
 * @access  Private (Admin)
 */
router.get('/users', [auth, admin], async (req, res) => {
  try {
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
    
    // Get users by role
    const usersByRole = await User.aggregate([
      { $unwind: '$roles' },
      { $group: { _id: '$roles', count: { $sum: 1 } } }
    ]);
    
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
    
    // Get top users by order count
    const topUsersByOrders = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 }
    ]);
    
    // Populate user details
    const populatedTopUsers = await Promise.all(
      topUsersByOrders.map(async (item) => {
        const user = await User.findById(item._id).select('name email').lean();
        if (!user) return null;
        
        return {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          orderCount: item.orderCount,
          totalSpent: item.totalSpent
        };
      })
    );
    
    // Filter out null values (users that might have been deleted)
    const filteredTopUsers = populatedTopUsers.filter(item => item !== null);
    
    res.json({
      newUsersByMonth: formattedNewUsersByMonth,
      usersByRole,
      activeUsers: activeUsersCount,
      topUsers: filteredTopUsers
    });
  } catch (err) {
    console.error('User analytics error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/analytics/products
 * @desc    Get product analytics
 * @access  Private (Admin)
 */
router.get('/products', [auth, admin], async (req, res) => {
  try {
    // Get products by category
    const productsByCategory = await Product.aggregate([
      { 
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
      { 
        $group: { 
          _id: '$category', 
          name: { $first: { $ifNull: ['$categoryData.name', 'Uncategorized'] } },
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate product details
    const populatedTopProducts = await Promise.all(
      topSellingProducts.map(async (item) => {
        const product = await Product.findById(item._id)
          .populate('category', 'name')
          .lean();
        
        if (!product) return null;
        
        return {
          product: {
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category ? product.category.name : 'Uncategorized'
          },
          quantitySold: item.quantitySold,
          revenue: item.revenue
        };
      })
    );
    
    // Filter out null values (products that might have been deleted)
    const filteredTopProducts = populatedTopProducts.filter(item => item !== null);
    
    // Get low stock products
    const lowStockProducts = await Product.find({ 
      stock: { $lt: 10 },
      active: true
    })
    .select('name stock price category')
    .populate('category', 'name')
    .sort({ stock: 1 })
    .limit(10)
    .lean();
    
    res.json({
      productsByCategory,
      topSellingProducts: filteredTopProducts,
      lowStockProducts
    });
  } catch (err) {
    console.error('Product analytics error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
