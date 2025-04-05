import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import paymentService from '@/services/PaymentService';
import { Payment } from '@/services/PaymentService';

interface CashOnDeliveryFormProps {
  orderId: string;
  amount: number;
  onSuccess: (payment: Payment) => void;
  onError: (error: any) => void;
}

const CashOnDeliveryForm: React.FC<CashOnDeliveryFormProps> = ({ 
  orderId, 
  amount, 
  onSuccess, 
  onError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      
      // Create payment with cod method
      const payment = await paymentService.createPayment({
        order: orderId,
        amount,
        currency: 'SAR',
        paymentMethod: 'cod',
      });
      
      toast({
        title: 'Order Placed',
        description: 'Your order has been placed successfully. You will pay on delivery.',
      });
      
      onSuccess(payment);
    } catch (error) {
      console.error('Failed to process cash on delivery order:', error);
      toast({
        title: 'Order Error',
        description: 'Failed to place your order. Please try again.',
        variant: 'destructive',
      });
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash on Delivery</CardTitle>
        <CardDescription>
          Pay with cash when your order is delivered
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Please note:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Have the exact amount ready for the delivery person</li>
              <li>A delivery fee of 15 SAR will be added for cash on delivery orders</li>
              <li>You must be present at the delivery address to receive and pay for your order</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Order Amount</p>
          <p className="text-sm font-bold">{amount.toFixed(2)} SAR</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Delivery Fee</p>
          <p className="text-sm text-muted-foreground">15.00 SAR</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Total to Pay on Delivery</p>
          <p className="text-sm font-bold">{(amount + 15).toFixed(2)} SAR</p>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Order with Cash on Delivery'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashOnDeliveryForm;
