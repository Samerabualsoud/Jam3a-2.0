import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Admin from '@/pages/Admin';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import PaymentVerificationHandler from '@/components/payment/PaymentVerificationHandler';
import ProtectedRoute from '@/components/auth/ProtectedRoutes';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Index />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout/:orderId" element={<Checkout />} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="admin/*" element={
          <ProtectedRoute adminOnly>
            <Admin />
          </ProtectedRoute>
        } />
        
        {/* Payment Routes */}
        <Route path="payment/callback" element={<PaymentVerificationHandler />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
