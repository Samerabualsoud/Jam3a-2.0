import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import BilingualProductListing from './BilingualProductListing';
import { useLanguage } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FeaturedProducts = () => {
  const { featuredProducts } = useProducts();
  const { language } = useLanguage();
  
  // Ensure products have valid properties to prevent rendering errors
  const safeProducts = featuredProducts.map(product => ({
    ...product,
    // Ensure _id is used as key instead of id
    id: product._id || product.id || `product-${Math.random().toString(36).substr(2, 9)}`,
    // Ensure imageUrl exists
    imageUrl: product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'
  }));
  
  return (
    <div className="container mx-auto py-8">
      <h2 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {language === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {safeProducts.length > 0 ? (
          safeProducts.map(product => (
            <BilingualProductListing key={product.id} product={product} language={language} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {language === 'ar' ? 'لا توجد منتجات مميزة حالياً' : 'No featured products at the moment'}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
