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

// Updated product image mapping system using local images
const PRODUCT_IMAGES = {
  // Apple Products
  IPHONE: {
    DEFAULT: '/images/iphone_16_pro_max_desert_titanium.webp',
    '16 PRO': '/images/iphone_16_pro_max_desert_titanium.webp',
    '16 PRO MAX': '/images/iphone_16_pro_max_desert_titanium.webp',
    '16': '/images/iphone_16_pink.webp',
    '15': '/images/iphone_16_pink.webp',
    '15 PRO': '/images/iphone_16_pro_max_desert_titanium.webp',
  },
  MACBOOK: {
    DEFAULT: '/images/macbook_air_m1_space_grey.webp',
    'PRO': '/images/macbook_air_m4.webp',
    'AIR': '/images/macbook_air_m1_space_grey.webp',
    'M1': '/images/macbook_air_m1_space_grey.webp',
    'M4': '/images/macbook_air_m4.webp',
  },
  IPAD: {
    DEFAULT: '/images/iphone_16_pink.webp',
    'PRO': '/images/iphone_16_pink.webp',
    'AIR': '/images/iphone_16_pink.webp',
    'MINI': '/images/iphone_16_pink.webp',
  },
  AIRPODS: {
    DEFAULT: '/images/iphone_16_pink.webp',
    'PRO': '/images/iphone_16_pink.webp',
    'MAX': '/images/iphone_16_pink.webp',
  },
  WATCH: {
    DEFAULT: '/images/iphone_16_pink.webp',
    'SERIES 9': '/images/iphone_16_pink.webp',
    'ULTRA': '/images/iphone_16_pink.webp',
  },
  
  // Samsung Products
  GALAXY: {
    DEFAULT: '/images/samsung_galaxy_s23_fe_clear.webp',
    'S25': '/images/samsung_galaxy_s23_fe_clear.webp',
    'S25 ULTRA': '/images/samsung_galaxy_s23_fe_mint.webp',
    'S24': '/images/samsung_galaxy_s23_fe_clear.webp',
    'S24 ULTRA': '/images/samsung_galaxy_s23_fe_mint.webp',
    'S23': '/images/samsung_galaxy_s23_fe_clear.webp',
    'S23 FE': '/images/samsung_galaxy_s23_fe_clear.webp',
    'NOTE': '/images/samsung_galaxy_s23_fe_mint.webp',
  },
  FOLD: {
    DEFAULT: '/images/samsung_galaxy_s23_fe_mint.webp',
    '6': '/images/samsung_galaxy_s23_fe_mint.webp',
    '5': '/images/samsung_galaxy_s23_fe_mint.webp',
    '4': '/images/samsung_galaxy_s23_fe_mint.webp',
  },
  FLIP: {
    DEFAULT: '/images/samsung_galaxy_s23_fe_clear.webp',
    '6': '/images/samsung_galaxy_s23_fe_clear.webp',
    '5': '/images/samsung_galaxy_s23_fe_clear.webp',
    '4': '/images/samsung_galaxy_s23_fe_clear.webp',
  },
  
  // Other Electronics
  TV: {
    DEFAULT: '/images/macbook_air_m4.webp',
    'SAMSUNG': '/images/macbook_air_m4.webp',
    'LG': '/images/macbook_air_m4.webp',
    'SONY': '/images/macbook_air_m4.webp',
  },
  HEADPHONES: {
    DEFAULT: '/images/macbook_air_m1_space_grey.webp',
    'SONY': '/images/macbook_air_m1_space_grey.webp',
    'BOSE': '/images/macbook_air_m1_space_grey.webp',
    'BEATS': '/images/macbook_air_m1_space_grey.webp',
  },
  LAPTOP: {
    DEFAULT: '/images/macbook_air_m1_space_grey.webp',
    'DELL': '/images/macbook_air_m4.webp',
    'HP': '/images/macbook_air_m1_space_grey.webp',
    'LENOVO': '/images/macbook_air_m4.webp',
    'ASUS': '/images/macbook_air_m1_space_grey.webp',
  },
  CAMERA: {
    DEFAULT: '/images/iphone_16_pro_max_desert_titanium.webp',
    'CANON': '/images/iphone_16_pro_max_desert_titanium.webp',
    'NIKON': '/images/iphone_16_pro_max_desert_titanium.webp',
    'SONY': '/images/iphone_16_pro_max_desert_titanium.webp',
  },
  GAMING: {
    DEFAULT: '/images/macbook_air_m4.webp',
    'PLAYSTATION': '/images/macbook_air_m4.webp',
    'XBOX': '/images/macbook_air_m4.webp',
    'NINTENDO': '/images/macbook_air_m4.webp',
  },
  
  // Fallback image for any product not matched
  FALLBACK: '/images/iphone_16_pink.webp'
};

