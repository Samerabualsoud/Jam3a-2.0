import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  
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
    navigate('/join-jam3a/example-iphone');
  };
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 pt-6 pb-10 md:pt-8 md:pb-16">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAwaDEwODBWOTAwSDB6Ii8+PHBhdGggZD0iTTAgMGwxMDgwIDkwMEgweiIgZmlsbD0idXJsKCNhKSIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIxMDAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjAlIj48c3RvcCBzdG9wLWNvbG9yPSIjOEI1Q0Y2IiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0Q5NDZFRiIgb2Zmc2V0PSIxMDAlIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+')]" style={{ opacity: '0.05' }}></div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col justify-center space-y-3">
            <div className="inline-flex items-center rounded-full border border-jam3a-purple/30 bg-jam3a-purple/10 px-4 py-1 text-sm font-medium text-jam3a-purple">
              <TrendingUp className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'أول منصة للشراء الجماعي بالمملكة 🇸🇦' : "Saudi Arabia's first group-buying platform"}
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {language === 'ar' ? (
                <>
                  نشتري مع بعض،<br />
                  <span className="text-jam3a-purple">ونوفّر مع بعض</span>
                </>
              ) : (
                <>
                  Buy Together,<br />
                  <span className="text-jam3a-purple">Save Together</span>
                </>
              )}
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              {language === 'ar' 
                ? 'انضم مع الربع والعيال وخذ خصومات حصرية على أفضل المنتجات التقنية والأجهزة الذكية بأسعار ما تلقاها بأي مكان!'
                : 'Join forces with friends and family to unlock exclusive discounts on premium tech products and more.'}
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="bg-jam3a-purple hover:bg-jam3a-deep-purple" onClick={handleShopDeals}>
                {language === 'ar' ? 'شوف العروض الحالية' : 'Shop Deals'}
              </Button>
              <Button size="lg" variant="outline" onClick={handleStartJam3a}>
                {language === 'ar' ? 'سوّي جمعتك الخاصة' : 'Start Your Own Jam3a'}
              </Button>
            </div>
            <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-jam3a-purple" />
                <span>{language === 'ar' ? 'وفّر لين 30% على أحدث الأجهزة والجوالات' : 'Save up to 30% on the latest tech gadgets'}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-jam3a-purple" />
                <span>{language === 'ar' ? 'ضمان استرداد كامل الفلوس إذا ما اكتملت المجموعة' : '100% money-back guarantee if the group doesn\'t form'}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-jam3a-purple" />
                <span>{language === 'ar' ? 'موثوق من أكثر من 10,000 مستخدم بالسعودية' : 'Trusted by 10,000+ shoppers across Saudi Arabia'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-64 w-64 rounded-full bg-jam3a-purple/30 blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 h-64 w-64 rounded-full bg-jam3a-accent/20 blur-3xl"></div>
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-jam3a-purple">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold">{language === 'ar' ? 'جمعة آيفون 16 برو' : 'iPhone 16 Pro Jam3a'}</span>
                    </div>
                    <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {language === 'ar' ? 'نشطة' : 'Active'}
                    </div>
                  </div>
                  <div className="mt-3">
                    <img
                      src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80"
                      alt="iPhone 16 Pro"
                      className="h-56 w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{language === 'ar' ? 'سعر المجموعة' : 'Group price'}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">3,499 SAR</span>
                          <span className="text-sm text-muted-foreground line-through">3,999 SAR</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{language === 'ar' ? 'الوقت المتبقي' : 'Time left'}</p>
                        <p className="font-medium">23:45:12</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>{language === 'ar' ? '4 من 5 انضموا' : '4 of 5 joined'}</span>
                      <span className="text-jam3a-purple">{language === 'ar' ? 'اكتمل 80%' : '80% complete'}</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-jam3a-purple" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple" onClick={handleJoinJam3a}>
                      {language === 'ar' ? 'انضم للجمعة هذي' : 'Join This Jam3a'}
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
