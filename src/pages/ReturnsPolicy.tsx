import React from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Package, RefreshCcw, CheckCircle, HelpCircle } from 'lucide-react';

const ReturnsPolicy = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const content = {
    en: {
      title: "Returns Policy",
      lastUpdated: "Last Updated: April 1, 2025",
      introduction: {
        title: "Introduction",
        content: "At Jam3a Hub Collective, we want you to be completely satisfied with your purchase. This Returns Policy outlines the guidelines and procedures for returning products purchased through our platform."
      },
      eligibility: {
        title: "Return Eligibility",
        content: "To be eligible for a return, please ensure that:",
        items: [
          "Your item was purchased within the last 14 days",
          "The item is in its original condition",
          "The item is in its original packaging with all accessories and documentation",
          "You have the original receipt or proof of purchase"
        ]
      },
      nonReturnable: {
        title: "Non-Returnable Items",
        content: "The following items cannot be returned:",
        items: [
          "Opened software, digital products, or electronic downloads",
          "Gift cards or promotional vouchers",
          "Personalized or custom-made items",
          "Perishable goods",
          "Items marked as final sale or clearance",
          "Items that have been used, damaged, or altered after delivery"
        ]
      },
      process: {
        title: "Return Process",
        steps: [
          {
            title: "Initiate Return Request",
            content: "Contact our customer service team through your account or by emailing returns@jam3a.me with your order number and reason for return."
          },
          {
            title: "Receive Return Authorization",
            content: "Our team will review your request and provide you with a Return Authorization Number (RAN) and return instructions."
          },
          {
            title: "Package Your Return",
            content: "Pack the item securely in its original packaging with all accessories and include the RAN in your package."
          },
          {
            title: "Ship Your Return",
            content: "Ship the package to the address provided in the return instructions. We recommend using a trackable shipping method."
          },
          {
            title: "Refund Processing",
            content: "Once we receive and inspect your return, we will process your refund. Please allow 7-14 business days for the refund to appear in your account."
          }
        ]
      },
      refunds: {
        title: "Refunds",
        content: "Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-14 business days."
      },
      lateOrMissing: {
        title: "Late or Missing Refunds",
        content: "If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted. If you've done all of this and you still have not received your refund, please contact our customer service team."
      },
      shipping: {
        title: "Return Shipping",
        content: "You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund."
      },
      damaged: {
        title: "Damaged or Defective Items",
        content: "If you receive a damaged or defective item, please contact our customer service team immediately. We will work with you to resolve the issue, which may include replacement, repair, or refund."
      },
      exchanges: {
        title: "Exchanges",
        content: "We do not offer direct exchanges. If you wish to exchange an item, please return the original item for a refund and place a new order for the desired item."
      },
      groupBuying: {
        title: "Group Buying Considerations",
        content: "For items purchased through Jam3a group buying deals, the following additional considerations apply:",
        items: [
          "Returns must be initiated within 14 days of receiving the product (not from the date the group deal was completed)",
          "If a return affects the minimum group size requirement, the discount for remaining participants will not be affected",
          "For any disputes related to group buying returns, our customer service team will review each case individually"
        ]
      },
      contact: {
        title: "Contact Us",
        content: "If you have any questions about our Returns Policy, please contact us at:",
        email: "returns@jam3a.me",
        phone: "+966 12 345 6789",
        hours: "Sunday - Thursday: 9:00 AM - 6:00 PM (Saudi Arabia Time)"
      }
    },
    ar: {
      title: "سياسة الإرجاع",
      lastUpdated: "آخر تحديث: 1 أبريل 2025",
      introduction: {
        title: "مقدمة",
        content: "في جمعة هب كوليكتيف، نريد أن تكون راضيًا تمامًا عن مشترياتك. توضح سياسة الإرجاع هذه الإرشادات والإجراءات لإرجاع المنتجات التي تم شراؤها من خلال منصتنا."
      },
      eligibility: {
        title: "أهلية الإرجاع",
        content: "لتكون مؤهلاً للإرجاع، يرجى التأكد من:",
        items: [
          "تم شراء المنتج خلال الـ 14 يومًا الماضية",
          "المنتج في حالته الأصلية",
          "المنتج في عبوته الأصلية مع جميع الملحقات والوثائق",
          "لديك الإيصال الأصلي أو إثبات الشراء"
        ]
      },
      nonReturnable: {
        title: "المنتجات غير القابلة للإرجاع",
        content: "لا يمكن إرجاع المنتجات التالية:",
        items: [
          "البرامج المفتوحة، المنتجات الرقمية، أو التنزيلات الإلكترونية",
          "بطاقات الهدايا أو القسائم الترويجية",
          "المنتجات المخصصة أو المصنوعة حسب الطلب",
          "السلع القابلة للتلف",
          "المنتجات المميزة كبيع نهائي أو تصفية",
          "المنتجات التي تم استخدامها أو تلفها أو تعديلها بعد التسليم"
        ]
      },
      process: {
        title: "عملية الإرجاع",
        steps: [
          {
            title: "بدء طلب الإرجاع",
            content: "اتصل بفريق خدمة العملاء من خلال حسابك أو عن طريق إرسال بريد إلكتروني إلى returns@jam3a.me مع رقم طلبك وسبب الإرجاع."
          },
          {
            title: "استلام تفويض الإرجاع",
            content: "سيقوم فريقنا بمراجعة طلبك وتزويدك برقم تفويض الإرجاع (RAN) وتعليمات الإرجاع."
          },
          {
            title: "تغليف الإرجاع",
            content: "قم بتغليف المنتج بشكل آمن في عبوته الأصلية مع جميع الملحقات وتضمين رقم تفويض الإرجاع في الطرد."
          },
          {
            title: "شحن الإرجاع",
            content: "قم بشحن الطرد إلى العنوان المقدم في تعليمات الإرجاع. نوصي باستخدام طريقة شحن قابلة للتتبع."
          },
          {
            title: "معالجة المبلغ المسترد",
            content: "بمجرد استلام وفحص الإرجاع، سنقوم بمعالجة المبلغ المسترد. يرجى السماح بـ 7-14 يوم عمل لظهور المبلغ المسترد في حسابك."
          }
        ]
      },
      refunds: {
        title: "المبالغ المستردة",
        content: "بمجرد استلام وفحص الإرجاع الخاص بك، سنرسل لك بريدًا إلكترونيًا لإخطارك بأننا استلمنا المنتج المرتجع. سنخطرك أيضًا بالموافقة على المبلغ المسترد أو رفضه. في حالة الموافقة، ستتم معالجة المبلغ المسترد، وسيتم تطبيق الائتمان تلقائيًا على طريقة الدفع الأصلية الخاصة بك في غضون 7-14 يوم عمل."
      },
      lateOrMissing: {
        title: "المبالغ المستردة المتأخرة أو المفقودة",
        content: "إذا لم تستلم المبلغ المسترد بعد، تحقق أولاً من حسابك المصرفي مرة أخرى. ثم اتصل بشركة بطاقة الائتمان الخاصة بك، قد يستغرق الأمر بعض الوقت قبل نشر المبلغ المسترد رسميًا. ثم اتصل بالبنك الخاص بك. غالبًا ما يكون هناك بعض وقت المعالجة قبل نشر المبلغ المسترد. إذا قمت بكل هذا ولا تزال لم تستلم المبلغ المسترد، يرجى الاتصال بفريق خدمة العملاء لدينا."
      },
      shipping: {
        title: "شحن الإرجاع",
        content: "ستكون مسؤولاً عن دفع تكاليف الشحن الخاصة بك لإرجاع المنتج. تكاليف الشحن غير قابلة للاسترداد. إذا حصلت على مبلغ مسترد، سيتم خصم تكلفة شحن الإرجاع من المبلغ المسترد."
      },
      damaged: {
        title: "المنتجات التالفة أو المعيبة",
        content: "إذا استلمت منتجًا تالفًا أو معيبًا، يرجى الاتصال بفريق خدمة العملاء لدينا على الفور. سنعمل معك لحل المشكلة، والتي قد تشمل الاستبدال أو الإصلاح أو استرداد المبلغ."
      },
      exchanges: {
        title: "التبادلات",
        content: "نحن لا نقدم تبادلات مباشرة. إذا كنت ترغب في استبدال منتج، يرجى إرجاع المنتج الأصلي للحصول على مبلغ مسترد وتقديم طلب جديد للمنتج المطلوب."
      },
      groupBuying: {
        title: "اعتبارات الشراء الجماعي",
        content: "بالنسبة للمنتجات التي تم شراؤها من خلال صفقات الشراء الجماعي جمعة، تنطبق الاعتبارات الإضافية التالية:",
        items: [
          "يجب بدء عمليات الإرجاع في غضون 14 يومًا من استلام المنتج (وليس من تاريخ اكتمال صفقة المجموعة)",
          "إذا كان الإرجاع يؤثر على متطلبات الحد الأدنى لحجم المجموعة، فلن يتأثر الخصم للمشاركين المتبقين",
          "بالنسبة لأي نزاعات متعلقة بإرجاع الشراء الجماعي، سيقوم فريق خدمة العملاء لدينا بمراجعة كل حالة على حدة"
        ]
      },
      contact: {
        title: "اتصل بنا",
        content: "إذا كانت لديك أي أسئلة حول سياسة الإرجاع الخاصة بنا، يرجى الاتصال بنا على:",
        email: "returns@jam3a.me",
        phone: "+966 12 345 6789",
        hours: "الأحد - الخميس: 9:00 صباحًا - 6:00 مساءً (توقيت المملكة العربية السعودية)"
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
            <p className="text-muted-foreground">{currentContent.lastUpdated}</p>
          </div>

          <div className="prose prose-purple max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.introduction.title}</h2>
              <p>{currentContent.introduction.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.eligibility.title}</h2>
              <p>{currentContent.eligibility.content}</p>
              <ul className="mt-4">
                {currentContent.eligibility.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.nonReturnable.title}</h2>
              <p>{currentContent.nonReturnable.content}</p>
              <ul className="mt-4">
                {currentContent.nonReturnable.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.process.title}</h2>
              <div className="mt-6 space-y-6">
                {currentContent.process.steps.map((step, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jam3a-purple text-white">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <p className="text-muted-foreground">{step.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.refunds.title}</h2>
              <p>{currentContent.refunds.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.lateOrMissing.title}</h2>
              <p>{currentContent.lateOrMissing.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.shipping.title}</h2>
              <p>{currentContent.shipping.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.damaged.title}</h2>
              <p>{currentContent.damaged.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.exchanges.title}</h2>
              <p>{currentContent.exchanges.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.groupBuying.title}</h2>
              <p>{currentContent.groupBuying.content}</p>
              <ul className="mt-4">
                {currentContent.groupBuying.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.contact.title}</h2>
              <p>{currentContent.contact.content}</p>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Email:</strong> {currentContent.contact.email}
                </p>
                <p>
                  <strong>{language === 'en' ? 'Phone' : 'الهاتف'}:</strong> {currentContent.contact.phone}
                </p>
                <p>
                  <strong>{language === 'en' ? 'Business Hours' : 'ساعات العمل'}:</strong> {currentContent.contact.hours}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnsPolicy;
