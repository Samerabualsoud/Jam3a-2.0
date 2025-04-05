
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AdminDashboardFeatures from "@/components/admin/AdminDashboardFeatures";
import ProductsManager from "@/components/admin/ProductsManager";
import UsersManager from "@/components/admin/UsersManager";
import OrdersManager from "@/components/admin/OrdersManager";
import AdminSettings from "@/components/admin/AdminSettings";
import RealDataContentManager from "@/components/admin/RealDataContentManager";
import AnalyticsIntegration from "@/components/admin/AnalyticsIntegration";
import PaymentIntegration from "@/components/admin/PaymentIntegration";
import EnhancedEmailManager from "@/components/admin/EnhancedEmailManager";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated but not an admin
    if (isAuthenticated && user && !user.isAdmin) {
      setShowAdminLogin(true);
    }
  }, [isAuthenticated, user]);

  const handleAdminLogin = () => {
    // In a real application, this would be a server-side check
    // For demo purposes, we're using a simple password check
    if (adminPassword === "admin123") {
      // Update the user object to include admin privileges
      if (user) {
        user.isAdmin = true;
        // Force a re-render
        setShowAdminLogin(false);
        toast({
          title: "Admin Access Granted",
          description: "You now have access to the admin panel.",
        });
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect admin password.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>You need to be logged in to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showAdminLogin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Admin Verification</CardTitle>
            <CardDescription>Enter the admin password to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input 
                id="admin-password" 
                type="password" 
                placeholder="Enter admin password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleAdminLogin} className="w-full">
              Verify Admin Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button onClick={() => navigate("/")} variant="outline">
          Back to Website
        </Button>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <AdminDashboardFeatures />
        </TabsContent>
        <TabsContent value="products">
          <ProductsManager />
        </TabsContent>
        <TabsContent value="users">
          <UsersManager />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersManager />
        </TabsContent>
        <TabsContent value="content">
          <RealDataContentManager />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentIntegration />
        </TabsContent>
        <TabsContent value="emails">
          <EnhancedEmailManager />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsIntegration />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
