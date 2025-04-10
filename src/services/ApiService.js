// API service for connecting to backend
import axios from 'axios';

// Create base API instance
const API_BASE_URL = 'http://5000-io1ygyougg0tolkf491jf-8ca236b0.manus.computer/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jam3a_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('jam3a_token');
        // Redirect to login if needed
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('API Request Error:', error.request);
    } else {
      // Error in setting up the request
      console.error('API Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service methods
const ApiService = {
  // Products
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Deals
  getDeals: () => api.get('/deals'),
  getDeal: (id) => api.get(`/deals/${id}`),
  createDeal: (data) => api.post('/deals', data),
  updateDeal: (id, data) => api.put(`/deals/${id}`, data),
  deleteDeal: (id) => api.delete(`/deals/${id}`),
  joinDeal: (id, userData) => api.post(`/deals/${id}/join`, userData),
  
  // Analytics
  getAnalyticsConfig: () => api.get('/analytics/config'),
  updateAnalyticsConfig: (data) => api.put('/analytics/config', data),
  getAnalyticsData: () => api.get('/analytics/data'),
  
  // Authentication
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getCurrentUser: () => api.get('/users/me'),
  
  // Email
  sendContactEmail: (data) => api.post('/email/contact', data),
};

export default ApiService;
