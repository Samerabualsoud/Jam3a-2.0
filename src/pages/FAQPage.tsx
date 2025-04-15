import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const content = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about Jam3a",
      description: "Can't find what you're looking for? Contact our support team for assistance.",
      categories: {
        general: "General",
        howItWorks: "How It Works",
        payments: "Payments",
        delivery: "Delivery & Shipping",
        returns: "Returns & Refunds"
      },
      faqs: {
        general: [
          {
            question: "What is Jam3a?",
            answer: "Jam3a is Saudi Arabia's first group-buying platform that helps you save money by shopping together with others. When multiple people join a Jam3a (group), everyone gets a discount on the product."
          },
          {
            question: "How is Jam3a different from regular online shopping?",
            answer: "Unlike traditional e-commerce where you shop individually, Jam3a allows you to team up with others to unlock group discounts. The more people join a group, the bigger the discount everyone gets. This social shopping experience helps you save money while connecting with others who want the same products."
          }
        ],
        howItWorks: [
          {
            question: "How do I join a Jam3a?",
            answer: "You can browse active Jam3a deals on our platform and join any that interest you. Simply click 'Join This Jam3a' on the product page, complete the checkout process, and wait for the group to fill up."
          },
          {
            question: "How do I start my own Jam3a?",
            answer: "To start your own Jam3a, click on 'Start a Jam3a' button, select a product you want to buy, set your group size (how many people need to join), set a time limit, and share your unique Jam3a link with friends and family."
          },
          {
            question: "What happens if the group doesn't fill up?",
            answer: "If a Jam3a doesn't reach the required number of participants within the time limit, you'll receive a full refund of your payment. There's no risk in joining a Jam3a!"
          },
          {
            question: "How long does a Jam3a stay active?",
            answer: "The duration depends on the specific Jam3a. When starting a Jam3a, the creator sets a time limit (typically 24 hours to 14 days). The group must fill up within this time period to unlock the discount."
          }
        ],
        payments: [
          {
            question: "When will I be charged?",
            answer: "Your payment method will be authorized when you join a Jam3a, but you'll only be charged once the group successfully fills up. If the group doesn't fill up within the time limit, no charge will be made."
          },
          {
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including Mada, credit cards (Visa/Mastercard), Apple Pay, and STC Pay. All payments are processed securely through our payment partner, Moyasar."
          },
          {
            question: "Is it safe to make payments on Jam3a?",
            answer: "Yes, all payments on Jam3a are secure. We use industry-standard encryption and partner with trusted payment processors to ensure your financial information is protected. We never store your full credit card details on our servers."
          }
        ],
        delivery: [
          {
            question: "How long does delivery take?",
            answer: "Once a Jam3a is successfully filled, orders are processed within 24 hours. Delivery typically takes 2-5 business days depending on your location within Saudi Arabia."
          },
          {
            question: "Is there a delivery fee?",
            answer: "Standard delivery is free for all orders. We also offer express delivery options for an additional fee during checkout."
          },
          {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can use this number to track your package on our website or directly through the courier's tracking system."
          },
          {
            question: "Do you deliver to all areas in Saudi Arabia?",
            answer: "Yes, we deliver to all cities and regions across Saudi Arabia. Delivery times may vary depending on your location, with major cities typically receiving orders faster than remote areas."
          }
        ],
        returns: [
          {
            question: "What is your return policy?",
            answer: "We offer a 7-day return window for most products. Items must be unused, in their original packaging, and in the same condition you received them. Some categories like opened electronics or personal care items may not be eligible for returns."
          },
          {
            question: "How do I request a return?",
            answer: "To initiate a return, log in to your account, go to 'My Orders', select the order containing the item you want to return, and click 'Request Return'. Follow the instructions to complete your return request."
          },
          {
            question: "How long does it take to process refunds?",
            answer: "Once we receive and inspect the returned item, we'll process your refund within 3 business days. It may take an additional 5-7 business days for the refund to appear in your account, depending on your payment method and bank."
          },
          {
            question: "Do I have to pay for return shipping?",
            answer: "For returns due to product defects or our error, return shipping is free. For returns due to change of mind or other reasons, you'll need to cover the return shipping costs."
          }
        ]
      },
      contactSupport: "Still have questions?",
      contactButton: "Contact Support"
    },
    ar: {
      title: "الأسئلة الشائعة",
      subtitle: "اعثر على إجابات للأسئلة الشائعة حول جمعة",
      description: "لم تجد ما تبحث عنه؟ اتصل بفريق الدعم للحصول على المساعدة.",
      categories: {
        general: "عام",
        howItWorks: "كيف تعمل",
        payments: "المدفوعات",
        delivery: "التوصيل والشحن",
        returns: "الإرجاع واسترداد الأموال"
      },
      faqs: {
        general: [
          {
            question: "ما هي جمعة؟",
            answer: "جمعة هي أول منصة للشراء الجماعي في المملكة العربية السعودية تساعدك على توفير المال من خلال التسوق مع الآخرين. عندما ينضم عدة أشخاص إلى جمعة (مجموعة)، يحصل الجميع على خصم على المنتج."
          },
          {
            question: "كيف تختلف جمعة عن التسوق عبر الإنترنت العادي؟",
            answer: "على عكس التجارة الإلكترونية التقليدية حيث تتسوق بشكل فردي، تتيح لك جمعة التعاون مع الآخرين للحصول على خصومات جماعية. كلما انضم المزيد من الأشخاص إلى المجموعة، كلما زاد الخصم الذي يحصل عليه الجميع. تساعدك تجربة التسوق الاجتماعية هذه على توفير المال مع التواصل مع الآخرين الذين يرغبون في نفس المنتجات."
          }
        ],
        howItWorks: [
          {
            question: "كيف أنضم إلى جمعة؟",
            answer: "يمكنك تصفح صفقات جمعة النشطة على منصتنا والانضمام إلى أي منها تهتم بها. ما عليك سوى النقر فوق 'انضم إلى هذه الجمعة' على صفحة المنتج، وإكمال عملية الدفع، والانتظار حتى تمتلئ المجموعة."
          },
          {
            question: "كيف أبدأ جمعتي الخاصة؟",
            answer: "لبدء جمعتك الخاصة، انقر على زر 'ابدأ جمعة'، واختر منتجًا تريد شراءه، وحدد حجم المجموعة (عدد الأشخاص الذين يحتاجون للانضمام)، وحدد مهلة زمنية، وشارك رابط جمعتك الفريد مع الأصدقاء والعائلة."
          },
          {
            question: "ماذا يحدث إذا لم تمتلئ المجموعة؟",
            answer: "إذا لم تصل جمعة إلى العدد المطلوب من المشاركين خلال المهلة الزمنية، فستتلقى استردادًا كاملاً لدفعتك. لا توجد مخاطرة في الانضمام إلى جمعة!"
          },
          {
            question: "كم من الوقت تظل جمعة نشطة؟",
            answer: "تعتمد المدة على جمعة محددة. عند بدء جمعة، يحدد المنشئ مهلة زمنية (عادةً من 24 ساعة إلى 14 يومًا). يجب أن تمتلئ المجموعة خلال هذه الفترة الزمنية للحصول على الخصم."
          }
        ],
        payments: [
          {
            question: "متى سيتم خصم المبلغ مني؟",
            answer: "سيتم تفويض طريقة الدفع الخاصة بك عند الانضمام إلى جمعة، ولكن سيتم خصم المبلغ منك فقط بمجرد امتلاء المجموعة بنجاح. إذا لم تمتلئ المجموعة خلال المهلة الزمنية، فلن يتم إجراء أي خصم."
          },
          {
            question: "ما هي طرق الدفع التي تقبلونها؟",
            answer: "نقبل طرق دفع متنوعة بما في ذلك مدى، وبطاقات الائتمان (فيزا/ماستركارد)، وApple Pay، وSTC Pay. تتم معالجة جميع المدفوعات بشكل آمن من خلال شريك الدفع لدينا، ميسر."
          },
          {
            question: "هل من الآمن إجراء مدفوعات على جمعة؟",
            answer: "نعم، جميع المدفوعات على جمعة آمنة. نستخدم تشفيرًا بمعايير الصناعة ونتعاون مع معالجات دفع موثوقة لضمان حماية معلوماتك المالية. نحن لا نخزن أبدًا تفاصيل بطاقة الائتمان الكاملة الخاصة بك على خوادمنا."
          }
        ],
        delivery: [
          {
            question: "كم من الوقت يستغرق التوصيل؟",
            answer: "بمجرد امتلاء جمعة بنجاح، تتم معالجة الطلبات في غضون 24 ساعة. يستغرق التوصيل عادةً من 2 إلى 5 أيام عمل حسب موقعك داخل المملكة العربية السعودية."
          },
          {
            question: "هل هناك رسوم توصيل؟",
            answer: "التوصيل القياسي مجاني لجميع الطلبات. نقدم أيضًا خيارات التوصيل السريع مقابل رسوم إضافية أثناء الدفع."
          },
          {
            question: "كيف يمكنني تتبع طلبي؟",
            answer: "بمجرد شحن طلبك، ستتلقى رقم تتبع عبر البريد الإلكتروني والرسائل القصيرة. يمكنك استخدام هذا الرقم لتتبع طردك على موقعنا الإلكتروني أو مباشرة من خلال نظام التتبع الخاص بشركة الشحن."
          },
          {
            question: "هل توصلون إلى جميع المناطق في المملكة العربية السعودية؟",
            answer: "نعم، نقوم بالتوصيل إلى جميع المدن والمناطق في جميع أنحاء المملكة العربية السعودية. قد تختلف أوقات التسليم حسب موقعك، حيث تتلقى المدن الرئيسية عادةً الطلبات بشكل أسرع من المناطق النائية."
          }
        ],
        returns: [
          {
            question: "ما هي سياسة الإرجاع الخاصة بكم؟",
            answer: "نقدم نافذة إرجاع مدتها 7 أيام لمعظم المنتجات. يجب أن تكون العناصر غير مستخدمة، في عبواتها الأصلية، وبنفس الحالة التي استلمتها بها. بعض الفئات مثل الإلكترونيات المفتوحة أو منتجات العناية الشخصية قد لا تكون مؤهلة للإرجاع."
          },
          {
            question: "كيف أطلب إرجاع؟",
            answer: "لبدء عملية إرجاع، قم بتسجيل الدخول إلى حسابك، وانتقل إلى 'طلباتي'، وحدد الطلب الذي يحتوي على العنصر الذي تريد إرجاعه، وانقر على 'طلب إرجاع'. اتبع التعليمات لإكمال طلب الإرجاع الخاص بك."
          },
          {
            question: "كم من الوقت يستغرق معالجة المبالغ المستردة؟",
            answer: "بمجرد استلامنا وفحص العنصر المرتجع، سنعالج استردادك في غضون 3 أيام عمل. قد يستغرق الأمر 5-7 أيام عمل إضافية حتى يظهر المبلغ المسترد في حسابك، اعتمادًا على طريقة الدفع والبنك الخاص بك."
          },
          {
            question: "هل يجب أن أدفع مقابل شحن الإرجاع؟",
            answer: "بالنسبة للإرجاع بسبب عيوب المنتج أو خطأنا، فإن شحن الإرجاع مجاني. بالنسبة للإرجاع بسبب تغيير الرأي أو أسباب أخرى، ستحتاج إلى تغطية تكاليف شحن الإرجاع."
          }
        ]
      },
      contactSupport: "هل لا تزال لديك أسئلة؟",
      contactButton: "اتصل بالدعم"
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

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
                  <TabsTrigger value="general">{currentContent.categories.general}</TabsTrigger>
                  <TabsTrigger value="howItWorks">{currentContent.categories.howItWorks}</TabsTrigger>
                  <TabsTrigger value="payments">{currentContent.categories.payments}</TabsTrigger>
                  <TabsTrigger value="delivery">{currentContent.categories.delivery}</TabsTrigger>
                  <TabsTrigger value="returns">{currentContent.categories.returns}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {currentContent.faqs.general.map((faq, index) => (
                      <AccordionItem key={index} value={`general-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <HelpCircle className="h-5 w-5 text-jam3a-purple mr-2 flex-shrink-0" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-7">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="howItWorks" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {currentContent.faqs.howItWorks.map((faq, index) => (
                      <AccordionItem key={index} value={`howItWorks-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <HelpCircle className="h-5 w-5 text-jam3a-purple mr-2 flex-shrink-0" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-7">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="payments" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {currentContent.faqs.payments.map((faq, index) => (
                      <AccordionItem key={index} value={`payments-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <HelpCircle className="h-5 w-5 text-jam3a-purple mr-2 flex-shrink-0" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-7">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="delivery" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {currentContent.faqs.delivery.map((faq, index) => (
                      <AccordionItem key={index} value={`delivery-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <HelpCircle className="h-5 w-5 text-jam3a-purple mr-2 flex-shrink-0" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-7">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="returns" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {currentContent.faqs.returns.map((faq, index) => (
                      <AccordionItem key={index} value={`returns-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <HelpCircle className="h-5 w-5 text-jam3a-purple mr-2 flex-shrink-0" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-7">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">{currentContent.contactSupport}</h2>
            <Button size="lg" className="bg-jam3a-purple hover:bg-jam3a-deep-purple">
              {currentContent.contactButton}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
