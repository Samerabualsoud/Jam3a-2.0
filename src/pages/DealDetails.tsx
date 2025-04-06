import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Loader2, 
  AlertCircle, 
  ArrowRight, 
  Users, 
  Clock, 
  Share2,
  ShoppingBag,
  CheckCircle,
  Info
} from 'lucide-react';
import { fetchDealById } from '@/services/DealService';
import ScrollToTop from '@/components/ScrollToTop';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingFallback, ErrorFallback } from '@/components/FallbackComponents';

const DealDetails = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  const [deal, setDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  
  // Content based on language
  const content = {
    en: {
      title: "Deal Details",
      category: "Category",
      description: "Description",
      regularPrice: "Regular Price",
      jam3aPrice: "Jam3a Price",
      discount: "Discount",
      participants: "Participants",
      timeLeft: "Time Left",
      joinDeal: "Join This Deal",
      inviteFriends: "Invite Friends",
      loading: "Loading deal details...",
      errorTitle: "Error",
      errorGeneric: "Failed to load deal details",
      backToDeals: "Back to Deals",
      specifications: "Specifications",
      features: "Features",
      currency: "SAR",
      required: "required",
      activeJam3a: "Active Jam3a",
      jam3aHistory: "Jam3a History",
      days: "days",
      day: "day",
      viewDetails: "View Details",
      shareNow: "Share Now",
      productDetails: "Product Details",
      dealStatus: "Deal Status",
      dealProgress: "Deal Progress",
      dealParticipants: "Deal Participants",
      dealTimeRemaining: "Time Remaining",
      dealExpires: "Deal Expires",
      howItWorks: "How It Works",
      step1: "Join the deal",
      step2: "Share with friends",
      step3: "Get group discount",
      step4: "Product is shipped",
      noHistory: "No history available for this deal"
    },
    ar: {
      title: "تفاصيل الصفقة",
      category: "الفئة",
      description: "الوصف",
      regularPrice: "السعر العادي",
      jam3aPrice: "سعر جمعة",
      discount: "الخصم",
      participants: "المشاركون",
      timeLeft: "الوقت المتبقي",
      joinDeal: "انضم إلى هذه الصفقة",
      inviteFriends: "دعوة الأصدقاء",
      loading: "جاري تحميل تفاصيل الصفقة...",
      errorTitle: "خطأ",
      errorGeneric: "فشل في تحميل تفاصيل الصفقة",
      backToDeals: "العودة إلى الصفقات",
      specifications: "المواصفات",
      features: "الميزات",
      currency: "ريال",
      required: "مطلوب",
      activeJam3a: "جمعة نشطة",
      jam3aHistory: "سجل الجمعة",
      days: "أيام",
      day: "يوم",
      viewDetails: "عرض التفاصيل",
      shareNow: "شارك الآن",
      productDetails: "تفاصيل المنتج",
      dealStatus: "حالة الصفقة",
      dealProgress: "تقدم الصفقة",
      dealParticipants: "المشاركون في الصفقة",
      dealTimeRemaining: "الوقت المتبقي",
      dealExpires: "تنتهي الصفقة",
      howItWorks: "كيف تعمل",
      step1: "انضم إلى الصفقة",
      step2: "شارك مع الأصدقاء",
      step3: "احصل على خصم المجموعة",
      step4: "يتم شحن المنتج",
      noHistory: "لا يوجد سجل متاح لهذه الصفقة"
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    const loadDealData = async () => {
      if (!dealId) {
        setError('No deal ID provided. Please select a deal from the homepage.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const dealData = await fetchDealById(dealId).catch(err => {
          console.error('Error fetching deal:', err);
          return null;
        });
        
        if (!dealData) {
          throw new Error('Deal not found or could not be loaded. It may have been removed or expired.');
        }
        
        setDeal(dealData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading deal data:', err);
        setError(err.message || currentContent.errorGeneric);
        setIsLoading(false);
      }
    };

    loadDealData();
  }, [dealId, currentContent.errorGeneric]);

  const handleJoinDeal = () => {
    navigate(`/join-jam3a/${dealId}`);
  };

  const handleInviteFriends = () => {
    // In a real implementation, this would open a share dialog
    // For now, we'll just simulate copying a link
    navigator.clipboard.writeText(`https://jam3a.me/jam3a/${dealId}`);
    alert('Invitation link copied to clipboard!');
  };

  const handleBackToDeals = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <LoadingFallback />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <ErrorFallback message={error} retry={handleBackToDeals} />
        </div>
        <Footer />
      </>
    );
  }

  if (!deal) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <ErrorFallback message={currentContent.errorGeneric} retry={handleBackToDeals} />
        </div>
        <Footer />
      </>
    );
  }

  // Calculate progress percentage
  const progress = (deal.currentParticipants / deal.maxParticipants) * 100;
  
  // Format time remaining
  const timeRemaining = deal.timeRemaining || '2 days';
  const daysText = timeRemaining.includes('1 ') ? currentContent.day : currentContent.days;

  return (
    <>
      <Header />
      <ScrollToTop />
      
      <div className="container mx-auto px-4 py-8">
        {/* Tabs for Active Jam3a and Jam3a History */}
        <Tabs defaultValue="active" className="w-full mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">{currentContent.activeJam3a}</TabsTrigger>
            <TabsTrigger value="history">{currentContent.jam3aHistory}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={deal.image || deal.category?.image || 'https://via.placeholder.com/600x400?text=Jam3a+Deal'} 
                    alt={language === 'ar' && deal.titleAr ? deal.titleAr : deal.title} 
                    className="w-full h-auto object-cover aspect-video"
                  />
                </CardContent>
              </Card>
              
              {/* Product Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {language === 'ar' && deal.titleAr ? deal.titleAr : deal.title}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {currentContent.category}: {language === 'ar' && deal.category?.nameAr ? deal.category.nameAr : deal.category?.name}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Price Information */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{currentContent.regularPrice}</div>
                      <div className="text-lg line-through">{deal.regularPrice} {currentContent.currency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{currentContent.jam3aPrice}</div>
                      <div className="text-2xl font-bold text-jam3a-purple">{deal.jam3aPrice} {currentContent.currency}</div>
                    </div>
                  </div>
                  
                  {/* Participants and Time Left */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{currentContent.participants}</div>
                      <div className="text-lg flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {deal.currentParticipants}/{deal.maxParticipants} {currentContent.required}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{currentContent.timeLeft}</div>
                      <div className="text-lg flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {timeRemaining}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm">{currentContent.dealProgress}</div>
                      <div className="text-jam3a-purple font-medium">
                        {Math.round(progress)}%
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleJoinDeal} 
                      className="flex-1 bg-jam3a-purple hover:bg-jam3a-deep-purple"
                    >
                      {currentContent.joinDeal}
                      <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
                    </Button>
                    <Button 
                      onClick={handleInviteFriends} 
                      variant="outline" 
                      className="flex-1 border-jam3a-purple text-jam3a-purple hover:bg-jam3a-purple hover:text-white"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      {currentContent.inviteFriends}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Product Description and Specifications */}
            <div className="mt-8 grid grid-cols-1 gap-8">
              {/* Description Card */}
              {deal.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>{currentContent.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      {language === 'ar' && deal.descriptionAr ? deal.descriptionAr : deal.description}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Specifications and Features */}
              {(deal.specifications || deal.features) && (
                <Card>
                  <CardHeader>
                    <CardTitle>{currentContent.productDetails}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="specifications">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="specifications">{currentContent.specifications}</TabsTrigger>
                        <TabsTrigger value="features">{currentContent.features}</TabsTrigger>
                      </TabsList>
                      <TabsContent value="specifications" className="p-4 border rounded-md mt-2">
                        <div className="prose max-w-none">
                          {language === 'ar' && deal.specificationsAr ? deal.specificationsAr : deal.specifications}
                        </div>
                      </TabsContent>
                      <TabsContent value="features" className="p-4 border rounded-md mt-2">
                        <div className="prose max-w-none">
                          {language === 'ar' && deal.featuresAr ? deal.featuresAr : deal.features}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
              
              {/* How It Works Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{currentContent.howItWorks}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-jam3a-purple/10 mb-4">
                        <ShoppingBag className="h-6 w-6 text-jam3a-purple" />
                      </div>
                      <p className="font-medium">{currentContent.step1}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-jam3a-purple/10 mb-4">
                        <Share2 className="h-6 w-6 text-jam3a-purple" />
                      </div>
                      <p className="font-medium">{currentContent.step2}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-jam3a-purple/10 mb-4">
                        <Users className="h-6 w-6 text-jam3a-purple" />
                      </div>
                      <p className="font-medium">{currentContent.step3}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-jam3a-purple/10 mb-4">
                        <CheckCircle className="h-6 w-6 text-jam3a-purple" />
                      </div>
                      <p className="font-medium">{currentContent.step4}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{currentContent.jam3aHistory}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Info className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{currentContent.noHistory}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </>
  );
};

export default DealDetails;
