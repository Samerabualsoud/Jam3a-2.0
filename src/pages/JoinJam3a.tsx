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

// Comprehensive product image mapping system
const PRODUCT_IMAGES = {
  // Apple Products
  IPHONE: {
    DEFAULT: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '16 PRO': 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '16 PRO MAX': 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '15': 'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '15 PRO': 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  // Samsung Products
  GALAXY: {
    DEFAULT: 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'S25': 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'S25 ULTRA': 'https://images.pexels.com/photos/15351642/pexels-photo-15351642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  FOLD: {
    DEFAULT: 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '6': 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  FLIP: {
    DEFAULT: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    '6': 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  // Fallback
  FALLBACK: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
};

const JoinJam3a = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
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
    cardCvv: false
  });
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
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
    // Format phone number
    else if (name === 'phone') {
      // Allow only numbers and format as needed
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      // Format Saudi phone numbers
      if (cleaned.startsWith('966') || cleaned.startsWith('05')) {
        if (cleaned.startsWith('05')) {
          formatted = cleaned;
        } else if (cleaned.startsWith('966')) {
          formatted = cleaned;
        }
      } else if (cleaned.length > 0) {
        // If doesn't start with country code, assume Saudi number
        if (!cleaned.startsWith('0')) {
          formatted = '0' + cleaned;
        } else {
          formatted = cleaned;
        }
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
    // Reset installment option when changing payment method
    let installmentOption = formData.installmentOption;
    
    if (method === 'tabby' && !['4_installments', 'pay_next_month'].includes(installmentOption)) {
      installmentOption = '4_installments';
    } else if (method === 'tamara' && !['3_installments', 'pay_in_30'].includes(installmentOption)) {
      installmentOption = '3_installments';
    }
    
    setFormData(prev => ({ 
      ...prev, 
      paymentMethod: method,
      installmentOption
    }));
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
      phone: !formData.phone || formData.phone.length < 9,
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

    // Simulate payment processing
    setIsProcessing(true);
    
    // Different processing behavior based on payment method
    const processingTime = 
      formData.paymentMethod === 'credit-card' ? 2000 : 
      formData.paymentMethod === 'apple-pay' ? 1500 : 
      formData.paymentMethod === 'tabby' ? 3000 : 
      formData.paymentMethod === 'tamara' ? 2500 : 2000;
    
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Send confirmation email
      sendConfirmationEmail();
      
      // Show success toast
      toast({
        title: language === 'en' ? 'Payment Successful!' : 'تمت عملية الدفع بنجاح!',
        description: language === 'en' 
          ? `You have successfully joined the ${productName} Jam3a!` 
          : `لقد انضممت بنجاح إلى جمعة ${productName}!`,
        variant: 'default'
      });
      
      // Track conversion with Google Analytics
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: 'JAM-' + Date.now().toString().slice(-8),
          value: parseInt(productPrice),
          currency: 'SAR',
          items: [{
            id: productId,
            name: productName,
            price: parseInt(productPrice)
          }]
        });
      }
    }, processingTime);
  };

  // Send confirmation email
  const sendConfirmationEmail = () => {
    // Import email service
    import('@/services/EmailService').then(({ default: EmailService }) => {
      // Send confirmation email using Microsoft Outlook
      EmailService.sendEmail({
        to: formData.email,
        subject: language === 'en' ? `Your Jam3a ${productName} Purchase Confirmation` : `تأكيد شراء جمعة ${productName}`,
        template: 'purchase-confirmation',
        data: {
          name: formData.name,
          product: productName,
          price: productPrice,
          orderNumber: 'JAM-' + Date.now().toString().slice(-8),
          paymentMethod: formData.paymentMethod,
          language: language
        }
      });
    }).catch(error => {
      console.error('Failed to send confirmation email:', error);
    });
  };
  const getProductImage = () => {
    const productNameLower = productName.toLowerCase();
    
    // Try to match with our image mapping system
    if (productNameLower.includes('iphone')) {
      if (productNameLower.includes('16 pro max')) return PRODUCT_IMAGES.IPHONE['16 PRO MAX'];
      if (productNameLower.includes('16 pro')) return PRODUCT_IMAGES.IPHONE['16 PRO'];
      if (productNameLower.includes('15 pro')) return PRODUCT_IMAGES.IPHONE['15 PRO'];
      if (productNameLower.includes('15')) return PRODUCT_IMAGES.IPHONE['15'];
      return PRODUCT_IMAGES.IPHONE.DEFAULT;
    }
    
    if (productNameLower.includes('galaxy s')) {
      if (productNameLower.includes('s25 ultra')) return PRODUCT_IMAGES.GALAXY['S25 ULTRA'];
      if (productNameLower.includes('s25')) return PRODUCT_IMAGES.GALAXY['S25'];
      return PRODUCT_IMAGES.GALAXY.DEFAULT;
    }
    
    if (productNameLower.includes('fold')) {
      if (productNameLower.includes('fold 6') || productNameLower.includes('z fold 6')) 
        return PRODUCT_IMAGES.FOLD['6'];
      return PRODUCT_IMAGES.FOLD.DEFAULT;
    }
    
    if (productNameLower.includes('flip')) {
      if (productNameLower.includes('flip 6') || productNameLower.includes('z flip 6')) 
        return PRODUCT_IMAGES.FLIP['6'];
      return PRODUCT_IMAGES.FLIP.DEFAULT;
    }
    
    // Fallback to ID-based images if no match found
    const images = {
      '1': PRODUCT_IMAGES.IPHONE.DEFAULT,
      '2': PRODUCT_IMAGES.GALAXY.DEFAULT,
      '3': PRODUCT_IMAGES.FOLD.DEFAULT,
      '4': PRODUCT_IMAGES.FLIP.DEFAULT,
      '5': PRODUCT_IMAGES.FALLBACK
    };
    
    return images[productId] || PRODUCT_IMAGES.FALLBACK;
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
        
        {/* Tabby verification requirements */}
        <div className="mt-4 space-y-2">
          <h5 className="text-sm font-medium">
            {language === 'en' ? 'Verification Requirements' : 'متطلبات التحقق'}
          </h5>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{language === 'en' ? 'Saudi mobile number' : 'رقم جوال سعودي'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{language === 'en' ? 'Valid ID or Iqama' : 'هوية سارية المفعول أو إقامة'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{language === 'en' ? 'Debit card for verification' : 'بطاقة مدى للتحقق'}</span>
            </div>
          </div>
        </div>
        
        {/* Tabby payment steps */}
        <div className="mt-4 space-y-2">
          <h5 className="text-sm font-medium">
            {language === 'en' ? 'How it works' : 'كيف تعمل'}
          </h5>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-2 text-xs">
              <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <div>
                <span className="font-medium">{language === 'en' ? 'Select Tabby at checkout' : 'اختر تابي عند الدفع'}</span>
                <p className="text-muted-foreground mt-0.5">
                  {language === 'en' 
                    ? 'Choose your preferred payment option' 
                    : 'اختر خيار الدفع المفضل لديك'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
              <div>
                <span className="font-medium">{language === 'en' ? 'Quick verification' : 'تحقق سريع'}</span>
                <p className="text-muted-foreground mt-0.5">
                  {language === 'en' 
                    ? 'Enter your phone number and ID for instant approval' 
                    : 'أدخل رقم هاتفك وهويتك للحصول على موافقة فورية'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
              <div>
                <span className="font-medium">{language === 'en' ? 'Pay over time' : 'ادفع على مراحل'}</span>
                <p className="text-muted-foreground mt-0.5">
                  {language === 'en' 
                    ? 'Manage your payments through the Tabby app' 
                    : 'أدر مدفوعاتك من خلال تطبيق تابي'}
                </p>
              </div>
            </div>
          </div>
        </div>
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
        
        {/* Tamara verification requirements */}
        <div className="mt-4 space-y-2">
          <h5 className="text-sm font-medium">
            {language === 'en' ? 'Verification Requirements' : 'متطلبات التحقق'}
          </h5>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{language === 'en' ? 'Saudi mobile number' : 'رقم جوال سعودي'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{language === 'en' ? 'National ID or Iqama' : 'الهوية الوطنية أو الإقامة'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{language === 'en' ? 'OTP verification' : 'التحقق برمز OTP'}</span>
            </div>
          </div>
        </div>
        
        {/* Tamara payment steps */}
        <div className="mt-4 space-y-2">
          <h5 className="text-sm font-medium">
            {language === 'en' ? 'How it works' : 'كيف تعمل'}
          </h5>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-2 text-xs">
              <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <div>
                <span className="font-medium">{language === 'en' ? 'Select Tamara at checkout' : 'اختر تمارا عند الدفع'}</span>
                <p className="text-muted-foreground mt-0.5">
                  {language === 'en' 
                    ? 'Choose to pay in 3 installments or after 30 days' 
                    : 'اختر الدفع على 3 أقساط أو بعد 30 يومًا'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
              <div>
                <span className="font-medium">{language === 'en' ? 'Complete verification' : 'أكمل التحقق'}</span>
                <p className="text-muted-foreground mt-0.5">
                  {language === 'en' 
                    ? 'Provide your phone number and ID information' 
                    : 'قدم رقم هاتفك ومعلومات الهوية الخاصة بك'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
              <div>
                <span className="font-medium">{language === 'en' ? 'Manage payments' : 'إدارة المدفوعات'}</span>
                <p className="text-muted-foreground mt-0.5">
                  {language === 'en' 
                    ? 'Track and pay installments through the Tamara app' 
                    : 'تتبع وادفع الأقساط من خلال تطبيق تمارا'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render payment success state
  const renderPaymentSuccess = () => (
    <div className="space-y-6 py-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'Payment Successful!' : 'تمت عملية الدفع بنجاح!'}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {language === 'en' 
            ? `You have successfully joined the ${productName} Jam3a! You will receive a confirmation email shortly.` 
            : `لقد انضممت بنجاح إلى جمعة ${productName}! ستصلك رسالة تأكيد بالبريد الإلكتروني قريبًا.`}
        </p>
      </div>
      
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium">
          {language === 'en' ? 'Order Details' : 'تفاصيل الطلب'}
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{language === 'en' ? 'Order Number' : 'رقم الطلب'}</span>
            <span className="font-medium">JAM-{Date.now().toString().slice(-8)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{language === 'en' ? 'Product' : 'المنتج'}</span>
            <span className="font-medium">{productName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{language === 'en' ? 'Payment Method' : 'طريقة الدفع'}</span>
            <span className="font-medium">
              {formData.paymentMethod === 'credit-card' 
                ? (language === 'en' ? 'Credit Card' : 'بطاقة ائتمان')
                : formData.paymentMethod === 'apple-pay'
                  ? 'Apple Pay'
                  : formData.paymentMethod === 'tabby'
                    ? 'Tabby'
                    : 'Tamara'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{language === 'en' ? 'Total' : 'المجموع'}</span>
            <span className="font-medium">{productPrice}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button onClick={() => navigate('/')} className="w-full">
          {language === 'en' ? 'Return to Home' : 'العودة إلى الصفحة الرئيسية'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/my-jam3a')} className="w-full">
          {language === 'en' ? 'View My Jam3as' : 'عرض جمعاتي'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="text-xl font-bold">
              {language === 'en' ? 'Processing Payment...' : 'جاري معالجة الدفع...'}
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              {language === 'en' 
                ? 'Please do not close this page. We are processing your payment.' 
                : 'يرجى عدم إغلاق هذه الصفحة. نحن نعالج عملية الدفع الخاصة بك.'}
            </p>
            
            <div className="w-full max-w-md mt-4">
              <Progress value={100} className="h-2 animate-progress" />
            </div>
            
            {formData.paymentMethod === 'tabby' || formData.paymentMethod === 'tamara' ? (
              <Alert className="bg-primary/5 border-primary/20 max-w-md mt-4">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs">
                  {language === 'en' 
                    ? 'You will be redirected to complete verification with your phone number and ID.' 
                    : 'سيتم توجيهك لإكمال التحقق برقم هاتفك وهويتك.'}
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : paymentSuccess ? (
          renderPaymentSuccess()
        ) : (
          <>
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
                        <ArrowRight className="ml-2 h-4 w-4" />
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
                        <ArrowRight className="ml-2 h-4 w-4" />
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
                              
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="savePaymentInfo" 
                                  checked={formData.savePaymentInfo} 
                                  onCheckedChange={(checked) => handleCheckboxChange('savePaymentInfo', checked)}
                                />
                                <Label htmlFor="savePaymentInfo" className="text-sm">
                                  {language === 'en' 
                                    ? 'Save card for future purchases' 
                                    : 'حفظ البطاقة للمشتريات المستقبلية'}
                                </Label>
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
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default JoinJam3a;
