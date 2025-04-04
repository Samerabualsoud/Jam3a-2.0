import React from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: April 1, 2025",
      introduction: {
        title: "Introduction",
        content: "At Jam3a Hub Collective, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."
      },
      dataCollection: {
        title: "Information We Collect",
        content: "We collect several types of information from and about users of our website, including:",
        items: [
          "Personal identifiers such as name, email address, phone number, and shipping address.",
          "Payment information (processed securely through our payment processor).",
          "Profile information when you create an account.",
          "Records of your purchases and participation in Jam3a deals.",
          "Technical data including IP address, browser type, device information, and cookies.",
          "Usage data about how you interact with our website."
        ]
      },
      dataUse: {
        title: "How We Use Your Information",
        content: "We use your information for the following purposes:",
        items: [
          "To create and manage your account.",
          "To process and fulfill your orders and Jam3a participations.",
          "To communicate with you about your orders, account, and promotional offers.",
          "To improve our website, products, and services.",
          "To personalize your experience and deliver content relevant to your interests.",
          "To protect our rights, property, or safety."
        ]
      },
      dataSharing: {
        title: "Information Sharing and Disclosure",
        content: "We may share your personal information with:",
        items: [
          "Service providers who perform services on our behalf (payment processing, shipping, etc.).",
          "Other Jam3a participants (limited to necessary information for group buying).",
          "Business partners with your consent.",
          "Legal authorities when required by law or to protect our rights."
        ]
      },
      dataSecurity: {
        title: "Data Security",
        content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
      },
      dataRetention: {
        title: "Data Retention",
        content: "We will retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including to satisfy any legal, accounting, or reporting requirements."
      },
      userRights: {
        title: "Your Rights",
        content: "Depending on your location, you may have the following rights regarding your personal data:",
        items: [
          "Access to your personal data.",
          "Correction of inaccurate data.",
          "Deletion of your data.",
          "Restriction of processing.",
          "Data portability.",
          "Objection to processing.",
          "Withdrawal of consent."
        ]
      },
      cookies: {
        title: "Cookies and Tracking Technologies",
        content: "We use cookies and similar tracking technologies to track activity on our website and to hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
      },
      children: {
        title: "Children's Privacy",
        content: "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn we have collected personal information from a child under 18, we will delete that information."
      },
      changes: {
        title: "Changes to This Privacy Policy",
        content: "We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the 'last updated' date."
      },
      contact: {
        title: "Contact Us",
        content: "If you have any questions about this privacy policy or our privacy practices, please contact us at:",
        email: "privacy@jam3a.me",
        address: "Jam3a Hub Collective, Riyadh, Saudi Arabia"
      }
    },
    ar: {
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث: 1 أبريل 2025",
      introduction: {
        title: "مقدمة",
        content: "في جمعة هب كوليكتيف، نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. ستعلمك سياسة الخصوصية هذه بكيفية اهتمامنا ببياناتك الشخصية عند زيارتك لموقعنا الإلكتروني وتخبرك عن حقوق الخصوصية الخاصة بك وكيف يحميك القانون."
      },
      dataCollection: {
        title: "المعلومات التي نجمعها",
        content: "نجمع عدة أنواع من المعلومات من وحول مستخدمي موقعنا الإلكتروني، بما في ذلك:",
        items: [
          "المعرفات الشخصية مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف وعنوان الشحن.",
          "معلومات الدفع (تتم معالجتها بشكل آمن من خلال معالج الدفع الخاص بنا).",
          "معلومات الملف الشخصي عند إنشاء حساب.",
          "سجلات مشترياتك ومشاركتك في صفقات جمعة.",
          "البيانات التقنية بما في ذلك عنوان IP ونوع المتصفح ومعلومات الجهاز وملفات تعريف الارتباط.",
          "بيانات الاستخدام حول كيفية تفاعلك مع موقعنا الإلكتروني."
        ]
      },
      dataUse: {
        title: "كيف نستخدم معلوماتك",
        content: "نستخدم معلوماتك للأغراض التالية:",
        items: [
          "لإنشاء وإدارة حسابك.",
          "لمعالجة وتنفيذ طلباتك ومشاركات جمعة.",
          "للتواصل معك بشأن طلباتك وحسابك والعروض الترويجية.",
          "لتحسين موقعنا الإلكتروني ومنتجاتنا وخدماتنا.",
          "لتخصيص تجربتك وتقديم محتوى ذي صلة باهتماماتك.",
          "لحماية حقوقنا أو ممتلكاتنا أو سلامتنا."
        ]
      },
      dataSharing: {
        title: "مشاركة المعلومات والإفصاح عنها",
        content: "قد نشارك معلوماتك الشخصية مع:",
        items: [
          "مقدمي الخدمات الذين يؤدون خدمات نيابة عنا (معالجة الدفع، الشحن، إلخ).",
          "المشاركين الآخرين في جمعة (مقتصرة على المعلومات الضرورية للشراء الجماعي).",
          "شركاء الأعمال بموافقتك.",
          "السلطات القانونية عندما يقتضي القانون ذلك أو لحماية حقوقنا."
        ]
      },
      dataSecurity: {
        title: "أمن البيانات",
        content: "نقوم بتنفيذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح أو التدمير. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100٪، ولا يمكننا ضمان الأمان المطلق."
      },
      dataRetention: {
        title: "الاحتفاظ بالبيانات",
        content: "سنحتفظ بمعلوماتك الشخصية فقط طالما كان ذلك ضروريًا لتحقيق الأغراض التي جمعناها من أجلها، بما في ذلك تلبية أي متطلبات قانونية أو محاسبية أو إعداد تقارير."
      },
      userRights: {
        title: "حقوقك",
        content: "اعتمادًا على موقعك، قد تتمتع بالحقوق التالية فيما يتعلق ببياناتك الشخصية:",
        items: [
          "الوصول إلى بياناتك الشخصية.",
          "تصحيح البيانات غير الدقيقة.",
          "حذف بياناتك.",
          "تقييد المعالجة.",
          "قابلية نقل البيانات.",
          "الاعتراض على المعالجة.",
          "سحب الموافقة."
        ]
      },
      cookies: {
        title: "ملفات تعريف الارتباط وتقنيات التتبع",
        content: "نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على موقعنا الإلكتروني والاحتفاظ بمعلومات معينة. يمكنك توجيه متصفحك لرفض جميع ملفات تعريف الارتباط أو للإشارة عند إرسال ملف تعريف ارتباط."
      },
      children: {
        title: "خصوصية الأطفال",
        content: "خدماتنا غير مخصصة للأفراد الذين تقل أعمارهم عن 18 عامًا. نحن لا نجمع عن علم معلومات شخصية من الأطفال دون سن 18 عامًا. إذا علمنا أننا جمعنا معلومات شخصية من طفل دون سن 18 عامًا، فسنحذف هذه المعلومات."
      },
      changes: {
        title: "التغييرات على سياسة الخصوصية هذه",
        content: "قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات من خلال نشر سياسة الخصوصية الجديدة على هذه الصفحة وتحديث تاريخ 'آخر تحديث'."
      },
      contact: {
        title: "اتصل بنا",
        content: "إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات الخصوصية لدينا، يرجى الاتصال بنا على:",
        email: "privacy@jam3a.me",
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
              <h2 className="text-2xl font-semibold mb-4">{currentContent.dataCollection.title}</h2>
              <p>{currentContent.dataCollection.content}</p>
              <ul className="mt-4">
                {currentContent.dataCollection.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.dataUse.title}</h2>
              <p>{currentContent.dataUse.content}</p>
              <ul className="mt-4">
                {currentContent.dataUse.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.dataSharing.title}</h2>
              <p>{currentContent.dataSharing.content}</p>
              <ul className="mt-4">
                {currentContent.dataSharing.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.dataSecurity.title}</h2>
              <p>{currentContent.dataSecurity.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.dataRetention.title}</h2>
              <p>{currentContent.dataRetention.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.userRights.title}</h2>
              <p>{currentContent.userRights.content}</p>
              <ul className="mt-4">
                {currentContent.userRights.items.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.cookies.title}</h2>
              <p>{currentContent.cookies.content}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{currentContent.children.title}</h2>
              <p>{currentContent.children.content}</p>
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

export default PrivacyPolicy;
