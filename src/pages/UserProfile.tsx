import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Package, 
  History, 
  LogOut, 
  Settings, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Save, 
  Clock 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === 'ar';
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  
  // User profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Saudi Arabia',
    bio: user?.bio || ''
  });
  
  // Mock data for orders/Jam3a history
  const mockOrders = [
    {
      id: 'JAM-1234',
      date: '2025-03-15',
      product: 'iPhone 16 Pro Max 256GB',
      price: 4199,
      status: 'active',
      members: 4,
      totalMembers: 5,
      timeLeft: '23:45:12',
      image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'JAM-1122',
      date: '2025-02-28',
      product: 'MacBook Pro 16" M3 Pro',
      price: 8499,
      status: 'completed',
      members: 8,
      totalMembers: 8,
      timeLeft: '00:00:00',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'JAM-0987',
      date: '2025-01-10',
      product: 'AirPods Pro 2',
      price: 799,
      status: 'completed',
      members: 10,
      totalMembers: 10,
      timeLeft: '00:00:00',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1600&q=80'
    }
  ];
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };
  
  // Handle profile update
  const handleProfileUpdate = () => {
    // In a real app, you would send this to your backend
    updateUser({
      ...user,
      ...profileForm
    });
    
    setEditMode(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Translations
  const content = {
    en: {
      title: 'My Account',
      tabs: {
        profile: 'Profile',
        jam3aHistory: 'Jam3a History',
        activeJam3a: 'Active Jam3a',
        settings: 'Settings'
      },
      profile: {
        personalInfo: 'Personal Information',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        address: 'Address',
        city: 'City',
        country: 'Country',
        bio: 'Bio',
        edit: 'Edit Profile',
        save: 'Save Changes',
        cancel: 'Cancel'
      },
      jam3aHistory: {
        title: 'Your Jam3a History',
        empty: 'You haven\'t joined any Jam3a deals yet.',
        id: 'ID',
        date: 'Date',
        product: 'Product',
        price: 'Price',
        status: 'Status',
        members: 'Members',
        timeLeft: 'Time Left',
        viewDetails: 'View Details',
        statuses: {
          active: 'Active',
          completed: 'Completed',
          cancelled: 'Cancelled'
        }
      },
      activeJam3a: {
        title: 'Your Active Jam3a Deals',
        empty: 'You don\'t have any active Jam3a deals.',
        inviteMembers: 'Invite Members',
        viewDetails: 'View Details'
      },
      settings: {
        title: 'Account Settings',
        notifications: 'Notifications',
        emailNotifications: 'Email Notifications',
        smsNotifications: 'SMS Notifications',
        language: 'Language Preference',
        privacy: 'Privacy',
        deleteAccount: 'Delete Account',
        deleteWarning: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
        deleteButton: 'Delete My Account'
      },
      logout: 'Sign Out'
    },
    ar: {
      title: 'حسابي',
      tabs: {
        profile: 'الملف الشخصي',
        jam3aHistory: 'سجل الجمعة',
        activeJam3a: 'الجمعات النشطة',
        settings: 'الإعدادات'
      },
      profile: {
        personalInfo: 'المعلومات الشخصية',
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        address: 'العنوان',
        city: 'المدينة',
        country: 'البلد',
        bio: 'نبذة',
        edit: 'تعديل الملف الشخصي',
        save: 'حفظ التغييرات',
        cancel: 'إلغاء'
      },
      jam3aHistory: {
        title: 'سجل الجمعة الخاص بك',
        empty: 'لم تنضم إلى أي صفقات جمعة بعد.',
        id: 'المعرف',
        date: 'التاريخ',
        product: 'المنتج',
        price: 'السعر',
        status: 'الحالة',
        members: 'الأعضاء',
        timeLeft: 'الوقت المتبقي',
        viewDetails: 'عرض التفاصيل',
        statuses: {
          active: 'نشط',
          completed: 'مكتمل',
          cancelled: 'ملغي'
        }
      },
      activeJam3a: {
        title: 'صفقات الجمعة النشطة',
        empty: 'ليس لديك أي صفقات جمعة نشطة.',
        inviteMembers: 'دعوة أعضاء',
        viewDetails: 'عرض التفاصيل'
      },
      settings: {
        title: 'إعدادات الحساب',
        notifications: 'الإشعارات',
        emailNotifications: 'إشعارات البريد الإلكتروني',
        smsNotifications: 'إشعارات الرسائل القصيرة',
        language: 'تفضيل اللغة',
        privacy: 'الخصوصية',
        deleteAccount: 'حذف الحساب',
        deleteWarning: 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا وإزالة بياناتك من خوادمنا.',
        deleteButton: 'حذف حسابي'
      },
      logout: 'تسجيل الخروج'
    }
  };
  
  const currentContent = content[language];
  
  return (
    <div className={`flex min-h-screen flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-2xl bg-jam3a-purple text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    
                    {user?.isSeller && (
                      <Badge className="mt-2 bg-jam3a-purple">
                        {language === 'en' ? 'Seller' : 'بائع'}
                      </Badge>
                    )}
                  </div>
                  
                  <nav className="space-y-2">
                    <Button 
                      variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {currentContent.tabs.profile}
                    </Button>
                    
                    <Button 
                      variant={activeTab === 'jam3aHistory' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('jam3aHistory')}
                    >
                      <History className="mr-2 h-4 w-4" />
                      {currentContent.tabs.jam3aHistory}
                    </Button>
                    
                    <Button 
                      variant={activeTab === 'activeJam3a' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('activeJam3a')}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      {currentContent.tabs.activeJam3a}
                    </Button>
                    
                    <Button 
                      variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {currentContent.tabs.settings}
                    </Button>
                    
                    <Separator className="my-4" />
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {currentContent.logout}
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{currentContent.tabs.profile}</CardTitle>
                      <CardDescription>
                        {currentContent.profile.personalInfo}
                      </CardDescription>
                    </div>
                    
                    {!editMode ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditMode(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {currentContent.profile.edit}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditMode(false)}
                        >
                          {currentContent.profile.cancel}
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleProfileUpdate}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {currentContent.profile.save}
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{currentContent.profile.name}</Label>
                        {editMode ? (
                          <Input
                            id="name"
                            name="name"
                            value={profileForm.name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{profileForm.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">{currentContent.profile.email}</Label>
                        {editMode ? (
                          <Input
                            id="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleInputChange}
                            type="email"
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{profileForm.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">{currentContent.profile.phone}</Label>
                        {editMode ? (
                          <Input
                            id="phone"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{profileForm.phone || '-'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">{currentContent.profile.address}</Label>
                        {editMode ? (
                          <Input
                            id="address"
                            name="address"
                            value={profileForm.address}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{profileForm.address || '-'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">{currentContent.profile.city}</Label>
                        {editMode ? (
                          <Input
                            id="city"
                            name="city"
                            value={profileForm.city}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{profileForm.city || '-'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">{currentContent.profile.country}</Label>
                        {editMode ? (
                          <Input
                            id="country"
                            name="country"
                            value={profileForm.country}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{profileForm.country}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">{currentContent.profile.bio}</Label>
                      {editMode ? (
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileForm.bio}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      ) : (
                        <div className="min-h-[100px] p-3 rounded-md border border-input bg-background">
                          {profileForm.bio || '-'}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Jam3a History Tab */}
              {activeTab === 'jam3aHistory' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{currentContent.jam3aHistory.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    {mockOrders.length > 0 ? (
                      <div className="space-y-6">
                        {mockOrders.map((order) => (
                          <div key={order.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                            <div className="md:w-1/4">
                              <img 
                                src={order.image} 
                                alt={order.product} 
                                className="w-full h-24 object-cover rounded-md"
                              />
                            </div>
                            
                            <div className="md:w-3/4 space-y-2">
                              <div className="flex flex-wrap justify-between items-start gap-2">
                                <h3 className="font-medium">{order.product}</h3>
                                <Badge className={
                                  order.status === 'active' ? 'bg-green-500' : 
                                  order.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                                }>
                                  {currentContent.jam3aHistory.statuses[order.status]}
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">{currentContent.jam3aHistory.id}:</span> {order.id} | 
                                <span className="font-medium"> {currentContent.jam3aHistory.date}:</span> {order.date}
                              </div>
                              
                              <div className="flex flex-wrap justify-between items-center gap-2">
                                <div>
                                  <span className="font-bold text-jam3a-purple">{order.price} SAR</span>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center text-sm">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>{order.members}/{order.totalMembers}</span>
                                  </div>
                                  
                                  {order.status === 'active' && (
                                    <div className="flex items-center text-sm">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>{order.timeLeft}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="pt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/jam3a/${order.id}`)}
                                >
                                  {currentContent.jam3aHistory.viewDetails}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <p className="mt-4 text-muted-foreground">{currentContent.jam3aHistory.empty}</p>
                        <Button 
                          className="mt-4"
                          onClick={() => navigate('/shop-jam3a')}
                        >
                          {language === 'en' ? 'Browse Jam3a Deals' : 'تصفح صفقات جمعة'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Active Jam3a Tab */}
              {activeTab === 'activeJam3a' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{currentContent.activeJam3a.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    {mockOrders.filter(order => order.status === 'active').length > 0 ? (
                      <div className="space-y-6">
                        {mockOrders
                          .filter(order => order.status === 'active')
                          .map((order) => (
                            <div key={order.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                              <div className="md:w-1/4">
                                <img 
                                  src={order.image} 
                                  alt={order.product} 
                                  className="w-full h-24 object-cover rounded-md"
                                />
                              </div>
                              
                              <div className="md:w-3/4 space-y-2">
                                <div className="flex flex-wrap justify-between items-start gap-2">
                                  <h3 className="font-medium">{order.product}</h3>
                                  <Badge className="bg-green-500">
                                    {currentContent.jam3aHistory.statuses.active}
                                  </Badge>
                                </div>
                                
                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">{currentContent.jam3aHistory.id}:</span> {order.id} | 
                                  <span className="font-medium"> {currentContent.jam3aHistory.date}:</span> {order.date}
                                </div>
                                
                                <div className="flex flex-wrap justify-between items-center gap-2">
                                  <div>
                                    <span className="font-bold text-jam3a-purple">{order.price} SAR</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center text-sm">
                                      <Users className="h-4 w-4 mr-1" />
                                      <span>{order.members}/{order.totalMembers}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-sm">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>{order.timeLeft}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="pt-2 flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/jam3a/${order.id}`)}
                                  >
                                    {currentContent.activeJam3a.viewDetails}
                                  </Button>
                                  
                                  <Button 
                                    size="sm"
                                    onClick={() => {/* Share functionality */}}
                                  >
                                    {currentContent.activeJam3a.inviteMembers}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <p className="mt-4 text-muted-foreground">{currentContent.activeJam3a.empty}</p>
                        <Button 
                          className="mt-4"
                          onClick={() => navigate('/shop-jam3a')}
                        >
                          {language === 'en' ? 'Browse Jam3a Deals' : 'تصفح صفقات جمعة'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{currentContent.settings.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">{currentContent.settings.notifications}</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emailNotifications">{currentContent.settings.emailNotifications}</Label>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' 
                                ? 'Receive email notifications about your Jam3a deals' 
                                : 'تلقي إشعارات البريد الإلكتروني حول صفقات جمعة الخاصة بك'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="emailNotifications"
                              className="h-4 w-4 rounded border-gray-300 text-jam3a-purple focus:ring-jam3a-purple"
                              defaultChecked
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="smsNotifications">{currentContent.settings.smsNotifications}</Label>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' 
                                ? 'Receive SMS notifications about your Jam3a deals' 
                                : 'تلقي إشعارات الرسائل القصيرة حول صفقات جمعة الخاصة بك'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="smsNotifications"
                              className="h-4 w-4 rounded border-gray-300 text-jam3a-purple focus:ring-jam3a-purple"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">{currentContent.settings.language}</h3>
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant={language === 'en' ? 'default' : 'outline'}
                          onClick={() => {/* Language is handled by Header component */}}
                        >
                          English
                        </Button>
                        <Button 
                          variant={language === 'ar' ? 'default' : 'outline'}
                          onClick={() => {/* Language is handled by Header component */}}
                        >
                          العربية
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-red-500 mb-4">{currentContent.settings.deleteAccount}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {currentContent.settings.deleteWarning}
                      </p>
                      <Button variant="destructive">
                        {currentContent.settings.deleteButton}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
