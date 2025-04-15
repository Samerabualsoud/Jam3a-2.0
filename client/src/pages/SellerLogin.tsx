import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/Header';

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const SellerLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  // Login form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    console.log("Login data:", data);
    
    // Simulate login success
    toast({
      title: language === 'en' ? "Login successful" : "تم تسجيل الدخول بنجاح",
      description: language === 'en' ? "Welcome to your Seller Dashboard!" : "مرحبًا بك في لوحة تحكم البائع!",
    });
    
    // Redirect to seller dashboard after successful login
    setTimeout(() => navigate("/seller-dashboard"), 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            {language === 'en' ? 'Seller Login' : 'تسجيل دخول البائع'}
          </h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder={language === 'en' ? "your@email.com" : "بريدك@الإلكتروني.كوم"} 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Password' : 'كلمة المرور'}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="********" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button variant="link" className="text-jam3a-purple p-0">
                  {language === 'en' ? 'Forgot password?' : 'نسيت كلمة المرور؟'}
                </Button>
              </div>
              
              <Button type="submit" className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple">
                {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {language === 'en' ? "Don't have a seller account?" : "ليس لديك حساب بائع؟"}{' '}
                  <Link to="/seller-register" className="text-jam3a-purple font-medium">
                    {language === 'en' ? 'Apply now' : 'تقدم بطلب الآن'}
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerLogin;
