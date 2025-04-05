import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

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

// Initial products data
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
  { 
    id: 2, 
    name: "Samsung Galaxy S23 FE", 
    nameAr: "سامسونج جالاكسي S23 FE",
    category: "Electronics", 
    price: 2599, 
    originalPrice: 2999,
    stock: 30,
    description: "Powerful Android smartphone with exceptional camera and all-day battery life.",
    descriptionAr: "هاتف أندرويد قوي مع كاميرا استثنائية وبطارية تدوم طوال اليوم.",
    image: "/images/samsung_galaxy_s23_fe_clear.webp",
    currentAmount: 1800,
    targetAmount: 2600,
    participants: 5,
    featured: false,
    discount: 13,
    averageJoinRate: 300,
    status: 'active',
    dateAdded: '2025-03-10',
    lastUpdated: '2025-03-10',
    supplier: 'Samsung',
    sku: 'SGS23FE-128-CL'
  },
  { 
    id: 3, 
    name: "MacBook Air M1", 
    nameAr: "ماك بوك اير M1",
    category: "Computers", 
    price: 3599, 
    originalPrice: 3999,
    stock: 20,
    description: "Thin and light laptop with M1 chip, stunning display, and all-day battery life.",
    descriptionAr: "لابتوب نحيف وخفيف مع شريحة M1 وشاشة مذهلة وبطارية تدوم طوال اليوم.",
    image: "/images/macbook_air_m1_space_grey.webp",
    currentAmount: 2500,
    targetAmount: 3600,
    participants: 4,
    featured: true,
    discount: 10,
    averageJoinRate: 400,
    status: 'active',
    dateAdded: '2025-02-20',
    lastUpdated: '2025-02-20',
    supplier: 'Apple',
    sku: 'MBA-M1-256-SG'
  },
  { 
    id: 4, 
    name: "iPhone 16", 
    nameAr: "آيفون 16",
    category: "Electronics", 
    price: 3599, 
    originalPrice: 4299,
    stock: 100,
    description: "The latest iPhone with A18 chip, stunning design, and improved camera system.",
    descriptionAr: "أحدث آيفون مع شريحة A18 وتصميم مذهل ونظام كاميرا محسن.",
    image: "/images/iphone_16_pink.webp",
    currentAmount: 2000,
    targetAmount: 3600,
    participants: 6,
    featured: false,
    discount: 16,
    averageJoinRate: 350,
    status: 'active',
    dateAdded: '2025-03-15',
    lastUpdated: '2025-03-15',
    supplier: 'Apple',
    sku: 'IP16-128-PK'
  },
  { 
    id: 5, 
    name: "MacBook Air M4", 
    nameAr: "ماك بوك اير M4",
    category: "Computers", 
    price: 4499, 
    originalPrice: 4999,
    stock: 35,
    description: "The latest MacBook Air with M4 chip, stunning display, and incredible performance.",
    descriptionAr: "أحدث ماك بوك اير مع شريحة M4 وشاشة مذهلة وأداء مذهل.",
    image: "/images/macbook_air_m4.webp",
    currentAmount: 3000,
    targetAmount: 4500,
    participants: 3,
    featured: true,
    discount: 10,
    averageJoinRate: 450,
    status: 'active',
    dateAdded: '2025-03-01',
    lastUpdated: '2025-03-01',
    supplier: 'Apple',
    sku: 'MBA-M4-512-SL'
  },
  { 
    id: 6, 
    name: "Samsung Galaxy S23 FE Mint", 
    nameAr: "سامسونج جالاكسي S23 FE نعناعي",
    category: "Electronics", 
    price: 2599, 
    originalPrice: 2999,
    stock: 25,
    description: "Powerful Android smartphone in mint color with exceptional camera and all-day battery life.",
    descriptionAr: "هاتف أندرويد قوي باللون النعناعي مع كاميرا استثنائية وبطارية تدوم طوال اليوم.",
    image: "/images/samsung_galaxy_s23_fe_mint.webp",
    currentAmount: 1500,
    targetAmount: 2600,
    participants: 4,
    featured: false,
    discount: 13,
    averageJoinRate: 300,
    status: 'active',
    dateAdded: '2025-03-10',
    lastUpdated: '2025-03-10',
    supplier: 'Samsung',
    sku: 'SGS23FE-128-MT'
  },
];

// Create the context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock API endpoint for simulating server communication
const API_ENDPOINT = 'https://api.jam3a.com/v1';

