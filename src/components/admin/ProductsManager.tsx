
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
import { Pencil, Trash2, Plus, Search, Image, ExternalLink } from "lucide-react";
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

// Product interface
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
}

const ProductsManager = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Real product data with images
  const [products, setProducts] = useState<Product[]>([
    { 
      id: 1, 
      name: "iPhone 15 Pro", 
      category: "Electronics", 
      price: 999, 
      stock: 50,
      description: "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484bce71?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      id: 2, 
      name: "Samsung Galaxy S23", 
      category: "Electronics", 
      price: 899, 
      stock: 30,
      description: "Powerful Android smartphone with exceptional camera and all-day battery life.",
      image: "https://images.unsplash.com/photo-1678911820864-e5a3eb4d2b1d?q=80&w=1964&auto=format&fit=crop"
    },
    { 
      id: 3, 
      name: "MacBook Pro", 
      category: "Computers", 
      price: 1999, 
      stock: 20,
      description: "Professional-grade laptop with M2 chip, stunning display, and all-day battery life.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop"
    },
    { 
      id: 4, 
      name: "AirPods Pro", 
      category: "Audio", 
      price: 249, 
      stock: 100,
      description: "Wireless earbuds with active noise cancellation and spatial audio.",
      image: "https://images.unsplash.com/photo-1606741965429-8a276cb1f5e7?q=80&w=1974&auto=format&fit=crop"
    },
    { 
      id: 5, 
      name: "iPad Pro", 
      category: "Tablets", 
      price: 799, 
      stock: 35,
      description: "Powerful tablet with M2 chip, Liquid Retina display, and Apple Pencil support.",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1975&auto=format&fit=crop"
    },
  ]);

  // Simulate fetching products from API
  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, we're using the initial state
    const fetchProducts = async () => {
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Products are already set in state
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchProducts();
  }, [toast]);

  const handleAddProduct = (product: Product) => {
    const newProduct = { 
      ...product, 
      id: Math.max(0, ...products.map(p => p.id)) + 1 
    };
    
    setProducts([...products, newProduct]);
    setIsAddingProduct(false);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added successfully.`,
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
    
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated successfully.`,
    });
  };

  const handleDeleteProduct = (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;
    
    // In a real implementation, this would be an API call
    setProducts(products.filter((p) => p.id !== id));
    
    toast({
      title: "Product Deleted",
      description: `${productToDelete.name} has been deleted.`,
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
        <Button onClick={() => setIsAddingProduct(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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

export default ProductsManager;
