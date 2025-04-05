import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const BilingualProductListing = ({ product, language }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Get product image based on product name or ID
  const getProductImage = () => {
    const productName = product.name.toLowerCase();
    
    // Map of product keywords to image URLs
    const imageMap = {
      'iphone': 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'galaxy s': 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'fold': 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'flip': 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'macbook': 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'airpods': 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'watch': 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'ipad': 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'tv': 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'headphones': 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    };
    
    // Find matching image based on product name
    for (const [keyword, url] of Object.entries(imageMap)) {
      if (productName.includes(keyword.toLowerCase())) {
        return url;
      }
    }
    
    // Default image if no match found
    return 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  };

  useEffect(() => {
    // Calculate progress based on joined/total
    const joined = product.joined || 0;
    const total = product.total || 10;
    const calculatedProgress = (joined / total) * 100;
    
    // Animate progress bar
    const timer = setTimeout(() => {
      setProgress(calculatedProgress);
    }, 200);
    
    // Format time left
    const formatTimeLeft = () => {
      if (product.timeLeft) {
        if (product.timeLeft.includes('hour')) {
          return language === 'en' ? product.timeLeft : product.timeLeft.replace('hours', 'ساعة').replace('hour', 'ساعة');
        } else if (product.timeLeft.includes('day')) {
          return language === 'en' ? product.timeLeft : product.timeLeft.replace('days', 'يوم').replace('day', 'يوم');
        }
      }
      return language === 'en' ? '1 day left' : 'متبقي يوم واحد';
    };
    
    setTimeLeft(formatTimeLeft());
    
    return () => clearTimeout(timer);
  }, [product, language]);

  const handleJoinJam3a = () => {
    // Navigate to join page with product details
    navigate(`/join-jam3a?product=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&discount=${encodeURIComponent(product.discount)}&id=${encodeURIComponent(product.id || '1')}`);
    
    toast({
      title: language === 'en' ? 'Joining Jam3a' : 'جاري الانضمام للجمعة',
      description: language === 'en' ? `You're joining the ${product.name} Jam3a` : `أنت تنضم إلى جمعة ${product.name}`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={product.image || getProductImage()} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge variant="destructive" className="bg-black/80 hover:bg-black/70">
            {product.discount || '15% OFF'}
          </Badge>
          {product.tag && (
            <Badge variant="secondary" className="bg-primary/80 hover:bg-primary/70">
              {product.tag === 'HOT DEAL' 
                ? (language === 'en' ? 'HOT DEAL' : 'عرض ساخن')
                : product.tag === 'TRENDING'
                  ? (language === 'en' ? 'TRENDING' : 'رائج')
                  : product.tag}
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
        <CardDescription>
          {product.description || (language === 'en' 
            ? 'Experience the latest technology with premium features and design'
            : 'استمتع بأحدث التقنيات مع ميزات وتصميم متميز')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary">{product.price}</span>
          <span className="text-sm line-through text-muted-foreground">{product.originalPrice}</span>
        </div>
        
        {product.groupPricing && (
          <div className="mb-4">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              {language === 'en' ? 'Group Pricing' : 'تسعير المجموعة'}
            </h4>
            <div className="space-y-1 text-sm">
              {product.groupPricing.map((pricing, index) => (
                <div key={index} className="flex justify-between">
                  <span>{pricing.people} {language === 'en' ? 'people' : 'أشخاص'}</span>
                  <span className="font-medium">{pricing.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>
              {language === 'en' 
                ? `${product.joined || 0} of ${product.total || 10} joined` 
                : `${product.joined || 0} من ${product.total || 10} انضموا`}
            </span>
            <span>{timeLeft}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button 
          className="w-full" 
          onClick={handleJoinJam3a}
        >
          {language === 'en' ? 'Join Jam3a' : 'انضم للجمعة'}
        </Button>
        
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {language === 'en' ? 'Limited Time' : 'وقت محدود'}
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            {language === 'en' ? 'Money-back Guarantee' : 'ضمان استرداد الأموال'}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BilingualProductListing;
