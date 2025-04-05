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
import { CreditCard, Smartphone, Apple, Clock, Calendar, CreditCardIcon, Wallet, BanknoteIcon, CalendarClock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Payment method icons
const TabbyIcon = () => (
  <div className="flex items-center justify-center w-6 h-6 bg-black text-white font-bold text-xs rounded-md">
    <img src="https://cdn.tabby.ai/tabby-logo-square.png" alt="Tabby" className="w-full h-full object-contain" />
  </div>
);

const TamaraIcon = () => (
  <div className="flex items-center justify-center w-6 h-6 bg-black text-white rounded-md">
    <img src="https://tamara.co/wp-content/uploads/2022/04/tamara-logo-white.svg" alt="Tamara" className="w-full h-full p-0.5 object-contain" />
  </div>
);

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
    paymentMethod: 'credit-card',
    termsAccepted: false,
    installmentOption: '4_installments', // For Tabby/Tamara
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    termsAccepted: false,
    cardNumber: false,
    cardExpiry: false,
    cardCvv: false
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } 
    // Format card expiry as MM/YY
    else if (name === 'cardExpiry') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Regular input handling
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };
  
  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleInstallmentOptionChange = (option) => {
    setFormData(prev => ({ ...prev, installmentOption: option }));
  };

  // Validate form before proceeding to next tab
  const validateForm = () => {
    const errors = {
      name: !formData.name,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      phone: !formData.phone,
      address: !formData.address,
      termsAccepted: false,
      cardNumber: false,
      cardExpiry: false,
      cardCvv: false
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Validate payment form before submission
  const validatePaymentForm = () => {
    const errors = {
      name: false,
      email: false,
      phone: false,
      address: false,
      termsAccepted: !formData.termsAccepted,
      cardNumber: formData.paymentMethod === 'credit-card' && (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16),
      cardExpiry: formData.paymentMethod === 'credit-card' && (!formData.cardExpiry || formData.cardExpiry.length !== 5),
      cardCvv: formData.paymentMethod === 'credit-card' && (!formData.cardCvv || formData.cardCvv.length !== 3)
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };
  
  // Handle tab change with validation
  const handleTabChange = (value) => {
    // Only allow moving forward if current tab is valid
    if (value === 'details') {
      setActiveTab(value);
    } else if (activeTab === 'details' && value === 'info') {
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
  
  // Handle next button click
  const handleNext = () => {
    if (activeTab === 'details') {
      handleTabChange('info');
    } else if (activeTab === 'info') {
      handleTabChange('payment');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) {
      const errorMessage = language === 'en' 
        ? formErrors.termsAccepted 
          ? 'Please accept terms and conditions' 
          : 'Please complete all payment details'
        : formErrors.termsAccepted 
          ? 'يرجى قبول الشروط والأحكام' 
          : 'يرجى إكمال جميع تفاصيل الدفع';
      
      toast({
        title: errorMessage,
        variant: 'destructive'
      });
      return;
    }

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
      '1': 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      '2': 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      '3': 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      '4': 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      '5': 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    };
    
    return images[productId] || images['1'];
  };

  // Render Tabby payment option details
  const renderTabbyDetails = () => (
    <div className="space-y-4 mt-4 p-4 border rounded-lg bg-secondary/50">
      <div className="flex items-center gap-2">
        <TabbyIcon />
        <div>
          <h4 className="font-medium">Tabby - Buy Now, Pay Later</h4>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Split your payment into 4 interest-free installments' 
              : 'قسّم دفعتك إلى 4 أقساط بدون فوائد'}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <RadioGroup 
          value={formData.installmentOption} 
          onValueChange={handleInstallmentOptionChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md bg-background">
            <RadioGroupItem value="4_installments" id="4_installments" />
            <Label htmlFor="4_installments" className="flex-1 cursor-pointer">
              <div className="font-medium">
                {language === 'en' ? '4 interest-free installments' : '4 أقساط بدون فوائد'}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? `${Math.round(parseInt(productPrice) / 4)} SAR every 2 weeks` 
                  : `${Math.round(parseInt(productPrice) / 4)} ريال كل أسبوعين`}
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border p-3 rounded-md bg-background">
            <RadioGroupItem value="pay_next_month" id="pay_next_month" />
            <Label htmlFor="pay_next_month" className="flex-1 cursor-pointer">
              <div className="font-medium">
                {language === 'en' ? 'Pay next month' : 'ادفع الشهر القادم'}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? `Pay ${productPrice} on ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}` 
                  : `ادفع ${productPrice} في ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}`}
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        <Alert className="bg-primary/5 border-primary/20">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs">
            {language === 'en' 
              ? 'Approval takes just a few seconds. No credit card needed.' 
              : 'تستغرق الموافقة بضع ثوانٍ فقط. لا حاجة لبطاقة ائتمان.'}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  // Render Tamara payment option details
  const renderTamaraDetails = () => (
    <div className="space-y-4 mt-4 p-4 border rounded-lg bg-secondary/50">
      <div className="flex items-center gap-2">
        <TamaraIcon />
        <div>
          <h4 className="font-medium">Tamara - Buy Now, Pay Later</h4>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Split your payment or pay later with no fees' 
              : 'قسّم دفعتك أو ادفع لاحقًا بدون رسوم'}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <RadioGroup 
          value={formData.installmentOption} 
          onValueChange={handleInstallmentOptionChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md bg-background">
            <RadioGroupItem value="3_installments" id="3_installments" />
            <Label htmlFor="3_installments" className="flex-1 cursor-pointer">
              <div className="font-medium">
                {language === 'en' ? '3 interest-free installments' : '3 أقساط بدون فوائد'}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? `${Math.round(parseInt(productPrice) / 3)} SAR today & 2 monthly payments` 
                  : `${Math.round(parseInt(productPrice) / 3)} ريال اليوم و 2 دفعات شهرية`}
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border p-3 rounded-md bg-background">
            <RadioGroupItem value="pay_in_30" id="pay_in_30" />
            <Label htmlFor="pay_in_30" className="flex-1 cursor-pointer">
              <div className="font-medium">
                {language === 'en' ? 'Pay in 30 days' : 'ادفع خلال 30 يوم'}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? `Pay ${productPrice} after 30 days` 
                  : `ادفع ${productPrice} بعد 30 يوم`}
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        <Alert className="bg-primary/5 border-primary/20">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs">
            {language === 'en' 
              ? 'Quick approval process. Verify with Saudi phone number and ID.' 
              : 'عملية موافقة سريعة. تحقق برقم الهاتف السعودي والهوية.'}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {language === 'en' ? 'Join Jam3a' : 'انضم للجمعة'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Complete the steps below to join this Jam3a group purchase' 
              : 'أكمل الخطوات أدناه للانضمام إلى مجموعة الشراء هذه'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product details sidebar */}
          <div className="md:col-span-1 order-2 md:order-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border overflow-hidden">
                <div className="aspect-square relative">
                  <img 
                    src={getProductImage()} 
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{productName}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-primary">{productPrice}</span>
                    <span className="text-sm line-through text-muted-foreground">
                      {parseInt(productPrice) * 1.2} SAR
                    </span>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      {productDiscount} OFF
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {language === 'en' 
                      ? 'Group purchase ends in 2 days' 
                      : 'ينتهي الشراء الجماعي خلال يومين'}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {language === 'en' ? 'Group progress' : 'تقدم المجموعة'}
                      </span>
                      <span className="font-medium">
                        {language === 'en' ? '7 of 10 joined' : '7 من 10 انضموا'}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[70%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border p-4 space-y-3">
                <h3 className="font-medium">
                  {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                </h3>
                <div className="flex justify-between text-sm">
                  <span>{language === 'en' ? 'Product Price' : 'سعر المنتج'}</span>
                  <span>{productPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{language === 'en' ? 'Shipping' : 'الشحن'}</span>
                  <span>{language === 'en' ? 'Free' : 'مجاني'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>{language === 'en' ? 'Total' : 'المجموع'}</span>
                  <span>{productPrice}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Join form */}
          <div className="md:col-span-2 order-1 md:order-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">
                  {language === 'en' ? 'Product Details' : 'تفاصيل المنتج'}
                </TabsTrigger>
                <TabsTrigger value="info">
                  {language === 'en' ? 'Your Info' : 'معلوماتك'}
                </TabsTrigger>
                <TabsTrigger value="payment">
                  {language === 'en' ? 'Payment' : 'الدفع'}
                </TabsTrigger>
              </TabsList>
              
              {/* Product Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    {language === 'en' ? 'Product Details' : 'تفاصيل المنتج'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{productName}</h3>
                      <p className="text-muted-foreground">
                        {productName.includes('iPhone') 
                          ? 'Experience the latest innovation with revolutionary camera and A18 Pro chip'
                          : productName.includes('Galaxy S') 
                            ? 'Unleash creativity with AI-powered tools and 200MP camera system'
                            : 'Multitask like never before with a stunning foldable display'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-1">
                          {language === 'en' ? 'Group Pricing' : 'تسعير المجموعة'}
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>2+ {language === 'en' ? 'people' : 'أشخاص'}</span>
                            <span className="font-medium">{parseInt(productPrice) * 1.1} SAR</span>
                          </li>
                          <li className="flex justify-between">
                            <span>5+ {language === 'en' ? 'people' : 'أشخاص'}</span>
                            <span className="font-medium">{parseInt(productPrice) * 1.05} SAR</span>
                          </li>
                          <li className="flex justify-between">
                            <span>10+ {language === 'en' ? 'people' : 'أشخاص'}</span>
                            <span className="font-medium">{productPrice}</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-1">
                          {language === 'en' ? 'Jam3a Status' : 'حالة الجمعة'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Current Price' : 'السعر الحالي'}</span>
                            <span className="font-medium">{productPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Members' : 'الأعضاء'}</span>
                            <span className="font-medium">7 / 10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Time Left' : 'الوقت المتبقي'}</span>
                            <span className="font-medium">2 {language === 'en' ? 'days' : 'أيام'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        {language === 'en' ? 'Product Specifications' : 'مواصفات المنتج'}
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {productName.includes('iPhone') ? (
                          <>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Display' : 'الشاشة'}</span>
                              <span>6.7" Super Retina XDR</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Processor' : 'المعالج'}</span>
                              <span>A18 Pro chip</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Camera' : 'الكاميرا'}</span>
                              <span>48MP Triple camera</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Storage' : 'التخزين'}</span>
                              <span>256GB</span>
                            </li>
                          </>
                        ) : productName.includes('Galaxy S') ? (
                          <>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Display' : 'الشاشة'}</span>
                              <span>6.8" Dynamic AMOLED 2X</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Processor' : 'المعالج'}</span>
                              <span>Snapdragon 8 Gen 3</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Camera' : 'الكاميرا'}</span>
                              <span>200MP Quad camera</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Storage' : 'التخزين'}</span>
                              <span>512GB</span>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Display' : 'الشاشة'}</span>
                              <span>7.6" Dynamic AMOLED 2X</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Processor' : 'المعالج'}</span>
                              <span>Snapdragon 8 Gen 3</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Camera' : 'الكاميرا'}</span>
                              <span>50MP Triple camera</span>
                            </li>
                            <li className="flex justify-between">
                              <span>{language === 'en' ? 'Storage' : 'التخزين'}</span>
                              <span>512GB</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <Button onClick={handleNext} className="w-full">
                    {language === 'en' ? 'Next: Your Information' : 'التالي: معلوماتك'}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Your Info Tab */}
              <TabsContent value="info" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    {language === 'en' ? 'Your Information' : 'معلوماتك'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {language === 'en' ? 'Full Name' : 'الاسم الكامل'} *
                        </Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          placeholder={language === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'} 
                          className={formErrors.name ? 'border-destructive' : ''}
                        />
                        {formErrors.name && (
                          <p className="text-destructive text-sm">
                            {language === 'en' ? 'Name is required' : 'الاسم مطلوب'}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'} *
                        </Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'} 
                          className={formErrors.email ? 'border-destructive' : ''}
                        />
                        {formErrors.email && (
                          <p className="text-destructive text-sm">
                            {language === 'en' ? 'Valid email is required' : 'البريد الإلكتروني الصحيح مطلوب'}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {language === 'en' ? 'Phone Number' : 'رقم الهاتف'} *
                        </Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder={language === 'en' ? 'Enter your phone number' : 'أدخل رقم هاتفك'} 
                          className={formErrors.phone ? 'border-destructive' : ''}
                        />
                        {formErrors.phone && (
                          <p className="text-destructive text-sm">
                            {language === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب'}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">
                          {language === 'en' ? 'Delivery Address' : 'عنوان التوصيل'} *
                        </Label>
                        <Textarea 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                          placeholder={language === 'en' ? 'Enter your full address' : 'أدخل عنوانك الكامل'} 
                          className={formErrors.address ? 'border-destructive' : ''}
                          rows={3}
                        />
                        {formErrors.address && (
                          <p className="text-destructive text-sm">
                            {language === 'en' ? 'Address is required' : 'العنوان مطلوب'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleNext} className="w-full">
                    {language === 'en' ? 'Next: Payment' : 'التالي: الدفع'}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Payment Tab */}
              <TabsContent value="payment" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    {language === 'en' ? 'Payment Method' : 'طريقة الدفع'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.paymentMethod === 'credit-card' 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handlePaymentMethodChange('credit-card')}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-primary" />
                          <div>
                            <h3 className="font-medium">
                              {language === 'en' ? 'Credit / Debit Card' : 'بطاقة ائتمان / خصم'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Pay with Visa, Mastercard, or mada' : 'ادفع بواسطة فيزا، ماستركارد، أو مدى'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.paymentMethod === 'apple-pay' 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handlePaymentMethodChange('apple-pay')}
                      >
                        <div className="flex items-center gap-3">
                          <Apple className="h-6 w-6 text-primary" />
                          <div>
                            <h3 className="font-medium">Apple Pay</h3>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Quick and secure payment' : 'دفع سريع وآمن'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.paymentMethod === 'tabby' 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handlePaymentMethodChange('tabby')}
                      >
                        <div className="flex items-center gap-3">
                          <TabbyIcon />
                          <div>
                            <h3 className="font-medium">Tabby</h3>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Buy now, pay later - 0% interest' : 'اشترِ الآن، ادفع لاحقًا - 0% فوائد'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.paymentMethod === 'tamara' 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handlePaymentMethodChange('tamara')}
                      >
                        <div className="flex items-center gap-3">
                          <TamaraIcon />
                          <div>
                            <h3 className="font-medium">Tamara</h3>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Split into 3 payments or pay in 30 days' : 'قسّم على 3 دفعات أو ادفع خلال 30 يوم'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Credit Card Details */}
                    {formData.paymentMethod === 'credit-card' && (
                      <div className="space-y-4 mt-4 p-4 border rounded-lg bg-secondary/50">
                        <h3 className="font-medium">
                          {language === 'en' ? 'Card Details' : 'تفاصيل البطاقة'}
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">
                              {language === 'en' ? 'Card Number' : 'رقم البطاقة'}
                            </Label>
                            <div className="relative">
                              <Input 
                                id="cardNumber" 
                                name="cardNumber" 
                                value={formData.cardNumber} 
                                onChange={handleInputChange} 
                                placeholder="1234 5678 9012 3456" 
                                className={`pl-10 ${formErrors.cardNumber ? 'border-destructive' : ''}`}
                                maxLength={19}
                              />
                              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                            {formErrors.cardNumber && (
                              <p className="text-destructive text-sm">
                                {language === 'en' ? 'Valid card number is required' : 'رقم بطاقة صالح مطلوب'}
                              </p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry">
                                {language === 'en' ? 'Expiry Date' : 'تاريخ الانتهاء'}
                              </Label>
                              <div className="relative">
                                <Input 
                                  id="cardExpiry" 
                                  name="cardExpiry" 
                                  value={formData.cardExpiry} 
                                  onChange={handleInputChange} 
                                  placeholder="MM/YY" 
                                  className={`pl-10 ${formErrors.cardExpiry ? 'border-destructive' : ''}`}
                                  maxLength={5}
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              {formErrors.cardExpiry && (
                                <p className="text-destructive text-sm">
                                  {language === 'en' ? 'Valid expiry date is required' : 'تاريخ انتهاء صالح مطلوب'}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="cardCvv">
                                {language === 'en' ? 'CVV' : 'رمز الأمان'}
                              </Label>
                              <div className="relative">
                                <Input 
                                  id="cardCvv" 
                                  name="cardCvv" 
                                  value={formData.cardCvv} 
                                  onChange={handleInputChange} 
                                  placeholder="123" 
                                  className={`pl-10 ${formErrors.cardCvv ? 'border-destructive' : ''}`}
                                  maxLength={3}
                                />
                                <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              {formErrors.cardCvv && (
                                <p className="text-destructive text-sm">
                                  {language === 'en' ? 'Valid CVV is required' : 'رمز أمان صالح مطلوب'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Apple Pay Details */}
                    {formData.paymentMethod === 'apple-pay' && (
                      <div className="space-y-4 mt-4 p-4 border rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2">
                          <Apple className="h-6 w-6" />
                          <div>
                            <h4 className="font-medium">Apple Pay</h4>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' 
                                ? 'You will be redirected to Apple Pay to complete your payment' 
                                : 'سيتم توجيهك إلى Apple Pay لإكمال عملية الدفع'}
                            </p>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full bg-black text-white hover:bg-black/90 hover:text-white">
                          <Apple className="h-5 w-5 mr-2" />
                          {language === 'en' ? 'Pay with Apple Pay' : 'الدفع باستخدام Apple Pay'}
                        </Button>
                      </div>
                    )}
                    
                    {/* Tabby Details */}
                    {formData.paymentMethod === 'tabby' && renderTabbyDetails()}
                    
                    {/* Tamara Details */}
                    {formData.paymentMethod === 'tamara' && renderTamaraDetails()}
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox 
                        id="terms" 
                        checked={formData.termsAccepted} 
                        onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked)}
                        className={formErrors.termsAccepted ? 'border-destructive' : ''}
                      />
                      <Label 
                        htmlFor="terms" 
                        className={`text-sm ${formErrors.termsAccepted ? 'text-destructive' : ''}`}
                      >
                        {language === 'en' 
                          ? 'I agree to the Terms of Service and Privacy Policy' 
                          : 'أوافق على شروط الخدمة وسياسة الخصوصية'}
                      </Label>
                    </div>
                  </div>
                  
                  <Button onClick={handleSubmit} className="w-full">
                    {language === 'en' 
                      ? `Complete Purchase - ${productPrice}` 
                      : `إتمام الشراء - ${productPrice}`}
                  </Button>
                </div>
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
