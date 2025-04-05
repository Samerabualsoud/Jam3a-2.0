import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentVerificationHandler from '@/components/payment/PaymentVerificationHandler';
import OrderConfirmation from '@/pages/OrderConfirmation';

/**
 * Component to handle payment routes
 * This should be integrated into the main AppRouter
 */
const PaymentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/payment/callback" element={<PaymentVerificationHandler />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
    </Routes>
  );
};

export default PaymentRoutes;
