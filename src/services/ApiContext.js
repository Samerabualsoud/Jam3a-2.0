// Context provider for API integration
import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from './ApiService';

// Create context
const ApiContext = createContext(null);

// Provider component
export const ApiProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Products state
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  
  // Deals state
  const [deals, setDeals] = useState([]);
  const [dealDetails, setDealDetails] = useState(null);
  
  // Analytics state
  const [analyticsConfig, setAnalyticsConfig] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Clear error helper
  const clearError = () => setError(null);
  
  // Load products
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.getProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading products');
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load deals
  const loadDeals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.getDeals();
      setDeals(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading deals');
      console.error('Error loading deals:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load analytics config
  const loadAnalyticsConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.getAnalyticsConfig();
      setAnalyticsConfig(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading analytics config');
      console.error('Error loading analytics config:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load analytics data
  const loadAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.getAnalyticsData();
      setAnalyticsData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading analytics data');
      console.error('Error loading analytics data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get product details
  const getProduct = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.getProduct(id);
      setProductDetails(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading product details');
      console.error('Error loading product details:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get deal details
  const getDeal = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.getDeal(id);
      setDealDetails(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading deal details');
      console.error('Error loading deal details:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create product
  const createProduct = async (productData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.createProduct(productData);
      // Refresh products list
      await loadProducts();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating product');
      console.error('Error creating product:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create deal
  const createDeal = async (dealData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.createDeal(dealData);
      // Refresh deals list
      await loadDeals();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating deal');
      console.error('Error creating deal:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Join deal
  const joinDeal = async (dealId, userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.joinDeal(dealId, userData);
      // Refresh deal details
      await getDeal(dealId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error joining deal');
      console.error('Error joining deal:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update analytics config
  const updateAnalyticsConfig = async (configData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.updateAnalyticsConfig(configData);
      setAnalyticsConfig(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating analytics config');
      console.error('Error updating analytics config:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const contextValue = {
    // State
    products,
    productDetails,
    deals,
    dealDetails,
    analyticsConfig,
    analyticsData,
    isLoading,
    error,
    
    // Methods
    loadProducts,
    loadDeals,
    loadAnalyticsConfig,
    loadAnalyticsData,
    getProduct,
    getDeal,
    createProduct,
    createDeal,
    joinDeal,
    updateAnalyticsConfig,
    clearError,
    
    // Direct API access
    api: ApiService
  };
  
  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook for using the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext;
