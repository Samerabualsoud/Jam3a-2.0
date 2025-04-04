import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Users } from 'lucide-react';
import { useLanguage } from './Header';

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
    <footer className="bg-gray-900 text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2" onClick={scrollToTop}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-jam3a-purple">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Jam3a</span>
            </Link>
            <p className="mt-4 text-gray-400">
              {isArabic 
                ? "أول وأكثر منصة شراء جماعي تطورًا في المملكة العربية السعودية. اشترك مع الآخرين للحصول على أسعار أفضل على المنتجات المميزة."
                : "Saudi Arabia's first and most advanced group-buying platform. Join forces with others to unlock better prices on premium products."}
            </p>
            <div className={`mt-6 flex ${isArabic ? 'space-x-0 space-x-reverse space-s-6' : 'space-x-6'}`}>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/shop-jam3a" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'تصفح جميع الجمعات' : 'Browse All Jam3as'}
                </Link>
              </li>
              <li>
                <Link to="/start-jam3a" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'ابدأ جمعة' : 'Start a Jam3a'}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'كيف تعمل' : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'الأسئلة الشائعة' : 'FAQ'}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {isArabic ? 'للمشترين' : 'For Buyers'}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/my-jam3a" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'صفقات جمعتي' : 'My Jam3a Deals'}
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'تتبع الطلب' : 'Track Order'}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'سياسة الإرجاع' : 'Returns Policy'}
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'دعم العملاء' : 'Customer Support'}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {isArabic ? 'للبائعين' : 'For Sellers'}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/become-seller" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'كن بائعًا' : 'Become a Seller'}
                </Link>
              </li>
              <li>
                <Link to="/seller-login" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'تسجيل دخول البائع' : 'Seller Login'}
                </Link>
              </li>
              <li>
                <Link to="/seller-guidelines" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'إرشادات البائع' : 'Seller Guidelines'}
                </Link>
              </li>
              <li>
                <Link to="/seller-support" className="text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                  {isArabic ? 'دعم البائع' : 'Seller Support'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Jam3a. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
                {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
              </Link>
              <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors" onClick={scrollToTop}>
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
