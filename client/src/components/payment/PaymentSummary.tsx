import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/components/layout/Header';

interface PaymentSummaryProps {
  subtotal: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  total: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  shipping = 0,
  tax = 0,
  discount = 0,
  total,
  items = []
}) => {
  const { language } = useLanguage();
  
  const content = {
    en: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      discount: 'Discount',
      total: 'Total',
      free: 'Free',
      currency: 'SAR',
      items: 'Items',
      quantity: 'Qty'
    },
    ar: {
      title: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      tax: 'الضريبة',
      discount: 'الخصم',
      total: 'المجموع',
      free: 'مجاني',
      currency: 'ريال',
      items: 'العناصر',
      quantity: 'الكمية'
    }
  };
  
  const currentContent = content[language];
  const isRtl = language === 'ar';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentContent.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length > 0 && (
            <>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span>{item.name}</span>
                      <span className="text-muted-foreground ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="text-right">
                      {item.price} {currentContent.currency}
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{currentContent.subtotal}</span>
              <span>{subtotal} {currentContent.currency}</span>
            </div>
            
            {shipping !== undefined && (
              <div className="flex justify-between">
                <span>{currentContent.shipping}</span>
                <span>
                  {shipping === 0 
                    ? currentContent.free 
                    : `${shipping} ${currentContent.currency}`}
                </span>
              </div>
            )}
            
            {tax !== undefined && tax > 0 && (
              <div className="flex justify-between">
                <span>{currentContent.tax}</span>
                <span>{tax} {currentContent.currency}</span>
              </div>
            )}
            
            {discount !== undefined && discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{currentContent.discount}</span>
                <span>-{discount} {currentContent.currency}</span>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>{currentContent.total}</span>
            <span>{total} {currentContent.currency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
