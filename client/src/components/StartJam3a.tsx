import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/layout/Header';

const StartJam3a = () => {
  const { language } = useLanguage();
  
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              {language === 'en' 
                ? 'Ready to Start Your Own Jam3a?' 
                : 'هل أنت مستعد لبدء جمعتك الخاصة؟'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'en'
                ? 'Create your own group purchase and invite friends, family, or colleagues to join. It\'s easy to get started!'
                : 'أنشئ عملية شراء جماعية خاصة بك وادعُ الأصدقاء أو العائلة أو الزملاء للانضمام. من السهل البدء!'}
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary font-bold text-xs">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'en' ? 'Choose a Product' : 'اختر منتجًا'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'en'
                      ? 'Select from our marketplace or request a custom product.'
                      : 'اختر من سوقنا أو اطلب منتجًا مخصصًا.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary font-bold text-xs">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'en' ? 'Set Group Size' : 'حدد حجم المجموعة'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'en'
                      ? 'Decide how many people need to join to unlock the deal.'
                      : 'قرر عدد الأشخاص الذين يحتاجون إلى الانضمام لفتح الصفقة.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary font-bold text-xs">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'en' ? 'Share & Save' : 'شارك ووفر'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'en'
                      ? 'Invite others to join and everyone saves when the group is complete.'
                      : 'ادعُ الآخرين للانضمام ويوفر الجميع عندما تكتمل المجموعة.'}
                  </p>
                </div>
              </div>
            </div>
            <Button asChild size="lg" className="jam3a-button-primary">
              <Link to="/start-jam3a">
                {language === 'en' ? 'Start a Jam3a' : 'ابدأ جمعة'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-8 relative">
              <div className="absolute -top-6 -left-6 bg-background rounded-lg p-4 shadow-lg border border-border hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {language === 'en' ? '10,000+ Users' : '+10,000 مستخدم'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Have started a Jam3a' : 'بدأوا جمعة'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-background rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Electronics Group Buy' : 'شراء جماعي للإلكترونيات'}
                  </h4>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {language === 'en' ? '6/8 joined' : 'انضم 6/8'}
                    </span>
                    <span className="text-primary font-medium">
                      {language === 'en' ? '75% complete' : 'اكتمل 75%'}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Home Goods Group Buy' : 'شراء جماعي للسلع المنزلية'}
                  </h4>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {language === 'en' ? '4/10 joined' : 'انضم 4/10'}
                    </span>
                    <span className="text-primary font-medium">
                      {language === 'en' ? '40% complete' : 'اكتمل 40%'}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Fashion Group Buy' : 'شراء جماعي للأزياء'}
                  </h4>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {language === 'en' ? '2/6 joined' : 'انضم 2/6'}
                    </span>
                    <span className="text-primary font-medium">
                      {language === 'en' ? '33% complete' : 'اكتمل 33%'}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartJam3a;
