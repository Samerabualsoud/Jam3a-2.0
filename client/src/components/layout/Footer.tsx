import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Users, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from './Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');

  // Function to scroll to top when clicking any footer link
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Check if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: isArabic ? 'خطأ في البريد الإلكتروني' : 'Email Error',
        description: isArabic ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }
    
    // Simulate subscription success
    toast({
      title: isArabic ? 'تم الاشتراك بنجاح!' : 'Successfully Subscribed!',
      description: isArabic 
        ? `سنرسل لك آخر العروض والتحديثات على ${email}` 
        : `We'll send the latest deals and updates to ${email}`,
    });
    setEmail('');
  };

  return (
    <footer className="bg-gray-950 text-white relative" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Scroll to top button */}
      <Button 
        onClick={scrollToTop}
        className="absolute -top-5 right-8 h-10 w-10 rounded-full gradient-bg shadow-lg flex items-center justify-center p-0 hover:opacity-90 transition-all duration-300 hover:-translate-y-1"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </Button>

      <div className="container mx-auto px-4 py-12 md:px-6">
        {/* Newsletter subscription */}
        <div className="mb-12 p-6 bg-gray-900 rounded-xl">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2 gradient-text">
                {isArabic ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to Our Newsletter'}
              </h3>
              <p className="text-gray-400">
                {isArabic 
                  ? 'احصل على آخر العروض والتحديثات مباشرة إلى بريدك الإلكتروني'
                  : 'Get the latest deals and updates delivered straight to your inbox'}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={isArabic ? 'بريدك الإلكتروني' : 'Your email'}
                className="bg-gray-800 border-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="gradient-bg hover:opacity-90">
                {isArabic ? 'اشترك' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up">
            <Link to="/" className="flex items-center gap-2" onClick={scrollToTop}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Jam3a</span>
            </Link>
            <p className="mt-4 text-gray-400 leading-relaxed">
              {isArabic 
                ? "أول وأكثر منصة شراء جماعي تطورًا في المملكة العربية السعودية. اشترك مع الآخرين للحصول على أسعار أفضل على المنتجات المميزة."
                : "Saudi Arabia's first and most advanced group-buying platform. Join forces with others to unlock better prices on premium products."}
            </p>
            <div className="mt-6 flex gap-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon" 
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon" 
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon" 
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            
            {/* Contact information */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:info@jam3a.sa" className="text-gray-400 hover:text-white transition-colors">
                  info@jam3a.sa
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+966123456789" className="text-gray-400 hover:text-white transition-colors">
                  +966 12 345 6789
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  {isArabic 
                    ? "الرياض، المملكة العربية السعودية"
                    : "Riyadh, Saudi Arabia"}
                </span>
              </div>
            </div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-semibold mb-4 gradient-text">
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/shop-jam3a" 
                  className={`footer-link flex items-center ${isActive('/shop-jam3a') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'تصفح جميع الجمعات' : 'Browse All Jam3as'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/start-jam3a" 
                  className={`footer-link flex items-center ${isActive('/start-jam3a') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'ابدأ جمعة' : 'Start a Jam3a'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className={`footer-link flex items-center ${isActive('/how-it-works') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'كيف تعمل' : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className={`footer-link flex items-center ${isActive('/faq') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'الأسئلة الشائعة' : 'FAQ'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={`footer-link flex items-center ${isActive('/about') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'من نحن' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`footer-link flex items-center ${isActive('/contact') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'اتصل بنا' : 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold mb-4 gradient-text">
              {isArabic ? 'للمشترين' : 'For Buyers'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/my-jam3a" 
                  className={`footer-link flex items-center ${isActive('/my-jam3a') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'صفقات جمعتي' : 'My Jam3a Deals'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/track-order" 
                  className={`footer-link flex items-center ${isActive('/track-order') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'تتبع الطلب' : 'Track Order'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className={`footer-link flex items-center ${isActive('/returns') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'سياسة الإرجاع' : 'Returns Policy'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className={`footer-link flex items-center ${isActive('/support') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'دعم العملاء' : 'Customer Support'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className={`footer-link flex items-center ${isActive('/cart') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'عربة التسوق' : 'Shopping Cart'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className={`footer-link flex items-center ${isActive('/profile') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'الملف الشخصي' : 'My Profile'}
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-semibold mb-4 gradient-text">
              {isArabic ? 'للبائعين' : 'For Sellers'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/become-seller" 
                  className={`footer-link flex items-center ${isActive('/become-seller') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'كن بائعًا' : 'Become a Seller'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/seller-login" 
                  className={`footer-link flex items-center ${isActive('/seller-login') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'تسجيل دخول البائع' : 'Seller Login'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/seller-guidelines" 
                  className={`footer-link flex items-center ${isActive('/seller-guidelines') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'إرشادات البائع' : 'Seller Guidelines'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/seller-support" 
                  className={`footer-link flex items-center ${isActive('/seller-support') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'دعم البائع' : 'Seller Support'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/seller/register" 
                  className={`footer-link flex items-center ${isActive('/seller/register') ? 'text-primary' : ''}`} 
                  onClick={scrollToTop}
                >
                  {isArabic ? 'تسجيل كبائع' : 'Seller Registration'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Jam3a. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <div className="flex flex-wrap gap-6">
              <Link 
                to="/privacy" 
                className={`text-sm footer-link ${isActive('/privacy') ? 'text-primary' : ''}`} 
                onClick={scrollToTop}
              >
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link 
                to="/terms" 
                className={`text-sm footer-link ${isActive('/terms') ? 'text-primary' : ''}`} 
                onClick={scrollToTop}
              >
                {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm footer-link ${isActive('/contact') ? 'text-primary' : ''}`} 
                onClick={scrollToTop}
              >
                {isArabic ? 'اتصل بنا' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
