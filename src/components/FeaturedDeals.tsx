import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowRight, Users, Clock, Percent } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import { fetchFeaturedDeals } from '@/services/DealService';

const FeaturedDeals = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Content based on language
  const content = {
    en: {
      title: "Featured Jam3a Deals",
      viewDeal: "View Details",
      joinDeal: "Join This Jam3a",
      participants: "Participants",
      timeLeft: "Time Left",
      discount: "Discount",
      noDeals: "No featured deals available at the moment.",
      viewAll: "View All Deals",
      currency: "SAR"
    },
    ar: {
      title: "صفقات جمعة المميزة",
      viewDeal: "عرض التفاصيل",
      joinDeal: "انضم إلى هذه الجمعة",
      participants: "المشاركون",
      timeLeft: "الوقت المتبقي",
      discount: "الخصم",
      noDeals: "لا توجد صفقات مميزة متاحة في الوقت الحالي.",
      viewAll: "عرض جميع الصفقات",
      currency: "ريال"
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    const loadFeaturedDeals = async () => {
      try {
        setIsLoading(true);
        const dealsData = await fetchFeaturedDeals().catch(err => {
          console.error('Error fetching featured deals:', err);
          return [];
        });
        
        if (!dealsData || !Array.isArray(dealsData) || dealsData.length === 0) {
          console.warn('No featured deals returned from API');
        }
        
        // Calculate progress for each deal
        const dealsWithProgress = Array.isArray(dealsData) 
          ? dealsData.map(deal => ({
              ...deal,
              progress: (deal.currentParticipants / deal.maxParticipants) * 100
            }))
          : [];
        
        setDeals(dealsWithProgress);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading featured deals:', err);
        setError(err.message || 'Failed to load featured deals. Please try again later.');
        setIsLoading(false);
      }
    };

    loadFeaturedDeals();
  }, []);

  const handleViewDeal = (dealId) => {
    navigate(`/jam3a/${dealId}`);
  };
  
  const handleJoinDeal = (dealId) => {
    navigate(`/join-jam3a/${dealId}`);
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">{currentContent.title}</h2>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">{currentContent.title}</h2>
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">{currentContent.title}</h2>
        
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <Card key={deal._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={deal.image || deal.category?.image || 'https://via.placeholder.com/400x200?text=Jam3a+Deal'} 
                    alt={deal.title} 
                    className="w-full h-full object-cover"
                  />
                  {deal.discount && (
                    <div className="absolute top-2 right-2 bg-jam3a-purple text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {deal.discount}% OFF
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{language === 'ar' && deal.titleAr ? deal.titleAr : deal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{deal.currentParticipants}/{deal.maxParticipants}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{deal.timeRemaining}</span>
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-jam3a-purple bg-jam3a-purple/10">
                            {Math.round(deal.progress)}% Complete
                          </span>
                        </div>
                      </div>
                      <Progress value={deal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => handleViewDeal(deal._id)} 
                        variant="outline"
                        className="w-full border-jam3a-purple text-jam3a-purple hover:bg-jam3a-purple hover:text-white"
                      >
                        {currentContent.viewDeal}
                      </Button>
                      <Button 
                        onClick={() => handleJoinDeal(deal._id)} 
                        className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
                      >
                        {currentContent.joinDeal}
                        <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{currentContent.noDeals}</p>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate('/deals')} 
            variant="outline" 
            className="border-jam3a-purple text-jam3a-purple hover:bg-jam3a-purple hover:text-white"
          >
            {currentContent.viewAll}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDeals;
