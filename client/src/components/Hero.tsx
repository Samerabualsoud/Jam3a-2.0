import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/layout/Header';

const Hero = () => {
  const { language } = useLanguage();
  
  return (
    <section className="hero-section">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text">
              {language === 'en' 
                ? 'Group Shopping Made Simple' 
                : 'التسوق الجماعي بطريقة سهلة'}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {language === 'en'
                ? 'Join forces with friends and family to unlock exclusive deals and discounts on your favorite products.'
                : 'انضم إلى الأصدقاء والعائلة للحصول على عروض وخصومات حصرية على منتجاتك المفضلة.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="jam3a-button-primary">
                <Link to="/shop-jam3a">
                  {language === 'en' ? 'Shop Deals' : 'تسوق العروض'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="jam3a-button-outline">
                <Link to="/how-it-works">
                  {language === 'en' ? 'How It Works' : 'كيف تعمل'}
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <img 
              src="/images/hero-image.jpg" 
              alt={language === 'en' ? "Group shopping illustration" : "رسم توضيحي للتسوق الجماعي"} 
              className="rounded-xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-background rounded-lg p-4 shadow-lg border border-border hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">30%</span>
                </div>
                <div>
                  <p className="font-medium">
                    {language === 'en' ? 'Average Savings' : 'متوسط التوفير'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'When shopping with Jam3a' : 'عند التسوق مع جمعة'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
