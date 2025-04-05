import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Product interface
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
}

interface SyncStatus {
  type: 'success' | 'warning' | 'error';
  message: string;
}

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  refreshProducts: () => Promise<void>;
  activeJam3aDeals: Product[];
  featuredProducts: Product[];
  syncStatus: SyncStatus | null;
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
    averageJoinRate: 500
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
    averageJoinRate: 300
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
    averageJoinRate: 400
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
    averageJoinRate: 350
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
    averageJoinRate: 450
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
    averageJoinRate: 300
  },
];

// Create the context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  // Simulate API refresh
  const refreshProducts = async (): Promise<void> => {
    setSyncStatus({ type: 'warning', message: 'Syncing products with database...' });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSyncStatus({ type: 'success', message: 'Products synced successfully with website!' });
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setSyncStatus(null);
    }, 3000);
  };

  // Filter for active Jam3a deals
  const activeJam3aDeals = products.filter(product => 
    product.currentAmount !== undefined && 
    product.targetAmount !== undefined && 
    product.currentAmount < product.targetAmount
  );

  // Filter for featured products
  const featuredProducts = products.filter(product => product.featured);

  // Provide the context value
  const contextValue: ProductContextType = {
    products,
    setProducts,
    refreshProducts,
    activeJam3aDeals,
    featuredProducts,
    syncStatus
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
