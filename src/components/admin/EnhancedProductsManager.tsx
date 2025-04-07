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
import { Label } from "@/components/ui/label";
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
    a.download = `products_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Export Successful",
      description: `${productsToExport.length} products have been exported.`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBulkOperation({
        ...bulkOperation,
        file: e.target.files[0],
        error: ""
      });
    }
  };

  const handleBulkImport = async () => {
    if (!bulkOperation.file) {
      setBulkOperation({
        ...bulkOperation,
        error: "Please select a file to import"
      });
      return;
    }
    
    setBulkOperation({
      ...bulkOperation,
      isImporting: true,
      progress: 0,
      error: ""
    });
    
    try {
      // Read the file
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const importedProducts = JSON.parse(result) as Product[];
          
          // Validate the imported data
          if (!Array.isArray(importedProducts)) {
            throw new Error("Invalid format: Expected an array of products");
          }
          
          // Assign new IDs to avoid conflicts
          const highestId = Math.max(0, ...products.map(p => p.id));
          const productsWithNewIds = importedProducts.map((p, index) => ({
            ...p,
            id: highestId + index + 1
          }));
          
          // Update the products
          setProducts([...products, ...productsWithNewIds]);
          
          setBulkOperation({
            isImporting: false,
            isExporting: false,
            file: null,
            progress: 100,
            error: ""
          });
          
          toast({
            title: "Import Successful",
            description: `${productsWithNewIds.length} products have been imported.`,
          });
        } catch (error) {
          console.error("Import error:", error);
          setBulkOperation({
            ...bulkOperation,
            isImporting: false,
            progress: 0,
            error: "Failed to parse the import file. Please ensure it's a valid JSON file."
          });
        }
      };
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setBulkOperation({
            ...bulkOperation,
            progress: percentComplete
          });
        }
      };
      
      reader.onerror = () => {
        setBulkOperation({
          ...bulkOperation,
          isImporting: false,
          progress: 0,
          error: "Error reading the file. Please try again."
        });
      };
      
      reader.readAsText(bulkOperation.file);
    } catch (error) {
      console.error("Import error:", error);
      setBulkOperation({
        ...bulkOperation,
        isImporting: false,
        progress: 0,
        error: "An unexpected error occurred during import."
      });
    }
  };

  const handleSort = (key: keyof Product) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const applyFilters = (product: Product) => {
    // Search term filter
    const matchesSearch = 
      !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    
    // In stock filter
    const matchesStock = 
      filters.inStock === null || 
      (filters.inStock ? product.stock > 0 : product.stock === 0);
    
    // Tab filter
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "featured" && product.featured) ||
      (activeTab === "active" && product.status === "active") ||
      (activeTab === "inactive" && product.status === "inactive") ||
      (activeTab === "draft" && product.status === "draft") ||
      (activeTab === "out-of-stock" && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesPriceRange && 
           matchesFeatured && matchesStatus && matchesStock && matchesTab;
  };

  const filteredProducts = sortedProducts.filter(applyFilters);

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleRefresh = () => {
    refreshProducts();
    toast({
      title: "Refreshing Products",
      description: "Fetching the latest product data from the server...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Products Management</h2>
          <p className="text-muted-foreground">
            Manage your products, inventory, and pricing
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={() => setIsAddingProduct(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {(isAddingProduct || editingProduct || isDuplicatingProduct) ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? "Edit Product" : isDuplicatingProduct ? "Duplicate Product" : "Add New Product"}
            </CardTitle>
            <CardDescription>
              {editingProduct 
                ? "Update the product details below" 
                : isDuplicatingProduct 
                  ? "Modify the duplicated product details as needed"
                  : "Fill in the product details below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm 
              initialData={editingProduct || isDuplicatingProduct || {}} 
              onSubmit={
                editingProduct 
                  ? handleUpdateProduct 
                  : isDuplicatingProduct 
                    ? handleCreateDuplicate
                    : handleAddProduct
              }
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
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex w-full sm:w-auto items-center space-x-2">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto min-w-[200px]"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsFilterDialogOpen(true)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <Card>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Loading products...</p>
                    </div>
                  ) : (
                    <>
                      {selectedProducts.length > 0 && (
                        <div className="bg-muted p-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleBulkExport}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export Selected
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={handleBulkDelete}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Selected
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox 
                                checked={
                                  filteredProducts.length > 0 && 
                                  selectedProducts.length === filteredProducts.length
                                }
                                onCheckedChange={handleSelectAll}
                                aria-label="Select all products"
                              />
                            </TableHead>
                            <TableHead className="w-12">Image</TableHead>
                            <TableHead>
                              <div 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleSort('name')}
                              >
                                Name
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead>
                              <div 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleSort('category')}
                              >
                                Category
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead>
                              <div 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleSort('price')}
                              >
                                Price
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead>
                              <div 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleSort('stock')}
                              >
                                Stock
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                No products found. Try a different search or filter.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <Checkbox 
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={() => handleSelectProduct(product.id)}
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
                                <TableCell className="font-medium">
                                  <div className="flex flex-col">
                                    <span>{product.name}</span>
                                    {product.featured && (
                                      <Badge variant="outline" className="w-fit mt-1">Featured</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">${product.price.toFixed(2)}</span>
                                    {product.discount && product.discount > 0 && (
                                      <span className="text-sm text-muted-foreground line-through">
                                        ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    product.status === 'active' 
                                      ? "default" 
                                      : product.status === 'inactive' 
                                        ? "secondary" 
                                        : "outline"
                                  }>
                                    {product.status || 'active'}
                                  </Badge>
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
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} of {products.length} products
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleBulkExport}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export All
                    </Button>
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
                      className="hidden" 
                      accept=".json"
                      onChange={handleFileChange}
                    />
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
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
              Refine the product list using the filters below
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilters({...filters, category: value})}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.priceRange[0]} 
                  onChange={(e) => setFilters({
                    ...filters, 
                    priceRange: [Number(e.target.value), filters.priceRange[1]]
                  })}
                  min={0}
                />
                <span>to</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.priceRange[1]} 
                  onChange={(e) => setFilters({
                    ...filters, 
                    priceRange: [filters.priceRange[0], Number(e.target.value)]
                  })}
                  min={0}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({...filters, status: value})}
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
              <Label>Featured</Label>
              <Select 
                value={filters.featured === null ? "" : filters.featured ? "yes" : "no"} 
                onValueChange={(value) => setFilters({
                  ...filters, 
                  featured: value === "" ? null : value === "yes"
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  <SelectItem value="yes">Featured Only</SelectItem>
                  <SelectItem value="no">Non-Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select 
                value={filters.inStock === null ? "" : filters.inStock ? "in" : "out"} 
                onValueChange={(value) => setFilters({
                  ...filters, 
                  inStock: value === "" ? null : value === "in"
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                category: '',
                priceRange: [0, 10000],
                featured: null,
                status: '',
                inStock: null
              })}
            >
              Reset Filters
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog 
        open={bulkOperation.isImporting || (bulkOperation.file !== null)} 
        onOpenChange={(open) => {
          if (!open) {
            setBulkOperation({
              isImporting: false,
              isExporting: false,
              file: null,
              progress: 0,
              error: ""
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Products</DialogTitle>
            <DialogDescription>
              Upload a JSON file containing product data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {bulkOperation.file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Selected File:</span>
                  <span>{bulkOperation.file.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Size:</span>
                  <span>{(bulkOperation.file.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="mb-2">Drag and drop a JSON file here, or click to browse</p>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('import-dialog-file')?.click()}
                >
                  Select File
                </Button>
                <input 
                  type="file" 
                  id="import-dialog-file" 
                  className="hidden" 
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
            )}
            
            {bulkOperation.isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Importing...</span>
                  <span>{bulkOperation.progress}%</span>
                </div>
                <Progress value={bulkOperation.progress} />
              </div>
            )}
            
            {bulkOperation.error && (
              <Alert variant="destructive">
                <AlertDescription>{bulkOperation.error}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setBulkOperation({
                  isImporting: false,
                  isExporting: false,
                  file: null,
                  progress: 0,
                  error: ""
                });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBulkImport}
              disabled={!bulkOperation.file || bulkOperation.isImporting}
            >
              {bulkOperation.isImporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedProductsManager;
