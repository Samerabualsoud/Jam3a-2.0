import React from 'react';
import { Users, Timer, Share2, ShoppingBag, Package, UserPlus, TrendingUp, Truck } from 'lucide-react';
import { useLanguage } from './Header';

const HowItWorks = () => {
  const { language } = useLanguage();

  const steps = [
    {
      icon: <Package className="h-10 w-10 text-jam3a-purple" />,
      title: {
        en: "Choose a Product Category",
        ar: "اختر فئة المنتج"
      },
      description: {
        en: "Select a product category you're interested in, such as smartphones, laptops, or audio devices.",
        ar: "حدد فئة المنتج التي تهتم بها، مثل الهواتف الذكية أو أجهزة الكمبيوتر المحمولة أو الأجهزة الصوتية."
      }
    },
    {
      icon: <UserPlus className="h-10 w-10 text-jam3a-purple" />,
      title: {
        en: "Join or Create a Group",
        ar: "انضم أو أنشئ مجموعة"
      },
      description: {
        en: "Join an existing group for your chosen category or start a new one and set a target group size.",
        ar: "انضم إلى مجموعة موجودة لفئة المنتج التي اخترتها أو ابدأ مجموعة جديدة وحدد حجم المجموعة المستهدف."
      }
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-jam3a-purple" />,
      title: {
        en: "Reach Target Group Size",
        ar: "الوصول إلى حجم المجموعة المستهدف"
      },
      description: {
        en: "Share your group with others interested in the same category until you reach the target size for bulk pricing.",
        ar: "شارك مجموعتك مع آخرين مهتمين بنفس الفئة حتى تصل إلى الحجم المستهدف للحصول على أسعار الجملة."
      }
    },
    {
      icon: <Truck className="h-10 w-10 text-jam3a-purple" />,
      title: {
        en: "Unlock Bulk Discounts",
        ar: "احصل على خصومات الجملة"
      },
      description: {
        en: "Once the group target is reached, we negotiate with suppliers for the best bulk deal and coordinate delivery.",
        ar: "بمجرد الوصول إلى هدف المجموعة، نتفاوض مع الموردين للحصول على أفضل صفقة بالجملة وتنسيق التوصيل."
      }
    }
  ];

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {language === 'en' ? 'How Jam3a Works' : 'كيف تعمل جمعة'}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {language === 'en' 
              ? 'Group together with others to unlock exclusive bulk deals from suppliers' 
              : 'اجتمع مع الآخرين للحصول على صفقات حصرية بالجملة من الموردين'}
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-jam3a-purple/10">
                {step.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{step.title[language]}</h3>
              <p className="mt-2 text-muted-foreground">{step.description[language]}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
