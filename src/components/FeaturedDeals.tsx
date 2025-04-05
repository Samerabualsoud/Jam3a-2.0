import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/Header';

const FeaturedDeals = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const content = {
    en: {
      title: "Featured Deals",
      subtitle: "Join these popular Jam3a deals and save big",
      viewAll: "View All Deals",
      currency: "SAR",
      regularPrice: "Regular Price",
      jam3aPrice: "Jam3a Price",
      discount: "Discount",
      participants: "Participants",
      timeLeft: "Time Left",
      join: "Join This Jam3a"
    },
    ar: {
      title: "العروض المميزة",
      subtitle: "انضم إلى صفقات جمعة الشعبية هذه ووفر كثيرًا",
      viewAll: "عرض جميع العروض",
      currency: "ريال",
      regularPrice: "السعر العادي",
      jam3aPrice: "سعر جمعة",
      discount: "الخصم",
      participants: "المشاركون",
      timeLeft: "الوقت المتبقي",
      join: "انضم إلى هذه الجمعة"
    }
  };

  const currentContent = content[language];

  // Product data with local images
  const products = [
    {
      id: 1,
      name: {
        en: "Samsung 55\" QLED 4K Smart TV",
        ar: "تلفزيون سامسونج QLED ذكي 55 بوصة بدقة 4K"
      },
      regularPrice: 3499,
      jam3aPrice: 2799,
      discount: "20%",
      participants: {
        current: 3,
        total: 5
      },
      timeLeft: "2 days, 5 hours",
      image: "/assets/products/samsung-tv.jpg"
    },
    {
      id: 2,
      name: {
        en: "Apple iPhone 14 Pro - 256GB",
        ar: "آيفون 14 برو - 256 جيجابايت"
      },
      regularPrice: 4799,
      jam3aPrice: 4199,
      discount: "12.5%",
      participants: {
        current: 4,
        total: 5
      },
      timeLeft: "1 day, 12 hours",
      image: "/assets/products/iphone-14.jpg"
    },
    {
      id: 3,
      name: {
        en: "Sony WH-1000XM5 Wireless Headphones",
        ar: "سماعات سوني WH-1000XM5 لاسلكية"
      },
      regularPrice: 1499,
      jam3aPrice: 1199,
      discount: "20%",
      participants: {
        current: 2,
        total: 5
      },
      timeLeft: "3 days, 8 hours",
      image: "/assets/products/sony-headphones.jpg"
    },
    {
      id: 4,
      name: {
        en: "Dyson V12 Detect Slim Cordless Vacuum",
        ar: "مكنسة دايسون V12 ديتكت سليم لاسلكية"
      },
      regularPrice: 2899,
      jam3aPrice: 2299,
      discount: "20.7%",
      participants: {
        current: 1,
        total: 5
      },
      timeLeft: "4 days, 10 hours",
      image: "/assets/products/dyson-vacuum.jpg"
    }
  ];

  return (
    <section className={`py-16 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">{currentContent.title}</h2>
          <p className="text-xl text-muted-foreground">{currentContent.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name[language]}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-jam3a-purple text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  {product.discount}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name[language]}</h3>
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{currentContent.regularPrice}</p>
                    <p className="text-sm line-through text-muted-foreground">{product.regularPrice} {currentContent.currency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{currentContent.jam3aPrice}</p>
                    <p className="text-lg font-bold text-jam3a-purple">{product.jam3aPrice} {currentContent.currency}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">{currentContent.participants}</p>
                      <p>{product.participants.current}/{product.participants.total}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">{currentContent.timeLeft}</p>
                      <p>{product.timeLeft}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-jam3a-purple h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                      style={{ width: `${(product.participants.current / product.participants.total) * 100}%` }}
                    ></div>
                  </div>
                  <button 
                    className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple text-white py-2.5 rounded-md transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                    onClick={() => {
                      // Track click event in analytics
                      if (window.gtag) {
                        window.gtag('event', 'select_item', {
                          items: [{
                            item_id: product.id,
                            item_name: product.name[language],
                            price: product.jam3aPrice,
                            discount: product.discount
                          }]
                        });
                      }
                      // Navigate to join page
                      window.location.href = `/join-jam3a?product=${encodeURIComponent(product.name[language])}&price=${product.jam3aPrice}&discount=${product.discount}&id=${product.id}`;
                    }}
                  >
                    {currentContent.join}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop-jam3a" className="inline-flex items-center text-jam3a-purple hover:text-jam3a-deep-purple font-medium transition-colors duration-300">
            {currentContent.viewAll}
            <svg className={`w-5 h-5 ml-1 ${isRtl ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
