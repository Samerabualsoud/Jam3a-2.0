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
import { CreditCard, Smartphone, Apple, Clock, Calendar, CreditCardIcon, Wallet, BanknoteIcon, CalendarClock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Payment method icons
const TabbyIcon = () => (
  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white font-bold text-xs">T</div>
);

const TamaraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#000000"/>
    <path d="M7.5 9.75H16.5V14.25H7.5V9.75Z" fill="white"/>
  </svg>
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleInstallmentOptionChange = (option: string) => {
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
  const handleTabChange = (value: string) => {
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
  
  const handleSubmit = (e: React.FormEvent) => {
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
      '4': 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    };
    
    return images[productId] || 'https://placehold.co/400x400/teal/white?text=Product+Image';
  };

  // Calculate installment amounts for Tabby/Tamara
  const calculateInstallments = () => {
    const price = parseInt(productPrice.replace(/[^0-9]/g, ''));
    const installments = {
      '4_installments': Math.round(price / 4),
      '2_installments': Math.round(price / 2),
      'pay_later': price
    };
    return installments;
  };
  
  return (
    <div className={`flex min-h-screen flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center gradient-text">
            {language === 'en' ? 'Join This Jam3a' : 'انضم إلى هذه الجمعة'}
          </h1>
          
          <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
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
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={getProductImage()} 
                        alt={productName}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/teal/white?text=Product+Image';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold mb-4">{productName}</h2>
                    
                    <div className="mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-primary mr-2">
                          {productPrice.replace('SAR', '')} SAR
                        </span>
                        {productDiscount && (
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {productDiscount} OFF
                          </span>
                        )}
                      </div>
                      {productDiscount && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {language === 'en' ? 'Original price:' : 'السعر الأصلي:'} 
                          <span className="line-through ml-1">
                            {Math.round(parseInt(productPrice.replace(/[^0-9]/g, '')) / (1 - parseInt(productDiscount) / 100))} SAR
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">
                          {language === 'en' ? 'How Jam3a Works:' : 'كيف تعمل جمعة:'}
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                            <span>
                              {language === 'en' 
                                ? 'Join this group buying deal by completing your purchase' 
                                : 'انضم إلى صفقة الشراء الجماعي هذه من خلال إكمال عملية الشراء'}
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                            <span>
                              {language === 'en' 
                                ? 'Share with friends to help the group reach its target size' 
                                : 'شارك مع الأصدقاء للمساعدة في وصول المجموعة إلى الحجم المستهدف'}
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                            <span>
                              {language === 'en' 
                                ? 'Once the group is complete, your payment will be processed' 
                                : 'بمجرد اكتمال المجموعة، ستتم معالجة الدفع الخاص بك'}
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                            <span>
                              {language === 'en' 
                                ? 'Your product will be delivered to your address' 
                                : 'سيتم توصيل المنتج الخاص بك إلى عنوانك'}
                            </span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-secondary p-4 rounded-lg">
                        <h3 className="font-medium mb-2 text-secondary-foreground">
                          {language === 'en' ? 'Current Group Status:' : 'حالة المجموعة الحالية:'}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{language === 'en' ? 'Members joined:' : 'الأعضاء المنضمين:'}</span>
                            <span className="font-medium">3/5</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{language === 'en' ? 'Time remaining:' : 'الوقت المتبقي:'}</span>
                            <span className="font-medium">1 day 6 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNext} className="jam3a-button-primary">
                    {language === 'en' ? 'Next' : 'التالي'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="jam3a-label">
                        {language === 'en' ? 'Full Name' : 'الاسم الكامل'} *
                      </Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        className={`jam3a-input ${formErrors.name ? 'border-destructive' : ''}`}
                        placeholder={language === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'}
                      />
                      {formErrors.name && (
                        <p className="text-destructive text-sm mt-1">
                          {language === 'en' ? 'Name is required' : 'الاسم مطلوب'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="jam3a-label">
                        {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'} *
                      </Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={`jam3a-input ${formErrors.email ? 'border-destructive' : ''}`}
                        placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                      />
                      {formErrors.email && (
                        <p className="text-destructive text-sm mt-1">
                          {language === 'en' ? 'Valid email is required' : 'البريد الإلكتروني الصحيح مطلوب'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="jam3a-label">
                        {language === 'en' ? 'Phone Number' : 'رقم الهاتف'} *
                      </Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className={`jam3a-input ${formErrors.phone ? 'border-destructive' : ''}`}
                        placeholder={language === 'en' ? 'Enter your phone number' : 'أدخل رقم هاتفك'}
                      />
                      {formErrors.phone && (
                        <p className="text-destructive text-sm mt-1">
                          {language === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="address" className="jam3a-label">
                        {language === 'en' ? 'Delivery Address' : 'عنوان التوصيل'} *
                      </Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        className={`jam3a-input ${formErrors.address ? 'border-destructive' : ''}`}
                        placeholder={language === 'en' ? 'Enter your address' : 'أدخل عنوانك'}
                      />
                      {formErrors.address && (
                        <p className="text-destructive text-sm mt-1">
                          {language === 'en' ? 'Address is required' : 'العنوان مطلوب'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg mt-6">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Important Information:' : 'معلومات مهمة:'}
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        {language === 'en' 
                          ? 'Your payment will only be processed once the group is complete.' 
                          : 'ستتم معالجة الدفع الخاص بك فقط عند اكتمال المجموعة.'}
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'If the group does not reach its target size within the time limit, you will not be charged.' 
                          : 'إذا لم تصل المجموعة إلى الحجم المستهدف خلال المهلة الزمنية، فلن يتم تحصيل أي رسوم منك.'}
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'You will receive email updates about the status of your Jam3a group.' 
                          : 'ستتلقى تحديثات عبر البريد الإلكتروني حول حالة مجموعة جمعة الخاصة بك.'}
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => handleTabChange('details')}>
                    {language === 'en' ? 'Back' : 'رجوع'}
                  </Button>
                  <Button onClick={handleNext} className="jam3a-button-primary">
                    {language === 'en' ? 'Next' : 'التالي'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {language === 'en' ? 'Select Payment Method' : 'اختر طريقة الدفع'}
                    </h3>
                    
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={handlePaymentMethodChange}
                      className="space-y-3"
                    >
                      <div className={`payment-option ${formData.paymentMethod === 'credit-card' ? 'payment-option-active' : ''}`}>
                        <RadioGroupItem value="credit-card" id="credit-card" className="sr-only" />
                        <Label htmlFor="credit-card" className="flex items-center cursor-pointer w-full">
                          <CreditCard className="payment-option-icon" />
                          <div>
                            <div className="font-medium">
                              {language === 'en' ? 'Credit / Debit Card' : 'بطاقة ائتمان / خصم'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Pay the full amount now' : 'ادفع المبلغ كاملاً الآن'}
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className={`payment-option ${formData.paymentMethod === 'apple-pay' ? 'payment-option-active' : ''}`}>
                        <RadioGroupItem value="apple-pay" id="apple-pay" className="sr-only" />
                        <Label htmlFor="apple-pay" className="flex items-center cursor-pointer w-full">
                          <Apple className="payment-option-icon" />
                          <div>
                            <div className="font-medium">Apple Pay</div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Quick and secure payment' : 'دفع سريع وآمن'}
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className={`payment-option ${formData.paymentMethod === 'tabby' ? 'payment-option-active' : ''}`}>
                        <RadioGroupItem value="tabby" id="tabby" className="sr-only" />
                        <Label htmlFor="tabby" className="flex items-center cursor-pointer w-full">
                          <TabbyIcon />
                          <div className="ml-3">
                            <div className="font-medium">Tabby</div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Split into 4 interest-free payments' : 'قسّم على 4 دفعات بدون فوائد'}
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className={`payment-option ${formData.paymentMethod === 'tamara' ? 'payment-option-active' : ''}`}>
                        <RadioGroupItem value="tamara" id="tamara" className="sr-only" />
                        <Label htmlFor="tamara" className="flex items-center cursor-pointer w-full">
                          <TamaraIcon />
                          <div className="ml-3">
                            <div className="font-medium">Tamara</div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'en' ? 'Buy now, pay later' : 'اشترِ الآن، وادفع لاحقاً'}
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Credit Card Form */}
                  {formData.paymentMethod === 'credit-card' && (
                    <div className="space-y-4 border rounded-lg p-4">
                      <h4 className="font-medium">
                        {language === 'en' ? 'Card Details' : 'تفاصيل البطاقة'}
                      </h4>
                      
                      <div>
                        <Label htmlFor="cardNumber" className="jam3a-label">
                          {language === 'en' ? 'Card Number' : 'رقم البطاقة'}
                        </Label>
                        <div className="relative">
                          <Input 
                            id="cardNumber" 
                            name="cardNumber" 
                            value={formData.cardNumber} 
                            onChange={handleInputChange} 
                            className={`jam3a-input pl-10 ${formErrors.cardNumber ? 'border-destructive' : ''}`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        {formErrors.cardNumber && (
                          <p className="text-destructive text-sm mt-1">
                            {language === 'en' ? 'Valid card number is required' : 'رقم بطاقة صالح مطلوب'}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry" className="jam3a-label">
                            {language === 'en' ? 'Expiry Date' : 'تاريخ الانتهاء'}
                          </Label>
                          <div className="relative">
                            <Input 
                              id="cardExpiry" 
                              name="cardExpiry" 
                              value={formData.cardExpiry} 
                              onChange={handleInputChange} 
                              className={`jam3a-input pl-10 ${formErrors.cardExpiry ? 'border-destructive' : ''}`}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          {formErrors.cardExpiry && (
                            <p className="text-destructive text-sm mt-1">
                              {language === 'en' ? 'Valid expiry date is required' : 'تاريخ انتهاء صالح مطلوب'}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="cardCvv" className="jam3a-label">
                            {language === 'en' ? 'CVV' : 'رمز التحقق'}
                          </Label>
                          <div className="relative">
                            <Input 
                              id="cardCvv" 
                              name="cardCvv" 
                              value={formData.cardCvv} 
                              onChange={handleInputChange} 
                              className={`jam3a-input pl-10 ${formErrors.cardCvv ? 'border-destructive' : ''}`}
                              placeholder="123"
                              maxLength={3}
                              type="password"
                            />
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          {formErrors.cardCvv && (
                            <p className="text-destructive text-sm mt-1">
                              {language === 'en' ? 'Valid CVV is required' : 'رمز تحقق صالح مطلوب'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tabby Payment Options */}
                  {formData.paymentMethod === 'tabby' && (
                    <div className="space-y-4 border rounded-lg p-4">
                      <h4 className="font-medium flex items-center">
                        <TabbyIcon />
                        <span className="ml-2">
                          {language === 'en' ? 'Tabby Payment Options' : 'خيارات الدفع من تابي'}
                        </span>
                      </h4>
                      
                      <RadioGroup 
                        value={formData.installmentOption} 
                        onValueChange={handleInstallmentOptionChange}
                        className="space-y-3"
                      >
                        <div className={`payment-option ${formData.installmentOption === '4_installments' ? 'payment-option-active' : ''}`}>
                          <RadioGroupItem value="4_installments" id="4_installments" className="sr-only" />
                          <Label htmlFor="4_installments" className="flex items-center cursor-pointer w-full">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                              <CalendarClock className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {language === 'en' ? 'Split in 4' : 'قسّم على 4'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {language === 'en' 
                                  ? `4 interest-free payments of ${calculateInstallments()['4_installments']} SAR` 
                                  : `4 دفعات بدون فوائد بقيمة ${calculateInstallments()['4_installments']} ريال`}
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        <div className={`payment-option ${formData.installmentOption === '2_installments' ? 'payment-option-active' : ''}`}>
                          <RadioGroupItem value="2_installments" id="2_installments" className="sr-only" />
                          <Label htmlFor="2_installments" className="flex items-center cursor-pointer w-full">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                              <CalendarClock className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {language === 'en' ? 'Split in 2' : 'قسّم على 2'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {language === 'en' 
                                  ? `2 interest-free payments of ${calculateInstallments()['2_installments']} SAR` 
                                  : `دفعتين بدون فوائد بقيمة ${calculateInstallments()['2_installments']} ريال`}
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        <div className={`payment-option ${formData.installmentOption === 'pay_later' ? 'payment-option-active' : ''}`}>
                          <RadioGroupItem value="pay_later" id="pay_later" className="sr-only" />
                          <Label htmlFor="pay_later" className="flex items-center cursor-pointer w-full">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {language === 'en' ? 'Pay Later' : 'ادفع لاحقاً'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {language === 'en' 
                                  ? 'Pay the full amount after 14 days' 
                                  : 'ادفع المبلغ كاملاً بعد 14 يوماً'}
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                      
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <p>
                          {language === 'en' 
                            ? 'Tabby allows you to split your payment with no additional fees or interest.' 
                            : 'يتيح لك تابي تقسيم دفعتك بدون أي رسوم إضافية أو فوائد.'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Tamara Payment Options */}
                  {formData.paymentMethod === 'tamara' && (
                    <div className="space-y-4 border rounded-lg p-4">
                      <h4 className="font-medium flex items-center">
                        <TamaraIcon />
                        <span className="ml-2">
                          {language === 'en' ? 'Tamara Payment Options' : 'خيارات الدفع من تمارا'}
                        </span>
                      </h4>
                      
                      <RadioGroup 
                        value={formData.installmentOption} 
                        onValueChange={handleInstallmentOptionChange}
                        className="space-y-3"
                      >
                        <div className={`payment-option ${formData.installmentOption === '4_installments' ? 'payment-option-active' : ''}`}>
                          <RadioGroupItem value="4_installments" id="tamara_4_installments" className="sr-only" />
                          <Label htmlFor="tamara_4_installments" className="flex items-center cursor-pointer w-full">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                              <BanknoteIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {language === 'en' ? 'Pay in 4' : 'ادفع على 4'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {language === 'en' 
                                  ? `4 interest-free payments of ${calculateInstallments()['4_installments']} SAR every 2 weeks` 
                                  : `4 دفعات بدون فوائد بقيمة ${calculateInstallments()['4_installments']} ريال كل أسبوعين`}
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        <div className={`payment-option ${formData.installmentOption === 'pay_later' ? 'payment-option-active' : ''}`}>
                          <RadioGroupItem value="pay_later" id="tamara_pay_later" className="sr-only" />
                          <Label htmlFor="tamara_pay_later" className="flex items-center cursor-pointer w-full">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                              <Wallet className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {language === 'en' ? 'Pay in 30 days' : 'ادفع خلال 30 يوم'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {language === 'en' 
                                  ? 'Get your items first and pay later with no fees' 
                                  : 'احصل على منتجاتك أولاً وادفع لاحقاً بدون رسوم'}
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                      
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <p>
                          {language === 'en' 
                            ? 'Tamara lets you buy what you love today and pay later with no fees or interest.' 
                            : 'تمارا تتيح لك شراء ما تحبه اليوم والدفع لاحقاً بدون رسوم أو فوائد.'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2 rtl:space-x-reverse">
                      <Checkbox 
                        id="termsAccepted" 
                        checked={formData.termsAccepted} 
                        onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked as boolean)} 
                        className={formErrors.termsAccepted ? 'border-destructive' : ''}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor="termsAccepted" 
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                            formErrors.termsAccepted ? 'text-destructive' : ''
                          }`}
                        >
                          {language === 'en' 
                            ? 'I agree to the Terms and Conditions and Privacy Policy' 
                            : 'أوافق على الشروط والأحكام وسياسة الخصوصية'}
                        </Label>
                      </div>
                    </div>
                    
                    {formErrors.termsAccepted && (
                      <p className="text-destructive text-sm">
                        {language === 'en' 
                          ? 'You must accept the terms and conditions' 
                          : 'يجب عليك قبول الشروط والأحكام'}
                      </p>
                    )}
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">
                        {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>{language === 'en' ? 'Product:' : 'المنتج:'}</span>
                          <span>{productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'en' ? 'Price:' : 'السعر:'}</span>
                          <span>{productPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'en' ? 'Discount:' : 'الخصم:'}</span>
                          <span>{productDiscount}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                          <span>{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                          <span>{productPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => handleTabChange('info')}>
                    {language === 'en' ? 'Back' : 'رجوع'}
                  </Button>
                  <Button onClick={handleSubmit} className="jam3a-button-primary">
                    {language === 'en' ? 'Complete Purchase' : 'إتمام الشراء'}
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
