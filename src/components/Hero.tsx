import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isRtl = language === 'ar';
  
  const handleShopDeals = () => {
    navigate('/shop-jam3a');
  };
  
  const handleStartJam3a = () => {
    if (isAuthenticated) {
      navigate('/start-jam3a');
    } else {
      // Redirect to login with return URL
      navigate('/login', { state: { returnUrl: '/start-jam3a' } });
    }
  };
  
  const handleJoinJam3a = () => {
    // Navigate to the specific Jam3a with product details
    navigate('/join-jam3a?product=iPhone%2016%20Pro&price=3499%20SAR&discount=12%&id=1');
  };
  
  return (
    <div className="hero-section">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6 animate-slide-up">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary max-w-max">
              <TrendingUp className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              {isRtl ? 'أول منصة للشراء الجماعي بالمملكة 🇸🇦' : "Saudi Arabia's first group-buying platform"}
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" dir={isRtl ? 'rtl' : 'ltr'}>
              {isRtl ? (
                <>
                  نشتري مع بعض،<br />
                  <span className="gradient-text">ونوفّر مع بعض</span>
                </>
              ) : (
                <>
                  Buy Together,<br />
                  <span className="gradient-text">Save Together</span>
                </>
              )}
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl" dir={isRtl ? 'rtl' : 'ltr'}>
              {isRtl 
                ? 'انضم مع الربع والعيال وخذ خصومات حصرية على أفضل المنتجات التقنية والأجهزة الذكية بأسعار ما تلقاها بأي مكان!'
                : 'Join forces with friends and family to unlock exclusive discounts on premium tech products and more.'}
            </p>
            <div className={`flex flex-col space-y-3 sm:flex-row ${isRtl ? 'sm:space-x-reverse sm:space-x-4' : 'sm:space-x-4'} sm:space-y-0`}>
              <Button size="lg" className="gradient-bg hover:opacity-90 transition-opacity text-white" onClick={handleShopDeals}>
                {isRtl ? 'شوف العروض الحالية' : 'Shop Deals'}
              </Button>
              <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10 transition-colors" onClick={handleStartJam3a}>
                {isRtl ? 'سوّي جمعتك الخاصة' : 'Start Your Own Jam3a'}
              </Button>
            </div>
            <div className="mt-2 flex flex-col space-y-3 text-sm text-muted-foreground" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="flex items-center">
                <CheckCircle2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 text-primary`} />
                <span>{isRtl ? 'وفّر لين 30% على أحدث الأجهزة والجوالات' : 'Save up to 30% on the latest tech gadgets'}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 text-primary`} />
                <span>{isRtl ? 'ضمان استرداد كامل الفلوس إذا ما اكتملت المجموعة' : '100% money-back guarantee if the group doesn\'t form'}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 text-primary`} />
                <span>{isRtl ? 'موثوق من أكثر من 10,000 مستخدم بالسعودية' : 'Trusted by 10,000+ shoppers across Saudi Arabia'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-64 w-64 rounded-full bg-primary/30 blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 h-64 w-64 rounded-full bg-[hsl(var(--jam3a-accent))]]/20 blur-3xl"></div>
              <div className="product-card relative overflow-hidden border border-border bg-card shadow-xl max-w-md mx-auto">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1695048133142-1a20484bce71?q=80&w=2070&auto=format&fit=crop" 
                    alt="iPhone 16 Pro" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                    12% {isRtl ? 'خصم' : 'OFF'}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold">{isRtl ? 'جمعة آيفون 16 برو' : 'iPhone 16 Pro Jam3a'}</span>
                    </div>
                    <div className="badge-status bg-green-100 text-green-800">
                      {isRtl ? 'نشطة' : 'Active'}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{isRtl ? 'سعر المجموعة' : 'Group price'}</p>
                        <div className="flex items-center gap-2">
                          <span className="price-current">3,499 SAR</span>
                          <span className="price-original">3,999 SAR</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{isRtl ? 'الوقت المتبقي' : 'Time left'}</p>
                        <p className="font-medium">23:45:12</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>{isRtl ? '4 من 5 انضموا' : '4 of 5 joined'}</span>
                      <span className="text-primary font-medium">{isRtl ? 'اكتمل 80%' : '80% complete'}</span>
                    </div>
                    <div className="mt-2 progress-bar">
                      <div className="progress-value" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      className="w-full gradient-bg hover:opacity-90 transition-opacity flex items-center justify-center gap-2" 
                      onClick={handleJoinJam3a}
                    >
                      {isRtl ? 'انضم للجمعة هذي' : 'Join This Jam3a'}
                      {isRtl ? null : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
