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

// Enhanced Image upload component with better UI and functionality
const ImageUploader = ({ onImageUpload, currentImage, label = "Upload Image" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPreview(currentImage || "");
  }, [currentImage]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      handleFiles(files[0]);
    }
  };

  const handleFiles = (file: File) => {
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
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreview(result);
          onImageUpload(result, file.name);
          toast({
            title: "Image uploaded successfully",
            description: `${file.name} has been uploaded`,
          });
        };
        reader.readAsDataURL(file);
      }
    }, 200);
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
    input.capture = 'environment';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        handleFiles(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {preview ? (
        <div className="relative border rounded-md overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-contain bg-gray-50"
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <FileImage className="h-10 w-10 text-primary" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={captureImage}
            >
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Product form component with enhanced image upload
const ProductForm = ({ product = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: product?.id || Date.now(),
    name: product?.name || '',
    category: product?.category || 'Electronics',
    price: product?.price || '',
    stock: product?.stock || '',
    description: product?.description || '',
    image: product?.image || '',
    imageName: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (imageData, imageName) => {
    setFormData(prev => ({ ...prev, image: imageData, imageName }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="jam3a-input"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Home">Home & Kitchen</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Beauty">Beauty</SelectItem>
                <SelectItem value="Sports">Sports & Outdoors</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (SAR)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                className="jam3a-input"
              />
            </div>
            
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input 
                id="stock" 
                name="stock" 
                type="number" 
                value={formData.stock} 
                onChange={handleChange} 
                required 
                className="jam3a-input"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              className="jam3a-input"
            />
          </div>
        </div>
        
        <div>
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            currentImage={formData.image} 
            label="Product Image"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="jam3a-button-primary">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [banners, setBanners] = useState(mockBanners);
  const [pages, setPages] = useState(mockPages);
  const [faqs, setFAQs] = useState(mockFAQs);
  const [products, setProducts] = useState(mockProducts);
  const { toast } = useToast();
  
  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    id: 0,
    title: '',
    image: '',
    active: false
  });
  
  // Page form state
  const [pageForm, setPageForm] = useState({
    id: 0,
    title: '',
    slug: '',
    content: '',
    lastUpdated: ''
  });
  
  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    id: 0,
    question: '',
    answer: ''
  });
  
  // Handle banner selection
  const handleSelectBanner = (banner) => {
    setSelectedBanner(banner);
    setBannerForm({
      id: banner.id,
      title: banner.title,
      image: banner.image,
      active: banner.active
    });
    setIsEditing(true);
    setIsAdding(false);
  };
  
  // Handle page selection
  const handleSelectPage = (page) => {
    setSelectedPage(page);
    setPageForm({
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: 'This is the content for ' + page.title,
      lastUpdated: page.lastUpdated
    });
    setIsEditing(true);
    setIsAdding(false);
  };
  
  // Handle FAQ selection
  const handleSelectFAQ = (faq) => {
    setSelectedFAQ(faq);
    setFaqForm({
      id: faq.id,
      question: faq.question,
      answer: faq.answer
    });
    setIsEditing(true);
    setIsAdding(false);
  };
  
  // Handle product selection
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsAdding(false);
  };
  
  // Handle adding new item
  const handleAddNew = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedBanner(null);
    setSelectedPage(null);
    setSelectedFAQ(null);
    setSelectedProduct(null);
    
    if (activeTab === "banners") {
      setBannerForm({
        id: Date.now(),
        title: '',
        image: '',
        active: false
      });
    } else if (activeTab === "pages") {
      setPageForm({
        id: Date.now(),
        title: '',
        slug: '',
        content: '',
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    } else if (activeTab === "faqs") {
      setFaqForm({
        id: Date.now(),
        question: '',
        answer: ''
      });
    }
  };
  
  // Handle banner form change
  const handleBannerFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm({
      ...bannerForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle page form change
  const handlePageFormChange = (e) => {
    const { name, value } = e.target;
    setPageForm({
      ...pageForm,
      [name]: value
    });
  };
  
  // Handle FAQ form change
  const handleFaqFormChange = (e) => {
    const { name, value } = e.target;
    setFaqForm({
      ...faqForm,
      [name]: value
    });
  };
  
  // Handle banner image upload
  const handleBannerImageUpload = (imageData, imageName) => {
    setBannerForm({
      ...bannerForm,
      image: imageData
    });
  };
  
  // Handle save banner
  const handleSaveBanner = () => {
    if (isAdding) {
      setBanners([...banners, bannerForm]);
      toast({
        title: "Banner added",
        description: `${bannerForm.title} has been added successfully.`
      });
    } else {
      setBanners(banners.map(b => b.id === bannerForm.id ? bannerForm : b));
      toast({
        title: "Banner updated",
        description: `${bannerForm.title} has been updated successfully.`
      });
    }
    setIsEditing(false);
    setIsAdding(false);
    setSelectedBanner(null);
  };
  
  // Handle save page
  const handleSavePage = () => {
    if (isAdding) {
      setPages([...pages, pageForm]);
      toast({
        title: "Page added",
        description: `${pageForm.title} has been added successfully.`
      });
    } else {
      setPages(pages.map(p => p.id === pageForm.id ? pageForm : p));
      toast({
        title: "Page updated",
        description: `${pageForm.title} has been updated successfully.`
      });
    }
    setIsEditing(false);
    setIsAdding(false);
    setSelectedPage(null);
  };
  
  // Handle save FAQ
  const handleSaveFAQ = () => {
    if (isAdding) {
      setFAQs([...faqs, faqForm]);
      toast({
        title: "FAQ added",
        description: `New FAQ has been added successfully.`
      });
    } else {
      setFAQs(faqs.map(f => f.id === faqForm.id ? faqForm : f));
      toast({
        title: "FAQ updated",
        description: `FAQ has been updated successfully.`
      });
    }
    setIsEditing(false);
    setIsAdding(false);
    setSelectedFAQ(null);
  };
  
  // Handle save product
  const handleSaveProduct = (productData) => {
    if (isAdding) {
      setProducts([...products, productData]);
      toast({
        title: "Product added",
        description: `${productData.name} has been added successfully.`
      });
    } else {
      setProducts(products.map(p => p.id === productData.id ? productData : p));
      toast({
        title: "Product updated",
        description: `${productData.name} has been updated successfully.`
      });
    }
    setIsEditing(false);
    setIsAdding(false);
    setSelectedProduct(null);
  };
  
  // Handle delete banner
  const handleDeleteBanner = (id) => {
    setBanners(banners.filter(b => b.id !== id));
    setIsEditing(false);
    setSelectedBanner(null);
    toast({
      title: "Banner deleted",
      description: "The banner has been deleted successfully."
    });
  };
  
  // Handle delete page
  const handleDeletePage = (id) => {
    setPages(pages.filter(p => p.id !== id));
    setIsEditing(false);
    setSelectedPage(null);
    toast({
      title: "Page deleted",
      description: "The page has been deleted successfully."
    });
  };
  
  // Handle delete FAQ
  const handleDeleteFAQ = (id) => {
    setFAQs(faqs.filter(f => f.id !== id));
    setIsEditing(false);
    setSelectedFAQ(null);
    toast({
      title: "FAQ deleted",
      description: "The FAQ has been deleted successfully."
    });
  };
  
  // Handle delete product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    setIsEditing(false);
    setSelectedProduct(null);
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully."
    });
  };
  
  // Handle cancel edit/add
  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedBanner(null);
    setSelectedPage(null);
    setSelectedFAQ(null);
    setSelectedProduct(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        {!isEditing && !isAdding && (
          <Button onClick={handleAddNew} className="jam3a-button-primary">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          {isEditing || isAdding ? (
            <Card>
              <CardHeader>
                <CardTitle>{isAdding ? 'Add New Product' : 'Edit Product'}</CardTitle>
                <CardDescription>
                  {isAdding ? 'Create a new product listing' : 'Update product information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductForm 
                  product={selectedProduct} 
                  onSave={handleSaveProduct} 
                  onCancel={handleCancel} 
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={product.image || 'https://placehold.co/400x300/teal/white?text=Product+Image'} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/teal/white?text=Product+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/80 hover:bg-destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">{product.price} SAR</span>
                      <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          {isEditing || isAdding ? (
            <Card>
              <CardHeader>
                <CardTitle>{isAdding ? 'Add New Banner' : 'Edit Banner'}</CardTitle>
                <CardDescription>
                  {isAdding ? 'Create a new banner for your website' : 'Update banner information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Banner Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={bannerForm.title} 
                      onChange={handleBannerFormChange} 
                      className="jam3a-input"
                    />
                  </div>
                  
                  <ImageUploader 
                    onImageUpload={handleBannerImageUpload} 
                    currentImage={bannerForm.image} 
                    label="Banner Image"
                  />
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="active" 
                      name="active" 
                      checked={bannerForm.active} 
                      onChange={handleBannerFormChange} 
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  {!isAdding && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteBanner(bannerForm.id)}
                    >
                      Delete
                    </Button>
                  )}
                  <Button onClick={handleSaveBanner} className="jam3a-button-primary">
                    {isAdding ? 'Add Banner' : 'Save Changes'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map(banner => (
                <Card 
                  key={banner.id} 
                  className={`overflow-hidden cursor-pointer transition-all ${
                    banner.active ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectBanner(banner)}
                >
                  <div className="aspect-video relative">
                    <img 
                      src={banner.image} 
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/teal/white?text=Banner+Image';
                      }}
                    />
                    {banner.active && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        Active
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold">{banner.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          {isEditing || isAdding ? (
            <Card>
              <CardHeader>
                <CardTitle>{isAdding ? 'Add New Page' : 'Edit Page'}</CardTitle>
                <CardDescription>
                  {isAdding ? 'Create a new page for your website' : 'Update page content'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Page Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={pageForm.title} 
                      onChange={handlePageFormChange} 
                      className="jam3a-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">/</span>
                      <Input 
                        id="slug" 
                        name="slug" 
                        value={pageForm.slug} 
                        onChange={handlePageFormChange} 
                        className="jam3a-input"
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
                      rows={10} 
                      className="jam3a-input"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  {!isAdding && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeletePage(pageForm.id)}
                    >
                      Delete
                    </Button>
                  )}
                  <Button onClick={handleSavePage} className="jam3a-button-primary">
                    {isAdding ? 'Add Page' : 'Save Changes'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-2">
              {pages.map(page => (
                <Card 
                  key={page.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelectPage(page)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{page.title}</h3>
                      <p className="text-sm text-muted-foreground">/{page.slug}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Last updated: {page.lastUpdated}
                      </span>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          {isEditing || isAdding ? (
            <Card>
              <CardHeader>
                <CardTitle>{isAdding ? 'Add New FAQ' : 'Edit FAQ'}</CardTitle>
                <CardDescription>
                  {isAdding ? 'Create a new frequently asked question' : 'Update FAQ information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Input 
                      id="question" 
                      name="question" 
                      value={faqForm.question} 
                      onChange={handleFaqFormChange} 
                      className="jam3a-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea 
                      id="answer" 
                      name="answer" 
                      value={faqForm.answer} 
                      onChange={handleFaqFormChange} 
                      rows={5} 
                      className="jam3a-input"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  {!isAdding && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteFAQ(faqForm.id)}
                    >
                      Delete
                    </Button>
                  )}
                  <Button onClick={handleSaveFAQ} className="jam3a-button-primary">
                    {isAdding ? 'Add FAQ' : 'Save Changes'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-2">
              {faqs.map(faq => (
                <Card 
                  key={faq.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelectFAQ(faq)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
