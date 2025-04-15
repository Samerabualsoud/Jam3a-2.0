import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import paymentService from '@/services/PaymentService';

/**
 * Component to handle payment verification callbacks from Moyasser
 * This component should be rendered on the callback URL page
 */
const PaymentVerificationHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment ID from URL parameters
        const paymentId = searchParams.get('payment_id');
        
        if (!paymentId) {
          throw new Error('Payment ID not found in URL parameters');
        }
        
        // Verify payment with backend
        const verifiedPayment = await paymentService.verifyMoyasserPayment(paymentId);
        
        // Show success message
        toast({
          title: 'Payment Verified',
          description: 'Your payment has been successfully verified.',
        });
        
        // Redirect to order confirmation page
        navigate(`/order-confirmation/${verifiedPayment.order}`, {
          state: { payment: verifiedPayment }
        });
      } catch (error) {
        console.error('Payment verification error:', error);
        
        // Show error message
        toast({
          title: 'Payment Verification Failed',
          description: 'There was an error verifying your payment. Please contact support.',
          variant: 'destructive',
        });
        
        // Redirect to home page after a delay
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, toast]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-jam3a-purple mb-6" />
      <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
      <p className="text-center text-muted-foreground">
        Please wait while we verify your payment. You will be redirected automatically.
      </p>
    </div>
  );
};

export default PaymentVerificationHandler;
