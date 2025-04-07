import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const SellerRegister = () => {
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
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {language === 'en' ? 'Apply to Become a Seller' : 'تقدم لتصبح بائعًا'}
          </h1>
          
          {renderStepIndicator()}
          
          <div className="bg-white rounded-lg shadow-md p-6">
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
                        className={`border rounded-lg p-4 cursor-pointer ${formData.businessType === 'individual' ? 'border-purple-600 bg-purple-50' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, businessType: 'individual' }))}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {language === 'en' ? 'Individual' : 'فرد'}
                          </div>
                          <div className="w-5 h-5 rounded-full border border-purple-600 flex items-center justify-center">
                            {formData.businessType === 'individual' && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.businessType === 'company' ? 'border-purple-600 bg-purple-50' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, businessType: 'company' }))}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {language === 'en' ? 'Company' : 'شركة'}
                          </div>
                          <div className="w-5 h-5 rounded-full border border-purple-600 flex items-center justify-center">
                            {formData.businessType === 'company' && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${formData.businessType === 'partnership' ? 'border-purple-600 bg-purple-50' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, businessType: 'partnership' }))}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {language === 'en' ? 'Partnership' : 'شراكة'}
                          </div>
                          <div className="w-5 h-5 rounded-full border border-purple-600 flex items-center justify-center">
                            {formData.businessType === 'partnership' && (
                              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      {language === 'en' ? 'Business Address' : 'عنوان العمل'} *
                    </Label>
                    <Input 
                      id="address" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'Enter business address' : 'أدخل عنوان العمل'}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        {language === 'en' ? 'City' : 'المدينة'} *
                      </Label>
                      <Input 
                        id="city" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter city' : 'أدخل المدينة'}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">
                        {language === 'en' ? 'Country' : 'البلد'} *
                      </Label>
                      <Input 
                        id="country" 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder={language === 'en' ? 'Enter country' : 'أدخل البلد'}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={handleNextStep}
                    className="bg-purple-600 hover:bg-purple-700"
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
                    <p className="text-sm text-gray-500 mb-2">
                      {language === 'en' ? 'Select all that apply' : 'حدد كل ما ينطبق'}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {['Electronics', 'Home & Kitchen', 'Fashion', 'Beauty & Personal Care', 'Toys & Games', 'Sports & Outdoors', 'Health & Wellness', 'Automotive', 'Other'].map(category => (
                        <div 
                          key={category}
                          className={`border rounded-lg p-3 cursor-pointer ${formData.productCategories.includes(category) ? 'border-purple-600 bg-purple-50' : ''}`}
                          onClick={() => handleCategoryToggle(category)}
                        >
                          <div className="flex items-center">
                            <div className="w-5 h-5 border border-purple-600 rounded mr-2 flex items-center justify-center">
                              {formData.productCategories.includes(category) && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
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
                    <textarea 
                      id="businessDescription" 
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'Tell us about your business and products...' : 'أخبرنا عن عملك ومنتجاتك...'}
                      className="w-full min-h-[150px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxId">
                      {language === 'en' ? 'Tax ID / Commercial Registration Number' : 'الرقم الضريبي / رقم السجل التجاري'} *
                    </Label>
                    <Input 
                      id="taxId" 
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'Enter your tax ID or registration number' : 'أدخل الرقم الضريبي أو رقم التسجيل الخاص بك'}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    {language === 'en' ? 'Previous Step' : 'الخطوة السابقة'}
                  </Button>
                  
                  <Button 
                    onClick={handleNextStep}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {language === 'en' ? 'Next Step' : 'الخطوة التالية'}
                  </Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Terms & Submission' : 'الشروط والتقديم'}
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">
                      {language === 'en' ? 'Seller Agreement' : 'اتفاقية البائع'}
                    </h3>
                    <div className="text-sm text-gray-600 h-48 overflow-y-auto p-2 border border-gray-200 rounded bg-white mb-4">
                      <p className="mb-2">
                        {language === 'en' 
                          ? 'By applying to become a seller on Jam3a, you agree to the following terms and conditions:'
                          : 'من خلال التقدم لتصبح بائعًا على جمعة، فإنك توافق على الشروط والأحكام التالية:'
                        }
                      </p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          {language === 'en'
                            ? 'You will provide accurate and complete information about your business and products.'
                            : 'ستقدم معلومات دقيقة وكاملة عن عملك ومنتجاتك.'
                          }
                        </li>
                        <li>
                          {language === 'en'
                            ? 'You will comply with all applicable laws and regulations related to your business and products.'
                            : 'ستمتثل لجميع القوانين واللوائح المعمول بها المتعلقة بعملك ومنتجاتك.'
                          }
                        </li>
                        <li>
                          {language === 'en'
                            ? 'You will maintain high standards of product quality and customer service.'
                            : 'ستحافظ على معايير عالية لجودة المنتج وخدمة العملاء.'
                          }
                        </li>
                        <li>
                          {language === 'en'
                            ? 'You will fulfill orders promptly and accurately according to the terms of each Jam3a deal.'
                            : 'ستنفذ الطلبات بسرعة ودقة وفقًا لشروط كل صفقة جمعة.'
                          }
                        </li>
                        <li>
                          {language === 'en'
                            ? 'You will pay all applicable seller fees and commissions as outlined in our Seller Fee Schedule.'
                            : 'ستدفع جميع رسوم وعمولات البائع المطبقة كما هو موضح في جدول رسوم البائع الخاص بنا.'
                          }
                        </li>
                        <li>
                          {language === 'en'
                            ? 'You acknowledge that Jam3a reserves the right to approve or reject seller applications at its sole discretion.'
                            : 'أنت تقر بأن جمعة تحتفظ بالحق في الموافقة على طلبات البائع أو رفضها وفقًا لتقديرها الخاص.'
                          }
                        </li>
                        <li>
                          {language === 'en'
                            ? 'You understand that Jam3a may terminate your seller account for violations of our policies or terms of service.'
                            : 'أنت تفهم أن جمعة قد تنهي حساب البائع الخاص بك بسبب انتهاكات لسياساتنا أو شروط الخدمة.'
                          }
                        </li>
                      </ol>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="flex items-center h-5">
                        <input
                          id="termsAgreed"
                          name="termsAgreed"
                          type="checkbox"
                          checked={formData.termsAgreed}
                          onChange={handleInputChange}
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300"
                          required
                        />
                      </div>
                      <label htmlFor="termsAgreed" className="ml-2 text-sm font-medium text-gray-900">
                        {language === 'en'
                          ? 'I have read and agree to the Seller Agreement and Terms of Service'
                          : 'لقد قرأت ووافقت على اتفاقية البائع وشروط الخدمة'
                        } *
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="font-semibold mb-2 text-purple-800">
                      {language === 'en' ? 'What Happens Next?' : 'ماذا يحدث بعد ذلك؟'}
                    </h3>
                    <p className="text-purple-700">
                      {language === 'en'
                        ? 'After submitting your application, our team will review your information within 48 hours. You will receive an email notification with the status of your application and next steps.'
                        : 'بعد تقديم طلبك، سيقوم فريقنا بمراجعة معلوماتك في غضون 48 ساعة. ستتلقى إشعارًا بالبريد الإلكتروني يحتوي على حالة طلبك والخطوات التالية.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    {language === 'en' ? 'Previous Step' : 'الخطوة السابقة'}
                  </Button>
                  
                  <Button 
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!formData.termsAgreed}
                  >
                    {language === 'en' ? 'Submit Application' : 'تقديم الطلب'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerRegister;
