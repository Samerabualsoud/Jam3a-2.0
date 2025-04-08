import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/components/layout/Header';

const FAQContent: React.FC = () => {
  const { language } = useLanguage();
  
  const faqs = language === 'en' ? [
    {
      question: "What is Jam3a?",
      answer: "Jam3a is a community-powered group buying platform that brings people together to purchase products at wholesale prices. By combining orders, we unlock discounts that aren't available to individual shoppers."
    },
    {
      question: "How does Jam3a work?",
      answer: "It's simple! Browse our available deals, join the ones you're interested in, and invite friends to join too. Once enough people join a deal, it becomes active and everyone gets the discounted price. We handle the rest - from ordering to delivery."
    },
    {
      question: "Is there a minimum order quantity?",
      answer: "No! That's the beauty of Jam3a. You can order exactly what you need, even if it's just one item. We combine your order with others to reach wholesale quantities."
    },
    {
      question: "How much can I save with Jam3a?",
      answer: "Savings vary by product, but our users typically save 20-40% compared to retail prices. The more people who join a deal, the better the price gets!"
    },
    {
      question: "How do I pay for my order?",
      answer: "We offer multiple payment options including credit/debit cards, bank transfers, and cash on delivery for your convenience."
    },
    {
      question: "When will I receive my order?",
      answer: "Delivery times vary depending on the deal. Each deal page shows an estimated delivery timeframe. Once a deal is confirmed, you'll receive updates on your order status."
    },
    {
      question: "What happens if not enough people join a deal?",
      answer: "If a deal doesn't reach the minimum number of participants by the deadline, you won't be charged and the deal will be canceled. We'll notify you if this happens."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your participation in a deal anytime before it becomes active. Once a deal is confirmed, cancellations are subject to our return policy."
    },
    {
      question: "Is Jam3a available in my area?",
      answer: "We currently operate in major cities across Saudi Arabia and are expanding rapidly. Check our coverage areas on the website or contact customer support for specific location information."
    },
    {
      question: "How do I become a seller on Jam3a?",
      answer: "We're always looking for quality suppliers! Visit our 'Become a Seller' page to apply and our team will get back to you within 48 hours."
    }
  ] : [
    {
      question: "ما هي جمعة؟",
      answer: "جمعة هي منصة شراء جماعي مدعومة من المجتمع تجمع الناس معًا لشراء المنتجات بأسعار الجملة. من خلال دمج الطلبات، نقدم خصومات غير متاحة للمتسوقين الأفراد."
    },
    {
      question: "كيف تعمل جمعة؟",
      answer: "الأمر بسيط! تصفح الصفقات المتاحة، وانضم إلى تلك التي تهتم بها، وادعُ الأصدقاء للانضمام أيضًا. بمجرد انضمام عدد كافٍ من الأشخاص إلى صفقة، تصبح نشطة ويحصل الجميع على السعر المخفض. نحن نتولى الباقي - من الطلب إلى التسليم."
    },
    {
      question: "هل هناك حد أدنى لكمية الطلب؟",
      answer: "لا! هذا هو جمال جمعة. يمكنك طلب ما تحتاجه بالضبط، حتى لو كان عنصرًا واحدًا فقط. نحن ندمج طلبك مع الآخرين للوصول إلى كميات الجملة."
    },
    {
      question: "كم يمكنني أن أوفر مع جمعة؟",
      answer: "تختلف التوفيرات حسب المنتج، ولكن مستخدمينا عادة ما يوفرون 20-40٪ مقارنة بأسعار التجزئة. كلما انضم المزيد من الأشخاص إلى صفقة، كلما أصبح السعر أفضل!"
    },
    {
      question: "كيف أدفع مقابل طلبي؟",
      answer: "نحن نقدم خيارات دفع متعددة بما في ذلك بطاقات الائتمان/الخصم، والتحويلات المصرفية، والدفع عند الاستلام لراحتك."
    },
    {
      question: "متى سأستلم طلبي؟",
      answer: "تختلف أوقات التسليم حسب الصفقة. تعرض كل صفحة صفقة إطارًا زمنيًا تقديريًا للتسليم. بمجرد تأكيد الصفقة، ستتلقى تحديثات حول حالة طلبك."
    },
    {
      question: "ماذا يحدث إذا لم ينضم عدد كافٍ من الأشخاص إلى صفقة؟",
      answer: "إذا لم تصل الصفقة إلى الحد الأدنى من عدد المشاركين بحلول الموعد النهائي، فلن يتم محاسبتك وسيتم إلغاء الصفقة. سنخطرك إذا حدث هذا."
    },
    {
      question: "هل يمكنني إلغاء طلبي؟",
      answer: "يمكنك إلغاء مشاركتك في صفقة في أي وقت قبل أن تصبح نشطة. بمجرد تأكيد الصفقة، تخضع عمليات الإلغاء لسياسة الإرجاع الخاصة بنا."
    },
    {
      question: "هل جمعة متاحة في منطقتي؟",
      answer: "نحن نعمل حاليًا في المدن الرئيسية في جميع أنحاء المملكة العربية السعودية ونتوسع بسرعة. تحقق من مناطق التغطية الخاصة بنا على الموقع أو اتصل بدعم العملاء للحصول على معلومات محددة عن الموقع."
    },
    {
      question: "كيف أصبح بائعًا على جمعة؟",
      answer: "نحن نبحث دائمًا عن موردين ذوي جودة! قم بزيارة صفحة 'كن بائعًا' للتقديم وسيتواصل فريقنا معك في غضون 48 ساعة."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
        </h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQContent;
