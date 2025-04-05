import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  ImagePlus, 
  Save, 
  Trash2, 
  Edit, 
  Eye, 
  Upload, 
  X, 
  Camera, 
  FileImage, 
  Loader2, 
  Globe, 
  History, 
  RotateCcw, 
  Check, 
  Copy,
  ArrowUpDown,
  Filter,
  Search,
  RefreshCw,
  Languages,
  Clock
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { useProductContext } from '@/contexts/ProductContext';

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
    cloudName: 'jam3a-cloud'
  },
  IMGBB: {
    name: 'ImgBB',
    uploadUrl: 'https://api.imgbb.com/1/upload',
    apiKey: '9c7eb7b7a0e5d64b1b4f5c5e5d64b1b4' // Replace with your actual API key
  },
  LOCAL: {
    name: 'Local Storage',
    uploadUrl: '/api/upload', // This would be your backend endpoint
    maxSize: 10 * 1024 * 1024 // 10MB
  }
};

// Default to Cloudinary for production, ImgBB as fallback
const DEFAULT_UPLOAD_SERVICE = UPLOAD_SERVICES.CLOUDINARY;

// Content types and interfaces
interface Banner {
  id: number;
  title: string;
  titleAr?: string;
  image: string;
  active: boolean;
  link?: string;
  startDate?: string;
  endDate?: string;
  lastUpdated?: string;
  version?: number;
}

interface Page {
  id: number;
  title: string;
  titleAr?: string;
  slug: string;
  content: string;
  contentAr?: string;
  lastUpdated: string;
  metaDescription?: string;
  metaDescriptionAr?: string;
  version?: number;
  publishStatus?: 'published' | 'draft' | 'scheduled';
  publishDate?: string;
  author?: string;
  featuredImage?: string;
}

interface FAQ {
  id: number;
  question: string;
  questionAr?: string;
  answer: string;
  answerAr?: string;
  category?: string;
  order?: number;
  lastUpdated?: string;
  version?: number;
}

interface ContentSection {
  id: number;
  name: string;
  nameAr?: string;
  identifier: string;
  content: string;
  contentAr?: string;
  type: 'text' | 'html' | 'image' | 'video' | 'carousel';
  lastUpdated?: string;
  version?: number;
}

interface ContentVersion {
  id: number;
  contentId: number;
  contentType: 'banner' | 'page' | 'faq' | 'section';
  version: number;
  content: any;
  createdAt: string;
  createdBy?: string;
  notes?: string;
}

