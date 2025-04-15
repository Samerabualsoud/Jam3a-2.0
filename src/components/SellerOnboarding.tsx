import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Store, 
  Upload, 
  CreditCard, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';

const SellerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
  // Form states
  const [sellerInfo, setSellerInfo] = useState({
    storeName: '',
    storeDescription: '',
    storeNameAr: '',
    storeDescriptionAr: '',
    category: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: 'Saudi Arabia',
    taxId: '',
    website: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: ''
    }
  });
  
  const [documents, setDocuments] = useState({
    businessLicense: null,
    identityProof: null,
    bankStatement: null,
    additionalDocuments: []
  });
  
  const [bankInfo, setBankInfo] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    iban: '',
    swiftCode: ''
  });
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Handle form input changes
  const handleSellerInfoChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSellerInfo({
        ...sellerInfo,
        [parent]: {
          ...sellerInfo[parent],
          [child]: value
        }
      });
    } else {
      setSellerInfo({
        ...sellerInfo,
        [name]: value
      });
    }
  };
  
  const handleBankInfoChange = (e) => {
    const { name, value } = e.target;
    setBankInfo({
      ...bankInfo,
      [name]: value
    });
  };
  
  const handleFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      if (documentType === 'additionalDocuments') {
        setDocuments({
          ...documents,
          additionalDocuments: [...documents.additionalDocuments, file]
        });
      } else {
        setDocuments({
          ...documents,
          [documentType]: file
        });
      }
      
      toast({
        title: language === 'en' ? 'File Uploaded' : 'تم رفع الملف',
        description: language === 'en' 
          ? `${file.name} has been uploaded successfully.` 
          : `تم رفع ${file.name} بنجاح.`
      });
    }
  };
  
  const handleRemoveFile = (documentType, index = null) => {
    if (documentType === 'additionalDocuments' && index !== null) {
      const updatedDocs = [...documents.additionalDocuments];
      updatedDocs.splice(index, 1);
      setDocuments({
        ...documents,
        additionalDocuments: updatedDocs
      });
    } else {
      setDocuments({
        ...documents,
        [documentType]: null
      });
    }
  };
  
  // Handle step navigation
  const nextStep = () => {
    if (currentStep === 1 && !validateSellerInfo()) return;
    if (currentStep === 2 && !validateDocuments()) return;
    if (currentStep === 3 && !validateBankInfo()) return;
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Form validation
  const validateSellerInfo = () => {
    if (!sellerInfo.storeName || !sellerInfo.storeDescription || !sellerInfo.category || !sellerInfo.phoneNumber) {
      toast({
        title: language === 'en' ? 'Missing Information' : 'معلومات ناقصة',
        description: language === 'en' 
          ? 'Please fill in all required fields.' 
          : 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };
  
  const validateDocuments = () => {
    if (!documents.businessLicense || !documents.identityProof) {
      toast({
        title: language === 'en' ? 'Missing Documents' : 'مستندات ناقصة',
        description: language === 'en' 
          ? 'Please upload all required documents.' 
          : 'يرجى تحميل جميع المستندات المطلوبة.',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };
  
  const validateBankInfo = () => {
    if (!bankInfo.accountName || !bankInfo.accountNumber || !bankInfo.bankName || !bankInfo.iban) {
      toast({
        title: language === 'en' ? 'Missing Banking Information' : 'معلومات مصرفية ناقصة',
        description: language === 'en' 
          ? 'Please fill in all required banking fields.' 
          : 'يرجى ملء جميع الحقول المصرفية المطلوبة.',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };
  
  // Submit the seller application
  const handleSubmit = async () => {
    if (!termsAccepted) {
      toast({
        title: language === 'en' ? 'Terms Not Accepted' : 'لم يتم قبول الشروط',
        description: language === 'en' 
          ? 'Please accept the terms and conditions to continue.' 
          : 'يرجى قبول الشروط والأحكام للمتابعة.',
        variant: 'destructive'
      });
      return;
    }
    
    // Here you would typically send the data to your backend
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user role
      if (user) {
        updateUser({
          ...user,
          isSeller: true,
          roles: [...(user.roles || []), 'seller']
        });
      }
      
      toast({
        title: language === 'en' ? 'Application Submitted' : 'تم تقديم الطلب',
        description: language === 'en' 
          ? 'Your seller application has been submitted successfully. We will review it and get back to you soon.' 
          : 'تم تقديم طلب البائع الخاص بك بنجاح. سنقوم بمراجعته والرد عليك قريبًا.'
      });
      
      // Redirect to seller dashboard or confirmation page
      navigate('/seller/pending');
    } catch (error) {
      toast({
        title: language === 'en' ? 'Submission Failed' : 'فشل التقديم',
        description: language === 'en' 
          ? 'There was an error submitting your application. Please try again.' 
          : 'حدث خطأ أثناء تقديم طلبك. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    }
  };
  
  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
        
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step} 
            className={`relative z-10 flex flex-col items-center`}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                step
              )}
            </div>
            <span className="text-sm mt-2 text-center">
              {language === 'en' ? (
                step === 1 ? 'Store Info' :
                step === 2 ? 'Documents' :
                step === 3 ? 'Banking' :
                'Review'
              ) : (
                step === 1 ? 'معلومات المتجر' :
                step === 2 ? 'المستندات' :
                step === 3 ? 'المعلومات المصرفية' :
                'المراجعة'
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStoreInfoStep();
      case 2:
        return renderDocumentsStep();
      case 3:
        return renderBankingStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };
  
  // Step 1: Store Information
  const renderStoreInfoStep = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Store Information' : 'معلومات المتجر'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Provide details about your store and business' 
              : 'قدم تفاصيل حول متجرك وعملك'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="en" onValueChange={(value) => setLanguage(value as 'en' | 'ar')}>
            <TabsList className="mb-4">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">
                  Store Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={sellerInfo.storeName}
                  onChange={handleSellerInfoChange}
                  placeholder="Enter your store name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeDescription">
                  Store Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={sellerInfo.storeDescription}
                  onChange={handleSellerInfoChange}
                  placeholder="Describe your store and what you sell"
                  rows={4}
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="ar" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeNameAr">
                  اسم المتجر <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="storeNameAr"
                  name="storeNameAr"
                  value={sellerInfo.storeNameAr}
                  onChange={handleSellerInfoChange}
                  placeholder="أدخل اسم متجرك"
                  required
                  dir="rtl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeDescriptionAr">
                  وصف المتجر <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="storeDescriptionAr"
                  name="storeDescriptionAr"
                  value={sellerInfo.storeDescriptionAr}
                  onChange={handleSellerInfoChange}
                  placeholder="صف متجرك وما تبيعه"
                  rows={4}
                  required
                  dir="rtl"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                {language === 'en' ? 'Store Category' : 'فئة المتجر'} <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={sellerInfo.category} 
                onValueChange={(value) => setSellerInfo({...sellerInfo, category: value})}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={language === 'en' ? "Select a category" : "اختر فئة"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">
                    {language === 'en' ? 'Electronics' : 'إلكترونيات'}
                  </SelectItem>
                  <SelectItem value="fashion">
                    {language === 'en' ? 'Fashion' : 'أزياء'}
                  </SelectItem>
                  <SelectItem value="home">
                    {language === 'en' ? 'Home & Garden' : 'المنزل والحديقة'}
                  </SelectItem>
                  <SelectItem value="beauty">
                    {language === 'en' ? 'Beauty & Personal Care' : 'الجمال والعناية الشخصية'}
                  </SelectItem>
                  <SelectItem value="food">
                    {language === 'en' ? 'Food & Grocery' : 'الطعام والبقالة'}
                  </SelectItem>
                  <SelectItem value="other">
                    {language === 'en' ? 'Other' : 'أخرى'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                {language === 'en' ? 'Business Phone Number' : 'رقم هاتف العمل'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={sellerInfo.phoneNumber}
                onChange={handleSellerInfoChange}
                placeholder={language === 'en' ? "+966 XX XXX XXXX" : "+966 XX XXX XXXX"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">
                {language === 'en' ? 'Business Address' : 'عنوان العمل'}
              </Label>
              <Input
                id="address"
                name="address"
                value={sellerInfo.address}
                onChange={handleSellerInfoChange}
                placeholder={language === 'en' ? "Enter your business address" : "أدخل عنوان عملك"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">
                {language === 'en' ? 'City' : 'المدينة'}
              </Label>
              <Input
                id="city"
                name="city"
                value={sellerInfo.city}
                onChange={handleSellerInfoChange}
                placeholder={language === 'en' ? "Enter your city" : "أدخل مدينتك"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId">
                {language === 'en' ? 'Tax ID / VAT Number' : 'الرقم الضريبي / رقم ضريبة القيمة المضافة'}
              </Label>
              <Input
                id="taxId"
                name="taxId"
                value={sellerInfo.taxId}
                onChange={handleSellerInfoChange}
                placeholder={language === 'en' ? "Enter your tax ID" : "أدخل الرقم الضريبي الخاص بك"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">
                {language === 'en' ? 'Website (if any)' : 'الموقع الإلكتروني (إن وجد)'}
              </Label>
              <Input
                id="website"
                name="website"
                value={sellerInfo.website}
                onChange={handleSellerInfoChange}
                placeholder={language === 'en' ? "https://yourwebsite.com" : "https://yourwebsite.com"}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === 'en' ? 'Social Media (Optional)' : 'وسائل التواصل الاجتماعي (اختياري)'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="socialMedia.instagram"
                  value={sellerInfo.socialMedia.instagram}
                  onChange={handleSellerInfoChange}
                  placeholder="@username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="socialMedia.twitter"
                  value={sellerInfo.socialMedia.twitter}
                  onChange={handleSellerInfoChange}
                  placeholder="@username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="socialMedia.facebook"
                  value={sellerInfo.socialMedia.facebook}
                  onChange={handleSellerInfoChange}
                  placeholder="facebook.com/pagename"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={nextStep}>
            {language === 'en' ? 'Next: Documents' : 'التالي: المستندات'}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Step 2: Documents
  const renderDocumentsStep = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Required Documents' : 'المستندات المطلوبة'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Upload the necessary documents to verify your business' 
              : 'قم بتحميل المستندات اللازمة للتحقق من عملك'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="flex items-start">
                <FileText className="h-5 w-5 mt-1 mr-2" />
                <div className="space-y-2 flex-1">
                  <div>
                    <Label htmlFor="businessLicense">
                      {language === 'en' ? 'Business License / Commercial Registration' : 'رخصة العمل / السجل التجاري'} <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Upload a copy of your business license or commercial registration' 
                        : 'قم بتحميل نسخة من رخصة عملك أو سجلك التجاري'}
                    </p>
                  </div>
                  
                  {documents.businessLicense ? (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm truncate max-w-[200px]">
                        {documents.businessLicense.name}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveFile('businessLicense')}
                      >
                        {language === 'en' ? 'Remove' : 'إزالة'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Input
                        id="businessLicense"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'businessLicense')}
                        className="max-w-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="flex items-start">
                <User className="h-5 w-5 mt-1 mr-2" />
                <div className="space-y-2 flex-1">
                  <div>
                    <Label htmlFor="identityProof">
                      {language === 'en' ? 'Identity Proof' : 'إثبات الهوية'} <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Upload a copy of your ID card or passport' 
                        : 'قم بتحميل نسخة من بطاقة الهوية أو جواز السفر الخاص بك'}
                    </p>
                  </div>
                  
                  {documents.identityProof ? (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm truncate max-w-[200px]">
                        {documents.identityProof.name}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveFile('identityProof')}
                      >
                        {language === 'en' ? 'Remove' : 'إزالة'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Input
                        id="identityProof"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'identityProof')}
                        className="max-w-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 mt-1 mr-2" />
                <div className="space-y-2 flex-1">
                  <div>
                    <Label htmlFor="bankStatement">
                      {language === 'en' ? 'Bank Statement' : 'كشف حساب بنكي'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Upload a recent bank statement (optional)' 
                        : 'قم بتحميل كشف حساب بنكي حديث (اختياري)'}
                    </p>
                  </div>
                  
                  {documents.bankStatement ? (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm truncate max-w-[200px]">
                        {documents.bankStatement.name}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveFile('bankStatement')}
                      >
                        {language === 'en' ? 'Remove' : 'إزالة'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Input
                        id="bankStatement"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'bankStatement')}
                        className="max-w-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="flex items-start">
                <Upload className="h-5 w-5 mt-1 mr-2" />
                <div className="space-y-2 flex-1">
                  <div>
                    <Label htmlFor="additionalDocuments">
                      {language === 'en' ? 'Additional Documents' : 'مستندات إضافية'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Upload any additional documents that may support your application' 
                        : 'قم بتحميل أي مستندات إضافية قد تدعم طلبك'}
                    </p>
                  </div>
                  
                  {documents.additionalDocuments.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {documents.additionalDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="text-sm truncate max-w-[200px]">
                            {doc.name}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveFile('additionalDocuments', index)}
                          >
                            {language === 'en' ? 'Remove' : 'إزالة'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Input
                      id="additionalDocuments"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'additionalDocuments')}
                      className="max-w-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            {language === 'en' ? 'Back' : 'رجوع'}
          </Button>
          <Button onClick={nextStep}>
            {language === 'en' ? 'Next: Banking Information' : 'التالي: المعلومات المصرفية'}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Step 3: Banking Information
  const renderBankingStep = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Banking Information' : 'المعلومات المصرفية'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Provide your banking details for payments' 
              : 'قدم تفاصيل البنك الخاص بك للمدفوعات'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">
                {language === 'en' ? 'Account Holder Name' : 'اسم صاحب الحساب'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountName"
                name="accountName"
                value={bankInfo.accountName}
                onChange={handleBankInfoChange}
                placeholder={language === 'en' ? "Enter account holder name" : "أدخل اسم صاحب الحساب"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">
                {language === 'en' ? 'Bank Name' : 'اسم البنك'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bankName"
                name="bankName"
                value={bankInfo.bankName}
                onChange={handleBankInfoChange}
                placeholder={language === 'en' ? "Enter bank name" : "أدخل اسم البنك"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">
                {language === 'en' ? 'Account Number' : 'رقم الحساب'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={bankInfo.accountNumber}
                onChange={handleBankInfoChange}
                placeholder={language === 'en' ? "Enter account number" : "أدخل رقم الحساب"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iban">
                {language === 'en' ? 'IBAN' : 'رقم الآيبان'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="iban"
                name="iban"
                value={bankInfo.iban}
                onChange={handleBankInfoChange}
                placeholder={language === 'en' ? "Enter IBAN" : "أدخل رقم الآيبان"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="swiftCode">
                {language === 'en' ? 'SWIFT/BIC Code' : 'رمز السويفت/BIC'}
              </Label>
              <Input
                id="swiftCode"
                name="swiftCode"
                value={bankInfo.swiftCode}
                onChange={handleBankInfoChange}
                placeholder={language === 'en' ? "Enter SWIFT/BIC code" : "أدخل رمز السويفت/BIC"}
              />
            </div>
          </div>
          
          <div className="p-4 border rounded-md bg-muted">
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 mt-1 mr-2 text-primary" />
              <div>
                <h4 className="font-medium">
                  {language === 'en' ? 'Secure Information' : 'معلومات آمنة'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'Your banking information is encrypted and securely stored. We comply with all data protection regulations.' 
                    : 'يتم تشفير معلوماتك المصرفية وتخزينها بشكل آمن. نحن نلتزم بجميع لوائح حماية البيانات.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            {language === 'en' ? 'Back' : 'رجوع'}
          </Button>
          <Button onClick={nextStep}>
            {language === 'en' ? 'Next: Review' : 'التالي: المراجعة'}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Step 4: Review and Submit
  const renderReviewStep = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Review Your Application' : 'مراجعة طلبك'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Please review your information before submitting' 
              : 'يرجى مراجعة معلوماتك قبل التقديم'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium flex items-center">
                <Store className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Store Information' : 'معلومات المتجر'}
              </h3>
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Store Name' : 'اسم المتجر'}:
                  </span>
                  <p>{language === 'en' ? sellerInfo.storeName : sellerInfo.storeNameAr}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Category' : 'الفئة'}:
                  </span>
                  <p>{sellerInfo.category}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}:
                  </span>
                  <p>{sellerInfo.phoneNumber}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Address' : 'العنوان'}:
                  </span>
                  <p>{sellerInfo.address}, {sellerInfo.city}</p>
                </div>
                
                <div className="md:col-span-2">
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Description' : 'الوصف'}:
                  </span>
                  <p>{language === 'en' ? sellerInfo.storeDescription : sellerInfo.storeDescriptionAr}</p>
                </div>
              </div>
              
              <Button 
                variant="link" 
                className="px-0 mt-2" 
                onClick={() => setCurrentStep(1)}
              >
                {language === 'en' ? 'Edit Store Information' : 'تعديل معلومات المتجر'}
              </Button>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Documents' : 'المستندات'}
              </h3>
              
              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Business License' : 'رخصة العمل'}:
                  </span>
                  <p>{documents.businessLicense ? documents.businessLicense.name : 'Not uploaded'}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Identity Proof' : 'إثبات الهوية'}:
                  </span>
                  <p>{documents.identityProof ? documents.identityProof.name : 'Not uploaded'}</p>
                </div>
                
                {documents.bankStatement && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Bank Statement' : 'كشف حساب بنكي'}:
                    </span>
                    <p>{documents.bankStatement.name}</p>
                  </div>
                )}
                
                {documents.additionalDocuments.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Additional Documents' : 'مستندات إضافية'}:
                    </span>
                    <ul className="list-disc list-inside">
                      {documents.additionalDocuments.map((doc, index) => (
                        <li key={index}>{doc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <Button 
                variant="link" 
                className="px-0 mt-2" 
                onClick={() => setCurrentStep(2)}
              >
                {language === 'en' ? 'Edit Documents' : 'تعديل المستندات'}
              </Button>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Banking Information' : 'المعلومات المصرفية'}
              </h3>
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Account Holder' : 'صاحب الحساب'}:
                  </span>
                  <p>{bankInfo.accountName}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Bank Name' : 'اسم البنك'}:
                  </span>
                  <p>{bankInfo.bankName}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Account Number' : 'رقم الحساب'}:
                  </span>
                  <p>{bankInfo.accountNumber}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'IBAN' : 'رقم الآيبان'}:
                  </span>
                  <p>{bankInfo.iban}</p>
                </div>
              </div>
              
              <Button 
                variant="link" 
                className="px-0 mt-2" 
                onClick={() => setCurrentStep(3)}
              >
                {language === 'en' ? 'Edit Banking Information' : 'تعديل المعلومات المصرفية'}
              </Button>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {language === 'en' 
                    ? 'I agree to the Terms and Conditions' 
                    : 'أوافق على الشروط والأحكام'}
                </label>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'By submitting this application, you agree to our seller terms and conditions.' 
                    : 'بتقديم هذا الطلب، فإنك توافق على شروط وأحكام البائع الخاصة بنا.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            {language === 'en' ? 'Back' : 'رجوع'}
          </Button>
          <Button onClick={handleSubmit} disabled={!termsAccepted}>
            {language === 'en' ? 'Submit Application' : 'تقديم الطلب'}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Become a Seller on Jam3a' : 'كن بائعًا على جمعة'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === 'en' 
            ? 'Join our marketplace and start selling your products to thousands of customers' 
            : 'انضم إلى سوقنا وابدأ في بيع منتجاتك لآلاف العملاء'}
        </p>
      </div>
      
      {renderStepIndicators()}
      {renderStepContent()}
    </div>
  );
};

export default SellerOnboarding;
