import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Tag, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ShopAllDeals = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { toast } = useToast();

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
      deals: [
        {
          id: 1,
          title: "iPhone 16 Pro Max 256GB",
          originalPrice: 4999,
          currentPrice: 4199,
          discount: "16%",
          joined: 4,
          total: 5,
          timeLeft: "23:45:12",
          category: "Smartphones",
          image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80",
          buttonText: "Join This Jam3a"
        },
        {
          id: 2,
          title: "Samsung Galaxy S25 Ultra",
          originalPrice: 4599,
          currentPrice: 3899,
          discount: "15%",
          joined: 3,
          total: 6,
          timeLeft: "11:23:45",
          category: "Smartphones",
          image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buttonText: "Join This Jam3a"
        },
        {
          id: 3,
          title: "Galaxy Z Fold 6",
          originalPrice: 6999,
          currentPrice: 5799,
          discount: "17%",
          joined: 7,
          total: 10,
          timeLeft: "12:00:00",
          category: "Smartphones",
          image: "https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buttonText: "Join This Jam3a"
        },
        {
          id: 4,
          title: "Galaxy Z Flip 6",
          originalPrice: 3999,
          currentPrice: 3299,
          discount: "18%",
          joined: 2,
          total: 5,
          timeLeft: "35:12:33",
          category: "Smartphones",
          image: "https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buttonText: "Join This Jam3a"
        },
        {
          id: 5,
          title: "MacBook Pro 16\" M3 Pro",
          originalPrice: 9999,
          currentPrice: 8499,
          discount: "15%",
          joined: 3,
          total: 8,
          timeLeft: "47:23:11",
          category: "Laptops",
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=1600&q=80",
          buttonText: "Join This Jam3a"
        },
        {
          id: 6,
          title: "AirPods Pro 2",
          originalPrice: 999,
          currentPrice: 799,
          discount: "20%",
          joined: 6,
          total: 10,
          timeLeft: "8:45:22",
          category: "Audio",
          image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1600&q=80",
          buttonText: "Join This Jam3a"
        }
      ],
      tabs: {
        all: "All Jam3as",
        ending: "Ending Soon",
        popular: "Most Popular",
        new: "New Arrivals"
      },
      noDeals: "No Jam3as found matching your filters. Try adjusting your criteria.",
      startJam3a: "Start Your Own Jam3a",
      browseAll: "Browse All Jam3as"
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
      deals: [
        {
          id: 1,
          title: "آيفون 16 برو ماكس 256 جيجابايت",
          originalPrice: 4999,
          currentPrice: 4199,
          discount: "16%",
          joined: 4,
          total: 5,
          timeLeft: "23:45:12",
          category: "الهواتف الذكية",
          image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80",
          buttonText: "انضم إلى هذه الجمعة"
        },
        {
          id: 2,
          title: "سامسونج جالاكسي S25 ألترا",
          originalPrice: 4599,
          currentPrice: 3899,
          discount: "15%",
          joined: 3,
          total: 6,
          timeLeft: "11:23:45",
          category: "الهواتف الذكية",
          image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buttonText: "انضم إلى هذه الجمعة"
        },
        {
          id: 3,
          title: "جالاكسي Z فولد 6",
          originalPrice: 6999,
          currentPrice: 5799,
          discount: "17%",
          joined: 7,
          total: 10,
          timeLeft: "12:00:00",
          category: "الهواتف الذكية",
          image: "https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buttonText: "انضم إلى هذه الجمعة"
        },
        {
          id: 4,
          title: "جالاكسي Z فليب 6",
          originalPrice: 3999,
          currentPrice: 3299,
          discount: "18%",
          joined: 2,
          total: 5,
          timeLeft: "35:12:33",
          category: "الهواتف الذكية",
          image: "https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buttonText: "انضم إلى هذه الجمعة"
        },
        {
          id: 5,
          title: "ماك بوك برو 16 بوصة M3 برو",
          originalPrice: 9999,
          currentPrice: 8499,
          discount: "15%",
          joined: 3,
          total: 8,
          timeLeft: "47:23:11",
          category: "أجهزة الكمبيوتر المحمولة",
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=1600&q=80",
          buttonText: "انضم إلى هذه الجمعة"
        },
        {
          id: 6,
          title: "إيربودز برو 2",
          originalPrice: 999,
          currentPrice: 799,
          discount: "20%",
          joined: 6,
          total: 10,
          timeLeft: "8:45:22",
          category: "الصوتيات",
          image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1600&q=80",
          buttonText: "انضم إلى هذه الجمعة"
        }
      ],
      tabs: {
        all: "جميع الجمعات",
        ending: "تنتهي قريبًا",
        popular: "الأكثر شعبية",
        new: "الوافدة الجديدة"
      },
      noDeals: "لم يتم العثور على جمعات تطابق عوامل التصفية الخاصة بك. حاول تعديل معاييرك.",
      startJam3a: "ابدأ جمعتك الخاصة",
      browseAll: "تصفح جميع الجمعات"
    }
  };

  const currentContent = content[language];

  // Function to handle joining a Jam3a
  const handleJoinJam3a = (deal) => {
    navigate(`/join-jam3a?product=${encodeURIComponent(deal.title)}&price=${deal.currentPrice} SAR&discount=${deal.discount}&id=${deal.id}`);
    toast({
      title: language === 'en' ? "Joining Jam3a" : "الانضمام إلى الجمعة",
      description: language === 'en' 
        ? `You're joining the Jam3a for ${deal.title}` 
        : `أنت تنضم إلى الجمعة لـ ${deal.title}`
    });
  };

  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-purple-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-2">{currentContent.title}</h1>
              <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
              <p className="mt-4 max-w-2xl mx-auto">{currentContent.description}</p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      {currentContent.filters.title}
                    </h2>
                    <Button variant="ghost" size="sm" className="text-xs">
                      {currentContent.filters.reset}
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label>{currentContent.filters.category}</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder={currentContent.filters.categories[0]} />
                        </SelectTrigger>
                        <SelectContent>
                          {currentContent.filters.categories.map((category, index) => (
                            <SelectItem key={index} value={category.toLowerCase().replace(/\s+/g, '-')}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>{currentContent.filters.sort}</Label>
                      <Select defaultValue="popularity">
                        <SelectTrigger>
                          <SelectValue placeholder={currentContent.filters.sortOptions[0]} />
                        </SelectTrigger>
                        <SelectContent>
                          {currentContent.filters.sortOptions.map((option, index) => (
                            <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, '-')}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>{currentContent.filters.priceRange}</Label>
                      <div className="pt-4 pb-2">
                        <Slider defaultValue={[0, 10000]} min={0} max={10000} step={100} />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>0 SAR</span>
                        <span>10,000 SAR</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label>{currentContent.filters.timeLeft}</Label>
                      <Select defaultValue="any">
                        <SelectTrigger>
                          <SelectValue placeholder={currentContent.filters.timeOptions[0]} />
                        </SelectTrigger>
                        <SelectContent>
                          {currentContent.filters.timeOptions.map((option, index) => (
                            <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, '-')}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple">
                      {currentContent.filters.apply}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 bg-jam3a-purple/10 p-6 rounded-lg border border-jam3a-purple/20">
                  <h3 className="text-lg font-semibold mb-2 text-jam3a-purple">
                    {currentContent.startJam3a}
                  </h3>
                  <p className="text-sm mb-4">
                    {language === 'en' 
                      ? "Can't find what you're looking for? Start your own Jam3a and invite others to join!"
                      : "لم تجد ما تبحث عنه؟ ابدأ جمعتك الخاصة وادعُ الآخرين للانضمام!"}
                  </p>
                  <Button 
                    className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
                    onClick={() => navigate('/start-jam3a')}
                  >
                    {currentContent.startJam3a}
                  </Button>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">{currentContent.tabs.all}</TabsTrigger>
                    <TabsTrigger value="ending">{currentContent.tabs.ending}</TabsTrigger>
                    <TabsTrigger value="popular">{currentContent.tabs.popular}</TabsTrigger>
                    <TabsTrigger value="new">{currentContent.tabs.new}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentContent.deals.map((deal, index) => (
                        <Card key={index} className="overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                          <div className="relative">
                            <img 
                              src={deal.image} 
                              alt={deal.title}
                              className="h-48 w-full object-cover"
                            />
                            <Badge className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm">
                              {deal.discount} OFF
                            </Badge>
                          </div>
                          
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{deal.title}</h3>
                            
                            <div className="flex items-end gap-2 mb-3">
                              <span className="text-xl font-bold text-jam3a-purple">
                                {deal.currentPrice} SAR
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                {deal.originalPrice} SAR
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm mb-2">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{deal.joined} / {deal.total} joined</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{deal.timeLeft}</span>
                              </div>
                            </div>
                            
                            <div className="h-2 w-full rounded-full bg-gray-100 mb-4">
                              <div 
                                className="h-2 rounded-full bg-jam3a-purple" 
                                style={{ width: `${(deal.joined / deal.total) * 100}%` }}
                              ></div>
                            </div>
                            
                            <Button 
                              className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
                              onClick={() => handleJoinJam3a(deal)}
                            >
                              {deal.buttonText}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ending" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentContent.deals
                        .filter((deal) => deal.timeLeft.includes("hours") || deal.timeLeft.includes("ساعة"))
                        .map((deal, index) => (
                          <Card key={index} className="overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                            <div className="relative">
                              <img 
                                src={deal.image} 
                                alt={deal.title}
                                className="h-48 w-full object-cover"
                              />
                              <Badge className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm">
                                {deal.discount} OFF
                              </Badge>
                            </div>
                            
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-1">{deal.title}</h3>
                              
                              <div className="flex items-end gap-2 mb-3">
                                <span className="text-xl font-bold text-jam3a-purple">
                                  {deal.currentPrice} SAR
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {deal.originalPrice} SAR
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm mb-2">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{deal.joined} / {deal.total} joined</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{deal.timeLeft}</span>
                                </div>
                              </div>
                              
                              <div className="h-2 w-full rounded-full bg-gray-100 mb-4">
                                <div 
                                  className="h-2 rounded-full bg-jam3a-purple" 
                                  style={{ width: `${(deal.joined / deal.total) * 100}%` }}
                                ></div>
                              </div>
                              
                              <Button 
                                className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
                                onClick={() => handleJoinJam3a(deal)}
                              >
                                {deal.buttonText}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="popular" className="mt-0">
                    {/* Similar structure for popular deals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentContent.deals
                        .filter((deal) => (deal.joined / deal.total) > 0.5)
                        .map((deal, index) => (
                          <Card key={index} className="overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                            <div className="relative">
                              <img 
                                src={deal.image} 
                                alt={deal.title}
                                className="h-48 w-full object-cover"
                              />
                              <Badge className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm">
                                {deal.discount} OFF
                              </Badge>
                            </div>
                            
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-1">{deal.title}</h3>
                              
                              <div className="flex items-end gap-2 mb-3">
                                <span className="text-xl font-bold text-jam3a-purple">
                                  {deal.currentPrice} SAR
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {deal.originalPrice} SAR
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm mb-2">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{deal.joined} / {deal.total} joined</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{deal.timeLeft}</span>
                                </div>
                              </div>
                              
                              <div className="h-2 w-full rounded-full bg-gray-100 mb-4">
                                <div 
                                  className="h-2 rounded-full bg-jam3a-purple" 
                                  style={{ width: `${(deal.joined / deal.total) * 100}%` }}
                                ></div>
                              </div>
                              
                              <Button 
                                className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
                                onClick={() => handleJoinJam3a(deal)}
                              >
                                {deal.buttonText}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="new" className="mt-0">
                    {/* Similar structure for new deals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentContent.deals
                        .filter((_, index) => index % 2 === 0) // Just for demo purposes
                        .map((deal, index) => (
                          <Card key={index} className="overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                            <div className="relative">
                              <img 
                                src={deal.image} 
                                alt={deal.title}
                                className="h-48 w-full object-cover"
                              />
                              <Badge className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm">
                                {deal.discount} OFF
                              </Badge>
                            </div>
                            
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-1">{deal.title}</h3>
                              
                              <div className="flex items-end gap-2 mb-3">
                                <span className="text-xl font-bold text-jam3a-purple">
                                  {deal.currentPrice} SAR
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {deal.originalPrice} SAR
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm mb-2">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{deal.joined} / {deal.total} joined</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{deal.timeLeft}</span>
                                </div>
                              </div>
                              
                              <div className="h-2 w-full rounded-full bg-gray-100 mb-4">
                                <div 
                                  className="h-2 rounded-full bg-jam3a-purple" 
                                  style={{ width: `${(deal.joined / deal.total) * 100}%` }}
                                ></div>
                              </div>
                              
                              <Button 
                                className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
                                onClick={() => handleJoinJam3a(deal)}
                              >
                                {deal.buttonText}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="inline-block hover:bg-jam3a-purple/10"
                  >
                    {currentContent.browseAll}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Helper component for labels
const Label = ({ children }) => (
  <div className="text-sm font-medium mb-2">{children}</div>
);

export default ShopAllDeals;
