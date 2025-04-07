import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import BilingualProductListing from './BilingualProductListing';
import { useLanguage } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper function to safely get category name
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

const ActiveJam3aDeals = () => {
  const { activeJam3aDeals } = useProducts();
  const { language } = useLanguage();
  
  // Ensure deals have valid properties to prevent rendering errors
  const safeDeals = activeJam3aDeals.map(deal => ({
    ...deal,
    // Ensure _id is used as key instead of id
    id: deal._id || deal.id || `deal-${Math.random().toString(36).substr(2, 9)}`,
    // Ensure image exists
    image: deal.image || 'https://via.placeholder.com/400x300?text=No+Image',
    // Ensure category is properly handled
    category: deal.category || 'Uncategorized'
  }));
  
  return (
    <div className="container mx-auto py-8">
      <h2 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {language === 'ar' ? 'صفقات جمعة النشطة' : 'Active Jam3a Deals'}
      </h2>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">{language === 'ar' ? 'الكل' : 'All'}</TabsTrigger>
          <TabsTrigger value="electronics">{language === 'ar' ? 'إلكترونيات' : 'Electronics'}</TabsTrigger>
          <TabsTrigger value="computers">{language === 'ar' ? 'كمبيوترات' : 'Computers'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeDeals.length > 0 ? (
              safeDeals.map(deal => (
                <BilingualProductListing key={deal.id} product={deal} language={language} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {language === 'ar' ? 'لا توجد صفقات جمعة نشطة حالياً' : 'No active Jam3a deals at the moment'}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="electronics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeDeals.filter(deal => 
              getCategoryName(deal.category).toLowerCase() === 'electronics'
            ).length > 0 ? (
              safeDeals
                .filter(deal => 
                  getCategoryName(deal.category).toLowerCase() === 'electronics'
                )
                .map(deal => (
                  <BilingualProductListing key={deal.id} product={deal} language={language} />
                ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {language === 'ar' ? 'لا توجد صفقات جمعة نشطة في الإلكترونيات' : 'No active Electronics Jam3a deals'}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="computers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeDeals.filter(deal => 
              getCategoryName(deal.category).toLowerCase() === 'computers'
            ).length > 0 ? (
              safeDeals
                .filter(deal => 
                  getCategoryName(deal.category).toLowerCase() === 'computers'
                )
                .map(deal => (
                  <BilingualProductListing key={deal.id} product={deal} language={language} />
                ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {language === 'ar' ? 'لا توجد صفقات جمعة نشطة في الكمبيوترات' : 'No active Computers Jam3a deals'}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActiveJam3aDeals;
