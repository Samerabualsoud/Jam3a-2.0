import axios from 'axios';
import { API_BASE_URL } from './api';

/**
 * Category Service
 * Handles API requests related to product categories
 */
const CategoryService = {
  /**
   * Fetch all active categories
   * @returns {Promise} Promise object with categories data
   */
  fetchCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise} Promise object with category data
   */
  fetchCategoryById: async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch products by category ID
   * @param {string} categoryId - Category ID
   * @returns {Promise} Promise object with products data
   */
  fetchProductsByCategory: async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/products`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new category (admin only)
   * @param {Object} categoryData - Category data
   * @returns {Promise} Promise object with created category
   */
  createCategory: async (categoryData) => {
    try {
      const token = localStorage.getItem('jam3a_token');
      const response = await axios.post(
        `${API_BASE_URL}/categories`, 
        categoryData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update an existing category (admin only)
   * @param {string} categoryId - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} Promise object with updated category
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const token = localStorage.getItem('jam3a_token');
      const response = await axios.put(
        `${API_BASE_URL}/categories/${categoryId}`, 
        categoryData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a category (admin only)
   * @param {string} categoryId - Category ID
   * @returns {Promise} Promise object with deletion result
   */
  deleteCategory: async (categoryId) => {
    try {
      const token = localStorage.getItem('jam3a_token');
      const response = await axios.delete(
        `${API_BASE_URL}/categories/${categoryId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error.response?.data || error.message;
    }
  }
};

export const {
  fetchCategories,
  fetchCategoryById,
  fetchProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = CategoryService;

export default CategoryService;
