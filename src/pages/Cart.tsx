import React, { useState } from 'react';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  ArrowRight,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

// Mock cart data
const mockCartItems = [
  {
    id: 1,
    jam3aId: 'JAM-123456',
    name: {
      en: "Samsung 55-inch 4K Smart TV",
      ar: "تلفزيون سامسونج ذكي 55 بوصة بدقة 4K"
    },
    category: {
      en: "Electronics",
      ar: "إلكترونيات"
    },
    price: 1999,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    participants: {
      current: 3,
      required: 5
    },
    expiresIn: "2 days"
  },
  {
    id: 2,
    jam3aId: 'JAM-789012',
    name: {
      en: "Dyson V12 Detect Slim Cordless Vacuum",
      ar: "مكنسة دايسون V12 ديتكت سليم لاسلكية"
    },
    category: {
      en: "Home Appliances",
      ar: "أجهزة منزلية"
    },
    price: 2299,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    participants: {
      current: 4,
      required: 5
    },
    expiresIn: "3 days"
  }
];

const Cart = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState(mockCartItems);
  
  const content = {
    en: {
      title: "Your Cart",
      subtitle: "Jam3a deals you've selected but not paid for yet",
      emptyCart: {
        title: "Your cart is empty",
        description: "Looks like you haven't added any Jam3a deals to your cart yet.",
        browseButton: "Browse Jam3a Deals"
      },
      cartItem: {
        jam3aId: "Jam3a ID",
        participants: "Participants",
        expiresIn: "Expires In",
        remove: "Remove",
        join: "Join Now"
      },
      summary: {
        title: "Summary",
        items: "Items",
        shipping: "Shipping",
        tax: "Tax (15% VAT)",
        total: "Total",
        checkout: "Proceed to Checkout",
        free: "Free",
        currency: "SAR"
      },
      removeConfirm: "Are you sure you want to remove this item from your cart?",
      removeSuccess: "Item removed from cart",
      continueShoppingButton: "Continue Shopping"
    },
    ar: {
      title: "سلة التسوق الخاصة بك",
      subtitle: "صفقات جمعة التي اخترتها ولكن لم تدفع ثمنها بعد",
      emptyCart: {
        title: "سلة التسوق فارغة",
        description: "يبدو أنك لم تضف أي صفقات جمعة إلى سلة التسوق الخاصة بك حتى الآن.",
        browseButton: "تصفح صفقات جمعة"
      },
      cartItem: {
        jam3aId: "معرف الجمعة",
        participants: "المشاركون",
        expiresIn: "تنتهي في",
        remove: "إزالة",
        join: "انضم الآن"
      },
      summary: {
        title: "الملخص",
        items: "العناصر",
        shipping: "الشحن",
        tax: "الضريبة (15% ضريبة القيمة المضافة)",
        total: "المجموع",
        checkout: "المتابعة إلى الدفع",
        free: "مجاني",
        currency: "ريال"
      },
      removeConfirm: "هل أنت متأكد أنك تريد إزالة هذا العنصر من سلة التسوق الخاصة بك؟",
      removeSuccess: "تمت إزالة العنصر من سلة التسوق",
      continueShoppingButton: "مواصلة التسوق"
    }
  };

  const currentContent = content[language];
  
  const handleRemoveItem = (itemId) => {
    // Confirm before removing
    if (confirm(currentContent.removeConfirm)) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
      
      toast({
        title: currentContent.removeSuccess,
        variant: "default"
      });
    }
  };
  
  const handleCheckout = () => {
    // In a real implementation, this would navigate to the checkout page
    // For now, we'll just navigate to the payment page
    navigate('/payment');
  };
  
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
    const shipping = 0; // Free shipping
    const tax = Math.round(subtotal * 0.15); // 15% VAT
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };
  
  const renderEmptyCart = () => {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{currentContent.emptyCart.title}</h2>
        <p className="text-muted-foreground mb-6">{currentContent.emptyCart.description}</p>
        <Button onClick={() => navigate('/shop-jam3a')}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          {currentContent.emptyCart.browseButton}
        </Button>
      </div>
    );
  };
  
  const renderCartItems = () => {
    const { subtotal, shipping, tax, total } = calculateTotals();
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-32 h-32 rounded-md overflow-hidden mb-4 md:mb-0 md:mr-4">
                    <img 
                      src={item.image} 
                      alt={item.name[language]} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{item.name[language]}</h3>
                        <p className="text-sm text-muted-foreground">{item.category[language]}</p>
                      </div>
                      <div className="text-right mt-2 md:mt-0">
                        <p className="font-bold text-lg text-jam3a-purple">{item.price} {currentContent.summary.currency}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{currentContent.cartItem.jam3aId}</p>
                        <p className="font-medium">{item.jam3aId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{currentContent.cartItem.participants}</p>
                        <p className="font-medium">
                          {item.participants.current} / {item.participants.required}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{currentContent.cartItem.expiresIn}</p>
                        <p className="font-medium">{item.expiresIn}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {currentContent.cartItem.remove}
                      </Button>
                      <Button size="sm">
                        {currentContent.cartItem.join}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-start">
            <Button 
              variant="outline"
              onClick={() => navigate('/shop-jam3a')}
            >
              {currentContent.continueShoppingButton}
            </Button>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.summary.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{currentContent.summary.items} ({cartItems.length})</span>
                  <span>{subtotal} {currentContent.summary.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentContent.summary.shipping}</span>
                  <span className="text-green-600">{currentContent.summary.free}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentContent.summary.tax}</span>
                  <span>{tax} {currentContent.summary.currency}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>{currentContent.summary.total}</span>
                <span>{total} {currentContent.summary.currency}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleCheckout}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {currentContent.summary.checkout}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                {language === 'en' 
                  ? "Jam3a deals are only confirmed once enough participants join and payment is completed."
                  : "يتم تأكيد صفقات جمعة فقط بمجرد انضمام عدد كافٍ من المشاركين واكتمال الدفع."}
              </p>
            </div>
          </div>
        </div>
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
          
          {cartItems.length === 0 ? renderEmptyCart() : renderCartItems()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
