import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import paymentService from '@/services/PaymentService';

interface MoyasserPaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess: (payment: any) => void;
  onError: (error: any) => void;
}

const MoyasserPaymentForm: React.FC<MoyasserPaymentFormProps> = ({ 
  orderId, 
  amount, 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        setPaymentStatus('pending');
        const response = await paymentService.initializeMoyasserPayment(orderId);
        setPaymentData(response);
      } catch (error) {
        console.error('Failed to initialize payment:', error);
        setPaymentStatus('error');
        setErrorMessage('Failed to initialize payment gateway. Please try again later.');
        toast({
          title: 'Payment Error',
          description: 'Failed to initialize payment. Please try again.',
          variant: 'destructive',
        });
        onError && onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [orderId, toast, onError]);

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      setIsLoading(true);
      setPaymentStatus('processing');
      toast({
        title: 'Processing Payment',
        description: 'Your payment is being processed. Please wait...',
      });
      
      const verifiedPayment = await paymentService.verifyMoyasserPayment(paymentId);
      
      if (verifiedPayment.status === 'completed') {
        setPaymentStatus('success');
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
        });
        onSuccess && onSuccess(verifiedPayment);
      } else {
        setPaymentStatus('error');
        setErrorMessage(`Payment verification failed: ${verifiedPayment.status}. Please contact support.`);
        toast({
          title: 'Payment Verification Failed',
          description: `Payment status: ${verifiedPayment.status}. Please contact support.`,
          variant: 'destructive',
        });
        onError && onError(new Error(`Payment verification failed: ${verifiedPayment.status}`));
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('error');
      setErrorMessage('Failed to verify payment. Please contact customer support with order ID: ' + orderId);
      toast({
        title: 'Payment Verification Error',
        description: 'Failed to verify payment. Please contact support.',
        variant: 'destructive',
      });
      onError && onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setPaymentStatus('error');
    setErrorMessage(error?.message || 'There was an error processing your payment. Please try again.');
    toast({
      title: 'Payment Failed',
      description: 'There was an error processing your payment. Please try again.',
      variant: 'destructive',
    });
    onError && onError(error);
  };

  const retryPayment = () => {
    // Reset state and reinitialize payment
    setPaymentData(null);
    setPaymentStatus('pending');
    setErrorMessage('');
    
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        const response = await paymentService.initializeMoyasserPayment(orderId);
        setPaymentData(response);
      } catch (error) {
        console.error('Failed to initialize payment:', error);
        setPaymentStatus('error');
        setErrorMessage('Failed to initialize payment gateway. Please try again later.');
        onError && onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  };

  useEffect(() => {
    if (!paymentData) return;

    // Create and mount Moyasser payment form
    const script = document.createElement('script');
    script.src = 'https://cdn.moyasser.com/v1/moyasser.js';
    script.async = true;
    
    let moyasserInstance: any = null;
    
    script.onload = () => {
      try {
        // Initialize Moyasser payment form
        if (typeof window.Moyasser !== 'function') {
          throw new Error('Moyasser SDK not loaded properly');
        }
        
        moyasserInstance = window.Moyasser(paymentData.apiKey, {
          production: paymentData.isProduction,
        });

        const form = moyasserInstance.createPaymentForm({
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          paymentId: paymentData.paymentId,
          timestamp: paymentData.timestamp,
          signature: paymentData.signature,
          onSuccess: handlePaymentSuccess,
          onError: handlePaymentError,
          locale: 'ar', // Support Arabic language
          style: {
            theme: 'jam3a', // Custom theme matching Jam3a branding
            direction: 'rtl', // Right-to-left support
          }
        });

        // Mount the form to the container
        const container = document.getElementById('moyasser-payment-form');
        if (container) {
          form.mount(container);
        } else {
          throw new Error('Payment form container not found');
        }
      } catch (error) {
        console.error('Error initializing Moyasser form:', error);
        setPaymentStatus('error');
        setErrorMessage('Failed to initialize payment form. Please refresh and try again.');
        onError && onError(error);
      }
    };

    script.onerror = () => {
      setPaymentStatus('error');
      setErrorMessage('Failed to load payment gateway. Please check your internet connection and try again.');
      onError && onError(new Error('Failed to load Moyasser SDK'));
    };

    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      
      // Clean up any Moyasser instances or event listeners if needed
      moyasserInstance = null;
    };
  }, [paymentData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple mb-4" />
        <p className="text-center text-muted-foreground">
          {paymentStatus === 'processing' ? 'Processing payment...' : 'Initializing payment...'}
        </p>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-red-200 rounded-md bg-red-50">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-center text-red-600 font-medium mb-2">Payment Error</p>
        <p className="text-center text-muted-foreground mb-4">{errorMessage}</p>
        <Button 
          onClick={retryPayment}
          className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-green-200 rounded-md bg-green-50">
        <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
        <p className="text-center text-green-600 font-medium mb-2">Payment Successful</p>
        <p className="text-center text-muted-foreground">Your payment has been processed successfully.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="moyasser-payment-form" className="w-full"></div>
    </div>
  );
};

export default MoyasserPaymentForm;
