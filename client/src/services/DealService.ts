import apiService from '@/services/api';
import { API_BASE_URL } from '@/config';

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
      console.log('Fetching deals from:', `${API_BASE_URL}/deals`);
      const response = await apiService.get('/deals');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw error.message || error;
    }
  },

  /**
   * Fetch featured deals
   * @returns {Promise} Promise object with featured deals data
   */
  fetchFeaturedDeals: async () => {
    try {
      console.log('Fetching featured deals from:', `${API_BASE_URL}/deals/featured`);
      const response = await apiService.get('/deals/featured');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching featured deals:', error);
      throw error.message || error;
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
      
      console.log('Fetching deal by ID from:', `${API_BASE_URL}/deals/${cleanDealId}`);
      const response = await apiService.get(`/deals/${cleanDealId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching deal:', error);
      throw error.message || error;
    }
  },

  /**
   * Fetch products available in a deal's category
   * @param {string} dealId - Deal ID
   * @returns {Promise} Promise object with products data
   */
  fetchDealProducts: async (dealId) => {
    try {
      console.log('Fetching deal products from:', `${API_BASE_URL}/deals/${dealId}/products`);
      const response = await apiService.get(`/deals/${dealId}/products`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching deal products:', error);
      throw error.message || error;
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
      console.log('Joining deal at:', `${API_BASE_URL}/deals/${dealId}/join`);
      const response = await apiService.post(`/deals/${dealId}/join`, data);
      return response.data || response;
    } catch (error) {
      console.error('Error joining deal:', error);
      throw error.message || error;
    }
  },

  /**
   * Create a new deal (admin only)
   * @param {Object} dealData - Deal data
   * @returns {Promise} Promise object with created deal
   */
  createDeal: async (dealData) => {
    try {
      console.log('Creating deal at:', `${API_BASE_URL}/deals`);
      const response = await apiService.post('/deals', dealData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error.message || error;
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
      console.log('Updating deal at:', `${API_BASE_URL}/deals/${dealId}`);
      const response = await apiService.put(`/deals/${dealId}`, dealData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error.message || error;
    }
  },

  /**
   * Delete a deal (admin only)
   * @param {string} dealId - Deal ID
   * @returns {Promise} Promise object with deletion result
   */
  deleteDeal: async (dealId) => {
    try {
      console.log('Deleting deal at:', `${API_BASE_URL}/deals/${dealId}`);
      const response = await apiService.delete(`/deals/${dealId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error.message || error;
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
