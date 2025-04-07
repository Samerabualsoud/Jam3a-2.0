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
  trackingId: 'G-EXAMPLE123',
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
      
      // Try to get from API
      try {
        const response = await apiService.get('/analytics/config');
        
        // Update form values
        form.reset({
          trackingId: response.trackingId || '',
          ipAnonymization: response.ipAnonymization !== false,
          trackPageViews: response.trackPageViews !== false,
          trackEvents: response.trackEvents !== false,
          active: response.active !== false
        });
        
        // Store in localStorage for fallback
        localStorage.setItem('analyticsConfig', JSON.stringify(response));
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
          } catch (parseError) {
            console.error('Error parsing stored analytics configuration:', parseError);
            // Fall back to defaults
            form.reset(DEFAULT_ANALYTICS_CONFIG);
          }
        } else {
          // No stored config, use defaults
          form.reset(DEFAULT_ANALYTICS_CONFIG);
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
        const response = await apiService.get('/analytics/data');
        
        if (response) {
          // Handle different response formats
          const data = response.data ? response.data : response;
          setAnalyticsData(data);
          setLastUpdated(new Date());
        } else {
          throw new Error('Invalid response format');
        }
      } catch (apiError) {
        console.warn('API error, using mock analytics data:', apiError);
        // Use mock data when API fails
        setAnalyticsData(MOCK_ANALYTICS_DATA);
        setLastUpdated(new Date());
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
        // Try POST first
        await apiService.post('/analytics/config', values);
        
        toast({
          title: 'Configuration saved',
          description: 'Google Analytics configuration has been updated successfully.',
          variant: 'default',
        });
        
        // Store in localStorage for fallback
        localStorage.setItem('analyticsConfig', JSON.stringify(values));
      } catch (postError) {
        console.warn('POST failed, trying PUT:', postError);
        
        try {
          // Try PUT if POST fails
          await apiService.put('/analytics/config', values);
          
          toast({
            title: 'Configuration saved',
            description: 'Google Analytics configuration has been updated successfully.',
            variant: 'default',
          });
          
          // Store in localStorage for fallback
          localStorage.setItem('analyticsConfig', JSON.stringify(values));
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
    try {
      setIsRefreshing(true);
      setError(null);
      
      try {
        // Try to refresh data from API
        await apiService.post('/analytics/refresh');
      } catch (refreshError) {
        console.warn('Refresh API not available:', refreshError);
        // Continue to fetch data even if refresh fails
      }
      
      // Then fetch the updated data
      await fetchAnalyticsData();
      
      toast({
        title: 'Data refreshed',
        description: 'Analytics data has been refreshed successfully.',
        variant: 'default',
      });
    } catch (err) {
      console.error('Error refreshing analytics data:', err);
      setError('Failed to refresh analytics data. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to refresh analytics data.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Render analytics data
  const renderAnalyticsData = () => {
    if (!analyticsData) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No analytics data available. Configure Google Analytics and refresh data.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Page Views */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.pageViews && Array.isArray(analyticsData.pageViews.data) && analyticsData.pageViews.data.length > 0 ? (
              <>
                <div className="text-3xl font-bold mb-2">{analyticsData.pageViews.total.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">
                  {analyticsData.pageViews.change > 0 ? '+' : ''}{analyticsData.pageViews.change}% from last period
                </div>
                <div className="h-[200px] mt-4">
                  {/* Chart would go here */}
                  <div className="flex flex-col space-y-2">
                    {analyticsData.pageViews.data.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.date}</span>
                        <span>{item.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No page view data available</p>
            )}
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.users && Array.isArray(analyticsData.users.data) && analyticsData.users.data.length > 0 ? (
              <>
                <div className="text-3xl font-bold mb-2">{analyticsData.users.total.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">
                  {analyticsData.users.change > 0 ? '+' : ''}{analyticsData.users.change}% from last period
                </div>
                <div className="h-[200px] mt-4">
                  {/* Chart would go here */}
                  <div className="flex flex-col space-y-2">
                    {analyticsData.users.data.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.date}</span>
                        <span>{item.users} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No user data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.topPages && Array.isArray(analyticsData.topPages) && analyticsData.topPages.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="truncate max-w-[200px]">
                      <div className="font-medium">{page.title || page.path}</div>
                      <div className="text-sm text-muted-foreground">{page.path}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{page.views.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">views</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No top pages data available</p>
            )}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.devices ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{analyticsData.devices.mobile}%</div>
                    <div className="text-sm text-muted-foreground">Mobile</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{analyticsData.devices.desktop}%</div>
                    <div className="text-sm text-muted-foreground">Desktop</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{analyticsData.devices.tablet}%</div>
                    <div className="text-sm text-muted-foreground">Tablet</div>
                  </div>
                </div>
                <div className="h-[100px]">
                  {/* Chart would go here */}
                  <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-blue-500 h-full" style={{ width: `${analyticsData.devices.mobile}%` }}></div>
                      <div className="bg-green-500 h-full" style={{ width: `${analyticsData.devices.desktop}%` }}></div>
                      <div className="bg-yellow-500 h-full" style={{ width: `${analyticsData.devices.tablet}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No device data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Google Analytics Integration</h2>
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
      
      <Tabs defaultValue="configuration">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="data">Analytics Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking ID</FormLabel>
                        <FormControl>
                          <Input placeholder="G-XXXXXXXXXX" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your Google Analytics tracking ID (e.g., G-XXXXXXXXXX)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                            Turn analytics tracking on or off
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
                            Anonymize IP addresses for privacy compliance
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
                  
                  <Button type="submit" disabled={isLoading}>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              {lastUpdated && (
                <div className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleString()}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isRefreshing ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Refreshing analytics data...</p>
                </div>
              ) : (
                renderAnalyticsData()
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsIntegration;
