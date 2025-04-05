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
    const savedLanguage = localStorage.getItem('jam3a_language');
    return (savedLanguage === 'ar' ? 'ar' : 'en');
  });
  
  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('jam3a_language', language);
    // Update document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    // Add language class to body for global styling
    document.body.classList.toggle('rtl', language === 'ar');
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
    const storedCart = localStorage.getItem('jam3a_cart');
    if (storedCart) {
      try {
        const cartItems = JSON.parse(storedCart);
        setCartCount(Array.isArray(cartItems) ? cartItems.length : 0);
      } catch (e) {
        console.error('Error parsing cart data:', e);
      }
    }
  }, []);
  
  // Listen for storage events to update cart count when changed in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'jam3a_cart') {
        try {
          const cartItems = e.newValue ? JSON.parse(e.newValue) : [];
          setCartCount(Array.isArray(cartItems) ? cartItems.length : 0);
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleLanguage = (value: string) => {
    if (value) {
      const newLang = value as 'en' | 'ar';
      setLanguage(newLang);
      toast({
        title: newLang === 'en' ? 'Language Changed' : 'تم تغيير اللغة',
        description: newLang === 'en' ? 'Website language is now English' : 'لغة الموقع الآن هي العربية',
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: language === 'en' ? 'Logged Out' : 'تم تسجيل الخروج',
      description: language === 'en' ? 'You have been logged out successfully' : 'تم تسجيل خروجك بنجاح',
    });
    
    // Navigate to home page after logout
    navigate('/');
  };

  const handleJoinStartJam3a = () => {
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
  };
  
  // Check if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
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
                    <span>{user?.name}</span>
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
                  {user?.isAdmin && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="w-full flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <div className="w-full flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
                    </div>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link to="/login" className="w-full flex items-center">
                      {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/register" className="w-full flex items-center">
                      {language === 'en' ? 'Register' : 'التسجيل'}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="gradient-bg hover:opacity-90 transition-opacity"
            onClick={handleJoinStartJam3a}
          >
            {language === 'en' ? 'Join/Start a Jam3a' : 'انضم/ابدأ جمعة'}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Link 
              to="/" 
              className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/') ? 'bg-secondary/80' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <Link 
              to="/about" 
              className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/about') ? 'bg-secondary/80' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'About Us' : 'من نحن'}
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/how-it-works') ? 'bg-secondary/80' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'How It Works' : 'كيف تعمل'}
            </Link>
            <Link 
              to="/sellers" 
              className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/sellers') ? 'bg-secondary/80' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'For Sellers' : 'للبائعين'}
            </Link>
            <Link 
              to="/faq" 
              className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/faq') ? 'bg-secondary/80' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
            </Link>
            <Link 
              to="/shop-jam3a" 
              className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/shop-jam3a') ? 'bg-secondary/80' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag className="h-5 w-5 inline-block mr-2" />
              {language === 'en' ? 'Shop Jam3a' : 'تسوق جمعة'}
            </Link>
            <Link 
              to="/cart" 
              className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/cart') ? 'bg-secondary/80' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5 inline-block mr-2" />
              {language === 'en' ? 'Cart' : 'عربة التسوق'}
              {cartCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {cartCount}
                </Badge>
              )}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/profile') ? 'bg-secondary/80' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 inline-block mr-2" />
                  {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
                </Link>
                <Link 
                  to="/my-jam3a" 
                  className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/my-jam3a') ? 'bg-secondary/80' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 inline-block mr-2" />
                  {language === 'en' ? 'My Jam3a Deals' : 'صفقات جمعتي'}
                </Link>
                {user?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/admin') ? 'bg-secondary/80' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShieldCheck className="h-5 w-5 inline-block mr-2" />
                    {language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
                  </Link>
                )}
                <Button 
                  variant="outline"
                  className="text-lg font-medium p-3 mt-2"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 inline-block mr-2" />
                  {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/login') ? 'bg-secondary/80' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                </Link>
                <Link 
                  to="/register" 
                  className={`text-lg font-medium p-3 hover:bg-secondary rounded-lg transition-colors ${isActive('/register') ? 'bg-secondary/80' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'Register' : 'التسجيل'}
                </Link>
              </>
            )}
            
            <Button 
              className="gradient-bg hover:opacity-90 mt-4 p-6 text-lg"
              onClick={handleJoinStartJam3a}
            >
              {language === 'en' ? 'Join/Start a Jam3a' : 'انضم/ابدأ جمعة'}
            </Button>
            <div className="flex justify-center items-center mt-4 p-2">
              <ToggleGroup 
                type="single" 
                value={language} 
                onValueChange={toggleLanguage}
                className="w-full max-w-xs border rounded-lg shadow-sm p-1"
              >
                <ToggleGroupItem value="en" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  <Globe className="h-4 w-4 mr-1 inline-block" /> English
                </ToggleGroupItem>
                <ToggleGroupItem value="ar" className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  <Globe className="h-4 w-4 mr-1 inline-block" /> العربية
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
