import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, ShoppingBag, Globe, Menu, X, User, LogOut, ShieldCheck, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, createContext, useContext } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

// Create a context for language
export const LanguageContext = createContext<{
  language: 'en' | 'ar';
  setLanguage: React.Dispatch<React.SetStateAction<'en' | 'ar'>>;
}>({
  language: 'en',
  setLanguage: () => {},
});

// Custom hook to use language context
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize language from localStorage if available
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    try {
      const savedLanguage = localStorage.getItem('jam3a_language');
      return (savedLanguage === 'ar' ? 'ar' : 'en');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 'en';
    }
  });
  
  // Update localStorage when language changes
  useEffect(() => {
    try {
      localStorage.setItem('jam3a_language', language);
      // Update document direction based on language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      // Add language class to body for global styling
      document.body.classList.toggle('rtl', language === 'ar');
    } catch (error) {
      console.error('Error updating language settings:', error);
    }
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Cart items count (simulated for now)
  const [cartCount, setCartCount] = useState(0);
  
  // Get cart count from localStorage on component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('jam3a_cart');
      if (storedCart) {
        try {
          const cartItems = JSON.parse(storedCart);
          setCartCount(Array.isArray(cartItems) ? cartItems.length : 0);
        } catch (e) {
          console.error('Error parsing cart data:', e);
          setCartCount(0);
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setCartCount(0);
    }
  }, []);
  
  // Listen for storage events to update cart count when changed in another tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jam3a_cart') {
        try {
          const cartItems = e.newValue ? JSON.parse(e.newValue) : [];
          setCartCount(Array.isArray(cartItems) ? cartItems.length : 0);
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setCartCount(0);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleLanguage = (value: string) => {
    if (value) {
      try {
        const newLang = value as 'en' | 'ar';
        setLanguage(newLang);
        toast({
          title: newLang === 'en' ? 'Language Changed' : 'تم تغيير اللغة',
          description: newLang === 'en' ? 'Website language is now English' : 'لغة الموقع الآن هي العربية',
        });
      } catch (error) {
        console.error('Error changing language:', error);
      }
    }
  };

  const handleLogout = () => {
    try {
      logout();
      toast({
        title: language === 'en' ? 'Logged Out' : 'تم تسجيل الخروج',
        description: language === 'en' ? 'You have been logged out successfully' : 'تم تسجيل خروجك بنجاح',
      });
      
      // Navigate to home page after logout
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: language === 'en' ? 'Logout Failed' : 'فشل تسجيل الخروج',
        description: language === 'en' ? 'An error occurred during logout' : 'حدث خطأ أثناء تسجيل الخروج',
        variant: 'destructive',
      });
    }
  };

  const handleJoinStartJam3a = () => {
    try {
      if (isAuthenticated) {
        navigate('/start-jam3a');
      } else {
        // Save current location to redirect back after login
        navigate('/login', { state: { from: location.pathname } });
        toast({
          title: language === 'en' ? 'Login Required' : 'تسجيل الدخول مطلوب',
          description: language === 'en' ? 'Please login to start or join a Jam3a' : 'يرجى تسجيل الدخول لبدء أو الانضمام إلى جمعة',
        });
      }
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error navigating:', error);
    }
  };
  
  // Check if a link is active
  const isActive = (path: string) => {
    try {
      if (path === '/' && location.pathname === '/') return true;
      if (path !== '/' && location.pathname.startsWith(path)) return true;
      return false;
    } catch (error) {
      console.error('Error checking active link:', error);
      return false;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center h-10 w-10 rounded-full gradient-bg transition-transform group-hover:scale-110">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Jam3a</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            {language === 'en' ? 'Home' : 'الرئيسية'}
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            {language === 'en' ? 'About Us' : 'من نحن'}
          </Link>
          <Link 
            to="/how-it-works" 
            className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}
          >
            {language === 'en' ? 'How It Works' : 'كيف تعمل'}
          </Link>
          <Link 
            to="/sellers" 
            className={`nav-link ${isActive('/sellers') ? 'active' : ''}`}
          >
            {language === 'en' ? 'For Sellers' : 'للبائعين'}
          </Link>
          <Link 
            to="/faq" 
            className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
          >
            {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ToggleGroup 
            type="single" 
            value={language} 
            onValueChange={toggleLanguage}
            className="bg-secondary border rounded-full shadow-sm p-1"
          >
            <ToggleGroupItem value="en" aria-label="Toggle English" className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              EN
            </ToggleGroupItem>
            <ToggleGroupItem value="ar" aria-label="Toggle Arabic" className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              AR
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Link to="/shop-jam3a">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-foreground hover:text-primary transition-colors ${isActive('/shop-jam3a') ? 'text-primary' : ''}`}
              title={language === 'en' ? 'Shop Jam3a' : 'تسوق جمعة'}
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/cart">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-foreground hover:text-primary transition-colors relative ${isActive('/cart') ? 'text-primary' : ''}`}
              title={language === 'en' ? 'Shopping Cart' : 'عربة التسوق'}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          {user?.isAdmin && (
            <Link to="/admin">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`text-foreground hover:text-primary transition-colors relative ${isActive('/admin') ? 'text-primary' : ''}`}
                title={language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
              >
                <ShieldCheck className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
              </Button>
            </Link>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`text-foreground hover:text-primary transition-colors ${isActive('/profile') || isActive('/my-jam3a') ? 'text-primary' : ''}`}
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border shadow-md">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem className="font-medium">
                    <span>{user?.name || 'User'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/my-jam3a" className="w-full flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'My Jam3a Deals' : 'صفقات جمعتي'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <div className="w-full flex items-center text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                    </div>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link to="/login" className="w-full flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/register" className="w-full flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Register' : 'التسجيل'}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="primary" 
            onClick={handleJoinStartJam3a}
            className="gradient-bg text-white hover:opacity-90 transition-opacity"
          >
            {language === 'en' ? 'Start Jam3a' : 'ابدأ جمعة'}
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart" className="relative mr-2">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <Link 
              to="/about" 
              className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'About Us' : 'من نحن'}
            </Link>
            <Link 
              to="/how-it-works" 
              className={`mobile-nav-link ${isActive('/how-it-works') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'How It Works' : 'كيف تعمل'}
            </Link>
            <Link 
              to="/shop-jam3a" 
              className={`mobile-nav-link ${isActive('/shop-jam3a') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Shop Jam3a' : 'تسوق جمعة'}
            </Link>
            <Link 
              to="/sellers" 
              className={`mobile-nav-link ${isActive('/sellers') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'For Sellers' : 'للبائعين'}
            </Link>
            <Link 
              to="/faq" 
              className={`mobile-nav-link ${isActive('/faq') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
            </Link>
            
            <div className="border-t my-2"></div>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
                </Link>
                <Link 
                  to="/my-jam3a" 
                  className={`mobile-nav-link ${isActive('/my-jam3a') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'My Jam3a Deals' : 'صفقات جمعتي'}
                </Link>
                {user?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
                  </Link>
                )}
                <button 
                  className="mobile-nav-link text-destructive text-left"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`mobile-nav-link ${isActive('/login') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                </Link>
                <Link 
                  to="/register" 
                  className={`mobile-nav-link ${isActive('/register') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'Register' : 'التسجيل'}
                </Link>
              </>
            )}
            
            <div className="border-t my-2"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {language === 'en' ? 'Language:' : 'اللغة:'}
              </span>
              <ToggleGroup 
                type="single" 
                value={language} 
                onValueChange={toggleLanguage}
                className="bg-secondary border rounded-full shadow-sm p-1"
              >
                <ToggleGroupItem value="en" aria-label="Toggle English" className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  EN
                </ToggleGroupItem>
                <ToggleGroupItem value="ar" aria-label="Toggle Arabic" className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  AR
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <Button 
              variant="primary" 
              onClick={handleJoinStartJam3a}
              className="w-full gradient-bg text-white hover:opacity-90 transition-opacity mt-2"
            >
              {language === 'en' ? 'Start Jam3a' : 'ابدأ جمعة'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
