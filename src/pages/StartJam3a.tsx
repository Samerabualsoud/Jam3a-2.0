import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

// Mock product data
const demoProducts = [
  {
    id: 1,
    name: {
      en: "Samsung 55-inch 4K Smart TV",
      ar: "تلفزيون سامسونج ذكي 55 بوصة بدقة 4K"
    },
    category: {
      en: "Electronics",
      ar: "إلكترونيات"
    },
    description: {
      en: "Experience stunning 4K resolution and smart features for an immersive viewing experience.",
      ar: "استمتع بدقة 4K مذهلة وميزات ذكية لتجربة مشاهدة غامرة."
    },
    regularPrice: 2499,
    jam3aPrice: 1999,
    discount: 20,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    minParticipants: 5
  },
  {
    id: 2,
    name: {
      en: "Apple iPhone 14 Pro - 256GB",
      ar: "آيفون 14 برو - 256 جيجابايت"
    },
    category: {
      en: "Smartphones",
      ar: "هواتف ذكية"
    },
    description: {
      en: "The latest iPhone with advanced camera system, A16 Bionic chip, and stunning Super Retina XDR display.",
      ar: "أحدث آيفون مع نظام كاميرا متطور، شريحة A16 Bionic، وشاشة Super Retina XDR مذهلة."
    },
    regularPrice: 4799,
    jam3aPrice: 4199,
    discount: 12.5,
    image: "https://images.unsplash.com/photo-1678911820864-e5a3eb4d8bf8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
    minParticipants: 5
  },
  {
    id: 3,
    name: {
      en: "Dyson V12 Detect Slim Cordless Vacuum",
      ar: "مكنسة دايسون V12 ديتكت سليم لاسلكية"
    },
    category: {
      en: "Home Appliances",
      ar: "أجهزة منزلية"
    },
    description: {
      en: "Powerful cordless vacuum with laser dust detection and intelligent suction optimization.",
      ar: "مكنسة كهربائية لاسلكية قوية مع كشف الغبار بالليزر وتحسين الشفط الذكي."
    },
    regularPrice: 2899,
    jam3aPrice: 2299,
    discount: 20.7,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    minParticipants: 5
  },
  {
    id: 4,
    name: {
      en: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      ar: "سماعات سوني WH-1000XM5 لاسلكية بخاصية إلغاء الضوضاء"
    },
    category: {
      en: "Audio",
      ar: "صوتيات"
    },
    description: {
      en: "Industry-leading noise cancellation with exceptional sound quality and long battery life.",
      ar: "إلغاء ضوضاء رائد في الصناعة مع جودة صوت استثنائية وعمر بطارية طويل."
    },
    regularPrice: 1499,
    jam3aPrice: 1199,
    discount: 20,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
    minParticipants: 5
  },
  {
    id: 5,
    name: {
      en: "KitchenAid Stand Mixer - Professional Series",
      ar: "خلاط كيتشن ايد - سلسلة احترافية"
    },
    category: {
      en: "Kitchen Appliances",
      ar: "أجهزة المطبخ"
    },
    description: {
      en: "Professional-grade stand mixer with powerful motor and versatile attachments for all your baking needs.",
      ar: "خلاط احترافي بمحرك قوي وملحقات متنوعة لجميع احتياجات الخبز الخاصة بك."
    },
    regularPrice: 1899,
    jam3aPrice: 1499,
    discount: 21,
    image: "https://images.unsplash.com/photo-1594495894542-a46cc73e081a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    minParticipants: 5
  }
];

