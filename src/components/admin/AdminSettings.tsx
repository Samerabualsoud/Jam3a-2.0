import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Save, 
  Globe, 
  Languages, 
  Plus, 
  Trash, 
  Edit, 
  Check, 
  X, 
  Upload, 
  Download, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: {
      en: "Jam3a Hub Collective",
      ar: "جمعة هب كوليكتيف"
    },
    siteDescription: {
      en: "A social shopping platform for group buying and deals",
      ar: "منصة تسوق اجتماعية للشراء الجماعي والصفقات"
    },
    contactEmail: "support@jam3ahub.com",
    phoneNumber: "+966 12 345 6789",
    address: {
      en: "123 Main Street, Riyadh, Saudi Arabia",
      ar: "١٢٣ الشارع الرئيسي، الرياض، المملكة العربية السعودية"
    },
    defaultLanguage: "ar",
    enableMultiLanguage: true,
    enableRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false
  });

  // Social media settings
  const [socialSettings, setSocialSettings] = useState({
    facebook: "https://facebook.com/jam3ahub",
    twitter: "https://twitter.com/jam3ahub",
    instagram: "https://instagram.com/jam3ahub",
    linkedin: "https://linkedin.com/company/jam3ahub",
    youtube: "",
    tiktok: ""
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "SAR",
    currencySymbol: "﷼",
    enablePayments: true,
    paymentMethods: [
      { id: 1, name: "Credit Card", enabled: true },
      { id: 2, name: "Apple Pay", enabled: true },
      { id: 3, name: "Bank Transfer", enabled: true },
      { id: 4, name: "Cash on Delivery", enabled: false }
    ],
    paymentGateways: [
      { id: 1, name: "Stripe", enabled: true, apiKey: "sk_test_******", publicKey: "pk_test_******" },
      { id: 2, name: "PayPal", enabled: false, clientId: "", clientSecret: "" },
      { id: 3, name: "Mada", enabled: true, merchantId: "mada_merchant_******" }
    ],
    taxRate: 15,
    enableTax: true,
    taxIncluded: true
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    sessionTimeout: 60, // minutes
    maxLoginAttempts: 5,
    enableTwoFactor: false,
    adminIpRestriction: false,
    allowedIps: "",
    enableCaptcha: true
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enablePushNotifications: false,
    enableSmsNotifications: false,
    adminEmailNotifications: true,
    newOrderNotification: true,
    lowStockNotification: true,
    newUserNotification: true,
    newJam3aNotification: true,
    completedJam3aNotification: true
  });

  // Backup settings
  const [backupSettings, setBackupSettings] = useState({
    enableAutomaticBackups: true,
    backupFrequency: "daily",
    backupRetention: 7,
    includeMedia: true,
    backupLocation: "cloud",
    lastBackupDate: "2025-04-01 03:15:22",
    nextScheduledBackup: "2025-04-05 03:00:00"
  });

  // Handle save settings
  const handleSaveSettings = (settingType) => {
    toast({
      title: language === 'en' ? "Settings Saved" : "تم حفظ الإعدادات",
      description: language === 'en' ? 
        `Your ${settingType} settings have been updated successfully.` : 
        `تم تحديث إعدادات ${settingType === 'general' ? 'العامة' : 
                           settingType === 'social' ? 'وسائل التواصل الاجتماعي' : 
                           settingType === 'payment' ? 'الدفع' : 
                           settingType === 'security' ? 'الأمان' : 
                           settingType === 'notification' ? 'الإشعارات' : 'النسخ الاحتياطي'} بنجاح.`
    });
  };

  // Handle backup now
  const handleBackupNow = () => {
    toast({
      title: language === 'en' ? "Backup Started" : "بدأ النسخ الاحتياطي",
      description: language === 'en' ? 
        "A new backup has been initiated. This may take a few minutes." : 
        "تم بدء نسخة احتياطية جديدة. قد يستغرق هذا بضع دقائق."
    });
  };

  // Handle restore backup
  const handleRestoreBackup = () => {
    toast({
      title: language === 'en' ? "Restore Initiated" : "بدأت عملية الاستعادة",
      description: language === 'en' ? 
        "System restore has been initiated from the selected backup." : 
        "تم بدء استعادة النظام من النسخة الاحتياطية المحددة."
    });
  };

  // Handle maintenance mode toggle
  const handleMaintenanceToggle = (enabled) => {
    setGeneralSettings({
      ...generalSettings,
      maintenanceMode: enabled
    });
    
    toast({
      title: enabled ? 
        (language === 'en' ? "Maintenance Mode Enabled" : "تم تمكين وضع الصيانة") : 
        (language === 'en' ? "Maintenance Mode Disabled" : "تم تعطيل وضع الصيانة"),
      description: enabled ? 
        (language === 'en' ? "Your site is now in maintenance mode and is not accessible to regular users." : 
                           "موقعك الآن في وضع الصيانة وغير متاح للمستخدمين العاديين.") : 
        (language === 'en' ? "Your site is now live and accessible to all users." : 
                           "موقعك الآن مباشر ويمكن الوصول إليه لجميع المستخدمين.")
    });
  };

  // Toggle payment method
  const togglePaymentMethod = (id, enabled) => {
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: paymentSettings.paymentMethods.map(method => 
        method.id === id ? { ...method, enabled } : method
      )
    });
  };

  // Toggle payment gateway
  const togglePaymentGateway = (id, enabled) => {
    setPaymentSettings({
      ...paymentSettings,
      paymentGateways: paymentSettings.paymentGateways.map(gateway => 
        gateway.id === id ? { ...gateway, enabled } : gateway
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'System Settings' : 'إعدادات النظام'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Configure your website and application settings' : 'تكوين إعدادات موقعك وتطبيقك'}
          </p>
        </div>
        <Select value={language} onValueChange={(value: 'en' | 'ar') => setLanguage(value)}>
          <SelectTrigger className="w-[180px]">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="general">
            {language === 'en' ? 'General' : 'عام'}
          </TabsTrigger>
          <TabsTrigger value="social">
            {language === 'en' ? 'Social Media' : 'وسائل التواصل'}
          </TabsTrigger>
          <TabsTrigger value="payment">
            {language === 'en' ? 'Payment' : 'الدفع'}
          </TabsTrigger>
          <TabsTrigger value="security">
            {language === 'en' ? 'Security' : 'الأمان'}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {language === 'en' ? 'Notifications' : 'الإشعارات'}
          </TabsTrigger>
          <TabsTrigger value="backup">
            {language === 'en' ? 'Backup & Restore' : 'النسخ والاستعادة'}
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'General Settings' : 'الإعدادات العامة'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Configure basic website settings and preferences' : 
                  'تكوين إعدادات وتفضيلات الموقع الأساسية'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Site Information' : 'معلومات الموقع'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="site-name-en">
                      {language === 'en' ? 'Site Name (English)' : 'اسم الموقع (الإنجليزية)'}
                    </Label>
                    <Input 
                      id="site-name-en" 
                      value={generalSettings.siteName.en} 
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings, 
                        siteName: {
                          ...generalSettings.siteName,
                          en: e.target.value
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site-name-ar">
                      {language === 'en' ? 'Site Name (Arabic)' : 'اسم الموقع (العربية)'}
                    </Label>
                    <Input 
                      id="site-name-ar" 
                      value={generalSettings.siteName.ar} 
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings, 
                        siteName: {
                          ...generalSettings.siteName,
                          ar: e.target.value
                        }
                      })}
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site-description-en">
                      {language === 'en' ? 'Site Description (English)' : 'وصف الموقع (الإنجليزية)'}
                    </Label>
                    <Textarea 
                      id="site-description-en" 
                      value={generalSettings.siteDescription.en} 
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings, 
                        siteDescription: {
                          ...generalSettings.siteDescription,
                          en: e.target.value
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site-description-ar">
                      {language === 'en' ? 'Site Description (Arabic)' : 'وصف الموقع (العربية)'}
                    </Label>
                    <Textarea 
                      id="site-description-ar" 
                      value={generalSettings.siteDescription.ar} 
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings, 
                        siteDescription: {
                          ...generalSettings.siteDescription,
                          ar: e.target.value
                        }
                      })}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">
                      {language === 'en' ? 'Contact Email' : 'البريد الإلكتروني للاتصال'}
                    </Label>
                    <Input 
                      id="contact-email" 
                      type="email"
                      value={generalSettings.contactEmail} 
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings, 
                        contactEmail: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">
                      {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                    </Label>
                    <Input 
                      id="phone-number" 
                      value={generalSettings.phoneNumber} 
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings, 
                        phoneNumber: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address-en">
                      {language === 'en' ? 'Address (English)' : 'العنوان (الإنجليزية)'}
                    </Label>
                    <Textarea 
                      id="address-en" 
                      value={generalSettings.address.en} 
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings, 
                        address: {
                          ...generalSettings.address,
                          en: e.target.value
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address-ar">
                      {language === 'en' ? 'Address (Arabic)' : 'العنوان (العربية)'}
                    </Label>
                    <Textarea 
                      id="address-ar" 
                      value={generalSettings.address.ar} 
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings, 
                        address: {
                          ...generalSettings.address,
                          ar: e.target.value
                        }
                      })}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Language Settings' : 'إعدادات اللغة'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-language">
                      {language === 'en' ? 'Default Language' : 'اللغة الافتراضية'}
                    </Label>
                    <Select 
                      value={generalSettings.defaultLanguage}
                      onValueChange={(value) => setGeneralSettings({
                        ...generalSettings, 
                        defaultLanguage: value
                      })}
                    >
                      <SelectTrigger id="default-language">
                        <SelectValue placeholder={language === 'en' ? "Select language" : "اختر اللغة"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-multilanguage" 
                      checked={generalSettings.enableMultiLanguage}
                      onCheckedChange={(checked) => setGeneralSettings({
                        ...generalSettings, 
                        enableMultiLanguage: checked
                      })}
                    />
                    <Label htmlFor="enable-multilanguage">
                      {language === 'en' ? 'Enable Multi-language Support' : 'تمكين دعم تعدد اللغات'}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Registration Settings' : 'إعدادات التسجيل'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-registration" 
                      checked={generalSettings.enableRegistration}
                      onCheckedChange={(checked) => setGeneralSettings({
                        ...generalSettings, 
                        enableRegistration: checked
                      })}
                    />
                    <Label htmlFor="enable-registration">
                      {language === 'en' ? 'Enable User Registration' : 'تمكين تسجيل المستخدم'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="require-email-verification" 
                      checked={generalSettings.requireEmailVerification}
                      onCheckedChange={(checked) => setGeneralSettings({
                        ...generalSettings, 
                        requireEmailVerification: checked
                      })}
                    />
                    <Label htmlFor="require-email-verification">
                      {language === 'en' ? 'Require Email Verification' : 'طلب التحقق من البريد الإلكتروني'}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Maintenance Mode' : 'وضع الصيانة'}
                </h3>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h4 className="font-medium">
                      {language === 'en' ? 'Site Maintenance Mode' : 'وضع صيانة الموقع'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 
                        'When enabled, the site will be inaccessible to regular users.' : 
                        'عند التمكين، لن يتمكن المستخدمون العاديون من الوصول إلى الموقع.'}
                    </p>
                  </div>
                  <Switch 
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={handleMaintenanceToggle}
                  />
                </div>
                
                {generalSettings.maintenanceMode && (
                  <div className="p-4 border rounded-md bg-yellow-50">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          {language === 'en' ? 'Maintenance Mode Active' : 'وضع الصيانة نشط'}
                        </h4>
                        <p className="text-sm text-yellow-700">
                          {language === 'en' ? 
                            'Your site is currently in maintenance mode and is not accessible to regular users. Only administrators can access the site.' : 
                            'موقعك حاليًا في وضع الصيانة وغير متاح للمستخدمين العاديين. يمكن للمسؤولين فقط الوصول إلى الموقع.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('general')}>
                <Save className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save General Settings' : 'حفظ الإعدادات العامة'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Social Media Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Social Media Settings' : 'إعدادات وسائل التواصل الاجتماعي'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Configure your social media profiles and integration' : 
                  'تكوين ملفات التعريف الخاصة بك على وسائل التواصل الاجتماعي والتكامل'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook">
                    {language === 'en' ? 'Facebook Page URL' : 'رابط صفحة فيسبوك'}
                  </Label>
                  <Input 
                    id="facebook" 
                    value={socialSettings.facebook} 
                    onChange={(e) => setSocialSettings({
                      ...socialSettings, 
                      facebook: e.target.value
                    })}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">
                    {language === 'en' ? 'Twitter/X Profile URL' : 'رابط ملف تويتر/إكس'}
                  </Label>
                  <Input 
                    id="twitter" 
                    value={socialSettings.twitter} 
                    onChange={(e) => setSocialSettings({
                      ...socialSettings, 
                      twitter: e.target.value
                    })}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">
                    {language === 'en' ? 'Instagram Profile URL' : 'رابط ملف انستغرام'}
                  </Label>
                  <Input 
                    id="instagram" 
                    value={socialSettings.instagram} 
                    onChange={(e) => setSocialSettings({
                      ...socialSettings, 
                      instagram: e.target.value
                    })}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin">
                    {language === 'en' ? 'LinkedIn Profile/Page URL' : 'رابط ملف/صفحة لينكد إن'}
                  </Label>
                  <Input 
                    id="linkedin" 
                    value={socialSettings.linkedin} 
                    onChange={(e) => setSocialSettings({
                      ...socialSettings, 
                      linkedin: e.target.value
                    })}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube">
                    {language === 'en' ? 'YouTube Channel URL' : 'رابط قناة يوتيوب'}
                  </Label>
                  <Input 
                    id="youtube" 
                    value={socialSettings.youtube} 
                    onChange={(e) => setSocialSettings({
                      ...socialSettings, 
                      youtube: e.target.value
                    })}
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tiktok">
                    {language === 'en' ? 'TikTok Profile URL' : 'رابط ملف تيك توك'}
                  </Label>
                  <Input 
                    id="tiktok" 
                    value={socialSettings.tiktok} 
                    onChange={(e) => setSocialSettings({
                      ...socialSettings, 
                      tiktok: e.target.value
                    })}
                    placeholder="https://tiktok.com/@yourhandle"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('social')}>
                <Save className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save Social Media Settings' : 'حفظ إعدادات وسائل التواصل الاجتماعي'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Payment Settings Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Payment Settings' : 'إعدادات الدفع'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Configure payment methods, gateways, and options' : 
                  'تكوين طرق الدفع والبوابات والخيارات'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Currency Settings' : 'إعدادات العملة'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">
                      {language === 'en' ? 'Currency' : 'العملة'}
                    </Label>
                    <Select 
                      value={paymentSettings.currency}
                      onValueChange={(value) => setPaymentSettings({
                        ...paymentSettings, 
                        currency: value
                      })}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder={language === 'en' ? "Select currency" : "اختر العملة"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency-symbol">
                      {language === 'en' ? 'Currency Symbol' : 'رمز العملة'}
                    </Label>
                    <Input 
                      id="currency-symbol" 
                      value={paymentSettings.currencySymbol} 
                      onChange={(e) => setPaymentSettings({
                        ...paymentSettings, 
                        currencySymbol: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {language === 'en' ? 'Payment Methods' : 'طرق الدفع'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-payments" 
                      checked={paymentSettings.enablePayments}
                      onCheckedChange={(checked) => setPaymentSettings({
                        ...paymentSettings, 
                        enablePayments: checked
                      })}
                    />
                    <Label htmlFor="enable-payments">
                      {language === 'en' ? 'Enable Payments' : 'تمكين المدفوعات'}
                    </Label>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? 'Payment Method' : 'طريقة الدفع'}</TableHead>
                        <TableHead className="text-right">{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentSettings.paymentMethods.map((method) => (
                        <TableRow key={method.id}>
                          <TableCell className="font-medium">{method.name}</TableCell>
                          <TableCell className="text-right">
                            <Switch 
                              checked={method.enabled}
                              onCheckedChange={(checked) => togglePaymentMethod(method.id, checked)}
                              disabled={!paymentSettings.enablePayments}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Payment Gateways' : 'بوابات الدفع'}
                </h3>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? 'Gateway' : 'البوابة'}</TableHead>
                        <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                        <TableHead>{language === 'en' ? 'Credentials' : 'بيانات الاعتماد'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentSettings.paymentGateways.map((gateway) => (
                        <TableRow key={gateway.id}>
                          <TableCell className="font-medium">{gateway.name}</TableCell>
                          <TableCell>
                            <Switch 
                              checked={gateway.enabled}
                              onCheckedChange={(checked) => togglePaymentGateway(gateway.id, checked)}
                              disabled={!paymentSettings.enablePayments}
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              {language === 'en' ? 'Configure' : 'تكوين'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Tax Settings' : 'إعدادات الضريبة'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">
                      {language === 'en' ? 'Tax Rate (%)' : 'معدل الضريبة (٪)'}
                    </Label>
                    <Input 
                      id="tax-rate" 
                      type="number"
                      value={paymentSettings.taxRate} 
                      onChange={(e) => setPaymentSettings({
                        ...paymentSettings, 
                        taxRate: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enable-tax" 
                        checked={paymentSettings.enableTax}
                        onCheckedChange={(checked) => setPaymentSettings({
                          ...paymentSettings, 
                          enableTax: checked
                        })}
                      />
                      <Label htmlFor="enable-tax">
                        {language === 'en' ? 'Enable Tax' : 'تمكين الضريبة'}
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="tax-included" 
                        checked={paymentSettings.taxIncluded}
                        onCheckedChange={(checked) => setPaymentSettings({
                          ...paymentSettings, 
                          taxIncluded: checked
                        })}
                        disabled={!paymentSettings.enableTax}
                      />
                      <Label htmlFor="tax-included">
                        {language === 'en' ? 'Prices Include Tax' : 'الأسعار تشمل الضريبة'}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('payment')}>
                <Save className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save Payment Settings' : 'حفظ إعدادات الدفع'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Security Settings' : 'إعدادات الأمان'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Configure security options and access controls' : 
                  'تكوين خيارات الأمان وضوابط الوصول'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Password Policy' : 'سياسة كلمة المرور'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password-min-length">
                      {language === 'en' ? 'Minimum Password Length' : 'الحد الأدنى لطول كلمة المرور'}
                    </Label>
                    <Input 
                      id="password-min-length" 
                      type="number"
                      value={securitySettings.passwordMinLength} 
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings, 
                        passwordMinLength: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="require-special-chars" 
                        checked={securitySettings.requireSpecialChars}
                        onCheckedChange={(checked) => setSecuritySettings({
                          ...securitySettings, 
                          requireSpecialChars: checked
                        })}
                      />
                      <Label htmlFor="require-special-chars">
                        {language === 'en' ? 'Require Special Characters' : 'طلب أحرف خاصة'}
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="require-numbers" 
                        checked={securitySettings.requireNumbers}
                        onCheckedChange={(checked) => setSecuritySettings({
                          ...securitySettings, 
                          requireNumbers: checked
                        })}
                      />
                      <Label htmlFor="require-numbers">
                        {language === 'en' ? 'Require Numbers' : 'طلب أرقام'}
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="require-uppercase" 
                        checked={securitySettings.requireUppercase}
                        onCheckedChange={(checked) => setSecuritySettings({
                          ...securitySettings, 
                          requireUppercase: checked
                        })}
                      />
                      <Label htmlFor="require-uppercase">
                        {language === 'en' ? 'Require Uppercase Letters' : 'طلب أحرف كبيرة'}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Session Settings' : 'إعدادات الجلسة'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">
                      {language === 'en' ? 'Session Timeout (minutes)' : 'مهلة الجلسة (دقائق)'}
                    </Label>
                    <Input 
                      id="session-timeout" 
                      type="number"
                      value={securitySettings.sessionTimeout} 
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings, 
                        sessionTimeout: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">
                      {language === 'en' ? 'Maximum Login Attempts' : 'الحد الأقصى لمحاولات تسجيل الدخول'}
                    </Label>
                    <Input 
                      id="max-login-attempts" 
                      type="number"
                      value={securitySettings.maxLoginAttempts} 
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings, 
                        maxLoginAttempts: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Advanced Security' : 'الأمان المتقدم'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-two-factor" 
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings, 
                        enableTwoFactor: checked
                      })}
                    />
                    <Label htmlFor="enable-two-factor">
                      {language === 'en' ? 'Enable Two-Factor Authentication' : 'تمكين المصادقة الثنائية'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-captcha" 
                      checked={securitySettings.enableCaptcha}
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings, 
                        enableCaptcha: checked
                      })}
                    />
                    <Label htmlFor="enable-captcha">
                      {language === 'en' ? 'Enable CAPTCHA on Forms' : 'تمكين كابتشا على النماذج'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="admin-ip-restriction" 
                      checked={securitySettings.adminIpRestriction}
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings, 
                        adminIpRestriction: checked
                      })}
                    />
                    <Label htmlFor="admin-ip-restriction">
                      {language === 'en' ? 'Restrict Admin Access by IP' : 'تقييد وصول المسؤول حسب عنوان IP'}
                    </Label>
                  </div>
                  
                  {securitySettings.adminIpRestriction && (
                    <div className="space-y-2">
                      <Label htmlFor="allowed-ips">
                        {language === 'en' ? 'Allowed IP Addresses (comma separated)' : 'عناوين IP المسموح بها (مفصولة بفواصل)'}
                      </Label>
                      <Textarea 
                        id="allowed-ips" 
                        value={securitySettings.allowedIps} 
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings, 
                          allowedIps: e.target.value
                        })}
                        placeholder="192.168.1.1, 10.0.0.1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('security')}>
                <Save className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save Security Settings' : 'حفظ إعدادات الأمان'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Notification Settings' : 'إعدادات الإشعارات'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Configure system and user notifications' : 
                  'تكوين إشعارات النظام والمستخدم'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Notification Channels' : 'قنوات الإشعارات'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-email-notifications" 
                      checked={notificationSettings.enableEmailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        enableEmailNotifications: checked
                      })}
                    />
                    <Label htmlFor="enable-email-notifications">
                      {language === 'en' ? 'Enable Email Notifications' : 'تمكين إشعارات البريد الإلكتروني'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-push-notifications" 
                      checked={notificationSettings.enablePushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        enablePushNotifications: checked
                      })}
                    />
                    <Label htmlFor="enable-push-notifications">
                      {language === 'en' ? 'Enable Push Notifications' : 'تمكين الإشعارات المنبثقة'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-sms-notifications" 
                      checked={notificationSettings.enableSmsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        enableSmsNotifications: checked
                      })}
                    />
                    <Label htmlFor="enable-sms-notifications">
                      {language === 'en' ? 'Enable SMS Notifications' : 'تمكين إشعارات الرسائل القصيرة'}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Admin Notifications' : 'إشعارات المسؤول'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="admin-email-notifications" 
                      checked={notificationSettings.adminEmailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        adminEmailNotifications: checked
                      })}
                    />
                    <Label htmlFor="admin-email-notifications">
                      {language === 'en' ? 'Receive Admin Email Notifications' : 'تلقي إشعارات البريد الإلكتروني للمسؤول'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="new-order-notification" 
                      checked={notificationSettings.newOrderNotification}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        newOrderNotification: checked
                      })}
                    />
                    <Label htmlFor="new-order-notification">
                      {language === 'en' ? 'New Order Notifications' : 'إشعارات الطلبات الجديدة'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="low-stock-notification" 
                      checked={notificationSettings.lowStockNotification}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        lowStockNotification: checked
                      })}
                    />
                    <Label htmlFor="low-stock-notification">
                      {language === 'en' ? 'Low Stock Notifications' : 'إشعارات المخزون المنخفض'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="new-user-notification" 
                      checked={notificationSettings.newUserNotification}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        newUserNotification: checked
                      })}
                    />
                    <Label htmlFor="new-user-notification">
                      {language === 'en' ? 'New User Registration Notifications' : 'إشعارات تسجيل المستخدم الجديد'}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Jam3a Notifications' : 'إشعارات جمعة'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="new-jam3a-notification" 
                      checked={notificationSettings.newJam3aNotification}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        newJam3aNotification: checked
                      })}
                    />
                    <Label htmlFor="new-jam3a-notification">
                      {language === 'en' ? 'New Jam3a Creation Notifications' : 'إشعارات إنشاء جمعة جديدة'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="completed-jam3a-notification" 
                      checked={notificationSettings.completedJam3aNotification}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings, 
                        completedJam3aNotification: checked
                      })}
                    />
                    <Label htmlFor="completed-jam3a-notification">
                      {language === 'en' ? 'Completed Jam3a Notifications' : 'إشعارات اكتمال الجمعة'}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('notification')}>
                <Save className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save Notification Settings' : 'حفظ إعدادات الإشعارات'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Backup & Restore Tab */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Backup & Restore' : 'النسخ الاحتياطي والاستعادة'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Manage system backups and restoration' : 
                  'إدارة النسخ الاحتياطي واستعادة النظام'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Backup Settings' : 'إعدادات النسخ الاحتياطي'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enable-automatic-backups" 
                        checked={backupSettings.enableAutomaticBackups}
                        onCheckedChange={(checked) => setBackupSettings({
                          ...backupSettings, 
                          enableAutomaticBackups: checked
                        })}
                      />
                      <Label htmlFor="enable-automatic-backups">
                        {language === 'en' ? 'Enable Automatic Backups' : 'تمكين النسخ الاحتياطي التلقائي'}
                      </Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">
                        {language === 'en' ? 'Backup Frequency' : 'تكرار النسخ الاحتياطي'}
                      </Label>
                      <Select 
                        value={backupSettings.backupFrequency}
                        onValueChange={(value) => setBackupSettings({
                          ...backupSettings, 
                          backupFrequency: value
                        })}
                        disabled={!backupSettings.enableAutomaticBackups}
                      >
                        <SelectTrigger id="backup-frequency">
                          <SelectValue placeholder={language === 'en' ? "Select frequency" : "اختر التكرار"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">{language === 'en' ? 'Hourly' : 'كل ساعة'}</SelectItem>
                          <SelectItem value="daily">{language === 'en' ? 'Daily' : 'يوميًا'}</SelectItem>
                          <SelectItem value="weekly">{language === 'en' ? 'Weekly' : 'أسبوعيًا'}</SelectItem>
                          <SelectItem value="monthly">{language === 'en' ? 'Monthly' : 'شهريًا'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-retention">
                        {language === 'en' ? 'Backup Retention (days)' : 'الاحتفاظ بالنسخ الاحتياطية (أيام)'}
                      </Label>
                      <Input 
                        id="backup-retention" 
                        type="number"
                        value={backupSettings.backupRetention} 
                        onChange={(e) => setBackupSettings({
                          ...backupSettings, 
                          backupRetention: parseInt(e.target.value)
                        })}
                        disabled={!backupSettings.enableAutomaticBackups}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="include-media" 
                        checked={backupSettings.includeMedia}
                        onCheckedChange={(checked) => setBackupSettings({
                          ...backupSettings, 
                          includeMedia: checked
                        })}
                        disabled={!backupSettings.enableAutomaticBackups}
                      />
                      <Label htmlFor="include-media">
                        {language === 'en' ? 'Include Media Files' : 'تضمين ملفات الوسائط'}
                      </Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-location">
                        {language === 'en' ? 'Backup Storage Location' : 'موقع تخزين النسخ الاحتياطي'}
                      </Label>
                      <Select 
                        value={backupSettings.backupLocation}
                        onValueChange={(value) => setBackupSettings({
                          ...backupSettings, 
                          backupLocation: value
                        })}
                        disabled={!backupSettings.enableAutomaticBackups}
                      >
                        <SelectTrigger id="backup-location">
                          <SelectValue placeholder={language === 'en' ? "Select location" : "اختر الموقع"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">{language === 'en' ? 'Local Server' : 'الخادم المحلي'}</SelectItem>
                          <SelectItem value="cloud">{language === 'en' ? 'Cloud Storage' : 'التخزين السحابي'}</SelectItem>
                          <SelectItem value="both">{language === 'en' ? 'Both (Local & Cloud)' : 'كلاهما (محلي وسحابي)'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Backup Status' : 'حالة النسخ الاحتياطي'}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Last Backup' : 'آخر نسخة احتياطية'}
                    </div>
                    <div className="text-lg font-medium mt-1">
                      {backupSettings.lastBackupDate}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Next Scheduled Backup' : 'النسخ الاحتياطي المجدول التالي'}
                    </div>
                    <div className="text-lg font-medium mt-1">
                      {backupSettings.nextScheduledBackup}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button onClick={handleBackupNow}>
                    <Download className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Backup Now' : 'النسخ الاحتياطي الآن'}
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Upload Backup File' : 'تحميل ملف النسخ الاحتياطي'}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Restore System' : 'استعادة النظام'}
                </h3>
                
                <div className="p-4 border rounded-md bg-yellow-50">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        {language === 'en' ? 'Warning: System Restoration' : 'تحذير: استعادة النظام'}
                      </h4>
                      <p className="text-sm text-yellow-700">
                        {language === 'en' ? 
                          'Restoring from a backup will replace all current data. This action cannot be undone.' : 
                          'ستؤدي الاستعادة من نسخة احتياطية إلى استبدال جميع البيانات الحالية. لا يمكن التراجع عن هذا الإجراء.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" onClick={handleRestoreBackup}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Restore from Latest Backup' : 'استعادة من أحدث نسخة احتياطية'}
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Restore from Selected Backup' : 'استعادة من نسخة احتياطية محددة'}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('backup')}>
                <Save className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save Backup Settings' : 'حفظ إعدادات النسخ الاحتياطي'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
