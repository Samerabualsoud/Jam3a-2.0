import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const SellerSupport = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  
  const content = {
    en: {
      title: "Seller Support",
      subtitle: "Get help with your seller account and listings",
      contactTab: "Contact Support",
      faqTab: "FAQ",
      resourcesTab: "Resources",
      ticketsTab: "My Tickets",
      contact: {
        title: "Contact Seller Support",
        description: "Our dedicated seller support team is here to help you with any questions or issues.",
        name: "Full Name",
        email: "Email Address",
        subject: "Subject",
        category: "Category",
        categories: {
          account: "Account Management",
          listing: "Product Listing",
          orders: "Orders & Fulfillment",
          payments: "Payments & Finances",
          policy: "Policies & Guidelines",
          technical: "Technical Issues",
          other: "Other"
        },
        message: "Message",
        messagePlaceholder: "Please describe your issue in detail...",
        submit: "Submit Ticket",
        success: "Your support ticket has been submitted successfully. We'll get back to you within 24 hours.",
        contactMethods: "Other Ways to Contact Us",
        phone: "Phone Support",
        phoneHours: "Available Sunday-Thursday, 9am-5pm",
        phoneNumber: "+966 12 345 6789",
        email: "Email Support",
        emailAddress: "seller.support@jam3a.me",
        chat: "Live Chat",
        chatHours: "Available 24/7 for Premium Sellers",
        startChat: "Start Chat"
      },
      faq: {
        title: "Frequently Asked Questions",
        description: "Find quick answers to common seller questions",
        categories: {
          getting_started: "Getting Started",
          account: "Account Management",
          listings: "Product Listings",
          orders: "Orders & Fulfillment",
          payments: "Payments & Finances",
          policies: "Policies & Guidelines"
        },
        questions: {
          getting_started: [
            {
              question: "How do I become a seller on Jam3a?",
              answer: "To become a seller on Jam3a, you need to register through our seller portal, provide your business information, upload required documents (commercial registration, tax certificate), and complete our verification process. Once approved, you can start listing products and creating Jam3a deals."
            },
            {
              question: "What are the fees for selling on Jam3a?",
              answer: "Jam3a charges a one-time registration fee of SAR 500, plus a commission of 10-15% on each sale (varies by category). There's also a 2.5% payment processing fee. Optional services like featured listings have additional costs. You can find a detailed breakdown in your seller dashboard."
            },
            {
              question: "How long does the seller approval process take?",
              answer: "The seller approval process typically takes 3-5 business days. This includes verification of your business documents, quality assessment, and account setup. You'll receive email notifications at each stage of the process."
            }
          ],
          account: [
            {
              question: "How do I update my seller information?",
              answer: "You can update your seller information by logging into your seller dashboard, navigating to 'Account Settings', and editing the relevant information. Some changes may require verification or approval before taking effect."
            },
            {
              question: "What should I do if I forgot my seller account password?",
              answer: "If you forgot your password, click on the 'Forgot Password' link on the seller login page. You'll receive an email with instructions to reset your password. For security reasons, password reset links expire after 24 hours."
            },
            {
              question: "Can I have multiple users access my seller account?",
              answer: "Yes, you can add multiple users to your seller account with different permission levels. Go to 'Account Settings' > 'User Management' to add new users and set their access permissions."
            }
          ],
          listings: [
            {
              question: "How do I create a Jam3a deal for my products?",
              answer: "To create a Jam3a deal, go to your seller dashboard, select 'Create New Jam3a', choose the product from your inventory, set the Jam3a price (minimum 15% discount), specify group size and duration, and submit for approval. Deals are typically reviewed within 24 hours."
            },
            {
              question: "What types of products sell best on Jam3a?",
              answer: "Products with broad appeal, clear value proposition, and significant discounts perform best on Jam3a. Electronics, home appliances, fashion items, and beauty products are particularly popular. Products with high perceived value and good margins for discounting tend to attract more participants."
            },
            {
              question: "How many images should I upload for each product?",
              answer: "You should upload at least 3 high-quality images for each product, showing different angles and features. The recommended image size is 1000x1000 pixels with a white background. Clear, professional images significantly increase conversion rates."
            }
          ],
          orders: [
            {
              question: "When do I need to ship orders after a Jam3a completes?",
              answer: "You must ship orders within 2 business days after a Jam3a successfully completes. You'll receive a notification when a Jam3a reaches its participant goal, and you should update the tracking information in your seller dashboard as soon as the item ships."
            },
            {
              question: "How do I handle returns and refunds?",
              answer: "When a customer requests a return, you'll receive a notification in your dashboard. Review the request within 24 hours, approve valid returns, and process refunds promptly once you receive the returned item. All returns must follow our Returns Policy guidelines."
            },
            {
              question: "What happens if I can't fulfill an order?",
              answer: "If you cannot fulfill an order, contact Seller Support immediately. Cancellations negatively impact your seller metrics and may result in penalties. In case of inventory issues, we recommend updating your stock levels regularly to prevent overselling."
            }
          ],
          payments: [
            {
              question: "When and how do I receive payment for completed Jam3a deals?",
              answer: "Payments are processed bi-weekly, with funds transferred directly to your registered bank account. The payment cycle runs from the 1st to the 15th and from the 16th to the end of each month, with payments released within 3 business days after the cycle ends."
            },
            {
              question: "How can I view my earnings and fees?",
              answer: "You can view detailed reports of your earnings, commissions, and fees in the 'Finances' section of your seller dashboard. Reports can be filtered by date range, product category, or specific Jam3a deals, and can be exported for your records."
            },
            {
              question: "What tax documents does Jam3a provide?",
              answer: "Jam3a provides monthly and annual transaction statements for tax purposes. These documents include all sales, commissions, and fees. You can download these statements from the 'Finances' > 'Tax Documents' section of your seller dashboard."
            }
          ],
          policies: [
            {
              question: "What are the product quality requirements?",
              answer: "All products must be authentic, as described, and meet Saudi Arabian safety and quality standards. Products must include clear images, detailed specifications in both Arabic and English, and valid warranties where applicable. Products that don't meet our quality standards will be rejected."
            },
            {
              question: "What happens if I violate Jam3a's seller policies?",
              answer: "Policy violations are handled based on severity and frequency. First-time minor violations typically result in warnings, while serious or repeated violations may lead to listing removal, account restrictions, or termination. Jam3a reserves the right to withhold payments for orders involved in policy violations."
            },
            {
              question: "How does Jam3a handle disputes between sellers and buyers?",
              answer: "Jam3a's dispute resolution team reviews evidence from both parties and makes determinations based on our policies and Saudi consumer protection laws. We encourage sellers to resolve issues directly with buyers first, but we'll intervene when necessary to ensure fair outcomes."
            }
          ]
        }
      },
      resources: {
        title: "Seller Resources",
        description: "Tools and guides to help you succeed on Jam3a",
        guides: {
          title: "Seller Guides",
          items: [
            {
              title: "Getting Started Guide",
              description: "Step-by-step instructions for new sellers",
              link: "/seller-resources/getting-started.pdf"
            },
            {
              title: "Product Photography Guide",
              description: "Tips for creating high-quality product images",
              link: "/seller-resources/photography-guide.pdf"
            },
            {
              title: "Pricing Strategy Guide",
              description: "How to set effective prices for Jam3a deals",
              link: "/seller-resources/pricing-strategy.pdf"
            },
            {
              title: "Shipping Best Practices",
              description: "Optimize your fulfillment process",
              link: "/seller-resources/shipping-guide.pdf"
            }
          ]
        },
        tools: {
          title: "Seller Tools",
          items: [
            {
              title: "Bulk Listing Tool",
              description: "Upload multiple products at once",
              link: "/seller-tools/bulk-listing"
            },
            {
              title: "Inventory Manager",
              description: "Track and update your product inventory",
              link: "/seller-tools/inventory"
            },
            {
              title: "Sales Analytics",
              description: "Detailed reports on your sales performance",
              link: "/seller-tools/analytics"
            },
            {
              title: "Shipping Label Generator",
              description: "Create and print shipping labels",
              link: "/seller-tools/shipping-labels"
            }
          ]
        },
        webinars: {
          title: "Webinars & Training",
          items: [
            {
              title: "New Seller Orientation",
              description: "Live session every Sunday at 7pm",
              link: "/seller-webinars/orientation"
            },
            {
              title: "Optimizing Your Product Listings",
              description: "On-demand training video",
              link: "/seller-webinars/product-listings"
            },
            {
              title: "Customer Service Excellence",
              description: "On-demand training video",
              link: "/seller-webinars/customer-service"
            },
            {
              title: "Understanding Seller Analytics",
              description: "Live session every Wednesday at 1pm",
              link: "/seller-webinars/analytics"
            }
          ]
        }
      },
      tickets: {
        title: "My Support Tickets",
        description: "Track and manage your support requests",
        noTickets: "You don't have any support tickets yet",
        createTicket: "Create New Ticket",
        ticketId: "Ticket ID",
        subject: "Subject",
        status: "Status",
        lastUpdated: "Last Updated",
        view: "View",
        statuses: {
          open: "Open",
          inProgress: "In Progress",
          awaitingInfo: "Awaiting Your Response",
          resolved: "Resolved",
          closed: "Closed"
        }
      }
    },
    ar: {
      title: "دعم البائع",
      subtitle: "احصل على مساعدة بخصوص حساب البائع والقوائم الخاصة بك",
      contactTab: "الاتصال بالدعم",
      faqTab: "الأسئلة الشائعة",
      resourcesTab: "الموارد",
      ticketsTab: "تذاكري",
      contact: {
        title: "الاتصال بدعم البائع",
        description: "فريق دعم البائع المخصص لدينا موجود هنا لمساعدتك في أي أسئلة أو مشكلات.",
        name: "الاسم الكامل",
        email: "عنوان البريد الإلكتروني",
        subject: "الموضوع",
        category: "الفئة",
        categories: {
          account: "إدارة الحساب",
          listing: "قائمة المنتجات",
          orders: "الطلبات والتنفيذ",
          payments: "المدفوعات والمالية",
          policy: "السياسات والإرشادات",
          technical: "مشاكل تقنية",
          other: "أخرى"
        },
        message: "الرسالة",
        messagePlaceholder: "يرجى وصف مشكلتك بالتفصيل...",
        submit: "إرسال التذكرة",
        success: "تم إرسال تذكرة الدعم الخاصة بك بنجاح. سنرد عليك في غضون 24 ساعة.",
        contactMethods: "طرق أخرى للاتصال بنا",
        phone: "دعم الهاتف",
        phoneHours: "متاح من الأحد إلى الخميس، من 9 صباحًا حتى 5 مساءً",
        phoneNumber: "+966 12 345 6789",
        email: "دعم البريد الإلكتروني",
        emailAddress: "seller.support@jam3a.me",
        chat: "الدردشة المباشرة",
        chatHours: "متاح على مدار الساعة طوال أيام الأسبوع للبائعين المميزين",
        startChat: "بدء الدردشة"
      },
      faq: {
        title: "الأسئلة الشائعة",
        description: "ابحث عن إجابات سريعة للأسئلة الشائعة للبائعين",
        categories: {
          getting_started: "البدء",
          account: "إدارة الحساب",
          listings: "قوائم المنتجات",
          orders: "الطلبات والتنفيذ",
          payments: "المدفوعات والمالية",
          policies: "السياسات والإرشادات"
        },
        questions: {
          getting_started: [
            {
              question: "كيف أصبح بائعًا على جمعة؟",
              answer: "لتصبح بائعًا على جمعة، تحتاج إلى التسجيل من خلال بوابة البائع لدينا، وتقديم معلومات عملك، وتحميل المستندات المطلوبة (السجل التجاري، شهادة الضريبة)، وإكمال عملية التحقق لدينا. بمجرد الموافقة، يمكنك البدء في إدراج المنتجات وإنشاء صفقات جمعة."
            },
            {
              question: "ما هي رسوم البيع على جمعة؟",
              answer: "تفرض جمعة رسوم تسجيل لمرة واحدة قدرها 500 ريال سعودي، بالإضافة إلى عمولة 10-15٪ على كل عملية بيع (تختلف حسب الفئة). هناك أيضًا رسوم معالجة الدفع بنسبة 2.5٪. الخدمات الاختيارية مثل القوائم المميزة لها تكاليف إضافية. يمكنك العثور على تفصيل مفصل في لوحة تحكم البائع الخاصة بك."
            },
            {
              question: "كم من الوقت تستغرق عملية الموافقة على البائع؟",
              answer: "تستغرق عملية الموافقة على البائع عادةً 3-5 أيام عمل. وهذا يشمل التحقق من مستندات عملك، وتقييم الجودة، وإعداد الحساب. ستتلقى إشعارات بالبريد الإلكتروني في كل مرحلة من مراحل العملية."
            }
          ],
          account: [
            {
              question: "كيف يمكنني تحديث معلومات البائع الخاصة بي؟",
              answer: "يمكنك تحديث معلومات البائع الخاصة بك عن طريق تسجيل الدخول إلى لوحة تحكم البائع الخاصة بك، والانتقال إلى 'إعدادات الحساب'، وتحرير المعلومات ذات الصلة. قد تتطلب بعض التغييرات التحقق أو الموافقة قبل أن تصبح سارية المفعول."
            },
            {
              question: "ماذا أفعل إذا نسيت كلمة مرور حساب البائع الخاص بي؟",
              answer: "إذا نسيت كلمة المرور الخاصة بك، انقر على رابط 'نسيت كلمة المرور' في صفحة تسجيل دخول البائع. ستتلقى بريدًا إلكترونيًا يحتوي على تعليمات لإعادة تعيين كلمة المرور الخاصة بك. لأسباب أمنية، تنتهي صلاحية روابط إعادة تعيين كلمة المرور بعد 24 ساعة."
            },
            {
              question: "هل يمكنني السماح لمستخدمين متعددين بالوصول إلى حساب البائع الخاص بي؟",
              answer: "نعم، يمكنك إضافة مستخدمين متعددين إلى حساب البائع الخاص بك مع مستويات أذونات مختلفة. انتقل إلى 'إعدادات الحساب' > 'إدارة المستخدمين' لإضافة مستخدمين جدد وتعيين أذونات الوصول الخاصة بهم."
            }
          ],
          listings: [
            {
              question: "كيف يمكنني إنشاء صفقة جمعة لمنتجاتي؟",
              answer: "لإنشاء صفقة جمعة، انتقل إلى لوحة تحكم البائع الخاصة بك، وحدد 'إنشاء جمعة جديدة'، واختر المنتج من مخزونك، وحدد سعر جمعة (خصم 15٪ كحد أدنى)، وحدد حجم المجموعة والمدة، وقدمها للموافقة. تتم مراجعة الصفقات عادةً في غضون 24 ساعة."
            },
            {
              question: "ما هي أنواع المنتجات التي تباع بشكل أفضل على جمعة؟",
              answer: "المنتجات ذات الجاذبية الواسعة، وعرض القيمة الواضح، والخصومات الكبيرة تؤدي أداءً أفضل على جمعة. الإلكترونيات، والأجهزة المنزلية، والأزياء، ومنتجات الجمال شائعة بشكل خاص. المنتجات ذات القيمة المتصورة العالية وهوامش جيدة للخصم تميل إلى جذب المزيد من المشاركين."
            },
            {
              question: "كم عدد الصور التي يجب أن أقوم بتحميلها لكل منتج؟",
              answer: "يجب عليك تحميل 3 صور عالية الجودة على الأقل لكل منتج، تظهر زوايا وميزات مختلفة. حجم الصورة الموصى به هو 1000 × 1000 بكسل مع خلفية بيضاء. الصور الواضحة والاحترافية تزيد بشكل كبير من معدلات التحويل."
            }
          ],
          orders: [
            {
              question: "متى أحتاج إلى شحن الطلبات بعد اكتمال جمعة؟",
              answer: "يجب عليك شحن الطلبات في غضون يومي عمل بعد اكتمال جمعة بنجاح. ستتلقى إشعارًا عندما تصل جمعة إلى هدف المشاركين، ويجب عليك تحديث معلومات التتبع في لوحة تحكم البائع الخاصة بك بمجرد شحن العنصر."
            },
            {
              question: "كيف أتعامل مع المرتجعات والمبالغ المستردة؟",
              answer: "عندما يطلب العميل إرجاعًا، ستتلقى إشعارًا في لوحة التحكم الخاصة بك. راجع الطلب في غضون 24 ساعة، واعتمد المرتجعات الصالحة، وعالج المبالغ المستردة فورًا بمجرد استلام العنصر المرتجع. يجب أن تتبع جميع المرتجعات إرشادات سياسة الإرجاع لدينا."
            },
            {
              question: "ماذا يحدث إذا لم أتمكن من تنفيذ طلب؟",
              answer: "إذا لم تتمكن من تنفيذ طلب، اتصل بدعم البائع على الفور. تؤثر الإلغاءات سلبًا على مقاييس البائع الخاصة بك وقد تؤدي إلى عقوبات. في حالة وجود مشكلات في المخزون، نوصي بتحديث مستويات المخزون لديك بانتظام لمنع البيع الزائد."
            }
          ],
          payments: [
            {
              question: "متى وكيف أتلقى الدفع مقابل صفقات جمعة المكتملة؟",
              answer: "تتم معالجة المدفوعات كل أسبوعين، مع تحويل الأموال مباشرة إلى حسابك المصرفي المسجل. تعمل دورة الدفع من 1 إلى 15 ومن 16 إلى نهاية كل شهر، مع إصدار المدفوعات في غضون 3 أيام عمل بعد انتهاء الدورة."
            },
            {
              question: "كيف يمكنني عرض أرباحي ورسومي؟",
              answer: "يمكنك عرض تقارير مفصلة عن أرباحك وعمولاتك ورسومك في قسم 'المالية' من لوحة تحكم البائع الخاصة بك. يمكن تصفية التقارير حسب النطاق الزمني أو فئة المنتج أو صفقات جمعة محددة، ويمكن تصديرها لسجلاتك."
            },
            {
              question: "ما هي المستندات الضريبية التي توفرها جمعة؟",
              answer: "توفر جمعة بيانات المعاملات الشهرية والسنوية للأغراض الضريبية. تتضمن هذه المستندات جميع المبيعات والعمولات والرسوم. يمكنك تنزيل هذه البيانات من قسم 'المالية' > 'المستندات الضريبية' في لوحة تحكم البائع الخاصة بك."
            }
          ],
          policies: [
            {
              question: "ما هي متطلبات جودة المنتج؟",
              answer: "يجب أن تكون جميع المنتجات أصلية، كما هو موصوف، وتلبي معايير السلامة والجودة السعودية. يجب أن تتضمن المنتجات صورًا واضحة، ومواصفات مفصلة باللغتين العربية والإنجليزية، وضمانات صالحة حيثما ينطبق ذلك. سيتم رفض المنتجات التي لا تلبي معايير الجودة لدينا."
            },
            {
              question: "ماذا يحدث إذا انتهكت سياسات البائع في جمعة؟",
              answer: "يتم التعامل مع انتهاكات السياسة بناءً على شدتها وتكرارها. عادةً ما تؤدي الانتهاكات الطفيفة للمرة الأولى إلى تحذيرات، بينما قد تؤدي الانتهاكات الخطيرة أو المتكررة إلى إزالة القائمة أو قيود الحساب أو إنهائه. تحتفظ جمعة بالحق في حجب المدفوعات للطلبات المتورطة في انتهاكات السياسة."
            },
            {
              question: "كيف تتعامل جمعة مع النزاعات بين البائعين والمشترين؟",
              answer: "يراجع فريق حل النزاعات في جمعة الأدلة من كلا الطرفين ويتخذ قرارات بناءً على سياساتنا وقوانين حماية المستهلك السعودية. نشجع البائعين على حل المشكلات مباشرة مع المشترين أولاً، ولكننا سنتدخل عند الضرورة لضمان نتائج عادلة."
            }
          ]
        }
      },
      resources: {
        title: "موارد البائع",
        description: "أدوات وأدلة لمساعدتك على النجاح في جمعة",
        guides: {
          title: "أدلة البائع",
          items: [
            {
              title: "دليل البدء",
              description: "تعليمات خطوة بخطوة للبائعين الجدد",
              link: "/seller-resources/getting-started.pdf"
            },
            {
              title: "دليل تصوير المنتج",
              description: "نصائح لإنشاء صور منتج عالية الجودة",
              link: "/seller-resources/photography-guide.pdf"
            },
            {
              title: "دليل استراتيجية التسعير",
              description: "كيفية تحديد أسعار فعالة لصفقات جمعة",
              link: "/seller-resources/pricing-strategy.pdf"
            },
            {
              title: "أفضل ممارسات الشحن",
              description: "تحسين عملية التنفيذ الخاصة بك",
              link: "/seller-resources/shipping-guide.pdf"
            }
          ]
        },
        tools: {
          title: "أدوات البائع",
          items: [
            {
              title: "أداة القائمة المجمعة",
              description: "تحميل منتجات متعددة في وقت واحد",
              link: "/seller-tools/bulk-listing"
            },
            {
              title: "مدير المخزون",
              description: "تتبع وتحديث مخزون المنتج الخاص بك",
              link: "/seller-tools/inventory"
            },
            {
              title: "تحليلات المبيعات",
              description: "تقارير مفصلة عن أداء مبيعاتك",
              link: "/seller-tools/analytics"
            },
            {
              title: "مولد ملصقات الشحن",
              description: "إنشاء وطباعة ملصقات الشحن",
              link: "/seller-tools/shipping-labels"
            }
          ]
        },
        webinars: {
          title: "الندوات عبر الإنترنت والتدريب",
          items: [
            {
              title: "توجيه البائع الجديد",
              description: "جلسة مباشرة كل يوم أحد الساعة 7 مساءً",
              link: "/seller-webinars/orientation"
            },
            {
              title: "تحسين قوائم المنتجات الخاصة بك",
              description: "فيديو تدريبي عند الطلب",
              link: "/seller-webinars/product-listings"
            },
            {
              title: "التميز في خدمة العملاء",
              description: "فيديو تدريبي عند الطلب",
              link: "/seller-webinars/customer-service"
            },
            {
              title: "فهم تحليلات البائع",
              description: "جلسة مباشرة كل يوم أربعاء الساعة 1 ظهرًا",
              link: "/seller-webinars/analytics"
            }
          ]
        }
      },
      tickets: {
        title: "تذاكر الدعم الخاصة بي",
        description: "تتبع وإدارة طلبات الدعم الخاصة بك",
        noTickets: "ليس لديك أي تذاكر دعم حتى الآن",
        createTicket: "إنشاء تذكرة جديدة",
        ticketId: "معرف التذكرة",
        subject: "الموضوع",
        status: "الحالة",
        lastUpdated: "آخر تحديث",
        view: "عرض",
        statuses: {
          open: "مفتوحة",
          inProgress: "قيد التنفيذ",
          awaitingInfo: "في انتظار ردك",
          resolved: "تم حلها",
          closed: "مغلقة"
        }
      }
    }
  };

  const currentContent = content[language];
  
  // Sample data for support tickets
  const supportTickets = [
    {
      id: "TICKET-001",
      subject: "Payment not received for completed Jam3a",
      status: "inProgress",
      lastUpdated: "2023-04-01"
    },
    {
      id: "TICKET-002",
      subject: "Need help with bulk product upload",
      status: "resolved",
      lastUpdated: "2023-03-25"
    },
    {
      id: "TICKET-003",
      subject: "Question about return policy",
      status: "awaitingInfo",
      lastUpdated: "2023-04-02"
    }
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real implementation, this would submit the form to the backend
    // For now, we'll just simulate it
    toast({
      title: currentContent.contact.success,
      variant: "success"
    });
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    });
  };
  
  const renderContactForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">{currentContent.contact.name}</label>
            <Input
              id="name"
              name="name"
              value={contactForm.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">{currentContent.contact.email}</label>
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
          <label htmlFor="subject" className="text-sm font-medium">{currentContent.contact.subject}</label>
          <Input
            id="subject"
            name="subject"
            value={contactForm.subject}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">{currentContent.contact.category}</label>
          <Select
            value={contactForm.category}
            onValueChange={(value) => setContactForm({...contactForm, category: value})}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={currentContent.contact.category} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currentContent.contact.categories).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">{currentContent.contact.message}</label>
          <Textarea
            id="message"
            name="message"
            placeholder={currentContent.contact.messagePlaceholder}
            rows={6}
            value={contactForm.message}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <Button type="submit" className="w-full">
          {currentContent.contact.submit}
        </Button>
      </form>
    );
  };
  
  const renderContactMethods = () => {
    return (
      <div className="space-y-6 mt-8">
        <h3 className="text-lg font-medium">{currentContent.contact.contactMethods}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-medium">{currentContent.contact.phone}</h4>
              <p className="text-sm text-muted-foreground mt-1">{currentContent.contact.phoneHours}</p>
              <p className="text-lg font-medium mt-2">{currentContent.contact.phoneNumber}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="font-medium">{currentContent.contact.email}</h4>
              <p className="text-sm text-muted-foreground mt-1">&nbsp;</p>
              <p className="text-lg font-medium mt-2">{currentContent.contact.emailAddress}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="font-medium">{currentContent.contact.chat}</h4>
              <p className="text-sm text-muted-foreground mt-1">{currentContent.contact.chatHours}</p>
              <Button className="mt-4">{currentContent.contact.startChat}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderFAQ = () => {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="getting_started">
          <TabsList className="w-full flex flex-wrap h-auto">
            {Object.entries(currentContent.faq.categories).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="flex-1">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(currentContent.faq.questions).map(([category, questions]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {questions.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };
  
  const renderResources = () => {
    const renderResourceSection = (section) => {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <Button variant="link" className="p-0 h-auto mt-1">
                      {language === 'en' ? 'View' : 'عرض'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    };
    
    return (
      <div className="space-y-8">
        {renderResourceSection(currentContent.resources.guides)}
        {renderResourceSection(currentContent.resources.tools)}
        {renderResourceSection(currentContent.resources.webinars)}
      </div>
    );
  };
  
  const renderTickets = () => {
    if (supportTickets.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">{currentContent.tickets.noTickets}</h3>
          <Button className="mt-4">
            {currentContent.tickets.createTicket}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button>
            {currentContent.tickets.createTicket}
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">{currentContent.tickets.ticketId}</th>
                <th className="text-left py-3 px-4">{currentContent.tickets.subject}</th>
                <th className="text-left py-3 px-4">{currentContent.tickets.status}</th>
                <th className="text-left py-3 px-4">{currentContent.tickets.lastUpdated}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b">
                  <td className="py-4 px-4">{ticket.id}</td>
                  <td className="py-4 px-4">{ticket.subject}</td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                      ticket.status === 'inProgress' ? 'bg-yellow-100 text-yellow-800' : 
                      ticket.status === 'awaitingInfo' ? 'bg-orange-100 text-orange-800' : 
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status === 'open' && <Clock className="mr-1 h-3 w-3" />}
                      {ticket.status === 'inProgress' && <Clock className="mr-1 h-3 w-3" />}
                      {ticket.status === 'awaitingInfo' && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {ticket.status === 'resolved' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {currentContent.tickets.statuses[ticket.status]}
                    </div>
                  </td>
                  <td className="py-4 px-4">{ticket.lastUpdated}</td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="outline" size="sm">
                      {currentContent.tickets.view}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
            <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
          </div>
          
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contact">{currentContent.contactTab}</TabsTrigger>
              <TabsTrigger value="faq">{currentContent.faqTab}</TabsTrigger>
              <TabsTrigger value="resources">{currentContent.resourcesTab}</TabsTrigger>
              <TabsTrigger value="tickets">{currentContent.ticketsTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.contact.title}</CardTitle>
                  <CardDescription>{currentContent.contact.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderContactForm()}
                  {renderContactMethods()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.faq.title}</CardTitle>
                  <CardDescription>{currentContent.faq.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderFAQ()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.resources.title}</CardTitle>
                  <CardDescription>{currentContent.resources.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderResources()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tickets" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.tickets.title}</CardTitle>
                  <CardDescription>{currentContent.tickets.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTickets()}
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

export default SellerSupport;
