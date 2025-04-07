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
import { useProducts } from "@/contexts/ProductContext";
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
  const { products, setProducts, refreshProducts, syncStatus, isLoading } = useProducts();

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
      sku: product.sku ? `${product.sku}-COPY` : undefined
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    }
  };

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 10000],
      featured: null,
      status: '',
      inStock: null
    });
    setIsFilterDialogOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterDialogOpen(false);
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

  const handleImport = async () => {
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
      // Simulate file reading and processing
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importedProducts = JSON.parse(content);
          
          // Validate imported data
          if (!Array.isArray(importedProducts)) {
            throw new Error("Invalid format: Expected an array of products");
          }
          
          // Simulate progress
          for (let i = 0; i <= 100; i += 10) {
            setBulkOperation(prev => ({
              ...prev,
              progress: i
            }));
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Process and add products
          const currentDate = new Date().toISOString().split('T')[0];
          const nextId = Math.max(0, ...products.map(p => p.id)) + 1;
          
          const processedProducts = importedProducts.map((p: any, index: number) => ({
            ...p,
            id: nextId + index,
            dateAdded: currentDate,
            lastUpdated: currentDate,
            status: p.status || 'active'
          }));
          
          setProducts([...products, ...processedProducts]);
          
          setBulkOperation({
            isImporting: false,
            isExporting: false,
            file: null,
            progress: 0,
            error: ""
          });
          
          toast({
            title: "Import Successful",
            description: `${processedProducts.length} products have been imported.`,
          });
        } catch (error) {
          setBulkOperation({
            isImporting: false,
            isExporting: false,
            file: null,
            progress: 0,
            error: error instanceof Error ? error.message : "Failed to import products"
          });
        }
      };
      
      reader.readAsText(bulkOperation.file);
    } catch (error) {
      setBulkOperation({
        isImporting: false,
        isExporting: false,
        file: null,
        progress: 0,
        error: error instanceof Error ? error.message : "Failed to import products"
      });
    }
  };

  const handleExport = async () => {
    setBulkOperation({
      ...bulkOperation,
      isExporting: true,
      progress: 0,
      error: ""
    });

    try {
      // Determine which products to export
      const productsToExport = selectedProducts.length > 0
        ? products.filter(p => selectedProducts.includes(p.id))
        : products;
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 20) {
        setBulkOperation(prev => ({
          ...prev,
          progress: i
        }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Create export file
      const exportData = JSON.stringify(productsToExport, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setBulkOperation({
        isImporting: false,
        isExporting: false,
        file: null,
        progress: 0,
        error: ""
      });
      
      toast({
        title: "Export Successful",
        description: `${productsToExport.length} products have been exported.`,
      });
    } catch (error) {
      setBulkOperation({
        isImporting: false,
        isExporting: false,
        file: null,
        progress: 0,
        error: error instanceof Error ? error.message : "Failed to export products"
      });
    }
  };

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    // Search term filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab filter
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "featured" && product.featured) ||
      (activeTab === "active" && product.status === "active") ||
      (activeTab === "inactive" && product.status === "inactive") ||
      (activeTab === "draft" && product.status === "draft");
    
    // Advanced filters
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesPriceRange = 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1];
    const matchesFeatured = 
      filters.featured === null || 
      product.featured === filters.featured;
    const matchesStatus = 
      !filters.status || 
      product.status === filters.status;
    const matchesStock = 
      filters.inStock === null || 
      (filters.inStock ? product.stock > 0 : product.stock === 0);
    
    return matchesSearch && matchesTab && matchesCategory && 
           matchesPriceRange && matchesFeatured && 
           matchesStatus && matchesStock;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
    if (bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Products Management</CardTitle>
              <CardDescription>
                Manage your product catalog, inventory, and pricing
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refreshProducts()}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setIsAddingProduct(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sync status alert */}
            {syncStatus && (
              <Alert className={`mb-4 ${
                syncStatus.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
                syncStatus.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                syncStatus.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                <AlertDescription>
                  {syncStatus.message}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterDialogOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExport}
                  disabled={bulkOperation.isExporting || bulkOperation.isImporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('import-file')?.click()}
                  disabled={bulkOperation.isExporting || bulkOperation.isImporting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            {/* Bulk operation progress */}
            {(bulkOperation.isImporting || bulkOperation.isExporting) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{bulkOperation.isImporting ? 'Importing...' : 'Exporting...'}</span>
                  <span>{bulkOperation.progress}%</span>
                </div>
                <Progress value={bulkOperation.progress} />
              </div>
            )}
            
            {/* Bulk operation error */}
            {bulkOperation.error && (
              <Alert className="bg-red-50 text-red-800 border-red-200">
                <AlertDescription>{bulkOperation.error}</AlertDescription>
              </Alert>
            )}
            
            {/* File selected for import */}
            {bulkOperation.file && !bulkOperation.isImporting && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{bulkOperation.file.name}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setBulkOperation({...bulkOperation, file: null})}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleImport}
                  >
                    Import Now
                  </Button>
                </div>
              </div>
            )}
            
            {/* Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-4">
                {/* Bulk actions */}
                {selectedProducts.length > 0 && (
                  <div className="bg-gray-50 p-2 rounded mb-4 flex items-center justify-between">
                    <span className="text-sm">{selectedProducts.length} products selected</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProducts([])}
                      >
                        Clear Selection
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleBulkDelete}
                      >
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Products table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-12">ID</TableHead>
                        <TableHead className="w-12">Image</TableHead>
                        <TableHead className="min-w-[150px]">
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort('category')}>
                            Category
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort('price')}>
                            Price
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort('stock')}>
                            Stock
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            No products found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={(checked) => 
                                  handleSelectProduct(product.id, checked === true)
                                }
                              />
                            </TableCell>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>
                              {product.image ? (
                                <div 
                                  className="h-10 w-10 rounded bg-gray-100 cursor-pointer"
                                  style={{ 
                                    backgroundImage: `url(${product.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                  }}
                                  onClick={() => setViewingImage(product.image || null)}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                                  <Image className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{product.name}</div>
                              {product.sku && (
                                <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                              )}
                              {product.featured && (
                                <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-800 border-yellow-200">
                                  Featured
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                              <div className="font-medium">${product.price.toFixed(2)}</div>
                              {product.originalPrice && (
                                <div className="text-xs text-gray-500 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={product.stock > 0 ? "outline" : "secondary"}
                                className={product.stock > 0 ? 
                                  "bg-green-50 text-green-800 border-green-200" : 
                                  "bg-red-50 text-red-800 border-red-200"
                                }
                              >
                                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={
                                  product.status === "active" ? "bg-green-50 text-green-800 border-green-200" :
                                  product.status === "inactive" ? "bg-gray-50 text-gray-800 border-gray-200" :
                                  "bg-blue-50 text-blue-800 border-blue-200"
                                }
                              >
                                {product.status || "active"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDuplicateProduct(product)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingProduct(product)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product.id)}
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
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </CardFooter>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your catalog. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            onSubmit={handleAddProduct} 
            onCancel={() => setIsAddingProduct(false)}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm 
              product={editingProduct}
              onSubmit={handleUpdateProduct} 
              onCancel={() => setEditingProduct(null)}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Duplicate Product Dialog */}
      <Dialog open={!!isDuplicatingProduct} onOpenChange={(open) => !open && setIsDuplicatingProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Duplicate Product</DialogTitle>
            <DialogDescription>
              Create a copy of this product with modified details.
            </DialogDescription>
          </DialogHeader>
          {isDuplicatingProduct && (
            <ProductForm 
              product={isDuplicatingProduct}
              onSubmit={handleAddProduct} 
              onCancel={() => setIsDuplicatingProduct(null)}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Image Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Image</DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <div className="flex justify-center">
              <img 
                src={viewingImage} 
                alt="Product" 
                className="max-h-[70vh] object-contain"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingImage(null)}>
              Close
            </Button>
            {viewingImage && (
              <Button 
                variant="default" 
                onClick={() => window.open(viewingImage, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Original
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
            <DialogDescription>
              Refine the product list with filters.
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
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [
                    parseInt(e.target.value) || 0, 
                    filters.priceRange[1]
                  ])}
                  placeholder="Min"
                />
                <span>to</span>
                <Input
                  type="number"
                  min="0"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [
                    filters.priceRange[0], 
                    parseInt(e.target.value) || 10000
                  ])}
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featured-filter">Featured</Label>
              <Select 
                value={filters.featured === null ? "" : filters.featured.toString()} 
                onValueChange={(value) => handleFilterChange('featured', 
                  value === "" ? null : value === "true"
                )}
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
                onValueChange={(value) => handleFilterChange('inStock', 
                  value === "" ? null : value === "true"
                )}
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
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedProductsManager;
