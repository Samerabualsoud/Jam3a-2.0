import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  Store, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Truck,
  DollarSign,
  FileText,
  Upload,
  AlertCircle
} from 'lucide-react';

const BecomeASeller = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Step state management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Saudi Arabia',
    website: '',
    description: '',
    categories: [],
    taxId: '',
    commercialRegister: '',
    bankName: '',
    bankAccount: '',
    iban: '',
    agreeTerms: false,
    agreeCommission: false
  });
  
  const content = {
    en: {
      title: "Become a Seller on Jam3a",
      subtitle: "Join our marketplace and reach thousands of customers through group buying",
      steps: {
        businessInfo: "Business Information",
        productInfo: "Product Information",
        financialInfo: "Financial Information",
        verification: "Verification"
      },
      businessInfo: {
        title: "Business Information",
        description: "Tell us about your business",
        businessName: "Business Name",
        businessNamePlaceholder: "Enter your business or store name",
        businessType: "Business Type",
        businessTypes: {
          individual: "Individual / Sole Proprietor",
          llc: "Limited Liability Company (LLC)",
          corporation: "Corporation",
          partnership: "Partnership"
        },
        contactName: "Contact Person Name",
        contactNamePlaceholder: "Full name of primary contact",
        email: "Email Address",
        emailPlaceholder: "business@example.com",
        phone: "Phone Number",
        phonePlaceholder: "+966 5X XXX XXXX",
        address: "Business Address",
        addressPlaceholder: "Street address",
        city: "City",
        cityPlaceholder: "City",
        country: "Country",
        website: "Website (Optional)",
        websitePlaceholder: "https://www.yourbusiness.com"
      },
      productInfo: {
        title: "Product Information",
        description: "Tell us about the products you want to sell",
        businessDescription: "Business Description",
        businessDescriptionPlaceholder: "Describe your business and what makes your products special",
        categories: "Product Categories",
        categoriesList: {
          electronics: "Electronics",
          homeAppliances: "Home Appliances",
          furniture: "Furniture",
          fashion: "Fashion & Accessories",
          beauty: "Beauty & Personal Care",
          toys: "Toys & Games",
          sports: "Sports & Outdoors",
          automotive: "Automotive",
          grocery: "Grocery & Gourmet Food",
          other: "Other"
        },
        productExamples: "Product Examples",
        productExamplesPlaceholder: "List some examples of products you plan to sell",
        pricing: "Pricing Range",
        pricingPlaceholder: "Typical price range of your products",
        inventory: "Inventory Capacity",
        inventoryPlaceholder: "How many units can you fulfill per month?"
      },
      financialInfo: {
        title: "Financial Information",
        description: "Provide your financial details for payments",
        taxId: "Tax ID / VAT Number",
        taxIdPlaceholder: "Enter your tax ID or VAT registration number",
        commercialRegister: "Commercial Registration Number",
        commercialRegisterPlaceholder: "Enter your commercial registration number",
        bankInfo: "Bank Information",
        bankName: "Bank Name",
        bankNamePlaceholder: "Enter your bank name",
        accountNumber: "Account Number",
        accountNumberPlaceholder: "Enter your account number",
        iban: "IBAN",
        ibanPlaceholder: "Enter your IBAN",
        commission: "Commission Structure",
        commissionDescription: "Jam3a charges a commission of 10% on each successful sale.",
        agreeCommission: "I agree to Jam3a's commission structure"
      },
      verification: {
        title: "Verification & Agreement",
        description: "Upload required documents and agree to terms",
        uploadTitle: "Upload Documents",
        uploadDescription: "Please upload the following documents for verification",
        idCard: "National ID / Iqama (Front & Back)",
        commercialRegister: "Commercial Registration Certificate",
        vatCertificate: "VAT Registration Certificate (if applicable)",
        bankStatement: "Recent Bank Statement",
        uploadButton: "Upload Document",
        termsTitle: "Terms & Conditions",
        termsDescription: "Please read and agree to our seller terms and conditions",
        agreeTerms: "I have read and agree to the Seller Terms & Conditions",
        privacyPolicy: "I understand and agree to Jam3a's Privacy Policy",
        submitApplication: "Submit Application"
      },
      benefits: {
        title: "Why Sell on Jam3a?",
        reach: {
          title: "Reach More Customers",
          description: "Access thousands of customers looking for group buying deals"
        },
        noFees: {
          title: "No Upfront Fees",
          description: "Only pay when you make a sale with our commission-based model"
        },
        growth: {
          title: "Grow Your Business",
          description: "Increase your sales volume through our innovative platform"
        },
        support: {
          title: "Dedicated Support",
          description: "Get help from our seller support team whenever you need it"
        }
      },
      buttons: {
        next: "Next",
        back: "Back",
        skip: "Skip"
      },
      success: {
        title: "Application Submitted Successfully!",
        description: "Thank you for applying to become a seller on Jam3a. We'll review your application and get back to you within 2-3 business days.",
        contactInfo: "If you have any questions, please contact our seller support team at sellers@jam3a.me",
        returnHome: "Return to Homepage"
      }
    },
    ar: {
      title: "كن بائعًا على جمعة",
      subtitle: "انضم إلى سوقنا وصل إلى آلاف العملاء من خلال الشراء الجماعي",
      steps: {
        businessInfo: "معلومات العمل",
        productInfo: "معلومات المنتج",
        financialInfo: "المعلومات المالية",
        verification: "التحقق"
      },
      businessInfo: {
        title: "معلومات العمل",
        description: "أخبرنا عن عملك",
        businessName: "اسم العمل",
        businessNamePlaceholder: "أدخل اسم عملك أو متجرك",
        businessType: "نوع العمل",
        businessTypes: {
          individual: "فرد / مالك وحيد",
          llc: "شركة ذات مسؤولية محدودة",
          corporation: "شركة",
          partnership: "شراكة"
        },
        contactName: "اسم الشخص المسؤول",
        contactNamePlaceholder: "الاسم الكامل لجهة الاتصال الرئيسية",
        email: "البريد الإلكتروني",
        emailPlaceholder: "business@example.com",
        phone: "رقم الهاتف",
        phonePlaceholder: "+966 5X XXX XXXX",
        address: "عنوان العمل",
        addressPlaceholder: "عنوان الشارع",
        city: "المدينة",
        cityPlaceholder: "المدينة",
        country: "البلد",
        website: "الموقع الإلكتروني (اختياري)",
        websitePlaceholder: "https://www.yourbusiness.com"
      },
      productInfo: {
        title: "معلومات المنتج",
        description: "أخبرنا عن المنتجات التي تريد بيعها",
        businessDescription: "وصف العمل",
        businessDescriptionPlaceholder: "صف عملك وما يجعل منتجاتك مميزة",
        categories: "فئات المنتجات",
        categoriesList: {
          electronics: "الإلكترونيات",
          homeAppliances: "الأجهزة المنزلية",
          furniture: "الأثاث",
          fashion: "الأزياء والإكسسوارات",
          beauty: "الجمال والعناية الشخصية",
          toys: "الألعاب",
          sports: "الرياضة والهواء الطلق",
          automotive: "السيارات",
          grocery: "البقالة والأطعمة الفاخرة",
          other: "أخرى"
        },
        productExamples: "أمثلة المنتجات",
        productExamplesPlaceholder: "اذكر بعض الأمثلة على المنتجات التي تخطط لبيعها",
        pricing: "نطاق الأسعار",
        pricingPlaceholder: "نطاق الأسعار النموذجي لمنتجاتك",
        inventory: "سعة المخزون",
        inventoryPlaceholder: "كم عدد الوحدات التي يمكنك توفيرها شهريًا؟"
      },
      financialInfo: {
        title: "المعلومات المالية",
        description: "قدم تفاصيلك المالية للمدفوعات",
        taxId: "الرقم الضريبي / رقم ضريبة القيمة المضافة",
        taxIdPlaceholder: "أدخل رقم التعريف الضريبي أو رقم تسجيل ضريبة القيمة المضافة",
        commercialRegister: "رقم السجل التجاري",
        commercialRegisterPlaceholder: "أدخل رقم السجل التجاري الخاص بك",
        bankInfo: "المعلومات المصرفية",
        bankName: "اسم البنك",
        bankNamePlaceholder: "أدخل اسم البنك الخاص بك",
        accountNumber: "رقم الحساب",
        accountNumberPlaceholder: "أدخل رقم حسابك",
        iban: "رقم الآيبان",
        ibanPlaceholder: "أدخل رقم الآيبان الخاص بك",
        commission: "هيكل العمولة",
        commissionDescription: "تفرض جمعة عمولة بنسبة 10٪ على كل عملية بيع ناجحة.",
        agreeCommission: "أوافق على هيكل عمولة جمعة"
      },
      verification: {
        title: "التحقق والاتفاق",
        description: "قم بتحميل المستندات المطلوبة والموافقة على الشروط",
        uploadTitle: "تحميل المستندات",
        uploadDescription: "يرجى تحميل المستندات التالية للتحقق",
        idCard: "الهوية الوطنية / الإقامة (الأمام والخلف)",
        commercialRegister: "شهادة السجل التجاري",
        vatCertificate: "شهادة تسجيل ضريبة القيمة المضافة (إن وجدت)",
        bankStatement: "كشف حساب بنكي حديث",
        uploadButton: "تحميل المستند",
        termsTitle: "الشروط والأحكام",
        termsDescription: "يرجى قراءة شروط وأحكام البائع والموافقة عليها",
        agreeTerms: "لقد قرأت ووافقت على شروط وأحكام البائع",
        privacyPolicy: "أفهم وأوافق على سياسة خصوصية جمعة",
        submitApplication: "تقديم الطلب"
      },
      benefits: {
        title: "لماذا تبيع على جمعة؟",
        reach: {
          title: "الوصول إلى المزيد من العملاء",
          description: "الوصول إلى آلاف العملاء الذين يبحثون عن صفقات الشراء الجماعي"
        },
        noFees: {
          title: "لا رسوم مقدمة",
          description: "ادفع فقط عندما تقوم بإجراء عملية بيع من خلال نموذج العمولة الخاص بنا"
        },
        growth: {
          title: "نمي عملك",
          description: "زيادة حجم مبيعاتك من خلال منصتنا المبتكرة"
        },
        support: {
          title: "دعم مخصص",
          description: "احصل على المساعدة من فريق دعم البائعين لدينا عندما تحتاج إليها"
        }
      },
      buttons: {
        next: "التالي",
        back: "رجوع",
        skip: "تخطي"
      },
      success: {
        title: "تم تقديم الطلب بنجاح!",
        description: "شكرًا لك على التقدم لتصبح بائعًا على جمعة. سنراجع طلبك ونرد عليك في غضون 2-3 أيام عمل.",
        contactInfo: "إذا كانت لديك أي أسئلة، يرجى الاتصال بفريق دعم البائعين لدينا على sellers@jam3a.me",
        returnHome: "العودة إلى الصفحة الرئيسية"
      }
    }
  };

  const currentContent = content[language];
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleCategoryToggle = (category) => {
    const updatedCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    
    setFormData({
      ...formData,
      categories: updatedCategories
    });
  };
  
  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.businessName || !formData.businessType || !formData.contactName || !formData.email || !formData.phone) {
        toast({
          title: language === 'en' ? "Please fill in all required fields" : "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.description || formData.categories.length === 0) {
        toast({
          title: language === 'en' ? "Please fill in all required fields" : "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.taxId || !formData.commercialRegister || !formData.bankName || !formData.iban || !formData.agreeCommission) {
        toast({
          title: language === 'en' ? "Please fill in all required fields and agree to the commission structure" : "يرجى ملء جميع الحقول المطلوبة والموافقة على هيكل العمولة",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.agreeTerms) {
        toast({
          title: language === 'en' ? "Please agree to the terms and conditions" : "يرجى الموافقة على الشروط والأحكام",
          variant: "destructive"
        });
        return;
      }
      
      // Submit application
      toast({
        title: language === 'en' ? "Submitting your application..." : "جارٍ تقديم طلبك...",
        variant: "default"
      });
      
      setTimeout(() => {
        toast({
          title: language === 'en' ? "Application submitted successfully!" : "تم تقديم الطلب بنجاح!",
          variant: "success"
        });
        setCurrentStep(5); // Success step
      }, 2000);
      
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
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
  
  const renderBusinessInfo = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentContent.businessInfo.title}</h2>
          <p className="text-muted-foreground">{currentContent.businessInfo.description}</p>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="businessName">{currentContent.businessInfo.businessName} *</Label>
                <Input
                  id="businessName"
                  placeholder={currentContent.businessInfo.businessNamePlaceholder}
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="businessType">{currentContent.businessInfo.businessType} *</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange('businessType', value)}
                >
                  <SelectTrigger id="businessType">
                    <SelectValue placeholder={currentContent.businessInfo.businessType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">{currentContent.businessInfo.businessTypes.individual}</SelectItem>
                    <SelectItem value="llc">{currentContent.businessInfo.businessTypes.llc}</SelectItem>
                    <SelectItem value="corporation">{currentContent.businessInfo.businessTypes.corporation}</SelectItem>
                    <SelectItem value="partnership">{currentContent.businessInfo.businessTypes.partnership}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="contactName">{currentContent.businessInfo.contactName} *</Label>
                <Input
                  id="contactName"
                  placeholder={currentContent.businessInfo.contactNamePlaceholder}
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email">{currentContent.businessInfo.email} *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={currentContent.businessInfo.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">{currentContent.businessInfo.phone} *</Label>
                <Input
                  id="phone"
                  placeholder={currentContent.businessInfo.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="address">{currentContent.businessInfo.address}</Label>
                <Input
                  id="address"
                  placeholder={currentContent.businessInfo.addressPlaceholder}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="city">{currentContent.businessInfo.city}</Label>
                <Input
                  id="city"
                  placeholder={currentContent.businessInfo.cityPlaceholder}
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="country">{currentContent.businessInfo.country}</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  disabled
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="website">{currentContent.businessInfo.website}</Label>
                <Input
                  id="website"
                  placeholder={currentContent.businessInfo.websitePlaceholder}
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderProductInfo = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentContent.productInfo.title}</h2>
          <p className="text-muted-foreground">{currentContent.productInfo.description}</p>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="description">{currentContent.productInfo.businessDescription} *</Label>
              <Textarea
                id="description"
                placeholder={currentContent.productInfo.businessDescriptionPlaceholder}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label>{currentContent.productInfo.categories} *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {Object.entries(currentContent.productInfo.categoriesList).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox 
                      id={key} 
                      checked={formData.categories.includes(key)}
                      onCheckedChange={() => handleCategoryToggle(key)}
                    />
                    <Label htmlFor={key} className="cursor-pointer">{value}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="productExamples">{currentContent.productInfo.productExamples}</Label>
              <Textarea
                id="productExamples"
                placeholder={currentContent.productInfo.productExamplesPlaceholder}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricing">{currentContent.productInfo.pricing}</Label>
                <Input
                  id="pricing"
                  placeholder={currentContent.productInfo.pricingPlaceholder}
                />
              </div>
              
              <div>
                <Label htmlFor="inventory">{currentContent.productInfo.inventory}</Label>
                <Input
                  id="inventory"
                  placeholder={currentContent.productInfo.inventoryPlaceholder}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderFinancialInfo = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentContent.financialInfo.title}</h2>
          <p className="text-muted-foreground">{currentContent.financialInfo.description}</p>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxId">{currentContent.financialInfo.taxId} *</Label>
                <Input
                  id="taxId"
                  placeholder={currentContent.financialInfo.taxIdPlaceholder}
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="commercialRegister">{currentContent.financialInfo.commercialRegister} *</Label>
                <Input
                  id="commercialRegister"
                  placeholder={currentContent.financialInfo.commercialRegisterPlaceholder}
                  value={formData.commercialRegister}
                  onChange={(e) => handleInputChange('commercialRegister', e.target.value)}
                />
              </div>
            </div>
            
            <Separator />
            
            <h3 className="font-medium">{currentContent.financialInfo.bankInfo}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">{currentContent.financialInfo.bankName} *</Label>
                <Input
                  id="bankName"
                  placeholder={currentContent.financialInfo.bankNamePlaceholder}
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="bankAccount">{currentContent.financialInfo.accountNumber}</Label>
                <Input
                  id="bankAccount"
                  placeholder={currentContent.financialInfo.accountNumberPlaceholder}
                  value={formData.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="iban">{currentContent.financialInfo.iban} *</Label>
                <Input
                  id="iban"
                  placeholder={currentContent.financialInfo.ibanPlaceholder}
                  value={formData.iban}
                  onChange={(e) => handleInputChange('iban', e.target.value)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium">{currentContent.financialInfo.commission}</h3>
              <p className="text-sm text-muted-foreground mt-1">{currentContent.financialInfo.commissionDescription}</p>
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="agreeCommission" 
                  checked={formData.agreeCommission}
                  onCheckedChange={(checked) => handleInputChange('agreeCommission', checked)}
                />
                <Label htmlFor="agreeCommission">{currentContent.financialInfo.agreeCommission} *</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderVerification = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentContent.verification.title}</h2>
          <p className="text-muted-foreground">{currentContent.verification.description}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{currentContent.verification.uploadTitle}</CardTitle>
            <CardDescription>{currentContent.verification.uploadDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">{currentContent.verification.idCard}</h4>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  {currentContent.verification.uploadButton}
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">{currentContent.verification.commercialRegister}</h4>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  {currentContent.verification.uploadButton}
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">{currentContent.verification.vatCertificate}</h4>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  {currentContent.verification.uploadButton}
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">{currentContent.verification.bankStatement}</h4>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  {currentContent.verification.uploadButton}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{currentContent.verification.termsTitle}</CardTitle>
            <CardDescription>{currentContent.verification.termsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
              <p className="text-sm">
                {language === 'en' 
                  ? "By agreeing to these Seller Terms & Conditions, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions set forth herein. These terms govern your participation as a seller on the Jam3a platform and outline the rights and responsibilities of both parties."
                  : "بالموافقة على شروط وأحكام البائع هذه، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بجميع الشروط والأحكام المنصوص عليها هنا. تحكم هذه الشروط مشاركتك كبائع على منصة جمعة وتحدد حقوق ومسؤوليات كلا الطرفين."}
              </p>
              <p className="text-sm mt-2">
                {language === 'en'
                  ? "Jam3a reserves the right to modify these terms at any time, with notice provided to sellers. Continued use of the platform after such modifications constitutes acceptance of the updated terms."
                  : "تحتفظ جمعة بالحق في تعديل هذه الشروط في أي وقت، مع تقديم إشعار للبائعين. يشكل الاستمرار في استخدام المنصة بعد هذه التعديلات قبولًا للشروط المحدثة."}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreeTerms" 
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                />
                <Label htmlFor="agreeTerms">{currentContent.verification.agreeTerms} *</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="privacyPolicy" />
                <Label htmlFor="privacyPolicy">{currentContent.verification.privacyPolicy}</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleNextStep}
            >
              {currentContent.verification.submitApplication}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderSuccess = () => {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">{currentContent.success.title}</h2>
        <p className="text-muted-foreground">{currentContent.success.description}</p>
        <p className="text-sm">{currentContent.success.contactInfo}</p>
        
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          {currentContent.success.returnHome}
        </Button>
      </div>
    );
  };
  
  const renderBenefits = () => {
    return (
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-center mb-8">{currentContent.benefits.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-jam3a-purple" />
                </div>
                <h3 className="font-bold mb-2">{currentContent.benefits.reach.title}</h3>
                <p className="text-sm text-muted-foreground">{currentContent.benefits.reach.description}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">{currentContent.benefits.noFees.title}</h3>
                <p className="text-sm text-muted-foreground">{currentContent.benefits.noFees.description}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">{currentContent.benefits.growth.title}</h3>
                <p className="text-sm text-muted-foreground">{currentContent.benefits.growth.description}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-bold mb-2">{currentContent.benefits.support.title}</h3>
                <p className="text-sm text-muted-foreground">{currentContent.benefits.support.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBusinessInfo();
      case 2:
        return renderProductInfo();
      case 3:
        return renderFinancialInfo();
      case 4:
        return renderVerification();
      case 5:
        return renderSuccess();
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
          
          {currentStep < 5 && renderStepIndicator()}
          
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
          
          {currentStep < 5 && renderBenefits()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeASeller;
