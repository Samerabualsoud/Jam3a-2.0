import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ImagePlus, Save, Trash2, Edit, Eye, Upload, X } from 'lucide-react';
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

// Image upload component
const ImageUploader = ({ onImageUpload, currentImage, label = "Upload Image" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
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
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
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
      )}
    </div>
  );
};

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [products, setProducts] = useState(mockProducts);

  // Form states
  const [bannerForm, setBannerForm] = useState({
    title: '',
    image: '',
    active: false,
    link: '',
  });

  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
  });

  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  const handleBannerSelect = (banner: any) => {
    setSelectedBanner(banner);
    setBannerForm({
      title: banner.title,
      image: banner.image,
      active: banner.active,
      link: banner.link || '',
    });
    setPreviewImage(banner.image);
    setIsEditing(true);
  };

  const handlePageSelect = (page: any) => {
    setSelectedPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: 'This is the content for ' + page.title + '. In a real implementation, this would be loaded from a database or CMS.',
    });
    setIsEditing(true);
  };

  const handleFAQSelect = (faq: any) => {
    setSelectedFAQ(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
    });
    setIsEditing(true);
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      image: product.image || '',
    });
    setIsEditing(true);
  };

  const handleNewItem = () => {
    setIsEditing(true);
    if (activeTab === 'banners') {
      setSelectedBanner(null);
      setBannerForm({
        title: '',
        image: '',
        active: false,
        link: '',
      });
      setPreviewImage(null);
    } else if (activeTab === 'pages') {
      setSelectedPage(null);
      setPageForm({
        title: '',
        slug: '',
        content: '',
      });
    } else if (activeTab === 'faqs') {
      setSelectedFAQ(null);
      setFaqForm({
        question: '',
        answer: '',
      });
    } else if (activeTab === 'products') {
      setSelectedProduct(null);
      setProductForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: '',
      });
    }
  };

  const handleSave = () => {
    // In a real implementation, this would save to a database or API
    if (activeTab === 'products') {
      if (selectedProduct) {
        // Update existing product
        const updatedProducts = products.map(p => 
          p.id === selectedProduct.id 
            ? { 
                ...p, 
                name: productForm.name,
                category: productForm.category,
                price: parseFloat(productForm.price),
                stock: parseInt(productForm.stock),
                description: productForm.description,
                image: productForm.image
              } 
            : p
        );
        setProducts(updatedProducts);
      } else {
        // Add new product
        const newProduct = {
          id: products.length + 1,
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          description: productForm.description,
          image: productForm.image
        };
        setProducts([...products, newProduct]);
      }
    }

    toast({
      title: "Content saved",
      description: "Your changes have been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedBanner(null);
    setSelectedPage(null);
    setSelectedFAQ(null);
    setSelectedProduct(null);
    setPreviewImage(null);
  };

  const handleImageUpload = (imageUrl: string, fileName: string) => {
    if (activeTab === 'banners') {
      setBannerForm({...bannerForm, image: imageUrl});
    } else if (activeTab === 'products') {
      setProductForm({...productForm, image: imageUrl});
    }
    
    if (imageUrl) {
      toast({
        title: "Image uploaded",
        description: `File "${fileName || 'image'}" has been uploaded successfully.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Content Management</h2>
        {!isEditing && (
          <Button onClick={handleNewItem}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New
          </Button>
        )}
      </div>

      <Tabs defaultValue="banners" value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setIsEditing(false);
        setSelectedBanner(null);
        setSelectedPage(null);
        setSelectedFAQ(null);
        setSelectedProduct(null);
        setPreviewImage(null);
      }} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
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
                      alt={banner.title} 
                      className="w-full h-full object-cover"
                    />
                    {banner.active && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        Active
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{banner.title}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleBannerSelect(banner)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{selectedBanner ? 'Edit Banner' : 'Add New Banner'}</CardTitle>
                <CardDescription>Manage homepage and promotional banners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="banner-title">Banner Title</Label>
                  <Input 
                    id="banner-title" 
                    value={bannerForm.title} 
                    onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                    placeholder="Enter banner title"
                  />
                </div>
                
                <ImageUploader 
                  onImageUpload={handleImageUpload}
                  currentImage={bannerForm.image}
                  label="Banner Image"
                />
                
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
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="banner-active" className="text-sm font-medium text-gray-700">
                    Set as active banner
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages">
          {!isEditing ? (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">Slug</th>
                    <th className="px-4 py-3 text-left font-medium">Last Updated</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPages.map((page) => (
                    <tr key={page.id} className="border-t">
                      <td className="px-4 py-3">{page.title}</td>
                      <td className="px-4 py-3 text-gray-600">/{page.slug}</td>
                      <td className="px-4 py-3 text-gray-600">{page.lastUpdated}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="mr-1" onClick={() => handlePageSelect(page)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPage ? `Edit Page: ${selectedPage.title}` : 'Add New Page'}</CardTitle>
                <CardDescription>Manage website pages and content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="page-title">Page Title</Label>
                  <Input 
                    id="page-title" 
                    value={pageForm.title} 
                    onChange={(e) => setPageForm({...pageForm, title: e.target.value})}
                    placeholder="Enter page title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="page-slug">URL Slug</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">/</span>
                    <Input 
                      id="page-slug" 
                      value={pageForm.slug} 
                      onChange={(e) => setPageForm({...pageForm, slug: e.target.value})}
                      placeholder="page-url-slug"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="page-content">Page Content</Label>
                  <Textarea 
                    id="page-content" 
                    value={pageForm.content} 
                    onChange={(e) => setPageForm({...pageForm, content: e.target.value})}
                    placeholder="Enter page content"
                    className="min-h-[200px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
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
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => handleFAQSelect(faq)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{selectedFAQ ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
                <CardDescription>Manage frequently asked questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faq-question">Question</Label>
                  <Input 
                    id="faq-question" 
                    value={faqForm.question} 
                    onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
                    placeholder="Enter question"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="faq-answer">Answer</Label>
                  <Textarea 
                    id="faq-answer" 
                    value={faqForm.answer} 
                    onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
                    placeholder="Enter answer"
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          {!isEditing ? (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Price (SAR)</th>
                    <th className="px-4 py-3 text-left font-medium">Stock</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                <ImagePlus className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.category}</td>
                      <td className="px-4 py-3 text-gray-600">{product.price}</td>
                      <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="mr-1" onClick={() => handleProductSelect(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{selectedProduct ? `Edit Product: ${selectedProduct.name}` : 'Add New Product'}</CardTitle>
                <CardDescription>Manage product information and inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input 
                      id="product-name" 
                      value={productForm.name} 
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category</Label>
                    <Select 
                      value={productForm.category} 
                      onValueChange={(value) => setProductForm({...productForm, category: value})}
                    >
                      <SelectTrigger id="product-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price (SAR)</Label>
                    <Input 
                      id="product-price" 
                      type="number"
                      value={productForm.price} 
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      placeholder="Enter price"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Stock</Label>
                    <Input 
                      id="product-stock" 
                      type="number"
                      value={productForm.stock} 
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                      placeholder="Enter stock quantity"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea 
                    id="product-description" 
                    value={productForm.description} 
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Enter product description"
                    className="min-h-[100px]"
                  />
                </div>
                
                <ImageUploader 
                  onImageUpload={handleImageUpload}
                  currentImage={productForm.image}
                  label="Product Image"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save Product
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
