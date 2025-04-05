import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Timer, 
  Users, 
  ChevronRight, 
  ChevronLeft,
  BadgePercent,
  Clock,
  Shield,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from './Header';

interface Product {
  id: number;
  image: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  originalPrice: number;
  groupPrices: {
    minCount: number;
    price: number;
  }[];
  timeLeft: {
    en: string;
    ar: string;
  };
  joinedCount: number;
  totalCount: number;
  progress: number;
  tag?: {
    en: string;
    ar: string;
    color: string;
  };
}

const BilingualProductListing: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === 'ar';

  const productData: Product[] = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: {
        en: "iPhone 16 Pro Max 256GB",
        ar: "آيفون 16 برو ماكس 256 جيجابايت"
      },
      description: {
        en: "Experience the latest innovation with revolutionary camera and A18 Pro chip",
        ar: "استمتع بأحدث الابتكارات مع كاميرا ثورية وشريحة A18 برو"
      },
      originalPrice: 4999,
      groupPrices: [
        { minCount: 2, price: 4799 },
        { minCount: 3, price: 4599 },
        { minCount: 5, price: 4199 }
      ],
      timeLeft: {
        en: "1 day left",
        ar: "باقي يوم واحد"
      },
      joinedCount: 3,
      totalCount: 5,
      progress: 60,
      tag: {
        en: "HOT DEAL",
        ar: "صفقة ساخنة",
        color: "destructive"
      }
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: {
        en: "Samsung Galaxy S25 Ultra",
        ar: "سامسونج جالاكسي S25 الترا"
      },
      description: {
        en: "Unleash creativity with AI-powered tools and 200MP camera system",
        ar: "أطلق العنان للإبداع مع أدوات مدعومة بالذكاء الاصطناعي ونظام كاميرا بدقة 200 ميجابكسل"
      },
      originalPrice: 4599,
      groupPrices: [
        { minCount: 2, price: 4399 },
        { minCount: 4, price: 4099 },
        { minCount: 6, price: 3899 }
      ],
      timeLeft: {
        en: "2 days left",
        ar: "باقي يومان"
      },
      joinedCount: 4,
      totalCount: 6,
      progress: 67
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: {
        en: "Galaxy Z Fold 6",
        ar: "جالاكسي زد فولد 6"
      },
      description: {
        en: "Multitask like never before with a stunning foldable display",
        ar: "تعدد المهام كما لم يحدث من قبل مع شاشة قابلة للطي مذهلة"
      },
      originalPrice: 6999,
      groupPrices: [
        { minCount: 3, price: 6699 },
        { minCount: 5, price: 6299 },
        { minCount: 7, price: 5799 }
      ],
      timeLeft: {
        en: "12 hours left",
        ar: "باقي 12 ساعة"
      },
      joinedCount: 7,
      totalCount: 10,
      progress: 70,
      tag: {
        en: "TRENDING",
        ar: "رائج",
        color: "default"
      }
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: {
        en: "Galaxy Z Flip 6",
        ar: "جالاكسي زد فليب 6"
      },
      description: {
        en: "Compact, stylish foldable with powerful camera and long-lasting battery",
        ar: "هاتف قابل للطي أنيق ومدمج مع كاميرا قوية وبطارية طويلة الأمد"
      },
      originalPrice: 3999,
      groupPrices: [
        { minCount: 2, price: 3799 },
        { minCount: 3, price: 3599 },
        { minCount: 5, price: 3299 }
      ],
      timeLeft: {
        en: "3 days left",
        ar: "باقي 3 أيام"
      },
      joinedCount: 2,
      totalCount: 5,
      progress: 40,
      tag: {
        en: "NEW ARRIVAL",
        ar: "وصل حديثاً",
        color: "secondary"
      }
    },
  ];

  // Function to handle joining a specific Jam3a
  const handleJoinJam3a = (product: Product) => {
    const productName = product.title[language];
    const productPrice = product.groupPrices[product.groupPrices.length - 1].price;
    const discount = Math.round((product.originalPrice - productPrice) / product.originalPrice * 100);
    
    navigate(`/join-jam3a?product=${encodeURIComponent(productName)}&price=${productPrice} SAR&discount=${discount}%&id=${product.id}`);
  };

  // Function to get fallback image based on product title
  const getFallbackImage = (productTitle: string) => {
    // Map of keywords to relevant image URLs
    const imageMap = {
      'iphone': 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'galaxy': 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'fold': 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'flip': 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'samsung': 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'phone': 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'mobile': 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'tablet': 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'laptop': 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'watch': 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'headphone': 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'speaker': 'https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    };
    
    // Check if product title contains any of the keywords
    const lowerTitle = productTitle.toLowerCase();
    for (const [keyword, imageUrl] of Object.entries(imageMap)) {
      if (lowerTitle.includes(keyword)) {
        return imageUrl;
      }
    }
    
    // Default fallback image if no keywords match
    return 'https://images.pexels.com/photos/1337753/pexels-photo-1337753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-10 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl gradient-text" dir={isRtl ? 'rtl' : 'ltr'}>
            {isRtl ? 'عروض المجموعات الديناميكية' : 'Dynamic Group Deals'}
          </h2>
          <p className="text-muted-foreground max-w-[800px] md:text-lg" dir={isRtl ? 'rtl' : 'ltr'}>
            {isRtl 
              ? 'شاهد انخفاض الأسعار مع انضمام المزيد من الأشخاص. كلما كبرت المجموعة، زادت التوفير!'
              : 'Watch prices drop as more people join. The bigger the group, the bigger the savings!'}
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {productData.map((product, index) => (
                <CarouselItem 
                  key={product.id} 
                  className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="animate-slide-up h-full">
                    <Card className="product-card h-full flex flex-col">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title[language]}
                          className="product-image"
                          onError={(e) => {
                            e.currentTarget.src = getFallbackImage(product.title.en);
                          }}
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          <Badge 
                            variant="outline" 
                            className="discount-badge"
                          >
                            {Math.round((product.originalPrice - product.groupPrices[product.groupPrices.length - 1].price) / product.originalPrice * 100)}% {isRtl ? 'خصم' : 'OFF'}
                          </Badge>
                          
                          {product.tag && (
                            <Badge 
                              variant={product.tag.color as any} 
                              className="tag-badge"
                            >
                              {product.tag[language]}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className="p-4 flex-grow">
                        <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-3">
                          <h3 className="font-semibold text-lg line-clamp-1">{product.title[language]}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description[language]}</p>
                          
                          <div className="mt-2 flex items-end gap-2">
                            <span className="price-current">
                              {product.groupPrices[product.groupPrices.length - 1].price} {isRtl ? 'ريال' : 'SAR'}
                            </span>
                            <span className="price-original">
                              {product.originalPrice} {isRtl ? 'ريال' : 'SAR'}
                            </span>
                          </div>

                          <div className="mt-3 space-y-3 bg-secondary/30 p-3 rounded-lg border">
                            <h4 className="text-sm font-medium flex items-center">
                              <BadgePercent className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
                              {isRtl ? 'أسعار المجموعة' : 'Group Pricing'}
                            </h4>
                            <div className="space-y-1 text-sm">
                              {product.groupPrices.map((pricing, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>{pricing.minCount}+ {isRtl ? 'أشخاص' : 'people'}</span>
                                  <span className="font-medium">{pricing.price} {isRtl ? 'ريال' : 'SAR'}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span>
                                  {product.joinedCount} / {product.totalCount} {isRtl ? 'انضموا' : 'joined'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Timer className="h-3.5 w-3.5" />
                                <span>{product.timeLeft[language]}</span>
                              </div>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-value" style={{ width: `${product.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-4 pt-0 mt-auto">
                        <Button 
                          className="w-full jam3a-button-primary"
                          onClick={() => handleJoinJam3a(product)}
                        >
                          {isRtl ? 'انضم للجمعة' : 'Join Jam3a'}
                        </Button>
                        <div className="flex justify-between w-full mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {isRtl ? 'وقت محدود' : 'Limited Time'}
                          </div>
                          <div className="flex items-center">
                            <Shield className="h-3.5 w-3.5 mr-1" />
                            {isRtl ? 'ضمان استرداد الأموال' : 'Money-back Guarantee'}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="carousel-nav-button -left-12" />
              <CarouselNext className="carousel-nav-button -right-12" />
            </div>
          </Carousel>
          
          <div className="mt-10 text-center">
            <Link 
              to="/shop-all-jam3as" 
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <span className="font-medium">
                {isRtl ? 'عرض جميع الجمعات' : 'View All Jam3as'}
              </span>
              {isRtl ? (
                <ChevronLeft className="ml-1 h-4 w-4" />
              ) : (
                <ChevronRight className="ml-1 h-4 w-4" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BilingualProductListing;
