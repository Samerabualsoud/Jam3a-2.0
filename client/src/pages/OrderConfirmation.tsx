import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import paymentService from '@/services/PaymentService';
import orderService from '@/services/OrderService';
import PaymentSummary from '@/components/payment/PaymentSummary';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'

  // Get payment and order from location state if available
  useEffect(() => {
    if (location.state?.payment && location.state?.order) {
      setPayment(location.state.payment);
      setOrder(location.state.order);
      setIsLoading(false);
      
      // Verify payment status
      if (location.state.payment.status === 'completed') {
        setVerificationStatus('success');
      } else if (location.state.payment.paymentMethod === 'bank_transfer' || location.state.payment.paymentMethod === 'cod') {
        // For bank transfer and COD, we don't need immediate verification
        setVerificationStatus('pending');
      } else {
        verifyPayment(location.state.payment._id);
      }
    } else if (orderId) {
      // If no state is available, fetch order and payment data
      fetchOrderAndPayment();
    }
  }, [location, orderId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: `/order-confirmation/${orderId}` } });
    }
  }, [isAuthenticated, authLoading, navigate, orderId]);

  const fetchOrderAndPayment = async () => {
    try {
      setIsLoading(true);
      
      // Fetch order details
      const orderData = await orderService.getOrder(orderId);
      setOrder(orderData);
      
      // If order has a payment ID, fetch payment details
      if (orderData.paymentId) {
        const paymentData = await paymentService.getPayment(orderData.paymentId);
        setPayment(paymentData);
        
        // Verify payment status
        if (paymentData.status === 'completed') {
          setVerificationStatus('success');
        } else if (paymentData.paymentMethod === 'bank_transfer' || paymentData.paymentMethod === 'cod') {
          setVerificationStatus('pending');
        } else {
          verifyPayment(paymentData._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch order or payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      const verifiedPayment = await paymentService.verifyMoyasserPayment(paymentId);
      setPayment(verifiedPayment);
      
      if (verifiedPayment.status === 'completed') {
        setVerificationStatus('success');
        toast({
          title: 'Payment Verified',
          description: 'Your payment has been successfully verified.',
        });
      } else {
        setVerificationStatus('error');
        toast({
          title: 'Payment Verification Failed',
          description: `Payment status: ${verifiedPayment.status}. Please contact support.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus('error');
      toast({
        title: 'Payment Verification Error',
        description: 'Failed to verify payment. Please contact support.',
        variant: 'destructive',
      });
    }
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
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            {verificationStatus === 'success' || payment?.status === 'completed' ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
                <CardDescription>
                  Thank you for your purchase. Your order has been successfully placed.
                </CardDescription>
              </>
            ) : payment?.paymentMethod === 'bank_transfer' ? (
              <>
                <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Order Placed - Awaiting Payment</CardTitle>
                <CardDescription>
                  Please complete your bank transfer to process your order.
                </CardDescription>
              </>
            ) : payment?.paymentMethod === 'cod' ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
                <CardDescription>
                  Thank you for your purchase. Your order has been placed with Cash on Delivery.
                </CardDescription>
              </>
            ) : (
              <>
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Payment Verification Failed</CardTitle>
                <CardDescription>
                  There was an issue with your payment. Please contact customer support.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-medium mb-2">Order Details</h3>
                <p className="text-sm text-muted-foreground">Order ID: {order._id}</p>
                <p className="text-sm text-muted-foreground">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">Status: {order.status}</p>
              </div>
              
              {payment && (
                <div className="p-4 bg-slate-50 rounded-md">
                  <h3 className="font-medium mb-2">Payment Details</h3>
                  <p className="text-sm text-muted-foreground">Payment Method: {
                    payment.paymentMethod === 'moyasser' ? 'Credit/Debit Card' :
                    payment.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                    'Cash on Delivery'
                  }</p>
                  <p className="text-sm text-muted-foreground">Payment Status: {payment.status}</p>
                  {payment.transactionId && (
                    <p className="text-sm text-muted-foreground">Transaction ID: {payment.transactionId}</p>
                  )}
                </div>
              )}
              
              <PaymentSummary order={order} />
              
              {payment?.paymentMethod === 'bank_transfer' && (
                <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">Bank Transfer Instructions</h3>
                  <p className="text-sm text-amber-700 mb-2">
                    Please transfer the exact amount to our bank account and include your Order ID as reference.
                  </p>
                  <div className="text-sm text-amber-700">
                    <p>Bank: Saudi National Bank</p>
                    <p>Account Name: Jam3a Trading Company</p>
                    <p>Account Number: 1234567890</p>
                    <p>IBAN: SA0380000000001234567890</p>
                    <p>Amount: {order.totalAmount.toFixed(2)} SAR</p>
                    <p>Reference: Order {order._id.substring(0, 8)}</p>
                  </div>
                </div>
              )}
              
              {payment?.paymentMethod === 'cod' && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Cash on Delivery Information</h3>
                  <p className="text-sm text-blue-700">
                    Please have the exact amount of {(order.totalAmount + 15).toFixed(2)} SAR ready when your order is delivered.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
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
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
