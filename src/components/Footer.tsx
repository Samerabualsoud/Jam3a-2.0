import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Users, ArrowUp } from 'lucide-react';
import { useLanguage } from './Header';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  // Function to scroll to top when clicking any footer link
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
            <div className={`mt-6 flex gap-6`}>
              <a href="#" className="social-icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-semibold mb-4 gradient-text">
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop-jam3a" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'تصفح جميع الجمعات' : 'Browse All Jam3as'}
                </Link>
              </li>
              <li>
                <Link to="/start-jam3a" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'ابدأ جمعة' : 'Start a Jam3a'}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'كيف تعمل' : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'الأسئلة الشائعة' : 'FAQ'}
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
                <Link to="/my-jam3a" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'صفقات جمعتي' : 'My Jam3a Deals'}
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'تتبع الطلب' : 'Track Order'}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'سياسة الإرجاع' : 'Returns Policy'}
                </Link>
              </li>
              <li>
                <Link to="/support" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'دعم العملاء' : 'Customer Support'}
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
                <Link to="/become-seller" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'كن بائعًا' : 'Become a Seller'}
                </Link>
              </li>
              <li>
                <Link to="/seller-login" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'تسجيل دخول البائع' : 'Seller Login'}
                </Link>
              </li>
              <li>
                <Link to="/seller-guidelines" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'إرشادات البائع' : 'Seller Guidelines'}
                </Link>
              </li>
              <li>
                <Link to="/seller-support" className="footer-link flex items-center" onClick={scrollToTop}>
                  {isArabic ? 'دعم البائع' : 'Seller Support'}
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
              <Link to="/privacy" className="text-sm footer-link" onClick={scrollToTop}>
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link to="/terms" className="text-sm footer-link" onClick={scrollToTop}>
                {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
              </Link>
              <Link to="/contact" className="text-sm footer-link" onClick={scrollToTop}>
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
