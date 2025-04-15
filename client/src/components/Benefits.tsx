import React from 'react';
import { Sparkles, Truck, BadgePercent, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/layout/Header';

const Benefits = () => {
  const { language } = useLanguage();
  
  const benefits = language === 'en' 
    ? [
        {
          icon: <Sparkles className="h-8 w-8 text-primary" />,
          title: "Premium Quality",
          description: "We partner with trusted suppliers to ensure all products meet our high quality standards."
        },
        {
          icon: <Truck className="h-8 w-8 text-primary" />,
          title: "Fast Delivery",
          description: "Enjoy quick and reliable delivery options for all your group purchases."
        },
        {
          icon: <BadgePercent className="h-8 w-8 text-primary" />,
          title: "Exclusive Discounts",
          description: "Access special deals and discounts available only to Jam3a community members."
        },
        {
          icon: <ShieldCheck className="h-8 w-8 text-primary" />,
          title: "Buyer Protection",
          description: "Shop with confidence knowing your purchases are protected by our guarantee."
        }
      ]
    : [
        {
          icon: <Sparkles className="h-8 w-8 text-primary" />,
          title: "جودة ممتازة",
          description: "نتعاون مع موردين موثوقين لضمان تلبية جميع المنتجات لمعايير الجودة العالية لدينا."
        },
        {
          icon: <Truck className="h-8 w-8 text-primary" />,
          title: "توصيل سريع",
          description: "استمتع بخيارات التوصيل السريعة والموثوقة لجميع مشترياتك الجماعية."
        },
        {
          icon: <BadgePercent className="h-8 w-8 text-primary" />,
          title: "خصومات حصرية",
          description: "الوصول إلى صفقات وخصومات خاصة متاحة فقط لأعضاء مجتمع جمعة."
        },
        {
          icon: <ShieldCheck className="h-8 w-8 text-primary" />,
          title: "حماية المشتري",
          description: "تسوق بثقة مع العلم أن مشترياتك محمية بضماننا."
        }
      ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {language === 'en' ? 'Benefits of Shopping with Jam3a' : 'فوائد التسوق مع جمعة'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Discover the advantages of our community-powered shopping platform.' 
              : 'اكتشف مزايا منصة التسوق المدعومة من المجتمع لدينا.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="jam3a-card text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-primary/10 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Our Customer Satisfaction Promise' : 'وعدنا برضا العملاء'}
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {language === 'en' 
              ? 'We stand behind every product and service we offer with our 100% satisfaction guarantee.' 
              : 'نحن ندعم كل منتج وخدمة نقدمها بضمان الرضا بنسبة 100٪.'}
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' ? 'Satisfaction Guarantee' : 'ضمان الرضا'}
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' ? 'Customer Support' : 'دعم العملاء'}
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">30+</div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' ? 'Days Return Policy' : 'سياسة الإرجاع لمدة 30 يومًا'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
