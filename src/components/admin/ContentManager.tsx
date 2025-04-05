import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ImagePlus, Save, Trash2, Edit, Eye, Upload, X, Camera, FileImage } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';

// Mock data for content items
const mockBanners = [
  { id: 1, title: 'Welcome Banner', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80', active: true },
  { id: 2, title: 'Summer Sale', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80', active: false },
  { id: 3, title: 'New Products', image: 'https://images.unsplash.com/photo-1615380547903-c456276b7702?auto=format&fit=crop&w=1600&q=80', active: false },
];

const mockPages = [
  { id: 1, title: 'About Us', slug: 'about', lastUpdated: '2025-03-28' },
  { id: 2, title: 'FAQ', slug: 'faq', lastUpdated: '2025-03-29' },
  { id: 3, title: 'Terms of Service', slug: 'terms', lastUpdated: '2025-03-30' },
  { id: 4, title: 'Privacy Policy', slug: 'privacy', lastUpdated: '2025-03-30' },
];

const mockFAQs = [
  { id: 1, question: 'What is Jam3a?', answer: 'Jam3a is a social shopping platform where people team up to get better prices on products.' },
  { id: 2, question: 'How does a Jam3a deal work?', answer: 'A Jam3a starts when someone selects a product and shares it with others. Once enough people join the deal within a set time, everyone gets the discounted price.' },
  { id: 3, question: 'Can I start my own Jam3a?', answer: 'Yes! You can start your own Jam3a by picking a product, setting the group size, and inviting others to join.' },
];

// Mock product data
const mockProducts = [
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
];

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
    if (files?.length) {
      handleFiles(files[0]);
    }
  };

  const handleFiles = async (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError("Please select an image file (JPEG, PNG, GIF, etc.)");
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive"
      });
      return;
    }

    setError("");
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a reader for preview while uploading
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setPreview(result);
      };
      reader.readAsDataURL(file);
      
      // Prepare for actual upload based on selected service
      let formData = new FormData();
      let uploadUrl = '';
      let headers = { 'Content-Type': 'multipart/form-data' };
      
      // Configure upload based on service
      if (uploadService === UPLOAD_SERVICES.CLOUDINARY) {
        uploadUrl = uploadService.uploadUrl;
        formData.append('file', file);
        formData.append('upload_preset', uploadService.uploadPreset);
        formData.append('cloud_name', uploadService.cloudName);
      } else if (uploadService === UPLOAD_SERVICES.IMGBB) {
        uploadUrl = `${uploadService.uploadUrl}?key=${uploadService.apiKey}`;
        formData.append('image', file);
      } else if (uploadService === UPLOAD_SERVICES.LOCAL) {
        uploadUrl = uploadService.uploadUrl;
        formData.append('file', file);
      }
      
      // Attempt actual upload with progress tracking
      try {
        const response = await axios.post(uploadUrl, formData, {
          headers,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        
        // Process response based on service
        let imageUrl = '';
        let imageId = '';
        
        if (uploadService === UPLOAD_SERVICES.CLOUDINARY) {
          imageUrl = response.data.secure_url;
          imageId = response.data.public_id;
        } else if (uploadService === UPLOAD_SERVICES.IMGBB) {
          imageUrl = response.data.data.url;
          imageId = response.data.data.id;
        } else if (uploadService === UPLOAD_SERVICES.LOCAL) {
          imageUrl = response.data.url;
          imageId = response.data.id || `local_${Date.now()}`;
        }
        
        // Call the callback with the URL and file name
        onImageUpload(imageUrl, file.name, imageId);
        
        toast({
          title: "Image uploaded successfully",
          description: `${file.name} has been uploaded to ${uploadService.name}`,
        });
      } catch (uploadError) {
        console.error("Upload failed, using local fallback:", uploadError);
        
        // Fallback to local storage if remote upload fails
        const localImageUrl = URL.createObjectURL(file);
        const localImageId = `local_${Date.now()}`;
        
        // Simulate upload progress for better UX
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            
            // Call the callback with the local URL
            onImageUpload(localImageUrl, file.name, localImageId);
            
            toast({
              title: "Image stored locally",
              description: `${file.name} has been stored in local browser storage`,
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error handling image:", error);
      setError("Failed to process image. Please try again.");
      toast({
        title: "Upload failed",
        description: "There was a problem processing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreview("");
    onImageUpload("", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Image removed",
      description: "The image has been removed",
    });
  };

  const captureImage = () => {
    // Create a temporary input element to trigger device camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFiles(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Drag and drop area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!preview && !isUploading ? (
          <div className="py-4">
            <div className="flex justify-center mb-2">
              <FileImage className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop an image here, or click to select
            </p>
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={captureImage}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : isUploading ? (
          <div className="py-4">
            <p className="text-sm font-medium mb-2">Uploading image...</p>
            <Progress value={uploadProgress} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-48 mx-auto rounded-md object-contain"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Upload service selection */}
      <div className="flex items-center gap-2 mt-2">
        <Label className="text-xs text-muted-foreground">Upload service:</Label>
        <Select 
          value={uploadService === UPLOAD_SERVICES.CLOUDINARY ? 'cloudinary' : 
                 uploadService === UPLOAD_SERVICES.IMGBB ? 'imgbb' : 'local'}
          onValueChange={(value) => {
            if (value === 'cloudinary') setUploadService(UPLOAD_SERVICES.CLOUDINARY);
            else if (value === 'imgbb') setUploadService(UPLOAD_SERVICES.IMGBB);
            else setUploadService(UPLOAD_SERVICES.LOCAL);
          }}
        >
          <SelectTrigger className="h-7 text-xs w-auto min-w-[120px]">
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cloudinary">Cloudinary</SelectItem>
            <SelectItem value="imgbb">ImgBB</SelectItem>
            <SelectItem value="local">Local Storage</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState(mockProducts);
  const [banners, setBanners] = useState(mockBanners);
  const [pages, setPages] = useState(mockPages);
  const [faqs, setFAQs] = useState(mockFAQs);
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [editingFAQ, setEditingFAQ] = useState(null);
  
  const { toast } = useToast();
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    image: ''
  });
  
  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    title: '',
    image: '',
    active: false
  });
  
  // Page form state
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: ''
  });
  
  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: ''
  });
  
  // Handle product form change
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle banner form change
  const handleBannerFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle page form change
  const handlePageFormChange = (e) => {
    const { name, value } = e.target;
    setPageForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle FAQ form change
  const handleFAQFormChange = (e) => {
    const { name, value } = e.target;
    setFaqForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle product image upload
  const handleProductImageUpload = (url, fileName, imageId) => {
    setProductForm(prev => ({
      ...prev,
      image: url,
      imageId: imageId
    }));
  };
  
  // Handle banner image upload
  const handleBannerImageUpload = (url, fileName, imageId) => {
    setBannerForm(prev => ({
      ...prev,
      image: url,
      imageId: imageId
    }));
  };
  
  // Reset product form
  const resetProductForm = () => {
    setProductForm({
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
      description: '',
      image: ''
    });
    setEditingProduct(null);
  };
  
  // Reset banner form
  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      image: '',
      active: false
    });
    setEditingBanner(null);
  };
  
  // Reset page form
  const resetPageForm = () => {
    setPageForm({
      title: '',
      slug: '',
      content: ''
    });
    setEditingPage(null);
  };
  
  // Reset FAQ form
  const resetFAQForm = () => {
    setFaqForm({
      question: '',
      answer: ''
    });
    setEditingFAQ(null);
  };
  
  // Edit product
  const editProduct = (product) => {
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: product.image
    });
    setEditingProduct(product.id);
  };
  
  // Edit banner
  const editBanner = (banner) => {
    setBannerForm({
      title: banner.title,
      image: banner.image,
      active: banner.active
    });
    setEditingBanner(banner.id);
  };
  
  // Edit page
  const editPage = (page) => {
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content || ''
    });
    setEditingPage(page.id);
  };
  
  // Edit FAQ
  const editFAQ = (faq) => {
    setFaqForm({
      question: faq.question,
      answer: faq.answer
    });
    setEditingFAQ(faq.id);
  };
  
  // Save product
  const saveProduct = () => {
    // Validate form
    if (!productForm.name || !productForm.price || !productForm.stock) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(product => 
        product.id === editingProduct ? {
          ...product,
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          description: productForm.description,
          image: productForm.image
        } : product
      ));
      
      toast({
        title: "Product updated",
        description: `${productForm.name} has been updated`
      });
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        description: productForm.description,
        image: productForm.image || 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      };
      
      setProducts(prev => [...prev, newProduct]);
      
      toast({
        title: "Product added",
        description: `${productForm.name} has been added`
      });
    }
    
    resetProductForm();
  };
  
  // Save banner
  const saveBanner = () => {
    // Validate form
    if (!bannerForm.title || !bannerForm.image) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (editingBanner) {
      // Update existing banner
      setBanners(prev => prev.map(banner => 
        banner.id === editingBanner ? {
          ...banner,
          title: bannerForm.title,
          image: bannerForm.image,
          active: bannerForm.active
        } : banner
      ));
      
      toast({
        title: "Banner updated",
        description: `${bannerForm.title} has been updated`
      });
    } else {
      // Add new banner
      const newBanner = {
        id: Date.now(),
        title: bannerForm.title,
        image: bannerForm.image,
        active: bannerForm.active
      };
      
      setBanners(prev => [...prev, newBanner]);
      
      toast({
        title: "Banner added",
        description: `${bannerForm.title} has been added`
      });
    }
    
    resetBannerForm();
  };
  
  // Save page
  const savePage = () => {
    // Validate form
    if (!pageForm.title || !pageForm.slug) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (editingPage) {
      // Update existing page
      setPages(prev => prev.map(page => 
        page.id === editingPage ? {
          ...page,
          title: pageForm.title,
          slug: pageForm.slug,
          content: pageForm.content,
          lastUpdated: new Date().toISOString().split('T')[0]
        } : page
      ));
      
      toast({
        title: "Page updated",
        description: `${pageForm.title} has been updated`
      });
    } else {
      // Add new page
      const newPage = {
        id: Date.now(),
        title: pageForm.title,
        slug: pageForm.slug,
        content: pageForm.content,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setPages(prev => [...prev, newPage]);
      
      toast({
        title: "Page added",
        description: `${pageForm.title} has been added`
      });
    }
    
    resetPageForm();
  };
  
  // Save FAQ
  const saveFAQ = () => {
    // Validate form
    if (!faqForm.question || !faqForm.answer) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (editingFAQ) {
      // Update existing FAQ
      setFAQs(prev => prev.map(faq => 
        faq.id === editingFAQ ? {
          ...faq,
          question: faqForm.question,
          answer: faqForm.answer
        } : faq
      ));
      
      toast({
        title: "FAQ updated",
        description: "FAQ has been updated"
      });
    } else {
      // Add new FAQ
      const newFAQ = {
        id: Date.now(),
        question: faqForm.question,
        answer: faqForm.answer
      };
      
      setFAQs(prev => [...prev, newFAQ]);
      
      toast({
        title: "FAQ added",
        description: "FAQ has been added"
      });
    }
    
    resetFAQForm();
  };
  
  // Delete product
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    
    toast({
      title: "Product deleted",
      description: "The product has been deleted"
    });
  };
  
  // Delete banner
  const deleteBanner = (id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
    
    toast({
      title: "Banner deleted",
      description: "The banner has been deleted"
    });
  };
  
  // Delete page
  const deletePage = (id) => {
    setPages(prev => prev.filter(page => page.id !== id));
    
    toast({
      title: "Page deleted",
      description: "The page has been deleted"
    });
  };
  
  // Delete FAQ
  const deleteFAQ = (id) => {
    setFAQs(prev => prev.filter(faq => faq.id !== id));
    
    toast({
      title: "FAQ deleted",
      description: "The FAQ has been deleted"
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Content Manager</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>
                {editingProduct ? 'Update product details' : 'Create a new product listing'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={productForm.name} 
                      onChange={handleProductFormChange} 
                      placeholder="e.g. iPhone 16 Pro Max"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={productForm.category} 
                      onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Toys">Toys</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Automotive">Automotive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (SAR)</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        value={productForm.price} 
                        onChange={handleProductFormChange} 
                        placeholder="e.g. 4999"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input 
                        id="stock" 
                        name="stock" 
                        value={productForm.stock} 
                        onChange={handleProductFormChange} 
                        placeholder="e.g. 50"
                        type="number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={productForm.description} 
                      onChange={handleProductFormChange} 
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>
                </div>
                
                <div>
                  <ImageUploader 
                    onImageUpload={handleProductImageUpload} 
                    currentImage={productForm.image}
                    label="Product Image"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetProductForm}>
                {editingProduct ? 'Cancel' : 'Reset'}
              </Button>
              <Button onClick={saveProduct}>
                <Save className="h-4 w-4 mr-2" />
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={product.image || 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>
                    {product.category} • {product.stock} in stock
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-xl font-bold">{product.price} SAR</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => editProduct(product)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</CardTitle>
              <CardDescription>
                {editingBanner ? 'Update banner details' : 'Create a new promotional banner'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Banner Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={bannerForm.title} 
                      onChange={handleBannerFormChange} 
                      placeholder="e.g. Summer Sale"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={bannerForm.active}
                      onChange={handleBannerFormChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Active
                    </Label>
                  </div>
                </div>
                
                <div>
                  <ImageUploader 
                    onImageUpload={handleBannerImageUpload} 
                    currentImage={bannerForm.image}
                    label="Banner Image"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetBannerForm}>
                {editingBanner ? 'Cancel' : 'Reset'}
              </Button>
              <Button onClick={saveBanner}>
                <Save className="h-4 w-4 mr-2" />
                {editingBanner ? 'Update Banner' : 'Add Banner'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map(banner => (
              <Card key={banner.id} className="overflow-hidden">
                <div className="aspect-[21/9] relative overflow-hidden">
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="w-full h-full object-cover"
                  />
                  {banner.active && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        Active
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{banner.title}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => editBanner(banner)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteBanner(banner.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</CardTitle>
              <CardDescription>
                {editingPage ? 'Update page content' : 'Create a new static page'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pageTitle">Page Title</Label>
                  <Input 
                    id="pageTitle" 
                    name="title" 
                    value={pageForm.title} 
                    onChange={handlePageFormChange} 
                    placeholder="e.g. About Us"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    value={pageForm.slug} 
                    onChange={handlePageFormChange} 
                    placeholder="e.g. about-us"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Page Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={pageForm.content} 
                  onChange={handlePageFormChange} 
                  placeholder="Enter page content (supports Markdown)"
                  rows={10}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetPageForm}>
                {editingPage ? 'Cancel' : 'Reset'}
              </Button>
              <Button onClick={savePage}>
                <Save className="h-4 w-4 mr-2" />
                {editingPage ? 'Update Page' : 'Add Page'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="space-y-4">
            {pages.map(page => (
              <Card key={page.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <Badge variant="outline">{page.lastUpdated}</Badge>
                  </div>
                  <CardDescription>
                    Slug: /{page.slug}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => editPage(page)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deletePage(page.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
              <CardDescription>
                {editingFAQ ? 'Update FAQ details' : 'Create a new frequently asked question'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Input 
                  id="question" 
                  name="question" 
                  value={faqForm.question} 
                  onChange={handleFAQFormChange} 
                  placeholder="e.g. What is Jam3a?"
                />
              </div>
              
              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea 
                  id="answer" 
                  name="answer" 
                  value={faqForm.answer} 
                  onChange={handleFAQFormChange} 
                  placeholder="Enter the answer to the question"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetFAQForm}>
                {editingFAQ ? 'Cancel' : 'Reset'}
              </Button>
              <Button onClick={saveFAQ}>
                <Save className="h-4 w-4 mr-2" />
                {editingFAQ ? 'Update FAQ' : 'Add FAQ'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="space-y-4">
            {faqs.map(faq => (
              <Card key={faq.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => editFAQ(faq)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteFAQ(faq.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
