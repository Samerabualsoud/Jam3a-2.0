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
import { CreditCard, Smartphone, Apple, Clock, Calendar, CreditCardIcon, Wallet, BanknoteIcon, CalendarClock, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import ScrollToTop from '@/components/ScrollToTop';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import ProductSelector from '@/components/ProductSelector';
import { fetchDealById, fetchDealProducts, joinDeal } from '@/services/DealService';

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
  const [activeTab, setActiveTab] = useState('product');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get deal ID from URL params
  const dealId = searchParams.get('dealId') || '';
  
  // Deal and products state
  const [deal, setDeal] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
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
    cardCvv: '',
    savePaymentInfo: false
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
    cardCvv: false,
    product: false
  });

  // Content based on language
  const content = {
    en: {
      title: "Join Jam3a Deal",
      productSelection: "Select Product",
      personalInfo: "Personal Information",
      payment: "Payment",
      confirmation: "Confirmation",
      categoryTitle: "Category",
      selectProduct: "Select a product from this category",
      productDetails: "Product Details",
      regularPrice: "Regular Price",
      jam3aPrice: "Jam3a Price",
      discount: "Discount",
      participants: "Participants",
      timeLeft: "Time Left",
      continue: "Continue",
      back: "Back",
      personalInfoTitle: "Enter Your Information",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      addressLabel: "Delivery Address",
      termsLabel: "I agree to the terms and conditions",
      paymentTitle: "Payment Method",
      creditCard: "Credit/Debit Card",
      bankTransfer: "Bank Transfer",
      cashOnDelivery: "Cash on Delivery",
      tabby: "Tabby (Pay in 4)",
      tamara: "Tamara (Pay Later)",
      cardNumberLabel: "Card Number",
      cardExpiryLabel: "Expiry Date (MM/YY)",
      cardCvvLabel: "CVV",
      saveCardLabel: "Save card for future purchases",
      payNow: "Pay Now",
      processingPayment: "Processing Payment...",
      paymentSuccessTitle: "Payment Successful!",
      paymentSuccessMessage: "Your Jam3a deal purchase has been confirmed. You will receive a confirmation email shortly.",
      viewOrder: "View Order Details",
      continueShopping: "Continue Shopping",
      errorTitle: "Error",
      requiredField: "This field is required",
      invalidEmail: "Please enter a valid email address",
      invalidPhone: "Please enter a valid phone number",
      invalidCard: "Please enter a valid card number",
      invalidExpiry: "Please enter a valid expiry date (MM/YY)",
      invalidCvv: "Please enter a valid CVV",
      termsRequired: "You must agree to the terms and conditions",
      productRequired: "Please select a product to continue",
      currency: "SAR"
    },
    ar: {
      title: "انضم إلى صفقة جمعة",
      productSelection: "اختر المنتج",
      personalInfo: "المعلومات الشخصية",
      payment: "الدفع",
      confirmation: "التأكيد",
      categoryTitle: "الفئة",
      selectProduct: "اختر منتجًا من هذه الفئة",
      productDetails: "تفاصيل المنتج",
      regularPrice: "السعر العادي",
      jam3aPrice: "سعر جمعة",
      discount: "الخصم",
      participants: "المشاركون",
      timeLeft: "الوقت المتبقي",
      continue: "متابعة",
      back: "رجوع",
      personalInfoTitle: "أدخل معلوماتك",
      nameLabel: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      addressLabel: "عنوان التوصيل",
      termsLabel: "أوافق على الشروط والأحكام",
      paymentTitle: "طريقة الدفع",
      creditCard: "بطاقة ائتمان/خصم",
      bankTransfer: "تحويل بنكي",
      cashOnDelivery: "الدفع عند الاستلام",
      tabby: "تابي (ادفع على 4)",
      tamara: "تمارا (ادفع لاحقًا)",
      cardNumberLabel: "رقم البطاقة",
      cardExpiryLabel: "تاريخ الانتهاء (MM/YY)",
      cardCvvLabel: "رمز التحقق",
      saveCardLabel: "حفظ البطاقة للمشتريات المستقبلية",
      payNow: "ادفع الآن",
      processingPayment: "جاري معالجة الدفع...",
      paymentSuccessTitle: "تم الدفع بنجاح!",
      paymentSuccessMessage: "تم تأكيد شراء صفقة جمعة الخاصة بك. ستتلقى رسالة تأكيد بالبريد الإلكتروني قريبًا.",
      viewOrder: "عرض تفاصيل الطلب",
      continueShopping: "متابعة التسوق",
      errorTitle: "خطأ",
      requiredField: "هذا الحقل مطلوب",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
      invalidPhone: "يرجى إدخال رقم هاتف صحيح",
      invalidCard: "يرجى إدخال رقم بطاقة صحيح",
      invalidExpiry: "يرجى إدخال تاريخ انتهاء صحيح (MM/YY)",
      invalidCvv: "يرجى إدخال رمز تحقق صحيح",
      termsRequired: "يجب الموافقة على الشروط والأحكام",
      productRequired: "يرجى اختيار منتج للمتابعة",
      currency: "ريال"
    }
  };

  const currentContent = content[language];
  const isRtl = language === 'ar';

  // Fetch deal and products data
  useEffect(() => {
    const loadDealData = async () => {
      if (!dealId) {
        setError('No deal ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch deal details
        const dealData = await fetchDealById(dealId);
        setDeal(dealData);
        
        // Fetch products in this deal's category
        const productsData = await fetchDealProducts(dealId);
        setCategoryProducts(productsData.data);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading deal data:', err);
        setError(err.message || 'Failed to load deal data');
        setIsLoading(false);
      }
    };

    loadDealData();
  }, [dealId]);

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormErrors({
      ...formErrors,
      product: false
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setFormData({
        ...formData,
        [name]: formattedValue
      });
      return;
    }
    
    // Format expiry date with slash
    if (name === 'cardExpiry') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      
      setFormData({
        ...formData,
        [name]: formattedValue
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: false
      });
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone number format (Saudi format)
  const validatePhoneNumber = (phone) => {
    // Saudi phone formats: 05xxxxxxxx, 5xxxxxxxx, +9665xxxxxxxx
    const re = /^(05|5|\+9665)[0-9]{8}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  // Validate credit card using Luhn algorithm
  const validateCreditCard = (cardNumber) => {
    if (!cardNumber) return false;
    
    // Remove spaces and non-digit characters
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) return false;
    
    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  // Validate expiry date format (MM/YY)
  const validateExpiry = (expiry) => {
    if (!expiry) return false;
    
    const parts = expiry.split('/');
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0]);
    const year = parseInt('20' + parts[1]);
    
    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };

  // Validate CVV (3-4 digits)
  const validateCVV = (cvv) => {
    if (!cvv) return false;
    const re = /^[0-9]{3,4}$/;
    return re.test(cvv);
  };

  // Validate form based on current tab
  const validateForm = () => {
    let isValid = true;
    let newErrors = { ...formErrors };
    
    if (activeTab === 'product') {
      if (!selectedProduct) {
        newErrors.product = true;
        isValid = false;
      }
    }
    
    else if (activeTab === 'details') {
      if (!formData.name) {
        newErrors.name = 'required';
        isValid = false;
      }
      
      if (!formData.email) {
        newErrors.email = 'required';
        isValid = false;
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'invalid';
        isValid = false;
      }
      
      if (!formData.phone) {
        newErrors.phone = 'required';
        isValid = false;
      } else if (!validatePhoneNumber(formData.phone)) {
        newErrors.phone = 'invalid';
        isValid = false;
      }
      
      if (!formData.address) {
        newErrors.address = 'required';
        isValid = false;
      }
    }
    
    else if (activeTab === 'payment') {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = true;
        isValid = false;
      }
      
      if (formData.paymentMethod === 'credit-card') {
        if (!formData.cardNumber) {
          newErrors.cardNumber = 'required';
          isValid = false;
        } else if (!validateCreditCard(formData.cardNumber)) {
          newErrors.cardNumber = 'invalid';
          isValid = false;
        }
        
        if (!formData.cardExpiry) {
          newErrors.cardExpiry = 'required';
          isValid = false;
        } else if (!validateExpiry(formData.cardExpiry)) {
          newErrors.cardExpiry = 'invalid';
          isValid = false;
        }
        
        if (!formData.cardCvv) {
          newErrors.cardCvv = 'required';
          isValid = false;
        } else if (!validateCVV(formData.cardCvv)) {
          newErrors.cardCvv = 'invalid';
          isValid = false;
        }
      }
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  // Handle tab navigation
  const handleContinue = () => {
    if (!validateForm()) {
      toast({
        title: currentContent.errorTitle,
        description: formErrors.product ? currentContent.productRequired : currentContent.requiredField,
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === 'product') {
      setActiveTab('details');
    } else if (activeTab === 'details') {
      setActiveTab('payment');
    } else if (activeTab === 'payment') {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeTab === 'details') {
      setActiveTab('product');
    } else if (activeTab === 'payment') {
      setActiveTab('details');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Join the deal with selected product
      const response = await joinDeal(dealId, {
        productId: selectedProduct._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod
      });
      
      // Simulate payment processing
      setTimeout(() => {
        setPaymentSuccess(true);
        setIsProcessing(false);
        setActiveTab('confirmation');
      }, 2000);
      
    } catch (error) {
      console.error('Error joining deal:', error);
      toast({
        title: currentContent.errorTitle,
        description: error.message || 'Failed to process payment',
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-jam3a-purple" />
            <h2 className="text-2xl font-semibold">Loading...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow p-4">
          <div className="max-w-3xl mx-auto mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{currentContent.errorTitle}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button onClick={() => navigate('/')} className="bg-jam3a-purple hover:bg-jam3a-deep-purple">
                {currentContent.continueShopping}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If no deal found
  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow p-4">
          <div className="max-w-3xl mx-auto mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{currentContent.errorTitle}</AlertTitle>
              <AlertDescription>Deal not found</AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button onClick={() => navigate('/')} className="bg-jam3a-purple hover:bg-jam3a-deep-purple">
                {currentContent.continueShopping}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <ScrollToTop />
      <Header />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">{currentContent.title}</h1>
          
          {/* Deal information */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{deal.title}</h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-muted-foreground">{currentContent.categoryTitle}: {deal.category.name}</p>
                <p className="text-muted-foreground">{currentContent.discount}: {deal.discount}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">{currentContent.participants}: {deal.currentParticipants}/{deal.maxParticipants}</p>
                <p className="text-muted-foreground">{currentContent.timeLeft}: {deal.timeRemaining}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-jam3a-purple h-2.5 rounded-full" 
                style={{ width: `${deal.progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="product" disabled={activeTab !== 'product' && !paymentSuccess}>
                1. {currentContent.productSelection}
              </TabsTrigger>
              <TabsTrigger value="details" disabled={activeTab !== 'details' && !paymentSuccess}>
                2. {currentContent.personalInfo}
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={activeTab !== 'payment' && !paymentSuccess}>
                3. {currentContent.payment}
              </TabsTrigger>
              <TabsTrigger value="confirmation" disabled={activeTab !== 'confirmation'}>
                4. {currentContent.confirmation}
              </TabsTrigger>
            </TabsList>
            
            {/* Product Selection Tab */}
            <TabsContent value="product" className="p-4 border rounded-md mt-4">
              <h2 className="text-xl font-semibold mb-4">{currentContent.selectProduct}</h2>
              
              {categoryProducts.length > 0 ? (
                <ProductSelector 
                  products={categoryProducts}
                  selectedProduct={selectedProduct}
                  onSelectProduct={handleProductSelect}
                  language={language}
                  discount={deal.discount}
                  currency={currentContent.currency}
                />
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No products available</AlertTitle>
                  <AlertDescription>
                    There are no products available in this category.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleContinue}
                  className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
                  disabled={!selectedProduct}
                >
                  {currentContent.continue}
                  <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
                </Button>
              </div>
            </TabsContent>
            
            {/* Personal Information Tab */}
            <TabsContent value="details" className="p-4 border rounded-md mt-4">
              <h2 className="text-xl font-semibold mb-4">{currentContent.personalInfoTitle}</h2>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{currentContent.nameLabel}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm">{currentContent.requiredField}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">{currentContent.emailLabel}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email === 'required' && (
                    <p className="text-red-500 text-sm">{currentContent.requiredField}</p>
                  )}
                  {formErrors.email === 'invalid' && (
                    <p className="text-red-500 text-sm">{currentContent.invalidEmail}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">{currentContent.phoneLabel}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={formErrors.phone ? 'border-red-500' : ''}
                  />
                  {formErrors.phone === 'required' && (
                    <p className="text-red-500 text-sm">{currentContent.requiredField}</p>
                  )}
                  {formErrors.phone === 'invalid' && (
                    <p className="text-red-500 text-sm">{currentContent.invalidPhone}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="address">{currentContent.addressLabel}</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={formErrors.address ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm">{currentContent.requiredField}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                >
                  {currentContent.back}
                </Button>
                <Button 
                  onClick={handleContinue}
                  className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
                >
                  {currentContent.continue}
                  <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
                </Button>
              </div>
            </TabsContent>
            
            {/* Payment Tab */}
            <TabsContent value="payment" className="p-4 border rounded-md mt-4">
              <h2 className="text-xl font-semibold mb-4">{currentContent.paymentTitle}</h2>
              
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                className="mb-6"
              >
                <div className="flex items-center space-x-2 space-y-0 mb-4">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    {currentContent.creditCard}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 space-y-0 mb-4">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="bank-transfer" className="flex items-center">
                    <BanknoteIcon className="mr-2 h-5 w-5" />
                    {currentContent.bankTransfer}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 space-y-0 mb-4">
                  <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                  <Label htmlFor="cash-on-delivery" className="flex items-center">
                    <Wallet className="mr-2 h-5 w-5" />
                    {currentContent.cashOnDelivery}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 space-y-0 mb-4">
                  <RadioGroupItem value="tabby" id="tabby" />
                  <Label htmlFor="tabby" className="flex items-center">
                    <TabbyIcon />
                    <span className="ml-2">{currentContent.tabby}</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 space-y-0">
                  <RadioGroupItem value="tamara" id="tamara" />
                  <Label htmlFor="tamara" className="flex items-center">
                    <TamaraIcon />
                    <span className="ml-2">{currentContent.tamara}</span>
                  </Label>
                </div>
              </RadioGroup>
              
              {formData.paymentMethod === 'credit-card' && (
                <div className="space-y-4 mb-6">
                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber">{currentContent.cardNumberLabel}</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={formErrors.cardNumber ? 'border-red-500' : ''}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {formErrors.cardNumber === 'required' && (
                      <p className="text-red-500 text-sm">{currentContent.requiredField}</p>
                    )}
                    {formErrors.cardNumber === 'invalid' && (
                      <p className="text-red-500 text-sm">{currentContent.invalidCard}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cardExpiry">{currentContent.cardExpiryLabel}</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className={formErrors.cardExpiry ? 'border-red-500' : ''}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {formErrors.cardExpiry === 'required' && (
                        <p className="text-red-500 text-sm">{currentContent.requiredField}</p>
                      )}
                      {formErrors.cardExpiry === 'invalid' && (
                        <p className="text-red-500 text-sm">{currentContent.invalidExpiry}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="cardCvv">{currentContent.cardCvvLabel}</Label>
                      <Input
                        id="cardCvv"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        className={formErrors.cardCvv ? 'border-red-500' : ''}
                        placeholder="123"
                        maxLength={4}
                      />
                      {formErrors.cardCvv === 'required' && (
                        <p className="text-red-500 text-sm">{currentContent.requiredField}</p>
                      )}
                      {formErrors.cardCvv === 'invalid' && (
                        <p className="text-red-500 text-sm">{currentContent.invalidCvv}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="savePaymentInfo"
                      name="savePaymentInfo"
                      checked={formData.savePaymentInfo}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, savePaymentInfo: checked})
                      }
                    />
                    <Label htmlFor="savePaymentInfo">{currentContent.saveCardLabel}</Label>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => {
                    setFormData({...formData, termsAccepted: checked});
                    if (checked) {
                      setFormErrors({...formErrors, termsAccepted: false});
                    }
                  }}
                  className={formErrors.termsAccepted ? 'border-red-500' : ''}
                />
                <Label htmlFor="termsAccepted">{currentContent.termsLabel}</Label>
              </div>
              {formErrors.termsAccepted && (
                <p className="text-red-500 text-sm mb-4">{currentContent.termsRequired}</p>
              )}
              
              <div className="mt-6 flex justify-between">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  disabled={isProcessing}
                >
                  {currentContent.back}
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentContent.processingPayment}
                    </>
                  ) : (
                    currentContent.payNow
                  )}
                </Button>
              </div>
            </TabsContent>
            
            {/* Confirmation Tab */}
            <TabsContent value="confirmation" className="p-4 border rounded-md mt-4">
              <div className="text-center py-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{currentContent.paymentSuccessTitle}</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {currentContent.paymentSuccessMessage}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/orders')}
                  >
                    {currentContent.viewOrder}
                  </Button>
                  <Button 
                    className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
                    onClick={() => navigate('/')}
                  >
                    {currentContent.continueShopping}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JoinJam3a;
