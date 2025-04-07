import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import BilingualProductListing from './BilingualProductListing';
import { useLanguage } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ActiveJam3aDeals = () => {
  const { activeJam3aDeals } = useProducts();
  const { language } = useLanguage();
  
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
            {activeJam3aDeals.length > 0 ? (
              activeJam3aDeals.map(deal => (
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
            {activeJam3aDeals.filter(deal => deal.category === 'Electronics').length > 0 ? (
              activeJam3aDeals
                .filter(deal => deal.category === 'Electronics')
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
            {activeJam3aDeals.filter(deal => deal.category === 'Computers').length > 0 ? (
              activeJam3aDeals
                .filter(deal => deal.category === 'Computers')
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
