// Modified App.jsx for static deployment
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Toaster } from '@/components/ui/toaster';
// Remove Sonner import that's causing issues
// import { Sonner } from 'sonner';

// Import pages
import Index from '@/pages/Index';
import ShopJam3a from '@/pages/ShopJam3a';
import JoinJam3a from '@/pages/JoinJam3a';
import HowItWorks from '@/pages/HowItWorks';
import AboutUs from '@/pages/AboutUs';
import FAQPage from '@/pages/FAQ';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ContactUs from '@/pages/ContactUs';

// Import static fixes
import StaticRouter from './fixes/StaticRouter';
import { StaticAuthProvider, StaticLanguageProvider, StaticGoogleAnalytics, StaticPerformanceMonitor } from './fixes/StaticContextProviders';

// Import components
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';

// Simple protected route for static deployment
const ProtectedRoute = ({ children }) => {
  return <>{children}</>;
};

const StaticApp = () => {
  // Create a client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  }));

  // Define routes configuration
  const routesConfig = [
    // Public routes
    { path: "/", element: <Index /> },
    { path: "/shop-jam3a", element: <ShopJam3a /> },
    { path: "/join-jam3a", element: <JoinJam3a /> },
    { path: "/join-jam3a/:id", element: <JoinJam3a /> },
    { path: "/how-it-works", element: <HowItWorks /> },
    { path: "/about", element: <AboutUs /> },
    { path: "/faq", element: <FAQPage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/privacy", element: <PrivacyPolicy /> },
    { path: "/terms", element: <TermsOfService /> },
    { path: "/contact", element: <ContactUs /> },
    
    // Redirects
    { path: "/shop-all-deals", element: <Navigate to="/shop-jam3a" replace /> },
    
    // Catch-all route for 404
    { path: "*", element: <NotFound /> }
  ];

  // Function to render routes recursively with authentication handling
  const renderRoutes = (routes) => {
    return routes.map((route) => {
      // If route requires authentication, wrap it in ProtectedRoute
      const element = route.requireAuth ? (
        <ProtectedRoute requiredRole={route.requiredRole}>
          {route.element}
        </ProtectedRoute>
      ) : (
        route.element
      );
      return (
        <Route key={route.path} path={route.path} element={element}>
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StaticAuthProvider>
          <TooltipProvider>
            <StaticLanguageProvider>
              <Toaster />
              {/* Removed Sonner component that was causing issues */}
              {/* Use HashRouter for static deployment */}
              <StaticRouter>
                {/* Add mock Google Analytics tracking */}
                <StaticGoogleAnalytics />
                
                {/* Add mock performance monitoring */}
                <StaticPerformanceMonitor />
                
                {/* Add ScrollToTop component to handle automatic scrolling on route changes */}
                <ScrollToTop />
                <Routes>
                  {renderRoutes(routesConfig)}
                </Routes>
              </StaticRouter>
            </StaticLanguageProvider>
          </TooltipProvider>
        </StaticAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default StaticApp;
