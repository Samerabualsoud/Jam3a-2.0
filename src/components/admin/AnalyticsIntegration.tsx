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
      
    } catch (err) {
      console.error('Error fetching analytics configuration:', err);
      setError('Failed to load analytics configuration. Please try again.');
      
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
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const response = await apiService.get('/analytics/data');
      
      if (response && response.success && response.data) {
        setAnalyticsData(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Save analytics configuration
  const onSubmit = async (values: AnalyticsConfigValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.post('/analytics/config', values);
      
      if (response && response.success) {
        toast({
          title: 'Configuration saved',
          description: 'Google Analytics configuration has been updated successfully.',
          variant: 'default',
        });
        
        // Store in localStorage for fallback
        localStorage.setItem('analyticsConfig', JSON.stringify(response.data));
      } else {
        throw new Error('Failed to save configuration');
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
      
      // First refresh the data from Google Analytics
      await apiService.post('/analytics/refresh');
      
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
                    <div className="flex-1">
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm text-muted-foreground">{page.path}</div>
                    </div>
                    <div className="font-medium">{page.views.toLocaleString()} views</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No page data available</p>
            )}
          </CardContent>
        </Card>

        {/* Events */}
        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.events && Array.isArray(analyticsData.events) && analyticsData.events.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.events.map((event, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="font-medium">{event.name.replace(/_/g, ' ')}</div>
                    <div className="font-medium">{event.count.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No event data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Google Analytics Integration</h2>
        <Button 
          variant="outline" 
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
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <Tabs defaultValue="configuration">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking ID</FormLabel>
                        <FormControl>
                          <Input placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your Google Analytics tracking ID (UA-XXXXXXXXX-X or G-XXXXXXXXXX)
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
                            Anonymize user IP addresses for privacy compliance
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
                            Automatically track page views when users navigate
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
                            Track user interactions like clicks and form submissions
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
        
        <TabsContent value="analytics" className="space-y-4">
          {isRefreshing ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          ) : (
            <>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
              {renderAnalyticsData()}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsIntegration;
