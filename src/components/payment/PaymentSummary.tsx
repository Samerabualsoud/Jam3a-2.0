import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/services/OrderService';

interface PaymentSummaryProps {
  order: Order;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ order }) => {
  if (!order) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Order #{order._id.substring(0, 8)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.products.map((item) => (
          <div key={item.product} className="flex justify-between">
            <span>{item.quantity} x {item.product}</span>
            <span>{(item.price * item.quantity).toFixed(2)} SAR</span>
          </div>
        ))}
        
        <Separator />
        
        <div className="flex justify-between font-medium">
          <span>Subtotal</span>
          <span>{(order.totalAmount - (order.shippingCost || 0)).toFixed(2)} SAR</span>
        </div>
        
        {order.shippingCost > 0 && (
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingCost.toFixed(2)} SAR</span>
          </div>
        )}
        
        {order.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{order.discount.toFixed(2)} SAR</span>
          </div>
        )}
        
        <Separator />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{order.totalAmount.toFixed(2)} SAR</span>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Payment Status: <span className="font-medium">{order.status}</span></p>
          {order.paymentId && (
            <p>Payment ID: <span className="font-medium">{order.paymentId.substring(0, 12)}</span></p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
