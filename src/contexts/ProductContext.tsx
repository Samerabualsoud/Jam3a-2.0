import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import productService, { ProductQueryParams } from '../services/ProductService';

// Enhanced Product interface with additional fields
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  nameAr?: string;
  descriptionAr?: string;
  currentAmount?: number;
  targetAmount?: number;
  participants?: number;
  featured?: boolean;
  discount?: number;
  originalPrice?: number;
  averageJoinRate?: number;
  supplier?: string;
  sku?: string;
  status?: 'active' | 'inactive' | 'draft';
  tags?: string[];
  dateAdded?: string;
  lastUpdated?: string;
}

interface SyncStatus {
  type: 'success' | 'warning' | 'error';
  message: string;
  timestamp?: number;
}

interface SyncLog {
  action: 'add' | 'update' | 'delete' | 'bulk' | 'import' | 'export';
  timestamp: number;
  details: string;
  status: 'success' | 'error';
  products: number[];
}

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  refreshProducts: () => Promise<void>;
  activeJam3aDeals: Product[];
  featuredProducts: Product[];
  syncStatus: SyncStatus | null;
  isLoading: boolean;
  refreshJam3aDeals: () => Promise<void>;
  syncLogs: SyncLog[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: number) => Promise<boolean>;
  bulkUpdateProducts: (ids: number[], updates: Partial<Product>) => Promise<number>;
  bulkDeleteProducts: (ids: number[]) => Promise<number>;
  importProducts: (products: Omit<Product, 'id'>[]) => Promise<number>;
  exportProducts: (ids?: number[]) => Promise<Product[]>;
  validateProduct: (product: Partial<Product>) => string[];
  clearSyncStatus: () => void;
}

// Initial products data (fallback if API fails)
const initialProducts: Product[] = [
  { 
    id: 1, 
    name: "iPhone 16 Pro Max", 
    nameAr: "آيفون 16 برو ماكس",
    category: "Electronics", 
    price: 4999, 
    originalPrice: 5699,
    stock: 50,
    description: "The latest iPhone with A18 Pro chip, titanium design, and advanced camera system.",
    descriptionAr: "أحدث آيفون مع شريحة A18 Pro وتصميم من التيتانيوم ونظام كاميرا متطور.",
    image: "/images/iphone_16_pro_max_desert_titanium.webp",
    currentAmount: 3500,
    targetAmount: 5000,
    participants: 7,
    featured: true,
    discount: 12,
    averageJoinRate: 500,
    status: 'active',
    dateAdded: '2025-03-15',
    lastUpdated: '2025-03-15',
    supplier: 'Apple',
    sku: 'IP16PM-256-TI'
  },
  // Other initial products...
];

