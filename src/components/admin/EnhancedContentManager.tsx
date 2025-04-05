import React, { useState, useEffect, useRef } from "react";
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
import { useProductContext } from "@/contexts/ProductContext";
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
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  captureImage();
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Use Camera
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Main Content Manager Component
const EnhancedContentManager = () => {
  const { toast } = useToast();
  const { products } = useProductContext();
  
  // Website sections content state
  const [content, setContent] = useState({
    about: {
      title: "About Jam3a",
      titleAr: "عن جمعة",
      content: "Jam3a is a collective buying platform that brings people together to get better deals on products they love. By pooling purchasing power, we negotiate discounts with suppliers and pass the savings to you.",
      contentAr: "جمعة هي منصة شراء جماعي تجمع الناس معًا للحصول على صفقات أفضل على المنتجات التي يحبونها. من خلال تجميع القوة الشرائية، نتفاوض على خصومات مع الموردين ونمرر التوفير إليك.",
      image: "/images/about-jam3a.jpg"
    },
    howItWorks: {
      title: "How Jam3a Works",
      titleAr: "كيف تعمل جمعة",
      steps: [
        {
          title: "Join or Start a Jam3a",
          titleAr: "انضم أو ابدأ جمعة",
          description: "Browse active deals or start your own Jam3a for a product you want.",
          descriptionAr: "تصفح الصفقات النشطة أو ابدأ جمعة خاصة بك لمنتج تريده."
        },
        {
          title: "Invite Friends",
          titleAr: "ادعُ الأصدقاء",
          description: "Share your Jam3a with friends and family to increase buying power.",
          descriptionAr: "شارك جمعتك مع الأصدقاء والعائلة لزيادة القوة الشرائية."
        },
        {
          title: "Reach Target",
          titleAr: "الوصول للهدف",
          description: "Once enough people join, we secure the group discount.",
          descriptionAr: "بمجرد انضمام عدد كافٍ من الأشخاص، نؤمن خصم المجموعة."
        },
        {
          title: "Get Your Product",
          titleAr: "احصل على منتجك",
          description: "We handle the purchase and delivery to all participants.",
          descriptionAr: "نتعامل مع الشراء والتسليم لجميع المشاركين."
        }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      titleAr: "الأسئلة الشائعة",
      questions: [
        {
          question: "How do I join a Jam3a?",
          questionAr: "كيف أنضم إلى جمعة؟",
          answer: "Browse active Jam3a deals on our homepage, select one you're interested in, and click 'Join Jam3a'. You'll need to create an account if you don't already have one.",
          answerAr: "تصفح صفقات جمعة النشطة على صفحتنا الرئيسية، واختر واحدة تهتم بها، وانقر على 'انضم للجمعة'. ستحتاج إلى إنشاء حساب إذا لم يكن لديك حساب بالفعل."
        },
        {
          question: "How much can I save with Jam3a?",
          questionAr: "كم يمكنني أن أوفر مع جمعة؟",
          answer: "Savings vary by product and group size, but typically range from 10% to 30% off retail prices. The more people join, the better the discount!",
          answerAr: "تختلف التوفيرات حسب المنتج وحجم المجموعة، ولكنها تتراوح عادة من 10٪ إلى 30٪ من أسعار التجزئة. كلما انضم المزيد من الأشخاص، كان الخصم أفضل!"
        },
        {
          question: "When will I receive my product?",
          questionAr: "متى سأستلم منتجي؟",
          answer: "Once a Jam3a reaches its target, we process the order within 1-2 business days. Delivery times vary by product and location, but you'll receive regular updates on your order status.",
          answerAr: "بمجرد وصول جمعة إلى هدفها، نعالج الطلب في غضون 1-2 يوم عمل. تختلف أوقات التسليم حسب المنتج والموقع، ولكنك ستتلقى تحديثات منتظمة حول حالة طلبك."
        },
        {
          question: "Can I start my own Jam3a?",
          questionAr: "هل يمكنني بدء جمعة خاصة بي؟",
          answer: "Absolutely! Click 'Start a Jam3a' on our homepage, select a product category, and follow the simple setup process. You can invite friends directly or let others discover and join your Jam3a.",
          answerAr: "بالتأكيد! انقر على 'ابدأ جمعة' على صفحتنا الرئيسية، واختر فئة المنتج، واتبع عملية الإعداد البسيطة. يمكنك دعوة الأصدقاء مباشرة أو السماح للآخرين باكتشاف جمعتك والانضمام إليها."
        },
        {
          question: "What happens if a Jam3a doesn't reach its target?",
          questionAr: "ماذا يحدث إذا لم تصل جمعة إلى هدفها؟",
          answer: "If a Jam3a doesn't reach its minimum participant target within the specified timeframe, you'll receive a full refund of any deposit paid. Alternatively, you can choose to join another active Jam3a.",
          answerAr: "إذا لم تصل جمعة إلى الحد الأدنى من المشاركين المستهدفين خلال الإطار الزمني المحدد، فستتلقى استردادًا كاملاً لأي وديعة مدفوعة. بدلاً من ذلك، يمكنك اختيار الانضمام إلى جمعة نشطة أخرى."
        }
      ]
    },
    banners: {
      hero: {
        title: "Join the Collective. Save Together.",
        titleAr: "انضم للجماعة. وفر معًا.",
        subtitle: "Get up to 30% off retail prices when you buy with others.",
        subtitleAr: "احصل على خصم يصل إلى 30٪ من أسعار التجزئة عند الشراء مع الآخرين.",
        buttonText: "Browse Deals",
        buttonTextAr: "تصفح الصفقات",
        image: "/images/hero-banner.jpg"
      },
      featured: {
        title: "Featured Deals",
        titleAr: "صفقات مميزة",
        subtitle: "Popular products with the biggest savings",
        subtitleAr: "منتجات شعبية مع أكبر توفير",
        image: "/images/featured-banner.jpg"
      }
    }
  });
  
  // State for the section being edited
  const [editingSection, setEditingSection] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  
  // Handle content updates
  const handleContentUpdate = (section, updatedContent) => {
    setContent({
      ...content,
      [section]: updatedContent
    });
    
    // In a real implementation, this would save to a database
    toast({
      title: "Content Updated",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} section has been updated.`,
    });
    
    setEditingSection(null);
    setEditingContent(null);
  };
  
  // Start editing a section
  const startEditing = (section) => {
    setEditingSection(section);
    setEditingContent(JSON.parse(JSON.stringify(content[section])));
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingSection(null);
    setEditingContent(null);
  };
  
  // Handle image upload for a section
  const handleImageUpload = (section, imageUrl) => {
    setEditingContent({
      ...editingContent,
      image: imageUrl
    });
  };
  
  // Render the About section editor
  const renderAboutEditor = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit About Section</CardTitle>
          <CardDescription>Update the about section content and image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="about-title">Title (English)</Label>
                <Input 
                  id="about-title"
                  value={editingContent.title}
                  onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="about-title-ar">Title (Arabic)</Label>
                <Input 
                  id="about-title-ar"
                  value={editingContent.titleAr}
                  onChange={(e) => setEditingContent({...editingContent, titleAr: e.target.value})}
                  dir="rtl"
                />
              </div>
            </div>
            
            <ImageUploader 
              onImageUpload={(url) => handleImageUpload('about', url)}
              currentImage={editingContent.image}
              label="About Image"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="about-content">Content (English)</Label>
              <Textarea 
                id="about-content"
                value={editingContent.content}
                onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="about-content-ar">Content (Arabic)</Label>
              <Textarea 
                id="about-content-ar"
                value={editingContent.contentAr}
                onChange={(e) => setEditingContent({...editingContent, contentAr: e.target.value})}
                rows={6}
                dir="rtl"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
          <Button onClick={() => handleContentUpdate('about', editingContent)}>Save Changes</Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render the How It Works section editor
  const renderHowItWorksEditor = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit How It Works Section</CardTitle>
          <CardDescription>Update the steps and process explanation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hiw-title">Title (English)</Label>
              <Input 
                id="hiw-title"
                value={editingContent.title}
                onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="hiw-title-ar">Title (Arabic)</Label>
              <Input 
                id="hiw-title-ar"
                value={editingContent.titleAr}
                onChange={(e) => setEditingContent({...editingContent, titleAr: e.target.value})}
                dir="rtl"
              />
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Steps</h3>
            {editingContent.steps.map((step, index) => (
              <div key={index} className="mb-6 p-4 border rounded-md">
                <h4 className="font-medium mb-2">Step {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`step-${index}-title`}>Title (English)</Label>
                    <Input 
                      id={`step-${index}-title`}
                      value={step.title}
                      onChange={(e) => {
                        const updatedSteps = [...editingContent.steps];
                        updatedSteps[index].title = e.target.value;
                        setEditingContent({...editingContent, steps: updatedSteps});
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`step-${index}-title-ar`}>Title (Arabic)</Label>
                    <Input 
                      id={`step-${index}-title-ar`}
                      value={step.titleAr}
                      onChange={(e) => {
                        const updatedSteps = [...editingContent.steps];
                        updatedSteps[index].titleAr = e.target.value;
                        setEditingContent({...editingContent, steps: updatedSteps});
                      }}
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`step-${index}-desc`}>Description (English)</Label>
                    <Textarea 
                      id={`step-${index}-desc`}
                      value={step.description}
                      onChange={(e) => {
                        const updatedSteps = [...editingContent.steps];
                        updatedSteps[index].description = e.target.value;
                        setEditingContent({...editingContent, steps: updatedSteps});
                      }}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`step-${index}-desc-ar`}>Description (Arabic)</Label>
                    <Textarea 
                      id={`step-${index}-desc-ar`}
                      value={step.descriptionAr}
                      onChange={(e) => {
                        const updatedSteps = [...editingContent.steps];
                        updatedSteps[index].descriptionAr = e.target.value;
                        setEditingContent({...editingContent, steps: updatedSteps});
                      }}
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
                
                {editingContent.steps.length > 2 && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        const updatedSteps = [...editingContent.steps];
                        updatedSteps.splice(index, 1);
                        setEditingContent({...editingContent, steps: updatedSteps});
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Step
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => {
                const newStep = {
                  title: "New Step",
                  titleAr: "خطوة جديدة",
                  description: "Description for this step",
                  descriptionAr: "وصف لهذه الخطوة"
                };
                setEditingContent({
                  ...editingContent, 
                  steps: [...editingContent.steps, newStep]
                });
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
          <Button onClick={() => handleContentUpdate('howItWorks', editingContent)}>Save Changes</Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render the FAQ section editor
  const renderFaqEditor = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit FAQ Section</CardTitle>
          <CardDescription>Update frequently asked questions and answers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="faq-title">Title (English)</Label>
              <Input 
                id="faq-title"
                value={editingContent.title}
                onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="faq-title-ar">Title (Arabic)</Label>
              <Input 
                id="faq-title-ar"
                value={editingContent.titleAr}
                onChange={(e) => setEditingContent({...editingContent, titleAr: e.target.value})}
                dir="rtl"
              />
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Questions</h3>
            {editingContent.questions.map((item, index) => (
              <div key={index} className="mb-6 p-4 border rounded-md">
                <h4 className="font-medium mb-2">Question {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`q-${index}-question`}>Question (English)</Label>
                    <Input 
                      id={`q-${index}-question`}
                      value={item.question}
                      onChange={(e) => {
                        const updatedQuestions = [...editingContent.questions];
                        updatedQuestions[index].question = e.target.value;
                        setEditingContent({...editingContent, questions: updatedQuestions});
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`q-${index}-question-ar`}>Question (Arabic)</Label>
                    <Input 
                      id={`q-${index}-question-ar`}
                      value={item.questionAr}
                      onChange={(e) => {
                        const updatedQuestions = [...editingContent.questions];
                        updatedQuestions[index].questionAr = e.target.value;
                        setEditingContent({...editingContent, questions: updatedQuestions});
                      }}
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`q-${index}-answer`}>Answer (English)</Label>
                    <Textarea 
                      id={`q-${index}-answer`}
                      value={item.answer}
                      onChange={(e) => {
                        const updatedQuestions = [...editingContent.questions];
                        updatedQuestions[index].answer = e.target.value;
                        setEditingContent({...editingContent, questions: updatedQuestions});
                      }}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`q-${index}-answer-ar`}>Answer (Arabic)</Label>
                    <Textarea 
                      id={`q-${index}-answer-ar`}
                      value={item.answerAr}
                      onChange={(e) => {
                        const updatedQuestions = [...editingContent.questions];
                        updatedQuestions[index].answerAr = e.target.value;
                        setEditingContent({...editingContent, questions: updatedQuestions});
                      }}
                      rows={4}
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      const updatedQuestions = [...editingContent.questions];
                      updatedQuestions.splice(index, 1);
                      setEditingContent({...editingContent, questions: updatedQuestions});
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Question
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => {
                const newQuestion = {
                  question: "New Question",
                  questionAr: "سؤال جديد",
                  answer: "Answer to the question",
                  answerAr: "إجابة على السؤال"
                };
                setEditingContent({
                  ...editingContent, 
                  questions: [...editingContent.questions, newQuestion]
                });
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
          <Button onClick={() => handleContentUpdate('faq', editingContent)}>Save Changes</Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render the Banners section editor
  const renderBannersEditor = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Banners</CardTitle>
          <CardDescription>Update website banners and promotional content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Hero Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Title (English)</Label>
                  <Input 
                    id="hero-title"
                    value={editingContent.hero.title}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      hero: {...editingContent.hero, title: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="hero-title-ar">Title (Arabic)</Label>
                  <Input 
                    id="hero-title-ar"
                    value={editingContent.hero.titleAr}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      hero: {...editingContent.hero, titleAr: e.target.value}
                    })}
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle">Subtitle (English)</Label>
                  <Input 
                    id="hero-subtitle"
                    value={editingContent.hero.subtitle}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      hero: {...editingContent.hero, subtitle: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle-ar">Subtitle (Arabic)</Label>
                  <Input 
                    id="hero-subtitle-ar"
                    value={editingContent.hero.subtitleAr}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      hero: {...editingContent.hero, subtitleAr: e.target.value}
                    })}
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-button">Button Text (English)</Label>
                  <Input 
                    id="hero-button"
                    value={editingContent.hero.buttonText}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      hero: {...editingContent.hero, buttonText: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="hero-button-ar">Button Text (Arabic)</Label>
                  <Input 
                    id="hero-button-ar"
                    value={editingContent.hero.buttonTextAr}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      hero: {...editingContent.hero, buttonTextAr: e.target.value}
                    })}
                    dir="rtl"
                  />
                </div>
              </div>
              
              <ImageUploader 
                onImageUpload={(url) => setEditingContent({
                  ...editingContent,
                  hero: {...editingContent.hero, image: url}
                })}
                currentImage={editingContent.hero.image}
                label="Hero Banner Image"
              />
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Featured Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="featured-title">Title (English)</Label>
                  <Input 
                    id="featured-title"
                    value={editingContent.featured.title}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      featured: {...editingContent.featured, title: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="featured-title-ar">Title (Arabic)</Label>
                  <Input 
                    id="featured-title-ar"
                    value={editingContent.featured.titleAr}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      featured: {...editingContent.featured, titleAr: e.target.value}
                    })}
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="featured-subtitle">Subtitle (English)</Label>
                  <Input 
                    id="featured-subtitle"
                    value={editingContent.featured.subtitle}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      featured: {...editingContent.featured, subtitle: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="featured-subtitle-ar">Subtitle (Arabic)</Label>
                  <Input 
                    id="featured-subtitle-ar"
                    value={editingContent.featured.subtitleAr}
                    onChange={(e) => setEditingContent({
                      ...editingContent, 
                      featured: {...editingContent.featured, subtitleAr: e.target.value}
                    })}
                    dir="rtl"
                  />
                </div>
              </div>
              
              <ImageUploader 
                onImageUpload={(url) => setEditingContent({
                  ...editingContent,
                  featured: {...editingContent.featured, image: url}
                })}
                currentImage={editingContent.featured.image}
                label="Featured Banner Image"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
          <Button onClick={() => handleContentUpdate('banners', editingContent)}>Save Changes</Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render the appropriate editor based on the section being edited
  const renderEditor = () => {
    switch(editingSection) {
      case 'about':
        return renderAboutEditor();
      case 'howItWorks':
        return renderHowItWorksEditor();
      case 'faq':
        return renderFaqEditor();
      case 'banners':
        return renderBannersEditor();
      default:
        return null;
    }
  };
  
  // Render the content preview for a section
  const renderContentPreview = (section, sectionData) => {
    switch(section) {
      case 'about':
        return (
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{sectionData.title}</h3>
                <h3 className="text-xl font-bold text-right" dir="rtl">{sectionData.titleAr}</h3>
              </div>
              {sectionData.image && (
                <img 
                  src={sectionData.image} 
                  alt="About" 
                  className="w-24 h-24 object-cover rounded-md"
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{sectionData.content}</p>
            <p className="text-sm text-muted-foreground text-right" dir="rtl">{sectionData.contentAr}</p>
          </div>
        );
      
      case 'howItWorks':
        return (
          <div className="p-4 border rounded-md">
            <h3 className="text-xl font-bold mb-4">{sectionData.title} / {sectionData.titleAr}</h3>
            <div className="space-y-4">
              {sectionData.steps.map((step, index) => (
                <div key={index} className="p-2 border-b">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{step.title}</h4>
                    <h4 className="font-medium text-right" dir="rtl">{step.titleAr}</h4>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p>{step.description}</p>
                    <p className="text-right" dir="rtl">{step.descriptionAr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'faq':
        return (
          <div className="p-4 border rounded-md">
            <h3 className="text-xl font-bold mb-4">{sectionData.title} / {sectionData.titleAr}</h3>
            <div className="space-y-4">
              {sectionData.questions.map((item, index) => (
                <div key={index} className="p-2 border-b">
                  <div className="flex justify-between font-medium">
                    <h4>{item.question}</h4>
                    <h4 className="text-right" dir="rtl">{item.questionAr}</h4>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <p>{item.answer.substring(0, 50)}...</p>
                    <p className="text-right" dir="rtl">{item.answerAr.substring(0, 50)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'banners':
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Hero Banner</h3>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-bold">{sectionData.hero.title}</h4>
                  <h4 className="font-bold text-right" dir="rtl">{sectionData.hero.titleAr}</h4>
                  <p className="text-sm text-muted-foreground">{sectionData.hero.subtitle}</p>
                  <p className="text-sm text-muted-foreground text-right" dir="rtl">{sectionData.hero.subtitleAr}</p>
                  <div className="mt-2 inline-block bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm">
                    {sectionData.hero.buttonText} / {sectionData.hero.buttonTextAr}
                  </div>
                </div>
                {sectionData.hero.image && (
                  <img 
                    src={sectionData.hero.image} 
                    alt="Hero Banner" 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Featured Banner</h3>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-bold">{sectionData.featured.title}</h4>
                  <h4 className="font-bold text-right" dir="rtl">{sectionData.featured.titleAr}</h4>
                  <p className="text-sm text-muted-foreground">{sectionData.featured.subtitle}</p>
                  <p className="text-sm text-muted-foreground text-right" dir="rtl">{sectionData.featured.subtitleAr}</p>
                </div>
                {sectionData.featured.image && (
                  <img 
                    src={sectionData.featured.image} 
                    alt="Featured Banner" 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Content
        </Button>
      </div>
      
      {editingSection ? (
        renderEditor()
      ) : (
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="howItWorks">How It Works</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Manage the about section content and image</CardDescription>
              </CardHeader>
              <CardContent>
                {renderContentPreview('about', content.about)}
              </CardContent>
              <CardFooter>
                <Button onClick={() => startEditing('about')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit About Section
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="howItWorks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How It Works Section</CardTitle>
                <CardDescription>Manage the process steps and explanation</CardDescription>
              </CardHeader>
              <CardContent>
                {renderContentPreview('howItWorks', content.howItWorks)}
              </CardContent>
              <CardFooter>
                <Button onClick={() => startEditing('howItWorks')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit How It Works
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>FAQ Section</CardTitle>
                <CardDescription>Manage frequently asked questions and answers</CardDescription>
              </CardHeader>
              <CardContent>
                {renderContentPreview('faq', content.faq)}
              </CardContent>
              <CardFooter>
                <Button onClick={() => startEditing('faq')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit FAQ Section
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="banners" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Banners</CardTitle>
                <CardDescription>Manage hero and featured section banners</CardDescription>
              </CardHeader>
              <CardContent>
                {renderContentPreview('banners', content.banners)}
              </CardContent>
              <CardFooter>
                <Button onClick={() => startEditing('banners')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Banners
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EnhancedContentManager;
