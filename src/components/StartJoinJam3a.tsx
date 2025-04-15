import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import BilingualProductListing from './BilingualProductListing';
import { useLanguage } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const StartJoinJam3a = () => {
  const { products, activeJam3aDeals } = useProducts();
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedJam3a, setSelectedJam3a] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  // Filter active Jam3a deals by selected category
  const filteredJam3aDeals = selectedCategory 
    ? activeJam3aDeals.filter(deal => deal.category === selectedCategory)
    : [];
  
  // Filter products by selected category
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : [];
  
  const handleStartJam3a = () => {
    if (!selectedCategory || !selectedProduct) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'يرجى اختيار الفئة والمنتج'
          : 'Please select a category and product',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: language === 'ar' ? 'تم إنشاء جمعة جديدة' : 'New Jam3a Created',
      description: language === 'ar'
        ? 'تم إنشاء جمعة جديدة بنجاح'
        : 'Your new Jam3a has been created successfully',
    });
    
    // Navigate to the new Jam3a page (in a real implementation)
    // navigate(`/jam3a/${newJam3aId}`);
  };
  
  const handleJoinJam3a = () => {
    if (!selectedCategory || !selectedJam3a || !selectedProduct) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'يرجى اختيار الفئة والجمعة والمنتج'
          : 'Please select a category, Jam3a, and product',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: language === 'ar' ? 'تم الانضمام للجمعة' : 'Joined Jam3a',
      description: language === 'ar'
        ? 'تم الانضمام للجمعة بنجاح'
        : 'You have successfully joined the Jam3a',
    });
    
    // Navigate to the Jam3a page (in a real implementation)
    // navigate(`/jam3a/${selectedJam3a}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h2 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {language === 'ar' ? 'ابدأ أو انضم لجمعة' : 'Start or Join a Jam3a'}
      </h2>
      
      <Tabs defaultValue="start" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="start">{language === 'ar' ? 'ابدأ جمعة' : 'Start a Jam3a'}</TabsTrigger>
          <TabsTrigger value="join">{language === 'ar' ? 'انضم لجمعة' : 'Join a Jam3a'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="start">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'ابدأ جمعة جديدة' : 'Start a New Jam3a'}</CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'اختر فئة ومنتج لبدء جمعة جديدة'
                  : 'Select a category and product to start a new Jam3a'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">{language === 'ar' ? 'الفئة' : 'Category'}</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={language === 'ar' ? 'اختر فئة' : 'Select a category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product">{language === 'ar' ? 'المنتج' : 'Product'}</Label>
                <Select 
                  value={selectedProduct} 
                  onValueChange={setSelectedProduct}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder={language === 'ar' ? 'اختر منتج' : 'Select a product'} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map(product => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {language === 'ar' && product.nameAr ? product.nameAr : product.name} - {product.price} SAR
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartJam3a}>
                {language === 'ar' ? 'ابدأ جمعة' : 'Start Jam3a'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'انضم لجمعة' : 'Join a Jam3a'}</CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'اختر فئة وجمعة ومنتج للانضمام'
                  : 'Select a category, Jam3a, and product to join'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="join-category">{language === 'ar' ? 'الفئة' : 'Category'}</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="join-category">
                    <SelectValue placeholder={language === 'ar' ? 'اختر فئة' : 'Select a category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jam3a">{language === 'ar' ? 'الجمعة' : 'Jam3a'}</Label>
                <Select 
                  value={selectedJam3a} 
                  onValueChange={setSelectedJam3a}
                  disabled={!selectedCategory || filteredJam3aDeals.length === 0}
                >
                  <SelectTrigger id="jam3a">
                    <SelectValue placeholder={language === 'ar' ? 'اختر جمعة' : 'Select a Jam3a'} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredJam3aDeals.map(deal => (
                      <SelectItem key={deal.id} value={deal.id.toString()}>
                        {language === 'ar' && deal.nameAr ? deal.nameAr : deal.name} - {deal.currentAmount}/{deal.targetAmount} SAR
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && filteredJam3aDeals.length === 0 && (
                  <p className="text-sm text-red-500">
                    {language === 'ar' 
                      ? 'لا توجد جمعات نشطة في هذه الفئة'
                      : 'No active Jam3a deals in this category'}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="join-product">{language === 'ar' ? 'المنتج' : 'Product'}</Label>
                <Select 
                  value={selectedProduct} 
                  onValueChange={setSelectedProduct}
                  disabled={!selectedCategory || !selectedJam3a}
                >
                  <SelectTrigger id="join-product">
                    <SelectValue placeholder={language === 'ar' ? 'اختر منتج' : 'Select a product'} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map(product => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {language === 'ar' && product.nameAr ? product.nameAr : product.name} - {product.price} SAR
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleJoinJam3a}
                disabled={!selectedCategory || !selectedJam3a || !selectedProduct}
              >
                {language === 'ar' ? 'انضم للجمعة' : 'Join Jam3a'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StartJoinJam3a;
