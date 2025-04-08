import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import paymentService from '@/services/PaymentService';
import { Payment } from '@/services/PaymentService';
import { handleError, ErrorType, createError } from '@/utils/errorHandler';

interface CashOnDeliveryFormProps {
  orderId: string;
  amount: number;
  onSuccess: (payment: Payment) => void;
  onError: (error: any) => void;
}

/**
 * Enhanced Cash on Delivery Form with improved error handling
 */
const EnhancedCashOnDeliveryForm: React.FC<CashOnDeliveryFormProps> = ({ 
  orderId, 
  amount, 
  onSuccess, 
  onError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (!orderId) {
        throw createError(
          ErrorType.VALIDATION,
          'Invalid order',
          'Order ID is required to process payment',
          'INVALID_ORDER_ID'
        );
      }
      
      if (!amount || amount <= 0) {
        throw createError(
          ErrorType.VALIDATION,
          'Invalid amount',
          'A valid payment amount is required',
          'INVALID_AMOUNT'
        );
      }
      
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
      const appError = handleError(error);
      onError(appError);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate delivery fee and total
  const deliveryFee = 15;
  const totalAmount = amount + deliveryFee;

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
              <li>A delivery fee of {deliveryFee} SAR will be added for cash on delivery orders</li>
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
          <p className="text-sm text-muted-foreground">{deliveryFee.toFixed(2)} SAR</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Total to Pay on Delivery</p>
          <p className="text-sm font-bold">{totalAmount.toFixed(2)} SAR</p>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
            disabled={isProcessing}
            aria-label="Confirm order with cash on delivery"
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

export default EnhancedCashOnDeliveryForm;