// Default placeholder image URL for when local images fail to load
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=Product+Image';

const BilingualProductListing = ({ product, language }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Ensure we have a valid product object
  const safeProduct = product ? product : {
    name: 'Product Name',
    description: 'Product Description',
    price: 0,
    regularPrice: 0,
    jam3aPrice: 0,
    discountPercentage: 0,
    currentParticipants: 0,
    maxParticipants: 10,
    featured: false,
    status: 'active'
  };
  
  // Enhanced product image selection based on product name and description
  const getProductImage = () => {
    // If image loading previously failed, use placeholder
    if (imageError) {
      return PLACEHOLDER_IMAGE;
    }
    
    // Guard against undefined product
    if (!safeProduct) {
      return PRODUCT_IMAGES.FALLBACK;
    }
    
    // If product already has an image URL, use it
    if (safeProduct.image && typeof safeProduct.image === 'string') {
      if (safeProduct.image.startsWith('http')) {
        return safeProduct.image;
      }
    }
    
    // If product has imageUrl, use it
    if (safeProduct.imageUrl && typeof safeProduct.imageUrl === 'string') {
      if (safeProduct.imageUrl.startsWith('http')) {
        return safeProduct.imageUrl;
      }
    }
    
    const productName = (safeProduct.name || safeProduct.title || '').toLowerCase();
    const productDescription = (safeProduct.description || '').toLowerCase();
    const combinedText = `${productName} ${productDescription}`;
    
    // Try to match product with our image mapping system
    
    // Check for iPhone models
    if (combinedText.includes('iphone')) {
      if (combinedText.includes('16 pro max')) return PRODUCT_IMAGES.IPHONE['16 PRO MAX'];
      if (combinedText.includes('16 pro')) return PRODUCT_IMAGES.IPHONE['16 PRO'];
      if (combinedText.includes('16')) return PRODUCT_IMAGES.IPHONE['16'];
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
      if (combinedText.includes('s23 fe')) return PRODUCT_IMAGES.GALAXY['S23 FE'];
      if (combinedText.includes('s23')) return PRODUCT_IMAGES.GALAXY['S23'];
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
      if (combinedText.includes('m1')) return PRODUCT_IMAGES.MACBOOK['M1'];
      if (combinedText.includes('m4')) return PRODUCT_IMAGES.MACBOOK['M4'];
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
    if (combinedText.includes('watch') && combinedText.includes('apple')) {
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
    
    // Check for Headphone models
    if (combinedText.includes('headphone') || combinedText.includes('earphone') || combinedText.includes('earbud')) {
      if (combinedText.includes('sony')) return PRODUCT_IMAGES.HEADPHONES['SONY'];
      if (combinedText.includes('bose')) return PRODUCT_IMAGES.HEADPHONES['BOSE'];
      if (combinedText.includes('beats')) return PRODUCT_IMAGES.HEADPHONES['BEATS'];
      return PRODUCT_IMAGES.HEADPHONES.DEFAULT;
    }
    
    // Check for Laptop models
    if (combinedText.includes('laptop') || combinedText.includes('notebook')) {
      if (combinedText.includes('dell')) return PRODUCT_IMAGES.LAPTOP['DELL'];
      if (combinedText.includes('hp')) return PRODUCT_IMAGES.LAPTOP['HP'];
      if (combinedText.includes('lenovo')) return PRODUCT_IMAGES.LAPTOP['LENOVO'];
      if (combinedText.includes('asus')) return PRODUCT_IMAGES.LAPTOP['ASUS'];
      return PRODUCT_IMAGES.LAPTOP.DEFAULT;
    }
    
    // Check for Camera models
    if (combinedText.includes('camera') || combinedText.includes('dslr') || combinedText.includes('mirrorless')) {
      if (combinedText.includes('canon')) return PRODUCT_IMAGES.CAMERA['CANON'];
      if (combinedText.includes('nikon')) return PRODUCT_IMAGES.CAMERA['NIKON'];
      if (combinedText.includes('sony')) return PRODUCT_IMAGES.CAMERA['SONY'];
      return PRODUCT_IMAGES.CAMERA.DEFAULT;
    }
    
    // Check for Gaming models
    if (combinedText.includes('gaming') || combinedText.includes('game') || combinedText.includes('console')) {
      if (combinedText.includes('playstation') || combinedText.includes('ps5') || combinedText.includes('ps4')) return PRODUCT_IMAGES.GAMING['PLAYSTATION'];
      if (combinedText.includes('xbox')) return PRODUCT_IMAGES.GAMING['XBOX'];
      if (combinedText.includes('nintendo') || combinedText.includes('switch')) return PRODUCT_IMAGES.GAMING['NINTENDO'];
      return PRODUCT_IMAGES.GAMING.DEFAULT;
    }
    
    // If no match found, return fallback image
    return PRODUCT_IMAGES.FALLBACK;
  };
  
  // Handle image loading errors
  const handleImageError = () => {
    console.warn('Image failed to load, using placeholder');
    setImageError(true);
  };
  
  // Calculate progress for deals
  useEffect(() => {
    if (safeProduct.currentParticipants && safeProduct.maxParticipants) {
      const calculatedProgress = (safeProduct.currentParticipants / safeProduct.maxParticipants) * 100;
      setProgress(calculatedProgress);
    }
    
    if (safeProduct.timeRemaining) {
      setTimeLeft(safeProduct.timeRemaining);
    } else if (safeProduct.expiryDate) {
      try {
        const expiryDate = new Date(safeProduct.expiryDate);
        const now = new Date();
        const diffTime = Math.abs(expiryDate - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTimeLeft(`${diffDays} days`);
      } catch (error) {
        console.error('Error calculating time left:', error);
        setTimeLeft('Limited time');
      }
    }
  }, [safeProduct]);
  
  // Handle product click
  const handleProductClick = () => {
    // Determine if this is a product or deal
    const isDeal = 'jam3aPrice' in safeProduct;
    
    if (isDeal) {
      navigate(`/deal/${safeProduct._id || safeProduct.id}`);
    } else {
      navigate(`/product/${safeProduct._id || safeProduct.id}`);
    }
  };
  
  // Determine if this is a product or deal
  const isDeal = 'jam3aPrice' in safeProduct || 'jam3aId' in safeProduct;
  
  // Get product name/title based on language
  const getProductName = () => {
    if (language === 'ar') {
      return safeProduct.nameAr || safeProduct.titleAr || safeProduct.name || safeProduct.title || 'منتج';
    }
    return safeProduct.name || safeProduct.title || 'Product';
  };
  
  // Get product description based on language
  const getProductDescription = () => {
    if (language === 'ar') {
      return safeProduct.descriptionAr || safeProduct.description || 'وصف المنتج';
    }
    return safeProduct.description || 'Product description';
  };
  
  // Get product price
  const getProductPrice = () => {
    if (isDeal) {
      return safeProduct.jam3aPrice || 0;
    }
    return safeProduct.price || 0;
  };
  
  // Get regular price (for deals)
  const getRegularPrice = () => {
    return safeProduct.regularPrice || safeProduct.price || 0;
  };
  
  // Get discount percentage
  const getDiscountPercentage = () => {
    if (isDeal && safeProduct.discountPercentage) {
      return safeProduct.discountPercentage;
    }
    
    if (isDeal && safeProduct.regularPrice && safeProduct.jam3aPrice) {
      return Math.round(((safeProduct.regularPrice - safeProduct.jam3aPrice) / safeProduct.regularPrice) * 100);
    }
    
    return 0;
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={getProductImage()} 
          alt={getProductName()}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
        />
        {safeProduct.featured && (
          <Badge className="absolute top-2 right-2 bg-primary text-white">
            {language === 'ar' ? 'مميز' : 'Featured'}
          </Badge>
        )}
        {isDeal && getDiscountPercentage() > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {getDiscountPercentage()}% {language === 'ar' ? 'خصم' : 'OFF'}
          </Badge>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-bold line-clamp-1">{getProductName()}</CardTitle>
        <CardDescription className="line-clamp-2 h-10 text-sm">
          {getProductDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        {isDeal ? (
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">{getProductPrice()} SAR</span>
                <span className="text-sm text-gray-500 line-through">{getRegularPrice()} SAR</span>
              </div>
              {language === 'ar' ? (
                <span className="text-xs text-gray-500">
                  {safeProduct.currentParticipants || 0} / {safeProduct.maxParticipants || 0} مشارك
                </span>
              ) : (
                <span className="text-xs text-gray-500">
                  {safeProduct.currentParticipants || 0} / {safeProduct.maxParticipants || 0} joined
                </span>
              )}
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{language === 'ar' ? 'الوقت المتبقي:' : 'Time left:'}</span>
              <span>{timeLeft || (language === 'ar' ? 'وقت محدود' : 'Limited time')}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{getProductPrice()} SAR</span>
            {safeProduct.stock !== undefined && (
              <span className="text-xs text-gray-500">
                {language === 'ar' ? `المخزون: ${safeProduct.stock}` : `Stock: ${safeProduct.stock}`}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="default" 
          className="w-full"
          onClick={handleProductClick}
        >
          {isDeal 
            ? (language === 'ar' ? 'انضم إلى الجمعة' : 'Join Jam3a') 
            : (language === 'ar' ? 'عرض التفاصيل' : 'View Details')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BilingualProductListing;
