import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import BilingualProductListing from './BilingualProductListing';
import { useLanguage } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CategoryProducts = ({ category }) => {
  const { products } = useProducts();
  const { language } = useLanguage();
  
  // Safely handle category which could be a string or an object
  const getCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    
    if (typeof category === 'string') {
      return category;
    }
    
    if (typeof category === 'object' && category !== null) {
      return category.name || 'Uncategorized';
    }
    
    return 'Uncategorized';
  };
  
  // Filter products by category, handling both string and object formats
  const categoryProducts = products.filter(product => {
    if (!product.category) return false;
    
    const productCategoryName = getCategoryName(product.category);
    const filterCategoryName = getCategoryName(category);
    
    return productCategoryName.toLowerCase() === filterCategoryName.toLowerCase();
  });
  
  // Get the display name for the category
  const displayCategoryName = getCategoryName(category);
  
  return (
    <div className="container mx-auto py-8">
      <h2 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {language === 'ar' ? `منتجات ${displayCategoryName}` : `${displayCategoryName} Products`}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryProducts.length > 0 ? (
          categoryProducts.map(product => (
            <BilingualProductListing key={product._id || product.id} product={product} language={language} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {language === 'ar' ? `لا توجد منتجات في فئة ${displayCategoryName}` : `No products in ${displayCategoryName} category`}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
