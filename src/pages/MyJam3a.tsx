import React from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

const MyJam3a = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Sample data for active and past Jam3a deals
  const activeDeals = [
    {
      id: 'jam3a-001',
      title: {
        en: 'Samsung 55" QLED 4K Smart TV',
        ar: 'تلفزيون سامسونج ذكي QLED 4K مقاس 55 بوصة'
      },
      image: '/images/products/tv.jpg',
      regularPrice: 3999,
      jam3aPrice: 2899,
      participants: {
        current: 3,
        required: 5
      },
      timeLeft: '2 days',
      status: 'active'
    },
    {
      id: 'jam3a-002',
      title: {
        en: 'Apple AirPods Pro (2nd Generation)',
        ar: 'سماعات أبل إيربودز برو (الجيل الثاني)'
      },
      image: '/images/products/airpods.jpg',
      regularPrice: 999,
      jam3aPrice: 799,
      participants: {
        current: 4,
        required: 5
      },
      timeLeft: '1 day',
      status: 'active'
    }
  ];
  
  const pastDeals = [
    {
      id: 'jam3a-003',
      title: {
        en: 'Dyson V12 Detect Slim Cordless Vacuum',
        ar: 'مكنسة دايسون V12 ديتكت سليم لاسلكية'
      },
      image: '/images/products/vacuum.jpg',
      regularPrice: 2499,
      jam3aPrice: 1899,
      date: '2023-03-15',
      status: 'completed',
      orderNumber: 'JAM3A-12345'
    },
    {
      id: 'jam3a-004',
      title: {
        en: 'Nike Air Zoom Pegasus 39 Running Shoes',
        ar: 'حذاء نايك اير زوم بيجاسوس 39 للجري'
      },
      image: '/images/products/shoes.jpg',
      regularPrice: 599,
      jam3aPrice: 449,
      date: '2023-02-20',
      status: 'completed',
      orderNumber: 'JAM3A-12346'
    },
    {
      id: 'jam3a-005',
      title: {
        en: 'KitchenAid Stand Mixer Professional 5',
        ar: 'خلاط كيتشن ايد ستاند ميكسر بروفيشنال 5'
      },
      image: '/images/products/mixer.jpg',
      regularPrice: 1899,
      jam3aPrice: 1499,
      date: '2023-01-10',
      status: 'cancelled',
      orderNumber: 'JAM3A-12347'
    }
  ];
  
  const content = {
    en: {
      title: "My Jam3a",
      subtitle: "Manage your group buying deals",
      activeTab: "Active Jam3a",
      historyTab: "Jam3a History",
      noActiveDeals: "You don't have any active Jam3a deals",
      noPastDeals: "You don't have any past Jam3a deals",
      browseDeals: "Browse Deals",
      startJam3a: "Start Your Own Jam3a",
      loginRequired: "Please log in to view your Jam3a deals",
      login: "Log In",
      regularPrice: "Regular Price",
      jam3aPrice: "Jam3a Price",
      participants: "Participants",
      timeLeft: "Time Left",
      viewDetails: "View Details",
      inviteFriends: "Invite Friends",
      orderNumber: "Order Number",
      date: "Date",
      status: {
        active: "Active",
        completed: "Completed",
        cancelled: "Cancelled",
        pending: "Pending"
      },
      trackOrder: "Track Order",
      required: "required"
    },
    ar: {
      title: "جمعتي",
      subtitle: "إدارة صفقات الشراء الجماعي الخاصة بك",
      activeTab: "جمعة نشطة",
      historyTab: "سجل الجمعة",
      noActiveDeals: "ليس لديك أي صفقات جمعة نشطة",
      noPastDeals: "ليس لديك أي صفقات جمعة سابقة",
      browseDeals: "تصفح الصفقات",
      startJam3a: "ابدأ جمعتك الخاصة",
      loginRequired: "يرجى تسجيل الدخول لعرض صفقات جمعتك",
      login: "تسجيل الدخول",
      regularPrice: "السعر العادي",
      jam3aPrice: "سعر جمعة",
      participants: "المشاركون",
      timeLeft: "الوقت المتبقي",
      viewDetails: "عرض التفاصيل",
      inviteFriends: "دعوة الأصدقاء",
      orderNumber: "رقم الطلب",
      date: "التاريخ",
      status: {
        active: "نشط",
        completed: "مكتمل",
        cancelled: "ملغي",
        pending: "قيد الانتظار"
      },
      trackOrder: "تتبع الطلب",
      required: "مطلوب"
    }
  };

  const currentContent = content[language];
  
  const handleViewDetails = (dealId) => {
    navigate(`/jam3a/${dealId}`);
  };
  
  const handleInviteFriends = (dealId) => {
    // In a real implementation, this would open a share dialog
    // For now, we'll just simulate copying a link
    navigator.clipboard.writeText(`https://jam3a.me/j/${dealId}`);
    alert('Invitation link copied to clipboard!');
  };
  
  const handleTrackOrder = (orderNumber) => {
    navigate(`/track-order?order=${orderNumber}`);
  };
  
  const handleBrowseDeals = () => {
    navigate('/shop-jam3a');
  };
  
  const handleStartJam3a = () => {
    navigate('/start-jam3a');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const renderActiveDeals = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">{currentContent.loginRequired}</h3>
          <Button onClick={handleLogin} className="mt-4">
            {currentContent.login}
          </Button>
        </div>
      );
    }
    
    if (activeDeals.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">{currentContent.noActiveDeals}</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button onClick={handleBrowseDeals}>
              {currentContent.browseDeals}
            </Button>
            <Button onClick={handleStartJam3a} variant="outline">
              {currentContent.startJam3a}
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeDeals.map(deal => (
          <Card key={deal.id}>
            <div className="aspect-video bg-muted relative"></div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{deal.title[language]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{currentContent.regularPrice}</div>
                    <div className="text-lg line-through">{deal.regularPrice} SAR</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{currentContent.jam3aPrice}</div>
                    <div className="text-xl font-bold text-jam3a-purple">{deal.jam3aPrice} SAR</div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{currentContent.participants}</div>
                    <div className="text-lg">
                      {deal.participants.current}/{deal.participants.required} {currentContent.required}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{currentContent.timeLeft}</div>
                    <div className="text-lg">{deal.timeLeft}</div>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                    <div 
                      style={{ width: `${(deal.participants.current / deal.participants.required) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-jam3a-purple"
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => handleViewDetails(deal.id)} variant="outline" className="flex-1">
                    {currentContent.viewDetails}
                  </Button>
                  <Button onClick={() => handleInviteFriends(deal.id)} className="flex-1">
                    {currentContent.inviteFriends}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderPastDeals = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">{currentContent.loginRequired}</h3>
          <Button onClick={handleLogin} className="mt-4">
            {currentContent.login}
          </Button>
        </div>
      );
    }
    
    if (pastDeals.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">{currentContent.noPastDeals}</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button onClick={handleBrowseDeals}>
              {currentContent.browseDeals}
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {pastDeals.map(deal => (
          <Card key={deal.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="w-full md:w-1/4">
                  <div className="aspect-square w-20 h-20 bg-muted rounded-md"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{deal.title[language]}</h3>
                  <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">{currentContent.orderNumber}:</span> {deal.orderNumber}
                    </div>
                    <div>
                      <span className="text-muted-foreground">{currentContent.date}:</span> {deal.date}
                    </div>
                    <div>
                      <span className="text-muted-foreground">{currentContent.jam3aPrice}:</span> {deal.jam3aPrice} SAR
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-auto flex flex-col gap-2 items-start md:items-end">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    deal.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    deal.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentContent.status[deal.status]}
                  </div>
                  {deal.status === 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleTrackOrder(deal.orderNumber)}
                      className="mt-2"
                    >
                      {currentContent.trackOrder}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">{currentContent.activeTab}</TabsTrigger>
              <TabsTrigger value="history">{currentContent.historyTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              {renderActiveDeals()}
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              {renderPastDeals()}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyJam3a;
