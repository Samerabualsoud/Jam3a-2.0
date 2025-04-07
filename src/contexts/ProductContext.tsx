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
  image: string;
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
        message: 'Failed to refresh products. Please try again.',
        timestamp: Date.now()
      });
      
      // Try to load from local storage as fallback
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        try {
          setProducts(JSON.parse(storedProducts));
          setSyncStatus({ 
            type: 'warning', 
            message: 'Using cached products. Connection to server failed.',
            timestamp: Date.now()
          });
        } catch (parseError) {
          console.error('Failed to parse stored products:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch Jam3a deals from API
  const refreshJam3aDeals = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log('Fetching Jam3a deals from:', `${API_BASE_URL}/deals`);
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
      
      setDeals(dealsData);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Refreshed ${dealsData.length} Jam3a deals`,
        status: 'success',
        products: dealsData.map((d: Deal) => d._id)
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully refreshed ${dealsData.length} Jam3a deals.`,
        timestamp: Date.now()
      });
      
      // Save to localStorage for offline fallback
      localStorage.setItem('deals', JSON.stringify(dealsData));
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
        message: 'Failed to refresh Jam3a deals. Please try again.',
        timestamp: Date.now()
      });
      
      // Try to load from local storage as fallback
      const storedDeals = localStorage.getItem('deals');
      if (storedDeals) {
        try {
          setDeals(JSON.parse(storedDeals));
          setSyncStatus({ 
            type: 'warning', 
            message: 'Using cached deals. Connection to server failed.',
            timestamp: Date.now()
          });
        } catch (parseError) {
          console.error('Failed to parse stored deals:', parseError);
        }
      }
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
      
      return 0;
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
      
      return 0;
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
      
      return 0;
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
        exportedProducts = response.data;
      } else {
        exportedProducts = [];
      }
      
      // Add to sync logs
      addSyncLog({
        action: 'export',
        details: `Exported ${exportedProducts.length} products`,
        status: 'success',
        products: ids || []
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
        products: ids || []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to export products. Please try again.',
        timestamp: Date.now()
      });
      
      return [];
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
    
    return errors;
  };
  
  // Clear sync status
  const clearSyncStatus = () => {
    setSyncStatus(null);
  };
  
  return (
    <ProductContext.Provider
      value={{
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
      }}
    >
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
