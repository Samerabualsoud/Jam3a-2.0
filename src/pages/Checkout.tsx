import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import orderService from '@/services/OrderService';
import PaymentSummary from '@/components/payment/PaymentSummary';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import MoyasserPaymentForm from '@/components/payment/MoyasserPaymentForm';
import BankTransferForm from '@/components/payment/BankTransferForm';
import CashOnDeliveryForm from '@/components/payment/CashOnDeliveryForm';
import PaymentStatus from '@/components/payment/PaymentStatus';

/**
 * Enhanced Checkout component with modular payment components
 * Supports multiple payment methods: Moyasser (credit/debit cards), Bank Transfer, and Cash on Delivery
 */
const Checkout = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('moyasser');
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: `/checkout/${orderId}` } });
    }
  }, [isAuthenticated, authLoading, navigate, orderId]);

  useEffect(() => {
    // Fetch order details using OrderService
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const data = await orderService.getOrder(orderId);
        setOrder(data);
        
        // If order is already paid, show success status
        if (data.status === 'paid') {
          setPaymentStatus('success');
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast({
          title: 'Error',
          description: 'Failed to load order details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId && isAuthenticated) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, toast]);

  const handlePaymentSuccess = (payment) => {
    setPaymentStatus('success');
    
    // Redirect to order confirmation page after a short delay
    setTimeout(() => {
      navigate(`/order-confirmation/${order._id}`, { 
        state: { 
          payment, 
          order 
        } 
      });
    }, 2000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setPaymentStatus('error');
    setIsProcessing(false);
  };

  const handleRetryPayment = () => {
    setPaymentStatus(null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              The order you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <PaymentSummary order={order} />
        </div>
        
        {/* Payment Methods */}
        <div className="md:col-span-2">
          {paymentStatus ? (
            <PaymentStatus 
              status={paymentStatus} 
              paymentMethod={paymentMethod}
              orderId={order._id}
              onRetry={handleRetryPayment}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodSelector 
                  value={paymentMethod} 
                  onChange={setPaymentMethod}
                  disabled={isProcessing}
                />
                
                <div className="mt-6">
                  {paymentMethod === 'moyasser' && (
                    <MoyasserPaymentForm 
                      orderId={order._id}
                      amount={order.totalAmount}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  )}
                  
                  {paymentMethod === 'bank_transfer' && (
                    <BankTransferForm
                      orderId={order._id}
                      amount={order.totalAmount}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  )}
                  
                  {paymentMethod === 'cod' && (
                    <CashOnDeliveryForm
                      orderId={order._id}
                      amount={order.totalAmount}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
