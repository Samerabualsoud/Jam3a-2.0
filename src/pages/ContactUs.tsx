import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const ContactUs = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    en: {
      title: "Contact Us",
      subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      form: {
        title: "Send Us a Message",
        name: "Your Name",
        email: "Email Address",
        phone: "Phone Number (optional)",
        subject: "Subject",
        message: "Message",
        submit: "Send Message",
        submitting: "Sending...",
        success: "Your message has been sent! We'll get back to you soon.",
        error: "There was an error sending your message. Please try again."
      },
      contactInfo: {
        title: "Contact Information",
        description: "Here's how you can reach us directly:",
        email: {
          title: "Email",
          value: "contact@jam3a.me",
          description: "For general inquiries"
        },
        support: {
          title: "Customer Support",
          value: "support@jam3a.me",
          description: "For help with orders and products"
        },
        phone: {
          title: "Phone",
          value: "+966 12 345 6789",
          description: "Sunday - Thursday: 9:00 AM - 6:00 PM (Saudi Arabia Time)"
        },
        address: {
          title: "Office Address",
          value: "King Fahd Road, Riyadh, Saudi Arabia",
          description: "Visit us during business hours"
        },
        hours: {
          title: "Business Hours",
          value: "Sunday - Thursday: 9:00 AM - 6:00 PM",
          description: "Closed on Friday and Saturday"
        }
      },
      faq: {
        title: "Frequently Asked Questions",
        description: "Find quick answers to common questions:",
        link: "View All FAQs",
        items: [
          {
            question: "How does Jam3a group buying work?",
            answer: "Jam3a allows users to join together to purchase products at discounted prices. When enough people join a Jam3a (minimum 5 participants), everyone gets the group discount."
          },
          {
            question: "When will I be charged for my order?",
            answer: "You'll only be charged once the minimum group size for the Jam3a deal is reached. If the minimum isn't reached, no charges will be made."
          },
          {
            question: "How do I track my order?",
            answer: "You can track your order by visiting the 'Track Order' page and entering your order number, or by checking your account under 'Jam3a History'."
          }
        ]
      }
    },
    ar: {
      title: "اتصل بنا",
      subtitle: "يسعدنا أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.",
      form: {
        title: "أرسل لنا رسالة",
        name: "اسمك",
        email: "عنوان البريد الإلكتروني",
        phone: "رقم الهاتف (اختياري)",
        subject: "الموضوع",
        message: "الرسالة",
        submit: "إرسال الرسالة",
        submitting: "جاري الإرسال...",
        success: "تم إرسال رسالتك! سنرد عليك قريبًا.",
        error: "حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى."
      },
      contactInfo: {
        title: "معلومات الاتصال",
        description: "إليك كيفية الوصول إلينا مباشرة:",
        email: {
          title: "البريد الإلكتروني",
          value: "contact@jam3a.me",
          description: "للاستفسارات العامة"
        },
        support: {
          title: "دعم العملاء",
          value: "support@jam3a.me",
          description: "للمساعدة في الطلبات والمنتجات"
        },
        phone: {
          title: "الهاتف",
          value: "+966 12 345 6789",
          description: "الأحد - الخميس: 9:00 صباحًا - 6:00 مساءً (توقيت المملكة العربية السعودية)"
        },
        address: {
          title: "عنوان المكتب",
          value: "طريق الملك فهد، الرياض، المملكة العربية السعودية",
          description: "زرنا خلال ساعات العمل"
        },
        hours: {
          title: "ساعات العمل",
          value: "الأحد - الخميس: 9:00 صباحًا - 6:00 مساءً",
          description: "مغلق يومي الجمعة والسبت"
        }
      },
      faq: {
        title: "الأسئلة المتداولة",
        description: "ابحث عن إجابات سريعة للأسئلة الشائعة:",
        link: "عرض جميع الأسئلة المتداولة",
        items: [
          {
            question: "كيف يعمل الشراء الجماعي في جمعة؟",
            answer: "تتيح جمعة للمستخدمين الانضمام معًا لشراء المنتجات بأسعار مخفضة. عندما ينضم عدد كافٍ من الأشخاص إلى جمعة (الحد الأدنى 5 مشاركين)، يحصل الجميع على خصم المجموعة."
          },
          {
            question: "متى سيتم خصم قيمة طلبي؟",
            answer: "سيتم خصم المبلغ فقط عند الوصول إلى الحد الأدنى لحجم المجموعة لصفقة جمعة. إذا لم يتم الوصول إلى الحد الأدنى، فلن يتم إجراء أي رسوم."
          },
          {
            question: "كيف يمكنني تتبع طلبي؟",
            answer: "يمكنك تتبع طلبك من خلال زيارة صفحة 'تتبع الطلب' وإدخال رقم طلبك، أو من خلال التحقق من حسابك ضمن 'سجل جمعة'."
          }
        ]
      }
    }
  };

  const currentContent = content[language];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /> {currentContent.form.success}</div>,
        variant: "success"
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
            <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.form.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{currentContent.form.name}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{currentContent.form.email}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{currentContent.form.phone}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">{currentContent.form.subject}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{currentContent.form.message}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">⟳</span>
                          {currentContent.form.submitting}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="mr-2 h-4 w-4" />
                          {currentContent.form.submit}
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.contactInfo.title}</CardTitle>
                  <CardDescription>{currentContent.contactInfo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-jam3a-purple mt-1" />
                    <div>
                      <h3 className="font-medium">{currentContent.contactInfo.email.title}</h3>
                      <p className="text-jam3a-purple">{currentContent.contactInfo.email.value}</p>
                      <p className="text-sm text-muted-foreground">{currentContent.contactInfo.email.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-jam3a-purple mt-1" />
                    <div>
                      <h3 className="font-medium">{currentContent.contactInfo.support.title}</h3>
                      <p className="text-jam3a-purple">{currentContent.contactInfo.support.value}</p>
                      <p className="text-sm text-muted-foreground">{currentContent.contactInfo.support.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-jam3a-purple mt-1" />
                    <div>
                      <h3 className="font-medium">{currentContent.contactInfo.phone.title}</h3>
                      <p className="text-jam3a-purple">{currentContent.contactInfo.phone.value}</p>
                      <p className="text-sm text-muted-foreground">{currentContent.contactInfo.phone.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-jam3a-purple mt-1" />
                    <div>
                      <h3 className="font-medium">{currentContent.contactInfo.address.title}</h3>
                      <p className="text-jam3a-purple">{currentContent.contactInfo.address.value}</p>
                      <p className="text-sm text-muted-foreground">{currentContent.contactInfo.address.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-jam3a-purple mt-1" />
                    <div>
                      <h3 className="font-medium">{currentContent.contactInfo.hours.title}</h3>
                      <p className="text-jam3a-purple">{currentContent.contactInfo.hours.value}</p>
                      <p className="text-sm text-muted-foreground">{currentContent.contactInfo.hours.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.faq.title}</CardTitle>
                  <CardDescription>{currentContent.faq.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentContent.faq.items.map((item, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-medium mb-1">{item.question}</h3>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => window.location.href = '/customer-support'}
                    >
                      {currentContent.faq.link}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-12">
            <Card>
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6554812553373!2d46.6745381!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sKing%20Fahd%20Rd%2C%20Riyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1648651234567!5m2!1sen!2sus"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Jam3a Hub Collective Location"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
