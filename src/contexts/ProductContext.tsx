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
    createdAt: "2025-04-02T11:15:00Z",
    updatedAt: "2025-04-05T09:45:00Z"
  },
  {
    _id: "60d21b4667d0d8992e610d87",
    jam3aId: "JAM3A-003",
    title: "MacBook Pro 16-inch Group Buy",
    titleAr: "شراء جماعي لماك بوك برو 16 بوصة",
    description: "Save 10% on the powerful MacBook Pro 16-inch with M2 Pro chip. Perfect for professionals and creatives.",
    descriptionAr: "وفر 10% على ماك بوك برو 16 بوصة القوي مع شريحة M2 Pro. مثالي للمحترفين والمبدعين.",
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
    createdAt: "2025-04-03T08:30:00Z",
    updatedAt: "2025-04-05T14:20:00Z"
  }
];

// Create a provider component
export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  
  // State for deals
  const [deals, setDeals] = useState<Deal[]>([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State for sync logs
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  
  // State for sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  
  // Add a sync log
  const addSyncLog = (log: Omit<SyncLog, 'id' | 'timestamp'>) => {
    const newLog: SyncLog = {
      ...log,
      id: Date.now(),
      timestamp: Date.now()
    };
    
    setSyncLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep only the last 100 logs
  };
  
  // Fetch products from API
  const refreshProducts = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log('Fetching products from:', `${API_BASE_URL}/products`);
      
      try {
        const response = await apiService.get('/products');
        
        // Extract data from response - handle both formats
        let productsData;
        if (response && response.data && response.data.data) {
          // New API format: { success: true, data: [...] }
          productsData = response.data.data;
        } else if (response && response.data) {
          // Direct data format
          productsData = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          // Direct array format
          productsData = response;
        } else {
          productsData = [];
        }
        
        console.log('Products data:', productsData);
        
        // If we got an empty array but expected data, throw an error to trigger fallback
        if (productsData.length === 0) {
          console.warn('API returned empty products array, will try fallbacks');
          throw new Error('Empty products array from API');
        }
        
        setProducts(productsData);
        
        // Add to sync logs
        addSyncLog({
          action: 'bulk',
          details: `Refreshed ${productsData.length} products`,
          status: 'success',
          products: productsData.map((p: Product) => p._id)
        });
        
        setSyncStatus({ 
          type: 'success', 
          message: `Successfully refreshed ${productsData.length} products.`,
          timestamp: Date.now()
        });
        
        // Save to localStorage for offline fallback
        localStorage.setItem('products', JSON.stringify(productsData));
      } catch (apiError) {
        console.warn('API error, trying localStorage fallback:', apiError);
        
        // Try to load from local storage as fallback
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          try {
            const parsedProducts = JSON.parse(storedProducts);
            if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
              setProducts(parsedProducts);
              setSyncStatus({ 
                type: 'warning', 
                message: 'Using cached products. Connection to server failed.',
                timestamp: Date.now()
              });
              return; // Exit early if localStorage fallback worked
            }
          } catch (parseError) {
            console.error('Failed to parse stored products:', parseError);
          }
        }
        
        // If localStorage fallback failed, use sample data
        console.warn('Using sample products data as final fallback');
        setProducts(SAMPLE_PRODUCTS);
        setSyncStatus({ 
          type: 'warning', 
          message: 'Using sample products. Connection to server failed.',
          timestamp: Date.now()
        });
        
        // Save sample data to localStorage for future fallback
        localStorage.setItem('products', JSON.stringify(SAMPLE_PRODUCTS));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Failed to refresh products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to refresh products. Using fallback data.',
        timestamp: Date.now()
      });
      
      // Use sample data as final fallback
      setProducts(SAMPLE_PRODUCTS);
      
      // Save sample data to localStorage for future fallback
      localStorage.setItem('products', JSON.stringify(SAMPLE_PRODUCTS));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch Jam3a deals from API
  const refreshJam3aDeals = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log('Fetching Jam3a deals from:', `${API_BASE_URL}/deals`);
      
      try {
        const response = await apiService.get('/deals');
        
        // Extract data from response - handle both formats
        let dealsData;
        if (response && response.data && response.data.data) {
          // New API format: { success: true, data: [...] }
          dealsData = response.data.data;
        } else if (response && response.data) {
          // Direct data format
          dealsData = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          // Direct array format
          dealsData = response;
        } else {
          dealsData = [];
        }
        
        console.log('Jam3a deals data:', dealsData);
        
        // If we got an empty array but expected data, throw an error to trigger fallback
        if (dealsData.length === 0) {
          console.warn('API returned empty deals array, will try fallbacks');
          throw new Error('Empty deals array from API');
        }
        
        // Ensure all deals have an image property to prevent TypeError
        const processedDeals = dealsData.map((deal: Deal) => ({
          ...deal,
          image: deal.image || 'https://via.placeholder.com/400x300?text=No+Image'
        }));
        
        setDeals(processedDeals);
        
        // Add to sync logs
        addSyncLog({
          action: 'bulk',
          details: `Refreshed ${processedDeals.length} Jam3a deals`,
          status: 'success',
          products: processedDeals.map((d: Deal) => d._id)
        });
        
        setSyncStatus({ 
          type: 'success', 
          message: `Successfully refreshed ${processedDeals.length} Jam3a deals.`,
          timestamp: Date.now()
        });
        
        // Save to localStorage for offline fallback
        localStorage.setItem('deals', JSON.stringify(processedDeals));
      } catch (apiError) {
        console.warn('API error, trying localStorage fallback:', apiError);
        
        // Try to load from local storage as fallback
        const storedDeals = localStorage.getItem('deals');
        if (storedDeals) {
          try {
            const parsedDeals = JSON.parse(storedDeals);
            if (Array.isArray(parsedDeals) && parsedDeals.length > 0) {
              // Ensure all deals have an image property to prevent TypeError
              const processedDeals = parsedDeals.map((deal: Deal) => ({
                ...deal,
                image: deal.image || 'https://via.placeholder.com/400x300?text=No+Image'
              }));
              
              setDeals(processedDeals);
              setSyncStatus({ 
                type: 'warning', 
                message: 'Using cached deals. Connection to server failed.',
                timestamp: Date.now()
              });
              return; // Exit early if localStorage fallback worked
            }
          } catch (parseError) {
            console.error('Failed to parse stored deals:', parseError);
          }
        }
        
        // If localStorage fallback failed, use sample data
        console.warn('Using sample deals data as final fallback');
        setDeals(SAMPLE_DEALS);
        setSyncStatus({ 
          type: 'warning', 
          message: 'Using sample deals. Connection to server failed.',
          timestamp: Date.now()
        });
        
        // Save sample data to localStorage for future fallback
        localStorage.setItem('deals', JSON.stringify(SAMPLE_DEALS));
      }
    } catch (error) {
      console.error('Failed to fetch Jam3a deals:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Failed to refresh Jam3a deals: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to refresh Jam3a deals. Using fallback data.',
        timestamp: Date.now()
      });
      
      // Use sample data as final fallback
      setDeals(SAMPLE_DEALS);
      
      // Save sample data to localStorage for future fallback
      localStorage.setItem('deals', JSON.stringify(SAMPLE_DEALS));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load products and deals on mount
  useEffect(() => {
    refreshProducts();
    refreshJam3aDeals();
    
    // Set up interval to refresh products and deals every 5 minutes
    const intervalId = setInterval(() => {
      refreshProducts();
      refreshJam3aDeals();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Get active Jam3a deals
  const activeJam3aDeals = deals.filter(deal => deal.status === 'active');
  
  // Get featured products
  const featuredProducts = products.filter(product => product.featured);
  
  // Add a new product
  const addProduct = async (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const response = await apiService.post('/products', product);
      
      // Extract data from response
      let newProduct;
      if (response && response.data && response.data.data) {
        newProduct = response.data.data;
      } else if (response && response.data) {
        newProduct = response.data;
      } else {
        throw new Error('Invalid response format');
      }
      
      // Update products state
      setProducts(prev => [newProduct, ...prev]);
      
      // Add to sync logs
      addSyncLog({
        action: 'create',
        details: `Created product: ${newProduct.name}`,
        status: 'success',
        products: [newProduct._id]
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully created product: ${newProduct.name}`,
        timestamp: Date.now()
      });
      
      return newProduct;
    } catch (error) {
      console.error('Failed to add product:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'create',
        details: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to create product. Please try again.',
        timestamp: Date.now()
      });
      
      throw error;
    }
  };
  
  // Update a product
  const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const response = await apiService.put(`/products/${id}`, product);
      
      // Extract data from response
      let updatedProduct;
      if (response && response.data && response.data.data) {
        updatedProduct = response.data.data;
      } else if (response && response.data) {
        updatedProduct = response.data;
      } else {
        throw new Error('Invalid response format');
      }
      
      // Update products state
      setProducts(prev => prev.map(p => p._id === id ? updatedProduct : p));
      
      // Add to sync logs
      addSyncLog({
        action: 'update',
        details: `Updated product: ${updatedProduct.name}`,
        status: 'success',
        products: [updatedProduct._id]
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully updated product: ${updatedProduct.name}`,
        timestamp: Date.now()
      });
      
      return updatedProduct;
    } catch (error) {
      console.error('Failed to update product:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'update',
        details: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: [id]
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to update product. Please try again.',
        timestamp: Date.now()
      });
      
      throw error;
    }
  };
  
  // Delete a product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.delete(`/products/${id}`);
      
      // Check if deletion was successful
      const success = response && (response.data?.success || response.status === 200);
      
      if (success) {
        // Update products state
        setProducts(prev => prev.filter(p => p._id !== id));
        
        // Add to sync logs
        addSyncLog({
          action: 'delete',
          details: `Deleted product with ID: ${id}`,
          status: 'success',
          products: [id]
        });
        
        setSyncStatus({ 
          type: 'success', 
          message: 'Successfully deleted product',
          timestamp: Date.now()
        });
        
        return true;
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'delete',
        details: `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: [id]
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to delete product. Please try again.',
        timestamp: Date.now()
      });
      
      return false;
    }
  };
  
  // Bulk update products
  const bulkUpdateProducts = async (ids: string[], data: Partial<Product>): Promise<number> => {
    try {
      const response = await apiService.put('/products/bulk', { ids, data });
      
      // Extract data from response
      let updatedCount;
      if (response && response.data && response.data.data) {
        updatedCount = response.data.data.count || 0;
      } else if (response && response.data) {
        updatedCount = response.data.count || 0;
      } else {
        updatedCount = 0;
      }
      
      // Refresh products to get updated data
      await refreshProducts();
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Bulk updated ${updatedCount} products`,
        status: 'success',
        products: ids
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully updated ${updatedCount} products`,
        timestamp: Date.now()
      });
      
      return updatedCount;
    } catch (error) {
      console.error('Failed to bulk update products:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Failed to bulk update products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: ids
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to bulk update products. Please try again.',
        timestamp: Date.now()
      });
      
      throw error;
    }
  };
  
  // Bulk delete products
  const bulkDeleteProducts = async (ids: string[]): Promise<number> => {
    try {
      const response = await apiService.post('/products/bulk-delete', { ids });
      
      // Extract data from response
      let deletedCount;
      if (response && response.data && response.data.data) {
        deletedCount = response.data.data.count || 0;
      } else if (response && response.data) {
        deletedCount = response.data.count || 0;
      } else {
        deletedCount = 0;
      }
      
      // Update products state
      setProducts(prev => prev.filter(p => !ids.includes(p._id)));
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Bulk deleted ${deletedCount} products`,
        status: 'success',
        products: ids
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully deleted ${deletedCount} products`,
        timestamp: Date.now()
      });
      
      return deletedCount;
    } catch (error) {
      console.error('Failed to bulk delete products:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Failed to bulk delete products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: ids
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to bulk delete products. Please try again.',
        timestamp: Date.now()
      });
      
      throw error;
    }
  };
  
  // Import products
  const importProducts = async (products: Omit<Product, '_id'>[]): Promise<number> => {
    try {
      const response = await apiService.post('/products/import', { products });
      
      // Extract data from response
      let importedCount;
      if (response && response.data && response.data.data) {
        importedCount = response.data.data.count || 0;
      } else if (response && response.data) {
        importedCount = response.data.count || 0;
      } else {
        importedCount = 0;
      }
      
      // Refresh products to get updated data
      await refreshProducts();
      
      // Add to sync logs
      addSyncLog({
        action: 'import',
        details: `Imported ${importedCount} products`,
        status: 'success',
        products: []
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully imported ${importedCount} products`,
        timestamp: Date.now()
      });
      
      return importedCount;
    } catch (error) {
      console.error('Failed to import products:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'import',
        details: `Failed to import products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to import products. Please try again.',
        timestamp: Date.now()
      });
      
      throw error;
    }
  };
  
  // Export products
  const exportProducts = async (ids?: string[]): Promise<Product[]> => {
    try {
      const response = await apiService.post('/products/export', { ids });
      
      // Extract data from response
      let exportedProducts;
      if (response && response.data && response.data.data) {
        exportedProducts = response.data.data;
      } else if (response && response.data) {
        exportedProducts = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        exportedProducts = response;
      } else {
        exportedProducts = [];
      }
      
      // Add to sync logs
      addSyncLog({
        action: 'export',
        details: `Exported ${exportedProducts.length} products`,
        status: 'success',
        products: exportedProducts.map((p: Product) => p._id)
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully exported ${exportedProducts.length} products`,
        timestamp: Date.now()
      });
      
      return exportedProducts;
    } catch (error) {
      console.error('Failed to export products:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'export',
        details: `Failed to export products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to export products. Please try again.',
        timestamp: Date.now()
      });
      
      // Return current products as fallback
      return products;
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
    
    if (product.price === undefined || product.price <= 0) {
      errors.push('Product price must be greater than 0');
    }
    
    return errors;
  };
  
  // Clear sync status
  const clearSyncStatus = () => {
    setSyncStatus(null);
  };
  
  // Provide context value
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

// Custom hook to use the product context
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  
  return context;
};
