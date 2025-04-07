import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  Image, 
  RefreshCw, 
  Upload, 
  Save, 
  Eye, 
  Globe, 
  FileText, 
  Home, 
  ShoppingBag 
} from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import axios from 'axios';
import { useLanguage } from '@/components/Header';
import { useProducts } from '@/contexts/ProductContext';

// Import WYSIWYG editor
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Configuration for image upload services
const UPLOAD_SERVICES = {
  CLOUDINARY: {
    name: 'Cloudinary',
    uploadUrl: 'https://api.cloudinary.com/v1_1/jam3a-cloud/image/upload',
    uploadPreset: 'jam3a_uploads',
    transformationOptions: {
      width: 800,
      crop: 'limit',
      format: 'auto',
      quality: 'auto'
    }
  },
  IMGBB: {
    name: 'ImgBB',
    uploadUrl: 'https://api.imgbb.com/1/upload',
    apiKey: '9c70243e48e5af92a8b567ef764f92ea'
  }
};

// Content types
const CONTENT_TYPES = {
  PAGE: 'page',
  BLOG: 'blog',
  PRODUCT_DESCRIPTION: 'product_description',
  CATEGORY_DESCRIPTION: 'category_description',
  EMAIL_TEMPLATE: 'email_template',
  LANDING_PAGE: 'landing_page'
};

// Content status options
const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
  ARCHIVED: 'archived'
};

// Content interface
interface Content {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  type: string;
  content: string;
  contentAr?: string;
  status: string;
  author: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  relatedProducts?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string;
}

// Content filter interface
interface ContentFilters {
  type: string;
  status: string;
  author: string;
  tag: string;
  dateRange: [string, string];
}

