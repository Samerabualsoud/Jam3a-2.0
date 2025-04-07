import axios from 'axios';
import { API_BASE_URL } from './api';

/**
 * Deal Service
 * Handles API requests related to category-based Jam3a deals
 */
const DealService = {
  /**
   * Fetch all active deals
   * @returns {Promise} Promise object with deals data
   */
  fetchDeals: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deals`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch featured deals
   * @returns {Promise} Promise object with featured deals data
   */
  fetchFeaturedDeals: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deals/featured`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching featured deals:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch deal by ID
   * @param {string} dealId - Deal ID
   * @returns {Promise} Promise object with deal data
   */
  fetchDealById: async (dealId) => {
    try {
      // Extract the numeric ID part before any special characters like colon
      const cleanDealId = dealId.toString().split(':')[0];
      
      const response = await axios.get(`${API_BASE_URL}/deals/${cleanDealId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching deal:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch products available in a deal's category
   * @param {string} dealId - Deal ID
   * @returns {Promise} Promise object with products data
   */
  fetchDealProducts: async (dealId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deals/${dealId}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deal products:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Join a deal with selected product
   * @param {string} dealId - Deal ID
   * @param {Object} data - Join deal data including product selection
   * @returns {Promise} Promise object with join result
   */
  joinDeal: async (dealId, data) => {
    try {
      const token = localStorage.getItem('jam3a_token');
      const response = await axios.post(
        `${API_BASE_URL}/deals/${dealId}/join`, 
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error joining deal:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new deal (admin only)
   * @param {Object} dealData - Deal data
   * @returns {Promise} Promise object with created deal
   */
  createDeal: async (dealData) => {
    try {
      const token = localStorage.getItem('jam3a_token');
      const response = await axios.post(
        `${API_BASE_URL}/deals`, 
        dealData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update an existing deal (admin only)
   * @param {string} dealId - Deal ID
   * @param {Object} dealData - Updated deal data
   * @returns {Promise} Promise object with updated deal
   */
  updateDeal: async (dealId, dealData) => {
    try {
      const token = localStorage.getItem('jam3a_token');
      const response = await axios.put(
        `${API_BASE_URL}/deals/${dealId}`, 
        dealData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a deal (admin only)
   * @param {string} dealId - Deal ID
   * @returns {Promise} Promise object with deletion result
   */
  deleteDeal: async (dealId) => {
    try {
      const token = localStorage.getItem('jam3a_token');
      const response = await axios.delete(
        `${API_BASE_URL}/deals/${dealId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error.response?.data || error.message;
    }
  }
};

export const {
  fetchDeals,
  fetchFeaturedDeals,
  fetchDealById,
  fetchDealProducts,
  joinDeal,
  createDeal,
  updateDeal,
  deleteDeal
} = DealService;

export default DealService;
