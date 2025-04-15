import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  RefreshCw, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiService from '@/services/api';
import { API_BASE_URL } from '@/config';

// Form schema for analytics configuration
const analyticsConfigSchema = z.object({
  trackingId: z.string().min(1, 'Tracking ID is required'),
  ipAnonymization: z.boolean().default(true),
  trackPageViews: z.boolean().default(true),
  trackEvents: z.boolean().default(true),
  active: z.boolean().default(true)
});

type AnalyticsConfigValues = z.infer<typeof analyticsConfigSchema>;

// Mock analytics data for when API fails
const MOCK_ANALYTICS_DATA = {
  pageViews: {
    total: 12500,
    change: 15.3,
    data: [
      { date: 'Apr 1', views: 320 },
      { date: 'Apr 2', views: 350 },
      { date: 'Apr 3', views: 400 },
      { date: 'Apr 4', views: 420 },
      { date: 'Apr 5', views: 380 },
      { date: 'Apr 6', views: 450 },
      { date: 'Apr 7', views: 500 }
    ]
  },
  users: {
    total: 5200,
    change: 8.7,
    data: [
      { date: 'Apr 1', users: 120 },
      { date: 'Apr 2', users: 150 },
      { date: 'Apr 3', users: 180 },
      { date: 'Apr 4', users: 200 },
      { date: 'Apr 5', users: 190 },
      { date: 'Apr 6', users: 210 },
      { date: 'Apr 7', users: 230 }
    ]
  },
  topPages: [
    { path: '/', views: 4200, title: 'Home Page' },
    { path: '/shop-all-deals', views: 3100, title: 'Shop All Deals' },
    { path: '/start-jam3a', views: 2800, title: 'Start a Jam3a' },
    { path: '/join-jam3a', views: 1400, title: 'Join a Jam3a' },
    { path: '/about', views: 1000, title: 'About Us' }
  ],
  devices: {
    mobile: 65,
    desktop: 30,
    tablet: 5
  },
  conversions: {
    total: 850,
    rate: 16.3,
    change: 5.2
  }
};

// Default analytics config for when API fails
const DEFAULT_ANALYTICS_CONFIG = {
  trackingId: 'G-G3N8DYCLBM',
  ipAnonymization: true,
  trackPageViews: true,
  trackEvents: true,
  active: true
};

