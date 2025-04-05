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
import { Pencil, Trash2, Plus, Search, Image, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

const EnhancedProductsManager = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use the product context for direct sync with website
  const { products, setProducts, refreshProducts, syncStatus } = useProductContext();

  const handleAddProduct = (product: Product) => {
    const newProduct = { 
      ...product, 
      id: Math.max(0, ...products.map(p => p.id)) + 1 
    };
    
    setProducts([...products, newProduct]);
    setIsAddingProduct(false);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added successfully and synced with the website.`,
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => refreshProducts()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={() => setIsAddingProduct(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {syncStatus && (
        <div className={`p-2 rounded-md ${syncStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {syncStatus.message}
        </div>
      )}

      {(isAddingProduct || editingProduct) ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm 
              initialData={editingProduct || {}} 
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No products found. Try a different search or add a new product.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
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
                          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
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
    </div>
  );
};

export default EnhancedProductsManager;
