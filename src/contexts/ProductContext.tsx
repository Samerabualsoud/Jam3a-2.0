import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';
import { API_BASE_URL } from '@/config';

// Define the Product type
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
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

// Define the sync log type
export interface SyncLog {
  id: number;
  action: 'create' | 'update' | 'delete' | 'bulk' | 'import' | 'export';
  details: string;
  status: 'success' | 'error' | 'warning';
  products: number[];
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
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  refreshProducts: () => Promise<void>;
  activeJam3aDeals: Product[];
  featuredProducts: Product[];
  syncStatus: SyncStatus | null;
  isLoading: boolean;
  refreshJam3aDeals: () => Promise<void>;
  syncLogs: SyncLog[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<boolean>;
  bulkUpdateProducts: (ids: number[], data: Partial<Product>) => Promise<number>;
  bulkDeleteProducts: (ids: number[]) => Promise<number>;
  importProducts: (products: Omit<Product, 'id'>[]) => Promise<number>;
  exportProducts: (ids?: number[]) => Promise<Product[]>;
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
      
      // Ensure response is an array
      const productsData = Array.isArray(response) ? response : 
                          (response && Array.isArray(response.products)) ? response.products : [];
      
      console.log('Products data:', productsData);
      
      setProducts(productsData);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Refreshed ${productsData.length} products`,
        status: 'success',
        products: productsData.map((p: Product) => p.id)
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully refreshed ${productsData.length} products.`,
        timestamp: Date.now()
      });
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
      
      // Ensure response is an array
      const dealsData = Array.isArray(response) ? response : 
                       (response && Array.isArray(response.deals)) ? response.deals : [];
      
      console.log('Jam3a deals data:', dealsData);
      
      // Update only the Jam3a deals in the products array
      const dealsIds = dealsData.map((deal: Product) => deal.id);
      const updatedProducts = products.map(product => 
        dealsIds.includes(product.id) 
          ? dealsData.find((deal: Product) => deal.id === product.id) 
          : product
      );
      
      // Add any new deals that weren't in the products array
      const newDeals = dealsData.filter((deal: Product) => 
        !products.some(product => product.id === deal.id)
      );
      
      setProducts([...updatedProducts, ...newDeals]);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Refreshed ${dealsData.length} Jam3a deals`,
        status: 'success',
        products: dealsData.map((p: Product) => p.id)
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully refreshed ${dealsData.length} Jam3a deals.`,
        timestamp: Date.now()
      });
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load products on mount
  useEffect(() => {
    refreshProducts();
    refreshJam3aDeals();
    
    // Set up interval to refresh products every 5 minutes
    const intervalId = setInterval(() => {
      refreshProducts();
      refreshJam3aDeals();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Save products to local storage when they change (for fallback)
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);
  
  // Add a product
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    setIsLoading(true);
    
    try {
      console.log('Adding product to:', `${API_BASE_URL}/products`);
      const newProduct = await apiService.post('/products', product);
      
      setProducts(prev => [...prev, newProduct]);
      
      // Add to sync logs
      addSyncLog({
        action: 'create',
        details: `Created product: ${newProduct.name}`,
        status: 'success',
        products: [newProduct.id]
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update a product
  const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
    setIsLoading(true);
    
    try {
      console.log('Updating product at:', `${API_BASE_URL}/products/${id}`);
      const updatedProduct = await apiService.put(`/products/${id}`, productData);
      
      setProducts(prev => 
        prev.map(product => product.id === id ? updatedProduct : product)
      );
      
      // Add to sync logs
      addSyncLog({
        action: 'update',
        details: `Updated product: ${updatedProduct.name}`,
        status: 'success',
        products: [updatedProduct.id]
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a product
  const deleteProduct = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Deleting product at:', `${API_BASE_URL}/products/${id}`);
      await apiService.delete(`/products/${id}`);
      
      const deletedProduct = products.find(p => p.id === id);
      setProducts(prev => prev.filter(product => product.id !== id));
      
      // Add to sync logs
      addSyncLog({
        action: 'delete',
        details: `Deleted product: ${deletedProduct?.name || id}`,
        status: 'success',
        products: [id]
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully deleted product: ${deletedProduct?.name || id}`,
        timestamp: Date.now()
      });
      
      return true;
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Bulk update products
  const bulkUpdateProducts = async (ids: number[], data: Partial<Product>): Promise<number> => {
    setIsLoading(true);
    
    try {
      console.log('Bulk updating products at:', `${API_BASE_URL}/products/bulk`);
      const result = await apiService.post('/products/bulk', {
        action: 'update',
        ids,
        data
      });
      
      const updatedCount = result.updated || 0;
      
      // Refresh products to get the updated data
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
        message: `Successfully updated ${updatedCount} products.`,
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Bulk delete products
  const bulkDeleteProducts = async (ids: number[]): Promise<number> => {
    setIsLoading(true);
    
    try {
      console.log('Bulk deleting products at:', `${API_BASE_URL}/products/bulk`);
      const result = await apiService.post('/products/bulk', {
        action: 'delete',
        ids
      });
      
      const deletedCount = result.deleted || 0;
      
      // Update local state
      setProducts(prev => prev.filter(product => !ids.includes(product.id)));
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Bulk deleted ${deletedCount} products`,
        status: 'success',
        products: ids
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully deleted ${deletedCount} products.`,
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Import products
  const importProducts = async (productsToImport: Omit<Product, 'id'>[]): Promise<number> => {
    setIsLoading(true);
    
    try {
      console.log('Importing products to:', `${API_BASE_URL}/products/import`);
      const result = await apiService.post('/products/import', { products: productsToImport });
      
      const importedCount = result.imported || 0;
      
      // Refresh products to get the updated data
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
        message: `Successfully imported ${importedCount} products.`,
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Export products
  const exportProducts = async (ids?: number[]): Promise<Product[]> => {
    setIsLoading(true);
    
    try {
      console.log('Exporting products from:', `${API_BASE_URL}/products/export`);
      const result = await apiService.post('/products/export', { ids });
      
      const exportedProducts = result.products || [];
      
      // Add to sync logs
      addSyncLog({
        action: 'export',
        details: `Exported ${exportedProducts.length} products`,
        status: 'success',
        products: ids || []
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Successfully exported ${exportedProducts.length} products.`,
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
      
      // Return filtered products from local state as fallback
      return ids 
        ? products.filter(product => ids.includes(product.id))
        : products;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Validate product
  const validateProduct = (product: Partial<Product>): string[] => {
    const errors: string[] = [];
    
    if (!product.name || product.name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (!product.category || product.category.trim() === '') {
      errors.push('Category is required');
    }
    
    if (product.price === undefined || product.price < 0) {
      errors.push('Price must be a positive number');
    }
    
    if (product.stock !== undefined && product.stock < 0) {
      errors.push('Stock must be a positive number');
    }
    
    return errors;
  };
  
  // Clear sync status
  const clearSyncStatus = () => {
    setSyncStatus(null);
  };
  
  // Compute active Jam3a deals
  const activeJam3aDeals = products.filter(product => 
    product.currentAmount !== undefined && 
    product.targetAmount !== undefined && 
    product.currentAmount < product.targetAmount
  );
  
  // Compute featured products
  const featuredProducts = products.filter(product => product.featured);
  
  // Provide the context value
  const contextValue: ProductContextType = {
    products,
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
export const useProductContext = () => {
  const context = useContext(ProductContext);
  
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  
  return context;
};
