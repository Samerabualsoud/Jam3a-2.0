import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';
import { API_BASE_URL } from '@/config';

// Define the Product type
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
    nameAr?: string;
  };
  price: number;
  stock?: number;
  sku?: string;
  featured: boolean;
  currentAmount?: number;
  targetAmount?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Define the Deal type
export interface Deal {
  _id: string;
  jam3aId: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: {
    _id: string;
    name: string;
    nameAr?: string;
  };
  regularPrice: number;
  jam3aPrice: number;
  discountPercentage: number;
  currentParticipants: number;
  maxParticipants: number;
  timeRemaining: string;
  expiryDate: string;
  featured: boolean;
  image?: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Define the sync log type
export interface SyncLog {
  id: number;
  action: 'create' | 'update' | 'delete' | 'bulk' | 'import' | 'export';
  details: string;
  status: 'success' | 'error' | 'warning';
  products: string[];
  timestamp: number;
}

// Define the sync status type
export interface SyncStatus {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

// Define the context type
export interface ProductContextType {
  products: Product[];
  deals: Deal[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  refreshProducts: () => Promise<void>;
  activeJam3aDeals: Deal[];
  featuredProducts: Product[];
  syncStatus: SyncStatus | null;
  isLoading: boolean;
  refreshJam3aDeals: () => Promise<void>;
  syncLogs: SyncLog[];
  addProduct: (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  bulkUpdateProducts: (ids: string[], data: Partial<Product>) => Promise<number>;
  bulkDeleteProducts: (ids: string[]) => Promise<number>;
  importProducts: (products: Omit<Product, '_id'>[]) => Promise<number>;
  exportProducts: (ids?: string[]) => Promise<Product[]>;
  validateProduct: (product: Partial<Product>) => string[];
  clearSyncStatus: () => void;
}

// Create the context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Define the provider props
interface ProductProviderProps {
  children: ReactNode;
}

// Sample products data for fallback
const SAMPLE_PRODUCTS: Product[] = [
  {
    _id: "60d21b4667d0d8992e610c85",
    name: "iPhone 14 Pro Max",
    description: "The latest iPhone with A16 Bionic chip, 48MP camera, and Dynamic Island.",
    category: {
      _id: "60d21b4667d0d8992e610c80",
      name: "Electronics",
      nameAr: "إلكترونيات"
    },
    price: 4999,
    stock: 50,
    sku: "APPLE-IP14PM-256",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1663499482523-1c0c1bae9649?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-03-20T14:30:00Z"
  },
  {
    _id: "60d21b4667d0d8992e610c86",
    name: "Samsung Galaxy S23 Ultra",
    description: "Flagship Android phone with 200MP camera and S Pen support.",
    category: {
      _id: "60d21b4667d0d8992e610c80",
      name: "Electronics",
      nameAr: "إلكترونيات"
    },
    price: 4799,
    stock: 45,
    sku: "SAMSUNG-S23U-512",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1675785931264-f1f3898ee8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    createdAt: "2023-01-20T11:15:00Z",
    updatedAt: "2023-02-10T09:45:00Z"
  },
  {
    _id: "60d21b4667d0d8992e610c87",
    name: "MacBook Pro 16-inch",
    description: "Powerful laptop with M2 Pro chip, 16GB RAM, and 512GB SSD.",
    category: {
      _id: "60d21b4667d0d8992e610c81",
      name: "Computers",
      nameAr: "كمبيوترات"
    },
    price: 9999,
    stock: 30,
    sku: "APPLE-MBP16-M2P",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
    createdAt: "2023-02-05T08:30:00Z",
    updatedAt: "2023-03-15T14:20:00Z"
  }
];

// Sample deals data for fallback
const SAMPLE_DEALS: Deal[] = [
  {
    _id: "60d21b4667d0d8992e610d85",
    jam3aId: "JAM3A-001",
    title: "iPhone 14 Pro Max Group Buy",
    titleAr: "شراء جماعي لآيفون 14 برو ماكس",
    description: "Join our group buy for the latest iPhone 14 Pro Max and save 15% off retail price. Limited spots available!",
    descriptionAr: "انضم إلى الشراء الجماعي لأحدث آيفون 14 برو ماكس ووفر 15% من سعر التجزئة. الأماكن محدودة!",
    category: {
      _id: "60d21b4667d0d8992e610c80",
      name: "Electronics",
      nameAr: "إلكترونيات"
    },
    regularPrice: 4999,
    jam3aPrice: 4249,
    discountPercentage: 15,
    currentParticipants: 8,
    maxParticipants: 10,
    timeRemaining: "2 days",
    expiryDate: "2025-04-10T23:59:59Z",
    featured: true,
    image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae9649?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    status: "active",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-05T14:30:00Z"
  },
  {
    _id: "60d21b4667d0d8992e610d86",
    jam3aId: "JAM3A-002",
    title: "Samsung Galaxy S23 Ultra Group Buy",
    titleAr: "شراء جماعي لسامسونج جالاكسي إس 23 ألترا",
    description: "Get the Samsung Galaxy S23 Ultra at 12% off when you join our group buy. Premium Android experience for less!",
    descriptionAr: "احصل على سامسونج جالاكسي إس 23 ألترا بخصم 12% عند انضمامك إلى الشراء الجماعي. تجربة أندرويد متميزة بسعر أقل!",
    category: {
      _id: "60d21b4667d0d8992e610c80",
      name: "Electronics",
      nameAr: "إلكترونيات"
    },
    regularPrice: 4799,
    jam3aPrice: 4223,
    discountPercentage: 12,
    currentParticipants: 6,
    maxParticipants: 10,
    timeRemaining: "3 days",
    expiryDate: "2025-04-11T23:59:59Z",
    featured: true,
    image: "https://images.unsplash.com/photo-1675785931264-f1f3898ee8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    status: "active",
    createdAt: "2025-04-01T11:15:00Z",
    updatedAt: "2025-04-05T09:45:00Z"
  },
  {
    _id: "60d21b4667d0d8992e610d87",
    jam3aId: "JAM3A-003",
    title: "MacBook Pro 16-inch Group Buy",
    titleAr: "شراء جماعي لماك بوك برو 16 بوصة",
    description: "Save 10% on the MacBook Pro 16-inch with M2 Pro chip when you join our group buy. Perfect for professionals!",
    descriptionAr: "وفر 10% على ماك بوك برو 16 بوصة مع شريحة M2 برو عند انضمامك إلى الشراء الجماعي. مثالي للمحترفين!",
    category: {
      _id: "60d21b4667d0d8992e610c81",
      name: "Computers",
      nameAr: "كمبيوترات"
    },
    regularPrice: 9999,
    jam3aPrice: 8999,
    discountPercentage: 10,
    currentParticipants: 4,
    maxParticipants: 8,
    timeRemaining: "5 days",
    expiryDate: "2025-04-13T23:59:59Z",
    featured: true,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
    status: "active",
    createdAt: "2025-04-02T08:30:00Z",
    updatedAt: "2025-04-05T14:20:00Z"
  }
];

// Sample featured deals for fallback
const SAMPLE_FEATURED_DEALS = SAMPLE_DEALS.filter(deal => deal.featured);

// Create the provider component
export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);

