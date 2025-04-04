
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Globe, Menu, X, User, LogOut, ShieldCheck } from 'lucide-react';
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
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
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
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-jam3a-purple">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Jam3a</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-jam3a-purple transition-colors">
            {language === 'en' ? 'Home' : 'الرئيسية'}
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-jam3a-purple transition-colors">
            {language === 'en' ? 'About Us' : 'من نحن'}
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium text-foreground hover:text-jam3a-purple transition-colors">
            {language === 'en' ? 'How It Works' : 'كيف تعمل'}
          </Link>
          <Link to="/sellers" className="text-sm font-medium text-foreground hover:text-jam3a-purple transition-colors">
            {language === 'en' ? 'For Sellers' : 'للبائعين'}
          </Link>
          <Link to="/faq" className="text-sm font-medium text-foreground hover:text-jam3a-purple transition-colors">
            {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ToggleGroup 
            type="single" 
            value={language} 
            onValueChange={toggleLanguage}
            className="bg-gray-50 border rounded-full shadow-sm p-1"
          >
            <ToggleGroupItem value="en" aria-label="Toggle English" className="rounded-full data-[state=on]:bg-jam3a-purple data-[state=on]:text-white">
              EN
            </ToggleGroupItem>
            <ToggleGroupItem value="ar" aria-label="Toggle Arabic" className="rounded-full data-[state=on]:bg-jam3a-purple data-[state=on]:text-white">
              AR
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Link to="/shop-jam3a">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-jam3a-purple transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/admin-login">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:text-jam3a-purple transition-colors relative"
              title={language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
            >
              <ShieldCheck className="h-5 w-5" />
              {user?.isAdmin && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
              )}
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-jam3a-purple transition-colors">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border border-gray-200 shadow-md">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem className="font-medium">
                    <span>{user?.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-jam3a-purple-50">
                    <Link to="/my-jam3a" className="w-full flex items-center">
                      {language === 'en' ? 'My Jam3a Deals' : 'صفقات جمعتي'}
                    </Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem className="hover:bg-jam3a-purple-50">
                      <Link to="/admin" className="w-full flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="hover:bg-jam3a-purple-50" onClick={handleLogout}>
                    <div className="w-full flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
                    </div>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="hover:bg-jam3a-purple-50">
                    <Link to="/login" className="w-full flex items-center">
                      {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-jam3a-purple-50">
                    <Link to="/register" className="w-full flex items-center">
                      {language === 'en' ? 'Register' : 'التسجيل'}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-jam3a-purple hover:bg-jam3a-deep-purple transition-colors">
            <Link to="/start-jam3a" className="text-white">
              {language === 'en' ? 'Join/Start a Jam3a' : 'انضم/ابدأ جمعة'}
            </Link>
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
        <div className="fixed inset-0 top-16 z-50 bg-white md:hidden">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Link 
              to="/" 
              className="text-lg font-medium p-2 hover:bg-jam3a-purple-50 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <Link 
              to="/about" 
              className="text-lg font-medium p-2 hover:bg-jam3a-purple-50 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'About Us' : 'من نحن'}
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-lg font-medium p-2 hover:bg-jam3a-purple-50 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'How It Works' : 'كيف تعمل'}
            </Link>
            <Link 
              to="/sellers" 
              className="text-lg font-medium p-2 hover:bg-jam3a-purple-50 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'For Sellers' : 'للبائعين'}
            </Link>
            <Link 
              to="/faq" 
              className="text-lg font-medium p-2 hover:bg-jam3a-purple-50 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
            </Link>
            <Link 
              to="/login" 
              className="text-lg font-medium p-2 hover:bg-jam3a-purple-50 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
            </Link>
            <Link 
              to="/register" 
              className="text-lg font-medium p-2 hover:bg-jam3a-purple-50 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Register' : 'التسجيل'}
            </Link>
            <Link 
              to="/admin-login" 
              className="text-lg font-medium p-2 hover:bg-jam3a-purple-50 rounded transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShieldCheck className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
            </Link>
            <Button 
              className="bg-jam3a-purple hover:bg-jam3a-deep-purple mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to="/start-jam3a" className="text-white">
                {language === 'en' ? 'Join/Start a Jam3a' : 'انضم/ابدأ جمعة'}
              </Link>
            </Button>
            <div className="flex justify-center items-center mt-4 p-2">
              <ToggleGroup 
                type="single" 
                value={language} 
                onValueChange={toggleLanguage}
                className="w-full max-w-xs border rounded-lg shadow-sm p-1"
              >
                <ToggleGroupItem value="en" className="flex-1 data-[state=on]:bg-jam3a-purple data-[state=on]:text-white">
                  <Globe className="h-4 w-4 mr-1 inline-block" /> English
                </ToggleGroupItem>
                <ToggleGroupItem value="ar" className="flex-1 data-[state=on]:bg-jam3a-purple data-[state=on]:text-white">
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
