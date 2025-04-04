import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Settings, Users, BarChart, RefreshCw } from 'lucide-react';

const EmailManager = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  
  const [smtpSettings, setSmtpSettings] = useState({
    host: 'smtp.example.com',
    port: '587',
    username: 'user@example.com',
    password: '********',
    encryption: 'tls',
    fromEmail: 'noreply@jam3a.me',
    fromName: 'Jam3a Hub Collective'
  });
  
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [emailTemplates, setEmailTemplates] = useState({
    welcome: {
      enabled: true,
      subject: {
        en: 'Welcome to Jam3a Hub Collective!',
        ar: 'مرحبًا بك في جمعة هب كوليكتيف!'
      },
      body: {
        en: 'Thank you for joining Jam3a Hub Collective! We\'re excited to have you as part of our community.',
        ar: 'شكرًا لانضمامك إلى جمعة هب كوليكتيف! نحن متحمسون لوجودك كجزء من مجتمعنا.'
      }
    },
    waitingList: {
      enabled: true,
      subject: {
        en: 'You\'re on the Jam3a Waiting List!',
        ar: 'أنت على قائمة انتظار جمعة!'
      },
      body: {
        en: 'Thank you for joining the Jam3a Hub Collective waiting list! We\'re thrilled about your interest in our platform.',
        ar: 'شكرًا لانضمامك إلى قائمة انتظار جمعة هب كوليكتيف! نحن متحمسون لاهتمامك بمنصتنا.'
      }
    },
    orderConfirmation: {
      enabled: true,
      subject: {
        en: 'Your Jam3a Order Confirmation - #{{orderNumber}}',
        ar: 'تأكيد طلب جمعة الخاص بك - #{{orderNumber}}'
      },
      body: {
        en: 'Thank you for your order! Your Jam3a group purchase has been confirmed.',
        ar: 'شكرًا على طلبك! تم تأكيد عملية الشراء الجماعي الخاصة بك في جمعة.'
      }
    },
    jam3aInvitation: {
      enabled: true,
      subject: {
        en: 'You\'ve Been Invited to Join a Jam3a!',
        ar: 'تمت دعوتك للانضمام إلى جمعة!'
      },
      body: {
        en: '{{inviterName}} has invited you to join their Jam3a group purchase for {{productName}}!',
        ar: 'قام {{inviterName}} بدعوتك للانضمام إلى مجموعة الشراء الخاصة بهم في جمعة لـ {{productName}}!'
      }
    }
  });
  
  const [emailStats, setEmailStats] = useState({
    totalSent: 1248,
    delivered: 1230,
    opened: 876,
    clicked: 542,
    bounced: 18,
    lastSent: '2025-04-04 14:32:15'
  });
  
  const [emailLogs, setEmailLogs] = useState([
    { id: 1, type: 'welcome', recipient: 'ahmed@example.com', status: 'delivered', sentAt: '2025-04-04 14:32:15' },
    { id: 2, type: 'orderConfirmation', recipient: 'sara@example.com', status: 'delivered', sentAt: '2025-04-04 13:45:22' },
    { id: 3, type: 'jam3aInvitation', recipient: 'mohammed@example.com', status: 'opened', sentAt: '2025-04-04 12:18:05' },
    { id: 4, type: 'waitingList', recipient: 'fatima@example.com', status: 'clicked', sentAt: '2025-04-04 11:03:47' },
    { id: 5, type: 'welcome', recipient: 'khalid@example.com', status: 'bounced', sentAt: '2025-04-04 10:22:31' }
  ]);
  
  const content = {
    en: {
      title: "Email Management",
      description: "Configure email settings, templates, and view email statistics.",
      tabs: {
        settings: "SMTP Settings",
        templates: "Email Templates",
        stats: "Statistics",
        logs: "Email Logs"
      },
      settings: {
        title: "SMTP Configuration",
        description: "Configure your SMTP server settings for sending emails.",
        host: "SMTP Host",
        port: "SMTP Port",
        username: "Username",
        password: "Password",
        encryption: "Encryption",
        fromEmail: "From Email",
        fromName: "From Name",
        testConnection: "Test Connection",
        testing: "Testing...",
        saveSettings: "Save Settings",
        testEmail: "Test Email",
        sendTestEmail: "Send Test Email",
        sending: "Sending...",
        success: "Settings saved successfully!",
        connectionSuccess: "Connection successful!",
        testEmailSuccess: "Test email sent successfully!",
        error: "An error occurred. Please try again."
      },
      templates: {
        title: "Email Templates",
        description: "Customize email templates for different notifications.",
        welcome: "Welcome Email",
        waitingList: "Waiting List Confirmation",
        orderConfirmation: "Order Confirmation",
        jam3aInvitation: "Jam3a Invitation",
        enabled: "Enabled",
        subject: "Subject",
        body: "Body Content",
        english: "English",
        arabic: "Arabic",
        preview: "Preview Template",
        save: "Save Template",
        saveSuccess: "Template saved successfully!",
        variables: "Available Variables",
        variablesHelp: "Use these variables in your templates. They will be replaced with actual values when emails are sent."
      },
      stats: {
        title: "Email Statistics",
        description: "View email performance metrics and analytics.",
        totalSent: "Total Emails Sent",
        delivered: "Delivered",
        opened: "Opened",
        clicked: "Clicked",
        bounced: "Bounced",
        lastSent: "Last Email Sent",
        deliveryRate: "Delivery Rate",
        openRate: "Open Rate",
        clickRate: "Click Rate",
        refresh: "Refresh Stats"
      },
      logs: {
        title: "Email Logs",
        description: "View history of sent emails and their status.",
        id: "ID",
        type: "Email Type",
        recipient: "Recipient",
        status: "Status",
        sentAt: "Sent At",
        actions: "Actions",
        viewDetails: "View Details",
        resend: "Resend",
        delete: "Delete",
        noLogs: "No email logs found.",
        types: {
          welcome: "Welcome",
          waitingList: "Waiting List",
          orderConfirmation: "Order Confirmation",
          jam3aInvitation: "Jam3a Invitation"
        },
        statuses: {
          delivered: "Delivered",
          opened: "Opened",
          clicked: "Clicked",
          bounced: "Bounced",
          failed: "Failed"
        }
      }
    },
    ar: {
      title: "إدارة البريد الإلكتروني",
      description: "تكوين إعدادات البريد الإلكتروني والقوالب وعرض إحصائيات البريد الإلكتروني.",
      tabs: {
        settings: "إعدادات SMTP",
        templates: "قوالب البريد الإلكتروني",
        stats: "الإحصائيات",
        logs: "سجلات البريد الإلكتروني"
      },
      settings: {
        title: "تكوين SMTP",
        description: "قم بتكوين إعدادات خادم SMTP الخاص بك لإرسال رسائل البريد الإلكتروني.",
        host: "مضيف SMTP",
        port: "منفذ SMTP",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        encryption: "التشفير",
        fromEmail: "من البريد الإلكتروني",
        fromName: "من الاسم",
        testConnection: "اختبار الاتصال",
        testing: "جاري الاختبار...",
        saveSettings: "حفظ الإعدادات",
        testEmail: "اختبار البريد الإلكتروني",
        sendTestEmail: "إرسال بريد إلكتروني للاختبار",
        sending: "جاري الإرسال...",
        success: "تم حفظ الإعدادات بنجاح!",
        connectionSuccess: "تم الاتصال بنجاح!",
        testEmailSuccess: "تم إرسال بريد الاختبار بنجاح!",
        error: "حدث خطأ. يرجى المحاولة مرة أخرى."
      },
      templates: {
        title: "قوالب البريد الإلكتروني",
        description: "تخصيص قوالب البريد الإلكتروني لإشعارات مختلفة.",
        welcome: "بريد الترحيب",
        waitingList: "تأكيد قائمة الانتظار",
        orderConfirmation: "تأكيد الطلب",
        jam3aInvitation: "دعوة جمعة",
        enabled: "مفعّل",
        subject: "الموضوع",
        body: "محتوى النص",
        english: "الإنجليزية",
        arabic: "العربية",
        preview: "معاينة القالب",
        save: "حفظ القالب",
        saveSuccess: "تم حفظ القالب بنجاح!",
        variables: "المتغيرات المتاحة",
        variablesHelp: "استخدم هذه المتغيرات في قوالبك. سيتم استبدالها بالقيم الفعلية عند إرسال رسائل البريد الإلكتروني."
      },
      stats: {
        title: "إحصائيات البريد الإلكتروني",
        description: "عرض مقاييس أداء البريد الإلكتروني والتحليلات.",
        totalSent: "إجمالي رسائل البريد الإلكتروني المرسلة",
        delivered: "تم التسليم",
        opened: "تم الفتح",
        clicked: "تم النقر",
        bounced: "مرتد",
        lastSent: "آخر بريد إلكتروني تم إرساله",
        deliveryRate: "معدل التسليم",
        openRate: "معدل الفتح",
        clickRate: "معدل النقر",
        refresh: "تحديث الإحصائيات"
      },
      logs: {
        title: "سجلات البريد الإلكتروني",
        description: "عرض سجل رسائل البريد الإلكتروني المرسلة وحالتها.",
        id: "المعرف",
        type: "نوع البريد الإلكتروني",
        recipient: "المستلم",
        status: "الحالة",
        sentAt: "تم الإرسال في",
        actions: "الإجراءات",
        viewDetails: "عرض التفاصيل",
        resend: "إعادة الإرسال",
        delete: "حذف",
        noLogs: "لم يتم العثور على سجلات بريد إلكتروني.",
        types: {
          welcome: "ترحيب",
          waitingList: "قائمة الانتظار",
          orderConfirmation: "تأكيد الطلب",
          jam3aInvitation: "دعوة جمعة"
        },
        statuses: {
          delivered: "تم التسليم",
          opened: "تم الفتح",
          clicked: "تم النقر",
          bounced: "مرتد",
          failed: "فشل"
        }
      }
    }
  };

  const currentContent = content[language];
  
  const handleSaveSettings = () => {
    // In a real implementation, this would save the settings to the backend
    toast({
      title: currentContent.settings.success,
      variant: "success"
    });
  };
  
  const handleTestConnection = () => {
    setIsConnecting(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: currentContent.settings.connectionSuccess,
        variant: "success"
      });
      setIsConnecting(false);
    }, 1500);
  };
  
  const handleSendTestEmail = () => {
    if (!testEmail) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: currentContent.settings.testEmailSuccess,
        variant: "success"
      });
      setIsSending(false);
      setTestEmail('');
    }, 1500);
  };
  
  const handleSaveTemplate = (templateType) => {
    // In a real implementation, this would save the template to the backend
    toast({
      title: currentContent.templates.saveSuccess,
      variant: "success"
    });
  };
  
  const handleTemplateChange = (templateType, field, language, value) => {
    setEmailTemplates(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        [field]: {
          ...prev[templateType][field],
          [language]: value
        }
      }
    }));
  };
  
  const handleToggleTemplate = (templateType, enabled) => {
    setEmailTemplates(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        enabled
      }
    }));
  };
  
  const handleRefreshStats = () => {
    // In a real implementation, this would fetch the latest stats from the backend
    toast({
      title: "Statistics refreshed",
      variant: "success"
    });
  };
  
  const calculateRate = (numerator, denominator) => {
    return ((numerator / denominator) * 100).toFixed(1) + '%';
  };

  return (
    <div className={`w-full ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{currentContent.title}</h2>
        <p className="text-muted-foreground">{currentContent.description}</p>
      </div>
      
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="settings">{currentContent.tabs.settings}</TabsTrigger>
          <TabsTrigger value="templates">{currentContent.tabs.templates}</TabsTrigger>
          <TabsTrigger value="stats">{currentContent.tabs.stats}</TabsTrigger>
          <TabsTrigger value="logs">{currentContent.tabs.logs}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.settings.title}</CardTitle>
              <CardDescription>{currentContent.settings.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="host">{currentContent.settings.host}</Label>
                  <Input
                    id="host"
                    value={smtpSettings.host}
                    onChange={(e) => setSmtpSettings({...smtpSettings, host: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">{currentContent.settings.port}</Label>
                  <Input
                    id="port"
                    value={smtpSettings.port}
                    onChange={(e) => setSmtpSettings({...smtpSettings, port: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">{currentContent.settings.username}</Label>
                  <Input
                    id="username"
                    value={smtpSettings.username}
                    onChange={(e) => setSmtpSettings({...smtpSettings, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{currentContent.settings.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={smtpSettings.password}
                    onChange={(e) => setSmtpSettings({...smtpSettings, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encryption">{currentContent.settings.encryption}</Label>
                  <Select
                    value={smtpSettings.encryption}
                    onValueChange={(value) => setSmtpSettings({...smtpSettings, encryption: value})}
                  >
                    <SelectTrigger id="encryption">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">{currentContent.settings.fromEmail}</Label>
                  <Input
                    id="fromEmail"
                    value={smtpSettings.fromEmail}
                    onChange={(e) => setSmtpSettings({...smtpSettings, fromEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fromName">{currentContent.settings.fromName}</Label>
                  <Input
                    id="fromName"
                    value={smtpSettings.fromName}
                    onChange={(e) => setSmtpSettings({...smtpSettings, fromName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button onClick={handleSaveSettings} className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  {currentContent.settings.saveSettings}
                </Button>
                <Button onClick={handleTestConnection} variant="outline" className="flex-1" disabled={isConnecting}>
                  {isConnecting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⟳</span>
                      {currentContent.settings.testing}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {currentContent.settings.testConnection}
                    </span>
                  )}
                </Button>
              </div>
              
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">{currentContent.settings.testEmail}</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="email@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSendTestEmail} disabled={isSending || !testEmail}>
                    {isSending ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⟳</span>
                        {currentContent.settings.sending}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        {currentContent.settings.sendTestEmail}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.templates.title}</CardTitle>
              <CardDescription>{currentContent.templates.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="welcome" className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="welcome">{currentContent.templates.welcome}</TabsTrigger>
                  <TabsTrigger value="waitingList">{currentContent.templates.waitingList}</TabsTrigger>
                  <TabsTrigger value="orderConfirmation">{currentContent.templates.orderConfirmation}</TabsTrigger>
                  <TabsTrigger value="jam3aInvitation">{currentContent.templates.jam3aInvitation}</TabsTrigger>
                </TabsList>
                
                {Object.keys(emailTemplates).map((templateType) => (
                  <TabsContent key={templateType} value={templateType}>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${templateType}-enabled`}
                          checked={emailTemplates[templateType].enabled}
                          onCheckedChange={(checked) => handleToggleTemplate(templateType, checked)}
                        />
                        <Label htmlFor={`${templateType}-enabled`}>{currentContent.templates.enabled}</Label>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{currentContent.templates.subject}</h3>
                        <Tabs defaultValue="en" className="w-full">
                          <TabsList className="grid grid-cols-2 mb-4 w-40">
                            <TabsTrigger value="en">{currentContent.templates.english}</TabsTrigger>
                            <TabsTrigger value="ar">{currentContent.templates.arabic}</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="en">
                            <Input
                              value={emailTemplates[templateType].subject.en}
                              onChange={(e) => handleTemplateChange(templateType, 'subject', 'en', e.target.value)}
                            />
                          </TabsContent>
                          
                          <TabsContent value="ar">
                            <Input
                              value={emailTemplates[templateType].subject.ar}
                              onChange={(e) => handleTemplateChange(templateType, 'subject', 'ar', e.target.value)}
                              className="text-right"
                              dir="rtl"
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{currentContent.templates.body}</h3>
                        <Tabs defaultValue="en" className="w-full">
                          <TabsList className="grid grid-cols-2 mb-4 w-40">
                            <TabsTrigger value="en">{currentContent.templates.english}</TabsTrigger>
                            <TabsTrigger value="ar">{currentContent.templates.arabic}</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="en">
                            <Textarea
                              rows={8}
                              value={emailTemplates[templateType].body.en}
                              onChange={(e) => handleTemplateChange(templateType, 'body', 'en', e.target.value)}
                            />
                          </TabsContent>
                          
                          <TabsContent value="ar">
                            <Textarea
                              rows={8}
                              value={emailTemplates[templateType].body.ar}
                              onChange={(e) => handleTemplateChange(templateType, 'body', 'ar', e.target.value)}
                              className="text-right"
                              dir="rtl"
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <Button onClick={() => handleSaveTemplate(templateType)} className="flex-1">
                          {currentContent.templates.save}
                        </Button>
                        <Button variant="outline" className="flex-1">
                          {currentContent.templates.preview}
                        </Button>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md mt-6">
                        <h4 className="font-medium mb-2">{currentContent.templates.variables}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{currentContent.templates.variablesHelp}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {templateType === 'welcome' && (
                            <>
                              <code className="bg-background p-1 rounded text-sm">{'{{name}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{shopUrl}}'}</code>
                            </>
                          )}
                          {templateType === 'waitingList' && (
                            <>
                              <code className="bg-background p-1 rounded text-sm">{'{{name}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{position}}'}</code>
                            </>
                          )}
                          {templateType === 'orderConfirmation' && (
                            <>
                              <code className="bg-background p-1 rounded text-sm">{'{{name}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{orderNumber}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{orderDate}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{productName}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{price}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{estimatedDelivery}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{trackingUrl}}'}</code>
                            </>
                          )}
                          {templateType === 'jam3aInvitation' && (
                            <>
                              <code className="bg-background p-1 rounded text-sm">{'{{inviterName}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{productName}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{price}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{regularPrice}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{currentParticipants}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{requiredParticipants}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{timeRemaining}}'}</code>
                              <code className="bg-background p-1 rounded text-sm">{'{{joinUrl}}'}</code>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.stats.title}</CardTitle>
              <CardDescription>{currentContent.stats.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Mail className="h-8 w-8 text-jam3a-purple mx-auto mb-2" />
                      <h3 className="text-2xl font-bold">{emailStats.totalSent}</h3>
                      <p className="text-muted-foreground">{currentContent.stats.totalSent}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-jam3a-purple mx-auto mb-2" />
                      <h3 className="text-2xl font-bold">{emailStats.opened}</h3>
                      <p className="text-muted-foreground">{currentContent.stats.opened}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <BarChart className="h-8 w-8 text-jam3a-purple mx-auto mb-2" />
                      <h3 className="text-2xl font-bold">{emailStats.clicked}</h3>
                      <p className="text-muted-foreground">{currentContent.stats.clicked}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{currentContent.stats.lastSent}</h3>
                  <p className="text-2xl font-bold">{emailStats.lastSent}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentContent.stats.deliveryRate}</span>
                      <span className="text-sm font-medium">{calculateRate(emailStats.delivered, emailStats.totalSent)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-jam3a-purple h-2.5 rounded-full" style={{ width: calculateRate(emailStats.delivered, emailStats.totalSent) }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentContent.stats.openRate}</span>
                      <span className="text-sm font-medium">{calculateRate(emailStats.opened, emailStats.delivered)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-jam3a-purple h-2.5 rounded-full" style={{ width: calculateRate(emailStats.opened, emailStats.delivered) }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentContent.stats.clickRate}</span>
                      <span className="text-sm font-medium">{calculateRate(emailStats.clicked, emailStats.opened)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-jam3a-purple h-2.5 rounded-full" style={{ width: calculateRate(emailStats.clicked, emailStats.opened) }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleRefreshStats}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {currentContent.stats.refresh}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.logs.title}</CardTitle>
              <CardDescription>{currentContent.logs.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.logs.id}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.logs.type}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.logs.recipient}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.logs.status}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.logs.sentAt}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.logs.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogs.map((log) => (
                        <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{log.id}</td>
                          <td className="p-4 align-middle">{currentContent.logs.types[log.type]}</td>
                          <td className="p-4 align-middle">{log.recipient}</td>
                          <td className="p-4 align-middle">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              log.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              log.status === 'opened' ? 'bg-blue-100 text-blue-800' :
                              log.status === 'clicked' ? 'bg-purple-100 text-purple-800' :
                              log.status === 'bounced' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {currentContent.logs.statuses[log.status]}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{log.sentAt}</td>
                          <td className="p-4 align-middle">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                {currentContent.logs.viewDetails}
                              </Button>
                              <Button variant="ghost" size="sm">
                                {currentContent.logs.resend}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailManager;
