/**
 * Enhanced API service with improved error handling and type safety
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError, ErrorType, createError } from '@/utils/errorHandler';

// API response interface
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle session expiration
        if (error.response && error.response.status === 401) {
          // Clear token if it's an authentication error
          this.clearToken();
          
          // Redirect to login if needed
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            // Store the current path to redirect back after login
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Set authentication token
  setToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearToken(): void {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  // Initialize token from storage
  initializeToken(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.authToken = token;
      }
    }
  }

  // Generic request method with type safety
  private async request<T = any>(
    method: string,
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url,
        ...options
      };

      const response: AxiosResponse<T> = await this.client(config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // GET request
  async get<T = any>(
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('GET', url, options);
  }

  // POST request
  async post<T = any>(
    url: string,
    data?: any,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('POST', url, { ...options, data });
  }

  // PUT request
  async put<T = any>(
    url: string,
    data?: any,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('PUT', url, { ...options, data });
  }

  // PATCH request
  async patch<T = any>(
    url: string,
    data?: any,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('PATCH', url, { ...options, data });
  }

  // DELETE request
  async delete<T = any>(
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>('DELETE', url, options);
  }

  // Upload file
  async uploadFile<T = any>(
    url: string,
    file: File,
    fieldName: string = 'file',
    additionalData: Record<string, any> = {},
    onProgress?: (percentage: number) => void
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      // Add any additional data
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onProgress 
          ? (progressEvent) => {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              onProgress(percentage);
            }
          : undefined
      };
      
      const response = await this.client.post<T>(url, formData, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Download file
  async downloadFile(
    url: string,
    filename?: string,
    options: AxiosRequestConfig = {}
  ): Promise<Blob> {
    try {
      const config: AxiosRequestConfig = {
        ...options,
        responseType: 'blob'
      };
      
      const response = await this.client.get(url, config);
      
      // Create download link and trigger download
      if (filename && typeof window !== 'undefined') {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

// Initialize token from storage
if (typeof window !== 'undefined') {
  apiService.initializeToken();
}

export default apiService;
