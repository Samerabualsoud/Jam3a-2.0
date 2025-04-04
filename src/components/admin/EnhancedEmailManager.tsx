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
import { Mail, Send, Users, Settings, Bell, Edit, Trash, Plus, Search, Languages, Globe, Check, X } from 'lucide-react';

const EnhancedEmailManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [editingLanguage, setEditingLanguage] = useState<'en' | 'ar'>('en');
  
  // Sample email templates with bilingual support
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      event: "user_registration",
      isActive: true,
      lastModified: "2025-03-28",
      en: {
        name: "Welcome Email",
        subject: "Welcome to Jam3a Hub!",
        body: "Dear {{name}},\n\nWelcome to Jam3a Hub! We're excited to have you join our community.\n\nWith Jam3a Hub, you can save money on premium products through group buying.\n\nGet started by browsing our active deals or creating your own Jam3a.\n\nBest regards,\nThe Jam3a Hub Team"
      },
      ar: {
        name: "رسالة الترحيب",
        subject: "مرحبًا بك في جمعة هب!",
        body: "عزيزي/عزيزتي {{name}}،\n\nمرحبًا بك في جمعة هب! نحن متحمسون لانضمامك إلى مجتمعنا.\n\nمع جمعة هب، يمكنك توفير المال على المنتجات المميزة من خلال الشراء الجماعي.\n\nابدأ بتصفح الصفقات النشطة أو إنشاء جمعة خاصة بك.\n\nمع أطيب التحيات،\nفريق جمعة هب"
      }
    },
    {
      id: 2,
      event: "waiting_list",
      isActive: true,
      lastModified: "2025-03-29",
      en: {
        name: "Waiting List Confirmation",
        subject: "You've joined the waiting list!",
        body: "Dear {{name}},\n\nThank you for joining the waiting list for {{product}}.\n\nWe'll notify you as soon as a new Jam3a group is formed for this product.\n\nBest regards,\nThe Jam3a Hub Team"
      },
      ar: {
        name: "تأكيد قائمة الانتظار",
        subject: "لقد انضممت إلى قائمة الانتظار!",
        body: "عزيزي/عزيزتي {{name}}،\n\nشكرًا لانضمامك إلى قائمة الانتظار لـ {{product}}.\n\nسنخطرك بمجرد تشكيل مجموعة جمعة جديدة لهذا المنتج.\n\nمع أطيب التحيات،\nفريق جمعة هب"
      }
    },
    {
      id: 3,
      event: "jam3a_join",
      isActive: true,
      lastModified: "2025-03-30",
      en: {
        name: "Jam3a Join Confirmation",
        subject: "You've joined a Jam3a!",
        body: "Dear {{name}},\n\nCongratulations! You've successfully joined the Jam3a for {{product}}.\n\nCurrent price: {{price}} SAR\nGroup progress: {{progress}}%\n\nWe'll keep you updated as more people join and the price drops further.\n\nBest regards,\nThe Jam3a Hub Team"
      },
      ar: {
        name: "تأكيد الانضمام للجمعة",
        subject: "لقد انضممت إلى جمعة!",
        body: "عزيزي/عزيزتي {{name}}،\n\nتهانينا! لقد انضممت بنجاح إلى جمعة {{product}}.\n\nالسعر الحالي: {{price}} ريال\nتقدم المجموعة: {{progress}}%\n\nسنبقيك على اطلاع مع انضمام المزيد من الأشخاص وانخفاض السعر أكثر.\n\nمع أطيب التحيات،\nفريق جمعة هب"
      }
    },
    {
      id: 4,
      event: "jam3a_creation",
      isActive: true,
      lastModified: "2025-03-31",
      en: {
        name: "Jam3a Creation Confirmation",
        subject: "You've started a new Jam3a!",
        body: "Dear {{name}},\n\nCongratulations! You've successfully created a new Jam3a for {{product}}.\n\nShare this link with friends to help them join your Jam3a and get better prices: {{link}}\n\nBest regards,\nThe Jam3a Hub Team"
      },
      ar: {
        name: "تأكيد إنشاء جمعة",
        subject: "لقد بدأت جمعة جديدة!",
        body: "عزيزي/عزيزتي {{name}}،\n\nتهانينا! لقد أنشأت بنجاح جمعة جديدة لـ {{product}}.\n\nشارك هذا الرابط مع الأصدقاء لمساعدتهم على الانضمام إلى جمعة والحصول على أسعار أفضل: {{link}}\n\nمع أطيب التحيات،\nفريق جمعة هب"
      }
    }
  ]);
  
  // Sample sent emails for logs
  const [sentEmails, setSentEmails] = useState([
    {
      id: 1,
      recipient: "user1@example.com",
      subject: "Welcome to Jam3a Hub!",
      template: "Welcome Email",
      sentDate: "2025-04-01 09:15:22",
      status: "Delivered"
    },
    {
      id: 2,
      recipient: "user2@example.com",
      subject: "Welcome to Jam3a Hub!",
      template: "Welcome Email",
      sentDate: "2025-04-01 10:23:45",
      status: "Delivered"
    },
    {
      id: 3,
      recipient: "user3@example.com",
      subject: "You've joined a Jam3a!",
      template: "Jam3a Join Confirmation",
      sentDate: "2025-04-01 11:05:17",
      status: "Delivered"
    },
    {
      id: 4,
      recipient: "user4@example.com",
      subject: "You've joined the waiting list!",
      template: "Waiting List Confirmation",
      sentDate: "2025-04-01 12:42:33",
      status: "Delivered"
    }
  ]);
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    senderName: "Jam3a Hub",
    senderEmail: "notifications@jam3ahub.com",
    smtpServer: "smtp.jam3ahub.com",
    smtpPort: "587",
    smtpUsername: "notifications@jam3ahub.com",
    smtpPassword: "••••••••••••",
    enableSSL: true,
    sendWelcomeEmail: true,
    sendWaitingListEmail: true,
    sendJam3aJoinEmail: true,
    sendJam3aCreationEmail: true,
    emailVerificationRequired: true,
    verificationExpiryHours: 24,
    maxDailyEmails: 1000
  });

  // Email verification settings
  const [verificationSettings, setVerificationSettings] = useState({
    verificationTemplate: {
      en: {
        subject: "Verify Your Email Address",
        body: "Dear {{name}},\n\nThank you for registering with Jam3a Hub. Please verify your email address by clicking the link below:\n\n{{verification_link}}\n\nThis link will expire in 24 hours.\n\nBest regards,\nThe Jam3a Hub Team"
      },
      ar: {
        subject: "تحقق من عنوان بريدك الإلكتروني",
        body: "عزيزي/عزيزتي {{name}}،\n\nشكرًا لتسجيلك في جمعة هب. يرجى التحقق من عنوان بريدك الإلكتروني بالنقر على الرابط أدناه:\n\n{{verification_link}}\n\nستنتهي صلاحية هذا الرابط خلال 24 ساعة.\n\nمع أطيب التحيات،\nفريق جمعة هب"
      }
    },
    successRedirectUrl: "/email-verified",
    failureRedirectUrl: "/verification-failed"
  });
  
  // Form state for template editing
  const [templateForm, setTemplateForm] = useState({
    en: { name: '', subject: '', body: '' },
    ar: { name: '', subject: '', body: '' },
    event: 'custom',
    isActive: true
  });
  
  // Handle template selection for editing
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      en: { 
        name: template.en.name, 
        subject: template.en.subject, 
        body: template.en.body 
      },
      ar: { 
        name: template.ar.name, 
        subject: template.ar.subject, 
        body: template.ar.body 
      },
      event: template.event,
      isActive: template.isActive
    });
    setIsEditing(true);
  };
  
  // Handle template save
  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      // Update existing template
      setEmailTemplates(emailTemplates.map(template => 
        template.id === selectedTemplate.id ? 
        {
          ...template,
          en: templateForm.en,
          ar: templateForm.ar,
          event: templateForm.event,
          isActive: templateForm.isActive,
          lastModified: new Date().toISOString().split('T')[0]
        } : 
        template
      ));
      
      toast({
        title: "Template Saved",
        description: `The "${templateForm.en.name}" template has been updated.`
      });
    } else {
      // Create new template
      const newTemplate = {
        id: emailTemplates.length + 1,
        en: templateForm.en,
        ar: templateForm.ar,
        event: templateForm.event,
        isActive: templateForm.isActive,
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      setEmailTemplates([...emailTemplates, newTemplate]);
      
      toast({
        title: "Template Created",
        description: `The "${templateForm.en.name}" template has been created.`
      });
    }
    
    setIsEditing(false);
    setSelectedTemplate(null);
  };
  
  // Handle template creation
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateForm({
      en: { 
        name: "New Template", 
        subject: "New Email Subject", 
        body: "Enter your email content here..." 
      },
      ar: { 
        name: "قالب جديد", 
        subject: "موضوع البريد الإلكتروني الجديد", 
        body: "أدخل محتوى البريد الإلكتروني هنا..." 
      },
      event: "custom",
      isActive: true
    });
    setIsEditing(true);
  };
  
  // Handle template deletion
  const handleDeleteTemplate = (id) => {
    setEmailTemplates(emailTemplates.filter(template => template.id !== id));
    
    toast({
      title: "Template Deleted",
      description: "The email template has been deleted."
    });
  };
  
  // Handle settings save
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Email notification settings have been updated."
    });
  };
  
  // Handle test email
  const handleSendTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to the administrator."
    });
  };

  // Toggle editing language
  const toggleEditingLanguage = () => {
    setEditingLanguage(editingLanguage === 'en' ? 'ar' : 'en');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Notifications</h2>
          <p className="text-muted-foreground">Manage email templates and notification settings</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSendTestEmail}>
            <Send className="mr-2 h-4 w-4" />
            Send Test Email
          </Button>
          {!isEditing && (
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
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">
            <Mail className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Email Templates' : 'قوالب البريد الإلكتروني'}
          </TabsTrigger>
          <TabsTrigger value="verification">
            <Check className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Email Verification' : 'التحقق من البريد الإلكتروني'}
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Users className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Email Logs' : 'سجلات البريد الإلكتروني'}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Settings' : 'الإعدادات'}
          </TabsTrigger>
        </TabsList>
        
        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {!isEditing ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Manage Email Templates' : 'إدارة قوالب البريد الإلكتروني'}
                </h3>
                <Button onClick={handleCreateTemplate}>
                  <Plus className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Create Template' : 'إنشاء قالب'}
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
                      <TableHead>{language === 'en' ? 'Event' : 'الحدث'}</TableHead>
                      <TableHead>{language === 'en' ? 'Subject' : 'الموضوع'}</TableHead>
                      <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                      <TableHead>{language === 'en' ? 'Last Modified' : 'آخر تعديل'}</TableHead>
                      <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template[language].name}</TableCell>
                        <TableCell>
                          {language === 'en' ? 
                            (template.event === 'user_registration' ? 'User Registration' :
                             template.event === 'waiting_list' ? 'Waiting List Join' :
                             template.event === 'jam3a_join' ? 'Jam3a Join' :
                             template.event === 'jam3a_creation' ? 'Jam3a Creation' : 'Custom') :
                            (template.event === 'user_registration' ? 'تسجيل المستخدم' :
                             template.event === 'waiting_list' ? 'الانضمام لقائمة الانتظار' :
                             template.event === 'jam3a_join' ? 'الانضمام للجمعة' :
                             template.event === 'jam3a_creation' ? 'إنشاء جمعة' : 'مخصص')
                          }
                        </TableCell>
                        <TableCell>{template[language].subject}</TableCell>
                        <TableCell>
                          {template.isActive ? 
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {language === 'en' ? 'Active' : 'نشط'}
                            </span> : 
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {language === 'en' ? 'Inactive' : 'غير نشط'}
                            </span>
                          }
                        </TableCell>
                        <TableCell>{template.lastModified}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {selectedTemplate ? 
                        (language === 'en' ? 'Edit Email Template' : 'تعديل قالب البريد الإلكتروني') : 
                        (language === 'en' ? 'Create Email Template' : 'إنشاء قالب بريد إلكتروني')}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' ? 
                        'Customize the email content and settings' : 
                        'تخصيص محتوى البريد الإلكتروني والإعدادات'}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={toggleEditingLanguage}>
                    <Languages className="mr-2 h-4 w-4" />
                    {editingLanguage === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-event">
                      {language === 'en' ? 'Event Trigger' : 'مشغل الحدث'}
                    </Label>
                    <Select 
                      value={templateForm.event}
                      onValueChange={(value) => setTemplateForm({...templateForm, event: value})}
                    >
                      <SelectTrigger id="template-event">
                        <SelectValue placeholder={language === 'en' ? "Select event" : "اختر الحدث"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user_registration">
                          {language === 'en' ? 'User Registration' : 'تسجيل المستخدم'}
                        </SelectItem>
                        <SelectItem value="waiting_list">
                          {language === 'en' ? 'Waiting List Join' : 'الانضمام لقائمة الانتظار'}
                        </SelectItem>
                        <SelectItem value="jam3a_join">
                          {language === 'en' ? 'Jam3a Join' : 'الانضمام للجمعة'}
                        </SelectItem>
                        <SelectItem value="jam3a_creation">
                          {language === 'en' ? 'Jam3a Creation' : 'إنشاء جمعة'}
                        </SelectItem>
                        <SelectItem value="custom">
                          {language === 'en' ? 'Custom Event' : 'حدث مخصص'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="template-active" 
                        checked={templateForm.isActive}
                        onCheckedChange={(checked) => setTemplateForm({...templateForm, isActive: checked})}
                      />
                      <Label htmlFor="template-active">
                        {language === 'en' ? 'Active Template' : 'قالب نشط'}
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Language specific fields */}
                <div className="border p-4 rounded-md mt-4">
                  <h3 className="text-lg font-medium mb-4">
                    {editingLanguage === 'en' ? 'English Content' : 'المحتوى العربي'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`template-name-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Template Name' : 'اسم القالب'}
                      </Label>
                      <Input 
                        id={`template-name-${editingLanguage}`}
                        value={templateForm[editingLanguage].name} 
                        onChange={(e) => setTemplateForm({
                          ...templateForm, 
                          [editingLanguage]: {
                            ...templateForm[editingLanguage],
                            name: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter template name" : "أدخل اسم القالب"}
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`template-subject-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Email Subject' : 'موضوع البريد الإلكتروني'}
                      </Label>
                      <Input 
                        id={`template-subject-${editingLanguage}`}
                        value={templateForm[editingLanguage].subject} 
                        onChange={(e) => setTemplateForm({
                          ...templateForm, 
                          [editingLanguage]: {
                            ...templateForm[editingLanguage],
                            subject: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter email subject" : "أدخل موضوع البريد الإلكتروني"}
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`template-body-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Email Body' : 'نص البريد الإلكتروني'}
                      </Label>
                      <Textarea 
                        id={`template-body-${editingLanguage}`}
                        value={templateForm[editingLanguage].body} 
                        onChange={(e) => setTemplateForm({
                          ...templateForm, 
                          [editingLanguage]: {
                            ...templateForm[editingLanguage],
                            body: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter email body" : "أدخل نص البريد الإلكتروني"}
                        className="min-h-[200px]"
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-2">
                        {editingLanguage === 'en' ? 'Available Variables:' : 'المتغيرات المتاحة:'}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{{name}} - {editingLanguage === 'en' ? 'User\'s name' : 'اسم المستخدم'}</p>
                        <p>{{email}} - {editingLanguage === 'en' ? 'User\'s email' : 'البريد الإلكتروني للمستخدم'}</p>
                        <p>{{product}} - {editingLanguage === 'en' ? 'Product name' : 'اسم المنتج'}</p>
                        <p>{{price}} - {editingLanguage === 'en' ? 'Current price' : 'السعر الحالي'}</p>
                        <p>{{progress}} - {editingLanguage === 'en' ? 'Group progress percentage' : 'نسبة تقدم المجموعة'}</p>
                        <p>{{link}} - {editingLanguage === 'en' ? 'Sharing link' : 'رابط المشاركة'}</p>
                        <p>{{verification_link}} - {editingLanguage === 'en' ? 'Email verification link' : 'رابط التحقق من البريد الإلكتروني'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setSelectedTemplate(null);
                }}>
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Save Template' : 'حفظ القالب'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Email Verification Tab */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Email Verification Settings' : 'إعدادات التحقق من البريد الإلكتروني'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Configure how users verify their email addresses' : 
                  'تكوين كيفية تحقق المستخدمين من عناوين بريدهم الإلكتروني'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === 'en' ? 'Require Email Verification' : 'طلب التحقق من البريد الإلكتروني'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 
                      'Users must verify their email address before accessing the platform' : 
                      'يجب على المستخدمين التحقق من عنوان بريدهم الإلكتروني قبل الوصول إلى المنصة'}
                  </p>
                </div>
                <Switch 
                  checked={emailSettings.emailVerificationRequired}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, emailVerificationRequired: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-expiry">
                  {language === 'en' ? 'Verification Link Expiry (hours)' : 'انتهاء صلاحية رابط التحقق (ساعات)'}
                </Label>
                <Input 
                  id="verification-expiry" 
                  type="number" 
                  value={emailSettings.verificationExpiryHours} 
                  onChange={(e) => setEmailSettings({...emailSettings, verificationExpiryHours: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="success-redirect">
                  {language === 'en' ? 'Success Redirect URL' : 'عنوان URL لإعادة التوجيه عند النجاح'}
                </Label>
                <Input 
                  id="success-redirect" 
                  value={verificationSettings.successRedirectUrl} 
                  onChange={(e) => setVerificationSettings({...verificationSettings, successRedirectUrl: e.target.value})}
                  placeholder="/email-verified"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="failure-redirect">
                  {language === 'en' ? 'Failure Redirect URL' : 'عنوان URL لإعادة التوجيه عند الفشل'}
                </Label>
                <Input 
                  id="failure-redirect" 
                  value={verificationSettings.failureRedirectUrl} 
                  onChange={(e) => setVerificationSettings({...verificationSettings, failureRedirectUrl: e.target.value})}
                  placeholder="/verification-failed"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">
                  {language === 'en' ? 'Verification Email Template' : 'قالب بريد التحقق'}
                </h3>
                
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verification-subject-en">Subject</Label>
                      <Input 
                        id="verification-subject-en" 
                        value={verificationSettings.verificationTemplate.en.subject} 
                        onChange={(e) => setVerificationSettings({
                          ...verificationSettings, 
                          verificationTemplate: {
                            ...verificationSettings.verificationTemplate,
                            en: {
                              ...verificationSettings.verificationTemplate.en,
                              subject: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verification-body-en">Email Body</Label>
                      <Textarea 
                        id="verification-body-en" 
                        value={verificationSettings.verificationTemplate.en.body} 
                        onChange={(e) => setVerificationSettings({
                          ...verificationSettings, 
                          verificationTemplate: {
                            ...verificationSettings.verificationTemplate,
                            en: {
                              ...verificationSettings.verificationTemplate.en,
                              body: e.target.value
                            }
                          }
                        })}
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="ar" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verification-subject-ar">الموضوع</Label>
                      <Input 
                        id="verification-subject-ar" 
                        value={verificationSettings.verificationTemplate.ar.subject} 
                        onChange={(e) => setVerificationSettings({
                          ...verificationSettings, 
                          verificationTemplate: {
                            ...verificationSettings.verificationTemplate,
                            ar: {
                              ...verificationSettings.verificationTemplate.ar,
                              subject: e.target.value
                            }
                          }
                        })}
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verification-body-ar">نص البريد الإلكتروني</Label>
                      <Textarea 
                        id="verification-body-ar" 
                        value={verificationSettings.verificationTemplate.ar.body} 
                        onChange={(e) => setVerificationSettings({
                          ...verificationSettings, 
                          verificationTemplate: {
                            ...verificationSettings.verificationTemplate,
                            ar: {
                              ...verificationSettings.verificationTemplate.ar,
                              body: e.target.value
                            }
                          }
                        })}
                        className="min-h-[200px]"
                        dir="rtl"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save Verification Settings' : 'حفظ إعدادات التحقق'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Email Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Email Logs' : 'سجلات البريد الإلكتروني'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'View history of sent emails' : 
                  'عرض سجل رسائل البريد الإلكتروني المرسلة'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Recipient' : 'المستلم'}</TableHead>
                      <TableHead>{language === 'en' ? 'Subject' : 'الموضوع'}</TableHead>
                      <TableHead>{language === 'en' ? 'Template' : 'القالب'}</TableHead>
                      <TableHead>{language === 'en' ? 'Sent Date' : 'تاريخ الإرسال'}</TableHead>
                      <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentEmails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>{email.recipient}</TableCell>
                        <TableCell>{email.subject}</TableCell>
                        <TableCell>{email.template}</TableCell>
                        <TableCell>{email.sentDate}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            email.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {language === 'en' ? email.status : (email.status === 'Delivered' ? 'تم التسليم' : 'معلق')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Email Settings' : 'إعدادات البريد الإلكتروني'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Configure email server and notification preferences' : 
                  'تكوين خادم البريد الإلكتروني وتفضيلات الإشعارات'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {language === 'en' ? 'SMTP Configuration' : 'تكوين SMTP'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">
                      {language === 'en' ? 'Sender Name' : 'اسم المرسل'}
                    </Label>
                    <Input 
                      id="sender-name" 
                      value={emailSettings.senderName} 
                      onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-email">
                      {language === 'en' ? 'Sender Email' : 'بريد المرسل الإلكتروني'}
                    </Label>
                    <Input 
                      id="sender-email" 
                      value={emailSettings.senderEmail} 
                      onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">
                      {language === 'en' ? 'SMTP Server' : 'خادم SMTP'}
                    </Label>
                    <Input 
                      id="smtp-server" 
                      value={emailSettings.smtpServer} 
                      onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">
                      {language === 'en' ? 'SMTP Port' : 'منفذ SMTP'}
                    </Label>
                    <Input 
                      id="smtp-port" 
                      value={emailSettings.smtpPort} 
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">
                      {language === 'en' ? 'SMTP Username' : 'اسم مستخدم SMTP'}
                    </Label>
                    <Input 
                      id="smtp-username" 
                      value={emailSettings.smtpUsername} 
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">
                      {language === 'en' ? 'SMTP Password' : 'كلمة مرور SMTP'}
                    </Label>
                    <Input 
                      id="smtp-password" 
                      type="password"
                      value={emailSettings.smtpPassword} 
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Switch 
                    id="enable-ssl" 
                    checked={emailSettings.enableSSL}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableSSL: checked})}
                  />
                  <Label htmlFor="enable-ssl">
                    {language === 'en' ? 'Enable SSL/TLS' : 'تمكين SSL/TLS'}
                  </Label>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">
                  {language === 'en' ? 'Notification Preferences' : 'تفضيلات الإشعارات'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="welcome-email" 
                      checked={emailSettings.sendWelcomeEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendWelcomeEmail: checked})}
                    />
                    <Label htmlFor="welcome-email">
                      {language === 'en' ? 'Send welcome email to new users' : 'إرسال بريد ترحيبي للمستخدمين الجدد'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="waiting-list-email" 
                      checked={emailSettings.sendWaitingListEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendWaitingListEmail: checked})}
                    />
                    <Label htmlFor="waiting-list-email">
                      {language === 'en' ? 'Send confirmation when joining waiting list' : 'إرسال تأكيد عند الانضمام إلى قائمة الانتظار'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="jam3a-join-email" 
                      checked={emailSettings.sendJam3aJoinEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendJam3aJoinEmail: checked})}
                    />
                    <Label htmlFor="jam3a-join-email">
                      {language === 'en' ? 'Send confirmation when joining a Jam3a' : 'إرسال تأكيد عند الانضمام إلى جمعة'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="jam3a-creation-email" 
                      checked={emailSettings.sendJam3aCreationEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendJam3aCreationEmail: checked})}
                    />
                    <Label htmlFor="jam3a-creation-email">
                      {language === 'en' ? 'Send confirmation when creating a Jam3a' : 'إرسال تأكيد عند إنشاء جمعة'}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">
                  {language === 'en' ? 'Email Limits' : 'حدود البريد الإلكتروني'}
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="max-daily-emails">
                    {language === 'en' ? 'Maximum Daily Emails' : 'الحد الأقصى للرسائل اليومية'}
                  </Label>
                  <Input 
                    id="max-daily-emails" 
                    type="number" 
                    value={emailSettings.maxDailyEmails} 
                    onChange={(e) => setEmailSettings({...emailSettings, maxDailyEmails: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Save Settings' : 'حفظ الإعدادات'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedEmailManager;
