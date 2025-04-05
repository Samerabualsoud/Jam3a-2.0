import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedProductsManager from './EnhancedProductsManager';
import EnhancedContentManager from './EnhancedContentManager';
import EnhancedDashboard from './EnhancedDashboard';
import { ProductProvider } from '@/contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, ShoppingBag, Mail, BarChart2 } from 'lucide-react';

const AdminDashboardFeatures = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  return (
    <ProductProvider>
      <div className="container mx-auto py-6 space-y-6">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <EnhancedDashboard />
          </TabsContent>
          
          <TabsContent value="products">
            <EnhancedProductsManager />
          </TabsContent>
          
          <TabsContent value="content">
            <EnhancedContentManager />
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management functionality will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Admin settings functionality will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProductProvider>
  );
};

export default AdminDashboardFeatures;