// Functional Image upload component with actual upload capability
const ImageUploader = ({ onImageUpload, currentImage, label = "Upload Image" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentImage || "");
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const [uploadService, setUploadService] = useState(DEFAULT_UPLOAD_SERVICE);

  useEffect(() => {
    setPreview(currentImage || "");
  }, [currentImage]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files?.length) {
      handleFiles(files[0]);
    }
  };

  const handleFiles = (file) => {
    // Check file type
    if (!file.type.match('image.*')) {
      setError("Please select an image file");
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Check file size
    if (file.size > uploadService.maxSize) {
      setError(`File too large. Maximum size is ${uploadService.maxSize / (1024 * 1024)}MB`);
      toast({
        title: "File too large",
        description: `Maximum file size is ${uploadService.maxSize / (1024 * 1024)}MB`,
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      let formData = new FormData();
      
      // Configure based on selected service
      if (uploadService === UPLOAD_SERVICES.CLOUDINARY) {
        formData.append('file', file);
        formData.append('upload_preset', uploadService.uploadPreset);
        formData.append('cloud_name', uploadService.cloudName);
      } else if (uploadService === UPLOAD_SERVICES.IMGBB) {
        formData.append('image', file);
        formData.append('key', uploadService.apiKey);
      } else {
        // Local storage
        formData.append('file', file);
      }

      const response = await axios.post(uploadService.uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      // Handle different response formats
      let imageUrl = '';
      if (uploadService === UPLOAD_SERVICES.CLOUDINARY) {
        imageUrl = response.data.secure_url;
      } else if (uploadService === UPLOAD_SERVICES.IMGBB) {
        imageUrl = response.data.data.url;
      } else {
        // Local storage
        imageUrl = response.data.url;
      }

      // Call the callback with the uploaded image URL
      onImageUpload(imageUrl);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image. Please try again.");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to another service if primary fails
      if (uploadService === UPLOAD_SERVICES.CLOUDINARY) {
        toast({
          title: "Trying alternative upload service",
          description: "Switching to ImgBB as fallback",
        });
        setUploadService(UPLOAD_SERVICES.IMGBB);
        // Retry with new service
        uploadFile(file);
        return;
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setPreview("");
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-64 rounded-md object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop an image, or{" "}
              <span
                className="cursor-pointer text-primary hover:underline"
                onClick={handleButtonClick}
              >
                browse
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG or GIF up to 10MB
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Version History component
const VersionHistory = ({ versions, onRestore, contentType }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Version History</h3>
      {versions.length === 0 ? (
        <p className="text-muted-foreground">No previous versions available.</p>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>v{version.version}</TableCell>
                  <TableCell>{new Date(version.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{version.createdBy || 'System'}</TableCell>
                  <TableCell>{version.notes || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onRestore(version)}
                      className="h-8 px-2"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

// Enhanced Content Manager Component
const EnhancedContentManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("banners");
  const { language, setLanguage } = useLanguage();
  const { products, setProducts, refreshProducts, syncStatus, isLoading: productsLoading } = useProductContext();
  
  // State for real data
  const [banners, setBanners] = useState<Banner[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for editing
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  
  // State for version history
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<number | null>(null);
  const [currentContentType, setCurrentContentType] = useState<'banner' | 'page' | 'faq' | 'section' | null>(null);
  
  // State for language toggle
  const [editingLanguage, setEditingLanguage] = useState<'en' | 'ar'>('en');
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    banners: { active: null },
    pages: { publishStatus: '' },
    faqs: { category: '' },
    sections: { type: '' }
  });
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Real API calls to fetch data from backend
        const fetchBanners = async () => {
          try {
            const response = await axios.get('/api/banners');
            if (response.data && Array.isArray(response.data)) {
              setBanners(response.data);
            } else {
              console.warn("Banners data is not an array, using fallback");
              setBanners([]);
            }
            return true;
          } catch (error) {
            console.error("Error fetching banners:", error);
            return false;
          }
        };

        const fetchPages = async () => {
          try {
            const response = await axios.get('/api/pages');
            if (response.data && Array.isArray(response.data)) {
              setPages(response.data);
            } else {
              console.warn("Pages data is not an array, using fallback");
              setPages([]);
            }
            return true;
          } catch (error) {
            console.error("Error fetching pages:", error);
            return false;
          }
        };

        const fetchFAQs = async () => {
          try {
            const response = await axios.get('/api/faqs');
            if (response.data && Array.isArray(response.data)) {
              setFaqs(response.data);
            } else {
              console.warn("FAQs data is not an array, using fallback");
              setFaqs([]);
            }
            return true;
          } catch (error) {
            console.error("Error fetching FAQs:", error);
            return false;
          }
        };

        const fetchSections = async () => {
          try {
            const response = await axios.get('/api/sections');
            if (response.data && Array.isArray(response.data)) {
              setSections(response.data);
            } else {
              console.warn("Sections data is not an array, using fallback");
              setSections([]);
            }
            return true;
          } catch (error) {
            console.error("Error fetching sections:", error);
            return false;
          }
        };

        // Execute all fetch operations in parallel
        const results = await Promise.allSettled([
          fetchBanners(),
          fetchPages(),
          fetchFAQs(),
          fetchSections()
        ]);

        // Check if any of the fetch operations failed
        const anyFailed = results.some(result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value));
        
        if (anyFailed) {
          // If API calls fail, fall back to local data as a backup
          console.warn("Some API calls failed, using fallback data");
          
          // Fallback data (only used if API calls fail)
          if (!banners.length) {
            const fallbackBanners: Banner[] = [
              { 
                id: 1, 
                title: 'Summer Collection 2025', 
                titleAr: 'مجموعة صيف 2025',
                image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80', 
                active: true,
                lastUpdated: '2025-04-01',
                version: 1
              },
              { 
                id: 2, 
                title: 'Eid Special Offers', 
                titleAr: 'عروض العيد الخاصة',
                image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80', 
                active: false,
                lastUpdated: '2025-03-15',
                version: 2
              },
              { 
                id: 3, 
                title: 'New Arrivals - Spring 2025', 
                titleAr: 'وصل حديثًا - ربيع 2025',
                image: 'https://images.unsplash.com/photo-1615380547903-c456276b7702?auto=format&fit=crop&w=1600&q=80', 
                active: false,
                lastUpdated: '2025-02-20',
                version: 1
              },
            ];
            setBanners(fallbackBanners);
          }
          
          if (!pages.length) {
            const fallbackPages: Page[] = [
              { 
                id: 1, 
                title: 'About Jam3a', 
                titleAr: 'عن جمعة',
                slug: 'about', 
                content: '<h1>About Jam3a</h1><p>Jam3a is a social shopping platform where people team up to get better prices on products through group buying.</p>',
                contentAr: '<h1>عن جمعة</h1><p>جمعة هي منصة تسوق اجتماعية حيث يتعاون الناس للحصول على أسعار أفضل للمنتجات من خلال الشراء الجماعي.</p>',
                lastUpdated: '2025-04-01',
                publishStatus: 'published',
                version: 3
              },
              { 
                id: 2, 
                title: 'Frequently Asked Questions', 
                titleAr: 'الأسئلة المتكررة',
                slug: 'faq', 
                content: '<h1>Frequently Asked Questions</h1><p>Find answers to common questions about Jam3a.</p>',
                contentAr: '<h1>الأسئلة المتكررة</h1><p>اعثر على إجابات للأسئلة الشائعة حول جمعة.</p>',
                lastUpdated: '2025-04-02',
                publishStatus: 'published',
                version: 2
              },
              { 
                id: 3, 
                title: 'Terms & Conditions', 
                titleAr: 'الشروط والأحكام',
                slug: 'terms', 
                content: '<h1>Terms & Conditions</h1><p>Please read these terms and conditions carefully before using our service.</p>',
                contentAr: '<h1>الشروط والأحكام</h1><p>يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدمتنا.</p>',
                lastUpdated: '2025-04-03',
                publishStatus: 'published',
                version: 4
              },
              { 
                id: 4, 
                title: 'Privacy Policy', 
                titleAr: 'سياسة الخصوصية',
                slug: 'privacy', 
                content: '<h1>Privacy Policy</h1><p>Your privacy is important to us. This policy outlines how we collect and use your data.</p>',
                contentAr: '<h1>سياسة الخصوصية</h1><p>خصوصيتك مهمة بالنسبة لنا. توضح هذه السياسة كيفية جمع واستخدام بياناتك.</p>',
                lastUpdated: '2025-04-03',
                publishStatus: 'published',
                version: 2
              },
              { 
                id: 5, 
                title: 'Shipping Information', 
                titleAr: 'معلومات الشحن',
                slug: 'shipping', 
                content: '<h1>Shipping Information</h1><p>Learn about our shipping policies, delivery times, and tracking information.</p>',
                contentAr: '<h1>معلومات الشحن</h1><p>تعرف على سياسات الشحن لدينا وأوقات التسليم ومعلومات التتبع.</p>',
                lastUpdated: '2025-04-04',
                publishStatus: 'draft',
                version: 1
              },
            ];
            setPages(fallbackPages);
          }
          
          if (!faqs.length) {
            const fallbackFAQs: FAQ[] = [
              { 
                id: 1, 
                question: 'What is Jam3a?', 
                questionAr: 'ما هي جمعة؟',
                answer: 'Jam3a is a social shopping platform where people team up to get better prices on products through group buying.',
                answerAr: 'جمعة هي منصة تسوق اجتماعية حيث يتعاون الناس للحصول على أسعار أفضل للمنتجات من خلال الشراء الجماعي.',
                category: 'General',
                order: 1,
                lastUpdated: '2025-03-10',
                version: 1
              },
              { 
                id: 2, 
                question: 'How does a Jam3a deal work?', 
                questionAr: 'كيف تعمل صفقة جمعة؟',
                answer: 'A Jam3a starts when someone selects a product and shares it with others. Once enough people join the deal within a set time, everyone gets the discounted price.',
                answerAr: 'تبدأ الجمعة عندما يختار شخص ما منتجًا ويشاركه مع الآخرين. بمجرد انضمام عدد كافٍ من الأشخاص إلى الصفقة خلال وقت محدد، يحصل الجميع على السعر المخفض.',
                category: 'Deals',
                order: 2,
                lastUpdated: '2025-03-15',
                version: 2
              },
              { 
                id: 3, 
                question: 'Can I start my own Jam3a?', 
                questionAr: 'هل يمكنني بدء جمعة خاصة بي؟',
                answer: 'Yes! You can start your own Jam3a by picking a product and inviting others to join.',
                answerAr: 'نعم! يمكنك بدء جمعة خاصة بك عن طريق اختيار منتج ودعوة الآخرين للانضمام.',
                category: 'Deals',
                order: 3,
                lastUpdated: '2025-03-20',
                version: 1
              },
              { 
                id: 4, 
                question: 'How are payments processed?', 
                questionAr: 'كيف تتم معالجة المدفوعات؟',
                answer: 'We use secure payment gateways including credit/debit cards, Apple Pay, and bank transfers through our partner Moyasar.',
                answerAr: 'نستخدم بوابات دفع آمنة بما في ذلك بطاقات الائتمان/الخصم، و Apple Pay، والتحويلات المصرفية من خلال شريكنا ميسر.',
                category: 'Payments',
                order: 4,
                lastUpdated: '2025-03-25',
                version: 3
              },
              { 
                id: 5, 
                question: 'What happens if not enough people join my Jam3a?', 
                questionAr: 'ماذا يحدث إذا لم ينضم عدد كافٍ من الأشخاص إلى جمعتي؟',
                answer: 'If the minimum group size isn\'t reached within the timeframe, no charges will be made and the Jam3a will be canceled.',
                answerAr: 'إذا لم يتم الوصول إلى الحد الأدنى لحجم المجموعة خلال الإطار الزمني، فلن يتم إجراء أي رسوم وسيتم إلغاء الجمعة.',
                category: 'Deals',
                order: 5,
                lastUpdated: '2025-04-01',
                version: 2
              },
            ];
            setFaqs(fallbackFAQs);
          }
          
          if (!sections.length) {
            const fallbackSections: ContentSection[] = [
              {
                id: 1,
                name: 'Hero Section',
                nameAr: 'قسم الصفحة الرئيسية',
                identifier: 'home_hero',
                content: '<h1>Shop Together, Save Together</h1><p>Join Jam3a and unlock exclusive group discounts on premium products.</p>',
                contentAr: '<h1>تسوقوا معًا، وفروا معًا</h1><p>انضم إلى جمعة واحصل على خصومات جماعية حصرية على المنتجات المميزة.</p>',
                type: 'html',
                lastUpdated: '2025-04-01',
                version: 2
              },
              {
                id: 2,
                name: 'How It Works Section',
                nameAr: 'قسم كيف تعمل',
                identifier: 'how_it_works',
                content: JSON.stringify({
                  title: 'How Jam3a Works',
                  subtitle: 'Simple steps to save money through the power of group buying',
                  steps: [
                    {
                      title: 'Start or Join a Jam3a',
                      description: 'Create your own group or join an existing one for the product you want.'
                    },
                    {
                      title: 'Invite Friends',
                      description: 'Share your Jam3a link with friends and family via WhatsApp, Snapchat, or social media.'
                    },
                    {
                      title: 'Fill the Group',
                      description: 'Complete your group within the time limit to unlock the group discount.'
                    },
                    {
                      title: 'Everyone Saves',
                      description: 'Once the group is complete, everyone pays the discounted price and receives their order.'
                    }
                  ]
                }),
                contentAr: JSON.stringify({
                  title: 'كيف تعمل جمعة',
                  subtitle: 'خطوات بسيطة لتوفير المال من خلال قوة الشراء الجماعي',
                  steps: [
                    {
                      title: 'ابدأ أو انضم إلى جمعة',
                      description: 'أنشئ مجموعتك الخاصة أو انضم إلى مجموعة موجودة للمنتج الذي تريده.'
                    },
                    {
                      title: 'ادعُ أصدقاءك',
                      description: 'شارك رابط جمعتك مع الأصدقاء والعائلة عبر واتساب أو سناب شات أو وسائل التواصل الاجتماعي.'
                    },
                    {
                      title: 'أكمل المجموعة',
                      description: 'أكمل مجموعتك ضمن الوقت المحدد للحصول على الخصم الجماعي.'
                    },
                    {
                      title: 'الجميع يوفر',
                      description: 'بمجرد اكتمال المجموعة، يدفع الجميع السعر المخفض ويستلمون طلباتهم.'
                    }
                  ]
                }),
                type: 'html',
                lastUpdated: '2025-03-25',
                version: 3
              },
              {
                id: 3,
                name: 'Why Choose Us',
                nameAr: 'لماذا تختارنا',
                identifier: 'why_choose_us',
                content: JSON.stringify({
                  title: 'Why Choose Jam3a',
                  subtitle: 'The smart way to shop premium products',
                  features: [
                    {
                      title: 'Save Up to 30%',
                      description: 'Unlock exclusive discounts through the power of group buying.'
                    },
                    {
                      title: 'Authentic Products',
                      description: 'All products are 100% authentic with manufacturer warranty.'
                    },
                    {
                      title: 'Fast Delivery',
                      description: 'Quick and reliable delivery across Saudi Arabia.'
                    },
                    {
                      title: 'Secure Payments',
                      description: 'Multiple secure payment options for your convenience.'
                    }
                  ]
                }),
                contentAr: JSON.stringify({
                  title: 'لماذا تختار جمعة',
                  subtitle: 'الطريقة الذكية للتسوق للمنتجات المميزة',
                  features: [
                    {
                      title: 'وفر حتى 30%',
                      description: 'احصل على خصومات حصرية من خلال قوة الشراء الجماعي.'
                    },
                    {
                      title: 'منتجات أصلية',
                      description: 'جميع المنتجات أصلية 100% مع ضمان المصنع.'
                    },
                    {
                      title: 'توصيل سريع',
                      description: 'توصيل سريع وموثوق في جميع أنحاء المملكة العربية السعودية.'
                    },
                    {
                      title: 'مدفوعات آمنة',
                      description: 'خيارات دفع آمنة متعددة لراحتك.'
                    }
                  ]
                }),
                type: 'html',
                lastUpdated: '2025-03-20',
                version: 2
              },
              {
                id: 4,
                name: 'Footer Content',
                nameAr: 'محتوى التذييل',
                identifier: 'footer',
                content: JSON.stringify({
                  companyName: 'Jam3a Hub Collective',
                  tagline: 'Shop Together, Save Together',
                  address: 'Riyadh, Saudi Arabia',
                  email: 'support@jam3a.com',
                  phone: '+966 50 123 4567',
                  socialLinks: {
                    twitter: 'https://twitter.com/jam3a',
                    instagram: 'https://instagram.com/jam3a',
                    facebook: 'https://facebook.com/jam3a',
                    linkedin: 'https://linkedin.com/company/jam3a'
                  },
                  copyright: '© 2025 Jam3a. All rights reserved.'
                }),
                contentAr: JSON.stringify({
                  companyName: 'جمعة هب كوليكتيف',
                  tagline: 'تسوقوا معًا، وفروا معًا',
                  address: 'الرياض، المملكة العربية السعودية',
                  email: 'support@jam3a.com',
                  phone: '+966 50 123 4567',
                  socialLinks: {
                    twitter: 'https://twitter.com/jam3a',
                    instagram: 'https://instagram.com/jam3a',
                    facebook: 'https://facebook.com/jam3a',
                    linkedin: 'https://linkedin.com/company/jam3a'
                  },
                  copyright: '© 2025 جمعة. جميع الحقوق محفوظة.'
                }),
                type: 'html',
                lastUpdated: '2025-04-02',
                version: 1
              },
            ];
            setSections(fallbackSections);
          }
        }
        
        // Fetch version history
        const fetchVersionHistory = async () => {
          try {
            // In a real implementation, this would be an API call
            // const response = await axios.get('/api/versions');
            // setVersions(response.data);
            
            // Fallback version history data
            const fallbackVersions: ContentVersion[] = [
              {
                id: 1,
                contentId: 1,
                contentType: 'page',
                version: 1,
                content: {
                  title: 'About Jam3a',
                  titleAr: 'عن جمعة',
                  slug: 'about',
                  content: '<h1>About Jam3a</h1><p>Jam3a is a platform for group buying.</p>',
                  contentAr: '<h1>عن جمعة</h1><p>جمعة هي منصة للشراء الجماعي.</p>',
                  lastUpdated: '2025-03-01',
                  publishStatus: 'published'
                },
                createdAt: '2025-03-01T12:00:00Z',
                createdBy: 'admin'
              },
              {
                id: 2,
                contentId: 1,
                contentType: 'page',
                version: 2,
                content: {
                  title: 'About Jam3a',
                  titleAr: 'عن جمعة',
                  slug: 'about',
                  content: '<h1>About Jam3a</h1><p>Jam3a is a social shopping platform for group buying.</p>',
                  contentAr: '<h1>عن جمعة</h1><p>جمعة هي منصة تسوق اجتماعية للشراء الجماعي.</p>',
                  lastUpdated: '2025-03-15',
                  publishStatus: 'published'
                },
                createdAt: '2025-03-15T14:30:00Z',
                createdBy: 'admin',
                notes: 'Updated description'
              },
              {
                id: 3,
                contentId: 1,
                contentType: 'page',
                version: 3,
                content: {
                  title: 'About Jam3a',
                  titleAr: 'عن جمعة',
                  slug: 'about',
                  content: '<h1>About Jam3a</h1><p>Jam3a is a social shopping platform where people team up to get better prices on products through group buying.</p>',
                  contentAr: '<h1>عن جمعة</h1><p>جمعة هي منصة تسوق اجتماعية حيث يتعاون الناس للحصول على أسعار أفضل للمنتجات من خلال الشراء الجماعي.</p>',
                  lastUpdated: '2025-04-01',
                  publishStatus: 'published'
                },
                createdAt: '2025-04-01T09:45:00Z',
                createdBy: 'admin',
                notes: 'Expanded description with more details'
              }
            ];
            setVersions(fallbackVersions);
            return true;
          } catch (error) {
            console.error("Error fetching version history:", error);
            return false;
          }
        };
        
        await fetchVersionHistory();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Filter functions
  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (banner.titleAr && banner.titleAr.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActive = filters.banners.active === null || banner.active === filters.banners.active;
    return matchesSearch && matchesActive;
  });

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (page.titleAr && page.titleAr.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.pages.publishStatus || page.publishStatus === filters.pages.publishStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (faq.questionAr && faq.questionAr.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (faq.answerAr && faq.answerAr.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filters.faqs.category || faq.category === filters.faqs.category;
    return matchesSearch && matchesCategory;
  });

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (section.nameAr && section.nameAr.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         section.identifier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.sections.type || section.type === filters.sections.type;
    return matchesSearch && matchesType;
  });

  // Banner management functions
  const handleAddBanner = () => {
    setEditingBanner({
      id: Date.now(), // Temporary ID
      title: '',
      titleAr: '',
      image: '',
      active: false,
      version: 1,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner({...banner});
    setEditingLanguage('en');
  };

  const handleSaveBanner = () => {
    if (!editingBanner) return;
    
    if (!editingBanner.title || !editingBanner.image) {
      toast({
        title: "Validation Error",
        description: "Please provide a title and image for the banner",
        variant: "destructive"
      });
      return;
    }
    
    // Check if this is a new banner or editing existing one
    const isNewBanner = !banners.some(b => b.id === editingBanner.id);
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Update version and last updated date
    const updatedBanner = {
      ...editingBanner,
      version: isNewBanner ? 1 : (editingBanner.version || 0) + 1,
      lastUpdated: currentDate
    };
    
    if (isNewBanner) {
      setBanners([...banners, updatedBanner]);
    } else {
      setBanners(banners.map(b => b.id === updatedBanner.id ? updatedBanner : b));
      
      // Add to version history
      const newVersion: ContentVersion = {
        id: Date.now(),
        contentId: updatedBanner.id,
        contentType: 'banner',
        version: updatedBanner.version || 1,
        content: { ...updatedBanner },
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
        notes: 'Updated banner'
      };
      
      setVersions([newVersion, ...versions]);
    }
    
    setEditingBanner(null);
    
    toast({
      title: isNewBanner ? "Banner Added" : "Banner Updated",
      description: `Banner "${updatedBanner.title}" has been ${isNewBanner ? 'added' : 'updated'} successfully.`,
    });
  };

  const handleDeleteBanner = (id: number) => {
    const bannerToDelete = banners.find(b => b.id === id);
    if (!bannerToDelete) return;
    
    setBanners(banners.filter(b => b.id !== id));
    
    toast({
      title: "Banner Deleted",
      description: `Banner "${bannerToDelete.title}" has been deleted.`,
    });
  };

  // Page management functions
  const handleAddPage = () => {
    setEditingPage({
      id: Date.now(), // Temporary ID
      title: '',
      titleAr: '',
      slug: '',
      content: '',
      contentAr: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      publishStatus: 'draft',
      version: 1
    });
  };

  const handleEditPage = (page: Page) => {
    setEditingPage({...page});
    setEditingLanguage('en');
  };

  const handleSavePage = () => {
    if (!editingPage) return;
    
    if (!editingPage.title || !editingPage.slug || !editingPage.content) {
      toast({
        title: "Validation Error",
        description: "Please provide a title, slug, and content for the page",
        variant: "destructive"
      });
      return;
    }
    
    // Check if this is a new page or editing existing one
    const isNewPage = !pages.some(p => p.id === editingPage.id);
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Update version and last updated date
    const updatedPage = {
      ...editingPage,
      version: isNewPage ? 1 : (editingPage.version || 0) + 1,
      lastUpdated: currentDate
    };
    
    if (isNewPage) {
      setPages([...pages, updatedPage]);
    } else {
      setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p));
      
      // Add to version history
      const newVersion: ContentVersion = {
        id: Date.now(),
        contentId: updatedPage.id,
        contentType: 'page',
        version: updatedPage.version || 1,
        content: { ...updatedPage },
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
        notes: 'Updated page content'
      };
      
      setVersions([newVersion, ...versions]);
    }
    
    setEditingPage(null);
    
    toast({
      title: isNewPage ? "Page Added" : "Page Updated",
      description: `Page "${updatedPage.title}" has been ${isNewPage ? 'added' : 'updated'} successfully.`,
    });
  };

  const handleDeletePage = (id: number) => {
    const pageToDelete = pages.find(p => p.id === id);
    if (!pageToDelete) return;
    
    setPages(pages.filter(p => p.id !== id));
    
    toast({
      title: "Page Deleted",
      description: `Page "${pageToDelete.title}" has been deleted.`,
    });
  };

  // FAQ management functions
  const handleAddFAQ = () => {
    setEditingFAQ({
      id: Date.now(), // Temporary ID
      question: '',
      questionAr: '',
      answer: '',
      answerAr: '',
      category: 'General',
      order: faqs.length + 1,
      lastUpdated: new Date().toISOString().split('T')[0],
      version: 1
    });
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ({...faq});
    setEditingLanguage('en');
  };

  const handleSaveFAQ = () => {
    if (!editingFAQ) return;
    
    if (!editingFAQ.question || !editingFAQ.answer) {
      toast({
        title: "Validation Error",
        description: "Please provide a question and answer for the FAQ",
        variant: "destructive"
      });
      return;
    }
    
    // Check if this is a new FAQ or editing existing one
    const isNewFAQ = !faqs.some(f => f.id === editingFAQ.id);
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Update version and last updated date
    const updatedFAQ = {
      ...editingFAQ,
      version: isNewFAQ ? 1 : (editingFAQ.version || 0) + 1,
      lastUpdated: currentDate
    };
    
    if (isNewFAQ) {
      setFaqs([...faqs, updatedFAQ]);
    } else {
      setFaqs(faqs.map(f => f.id === updatedFAQ.id ? updatedFAQ : f));
      
      // Add to version history
      const newVersion: ContentVersion = {
        id: Date.now(),
        contentId: updatedFAQ.id,
        contentType: 'faq',
        version: updatedFAQ.version || 1,
        content: { ...updatedFAQ },
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
        notes: 'Updated FAQ'
      };
      
      setVersions([newVersion, ...versions]);
    }
    
    setEditingFAQ(null);
    
    toast({
      title: isNewFAQ ? "FAQ Added" : "FAQ Updated",
      description: `FAQ "${updatedFAQ.question}" has been ${isNewFAQ ? 'added' : 'updated'} successfully.`,
    });
  };

  const handleDeleteFAQ = (id: number) => {
    const faqToDelete = faqs.find(f => f.id === id);
    if (!faqToDelete) return;
    
    setFaqs(faqs.filter(f => f.id !== id));
    
    toast({
      title: "FAQ Deleted",
      description: `FAQ "${faqToDelete.question}" has been deleted.`,
    });
  };

  // Section management functions
  const handleAddSection = () => {
    setEditingSection({
      id: Date.now(), // Temporary ID
      name: '',
      nameAr: '',
      identifier: '',
      content: '',
      contentAr: '',
      type: 'html',
      lastUpdated: new Date().toISOString().split('T')[0],
      version: 1
    });
  };

  const handleEditSection = (section: ContentSection) => {
    setEditingSection({...section});
    setEditingLanguage('en');
  };

  const handleSaveSection = () => {
    if (!editingSection) return;
    
    if (!editingSection.name || !editingSection.identifier || !editingSection.content) {
      toast({
        title: "Validation Error",
        description: "Please provide a name, identifier, and content for the section",
        variant: "destructive"
      });
      return;
    }
    
    // Check if this is a new section or editing existing one
    const isNewSection = !sections.some(s => s.id === editingSection.id);
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Update version and last updated date
    const updatedSection = {
      ...editingSection,
      version: isNewSection ? 1 : (editingSection.version || 0) + 1,
      lastUpdated: currentDate
    };
    
    if (isNewSection) {
      setSections([...sections, updatedSection]);
    } else {
      setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
      
      // Add to version history
      const newVersion: ContentVersion = {
        id: Date.now(),
        contentId: updatedSection.id,
        contentType: 'section',
        version: updatedSection.version || 1,
        content: { ...updatedSection },
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
        notes: 'Updated section content'
      };
      
      setVersions([newVersion, ...versions]);
    }
    
    setEditingSection(null);
    
    toast({
      title: isNewSection ? "Section Added" : "Section Updated",
      description: `Section "${updatedSection.name}" has been ${isNewSection ? 'added' : 'updated'} successfully.`,
    });
  };

  const handleDeleteSection = (id: number) => {
    const sectionToDelete = sections.find(s => s.id === id);
    if (!sectionToDelete) return;
    
    setSections(sections.filter(s => s.id !== id));
    
    toast({
      title: "Section Deleted",
      description: `Section "${sectionToDelete.name}" has been deleted.`,
    });
  };

  // Version history functions
  const handleViewVersionHistory = (id: number, type: 'banner' | 'page' | 'faq' | 'section') => {
    setCurrentContentId(id);
    setCurrentContentType(type);
    setShowVersionHistory(true);
  };

  const handleRestoreVersion = (version: ContentVersion) => {
    if (!version.contentType || !version.content) return;
    
    switch (version.contentType) {
      case 'banner':
        setBanners(banners.map(b => b.id === version.contentId ? {
          ...version.content as Banner,
          lastUpdated: new Date().toISOString().split('T')[0],
          version: (version.content as Banner).version || 1
        } : b));
        break;
      case 'page':
        setPages(pages.map(p => p.id === version.contentId ? {
          ...version.content as Page,
          lastUpdated: new Date().toISOString().split('T')[0],
          version: (version.content as Page).version || 1
        } : p));
        break;
      case 'faq':
        setFaqs(faqs.map(f => f.id === version.contentId ? {
          ...version.content as FAQ,
          lastUpdated: new Date().toISOString().split('T')[0],
          version: (version.content as FAQ).version || 1
        } : f));
        break;
      case 'section':
        setSections(sections.map(s => s.id === version.contentId ? {
          ...version.content as ContentSection,
          lastUpdated: new Date().toISOString().split('T')[0],
          version: (version.content as ContentSection).version || 1
        } : s));
        break;
    }
    
    setShowVersionHistory(false);
    
    toast({
      title: "Version Restored",
      description: `Content has been restored to version ${version.version}.`,
    });
  };

  // Get filtered versions for current content
  const filteredVersions = versions.filter(v => 
    v.contentId === currentContentId && v.contentType === currentContentType
  ).sort((a, b) => b.version - a.version);

  // Get unique FAQ categories
  const faqCategories = Array.from(new Set(faqs.map(faq => faq.category))).filter(Boolean);

  // Quill editor modules and formats
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              // Simulate refreshing content from server
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                toast({
                  title: "Content Refreshed",
                  description: "Content has been refreshed from the server.",
                });
              }, 1000);
            }} 
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="banners" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="sections">Content Sections</TabsTrigger>
        </TabsList>
        
        {/* Banners Tab */}
        <TabsContent value="banners">
          {editingBanner ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingBanner.id ? `Edit Banner: ${editingBanner.title}` : 'Add New Banner'}</CardTitle>
                <CardDescription>
                  Manage banner content and settings
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Button 
                    variant={editingLanguage === 'en' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setEditingLanguage('en')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    English
                  </Button>
                  <Button 
                    variant={editingLanguage === 'ar' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setEditingLanguage('ar')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    العربية
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingLanguage === 'en' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editingBanner.title}
                          onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})}
                          placeholder="Enter banner title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="link">Link (Optional)</Label>
                        <Input
                          id="link"
                          value={editingBanner.link || ''}
                          onChange={(e) => setEditingBanner({...editingBanner, link: e.target.value})}
                          placeholder="Enter banner link URL"
                        />
                      </div>
                      
                      <ImageUploader
                        currentImage={editingBanner.image}
                        onImageUpload={(url) => setEditingBanner({...editingBanner, image: url})}
                        label="Banner Image"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="active"
                          checked={editingBanner.active}
                          onCheckedChange={(checked) => setEditingBanner({...editingBanner, active: !!checked})}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                      
                      {editingBanner.id && editingBanner.version && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Last updated: {editingBanner.lastUpdated}</span>
                          <span>•</span>
                          <span>Version: {editingBanner.version}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titleAr">Title (Arabic)</Label>
                        <Input
                          id="titleAr"
                          value={editingBanner.titleAr || ''}
                          onChange={(e) => setEditingBanner({...editingBanner, titleAr: e.target.value})}
                          placeholder="أدخل عنوان البانر"
                          className="text-right"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingBanner(null)}>Cancel</Button>
                <Button onClick={handleSaveBanner}>Save Banner</Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Select
                    value={filters.banners.active === null ? '' : filters.banners.active.toString()}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      banners: {
                        ...filters.banners,
                        active: value === '' ? null : value === 'true'
                      }
                    })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Banners</SelectItem>
                      <SelectItem value="true">Active Only</SelectItem>
                      <SelectItem value="false">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddBanner}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Banner
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredBanners.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No banners found. Add a new banner to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBanners.map((banner) => (
                    <Card key={banner.id} className={`overflow-hidden ${!banner.active ? 'opacity-70' : ''}`}>
                      <div className="aspect-video relative overflow-hidden">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ImagePlus className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant={banner.active ? 'default' : 'secondary'}>
                            {banner.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{banner.title}</h3>
                        {banner.titleAr && (
                          <p className="text-muted-foreground text-sm mb-2 text-right" dir="rtl">{banner.titleAr}</p>
                        )}
                        {banner.link && (
                          <p className="text-sm text-muted-foreground truncate mb-2">
                            Link: {banner.link}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Updated: {banner.lastUpdated}</span>
                          {banner.version && (
                            <>
                              <span className="mx-1">•</span>
                              <span>v{banner.version}</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewVersionHistory(banner.id, 'banner')}
                        >
                          <History className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditBanner(banner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteBanner(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        {/* Pages Tab */}
        <TabsContent value="pages">
          {editingPage ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingPage.id ? `Edit Page: ${editingPage.title}` : 'Add New Page'}</CardTitle>
                <CardDescription>
                  Manage page content and settings
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Button 
                    variant={editingLanguage === 'en' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setEditingLanguage('en')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    English
                  </Button>
                  <Button 
                    variant={editingLanguage === 'ar' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setEditingLanguage('ar')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    العربية
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingLanguage === 'en' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editingPage.title}
                          onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                          placeholder="Enter page title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={editingPage.slug}
                          onChange={(e) => setEditingPage({...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                          placeholder="enter-page-slug"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description (Optional)</Label>
                      <Textarea
                        id="metaDescription"
                        value={editingPage.metaDescription || ''}
                        onChange={(e) => setEditingPage({...editingPage, metaDescription: e.target.value})}
                        placeholder="Enter meta description for SEO"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <div className="border rounded-md">
                        <ReactQuill
                          theme="snow"
                          value={editingPage.content}
                          onChange={(content) => setEditingPage({...editingPage, content})}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="Enter page content..."
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="publishStatus">Publish Status</Label>
                        <Select
                          value={editingPage.publishStatus || 'draft'}
                          onValueChange={(value) => setEditingPage({
                            ...editingPage, 
                            publishStatus: value as 'published' | 'draft' | 'scheduled'
                          })}
                        >
                          <SelectTrigger id="publishStatus">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {editingPage.publishStatus === 'scheduled' && (
                        <div className="space-y-2">
                          <Label htmlFor="publishDate">Publish Date</Label>
                          <Input
                            id="publishDate"
                            type="date"
                            value={editingPage.publishDate || ''}
                            onChange={(e) => setEditingPage({...editingPage, publishDate: e.target.value})}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="featuredImage">Featured Image (Optional)</Label>
                      <ImageUploader
                        currentImage={editingPage.featuredImage || ''}
                        onImageUpload={(url) => setEditingPage({...editingPage, featuredImage: url})}
                      />
                    </div>
                    
                    {editingPage.id && editingPage.version && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {editingPage.lastUpdated}</span>
                        <span>•</span>
                        <span>Version: {editingPage.version}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleAr">Title (Arabic)</Label>
                      <Input
                        id="titleAr"
                        value={editingPage.titleAr || ''}
                        onChange={(e) => setEditingPage({...editingPage, titleAr: e.target.value})}
                        placeholder="أدخل عنوان الصفحة"
                        className="text-right"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaDescriptionAr">Meta Description (Arabic, Optional)</Label>
                      <Textarea
                        id="metaDescriptionAr"
                        value={editingPage.metaDescriptionAr || ''}
                        onChange={(e) => setEditingPage({...editingPage, metaDescriptionAr: e.target.value})}
                        placeholder="أدخل وصف الميتا للـ SEO"
                        rows={2}
                        className="text-right"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contentAr">Content (Arabic)</Label>
                      <div className="border rounded-md" dir="rtl">
                        <ReactQuill
                          theme="snow"
                          value={editingPage.contentAr || ''}
                          onChange={(contentAr) => setEditingPage({...editingPage, contentAr})}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="أدخل محتوى الصفحة..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingPage(null)}>Cancel</Button>
                <Button onClick={handleSavePage}>Save Page</Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Select
                    value={filters.pages.publishStatus}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      pages: {
                        ...filters.pages,
                        publishStatus: value
                      }
                    })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Pages</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddPage}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Page
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pages found. Add a new page to get started.
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">
                            <div>
                              {page.title}
                              {page.titleAr && (
                                <div className="text-xs text-muted-foreground mt-1 text-right" dir="rtl">
                                  {page.titleAr}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{page.slug}</TableCell>
                          <TableCell>
                            <Badge variant={
                              page.publishStatus === 'published' ? 'default' :
                              page.publishStatus === 'scheduled' ? 'secondary' : 'outline'
                            }>
                              {page.publishStatus || 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell>{page.lastUpdated}</TableCell>
                          <TableCell>v{page.version || 1}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewVersionHistory(page.id, 'page')}
                              >
                                <History className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPage(page)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePage(page.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        {/* FAQs Tab */}
        <TabsContent value="faqs">
          {editingFAQ ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingFAQ.id ? `Edit FAQ: ${editingFAQ.question}` : 'Add New FAQ'}</CardTitle>
                <CardDescription>
                  Manage frequently asked questions
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Button 
                    variant={editingLanguage === 'en' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setEditingLanguage('en')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    English
                  </Button>
                  <Button 
                    variant={editingLanguage === 'ar' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setEditingLanguage('ar')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    العربية
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingLanguage === 'en' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Input
                        id="question"
                        value={editingFAQ.question}
                        onChange={(e) => setEditingFAQ({...editingFAQ, question: e.target.value})}
                        placeholder="Enter question"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea
                        id="answer"
                        value={editingFAQ.answer}
                        onChange={(e) => setEditingFAQ({...editingFAQ, answer: e.target.value})}
                        placeholder="Enter answer"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={editingFAQ.category || 'General'}
                          onValueChange={(value) => setEditingFAQ({...editingFAQ, category: value})}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Deals">Deals</SelectItem>
                            <SelectItem value="Payments">Payments</SelectItem>
                            <SelectItem value="Shipping">Shipping</SelectItem>
                            <SelectItem value="Returns">Returns</SelectItem>
                            <SelectItem value="Account">Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="order">Display Order</Label>
                        <Input
                          id="order"
                          type="number"
                          value={editingFAQ.order || 0}
                          onChange={(e) => setEditingFAQ({...editingFAQ, order: parseInt(e.target.value)})}
                          min={0}
                        />
                      </div>
                    </div>
                    
                    {editingFAQ.id && editingFAQ.version && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {editingFAQ.lastUpdated}</span>
                        <span>•</span>
                        <span>Version: {editingFAQ.version}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="questionAr">Question (Arabic)</Label>
                      <Input
                        id="questionAr"
                        value={editingFAQ.questionAr || ''}
                        onChange={(e) => setEditingFAQ({...editingFAQ, questionAr: e.target.value})}
                        placeholder="أدخل السؤال"
                        className="text-right"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="answerAr">Answer (Arabic)</Label>
                      <Textarea
                        id="answerAr"
                        value={editingFAQ.answerAr || ''}
                        onChange={(e) => setEditingFAQ({...editingFAQ, answerAr: e.target.value})}
                        placeholder="أدخل الإجابة"
                        rows={4}
                        className="text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingFAQ(null)}>Cancel</Button>
                <Button onClick={handleSaveFAQ}>Save FAQ</Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Select
                    value={filters.faqs.category}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      faqs: {
                        ...filters.faqs,
                        category: value
                      }
                    })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {faqCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddFAQ}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredFAQs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No FAQs found. Add a new FAQ to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{faq.question}</CardTitle>
                            {faq.questionAr && (
                              <div className="text-sm text-muted-foreground text-right" dir="rtl">
                                {faq.questionAr}
                              </div>
                            )}
                          </div>
                          <Badge>{faq.category || 'General'}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <p>{faq.answer}</p>
                          {faq.answerAr && (
                            <p className="text-muted-foreground text-right" dir="rtl">
                              {faq.answerAr}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Updated: {faq.lastUpdated}</span>
                          {faq.version && (
                            <>
                              <span className="mx-1">•</span>
                              <span>v{faq.version}</span>
                            </>
                          )}
                          <span className="mx-1">•</span>
                          <span>Order: {faq.order || 0}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewVersionHistory(faq.id, 'faq')}
                          >
                            <History className="h-4 w-4 mr-1" />
                            History
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFAQ(faq)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteFAQ(faq.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        {/* Content Sections Tab */}
        <TabsContent value="sections">
          {editingSection ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingSection.id ? `Edit Section: ${editingSection.name}` : 'Add New Section'}</CardTitle>
                <CardDescription>
                  Manage website content sections
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Button 
                    variant={editingLanguage === 'en' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setEditingLanguage('en')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    English
                  </Button>
                  <Button 
                    variant={editingLanguage === 'ar' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setEditingLanguage('ar')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    العربية
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingLanguage === 'en' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Section Name</Label>
                        <Input
                          id="name"
                          value={editingSection.name}
                          onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
                          placeholder="Enter section name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="identifier">Identifier</Label>
                        <Input
                          id="identifier"
                          value={editingSection.identifier}
                          onChange={(e) => setEditingSection({...editingSection, identifier: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                          placeholder="section_identifier"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Content Type</Label>
                      <Select
                        value={editingSection.type}
                        onValueChange={(value) => setEditingSection({
                          ...editingSection, 
                          type: value as 'text' | 'html' | 'image' | 'video' | 'carousel'
                        })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Plain Text</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      {editingSection.type === 'html' ? (
                        <div className="border rounded-md">
                          <ReactQuill
                            theme="snow"
                            value={editingSection.content}
                            onChange={(content) => setEditingSection({...editingSection, content})}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Enter section content..."
                          />
                        </div>
                      ) : editingSection.type === 'image' ? (
                        <ImageUploader
                          currentImage={editingSection.content}
                          onImageUpload={(url) => setEditingSection({...editingSection, content: url})}
                        />
                      ) : (
                        <Textarea
                          id="content"
                          value={editingSection.content}
                          onChange={(e) => setEditingSection({...editingSection, content: e.target.value})}
                          placeholder="Enter section content"
                          rows={6}
                        />
                      )}
                    </div>
                    
                    {editingSection.id && editingSection.version && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {editingSection.lastUpdated}</span>
                        <span>•</span>
                        <span>Version: {editingSection.version}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameAr">Section Name (Arabic)</Label>
                      <Input
                        id="nameAr"
                        value={editingSection.nameAr || ''}
                        onChange={(e) => setEditingSection({...editingSection, nameAr: e.target.value})}
                        placeholder="أدخل اسم القسم"
                        className="text-right"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contentAr">Content (Arabic)</Label>
                      {editingSection.type === 'html' ? (
                        <div className="border rounded-md" dir="rtl">
                          <ReactQuill
                            theme="snow"
                            value={editingSection.contentAr || ''}
                            onChange={(contentAr) => setEditingSection({...editingSection, contentAr})}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="أدخل محتوى القسم..."
                          />
                        </div>
                      ) : editingSection.type === 'image' ? (
                        <ImageUploader
                          currentImage={editingSection.contentAr || ''}
                          onImageUpload={(url) => setEditingSection({...editingSection, contentAr: url})}
                        />
                      ) : (
                        <Textarea
                          id="contentAr"
                          value={editingSection.contentAr || ''}
                          onChange={(e) => setEditingSection({...editingSection, contentAr: e.target.value})}
                          placeholder="أدخل محتوى القسم"
                          rows={6}
                          className="text-right"
                          dir="rtl"
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingSection(null)}>Cancel</Button>
                <Button onClick={handleSaveSection}>Save Section</Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Select
                    value={filters.sections.type}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      sections: {
                        ...filters.sections,
                        type: value
                      }
                    })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="text">Plain Text</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSection}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredSections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No content sections found. Add a new section to get started.
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Identifier</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSections.map((section) => (
                        <TableRow key={section.id}>
                          <TableCell className="font-medium">
                            <div>
                              {section.name}
                              {section.nameAr && (
                                <div className="text-xs text-muted-foreground mt-1 text-right" dir="rtl">
                                  {section.nameAr}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{section.identifier}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{section.lastUpdated}</TableCell>
                          <TableCell>v{section.version || 1}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewVersionHistory(section.id, 'section')}
                              >
                                <History className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSection(section)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteSection(section.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              View and restore previous versions of this content
            </DialogDescription>
          </DialogHeader>
          
          <VersionHistory 
            versions={filteredVersions} 
            onRestore={handleRestoreVersion} 
            contentType={currentContentType || 'page'} 
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionHistory(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedContentManager;
