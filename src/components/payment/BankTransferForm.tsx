import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import paymentService from '@/services/PaymentService';
import { Payment } from '@/services/PaymentService';

interface BankTransferFormProps {
  orderId: string;
  amount: number;
  onSuccess: (payment: Payment) => void;
  onError: (error: any) => void;
}

const BankTransferForm: React.FC<BankTransferFormProps> = ({ 
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
      
      // Create payment with bank_transfer method
      const payment = await paymentService.createPayment({
        order: orderId,
        amount,
        currency: 'SAR',
        paymentMethod: 'bank_transfer',
      });
      
      toast({
        title: 'Order Placed',
        description: 'Your order has been placed. Please complete the bank transfer using the details below.',
      });
      
      onSuccess(payment);
    } catch (error) {
      console.error('Failed to process bank transfer:', error);
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
        <CardTitle>Bank Transfer Details</CardTitle>
        <CardDescription>
          Please transfer the exact amount to the bank account below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Bank Name</p>
          <p className="text-sm text-muted-foreground">Saudi National Bank</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Account Name</p>
          <p className="text-sm text-muted-foreground">Jam3a Trading Company</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Account Number</p>
          <p className="text-sm text-muted-foreground">1234567890</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">IBAN</p>
          <p className="text-sm text-muted-foreground">SA0380000000001234567890</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Amount to Transfer</p>
          <p className="text-sm font-bold">{amount.toFixed(2)} SAR</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Reference</p>
          <p className="text-sm text-muted-foreground">
            Please include your Order ID ({orderId.substring(0, 8)}) as the payment reference
          </p>
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
              'Confirm Order with Bank Transfer'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferForm;
