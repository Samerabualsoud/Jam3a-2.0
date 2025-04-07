
import React, { useState } from 'react';
import { BadgePercent, ShieldCheck, UserPlus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Benefits = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const content = {
    en: {
      title: "Why Choose Jam3a?",
      subtitle: "Discover the Advantages of Social Shopping",
      description: "Jam3a is transforming the way Saudi Arabians shop online by creating a platform where people can join forces to access premium products at unbeatable prices.",
      benefits: [
        {
          icon: <BadgePercent className="h-10 w-10 text-jam3a-purple" />,
          title: "Real Discounts Up to 30%",
          desc: "Unlock genuine savings when you shop together. Our group-buying model gives you access to bulk pricing that individual shoppers can't get elsewhere."
        },
        {
          icon: <ShieldCheck className="h-10 w-10 text-jam3a-purple" />,
          title: "Zero-Risk Payment",
          desc: "Your payment is only processed when the group is complete. If the group doesn't form within the time limit, you won't be charged a single riyal."
        },
        {
          icon: <UserPlus className="h-10 w-10 text-jam3a-purple" />,
          title: "Invite-Based Social Shopping",
          desc: "Share deals with friends and family to complete your group faster. The more people join, the better deals everyone gets."
        },
        {
          icon: <Crown className="h-10 w-10 text-jam3a-purple" />,
          title: "Premium Products at Group Prices",
          desc: "Access high-quality brands and products that would normally be out of reach at individual prices. Enjoy luxury without the premium price tag."
        }
      ],
      cta: "Start Saving Together Today",
      startShopping: "Browse Deals"
    },
    ar: {
      title: "لماذا تختار جمعة؟",
      subtitle: "اكتشف مزايا التسوق الاجتماعي",
      description: "تقوم جمعة بتغيير طريقة تسوق السعوديين عبر الإنترنت من خلال إنشاء منصة يمكن للأشخاص من خلالها توحيد قواتهم للوصول إلى منتجات متميزة بأسعار لا تقبل المنافسة.",
      benefits: [
        {
          icon: <BadgePercent className="h-10 w-10 text-jam3a-purple" />,
          title: "خصومات حقيقية تصل إلى 30٪",
          desc: "احصل على توفير حقيقي عندما تتسوق معًا. يمنحك نموذج الشراء الجماعي الخاص بنا إمكانية الوصول إلى أسعار الجملة التي لا يمكن للمتسوقين الأفراد الحصول عليها في أي مكان آخر."
        },
        {
          icon: <ShieldCheck className="h-10 w-10 text-jam3a-purple" />,
          title: "دفع بدون مخاطر",
          desc: "تتم معالجة الدفع الخاص بك فقط عند اكتمال المجموعة. إذا لم تتشكل المجموعة خلال الوقت المحدد، فلن يتم خصم ريال واحد منك."
        },
        {
          icon: <UserPlus className="h-10 w-10 text-jam3a-purple" />,
          title: "تسوق اجتماعي قائم على الدعوات",
          desc: "شارك الصفقات مع الأصدقاء والعائلة لإكمال مجموعتك بشكل أسرع. كلما انضم المزيد من الأشخاص، حصل الجميع على صفقات أفضل."
        },
        {
          icon: <Crown className="h-10 w-10 text-jam3a-purple" />,
          title: "منتجات فاخرة بأسعار المجموعة",
          desc: "الوصول إلى العلامات التجارية والمنتجات عالية الجودة التي عادة ما تكون بعيدة المنال بالأسعار الفردية. استمتع بالرفاهية دون علامة السعر المميزة."
        }
      ],
      cta: "ابدأ التوفير معًا اليوم",
      startShopping: "تصفح العروض"
    }
  };

  const currentContent = content[language];
  const isRtl = language === 'ar';

  return (
    <section className={`py-10 bg-gradient-to-br from-purple-50 to-white ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-3">
            {currentContent.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
          <p className="mt-3 text-lg max-w-3xl mx-auto">
            {currentContent.description}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {currentContent.benefits.map((benefit, index) => (
            <Card key={index} className="border-2 hover:border-jam3a-purple hover:shadow-lg transition-all">
              <CardContent className="p-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-jam3a-purple/10 mb-3">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">{currentContent.cta}</h3>
          <Button size="lg" className="bg-jam3a-purple hover:bg-jam3a-deep-purple text-white">
            {currentContent.startShopping}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
