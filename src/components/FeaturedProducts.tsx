import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import BilingualProductListing from './BilingualProductListing';
import { useLanguage } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FeaturedProducts = () => {
  const { featuredProducts } = useProducts();
  const { language } = useLanguage();
  
  return (
    <div className="container mx-auto py-8">
      <h2 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {language === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.length > 0 ? (
          featuredProducts.map(product => (
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
