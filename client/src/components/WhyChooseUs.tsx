import React from 'react';
import { Shield, Users, CreditCard, Clock } from 'lucide-react';
import { useLanguage } from '@/components/layout/Header';

const WhyChooseUs = () => {
  const { language } = useLanguage();
  
  const features = language === 'en' 
    ? [
        {
          icon: <Users className="h-8 w-8 text-primary" />,
          title: "Community Power",
          description: "Join forces with others to unlock exclusive discounts that aren't available to individual shoppers."
        },
        {
          icon: <Shield className="h-8 w-8 text-primary" />,
          title: "Secure Transactions",
          description: "Your payments are protected with bank-level security and only processed when deals are confirmed."
        },
        {
          icon: <CreditCard className="h-8 w-8 text-primary" />,
          title: "Save Money",
          description: "Get access to wholesale prices and bulk discounts without having to buy in large quantities yourself."
        },
        {
          icon: <Clock className="h-8 w-8 text-primary" />,
          title: "Time-Limited Deals",
          description: "Our deals are time-sensitive to ensure you always get the freshest products and latest items."
        }
      ]
    : [
        {
          icon: <Users className="h-8 w-8 text-primary" />,
          title: "قوة المجتمع",
          description: "انضم إلى الآخرين للحصول على خصومات حصرية غير متاحة للمتسوقين الأفراد."
        },
        {
          icon: <Shield className="h-8 w-8 text-primary" />,
          title: "معاملات آمنة",
          description: "مدفوعاتك محمية بأمان على مستوى البنوك ولا تتم معالجتها إلا عند تأكيد الصفقات."
        },
        {
          icon: <CreditCard className="h-8 w-8 text-primary" />,
          title: "وفر المال",
          description: "احصل على أسعار الجملة وخصومات الشراء بكميات كبيرة دون الحاجة إلى الشراء بكميات كبيرة بنفسك."
        },
        {
          icon: <Clock className="h-8 w-8 text-primary" />,
          title: "صفقات محدودة الوقت",
          description: "صفقاتنا محدودة بوقت لضمان حصولك دائمًا على أحدث المنتجات وأحدث العناصر."
        }
      ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {language === 'en' ? 'Why Choose Jam3a?' : 'لماذا تختار جمعة؟'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'We bring people together to save money and build community through group purchasing.' 
              : 'نجمع الناس معًا لتوفير المال وبناء المجتمع من خلال الشراء الجماعي.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="jam3a-card text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-secondary/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Join Over 10,000 Happy Shoppers' : 'انضم إلى أكثر من 10,000 متسوق سعيد'}
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {language === 'en' 
              ? 'Our community has saved over $500,000 through group purchases in the last year alone.' 
              : 'وفر مجتمعنا أكثر من 500,000 دولار من خلال عمليات الشراء الجماعية في العام الماضي وحده.'}
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">30%</div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' ? 'Average Savings' : 'متوسط التوفير'}
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">15k+</div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' ? 'Completed Deals' : 'صفقات مكتملة'}
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">4.8/5</div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' ? 'Customer Rating' : 'تقييم العملاء'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