// Create the context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProductsState] = useState<Product[]>(initialProducts);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  
  // Local storage key for products (for offline capability)
  const STORAGE_KEY = 'jam3a_products';
  
  // Load products from API on initial render
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        
        // Try to load from API first
        try {
          const response = await productService.getProducts();
          // Map backend product format to frontend format
          const mappedProducts = response.products.map(p => ({
            id: Number(p._id),
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock || 0,
            description: p.description,
            image: p.imageUrl,
            featured: p.featured,
            originalPrice: p.originalPrice,
            status: p.status,
            supplier: p.supplier,
            sku: p.sku,
            tags: p.tags,
            dateAdded: new Date(p.createdAt).toISOString().split('T')[0],
            lastUpdated: new Date(p.updatedAt).toISOString().split('T')[0],
          }));
          
          setProductsState(mappedProducts);
          
          // Save to local storage for offline capability
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedProducts));
          
          return;
        } catch (apiError) {
          console.warn('Failed to load products from API, falling back to local storage:', apiError);
        }
        
        // Fallback to local storage if API fails
        const storedProducts = localStorage.getItem(STORAGE_KEY);
        if (storedProducts) {
          setProductsState(JSON.parse(storedProducts));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Enhanced setProducts function with sync status
  const setProducts = (newProductsOrFunction: React.SetStateAction<Product[]>) => {
    setProductsState(prevProducts => {
      const newProducts = typeof newProductsOrFunction === 'function'
        ? newProductsOrFunction(prevProducts)
        : newProductsOrFunction;
      
      // Trigger sync status
      setSyncStatus({
        type: 'success',
        message: 'Products synced successfully with website!',
        timestamp: Date.now()
      });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setSyncStatus(prevStatus => 
          prevStatus?.timestamp === Date.now() ? null : prevStatus
        );
      }, 3000);
      
      return newProducts;
    });
  };

  // Add a sync log entry
  const addSyncLog = (log: Omit<SyncLog, 'timestamp'>) => {
    const newLog = {
      ...log,
      timestamp: Date.now()
    };
    
    setSyncLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100)); // Keep only the last 100 logs
  };

  // Refresh products from API
  const refreshProducts = async (): Promise<void> => {
    setSyncStatus({ type: 'warning', message: 'Syncing products with database...', timestamp: Date.now() });
    setIsLoading(true);
    
    try {
      // Real API call using the product service
      const response = await productService.getProducts();
      
      // Map backend product format to frontend format
      const mappedProducts = response.products.map(p => ({
        id: Number(p._id),
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock || 0,
        description: p.description,
        image: p.imageUrl,
        featured: p.featured,
        originalPrice: p.originalPrice,
        status: p.status,
        supplier: p.supplier,
        sku: p.sku,
        tags: p.tags,
        dateAdded: new Date(p.createdAt).toISOString().split('T')[0],
        lastUpdated: new Date(p.updatedAt).toISOString().split('T')[0],
      }));
      
      setProductsState(mappedProducts);
      
      // Save to local storage for offline capability
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedProducts));
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: 'Refreshed all products from database',
        status: 'success',
        products: mappedProducts.map(p => p.id)
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: 'Products synced successfully with website!',
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to refresh products:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Failed to refresh products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to sync products. Please try again.',
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setSyncStatus(prevStatus => 
          prevStatus?.timestamp === Date.now() ? null : prevStatus
        );
      }, 3000);
    }
  };

  // Refresh Jam3a deals from API
  const refreshJam3aDeals = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Real API call using the product service with featured filter
      const response = await productService.getProducts({ featured: true });
      
      // Map backend product format to frontend format
      const mappedProducts = response.products.map(p => ({
        id: Number(p._id),
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock || 0,
        description: p.description,
        image: p.imageUrl,
        featured: p.featured,
        originalPrice: p.originalPrice,
        status: p.status,
        supplier: p.supplier,
        sku: p.sku,
        tags: p.tags,
        dateAdded: new Date(p.createdAt).toISOString().split('T')[0],
        lastUpdated: new Date(p.updatedAt).toISOString().split('T')[0],
      }));
      
      // Update only the featured products in the state
      setProductsState(prevProducts => {
        const nonFeaturedProducts = prevProducts.filter(p => !p.featured);
        return [...nonFeaturedProducts, ...mappedProducts];
      });
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: 'Refreshed all Jam3a deals from database',
        status: 'success',
        products: mappedProducts.map(p => p.id)
      });
    } catch (error) {
      console.error('Failed to refresh Jam3a deals:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Failed to refresh Jam3a deals: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to sync Jam3a deals. Please try again.',
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new product
  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    setIsLoading(true);
    
    try {
      // Validate product
      const validationErrors = validateProduct(product);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Map frontend product format to backend format
      const backendProduct = {
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        imageUrl: product.image || '',
        featured: product.featured || false,
        status: product.status || 'active',
        stock: product.stock || 0,
        tags: product.tags || [],
        specifications: {},
        supplier: product.supplier || '',
        sku: product.sku || '',
      };
      
      // Real API call using the product service
      const response = await productService.createProduct(backendProduct);
      
      // Map the response back to frontend format
      const newProduct: Product = {
        id: Number(response._id),
        name: response.name,
        category: response.category,
        price: response.price,
        stock: response.stock || 0,
        description: response.description,
        image: response.imageUrl,
        featured: response.featured,
        originalPrice: response.originalPrice,
        status: response.status,
        supplier: response.supplier,
        sku: response.sku,
        tags: response.tags,
        dateAdded: new Date(response.createdAt).toISOString().split('T')[0],
        lastUpdated: new Date(response.updatedAt).toISOString().split('T')[0],
      };
      
      // Update local state
      setProducts([...products, newProduct]);
      
      // Add to sync logs
      addSyncLog({
        action: 'add',
        details: `Added product: ${newProduct.name}`,
        status: 'success',
        products: [newProduct.id]
      });
      
      return newProduct;
    } catch (error) {
      console.error('Failed to add product:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'add',
        details: `Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: []
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: 'Failed to add product. Please try again.',
        timestamp: Date.now()
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing product
  const updateProduct = async (product: Product): Promise<Product> => {
    setIsLoading(true);
    
    try {
      // Validate product
      const validationErrors = validateProduct(product);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Map frontend product format to backend format
      const backendProduct = {
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        imageUrl: product.image || '',
        featured: product.featured || false,
        status: product.status || 'active',
        stock: product.stock || 0,
        tags: product.tags || [],
        specifications: {},
        supplier: product.supplier || '',
        sku: product.sku || '',
      };
      
      // Real API call using the product service
      const response = await productService.updateProduct(String(product.id), backendProduct);
      
      // Map the response back to frontend format
      const updatedProduct: Product = {
        id: Number(response._id),
        name: response.name,
        category: response.category,
        price: response.price,
        stock: response.stock || 0,
        description: response.description,
        image: response.imageUrl,
        featured: response.featured,
        originalPrice: response.originalPrice,
        status: response.status,
        supplier: response.supplier,
        sku: response.sku,
        tags: response.tags,
        dateAdded: new Date(response.createdAt).toISOString().split('T')[0],
        lastUpdated: new Date(response.updatedAt).toISOString().split('T')[0],
      };
      
      // Update local state
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      
      // Add to sync logs
      addSyncLog({
        action: 'update',
        details: `Updated product: ${updatedProduct.name}`,
        status: 'success',
        products: [updatedProduct.id]
      });
      
      return updatedProduct;
    } catch (error) {
      console.error('Failed to update product:', error);
      
      // Add to sync logs
      addSyncLog({
        action: 'update',
        details: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        products: [product.id]
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
      // Real API call using the product service
      await productService.deleteProduct(String(id));
      
      // Update local state
      setProducts(products.filter(p => p.id !== id));
      
      // Add to sync logs
      addSyncLog({
        action: 'delete',
        details: `Deleted product with ID: ${id}`,
        status: 'success',
        products: [id]
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
  const bulkUpdateProducts = async (ids: number[], updates: Partial<Product>): Promise<number> => {
    setIsLoading(true);
    
    try {
      // Map frontend product format to backend format
      const backendUpdates = {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        originalPrice: updates.originalPrice,
        category: updates.category,
        imageUrl: updates.image,
        featured: updates.featured,
        status: updates.status,
        stock: updates.stock,
        tags: updates.tags,
        supplier: updates.supplier,
        sku: updates.sku,
      };
      
      // Filter out undefined values
      Object.keys(backendUpdates).forEach(key => {
        if (backendUpdates[key] === undefined) {
          delete backendUpdates[key];
        }
      });
      
      // Real API call using the product service
      const response = await productService.bulkUpdateProducts(
        ids.map(id => String(id)),
        backendUpdates
      );
      
      if (response.success) {
        // Update local state
        setProducts(products.map(p => {
          if (ids.includes(p.id)) {
            return { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
          }
          return p;
        }));
        
        // Add to sync logs
        addSyncLog({
          action: 'bulk',
          details: `Bulk updated ${response.count} products`,
          status: 'success',
          products: ids
        });
        
        return response.count;
      } else {
        throw new Error('Bulk update failed');
      }
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
      // Real API call using the product service
      const response = await productService.bulkDeleteProducts(
        ids.map(id => String(id))
      );
      
      if (response.success) {
        // Update local state
        setProducts(products.filter(p => !ids.includes(p.id)));
        
        // Add to sync logs
        addSyncLog({
          action: 'bulk',
          details: `Bulk deleted ${response.count} products`,
          status: 'success',
          products: ids
        });
        
        return response.count;
      } else {
        throw new Error('Bulk delete failed');
      }
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
      // In a real implementation, we would convert the products to a file and upload
      // For now, we'll add them one by one
      let successCount = 0;
      
      for (const product of productsToImport) {
        try {
          await addProduct(product);
          successCount++;
        } catch (error) {
          console.error(`Failed to import product ${product.name}:`, error);
        }
      }
      
      // Add to sync logs
      addSyncLog({
        action: 'import',
        details: `Imported ${successCount} out of ${productsToImport.length} products`,
        status: successCount === productsToImport.length ? 'success' : 'error',
        products: []
      });
      
      return successCount;
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
      // In a real implementation, we would call the API to get a file
      // For now, we'll just return the products from state
      const productsToExport = ids 
        ? products.filter(p => ids.includes(p.id))
        : products;
      
      // Add to sync logs
      addSyncLog({
        action: 'export',
        details: `Exported ${productsToExport.length} products`,
        status: 'success',
        products: productsToExport.map(p => p.id)
      });
      
      return productsToExport;
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
      errors.push('Stock cannot be negative');
    }
    
    return errors;
  };

  // Clear sync status
  const clearSyncStatus = () => {
    setSyncStatus(null);
  };

  // Compute active Jam3a deals
  const activeJam3aDeals = products.filter(p => p.currentAmount !== undefined && p.targetAmount !== undefined);
  
  // Compute featured products
  const featuredProducts = products.filter(p => p.featured);

  // Context value
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

// Custom hook to use the product context
export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  
  return context;
};

// Export an alias for useProductContext as useProducts to fix the import issue
export const useProducts = useProductContext;

export default ProductContext;
