import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import paymentService from '@/services/PaymentService';
import { handleError, ErrorType, createError } from '@/utils/errorHandler';

interface MoyasserPaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess: (payment: any) => void;
  onError: (error: any) => void;
}

/**
 * Enhanced Moyasser Payment Form with improved error handling and loading states
 */
const EnhancedMoyasserPaymentForm: React.FC<MoyasserPaymentFormProps> = ({ 
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
        
        if (!orderId) {
          throw createError(
            ErrorType.VALIDATION,
            'Invalid order',
            'Order ID is required to process payment',
            'INVALID_ORDER_ID'
          );
        }
        
        const response = await paymentService.initializeMoyasserPayment(orderId);
        setPaymentData(response);
      } catch (error) {
        const appError = handleError(error);
        setPaymentStatus('error');
        setErrorMessage(appError.details || 'Failed to initialize payment gateway. Please try again later.');
        onError && onError(appError);
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [orderId, toast, onError]);

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      if (!paymentId) {
        throw createError(
          ErrorType.VALIDATION,
          'Invalid payment',
          'Payment ID is required for verification',
          'INVALID_PAYMENT_ID'
        );
      }
      
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
        const statusError = createError(
          ErrorType.PAYMENT,
          'Payment Verification Failed',
          `Payment status: ${verifiedPayment.status}. Please contact support.`,
          'PAYMENT_VERIFICATION_FAILED'
        );
        
        setPaymentStatus('error');
        setErrorMessage(statusError.details || 'Payment verification failed. Please contact support.');
        showErrorToast(statusError);
        onError && onError(statusError);
      }
    } catch (error) {
      const appError = handleError(error);
      setPaymentStatus('error');
      setErrorMessage(appError.details || 'Failed to verify payment. Please contact customer support with order ID: ' + orderId);
      onError && onError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (error: any) => {
    const appError = handleError(error);
    setPaymentStatus('error');
    setErrorMessage(appError.details || 'There was an error processing your payment. Please try again.');
    onError && onError(appError);
  };

  const showErrorToast = (error: any) => {
    toast({
      title: error.message || 'Payment Error',
      description: error.details || 'There was an error processing your payment.',
      variant: 'destructive',
    });
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
        const appError = handleError(error);
        setPaymentStatus('error');
        setErrorMessage(appError.details || 'Failed to initialize payment gateway. Please try again later.');
        onError && onError(appError);
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
          throw createError(
            ErrorType.PAYMENT,
            'Payment SDK Error',
            'Moyasser SDK not loaded properly',
            'SDK_LOAD_ERROR'
          );
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
          throw createError(
            ErrorType.PAYMENT,
            'Payment Form Error',
            'Payment form container not found',
            'CONTAINER_NOT_FOUND'
          );
        }
      } catch (error) {
        const appError = handleError(error);
        setPaymentStatus('error');
        setErrorMessage(appError.details || 'Failed to initialize payment form. Please refresh and try again.');
        onError && onError(appError);
      }
    };

    script.onerror = () => {
      const scriptError = createError(
        ErrorType.NETWORK,
        'Resource Error',
        'Failed to load payment gateway. Please check your internet connection and try again.',
        'SCRIPT_LOAD_ERROR'
      );
      
      setPaymentStatus('error');
      setErrorMessage(scriptError.details || 'Failed to load payment gateway.');
      showErrorToast(scriptError);
      onError && onError(scriptError);
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

export default EnhancedMoyasserPaymentForm;
