import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Package, Search, ArrowRight, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrackOrder = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock order data for demonstration
  const mockOrders = {
    'JAM-1234': {
      id: 'JAM-1234',
      date: '2025-03-15',
      status: 'delivered',
      product: 'iPhone 16 Pro Max 256GB',
      price: 4199,
      customer: 'Mohammed Al-Qahtani',
      address: 'King Fahd Road, Riyadh, Saudi Arabia',
      timeline: [
        { date: '2025-03-15 10:30', status: 'order_placed', description: 'Order placed' },
        { date: '2025-03-15 14:45', status: 'payment_confirmed', description: 'Payment confirmed' },
        { date: '2025-03-16 09:15', status: 'processing', description: 'Order processing' },
        { date: '2025-03-17 11:30', status: 'shipped', description: 'Order shipped' },
        { date: '2025-03-19 14:20', status: 'delivered', description: 'Order delivered' }
      ]
    },
    'JAM-5678': {
      id: 'JAM-5678',
      date: '2025-04-01',
      status: 'shipped',
      product: 'MacBook Pro 16" M3 Pro',
      price: 8499,
      customer: 'Sara Al-Sulaiman',
      address: 'Olaya Street, Riyadh, Saudi Arabia',
      timeline: [
        { date: '2025-04-01 16:20', status: 'order_placed', description: 'Order placed' },
        { date: '2025-04-01 16:45', status: 'payment_confirmed', description: 'Payment confirmed' },
        { date: '2025-04-02 10:30', status: 'processing', description: 'Order processing' },
        { date: '2025-04-03 09:15', status: 'shipped', description: 'Order shipped' }
      ]
    },
    'JAM-9012': {
      id: 'JAM-9012',
      date: '2025-04-03',
      status: 'processing',
      product: 'AirPods Pro 2',
      price: 799,
      customer: 'Ahmed Al-Ghamdi',
      address: 'Prince Sultan Road, Jeddah, Saudi Arabia',
      timeline: [
        { date: '2025-04-03 11:10', status: 'order_placed', description: 'Order placed' },
        { date: '2025-04-03 11:25', status: 'payment_confirmed', description: 'Payment confirmed' },
        { date: '2025-04-04 08:45', status: 'processing', description: 'Order processing' }
      ]
    }
  };

  const content = {
    en: {
      title: "Track Your Order",
      subtitle: "Enter your order number to track your Jam3a purchase",
      orderNumber: "Order Number",
      orderNumberPlaceholder: "e.g., JAM-1234",
      trackButton: "Track Order",
      noResult: "No order found with this number. Please check and try again.",
      orderDetails: "Order Details",
      orderStatus: "Order Status",
      orderTimeline: "Order Timeline",
      orderInfo: {
        id: "Order ID",
        date: "Order Date",
        product: "Product",
        price: "Price",
        customer: "Customer",
        address: "Shipping Address"
      },
      status: {
        order_placed: "Order Placed",
        payment_confirmed: "Payment Confirmed",
        processing: "Processing",
        shipped: "Shipped",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled"
      },
      statusDescription: {
        order_placed: "Your order has been placed successfully.",
        payment_confirmed: "Your payment has been confirmed.",
        processing: "Your order is being processed.",
        shipped: "Your order has been shipped.",
        out_for_delivery: "Your order is out for delivery.",
        delivered: "Your order has been delivered.",
        cancelled: "Your order has been cancelled."
      },
      needHelp: "Need Help?",
      contactSupport: "Contact our support team for assistance with your order.",
      contactButton: "Contact Support"
    },
    ar: {
      title: "تتبع طلبك",
      subtitle: "أدخل رقم طلبك لتتبع مشترياتك من جمعة",
      orderNumber: "رقم الطلب",
      orderNumberPlaceholder: "مثال: JAM-1234",
      trackButton: "تتبع الطلب",
      noResult: "لم يتم العثور على طلب بهذا الرقم. يرجى التحقق والمحاولة مرة أخرى.",
      orderDetails: "تفاصيل الطلب",
      orderStatus: "حالة الطلب",
      orderTimeline: "الجدول الزمني للطلب",
      orderInfo: {
        id: "رقم الطلب",
        date: "تاريخ الطلب",
        product: "المنتج",
        price: "السعر",
        customer: "العميل",
        address: "عنوان الشحن"
      },
      status: {
        order_placed: "تم تقديم الطلب",
        payment_confirmed: "تم تأكيد الدفع",
        processing: "قيد المعالجة",
        shipped: "تم الشحن",
        out_for_delivery: "خارج للتوصيل",
        delivered: "تم التوصيل",
        cancelled: "تم الإلغاء"
      },
      statusDescription: {
        order_placed: "تم تقديم طلبك بنجاح.",
        payment_confirmed: "تم تأكيد الدفع الخاص بك.",
        processing: "طلبك قيد المعالجة.",
        shipped: "تم شحن طلبك.",
        out_for_delivery: "طلبك خارج للتوصيل.",
        delivered: "تم توصيل طلبك.",
        cancelled: "تم إلغاء طلبك."
      },
      needHelp: "هل تحتاج إلى مساعدة؟",
      contactSupport: "اتصل بفريق الدعم للحصول على المساعدة بخصوص طلبك.",
      contactButton: "اتصل بالدعم"
    }
  };

  const currentContent = content[language];

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const result = mockOrders[orderNumber];
      setTrackingResult(result || null);
      
      if (!result) {
        toast({
          title: currentContent.noResult,
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'order_placed':
        return <Package className="h-5 w-5" />;
      case 'payment_confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'processing':
        return <Clock className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status) => {
    let color;
    switch (status) {
      case 'delivered':
        color = 'bg-green-500';
        break;
      case 'shipped':
      case 'out_for_delivery':
        color = 'bg-blue-500';
        break;
      case 'processing':
      case 'payment_confirmed':
        color = 'bg-yellow-500';
        break;
      case 'cancelled':
        color = 'bg-red-500';
        break;
      default:
        color = 'bg-gray-500';
    }
    
    return (
      <Badge className={color}>
        {currentContent.status[status] || status}
      </Badge>
    );
  };

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
            <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="orderNumber" className="mb-2">
                    {currentContent.orderNumber}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="orderNumber"
                      placeholder={currentContent.orderNumberPlaceholder}
                      className="pl-10"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={!orderNumber || isLoading} className="w-full md:w-auto">
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⟳</span>
                        {language === 'en' ? 'Tracking...' : 'جاري التتبع...'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {currentContent.trackButton}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {trackingResult && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.orderDetails}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {currentContent.orderInfo.id}
                      </p>
                      <p className="font-medium">{trackingResult.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {currentContent.orderInfo.date}
                      </p>
                      <p className="font-medium">{trackingResult.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {currentContent.orderInfo.product}
                      </p>
                      <p className="font-medium">{trackingResult.product}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {currentContent.orderInfo.price}
                      </p>
                      <p className="font-medium">{trackingResult.price} SAR</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {currentContent.orderInfo.customer}
                      </p>
                      <p className="font-medium">{trackingResult.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {currentContent.orderInfo.address}
                      </p>
                      <p className="font-medium">{trackingResult.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.orderStatus}</CardTitle>
                  <CardDescription>
                    {currentContent.statusDescription[trackingResult.status]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      {getStatusIcon(trackingResult.status)}
                      <span className="ml-2 font-medium">
                        {currentContent.status[trackingResult.status]}
                      </span>
                    </div>
                    {getStatusBadge(trackingResult.status)}
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">{currentContent.orderTimeline}</h3>
                    <div className="space-y-6">
                      {trackingResult.timeline.map((event, index) => (
                        <div key={index} className="relative pl-8">
                          {index !== trackingResult.timeline.length - 1 && (
                            <div className="absolute left-[0.9375rem] top-[1.5rem] bottom-0 w-px bg-muted" />
                          )}
                          <div className="absolute left-0 rounded-full bg-primary w-5 h-5 flex items-center justify-center">
                            {getStatusIcon(event.status)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {currentContent.status[event.status]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {event.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.needHelp}</CardTitle>
                  <CardDescription>
                    {currentContent.contactSupport}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => window.location.href = '/contact'}>
                    {currentContent.contactButton}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {!trackingResult && !isLoading && orderNumber && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-4 text-muted-foreground">{currentContent.noResult}</p>
            </div>
          )}

          {!trackingResult && !orderNumber && (
            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.needHelp}</CardTitle>
                  <CardDescription>
                    {currentContent.contactSupport}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => window.location.href = '/contact'}>
                    {currentContent.contactButton}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrder;
