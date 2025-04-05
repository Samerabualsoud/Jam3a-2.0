import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Search, Image, ExternalLink, RefreshCw, Upload, Download, Filter, ArrowUpDown, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ProductForm from "./ProductForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useProductContext } from "@/contexts/ProductContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';

// Product interface
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  nameAr?: string;
  descriptionAr?: string;
  currentAmount?: number;
  targetAmount?: number;
  participants?: number;
  featured?: boolean;
  discount?: number;
  originalPrice?: number;
  averageJoinRate?: number;
  supplier?: string;
  sku?: string;
  status?: 'active' | 'inactive' | 'draft';
  tags?: string[];
  dateAdded?: string;
  lastUpdated?: string;
}

// Bulk import/export interface
interface BulkOperation {
  isImporting: boolean;
  isExporting: boolean;
  file: File | null;
  progress: number;
  error: string;
}

// Filter interface
interface ProductFilters {
  category: string;
  priceRange: [number, number];
  featured: boolean | null;
  status: string;
  inStock: boolean | null;
}

const EnhancedProductsManager = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [bulkOperation, setBulkOperation] = useState<BulkOperation>({
    isImporting: false,
    isExporting: false,
    file: null,
    progress: 0,
    error: ""
  });
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState<{key: keyof Product, direction: 'asc' | 'desc'}>({
    key: 'id',
    direction: 'asc'
  });
  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    priceRange: [0, 10000],
    featured: null,
    status: '',
    inStock: null
  });
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isDuplicatingProduct, setIsDuplicatingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  // Use the product context for direct sync with website
  const { products, setProducts, refreshProducts, syncStatus, isLoading } = useProductContext();

  // Initialize with current date for new products
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Add dateAdded and lastUpdated to products that don't have them
    const updatedProducts = products.map(product => {
      if (!product.dateAdded) {
        return {
          ...product,
          dateAdded: currentDate,
          lastUpdated: currentDate,
          status: product.status || 'active'
        };
      }
      return product;
    });
    
    if (JSON.stringify(updatedProducts) !== JSON.stringify(products)) {
      setProducts(updatedProducts);
    }
  }, [products, setProducts]);

  const handleAddProduct = (product: Product) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const newProduct = { 
      ...product, 
      id: Math.max(0, ...products.map(p => p.id)) + 1,
      dateAdded: currentDate,
      lastUpdated: currentDate,
      status: product.status || 'active'
    };
    
    setProducts([...products, newProduct]);
    setIsAddingProduct(false);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added successfully and synced with the website.`,
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const productWithDate = {
      ...updatedProduct,
      lastUpdated: currentDate
    };
    
    setProducts(
      products.map((p) => (p.id === productWithDate.id ? productWithDate : p))
    );
    setEditingProduct(null);
    
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated successfully and synced with the website.`,
    });
  };

  const handleDeleteProduct = (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;
    
    setProducts(products.filter((p) => p.id !== id));
    
    toast({
      title: "Product Deleted",
      description: `${productToDelete.name} has been deleted and removed from the website.`,
    });
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    
    const updatedProducts = products.filter(p => !selectedProducts.includes(p.id));
    setProducts(updatedProducts);
    setSelectedProducts([]);
    
    toast({
      title: "Bulk Delete Successful",
      description: `${selectedProducts.length} products have been deleted.`,
    });
  };

  const handleDuplicateProduct = (product: Product) => {
    setIsDuplicatingProduct({
      ...product,
      id: 0, // Will be assigned a new ID when added
      name: `${product.name} (Copy)`,
      nameAr: product.nameAr ? `${product.nameAr} (نسخة)` : undefined
    });
  };

  const handleCreateDuplicate = (duplicatedProduct: Product) => {
    handleAddProduct(duplicatedProduct);
    setIsDuplicatingProduct(null);
  };

  const handleBulkExport = () => {
    // Prepare products for export
    const productsToExport = selectedProducts.length > 0
      ? products.filter(p => selectedProducts.includes(p.id))
      : products;
    
    // Convert to JSON
    const jsonData = JSON.stringify(productsToExport, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jam3a-products-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    toast({
      title: "Export Successful",
      description: `${productsToExport.length} products have been exported.`,
    });
  };

  const handleBulkImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setBulkOperation({
      ...bulkOperation,
      file,
      isImporting: true,
      progress: 0,
      error: ""
    });
    
    // Read the file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedProducts = JSON.parse(event.target?.result as string) as Product[];
        
        // Validate imported data
        if (!Array.isArray(importedProducts)) {
          throw new Error("Invalid import format. Expected an array of products.");
        }
        
        // Process imported products
        const currentDate = new Date().toISOString().split('T')[0];
        const highestId = Math.max(0, ...products.map(p => p.id));
        
        const processedProducts = importedProducts.map((product, index) => ({
          ...product,
          id: highestId + index + 1, // Assign new IDs to avoid conflicts
          lastUpdated: currentDate,
          dateAdded: product.dateAdded || currentDate
        }));
        
        // Update products
        setProducts([...products, ...processedProducts]);
        
        // Complete import
        setBulkOperation({
          ...bulkOperation,
          isImporting: false,
          progress: 100,
          error: ""
        });
        
        toast({
          title: "Import Successful",
          description: `${processedProducts.length} products have been imported.`,
        });
      } catch (error) {
        setBulkOperation({
          ...bulkOperation,
          isImporting: false,
          progress: 0,
          error: "Failed to import products. Please check the file format."
        });
        
        toast({
          title: "Import Failed",
          description: "Failed to import products. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setBulkOperation({
          ...bulkOperation,
          progress
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleToggleProductSelection = (id: number) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(productId => productId !== id) 
        : [...prev, id]
    );
  };

  const handleToggleAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkUpdateStatus = (status: 'active' | 'inactive' | 'draft') => {
    if (selectedProducts.length === 0) return;
    
    const updatedProducts = products.map(product => 
      selectedProducts.includes(product.id) 
        ? { ...product, status, lastUpdated: new Date().toISOString().split('T')[0] } 
        : product
    );
    
    setProducts(updatedProducts);
    
    toast({
      title: "Bulk Update Successful",
      description: `${selectedProducts.length} products have been updated to "${status}" status.`,
    });
  };

  const handleBulkUpdateFeatured = (featured: boolean) => {
    if (selectedProducts.length === 0) return;
    
    const updatedProducts = products.map(product => 
      selectedProducts.includes(product.id) 
        ? { ...product, featured, lastUpdated: new Date().toISOString().split('T')[0] } 
        : product
    );
    
    setProducts(updatedProducts);
    
    toast({
      title: "Bulk Update Successful",
      description: `${selectedProducts.length} products have been ${featured ? 'marked as featured' : 'unmarked as featured'}.`,
    });
  };

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 10000],
      featured: null,
      status: '',
      inStock: null
    });
  };

  // Apply filters
  let filteredProducts = products.filter((product) => {
    // Search term filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.nameAr && product.nameAr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.supplier && product.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategory = !filters.category || product.category === filters.category;
    
    // Price range filter
    const matchesPriceRange = 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1];
    
    // Featured filter
    const matchesFeatured = 
      filters.featured === null || 
      product.featured === filters.featured;
    
    // Status filter
    const matchesStatus = !filters.status || product.status === filters.status;
    
    // Stock filter
    const matchesStock = 
      filters.inStock === null || 
      (filters.inStock ? product.stock > 0 : product.stock === 0);
    
    // Tab filter
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "featured" && product.featured) ||
      (activeTab === "active" && product.status === "active") ||
      (activeTab === "inactive" && product.status === "inactive") ||
      (activeTab === "draft" && product.status === "draft");
    
    return matchesSearch && matchesCategory && matchesPriceRange && 
           matchesFeatured && matchesStatus && matchesStock && matchesTab;
  });

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    }
    
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortConfig.direction === 'asc' 
        ? (aValue ? 1 : -1) 
        : (bValue ? 1 : -1);
    }
    
    return 0;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => refreshProducts()} 
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </>
            )}
          </Button>
          <Button onClick={() => setIsAddingProduct(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {syncStatus && (
        <Alert className={`${syncStatus.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
          <AlertDescription>{syncStatus.message}</AlertDescription>
        </Alert>
      )}

      {(isAddingProduct || editingProduct || isDuplicatingProduct) ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? "Edit Product" : isDuplicatingProduct ? "Duplicate Product" : "Add New Product"}
            </CardTitle>
            <CardDescription>
              {editingProduct 
                ? "Update product information and sync with the website" 
                : isDuplicatingProduct 
                  ? "Create a copy of an existing product with new details"
                  : "Add a new product to your inventory and website"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm 
              initialData={editingProduct || isDuplicatingProduct || {}} 
              onSubmit={editingProduct ? handleUpdateProduct : isDuplicatingProduct ? handleCreateDuplicate : handleAddProduct}
              onCancel={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
                setIsDuplicatingProduct(null);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsFilterDialogOpen(true)}
                className="relative"
              >
                <Filter className="h-4 w-4" />
                {(filters.category || filters.featured !== null || filters.status || filters.inStock !== null) && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-jam3a-purple"></span>
                )}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkExport}
                disabled={products.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <input 
                  type="file" 
                  id="import-file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={handleBulkImportFile}
                />
              </div>
              
              {selectedProducts.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkUpdateStatus('active')}
                  >
                    Set Active
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkUpdateStatus('inactive')}
                  >
                    Set Inactive
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkUpdateFeatured(true)}
                  >
                    Set Featured
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkUpdateFeatured(false)}
                  >
                    Unset Featured
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedProducts.length})
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {bulkOperation.isImporting && (
            <div className="mb-4">
              <p className="text-sm mb-2">Importing products... {bulkOperation.progress}%</p>
              <Progress value={bulkOperation.progress} className="h-2" />
            </div>
          )}
          
          {bulkOperation.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{bulkOperation.error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedProducts.length > 0 && selectedProducts.length === filteredProducts.length} 
                        onCheckedChange={handleToggleAllProducts}
                        aria-label="Select all products"
                      />
                    </TableHead>
                    <TableHead className="w-12">Image</TableHead>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                      <div className="flex items-center">
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
                      <div className="flex items-center">
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('stock')} className="cursor-pointer">
                      <div className="flex items-center">
                        Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No products found. Try a different search or add a new product.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)} 
                            onCheckedChange={() => handleToggleProductSelection(product.id)}
                            aria-label={`Select ${product.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          {product.image ? (
                            <div 
                              className="relative h-10 w-10 rounded-md overflow-hidden cursor-pointer"
                              onClick={() => setViewingImage(product.image || null)}
                            >
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                              <Image className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge variant={
                            product.status === 'active' ? "default" : 
                            product.status === 'inactive' ? "secondary" : 
                            "outline"
                          }>
                            {product.status || (product.stock > 0 ? "Active" : "Inactive")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.featured ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Featured
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Standard
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingProduct(product)}
                              title="Edit product"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDuplicateProduct(product)}
                              title="Duplicate product"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {product.image && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewingImage(product.image || null)}
                                title="View image"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </div>
              {selectedProducts.length > 0 && (
                <div className="text-sm">
                  {selectedProducts.length} products selected
                </div>
              )}
            </CardFooter>
          </Card>
        </>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Product Image</DialogTitle>
            <DialogDescription>
              Full size product image preview
            </DialogDescription>
          </DialogHeader>
          {viewingImage && (
            <div className="flex items-center justify-center p-2">
              <img 
                src={viewingImage} 
                alt="Product preview" 
                className="max-h-[60vh] max-w-full object-contain rounded-md"
              />
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                if (viewingImage) {
                  window.open(viewingImage, '_blank');
                }
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Original
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
            <DialogDescription>
              Refine the product list with specific criteria
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.priceRange[0]} 
                  onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                  min={0}
                />
                <span>to</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.priceRange[1]} 
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                  min={0}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featured-filter">Featured</Label>
              <Select 
                value={filters.featured === null ? "" : filters.featured.toString()} 
                onValueChange={(value) => handleFilterChange('featured', value === "" ? null : value === "true")}
              >
                <SelectTrigger id="featured-filter">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  <SelectItem value="true">Featured Only</SelectItem>
                  <SelectItem value="false">Non-Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock-filter">Stock</Label>
              <Select 
                value={filters.inStock === null ? "" : filters.inStock.toString()} 
                onValueChange={(value) => handleFilterChange('inStock', value === "" ? null : value === "true")}
              >
                <SelectTrigger id="stock-filter">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  <SelectItem value="true">In Stock</SelectItem>
                  <SelectItem value="false">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedProductsManager;
