import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/layout/Header';

const BilingualProductListing = () => {
  const { language } = useLanguage();
  
  // Sample products data
  const products = [
    {
      id: 1,
      title_en: "Smart Watch Pro",
      title_ar: "ساعة ذكية برو",
      description_en: "Track fitness, receive notifications, and more",
      description_ar: "تتبع اللياقة البدنية، واستلام الإشعارات، والمزيد",
      price: 149.99,
      rating: 4.8,
      reviews: 124,
      image: "/images/products/smartwatch.jpg"
    },
    {
      id: 2,
      title_en: "Wireless Earbuds",
      title_ar: "سماعات لاسلكية",
      description_en: "Crystal clear sound with noise cancellation",
      description_ar: "صوت نقي مع إلغاء الضوضاء",
      price: 89.99,
      rating: 4.6,
      reviews: 98,
      image: "/images/products/earbuds.jpg"
    },
    {
      id: 3,
      title_en: "Portable Blender",
      title_ar: "خلاط محمول",
      description_en: "Make smoothies on the go with USB charging",
      description_ar: "اصنع العصائر أثناء التنقل مع شحن USB",
      price: 39.99,
      rating: 4.5,
      reviews: 76,
      image: "/images/products/blender.jpg"
    },
    {
      id: 4,
      title_en: "Smart Home Speaker",
      title_ar: "مكبر صوت منزلي ذكي",
      description_en: "Voice-controlled with premium sound quality",
      description_ar: "التحكم الصوتي مع جودة صوت ممتازة",
      price: 129.99,
      rating: 4.7,
      reviews: 112,
      image: "/images/products/speaker.jpg"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
              {language === 'en' ? 'Popular Products' : 'المنتجات الشائعة'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'en' 
                ? 'Discover our most popular items with group discounts' 
                : 'اكتشف أكثر عناصرنا شيوعًا مع خصومات المجموعة'}
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/shop-jam3a">
              {language === 'en' ? 'View All Products' : 'عرض جميع المنتجات'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="product-card overflow-hidden">
              <div className="relative">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {/* Placeholder for product image */}
                  <div className="h-full w-full bg-secondary/50 flex items-center justify-center">
                    <span className="text-muted-foreground">Product Image</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? product.title_en : product.title_ar}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {language === 'en' ? product.description_en : product.description_ar}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="price-current">${product.price.toFixed(2)}</span>
                  <div className="flex items-center text-sm">
                    <div className="flex items-center text-yellow-500 mr-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1">{product.rating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      ({product.reviews} {language === 'en' ? 'reviews' : 'تقييمات'})
                    </span>
                  </div>
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/product/${product.id}`}>
                    {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BilingualProductListing;
