import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X, Upload, Check, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock must be a positive integer"),
  description: z.string().min(1, "Description is required"),
  nameAr: z.string().optional(),
  descriptionAr: z.string().optional(),
  discount: z.coerce.number().min(0).max(100, "Discount must be between 0 and 100").optional(),
  featured: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData: {
    id?: number;
    name?: string;
    nameAr?: string;
    category?: string;
    price?: number;
    stock?: number;
    description?: string;
    descriptionAr?: string;
    image?: string;
    discount?: number;
    featured?: boolean;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

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
  }
};

// Default to Cloudinary for production
const DEFAULT_UPLOAD_SERVICE = UPLOAD_SERVICES.CLOUDINARY;

// Product categories
const PRODUCT_CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion & Apparel" },
  { value: "home", label: "Home & Kitchen" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "toys", label: "Toys & Games" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "automotive", label: "Automotive" },
  { value: "books", label: "Books & Media" },
  { value: "health", label: "Health & Wellness" },
  { value: "grocery", label: "Grocery & Food" },
  { value: "other", label: "Other" },
];

const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(initialData.image || "");
  const [selectedUploadService, setSelectedUploadService] = useState(DEFAULT_UPLOAD_SERVICE);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("english");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData.name || "",
      nameAr: initialData.nameAr || "",
      category: initialData.category || "",
      price: initialData.price || 0,
      stock: initialData.stock || 0,
      description: initialData.description || "",
      descriptionAr: initialData.descriptionAr || "",
      discount: initialData.discount || 0,
      featured: initialData.featured || false,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        nameAr: initialData.nameAr || "",
        category: initialData.category || "",
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        description: initialData.description || "",
        descriptionAr: initialData.descriptionAr || "",
        discount: initialData.discount || 0,
        featured: initialData.featured || false,
      });
      setImagePreview(initialData.image || null);
      setUploadedImageUrl(initialData.image || "");
    }
  }, [initialData, form]);

  const handleSubmit = (data: ProductFormValues) => {
    if (!uploadedImageUrl && !initialData.image) {
      toast({
        title: "Image Required",
        description: "Please upload a product image",
        variant: "destructive",
      });
      return;
    }

    const formattedData = {
      ...data,
      id: initialData.id,
      image: uploadedImageUrl || initialData.image,
    };
    onSubmit(formattedData);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

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
      handleImageUpload(files[0]);
    }
  };

  const handleImageUpload = async (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      setUploadError("Please select an image file");
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit");
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
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");

    try {
      let formData = new FormData();
      
      // Configure based on selected service
      if (selectedUploadService === UPLOAD_SERVICES.CLOUDINARY) {
        formData.append('file', file);
        formData.append('upload_preset', selectedUploadService.uploadPreset);
        formData.append('cloud_name', selectedUploadService.cloudName);
      } else if (selectedUploadService === UPLOAD_SERVICES.IMGBB) {
        formData.append('image', file);
        formData.append('key', selectedUploadService.apiKey);
      } else if (selectedUploadService === UPLOAD_SERVICES.LOCAL) {
        formData.append('file', file);
      }

      const response = await axios.post(selectedUploadService.uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });

      // Handle different response formats
      let imageUrl = '';
      if (selectedUploadService === UPLOAD_SERVICES.CLOUDINARY) {
        imageUrl = response.data.secure_url;
      } else if (selectedUploadService === UPLOAD_SERVICES.IMGBB) {
        imageUrl = response.data.data.url;
      } else if (selectedUploadService === UPLOAD_SERVICES.LOCAL) {
        imageUrl = response.data.url;
      }

      setUploadedImageUrl(imageUrl);
      
      toast({
        title: "Upload successful",
        description: "Your product image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="english">English</TabsTrigger>
            <TabsTrigger value="arabic">Arabic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="english" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter product description" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="arabic" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name (Arabic)</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المنتج" {...field} dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Arabic)</FormLabel>
                  <FormControl>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="أدخل وصف المنتج" 
                      {...field} 
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (SAR)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        min="0" 
                        step="0.01" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        step="1" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100" 
                        step="1" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-2 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Featured Product
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <FormLabel>Product Image</FormLabel>
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onClick={handleImageClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="mx-auto max-h-64 rounded-md object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-2 right-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    Drag and drop an image, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <FormLabel>Upload Service</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(UPLOAD_SERVICES).map((service) => (
                  <Button
                    key={service.name}
                    type="button"
                    variant={selectedUploadService === service ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedUploadService(service)}
                    className="w-full"
                  >
                    {selectedUploadService === service && (
                      <Check className="mr-1 h-3 w-3" />
                    )}
                    {service.name}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select where to upload your product images
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData.id ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
