import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  Clock, 
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Share2
} from 'lucide-react';
import { fetchDealById, joinDeal } from '@/services/DealService';
import ScrollToTop from '@/components/ScrollToTop';
import { LoadingFallback, ErrorFallback } from '@/components/FallbackComponents';

const JoinJam3a = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  const [deal, setDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Content based on language
  const content = {
    en: {
      title: "Join Jam3a Deal",
      subtitle: "Complete your information to join this deal",
      dealDetails: "Deal Details",
      regularPrice: "Regular Price",
      jam3aPrice: "Jam3a Price",
      discount: "Discount",
      participants: "Participants",
      timeLeft: "Time Left",
      yourInformation: "Your Information",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      paymentMethod: "Payment Method",
      cod: "Cash on Delivery",
      creditCard: "Credit Card",
      bankTransfer: "Bank Transfer",
      joinNow: "Join Now",
      backToDeal: "Back to Deal",
      loading: "Loading deal details...",
      errorTitle: "Error",
      errorGeneric: "Failed to load deal details",
      successTitle: "Success!",
      successMessage: "You have successfully joined this Jam3a deal. We'll notify you when the deal is complete.",
      inviteFriends: "Invite Friends",
      viewDeal: "View Deal",
      requiredField: "This field is required",
      invalidEmail: "Please enter a valid email address",
      invalidPhone: "Please enter a valid phone number",
      currency: "SAR",
      required: "required",
      almostThere: "Almost there!",
      moreNeeded: "more participants needed to activate this deal"
    },
    ar: {
      title: "الانضمام إلى صفقة جمعة",
      subtitle: "أكمل معلوماتك للانضمام إلى هذه الصفقة",
      dealDetails: "تفاصيل الصفقة",
      regularPrice: "السعر العادي",
      jam3aPrice: "سعر جمعة",
      discount: "الخصم",
      participants: "المشاركون",
      timeLeft: "الوقت المتبقي",
      yourInformation: "معلوماتك",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      paymentMethod: "طريقة الدفع",
      cod: "الدفع عند الاستلام",
      creditCard: "بطاقة ائتمان",
      bankTransfer: "تحويل بنكي",
      joinNow: "انضم الآن",
      backToDeal: "العودة إلى الصفقة",
      loading: "جاري تحميل تفاصيل الصفقة...",
      errorTitle: "خطأ",
      errorGeneric: "فشل في تحميل تفاصيل الصفقة",
      successTitle: "تم بنجاح!",
      successMessage: "لقد انضممت بنجاح إلى صفقة جمعة هذه. سنخطرك عندما تكتمل الصفقة.",
      inviteFriends: "دعوة الأصدقاء",
      viewDeal: "عرض الصفقة",
      requiredField: "هذا الحقل مطلوب",
      invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صالح",
      invalidPhone: "يرجى إدخال رقم هاتف صالح",
      currency: "ريال",
      required: "مطلوب",
      almostThere: "اقتربنا!",
      moreNeeded: "مشاركين آخرين مطلوبين لتفعيل هذه الصفقة"
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
        console.log(`Fetching deal with ID: ${dealId}`);
        
        // Use the dealId directly - it could be either a MongoDB ObjectId or a jam3aId
        const dealData = await fetchDealById(dealId).catch(err => {
          console.error('Error fetching deal:', err);
          return null;
        });
        
        if (!dealData) {
          throw new Error('Deal not found or could not be loaded. It may have been removed or expired.');
        }
        
        console.log('Deal data received:', dealData);
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

  const handleBackToDeal = () => {
    navigate(`/deals/${dealId}`);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError(currentContent.name + ': ' + currentContent.requiredField);
      return false;
    }
    
    if (!email.trim()) {
      setError(currentContent.email + ': ' + currentContent.requiredField);
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(currentContent.invalidEmail);
      return false;
    }
    
    if (!phone.trim()) {
      setError(currentContent.phone + ': ' + currentContent.requiredField);
      return false;
    }
    
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError(currentContent.invalidPhone);
      return false;
    }
    
    if (!selectedOption) {
      setError(currentContent.paymentMethod + ': ' + currentContent.requiredField);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare the data for joining the deal
      const joinData = {
        name,
        email,
        phone,
        paymentMethod: selectedOption,
        dealId: deal._id
      };
      
      console.log('Joining deal with data:', joinData);
      
      // Call the API to join the deal
      const response = await joinDeal(dealId, joinData).catch(err => {
        console.error('Error joining deal:', err);
        throw err;
      });
      
      console.log('Join deal response:', response);
      
      // Show success message
      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to join the deal. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInviteFriends = () => {
    // In a real implementation, this would open a share dialog
    // For now, we'll just simulate copying a link
    navigator.clipboard.writeText(`https://jam3a.me/jam3a/${dealId}`);
    alert('Invitation link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <LoadingFallback message={currentContent.loading} />
        </div>
        <Footer />
      </>
    );
  }

  if (error && !isSuccess) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <ErrorFallback message={error} retry={handleBackToDeal} />
        </div>
        <Footer />
      </>
    );
  }

  if (!deal && !isSuccess) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <ErrorFallback message={currentContent.errorGeneric} retry={handleBackToDeal} />
        </div>
        <Footer />
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <ScrollToTop />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">{currentContent.successTitle}</CardTitle>
              <CardDescription className="text-lg">
                {currentContent.successMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{currentContent.almostThere}</AlertTitle>
                <AlertDescription>
                  {deal.maxParticipants - deal.currentParticipants - 1} {currentContent.moreNeeded}
                </AlertDescription>
              </Alert>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm">{currentContent.participants}</div>
                  <div className="text-jam3a-purple font-medium">
                    {deal.currentParticipants + 1}/{deal.maxParticipants}
                  </div>
                </div>
                <Progress value={((deal.currentParticipants + 1) / deal.maxParticipants) * 100} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={handleInviteFriends}>
                <Share2 className="mr-2 h-4 w-4" />
                {currentContent.inviteFriends}
              </Button>
              <Button onClick={handleBackToDeal}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                {currentContent.viewDeal}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate progress percentage
  const progress = (deal.currentParticipants / deal.maxParticipants) * 100;
  
  // Format time remaining
  const timeRemaining = deal.timeRemaining || '2 days';

  return (
    <>
      <Header />
      <ScrollToTop />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={handleBackToDeal}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentContent.backToDeal}
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">{currentContent.title}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deal Details Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{currentContent.dealDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                <img 
                  src={deal.image || 'https://via.placeholder.com/300x200?text=Jam3a+Deal'} 
                  alt={language === 'ar' && deal.titleAr ? deal.titleAr : deal.title} 
                  className="rounded-md max-h-48 object-contain"
                />
              </div>
              
              <h2 className="text-xl font-semibold">
                {language === 'ar' && deal.titleAr ? deal.titleAr : deal.title}
              </h2>
              
              {/* Price Information */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{currentContent.regularPrice}:</span>
                  <span className="line-through">{deal.regularPrice} {currentContent.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{currentContent.jam3aPrice}:</span>
                  <span className="font-bold text-jam3a-purple">{deal.jam3aPrice} {currentContent.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{currentContent.discount}:</span>
                  <span className="text-green-600">{deal.discountPercentage}%</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Participants and Time Left */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{currentContent.participants}:</span>
                    </div>
                    <span>{deal.currentParticipants}/{deal.maxParticipants}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{currentContent.timeLeft}:</span>
                  </div>
                  <span>{timeRemaining}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Join Form Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{currentContent.subtitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-medium">{currentContent.yourInformation}</h3>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{currentContent.name}</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="John Doe"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">{currentContent.email}</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="john@example.com"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">{currentContent.phone}</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="+966 50 123 4567"
                      dir="ltr"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{currentContent.paymentMethod}</h3>
                  
                  <RadioGroup 
                    value={selectedOption} 
                    onValueChange={setSelectedOption}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {currentContent.cod}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {currentContent.creditCard}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {currentContent.bankTransfer}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{currentContent.errorTitle}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentContent.joinNow}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default JoinJam3a;
