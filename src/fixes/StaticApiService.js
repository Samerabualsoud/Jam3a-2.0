// Mock API service for static deployment
// This file provides fallback data and mock implementations for API calls

const mockDeals = [];
const mockProducts = [];
const mockCategories = [
  { _id: "cat1", name: "Electronics", nameAr: "إلكترونيات" },
  { _id: "cat2", name: "Computers", nameAr: "كمبيوترات" },
  { _id: "cat3", name: "Gaming", nameAr: "ألعاب" }
];

// Mock API service
const StaticApiService = {
  // General API methods
  get: async (url) => {
    console.log(`Mock API GET: ${url}`);
    
    // Handle different endpoints
    if (url.includes('/deals')) {
      return { data: mockDeals };
    } else if (url.includes('/products')) {
      return { data: mockProducts };
    } else if (url.includes('/categories')) {
      return { data: mockCategories };
    }
    
    // Default empty response
    return { data: [] };
  },
  
  post: async (url, data) => {
    console.log(`Mock API POST: ${url}`, data);
    return { data: { success: true, message: "Operation successful in demo mode" } };
  },
  
  put: async (url, data) => {
    console.log(`Mock API PUT: ${url}`, data);
    return { data: { success: true, message: "Operation successful in demo mode" } };
  },
  
  delete: async (url) => {
    console.log(`Mock API DELETE: ${url}`);
    return { data: { success: true, message: "Operation successful in demo mode" } };
  }
};

export default StaticApiService;
