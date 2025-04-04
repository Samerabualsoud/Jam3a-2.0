import React from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: April 1, 2025",
      introduction: {
        title: "Introduction",
        content: "Welcome to Jam3a Hub Collective. These Terms of Service govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access our services."
      },
      definitions: {
        title: "Definitions",
        items: [
          ""We", "Us", "Our", and "Jam3a" refer to Jam3a Hub Collective.",
          ""Platform" refers to our website, mobile applications, and services.",
          ""User", "You", and "Your" refer to individuals who access or use our Platform.",
          ""Jam3a Deal" refers to a group buying opportunity where multiple users collectively purchase products at discounted prices.",
          ""Seller" refers to businesses or individuals who offer products through our Platform."
        ]
      },
      accountRegistration: {
        title: "Account Registration and User Responsibilities",
        content: "To use certain features of our Platform, you must register for an account. When you register, you agree to:",
        items: [
          "Provide accurate, current, and complete information.",
          "Maintain and promptly update your account information.",
          "Keep your password secure and confidential.",
          "Be responsible for all activities that occur under your account.",
          "Notify us immediately of any unauthorized use of your account.",
          "Be at least 18 years old or have the legal consent of a parent or guardian."
        ]
      },
      jam3aDeals: {
        title: "Jam3a Deals and Group Buying",
        content: "Our Platform facilitates group buying through Jam3a Deals. By participating in a Jam3a Deal, you agree to:",
        items: [
          "Commit to purchase the product if the minimum group size is reached.",
          "Make payment within the specified timeframe.",
          "Understand that deals may be canceled if minimum participation is not reached.",
          "Accept that prices and discounts are subject to change until the deal is finalized.",
          "Acknowledge that product availability is subject to seller inventory."
        ]
      },
      payments: {
        title: "Payments and Pricing",
        content: "When making purchases through our Platform:",
        items: [
          "You agree to pay all fees and applicable taxes associated with your purchases.",
          "Payments are processed through our secure payment gateway partners.",
          "Prices are displayed in Saudi Riyals (SAR) unless otherwise specified.",
          "We reserve the right to change prices for products not yet purchased.",
          "Refunds are subject to our Refund Policy and the specific terms of each Jam3a Deal."
        ]
      },
      sellerTerms: {
        title: "Seller Terms",
        content: "If you are a Seller on our Platform, you additionally agree to:",
        items: [
          "Provide accurate and complete information about your products.",
          "Fulfill orders in a timely manner once a Jam3a Deal is completed.",
          "Comply with all applicable laws and regulations.",
          "Maintain sufficient inventory to fulfill potential orders.",
          "Be solely responsible for the quality, safety, and legality of your products.",
          "Pay all applicable fees and commissions as outlined in your Seller Agreement."
        ]
      },
      intellectualProperty: {
        title: "Intellectual Property",
        content: "The Platform and its original content, features, and functionality are owned by Jam3a Hub Collective and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our Platform without our prior written consent."
      },
      userContent: {
        title: "User Content",
        content: "By posting, uploading, or sharing content on our Platform, you grant us a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to use, store, display, reproduce, modify, and distribute your content across our Platform. You represent and warrant that you own or have the necessary rights to share content on our Platform, and that your content does not violate the rights of any third party."
      },
      prohibitedActivities: {
        title: "Prohibited Activities",
        content: "You agree not to engage in any of the following activities:",
        items: [
          "Violating any applicable laws or regulations.",
          "Impersonating another person or entity.",
          "Interfering with or disrupting the Platform or servers.",
          "Attempting to gain unauthorized access to any part of the Platform.",
          "Using the Platform for any illegal or unauthorized purpose.",
          "Engaging in any activity that could damage, disable, or impair the Platform.",
          "Collecting user information without their consent.",
          "Using automated means to access or interact with the Platform without our permission."
        ]
      },
      disclaimers: {
        title: "Disclaimers and Limitations of Liability",
        content: "The Platform is provided on an 'as is' and 'as available' basis. We make no warranties, expressed or implied, regarding the operation or availability of the Platform. We are not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Platform."
      },
      indemnification: {
        title: "Indemnification",
        content: "You agree to indemnify, defend, and hold harmless Jam3a Hub Collective and its officers, directors, employees, agents, and affiliates from any claims, liabilities, damages, losses, costs, or expenses arising from your use of the Platform or violation of these Terms."
      },
      termination: {
        title: "Termination",
        content: "We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Platform will immediately cease."
      },
      governingLaw: {
        title: "Governing Law",
        content: "These Terms shall be governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia, without regard to its conflict of law provisions."
      },
      changes: {
        title: "Changes to Terms",
        content: "We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes by posting the new Terms on the Platform and updating the 'last updated' date. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms."
      },
      contact: {
        title: "Contact Us",
        content: "If you have any questions about these Terms, please contact us at:",
        email: "terms@jam3a.me",
        address: "Jam3a Hub Collective, Riyadh, Saudi Arabia"
      }
    },
    ar: {
      title: "شروط الخدمة",
      lastUpdated: "آخر تحديث: 1 أبريل 2025",
      introduction: {
        title: "مقدمة",
        content: "مرحبًا بك في جمعة هب كوليكتيف. تحكم شروط الخدمة هذه استخدامك لموقعنا الإلكتروني وخدماتنا. من خلال الوصول إلى خدماتنا أو استخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من الشروط، فقد لا تتمكن من الوصول إلى خدماتنا."
      },
      definitions: {
        title: "التعريفات",
        items: [
          "تشير كلمات 'نحن' و'لنا' و'خاصتنا' و'جمعة' إلى جمعة هب كوليكتيف.",
          "تشير كلمة 'المنصة' إلى موقعنا الإلكتروني وتطبيقات الهاتف المحمول والخدمات.",
          "تشير كلمات 'المستخدم' و'أنت' و'الخاص بك' إلى الأفراد الذين يصلون إلى منصتنا أو يستخدمونها.",
          "تشير عبارة 'صفقة جمعة' إلى فرصة شراء جماعي حيث يشتري مستخدمون متعددون منتجات بأسعار مخفضة بشكل جماعي.",
          "تشير كلمة 'البائع' إلى الشركات أو الأفراد الذين يقدمون منتجات من خلال منصتنا."
        ]
      },
      accountRegistration: {
        title: "تسجيل الحساب ومسؤوليات المستخدم",
        content: "لاستخدام ميزات معينة من منصتنا، يجب عليك التسجيل للحصول على حساب. عند التسجيل، فإنك توافق على:",
        items: [
          "تقديم معلومات دقيقة وحديثة وكاملة.",
          "الحفاظ على معلومات حسابك وتحديثها على الفور.",
          "الحفاظ على كلمة المرور الخاصة بك آمنة وسرية.",
          "تحمل المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك.",
          "إخطارنا على الفور بأي استخدام غير مصرح به لحسابك.",
          "أن يكون عمرك 18 عامًا على الأقل أو أن تحصل على موافقة قانونية من أحد الوالدين أو الوصي."
        ]
      },
      jam3aDeals: {
        title: "صفقات جمعة والشراء الجماعي",
        content: "تسهل منصتنا الشراء الجماعي من خلال صفقات جمعة. من خلال المشاركة في صفقة جمعة، فإنك توافق على:",
        items: [
          "الالتزام بشراء المنتج إذا تم الوصول إلى الحد الأدنى لحجم المجموعة.",
          "الدفع خلال الإطار الزمني المحدد.",
          "فهم أنه قد يتم إلغاء الصفقات إذا لم يتم الوصول إلى الحد الأدنى للمشاركة.",
          "قبول أن الأسعار والخصومات قابلة للتغيير حتى يتم الانتهاء من الصفقة.",
          "الإقرار بأن توفر المنتج يخضع لمخزون البائع."
        ]
      },
      payments: {
        title: "المدفوعات والتسعير",
        content: "عند إجراء عمليات شراء من خلال منصتنا:",
        items: [
          "أنت توافق على دفع جميع الرسوم والضرائب المطبقة المرتبطة بمشترياتك.",
          "تتم معالجة المدفوعات من خلال شركاء بوابة الدفع الآمنة لدينا.",
          "يتم عرض الأسعار بالريال السعودي (SAR) ما لم يتم تحديد خلاف ذلك.",
          "نحتفظ بالحق في تغيير أسعار المنتجات التي لم يتم شراؤها بعد.",
          "تخضع المبالغ المستردة لسياسة الاسترداد الخاصة بنا والشروط المحددة لكل صفقة جمعة."
        ]
      },
      sellerTerms: {
        title: "شروط البائع",
        content: "إذا كنت بائعًا على منصتنا، فإنك توافق بالإضافة إلى ذلك على:",
        items: [
          "تقديم معلومات دقيقة وكاملة عن منتجاتك.",
          "تنفيذ الطلبات في الوقت المناسب بمجرد اكتمال صفقة جمعة.",
          "الامتثال لجميع القوانين واللوائح المعمول بها.",
          "الحفاظ على مخزون كافٍ لتلبية الطلبات المحتملة.",
          "تحمل المسؤولية الكاملة عن جودة وسلامة وقانونية منتجاتك.",
          "دفع جميع الرسوم والعمولات المطبقة كما هو موضح في اتفاقية البائع الخاصة بك."
        ]
      },
      intellectualProperty: {
        title: "الملكية الفكرية",
        content: "المنصة ومحتواها الأصلي وميزاتها ووظائفها مملوكة لـجمعة هب كوليكتيف وهي محمية بموجب قوانين حقوق النشر والعلامات التجارية وبراءات الاختراع والأسرار التجارية وغيرها من قوانين الملكية الفكرية الدولية. لا يجوز لك إعادة إنتاج أو توزيع أو تعديل أو إنشاء أعمال مشتقة من أو عرض علني أو أداء علني أو إعادة نشر أو تنزيل أو تخزين أو نقل أي مواد من منصتنا دون موافقة كتابية مسبقة منا."
      },
      userContent: {
        title: "محتوى المستخدم",
        content: "من خلال نشر أو تحميل أو مشاركة المحتوى على منصتنا، فإنك تمنحنا ترخيصًا غير حصري وخالي من حقوق الملكية وقابل للتحويل وقابل للترخيص من الباطن وعالمي لاستخدام وتخزين وعرض وإعادة إنتاج وتعديل وتوزيع المحتوى الخاص بك عبر منصتنا. أنت تقر وتضمن أنك تمتلك أو لديك الحقوق اللازمة لمشاركة المحتوى على منصتنا، وأن المحتوى الخاص بك لا ينتهك حقوق أي طرف ثالث."
      },
      prohibitedActivities: {
        title: "الأنشطة المحظورة",
        content: "أنت توافق على عدم المشاركة في أي من الأنشطة التالية:",
        items: [
          "انتهاك أي قوانين أو لوائح معمول بها.",
          "انتحال شخصية شخص أو كيان آخر.",
          "التدخل في المنصة أو الخوادم أو تعطيلها.",
          "محاولة الوصول غير المصرح به إلى أي جزء من المنصة.",
          "استخدام المنصة لأي غرض غير قانوني أو غير مصرح به.",
          "المشاركة في أي نشاط قد يتلف أو يعطل أو يضعف المنصة.",
          "جمع معلومات المستخدم دون موافقتهم.",
          "استخدام وسائل آلية للوصول إلى المنصة أو التفاعل معها دون إذن منا."
        ]
      },
      disclaimers: {
        title: "إخلاء المسؤولية وحدود المسؤولية",
        content: "يتم توفير المنصة على أساس 'كما هي' و'كما هو متاح'. نحن لا نقدم أي ضمانات، صريحة أو ضمنية، فيما يتعلق بتشغيل أو توفر المنصة. نحن لسنا مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية ناتجة عن استخدامك أو عدم قدرتك على استخدام المنصة."
      },
      indemnification: {
        title: "التعويض",
        content: "أنت توافق على تعويض وحماية جمعة هب كوليكتيف ومسؤوليها ومديريها وموظفيها ووكلائها وشركائها من أي مطالبات أو مسؤوليات أو أضرار أو خسائر أو تكاليف أو نفقات ناشئة عن استخدامك للمنصة أو انتهاك هذه الشروط."
      },
      termination: {
        title: "الإنهاء",
        content: "يجوز لنا إنهاء أو تعليق حسابك ووصولك إلى المنصة على الفور، دون إشعار مسبق أو مسؤولية، لأي سبب، بما في ذلك إذا قمت بانتهاك هذه الشروط. عند الإنهاء، سينتهي حقك في استخدام المنصة على الفور."
      },
      governingLaw: {
        title: "القانون الحاكم",
        content: "تخضع هذه الشروط وتفسر وفقًا لقوانين المملكة العربية السعودية، بغض النظر عن أحكام تعارض القوانين."
      },
      changes: {
        title: "التغييرات على الشروط",
        content: "نحتفظ بالحق في تعديل أو استبدال هذه الشروط في أي وقت. سنقدم إشعارًا بالتغييرات المهمة من خلال نشر الشروط الجديدة على المنصة وتحديث تاريخ 'آخر تحديث'. استمرار استخدامك للمنصة بعد هذه التغييرات يشكل قبولك للشروط الجديدة."
      },
      contact: {
        title: "اتصل بنا",
        content: "إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا على:",
        email: "terms@jam3a.me",
        address: "جمعة هب كوليكتيف، الرياض، المملكة العربية السعودية"
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
              <h2 className="text-2xl font-semibold mb-4">{currentContent.definitions.title}</h2>
              <ul className="mt-4">
                {currentContent.definitions.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.accountRegistration.title}</h2>
              <p>{currentContent.accountRegistration.content}</p>
              <ul className="mt-4">
                {currentContent.accountRegistration.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.jam3aDeals.title}</h2>
              <p>{currentContent.jam3aDeals.content}</p>
              <ul className="mt-4">
                {currentContent.jam3aDeals.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.payments.title}</h2>
              <p>{currentContent.payments.content}</p>
              <ul className="mt-4">
                {currentContent.payments.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.sellerTerms.title}</h2>
              <p>{currentContent.sellerTerms.content}</p>
              <ul className="mt-4">
                {currentContent.sellerTerms.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.intellectualProperty.title}</h2>
              <p>{currentContent.intellectualProperty.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.userContent.title}</h2>
              <p>{currentContent.userContent.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.prohibitedActivities.title}</h2>
              <p>{currentContent.prohibitedActivities.content}</p>
              <ul className="mt-4">
                {currentContent.prohibitedActivities.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.disclaimers.title}</h2>
              <p>{currentContent.disclaimers.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.indemnification.title}</h2>
              <p>{currentContent.indemnification.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.termination.title}</h2>
              <p>{currentContent.termination.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.governingLaw.title}</h2>
              <p>{currentContent.governingLaw.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.changes.title}</h2>
              <p>{currentContent.changes.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.contact.title}</h2>
              <p>{currentContent.contact.content}</p>
              <p className="mt-4">
                <strong>Email:</strong> {currentContent.contact.email}
              </p>
              <p>
                <strong>{language === 'en' ? 'Address' : 'العنوان'}:</strong> {currentContent.contact.address}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
