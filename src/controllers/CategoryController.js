// CategoryController.js
const Category = require('../models/Category');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

/**
 * Category Controller
 * Handles API requests related to product categories
 */
const CategoryController = {
  /**
   * Get all categories
   * @route GET /api/categories
   * @access Public
   */
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({ active: true })
        .sort({ name: 1 })
        .select('name nameAr description descriptionAr image slug');
      
      res.json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching categories',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Get category by ID
   * @route GET /api/categories/:id
   * @access Public
   */
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id)
        .populate({
          path: 'subcategories',
          select: 'name nameAr image slug'
        });
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Get products by category ID
   * @route GET /api/categories/:id/products
   * @access Public
   */
  getProductsByCategory: async (req, res) => {
    try {
      const products = await Product.find({ 
        category: req.params.id,
        status: 'active',
        stock: { $gt: 0 }
      }).sort({ featured: -1, price: 1 });
      
      res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Create new category
   * @route POST /api/categories
   * @access Private (Admin)
   */
  createCategory: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const newCategory = new Category({
        name: req.body.name,
        nameAr: req.body.nameAr,
        description: req.body.description,
        descriptionAr: req.body.descriptionAr,
        image: req.body.image,
        active: req.body.active !== undefined ? req.body.active : true,
        parentCategory: req.body.parentCategory || null
      });

      const savedCategory = await newCategory.save();
      
      res.status(201).json({
        success: true,
        data: savedCategory
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Update category
   * @route PUT /api/categories/:id
   * @access Private (Admin)
   */
  updateCategory: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: updatedCategory
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Delete category
   * @route DELETE /api/categories/:id
   * @access Private (Admin)
   */
  deleteCategory: async (req, res) => {
    try {
      // Check if category has products
      const productCount = await Product.countDocuments({ category: req.params.id });
      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category with associated products'
        });
      }

      // Check if category has subcategories
      const subcategoryCount = await Category.countDocuments({ parentCategory: req.params.id });
      if (subcategoryCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category with subcategories'
        });
      }

      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      
      if (!deletedCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while deleting category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = CategoryController;
