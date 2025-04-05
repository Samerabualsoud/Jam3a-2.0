import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AboutUs from "./pages/AboutUs";
import { LanguageProvider } from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import FAQ from "./pages/FAQ";
import ShopJam3a from "./pages/ShopJam3a";
import StartJam3a from "./pages/StartJam3a";
import HowItWorks from "./pages/HowItWorks";
import FAQPage from "./pages/FAQPage";
import Sellers from "./pages/Sellers";
import SellerLogin from "./pages/SellerLogin";
import SellerRegister from "./pages/SellerRegister";
import SellerRegistration from "./pages/SellerRegistration";
import JoinJam3a from "./pages/JoinJam3a";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import TrackOrder from "./pages/TrackOrder";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import CustomerSupport from "./pages/CustomerSupport";
import SellerGuidelines from "./pages/SellerGuidelines";
import SellerSupport from "./pages/SellerSupport";
import BecomeASeller from "./pages/BecomeASeller";
import MyJam3a from "./pages/MyJam3a";
import Cart from "./pages/Cart";
import UserProfile from "./pages/UserProfile";
import ScrollToTop from "./components/ScrollToTop";
import GoogleAnalytics from "./components/GoogleAnalytics";

// Define route types for better organization
type RouteConfig = {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  requireAuth?: boolean;
  requiredRole?: string;
};

// Error boundary component for catching runtime errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
    // You could also log to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-6 max-w-md mx-auto my-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Go to Home Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring
const PerformanceMonitor = () => {
  useEffect(() => {
    // Report web vitals
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const paintMetrics = performance.getEntriesByType('paint');
          const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          console.log('Performance metrics:', {
            firstPaint: paintMetrics.find(m => m.name === 'first-paint')?.startTime,
            firstContentfulPaint: paintMetrics.find(m => m.name === 'first-contentful-paint')?.startTime,
            domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
            loadTime: navigationTiming.loadEventEnd - navigationTiming.startTime,
          });
        }, 0);
      });
    }
  }, []);

  return null;
};

const App = () => {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());

  // Google Analytics measurement ID
  const GA_MEASUREMENT_ID = "G-G3N8DYCLBM"; // Updated with the correct GA measurement ID

  // Define routes configuration
  const routesConfig: RouteConfig[] = [
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
    { path: "/seller-login", element: <SellerLogin /> },
    { path: "/seller-register", element: <SellerRegister /> },
    { path: "/admin-login", element: <AdminLogin /> },
    { path: "/privacy", element: <PrivacyPolicy /> },
    { path: "/terms", element: <TermsOfService /> },
    { path: "/contact", element: <ContactUs /> },
    { path: "/track-order", element: <TrackOrder /> },
    { path: "/returns", element: <ReturnsPolicy /> },
    { path: "/support", element: <CustomerSupport /> },
    { path: "/seller-guidelines", element: <SellerGuidelines /> },
    { path: "/seller-support", element: <SellerSupport /> },
    { path: "/become-seller", element: <BecomeASeller /> },
    
    // Protected routes (require authentication)
    { path: "/my-jam3a", element: <MyJam3a />, requireAuth: true },
    { path: "/cart", element: <Cart />, requireAuth: true },
    { path: "/profile", element: <UserProfile />, requireAuth: true },
    { path: "/start-jam3a", element: <StartJam3a />, requireAuth: true },
    { path: "/seller/register", element: <SellerRegistration />, requireAuth: true },
    
    // Role-specific routes
    { path: "/sellers", element: <Sellers />, requireAuth: true, requiredRole: "seller" },
    { path: "/admin/*", element: <Admin />, requireAuth: true, requiredRole: "admin" },
    
    // Redirects
    { path: "/shop-all-deals", element: <Navigate to="/shop-jam3a" replace /> },
    
    // Catch-all route for 404
    { path: "*", element: <NotFound /> }
  ];

  // Function to render routes recursively with authentication handling
  const renderRoutes = (routes: RouteConfig[]) => {
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
        <AuthProvider>
          <TooltipProvider>
            <LanguageProvider>
              <Toaster />
              <Sonner />
              {/* Use BrowserRouter for server-based approach */}
              <BrowserRouter>
                {/* Add Google Analytics tracking */}
                <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
                
                {/* Add performance monitoring */}
                <PerformanceMonitor />
                
                {/* Add ScrollToTop component to handle automatic scrolling on route changes */}
                <ScrollToTop />
                <Routes>
                  {renderRoutes(routesConfig)}
                </Routes>
              </BrowserRouter>
            </LanguageProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
