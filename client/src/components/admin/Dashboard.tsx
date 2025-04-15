import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import ProductsManager from './ProductsManager';
import EnhancedProductsManager from './EnhancedProductsManager';
import ContentManager from './ContentManager';
import EnhancedContentManager from './EnhancedContentManager';
import EmailManager from './EmailManager';
import EnhancedEmailManager from './EnhancedEmailManager';
import OrdersManager from './OrdersManager';
import UsersManager from './UsersManager';
import Settings from './Settings';
import AdminSettings from './AdminSettings';
import AnalyticsIntegration from './AnalyticsIntegration';
import PaymentIntegration from './PaymentIntegration';
import PaymentGatewayIntegration from './PaymentGatewayIntegration';
import DealsManager from './DealsManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products Management</CardTitle>
              <CardDescription>
                Manage your products, inventory, and Jam3a deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedProductsManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle>Deals Management</CardTitle>
              <CardDescription>
                Manage all Jam3a deals, including featured status and Jam3a IDs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DealsManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Manage website content, pages, and sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedContentManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Management</CardTitle>
              <CardDescription>
                Manage email templates and campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedEmailManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>
                View and manage customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Integration</CardTitle>
              <CardDescription>
                Configure and view analytics data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsIntegration />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure system settings and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
