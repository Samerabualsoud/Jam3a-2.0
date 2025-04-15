import React from 'react';
import { ArrowRight, ShoppingBag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/layout/Header';

const FeaturedDeals = () => {
  const { language } = useLanguage();
  
  // Sample featured deals data
  const featuredDeals = language === 'en' 
    ? [
        {
          id: 1,
          title: "Premium Wireless Headphones",
          description: "Noise-cancelling with 30-hour battery life",
          originalPrice: 299.99,
          discountedPrice: 199.99,
          image: "/images/products/headphones.jpg",
          progress: 75,
          timeLeft: "2 days",
          participants: 6,
          maxParticipants: 8
        },
        {
          id: 2,
          title: "Smart Home Security System",
          description: "Complete home protection with mobile alerts",
          originalPrice: 499.99,
          discountedPrice: 349.99,
          image: "/images/products/security.jpg",
          progress: 50,
          timeLeft: "4 days",
          participants: 4,
          maxParticipants: 8
        },
        {
          id: 3,
          title: "Professional Kitchen Mixer",
          description: "10-speed stand mixer with stainless steel bowl",
          originalPrice: 399.99,
          discountedPrice: 279.99,
          image: "/images/products/mixer.jpg",
          progress: 25,
          timeLeft: "5 days",
          participants: 2,
          maxParticipants: 8
        }
      ]
    : [
        {
          id: 1,
          title: "سماعات لاسلكية متميزة",
          description: "إلغاء الضوضاء مع عمر بطارية 30 ساعة",
          originalPrice: 299.99,
          discountedPrice: 199.99,
          image: "/images/products/headphones.jpg",
          progress: 75,
          timeLeft: "يومان",
          participants: 6,
          maxParticipants: 8
        },
        {
          id: 2,
          title: "نظام أمان المنزل الذكي",
          description: "حماية منزلية كاملة مع تنبيهات للهاتف المحمول",
          originalPrice: 499.99,
          discountedPrice: 349.99,
          image: "/images/products/security.jpg",
          progress: 50,
          timeLeft: "4 أيام",
          participants: 4,
          maxParticipants: 8
        },
        {
          id: 3,
          title: "خلاط مطبخ احترافي",
          description: "خلاط بـ 10 سرعات مع وعاء من الفولاذ المقاوم للصدأ",
          originalPrice: 399.99,
          discountedPrice: 279.99,
          image: "/images/products/mixer.jpg",
          progress: 25,
          timeLeft: "5 أيام",
          participants: 2,
          maxParticipants: 8
        }
      ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
              {language === 'en' ? 'Featured Deals' : 'صفقات مميزة'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'en' 
                ? 'Join these active deals before they expire!' 
                : 'انضم إلى هذه الصفقات النشطة قبل انتهاء صلاحيتها!'}
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/shop-jam3a">
              {language === 'en' ? 'View All Deals' : 'عرض جميع الصفقات'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDeals.map((deal) => (
            <div key={deal.id} className="product-card overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="badge-discount">
                  {language === 'en' 
                    ? `${Math.round((1 - deal.discountedPrice / deal.originalPrice) * 100)}% OFF` 
                    : `خصم ${Math.round((1 - deal.discountedPrice / deal.originalPrice) * 100)}%`}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
                <p className="text-muted-foreground mb-3">{deal.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="price-current">${deal.discountedPrice.toFixed(2)}</span>
                    <span className="price-original ml-2">${deal.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {deal.timeLeft}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="progress-bar">
                    <div className="progress-value" style={{ width: `${deal.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>
                      {language === 'en' 
                        ? `${deal.participants}/${deal.maxParticipants} joined` 
                        : `${deal.participants}/${deal.maxParticipants} انضموا`}
                    </span>
                    <span>
                      {language === 'en' 
                        ? `${deal.progress}% complete` 
                        : `${deal.progress}% مكتمل`}
                    </span>
                  </div>
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/join-jam3a/${deal.id}`}>
                    {language === 'en' ? 'Join This Deal' : 'انضم إلى هذه الصفقة'}
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

export default FeaturedDeals;
