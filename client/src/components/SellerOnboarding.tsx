import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';

const SellerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'individual',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Saudi Arabia',
    website: '',
    taxId: '',
    productCategories: [] as string[],
    businessDescription: '',
    termsAgreed: false
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const categories = [...prev.productCategories];
      if (categories.includes(category)) {
        return { ...prev, productCategories: categories.filter(c => c !== category) };
      } else {
        return { ...prev, productCategories: [...categories, category] };
      }
    });
  };
  
  const handleNextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success toast
    toast({
      title: language === 'en' ? 'Application Submitted!' : 'تم تقديم الطلب!',
      description: language === 'en' 
        ? 'We have received your seller application. Our team will review it and get back to you within 48 hours.' 
        : 'لقد تلقينا طلب البائع الخاص بك. سيقوم فريقنا بمراجعته والرد عليك في غضون 48 ساعة.',
    });
    
    // Redirect to sellers page after successful submission
    setTimeout(() => {
      navigate('/sellers');
    }, 2000);
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>1</div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>2</div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>3</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {language === 'en' ? 'Apply to Become a Seller' : 'تقدم لتصبح بائعًا'}
        </h1>
        
        {renderStepIndicator()}
        
        <Card className="shadow-md">
          <CardContent className="p-6">
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Business Information' : 'معلومات العمل'}
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">
                      {language === 'en' ? 'Business Name' : 'اسم العمل'} *
                    </Label>
                    <Input 
                      id="businessName" 
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'Enter your business name' : 'أدخل اسم عملك'}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      {language === 'en' ? 'Business Type' : 'نوع العمل'} *
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.businessType === 'individual' ? 'border-primary bg-primary/10' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, businessType: 'individual' }))}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {language === 'en' ? 'Individual' : 'فرد'}
                          </div>
                          <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                            {formData.businessType === 'individual' && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.businessType === 'company' ? 'border-primary bg-primary/10' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, businessType: 'company' }))}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {language === 'en' ? 'Company' : 'شركة'}
                          </div>
                          <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                            {formData.businessType === 'company' && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.businessType === 'partnership' ? 'border-primary bg-primary/10' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, businessType: 'partnership' }))}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {language === 'en' ? 'Partnership' : 'شراكة'}
                          </div>
                          <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                            {formData.businessType === 'partnership' && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">
                        {language === 'en' ? 'Contact Person Name' : 'اسم الشخص المسؤول'} *
                      </Label>
                      <Input 
                        id="contactName" 
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter contact name' : 'أدخل اسم جهة الاتصال'}
                        required
                      />
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
                        placeholder={language === 'en' ? 'Enter email address' : 'أدخل البريد الإلكتروني'}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {language === 'en' ? 'Phone Number' : 'رقم الهاتف'} *
                      </Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter phone number' : 'أدخل رقم الهاتف'}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">
                        {language === 'en' ? 'Website (if any)' : 'الموقع الإلكتروني (إن وجد)'}
                      </Label>
                      <Input 
                        id="website" 
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter website URL' : 'أدخل عنوان URL للموقع'}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={handleNextStep}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {language === 'en' ? 'Next Step' : 'الخطوة التالية'}
                  </Button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Product Information' : 'معلومات المنتج'}
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      {language === 'en' ? 'Product Categories' : 'فئات المنتجات'} *
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      {language === 'en' ? 'Select all that apply' : 'حدد كل ما ينطبق'}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {['Electronics', 'Home & Kitchen', 'Fashion', 'Beauty & Personal Care', 'Toys & Games', 'Sports & Outdoors', 'Health & Wellness', 'Automotive', 'Other'].map(category => (
                        <div 
                          key={category}
                          className={`border rounded-lg p-3 cursor-pointer ${formData.productCategories.includes(category) ? 'border-primary bg-primary/10' : ''}`}
                          onClick={() => handleCategoryToggle(category)}
                        >
                          <div className="flex items-center">
                            <div className="w-5 h-5 border border-primary rounded mr-2 flex items-center justify-center">
                              {formData.productCategories.includes(category) && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                            <span>
                              {language === 'en' ? category : {
                                'Electronics': 'الإلكترونيات',
                                'Home & Kitchen': 'المنزل والمطبخ',
                                'Fashion': 'الأزياء',
                                'Beauty & Personal Care': 'الجمال والعناية الشخصية',
                                'Toys & Games': 'الألعاب',
                                'Sports & Outdoors': 'الرياضة والهواء الطلق',
                                'Health & Wellness': 'الصحة والعافية',
                                'Automotive': 'السيارات',
                                'Other': 'أخرى'
                              }[category]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">
                      {language === 'en' ? 'Business Description' : 'وصف العمل'} *
                    </Label>
                    <Textarea 
                      id="businessDescription" 
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'Tell us about your business and products...' : 'أخبرنا عن عملك ومنتجاتك...'}
                      rows={5}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button 
                    onClick={handlePrevStep}
                    variant="outline"
                  >
                    {language === 'en' ? 'Previous Step' : 'الخطوة السابقة'}
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {language === 'en' ? 'Next Step' : 'الخطوة التالية'}
                  </Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Terms & Submission' : 'الشروط والتقديم'}
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <h3 className="font-medium mb-2">
                        {language === 'en' ? 'Seller Agreement' : 'اتفاقية البائع'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' 
                          ? 'By submitting this application, you agree to our Seller Terms and Conditions, including commission rates, payment terms, and product quality standards. You confirm that all information provided is accurate and complete.' 
                          : 'بتقديم هذا الطلب، فإنك توافق على شروط وأحكام البائع الخاصة بنا، بما في ذلك معدلات العمولة وشروط الدفع ومعايير جودة المنتج. أنت تؤكد أن جميع المعلومات المقدمة دقيقة وكاملة.'}
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="termsAgreed" 
                        name="termsAgreed"
                        checked={formData.termsAgreed}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, termsAgreed: checked as boolean }))
                        }
                      />
                      <Label htmlFor="termsAgreed" className="text-sm font-normal">
                        {language === 'en' 
                          ? 'I agree to the Seller Terms and Conditions and Privacy Policy' 
                          : 'أوافق على شروط وأحكام البائع وسياسة الخصوصية'}
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button 
                    onClick={handlePrevStep}
                    variant="outline"
                  >
                    {language === 'en' ? 'Previous Step' : 'الخطوة السابقة'}
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="bg-primary hover:bg-primary/90"
                    disabled={!formData.termsAgreed}
                  >
                    {language === 'en' ? 'Submit Application' : 'تقديم الطلب'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerOnboarding;
