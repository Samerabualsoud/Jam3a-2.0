import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/components/layout/Header';

const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    company: language === 'en' 
      ? [
          { label: 'About Us', href: '/about' },
          { label: 'How It Works', href: '/how-it-works' },
          { label: 'Careers', href: '/careers' },
          { label: 'Press', href: '/press' },
          { label: 'Blog', href: '/blog' }
        ]
      : [
          { label: 'من نحن', href: '/about' },
          { label: 'كيف تعمل', href: '/how-it-works' },
          { label: 'وظائف', href: '/careers' },
          { label: 'صحافة', href: '/press' },
          { label: 'مدونة', href: '/blog' }
        ],
    support: language === 'en'
      ? [
          { label: 'Help Center', href: '/help' },
          { label: 'Contact Us', href: '/contact' },
          { label: 'FAQs', href: '/faq' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' }
        ]
      : [
          { label: 'مركز المساعدة', href: '/help' },
          { label: 'اتصل بنا', href: '/contact' },
          { label: 'الأسئلة الشائعة', href: '/faq' },
          { label: 'سياسة الخصوصية', href: '/privacy' },
          { label: 'شروط الخدمة', href: '/terms' }
        ],
    services: language === 'en'
      ? [
          { label: 'For Sellers', href: '/sellers' },
          { label: 'Become a Seller', href: '/become-seller' },
          { label: 'Shipping & Returns', href: '/shipping' },
          { label: 'Payment Methods', href: '/payment' },
          { label: 'Gift Cards', href: '/gift-cards' }
        ]
      : [
          { label: 'للبائعين', href: '/sellers' },
          { label: 'كن بائعًا', href: '/become-seller' },
          { label: 'الشحن والإرجاع', href: '/shipping' },
          { label: 'طرق الدفع', href: '/payment' },
          { label: 'بطاقات الهدايا', href: '/gift-cards' }
        ]
  };

  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J3</span>
              </div>
              <span className="text-xl font-bold gradient-text">Jam3a</span>
            </div>
            <p className="text-muted-foreground mb-4">
              {language === 'en' 
                ? 'Bringing people together to save money through group purchasing.' 
                : 'نجمع الناس معًا لتوفير المال من خلال الشراء الجماعي.'}
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Company' : 'الشركة'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Support' : 'الدعم'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Services' : 'الخدمات'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {currentYear} Jam3a. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@jam3a.com</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{language === 'en' ? 'Dubai, UAE' : 'دبي، الإمارات العربية المتحدة'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
