import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ImagePlus, Save, Trash2, Edit, Eye, Upload, X, Camera, FileImage, RefreshCw } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProducts } from "@/contexts/ProductContext";
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
    if (files?.length) {
      handleFiles(files[0]);
    }
  };

  const handleFiles = async (file) => {
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

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload file
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
      } else if (uploadService === UPLOAD_SERVICES.LOCAL) {
        formData.append('file', file);
      }

      const response = await axios.post(uploadService.uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });

      // Handle different response formats
      let imageUrl = '';
      if (uploadService === UPLOAD_SERVICES.CLOUDINARY) {
        imageUrl = response.data.secure_url;
      } else if (uploadService === UPLOAD_SERVICES.IMGBB) {
        imageUrl = response.data.data.url;
      } else if (uploadService === UPLOAD_SERVICES.LOCAL) {
        imageUrl = response.data.url;
      }

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
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreview("");
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const captureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      // Create canvas and capture image
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Stop video stream
      stream.getTracks().forEach(track => track.stop());

      // Convert to blob and handle as file
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        handleFiles(file);
      }, 'image/jpeg');
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera access failed",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div 
        className={`border-2 border-dashed rounded-md p-4 transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!preview ? (
          <div 
            className="flex flex-col items-center justify-center py-4 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mb-4 rounded-full bg-primary/10 p-4">
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

const EnhancedContentManager = () => {
  const [activeTab, setActiveTab] = useState("website-content");
  const [editingContent, setEditingContent] = useState(null);
  const [banners, setBanners] = useState([
    { id: 1, title: 'Welcome Banner', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1600&q=80', active: true },
    { id: 2, title: 'Summer Sale', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80', active: false },
    { id: 3, title: 'New Products', image: 'https://images.unsplash.com/photo-1615380547903-c456276b7702?auto=format&fit=crop&w=1600&q=80', active: false },
  ]);
  const [pages, setPages] = useState([
    { id: 1, title: 'About Us', slug: 'about', lastUpdated: '2025-03-28', content: 'About us page content goes here.' },
    { id: 2, title: 'FAQ', slug: 'faq', lastUpdated: '2025-03-29', content: 'Frequently asked questions content goes here.' },
    { id: 3, title: 'Terms of Service', slug: 'terms', lastUpdated: '2025-03-30', content: 'Terms of service content goes here.' },
    { id: 4, title: 'Privacy Policy', slug: 'privacy', lastUpdated: '2025-03-30', content: 'Privacy policy content goes here.' },
  ]);
  const [faqs, setFaqs] = useState([
    { id: 1, question: 'What is Jam3a?', answer: 'Jam3a is a social shopping platform where people team up to get better prices on products.' },
    { id: 2, question: 'How does a Jam3a deal work?', answer: 'A Jam3a starts when someone selects a product and shares it with others. Once enough people join the deal within a set time, everyone gets the discounted price.' },
    { id: 3, question: 'Can I start my own Jam3a?', answer: 'Yes! You can start your own Jam3a by picking a product, setting the group size, and inviting others to join.' },
  ]);
  const [newBanner, setNewBanner] = useState({ title: '', image: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { activeJam3aDeals, products } = useProducts();

  // Handle banner image upload
  const handleBannerImageUpload = (imageUrl) => {
    setNewBanner({ ...newBanner, image: imageUrl });
  };

  // Add new banner
  const addBanner = () => {
    if (!newBanner.title || !newBanner.image) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and image for the banner.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(0, ...banners.map(b => b.id)) + 1;
    setBanners([...banners, { ...newBanner, id: newId, active: false }]);
    setNewBanner({ title: '', image: '' });
    
    toast({
      title: "Banner Added",
      description: "New banner has been added successfully.",
    });
  };

  // Toggle banner active state
  const toggleBannerActive = (id) => {
    setBanners(banners.map(banner => 
      banner.id === id 
        ? { ...banner, active: true } 
        : { ...banner, active: false }
    ));
    
    toast({
      title: "Banner Updated",
      description: "Banner status has been updated.",
    });
  };

  // Delete banner
  const deleteBanner = (id) => {
    setBanners(banners.filter(banner => banner.id !== id));
    
    toast({
      title: "Banner Deleted",
      description: "Banner has been deleted successfully.",
    });
  };

  // Add new FAQ
  const addFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      toast({
        title: "Missing Information",
        description: "Please provide both a question and answer for the FAQ.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(0, ...faqs.map(f => f.id)) + 1;
    setFaqs([...faqs, { ...newFaq, id: newId }]);
    setNewFaq({ question: '', answer: '' });
    
    toast({
      title: "FAQ Added",
      description: "New FAQ has been added successfully.",
    });
  };

  // Delete FAQ
  const deleteFaq = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
    
    toast({
      title: "FAQ Deleted",
      description: "FAQ has been deleted successfully.",
    });
  };

  // Edit page content
  const startEditingPage = (page) => {
    setEditingContent({ ...page, type: 'page' });
  };

  // Save page content
  const savePage = () => {
    if (editingContent.type === 'page') {
      setPages(pages.map(page => 
        page.id === editingContent.id 
          ? { 
              ...page, 
              title: editingContent.title,
              content: editingContent.content,
              lastUpdated: new Date().toISOString().split('T')[0]
            } 
          : page
      ));
    }
    
    setEditingContent(null);
    
    toast({
      title: "Content Saved",
      description: "Page content has been updated successfully.",
    });
  };

  // Get product details for a Jam3a deal
  const getProductForDeal = (dealProductId) => {
    return products.find(p => p.id === dealProductId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button onClick={() => setIsLoading(prev => !prev)} variant="outline">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Content
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="website-content" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="website-content">Website Content</TabsTrigger>
          <TabsTrigger value="jam3a-deals">Active Jam3a Deals</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        {/* Website Content Tab */}
        <TabsContent value="website-content">
          {editingContent && editingContent.type === 'page' ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Page: {editingContent.title}</CardTitle>
                <CardDescription>
                  Update the content for this page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input 
                      id="page-title" 
                      value={editingContent.title}
                      onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="page-content">Page Content</Label>
                    <Textarea 
                      id="page-content" 
                      value={editingContent.content}
                      onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                      rows={10}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingContent(null)}>Cancel</Button>
                <Button onClick={savePage}>Save Changes</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-6">
              {/* Banners Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Website Banners</CardTitle>
                  <CardDescription>
                    Manage banners displayed on the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Existing Banners */}
                    <div className="grid gap-4">
                      {banners.map((banner) => (
                        <div key={banner.id} className="flex items-center gap-4 p-4 border rounded-md">
                          <div className="h-16 w-24 rounded-md overflow-hidden">
                            <img 
                              src={banner.image} 
                              alt={banner.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{banner.title}</h3>
                            <div className="flex items-center mt-1">
                              {banner.active ? (
                                <Badge className="bg-green-500">Active</Badge>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => toggleBannerActive(banner.id)}
                                >
                                  Set as Active
                                </Button>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteBanner(banner.id)}
                            title="Delete banner"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add New Banner */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Add New Banner</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="banner-title">Banner Title</Label>
                            <Input 
                              id="banner-title" 
                              value={newBanner.title}
                              onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                              placeholder="Enter banner title"
                            />
                          </div>
                          <ImageUploader 
                            onImageUpload={handleBannerImageUpload}
                            currentImage={newBanner.image}
                            label="Banner Image"
                          />
                          <Button onClick={addBanner} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Banner
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              {/* Pages Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Website Pages</CardTitle>
                  <CardDescription>
                    Manage content for static pages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pages.map((page) => (
                      <div key={page.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h3 className="font-medium">{page.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Last updated: {page.lastUpdated}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => startEditingPage(page)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Content
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Active Jam3a Deals Tab */}
        <TabsContent value="jam3a-deals">
          <Card>
            <CardHeader>
              <CardTitle>Active Jam3a Deals</CardTitle>
              <CardDescription>
                Manage and monitor active group buying deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Loading Jam3a deals...
                </div>
              ) : activeJam3aDeals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active Jam3a deals found.
                </div>
              ) : (
                <div className="space-y-6">
                  {activeJam3aDeals.map(deal => {
                    const product = getProductForDeal(deal.productId);
                    const progress = (deal.participants / deal.targetParticipants) * 100;
                    
                    return (
                      <div key={deal.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3 flex-grow">
                            {product?.image ? (
                              <div className="h-16 w-16 rounded-md overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                                <FileImage className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{product?.name || `Product #${deal.productId}`}</h3>
                              <p className="text-sm text-muted-foreground">{deal.category}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{deal.discountRate}% discount</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1 min-w-[140px]">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Progress:</span>
                              <span className="text-sm font-medium">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {deal.participants}/{deal.targetParticipants} participants
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Deal
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* FAQs Tab */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Manage FAQs displayed on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Existing FAQs */}
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="p-4 border rounded-md">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-medium">{faq.question}</h3>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFaq(faq.id)}
                          title="Delete FAQ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add New FAQ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add New FAQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="faq-question">Question</Label>
                        <Input 
                          id="faq-question" 
                          value={newFaq.question}
                          onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                          placeholder="Enter question"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faq-answer">Answer</Label>
                        <Textarea 
                          id="faq-answer" 
                          value={newFaq.answer}
                          onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                          placeholder="Enter answer"
                          rows={4}
                        />
                      </div>
                      <Button onClick={addFaq} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add FAQ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedContentManager;
