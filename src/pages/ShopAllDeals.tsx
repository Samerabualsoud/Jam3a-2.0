import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Tag, Filter, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/services/api';
import { API_BASE_URL } from '@/config';

const ShopAllDeals = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for deals data
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'popularity',
    priceRange: [0, 10000],
    groupSize: 'any',
    timeLeft: 'any'
  });

  // Fetch deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching deals from:', `${API_BASE_URL}/deals`);
        const response = await apiService.get('/deals');
        
        if (response && response.data) {
          console.log('Deals data:', response.data);
          setDeals(response.data);
          setFilteredDeals(response.data);
        } else if (Array.isArray(response)) {
          console.log('Deals data (array):', response);
          setDeals(response);
          setFilteredDeals(response);
        } else {
          console.error('Invalid response format:', response);
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals. Please try again.');
        
        // Try to load from local storage as fallback
        const storedDeals = localStorage.getItem('deals');
        if (storedDeals) {
          try {
            const parsedDeals = JSON.parse(storedDeals);
            setDeals(parsedDeals);
            setFilteredDeals(parsedDeals);
            toast({
              title: 'Using cached deals',
              description: 'Could not connect to server. Showing saved deals.',
              variant: 'warning'
            });
          } catch (parseError) {
            console.error('Failed to parse stored deals:', parseError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeals();
  }, [toast]);

  // Apply filters when tab changes
  useEffect(() => {
    if (deals.length === 0) return;
    
    let filtered = [...deals];
    
    // Apply tab filter
    switch (activeTab) {
      case 'ending':
        // Sort by time left ascending
        filtered = filtered.sort((a, b) => {
          const aTime = a.timeLeft || a.endDate || '';
          const bTime = b.timeLeft || b.endDate || '';
          return aTime.localeCompare(bTime);
        });
        break;
      case 'popular':
        // Sort by number of participants descending
        filtered = filtered.sort((a, b) => {
          const aJoined = a.joined || a.participants?.length || 0;
          const bJoined = b.joined || b.participants?.length || 0;
          return bJoined - aJoined;
        });
        break;
      case 'new':
        // Sort by creation date descending
        filtered = filtered.sort((a, b) => {
          const aDate = a.createdAt || '';
          const bDate = b.createdAt || '';
          return bDate.localeCompare(aDate);
        });
        break;
      default:
        // No sorting for 'all'
        break;
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(deal => {
        const dealCategory = deal.category?.name || deal.category || '';
        return dealCategory.toLowerCase() === filters.category.toLowerCase();
      });
    }
    
    // Apply price range filter
    filtered = filtered.filter(deal => {
      const price = deal.currentPrice || deal.jam3aPrice || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    // Apply group size filter
    if (filters.groupSize !== 'any') {
      const [min, max] = filters.groupSize.split('-').map(Number);
      filtered = filtered.filter(deal => {
        const total = deal.total || deal.maxParticipants || 0;
        return max ? (total >= min && total <= max) : total >= min;
      });
    }
    
    // Apply time left filter
    if (filters.timeLeft !== 'any') {
      // This would need actual date comparison logic
      // For now, we'll just simulate it
      if (filters.timeLeft === 'ending_today') {
        filtered = filtered.filter(deal => {
          // Check if timeLeft is less than 24 hours
          const timeLeft = deal.timeLeft || '';
          return timeLeft.includes('0:') || timeLeft.includes('1:') || 
                 timeLeft.includes('2:') || timeLeft.includes('3:');
        });
      }
    }
    
    // Apply sort filter
    switch (filters.sort) {
      case 'ending_soon':
        filtered = filtered.sort((a, b) => {
          const aTime = a.timeLeft || a.endDate || '';
          const bTime = b.timeLeft || b.endDate || '';
          return aTime.localeCompare(bTime);
        });
        break;
      case 'biggest_discount':
        filtered = filtered.sort((a, b) => {
          const aDiscount = a.discount ? parseFloat(a.discount) : 0;
          const bDiscount = b.discount ? parseFloat(b.discount) : 0;
          return bDiscount - aDiscount;
        });
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => {
          const aDate = a.createdAt || '';
          const bDate = b.createdAt || '';
          return bDate.localeCompare(aDate);
        });
        break;
      default:
        // 'popularity' is already handled by the 'popular' tab
        break;
    }
    
    setFilteredDeals(filtered);
  }, [activeTab, filters, deals]);

  // Function to handle joining a Jam3a
  const handleJoinJam3a = (deal) => {
    navigate(`/join-jam3a?product=${encodeURIComponent(deal.title || deal.name)}&price=${deal.currentPrice || deal.jam3aPrice} SAR&discount=${deal.discount}&id=${deal._id}`);
    toast({
      title: language === 'en' ? "Joining Jam3a" : "الانضمام إلى الجمعة",
      description: language === 'en' 
        ? `You're joining the Jam3a for ${deal.title || deal.name}` 
        : `أنت تنضم إلى الجمعة لـ ${deal.title || deal.name}`
    });
  };

  // Function to handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Function to reset filters
  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      sort: 'popularity',
      priceRange: [0, 10000],
      groupSize: 'any',
      timeLeft: 'any'
    });
    setActiveTab('all');
  };

  const content = {
    en: {
      title: "Shop All Jam3as",
      subtitle: "Browse active group-buying Jam3as",
      description: "Join existing Jam3a groups and save big on premium products. Prices drop as more people join the group!",
      filters: {
        title: "Filters",
        category: "Category",
        categories: ["All", "Smartphones", "Laptops", "Audio", "Wearables", "Home Tech"],
        sort: "Sort By",
        sortOptions: ["Popularity", "Ending Soon", "Biggest Discount", "Newest"],
        priceRange: "Price Range",
        groupSize: "Group Size",
        timeLeft: "Time Left",
        timeOptions: ["Any Time", "Ending Today", "1-3 Days", "3+ Days"],
        apply: "Apply Filters",
        reset: "Reset"
      },
      tabs: {
        all: "All Jam3as",
        ending: "Ending Soon",
        popular: "Most Popular",
        new: "New Arrivals"
      },
      noDeals: "No Jam3as found matching your filters. Try adjusting your criteria.",
      startJam3a: "Start Your Own Jam3a",
      browseAll: "Browse All Jam3as",
      loading: "Loading Jam3as...",
      error: "Error loading Jam3as. Please try again.",
      refresh: "Refresh",
      currency: "SAR",
      joinButton: "Join This Jam3a"
    },
    ar: {
      title: "تسوق جميع الجمعات",
      subtitle: "تصفح جمعات الشراء الجماعي النشطة",
      description: "انضم إلى جمعات حالية ووفر على المنتجات المميزة. تنخفض الأسعار كلما انضم المزيد من الأشخاص إلى المجموعة!",
      filters: {
        title: "التصفية",
        category: "الفئة",
        categories: ["الكل", "الهواتف الذكية", "أجهزة الكمبيوتر المحمولة", "الصوتيات", "الأجهزة القابلة للارتداء", "تقنيات المنزل"],
        sort: "ترتيب حسب",
        sortOptions: ["الشعبية", "ينتهي قريبًا", "أكبر خصم", "الأحدث"],
        priceRange: "نطاق السعر",
        groupSize: "حجم المجموعة",
        timeLeft: "الوقت المتبقي",
        timeOptions: ["أي وقت", "ينتهي اليوم", "1-3 أيام", "أكثر من 3 أيام"],
        apply: "تطبيق الفلاتر",
        reset: "إعادة ضبط"
      },
      tabs: {
        all: "جميع الجمعات",
        ending: "تنتهي قريبًا",
        popular: "الأكثر شعبية",
        new: "الوافدة الجديدة"
      },
      noDeals: "لم يتم العثور على جمعات تطابق عوامل التصفية الخاصة بك. حاول تعديل معاييرك.",
      startJam3a: "ابدأ جمعتك الخاصة",
      browseAll: "تصفح جميع الجمعات",
      loading: "جاري تحميل الجمعات...",
      error: "خطأ في تحميل الجمعات. يرجى المحاولة مرة أخرى.",
      refresh: "تحديث",
      currency: "ريال",
      joinButton: "انضم إلى هذه الجمعة"
    }
  };

  const currentContent = content[language];

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{currentContent.title}</h1>
          <p className="text-muted-foreground mt-2">{currentContent.subtitle}</p>
          <p className="max-w-2xl mx-auto mt-4">{currentContent.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    {currentContent.filters.title}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    {currentContent.filters.reset}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{currentContent.filters.category}</label>
                  <Select 
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={currentContent.filters.categories[0]} />
                    </SelectTrigger>
                    <SelectContent>
                      {currentContent.filters.categories.map((category, index) => (
                        <SelectItem 
                          key={index} 
                          value={index === 0 ? 'all' : category.toLowerCase()}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{currentContent.filters.sort}</label>
                  <Select 
                    value={filters.sort}
                    onValueChange={(value) => handleFilterChange('sort', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={currentContent.filters.sortOptions[0]} />
                    </SelectTrigger>
                    <SelectContent>
                      {currentContent.filters.sortOptions.map((option, index) => (
                        <SelectItem 
                          key={index} 
                          value={option.toLowerCase().replace(' ', '_')}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{currentContent.filters.priceRange}</label>
                  <div className="pt-4 px-2">
                    <Slider 
                      value={filters.priceRange}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{filters.priceRange[0]} {currentContent.currency}</span>
                    <span>{filters.priceRange[1]} {currentContent.currency}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{currentContent.filters.groupSize}</label>
                  <Select 
                    value={filters.groupSize}
                    onValueChange={(value) => handleFilterChange('groupSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="2-5">2-5 people</SelectItem>
                      <SelectItem value="6-10">6-10 people</SelectItem>
                      <SelectItem value="10+">10+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{currentContent.filters.timeLeft}</label>
                  <Select 
                    value={filters.timeLeft}
                    onValueChange={(value) => handleFilterChange('timeLeft', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={currentContent.filters.timeOptions[0]} />
                    </SelectTrigger>
                    <SelectContent>
                      {currentContent.filters.timeOptions.map((option, index) => (
                        <SelectItem 
                          key={index} 
                          value={option.toLowerCase().replace(' ', '_')}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => setFilteredDeals([...filteredDeals])} // Force re-render
                >
                  {currentContent.filters.apply}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Deals grid */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">{currentContent.tabs.all}</TabsTrigger>
                <TabsTrigger value="ending" className="flex-1">{currentContent.tabs.ending}</TabsTrigger>
                <TabsTrigger value="popular" className="flex-1">{currentContent.tabs.popular}</TabsTrigger>
                <TabsTrigger value="new" className="flex-1">{currentContent.tabs.new}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>{currentContent.loading}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive">{currentContent.error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      {currentContent.refresh}
                    </Button>
                  </div>
                ) : filteredDeals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{currentContent.noDeals}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleResetFilters}
                    >
                      {currentContent.filters.reset}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDeals.map((deal) => (
                      <Card key={deal._id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={deal.image || 'https://placehold.co/600x400?text=No+Image'} 
                            alt={deal.title || deal.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-2">{deal.title || deal.name}</h3>
                          
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground line-through">
                                {deal.originalPrice || deal.regularPrice} {currentContent.currency}
                              </p>
                              <p className="font-bold text-primary">
                                {deal.currentPrice || deal.jam3aPrice} {currentContent.currency}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {deal.discount}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{deal.joined || deal.participants?.length || 0}/{deal.total || deal.maxParticipants || 5}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{deal.timeLeft || '24:00:00'}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => handleJoinJam3a(deal)}
                          >
                            {currentContent.joinButton}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="ending" className="mt-6">
                {/* Same content structure as "all" tab */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>{currentContent.loading}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive">{currentContent.error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      {currentContent.refresh}
                    </Button>
                  </div>
                ) : filteredDeals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{currentContent.noDeals}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleResetFilters}
                    >
                      {currentContent.filters.reset}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDeals.map((deal) => (
                      <Card key={deal._id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={deal.image || 'https://placehold.co/600x400?text=No+Image'} 
                            alt={deal.title || deal.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-2">{deal.title || deal.name}</h3>
                          
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground line-through">
                                {deal.originalPrice || deal.regularPrice} {currentContent.currency}
                              </p>
                              <p className="font-bold text-primary">
                                {deal.currentPrice || deal.jam3aPrice} {currentContent.currency}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {deal.discount}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{deal.joined || deal.participants?.length || 0}/{deal.total || deal.maxParticipants || 5}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{deal.timeLeft || '24:00:00'}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => handleJoinJam3a(deal)}
                          >
                            {currentContent.joinButton}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="mt-6">
                {/* Same content structure as "all" tab */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>{currentContent.loading}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive">{currentContent.error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      {currentContent.refresh}
                    </Button>
                  </div>
                ) : filteredDeals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{currentContent.noDeals}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleResetFilters}
                    >
                      {currentContent.filters.reset}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDeals.map((deal) => (
                      <Card key={deal._id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={deal.image || 'https://placehold.co/600x400?text=No+Image'} 
                            alt={deal.title || deal.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-2">{deal.title || deal.name}</h3>
                          
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground line-through">
                                {deal.originalPrice || deal.regularPrice} {currentContent.currency}
                              </p>
                              <p className="font-bold text-primary">
                                {deal.currentPrice || deal.jam3aPrice} {currentContent.currency}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {deal.discount}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{deal.joined || deal.participants?.length || 0}/{deal.total || deal.maxParticipants || 5}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{deal.timeLeft || '24:00:00'}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => handleJoinJam3a(deal)}
                          >
                            {currentContent.joinButton}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="new" className="mt-6">
                {/* Same content structure as "all" tab */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>{currentContent.loading}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive">{currentContent.error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      {currentContent.refresh}
                    </Button>
                  </div>
                ) : filteredDeals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{currentContent.noDeals}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleResetFilters}
                    >
                      {currentContent.filters.reset}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDeals.map((deal) => (
                      <Card key={deal._id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={deal.image || 'https://placehold.co/600x400?text=No+Image'} 
                            alt={deal.title || deal.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-2">{deal.title || deal.name}</h3>
                          
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground line-through">
                                {deal.originalPrice || deal.regularPrice} {currentContent.currency}
                              </p>
                              <p className="font-bold text-primary">
                                {deal.currentPrice || deal.jam3aPrice} {currentContent.currency}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {deal.discount}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{deal.joined || deal.participants?.length || 0}/{deal.total || deal.maxParticipants || 5}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{deal.timeLeft || '24:00:00'}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => handleJoinJam3a(deal)}
                          >
                            {currentContent.joinButton}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline" 
                className="mr-4"
                onClick={() => navigate('/start-jam3a')}
              >
                {currentContent.startJam3a}
              </Button>
              <Button onClick={() => setActiveTab('all')}>
                {currentContent.browseAll}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopAllDeals;
