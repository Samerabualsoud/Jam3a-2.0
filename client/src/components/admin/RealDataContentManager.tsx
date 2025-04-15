import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ImagePlus, Save, Trash2, Edit, Eye, Upload, X, Camera, FileImage, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';

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
    if (files.length) {
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

const RealDataContentManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("banners");
  
  // State for real data
  const [banners, setBanners] = useState([]);
  const [pages, setPages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for editing
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
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

        const fetchProducts = async () => {
          try {
            const response = await axios.get('/api/products');
            if (response.data && Array.isArray(response.data)) {
              setProducts(response.data);
            } else {
              console.warn("Products data is not an array, using fallback");
              setProducts([]);
            }
            return true;
          } catch (error) {
            console.error("Error fetching products:", error);
            return false;
          }
        };

        // Execute all fetch operations in parallel
        const results = await Promise.allSettled([
          fetchBanners(),
          fetchPages(),
          fetchFAQs(),
          fetchProducts()
        ]);

        // Check if any of the fetch operations failed
        const anyFailed = results.some(result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value));
        
        if (anyFailed) {
          // If API calls fail, fall back to local data as a backup
          console.warn("Some API calls failed, using fallback data");
          
          // Fallback data (only used if API calls fail)
          if (!banners.length) {
            const fallbackBanners = [
              { id: 1, title: 'Summer Collection 2025', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80', active: true },
              { id: 2, title: 'Eid Special Offers', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80', active: false },
              { id: 3, title: 'New Arrivals - Spring 2025', image: 'https://images.unsplash.com/photo-1615380547903-c456276b7702?auto=format&fit=crop&w=1600&q=80', active: false },
            ];
            setBanners(fallbackBanners);
          }
          
          if (!pages.length) {
            const fallbackPages = [
              { id: 1, title: 'About Jam3a', slug: 'about', lastUpdated: '2025-04-01' },
              { id: 2, title: 'Frequently Asked Questions', slug: 'faq', lastUpdated: '2025-04-02' },
              { id: 3, title: 'Terms & Conditions', slug: 'terms', lastUpdated: '2025-04-03' },
              { id: 4, title: 'Privacy Policy', slug: 'privacy', lastUpdated: '2025-04-03' },
              { id: 5, title: 'Shipping Information', slug: 'shipping', lastUpdated: '2025-04-04' },
            ];
            setPages(fallbackPages);
          }
          
          if (!faqs.length) {
            const fallbackFAQs = [
              { id: 1, question: 'What is Jam3a?', answer: 'Jam3a is a social shopping platform where people team up to get better prices on products through group buying.' },
              { id: 2, question: 'How does a Jam3a deal work?', answer: 'A Jam3a starts when someone selects a product and shares it with others. Once enough people join the deal within a set time, everyone gets the discounted price.' },
              { id: 3, question: 'Can I start my own Jam3a?', answer: 'Yes! You can start your own Jam3a by picking a product and inviting others to join.' },
              { id: 4, question: 'How are payments processed?', answer: 'We use secure payment gateways including credit/debit cards, Apple Pay, and bank transfers through our partner Moyasar.' },
              { id: 5, question: 'What happens if not enough people join my Jam3a?', answer: 'If the minimum group size isn\'t reached within the timeframe, no charges will be made and the Jam3a will be canceled.' },
            ];
            setFaqs(fallbackFAQs);
          }
          
          if (!products.length) {
            const fallbackProducts = [
              { 
                id: 1, 
                name: 'iPhone 16 Pro Max', 
                category: 'Electronics', 
                price: 4999, 
                stock: 50,
                description: 'Experience the latest innovation with revolutionary camera and A18 Pro chip',
                image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              },
              { 
                id: 2, 
                name: 'Samsung Galaxy S25 Ultra', 
                category: 'Electronics', 
                price: 3899, 
                stock: 35,
                description: 'Unleash creativity with AI-powered tools and 200MP camera system',
                image: 'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              },
              { 
                id: 3, 
                name: 'Galaxy Z Fold 6', 
                category: 'Electronics', 
                price: 5799, 
                stock: 20,
                description: 'Multitask like never before with a stunning foldable display',
                image: 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              },
              { 
                id: 4, 
                name: 'MacBook Pro 16" M3 Max', 
                category: 'Computers', 
                price: 9999, 
                stock: 15,
                description: 'Unmatched performance for creative professionals with the M3 Max chip',
                image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              },
              { 
                id: 5, 
                name: 'Sony WH-1000XM5', 
                category: 'Audio', 
                price: 1299, 
                stock: 45,
                description: 'Industry-leading noise cancellation with exceptional sound quality',
                image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              },
            ];
            setProducts(fallbackProducts);
          }
        }
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
  }, [toast, banners.length, pages.length, faqs.length, products.length]);

  // Banner management functions
  const handleAddBanner = () => {
    setEditingBanner({
      id: Date.now(), // Temporary ID
      title: '',
      image: '',
      active: false
    });
  };

  const handleEditBanner = (banner) => {
    setEditingBanner({...banner});
  };

  const handleSaveBanner = () => {
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
    
    if (isNewBanner) {
      setBanners([...banners, editingBanner]);
    } else {
      setBanners(banners.map(b => b.id === editingBanner.id ? editingBanner : b));
    }
    
    toast({
      title: "Success",
      description: `Banner ${isNewBanner ? 'added' : 'updated'} successfully`,
    });
    
    setEditingBanner(null);
  };

  const handleDeleteBanner = (id) => {
    setBanners(banners.filter(b => b.id !== id));
    toast({
      title: "Banner Deleted",
      description: "The banner has been removed successfully",
    });
  };

  const handleToggleBannerStatus = (id) => {
    setBanners(banners.map(b => {
      if (b.id === id) {
        return {...b, active: !b.active};
      }
      return b;
    }));
  };

  // Page management functions
  const handleAddPage = () => {
    setEditingPage({
      id: Date.now(),
      title: '',
      slug: '',
      content: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditPage = (page) => {
    setEditingPage({...page, content: page.content || ''});
  };

  const handleSavePage = () => {
    if (!editingPage.title || !editingPage.slug) {
      toast({
        title: "Validation Error",
        description: "Please provide a title and slug for the page",
        variant: "destructive"
      });
      return;
    }
    
    // Generate slug if not provided
    const slug = editingPage.slug || editingPage.title.toLowerCase().replace(/\s+/g, '-');
    
    // Check if this is a new page or editing existing one
    const isNewPage = !pages.some(p => p.id === editingPage.id);
    
    const updatedPage = {
      ...editingPage,
      slug,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    if (isNewPage) {
      setPages([...pages, updatedPage]);
    } else {
      setPages(pages.map(p => p.id === editingPage.id ? updatedPage : p));
    }
    
    toast({
      title: "Success",
      description: `Page ${isNewPage ? 'added' : 'updated'} successfully`,
    });
    
    setEditingPage(null);
  };

  const handleDeletePage = (id) => {
    setPages(pages.filter(p => p.id !== id));
    toast({
      title: "Page Deleted",
      description: "The page has been removed successfully",
    });
  };

  // FAQ management functions
  const handleAddFAQ = () => {
    setEditingFAQ({
      id: Date.now(),
      question: '',
      answer: ''
    });
  };

  const handleEditFAQ = (faq) => {
    setEditingFAQ({...faq});
  };

  const handleSaveFAQ = () => {
    if (!editingFAQ.question || !editingFAQ.answer) {
      toast({
        title: "Validation Error",
        description: "Please provide both a question and answer",
        variant: "destructive"
      });
      return;
    }
    
    // Check if this is a new FAQ or editing existing one
    const isNewFAQ = !faqs.some(f => f.id === editingFAQ.id);
    
    if (isNewFAQ) {
      setFaqs([...faqs, editingFAQ]);
    } else {
      setFaqs(faqs.map(f => f.id === editingFAQ.id ? editingFAQ : f));
    }
    
    toast({
      title: "Success",
      description: `FAQ ${isNewFAQ ? 'added' : 'updated'} successfully`,
    });
    
    setEditingFAQ(null);
  };

  const handleDeleteFAQ = (id) => {
    setFaqs(faqs.filter(f => f.id !== id));
    toast({
      title: "FAQ Deleted",
      description: "The FAQ has been removed successfully",
    });
  };

  // Product management functions
  const handleAddProduct = () => {
    setEditingProduct({
      id: Date.now(),
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      image: ''
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct({...product});
  };

  const handleSaveProduct = () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.image) {
      toast({
        title: "Validation Error",
        description: "Please provide name, price, and image for the product",
        variant: "destructive"
      });
      return;
    }
    
    // Check if this is a new product or editing existing one
    const isNewProduct = !products.some(p => p.id === editingProduct.id);
    
    if (isNewProduct) {
      setProducts([...products, editingProduct]);
    } else {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    }
    
    toast({
      title: "Success",
      description: `Product ${isNewProduct ? 'added' : 'updated'} successfully`,
    });
    
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Deleted",
      description: "The product has been removed successfully",
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading content...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">
            Manage website content, banners, pages, and FAQs
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Manage Banners</h3>
            <Button onClick={handleAddBanner}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {editingBanner ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingBanner.id ? 'Edit' : 'Add'} Banner</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="banner-title">Title</Label>
                      <Input
                        id="banner-title"
                        value={editingBanner.title}
                        onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})}
                        placeholder="Enter banner title"
                      />
                    </div>
                    
                    <ImageUploader
                      onImageUpload={(url) => setEditingBanner({...editingBanner, image: url})}
                      currentImage={editingBanner.image}
                      label="Banner Image"
                    />
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="banner-active"
                        checked={editingBanner.active}
                        onChange={(e) => setEditingBanner({...editingBanner, active: e.target.checked})}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="banner-active">Active</Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setEditingBanner(null)}>Cancel</Button>
                    <Button onClick={handleSaveBanner}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Banner
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {banners.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No banners found. Add your first banner to get started.</p>
                    </div>
                  ) : (
                    banners.map((banner) => (
                      <Card key={banner.id} className={banner.active ? "border-primary" : ""}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video">
                            <img
                              src={banner.image}
                              alt={banner.title}
                              className="object-cover w-full h-full rounded-t-lg"
                            />
                            {banner.active && (
                              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                Active
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{banner.title}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-between pt-0">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleBannerStatus(banner.id)}
                            >
                              {banner.active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBanner(banner)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBanner(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Manage Pages</h3>
            <Button onClick={handleAddPage}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {editingPage ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingPage.id ? 'Edit' : 'Add'} Page</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="page-title">Title</Label>
                      <Input
                        id="page-title"
                        value={editingPage.title}
                        onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                        placeholder="Enter page title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="page-slug">Slug</Label>
                      <Input
                        id="page-slug"
                        value={editingPage.slug}
                        onChange={(e) => setEditingPage({...editingPage, slug: e.target.value})}
                        placeholder="Enter page slug (e.g., about-us)"
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be used in the URL: jam3a.me/{editingPage.slug || 'page-slug'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="page-content">Content</Label>
                      <Textarea
                        id="page-content"
                        value={editingPage.content}
                        onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                        placeholder="Enter page content"
                        rows={10}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setEditingPage(null)}>Cancel</Button>
                    <Button onClick={handleSavePage}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Page
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Updated</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {pages.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                No pages found. Add your first page to get started.
                              </td>
                            </tr>
                          ) : (
                            pages.map((page) => (
                              <tr key={page.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td className="p-4 align-middle">{page.title}</td>
                                <td className="p-4 align-middle">{page.slug}</td>
                                <td className="p-4 align-middle">{page.lastUpdated}</td>
                                <td className="p-4 align-middle">
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditPage(page)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(`/${page.slug}`, '_blank')}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeletePage(page.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Manage FAQs</h3>
            <Button onClick={handleAddFAQ}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {editingFAQ ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingFAQ.id ? 'Edit' : 'Add'} FAQ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="faq-question">Question</Label>
                      <Input
                        id="faq-question"
                        value={editingFAQ.question}
                        onChange={(e) => setEditingFAQ({...editingFAQ, question: e.target.value})}
                        placeholder="Enter question"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="faq-answer">Answer</Label>
                      <Textarea
                        id="faq-answer"
                        value={editingFAQ.answer}
                        onChange={(e) => setEditingFAQ({...editingFAQ, answer: e.target.value})}
                        placeholder="Enter answer"
                        rows={5}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setEditingFAQ(null)}>Cancel</Button>
                    <Button onClick={handleSaveFAQ}>
                      <Save className="mr-2 h-4 w-4" />
                      Save FAQ
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="space-y-4">
                  {faqs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No FAQs found. Add your first FAQ to get started.</p>
                    </div>
                  ) : (
                    faqs.map((faq) => (
                      <Card key={faq.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2 pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFAQ(faq)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteFAQ(faq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Manage Products</h3>
            <Button onClick={handleAddProduct}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {editingProduct ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingProduct.id ? 'Edit' : 'Add'} Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-name">Product Name</Label>
                        <Input
                          id="product-name"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                          placeholder="Enter product name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="product-category">Category</Label>
                        <Select
                          value={editingProduct.category}
                          onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                        >
                          <SelectTrigger id="product-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Computers">Computers</SelectItem>
                            <SelectItem value="Audio">Audio</SelectItem>
                            <SelectItem value="Wearables">Wearables</SelectItem>
                            <SelectItem value="Home">Home</SelectItem>
                            <SelectItem value="Accessories">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="product-price">Price (SAR)</Label>
                        <Input
                          id="product-price"
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                          placeholder="Enter price"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="product-stock">Stock</Label>
                        <Input
                          id="product-stock"
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                          placeholder="Enter stock quantity"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="product-description">Description</Label>
                      <Textarea
                        id="product-description"
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>
                    
                    <ImageUploader
                      onImageUpload={(url) => setEditingProduct({...editingProduct, image: url})}
                      currentImage={editingProduct.image}
                      label="Product Image"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                    <Button onClick={handleSaveProduct}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Product
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="object-cover w-full h-full rounded-t-lg"
                            />
                          </div>
                        </CardContent>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
                              <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                            </div>
                          </div>
                          <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealDataContentManager;
