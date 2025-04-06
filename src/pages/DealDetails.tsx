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
import { Loader2, AlertCircle, CheckCircle2, ArrowRight, ShoppingBag, Users, Clock } from 'lucide-react';
import { fetchDealById } from '@/services/DealService';
import ScrollToTop from '@/components/ScrollToTop';

const DealDetails = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  const [deal, setDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
      required: "required"
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
      required: "مطلوب"
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
        const dealData = await fetchDealById(dealId);
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
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple mx-auto mb-4" />
              <p>{currentContent.loading}</p>
            </div>
          </div>
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
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{currentContent.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={handleBackToDeals}>
              {currentContent.backToDeals}
            </Button>
          </div>
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
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{currentContent.errorTitle}</AlertTitle>
            <AlertDescription>{currentContent.errorGeneric}</AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={handleBackToDeals}>
              {currentContent.backToDeals}
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate progress percentage
  const progress = (deal.currentParticipants / deal.maxParticipants) * 100;

  return (
    <>
      <Header />
      <ScrollToTop />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src={deal.image || deal.category?.image || 'https://via.placeholder.com/600x400?text=Jam3a+Deal'} 
              alt={language === 'ar' && deal.titleAr ? deal.titleAr : deal.title} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {language === 'ar' && deal.titleAr ? deal.titleAr : deal.title}
            </h1>
            
            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-1">{currentContent.category}</div>
              <div className="text-lg font-medium">
                {language === 'ar' && deal.category?.nameAr ? deal.category.nameAr : deal.category?.name}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">{currentContent.regularPrice}</div>
                <div className="text-lg line-through">{deal.regularPrice} {currentContent.currency}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">{currentContent.jam3aPrice}</div>
                <div className="text-2xl font-bold text-jam3a-purple">{deal.jam3aPrice} {currentContent.currency}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">{currentContent.discount}</div>
                <div className="text-lg">{deal.discount}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">{currentContent.timeLeft}</div>
                <div className="text-lg">{deal.timeRemaining}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{currentContent.participants}: {deal.currentParticipants}/{deal.maxParticipants} {currentContent.required}</span>
                </div>
                <div className="text-jam3a-purple font-medium">
                  {Math.round(progress)}%
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                {currentContent.inviteFriends}
              </Button>
            </div>
            
            {deal.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{currentContent.description}</h2>
                <div className="prose max-w-none">
                  {language === 'ar' && deal.descriptionAr ? deal.descriptionAr : deal.description}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Specifications and Features */}
        {(deal.specifications || deal.features) && (
          <div className="mt-12">
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
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default DealDetails;
