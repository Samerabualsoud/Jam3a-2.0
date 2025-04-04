
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
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

// Define route types for better organization
type RouteConfig = {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  requireAuth?: boolean;
  requiredRole?: string;
};

const App = () => {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {renderRoutes(routesConfig)}
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
