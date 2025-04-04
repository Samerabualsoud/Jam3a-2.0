import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, User, ShieldAlert } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Please enter both email and password.' 
          : 'الرجاء إدخال البريد الإلكتروني وكلمة المرور.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call for admin authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if credentials match admin credentials
      // In a real app, this would be a server-side check
      if (credentials.email === 'admin@jam3a.com' && credentials.password === 'admin123') {
        // Create admin user object
        const adminUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: credentials.email,
          isAdmin: true,
          roles: ['admin']
        };
        
        // Login the admin user
        login(adminUser);
        
        toast({
          title: language === 'en' ? 'Success' : 'نجاح',
          description: language === 'en' 
            ? 'You have successfully logged in as admin.' 
            : 'لقد قمت بتسجيل الدخول بنجاح كمسؤول.'
        });
        
        // Redirect to admin panel
        navigate('/admin');
      } else {
        toast({
          title: language === 'en' ? 'Authentication Failed' : 'فشل المصادقة',
          description: language === 'en' 
            ? 'Invalid email or password. Please try again.' 
            : 'بريد إلكتروني أو كلمة مرور غير صالحة. حاول مرة اخرى.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'An error occurred during login. Please try again.' 
          : 'حدث خطأ أثناء تسجيل الدخول. حاول مرة اخرى.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldAlert className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {language === 'en' ? 'Admin Login' : 'تسجيل دخول المسؤول'}
            </CardTitle>
            <CardDescription className="text-center">
              {language === 'en' 
                ? 'Enter your credentials to access the admin panel' 
                : 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة الإدارة'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="en" onValueChange={(value) => setLanguage(value as 'en' | 'ar')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={language === 'en' ? 'admin@example.com' : 'admin@example.com'}
                    className="pl-10"
                    value={credentials.email}
                    onChange={handleInputChange}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={language === 'en' ? '••••••••' : '••••••••'}
                    className="pl-10"
                    value={credentials.password}
                    onChange={handleInputChange}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    {language === 'en' ? 'Logging in...' : 'جاري تسجيل الدخول...'}
                  </div>
                ) : (
                  language === 'en' ? 'Login to Admin Panel' : 'تسجيل الدخول إلى لوحة الإدارة'
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {language === 'en' 
                  ? 'For admin access only. Regular users please use the' 
                  : 'للوصول الإداري فقط. يرجى من المستخدمين العاديين استخدام'}
                {' '}
                <Link to="/login" className="text-primary hover:underline">
                  {language === 'en' ? 'normal login' : 'تسجيل الدخول العادي'}
                </Link>
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground w-full text-center">
              {language === 'en' 
                ? 'Admin credentials for testing: admin@jam3a.com / admin123' 
                : 'بيانات اعتماد المسؤول للاختبار: admin@jam3a.com / admin123'}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
