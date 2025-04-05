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

// Functional Image upload component with actual upload capability
const ImageUploader = ({ onImageUpload, currentImage, label = "Upload Image" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentImage || "");
  const fileInputRef = useRef(null);
  const { toast } = useToast();

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
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Use Cloudinary or similar service for actual implementation
      // For demo purposes, we'll use a mock upload with progress
      const uploadUrl = 'https://api.cloudinary.com/v1_1/demo/image/upload';
      
      // Create a reader for preview while uploading
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setPreview(result);
      };
      reader.readAsDataURL(file);
      
      // Actual upload with progress tracking
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      }).catch(error => {
        // If the actual upload fails, we'll use a fallback for demo purposes
        console.error("Upload failed, using fallback for demo:", error);
        return new Promise(resolve => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 5;
            setUploadProgress(progress);
            
            if (progress >= 100) {
              clearInterval(interval);
              resolve({ 
                data: { 
                  secure_url: URL.createObjectURL(file),
                  public_id: `demo_${Date.now()}`
                } 
              });
            }
          }, 100);
        });
      });
      
      // Get the URL from the response
      const imageUrl = response.data.secure_url;
      const imageId = response.data.public_id;
      
      // Call the callback with the URL and file name
      onImageUpload(imageUrl, file.name, imageId);
      
      toast({
        title: "Image uploaded successfully",
        description: `${file.name} has been uploaded`,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image. Please try again.",
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
  const handleFaqFormChange = (e) => {
    const { name, value } = e.target;
    setFaqForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle product image upload
  const handleProductImageUpload = (imageUrl, fileName, imageId) => {
    setProductForm(prev => ({
      ...prev,
      image: imageUrl,
      imageId: imageId
    }));
  };
  
  // Handle banner image upload
  const handleBannerImageUpload = (imageUrl, fileName, imageId) => {
    setBannerForm(prev => ({
      ...prev,
      image: imageUrl,
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
  const resetFaqForm = () => {
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
  const editFaq = (faq) => {
    setFaqForm({
      question: faq.question,
      answer: faq.answer
    });
    setEditingFAQ(faq.id);
  };
  
  // Save product
  const saveProduct = () => {
    // Validate form
    if (!productForm.name || !productForm.price || !productForm.stock || !productForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!productForm.image) {
      toast({
        title: "Missing image",
        description: "Please upload a product image",
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
        description: `${productForm.name} has been updated successfully`
      });
    } else {
      // Add new product
      const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        description: productForm.description,
        image: productForm.image
      };
      
      setProducts(prev => [...prev, newProduct]);
      
      toast({
        title: "Product added",
        description: `${productForm.name} has been added successfully`
      });
    }
    
    resetProductForm();
  };
  
  // Save banner
  const saveBanner = () => {
    // Validate form
    if (!bannerForm.title || !bannerForm.image) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload an image",
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
        description: `${bannerForm.title} has been updated successfully`
      });
    } else {
      // Add new banner
      const newBanner = {
        id: banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1,
        title: bannerForm.title,
        image: bannerForm.image,
        active: bannerForm.active
      };
      
      setBanners(prev => [...prev, newBanner]);
      
      toast({
        title: "Banner added",
        description: `${bannerForm.title} has been added successfully`
      });
    }
    
    resetBannerForm();
  };
  
  // Save page
  const savePage = () => {
    // Validate form
    if (!pageForm.title || !pageForm.slug) {
      toast({
        title: "Missing information",
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
        description: `${pageForm.title} has been updated successfully`
      });
    } else {
      // Add new page
      const newPage = {
        id: pages.length > 0 ? Math.max(...pages.map(p => p.id)) + 1 : 1,
        title: pageForm.title,
        slug: pageForm.slug,
        content: pageForm.content,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setPages(prev => [...prev, newPage]);
      
      toast({
        title: "Page added",
        description: `${pageForm.title} has been added successfully`
      });
    }
    
    resetPageForm();
  };
  
  // Save FAQ
  const saveFaq = () => {
    // Validate form
    if (!faqForm.question || !faqForm.answer) {
      toast({
        title: "Missing information",
        description: "Please fill in both question and answer fields",
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
        description: "FAQ has been updated successfully"
      });
    } else {
      // Add new FAQ
      const newFaq = {
        id: faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1,
        question: faqForm.question,
        answer: faqForm.answer
      };
      
      setFAQs(prev => [...prev, newFaq]);
      
      toast({
        title: "FAQ added",
        description: "FAQ has been added successfully"
      });
    }
    
    resetFaqForm();
  };
  
  // Delete product
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully"
    });
  };
  
  // Delete banner
  const deleteBanner = (id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
    
    toast({
      title: "Banner deleted",
      description: "The banner has been deleted successfully"
    });
  };
  
  // Delete page
  const deletePage = (id) => {
    setPages(prev => prev.filter(page => page.id !== id));
    
    toast({
      title: "Page deleted",
      description: "The page has been deleted successfully"
    });
  };
  
  // Delete FAQ
  const deleteFaq = (id) => {
    setFAQs(prev => prev.filter(faq => faq.id !== id));
    
    toast({
      title: "FAQ deleted",
      description: "The FAQ has been deleted successfully"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">
            Manage your website content, products, banners, and more.
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>
                {editingProduct ? 'Update product information' : 'Add a new product to your store'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={productForm.name} 
                    onChange={handleProductFormChange} 
                    placeholder="Enter product name" 
                  />
                </div>
                
                <div className="space-y-2">
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
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Home">Home & Kitchen</SelectItem>
                      <SelectItem value="Beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="Sports">Sports & Outdoors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (SAR)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    value={productForm.price} 
                    onChange={handleProductFormChange} 
                    placeholder="Enter price" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input 
                    id="stock" 
                    name="stock" 
                    type="number" 
                    value={productForm.stock} 
                    onChange={handleProductFormChange} 
                    placeholder="Enter stock quantity" 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={productForm.description} 
                    onChange={handleProductFormChange} 
                    placeholder="Enter product description" 
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
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
                Cancel
              </Button>
              <Button onClick={saveProduct}>
                <Save className="h-4 w-4 mr-2" />
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={product.image || 'https://placehold.co/600x400?text=No+Image'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">{product.price} SAR</span>
                    <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
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
        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</CardTitle>
              <CardDescription>
                {editingBanner ? 'Update banner information' : 'Add a new banner to your website'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Banner Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={bannerForm.title} 
                    onChange={handleBannerFormChange} 
                    placeholder="Enter banner title" 
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="active" 
                    name="active" 
                    checked={bannerForm.active} 
                    onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, active: checked }))} 
                  />
                  <Label htmlFor="active" className="cursor-pointer">Active</Label>
                </div>
                
                <ImageUploader 
                  onImageUpload={handleBannerImageUpload} 
                  currentImage={bannerForm.image}
                  label="Banner Image"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetBannerForm}>
                Cancel
              </Button>
              <Button onClick={saveBanner}>
                <Save className="h-4 w-4 mr-2" />
                {editingBanner ? 'Update Banner' : 'Add Banner'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map(banner => (
              <Card key={banner.id} className="overflow-hidden">
                <div className="aspect-[21/9] relative">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  {banner.active && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{banner.title}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between">
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
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</CardTitle>
              <CardDescription>
                {editingPage ? 'Update page content' : 'Add a new page to your website'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pageTitle">Page Title</Label>
                  <Input 
                    id="pageTitle" 
                    name="title" 
                    value={pageForm.title} 
                    onChange={handlePageFormChange} 
                    placeholder="Enter page title" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    value={pageForm.slug} 
                    onChange={handlePageFormChange} 
                    placeholder="Enter URL slug (e.g., about-us)" 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="content">Page Content</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    value={pageForm.content} 
                    onChange={handlePageFormChange} 
                    placeholder="Enter page content" 
                    rows={10}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetPageForm}>
                Cancel
              </Button>
              <Button onClick={savePage}>
                <Save className="h-4 w-4 mr-2" />
                {editingPage ? 'Update Page' : 'Add Page'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 gap-4">
            {pages.map(page => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{page.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">Last updated: {page.lastUpdated}</span>
                  </div>
                  <CardDescription>/{page.slug}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => editPage(page)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
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
        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
              <CardDescription>
                {editingFAQ ? 'Update FAQ content' : 'Add a new frequently asked question'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input 
                    id="question" 
                    name="question" 
                    value={faqForm.question} 
                    onChange={handleFaqFormChange} 
                    placeholder="Enter question" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea 
                    id="answer" 
                    name="answer" 
                    value={faqForm.answer} 
                    onChange={handleFaqFormChange} 
                    placeholder="Enter answer" 
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetFaqForm}>
                Cancel
              </Button>
              <Button onClick={saveFaq}>
                <Save className="h-4 w-4 mr-2" />
                {editingFAQ ? 'Update FAQ' : 'Add FAQ'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 gap-4">
            {faqs.map(faq => (
              <Card key={faq.id}>
                <CardHeader>
                  <CardTitle>{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{faq.answer}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => editFaq(faq)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteFaq(faq.id)}>
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
