import React from 'react';
import SellerOnboarding from '@/components/SellerOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const SellerRegistration: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // If user is already a seller, redirect to seller dashboard
  if (isAuthenticated && user?.isSeller) {
    return <Navigate to="/seller/dashboard" replace />;
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/seller/register" replace />;
  }
  
  return <SellerOnboarding />;
};

export default SellerRegistration;
