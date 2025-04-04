import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingBag, 
  Users, 
  Calendar, 
  Clock, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight,
  Upload,
  Info
} from 'lucide-react';

const StartJam3a = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    category: '',
    regularPrice: '',
    jam3aPrice: '',
    images: [],
    specifications: '',
    minParticipants: 5,
    maxParticipants: 20,
    duration: 7, // days
    shippingOptions: 'standard',
    paymentOptions: 'all'
  });
  
  const content = {
    en: {
      title: "Start Your Jam3a",
      subtitle: "Create a group buying opportunity and invite others to join",
      steps: {
        product: "Product Details",
        pricing: "Pricing & Group",
        shipping: "Shipping & Payment",
        review: "Review & Submit"
      },
      product: {
        title: "Product Details",
        description: "Provide information about the product you want to offer",
        name: "Product Name",
        namePlaceholder: "Enter product name",
        description: "Product Description",
        descriptionPlaceholder: "Describe the product in detail",
        category: "Category",
        categoryPlaceholder: "Select a category",
        categories: {
          electronics: "Electronics",
          fashion: "Fashion & Apparel",
          home: "Home & Kitchen",
          beauty: "Beauty & Personal Care",
          toys: "Toys & Games",
          sports: "Sports & Outdoors",
          other: "Other"
        },
        images: "Product Images",
        imagesDescription: "Upload up to 5 images (PNG, JPG, WEBP)",
        uploadImages: "Upload Images",
        specifications: "Product Specifications",
        specificationsPlaceholder: "Enter product specifications, features, dimensions, etc.",
        continue: "Continue to Pricing & Group",
        error: "Please fill in all required fields"
      },
      pricing: {
        title: "Pricing & Group Details",
        description: "Set your pricing and group requirements",
        regularPrice: "Regular Price (SAR)",
        jam3aPrice: "Jam3a Group Price (SAR)",
        savings: "Savings",
        minParticipants: "Minimum Participants",
        minParticipantsNote: "Minimum 5 participants required for a Jam3a",
        maxParticipants: "Maximum Participants",
        duration: "Jam3a Duration",
        durationOptions: {
          3: "3 days",
          5: "5 days",
          7: "7 days",
          10: "10 days",
          14: "14 days"
        },
        durationDescription: "Time window for people to join this Jam3a",
        back: "Back to Product Details",
        continue: "Continue to Shipping & Payment",
        error: "Please fill in all required fields"
      },
      shipping: {
        title: "Shipping & Payment Options",
        description: "Configure shipping and payment settings",
        shippingOptions: "Shipping Options",
        shippingOptionsDescription: "Select available shipping methods",
        options: {
          standard: "Standard Shipping (3-5 business days)",
          express: "Express Shipping (1-2 business days)",
          pickup: "Local Pickup",
          all: "All Options"
        },
        paymentOptions: "Payment Options",
        paymentOptionsDescription: "Select accepted payment methods",
        paymentMethods: {
          card: "Credit/Debit Card",
          mada: "mada",
          stcpay: "STC Pay",
          applepay: "Apple Pay",
          all: "All Payment Methods"
        },
        back: "Back to Pricing & Group",
        continue: "Continue to Review",
        error: "Please select at least one shipping and payment option"
      },
      review: {
        title: "Review Your Jam3a",
        description: "Review all details before submitting",
        productDetails: "Product Details",
        pricingDetails: "Pricing & Group Details",
        shippingPayment: "Shipping & Payment",
        termsTitle: "Terms & Conditions",
        termsDescription: "By creating this Jam3a, you agree to our Terms of Service and Seller Guidelines.",
        readTerms: "Read Terms of Service",
        readGuidelines: "Read Seller Guidelines",
        back: "Back to Shipping & Payment",
        submit: "Create Jam3a",
        submitting: "Creating your Jam3a...",
        loginRequired: "Please log in to create a Jam3a",
        login: "Log In",
        success: "Your Jam3a has been created successfully!",
        error: "There was an error creating your Jam3a. Please try again."
      },
      success: {
        title: "Jam3a Created Successfully!",
        description: "Your group buying opportunity is now live",
        jam3aId: "Jam3a ID",
        shareTitle: "Share with others",
        shareDescription: "Invite friends and family to join your Jam3a",
        copyLink: "Copy Link",
        linkCopied: "Link copied to clipboard!",
        viewJam3a: "View Your Jam3a",
        createAnother: "Create Another Jam3a"
      }
    },
    ar: {
      title: "ابدأ جمعتك",
      subtitle: "أنشئ فرصة شراء جماعي وادعُ الآخرين للانضمام",
      steps: {
        product: "تفاصيل المنتج",
        pricing: "التسعير والمجموعة",
        shipping: "الشحن والدفع",
        review: "المراجعة والتقديم"
      },
      product: {
        title: "تفاصيل المنتج",
        description: "قدم معلومات عن المنتج الذي ترغب في عرضه",
        name: "اسم المنتج",
        namePlaceholder: "أدخل اسم المنتج",
        description: "وصف المنتج",
        descriptionPlaceholder: "صف المنتج بالتفصيل",
        category: "الفئة",
        categoryPlaceholder: "اختر فئة",
        categories: {
          electronics: "الإلكترونيات",
          fashion: "الأزياء والملابس",
          home: "المنزل والمطبخ",
          beauty: "الجمال والعناية الشخصية",
          toys: "الألعاب",
          sports: "الرياضة والأنشطة الخارجية",
          other: "أخرى"
        },
        images: "صور المنتج",
        imagesDescription: "قم بتحميل ما يصل إلى 5 صور (PNG، JPG، WEBP)",
        uploadImages: "تحميل الصور",
        specifications: "مواصفات المنتج",
        specificationsPlaceholder: "أدخل مواصفات المنتج، الميزات، الأبعاد، إلخ.",
        continue: "متابعة إلى التسعير والمجموعة",
        error: "يرجى ملء جميع الحقول المطلوبة"
      },
      pricing: {
        title: "تفاصيل التسعير والمجموعة",
        description: "حدد التسعير ومتطلبات المجموعة",
        regularPrice: "السعر العادي (ريال سعودي)",
        jam3aPrice: "سعر مجموعة جمعة (ريال سعودي)",
        savings: "التوفير",
        minParticipants: "الحد الأدنى للمشاركين",
        minParticipantsNote: "مطلوب 5 مشاركين على الأقل لجمعة",
        maxParticipants: "الحد الأقصى للمشاركين",
        duration: "مدة الجمعة",
        durationOptions: {
          3: "3 أيام",
          5: "5 أيام",
          7: "7 أيام",
          10: "10 أيام",
          14: "14 يوم"
        },
        durationDescription: "النافذة الزمنية للأشخاص للانضمام إلى هذه الجمعة",
        back: "العودة إلى تفاصيل المنتج",
        continue: "متابعة إلى الشحن والدفع",
        error: "يرجى ملء جميع الحقول المطلوبة"
      },
      shipping: {
        title: "خيارات الشحن والدفع",
        description: "تكوين إعدادات الشحن والدفع",
        shippingOptions: "خيارات الشحن",
        shippingOptionsDescription: "حدد طرق الشحن المتاحة",
        options: {
          standard: "الشحن القياسي (3-5 أيام عمل)",
          express: "الشحن السريع (1-2 يوم عمل)",
          pickup: "الاستلام المحلي",
          all: "جميع الخيارات"
        },
        paymentOptions: "خيارات الدفع",
        paymentOptionsDescription: "حدد طرق الدفع المقبولة",
        paymentMethods: {
          card: "بطاقة ائتمان/خصم",
          mada: "مدى",
          stcpay: "STC Pay",
          applepay: "Apple Pay",
          all: "جميع طرق الدفع"
        },
        back: "العودة إلى التسعير والمجموعة",
        continue: "متابعة إلى المراجعة",
        error: "يرجى تحديد خيار واحد على الأقل للشحن والدفع"
      },
      review: {
        title: "مراجعة جمعتك",
        description: "راجع جميع التفاصيل قبل التقديم",
        productDetails: "تفاصيل المنتج",
        pricingDetails: "تفاصيل التسعير والمجموعة",
        shippingPayment: "الشحن والدفع",
        termsTitle: "الشروط والأحكام",
        termsDescription: "بإنشاء هذه الجمعة، فإنك توافق على شروط الخدمة وإرشادات البائع لدينا.",
        readTerms: "قراءة شروط الخدمة",
        readGuidelines: "قراءة إرشادات البائع",
        back: "العودة إلى الشحن والدفع",
        submit: "إنشاء جمعة",
        submitting: "جاري إنشاء جمعتك...",
        loginRequired: "يرجى تسجيل الدخول لإنشاء جمعة",
        login: "تسجيل الدخول",
        success: "تم إنشاء جمعتك بنجاح!",
        error: "حدث خطأ في إنشاء جمعتك. يرجى المحاولة مرة أخرى."
      },
      success: {
        title: "تم إنشاء الجمعة بنجاح!",
        description: "فرصة الشراء الجماعي الخاصة بك متاحة الآن",
        jam3aId: "معرف الجمعة",
        shareTitle: "شارك مع الآخرين",
        shareDescription: "ادعُ الأصدقاء والعائلة للانضمام إلى جمعتك",
        copyLink: "نسخ الرابط",
        linkCopied: "تم نسخ الرابط إلى الحافظة!",
        viewJam3a: "عرض جمعتك",
        createAnother: "إنشاء جمعة أخرى"
      }
    }
  };

  const currentContent = content[language];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageUpload = (e) => {
    // In a real implementation, this would handle file uploads
    // For now, we'll just simulate it
    toast({
      title: "Images uploaded successfully",
      variant: "success"
    });
    
    setProductDetails(prev => ({
      ...prev,
      images: ['image1.jpg', 'image2.jpg']
    }));
  };
  
  const calculateSavings = () => {
    if (!productDetails.regularPrice || !productDetails.jam3aPrice) return '0%';
    
    const regular = parseFloat(productDetails.regularPrice);
    const jam3a = parseFloat(productDetails.jam3aPrice);
    
    if (isNaN(regular) || isNaN(jam3a) || regular <= 0) return '0%';
    
    const savings = ((regular - jam3a) / regular) * 100;
    return savings.toFixed(0) + '%';
  };
  
  const handleContinue = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!productDetails.name || !productDetails.description || !productDetails.category) {
        toast({
          title: currentContent.product.error,
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!productDetails.regularPrice || !productDetails.jam3aPrice) {
        toast({
          title: currentContent.pricing.error,
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 3) {
      if (!productDetails.shippingOptions || !productDetails.paymentOptions) {
        toast({
          title: currentContent.shipping.error,
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: currentContent.review.loginRequired,
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would submit the form to the backend
    // For now, we'll just simulate it
    setTimeout(() => {
      toast({
        title: currentContent.review.success,
        variant: "success"
      });
      
      // Navigate to success page or show success state
      setCurrentStep(5);
    }, 2000);
  };
  
  const handleCopyLink = () => {
    // In a real implementation, this would copy the actual link
    navigator.clipboard.writeText('https://jam3a.me/j/123456');
    
    toast({
      title: currentContent.success.linkCopied,
      variant: "success"
    });
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {Object.keys(currentContent.steps).map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-jam3a-purple text-white' : 
                  isCompleted ? 'bg-green-500 text-white' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                </div>
                <span className={`text-sm mt-2 ${isActive ? 'text-jam3a-purple font-medium' : 'text-muted-foreground'}`}>
                  {currentContent.steps[step]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="relative mt-3">
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-jam3a-purple transition-all duration-300" 
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  const renderProductDetailsStep = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">{currentContent.product.name} *</Label>
          <Input
            id="name"
            name="name"
            placeholder={currentContent.product.namePlaceholder}
            value={productDetails.name}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">{currentContent.product.description} *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder={currentContent.product.descriptionPlaceholder}
            rows={5}
            value={productDetails.description}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">{currentContent.product.category} *</Label>
          <Select
            value={productDetails.category}
            onValueChange={(value) => setProductDetails({...productDetails, category: value})}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={currentContent.product.categoryPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currentContent.product.categories).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>{currentContent.product.images}</Label>
          <p className="text-sm text-muted-foreground">{currentContent.product.imagesDescription}</p>
          <div className="mt-2">
            <Button onClick={handleImageUpload} variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {currentContent.product.uploadImages}
            </Button>
          </div>
          {productDetails.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {productDetails.images.map((image, index) => (
                <div key={index} className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specifications">{currentContent.product.specifications}</Label>
          <Textarea
            id="specifications"
            name="specifications"
            placeholder={currentContent.product.specificationsPlaceholder}
            rows={4}
            value={productDetails.specifications}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={handleContinue} className="w-full md:w-auto">
            {currentContent.product.continue}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  const renderPricingStep = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="regularPrice">{currentContent.pricing.regularPrice} *</Label>
            <Input
              id="regularPrice"
              name="regularPrice"
              type="number"
              min="0"
              step="0.01"
              value={productDetails.regularPrice}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jam3aPrice">{currentContent.pricing.jam3aPrice} *</Label>
            <Input
              id="jam3aPrice"
              name="jam3aPrice"
              type="number"
              min="0"
              step="0.01"
              value={productDetails.jam3aPrice}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {productDetails.regularPrice && productDetails.jam3aPrice && (
          <div className="bg-muted p-4 rounded-md">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-jam3a-purple">{calculateSavings()}</div>
              <div className="ml-2 text-muted-foreground">{currentContent.pricing.savings}</div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minParticipants">{currentContent.pricing.minParticipants}</Label>
            <Input
              id="minParticipants"
              name="minParticipants"
              type="number"
              min="5"
              max="100"
              value={productDetails.minParticipants}
              onChange={handleInputChange}
              disabled
            />
            <p className="text-sm text-muted-foreground">{currentContent.pricing.minParticipantsNote}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxParticipants">{currentContent.pricing.maxParticipants}</Label>
            <Input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              min="5"
              max="100"
              value={productDetails.maxParticipants}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">{currentContent.pricing.duration}</Label>
          <Select
            value={productDetails.duration.toString()}
            onValueChange={(value) => setProductDetails({...productDetails, duration: parseInt(value)})}
          >
            <SelectTrigger id="duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currentContent.pricing.durationOptions).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">{currentContent.pricing.durationDescription}</p>
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button onClick={handleBack} variant="outline">
            {currentContent.pricing.back}
          </Button>
          <Button onClick={handleContinue}>
            {currentContent.pricing.continue}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  const renderShippingStep = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="shippingOptions">{currentContent.shipping.shippingOptions}</Label>
          <p className="text-sm text-muted-foreground">{currentContent.shipping.shippingOptionsDescription}</p>
          <Select
            value={productDetails.shippingOptions}
            onValueChange={(value) => setProductDetails({...productDetails, shippingOptions: value})}
          >
            <SelectTrigger id="shippingOptions">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currentContent.shipping.options).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentOptions">{currentContent.shipping.paymentOptions}</Label>
          <p className="text-sm text-muted-foreground">{currentContent.shipping.paymentOptionsDescription}</p>
          <Select
            value={productDetails.paymentOptions}
            onValueChange={(value) => setProductDetails({...productDetails, paymentOptions: value})}
          >
            <SelectTrigger id="paymentOptions">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currentContent.shipping.paymentMethods).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button onClick={handleBack} variant="outline">
            {currentContent.shipping.back}
          </Button>
          <Button onClick={handleContinue}>
            {currentContent.shipping.continue}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  const renderReviewStep = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{currentContent.review.productDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">{currentContent.product.name}</div>
                <div className="text-lg">{productDetails.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium">{currentContent.product.category}</div>
                <div className="text-lg">{currentContent.product.categories[productDetails.category]}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">{currentContent.product.description}</div>
              <div className="text-muted-foreground">{productDetails.description}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{currentContent.review.pricingDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">{currentContent.pricing.regularPrice}</div>
                <div className="text-lg">{productDetails.regularPrice} SAR</div>
              </div>
              <div>
                <div className="text-sm font-medium">{currentContent.pricing.jam3aPrice}</div>
                <div className="text-lg text-jam3a-purple font-bold">{productDetails.jam3aPrice} SAR</div>
              </div>
              <div>
                <div className="text-sm font-medium">{currentContent.pricing.savings}</div>
                <div className="text-lg text-green-600 font-bold">{calculateSavings()}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">{currentContent.pricing.minParticipants}</div>
                <div className="text-lg">{productDetails.minParticipants}</div>
              </div>
              <div>
                <div className="text-sm font-medium">{currentContent.pricing.maxParticipants}</div>
                <div className="text-lg">{productDetails.maxParticipants}</div>
              </div>
              <div>
                <div className="text-sm font-medium">{currentContent.pricing.duration}</div>
                <div className="text-lg">{currentContent.pricing.durationOptions[productDetails.duration]}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{currentContent.review.shippingPayment}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">{currentContent.shipping.shippingOptions}</div>
                <div className="text-lg">{currentContent.shipping.options[productDetails.shippingOptions]}</div>
              </div>
              <div>
                <div className="text-sm font-medium">{currentContent.shipping.paymentOptions}</div>
                <div className="text-lg">{currentContent.shipping.paymentMethods[productDetails.paymentOptions]}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{currentContent.review.termsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{currentContent.review.termsDescription}</p>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Button variant="outline" onClick={() => navigate('/terms-of-service')}>
                {currentContent.review.readTerms}
              </Button>
              <Button variant="outline" onClick={() => navigate('/seller-guidelines')}>
                {currentContent.review.readGuidelines}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="pt-4 flex justify-between">
          <Button onClick={handleBack} variant="outline">
            {currentContent.review.back}
          </Button>
          <Button onClick={handleSubmit} disabled={!isAuthenticated}>
            {currentContent.review.submit}
          </Button>
        </div>
        
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-start">
            <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{currentContent.review.loginRequired}</p>
              <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate('/login')}>
                {currentContent.review.login}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderSuccessStep = () => {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight">{currentContent.success.title}</h2>
        <p className="text-muted-foreground">{currentContent.success.description}</p>
        
        <div className="bg-muted p-4 rounded-md inline-block">
          <div className="text-sm font-medium">{currentContent.success.jam3aId}</div>
          <div className="text-xl font-mono">JAM3A-123456</div>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{currentContent.success.shareTitle}</CardTitle>
            <CardDescription>{currentContent.success.shareDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input value="https://jam3a.me/j/123456" readOnly />
              <Button onClick={handleCopyLink}>
                {currentContent.success.copyLink}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
          <Button onClick={() => navigate('/jam3a/123456')} className="w-full md:w-auto">
            {currentContent.success.viewJam3a}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentStep(1)} variant="outline" className="w-full md:w-auto">
            {currentContent.success.createAnother}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderProductDetailsStep();
      case 2:
        return renderPricingStep();
      case 3:
        return renderShippingStep();
      case 4:
        return renderReviewStep();
      case 5:
        return renderSuccessStep();
      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {currentStep < 5 ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
                <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
              </div>
              
              {renderStepIndicator()}
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentStep === 1 && currentContent.product.title}
                    {currentStep === 2 && currentContent.pricing.title}
                    {currentStep === 3 && currentContent.shipping.title}
                    {currentStep === 4 && currentContent.review.title}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 && currentContent.product.description}
                    {currentStep === 2 && currentContent.pricing.description}
                    {currentStep === 3 && currentContent.shipping.description}
                    {currentStep === 4 && currentContent.review.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderCurrentStep()}
                </CardContent>
              </Card>
            </>
          ) : (
            renderCurrentStep()
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StartJam3a;
