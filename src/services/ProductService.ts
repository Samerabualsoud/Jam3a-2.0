import apiService from './api';
import { Product } from '../types/product';

// Interface for product query parameters
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'inactive' | 'draft';
}

// Interface for product creation/update
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  additionalImages?: string[];
  featured?: boolean;
  status?: 'active' | 'inactive' | 'draft';
  stock?: number;
  tags?: string[];
  specifications?: Record<string, string>;
  supplier?: string;
  sku?: string;
}

// Product service for handling product-related API calls
class ProductService {
  private baseUrl = '/products';
  
  // Get all products with optional filtering
  async getProducts(params?: ProductQueryParams): Promise<{ products: Product[], total: number, pages: number }> {
    return apiService.get(this.baseUrl, { params });
  }
  
  // Get featured products
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    return apiService.get(`${this.baseUrl}/featured`, { params: { limit } });
  }
  
  // Get products by category
  async getProductsByCategory(category: string, params?: ProductQueryParams): Promise<{ products: Product[], total: number, pages: number }> {
    return apiService.get(`${this.baseUrl}/category/${category}`, { params });
  }
  
  // Get a single product by ID
  async getProduct(id: string): Promise<Product> {
    return apiService.get(`${this.baseUrl}/${id}`);
  }
  
  // Create a new product
  async createProduct(product: ProductInput): Promise<Product> {
    return apiService.post(this.baseUrl, product);
  }
  
  // Update an existing product
  async updateProduct(id: string, product: Partial<ProductInput>): Promise<Product> {
    return apiService.put(`${this.baseUrl}/${id}`, product);
  }
  
  // Delete a product
  async deleteProduct(id: string): Promise<{ success: boolean, message: string }> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }
  
  // Upload product image
  async uploadProductImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiService.uploadFile(`${this.baseUrl}/upload-image`, formData);
  }
  
  // Bulk operations
  async bulkUpdateProducts(ids: string[], updates: Partial<ProductInput>): Promise<{ success: boolean, count: number }> {
    return apiService.put(`${this.baseUrl}/bulk`, { ids, updates });
  }
  
  async bulkDeleteProducts(ids: string[]): Promise<{ success: boolean, count: number }> {
    return apiService.post(`${this.baseUrl}/bulk-delete`, { ids });
  }
  
  // Import products from CSV/JSON
  async importProducts(file: File): Promise<{ success: boolean, count: number, errors?: any[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiService.uploadFile(`${this.baseUrl}/import`, formData);
  }
  
  // Export products to CSV/JSON
  async exportProducts(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiService.get(`${this.baseUrl}/export`, { 
      params: { format },
      responseType: 'blob'
    });
    return response as unknown as Blob;
  }
}

// Create and export a singleton instance
const productService = new ProductService();
export default productService;
