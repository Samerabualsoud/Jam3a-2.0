import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import paymentService from '@/services/PaymentService';
import { Payment } from '@/services/PaymentService';
import { handleError, ErrorType, createError } from '@/utils/errorHandler';
import { isValidSaudiIBAN } from '@/utils/validation';

interface BankTransferFormProps {
  orderId: string;
  amount: number;
  onSuccess: (payment: Payment) => void;
  onError: (error: any) => void;
}

/**
 * Enhanced Bank Transfer Form with improved error handling and validation
 */
const EnhancedBankTransferForm: React.FC<BankTransferFormProps> = ({ 
  orderId, 
  amount, 
  onSuccess, 
  onError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Bank account details
  const bankDetails = {
    bankName: 'Saudi National Bank',
    accountName: 'Jam3a Trading Company',
    accountNumber: '1234567890',
    iban: 'SA0380000000001234567890'
  };

  // Validate IBAN
  if (!isValidSaudiIBAN(bankDetails.iban)) {
    console.error('Invalid IBAN format in bank details');
  }

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
      const appError = handleError(error);
      onError(appError);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate reference code from order ID
  const referenceCode = orderId ? orderId.substring(0, 8).toUpperCase() : '';

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
          <p className="text-sm text-muted-foreground">{bankDetails.bankName}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Account Name</p>
          <p className="text-sm text-muted-foreground">{bankDetails.accountName}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Account Number</p>
          <p className="text-sm text-muted-foreground">{bankDetails.accountNumber}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">IBAN</p>
          <p className="text-sm text-muted-foreground">{bankDetails.iban}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Amount to Transfer</p>
          <p className="text-sm font-bold">{amount.toFixed(2)} SAR</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Reference</p>
          <p className="text-sm text-muted-foreground">
            Please include your Order ID ({referenceCode}) as the payment reference
          </p>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-jam3a-purple hover:bg-jam3a-deep-purple"
            disabled={isProcessing}
            aria-label="Confirm order with bank transfer"
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

export default EnhancedBankTransferForm;
