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

// Comprehensive product image mapping system
const PRODUCT_IMAGES = {
  // Apple Products
  IPHONE: {
    DEFAULT: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '16 PRO': 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '16 PRO MAX': 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '15': 'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '15 PRO': 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  MACBOOK: {
    DEFAULT: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'PRO': 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'AIR': 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  IPAD: {
    DEFAULT: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'PRO': 'https://images.pexels.com/photos/1716539/pexels-photo-1716539.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'AIR': 'https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'MINI': 'https://images.pexels.com/photos/221185/pexels-photo-221185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  AIRPODS: {
    DEFAULT: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'PRO': 'https://images.pexels.com/photos/8533266/pexels-photo-8533266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'MAX': 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  WATCH: {
    DEFAULT: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'SERIES 9': 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'ULTRA': 'https://images.pexels.com/photos/9979927/pexels-photo-9979927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  
  // Samsung Products
  GALAXY: {
    DEFAULT: 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'S25': 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'S25 ULTRA': 'https://images.pexels.com/photos/15351642/pexels-photo-15351642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'S24': 'https://images.pexels.com/photos/13028507/pexels-photo-13028507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'S24 ULTRA': 'https://images.pexels.com/photos/13028507/pexels-photo-13028507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'NOTE': 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  FOLD: {
    DEFAULT: 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '6': 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '5': 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '4': 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  FLIP: {
    DEFAULT: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '6': 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '5': 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '4': 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  
  // Other Electronics
  TV: {
    DEFAULT: 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'SAMSUNG': 'https://images.pexels.com/photos/6782342/pexels-photo-6782342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'LG': 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'SONY': 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  HEADPHONES: {
    DEFAULT: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'SONY': 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'BOSE': 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'BEATS': 'https://images.pexels.com/photos/1591/technology-music-sound-things.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  LAPTOP: {
    DEFAULT: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'DELL': 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'HP': 'https://images.pexels.com/photos/705675/pexels-photo-705675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'LENOVO': 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'ASUS': 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  CAMERA: {
    DEFAULT: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'CANON': 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'NIKON': 'https://images.pexels.com/photos/1787235/pexels-photo-1787235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'SONY': 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  GAMING: {
    DEFAULT: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'PLAYSTATION': 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'XBOX': 'https://images.pexels.com/photos/13189272/pexels-photo-13189272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'NINTENDO': 'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  
  // Fallback image for any product not matched
  FALLBACK: 'https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
};

const BilingualProductListing = ({ product, language }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Enhanced product image selection based on product name and description
  const getProductImage = () => {
    // Guard against undefined product
    if (!product) {
      return PRODUCT_IMAGES.FALLBACK;
    }
    
    // If product already has an image, use it
    if (product.image && typeof product.image === 'string' && product.image.startsWith('http')) {
      return product.image;
    }
    
    const productName = (product.name || '').toLowerCase();
    const productDescription = (product.description || '').toLowerCase();
    const combinedText = `${productName} ${productDescription}`;
    
    // Try to match product with our image mapping system
    
    // Check for iPhone models
    if (combinedText.includes('iphone')) {
      if (combinedText.includes('16 pro max')) return PRODUCT_IMAGES.IPHONE['16 PRO MAX'];
      if (combinedText.includes('16 pro')) return PRODUCT_IMAGES.IPHONE['16 PRO'];
      if (combinedText.includes('16')) return PRODUCT_IMAGES.IPHONE['16 PRO'];
      if (combinedText.includes('15 pro')) return PRODUCT_IMAGES.IPHONE['15 PRO'];
      if (combinedText.includes('15')) return PRODUCT_IMAGES.IPHONE['15'];
      return PRODUCT_IMAGES.IPHONE.DEFAULT;
    }
    
    // Check for Samsung Galaxy models
    if (combinedText.includes('galaxy s')) {
      if (combinedText.includes('s25 ultra')) return PRODUCT_IMAGES.GALAXY['S25 ULTRA'];
      if (combinedText.includes('s25')) return PRODUCT_IMAGES.GALAXY['S25'];
      if (combinedText.includes('s24 ultra')) return PRODUCT_IMAGES.GALAXY['S24 ULTRA'];
      if (combinedText.includes('s24')) return PRODUCT_IMAGES.GALAXY['S24'];
      if (combinedText.includes('note')) return PRODUCT_IMAGES.GALAXY['NOTE'];
      return PRODUCT_IMAGES.GALAXY.DEFAULT;
    }
    
    // Check for Samsung Fold models
    if (combinedText.includes('fold') || combinedText.includes('z fold')) {
      if (combinedText.includes('fold 6') || combinedText.includes('z fold 6')) return PRODUCT_IMAGES.FOLD['6'];
      if (combinedText.includes('fold 5') || combinedText.includes('z fold 5')) return PRODUCT_IMAGES.FOLD['5'];
      if (combinedText.includes('fold 4') || combinedText.includes('z fold 4')) return PRODUCT_IMAGES.FOLD['4'];
      return PRODUCT_IMAGES.FOLD.DEFAULT;
    }
    
    // Check for Samsung Flip models
    if (combinedText.includes('flip') || combinedText.includes('z flip')) {
      if (combinedText.includes('flip 6') || combinedText.includes('z flip 6')) return PRODUCT_IMAGES.FLIP['6'];
      if (combinedText.includes('flip 5') || combinedText.includes('z flip 5')) return PRODUCT_IMAGES.FLIP['5'];
      if (combinedText.includes('flip 4') || combinedText.includes('z flip 4')) return PRODUCT_IMAGES.FLIP['4'];
      return PRODUCT_IMAGES.FLIP.DEFAULT;
    }
    
    // Check for MacBook models
    if (combinedText.includes('macbook')) {
      if (combinedText.includes('pro')) return PRODUCT_IMAGES.MACBOOK['PRO'];
      if (combinedText.includes('air')) return PRODUCT_IMAGES.MACBOOK['AIR'];
      return PRODUCT_IMAGES.MACBOOK.DEFAULT;
    }
    
    // Check for iPad models
    if (combinedText.includes('ipad')) {
      if (combinedText.includes('pro')) return PRODUCT_IMAGES.IPAD['PRO'];
      if (combinedText.includes('air')) return PRODUCT_IMAGES.IPAD['AIR'];
      if (combinedText.includes('mini')) return PRODUCT_IMAGES.IPAD['MINI'];
      return PRODUCT_IMAGES.IPAD.DEFAULT;
    }
    
    // Check for AirPods models
    if (combinedText.includes('airpod') || combinedText.includes('air pod')) {
      if (combinedText.includes('pro')) return PRODUCT_IMAGES.AIRPODS['PRO'];
      if (combinedText.includes('max')) return PRODUCT_IMAGES.AIRPODS['MAX'];
      return PRODUCT_IMAGES.AIRPODS.DEFAULT;
    }
    
    // Check for Apple Watch models
    if (combinedText.includes('apple watch') || combinedText.includes('watch')) {
      if (combinedText.includes('series 9')) return PRODUCT_IMAGES.WATCH['SERIES 9'];
      if (combinedText.includes('ultra')) return PRODUCT_IMAGES.WATCH['ULTRA'];
      return PRODUCT_IMAGES.WATCH.DEFAULT;
    }
    
    // Check for TV models
    if (combinedText.includes('tv') || combinedText.includes('television')) {
      if (combinedText.includes('samsung')) return PRODUCT_IMAGES.TV['SAMSUNG'];
      if (combinedText.includes('lg')) return PRODUCT_IMAGES.TV['LG'];
      if (combinedText.includes('sony')) return PRODUCT_IMAGES.TV['SONY'];
      return PRODUCT_IMAGES.TV.DEFAULT;
    }
    
    // Check for headphones/earbuds
    if (combinedText.includes('headphone') || combinedText.includes('earphone') || 
        combinedText.includes('earbud') || combinedText.includes('headset')) {
      if (combinedText.includes('sony')) return PRODUCT_IMAGES.HEADPHONES['SONY'];
      if (combinedText.includes('bose')) return PRODUCT_IMAGES.HEADPHONES['BOSE'];
      if (combinedText.includes('beats')) return PRODUCT_IMAGES.HEADPHONES['BEATS'];
      return PRODUCT_IMAGES.HEADPHONES.DEFAULT;
    }
    
    // Check for laptops
    if (combinedText.includes('laptop') || combinedText.includes('notebook')) {
      if (combinedText.includes('dell')) return PRODUCT_IMAGES.LAPTOP['DELL'];
      if (combinedText.includes('hp')) return PRODUCT_IMAGES.LAPTOP['HP'];
      if (combinedText.includes('lenovo')) return PRODUCT_IMAGES.LAPTOP['LENOVO'];
      if (combinedText.includes('asus')) return PRODUCT_IMAGES.LAPTOP['ASUS'];
      return PRODUCT_IMAGES.LAPTOP.DEFAULT;
    }
    
    // Check for cameras
    if (combinedText.includes('camera') || combinedText.includes('dslr') || 
        combinedText.includes('mirrorless')) {
      if (combinedText.includes('canon')) return PRODUCT_IMAGES.CAMERA['CANON'];
      if (combinedText.includes('nikon')) return PRODUCT_IMAGES.CAMERA['NIKON'];
      if (combinedText.includes('sony')) return PRODUCT_IMAGES.CAMERA['SONY'];
      return PRODUCT_IMAGES.CAMERA.DEFAULT;
    }
    
    // Check for gaming consoles
    if (combinedText.includes('gaming') || combinedText.includes('game console') || 
        combinedText.includes('console')) {
      if (combinedText.includes('playstation') || combinedText.includes('ps5') || 
          combinedText.includes('ps4')) return PRODUCT_IMAGES.GAMING['PLAYSTATION'];
      if (combinedText.includes('xbox')) return PRODUCT_IMAGES.GAMING['XBOX'];
      if (combinedText.includes('nintendo') || combinedText.includes('switch')) 
        return PRODUCT_IMAGES.GAMING['NINTENDO'];
      return PRODUCT_IMAGES.GAMING.DEFAULT;
    }
    
    // Generic category matching as fallback
    if (combinedText.includes('phone') || combinedText.includes('smartphone')) 
      return PRODUCT_IMAGES.GALAXY.DEFAULT;
    if (combinedText.includes('tablet')) return PRODUCT_IMAGES.IPAD.DEFAULT;
    if (combinedText.includes('computer')) return PRODUCT_IMAGES.LAPTOP.DEFAULT;
    
    // Final fallback for any product not matched
    return PRODUCT_IMAGES.FALLBACK;
  };

  useEffect(() => {
    // Guard against undefined product
    if (!product) {
      setProgress(0);
      setTimeLeft(language === 'en' ? 'Not available' : 'غير متاح');
      return;
    }
    
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
      if (product.timeLeft && typeof product.timeLeft === 'string') {
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
    // Guard against undefined product
    if (!product) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Product information is not available' : 'معلومات المنتج غير متوفرة',
        variant: 'destructive'
      });
      return;
    }
    
    // Navigate to join page with product details
    navigate(`/join-jam3a?product=${encodeURIComponent(product.name || 'Unknown')}&price=${encodeURIComponent(product.price || '0')}&discount=${encodeURIComponent(product.discount || '0%')}&id=${encodeURIComponent(product.id || '1')}`);
    
    toast({
      title: language === 'en' ? 'Joining Jam3a' : 'جاري الانضمام للجمعة',
      description: language === 'en' ? `You're joining the ${product.name || 'product'} Jam3a` : `أنت تنضم إلى جمعة ${product.name || 'المنتج'}`,
    });
  };

  // Guard against undefined product in render
  if (!product) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={PRODUCT_IMAGES.FALLBACK} 
            alt={language === 'en' ? 'Product unavailable' : 'المنتج غير متوفر'} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="p-4">
            <h3 className="font-semibold">{language === 'en' ? 'Product unavailable' : 'المنتج غير متوفر'}</h3>
            <p className="text-sm text-gray-500">{language === 'en' ? 'Please try again later' : 'يرجى المحاولة لاحقًا'}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={getProductImage()} 
          alt={product.name || (language === 'en' ? 'Product' : 'منتج')} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = PRODUCT_IMAGES.FALLBACK;
          }}
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