const StartJam3a = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
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
  
  // Mock user profile data
  const userProfile = user || {
    name: 'Mohammed Al-Qahtani',
    email: 'mohammed@example.com',
    phone: '+966 50 123 4567',
    address: 'King Fahd Road, Riyadh, Saudi Arabia'
  };
  
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
        description: "Configure the details of your Jam3a",
        duration: "Jam3a Duration",
        durationDays: "days",
        category: "Product Category",
        jam3aName: "Jam3a Name",
        jam3aNamePlaceholder: "Give your Jam3a a catchy name",
        description: "Description",
        descriptionPlaceholder: "Describe your Jam3a to attract participants",
        minParticipants: "Minimum Participants",
        minParticipantsNote: "Minimum 5 participants required for a successful Jam3a",
        personalInfo: "Your Information",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        address: "Shipping Address"
      },
      payment: {
        title: "Payment",
        description: "Complete your payment to start the Jam3a",
        productDetails: "Product Details",
        product: "Product",
        price: "Price",
        shipping: "Shipping",
        tax: "Tax (15% VAT)",
        total: "Total",
        paymentMethod: "Payment Method",
        creditCard: "Credit/Debit Card",
        applePay: "Apple Pay",
        stcPay: "STC Pay",
        cardNumber: "Card Number",
        cardNumberPlaceholder: "1234 5678 9012 3456",
        expiryDate: "Expiry Date",
        expiryDatePlaceholder: "MM/YY",
        cvv: "CVV",
        cvvPlaceholder: "123",
        nameOnCard: "Name on Card",
        nameOnCardPlaceholder: "Enter name as it appears on card",
        saveCard: "Save card for future payments",
        payNow: "Pay Now",
        currency: "SAR",
        free: "Free"
      },
      confirmation: {
        title: "Jam3a Created Successfully!",
        description: "Your Jam3a has been created and is now active",
        jam3aId: "Jam3a ID",
        status: "Status",
        statusActive: "Active",
        participants: "Current Participants",
        goal: "Participant Goal",
        expiresOn: "Expires On",
        shareTitle: "Share Your Jam3a",
        shareDescription: "Invite friends and family to join your Jam3a and get the discount",
        shareOptions: {
          whatsapp: "Share on WhatsApp",
          twitter: "Share on Twitter",
          facebook: "Share on Facebook",
          email: "Share via Email"
        },
        viewJam3a: "View Your Jam3a",
        createAnother: "Create Another Jam3a"
      },
      buttons: {
        next: "Next",
        back: "Back",
        skip: "Skip"
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
        description: "قم بتكوين تفاصيل جمعتك",
        duration: "مدة الجمعة",
        durationDays: "أيام",
        category: "فئة المنتج",
        jam3aName: "اسم الجمعة",
        jam3aNamePlaceholder: "امنح جمعتك اسمًا جذابًا",
        description: "الوصف",
        descriptionPlaceholder: "صف جمعتك لجذب المشاركين",
        minParticipants: "الحد الأدنى للمشاركين",
        minParticipantsNote: "مطلوب 5 مشاركين على الأقل لنجاح الجمعة",
        personalInfo: "معلوماتك",
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        address: "عنوان الشحن"
      },
      payment: {
        title: "الدفع",
        description: "أكمل عملية الدفع لبدء الجمعة",
        productDetails: "تفاصيل المنتج",
        product: "المنتج",
        price: "السعر",
        shipping: "الشحن",
        tax: "الضريبة (15% ضريبة القيمة المضافة)",
        total: "المجموع",
        paymentMethod: "طريقة الدفع",
        creditCard: "بطاقة ائتمان/خصم",
        applePay: "آبل باي",
        stcPay: "STC Pay",
        cardNumber: "رقم البطاقة",
        cardNumberPlaceholder: "1234 5678 9012 3456",
        expiryDate: "تاريخ الانتهاء",
        expiryDatePlaceholder: "شهر/سنة",
        cvv: "رمز التحقق",
        cvvPlaceholder: "123",
        nameOnCard: "الاسم على البطاقة",
        nameOnCardPlaceholder: "أدخل الاسم كما يظهر على البطاقة",
        saveCard: "حفظ البطاقة للمدفوعات المستقبلية",
        payNow: "ادفع الآن",
        currency: "ريال",
        free: "مجاني"
      },
      confirmation: {
        title: "تم إنشاء الجمعة بنجاح!",
        description: "تم إنشاء جمعتك وهي الآن نشطة",
        jam3aId: "معرف الجمعة",
        status: "الحالة",
        statusActive: "نشطة",
        participants: "المشاركون الحاليون",
        goal: "هدف المشاركين",
        expiresOn: "تنتهي في",
        shareTitle: "شارك جمعتك",
        shareDescription: "ادعُ الأصدقاء والعائلة للانضمام إلى جمعتك والحصول على الخصم",
        shareOptions: {
          whatsapp: "مشاركة على واتساب",
          twitter: "مشاركة على تويتر",
          facebook: "مشاركة على فيسبوك",
          email: "مشاركة عبر البريد الإلكتروني"
        },
        viewJam3a: "عرض جمعتك",
        createAnother: "إنشاء جمعة أخرى"
      },
      buttons: {
        next: "التالي",
        back: "رجوع",
        skip: "تخطي"
      }
    }
  };

  const currentContent = content[language];
  
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setJam3aDetails({
      ...jam3aDetails,
      category: product.category[language],
      name: `${product.name[language]} Jam3a`,
      description: product.description[language],
      minParticipants: product.minParticipants
    });
  };
  
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedProduct) {
      toast({
        title: language === 'en' ? "Please select a product" : "الرجاء اختيار منتج",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 3) {
      // Simulate payment processing
      toast({
        title: language === 'en' ? "Processing payment..." : "جارٍ معالجة الدفع...",
        variant: "default"
      });
      
      setTimeout(() => {
        toast({
          title: language === 'en' ? "Payment successful!" : "تم الدفع بنجاح!",
          variant: "success"
        });
        setCurrentStep(currentStep + 1);
      }, 2000);
      
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleShareOptionChange = (option) => {
    setShareOptions({
      ...shareOptions,
      [option]: !shareOptions[option]
    });
  };
  
  const handleShare = (platform) => {
    const jam3aUrl = "https://jam3a.me/j/123456";
    const jam3aName = selectedProduct.name[language];
    const jam3aPrice = selectedProduct.jam3aPrice;
    const currency = language === 'en' ? "SAR" : "ريال";
    
    let shareUrl = "";
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`Join my Jam3a for ${jam3aName} at ${jam3aPrice} ${currency}! ${jam3aUrl}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join my Jam3a for ${jam3aName} at ${jam3aPrice} ${currency}!`)}&url=${encodeURIComponent(jam3aUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jam3aUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Join my Jam3a for ${jam3aName}`)}&body=${encodeURIComponent(`I've started a Jam3a for ${jam3aName} at ${jam3aPrice} ${currency}! Join now at ${jam3aUrl}`)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className="flex justify-between">
          {Object.values(currentContent.steps).map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center ${index + 1 === currentStep ? 'text-jam3a-purple' : index + 1 < currentStep ? 'text-green-500' : 'text-gray-400'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                index + 1 === currentStep ? 'bg-jam3a-purple text-white' : 
                index + 1 < currentStep ? 'bg-green-500 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {index + 1 < currentStep ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <span className="text-sm text-center">{step}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-jam3a-purple transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (Object.keys(currentContent.steps).length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  const renderProductSelection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentContent.productSelection.title}</h2>
          <p className="text-muted-foreground">{currentContent.productSelection.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProducts.map((product) => (
            <Card 
              key={product.id} 
              className={`overflow-hidden transition-all ${selectedProduct?.id === product.id ? 'ring-2 ring-jam3a-purple' : ''}`}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name[language]} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name[language]}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description[language]}</p>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{currentContent.productSelection.regularPrice}</span>
                  <span className="text-sm line-through">{product.regularPrice} {currentContent.productSelection.currency}</span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{currentContent.productSelection.jam3aPrice}</span>
                  <span className="text-lg font-bold text-jam3a-purple">{product.jam3aPrice} {currentContent.productSelection.currency}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">{currentContent.productSelection.discount}</span>
                  <span className="text-sm font-medium text-green-600">-{product.discount}%</span>
                </div>
                
                <Button 
                  variant={selectedProduct?.id === product.id ? "secondary" : "default"}
                  className="w-full"
                  onClick={() => handleProductSelect(product)}
                >
                  {selectedProduct?.id === product.id ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {currentContent.productSelection.selected}
                    </>
                  ) : (
                    currentContent.productSelection.select
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  const renderJam3aSetup = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentContent.jam3aSetup.title}</h2>
          <p className="text-muted-foreground">{currentContent.jam3aSetup.description}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{selectedProduct.name[language]}</CardTitle>
            <CardDescription>
              {currentContent.productSelection.jam3aPrice}: {selectedProduct.jam3aPrice} {currentContent.productSelection.currency}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="duration">{currentContent.jam3aSetup.duration}</Label>
                <Select
                  value={jam3aDetails.duration}
                  onValueChange={(value) => setJam3aDetails({...jam3aDetails, duration: value})}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder={currentContent.jam3aSetup.duration} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 {currentContent.jam3aSetup.durationDays}</SelectItem>
                    <SelectItem value="5">5 {currentContent.jam3aSetup.durationDays}</SelectItem>
                    <SelectItem value="7">7 {currentContent.jam3aSetup.durationDays}</SelectItem>
                    <SelectItem value="10">10 {currentContent.jam3aSetup.durationDays}</SelectItem>
                    <SelectItem value="14">14 {currentContent.jam3aSetup.durationDays}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">{currentContent.jam3aSetup.category}</Label>
                <Input
                  id="category"
                  value={jam3aDetails.category}
                  onChange={(e) => setJam3aDetails({...jam3aDetails, category: e.target.value})}
                  disabled
                />
              </div>
              
              <div>
                <Label htmlFor="jam3aName">{currentContent.jam3aSetup.jam3aName}</Label>
                <Input
                  id="jam3aName"
                  placeholder={currentContent.jam3aSetup.jam3aNamePlaceholder}
                  value={jam3aDetails.name}
                  onChange={(e) => setJam3aDetails({...jam3aDetails, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="description">{currentContent.jam3aSetup.description}</Label>
                <Input
                  id="description"
                  placeholder={currentContent.jam3aSetup.descriptionPlaceholder}
                  value={jam3aDetails.description}
                  onChange={(e) => setJam3aDetails({...jam3aDetails, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="minParticipants">{currentContent.jam3aSetup.minParticipants}</Label>
                <Input
                  id="minParticipants"
                  type="number"
                  min="5"
                  value={jam3aDetails.minParticipants}
                  onChange={(e) => setJam3aDetails({...jam3aDetails, minParticipants: Math.max(5, parseInt(e.target.value))})}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  <AlertCircle className="inline-block h-3 w-3 mr-1" />
                  {currentContent.jam3aSetup.minParticipantsNote}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{currentContent.jam3aSetup.personalInfo}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{currentContent.jam3aSetup.name}</Label>
                  <div className="flex items-center border rounded-md px-3 py-2 bg-muted">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{userProfile.name}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">{currentContent.jam3aSetup.email}</Label>
                  <div className="flex items-center border rounded-md px-3 py-2 bg-muted">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{userProfile.email}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">{currentContent.jam3aSetup.phone}</Label>
                  <div className="flex items-center border rounded-md px-3 py-2 bg-muted">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{userProfile.phone}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">{currentContent.jam3aSetup.address}</Label>
                  <div className="flex items-center border rounded-md px-3 py-2 bg-muted">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{userProfile.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderPayment = () => {
    // Calculate totals
    const productPrice = selectedProduct.jam3aPrice;
    const shipping = 0; // Free shipping
    const tax = Math.round(productPrice * 0.15); // 15% VAT
    const total = productPrice + shipping + tax;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentContent.payment.title}</h2>
          <p className="text-muted-foreground">{currentContent.payment.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.payment.productDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name[language]} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedProduct.name[language]}</h3>
                  <p className="text-sm text-muted-foreground">{jam3aDetails.category}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{currentContent.payment.price}</span>
                  <span>{productPrice} {currentContent.payment.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentContent.payment.shipping}</span>
                  <span className="text-green-600">{currentContent.payment.free}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentContent.payment.tax}</span>
                  <span>{tax} {currentContent.payment.currency}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>{currentContent.payment.total}</span>
                  <span>{total} {currentContent.payment.currency}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.payment.paymentMethod}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {currentContent.payment.creditCard}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apple_pay" id="apple_pay" />
                  <Label htmlFor="apple_pay">{currentContent.payment.applePay}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stc_pay" id="stc_pay" />
                  <Label htmlFor="stc_pay">{currentContent.payment.stcPay}</Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="cardNumber">{currentContent.payment.cardNumber}</Label>
                    <Input
                      id="cardNumber"
                      placeholder={currentContent.payment.cardNumberPlaceholder}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">{currentContent.payment.expiryDate}</Label>
                      <Input
                        id="expiryDate"
                        placeholder={currentContent.payment.expiryDatePlaceholder}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">{currentContent.payment.cvv}</Label>
                      <Input
                        id="cvv"
                        placeholder={currentContent.payment.cvvPlaceholder}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="nameOnCard">{currentContent.payment.nameOnCard}</Label>
                    <Input
                      id="nameOnCard"
                      placeholder={currentContent.payment.nameOnCardPlaceholder}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="saveCard" />
                    <Label htmlFor="saveCard">{currentContent.payment.saveCard}</Label>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleNextStep}
              >
                {currentContent.payment.payNow}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderConfirmation = () => {
    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(jam3aDetails.duration));
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">{currentContent.confirmation.title}</h2>
          <p className="text-muted-foreground">{currentContent.confirmation.description}</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-md overflow-hidden">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name[language]} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedProduct.name[language]}</h3>
                    <p className="text-sm text-muted-foreground">{jam3aDetails.category}</p>
                    <p className="text-lg font-bold text-jam3a-purple">{selectedProduct.jam3aPrice} {currentContent.productSelection.currency}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{currentContent.confirmation.jam3aId}</p>
                    <p className="font-medium">JAM-123456</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{currentContent.confirmation.status}</p>
                    <p className="font-medium text-green-600">{currentContent.confirmation.statusActive}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{currentContent.confirmation.participants}</p>
                    <p className="font-medium">1 / {jam3aDetails.minParticipants}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{currentContent.confirmation.expiresOn}</p>
                    <p className="font-medium">{expiryDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">{currentContent.confirmation.shareTitle}</h3>
                <p className="text-sm text-muted-foreground">{currentContent.confirmation.shareDescription}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="whatsapp" 
                      checked={shareOptions.whatsapp}
                      onCheckedChange={() => handleShareOptionChange('whatsapp')}
                    />
                    <Label htmlFor="whatsapp">{currentContent.confirmation.shareOptions.whatsapp}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="twitter" 
                      checked={shareOptions.twitter}
                      onCheckedChange={() => handleShareOptionChange('twitter')}
                    />
                    <Label htmlFor="twitter">{currentContent.confirmation.shareOptions.twitter}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="facebook" 
                      checked={shareOptions.facebook}
                      onCheckedChange={() => handleShareOptionChange('facebook')}
                    />
                    <Label htmlFor="facebook">{currentContent.confirmation.shareOptions.facebook}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email" 
                      checked={shareOptions.email}
                      onCheckedChange={() => handleShareOptionChange('email')}
                    />
                    <Label htmlFor="email">{currentContent.confirmation.shareOptions.email}</Label>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    // Share to all selected platforms
                    Object.entries(shareOptions).forEach(([platform, isSelected]) => {
                      if (isSelected) {
                        handleShare(platform);
                      }
                    });
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Share Now' : 'شارك الآن'}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => navigate('/my-jam3a')}
            >
              {currentContent.confirmation.viewJam3a}
            </Button>
            <Button 
              onClick={() => {
                setCurrentStep(1);
                setSelectedProduct(null);
                setJam3aDetails({
                  duration: '7',
                  category: '',
                  name: '',
                  description: '',
                  minParticipants: 5
                });
              }}
            >
              {currentContent.confirmation.createAnother}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderProductSelection();
      case 2:
        return renderJam3aSetup();
      case 3:
        return renderPayment();
      case 4:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
            <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
          </div>
          
          {renderStepIndicator()}
          
          <div className="max-w-5xl mx-auto">
            {renderCurrentStep()}
            
            {currentStep < 4 && (
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousStep}
                  >
                    {currentContent.buttons.back}
                  </Button>
                ) : (
                  <div></div>
                )}
                
                <Button 
                  onClick={handleNextStep}
                >
                  {currentContent.buttons.next}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StartJam3a;
