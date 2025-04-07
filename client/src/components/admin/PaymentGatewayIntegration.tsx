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
import { CreditCard, Settings, Shield, ChevronsUpDown, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentGatewayIntegration = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  
  const [moyasarSettings, setMoyasarSettings] = useState({
    apiKey: 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXX',
    publishableKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX',
    environment: 'test',
    currency: 'SAR',
    callbackUrl: 'https://jam3a.me/payment/callback',
    webhookUrl: 'https://jam3a.me/api/webhooks/moyasar',
    webhookSecret: 'whsec_XXXXXXXXXXXXXXXXXXXXXXXX',
    enabled: true
  });
  
  const [testAmount, setTestAmount] = useState('10.00');
  const [isTesting, setIsTesting] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: true,
    mada: true,
    applePay: false,
    stcPay: true
  });
  
  const [transactionLogs, setTransactionLogs] = useState([
    { id: 'pay_123456789', amount: '299.00', status: 'captured', method: 'creditCard', customer: 'ahmed@example.com', date: '2025-04-04 14:32:15' },
    { id: 'pay_123456788', amount: '199.00', status: 'captured', method: 'mada', customer: 'sara@example.com', date: '2025-04-04 13:45:22' },
    { id: 'pay_123456787', amount: '399.00', status: 'failed', method: 'creditCard', customer: 'mohammed@example.com', date: '2025-04-04 12:18:05' },
    { id: 'pay_123456786', amount: '149.00', status: 'captured', method: 'stcPay', customer: 'fatima@example.com', date: '2025-04-04 11:03:47' },
    { id: 'pay_123456785', amount: '249.00', status: 'refunded', method: 'mada', customer: 'khalid@example.com', date: '2025-04-04 10:22:31' }
  ]);
  
  const content = {
    en: {
      title: "Payment Gateway Integration",
      description: "Configure Moyasar payment gateway settings and manage payment options.",
      tabs: {
        settings: "Gateway Settings",
        methods: "Payment Methods",
        security: "Security & Webhooks",
        transactions: "Transaction Logs"
      },
      settings: {
        title: "Moyasar Configuration",
        description: "Configure your Moyasar payment gateway integration.",
        apiKey: "API Key (Secret Key)",
        publishableKey: "Publishable Key",
        environment: "Environment",
        test: "Test",
        live: "Live",
        currency: "Currency",
        enabled: "Enable Moyasar Payments",
        saveSettings: "Save Settings",
        testPayment: "Test Payment",
        amount: "Amount (SAR)",
        runTest: "Run Test Payment",
        testing: "Processing...",
        success: "Settings saved successfully!",
        testSuccess: "Test payment processed successfully!",
        error: "An error occurred. Please try again."
      },
      methods: {
        title: "Payment Methods",
        description: "Enable or disable payment methods for your customers.",
        creditCard: "Credit Card",
        creditCardDesc: "Accept Visa and Mastercard payments",
        mada: "mada",
        madaDesc: "Accept mada debit card payments",
        applePay: "Apple Pay",
        applePayDesc: "Accept Apple Pay payments (requires additional setup)",
        stcPay: "STC Pay",
        stcPayDesc: "Accept STC Pay wallet payments",
        saveChanges: "Save Changes",
        success: "Payment methods updated successfully!"
      },
      security: {
        title: "Security & Webhooks",
        description: "Configure security settings and webhook endpoints for payment notifications.",
        callbackUrl: "Callback URL",
        webhookUrl: "Webhook URL",
        webhookSecret: "Webhook Secret",
        ipWhitelist: "IP Whitelist (Optional)",
        ipWhitelistDesc: "Restrict webhook access to specific IP addresses (comma separated)",
        saveSettings: "Save Settings",
        success: "Security settings saved successfully!"
      },
      transactions: {
        title: "Transaction Logs",
        description: "View and manage payment transactions.",
        id: "Transaction ID",
        amount: "Amount",
        status: "Status",
        method: "Payment Method",
        customer: "Customer",
        date: "Date",
        actions: "Actions",
        viewDetails: "View Details",
        refund: "Refund",
        noTransactions: "No transactions found.",
        methods: {
          creditCard: "Credit Card",
          mada: "mada",
          applePay: "Apple Pay",
          stcPay: "STC Pay"
        },
        statuses: {
          initiated: "Initiated",
          authorized: "Authorized",
          captured: "Captured",
          failed: "Failed",
          refunded: "Refunded"
        }
      }
    },
    ar: {
      title: "تكامل بوابة الدفع",
      description: "تكوين إعدادات بوابة الدفع مياسر وإدارة خيارات الدفع.",
      tabs: {
        settings: "إعدادات البوابة",
        methods: "طرق الدفع",
        security: "الأمان والويب هوكس",
        transactions: "سجلات المعاملات"
      },
      settings: {
        title: "تكوين مياسر",
        description: "تكوين تكامل بوابة الدفع مياسر الخاصة بك.",
        apiKey: "مفتاح API (المفتاح السري)",
        publishableKey: "المفتاح القابل للنشر",
        environment: "البيئة",
        test: "اختبار",
        live: "مباشر",
        currency: "العملة",
        enabled: "تمكين مدفوعات مياسر",
        saveSettings: "حفظ الإعدادات",
        testPayment: "اختبار الدفع",
        amount: "المبلغ (ريال سعودي)",
        runTest: "تشغيل اختبار الدفع",
        testing: "جاري المعالجة...",
        success: "تم حفظ الإعدادات بنجاح!",
        testSuccess: "تمت معالجة اختبار الدفع بنجاح!",
        error: "حدث خطأ. يرجى المحاولة مرة أخرى."
      },
      methods: {
        title: "طرق الدفع",
        description: "تمكين أو تعطيل طرق الدفع لعملائك.",
        creditCard: "بطاقة ائتمان",
        creditCardDesc: "قبول مدفوعات فيزا وماستركارد",
        mada: "مدى",
        madaDesc: "قبول مدفوعات بطاقة الخصم مدى",
        applePay: "آبل باي",
        applePayDesc: "قبول مدفوعات آبل باي (يتطلب إعدادًا إضافيًا)",
        stcPay: "STC Pay",
        stcPayDesc: "قبول مدفوعات محفظة STC Pay",
        saveChanges: "حفظ التغييرات",
        success: "تم تحديث طرق الدفع بنجاح!"
      },
      security: {
        title: "الأمان والويب هوكس",
        description: "تكوين إعدادات الأمان ونقاط نهاية الويب هوك لإشعارات الدفع.",
        callbackUrl: "عنوان URL للاستدعاء",
        webhookUrl: "عنوان URL للويب هوك",
        webhookSecret: "سر الويب هوك",
        ipWhitelist: "القائمة البيضاء لعناوين IP (اختياري)",
        ipWhitelistDesc: "تقييد الوصول إلى الويب هوك لعناوين IP محددة (مفصولة بفواصل)",
        saveSettings: "حفظ الإعدادات",
        success: "تم حفظ إعدادات الأمان بنجاح!"
      },
      transactions: {
        title: "سجلات المعاملات",
        description: "عرض وإدارة معاملات الدفع.",
        id: "معرف المعاملة",
        amount: "المبلغ",
        status: "الحالة",
        method: "طريقة الدفع",
        customer: "العميل",
        date: "التاريخ",
        actions: "الإجراءات",
        viewDetails: "عرض التفاصيل",
        refund: "استرداد",
        noTransactions: "لم يتم العثور على معاملات.",
        methods: {
          creditCard: "بطاقة ائتمان",
          mada: "مدى",
          applePay: "آبل باي",
          stcPay: "STC Pay"
        },
        statuses: {
          initiated: "تم البدء",
          authorized: "تم التفويض",
          captured: "تم التحصيل",
          failed: "فشل",
          refunded: "تم الاسترداد"
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
  
  const handleTestPayment = () => {
    if (!testAmount || isNaN(parseFloat(testAmount))) {
      toast({
        title: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsTesting(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: currentContent.settings.testSuccess,
        variant: "success"
      });
      setIsTesting(false);
    }, 2000);
  };
  
  const handleSavePaymentMethods = () => {
    // In a real implementation, this would save the payment methods to the backend
    toast({
      title: currentContent.methods.success,
      variant: "success"
    });
  };
  
  const handleSaveSecuritySettings = () => {
    // In a real implementation, this would save the security settings to the backend
    toast({
      title: currentContent.security.success,
      variant: "success"
    });
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
          <TabsTrigger value="methods">{currentContent.tabs.methods}</TabsTrigger>
          <TabsTrigger value="security">{currentContent.tabs.security}</TabsTrigger>
          <TabsTrigger value="transactions">{currentContent.tabs.transactions}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.settings.title}</CardTitle>
              <CardDescription>{currentContent.settings.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Switch
                  id="moyasar-enabled"
                  checked={moyasarSettings.enabled}
                  onCheckedChange={(checked) => setMoyasarSettings({...moyasarSettings, enabled: checked})}
                />
                <Label htmlFor="moyasar-enabled">{currentContent.settings.enabled}</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">{currentContent.settings.apiKey}</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={moyasarSettings.apiKey}
                    onChange={(e) => setMoyasarSettings({...moyasarSettings, apiKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishableKey">{currentContent.settings.publishableKey}</Label>
                  <Input
                    id="publishableKey"
                    value={moyasarSettings.publishableKey}
                    onChange={(e) => setMoyasarSettings({...moyasarSettings, publishableKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">{currentContent.settings.environment}</Label>
                  <Select
                    value={moyasarSettings.environment}
                    onValueChange={(value) => setMoyasarSettings({...moyasarSettings, environment: value})}
                  >
                    <SelectTrigger id="environment">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">{currentContent.settings.test}</SelectItem>
                      <SelectItem value="live">{currentContent.settings.live}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{currentContent.settings.currency}</Label>
                  <Select
                    value={moyasarSettings.currency}
                    onValueChange={(value) => setMoyasarSettings({...moyasarSettings, currency: value})}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} className="mt-4">
                <Settings className="mr-2 h-4 w-4" />
                {currentContent.settings.saveSettings}
              </Button>
              
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">{currentContent.settings.testPayment}</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <div className="space-y-2">
                      <Label htmlFor="testAmount">{currentContent.settings.amount}</Label>
                      <Input
                        id="testAmount"
                        value={testAmount}
                        onChange={(e) => setTestAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleTestPayment} disabled={isTesting || !moyasarSettings.enabled}>
                      {isTesting ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">⟳</span>
                          {currentContent.settings.testing}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          {currentContent.settings.runTest}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.methods.title}</CardTitle>
              <CardDescription>{currentContent.methods.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <div className="font-medium">{currentContent.methods.creditCard}</div>
                    <div className="text-sm text-muted-foreground">{currentContent.methods.creditCardDesc}</div>
                  </div>
                  <Switch
                    checked={paymentMethods.creditCard}
                    onCheckedChange={(checked) => setPaymentMethods({...paymentMethods, creditCard: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <div className="font-medium">{currentContent.methods.mada}</div>
                    <div className="text-sm text-muted-foreground">{currentContent.methods.madaDesc}</div>
                  </div>
                  <Switch
                    checked={paymentMethods.mada}
                    onCheckedChange={(checked) => setPaymentMethods({...paymentMethods, mada: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <div className="font-medium">{currentContent.methods.applePay}</div>
                    <div className="text-sm text-muted-foreground">{currentContent.methods.applePayDesc}</div>
                  </div>
                  <Switch
                    checked={paymentMethods.applePay}
                    onCheckedChange={(checked) => setPaymentMethods({...paymentMethods, applePay: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <div className="font-medium">{currentContent.methods.stcPay}</div>
                    <div className="text-sm text-muted-foreground">{currentContent.methods.stcPayDesc}</div>
                  </div>
                  <Switch
                    checked={paymentMethods.stcPay}
                    onCheckedChange={(checked) => setPaymentMethods({...paymentMethods, stcPay: checked})}
                  />
                </div>
              </div>
              
              <Button onClick={handleSavePaymentMethods} className="mt-4">
                {currentContent.methods.saveChanges}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.security.title}</CardTitle>
              <CardDescription>{currentContent.security.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="callbackUrl">{currentContent.security.callbackUrl}</Label>
                  <Input
                    id="callbackUrl"
                    value={moyasarSettings.callbackUrl}
                    onChange={(e) => setMoyasarSettings({...moyasarSettings, callbackUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">{currentContent.security.webhookUrl}</Label>
                  <Input
                    id="webhookUrl"
                    value={moyasarSettings.webhookUrl}
                    onChange={(e) => setMoyasarSettings({...moyasarSettings, webhookUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">{currentContent.security.webhookSecret}</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    value={moyasarSettings.webhookSecret}
                    onChange={(e) => setMoyasarSettings({...moyasarSettings, webhookSecret: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">{currentContent.security.ipWhitelist}</Label>
                  <Input
                    id="ipWhitelist"
                    placeholder="192.168.1.1, 10.0.0.1"
                  />
                  <p className="text-sm text-muted-foreground">{currentContent.security.ipWhitelistDesc}</p>
                </div>
              </div>
              
              <Button onClick={handleSaveSecuritySettings} className="mt-4">
                <Shield className="mr-2 h-4 w-4" />
                {currentContent.security.saveSettings}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.transactions.title}</CardTitle>
              <CardDescription>{currentContent.transactions.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.transactions.id}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.transactions.amount}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.transactions.status}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.transactions.method}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.transactions.customer}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.transactions.date}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{currentContent.transactions.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionLogs.map((transaction) => (
                        <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{transaction.id}</td>
                          <td className="p-4 align-middle">{transaction.amount} SAR</td>
                          <td className="p-4 align-middle">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              transaction.status === 'captured' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'authorized' ? 'bg-blue-100 text-blue-800' :
                              transaction.status === 'initiated' ? 'bg-yellow-100 text-yellow-800' :
                              transaction.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status === 'captured' && <CheckCircle className="mr-1 h-3 w-3" />}
                              {transaction.status === 'failed' && <AlertCircle className="mr-1 h-3 w-3" />}
                              {currentContent.transactions.statuses[transaction.status]}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{currentContent.transactions.methods[transaction.method]}</td>
                          <td className="p-4 align-middle">{transaction.customer}</td>
                          <td className="p-4 align-middle">{transaction.date}</td>
                          <td className="p-4 align-middle">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                {currentContent.transactions.viewDetails}
                              </Button>
                              {transaction.status === 'captured' && (
                                <Button variant="ghost" size="sm">
                                  {currentContent.transactions.refund}
                                </Button>
                              )}
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

export default PaymentGatewayIntegration;
