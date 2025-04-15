import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  UserPlus,
  Clock,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/contexts/ProductContext";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const EnhancedDashboard = () => {
  const { products, activeJam3aDeals, refreshProducts, refreshJam3aDeals, isLoading } = useProducts();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate dashboard stats
  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const activeDeals = activeJam3aDeals.filter(d => d.status === 'active').length;
  const totalParticipants = activeJam3aDeals.reduce((sum, deal) => sum + deal.participants, 0);

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: <Package className="h-8 w-8 text-muted-foreground" />,
      change: "+3%",
      trend: <ArrowUpRight className="h-4 w-4 text-green-500" />
    },
    {
      title: "Active Jam3a Deals",
      value: activeDeals.toString(),
      icon: <Users className="h-8 w-8 text-muted-foreground" />,
      change: "+5%",
      trend: <ArrowUpRight className="h-4 w-4 text-green-500" />
    },
    {
      title: "Total Participants",
      value: totalParticipants.toString(),
      icon: <UserPlus className="h-8 w-8 text-muted-foreground" />,
      change: "+8%",
      trend: <ArrowUpRight className="h-4 w-4 text-green-500" />
    },
    {
      title: "Featured Products",
      value: featuredProducts.toString(),
      icon: <ShoppingCart className="h-8 w-8 text-muted-foreground" />,
      change: "+2%",
      trend: <ArrowUpRight className="h-4 w-4 text-green-500" />
    },
  ];

  // Handle refreshing data
  const handleRefresh = async () => {
    try {
      await refreshProducts();
      await refreshJam3aDeals();
      
      toast({
        title: "Dashboard Refreshed",
        description: "Dashboard data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh dashboard data. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate).getTime();
    const now = Date.now();
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active-deals">Active Jam3a Deals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 flex items-center text-sm text-muted-foreground">
                    {stat.trend}
                    <span className="ml-1">{stat.change} from last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeJam3aDeals.slice(0, 4).map((deal, index) => {
                    const product = products.find(p => p.id === deal.productId);
                    return (
                      <div key={deal.id} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            New participant joined {product?.name || `Product #${deal.productId}`} Jam3a
                          </p>
                          <p className="text-xs text-muted-foreground">{index * 10 + 5} minutes ago</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {activeJam3aDeals.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent activity found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.filter(p => p.featured).slice(0, 3).map(product => (
                    <div key={product.id} className="flex items-center gap-3">
                      {product.image ? (
                        <div className="h-12 w-12 rounded-md overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
                      </div>
                      <Badge className="ml-auto" variant="outline">Featured</Badge>
                    </div>
                  ))}
                  
                  {products.filter(p => p.featured).length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No featured products found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="active-deals">
          <Card>
            <CardHeader>
              <CardTitle>Active Jam3a Deals</CardTitle>
              <CardDescription>
                Monitor all active group buying deals and their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Loading Jam3a deals...
                </div>
              ) : activeJam3aDeals.filter(d => d.status === 'active').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active Jam3a deals found.
                </div>
              ) : (
                <div className="space-y-6">
                  {activeJam3aDeals
                    .filter(deal => deal.status === 'active')
                    .map(deal => {
                      const product = products.find(p => p.id === deal.productId);
                      const progress = (deal.participants / deal.targetParticipants) * 100;
                      const daysLeft = getDaysRemaining(deal.expiryDate);
                      
                      return (
                        <div key={deal.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <div className="flex items-center gap-3 flex-grow">
                              {product?.image ? (
                                <div className="h-16 w-16 rounded-md overflow-hidden">
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                                  <Package className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium">{product?.name || `Product #${deal.productId}`}</h3>
                                <p className="text-sm text-muted-foreground">{deal.category}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{deal.discountRate}% discount</Badge>
                                  <Badge variant="secondary">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(deal.createdAt)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 min-w-[140px]">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Progress:</span>
                                <span className="text-sm font-medium">{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-muted-foreground">
                                  <Users className="h-3 w-3 inline mr-1" />
                                  {deal.participants}/{deal.targetParticipants}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {daysLeft} days left
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDashboard;
