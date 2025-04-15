import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface PaymentStatusProps {
  status: 'success' | 'pending' | 'error' | 'processing';
  paymentMethod?: 'moyasser' | 'bank_transfer' | 'cod';
  orderId?: string;
  onRetry?: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  status, 
  paymentMethod, 
  orderId,
  onRetry 
}) => {
  const navigate = useNavigate();

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple mb-4" />
        <p className="text-center font-medium mb-1">Processing Payment</p>
        <p className="text-center text-muted-foreground">Please wait while we process your payment...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-green-200 rounded-md bg-green-50">
        <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
        <p className="text-center text-green-600 font-medium mb-2">Payment Successful</p>
        <p className="text-center text-muted-foreground mb-4">
          Your payment has been processed successfully.
          {orderId && ` Order #${orderId.substring(0, 8)} has been confirmed.`}
        </p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
          <Button 
            className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
            onClick={() => navigate('/profile/orders')}
          >
            View My Orders
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-amber-200 rounded-md bg-amber-50">
        <AlertCircle className="h-8 w-8 text-amber-500 mb-4" />
        <p className="text-center text-amber-600 font-medium mb-2">
          {paymentMethod === 'bank_transfer' 
            ? 'Awaiting Bank Transfer' 
            : paymentMethod === 'cod'
              ? 'Order Placed - Cash on Delivery'
              : 'Payment Pending'}
        </p>
        <p className="text-center text-muted-foreground mb-4">
          {paymentMethod === 'bank_transfer' 
            ? 'Please complete your bank transfer to process your order.' 
            : paymentMethod === 'cod'
              ? 'Your order has been placed. You will pay when your order is delivered.'
              : 'Your payment is pending confirmation.'}
        </p>
        <Button 
          className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
          onClick={() => navigate('/profile/orders')}
        >
          View Order Details
        </Button>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-red-200 rounded-md bg-red-50">
      <XCircle className="h-8 w-8 text-red-500 mb-4" />
      <p className="text-center text-red-600 font-medium mb-2">Payment Failed</p>
      <p className="text-center text-muted-foreground mb-4">
        There was an error processing your payment. Please try again or contact customer support.
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-jam3a-purple hover:bg-jam3a-deep-purple mb-2"
        >
          Try Again
        </Button>
      )}
      <Button 
        variant="outline"
        onClick={() => navigate('/support')}
      >
        Contact Support
      </Button>
    </div>
  );
};

export default PaymentStatus;
