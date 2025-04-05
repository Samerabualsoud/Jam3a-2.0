import React, { useState, useEffect } from 'react';
import { useProductContext } from '@/contexts/ProductContext';
import BilingualProductListing from './BilingualProductListing';
import { useLanguage } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CategoryProducts = ({ category }) => {
  const { products } = useProductContext();
  const { language } = useLanguage();
  
  // Filter products by category
  const categoryProducts = products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
  
  return (
    <div className="container mx-auto py-8">
      <h2 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {language === 'ar' ? `منتجات ${category}` : `${category} Products`}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryProducts.length > 0 ? (
          categoryProducts.map(product => (
            <BilingualProductListing key={product.id} product={product} language={language} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {language === 'ar' ? `لا توجد منتجات في فئة ${category}` : `No products in ${category} category`}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
