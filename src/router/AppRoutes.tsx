import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import DealDetails from '@/pages/DealDetails';
import JoinJam3a from '@/pages/JoinJam3a';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import OrderConfirmation from '@/pages/OrderConfirmation';
import MyJam3a from '@/pages/MyJam3a';
import Admin from '@/pages/Admin';
import PublicOnlyRoute from '@/components/auth/PublicOnlyRoute';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        // Public Routes
        { index: true, element: <ErrorBoundary><Index /></ErrorBoundary> },
        { path: 'jam3a/:dealId', element: <ErrorBoundary><DealDetails /></ErrorBoundary> },
        { path: 'j/:dealId', element: <ErrorBoundary><DealDetails /></ErrorBoundary> },
        { path: 'join-jam3a', element: <ErrorBoundary><JoinJam3a /></ErrorBoundary> },
        { path: 'join-jam3a/:dealId', element: <ErrorBoundary><JoinJam3a /></ErrorBoundary> },
        
        // Public Only Routes (redirect if already logged in)
        { 
          element: <PublicOnlyRoute />,
          children: [
            { path: 'login', element: <ErrorBoundary><Login /></ErrorBoundary> },
            { path: 'register', element: <ErrorBoundary><Register /></ErrorBoundary> }
          ]
        },
        
        // Protected Routes (require authentication)
        {
          element: <ProtectedRoute />,
          children: [
            { path: 'my-jam3a', element: <ErrorBoundary><MyJam3a /></ErrorBoundary> },
            { path: 'order-confirmation', element: <ErrorBoundary><OrderConfirmation /></ErrorBoundary> },
            { path: 'admin/*', element: <ErrorBoundary><Admin /></ErrorBoundary> }
          ]
        },
        
        // Fallback routes
        { path: '404', element: <ErrorBoundary><NotFound /></ErrorBoundary> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    }
  ]);

  return routes;
};

export default AppRoutes;
