import React from 'react';
import { Users, TrendingUp, ShieldCheck, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from './Header';

const AboutUsContent = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "About Jam3a",
      subtitle: "The Power of Buying Together",
      intro: "Jam3a is Saudi Arabia's first group-buying platform, empowering shoppers to unlock exclusive discounts through collective purchasing.",
      howItWorksTitle: "How Group Buying Works",
      howItWorksDesc: "Our platform brings people together to make purchases as a group, allowing everyone to benefit from bulk pricing that would otherwise be unavailable to individual shoppers.",
      mission: {
        title: "Our Mission",
        desc: "To transform online shopping in Saudi Arabia by making premium products more affordable through the power of community."
      },
      values: [
        {
          icon: <Users className="h-10 w-10 text-jam3a-purple" />,
          title: "Community Power",
          desc: "We believe that when people come together, amazing things happen. Our platform harnesses the purchasing power of communities to benefit everyone."
        },
        {
          icon: <Share2 className="h-10 w-10 text-jam3a-purple" />,
          title: "Sharing Opportunities",
          desc: "We make it easy to share deals with friends and family, creating a network of savings that grows with every share."
        },
        {
          icon: <ShieldCheck className="h-10 w-10 text-jam3a-purple" />,
          title: "Trust & Transparency",
          desc: "Our platform is built on trust. We ensure secure transactions and complete transparency throughout the group-buying process."
        },
        {
          icon: <TrendingUp className="h-10 w-10 text-jam3a-purple" />,
          title: "Social Savings",
          desc: "Shopping becomes more rewarding when you save together. Our users enjoy discounts of up to 30% on their favorite brands."
        }
      ],
      story: {
        title: "Our Story",
        part1: "Jam3a was born from a simple observation: the best deals are often available only to bulk buyers. We asked ourselves, \"Why can't individual shoppers join forces to access these savings?\"",
        part2: "Founded in 2023, Jam3a has quickly grown into Saudi Arabia's leading group-buying platform, connecting thousands of shoppers who want quality products at affordable prices."
      },
      ctaTitle: "Ready to Experience the Power of Group Buying?",
      ctaButton: "Start Shopping Together"
    },
    ar: {
      title: "عن جمعة",
      subtitle: "قوة الشراء معًا",
      intro: "جمعة هي أول منصة للشراء الجماعي في المملكة العربية السعودية، تمكن المتسوقين من الحصول على خصومات حصرية من خلال الشراء الجماعي.",
      howItWorksTitle: "كيف يعمل الشراء الجماعي",
      howItWorksDesc: "تجمع منصتنا الناس معًا للقيام بعمليات شراء كمجموعة، مما يتيح للجميع الاستفادة من أسعار الجملة التي لن تكون متاحة للمتسوقين الأفراد.",
      mission: {
        title: "مهمتنا",
        desc: "تحويل التسوق عبر الإنترنت في المملكة العربية السعودية من خلال جعل المنتجات الفاخرة أكثر بأسعار معقولة من خلال قوة المجتمع."
      },
      values: [
        {
          icon: <Users className="h-10 w-10 text-jam3a-purple" />,
          title: "قوة المجتمع",
          desc: "نؤمن بأنه عندما يجتمع الناس معًا، تحدث أشياء مذهلة. تستفيد منصتنا من القوة الشرائية للمجتمعات لصالح الجميع."
        },
        {
          icon: <Share2 className="h-10 w-10 text-jam3a-purple" />,
          title: "مشاركة الفرص",
          desc: "نجعل من السهل مشاركة الصفقات مع الأصدقاء والعائلة، مما يخلق شبكة من التوفير تنمو مع كل مشاركة."
        },
        {
          icon: <ShieldCheck className="h-10 w-10 text-jam3a-purple" />,
          title: "الثقة والشفافية",
          desc: "تم بناء منصتنا على الثقة. نحن نضمن المعاملات الآمنة والشفافية الكاملة طوال عملية الشراء الجماعي."
        },
        {
          icon: <TrendingUp className="h-10 w-10 text-jam3a-purple" />,
          title: "التوفير الاجتماعي",
          desc: "يصبح التسوق أكثر مكافأة عندما توفر معًا. يتمتع مستخدمونا بخصومات تصل إلى 30٪ على علاماتهم التجارية المفضلة."
        }
      ],
      story: {
        title: "قصتنا",
        part1: "ولدت جمعة من ملاحظة بسيطة: غالبًا ما تكون أفضل الصفقات متاحة فقط لمشتري الجملة. سألنا أنفسنا، \"لماذا لا يمكن للمتسوقين الأفراد أن يتحدوا للوصول إلى هذه الوفورات؟\"",
        part2: "تأسست جمعة في عام 2023، وسرعان ما نمت لتصبح منصة الشراء الجماعي الرائدة في المملكة العربية السعودية، حيث تربط بين آلاف المتسوقين الذين يريدون منتجات عالية الجودة بأسعار معقولة."
      },
      ctaTitle: "هل أنت مستعد لتجربة قوة الشراء الجماعي؟",
      ctaButton: "ابدأ التسوق معًا"
    }
  };

  const currentContent = content[language];
  const isRtl = language === 'ar';

  return (
    <div className={`py-16 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-16 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-center">
            {currentContent.intro}
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16 bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{currentContent.howItWorksTitle}</h2>
            <p className="text-lg max-w-3xl mx-auto">{currentContent.howItWorksDesc}</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{currentContent.mission.title}</h2>
          <p className="text-xl">{currentContent.mission.desc}</p>
        </div>
        
        {/* Values Section */}
        <div className="mb-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {currentContent.values.map((value, index) => (
              <Card key={index} className="border-2 hover:border-jam3a-purple transition-all">
                <CardContent className="pt-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-jam3a-purple/10 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Story Section */}
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">{currentContent.story.title}</h2>
          <div className="flex flex-col space-y-4">
            <p className="text-lg">{currentContent.story.part1}</p>
            <p className="text-lg">{currentContent.story.part2}</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 bg-gradient-to-r from-jam3a-purple/10 to-white rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <Button size="lg" className="bg-jam3a-purple hover:bg-jam3a-deep-purple">
            {currentContent.ctaButton}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;
