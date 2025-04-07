import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/services/api';
import { API_BASE_URL } from '@/config';
import { 
  ArrowRight, 
  Check, 
  CreditCard, 
  Share2, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Tag,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

const StartJam3a = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Products state
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Step state management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [jam3aDetails, setJam3aDetails] = useState({
    duration: '7',
    category: '',
    name: '',
    description: '',
    minParticipants: 5
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [shareOptions, setShareOptions] = useState({
    whatsapp: true,
    twitter: false,
    facebook: false,
    email: true
  });
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching products from:', `${API_BASE_URL}/products`);
        const response = await apiService.get('/products');
        
        if (response && response.data) {
          console.log('Products data:', response.data);
          setProducts(response.data);
        } else if (Array.isArray(response)) {
          console.log('Products data (array):', response);
          setProducts(response);
        } else {
          console.error('Invalid response format:', response);
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        
        // Try to load from local storage as fallback
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          try {
            setProducts(JSON.parse(storedProducts));
            toast({
              title: 'Using cached products',
              description: 'Could not connect to server. Showing saved products.',
              variant: 'warning'
            });
          } catch (parseError) {
            console.error('Failed to parse stored products:', parseError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);
  
  // Get user profile data
  const userProfile = user || {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
  
  // Fetch user profile if logged in but profile is empty
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && (!user.name || !user.phone || !user.address)) {
        try {
          const response = await apiService.get(`/users/${user.id}`);
          if (response && response.data) {
            // Update user context with profile data
            // This would typically be handled by your auth context
            console.log('User profile data:', response.data);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };
    
    if (user) {
      fetchUserProfile();
    }
  }, [user]);
  
  const content = {
    en: {
      title: "Start Your Jam3a",
      subtitle: "Create a group buying deal and invite others to join",
      steps: {
        selectProduct: "Select Product",
        setupJam3a: "Setup Jam3a",
        payment: "Payment",
        confirmation: "Confirmation"
      },
      productSelection: {
        title: "Choose a Product",
        description: "Select a product you want to create a Jam3a for",
        regularPrice: "Regular Price",
        jam3aPrice: "Jam3a Price",
        discount: "Discount",
        select: "Select",
        selected: "Selected",
        currency: "SAR"
      },
      jam3aSetup: {
        title: "Setup Your Jam3a",
        sectionDescription: "Configure the details of your Jam3a",
        duration: "Jam3a Duration",
        durationDays: "days",
        category: "Product Category",
        jam3aName: "Jam3a Name",
        jam3aNamePlaceholder: "Give your Jam3a a catchy name",
        jam3aDescription: "Jam3a Description",
        jam3aDescriptionPlaceholder: "Tell others why they should join your Jam3a",
        minParticipants: "Minimum Participants",
        minParticipantsDescription: "The minimum number of people needed for the deal to be valid"
      },
      payment: {
        title: "Payment Information",
        sectionDescription: "Choose your payment method and review your order",
        paymentMethod: "Payment Method",
        creditCard: "Credit Card",
        applePay: "Apple Pay",
        bankTransfer: "Bank Transfer",
        orderSummary: "Order Summary",
        product: "Product",
        price: "Price",
        participants: "Participants",
        total: "Total",
        userInfo: "Your Information",
        name: "Name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        shareOptions: "Share Options",
        shareDescription: "Choose how you want to share your Jam3a with others",
        whatsapp: "WhatsApp",
        twitter: "Twitter",
        facebook: "Facebook",
        emailShare: "Email"
      },
      confirmation: {
        title: "Jam3a Created Successfully!",
        sectionDescription: "Your Jam3a has been created and is now active",
        jam3aId: "Jam3a ID",
        shareNow: "Share Now",
        viewJam3a: "View Your Jam3a",
        startAnother: "Start Another Jam3a",
        thankYou: "Thank you for creating a Jam3a!",
        nextSteps: "Next Steps",
        step1: "Share your Jam3a with friends and family",
        step2: "Track your Jam3a progress in your dashboard",
        step3: "Once enough people join, the deal will be confirmed",
        step4: "You'll receive a confirmation email when the deal is complete"
      },
      buttons: {
        next: "Next",
        back: "Back",
        createJam3a: "Create Jam3a",
        loading: "Loading..."
      },
      errors: {
        productRequired: "Please select a product",
        nameRequired: "Please enter a name for your Jam3a",
        descriptionRequired: "Please enter a description for your Jam3a",
        categoryRequired: "Please select a category",
        loadingError: "Error loading products. Please try again."
      }
    },
    ar: {
      title: "ابدأ جمعتك",
      subtitle: "أنشئ صفقة شراء جماعية وادعُ الآخرين للانضمام",
      steps: {
        selectProduct: "اختر المنتج",
        setupJam3a: "إعداد الجمعة",
        payment: "الدفع",
        confirmation: "التأكيد"
      },
      productSelection: {
        title: "اختر منتجًا",
        description: "حدد منتجًا تريد إنشاء جمعة له",
        regularPrice: "السعر العادي",
        jam3aPrice: "سعر الجمعة",
        discount: "الخصم",
        select: "اختر",
        selected: "تم الاختيار",
        currency: "ريال"
      },
      jam3aSetup: {
        title: "إعداد جمعتك",
        sectionDescription: "قم بتكوين تفاصيل جمعتك",
        duration: "مدة الجمعة",
        durationDays: "أيام",
        category: "فئة المنتج",
        jam3aName: "اسم الجمعة",
        jam3aNamePlaceholder: "أعط جمعتك اسمًا جذابًا",
        jam3aDescription: "وصف الجمعة",
        jam3aDescriptionPlaceholder: "أخبر الآخرين لماذا يجب عليهم الانضمام إلى جمعتك",
        minParticipants: "الحد الأدنى للمشاركين",
        minParticipantsDescription: "الحد الأدنى لعدد الأشخاص المطلوبين لتكون الصفقة صالحة"
      },
      payment: {
        title: "معلومات الدفع",
        sectionDescription: "اختر طريقة الدفع الخاصة بك وراجع طلبك",
        paymentMethod: "طريقة الدفع",
        creditCard: "بطاقة ائتمان",
        applePay: "آبل باي",
        bankTransfer: "تحويل بنكي",
        orderSummary: "ملخص الطلب",
        product: "المنتج",
        price: "السعر",
        participants: "المشاركون",
        total: "المجموع",
        userInfo: "معلوماتك",
        name: "الاسم",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        address: "العنوان",
        shareOptions: "خيارات المشاركة",
        shareDescription: "اختر كيف تريد مشاركة جمعتك مع الآخرين",
        whatsapp: "واتساب",
        twitter: "تويتر",
        facebook: "فيسبوك",
        emailShare: "البريد الإلكتروني"
      },
      confirmation: {
        title: "تم إنشاء الجمعة بنجاح!",
        sectionDescription: "تم إنشاء جمعتك وهي الآن نشطة",
        jam3aId: "معرف الجمعة",
        shareNow: "شارك الآن",
        viewJam3a: "عرض جمعتك",
        startAnother: "بدء جمعة أخرى",
        thankYou: "شكرًا لإنشاء جمعة!",
        nextSteps: "الخطوات التالية",
        step1: "شارك جمعتك مع الأصدقاء والعائلة",
        step2: "تتبع تقدم جمعتك في لوحة التحكم الخاصة بك",
        step3: "بمجرد انضمام عدد كافٍ من الأشخاص، سيتم تأكيد الصفقة",
        step4: "ستتلقى رسالة تأكيد بالبريد الإلكتروني عند اكتمال الصفقة"
      },
      buttons: {
        next: "التالي",
        back: "رجوع",
        createJam3a: "إنشاء جمعة",
        loading: "جاري التحميل..."
      },
      errors: {
        productRequired: "الرجاء اختيار منتج",
        nameRequired: "الرجاء إدخال اسم لجمعتك",
        descriptionRequired: "الرجاء إدخال وصف لجمعتك",
        categoryRequired: "الرجاء اختيار فئة",
        loadingError: "خطأ في تحميل المنتجات. يرجى المحاولة مرة أخرى."
      }
    }
  };

  const currentContent = content[language];
  
  // Function to handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    
    // Pre-fill Jam3a details based on product
    setJam3aDetails(prev => ({
      ...prev,
      category: product.category?._id || '',
      name: product.name || '',
      description: product.description || '',
      minParticipants: product.minParticipants || 5
    }));
  };
  
  // Function to handle next step
  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1 && !selectedProduct) {
      toast({
        title: currentContent.errors.productRequired,
        variant: 'destructive'
      });
      return;
    }
    
    if (currentStep === 2) {
      if (!jam3aDetails.name) {
        toast({
          title: currentContent.errors.nameRequired,
          variant: 'destructive'
        });
        return;
      }
      
      if (!jam3aDetails.description) {
        toast({
          title: currentContent.errors.descriptionRequired,
          variant: 'destructive'
        });
        return;
      }
      
      if (!jam3aDetails.category) {
        toast({
          title: currentContent.errors.categoryRequired,
          variant: 'destructive'
        });
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };
  
  // Function to handle back step
  const handleBackStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Function to handle Jam3a creation
  const handleCreateJam3a = async () => {
    setIsLoading(true);
    
    try {
      // Prepare Jam3a data
      const jam3aData = {
        productId: selectedProduct._id,
        name: jam3aDetails.name,
        description: jam3aDetails.description,
        categoryId: jam3aDetails.category,
        duration: parseInt(jam3aDetails.duration),
        minParticipants: jam3aDetails.minParticipants,
        paymentMethod,
        shareOptions
      };
      
      // Create Jam3a
      const response = await apiService.post('/jam3a', jam3aData);
      
      if (response && response.data) {
        // Store Jam3a ID for confirmation page
        localStorage.setItem('lastCreatedJam3aId', response.data._id);
        
        // Move to confirmation step
        setCurrentStep(4);
        
        toast({
          title: language === 'en' ? 'Jam3a Created!' : 'تم إنشاء الجمعة!',
          description: language === 'en' 
            ? 'Your Jam3a has been created successfully.' 
            : 'تم إنشاء جمعتك بنجاح.',
          variant: 'default'
        });
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Error creating Jam3a:', err);
      
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Failed to create Jam3a. Please try again.' 
          : 'فشل في إنشاء الجمعة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle sharing
  const handleShare = (platform) => {
    // Get Jam3a ID from localStorage
    const jam3aId = localStorage.getItem('lastCreatedJam3aId');
    
    // Create share URL
    const shareUrl = `${window.location.origin}/jam3a/${jam3aId}`;
    
    // Create share text
    const shareText = language === 'en'
      ? `Join my Jam3a for ${selectedProduct.name} and save ${selectedProduct.discountPercentage}%!`
      : `انضم إلى جمعتي لـ ${selectedProduct.name} ووفر ${selectedProduct.discountPercentage}%!`;
    
    // Share based on platform
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`);
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: language === 'en' ? 'Link Copied!' : 'تم نسخ الرابط!',
          description: language === 'en' 
            ? 'Share link has been copied to clipboard.' 
            : 'تم نسخ رابط المشاركة إلى الحافظة.',
          variant: 'default'
        });
    }
  };

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{currentContent.title}</h1>
            <p className="text-muted-foreground mt-2">{currentContent.subtitle}</p>
          </div>
          
          {/* Steps indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              {Object.values(currentContent.steps).map((step, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center ${index + 1 === currentStep ? 'text-primary' : index + 1 < currentStep ? 'text-primary/70' : 'text-muted-foreground'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${index + 1 === currentStep ? 'bg-primary text-primary-foreground' : index + 1 < currentStep ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {index + 1 < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-muted"></div>
              </div>
              <div className="relative flex justify-between">
                {Object.values(currentContent.steps).map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-4 h-0.5 ${index + 1 <= currentStep ? 'bg-primary' : 'bg-muted'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Step 1: Product Selection */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>{currentContent.productSelection.title}</CardTitle>
                <CardDescription>{currentContent.productSelection.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>{currentContent.buttons.loading}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive">{currentContent.errors.loadingError}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      {language === 'en' ? 'Refresh' : 'تحديث'}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <Card 
                        key={product._id} 
                        className={`cursor-pointer transition-all ${selectedProduct && selectedProduct._id === product._id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img 
                            src={product.image || 'https://placehold.co/600x400?text=No+Image'} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="text-sm text-muted-foreground line-through">
                                {currentContent.productSelection.regularPrice}: {product.regularPrice} {currentContent.productSelection.currency}
                              </p>
                              <p className="font-bold text-primary">
                                {currentContent.productSelection.jam3aPrice}: {product.jam3aPrice} {currentContent.productSelection.currency}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {currentContent.productSelection.discount}: {product.discountPercentage || Math.round(((product.regularPrice - product.jam3aPrice) / product.regularPrice) * 100)}%
                            </Badge>
                          </div>
                          <Button 
                            variant={selectedProduct && selectedProduct._id === product._id ? "default" : "outline"}
                            className="w-full mt-2"
                          >
                            {selectedProduct && selectedProduct._id === product._id ? currentContent.productSelection.selected : currentContent.productSelection.select}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNextStep} disabled={!selectedProduct || isLoading}>
                  {currentContent.buttons.next}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 2: Jam3a Setup */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>{currentContent.jam3aSetup.title}</CardTitle>
                <CardDescription>{currentContent.jam3aSetup.sectionDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">{currentContent.jam3aSetup.duration}</Label>
                    <div className="flex items-center">
                      <Input 
                        id="duration" 
                        type="number" 
                        min="1" 
                        max="30" 
                        value={jam3aDetails.duration}
                        onChange={(e) => setJam3aDetails(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-20"
                      />
                      <span className="ml-2">{currentContent.jam3aSetup.durationDays}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">{currentContent.jam3aSetup.category}</Label>
                    <Select 
                      value={jam3aDetails.category}
                      onValueChange={(value) => setJam3aDetails(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder={language === 'en' ? 'Select category' : 'اختر الفئة'} />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => product.category).filter((category, index, self) => 
                          category && self.findIndex(c => c && c._id === category._id) === index
                        ).map(category => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jam3aName">{currentContent.jam3aSetup.jam3aName}</Label>
                  <Input 
                    id="jam3aName" 
                    placeholder={currentContent.jam3aSetup.jam3aNamePlaceholder}
                    value={jam3aDetails.name}
                    onChange={(e) => setJam3aDetails(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jam3aDescription">{currentContent.jam3aSetup.jam3aDescription}</Label>
                  <Input 
                    id="jam3aDescription" 
                    placeholder={currentContent.jam3aSetup.jam3aDescriptionPlaceholder}
                    value={jam3aDetails.description}
                    onChange={(e) => setJam3aDetails(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minParticipants">{currentContent.jam3aSetup.minParticipants}</Label>
                  <div className="flex items-center">
                    <Input 
                      id="minParticipants" 
                      type="number" 
                      min="2" 
                      max="50" 
                      value={jam3aDetails.minParticipants}
                      onChange={(e) => setJam3aDetails(prev => ({ ...prev, minParticipants: parseInt(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">{currentContent.jam3aSetup.minParticipantsDescription}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBackStep}>
                  {currentContent.buttons.back}
                </Button>
                <Button onClick={handleNextStep}>
                  {currentContent.buttons.next}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>{currentContent.payment.title}</CardTitle>
                <CardDescription>{currentContent.payment.sectionDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{currentContent.payment.paymentMethod}</h3>
                  <RadioGroup 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className={`flex items-center space-x-2 rounded-md border p-4 ${paymentMethod === 'credit_card' ? 'border-primary' : ''}`}>
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        {currentContent.payment.creditCard}
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 rounded-md border p-4 ${paymentMethod === 'apple_pay' ? 'border-primary' : ''}`}>
                      <RadioGroupItem value="apple_pay" id="apple_pay" />
                      <Label htmlFor="apple_pay" className="flex items-center cursor-pointer">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.0001 7.5C16.5168 8.0333 15.7501 8.5 15.0001 8.5C14.2501 8.5 13.5001 8.0333 13.0001 7.5C12.5001 6.9667 11.7501 6.5 11.0001 6.5C10.2501 6.5 9.50008 6.9667 9.00008 7.5C8.50008 8.0333 7.75008 8.5 7.00008 8.5C6.25008 8.5 5.48341 8.0333 5.00008 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.0001 12.5C16.5168 13.0333 15.7501 13.5 15.0001 13.5C14.2501 13.5 13.5001 13.0333 13.0001 12.5C12.5001 11.9667 11.7501 11.5 11.0001 11.5C10.2501 11.5 9.50008 11.9667 9.00008 12.5C8.50008 13.0333 7.75008 13.5 7.00008 13.5C6.25008 13.5 5.48341 13.0333 5.00008 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.0001 17.5C16.5168 18.0333 15.7501 18.5 15.0001 18.5C14.2501 18.5 13.5001 18.0333 13.0001 17.5C12.5001 16.9667 11.7501 16.5 11.0001 16.5C10.2501 16.5 9.50008 16.9667 9.00008 17.5C8.50008 18.0333 7.75008 18.5 7.00008 18.5C6.25008 18.5 5.48341 18.0333 5.00008 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {currentContent.payment.applePay}
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 rounded-md border p-4 ${paymentMethod === 'bank_transfer' ? 'border-primary' : ''}`}>
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 6L12 3L19 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 10V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20 10V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 14V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 14V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 14V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {currentContent.payment.bankTransfer}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{currentContent.payment.orderSummary}</h3>
                  <div className="rounded-md border">
                    <div className="p-4 flex items-center space-x-4">
                      <div className="h-16 w-16 rounded overflow-hidden">
                        <img 
                          src={selectedProduct?.image || 'https://placehold.co/600x400?text=No+Image'} 
                          alt={selectedProduct?.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{selectedProduct?.name}</h4>
                        <p className="text-sm text-muted-foreground">{jam3aDetails.minParticipants} {currentContent.payment.participants}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground line-through">{selectedProduct?.regularPrice} {currentContent.productSelection.currency}</p>
                        <p className="font-bold">{selectedProduct?.jam3aPrice} {currentContent.productSelection.currency}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="p-4 flex justify-between items-center">
                      <span className="font-medium">{currentContent.payment.total}</span>
                      <span className="font-bold">{selectedProduct?.jam3aPrice} {currentContent.productSelection.currency}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{currentContent.payment.userInfo}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label>{currentContent.payment.name}</Label>
                      </div>
                      <p>{userProfile.name || '-'}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label>{currentContent.payment.email}</Label>
                      </div>
                      <p>{userProfile.email || '-'}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label>{currentContent.payment.phone}</Label>
                      </div>
                      <p>{userProfile.phone || '-'}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label>{currentContent.payment.address}</Label>
                      </div>
                      <p>{userProfile.address || '-'}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{currentContent.payment.shareOptions}</h3>
                  <p className="text-sm text-muted-foreground">{currentContent.payment.shareDescription}</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="whatsapp" 
                        checked={shareOptions.whatsapp}
                        onCheckedChange={(checked) => setShareOptions(prev => ({ ...prev, whatsapp: checked }))}
                      />
                      <Label htmlFor="whatsapp">{currentContent.payment.whatsapp}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="twitter" 
                        checked={shareOptions.twitter}
                        onCheckedChange={(checked) => setShareOptions(prev => ({ ...prev, twitter: checked }))}
                      />
                      <Label htmlFor="twitter">{currentContent.payment.twitter}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="facebook" 
                        checked={shareOptions.facebook}
                        onCheckedChange={(checked) => setShareOptions(prev => ({ ...prev, facebook: checked }))}
                      />
                      <Label htmlFor="facebook">{currentContent.payment.facebook}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email" 
                        checked={shareOptions.email}
                        onCheckedChange={(checked) => setShareOptions(prev => ({ ...prev, email: checked }))}
                      />
                      <Label htmlFor="email">{currentContent.payment.emailShare}</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBackStep}>
                  {currentContent.buttons.back}
                </Button>
                <Button onClick={handleCreateJam3a} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentContent.buttons.loading}
                    </>
                  ) : (
                    <>
                      {currentContent.buttons.createJam3a}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>{currentContent.confirmation.title}</CardTitle>
                <CardDescription>{currentContent.confirmation.sectionDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">{currentContent.confirmation.jam3aId}</p>
                  <p className="text-lg font-mono font-bold mt-1">JAM-{Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 900) + 100}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" onClick={() => handleShare('whatsapp')}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.6 6.31999C16.8 5.49999 15.8 4.84999 14.7 4.39999C13.6 3.94999 12.3 3.69999 11 3.69999C9.7 3.69999 8.5 3.94999 7.3 4.39999C6.2 4.84999 5.2 5.49999 4.3 6.31999C3.5 7.13999 2.9 8.09999 2.4 9.19999C2 10.3 1.7 11.5 1.7 12.8C1.7 14.4 2.1 15.9 2.8 17.3L1.7 22.2L6.7 21.1C8.1 21.8 9.5 22.2 11.1 22.2C12.4 22.2 13.6 21.9 14.7 21.5C15.8 21.1 16.8 20.4 17.6 19.6C18.4 18.8 19.1 17.8 19.5 16.7C19.9 15.6 20.2 14.3 20.2 13C20.2 11.7 19.9 10.5 19.5 9.39999C19 8.09999 18.4 7.13999 17.6 6.31999ZM11 20.3C9.6 20.3 8.3 19.9 7.1 19.2L6.8 19L3.9 19.7L4.6 16.9L4.4 16.6C3.6 15.4 3.2 14.1 3.2 12.7C3.2 11.6 3.4 10.6 3.8 9.69999C4.2 8.79999 4.7 7.99999 5.4 7.29999C6.1 6.59999 6.9 6.09999 7.8 5.69999C8.7 5.29999 9.8 5.09999 10.9 5.09999C12 5.09999 13.1 5.29999 14 5.69999C14.9 6.09999 15.7 6.59999 16.4 7.29999C17.1 7.99999 17.6 8.79999 18 9.69999C18.4 10.6 18.6 11.6 18.6 12.7C18.6 13.8 18.4 14.9 18 15.8C17.6 16.7 17.1 17.5 16.4 18.2C15.7 18.9 14.9 19.4 14 19.8C13.1 20.1 12.1 20.3 11 20.3ZM15.1 14.2C14.9 14.1 14.3 13.8 14.1 13.7C13.9 13.6 13.8 13.6 13.6 13.8C13.4 14 13.2 14.2 13.1 14.3C13 14.5 12.9 14.5 12.7 14.4C12.5 14.3 12.1 14.2 11.6 13.7C11.2 13.3 10.9 12.9 10.8 12.7C10.7 12.5 10.8 12.4 10.9 12.3C11 12.2 11.1 12.1 11.2 11.9C11.3 11.8 11.3 11.7 11.4 11.5C11.5 11.3 11.4 11.2 11.4 11.1C11.3 11 11 10.4 10.9 10C10.8 9.69999 10.6 9.69999 10.5 9.69999C10.4 9.69999 10.3 9.69999 10.1 9.69999C9.9 9.69999 9.7 9.79999 9.6 9.89999C9.4 10.1 9.1 10.4 9.1 11C9.1 11.6 9.5 12.2 9.6 12.3C9.7 12.5 10.9 14.4 12.8 15.3C14.7 16.2 14.7 15.9 15.1 15.9C15.5 15.9 16 15.6 16.1 15.2C16.3 14.8 16.3 14.4 16.2 14.3C16.2 14.3 16.1 14.3 15.1 14.2Z" fill="currentColor"/>
                    </svg>
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleShare('twitter')}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 5.79997C21.2483 6.12606 20.4534 6.34163 19.64 6.43997C20.4982 5.92729 21.1413 5.12075 21.45 4.16997C20.6436 4.65003 19.7608 4.98826 18.84 5.16997C18.2245 4.50254 17.405 4.05826 16.5098 3.90682C15.6147 3.75537 14.6945 3.90532 13.8938 4.33315C13.093 4.76099 12.4569 5.4425 12.0852 6.2708C11.7135 7.09911 11.6273 8.02736 11.84 8.90997C10.2094 8.82749 8.61444 8.40292 7.15865 7.66383C5.70287 6.92474 4.41885 5.88766 3.39 4.61997C3.02914 5.25013 2.83952 5.96379 2.84 6.68997C2.83872 7.36435 3.00422 8.02858 3.32176 8.62353C3.63929 9.21848 4.09902 9.72568 4.66 10.1C4.00798 10.0822 3.36989 9.90726 2.8 9.58997V9.63997C2.80489 10.5849 3.13599 11.4991 3.73731 12.2279C4.33864 12.9568 5.17326 13.4556 6.1 13.64C5.74326 13.7485 5.37288 13.8058 5 13.81C4.74189 13.807 4.48442 13.7835 4.23 13.74C4.49391 14.5528 5.00462 15.2631 5.69107 15.7721C6.37753 16.2811 7.20558 16.5635 8.06 16.58C6.6172 17.7152 4.83588 18.3348 3 18.34C2.66574 18.3411 2.33174 18.321 2 18.28C3.87443 19.4902 6.05881 20.1327 8.29 20.13C9.82969 20.146 11.3571 19.855 12.7831 19.274C14.2091 18.6931 15.505 17.8338 16.5952 16.7465C17.6854 15.6591 18.548 14.3654 19.1326 12.9409C19.7172 11.5164 20.012 9.98969 20 8.44997C20 8.27996 20 8.09997 20 7.91997C20.7847 7.33478 21.4615 6.61739 22 5.79997Z" fill="currentColor"/>
                    </svg>
                    Twitter
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleShare('facebook')}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="currentColor"/>
                    </svg>
                    Facebook
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleShare('email')}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{currentContent.confirmation.nextSteps}</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                        1
                      </div>
                      <p>{currentContent.confirmation.step1}</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                        2
                      </div>
                      <p>{currentContent.confirmation.step2}</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                        3
                      </div>
                      <p>{currentContent.confirmation.step3}</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                        4
                      </div>
                      <p>{currentContent.confirmation.step4}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  {currentContent.confirmation.viewJam3a}
                </Button>
                <Button onClick={() => {
                  setCurrentStep(1);
                  setSelectedProduct(null);
                  setJam3aDetails({
                    duration: '7',
                    category: '',
                    name: '',
                    description: '',
                    minParticipants: 5
                  });
                }}>
                  {currentContent.confirmation.startAnother}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StartJam3a;
