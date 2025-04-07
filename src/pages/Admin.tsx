
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
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  // Check if user has admin email
  const hasAdminEmail = user && user.email === 'admin@jam3a.me';
  
  // Combined admin check - either has isAdmin flag or admin email
  const isAdminUser = isAdmin || hasAdminEmail;

  // Redirect non-admin users - this is a backup security measure
  // The main protection is handled by the AdminRoute component
  useEffect(() => {
    if (isAuthenticated && user && !isAdminUser) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, user, isAdminUser, navigate, toast]);

  if (!isAuthenticated || !isAdminUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>You need admin privileges to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Back to Home
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
