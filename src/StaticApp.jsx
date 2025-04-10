// Modified App.jsx for static deployment
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';

// Import static fixes
import StaticRouter from './fixes/StaticRouter';
import { StaticAuthProvider, StaticLanguageProvider, StaticGoogleAnalytics, StaticPerformanceMonitor } from './fixes/StaticContextProviders';

// Simple ScrollToTop component implementation
const ScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

// Simple ErrorBoundary component implementation
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

// Simple placeholder components for pages
const Index = () => <div>Home Page</div>;
const ShopJam3a = () => <div>Shop Jam3a Page</div>;
const JoinJam3a = () => <div>Join Jam3a Page</div>;
const HowItWorks = () => <div>How It Works Page</div>;
const AboutUs = () => <div>About Us Page</div>;
const FAQPage = () => <div>FAQ Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const NotFound = () => <div>404 Not Found Page</div>;
const PrivacyPolicy = () => <div>Privacy Policy Page</div>;
const TermsOfService = () => <div>Terms of Service Page</div>;
const ContactUs = () => <div>Contact Us Page</div>;

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
              <StaticRouter>
                <StaticGoogleAnalytics />
                <StaticPerformanceMonitor />
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
