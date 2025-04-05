import React, { useState, useRef } from "react";
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
import { ImagePlus, X, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock must be a positive integer"),
  description: z.string().min(1, "Description is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData: {
    id?: number;
    name?: string;
    category?: string;
    price?: number;
    stock?: number;
    description?: string;
    image?: string;
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
  }
};

// Default to Cloudinary for production
const DEFAULT_UPLOAD_SERVICE = UPLOAD_SERVICES.CLOUDINARY;

const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(initialData.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData.name || "",
      category: initialData.category || "",
      price: initialData.price || 0,
      stock: initialData.stock || 0,
      description: initialData.description || "",
    },
  });

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
      if (DEFAULT_UPLOAD_SERVICE === UPLOAD_SERVICES.CLOUDINARY) {
        formData.append('file', file);
        formData.append('upload_preset', DEFAULT_UPLOAD_SERVICE.uploadPreset);
        formData.append('cloud_name', DEFAULT_UPLOAD_SERVICE.cloudName);
      } else if (DEFAULT_UPLOAD_SERVICE === UPLOAD_SERVICES.IMGBB) {
        formData.append('image', file);
        formData.append('key', DEFAULT_UPLOAD_SERVICE.apiKey);
      }

      const response = await axios.post(DEFAULT_UPLOAD_SERVICE.uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });

      // Handle different response formats
      let imageUrl = '';
      if (DEFAULT_UPLOAD_SERVICE === UPLOAD_SERVICES.CLOUDINARY) {
        imageUrl = response.data.secure_url;
      } else if (DEFAULT_UPLOAD_SERVICE === UPLOAD_SERVICES.IMGBB) {
        imageUrl = response.data.data.url;
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
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
                    <FormLabel>Price ($)</FormLabel>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
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
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop an image, or{" "}
                    <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or GIF up to 10MB
                  </p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
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

            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}

            <Card className="bg-muted/50 mt-4">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-2">Image Upload Tips:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Use high-quality images with good lighting</li>
                  <li>• Recommended size: 1200 x 1200 pixels</li>
                  <li>• Keep file size under 5MB for faster uploads</li>
                  <li>• Use a white or neutral background</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUploading}>
            {initialData.id ? "Update" : "Create"} Product
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
