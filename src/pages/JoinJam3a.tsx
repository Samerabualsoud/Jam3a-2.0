import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const JoinJam3a = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('details');
  
  // Get product details from URL params
  const productName = searchParams.get('product') || 'Jam3a Deal';
  const productPrice = searchParams.get('price') || '4999 SAR';
  const productDiscount = searchParams.get('discount') || '16%';
  const productId = searchParams.get('id') || '1';
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'credit-card'
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    phone: false,
    address: false
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };
  
  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  // Validate form before proceeding to next tab
  const validateForm = () => {
    const errors = {
      name: !formData.name,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      phone: !formData.phone,
      address: !formData.address
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };
  
  // Handle tab change with validation
  const handleTabChange = (value: string) => {
    if (activeTab === 'details' && value === 'info') {
      setActiveTab(value);
    } else if (activeTab === 'info' && value === 'payment') {
      if (validateForm()) {
        setActiveTab(value);
      } else {
        toast({
          title: language === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة',
          variant: 'destructive'
        });
      }
    } else if (activeTab === 'info' && value === 'details') {
      setActiveTab(value);
    } else if (activeTab === 'payment' && value === 'info') {
      setActiveTab(value);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success toast
    toast({
      title: language === 'en' ? 'Success!' : 'تم بنجاح!',
      description: language === 'en' 
        ? `You have successfully joined the ${productName} Jam3a!` 
        : `لقد انضممت بنجاح إلى جمعة ${productName}!`,
    });
    
    // Redirect to home page after successful join
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  // Get product image based on ID
  const getProductImage = () => {
    const images = {
      '1': 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80',
      '2': 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      '3': 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      '4': 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    };
    
    return images[productId] || 'https://placehold.co/400x400/purple/white?text=Product+Image';
  };
  
  return (
    <div className={`flex min-h-screen flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {language === 'en' ? 'Join This Jam3a' : 'انضم إلى هذه الجمعة'}
          </h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">
                  {language === 'en' ? 'Deal Details' : 'تفاصيل الصفقة'}
                </TabsTrigger>
                <TabsTrigger value="info">
                  {language === 'en' ? 'Your Information' : 'معلوماتك'}
                </TabsTrigger>
                <TabsTrigger value="payment">
                  {language === 'en' ? 'Payment' : 'الدفع'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <img 
                        src={getProductImage()} 
                        alt={productName}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/purple/white?text=Product+Image';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold mb-4">{productName}</h2>
                    
                    <div className="mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-purple-600 mr-2">
                          {productPrice.replace('SAR', '')} SAR
                        </span>
                        {productDiscount && (
                          <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {productDiscount} OFF
                          </span>
                        )}
                      </div>
                      {productDiscount && (
                        <div className="text-sm text-gray-500 line-through">
                          {Math.round(parseInt(productPrice) / (1 - parseInt(productDiscount) / 100))} SAR
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">
                        {language === 'en' ? 'Deal Description' : 'وصف الصفقة'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'en' 
                          ? `Join this Jam3a to get ${productName} at a discounted price of ${productPrice}. By joining with others, you'll save ${productDiscount} off the regular price!`
                          : `انضم إلى هذه الجمعة للحصول على ${productName} بسعر مخفض قدره ${productPrice}. من خلال الانضمام مع الآخرين، ستوفر ${productDiscount} من السعر العادي!`
                        }
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">
                        {language === 'en' ? 'Jam3a Details' : 'تفاصيل الجمعة'}
                      </h3>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>{language === 'en' ? 'Current members: 8/10' : 'الأعضاء الحاليون: 8/10'}</li>
                        <li>{language === 'en' ? 'Estimated delivery: 2-3 weeks' : 'التسليم المتوقع: 2-3 أسابيع'}</li>
                        <li>{language === 'en' ? 'Payment options: Credit Card, Apple Pay, STC Pay, Tabby, Tamara' : 'خيارات الدفع: بطاقة ائتمان، آبل باي، STC Pay، تابي، تمارا'}</li>
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => handleTabChange('info')}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {language === 'en' ? 'Continue to Next Step' : 'المتابعة إلى الخطوة التالية'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={formErrors.name ? 'text-red-500' : ''}>
                        {language === 'en' ? 'Full Name *' : 'الاسم الكامل *'}
                      </Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'}
                        required
                        className={formErrors.name ? 'border-red-500' : ''}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {language === 'en' ? 'Name is required' : 'الاسم مطلوب'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className={formErrors.email ? 'text-red-500' : ''}>
                        {language === 'en' ? 'Email Address *' : 'البريد الإلكتروني *'}
                      </Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                        required
                        className={formErrors.email ? 'border-red-500' : ''}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {language === 'en' ? 'Valid email is required' : 'البريد الإلكتروني الصحيح مطلوب'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={formErrors.phone ? 'text-red-500' : ''}>
                        {language === 'en' ? 'Phone Number *' : 'رقم الهاتف *'}
                      </Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter your phone number' : 'أدخل رقم هاتفك'}
                        required
                        className={formErrors.phone ? 'border-red-500' : ''}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {language === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className={formErrors.address ? 'text-red-500' : ''}>
                        {language === 'en' ? 'Delivery Address *' : 'عنوان التسليم *'}
                      </Label>
                      <Input 
                        id="address" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter your address' : 'أدخل عنوانك'}
                        required
                        className={formErrors.address ? 'border-red-500' : ''}
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {language === 'en' ? 'Address is required' : 'العنوان مطلوب'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => handleTabChange('details')}
                    >
                      {language === 'en' ? 'Back' : 'رجوع'}
                    </Button>
                    
                    <Button 
                      type="button"
                      onClick={() => handleTabChange('payment')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {language === 'en' ? 'Continue to Payment' : 'المتابعة إلى الدفع'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="payment" className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {language === 'en' ? 'Select Payment Method' : 'اختر طريقة الدفع'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === 'credit-card' ? 'border-purple-600 bg-purple-50' : ''}`}
                        onClick={() => handlePaymentMethodChange('credit-card')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {language === 'en' ? 'Credit Card' : 'بطاقة ائتمان'}
                          </div>
                          <div className="w-5 h-5 rounded-full border border-purple-600 flex items-center justify-center">
                            {formData.paymentMethod === 'credit-card' && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">Visa, Mastercard, MADA</div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === 'apple-pay' ? 'border-purple-600 bg-purple-50' : ''}`}
                        onClick={() => handlePaymentMethodChange('apple-pay')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Apple Pay</div>
                          <div className="w-5 h-5 rounded-full border border-purple-600 flex items-center justify-center">
                            {formData.paymentMethod === 'apple-pay' && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'en' ? 'Quick & Secure' : 'سريع وآمن'}
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === 'stc-pay' ? 'border-purple-600 bg-purple-50' : ''}`}
                        onClick={() => handlePaymentMethodChange('stc-pay')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">STC Pay</div>
                          <div className="w-5 h-5 rounded-full border border-purple-600 flex items-center justify-center">
                            {formData.paymentMethod === 'stc-pay' && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'en' ? 'Mobile Payment' : 'الدفع عبر الجوال'}
                        </div>
                      </div>

                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === 'tabby' ? 'border-purple-600 bg-purple-50' : ''}`}
                        onClick={() => handlePaymentMethodChange('tabby')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Tabby</div>
                          <div className="w-5 h-5 rounded-full border border-purple-600 flex items-center justify-center">
                            {formData.paymentMethod === 'tabby' && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'en' ? 'Pay in 4 installments' : 'الدفع على 4 أقساط'}
                        </div>
                      </div>

                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === 'tamara' ? 'border-purple-600 bg-purple-50' : ''}`}
                        onClick={() => handlePaymentMethodChange('tamara')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Tamara</div>
                          <div className="w-5 h-5 rounded-full border border-purple-600 flex items-center justify-center">
                            {formData.paymentMethod === 'tamara' && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'en' ? 'Buy now, pay later' : 'اشتر الآن، ادفع لاحقًا'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {formData.paymentMethod === 'credit-card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">
                          {language === 'en' ? 'Card Number' : 'رقم البطاقة'}
                        </Label>
                        <Input 
                          id="card-number" 
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">
                            {language === 'en' ? 'Expiry Date' : 'تاريخ الانتهاء'}
                          </Label>
                          <Input 
                            id="expiry" 
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv" 
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(formData.paymentMethod === 'tabby' || formData.paymentMethod === 'tamara') && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">
                        {language === 'en' 
                          ? `${formData.paymentMethod === 'tabby' ? 'Tabby' : 'Tamara'} Payment Details` 
                          : `تفاصيل الدفع ${formData.paymentMethod === 'tabby' ? 'تابي' : 'تمارا'}`}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {language === 'en'
                          ? formData.paymentMethod === 'tabby' 
                            ? 'Split your payment into 4 interest-free installments.' 
                            : 'Buy now and pay 30 days later with no fees.'
                          : formData.paymentMethod === 'tabby'
                            ? 'قسّم دفعتك إلى 4 أقساط بدون فوائد.'
                            : 'اشترِ الآن وادفع بعد 30 يومًا بدون رسوم.'
                        }
                      </p>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm">
                          {language === 'en'
                            ? `I agree to ${formData.paymentMethod === 'tabby' ? 'Tabby' : 'Tamara'}'s terms and conditions`
                            : `أوافق على شروط وأحكام ${formData.paymentMethod === 'tabby' ? 'تابي' : 'تمارا'}`
                          }
                        </Label>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between mb-2">
                      <span>{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                      <span>{productPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>{language === 'en' ? 'Shipping' : 'الشحن'}</span>
                      <span>0 SAR</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>{language === 'en' ? 'Total' : 'المجموع'}</span>
                      <span>{productPrice}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => handleTabChange('info')}
                    >
                      {language === 'en' ? 'Back' : 'رجوع'}
                    </Button>
                    
                    <Button 
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {language === 'en' ? 'Complete Purchase' : 'إتمام الشراء'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JoinJam3a;
