import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ImagePlus, Save, Trash2, Edit, Eye, Globe, Languages } from 'lucide-react';

// Mock data for content items with bilingual support
const mockBanners = [
  { 
    id: 1, 
    en: { title: 'Welcome Banner', description: 'Join our community today' },
    ar: { title: 'لافتة الترحيب', description: 'انضم إلى مجتمعنا اليوم' },
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80', 
    active: true 
  },
  { 
    id: 2, 
    en: { title: 'Summer Sale', description: 'Get amazing discounts' },
    ar: { title: 'تخفيضات الصيف', description: 'احصل على خصومات مذهلة' },
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80', 
    active: false 
  },
  { 
    id: 3, 
    en: { title: 'New Products', description: 'Check out our latest items' },
    ar: { title: 'منتجات جديدة', description: 'تحقق من أحدث العناصر لدينا' },
    image: 'https://images.unsplash.com/photo-1615380547903-c456276b7702?auto=format&fit=crop&w=1600&q=80', 
    active: false 
  },
];

const mockPages = [
  { 
    id: 1, 
    slug: 'about', 
    en: { title: 'About Us', content: 'This is the about us page content in English.' },
    ar: { title: 'من نحن', content: 'هذا هو محتوى صفحة من نحن باللغة العربية.' },
    lastUpdated: '2025-03-28' 
  },
  { 
    id: 2, 
    slug: 'faq', 
    en: { title: 'FAQ', content: 'Frequently asked questions in English.' },
    ar: { title: 'الأسئلة الشائعة', content: 'الأسئلة المتداولة باللغة العربية.' },
    lastUpdated: '2025-03-29' 
  },
  { 
    id: 3, 
    slug: 'terms', 
    en: { title: 'Terms of Service', content: 'Terms of service content in English.' },
    ar: { title: 'شروط الخدمة', content: 'محتوى شروط الخدمة باللغة العربية.' },
    lastUpdated: '2025-03-30' 
  },
  { 
    id: 4, 
    slug: 'privacy', 
    en: { title: 'Privacy Policy', content: 'Privacy policy content in English.' },
    ar: { title: 'سياسة الخصوصية', content: 'محتوى سياسة الخصوصية باللغة العربية.' },
    lastUpdated: '2025-03-30' 
  },
];

const mockFAQs = [
  { 
    id: 1, 
    en: { question: 'What is Jam3a?', answer: 'Jam3a is a social shopping platform where people team up to get better prices on products.' },
    ar: { question: 'ما هو جمعة؟', answer: 'جمعة هي منصة تسوق اجتماعية حيث يتعاون الناس للحصول على أسعار أفضل للمنتجات.' }
  },
  { 
    id: 2, 
    en: { question: 'How does a Jam3a deal work?', answer: 'A Jam3a starts when someone selects a product and shares it with others. Once enough people join the deal within a set time, everyone gets the discounted price.' },
    ar: { question: 'كيف تعمل صفقة جمعة؟', answer: 'تبدأ جمعة عندما يختار شخص ما منتجًا ويشاركه مع الآخرين. بمجرد انضمام عدد كافٍ من الأشخاص إلى الصفقة خلال وقت محدد، يحصل الجميع على السعر المخفض.' }
  },
  { 
    id: 3, 
    en: { question: 'Can I start my own Jam3a?', answer: 'Yes! You can start your own Jam3a by picking a product, setting the group size, and inviting others to join.' },
    ar: { question: 'هل يمكنني بدء جمعة خاصة بي؟', answer: 'نعم! يمكنك بدء جمعة خاصة بك عن طريق اختيار منتج وتحديد حجم المجموعة ودعوة الآخرين للانضمام.' }
  },
];

