import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, Save } from 'lucide-react';

const PaymentIntegration = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const { toast } = useToast();
  
  // Form states
  const [moyasarSettings, setMoyasarSettings] = useState({
    apiKey: 'test_sk_XXXXXXXXXXXXXXXXXXXXXXXX',
    publishableKey: 'test_pk_XXXXXXXXXXXXXXXXXXXXXXXX',
    testMode: true,
    currency: 'SAR',
    paymentMethods: {
      creditCard: true,
      mada: true,
      applePay: true,
      stcPay: true
    }
  });
  
  // Mock transaction data
  const mockTransactions = [
    { id: 'trx_12345', amount: 3499, status: 'completed', date: '2025-03-30', customer: 'Ahmed Al-Saud', method: 'mada' },
    { id: 'trx_12346', amount: 4199, status: 'completed', date: '2025-03-29', customer: 'Fatima Khalid', method: 'credit_card' },
    { id: 'trx_12347', amount: 5799, status: 'pending', date: '2025-03-29', customer: 'Mohammed Rahman', method: 'apple_pay' },
    { id: 'trx_12348', amount: 3299, status: 'failed', date: '2025-03-28', customer: 'Sara Abdullah', method: 'stc_pay' },
    { id: 'trx_12349', amount: 3899, status: 'completed', date: '2025-03-27', customer: 'Khalid Al-Harbi', method: 'mada' },
  ];
  
  const handleSaveSettings = () => {
    // In a real implementation, this would save to a database or API
    toast({
      title: "Payment settings saved",
      description: "Your Moyasar payment configuration has been updated.",
    });
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" /> Pending</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Failed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4" />;
      case 'mada':
        return <span className="font-bold text-xs">MADA</span>;
      case 'apple_pay':
        return <span className="font-bold text-xs">Apple Pay</span>;
      case 'stc_pay':
        return <span className="font-bold text-xs">STC Pay</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Payment Integration</h2>
      </div>
      
      <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Moyasar Settings</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="checkout">Checkout Preview</TabsTrigger>
        </TabsList>
        
        {/* Moyasar Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Moyasar Payment Gateway Configuration</CardTitle>
              <CardDescription>Configure Moyasar payment gateway for your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="moyasar-api-key">API Key (Secret Key)</Label>
                <Input 
                  id="moyasar-api-key" 
                  value={moyasarSettings.apiKey} 
                  onChange={(e) => setMoyasarSettings({...moyasarSettings, apiKey: e.target.value})}
                  placeholder="sk_XXXXXXXXXXXXXXXXXXXXXXXX"
                  type="password"
                />
                <p className="text-xs text-muted-foreground">
                  Your Moyasar secret API key (starts with sk_)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moyasar-publishable-key">Publishable Key</Label>
                <Input 
                  id="moyasar-publishable-key" 
                  value={moyasarSettings.publishableKey} 
                  onChange={(e) => setMoyasarSettings({...moyasarSettings, publishableKey: e.target.value})}
                  placeholder="pk_XXXXXXXXXXXXXXXXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground">
                  Your Moyasar publishable key (starts with pk_)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moyasar-mode">Environment</Label>
                <Select 
                  value={moyasarSettings.testMode ? "test" : "live"}
                  onValueChange={(value) => setMoyasarSettings({...moyasarSettings, testMode: value === "test"})}
                >
                  <SelectTrigger id="moyasar-mode">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test Mode</SelectItem>
                    <SelectItem value="live">Live Mode</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Test mode uses sandbox credentials and doesn't process real payments
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moyasar-currency">Currency</Label>
                <Select 
                  value={moyasarSettings.currency}
                  onValueChange={(value) => setMoyasarSettings({...moyasarSettings, currency: value})}
                >
                  <SelectTrigger id="moyasar-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                    <SelectItem value="BHD">Bahraini Dinar (BHD)</SelectItem>
                    <SelectItem value="KWD">Kuwaiti Dinar (KWD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="font-medium">Payment Methods</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
                        <input
                          type="checkbox"
                          checked={moyasarSettings.paymentMethods.creditCard}
                          onChange={(e) => setMoyasarSettings({
                            ...moyasarSettings, 
                            paymentMethods: {
                              ...moyasarSettings.paymentMethods,
                              creditCard: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Accept Visa and Mastercard credit cards
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Mada</CardTitle>
                        <input
                          type="checkbox"
                          checked={moyasarSettings.paymentMethods.mada}
                          onChange={(e) => setMoyasarSettings({
                            ...moyasarSettings, 
                            paymentMethods: {
                              ...moyasarSettings.paymentMethods,
                              mada: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Accept Saudi debit cards (Mada)
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Apple Pay</CardTitle>
                        <input
                          type="checkbox"
                          checked={moyasarSettings.paymentMethods.applePay}
                          onChange={(e) => setMoyasarSettings({
                            ...moyasarSettings, 
                            paymentMethods: {
                              ...moyasarSettings.paymentMethods,
                              applePay: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Accept payments via Apple Pay
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">STC Pay</CardTitle>
                        <input
                          type="checkbox"
                          checked={moyasarSettings.paymentMethods.stcPay}
                          onChange={(e) => setMoyasarSettings({
                            ...moyasarSettings, 
                            paymentMethods: {
                              ...moyasarSettings.paymentMethods,
                              stcPay: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Accept payments via STC Pay wallet
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" /> Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View and manage payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{transaction.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{transaction.amount} SAR</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            {getPaymentMethodIcon(transaction.method)}
                            <span className="ml-1">{transaction.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            Details <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Checkout Preview Tab */}
        <TabsContent value="checkout">
          <Card>
            <CardHeader>
              <CardTitle>Checkout Preview</CardTitle>
              <CardDescription>Preview how the payment form will appear to customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Payment Details</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="4111 1111 1111 1111" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input id="name" placeholder="Name on card" />
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full">Pay 3,499 SAR</Button>
                  </div>
                  
                  <div className="flex justify-center space-x-4 pt-2">
                    <img src="https://moyasar.com/en/assets/img/logos/mada.svg" alt="Mada" className="h-6" />
                    <img src="https://moyasar.com/en/assets/img/logos/visa.svg" alt="Visa" className="h-6" />
                    <img src="https://moyasar.com/en/assets/img/logos/mastercard.svg" alt="Mastercard" className="h-6" />
                    <img src="https://moyasar.com/en/assets/img/logos/applepay.svg" alt="Apple Pay" className="h-6" />
                  </div>
                  
                  <div className="text-center text-xs text-muted-foreground pt-2">
                    Secure payment processing by Moyasar
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentIntegration;