// Provider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProductsState] = useState<Product[]>(initialProducts);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  
  // Local storage key for products
  const STORAGE_KEY = 'jam3a_products';
  
  // Load products from local storage on initial render
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = localStorage.getItem(STORAGE_KEY);
        if (storedProducts) {
          setProductsState(JSON.parse(storedProducts));
        }
      } catch (error) {
        console.error('Failed to load products from local storage:', error);
      }
    };
    
    loadProducts();
  }, []);
  
  // Save products to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products to local storage:', error);
    }
  }, [products]);

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

  // Simulate API refresh with improved error handling
  const refreshProducts = async (): Promise<void> => {
    setSyncStatus({ type: 'warning', message: 'Syncing products with database...', timestamp: Date.now() });
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would be an API call
      // const response = await axios.get(`${API_ENDPOINT}/products`);
      // setProductsState(response.data);
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: 'Refreshed all products from database',
        status: 'success',
        products: products.map(p => p.id)
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

  // Simulate refreshing Jam3a deals with improved error handling
  const refreshJam3aDeals = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would be an API call
      // const response = await axios.get(`${API_ENDPOINT}/jam3a-deals`);
      // Update state with the response data
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: 'Refreshed all Jam3a deals from database',
        status: 'success',
        products: activeJam3aDeals.map(p => p.id)
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
      
      // Generate new ID
      const newId = Math.max(0, ...products.map(p => p.id)) + 1;
      
      // Create new product with ID and timestamps
      const newProduct: Product = {
        ...product,
        id: newId,
        dateAdded: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        status: product.status || 'active'
      };
      
      // In a real implementation, this would be an API call
      // const response = await axios.post(`${API_ENDPOINT}/products`, newProduct);
      // const savedProduct = response.data;
      
      // Update local state
      setProducts([...products, newProduct]);
      
      // Add to sync logs
      addSyncLog({
        action: 'add',
        details: `Added product: ${newProduct.name}`,
        status: 'success',
        products: [newProduct.id]
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Product "${newProduct.name}" added successfully!`,
        timestamp: Date.now()
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
        message: `Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      throw error;
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

  // Update an existing product
  const updateProduct = async (product: Product): Promise<Product> => {
    setIsLoading(true);
    
    try {
      // Validate product
      const validationErrors = validateProduct(product);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Update timestamp
      const updatedProduct: Product = {
        ...product,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      // In a real implementation, this would be an API call
      // const response = await axios.put(`${API_ENDPOINT}/products/${product.id}`, updatedProduct);
      // const savedProduct = response.data;
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
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
        message: `Product "${updatedProduct.name}" updated successfully!`,
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
        products: [product.id]
      });
      
      setSyncStatus({ 
        type: 'error', 
        message: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      throw error;
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

  // Delete a product
  const deleteProduct = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Find product to delete
      const productToDelete = products.find(p => p.id === id);
      if (!productToDelete) {
        throw new Error(`Product with ID ${id} not found`);
      }
      
      // In a real implementation, this would be an API call
      // await axios.delete(`${API_ENDPOINT}/products/${id}`);
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      
      // Add to sync logs
      addSyncLog({
        action: 'delete',
        details: `Deleted product: ${productToDelete.name}`,
        status: 'success',
        products: [id]
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `Product "${productToDelete.name}" deleted successfully!`,
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
        message: `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      throw error;
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

  // Bulk update products
  const bulkUpdateProducts = async (ids: number[], updates: Partial<Product>): Promise<number> => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      // await axios.patch(`${API_ENDPOINT}/products/bulk`, { ids, updates });
      
      // Update timestamp
      const updatedTimestamp = new Date().toISOString().split('T')[0];
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          ids.includes(product.id) 
            ? { ...product, ...updates, lastUpdated: updatedTimestamp } 
            : product
        )
      );
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Bulk updated ${ids.length} products`,
        status: 'success',
        products: ids
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `${ids.length} products updated successfully!`,
        timestamp: Date.now()
      });
      
      return ids.length;
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
        message: `Failed to bulk update products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      throw error;
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

  // Bulk delete products
  const bulkDeleteProducts = async (ids: number[]): Promise<number> => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      // await axios.delete(`${API_ENDPOINT}/products/bulk`, { data: { ids } });
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(p => !ids.includes(p.id)));
      
      // Add to sync logs
      addSyncLog({
        action: 'bulk',
        details: `Bulk deleted ${ids.length} products`,
        status: 'success',
        products: ids
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `${ids.length} products deleted successfully!`,
        timestamp: Date.now()
      });
      
      return ids.length;
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
        message: `Failed to bulk delete products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      throw error;
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

  // Import products
  const importProducts = async (productsToImport: Omit<Product, 'id'>[]): Promise<number> => {
    setIsLoading(true);
    
    try {
      // Validate all products
      const allValidationErrors: string[] = [];
      productsToImport.forEach((product, index) => {
        const errors = validateProduct(product);
        if (errors.length > 0) {
          allValidationErrors.push(`Product ${index + 1}: ${errors.join(', ')}`);
        }
      });
      
      if (allValidationErrors.length > 0) {
        throw new Error(`Validation failed: ${allValidationErrors.join('; ')}`);
      }
      
      // Generate new IDs and add timestamps
      const highestId = Math.max(0, ...products.map(p => p.id));
      const timestamp = new Date().toISOString().split('T')[0];
      
      const newProducts: Product[] = productsToImport.map((product, index) => ({
        ...product,
        id: highestId + index + 1,
        dateAdded: timestamp,
        lastUpdated: timestamp,
        status: product.status || 'active'
      }));
      
      // In a real implementation, this would be an API call
      // const response = await axios.post(`${API_ENDPOINT}/products/import`, newProducts);
      
      // Update local state
      setProducts([...products, ...newProducts]);
      
      // Add to sync logs
      addSyncLog({
        action: 'import',
        details: `Imported ${newProducts.length} products`,
        status: 'success',
        products: newProducts.map(p => p.id)
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `${newProducts.length} products imported successfully!`,
        timestamp: Date.now()
      });
      
      return newProducts.length;
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
        message: `Failed to import products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      throw error;
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

  // Export products
  const exportProducts = async (ids?: number[]): Promise<Product[]> => {
    setIsLoading(true);
    
    try {
      // Filter products if IDs are provided
      const productsToExport = ids 
        ? products.filter(p => ids.includes(p.id))
        : products;
      
      // In a real implementation, this might involve an API call
      // const response = await axios.post(`${API_ENDPOINT}/products/export`, { ids });
      
      // Add to sync logs
      addSyncLog({
        action: 'export',
        details: `Exported ${productsToExport.length} products`,
        status: 'success',
        products: productsToExport.map(p => p.id)
      });
      
      setSyncStatus({ 
        type: 'success', 
        message: `${productsToExport.length} products exported successfully!`,
        timestamp: Date.now()
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
        message: `Failed to export products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
      
      throw error;
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

  // Validate product data
  const validateProduct = (product: Partial<Product>): string[] => {
    const errors: string[] = [];
    
    // Required fields
    if (!product.name || product.name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (!product.category || product.category.trim() === '') {
      errors.push('Category is required');
    }
    
    if (product.price === undefined || product.price < 0) {
      errors.push('Price must be a positive number');
    }
    
    if (product.stock === undefined || product.stock < 0 || !Number.isInteger(product.stock)) {
      errors.push('Stock must be a positive integer');
    }
    
    // Optional fields with constraints
    if (product.discount !== undefined && (product.discount < 0 || product.discount > 100)) {
      errors.push('Discount must be between 0 and 100');
    }
    
    if (product.originalPrice !== undefined && product.originalPrice < 0) {
      errors.push('Original price must be a positive number');
    }
    
    if (product.participants !== undefined && (product.participants < 0 || !Number.isInteger(product.participants))) {
      errors.push('Participants must be a positive integer');
    }
    
    return errors;
  };

  // Add entry to sync logs
  const addSyncLog = (log: Omit<SyncLog, 'timestamp'>) => {
    const newLog: SyncLog = {
      ...log,
      timestamp: Date.now()
    };
    
    setSyncLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100)); // Keep only the last 100 logs
  };

  // Clear sync status
  const clearSyncStatus = () => {
    setSyncStatus(null);
  };

  // Filter for active Jam3a deals
  const activeJam3aDeals = products.filter(product => 
    product.currentAmount !== undefined && 
    product.targetAmount !== undefined && 
    product.currentAmount < product.targetAmount &&
    product.status === 'active'
  );

  // Filter for featured products
  const featuredProducts = products.filter(product => 
    product.featured && product.status === 'active'
  );

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