const AnalyticsIntegration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<AnalyticsConfigValues>({
    resolver: zodResolver(analyticsConfigSchema),
    defaultValues: {
      trackingId: '',
      ipAnonymization: true,
      trackPageViews: true,
      trackEvents: true,
      active: true
    }
  });

  // Fetch analytics configuration on component mount
  useEffect(() => {
    fetchAnalyticsConfig();
    fetchAnalyticsData();
  }, []);

  // Fetch analytics configuration
  const fetchAnalyticsConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to get from API - use direct path instead of relative path
      try {
        // Use direct path to analytics config endpoint
        const configEndpoint = `${API_BASE_URL}/analytics/config`;
        console.log('Fetching analytics config from:', configEndpoint);
        
        const response = await fetch(configEndpoint);
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update form values
        form.reset({
          trackingId: data.trackingId || '',
          ipAnonymization: data.ipAnonymization !== false,
          trackPageViews: data.trackPageViews !== false,
          trackEvents: data.trackEvents !== false,
          active: data.active !== false
        });
        
        // Store in localStorage for fallback
        localStorage.setItem('analyticsConfig', JSON.stringify(data));
      } catch (apiError) {
        console.warn('API error, falling back to localStorage or defaults:', apiError);
        
        // Try to load from localStorage as fallback
        const storedConfig = localStorage.getItem('analyticsConfig');
        if (storedConfig) {
          try {
            const config = JSON.parse(storedConfig);
            form.reset({
              trackingId: config.trackingId || '',
              ipAnonymization: config.ipAnonymization !== false,
              trackPageViews: config.trackPageViews !== false,
              trackEvents: config.trackEvents !== false,
              active: config.active !== false
            });
            
            toast({
              title: 'Using cached configuration',
              description: 'Could not connect to server. Using locally saved configuration.',
              variant: 'warning',
            });
          } catch (parseError) {
            console.error('Error parsing stored analytics configuration:', parseError);
            // Fall back to defaults
            form.reset(DEFAULT_ANALYTICS_CONFIG);
            
            toast({
              title: 'Using default configuration',
              description: 'Could not load configuration. Using default values.',
              variant: 'warning',
            });
          }
        } else {
          // No stored config, use defaults
          form.reset(DEFAULT_ANALYTICS_CONFIG);
          
          toast({
            title: 'Using default configuration',
            description: 'Could not load configuration. Using default values.',
            variant: 'warning',
          });
        }
      }
    } catch (err) {
      console.error('Error in analytics config flow:', err);
      setError('Failed to load analytics configuration. Using default values.');
      form.reset(DEFAULT_ANALYTICS_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      try {
        // Use direct path to analytics data endpoint
        const dataEndpoint = `${API_BASE_URL}/analytics/data`;
        console.log('Fetching analytics data from:', dataEndpoint);
        
        const response = await fetch(dataEndpoint);
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data) {
          // Handle different response formats
          const analyticsData = data.data ? data.data : data;
          setAnalyticsData(analyticsData);
          setLastUpdated(new Date());
        } else {
          throw new Error('Invalid response format');
        }
      } catch (apiError) {
        console.warn('API error, using mock analytics data:', apiError);
        // Use mock data when API fails
        setAnalyticsData(MOCK_ANALYTICS_DATA);
        setLastUpdated(new Date());
        
        toast({
          title: 'Using sample data',
          description: 'Could not connect to analytics server. Showing sample data.',
          variant: 'warning',
        });
      }
    } catch (err) {
      console.error('Error in analytics data flow:', err);
      setError('Failed to load analytics data. Using sample data.');
      // Use mock data as last resort
      setAnalyticsData(MOCK_ANALYTICS_DATA);
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  // Save analytics configuration
  const onSubmit = async (values: AnalyticsConfigValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use direct path to analytics config endpoint
        const configEndpoint = `${API_BASE_URL}/analytics/config`;
        console.log('Saving analytics config to:', configEndpoint);
        
        // Try POST first
        const postResponse = await fetch(configEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        if (postResponse.ok) {
          toast({
            title: 'Configuration saved',
            description: 'Google Analytics configuration has been updated successfully.',
            variant: 'default',
          });
          
          // Store in localStorage for fallback
          localStorage.setItem('analyticsConfig', JSON.stringify(values));
        } else {
          throw new Error(`POST failed with status ${postResponse.status}`);
        }
      } catch (postError) {
        console.warn('POST failed, trying PUT:', postError);
        
        try {
          // Try PUT if POST fails
          const configEndpoint = `${API_BASE_URL}/analytics/config`;
          const putResponse = await fetch(configEndpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          
          if (putResponse.ok) {
            toast({
              title: 'Configuration saved',
              description: 'Google Analytics configuration has been updated successfully.',
              variant: 'default',
            });
            
            // Store in localStorage for fallback
            localStorage.setItem('analyticsConfig', JSON.stringify(values));
          } else {
            throw new Error(`PUT failed with status ${putResponse.status}`);
          }
        } catch (putError) {
          console.error('Both POST and PUT failed:', putError);
          
          // Store in localStorage even if API fails
          localStorage.setItem('analyticsConfig', JSON.stringify(values));
          
          toast({
            title: 'Configuration saved locally',
            description: 'Could not save to server, but configuration is saved locally.',
            variant: 'default',
          });
        }
      }
    } catch (err) {
      console.error('Error saving analytics configuration:', err);
      setError('Failed to save configuration. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to save Google Analytics configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh analytics data
  const handleRefresh = async () => {
    await fetchAnalyticsData();
    
    toast({
      title: 'Analytics refreshed',
      description: 'Analytics data has been refreshed.',
      variant: 'default',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Analytics Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="configuration">
            <TabsList className="mb-4">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="configuration">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-destructive mb-4">
                      <AlertCircle size={16} />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Analytics Tracking ID</FormLabel>
                        <FormControl>
                          <Input placeholder="G-XXXXXXXXXX" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your Google Analytics 4 measurement ID (starts with G-)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable Analytics
                            </FormLabel>
                            <FormDescription>
                              Turn Google Analytics tracking on or off
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ipAnonymization"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              IP Anonymization
                            </FormLabel>
                            <FormDescription>
                              Anonymize user IP addresses for privacy
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="trackPageViews"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Track Page Views
                            </FormLabel>
                            <FormDescription>
                              Automatically track page views
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="trackEvents"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Track Events
                            </FormLabel>
                            <FormDescription>
                              Track user interactions and events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Configuration
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="dashboard">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                    {lastUpdated && (
                      <p className="text-sm text-muted-foreground">
                        Last updated: {lastUpdated.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Data
                      </>
                    )}
                  </Button>
                </div>
                
                {error && (
                  <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-destructive">
                    <AlertCircle size={16} />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                
                {analyticsData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Page Views
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {analyticsData.pageViews?.total?.toLocaleString() || '0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {analyticsData.pageViews?.change > 0 ? '+' : ''}
                          {analyticsData.pageViews?.change?.toFixed(1) || '0'}% from last period
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Users
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {analyticsData.users?.total?.toLocaleString() || '0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {analyticsData.users?.change > 0 ? '+' : ''}
                          {analyticsData.users?.change?.toFixed(1) || '0'}% from last period
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Conversion Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {analyticsData.conversions?.rate?.toFixed(1) || '0'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {analyticsData.conversions?.change > 0 ? '+' : ''}
                          {analyticsData.conversions?.change?.toFixed(1) || '0'}% from last period
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Conversions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {analyticsData.conversions?.total?.toLocaleString() || '0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total completed actions
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                
                {analyticsData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">
                          Top Pages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analyticsData.topPages?.map((page, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="truncate max-w-[70%]">
                                <span className="text-xs font-medium">{page.title || 'Unknown'}</span>
                                <p className="text-xs text-muted-foreground truncate">
                                  {page.path}
                                </p>
                              </div>
                              <span className="text-xs font-medium">
                                {page.views?.toLocaleString() || '0'} views
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">
                          Device Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">Mobile</span>
                            <span className="text-xs font-medium">
                              {analyticsData.devices?.mobile || '0'}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">Desktop</span>
                            <span className="text-xs font-medium">
                              {analyticsData.devices?.desktop || '0'}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">Tablet</span>
                            <span className="text-xs font-medium">
                              {analyticsData.devices?.tablet || '0'}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsIntegration;
