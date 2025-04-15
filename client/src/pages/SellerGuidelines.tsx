import React from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const SellerGuidelines = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  const content = {
    en: {
      title: "Seller Guidelines",
      subtitle: "Guidelines and policies for Jam3a sellers",
      sections: [
        {
          title: "Becoming a Seller",
          content: `
            <p>To become a seller on Jam3a, you must meet the following requirements:</p>
            <ul>
              <li>Be a registered business in Saudi Arabia with a valid commercial registration</li>
              <li>Have a valid tax registration certificate</li>
              <li>Provide proof of identity and address</li>
              <li>Accept our seller terms and conditions</li>
              <li>Pass our quality assessment process</li>
            </ul>
            <p>Once approved, you'll gain access to our seller dashboard where you can manage your products, Jam3a deals, orders, and payments.</p>
          `
        },
        {
          title: "Product Requirements",
          content: `
            <p>All products listed on Jam3a must:</p>
            <ul>
              <li>Be authentic and as described</li>
              <li>Meet Saudi Arabian safety and quality standards</li>
              <li>Have clear, accurate images (minimum 3 images per product)</li>
              <li>Include detailed specifications and descriptions in both Arabic and English</li>
              <li>Have a valid warranty where applicable</li>
              <li>Be in new condition unless explicitly listed as refurbished or used</li>
            </ul>
            <p>Products that violate our guidelines will be removed, and repeated violations may result in account suspension.</p>
          `
        },
        {
          title: "Pricing and Discounts",
          content: `
            <p>When creating Jam3a deals, sellers must:</p>
            <ul>
              <li>Offer genuine discounts compared to regular market prices</li>
              <li>Provide a minimum discount of 15% for Jam3a deals</li>
              <li>Not artificially inflate regular prices to create the appearance of larger discounts</li>
              <li>Clearly display both regular and Jam3a prices</li>
              <li>Honor the advertised prices for the duration of the Jam3a deal</li>
            </ul>
            <p>Jam3a regularly monitors market prices to ensure discounts are genuine and may remove listings that violate these guidelines.</p>
          `
        },
        {
          title: "Shipping and Fulfillment",
          content: `
            <p>Sellers are responsible for:</p>
            <ul>
              <li>Shipping products within 2 business days of a successful Jam3a completion</li>
              <li>Providing accurate tracking information through our platform</li>
              <li>Ensuring products are properly packaged to prevent damage</li>
              <li>Handling returns and exchanges according to our returns policy</li>
              <li>Maintaining sufficient inventory for active Jam3a deals</li>
            </ul>
            <p>Failure to meet shipping and fulfillment requirements may result in penalties, including account suspension and financial charges.</p>
          `
        },
        {
          title: "Customer Service Standards",
          content: `
            <p>Sellers must maintain high customer service standards:</p>
            <ul>
              <li>Respond to customer inquiries within 24 hours</li>
              <li>Process returns and refunds promptly</li>
              <li>Provide support in both Arabic and English</li>
              <li>Maintain a customer satisfaction rating of at least 4.0/5.0</li>
              <li>Resolve disputes professionally and fairly</li>
            </ul>
            <p>Jam3a monitors customer feedback and may intervene in disputes to ensure fair resolution.</p>
          `
        },
        {
          title: "Fees and Payments",
          content: `
            <p>Sellers should be aware of the following fee structure:</p>
            <ul>
              <li>Registration fee: SAR 500 (one-time)</li>
              <li>Commission: 10-15% of the final sale price (varies by category)</li>
              <li>Payment processing fee: 2.5% of transaction value</li>
              <li>Optional featured listing fee: SAR 100-300 per listing</li>
            </ul>
            <p>Payments are processed bi-weekly, with funds transferred to your registered bank account. A detailed breakdown of fees and earnings is available in your seller dashboard.</p>
          `
        },
        {
          title: "Prohibited Items",
          content: `
            <p>The following items are prohibited on Jam3a:</p>
            <ul>
              <li>Counterfeit or replica items</li>
              <li>Illegal or restricted products</li>
              <li>Weapons, ammunition, and explosives</li>
              <li>Tobacco, alcohol, and drugs</li>
              <li>Adult content or services</li>
              <li>Hazardous materials</li>
              <li>Items that infringe on intellectual property rights</li>
              <li>Used personal care items or cosmetics</li>
              <li>Expired products or food items</li>
            </ul>
            <p>Listing prohibited items will result in immediate removal and may lead to account termination and legal action.</p>
          `
        },
        {
          title: "Account Management",
          content: `
            <p>To maintain your seller account in good standing:</p>
            <ul>
              <li>Keep your business information up to date</li>
              <li>Maintain accurate inventory levels</li>
              <li>Regularly check and respond to notifications</li>
              <li>Meet performance metrics for shipping, customer service, and product quality</li>
              <li>Comply with all Jam3a policies and Saudi Arabian regulations</li>
            </ul>
            <p>Accounts that consistently fail to meet our standards may be subject to review, restrictions, or termination.</p>
          `
        }
      ],
      conclusion: "These guidelines are designed to ensure a positive experience for both sellers and customers on Jam3a. By maintaining high standards, we create a trusted marketplace for group buying in Saudi Arabia. If you have questions about these guidelines or need assistance with your seller account, please contact our Seller Support team."
    },
    ar: {
      title: "إرشادات البائع",
      subtitle: "الإرشادات والسياسات لبائعي جمعة",
      sections: [
        {
          title: "كيفية أن تصبح بائعًا",
          content: `
            <p>لتصبح بائعًا على جمعة، يجب أن تستوفي المتطلبات التالية:</p>
            <ul>
              <li>أن تكون شركة مسجلة في المملكة العربية السعودية مع سجل تجاري ساري المفعول</li>
              <li>امتلاك شهادة تسجيل ضريبي سارية</li>
              <li>تقديم إثبات الهوية والعنوان</li>
              <li>قبول شروط وأحكام البائع الخاصة بنا</li>
              <li>اجتياز عملية تقييم الجودة لدينا</li>
            </ul>
            <p>بمجرد الموافقة، ستتمكن من الوصول إلى لوحة تحكم البائع حيث يمكنك إدارة منتجاتك وصفقات جمعة والطلبات والمدفوعات.</p>
          `
        },
        {
          title: "متطلبات المنتج",
          content: `
            <p>يجب أن تكون جميع المنتجات المدرجة على جمعة:</p>
            <ul>
              <li>أصلية وكما هو موصوف</li>
              <li>تلبي معايير السلامة والجودة السعودية</li>
              <li>تحتوي على صور واضحة ودقيقة (3 صور على الأقل لكل منتج)</li>
              <li>تتضمن مواصفات وأوصاف مفصلة باللغتين العربية والإنجليزية</li>
              <li>لديها ضمان ساري المفعول حيثما ينطبق</li>
              <li>في حالة جديدة ما لم يتم إدراجها صراحة كمجددة أو مستعملة</li>
            </ul>
            <p>سيتم إزالة المنتجات التي تنتهك إرشاداتنا، وقد تؤدي الانتهاكات المتكررة إلى تعليق الحساب.</p>
          `
        },
        {
          title: "التسعير والخصومات",
          content: `
            <p>عند إنشاء صفقات جمعة، يجب على البائعين:</p>
            <ul>
              <li>تقديم خصومات حقيقية مقارنة بأسعار السوق العادية</li>
              <li>تقديم خصم لا يقل عن 15٪ لصفقات جمعة</li>
              <li>عدم تضخيم الأسعار العادية بشكل مصطنع لخلق مظهر خصومات أكبر</li>
              <li>عرض كل من الأسعار العادية وأسعار جمعة بوضوح</li>
              <li>الالتزام بالأسعار المعلنة طوال مدة صفقة جمعة</li>
            </ul>
            <p>تراقب جمعة بانتظام أسعار السوق للتأكد من أن الخصومات حقيقية وقد تزيل القوائم التي تنتهك هذه الإرشادات.</p>
          `
        },
        {
          title: "الشحن والتسليم",
          content: `
            <p>البائعون مسؤولون عن:</p>
            <ul>
              <li>شحن المنتجات في غضون يومي عمل من اكتمال جمعة بنجاح</li>
              <li>تقديم معلومات تتبع دقيقة من خلال منصتنا</li>
              <li>ضمان تغليف المنتجات بشكل صحيح لمنع التلف</li>
              <li>التعامل مع المرتجعات والتبادلات وفقًا لسياسة الإرجاع لدينا</li>
              <li>الحفاظ على مخزون كافٍ لصفقات جمعة النشطة</li>
            </ul>
            <p>قد يؤدي عدم الوفاء بمتطلبات الشحن والتسليم إلى عقوبات، بما في ذلك تعليق الحساب والرسوم المالية.</p>
          `
        },
        {
          title: "معايير خدمة العملاء",
          content: `
            <p>يجب على البائعين الحفاظ على معايير عالية لخدمة العملاء:</p>
            <ul>
              <li>الرد على استفسارات العملاء في غضون 24 ساعة</li>
              <li>معالجة المرتجعات والمبالغ المستردة على الفور</li>
              <li>تقديم الدعم باللغتين العربية والإنجليزية</li>
              <li>الحفاظ على تقييم رضا العملاء لا يقل عن 4.0/5.0</li>
              <li>حل النزاعات بشكل مهني وعادل</li>
            </ul>
            <p>تراقب جمعة ملاحظات العملاء وقد تتدخل في النزاعات لضمان حل عادل.</p>
          `
        },
        {
          title: "الرسوم والمدفوعات",
          content: `
            <p>يجب أن يكون البائعون على دراية بهيكل الرسوم التالي:</p>
            <ul>
              <li>رسوم التسجيل: 500 ريال سعودي (مرة واحدة)</li>
              <li>العمولة: 10-15٪ من سعر البيع النهائي (تختلف حسب الفئة)</li>
              <li>رسوم معالجة الدفع: 2.5٪ من قيمة المعاملة</li>
              <li>رسوم القائمة المميزة الاختيارية: 100-300 ريال سعودي لكل قائمة</li>
            </ul>
            <p>تتم معالجة المدفوعات كل أسبوعين، مع تحويل الأموال إلى حسابك المصرفي المسجل. يتوفر تفصيل مفصل للرسوم والأرباح في لوحة تحكم البائع الخاصة بك.</p>
          `
        },
        {
          title: "العناصر المحظورة",
          content: `
            <p>العناصر التالية محظورة على جمعة:</p>
            <ul>
              <li>العناصر المقلدة أو المستنسخة</li>
              <li>المنتجات غير القانونية أو المقيدة</li>
              <li>الأسلحة والذخائر والمتفجرات</li>
              <li>التبغ والكحول والمخدرات</li>
              <li>المحتوى أو الخدمات للبالغين</li>
              <li>المواد الخطرة</li>
              <li>العناصر التي تنتهك حقوق الملكية الفكرية</li>
              <li>منتجات العناية الشخصية المستعملة أو مستحضرات التجميل</li>
              <li>المنتجات منتهية الصلاحية أو المواد الغذائية</li>
            </ul>
            <p>سيؤدي إدراج العناصر المحظورة إلى إزالتها على الفور وقد يؤدي إلى إنهاء الحساب واتخاذ إجراءات قانونية.</p>
          `
        },
        {
          title: "إدارة الحساب",
          content: `
            <p>للحفاظ على حساب البائع الخاص بك في وضع جيد:</p>
            <ul>
              <li>حافظ على تحديث معلومات عملك</li>
              <li>حافظ على مستويات مخزون دقيقة</li>
              <li>تحقق بانتظام من الإشعارات والرد عليها</li>
              <li>تلبية مقاييس الأداء للشحن وخدمة العملاء وجودة المنتج</li>
              <li>الامتثال لجميع سياسات جمعة واللوائح السعودية</li>
            </ul>
            <p>قد تخضع الحسابات التي تفشل باستمرار في تلبية معاييرنا للمراجعة أو القيود أو الإنهاء.</p>
          `
        }
      ],
      conclusion: "تم تصميم هذه الإرشادات لضمان تجربة إيجابية لكل من البائعين والعملاء على جمعة. من خلال الحفاظ على معايير عالية، نقوم بإنشاء سوق موثوق للشراء الجماعي في المملكة العربية السعودية. إذا كانت لديك أسئلة حول هذه الإرشادات أو تحتاج إلى مساعدة بخصوص حساب البائع الخاص بك، يرجى الاتصال بفريق دعم البائع لدينا."
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
            <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
          </div>
          
          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: section.content }} className="prose max-w-none" />
                </CardContent>
              </Card>
            ))}
            
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-lg">{currentContent.conclusion}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerGuidelines;
