import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, CheckCircle, ArrowRight } from 'lucide-react';

const ShopJam3a = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for Jam3a deals
  const deals = [
    {
      id: 'jam3a-001',
      title: {
        en: 'Samsung 55" QLED 4K Smart TV',
        ar: 'تلفزيون سامسونج ذكي QLED 4K مقاس 55 بوصة'
      },
      image: 'https://images.pexels.com/photos/6782570/pexels-photo-6782570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 3999,
      jam3aPrice: 2899,
      participants: {
        current: 3,
        required: 5
      },
      timeLeft: '2 days',
      category: 'electronics'
    },
    {
      id: 'jam3a-002',
      title: {
        en: 'Apple AirPods Pro (2nd Generation)',
        ar: 'سماعات أبل إيربودز برو (الجيل الثاني)'
      },
      image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 999,
      jam3aPrice: 799,
      participants: {
        current: 4,
        required: 5
      },
      timeLeft: '1 day',
      category: 'electronics'
    },
    {
      id: 'jam3a-003',
      title: {
        en: 'Dyson V12 Detect Slim Cordless Vacuum',
        ar: 'مكنسة دايسون V12 ديتكت سليم لاسلكية'
      },
      image: 'https://images.pexels.com/photos/4108714/pexels-photo-4108714.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 2499,
      jam3aPrice: 1899,
      participants: {
        current: 2,
        required: 5
      },
      timeLeft: '3 days',
      category: 'home'
    },
    {
      id: 'jam3a-004',
      title: {
        en: 'Nike Air Zoom Pegasus 39 Running Shoes',
        ar: 'حذاء نايك اير زوم بيجاسوس 39 للجري'
      },
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 599,
      jam3aPrice: 449,
      participants: {
        current: 3,
        required: 5
      },
      timeLeft: '2 days',
      category: 'fashion'
    },
    {
      id: 'jam3a-005',
      title: {
        en: 'KitchenAid Stand Mixer Professional 5',
        ar: 'خلاط كيتشن ايد ستاند ميكسر بروفيشنال 5'
      },
      image: 'https://images.pexels.com/photos/4051569/pexels-photo-4051569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 1899,
      jam3aPrice: 1499,
      participants: {
        current: 1,
        required: 5
      },
      timeLeft: '4 days',
      category: 'home'
    },
    {
      id: 'jam3a-006',
      title: {
        en: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        ar: 'سماعات سوني WH-1000XM5 لاسلكية بخاصية إلغاء الضوضاء'
      },
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 1499,
      jam3aPrice: 1199,
      participants: {
        current: 2,
        required: 5
      },
      timeLeft: '3 days',
      category: 'electronics'
    },
    {
      id: 'jam3a-007',
      title: {
        en: 'Samsung Galaxy Z Fold 6',
        ar: 'سامسونج جالاكسي زد فولد 6'
      },
      image: 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 6999,
      jam3aPrice: 5799,
      participants: {
        current: 7,
        required: 10
      },
      timeLeft: '12 hours',
      category: 'electronics'
    },
    {
      id: 'jam3a-008',
      title: {
        en: 'Samsung Galaxy S25 Ultra',
        ar: 'سامسونج جالاكسي S25 ألترا'
      },
      image: 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 4599,
      jam3aPrice: 3899,
      participants: {
        current: 4,
        required: 6
      },
      timeLeft: '2 days',
      category: 'electronics'
    },
    {
      id: 'jam3a-009',
      title: {
        en: 'Samsung Galaxy Z Flip 6',
        ar: 'سامسونج جالاكسي زد فليب 6'
      },
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      regularPrice: 3999,
      jam3aPrice: 3299,
      participants: {
        current: 2,
        required: 5
      },
      timeLeft: '3 days',
      category: 'electronics'
    }
  ];
  
  const categories = [
    { id: 'all', name: { en: 'All Categories', ar: 'جميع الفئات' } },
    { id: 'electronics', name: { en: 'Electronics', ar: 'الإلكترونيات' } },
    { id: 'fashion', name: { en: 'Fashion & Apparel', ar: 'الأزياء والملابس' } },
    { id: 'home', name: { en: 'Home & Kitchen', ar: 'المنزل والمطبخ' } },
    { id: 'beauty', name: { en: 'Beauty & Personal Care', ar: 'الجمال والعناية الشخصية' } },
    { id: 'toys', name: { en: 'Toys & Games', ar: 'الألعاب' } },
    { id: 'sports', name: { en: 'Sports & Outdoors', ar: 'الرياضة والأنشطة الخارجية' } }
  ];
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const content = {
    en: {
      title: "Shop Jam3a",
      subtitle: "Join group buying deals and save together",
      search: "Search for products...",
      regularPrice: "Regular Price",
      jam3aPrice: "Jam3a Price",
      participants: "Participants",
      timeLeft: "Time Left",
      joinJam3a: "Join this Jam3a",
      viewDetails: "View Details",
      startJam3a: "Start Your Own Jam3a",
      noDeals: "No Jam3a deals found",
      savings: "Save",
      required: "required"
    },
    ar: {
      title: "تسوق جمعة",
      subtitle: "انضم إلى صفقات الشراء الجماعي ووفر معًا",
      search: "ابحث عن المنتجات...",
      regularPrice: "السعر العادي",
      jam3aPrice: "سعر جمعة",
      participants: "المشاركون",
      timeLeft: "الوقت المتبقي",
      joinJam3a: "انضم إلى هذه الجمعة",
      viewDetails: "عرض التفاصيل",
      startJam3a: "ابدأ جمعتك الخاصة",
      noDeals: "لم يتم العثور على صفقات جمعة",
      savings: "وفر",
      required: "مطلوب"
    }
  };

  const currentContent = content[language];
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  const handleJoinJam3a = (dealId) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      navigate(`/join-jam3a?product=${encodeURIComponent(deal.title[language])}&price=${deal.jam3aPrice} SAR&discount=${calculateSavings(deal.regularPrice, deal.jam3aPrice)}%&id=${dealId}`);
    }
  };
  
  const handleViewDetails = (dealId) => {
    navigate(`/jam3a/${dealId}`);
  };
  
  const handleStartJam3a = () => {
    navigate('/start-jam3a');
  };
  
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title[language].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const calculateSavings = (regular, jam3a) => {
    return Math.round(((regular - jam3a) / regular) * 100);
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
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-2/3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={currentContent.search}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-1/3">
              <Button onClick={handleStartJam3a} className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                {currentContent.startJam3a}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategorySelect(category.id)}
                className="mb-2"
              >
                {category.name[language]}
              </Button>
            ))}
          </div>
          
          {filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map(deal => (
                <Card key={deal.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={deal.image} 
                      alt={deal.title[language]} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400/purple/white?text=Product+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-jam3a-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentContent.savings} {calculateSavings(deal.regularPrice, deal.jam3aPrice)}%
                    </div>
                  </div>
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
                        <Button onClick={() => handleJoinJam3a(deal.id)} className="flex-1">
                          {currentContent.joinJam3a}
                        </Button>
                        <Button variant="outline" onClick={() => handleViewDetails(deal.id)}>
                          {currentContent.viewDetails}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">{currentContent.noDeals}</h3>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopJam3a;
