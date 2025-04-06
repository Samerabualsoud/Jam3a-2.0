// JamDealController.js
const JamDeal = require('../models/JamDeal');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

/**
 * Jam3a Deal Controller
 * Handles API requests related to category-based Jam3a deals
 */
const JamDealController = {
  /**
   * Get all active Jam3a deals
   * @route GET /api/deals
   * @access Public
   */
  getAllDeals: async (req, res) => {
    try {
      const deals = await JamDeal.find({ status: 'active' })
        .populate('category', 'name nameAr image')
        .sort({ featured: -1, createdAt: -1 });
      
      res.json({
        success: true,
        count: deals.length,
        data: deals
      });
    } catch (error) {
      console.error('Error fetching Jam3a deals:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching deals',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Get featured Jam3a deals
   * @route GET /api/deals/featured
   * @access Public
   */
  getFeaturedDeals: async (req, res) => {
    try {
      const deals = await JamDeal.find({ 
        status: 'active',
        featured: true
      })
        .populate('category', 'name nameAr image')
        .limit(4)
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: deals.length,
        data: deals
      });
    } catch (error) {
      console.error('Error fetching featured Jam3a deals:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching featured deals',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Get Jam3a deal by ID
   * @route GET /api/deals/:id
   * @access Public
   */
  getDealById: async (req, res) => {
    try {
      const deal = await JamDeal.findById(req.params.id)
        .populate('category', 'name nameAr description descriptionAr image')
        .populate('products.product');
      
      if (!deal) {
        return res.status(404).json({
          success: false,
          message: 'Jam3a deal not found'
        });
      }

      res.json({
        success: true,
        data: deal
      });
    } catch (error) {
      console.error('Error fetching Jam3a deal:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching deal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Get products available in a Jam3a deal
   * @route GET /api/deals/:id/products
   * @access Public
   */
  getDealProducts: async (req, res) => {
    try {
      const deal = await JamDeal.findById(req.params.id)
        .populate('products.product');
      
      if (!deal) {
        return res.status(404).json({
          success: false,
          message: 'Jam3a deal not found'
        });
      }

      // Get all products in the deal's category that are in stock
      const categoryProducts = await Product.find({
        category: deal.category,
        status: 'active',
        stock: { $gt: 0 }
      }).sort({ price: 1 });
      
      res.json({
        success: true,
        count: categoryProducts.length,
        data: categoryProducts,
        dealProducts: deal.products
      });
    } catch (error) {
      console.error('Error fetching deal products:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching deal products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Create new Jam3a deal
   * @route POST /api/deals
   * @access Private (Admin)
   */
  createDeal: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      // Verify category exists
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Create deal with title based on category
      const newDeal = new JamDeal({
        category: req.body.category,
        title: req.body.title || `${category.name} Jam3a Deal`,
        titleAr: req.body.titleAr || `صفقة جمعة ${category.nameAr || category.name}`,
        description: req.body.description,
        descriptionAr: req.body.descriptionAr,
        discount: req.body.discount,
        maxParticipants: req.body.maxParticipants,
        minParticipants: req.body.minParticipants || 2,
        endDate: req.body.endDate,
        status: req.body.status || 'active',
        featured: req.body.featured || false,
        image: req.body.image || category.image,
        products: []
      });

      // Add products from the category to the deal
      if (req.body.products && Array.isArray(req.body.products)) {
        for (const productId of req.body.products) {
          const product = await Product.findById(productId);
          if (product && product.category.toString() === req.body.category) {
            newDeal.products.push({
              product: productId,
              selectedCount: 0
            });
          }
        }
      } else {
        // If no products specified, add all active products from the category
        const categoryProducts = await Product.find({
          category: req.body.category,
          status: 'active'
        });
        
        for (const product of categoryProducts) {
          newDeal.products.push({
            product: product._id,
            selectedCount: 0
          });
        }
      }

      const savedDeal = await newDeal.save();
      
      res.status(201).json({
        success: true,
        data: savedDeal
      });
    } catch (error) {
      console.error('Error creating Jam3a deal:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating deal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Update Jam3a deal
   * @route PUT /api/deals/:id
   * @access Private (Admin)
   */
  updateDeal: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      // If category is being updated, update title accordingly
      if (req.body.category) {
        const category = await Category.findById(req.body.category);
        if (!category) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }
        
        // Only update title if not explicitly provided
        if (!req.body.title) {
          req.body.title = `${category.name} Jam3a Deal`;
        }
        if (!req.body.titleAr) {
          req.body.titleAr = `صفقة جمعة ${category.nameAr || category.name}`;
        }
      }

      const updatedDeal = await JamDeal.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      if (!updatedDeal) {
        return res.status(404).json({
          success: false,
          message: 'Jam3a deal not found'
        });
      }

      res.json({
        success: true,
        data: updatedDeal
      });
    } catch (error) {
      console.error('Error updating Jam3a deal:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating deal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Delete Jam3a deal
   * @route DELETE /api/deals/:id
   * @access Private (Admin)
   */
  deleteDeal: async (req, res) => {
    try {
      const deletedDeal = await JamDeal.findByIdAndDelete(req.params.id);
      
      if (!deletedDeal) {
        return res.status(404).json({
          success: false,
          message: 'Jam3a deal not found'
        });
      }

      res.json({
        success: true,
        message: 'Jam3a deal deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting Jam3a deal:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while deleting deal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Join a Jam3a deal with a specific product
   * @route POST /api/deals/:id/join
   * @access Private
   */
  joinDeal: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const deal = await JamDeal.findById(req.params.id);
      
      if (!deal) {
        return res.status(404).json({
          success: false,
          message: 'Jam3a deal not found'
        });
      }

      // Check if deal is active
      if (deal.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `This Jam3a deal is ${deal.status}`
        });
      }

      // Check if deal is full
      if (deal.currentParticipants >= deal.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'This Jam3a deal is already full'
        });
      }

      // Check if end date has passed
      if (new Date() > deal.endDate) {
        return res.status(400).json({
          success: false,
          message: 'This Jam3a deal has expired'
        });
      }

      // Validate product is in the deal's category
      const productId = req.body.productId;
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      if (product.category.toString() !== deal.category.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Product does not belong to this deal\'s category'
        });
      }

      // Check if product is in stock
      if (product.stock <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Product is out of stock'
        });
      }

      // Update deal with new participant and selected product
      let productFound = false;
      for (let i = 0; i < deal.products.length; i++) {
        if (deal.products[i].product.toString() === productId) {
          deal.products[i].selectedCount += 1;
          productFound = true;
          break;
        }
      }

      // If product not in deal products array, add it
      if (!productFound) {
        deal.products.push({
          product: productId,
          selectedCount: 1
        });
      }

      // Increment participant count
      deal.currentParticipants += 1;
      
      // Save updated deal
      await deal.save();

      // Decrement product stock
      product.stock -= 1;
      await product.save();

      res.json({
        success: true,
        message: 'Successfully joined the Jam3a deal',
        data: {
          deal: deal,
          product: product
        }
      });
    } catch (error) {
      console.error('Error joining Jam3a deal:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while joining deal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = JamDealController;
