import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  adminOnly?: boolean;
  sellerOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false,
  sellerOnly = false
}) => {
  const { isAuthenticated, isAdmin, isSeller, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if route requires admin role
  if (adminOnly && !isAdmin) {
    // Redirect to home page if not admin
    return <Navigate to="/" replace />;
  }

  // Check if route requires seller role
  if (sellerOnly && !isSeller) {
    // Redirect to home page if not seller
    return <Navigate to="/" replace />;
  }

  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
