
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from './Header';

const FAQContent = () => {
  const { language } = useLanguage();
  
  const faqItems = [
    {
      question: {
        en: "What is Jam3a?",
        ar: "ما هي جمعة؟"
      },
      answer: {
        en: "Jam3a is a social shopping platform where people team up to get better prices on products. Instead of buying alone, users join together in a group (called a \"Jam3a\") to unlock exclusive group discounts.",
        ar: "جمعة هي منصة تسوق اجتماعي، حيث يجتمع الأشخاص معًا لشراء المنتجات بأسعار أفضل. بدلاً من الشراء الفردي، يشتركون في مجموعة تُسمى \"جمعة\" للحصول على خصومات جماعية."
      }
    },
    {
      question: {
        en: "How does a Jam3a deal work?",
        ar: "كيف تعمل صفقة جمعة؟"
      },
      answer: {
        en: "A Jam3a starts when someone selects a product and shares it with others. Once enough people join the deal within a set time, everyone gets the discounted price. If the group doesn't reach the required number, the deal doesn't go through, and no one is charged.",
        ar: "تبدأ جمعة عندما يختار أحدهم منتجًا ويشاركه مع الآخرين. عند انضمام العدد المطلوب خلال فترة محددة، يحصل الجميع على السعر المخفّض. إذا لم يكتمل العدد، لن يتم تنفيذ الطلب ولن يتم الخصم."
      }
    },
    {
      question: {
        en: "Can I start my own Jam3a?",
        ar: "هل يمكنني بدء جمعتي الخاصة؟"
      },
      answer: {
        en: "Yes! You can start your own Jam3a by picking a product, setting the group size, and inviting others to join using WhatsApp or any social app. It's fast, fun, and rewarding.",
        ar: "نعم! يمكنك بدء جمعتك الخاصة باختيار المنتج، تحديد عدد المشاركين، ومشاركة الرابط مع أصدقائك على واتساب أو أي تطبيق آخر. الأمر سهل وممتع!"
      }
    },
    {
      question: {
        en: "What happens if a Jam3a doesn't complete?",
        ar: "ماذا يحدث إذا لم تكتمل الجمعة؟"
      },
      answer: {
        en: "No problem — if the required number of participants isn't reached, the deal is canceled and no one is charged. You can always try again or join another active Jam3a.",
        ar: "لا داعي للقلق — إذا لم يكتمل عدد المشاركين المطلوب، يتم إلغاء العرض ولن يتم الخصم من أي شخص. يمكنك المحاولة مرة أخرى أو الانضمام إلى جمعة أخرى."
      }
    },
    {
      question: {
        en: "Is it safe to shop on Jam3a?",
        ar: "هل التسوق على جمعة آمن؟"
      },
      answer: {
        en: "Absolutely. Payments are processed through secure gateways, and all transactions are protected by industry-standard encryption. Your data is never shared with third parties.",
        ar: "بالتأكيد. تتم عمليات الدفع عبر بوابات آمنة، وجميع المعاملات محمية بتشفير عالي المستوى. لا تتم مشاركة بياناتك مع أي طرف ثالث."
      }
    },
    {
      question: {
        en: "Who can use Jam3a?",
        ar: "من يمكنه استخدام جمعة؟"
      },
      answer: {
        en: "Anyone in Saudi Arabia can use Jam3a! Whether you're shopping alone or with friends, Jam3a is for anyone who loves saving smartly.",
        ar: "أي شخص في السعودية يمكنه استخدام جمعة! سواء كنت تتسوق بمفردك أو مع أصدقائك، جمعة تناسب كل من يحب التوفير الذكي."
      }
    }
  ];

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {language === 'en' 
              ? 'Everything you need to know about Jam3a group buying' 
              : 'كل ما تحتاج معرفته عن الشراء الجماعي مع جمعة'}
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question[language]}
                </AccordionTrigger>
                <AccordionContent>
                  {item.answer[language]}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQContent;
