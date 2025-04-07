import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/layout/Header';

const JoinWaitlist = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the email to a backend service
    console.log('Email submitted:', email);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset the submitted state after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 gradient-bg text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'en' 
              ? 'Join Our Waitlist for Early Access' 
              : 'انضم إلى قائمة الانتظار للوصول المبكر'}
          </h2>
          <p className="text-lg mb-8 text-white/80">
            {language === 'en' 
              ? 'Be the first to know about new deals and exclusive offers.' 
              : 'كن أول من يعرف عن الصفقات الجديدة والعروض الحصرية.'}
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={language === 'en' ? 'Your email address' : 'عنوان بريدك الإلكتروني'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
            />
            <Button type="submit" className="bg-white text-primary hover:bg-white/90">
              {isSubmitted 
                ? (language === 'en' ? 'Subscribed!' : 'تم الاشتراك!') 
                : (language === 'en' ? 'Subscribe' : 'اشترك')}
              {!isSubmitted && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </form>
          
          <p className="mt-4 text-sm text-white/60">
            {language === 'en' 
              ? 'We respect your privacy and will never share your information.' 
              : 'نحن نحترم خصوصيتك ولن نشارك معلوماتك أبدًا.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default JoinWaitlist;
