import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

/**
 * ProductSelector Component
 * Allows users to select a product from a category when joining a Jam3a deal
 */
const ProductSelector = ({ 
  products, 
  selectedProduct, 
  onSelectProduct, 
  language, 
  discount,
  currency
}) => {
  // Calculate discounted price
  const calculateDiscountedPrice = (price) => {
    return price * (1 - discount / 100);
  };

  // Format price with currency
  const formatPrice = (price) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedProduct?._id} onValueChange={(value) => {
        const product = products.find(p => p._id === value);
        if (product) {
          onSelectProduct(product);
        }
      }}>
        {products.map((product) => {
          const discountedPrice = calculateDiscountedPrice(product.price);
          
          return (
            <Card 
              key={product._id} 
              className={`overflow-hidden transition-all ${
                selectedProduct?._id === product._id 
                  ? 'border-2 border-jam3a-purple' 
                  : 'border hover:border-gray-300'
              }`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Product Image */}
                  <div className="w-full md:w-1/4 h-48 md:h-auto">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <RadioGroupItem 
                          value={product._id} 
                          id={product._id} 
                          className="mr-2"
                        />
                        <Label 
                          htmlFor={product._id} 
                          className="text-lg font-semibold cursor-pointer"
                        >
                          {language === 'ar' && product.nameAr ? product.nameAr : product.name}
                        </Label>
                      </div>
                      
                      {/* Discount Badge */}
                      <div className="bg-jam3a-purple text-white px-2 py-1 rounded-full text-sm font-semibold">
                        {discount}% OFF
                      </div>
                    </div>
                    
                    {/* Product Description */}
                    <p className="text-muted-foreground text-sm mb-4">
                      {language === 'ar' && product.descriptionAr 
                        ? product.descriptionAr 
                        : product.description || 'No description available'}
                    </p>
                    
                    {/* Price Information */}
                    <div className="mt-auto flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">Regular Price</p>
                        <p className="text-sm line-through text-muted-foreground">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Jam3a Price</p>
                        <p className="text-lg font-bold text-jam3a-purple">
                          {formatPrice(discountedPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </RadioGroup>
      
      {products.length === 0 && (
        <p className="text-center py-8 text-muted-foreground">
          No products available in this category.
        </p>
      )}
    </div>
  );
};

export default ProductSelector;
