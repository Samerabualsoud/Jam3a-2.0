import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/layout/Header';

const HowItWorks = () => {
  const { language } = useLanguage();
  
  const steps = language === 'en' 
    ? [
        {
          title: "Find a Deal",
          description: "Browse our marketplace for exclusive group deals on your favorite products.",
          icon: <ArrowRight className="h-5 w-5 text-primary" />
        },
        {
          title: "Join or Start a Jam3a",
          description: "Join an existing group or start your own and invite friends and family.",
          icon: <Check className="h-5 w-5 text-primary" />
        },
        {
          title: "Complete the Purchase",
          description: "Once the group is full, the deal is unlocked and everyone saves!",
          icon: <Check className="h-5 w-5 text-primary" />
        }
      ]
    : [
        {
          title: "ابحث عن صفقة",
          description: "تصفح سوقنا للحصول على صفقات جماعية حصرية على منتجاتك المفضلة.",
          icon: <ArrowRight className="h-5 w-5 text-primary" />
        },
        {
          title: "انضم أو ابدأ جمعة",
          description: "انضم إلى مجموعة موجودة أو ابدأ مجموعتك الخاصة وادعُ الأصدقاء والعائلة.",
          icon: <Check className="h-5 w-5 text-primary" />
        },
        {
          title: "أكمل عملية الشراء",
          description: "بمجرد اكتمال المجموعة، يتم فتح الصفقة ويوفر الجميع!",
          icon: <Check className="h-5 w-5 text-primary" />
        }
      ];

  return (
    <section className="py-16 bg-background" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {language === 'en' ? 'How Jam3a Works' : 'كيف تعمل جمعة'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join forces with others to unlock exclusive deals and save money on your purchases.' 
              : 'انضم إلى الآخرين لفتح صفقات حصرية وتوفير المال على مشترياتك.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="feature-card">
              <div className="mb-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground">{step.description}</p>
              <div className="mt-4 flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                <div className={`h-1 ${index < 2 ? 'bg-primary/30' : 'bg-muted'} flex-grow ml-2`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
