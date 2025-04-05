import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the base API URL - this should be updated based on your deployment environment
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.jam3a.com/api' // Production URL
  : 'http://localhost:5000/api'; // Development URL

// Interface for API error responses
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// API service class for handling HTTP requests
class ApiService {
  private api: AxiosInstance;
  
  constructor() {
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          // Clear token and redirect to login if unauthorized
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        
        // Format error response
        const errorResponse: ApiErrorResponse = {
          message: error.response?.data?.message || 'An unexpected error occurred',
          errors: error.response?.data?.errors,
          status: error.response?.status
        };
        
        return Promise.reject(errorResponse);
      }
    );
  }
  
  // Generic GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }
  
  // Generic POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }
  
  // Generic PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }
  
  // Generic PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config);
    return response.data;
  }
  
  // Generic DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }
  
  // Upload file(s)
  async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response: AxiosResponse<T> = await this.api.post(url, formData, uploadConfig);
    return response.data;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
