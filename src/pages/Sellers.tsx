import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Sellers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleApplyClick = () => {
    navigate('/seller-register');
  };
  
  const handleLoginClick = () => {
    navigate('/seller-login');
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === 'en' ? 'Sell With Jam3a' : 'بيع مع جمعة'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Reach more customers and increase your sales through our group buying platform'
                : 'الوصول إلى المزيد من العملاء وزيادة مبيعاتك من خلال منصة الشراء الجماعي الخاصة بنا'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-700 hover:bg-gray-100"
                onClick={handleApplyClick}
              >
                {language === 'en' ? 'Apply to Become a Seller' : 'تقدم لتصبح بائعًا'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-purple-800"
                onClick={handleLoginClick}
              >
                {language === 'en' ? 'Seller Login' : 'تسجيل دخول البائع'}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Tabs Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">
                  {language === 'en' ? 'Overview' : 'نظرة عامة'}
                </TabsTrigger>
                <TabsTrigger value="benefits">
                  {language === 'en' ? 'Benefits' : 'المزايا'}
                </TabsTrigger>
                <TabsTrigger value="process">
                  {language === 'en' ? 'Process' : 'العملية'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'What is Jam3a for Sellers?' : 'ما هي جمعة للبائعين؟'}
                </h2>
                <p className="mb-4">
                  {language === 'en' 
                    ? 'Jam3a is a group buying platform that connects sellers with customers who want to purchase products at discounted prices through collective buying power.'
                    : 'جمعة هي منصة شراء جماعي تربط البائعين بالعملاء الذين يرغبون في شراء المنتجات بأسعار مخفضة من خلال قوة الشراء الجماعية.'
                  }
                </p>
                <p className="mb-4">
                  {language === 'en'
                    ? 'As a seller on Jam3a, you can offer your products to groups of buyers, increasing your sales volume while providing competitive prices to customers.'
                    : 'كبائع في جمعة، يمكنك تقديم منتجاتك لمجموعات من المشترين، مما يزيد من حجم مبيعاتك مع تقديم أسعار تنافسية للعملاء.'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'en' ? 'Increased Sales' : 'زيادة المبيعات'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {language === 'en'
                          ? 'Reach more customers and sell in larger volumes through group purchases.'
                          : 'الوصول إلى المزيد من العملاء والبيع بكميات أكبر من خلال المشتريات الجماعية.'
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'en' ? 'Reduced Marketing Costs' : 'تقليل تكاليف التسويق'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {language === 'en'
                          ? 'Our platform handles customer acquisition, allowing you to focus on your products.'
                          : 'تتولى منصتنا اكتساب العملاء، مما يتيح لك التركيز على منتجاتك.'
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'en' ? 'Simplified Logistics' : 'لوجستيات مبسطة'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {language === 'en'
                          ? 'Bulk shipping to fewer locations means lower shipping costs and simpler logistics.'
                          : 'الشحن بالجملة إلى مواقع أقل يعني تكاليف شحن أقل ولوجستيات أبسط.'
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="benefits" className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'Benefits for Sellers' : 'مزايا للبائعين'}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'en' ? 'Predictable Revenue' : 'إيرادات متوقعة'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'en'
                          ? 'Know exactly how many products you will sell before you ship them, allowing for better inventory management and cash flow planning.'
                          : 'معرفة عدد المنتجات التي ستبيعها بالضبط قبل شحنها، مما يسمح بإدارة أفضل للمخزون وتخطيط التدفق النقدي.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'en' ? 'Customer Satisfaction' : 'رضا العملاء'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'en'
                          ? 'Customers love getting deals, and happy customers become repeat buyers and brand advocates.'
                          : 'يحب العملاء الحصول على صفقات، والعملاء السعداء يصبحون مشترين متكررين ومدافعين عن العلامة التجارية.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'en' ? 'Secure Payments' : 'مدفوعات آمنة'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'en'
                          ? 'Our platform handles all payment processing, ensuring you get paid promptly and securely for every sale.'
                          : 'تتعامل منصتنا مع جميع عمليات الدفع، مما يضمن حصولك على المدفوعات بسرعة وأمان لكل عملية بيع.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'en' ? 'Analytics & Insights' : 'تحليلات ورؤى'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'en'
                          ? 'Access detailed analytics about your sales, customer demographics, and product performance to optimize your offerings.'
                          : 'الوصول إلى تحليلات مفصلة حول مبيعاتك والتركيبة السكانية للعملاء وأداء المنتج لتحسين عروضك.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="process" className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'How It Works' : 'كيف تعمل'}
                </h2>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-purple-200"></div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'en' ? 'Apply to Become a Seller' : 'تقدم لتصبح بائعًا'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'Fill out our seller application form with details about your business and products. Our team will review your application within 48 hours.'
                        : 'املأ نموذج طلب البائع الخاص بنا مع تفاصيل حول عملك ومنتجاتك. سيقوم فريقنا بمراجعة طلبك في غضون 48 ساعة.'
                      }
                    </p>
                  </div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'en' ? 'Set Up Your Seller Profile' : 'إعداد ملف البائع الخاص بك'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'Once approved, create your seller profile, add your products, set pricing tiers, and define your group buying terms.'
                        : 'بمجرد الموافقة، قم بإنشاء ملف البائع الخاص بك، وإضافة منتجاتك، وتعيين مستويات الأسعار، وتحديد شروط الشراء الجماعي الخاصة بك.'
                      }
                    </p>
                  </div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'en' ? 'Launch Your Jam3a Deals' : 'إطلاق صفقات جمعة الخاصة بك'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'We will help you create attractive Jam3a deals that will appeal to customers looking to save through group buying.'
                        : 'سنساعدك في إنشاء صفقات جمعة جذابة ستجذب العملاء الذين يتطلعون إلى التوفير من خلال الشراء الجماعي.'
                      }
                    </p>
                  </div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">4</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'en' ? 'Fulfill Orders' : 'تنفيذ الطلبات'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'Once a Jam3a group is complete, you will receive the order details. Ship the products to customers according to our fulfillment guidelines.'
                        : 'بمجرد اكتمال مجموعة جمعة، ستتلقى تفاصيل الطلب. قم بشحن المنتجات إلى العملاء وفقًا لإرشادات التنفيذ الخاصة بنا.'
                      }
                    </p>
                  </div>
                  
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">5</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'en' ? 'Get Paid' : 'احصل على المدفوعات'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'Receive payments directly to your account within 7 business days after successful delivery confirmation.'
                        : 'استلم المدفوعات مباشرة إلى حسابك في غضون 7 أيام عمل بعد تأكيد التسليم الناجح.'
                      }
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              {language === 'en' ? 'Ready to Start Selling?' : 'هل أنت مستعد لبدء البيع؟'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Join our growing community of sellers and start offering your products to group buyers today.'
                : 'انضم إلى مجتمعنا المتنامي من البائعين وابدأ في تقديم منتجاتك للمشترين الجماعيين اليوم.'
              }
            </p>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleApplyClick}
            >
              {language === 'en' ? 'Apply Now' : 'تقدم الآن'}
            </Button>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              {language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'What types of products can I sell on Jam3a?' : 'ما هي أنواع المنتجات التي يمكنني بيعها على جمعة؟'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {language === 'en'
                      ? 'You can sell a wide range of products on Jam3a, including electronics, home goods, fashion, beauty products, and more. We do have restrictions on certain categories like perishable items, dangerous goods, and prohibited items.'
                      : 'يمكنك بيع مجموعة واسعة من المنتجات على جمعة، بما في ذلك الإلكترونيات والسلع المنزلية والأزياء ومنتجات التجميل والمزيد. لدينا قيود على فئات معينة مثل المواد القابلة للتلف والبضائع الخطرة والعناصر المحظورة.'
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'What are the fees for selling on Jam3a?' : 'ما هي رسوم البيع على جمعة؟'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {language === 'en'
                      ? 'Jam3a charges a commission of 10-15% depending on the product category and volume. There are no upfront fees or monthly subscriptions - you only pay when you make a sale.'
                      : 'تفرض جمعة عمولة بنسبة 10-15٪ اعتمادًا على فئة المنتج والحجم. لا توجد رسوم مقدمة أو اشتراكات شهرية - تدفع فقط عندما تقوم بإجراء عملية بيع.'
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'How long does it take to get approved as a seller?' : 'كم من الوقت يستغرق الموافقة عليك كبائع؟'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {language === 'en'
                      ? 'Our team typically reviews seller applications within 48 hours. Once approved, you can set up your profile and start listing products immediately.'
                      : 'يقوم فريقنا عادة بمراجعة طلبات البائعين في غضون 48 ساعة. بمجرد الموافقة، يمكنك إعداد ملفك الشخصي والبدء في إدراج المنتجات على الفور.'
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'How do I handle shipping and returns?' : 'كيف أتعامل مع الشحن والمرتجعات؟'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {language === 'en'
                      ? 'Sellers are responsible for shipping products to customers. You can set your own shipping policies, but they must comply with our minimum customer service standards. Returns are handled according to your return policy, which must be clearly stated on your seller profile.'
                      : 'البائعون مسؤولون عن شحن المنتجات إلى العملاء. يمكنك تحديد سياسات الشحن الخاصة بك، ولكن يجب أن تتوافق مع معايير خدمة العملاء الدنيا لدينا. يتم التعامل مع المرتجعات وفقًا لسياسة الإرجاع الخاصة بك، والتي يجب أن تكون مذكورة بوضوح في ملف البائع الخاص بك.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sellers;