const EnhancedContentManager = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [viewingContent, setViewingContent] = useState<Content | null>(null);
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [filters, setFilters] = useState<ContentFilters>({
    type: '',
    status: '',
    author: '',
    tag: '',
    dateRange: ['', '']
  });
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [uploadService, setUploadService] = useState('CLOUDINARY');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { products } = useProducts();

  // Initialize with demo content
  useEffect(() => {
    // Simulate API call to fetch content
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/content');
        // setContents(response.data);
        
        // For demo, use mock data
        setTimeout(() => {
          setContents(generateMockContent());
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast({
          title: 'Error',
          description: 'Failed to load content. Please try again.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [toast]);

  // Update current language when global language changes
  useEffect(() => {
    setCurrentLanguage(language as 'en' | 'ar');
  }, [language]);

  // Generate mock content for demo
  const generateMockContent = (): Content[] => {
    const mockContent: Content[] = [];
    
    // Home page
    mockContent.push({
      id: '1',
      title: 'Home Page',
      titleAr: 'الصفحة الرئيسية',
      slug: 'home',
      type: CONTENT_TYPES.PAGE,
      content: '<h1>Welcome to Jam3a</h1><p>Join our community and save on your favorite products!</p>',
      contentAr: '<h1>مرحبًا بكم في جمعة</h1><p>انضم إلى مجتمعنا ووفر على منتجاتك المفضلة!</p>',
      status: CONTENT_STATUS.PUBLISHED,
      author: 'Admin',
      featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
      seoTitle: 'Jam3a - Group Buying Platform',
      seoDescription: 'Join Jam3a and save on your favorite products through group buying.',
      tags: ['homepage', 'welcome'],
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2023-03-20T14:30:00Z',
      publishedAt: '2023-03-20T15:00:00Z'
    });
    
    // About page
    mockContent.push({
      id: '2',
      title: 'About Us',
      titleAr: 'من نحن',
      slug: 'about',
      type: CONTENT_TYPES.PAGE,
      content: '<h1>About Jam3a</h1><p>Jam3a is a community-driven group buying platform that helps you save money on everyday products.</p>',
      contentAr: '<h1>عن جمعة</h1><p>جمعة هي منصة شراء جماعي مدفوعة بالمجتمع تساعدك على توفير المال على المنتجات اليومية.</p>',
      status: CONTENT_STATUS.PUBLISHED,
      author: 'Admin',
      seoTitle: 'About Jam3a - Our Story',
      seoDescription: 'Learn about Jam3a\'s mission to make group buying accessible to everyone.',
      tags: ['about', 'mission'],
      createdAt: '2023-01-20T11:15:00Z',
      updatedAt: '2023-02-10T09:45:00Z',
      publishedAt: '2023-02-10T10:00:00Z'
    });
    
    // Blog post 1
    mockContent.push({
      id: '3',
      title: 'How Group Buying Can Save You Money',
      titleAr: 'كيف يمكن للشراء الجماعي أن يوفر لك المال',
      slug: 'how-group-buying-saves-money',
      type: CONTENT_TYPES.BLOG,
      content: '<h2>The Power of Group Buying</h2><p>Group buying allows consumers to leverage collective purchasing power to get better deals...</p>',
      contentAr: '<h2>قوة الشراء الجماعي</h2><p>يسمح الشراء الجماعي للمستهلكين بالاستفادة من قوة الشراء الجماعية للحصول على صفقات أفضل...</p>',
      status: CONTENT_STATUS.PUBLISHED,
      author: 'Sarah Ahmed',
      featuredImage: 'https://images.unsplash.com/photo-1556742111-a301076d9d18',
      seoTitle: 'How Group Buying Saves Money | Jam3a Blog',
      seoDescription: 'Discover how group buying can help you save up to 40% on everyday products.',
      tags: ['group buying', 'savings', 'tips'],
      createdAt: '2023-03-05T08:30:00Z',
      updatedAt: '2023-03-05T14:20:00Z',
      publishedAt: '2023-03-06T09:00:00Z'
    });
    
    // Blog post 2
    mockContent.push({
      id: '4',
      title: 'Top 5 Products to Buy as a Group',
      titleAr: 'أفضل 5 منتجات للشراء كمجموعة',
      slug: 'top-5-group-buying-products',
      type: CONTENT_TYPES.BLOG,
      content: '<h2>Best Products for Group Buying</h2><p>Not all products are created equal when it comes to group buying. Here are our top 5 recommendations...</p>',
      contentAr: '<h2>أفضل المنتجات للشراء الجماعي</h2><p>ليست كل المنتجات متساوية عندما يتعلق الأمر بالشراء الجماعي. إليك أفضل 5 توصيات لدينا...</p>',
      status: CONTENT_STATUS.PUBLISHED,
      author: 'Mohammed Ali',
      featuredImage: 'https://images.unsplash.com/photo-1556740758-90de374c12ad',
      seoTitle: 'Top 5 Products for Group Buying | Jam3a Blog',
      seoDescription: 'Discover the best products to purchase as a group for maximum savings.',
      tags: ['group buying', 'products', 'recommendations'],
      relatedProducts: ['1', '5', '8'],
      createdAt: '2023-04-10T13:45:00Z',
      updatedAt: '2023-04-12T10:30:00Z',
      publishedAt: '2023-04-12T11:00:00Z'
    });
    
    // Product description
    mockContent.push({
      id: '5',
      title: 'iPhone 14 Pro Max Product Description',
      titleAr: 'وصف منتج آيفون 14 برو ماكس',
      slug: 'iphone-14-pro-max-description',
      type: CONTENT_TYPES.PRODUCT_DESCRIPTION,
      content: '<h2>iPhone 14 Pro Max</h2><p>Experience the ultimate iPhone with the powerful A16 Bionic chip, 48MP camera, and stunning Super Retina XDR display.</p>',
      contentAr: '<h2>آيفون 14 برو ماكس</h2><p>استمتع بتجربة أفضل آيفون مع شريحة A16 Bionic القوية وكاميرا 48 ميجابكسل وشاشة Super Retina XDR المذهلة.</p>',
      status: CONTENT_STATUS.PUBLISHED,
      author: 'Product Team',
      featuredImage: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae9649',
      seoTitle: 'iPhone 14 Pro Max | Jam3a Group Buy',
      seoDescription: 'Join a group buy for the iPhone 14 Pro Max and save up to 15% on Apple\'s flagship smartphone.',
      tags: ['iphone', 'apple', 'smartphone'],
      relatedProducts: ['6', '7'],
      createdAt: '2023-05-20T09:15:00Z',
      updatedAt: '2023-05-22T16:40:00Z',
      publishedAt: '2023-05-23T10:00:00Z'
    });
    
    // Email template
    mockContent.push({
      id: '6',
      title: 'Welcome Email Template',
      titleAr: 'قالب البريد الإلكتروني للترحيب',
      slug: 'welcome-email',
      type: CONTENT_TYPES.EMAIL_TEMPLATE,
      content: '<h2>Welcome to Jam3a!</h2><p>Thank you for joining our community. Here\'s what you can do next...</p>',
      contentAr: '<h2>مرحبًا بك في جمعة!</h2><p>شكرًا لانضمامك إلى مجتمعنا. إليك ما يمكنك فعله بعد ذلك...</p>',
      status: CONTENT_STATUS.PUBLISHED,
      author: 'Marketing Team',
      tags: ['email', 'welcome', 'onboarding'],
      createdAt: '2023-06-05T11:30:00Z',
      updatedAt: '2023-06-07T14:15:00Z',
      publishedAt: '2023-06-08T09:00:00Z'
    });
    
    // Draft blog post
    mockContent.push({
      id: '7',
      title: 'Upcoming Features in Jam3a 2.0',
      titleAr: 'الميزات القادمة في جمعة 2.0',
      slug: 'upcoming-features-jam3a-2',
      type: CONTENT_TYPES.BLOG,
      content: '<h2>Exciting New Features Coming Soon</h2><p>We\'re working on some amazing new features for Jam3a 2.0. Here\'s a sneak peek...</p>',
      contentAr: '<h2>ميزات جديدة مثيرة قادمة قريبًا</h2><p>نحن نعمل على بعض الميزات الجديدة المذهلة لـ جمعة 2.0. إليك لمحة سريعة...</p>',
      status: CONTENT_STATUS.DRAFT,
      author: 'Product Team',
      tags: ['jam3a 2.0', 'features', 'roadmap'],
      createdAt: '2023-07-15T10:20:00Z',
      updatedAt: '2023-07-15T10:20:00Z'
    });
    
    // Scheduled blog post
    mockContent.push({
      id: '8',
      title: 'Jam3a Black Friday Deals Guide',
      titleAr: 'دليل صفقات الجمعة السوداء من جمعة',
      slug: 'black-friday-deals-guide',
      type: CONTENT_TYPES.BLOG,
      content: '<h2>Get Ready for Black Friday</h2><p>Black Friday is coming, and we\'ve prepared the ultimate guide to help you find the best deals...</p>',
      contentAr: '<h2>استعد للجمعة السوداء</h2><p>الجمعة السوداء قادمة، وقد أعددنا الدليل النهائي لمساعدتك في العثور على أفضل الصفقات...</p>',
      status: CONTENT_STATUS.SCHEDULED,
      author: 'Marketing Team',
      featuredImage: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
      seoTitle: 'Black Friday Deals Guide | Jam3a',
      seoDescription: 'Discover the best Black Friday deals and how to join group buys for maximum savings.',
      tags: ['black friday', 'deals', 'shopping guide'],
      createdAt: '2023-11-01T15:45:00Z',
      updatedAt: '2023-11-05T09:30:00Z',
      scheduledAt: '2023-11-20T08:00:00Z'
    });
    
    return mockContent;
  };

  // Filter contents based on search term, active tab, and filters
  const filteredContents = contents.filter(content => {
    // Search term filter
    const matchesSearch = 
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (content.tags && content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Tab filter
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pages' && content.type === CONTENT_TYPES.PAGE) ||
      (activeTab === 'blogs' && content.type === CONTENT_TYPES.BLOG) ||
      (activeTab === 'products' && content.type === CONTENT_TYPES.PRODUCT_DESCRIPTION) ||
      (activeTab === 'emails' && content.type === CONTENT_TYPES.EMAIL_TEMPLATE) ||
      (activeTab === 'published' && content.status === CONTENT_STATUS.PUBLISHED) ||
      (activeTab === 'drafts' && content.status === CONTENT_STATUS.DRAFT) ||
      (activeTab === 'scheduled' && content.status === CONTENT_STATUS.SCHEDULED);
    
    // Advanced filters
    const matchesType = !filters.type || content.type === filters.type;
    const matchesStatus = !filters.status || content.status === filters.status;
    const matchesAuthor = !filters.author || content.author === filters.author;
    const matchesTag = !filters.tag || (content.tags && content.tags.includes(filters.tag));
    
    // Date range filter
    let matchesDateRange = true;
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const contentDate = new Date(content.createdAt);
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      matchesDateRange = contentDate >= startDate && contentDate <= endDate;
    }
    
    return matchesSearch && matchesTab && matchesType && 
           matchesStatus && matchesAuthor && matchesTag && matchesDateRange;
  });

  // Sort contents by updated date (newest first)
  const sortedContents = [...filteredContents].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Get unique authors, types, and tags for filter dropdowns
  const authors = Array.from(new Set(contents.map(c => c.author)));
  const types = Object.values(CONTENT_TYPES);
  const statuses = Object.values(CONTENT_STATUS);
  const tags = Array.from(new Set(contents.flatMap(c => c.tags || [])));

  // Handle adding new content
  const handleAddContent = (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContent: Content = {
      ...content as any,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setContents([...contents, newContent]);
    setIsAddingContent(false);
    
    toast({
      title: 'Content Added',
      description: `${content.title} has been added successfully.`,
    });
  };

  // Handle updating content
  const handleUpdateContent = (updatedContent: Content) => {
    const contentWithDate = {
      ...updatedContent,
      updatedAt: new Date().toISOString()
    };
    
    setContents(
      contents.map((c) => (c.id === contentWithDate.id ? contentWithDate : c))
    );
    setEditingContent(null);
    
    toast({
      title: 'Content Updated',
      description: `${updatedContent.title} has been updated successfully.`,
    });
  };

  // Handle deleting content
  const handleDeleteContent = (id: string) => {
    const contentToDelete = contents.find(c => c.id === id);
    if (!contentToDelete) return;
    
    setContents(contents.filter((c) => c.id !== id));
    
    toast({
      title: 'Content Deleted',
      description: `${contentToDelete.title} has been deleted.`,
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedContents.length === 0) return;
    
    const updatedContents = contents.filter(c => !selectedContents.includes(c.id));
    setContents(updatedContents);
    setSelectedContents([]);
    
    toast({
      title: 'Bulk Delete Successful',
      description: `${selectedContents.length} content items have been deleted.`,
    });
  };

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContents(sortedContents.map(c => c.id));
    } else {
      setSelectedContents([]);
    }
  };

  // Handle select content
  const handleSelectContent = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedContents([...selectedContents, id]);
    } else {
      setSelectedContents(selectedContents.filter(contentId => contentId !== id));
    }
  };

  // Handle filter change
  const handleFilterChange = (key: keyof ContentFilters, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      type: '',
      status: '',
      author: '',
      tag: '',
      dateRange: ['', '']
    });
    setIsFilterDialogOpen(false);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setIsFilterDialogOpen(false);
  };

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      
      if (uploadService === 'CLOUDINARY') {
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_SERVICES.CLOUDINARY.uploadPreset);
        formData.append('folder', 'jam3a_content');
        
        const response = await axios.post(
          UPLOAD_SERVICES.CLOUDINARY.uploadUrl,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 100)
              );
              setUploadProgress(progress);
            }
          }
        );
        
        setIsUploading(false);
        return response.data.secure_url;
      } else if (uploadService === 'IMGBB') {
        formData.append('image', file);
        formData.append('key', UPLOAD_SERVICES.IMGBB.apiKey);
        
        const response = await axios.post(
          UPLOAD_SERVICES.IMGBB.uploadUrl,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 100)
              );
              setUploadProgress(progress);
            }
          }
        );
        
        setIsUploading(false);
        return response.data.data.url;
      }
      
      throw new Error('Invalid upload service');
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
      
      return '';
    }
  };

  // Handle file input change
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: 'Please select an image file.',
          variant: 'destructive'
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive'
        });
        return;
      }
      
      try {
        const imageUrl = await handleImageUpload(file);
        
        if (imageUrl) {
          // If editing content, update the featured image
          if (editingContent) {
            setEditingContent({
              ...editingContent,
              featuredImage: imageUrl
            });
          }
          
          toast({
            title: 'Upload Successful',
            description: 'Image has been uploaded successfully.',
          });
        }
      } catch (error) {
        console.error('Error handling file:', error);
        
        toast({
          title: 'Upload Failed',
          description: 'Failed to upload image. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  // Get content type badge
  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case CONTENT_TYPES.PAGE:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            <FileText className="mr-1 h-3 w-3" />
            Page
          </Badge>
        );
      case CONTENT_TYPES.BLOG:
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            <FileText className="mr-1 h-3 w-3" />
            Blog
          </Badge>
        );
      case CONTENT_TYPES.PRODUCT_DESCRIPTION:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            <ShoppingBag className="mr-1 h-3 w-3" />
            Product
          </Badge>
        );
      case CONTENT_TYPES.CATEGORY_DESCRIPTION:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <ShoppingBag className="mr-1 h-3 w-3" />
            Category
          </Badge>
        );
      case CONTENT_TYPES.EMAIL_TEMPLATE:
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
            <FileText className="mr-1 h-3 w-3" />
            Email
          </Badge>
        );
      case CONTENT_TYPES.LANDING_PAGE:
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200">
            <Home className="mr-1 h-3 w-3" />
            Landing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <FileText className="mr-1 h-3 w-3" />
            {type}
          </Badge>
        );
    }
  };

  // Get content status badge
  const getContentStatusBadge = (status: string) => {
    switch (status) {
      case CONTENT_STATUS.PUBLISHED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            Published
          </Badge>
        );
      case CONTENT_STATUS.DRAFT:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">
            Draft
          </Badge>
        );
      case CONTENT_STATUS.SCHEDULED:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            Scheduled
          </Badge>
        );
      case CONTENT_STATUS.ARCHIVED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
            Archived
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Manage your website content, blog posts, product descriptions, and more
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setContents(generateMockContent())}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setIsAddingContent(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterDialogOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 md:grid-cols-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-4">
                {/* Bulk actions */}
                {selectedContents.length > 0 && (
                  <div className="bg-gray-50 p-2 rounded mb-4 flex items-center justify-between">
                    <span className="text-sm">{selectedContents.length} items selected</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedContents([])}
                      >
                        Clear Selection
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleBulkDelete}
                      >
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Content table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={sortedContents.length > 0 && selectedContents.length === sortedContents.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="min-w-[200px]">Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            Loading content...
                          </TableCell>
                        </TableRow>
                      ) : sortedContents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No content found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedContents.map((content) => (
                          <TableRow key={content.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedContents.includes(content.id)}
                                onCheckedChange={(checked) => 
                                  handleSelectContent(content.id, checked === true)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{content.title}</div>
                              <div className="text-xs text-gray-500">{content.slug}</div>
                              {content.tags && content.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {content.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {content.tags.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{content.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {getContentTypeBadge(content.type)}
                            </TableCell>
                            <TableCell>
                              {getContentStatusBadge(content.status)}
                            </TableCell>
                            <TableCell>{content.author}</TableCell>
                            <TableCell>{formatDate(content.updatedAt)}</TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setViewingContent(content)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingContent(content)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteContent(content.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Showing {sortedContents.length} of {contents.length} content items
          </div>
        </CardFooter>
      </Card>

      {/* Add/Edit Content Dialog */}
      <Dialog 
        open={isAddingContent || !!editingContent} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingContent(false);
            setEditingContent(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddingContent ? 'Add New Content' : 'Edit Content'}
            </DialogTitle>
            <DialogDescription>
              {isAddingContent 
                ? 'Create new content for your website.' 
                : 'Update existing content.'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="mt-4">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 py-4">
              {/* Language toggle */}
              <div className="flex justify-end mb-4">
                <div className="border rounded-md p-1 flex">
                  <Button
                    variant={currentLanguage === 'en' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLanguage('en')}
                    className="text-xs"
                  >
                    English
                  </Button>
                  <Button
                    variant={currentLanguage === 'ar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLanguage('ar')}
                    className="text-xs"
                  >
                    العربية
                  </Button>
                </div>
              </div>
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title {currentLanguage === 'ar' && '(العنوان)'}
                </Label>
                <Input
                  id="title"
                  value={currentLanguage === 'en' 
                    ? editingContent?.title || '' 
                    : editingContent?.titleAr || ''}
                  onChange={(e) => {
                    if (editingContent) {
                      if (currentLanguage === 'en') {
                        setEditingContent({
                          ...editingContent,
                          title: e.target.value
                        });
                      } else {
                        setEditingContent({
                          ...editingContent,
                          titleAr: e.target.value
                        });
                      }
                    }
                  }}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              
              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex">
                  <Input
                    id="slug"
                    value={editingContent?.slug || ''}
                    onChange={(e) => {
                      if (editingContent) {
                        setEditingContent({
                          ...editingContent,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                        });
                      }
                    }}
                    className="rounded-r-none"
                  />
                  <Button
                    variant="secondary"
                    className="rounded-l-none"
                    onClick={() => {
                      if (editingContent) {
                        const title = editingContent.title || '';
                        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        setEditingContent({
                          ...editingContent,
                          slug
                        });
                      }
                    }}
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  The URL-friendly version of the title. Example: my-page-title
                </p>
              </div>
              
              {/* Content editor */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  Content {currentLanguage === 'ar' && '(المحتوى)'}
                </Label>
                <div className="min-h-[300px] border rounded-md">
                  {typeof window !== 'undefined' && (
                    <ReactQuill
                      value={currentLanguage === 'en' 
                        ? editingContent?.content || '' 
                        : editingContent?.contentAr || ''}
                      onChange={(value) => {
                        if (editingContent) {
                          if (currentLanguage === 'en') {
                            setEditingContent({
                              ...editingContent,
                              content: value
                            });
                          } else {
                            setEditingContent({
                              ...editingContent,
                              contentAr: value
                            });
                          }
                        }
                      }}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'align': [] }],
                          ['link', 'image'],
                          ['clean']
                        ]
                      }}
                      formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike',
                        'list', 'bullet',
                        'align',
                        'link', 'image'
                      ]}
                      style={{ height: '300px' }}
                      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    />
                  )}
                </div>
              </div>
              
              {/* Featured image */}
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="border rounded-md p-4">
                  {editingContent?.featuredImage ? (
                    <div className="space-y-4">
                      <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={editingContent.featuredImage} 
                          alt="Featured" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (editingContent) {
                              setEditingContent({
                                ...editingContent,
                                featuredImage: undefined
                              });
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">No image selected</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload an image to enhance your content
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4 py-4">
              {/* SEO Title */}
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={editingContent?.seoTitle || ''}
                  onChange={(e) => {
                    if (editingContent) {
                      setEditingContent({
                        ...editingContent,
                        seoTitle: e.target.value
                      });
                    }
                  }}
                />
                <p className="text-xs text-gray-500">
                  The title that appears in search engine results. If left empty, the regular title will be used.
                </p>
              </div>
              
              {/* SEO Description */}
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={editingContent?.seoDescription || ''}
                  onChange={(e) => {
                    if (editingContent) {
                      setEditingContent({
                        ...editingContent,
                        seoDescription: e.target.value
                      });
                    }
                  }}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  The description that appears in search engine results. Keep it under 160 characters.
                </p>
                <div className="text-xs text-gray-500 flex justify-end">
                  {editingContent?.seoDescription?.length || 0}/160
                </div>
              </div>
              
              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  {editingContent?.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => {
                          if (editingContent) {
                            setEditingContent({
                              ...editingContent,
                              tags: editingContent.tags?.filter(t => t !== tag)
                            });
                          }
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                  <Input
                    id="tags"
                    placeholder="Add a tag and press Enter"
                    className="flex-1 min-w-[150px] border-0 p-0 h-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        if (editingContent) {
                          const newTag = e.currentTarget.value.trim();
                          const currentTags = editingContent.tags || [];
                          if (!currentTags.includes(newTag)) {
                            setEditingContent({
                              ...editingContent,
                              tags: [...currentTags, newTag]
                            });
                          }
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Tags help categorize your content and improve searchability.
                </p>
              </div>
              
              {/* Related Products (only for blog and product description) */}
              {(editingContent?.type === CONTENT_TYPES.BLOG || 
                editingContent?.type === CONTENT_TYPES.PRODUCT_DESCRIPTION) && (
                <div className="space-y-2">
                  <Label htmlFor="relatedProducts">Related Products</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (editingContent && value) {
                        const currentRelated = editingContent.relatedProducts || [];
                        if (!currentRelated.includes(value)) {
                          setEditingContent({
                            ...editingContent,
                            relatedProducts: [...currentRelated, value]
                          });
                        }
                      }
                    }}
                  >
                    <SelectTrigger id="relatedProducts">
                      <SelectValue placeholder="Select products" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingContent?.relatedProducts?.map(productId => {
                      const product = products.find(p => p.id.toString() === productId);
                      return (
                        <Badge key={productId} variant="outline" className="flex items-center gap-1">
                          {product?.name || `Product #${productId}`}
                          <button
                            onClick={() => {
                              if (editingContent) {
                                setEditingContent({
                                  ...editingContent,
                                  relatedProducts: editingContent.relatedProducts?.filter(id => id !== productId)
                                });
                              }
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 py-4">
              {/* Content Type */}
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={editingContent?.type || ''}
                  onValueChange={(value) => {
                    if (editingContent) {
                      setEditingContent({
                        ...editingContent,
                        type: value
                      });
                    }
                  }}
                >
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="contentStatus">Status</Label>
                <Select
                  value={editingContent?.status || ''}
                  onValueChange={(value) => {
                    if (editingContent) {
                      setEditingContent({
                        ...editingContent,
                        status: value
                      });
                    }
                  }}
                >
                  <SelectTrigger id="contentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Select
                  value={editingContent?.author || ''}
                  onValueChange={(value) => {
                    if (editingContent) {
                      setEditingContent({
                        ...editingContent,
                        author: value
                      });
                    }
                  }}
                >
                  <SelectTrigger id="author">
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map(author => (
                      <SelectItem key={author} value={author}>
                        {author}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Add New Author...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Scheduled Date (only if status is scheduled) */}
              {editingContent?.status === CONTENT_STATUS.SCHEDULED && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Scheduled Date</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={editingContent?.scheduledAt?.slice(0, 16) || ''}
                    onChange={(e) => {
                      if (editingContent) {
                        setEditingContent({
                          ...editingContent,
                          scheduledAt: e.target.value
                        });
                      }
                    }}
                  />
                </div>
              )}
              
              {/* Upload Service */}
              <div className="space-y-2">
                <Label htmlFor="uploadService">Image Upload Service</Label>
                <Select
                  value={uploadService}
                  onValueChange={setUploadService}
                >
                  <SelectTrigger id="uploadService">
                    <SelectValue placeholder="Select upload service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLOUDINARY">Cloudinary</SelectItem>
                    <SelectItem value="IMGBB">ImgBB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingContent(false);
                setEditingContent(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (isAddingContent && editingContent) {
                  handleAddContent(editingContent);
                } else if (editingContent) {
                  handleUpdateContent(editingContent);
                }
              }}
              disabled={!editingContent?.title || !editingContent?.slug}
            >
              <Save className="mr-2 h-4 w-4" />
              {isAddingContent ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Content Dialog */}
      <Dialog 
        open={!!viewingContent} 
        onOpenChange={(open) => !open && setViewingContent(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewingContent?.title}
              {viewingContent && getContentStatusBadge(viewingContent.status)}
            </DialogTitle>
            <DialogDescription>
              {viewingContent?.slug} • Last updated: {viewingContent && formatDate(viewingContent.updatedAt)}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="preview" className="mt-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              {viewingContent?.contentAr && (
                <TabsTrigger value="arabic">Arabic</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="preview" className="py-4">
              {viewingContent?.featuredImage && (
                <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden mb-4">
                  <img 
                    src={viewingContent.featuredImage} 
                    alt="Featured" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: viewingContent?.content || '' }}
              />
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Content Type</h3>
                  <p className="text-sm text-gray-500">
                    {viewingContent?.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Author</h3>
                  <p className="text-sm text-gray-500">{viewingContent?.author}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Created</h3>
                  <p className="text-sm text-gray-500">
                    {viewingContent && formatDate(viewingContent.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <p className="text-sm text-gray-500">
                    {viewingContent && formatDate(viewingContent.updatedAt)}
                  </p>
                </div>
                {viewingContent?.publishedAt && (
                  <div>
                    <h3 className="text-sm font-medium">Published</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(viewingContent.publishedAt)}
                    </p>
                  </div>
                )}
                {viewingContent?.scheduledAt && (
                  <div>
                    <h3 className="text-sm font-medium">Scheduled</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(viewingContent.scheduledAt)}
                    </p>
                  </div>
                )}
              </div>
              
              {viewingContent?.tags && viewingContent.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingContent.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {viewingContent?.relatedProducts && viewingContent.relatedProducts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Related Products</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingContent.relatedProducts.map(productId => {
                      const product = products.find(p => p.id.toString() === productId);
                      return (
                        <Badge key={productId} variant="outline">
                          {product?.name || `Product #${productId}`}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {viewingContent?.seoTitle && (
                <div>
                  <h3 className="text-sm font-medium">SEO Title</h3>
                  <p className="text-sm text-gray-500">{viewingContent.seoTitle}</p>
                </div>
              )}
              
              {viewingContent?.seoDescription && (
                <div>
                  <h3 className="text-sm font-medium">Meta Description</h3>
                  <p className="text-sm text-gray-500">{viewingContent.seoDescription}</p>
                </div>
              )}
            </TabsContent>
            
            {viewingContent?.contentAr && (
              <TabsContent value="arabic" className="py-4">
                <div className="text-right" dir="rtl">
                  <h2 className="text-xl font-bold mb-4">{viewingContent.titleAr}</h2>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: viewingContent.contentAr }}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewingContent(null)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setEditingContent(viewingContent);
                setViewingContent(null);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Content</DialogTitle>
            <DialogDescription>
              Refine the content list with filters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="type-filter">Content Type</Label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author-filter">Author</Label>
              <Select 
                value={filters.author} 
                onValueChange={(value) => handleFilterChange('author', value)}
              >
                <SelectTrigger id="author-filter">
                  <SelectValue placeholder="All Authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Authors</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tag-filter">Tag</Label>
              <Select 
                value={filters.tag} 
                onValueChange={(value) => handleFilterChange('tag', value)}
              >
                <SelectTrigger id="tag-filter">
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date-from" className="text-xs">From</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateRange[0]}
                    onChange={(e) => handleFilterChange('dateRange', [
                      e.target.value, 
                      filters.dateRange[1]
                    ])}
                  />
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-xs">To</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateRange[1]}
                    onChange={(e) => handleFilterChange('dateRange', [
                      filters.dateRange[0], 
                      e.target.value
                    ])}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedContentManager;
