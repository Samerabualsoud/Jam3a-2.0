import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Special case for admin role - check email directly
  if (requiredRole === 'admin' && user?.email === 'admin@jam3a.me') {
    // User has admin email, allow access
    return <>{children}</>;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to unauthorized page or home page
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has required role (if any), render the children
  return <>{children}</>;
};

export default ProtectedRoute;
