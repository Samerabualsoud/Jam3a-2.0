import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, PlusCircle, TrendingUp, BadgePercent, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';

const StartJam3a: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const { toast } = useToast();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const content = {
    en: {
      title: "Start Your Own Jam3a",
      subtitle: "Group buying made simple and rewarding",
      description: "Creating a Jam3a is quick and easy. Select a product you love and watch the prices drop as more friends join!",
      whyStartTitle: "Why Start a Jam3a?",
      steps: [
        {
          title: "Pick Your Product",
          description: "Choose from our curated selection of premium tech gadgets and more.",
          icon: PlusCircle
        },
        {
          title: "Invite Friends",
          description: "Share your unique Jam3a link with friends, family, or colleagues via WhatsApp, social media, or email.",
          icon: TrendingUp
        }
      ],
      benefits: [
        {
          text: "Save up to 30% on retail prices",
          icon: BadgePercent
        },
        {
          text: "No payment until the group is complete",
          icon: Clock
        },
        {
          text: "Full refund if the group doesn't fill",
          icon: ShieldCheck
        },
        {
          text: "Secure transactions and guaranteed delivery",
          icon: ShieldCheck
        }
      ],
      cta: "Start Your Jam3a Now",
      orJoin: "or",
      joinExisting: "Join an Existing Jam3a"
    },
    ar: {
      title: "سوّي جمعتك الخاصة",
      subtitle: "الشراء الجماعي بطريقة سهلة ومجزية",
      description: "إنشاء جمعة سريع وسهل. اختر منتج تحبه وشاهد الأسعار تنخفض مع انضمام المزيد من الأصدقاء!",
      whyStartTitle: "ليش تسوي جمعة؟",
      steps: [
        {
          title: "اختر منتجك",
          description: "اختر من تشكيلتنا المنتقاة من أجهزة التقنية الفاخرة وغيرها.",
          icon: PlusCircle
        },
        {
          title: "ادع أصدقاءك",
          description: "شارك رابط جمعتك الفريد مع الأصدقاء والعائلة أو الزملاء عبر واتساب أو وسائل التواصل الاجتماعي أو البريد الإلكتروني.",
          icon: TrendingUp
        }
      ],
      benefits: [
        {
          text: "وفّر لين 30% على أسعار التجزئة",
          icon: BadgePercent
        },
        {
          text: "ما فيه دفع إلا لما تكتمل المجموعة",
          icon: Clock
        },
        {
          text: "استرداد كامل إذا ما اكتملت المجموعة",
          icon: ShieldCheck
        },
        {
          text: "معاملات آمنة وتوصيل مضمون",
          icon: ShieldCheck
        }
      ],
      cta: "ابدأ جمعتك الآن",
      orJoin: "أو",
      joinExisting: "انضم لجمعة موجودة"
    }
  };

  // Select the appropriate content based on language
  const currentContent = isArabic ? content.ar : content.en;

  return (
    <section className={`py-10 md:py-14 bg-gradient-to-br from-white to-jam3a-purple-50 overflow-hidden ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Background decoration elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-jam3a-purple/5 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-jam3a-accent/5 rounded-full filter blur-3xl"></div>
        
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-jam3a-deep-purple to-jam3a-accent">
              {currentContent.title}
            </h2>
            <p className="text-lg text-jam3a-purple font-medium mb-3">
              {currentContent.subtitle}
            </p>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {currentContent.description}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-8">
          {/* Step selector for mobile */}
          <div className="md:hidden mb-4">
            <div className="w-full border rounded-lg shadow-sm p-1 flex">
              {currentContent.steps.map((_, index) => (
                <button 
                  key={index} 
                  className={`flex-1 py-2 rounded-md ${selectedStepIndex === index ? 'bg-jam3a-purple text-white' : 'bg-transparent text-foreground'}`}
                  onClick={() => setSelectedStepIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <Card className="mt-4 border-2 border-jam3a-purple/10 hover:border-jam3a-purple/30 transition-colors shadow-jam3a">
              <CardContent className="p-5">
                <div className="flex items-center mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-jam3a-purple/10 text-jam3a-purple">
                    {React.createElement(currentContent.steps[selectedStepIndex].icon, { size: 20 })}
                  </div>
                  <h3 className="font-semibold text-lg mx-3">{currentContent.steps[selectedStepIndex].title}</h3>
                </div>
                <p className="text-muted-foreground">{currentContent.steps[selectedStepIndex].description}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Desktop steps */}
          <div className="hidden md:grid md:grid-cols-3 gap-5">
            {currentContent.steps.map((step, index) => (
              <Card 
                key={index} 
                className="border-2 border-jam3a-purple/10 hover:border-jam3a-purple/30 transition-all duration-300 hover:shadow-jam3a transform hover:-translate-y-1"
              >
                <CardContent className="p-5">
                  <div className="flex items-center mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-jam3a-purple/10 text-jam3a-purple">
                      {React.createElement(step.icon, { size: 20 })}
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-jam3a-purple text-white text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mx-3">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-jam3a-purple to-jam3a-accent rounded-2xl p-6 text-white mb-8 shadow-jam3a-lg transform hover:-translate-y-1 transition-transform duration-300">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-4">
              {currentContent.whyStartTitle}
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {currentContent.benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-white/20 transition-colors duration-300 min-h-[120px]"
                >
                  {React.createElement(benefit.icon, { className: "h-6 w-6 mb-3" })}
                  <span className="text-sm font-medium leading-tight">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <Button 
            size="lg" 
            className="bg-jam3a-purple hover:bg-jam3a-deep-purple text-white px-6 py-5 text-lg shadow-jam3a hover:shadow-jam3a-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Link to="/start-jam3a" className="flex items-center gap-2">
              {currentContent.cta}
              <ArrowRight className={`h-5 w-5 ${isArabic ? 'rotate-180' : ''}`} />
            </Link>
          </Button>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">{currentContent.orJoin}</span>
            <Button variant="link" className="text-jam3a-purple hover:text-jam3a-deep-purple">
              <Link to="/shop-jam3a" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {currentContent.joinExisting}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartJam3a;
