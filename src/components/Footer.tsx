
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Users } from 'lucide-react';
import { useLanguage } from './Header';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-jam3a-purple">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Jam3a</span>
            </Link>
            <p className="mt-4 text-gray-400">
              {language === 'en' 
                ? "Saudi Arabia's first and most advanced group-buying platform. Join forces with others to unlock better prices on premium products."
                : "أول وأكثر منصة شراء جماعي تطورًا في المملكة العربية السعودية. اشترك مع الآخرين للحصول على أسعار أفضل على المنتجات المميزة."}
            </p>
            <div className="mt-6 flex space-x-4">
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
              {language === 'en' ? 'Quick Links' : 'روابط سريعة'}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/shop-jam3a" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Shop All Deals' : 'تسوق جميع العروض'}
                </Link>
              </li>
              <li>
                <Link to="/start-jam3a" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Start a Jam3a' : 'ابدأ جمعة'}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'How It Works' : 'كيف تعمل'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'For Buyers' : 'للمشترين'}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/my-jam3a" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'My Jam3a Deals' : 'صفقات جمعتي'}
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Track Order' : 'تتبع الطلب'}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Returns Policy' : 'سياسة الإرجاع'}
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Customer Support' : 'دعم العملاء'}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'For Sellers' : 'للبائعين'}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/sellers" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Become a Seller' : 'كن بائعًا'}
                </Link>
              </li>
              <li>
                <Link to="/seller-login" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Seller Login' : 'تسجيل دخول البائع'}
                </Link>
              </li>
              <li>
                <Link to="/seller-guidelines" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Seller Guidelines' : 'إرشادات البائع'}
                </Link>
              </li>
              <li>
                <Link to="/seller-support" className="text-gray-400 hover:text-white transition-colors">
                  {language === 'en' ? 'Seller Support' : 'دعم البائع'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Jam3a. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
              </Link>
              <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
