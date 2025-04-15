
import React from 'react';
import { BadgePercent, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { useLanguage } from './Header';

const WhyChooseUs = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: <BadgePercent className="h-10 w-10 text-jam3a-purple" />,
      title: {
        en: "Better Prices",
        ar: "أسعار أفضل"
      },
      description: {
        en: "Unlock discounts of up to 30% when you buy together with others.",
        ar: "احصل على خصومات تصل إلى 30% عند الشراء مع آخرين."
      }
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-jam3a-purple" />,
      title: {
        en: "100% Secure",
        ar: "آمن 100%"
      },
      description: {
        en: "Your payment is only processed when the group is successfully formed.",
        ar: "يتم معالجة الدفع فقط عند تكوين المجموعة بنجاح."
      }
    },
    {
      icon: <Clock className="h-10 w-10 text-jam3a-purple" />,
      title: {
        en: "Fast Delivery",
        ar: "توصيل سريع"
      },
      description: {
        en: "Receive your products within 2-5 business days across Saudi Arabia.",
        ar: "استلم منتجاتك خلال 2-5 أيام عمل في جميع أنحاء المملكة العربية السعودية."
      }
    },
    {
      icon: <CreditCard className="h-10 w-10 text-jam3a-purple" />,
      title: {
        en: "Multiple Payment Options",
        ar: "خيارات دفع متعددة"
      },
      description: {
        en: "Pay with Mada, STC Pay, Apple Pay, or credit cards.",
        ar: "ادفع باستخدام مدى، STC Pay، Apple Pay، أو بطاقات الائتمان."
      }
    }
  ];

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {language === 'en' ? 'Why Choose Jam3a' : 'لماذا تختار جمعة'}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {language === 'en'
              ? "We're revolutionizing shopping in Saudi Arabia through the power of group buying"
              : "نحن نُحدث ثورة في التسوق في المملكة العربية السعودية من خلال قوة الشراء الجماعي"}
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-jam3a-purple/10">
                {feature.icon}
              </div>
              <h3 className="mt-3 text-xl font-semibold">{feature.title[language]}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description[language]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
