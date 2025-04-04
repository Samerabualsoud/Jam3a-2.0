import React from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const content = {
    en: {
      title: "Contact Us",
      subtitle: "We'd love to hear from you",
      form: {
        title: "Send us a message",
        description: "Fill out the form below and we'll get back to you as soon as possible.",
        name: "Full Name",
        namePlaceholder: "Enter your full name",
        email: "Email Address",
        emailPlaceholder: "Enter your email address",
        subject: "Subject",
        subjectPlaceholder: "What is your message about?",
        message: "Message",
        messagePlaceholder: "Please provide details about your inquiry...",
        submit: "Send Message",
        success: "Your message has been sent successfully. We'll get back to you soon!"
      },
      contact: {
        title: "Contact Information",
        description: "You can also reach us through these channels:",
        email: "Email",
        emailValue: "support@jam3a.me",
        phone: "Phone",
        phoneValue: "+966 12 345 6789",
        address: "Address",
        addressValue: "King Fahd Road, Riyadh, Saudi Arabia",
        hours: "Business Hours",
        hoursValue: "Sunday - Thursday: 9am - 6pm"
      },
      faq: {
        title: "Frequently Asked Questions",
        questions: [
          {
            question: "How does Jam3a work?",
            answer: "Jam3a is a group buying platform that allows users to purchase products at discounted prices by joining or creating group deals. When enough people join a Jam3a deal, everyone gets the discounted price."
          },
          {
            question: "How do I track my order?",
            answer: "You can track your order by logging into your account and visiting the 'My Orders' section. Alternatively, you can use the order tracking feature on our website by entering your order number and email address."
          },
          {
            question: "What is your return policy?",
            answer: "We offer a 14-day return policy for most products. Items must be in their original condition with all packaging and accessories. Some products may have specific return conditions, which will be noted on the product page."
          },
          {
            question: "How can I become a seller on Jam3a?",
            answer: "To become a seller, visit our 'Become a Seller' page and complete the application process. You'll need to provide business information, product details, and agree to our seller terms and conditions."
          }
        ]
      }
    },
    ar: {
      title: "اتصل بنا",
      subtitle: "يسعدنا سماع رأيك",
      form: {
        title: "أرسل لنا رسالة",
        description: "املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.",
        name: "الاسم الكامل",
        namePlaceholder: "أدخل اسمك الكامل",
        email: "عنوان البريد الإلكتروني",
        emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
        subject: "الموضوع",
        subjectPlaceholder: "ما هو موضوع رسالتك؟",
        message: "الرسالة",
        messagePlaceholder: "يرجى تقديم تفاصيل حول استفسارك...",
        submit: "إرسال الرسالة",
        success: "تم إرسال رسالتك بنجاح. سنرد عليك قريبًا!"
      },
      contact: {
        title: "معلومات الاتصال",
        description: "يمكنك أيضًا الوصول إلينا من خلال هذه القنوات:",
        email: "البريد الإلكتروني",
        emailValue: "support@jam3a.me",
        phone: "الهاتف",
        phoneValue: "+966 12 345 6789",
        address: "العنوان",
        addressValue: "طريق الملك فهد، الرياض، المملكة العربية السعودية",
        hours: "ساعات العمل",
        hoursValue: "الأحد - الخميس: 9 صباحًا - 6 مساءً"
      },
      faq: {
        title: "الأسئلة الشائعة",
        questions: [
          {
            question: "كيف تعمل جمعة؟",
            answer: "جمعة هي منصة شراء جماعي تتيح للمستخدمين شراء المنتجات بأسعار مخفضة من خلال الانضمام إلى صفقات جماعية أو إنشائها. عندما ينضم عدد كافٍ من الأشخاص إلى صفقة جمعة، يحصل الجميع على السعر المخفض."
          },
          {
            question: "كيف يمكنني تتبع طلبي؟",
            answer: "يمكنك تتبع طلبك عن طريق تسجيل الدخول إلى حسابك وزيارة قسم 'طلباتي'. بدلاً من ذلك، يمكنك استخدام ميزة تتبع الطلب على موقعنا الإلكتروني عن طريق إدخال رقم طلبك وعنوان بريدك الإلكتروني."
          },
          {
            question: "ما هي سياسة الإرجاع الخاصة بكم؟",
            answer: "نقدم سياسة إرجاع لمدة 14 يومًا لمعظم المنتجات. يجب أن تكون العناصر في حالتها الأصلية مع جميع العبوات والملحقات. قد تحتوي بعض المنتجات على شروط إرجاع محددة، والتي سيتم ملاحظتها في صفحة المنتج."
          },
          {
            question: "كيف يمكنني أن أصبح بائعًا على جمعة؟",
            answer: "لتصبح بائعًا، قم بزيارة صفحة 'كن بائعًا' وأكمل عملية التقديم. ستحتاج إلى تقديم معلومات العمل وتفاصيل المنتج والموافقة على شروط وأحكام البائع الخاصة بنا."
          }
        ]
      }
    }
  };

  const currentContent = content[language];
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real implementation, this would submit the form to the backend
    // For now, we'll just simulate it
    toast({
      title: currentContent.form.success,
      variant: "success"
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.form.title}</CardTitle>
                  <CardDescription>{currentContent.form.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">{currentContent.form.name}</label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={currentContent.form.namePlaceholder}
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">{currentContent.form.email}</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={currentContent.form.emailPlaceholder}
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">{currentContent.form.subject}</label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder={currentContent.form.subjectPlaceholder}
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">{currentContent.form.message}</label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={currentContent.form.messagePlaceholder}
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      {currentContent.form.submit}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{currentContent.contact.title}</CardTitle>
                  <CardDescription>{currentContent.contact.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium">{currentContent.contact.email}</div>
                      <div className="text-muted-foreground">{currentContent.contact.emailValue}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium">{currentContent.contact.phone}</div>
                      <div className="text-muted-foreground">{currentContent.contact.phoneValue}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium">{currentContent.contact.address}</div>
                      <div className="text-muted-foreground">{currentContent.contact.addressValue}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-5 w-5 mt-0.5 mr-3 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full border-2 border-current"></div>
                    </div>
                    <div>
                      <div className="font-medium">{currentContent.contact.hours}</div>
                      <div className="text-muted-foreground">{currentContent.contact.hoursValue}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.faq.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentContent.faq.questions.map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium mb-2">{item.question}</h3>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
