import React, { useState, useEffect } from 'react';
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
import { useContent } from '@/contexts/ContentContext';
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

const EnhancedContentManagerWithContext = () => {
  const [activeTab, setActiveTab] = useState("website-content");
  const [editingContent, setEditingContent] = useState(null);
  const [newBanner, setNewBanner] = useState({ title: '', image: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newStep, setNewStep] = useState({ title: '', description: '' });
  const { toast } = useToast();
  
  // Use the ContentContext
  const { 
    contentItems, 
    getContentByType, 
    updateContent, 
    refreshContent, 
    isLoading, 
    error 
  } = useContent();

  // Get content by type
  const aboutContent = getContentByType('about');
  const faqContent = getContentByType('faq');
  const howItWorksContent = getContentByType('how-it-works');
  const homeContent = getContentByType('home');

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

    if (!homeContent) {
      toast({
        title: "Error",
        description: "Home content not found.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(0, ...homeContent.banners.map(b => b.id)) + 1;
    const updatedBanners = [...homeContent.banners, { ...newBanner, id: newId, active: false }];
    
    updateContent({
      ...homeContent,
      banners: updatedBanners
    });
    
    setNewBanner({ title: '', image: '' });
    
    toast({
      title: "Banner Added",
      description: "New banner has been added successfully.",
    });
  };

  // Toggle banner active state
  const toggleBannerActive = (id) => {
    if (!homeContent) return;
    
    const updatedBanners = homeContent.banners.map(banner => 
      banner.id === id 
        ? { ...banner, active: true } 
        : { ...banner, active: false }
    );
    
    updateContent({
      ...homeContent,
      banners: updatedBanners
    });
    
    toast({
      title: "Banner Updated",
      description: "Banner status has been updated.",
    });
  };

  // Delete banner
  const deleteBanner = (id) => {
    if (!homeContent) return;
    
    const updatedBanners = homeContent.banners.filter(banner => banner.id !== id);
    
    updateContent({
      ...homeContent,
      banners: updatedBanners
    });
    
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

    if (!faqContent) {
      toast({
        title: "Error",
        description: "FAQ content not found.",
        variant: "destructive"
      });
      return;
    }

    const updatedFaqs = [...faqContent.faqs, { ...newFaq }];
    
    updateContent({
      ...faqContent,
      faqs: updatedFaqs
    });
    
    setNewFaq({ question: '', answer: '' });
    
    toast({
      title: "FAQ Added",
      description: "New FAQ has been added successfully.",
    });
  };

  // Delete FAQ
  const deleteFaq = (index) => {
    if (!faqContent) return;
    
    const updatedFaqs = [...faqContent.faqs];
    updatedFaqs.splice(index, 1);
    
    updateContent({
      ...faqContent,
      faqs: updatedFaqs
    });
    
    toast({
      title: "FAQ Deleted",
      description: "FAQ has been deleted successfully.",
    });
  };

  // Add new How It Works step
  const addStep = () => {
    if (!newStep.title || !newStep.description) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and description for the step.",
        variant: "destructive"
      });
      return;
    }

    if (!howItWorksContent) {
      toast({
        title: "Error",
        description: "How It Works content not found.",
        variant: "destructive"
      });
      return;
    }

    const updatedSteps = [...howItWorksContent.steps, { ...newStep }];
    
    updateContent({
      ...howItWorksContent,
      steps: updatedSteps
    });
    
    setNewStep({ title: '', description: '' });
    
    toast({
      title: "Step Added",
      description: "New step has been added successfully.",
    });
  };

  // Delete step
  const deleteStep = (index) => {
    if (!howItWorksContent) return;
    
    const updatedSteps = [...howItWorksContent.steps];
    updatedSteps.splice(index, 1);
    
    updateContent({
      ...howItWorksContent,
      steps: updatedSteps
    });
    
    toast({
      title: "Step Deleted",
      description: "Step has been deleted successfully.",
    });
  };

  // Update About content
  const updateAboutContent = (newContent) => {
    if (!aboutContent) return;
    
    updateContent({
      ...aboutContent,
      content: newContent
    });
    
    toast({
      title: "Content Updated",
      description: "About content has been updated successfully.",
    });
  };

  // Handle refreshing data
  const handleRefresh = async () => {
    try {
      await refreshContent();
      
      toast({
        title: "Content Refreshed",
        description: "Content data has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh content. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Enhanced Content Management</h2>
        <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
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

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="website-content" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="website-content">About</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>
        
        {/* About Content Tab */}
        <TabsContent value="website-content">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
              <CardDescription>
                Manage the content for the About page
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Loading content...
                </div>
              ) : aboutContent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="about-title">Page Title</Label>
                    <Input 
                      id="about-title" 
                      value={aboutContent.title}
                      onChange={(e) => updateContent({...aboutContent, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-content">Page Content</Label>
                    <Textarea 
                      id="about-content" 
                      value={aboutContent.content}
                      onChange={(e) => updateContent({...aboutContent, content: e.target.value})}
                      rows={10}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => updateAboutContent(aboutContent.content)}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  About content not found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* How It Works Tab */}
        <TabsContent value="how-it-works">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Manage the steps for the How It Works section
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Loading content...
                </div>
              ) : howItWorksContent ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="how-it-works-title">Section Title</Label>
                    <Input 
                      id="how-it-works-title" 
                      value={howItWorksContent.title}
                      onChange={(e) => updateContent({...howItWorksContent, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Steps</h3>
                    {howItWorksContent.steps.map((step, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-grow">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs">
                                {index + 1}
                              </div>
                              <h3 className="font-medium">{step.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteStep(index)}
                            title="Delete step"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add New Step */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Add New Step</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="step-title">Step Title</Label>
                          <Input 
                            id="step-title" 
                            value={newStep.title}
                            onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                            placeholder="Enter step title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="step-description">Step Description</Label>
                          <Textarea 
                            id="step-description" 
                            value={newStep.description}
                            onChange={(e) => setNewStep({...newStep, description: e.target.value})}
                            placeholder="Enter step description"
                            rows={3}
                          />
                        </div>
                        <Button onClick={addStep} className="w-full">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Step
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  How It Works content not found.
                </p>
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
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Loading content...
                </div>
              ) : faqContent ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="faq-title">Section Title</Label>
                    <Input 
                      id="faq-title" 
                      value={faqContent.title}
                      onChange={(e) => updateContent({...faqContent, title: e.target.value})}
                    />
                  </div>
                  
                  {/* Existing FAQs */}
                  <div className="space-y-4">
                    {faqContent.faqs.map((faq, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-grow">
                            <h3 className="font-medium">{faq.question}</h3>
                            <p className="text-sm text-muted-foreground">{faq.answer}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteFaq(index)}
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
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  FAQ content not found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Banners Tab */}
        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Website Banners</CardTitle>
              <CardDescription>
                Manage banners displayed on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Loading content...
                </div>
              ) : homeContent ? (
                <div className="space-y-6">
                  {/* Existing Banners */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Current Banners</h3>
                    {homeContent.banners.map((banner) => (
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
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  Home content not found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Wrap the component with ContentProvider in the parent component
const EnhancedContentManagerWithProvider = () => {
  return (
    <ContentProvider>
      <EnhancedContentManagerWithContext />
    </ContentProvider>
  );
};

export default EnhancedContentManagerWithProvider;
