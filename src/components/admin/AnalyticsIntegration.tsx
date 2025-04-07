import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, Save, AlertCircle } from 'lucide-react';

// Analytics configuration interface
interface AnalyticsConfig {
  trackingId: string;
  ipAnonymization: boolean;
  trackPageViews: boolean;
  trackEvents: boolean;
  lastUpdated: string;
}

// Analytics data interface
interface AnalyticsData {
  metric: string;
  timeRange: {
    startDate: string;
    endDate: string;
    days: number;
  };
  data: {
    date: string;
    value: number;
  }[];
  summary: {
    total: number;
    average: number;
    min: number;
    max: number;
  };
}

// Top pages interface
interface TopPage {
  path: string;
  pageviews: number;
  uniquePageviews: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

// Demographics interface
interface Demographics {
  countries: {
    name: string;
    users: number;
    percentage: number;
  }[];
  devices: {
    type: string;
    users: number;
    percentage: number;
  }[];
  browsers: {
    name: string;
    users: number;
    percentage: number;
  }[];
}

// Events interface
interface EventData {
  name: string;
  count: number;
  uniqueUsers: number;
}

const AnalyticsIntegration: React.FC = () => {
  // State for analytics configuration
  const [config, setConfig] = useState<AnalyticsConfig>({
    trackingId: '',
    ipAnonymization: true,
    trackPageViews: true,
    trackEvents: true,
    lastUpdated: ''
  });
  
  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // State for analytics data
  const [pageViewsData, setPageViewsData] = useState<AnalyticsData | null>(null);
  const [usersData, setUsersData] = useState<AnalyticsData | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  
  // State for date range
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // State for error
  const [error, setError] = useState<string | null>(null);
  
  // Fetch analytics configuration
  const fetchConfig = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/analytics/config');
      setConfig(response.data);
    } catch (err) {
      console.error('Error fetching analytics configuration:', err);
      setError('Failed to fetch analytics configuration. Please try again.');
      
      // Try to load from local storage as fallback
      const storedConfig = localStorage.getItem('analyticsConfig');
      if (storedConfig) {
        try {
          setConfig(JSON.parse(storedConfig));
          toast.warning('Using cached analytics configuration. Connection to server failed.');
        } catch (parseError) {
          console.error('Failed to parse stored configuration:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save analytics configuration
  const saveConfig = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/analytics/config', config);
      setConfig(response.data);
      
      // Save to local storage as fallback
      localStorage.setItem('analyticsConfig', JSON.stringify(response.data));
      
      toast.success('Analytics configuration saved successfully');
    } catch (err) {
      console.error('Error saving analytics configuration:', err);
      setError('Failed to save analytics configuration. Please try again.');
      toast.error('Failed to save analytics configuration');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Fetch page views data
      const pageViewsResponse = await axios.get('/api/analytics/data', {
        params: {
          startDate,
          endDate,
          metric: 'pageviews'
        }
      });
      setPageViewsData(pageViewsResponse.data);
      
      // Fetch users data
      const usersResponse = await axios.get('/api/analytics/data', {
        params: {
          startDate,
          endDate,
          metric: 'users'
        }
      });
      setUsersData(usersResponse.data);
      
      // Fetch top pages
      const topPagesResponse = await axios.get('/api/analytics/top-pages');
      setTopPages(topPagesResponse.data);
      
      // Fetch demographics
      const demographicsResponse = await axios.get('/api/analytics/demographics');
      setDemographics(demographicsResponse.data);
      
      // Fetch events data
      const eventsResponse = await axios.get('/api/analytics/events');
      setEventsData(eventsResponse.data);
      
      toast.success('Analytics data refreshed successfully');
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to fetch analytics data. Please try again.');
      toast.error('Failed to refresh analytics data');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Load data on mount
  useEffect(() => {
    fetchConfig();
    fetchAnalyticsData();
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Analytics Configuration</CardTitle>
          <CardDescription>
            Configure your Google Analytics tracking settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 p-4 rounded-md mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tracking-id">Tracking ID</Label>
              <Input
                id="tracking-id"
                placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                value={config.trackingId}
                onChange={(e) => setConfig({ ...config, trackingId: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                Your Google Analytics tracking ID (UA-XXXXXXXXX-X) or measurement ID (G-XXXXXXXXXX)
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ip-anonymization"
                checked={config.ipAnonymization}
                onCheckedChange={(checked) => setConfig({ ...config, ipAnonymization: checked })}
              />
              <Label htmlFor="ip-anonymization">IP Anonymization</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="track-pageviews"
                checked={config.trackPageViews}
                onCheckedChange={(checked) => setConfig({ ...config, trackPageViews: checked })}
              />
              <Label htmlFor="track-pageviews">Track Page Views</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="track-events"
                checked={config.trackEvents}
                onCheckedChange={(checked) => setConfig({ ...config, trackEvents: checked })}
              />
              <Label htmlFor="track-events">Track Events</Label>
            </div>
            
            {config.lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(config.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveConfig} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            View your website analytics data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={fetchAnalyticsData} disabled={isRefreshing}>
                {isRefreshing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
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
            
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pages">Top Pages</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  {pageViewsData && pageViewsData.summary && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Page Views</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{pageViewsData.summary.total.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Total Page Views</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{pageViewsData.summary.average.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Avg. Daily Page Views</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{pageViewsData.summary.min.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Min Daily Page Views</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{pageViewsData.summary.max.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Max Daily Page Views</p>
                          </CardContent>
                        </Card>
                      </div>
                      {pageViewsData.data && pageViewsData.data.length > 0 && (
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={pageViewsData.data}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={formatDate}
                                interval={Math.ceil(pageViewsData.data.length / 10)}
                              />
                              <YAxis />
                              <Tooltip 
                                formatter={(value) => [value, 'Page Views']}
                                labelFormatter={(label) => formatDate(label)}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#8884d8" 
                                activeDot={{ r: 8 }} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {usersData && usersData.summary && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Users</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{usersData.summary.total.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Total Users</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{usersData.summary.average.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Avg. Daily Users</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{usersData.summary.min.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Min Daily Users</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{usersData.summary.max.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Max Daily Users</p>
                          </CardContent>
                        </Card>
                      </div>
                      {usersData.data && usersData.data.length > 0 && (
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={usersData.data}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={formatDate}
                                interval={Math.ceil(usersData.data.length / 10)}
                              />
                              <YAxis />
                              <Tooltip 
                                formatter={(value) => [value, 'Users']}
                                labelFormatter={(label) => formatDate(label)}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#82ca9d" 
                                activeDot={{ r: 8 }} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!pageViewsData && !usersData && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No analytics data available. Please refresh the data.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="pages">
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Pages</h3>
                  {topPages && topPages.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted">
                            <th className="p-2 text-left">Page</th>
                            <th className="p-2 text-right">Page Views</th>
                            <th className="p-2 text-right">Unique Views</th>
                            <th className="p-2 text-right">Avg. Time (sec)</th>
                            <th className="p-2 text-right">Bounce Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topPages.map((page, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{page.path}</td>
                              <td className="p-2 text-right">{page.pageviews.toLocaleString()}</td>
                              <td className="p-2 text-right">{page.uniquePageviews.toLocaleString()}</td>
                              <td className="p-2 text-right">{page.avgTimeOnPage}</td>
                              <td className="p-2 text-right">{page.bounceRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No top pages data available. Please refresh the data.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="demographics">
                <div className="space-y-6">
                  {demographics ? (
                    <>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Countries</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="h-80">
                            {demographics.countries && demographics.countries.length > 0 && (
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={demographics.countries}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="users"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {demographics.countries.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(value) => [`${value} users`, 'Users']} />
                                </PieChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                          <div>
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-muted">
                                  <th className="p-2 text-left">Country</th>
                                  <th className="p-2 text-right">Users</th>
                                  <th className="p-2 text-right">Percentage</th>
                                </tr>
                              </thead>
                              <tbody>
                                {demographics.countries && demographics.countries.map((country, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2">{country.name}</td>
                                    <td className="p-2 text-right">{country.users.toLocaleString()}</td>
                                    <td className="p-2 text-right">{country.percentage}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Devices</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="h-80">
                            {demographics.devices && demographics.devices.length > 0 && (
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={demographics.devices}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="users"
                                    nameKey="type"
                                    label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {demographics.devices.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(value) => [`${value} users`, 'Users']} />
                                </PieChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                          <div>
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-muted">
                                  <th className="p-2 text-left">Device</th>
                                  <th className="p-2 text-right">Users</th>
                                  <th className="p-2 text-right">Percentage</th>
                                </tr>
                              </thead>
                              <tbody>
                                {demographics.devices && demographics.devices.map((device, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2">{device.type}</td>
                                    <td className="p-2 text-right">{device.users.toLocaleString()}</td>
                                    <td className="p-2 text-right">{device.percentage}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Browsers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="h-80">
                            {demographics.browsers && demographics.browsers.length > 0 && (
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={demographics.browsers}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="users"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {demographics.browsers.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(value) => [`${value} users`, 'Users']} />
                                </PieChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                          <div>
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-muted">
                                  <th className="p-2 text-left">Browser</th>
                                  <th className="p-2 text-right">Users</th>
                                  <th className="p-2 text-right">Percentage</th>
                                </tr>
                              </thead>
                              <tbody>
                                {demographics.browsers && demographics.browsers.map((browser, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2">{browser.name}</td>
                                    <td className="p-2 text-right">{browser.users.toLocaleString()}</td>
                                    <td className="p-2 text-right">{browser.percentage}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No demographics data available. Please refresh the data.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="events">
                <div>
                  <h3 className="text-lg font-medium mb-4">Events</h3>
                  {eventsData && eventsData.length > 0 ? (
                    <>
                      <div className="overflow-x-auto mb-6">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="p-2 text-left">Event</th>
                              <th className="p-2 text-right">Count</th>
                              <th className="p-2 text-right">Unique Users</th>
                            </tr>
                          </thead>
                          <tbody>
                            {eventsData.map((event, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{event.name}</td>
                                <td className="p-2 text-right">{event.count.toLocaleString()}</td>
                                <td className="p-2 text-right">{event.uniqueUsers.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={eventsData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" name="Count" />
                            <Bar dataKey="uniqueUsers" fill="#82ca9d" name="Unique Users" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No events data available. Please refresh the data.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsIntegration;