  // Fetch products and deals on component mount
  useEffect(() => {
    refreshProducts();
    refreshJam3aDeals();
  }, []);

  // Refresh products
  const refreshProducts = async () => {
    try {
      setIsLoading(true);
      
      try {
        // Use direct URL to ensure proper path construction
        const productsEndpoint = `${API_BASE_URL}/products`;
        console.log('Fetching products from:', productsEndpoint);
        
        const response = await fetch(productsEndpoint);
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response formats
        const productsData = Array.isArray(data) ? data : (data.data || []);
        
        if (productsData.length > 0) {
          setProducts(productsData);
          // Store in localStorage for fallback
          localStorage.setItem('jam3a_products', JSON.stringify(productsData));
        } else {
          throw new Error('No products returned from API');
        }
      } catch (apiError) {
        console.warn('API error, falling back to localStorage or sample data:', apiError);
        
        // Try to load from localStorage as fallback
        const storedProducts = localStorage.getItem('jam3a_products');
        if (storedProducts) {
          try {
            const parsedProducts = JSON.parse(storedProducts);
            if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
              setProducts(parsedProducts);
              console.log('Using products from localStorage');
            } else {
              throw new Error('Invalid stored products data');
            }
          } catch (parseError) {
            console.error('Error parsing stored products:', parseError);
            // Fall back to sample data
            setProducts(SAMPLE_PRODUCTS);
            console.log('Using sample products data');
          }
        } else {
          // No stored products, use sample data
          setProducts(SAMPLE_PRODUCTS);
          console.log('Using sample products data');
        }
      }
    } catch (err) {
      console.error('Error in products flow:', err);
      // Use sample data as last resort
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh Jam3a deals
  const refreshJam3aDeals = async () => {
    try {
      setIsLoading(true);
      
      try {
        // Use direct URL to ensure proper path construction
        const dealsEndpoint = `${API_BASE_URL}/deals`;
        console.log('Fetching deals from:', dealsEndpoint);
        
        const response = await fetch(dealsEndpoint);
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response formats
        const dealsData = Array.isArray(data) ? data : (data.data || []);
        
        if (dealsData.length > 0) {
          setDeals(dealsData);
          // Store in localStorage for fallback
          localStorage.setItem('jam3a_deals', JSON.stringify(dealsData));
        } else {
          throw new Error('No deals returned from API');
        }
      } catch (apiError) {
        console.warn('API error, falling back to localStorage or sample data:', apiError);
        
        // Try to load from localStorage as fallback
        const storedDeals = localStorage.getItem('jam3a_deals');
        if (storedDeals) {
          try {
            const parsedDeals = JSON.parse(storedDeals);
            if (Array.isArray(parsedDeals) && parsedDeals.length > 0) {
              setDeals(parsedDeals);
              console.log('Using deals from localStorage');
            } else {
              throw new Error('Invalid stored deals data');
            }
          } catch (parseError) {
            console.error('Error parsing stored deals:', parseError);
            // Fall back to sample data
            setDeals(SAMPLE_DEALS);
            console.log('Using sample deals data');
          }
        } else {
          // No stored deals, use sample data
          setDeals(SAMPLE_DEALS);
          console.log('Using sample deals data');
        }
      }
    } catch (err) {
      console.error('Error in deals flow:', err);
      // Use sample data as last resort
      setDeals(SAMPLE_DEALS);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a product
  const addProduct = async (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const response = await apiService.post<Product>('/products', product);
      
      // Update local state
      setProducts(prevProducts => [...prevProducts, response]);
      
      // Update sync status
      setSyncStatus({
        type: 'success',
        message: `Product "${response.name}" added successfully.`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'create',
          details: `Added product "${response.name}"`,
          status: 'success',
          products: [response._id],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      return response;
    } catch (error) {
      console.error('Error adding product:', error);
      
      // Update sync status
      setSyncStatus({
        type: 'error',
        message: `Failed to add product: ${error.message || 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'create',
          details: `Failed to add product: ${error.message || 'Unknown error'}`,
          status: 'error',
          products: [],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      throw error;
    }
  };

  // Update a product
  const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const response = await apiService.put<Product>(`/products/${id}`, product);
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(p => p._id === id ? { ...p, ...response } : p)
      );
      
      // Update sync status
      setSyncStatus({
        type: 'success',
        message: `Product "${response.name}" updated successfully.`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'update',
          details: `Updated product "${response.name}"`,
          status: 'success',
          products: [response._id],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Update sync status
      setSyncStatus({
        type: 'error',
        message: `Failed to update product: ${error.message || 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'update',
          details: `Failed to update product: ${error.message || 'Unknown error'}`,
          status: 'error',
          products: [id],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      throw error;
    }
  };

  // Delete a product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      await apiService.delete(`/products/${id}`);
      
      // Get product name before removing from state
      const productName = products.find(p => p._id === id)?.name || 'Unknown product';
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(p => p._id !== id));
      
      // Update sync status
      setSyncStatus({
        type: 'success',
        message: `Product "${productName}" deleted successfully.`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'delete',
          details: `Deleted product "${productName}"`,
          status: 'success',
          products: [id],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      
      // Update sync status
      setSyncStatus({
        type: 'error',
        message: `Failed to delete product: ${error.message || 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'delete',
          details: `Failed to delete product: ${error.message || 'Unknown error'}`,
          status: 'error',
          products: [id],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      throw error;
    }
  };

  // Bulk update products
  const bulkUpdateProducts = async (ids: string[], data: Partial<Product>): Promise<number> => {
    try {
      const response = await apiService.post<{ updated: number }>('/products/bulk-update', { ids, data });
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(p => ids.includes(p._id) ? { ...p, ...data } : p)
      );
      
      // Update sync status
      setSyncStatus({
        type: 'success',
        message: `${response.updated} products updated successfully.`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'bulk',
          details: `Bulk updated ${response.updated} products`,
          status: 'success',
          products: ids,
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      return response.updated;
    } catch (error) {
      console.error('Error bulk updating products:', error);
      
      // Update sync status
      setSyncStatus({
        type: 'error',
        message: `Failed to bulk update products: ${error.message || 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'bulk',
          details: `Failed to bulk update products: ${error.message || 'Unknown error'}`,
          status: 'error',
          products: ids,
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      throw error;
    }
  };

  // Bulk delete products
  const bulkDeleteProducts = async (ids: string[]): Promise<number> => {
    try {
      const response = await apiService.post<{ deleted: number }>('/products/bulk-delete', { ids });
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(p => !ids.includes(p._id)));
      
      // Update sync status
      setSyncStatus({
        type: 'success',
        message: `${response.deleted} products deleted successfully.`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'bulk',
          details: `Bulk deleted ${response.deleted} products`,
          status: 'success',
          products: ids,
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      return response.deleted;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      
      // Update sync status
      setSyncStatus({
        type: 'error',
        message: `Failed to bulk delete products: ${error.message || 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'bulk',
          details: `Failed to bulk delete products: ${error.message || 'Unknown error'}`,
          status: 'error',
          products: ids,
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      throw error;
    }
  };

  // Import products
  const importProducts = async (products: Omit<Product, '_id'>[]): Promise<number> => {
    try {
      const response = await apiService.post<{ imported: number }>('/products/import', { products });
      
      // Refresh products to get the imported ones
      await refreshProducts();
      
      // Update sync status
      setSyncStatus({
        type: 'success',
        message: `${response.imported} products imported successfully.`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'import',
          details: `Imported ${response.imported} products`,
          status: 'success',
          products: [],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      return response.imported;
    } catch (error) {
      console.error('Error importing products:', error);
      
      // Update sync status
      setSyncStatus({
        type: 'error',
        message: `Failed to import products: ${error.message || 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'import',
          details: `Failed to import products: ${error.message || 'Unknown error'}`,
          status: 'error',
          products: [],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      throw error;
    }
  };

  // Export products
  const exportProducts = async (ids?: string[]): Promise<Product[]> => {
    try {
      if (ids && ids.length > 0) {
        // Export specific products
        const response = await apiService.post<Product[]>('/products/export', { ids });
        
        // Update sync status
        setSyncStatus({
          type: 'success',
          message: `${response.length} products exported successfully.`,
          timestamp: Date.now()
        });
        
        // Add to sync logs
        setSyncLogs(prevLogs => [
          {
            id: Date.now(),
            action: 'export',
            details: `Exported ${response.length} products`,
            status: 'success',
            products: ids,
            timestamp: Date.now()
          },
          ...prevLogs
        ]);
        
        return response;
      } else {
        // Export all products
        const response = await apiService.get<Product[]>('/products/export');
        
        // Update sync status
        setSyncStatus({
          type: 'success',
          message: `${response.length} products exported successfully.`,
          timestamp: Date.now()
        });
        
        // Add to sync logs
        setSyncLogs(prevLogs => [
          {
            id: Date.now(),
            action: 'export',
            details: `Exported all products (${response.length})`,
            status: 'success',
            products: [],
            timestamp: Date.now()
          },
          ...prevLogs
        ]);
        
        return response;
      }
    } catch (error) {
      console.error('Error exporting products:', error);
      
      // Update sync status
      setSyncStatus({
        type: 'error',
        message: `Failed to export products: ${error.message || 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      // Add to sync logs
      setSyncLogs(prevLogs => [
        {
          id: Date.now(),
          action: 'export',
          details: `Failed to export products: ${error.message || 'Unknown error'}`,
          status: 'error',
          products: ids || [],
          timestamp: Date.now()
        },
        ...prevLogs
      ]);
      
      throw error;
    }
  };

  // Validate product
  const validateProduct = (product: Partial<Product>): string[] => {
    const errors: string[] = [];
    
    if (!product.name || product.name.trim() === '') {
      errors.push('Product name is required');
    }
    
    if (!product.description || product.description.trim() === '') {
      errors.push('Product description is required');
    }
    
    if (!product.category) {
      errors.push('Product category is required');
    }
    
    if (product.price === undefined || product.price < 0) {
      errors.push('Product price must be a positive number');
    }
    
    if (product.stock !== undefined && product.stock < 0) {
      errors.push('Product stock must be a positive number');
    }
    
    return errors;
  };

  // Clear sync status
  const clearSyncStatus = () => {
    setSyncStatus(null);
  };

  // Get active Jam3a deals
  const activeJam3aDeals = deals.filter(deal => deal.status === 'active');

  // Get featured products
  const featuredProducts = products.filter(product => product.featured);

  // Fetch featured deals on component mount
  useEffect(() => {
    const fetchFeaturedDeals = async () => {
      try {
        // Use direct URL to ensure proper path construction
        const featuredDealsEndpoint = `${API_BASE_URL}/deals/featured`;
        console.log('Fetching featured deals from:', featuredDealsEndpoint);
        
        const response = await fetch(featuredDealsEndpoint);
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response formats
        const featuredDealsData = Array.isArray(data) ? data : (data.data || []);
        
        if (featuredDealsData.length > 0) {
          // Update deals with featured deals
          setDeals(prevDeals => {
            // Create a map of existing deals by ID
            const dealsMap = new Map(prevDeals.map(deal => [deal._id, deal]));
            
            // Update or add featured deals
            featuredDealsData.forEach(featuredDeal => {
              dealsMap.set(featuredDeal._id, {
                ...dealsMap.get(featuredDeal._id) || {},
                ...featuredDeal,
                featured: true
              });
            });
            
            // Convert map back to array
            return Array.from(dealsMap.values());
          });
          
          // Store in localStorage for fallback
          localStorage.setItem('jam3a_featured_deals', JSON.stringify(featuredDealsData));
          console.log('Featured deals fetched successfully:', featuredDealsData.length);
        } else {
          console.warn('No featured deals returned from API');
          throw new Error('No featured deals returned from API');
        }
      } catch (apiError) {
        console.warn('API error fetching featured deals, falling back to localStorage or sample data:', apiError);
        
        // Try to load from localStorage as fallback
        const storedFeaturedDeals = localStorage.getItem('jam3a_featured_deals');
        if (storedFeaturedDeals) {
          try {
            const parsedFeaturedDeals = JSON.parse(storedFeaturedDeals);
            if (Array.isArray(parsedFeaturedDeals) && parsedFeaturedDeals.length > 0) {
              // Update deals with featured deals from localStorage
              setDeals(prevDeals => {
                // Create a map of existing deals by ID
                const dealsMap = new Map(prevDeals.map(deal => [deal._id, deal]));
                
                // Update or add featured deals
                parsedFeaturedDeals.forEach(featuredDeal => {
                  dealsMap.set(featuredDeal._id, {
                    ...dealsMap.get(featuredDeal._id) || {},
                    ...featuredDeal,
                    featured: true
                  });
                });
                
                // Convert map back to array
                return Array.from(dealsMap.values());
              });
              
              console.log('Using featured deals from localStorage');
            } else {
              throw new Error('Invalid stored featured deals data');
            }
          } catch (parseError) {
            console.error('Error parsing stored featured deals:', parseError);
            
            // Fall back to sample featured deals
            // Update deals with sample featured deals
            setDeals(prevDeals => {
              if (prevDeals.length === 0) {
                return SAMPLE_DEALS;
              }
              
              // Create a map of existing deals by ID
              const dealsMap = new Map(prevDeals.map(deal => [deal._id, deal]));
              
              // Update or add sample featured deals
              SAMPLE_FEATURED_DEALS.forEach(featuredDeal => {
                dealsMap.set(featuredDeal._id, {
                  ...dealsMap.get(featuredDeal._id) || {},
                  ...featuredDeal,
                  featured: true
                });
              });
              
              // Convert map back to array
              return Array.from(dealsMap.values());
            });
            
            console.log('Using sample featured deals data');
          }
        } else {
          // No stored featured deals, use sample featured deals
          // Update deals with sample featured deals
          setDeals(prevDeals => {
            if (prevDeals.length === 0) {
              return SAMPLE_DEALS;
            }
            
            // Create a map of existing deals by ID
            const dealsMap = new Map(prevDeals.map(deal => [deal._id, deal]));
            
            // Update or add sample featured deals
            SAMPLE_FEATURED_DEALS.forEach(featuredDeal => {
              dealsMap.set(featuredDeal._id, {
                ...dealsMap.get(featuredDeal._id) || {},
                ...featuredDeal,
                featured: true
              });
            });
            
            // Convert map back to array
            return Array.from(dealsMap.values());
          });
          
          console.log('Using sample featured deals data');
        }
      }
    };
    
    fetchFeaturedDeals();
  }, []);

  // Create context value
  const contextValue: ProductContextType = {
    products,
    deals,
    setProducts,
    refreshProducts,
    activeJam3aDeals,
    featuredProducts,
    syncStatus,
    isLoading,
    refreshJam3aDeals,
    syncLogs,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
    bulkDeleteProducts,
    importProducts,
    exportProducts,
    validateProduct,
    clearSyncStatus
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

// Create a hook to use the context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
