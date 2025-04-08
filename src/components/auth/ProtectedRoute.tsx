/**
 * Protected Route component for Jam3a-2.0
 * Implements route protection based on authentication and role
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '@/services/enhancedAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsVerifying(true);
        
        // Check if user is authenticated
        const isAuth = authService.isAuthenticated();
        
        if (!isAuth) {
          setIsAuthenticated(false);
          setHasRequiredRole(false);
          return;
        }
        
        // Verify token with server
        const isValid = await authService.verifyToken();
        
        if (!isValid) {
          setIsAuthenticated(false);
          setHasRequiredRole(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Check role requirements if any
        if (requiredRoles.length > 0) {
          const user = authService.getUser();
          const hasRole = user && requiredRoles.includes(user.role);
          setHasRequiredRole(hasRole || false);
        } else {
          setHasRequiredRole(true);
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        setIsAuthenticated(false);
        setHasRequiredRole(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyAuth();
  }, [requiredRoles]);

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple" />
        <span className="ml-2 text-jam3a-purple">Verifying authentication...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the location they were trying to access for redirect after login
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page if authenticated but doesn't have required role
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
