import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, CheckCircle, HelpCircle, Users, Clock } from 'lucide-react';

const HowItWorks = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const content = {
    en: {
      title: "How Jam3a Works",
      subtitle: "Group buying made simple",
      description: "Jam3a is Saudi Arabia's first group-buying platform that helps you save money by shopping together with others. Here's how it works in 4 simple steps:",
      steps: [
        {
          title: "Choose a product",
          description: "Browse our curated selection of premium tech products or search for something specific.",
          icon: "🛍️"
        },
        {
          title: "Start or join a Jam3a",
          description: "Create your own group or join an existing one for the product you want.",
          icon: "👥"
        },
        {
          title: "Share the deal",
          description: "Invite friends and family to join your Jam3a via WhatsApp, social media, or email.",
          icon: "📱"
        },
        {
          title: "Unlock the discount",
          description: "Once the group is full, everyone pays the discounted price and receives their order.",
          icon: "💰"
        }
      ],
      benefits: {
        title: "Why Choose Jam3a?",
        items: [
          {
            title: "Better Prices",
            description: "Save up to 30% on retail prices when you buy together with others."
          },
          {
            title: "100% Secure",
            description: "Your payment is only processed when the group is successfully formed."
          },
          {
            title: "Fast Delivery",
            description: "Receive your products within 2-5 business days across Saudi Arabia."
          },
          {
            title: "Multiple Payment Options",
            description: "Pay with Mada, STC Pay, Apple Pay, or credit cards."
          }
        ]
      },
      examples: {
        title: "See Jam3a in Action",
        description: "Here are some active Jam3a deals you can join right now:",
        deals: [
          {
            title: "iPhone 16 Pro Max 256GB",
            originalPrice: 4999,
            currentPrice: 4199,
            discount: "16%",
            joined: 4,
            total: 5,
            timeLeft: "23:45:12",
            image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80"
          },
          {
            title: "Samsung Galaxy S25 Ultra",
            originalPrice: 4599,
            currentPrice: 3899,
            discount: "15%",
            joined: 3,
            total: 6,
            timeLeft: "11:23:45",
            image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80"
          }
        ]
      },
      cta: {
        browse: "Browse All Deals",
        start: "Start Your Own Jam3a"
      }
    },
    ar: {
      title: "كيف تعمل جمعة",
      subtitle: "الشراء الجماعي بطريقة بسيطة",
      description: "جمعة هي أول منصة للشراء الجماعي في المملكة العربية السعودية تساعدك على توفير المال من خلال التسوق مع الآخرين. إليك كيفية عملها في 4 خطوات بسيطة:",
      steps: [
        {
          title: "اختر منتجًا",
          description: "تصفح مجموعتنا المنتقاة من المنتجات التقنية المميزة أو ابحث عن شيء محدد.",
          icon: "🛍️"
        },
        {
          title: "ابدأ أو انضم إلى جمعة",
          description: "أنشئ مجموعتك الخاصة أو انضم إلى مجموعة موجودة للمنتج الذي تريده.",
          icon: "👥"
        },
        {
          title: "شارك الصفقة",
          description: "ادعُ الأصدقاء والعائلة للانضمام إلى جمعتك عبر واتساب أو وسائل التواصل الاجتماعي أو البريد الإلكتروني.",
          icon: "📱"
        },
        {
          title: "احصل على الخصم",
          description: "بمجرد اكتمال المجموعة، يدفع الجميع السعر المخفض ويستلمون طلباتهم.",
          icon: "💰"
        }
      ],
      benefits: {
        title: "لماذا تختار جمعة؟",
        items: [
          {
            title: "أسعار أفضل",
            description: "وفر حتى 30% من أسعار التجزئة عندما تشتري مع الآخرين."
          },
          {
            title: "آمن 100%",
            description: "تتم معالجة الدفع الخاص بك فقط عند تكوين المجموعة بنجاح."
          },
          {
            title: "توصيل سريع",
            description: "استلم منتجاتك في غضون 2-5 أيام عمل في جميع أنحاء المملكة العربية السعودية."
          },
          {
            title: "خيارات دفع متعددة",
            description: "ادفع باستخدام مدى أو STC Pay أو Apple Pay أو بطاقات الائتمان."
          }
        ]
      },
      examples: {
        title: "شاهد جمعة قيد التنفيذ",
        description: "إليك بعض صفقات جمعة النشطة التي يمكنك الانضمام إليها الآن:",
        deals: [
          {
            title: "آيفون 16 برو ماكس 256 جيجابايت",
            originalPrice: 4999,
            currentPrice: 4199,
            discount: "16%",
            joined: 4,
            total: 5,
            timeLeft: "23:45:12",
            image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80"
          },
          {
            title: "سامسونج جالاكسي S25 ألترا",
            originalPrice: 4599,
            currentPrice: 3899,
            discount: "15%",
            joined: 3,
            total: 6,
            timeLeft: "11:23:45",
            image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80"
          }
        ]
      },
      cta: {
        browse: "تصفح جميع العروض",
        start: "ابدأ جمعتك الخاصة"
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-purple-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
              <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
              <p className="mt-4 max-w-2xl mx-auto">{currentContent.description}</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentContent.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-jam3a-purple text-white text-2xl mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">{currentContent.benefits.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentContent.benefits.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-6 w-6 text-jam3a-purple mr-2" />
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">{currentContent.examples.title}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{currentContent.examples.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {currentContent.examples.deals.map((deal, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={deal.image} 
                      alt={deal.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-jam3a-purple text-white px-2 py-1 rounded-md text-sm font-medium">
                      {deal.discount} OFF
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{deal.title}</h3>
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center">
                        <span className="font-bold text-lg">{deal.currentPrice} SAR</span>
                        <span className="text-muted-foreground line-through text-sm ml-2">{deal.originalPrice} SAR</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{deal.joined} of {deal.total} joined</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{deal.timeLeft}</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-jam3a-purple h-2.5 rounded-full" 
                          style={{ width: `${(deal.joined / deal.total) * 100}%` }}
                        ></div>
                      </div>
                      
                      <Button className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple">
                        Join This Jam3a
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-jam3a-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-jam3a-purple">
                {currentContent.cta.browse}
              </Button>
              <Button size="lg" className="bg-white text-jam3a-purple hover:bg-gray-100">
                {currentContent.cta.start}
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4 mt-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 text-jam3a-purple mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">What is Jam3a?</h3>
                        <p className="text-muted-foreground mt-1">
                          Jam3a is Saudi Arabia's first group-buying platform that helps you save money by shopping together with others. When multiple people join a Jam3a (group), everyone gets a discount on the product.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 text-jam3a-purple mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">How do I join a Jam3a?</h3>
                        <p className="text-muted-foreground mt-1">
                          You can browse active Jam3a deals on our platform and join any that interest you. Simply click "Join This Jam3a" on the product page, complete the checkout process, and wait for the group to fill up.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 text-jam3a-purple mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">What happens if the group doesn't fill up?</h3>
                        <p className="text-muted-foreground mt-1">
                          If a Jam3a doesn't reach the required number of participants within the time limit, you'll receive a full refund of your payment. There's no risk in joining a Jam3a!
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="payment" className="space-y-4 mt-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 text-jam3a-purple mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">When will I be charged?</h3>
                        <p className="text-muted-foreground mt-1">
                          Your payment method will be authorized when you join a Jam3a, but you'll only be charged once the group successfully fills up. If the group doesn't fill up within the time limit, no charge will be made.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 text-jam3a-purple mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">What payment methods do you accept?</h3>
                        <p className="text-muted-foreground mt-1">
                          We accept various payment methods including Mada, credit cards (Visa/Mastercard), Apple Pay, and STC Pay. All payments are processed securely through our payment partner, Moyasar.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="delivery" className="space-y-4 mt-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 text-jam3a-purple mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">How long does delivery take?</h3>
                        <p className="text-muted-foreground mt-1">
                          Once a Jam3a is successfully filled, orders are processed within 24 hours. Delivery typically takes 2-5 business days depending on your location within Saudi Arabia.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 text-jam3a-purple mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Is there a delivery fee?</h3>
                        <p className="text-muted-foreground mt-1">
                          Standard delivery is free for all orders. We also offer express delivery options for an additional fee during checkout.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
