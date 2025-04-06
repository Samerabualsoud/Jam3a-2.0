import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchFeaturedDeals } from '@/services/DealService';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';

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
      viewDeal: "View Deal",
      participants: "Participants",
      timeLeft: "Time Left",
      discount: "Discount",
      noDeals: "No featured deals available at the moment.",
      viewAll: "View All Deals",
      currency: "SAR"
    },
    ar: {
      title: "صفقات جمعة المميزة",
      viewDeal: "عرض الصفقة",
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
        
        setDeals(Array.isArray(dealsData) ? dealsData : []);
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
                <div className="h-48 overflow-hidden">
                  <img 
                    src={deal.image || deal.category?.image || 'https://via.placeholder.com/400x200?text=Jam3a+Deal'} 
                    alt={deal.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{language === 'ar' && deal.titleAr ? deal.titleAr : deal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>{currentContent.discount}: {deal.discount}%</span>
                      <span className="text-jam3a-purple font-semibold">
                        {deal.currentParticipants}/{deal.maxParticipants} {currentContent.participants}
                      </span>
                    </div>
                    
                    <Progress value={deal.progress} className="h-2" />
                    
                    <div className="text-sm text-muted-foreground">
                      {currentContent.timeLeft}: {deal.timeRemaining}
                    </div>
                    
                    <Button 
                      onClick={() => handleViewDeal(deal._id)} 
                      className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
                    >
                      {currentContent.viewDeal}
                      <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
                    </Button>
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