const BilingualContentManager = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [editingLanguage, setEditingLanguage] = useState<'en' | 'ar'>('en');
  const { toast } = useToast();

  // Form states
  const [bannerForm, setBannerForm] = useState({
    en: { title: '', description: '' },
    ar: { title: '', description: '' },
    image: '',
    active: false,
    link: '',
  });

  const [pageForm, setPageForm] = useState({
    slug: '',
    en: { title: '', content: '' },
    ar: { title: '', content: '' },
  });

  const [faqForm, setFaqForm] = useState({
    en: { question: '', answer: '' },
    ar: { question: '', answer: '' },
  });

  const handleBannerSelect = (banner: any) => {
    setSelectedBanner(banner);
    setBannerForm({
      en: { 
        title: banner.en.title, 
        description: banner.en.description || '' 
      },
      ar: { 
        title: banner.ar.title, 
        description: banner.ar.description || '' 
      },
      image: banner.image,
      active: banner.active,
      link: banner.link || '',
    });
    setIsEditing(true);
  };

  const handlePageSelect = (page: any) => {
    setSelectedPage(page);
    setPageForm({
      slug: page.slug,
      en: {
        title: page.en.title,
        content: page.en.content,
      },
      ar: {
        title: page.ar.title,
        content: page.ar.content,
      },
    });
    setIsEditing(true);
  };

  const handleFAQSelect = (faq: any) => {
    setSelectedFAQ(faq);
    setFaqForm({
      en: {
        question: faq.en.question,
        answer: faq.en.answer,
      },
      ar: {
        question: faq.ar.question,
        answer: faq.ar.answer,
      },
    });
    setIsEditing(true);
  };

  const handleNewItem = () => {
    setIsEditing(true);
    if (activeTab === 'banners') {
      setSelectedBanner(null);
      setBannerForm({
        en: { title: '', description: '' },
        ar: { title: '', description: '' },
        image: '',
        active: false,
        link: '',
      });
    } else if (activeTab === 'pages') {
      setSelectedPage(null);
      setPageForm({
        slug: '',
        en: { title: '', content: '' },
        ar: { title: '', content: '' },
      });
    } else if (activeTab === 'faqs') {
      setSelectedFAQ(null);
      setFaqForm({
        en: { question: '', answer: '' },
        ar: { question: '', answer: '' },
      });
    }
  };

  const handleSave = () => {
    // In a real implementation, this would save to a database or API
    toast({
      title: "Content saved",
      description: "Your bilingual content has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedBanner(null);
    setSelectedPage(null);
    setSelectedFAQ(null);
  };

  const toggleEditingLanguage = () => {
    setEditingLanguage(editingLanguage === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Bilingual Content Management</h2>
        <div className="flex space-x-2">
          {!isEditing && (
            <Button onClick={handleNewItem}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New
            </Button>
          )}
          {!isEditing && (
            <Select value={language} onValueChange={(value: 'en' | 'ar') => setLanguage(value)}>
              <SelectTrigger className="w-[180px]">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs defaultValue="banners" value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setIsEditing(false);
        setSelectedBanner(null);
        setSelectedPage(null);
        setSelectedFAQ(null);
      }} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockBanners.map((banner) => (
                <Card key={banner.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <img 
                      src={banner.image} 
                      alt={banner[language].title} 
                      className="w-full h-full object-cover"
                    />
                    {banner.active && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        {language === 'en' ? 'Active' : 'نشط'}
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{banner[language].title}</CardTitle>
                    <CardDescription>{banner[language].description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleBannerSelect(banner)}>
                      <Edit className="h-4 w-4 mr-1" /> {language === 'en' ? 'Edit' : 'تعديل'}
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> {language === 'en' ? 'Delete' : 'حذف'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedBanner ? 'Edit Banner' : 'Add New Banner'}</CardTitle>
                    <CardDescription>Manage homepage and promotional banners</CardDescription>
                  </div>
                  <Button variant="outline" onClick={toggleEditingLanguage}>
                    <Languages className="mr-2 h-4 w-4" />
                    {editingLanguage === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Common fields */}
                <div className="space-y-2">
                  <Label htmlFor="banner-image">Banner Image URL</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="banner-image" 
                      value={bannerForm.image} 
                      onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})}
                      placeholder="Enter image URL or upload"
                      className="flex-1"
                    />
                    <Button variant="outline">
                      <ImagePlus className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </div>
                </div>
                
                {bannerForm.image && (
                  <div className="border rounded-md overflow-hidden h-40 mt-2">
                    <img 
                      src={bannerForm.image} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="banner-link">Link URL (optional)</Label>
                  <Input 
                    id="banner-link" 
                    value={bannerForm.link} 
                    onChange={(e) => setBannerForm({...bannerForm, link: e.target.value})}
                    placeholder="Enter URL for banner link"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="banner-active"
                    checked={bannerForm.active}
                    onChange={(e) => setBannerForm({...bannerForm, active: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="banner-active">Set as active</Label>
                </div>

                {/* Language specific fields */}
                <div className="border p-4 rounded-md mt-4">
                  <h3 className="text-lg font-medium mb-4">
                    {editingLanguage === 'en' ? 'English Content' : 'المحتوى العربي'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`banner-title-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Banner Title' : 'عنوان اللافتة'}
                      </Label>
                      <Input 
                        id={`banner-title-${editingLanguage}`}
                        value={bannerForm[editingLanguage].title} 
                        onChange={(e) => setBannerForm({
                          ...bannerForm, 
                          [editingLanguage]: {
                            ...bannerForm[editingLanguage],
                            title: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter banner title" : "أدخل عنوان اللافتة"}
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`banner-description-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Banner Description' : 'وصف اللافتة'}
                      </Label>
                      <Textarea 
                        id={`banner-description-${editingLanguage}`}
                        value={bannerForm[editingLanguage].description} 
                        onChange={(e) => setBannerForm({
                          ...bannerForm, 
                          [editingLanguage]: {
                            ...bannerForm[editingLanguage],
                            description: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter banner description" : "أدخل وصف اللافتة"}
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  {editingLanguage === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" /> 
                  {editingLanguage === 'en' ? 'Save Banner' : 'حفظ اللافتة'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages">
          {!isEditing ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Title' : 'العنوان'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Slug' : 'الرابط'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Last Updated' : 'آخر تحديث'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Actions' : 'إجراءات'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockPages.map((page) => (
                      <tr key={page.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{page[language].title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{page.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{page.lastUpdated}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" className="mr-2" onClick={() => handlePageSelect(page)}>
                            <Edit className="h-4 w-4 mr-1" /> {language === 'en' ? 'Edit' : 'تعديل'}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> {language === 'en' ? 'View' : 'عرض'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedPage ? 'Edit Page' : 'Add New Page'}</CardTitle>
                    <CardDescription>Manage website pages and content</CardDescription>
                  </div>
                  <Button variant="outline" onClick={toggleEditingLanguage}>
                    <Languages className="mr-2 h-4 w-4" />
                    {editingLanguage === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Common fields */}
                <div className="space-y-2">
                  <Label htmlFor="page-slug">Page Slug</Label>
                  <Input 
                    id="page-slug" 
                    value={pageForm.slug} 
                    onChange={(e) => setPageForm({...pageForm, slug: e.target.value})}
                    placeholder="Enter page slug (e.g., about-us)"
                  />
                </div>

                {/* Language specific fields */}
                <div className="border p-4 rounded-md mt-4">
                  <h3 className="text-lg font-medium mb-4">
                    {editingLanguage === 'en' ? 'English Content' : 'المحتوى العربي'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`page-title-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Page Title' : 'عنوان الصفحة'}
                      </Label>
                      <Input 
                        id={`page-title-${editingLanguage}`}
                        value={pageForm[editingLanguage].title} 
                        onChange={(e) => setPageForm({
                          ...pageForm, 
                          [editingLanguage]: {
                            ...pageForm[editingLanguage],
                            title: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter page title" : "أدخل عنوان الصفحة"}
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`page-content-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Page Content' : 'محتوى الصفحة'}
                      </Label>
                      <Textarea 
                        id={`page-content-${editingLanguage}`}
                        value={pageForm[editingLanguage].content} 
                        onChange={(e) => setPageForm({
                          ...pageForm, 
                          [editingLanguage]: {
                            ...pageForm[editingLanguage],
                            content: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter page content" : "أدخل محتوى الصفحة"}
                        className="min-h-[200px]"
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  {editingLanguage === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" /> 
                  {editingLanguage === 'en' ? 'Save Page' : 'حفظ الصفحة'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs">
          {!isEditing ? (
            <div className="space-y-4">
              {mockFAQs.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{faq[language].question}</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleFAQSelect(faq)}>
                          <Edit className="h-4 w-4 mr-1" /> {language === 'en' ? 'Edit' : 'تعديل'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" /> {language === 'en' ? 'Delete' : 'حذف'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{faq[language].answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedFAQ ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
                    <CardDescription>Manage frequently asked questions</CardDescription>
                  </div>
                  <Button variant="outline" onClick={toggleEditingLanguage}>
                    <Languages className="mr-2 h-4 w-4" />
                    {editingLanguage === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Language specific fields */}
                <div className="border p-4 rounded-md mt-4">
                  <h3 className="text-lg font-medium mb-4">
                    {editingLanguage === 'en' ? 'English Content' : 'المحتوى العربي'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`faq-question-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Question' : 'السؤال'}
                      </Label>
                      <Input 
                        id={`faq-question-${editingLanguage}`}
                        value={faqForm[editingLanguage].question} 
                        onChange={(e) => setFaqForm({
                          ...faqForm, 
                          [editingLanguage]: {
                            ...faqForm[editingLanguage],
                            question: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter question" : "أدخل السؤال"}
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`faq-answer-${editingLanguage}`}>
                        {editingLanguage === 'en' ? 'Answer' : 'الإجابة'}
                      </Label>
                      <Textarea 
                        id={`faq-answer-${editingLanguage}`}
                        value={faqForm[editingLanguage].answer} 
                        onChange={(e) => setFaqForm({
                          ...faqForm, 
                          [editingLanguage]: {
                            ...faqForm[editingLanguage],
                            answer: e.target.value
                          }
                        })}
                        placeholder={editingLanguage === 'en' ? "Enter answer" : "أدخل الإجابة"}
                        className="min-h-[150px]"
                        dir={editingLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  {editingLanguage === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" /> 
                  {editingLanguage === 'en' ? 'Save FAQ' : 'حفظ السؤال'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BilingualContentManager;
