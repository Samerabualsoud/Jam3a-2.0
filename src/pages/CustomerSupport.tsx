import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, MessageCircle, Phone, Mail, HelpCircle, ArrowRight } from 'lucide-react';

const CustomerSupport = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: ''
  });

  const content = {
    en: {
      title: "Customer Support",
      subtitle: "We're here to help you with any questions or issues you may have.",
      search: {
        title: "Search for Help",
        placeholder: "Search for answers...",
        button: "Search",
        noResults: "No results found. Please try different keywords or contact us directly."
      },
      tabs: {
        faq: "FAQs",
        contact: "Contact Us",
        orders: "Orders & Returns",
        account: "Account Help"
      },
      faq: {
        title: "Frequently Asked Questions",
        categories: [
          {
            title: "About Jam3a",
            items: [
              {
                question: "What is Jam3a Hub Collective?",
                answer: "Jam3a Hub Collective is a group buying platform that allows users to join together to purchase products at discounted prices. By gathering multiple buyers for the same product, we can negotiate better prices with sellers and pass those savings on to you."
              },
              {
                question: "How does group buying work?",
                answer: "When you join a Jam3a, you're joining a group of buyers interested in the same product. Once the minimum group size is reached (minimum of 5 participants), the deal is confirmed and everyone in the group gets the discounted price. If the minimum group size isn't reached within the specified timeframe, the deal is canceled and no charges are made."
              },
              {
                question: "Is Jam3a available in my area?",
                answer: "Currently, Jam3a Hub Collective operates throughout Saudi Arabia. We're continuously expanding our service areas, so if we're not in your location yet, we may be soon!"
              }
            ]
          },
          {
            title: "Orders & Payments",
            items: [
              {
                question: "How do I track my order?",
                answer: "You can track your order by visiting the 'Track Order' page and entering your order number. You'll receive your order number in the confirmation email after your purchase. You can also view your order status in your account under 'Jam3a History'."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept credit/debit cards, Apple Pay, and bank transfers through our secure payment gateway, Moyasar. All transactions are encrypted and secure."
              },
              {
                question: "When will I be charged for my order?",
                answer: "You'll only be charged once the minimum group size for the Jam3a deal is reached. If the minimum isn't reached, no charges will be made to your payment method."
              }
            ]
          },
          {
            title: "Returns & Refunds",
            items: [
              {
                question: "What is your return policy?",
                answer: "You can return most items within 14 days of delivery. The item must be in its original condition and packaging. Please visit our Returns Policy page for complete details."
              },
              {
                question: "How do I initiate a return?",
                answer: "To initiate a return, contact our customer service team with your order number and reason for return. We'll provide you with a Return Authorization Number and instructions for returning the item."
              },
              {
                question: "How long does it take to process a refund?",
                answer: "Once we receive your return, it typically takes 3-5 business days to inspect the item and process your refund. After processing, it may take an additional 7-14 business days for the refund to appear in your account, depending on your payment method."
              }
            ]
          },
          {
            title: "Account & Security",
            items: [
              {
                question: "How do I create an account?",
                answer: "You can create an account by clicking the 'Sign Up' button in the top right corner of our website. You'll need to provide your name, email address, and create a password."
              },
              {
                question: "I forgot my password. How do I reset it?",
                answer: "Click on 'Sign In', then select 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password."
              },
              {
                question: "How is my personal information protected?",
                answer: "We take data security seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent. Please review our Privacy Policy for more details."
              }
            ]
          }
        ]
      },
      contact: {
        title: "Contact Our Support Team",
        description: "Fill out the form below and our team will get back to you as soon as possible.",
        form: {
          name: "Your Name",
          email: "Email Address",
          orderNumber: "Order Number (if applicable)",
          subject: "Subject",
          message: "Message",
          submit: "Submit Request",
          success: "Your message has been sent! We'll get back to you soon.",
          error: "There was an error sending your message. Please try again."
        },
        contactInfo: {
          title: "Other Ways to Reach Us",
          email: {
            title: "Email Us",
            value: "support@jam3a.me",
            description: "We typically respond within 24 hours"
          },
          phone: {
            title: "Call Us",
            value: "+966 12 345 6789",
            description: "Sunday - Thursday: 9:00 AM - 6:00 PM (Saudi Arabia Time)"
          },
          chat: {
            title: "Live Chat",
            description: "Available during business hours",
            button: "Start Chat"
          }
        }
      },
      orders: {
        title: "Orders & Returns Help",
        description: "Get help with your orders, returns, and refunds.",
        sections: [
          {
            title: "Track Your Order",
            description: "Check the status of your order and get shipping updates.",
            button: "Track Order",
            link: "/track-order"
          },
          {
            title: "Return an Item",
            description: "Start the return process for items you've purchased.",
            button: "Start Return",
            link: "/returns-policy"
          },
          {
            title: "Order Issues",
            description: "Report problems with your order or delivery.",
            button: "Report Issue",
            link: "/contact"
          }
        ]
      },
      account: {
        title: "Account Help",
        description: "Get help with your account settings and security.",
        sections: [
          {
            title: "Update Account Information",
            description: "Change your personal details, address, or payment methods.",
            button: "Manage Account",
            link: "/profile"
          },
          {
            title: "Password & Security",
            description: "Reset your password or update security settings.",
            button: "Security Settings",
            link: "/profile/security"
          },
          {
            title: "Become a Seller",
            description: "Learn how to sell your products on Jam3a Hub Collective.",
            button: "Seller Information",
            link: "/seller-registration"
          }
        ]
      }
    },
    ar: {
      title: "دعم العملاء",
      subtitle: "نحن هنا لمساعدتك في أي أسئلة أو مشاكل قد تواجهها.",
      search: {
        title: "البحث عن المساعدة",
        placeholder: "ابحث عن إجابات...",
        button: "بحث",
        noResults: "لم يتم العثور على نتائج. يرجى تجربة كلمات مختلفة أو الاتصال بنا مباشرة."
      },
      tabs: {
        faq: "الأسئلة الشائعة",
        contact: "اتصل بنا",
        orders: "الطلبات والإرجاع",
        account: "مساعدة الحساب"
      },
      faq: {
        title: "الأسئلة المتداولة",
        categories: [
          {
            title: "حول جمعة",
            items: [
              {
                question: "ما هو جمعة هب كوليكتيف؟",
                answer: "جمعة هب كوليكتيف هي منصة شراء جماعي تتيح للمستخدمين الانضمام معًا لشراء المنتجات بأسعار مخفضة. من خلال جمع العديد من المشترين لنفس المنتج، يمكننا التفاوض على أسعار أفضل مع البائعين وتمرير هذه الوفورات إليك."
              },
              {
                question: "كيف يعمل الشراء الجماعي؟",
                answer: "عندما تنضم إلى جمعة، فأنت تنضم إلى مجموعة من المشترين المهتمين بنفس المنتج. بمجرد الوصول إلى الحد الأدنى لحجم المجموعة (الحد الأدنى 5 مشاركين)، يتم تأكيد الصفقة ويحصل الجميع في المجموعة على السعر المخفض. إذا لم يتم الوصول إلى الحد الأدنى لحجم المجموعة خلال الإطار الزمني المحدد، يتم إلغاء الصفقة ولا يتم إجراء أي رسوم."
              },
              {
                question: "هل جمعة متاحة في منطقتي؟",
                answer: "حاليًا، تعمل جمعة هب كوليكتيف في جميع أنحاء المملكة العربية السعودية. نحن نوسع مناطق خدمتنا باستمرار، لذا إذا لم نكن في موقعك بعد، فقد نكون قريبًا!"
              }
            ]
          },
          {
            title: "الطلبات والمدفوعات",
            items: [
              {
                question: "كيف يمكنني تتبع طلبي؟",
                answer: "يمكنك تتبع طلبك من خلال زيارة صفحة 'تتبع الطلب' وإدخال رقم طلبك. ستتلقى رقم طلبك في رسالة البريد الإلكتروني للتأكيد بعد الشراء. يمكنك أيضًا عرض حالة طلبك في حسابك ضمن 'سجل جمعة'."
              },
              {
                question: "ما هي طرق الدفع التي تقبلونها؟",
                answer: "نقبل بطاقات الائتمان/الخصم، و Apple Pay، والتحويلات المصرفية من خلال بوابة الدفع الآمنة لدينا، مُيسر. جميع المعاملات مشفرة وآمنة."
              },
              {
                question: "متى سيتم خصم قيمة طلبي؟",
                answer: "سيتم خصم المبلغ فقط عند الوصول إلى الحد الأدنى لحجم المجموعة لصفقة جمعة. إذا لم يتم الوصول إلى الحد الأدنى، فلن يتم إجراء أي رسوم على طريقة الدفع الخاصة بك."
              }
            ]
          },
          {
            title: "الإرجاع والاسترداد",
            items: [
              {
                question: "ما هي سياسة الإرجاع الخاصة بكم؟",
                answer: "يمكنك إرجاع معظم العناصر في غضون 14 يومًا من التسليم. يجب أن يكون العنصر في حالته وعبوته الأصلية. يرجى زيارة صفحة سياسة الإرجاع للحصول على التفاصيل الكاملة."
              },
              {
                question: "كيف أبدأ عملية الإرجاع؟",
                answer: "لبدء عملية الإرجاع، اتصل بفريق خدمة العملاء لدينا مع رقم طلبك وسبب الإرجاع. سنزودك برقم تفويض الإرجاع وتعليمات لإرجاع العنصر."
              },
              {
                question: "كم من الوقت يستغرق معالجة المبلغ المسترد؟",
                answer: "بمجرد استلام الإرجاع الخاص بك، يستغرق الأمر عادةً 3-5 أيام عمل لفحص العنصر ومعالجة المبلغ المسترد. بعد المعالجة، قد يستغرق الأمر 7-14 يوم عمل إضافي لظهور المبلغ المسترد في حسابك، اعتمادًا على طريقة الدفع الخاصة بك."
              }
            ]
          },
          {
            title: "الحساب والأمان",
            items: [
              {
                question: "كيف يمكنني إنشاء حساب؟",
                answer: "يمكنك إنشاء حساب بالنقر على زر 'التسجيل' في الزاوية اليمنى العليا من موقعنا. ستحتاج إلى تقديم اسمك وعنوان بريدك الإلكتروني وإنشاء كلمة مرور."
              },
              {
                question: "نسيت كلمة المرور الخاصة بي. كيف يمكنني إعادة تعيينها؟",
                answer: "انقر على 'تسجيل الدخول'، ثم حدد 'نسيت كلمة المرور'. أدخل عنوان بريدك الإلكتروني، وسنرسل لك تعليمات لإعادة تعيين كلمة المرور الخاصة بك."
              },
              {
                question: "كيف يتم حماية معلوماتي الشخصية؟",
                answer: "نحن نأخذ أمن البيانات على محمل الجد. يتم تشفير جميع المعلومات الشخصية وتخزينها بشكل آمن. نحن لا نشارك معلوماتك أبدًا مع أطراف ثالثة دون موافقتك. يرجى مراجعة سياسة الخصوصية الخاصة بنا للحصول على مزيد من التفاصيل."
              }
            ]
          }
        ]
      },
      contact: {
        title: "اتصل بفريق الدعم لدينا",
        description: "املأ النموذج أدناه وسيتواصل فريقنا معك في أقرب وقت ممكن.",
        form: {
          name: "اسمك",
          email: "عنوان البريد الإلكتروني",
          orderNumber: "رقم الطلب (إن وجد)",
          subject: "الموضوع",
          message: "الرسالة",
          submit: "إرسال الطلب",
          success: "تم إرسال رسالتك! سنرد عليك قريبًا.",
          error: "حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى."
        },
        contactInfo: {
          title: "طرق أخرى للوصول إلينا",
          email: {
            title: "راسلنا عبر البريد الإلكتروني",
            value: "support@jam3a.me",
            description: "نرد عادة خلال 24 ساعة"
          },
          phone: {
            title: "اتصل بنا",
            value: "+966 12 345 6789",
            description: "الأحد - الخميس: 9:00 صباحًا - 6:00 مساءً (توقيت المملكة العربية السعودية)"
          },
          chat: {
            title: "الدردشة المباشرة",
            description: "متاحة خلال ساعات العمل",
            button: "بدء الدردشة"
          }
        }
      },
      orders: {
        title: "مساعدة الطلبات والإرجاع",
        description: "احصل على مساعدة بشأن طلباتك وعمليات الإرجاع والاسترداد.",
        sections: [
          {
            title: "تتبع طلبك",
            description: "تحقق من حالة طلبك واحصل على تحديثات الشحن.",
            button: "تتبع الطلب",
            link: "/track-order"
          },
          {
            title: "إرجاع منتج",
            description: "ابدأ عملية الإرجاع للعناصر التي اشتريتها.",
            button: "بدء الإرجاع",
            link: "/returns-policy"
          },
          {
            title: "مشاكل الطلب",
            description: "الإبلاغ عن مشاكل في طلبك أو التسليم.",
            button: "الإبلاغ عن مشكلة",
            link: "/contact"
          }
        ]
      },
      account: {
        title: "مساعدة الحساب",
        description: "احصل على مساعدة بشأن إعدادات حسابك والأمان.",
        sections: [
          {
            title: "تحديث معلومات الحساب",
            description: "تغيير تفاصيلك الشخصية أو العنوان أو طرق الدفع.",
            button: "إدارة الحساب",
            link: "/profile"
          },
          {
            title: "كلمة المرور والأمان",
            description: "إعادة تعيين كلمة المرور أو تحديث إعدادات الأمان.",
            button: "إعدادات الأمان",
            link: "/profile/security"
          },
          {
            title: "كن بائعًا",
            description: "تعرف على كيفية بيع منتجاتك على جمعة هب كوليكتيف.",
            button: "معلومات البائع",
            link: "/seller-registration"
          }
        ]
      }
    }
  };

  const currentContent = content[language];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would search through FAQs and help articles
    toast({
      title: `${language === 'en' ? 'Searching for' : 'جاري البحث عن'}: "${searchQuery}"`,
      description: currentContent.search.noResults
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a backend API
    toast({
      title: currentContent.contact.form.success,
      variant: "success"
    });
    setContactForm({
      name: '',
      email: '',
      orderNumber: '',
      subject: '',
      message: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartChat = () => {
    // In a real implementation, this would open a chat widget
    toast({
      title: language === 'en' ? 'Live Chat' : 'الدردشة المباشرة',
      description: language === 'en' ? 'Connecting you to a support agent...' : 'جاري توصيلك بوكيل الدعم...'
    });
  };

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
            <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
          </div>

          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={currentContent.search.placeholder}
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={!searchQuery} className="w-full md:w-auto">
                      {currentContent.search.button}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="faq">{currentContent.tabs.faq}</TabsTrigger>
              <TabsTrigger value="contact">{currentContent.tabs.contact}</TabsTrigger>
              <TabsTrigger value="orders">{currentContent.tabs.orders}</TabsTrigger>
              <TabsTrigger value="account">{currentContent.tabs.account}</TabsTrigger>
            </TabsList>

            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.faq.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {currentContent.faq.categories.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                        <Accordion type="single" collapsible className="w-full">
                          {category.items.map((item, itemIndex) => (
                            <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                              <AccordionTrigger className="text-left">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-muted-foreground">{item.answer}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentContent.contact.title}</CardTitle>
                      <CardDescription>{currentContent.contact.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">{currentContent.contact.form.name}</Label>
                            <Input
                              id="name"
                              name="name"
                              value={contactForm.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">{currentContent.contact.form.email}</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={contactForm.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="orderNumber">{currentContent.contact.form.orderNumber}</Label>
                          <Input
                            id="orderNumber"
                            name="orderNumber"
                            value={contactForm.orderNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">{currentContent.contact.form.subject}</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={contactForm.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">{currentContent.contact.form.message}</Label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={5}
                            value={contactForm.message}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          {currentContent.contact.form.submit}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentContent.contact.contactInfo.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <Mail className="h-6 w-6 text-jam3a-purple mt-1" />
                        <div>
                          <h3 className="font-medium">{currentContent.contact.contactInfo.email.title}</h3>
                          <p className="text-jam3a-purple">{currentContent.contact.contactInfo.email.value}</p>
                          <p className="text-sm text-muted-foreground">{currentContent.contact.contactInfo.email.description}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <Phone className="h-6 w-6 text-jam3a-purple mt-1" />
                        <div>
                          <h3 className="font-medium">{currentContent.contact.contactInfo.phone.title}</h3>
                          <p className="text-jam3a-purple">{currentContent.contact.contactInfo.phone.value}</p>
                          <p className="text-sm text-muted-foreground">{currentContent.contact.contactInfo.phone.description}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <MessageCircle className="h-6 w-6 text-jam3a-purple mt-1" />
                        <div>
                          <h3 className="font-medium">{currentContent.contact.contactInfo.chat.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{currentContent.contact.contactInfo.chat.description}</p>
                          <Button onClick={handleStartChat} variant="outline" className="w-full">
                            {currentContent.contact.contactInfo.chat.button}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.orders.title}</CardTitle>
                  <CardDescription>{currentContent.orders.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentContent.orders.sections.map((section, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            {index === 0 ? (
                              <Package className="h-12 w-12 text-jam3a-purple mb-4" />
                            ) : index === 1 ? (
                              <RefreshCcw className="h-12 w-12 text-jam3a-purple mb-4" />
                            ) : (
                              <HelpCircle className="h-12 w-12 text-jam3a-purple mb-4" />
                            )}
                            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                            <p className="text-muted-foreground mb-4">{section.description}</p>
                            <Button
                              onClick={() => window.location.href = section.link}
                              className="w-full"
                            >
                              <span className="flex items-center">
                                {section.button}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.account.title}</CardTitle>
                  <CardDescription>{currentContent.account.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentContent.account.sections.map((section, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                            <p className="text-muted-foreground mb-4">{section.description}</p>
                            <Button
                              onClick={() => window.location.href = section.link}
                              className="w-full"
                            >
                              <span className="flex items-center">
                                {section.button}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerSupport;
