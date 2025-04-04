import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Globe,
  Languages
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminDashboardFeatures = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for the dashboard
  const stats = [
    {
      title: { en: "Total Revenue", ar: "إجمالي الإيرادات" },
      value: "$12,345",
      icon: <DollarSign className="h-8 w-8 text-muted-foreground" />,
      change: "+12%",
      trend: <TrendingUp className="h-4 w-4 text-green-500" />
    },
    {
      title: { en: "Active Users", ar: "المستخدمين النشطين" },
      value: "2,345",
      icon: <Users className="h-8 w-8 text-muted-foreground" />,
      change: "+5%",
      trend: <ArrowUpRight className="h-4 w-4 text-green-500" />
    },
    {
      title: { en: "New Orders", ar: "الطلبات الجديدة" },
      value: "123",
      icon: <ShoppingCart className="h-8 w-8 text-muted-foreground" />,
      change: "+8%",
      trend: <ArrowUpRight className="h-4 w-4 text-green-500" />
    },
    {
      title: { en: "Products", ar: "المنتجات" },
      value: "456",
      icon: <Package className="h-8 w-8 text-muted-foreground" />,
      change: "+3%",
      trend: <ArrowUpRight className="h-4 w-4 text-green-500" />
    },
  ];

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, user: "Ahmed Ali", action: { en: "placed an order", ar: "قام بطلب" }, time: "10 minutes ago", icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" /> },
    { id: 2, user: "Sara Mohammed", action: { en: "joined a Jam3a", ar: "انضم إلى جمعة" }, time: "25 minutes ago", icon: <Users className="h-5 w-5 text-muted-foreground" /> },
    { id: 3, user: "Khalid Ibrahim", action: { en: "created a Jam3a", ar: "أنشأ جمعة" }, time: "45 minutes ago", icon: <Package className="h-5 w-5 text-muted-foreground" /> },
    { id: 4, user: "Fatima Ahmed", action: { en: "registered an account", ar: "سجل حساب" }, time: "1 hour ago", icon: <Users className="h-5 w-5 text-muted-foreground" /> },
  ];

  // Mock data for sales overview
  const salesOverview = [
    { period: { en: "Today", ar: "اليوم" }, value: "$345", percentage: 45 },
    { period: { en: "This Week", ar: "هذا الأسبوع" }, value: "$1,345", percentage: 65 },
    { period: { en: "This Month", ar: "هذا الشهر" }, value: "$5,345", percentage: 85 },
  ];

  // Mock data for top products
  const topProducts = [
    { id: 1, name: { en: "Smartphone X", ar: "هاتف ذكي X" }, sales: 45, revenue: "$4,500", growth: "+12%" },
    { id: 2, name: { en: "Wireless Earbuds", ar: "سماعات لاسلكية" }, sales: 38, revenue: "$2,280", growth: "+8%" },
    { id: 3, name: { en: "Smart Watch", ar: "ساعة ذكية" }, sales: 32, revenue: "$3,840", growth: "+5%" },
    { id: 4, name: { en: "Laptop Pro", ar: "لابتوب برو" }, sales: 28, revenue: "$28,000", growth: "+15%" },
    { id: 5, name: { en: "Bluetooth Speaker", ar: "مكبر صوت بلوتوث" }, sales: 25, revenue: "$1,250", growth: "+3%" },
  ];

  // Mock data for user demographics
  const userDemographics = [
    { region: { en: "Riyadh", ar: "الرياض" }, users: 850, percentage: 35 },
    { region: { en: "Jeddah", ar: "جدة" }, users: 620, percentage: 26 },
    { region: { en: "Dammam", ar: "الدمام" }, users: 410, percentage: 17 },
    { region: { en: "Mecca", ar: "مكة" }, users: 320, percentage: 13 },
    { region: { en: "Other", ar: "أخرى" }, users: 220, percentage: 9 },
  ];

  // Mock data for recent orders
  const recentOrders = [
    { id: "#ORD-001", customer: "Ahmed Ali", product: { en: "Smartphone X", ar: "هاتف ذكي X" }, date: "2025-04-01", status: { en: "Completed", ar: "مكتمل" }, amount: "$999" },
    { id: "#ORD-002", customer: "Sara Mohammed", product: { en: "Wireless Earbuds", ar: "سماعات لاسلكية" }, date: "2025-04-01", status: { en: "Processing", ar: "قيد المعالجة" }, amount: "$129" },
    { id: "#ORD-003", customer: "Khalid Ibrahim", product: { en: "Smart Watch", ar: "ساعة ذكية" }, date: "2025-04-02", status: { en: "Completed", ar: "مكتمل" }, amount: "$249" },
    { id: "#ORD-004", customer: "Fatima Ahmed", product: { en: "Laptop Pro", ar: "لابتوب برو" }, date: "2025-04-02", status: { en: "Pending", ar: "قيد الانتظار" }, amount: "$1,299" },
    { id: "#ORD-005", customer: "Mohammed Saleh", product: { en: "Bluetooth Speaker", ar: "مكبر صوت بلوتوث" }, date: "2025-04-03", status: { en: "Completed", ar: "مكتمل" }, amount: "$79" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Dashboard Overview' : 'نظرة عامة على لوحة التحكم'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Monitor your business performance and analytics' : 'مراقبة أداء عملك والتحليلات'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{language === 'en' ? 'Today' : 'اليوم'}</SelectItem>
              <SelectItem value="week">{language === 'en' ? 'This Week' : 'هذا الأسبوع'}</SelectItem>
              <SelectItem value="month">{language === 'en' ? 'This Month' : 'هذا الشهر'}</SelectItem>
              <SelectItem value="year">{language === 'en' ? 'This Year' : 'هذا العام'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={language} onValueChange={(value: 'en' | 'ar') => setLanguage(value)}>
            <SelectTrigger className="w-[150px]">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title.en}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title[language]}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="mt-1 flex items-center text-sm text-muted-foreground">
                {stat.trend}
                <span className="ml-1">{stat.change} {language === 'en' ? 'from last month' : 'من الشهر الماضي'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Overview' : 'نظرة عامة'}
          </TabsTrigger>
          <TabsTrigger value="sales">
            <LineChart className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Sales' : 'المبيعات'}
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Products' : 'المنتجات'}
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Users' : 'المستخدمين'}
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Orders' : 'الطلبات'}
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Recent Activity' : 'النشاط الأخير'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.user} {activity.action[language]}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {language === 'en' ? 'View All Activity' : 'عرض كل النشاطات'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Sales Overview' : 'نظرة عامة على المبيعات'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesOverview.map((period) => (
                    <div key={period.period.en} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">{period.period[language]}</div>
                        <div className="font-medium">{period.value}</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-primary" 
                          style={{ width: `${period.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {language === 'en' ? 'View Detailed Report' : 'عرض تقرير مفصل'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Sales Analytics' : 'تحليلات المبيعات'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Sales performance over time and by category' : 
                  'أداء المبيعات عبر الزمن وحسب الفئة'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {language === 'en' ? 
                      'Sales chart visualization would appear here' : 
                      'سيظهر هنا تصور مخطط المبيعات'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {language === 'en' ? 'Total Sales' : 'إجمالي المبيعات'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$24,345</div>
                    <div className="mt-1 flex items-center text-sm text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+8.2%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {language === 'en' ? 'Average Order Value' : 'متوسط قيمة الطلب'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$245</div>
                    <div className="mt-1 flex items-center text-sm text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+3.1%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {language === 'en' ? 'Conversion Rate' : 'معدل التحويل'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.5%</div>
                    <div className="mt-1 flex items-center text-sm text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+1.2%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Top Selling Products' : 'المنتجات الأكثر مبيعًا'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Products with the highest sales volume and revenue' : 
                  'المنتجات ذات أعلى حجم مبيعات وإيرادات'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Product' : 'المنتج'}</TableHead>
                      <TableHead className="text-right">{language === 'en' ? 'Sales' : 'المبيعات'}</TableHead>
                      <TableHead className="text-right">{language === 'en' ? 'Revenue' : 'الإيرادات'}</TableHead>
                      <TableHead className="text-right">{language === 'en' ? 'Growth' : 'النمو'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name[language]}</TableCell>
                        <TableCell className="text-right">{product.sales}</TableCell>
                        <TableCell className="text-right">{product.revenue}</TableCell>
                        <TableCell className="text-right text-green-500">{product.growth}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 h-[250px] w-full bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {language === 'en' ? 
                      'Product category distribution chart would appear here' : 
                      'سيظهر هنا مخطط توزيع فئات المنتجات'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {language === 'en' ? 'View All Products' : 'عرض جميع المنتجات'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'User Demographics' : 'التركيبة السكانية للمستخدمين'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'User distribution by region and activity' : 
                  'توزيع المستخدمين حسب المنطقة والنشاط'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Region' : 'المنطقة'}</TableHead>
                      <TableHead className="text-right">{language === 'en' ? 'Users' : 'المستخدمين'}</TableHead>
                      <TableHead className="text-right">{language === 'en' ? 'Percentage' : 'النسبة المئوية'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDemographics.map((region) => (
                      <TableRow key={region.region.en}>
                        <TableCell className="font-medium">{region.region[language]}</TableCell>
                        <TableCell className="text-right">{region.users}</TableCell>
                        <TableCell className="text-right">{region.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {language === 'en' ? 
                        'User age distribution' : 
                        'توزيع أعمار المستخدمين'}
                    </p>
                  </div>
                </div>
                
                <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {language === 'en' ? 
                        'User activity by time of day' : 
                        'نشاط المستخدم حسب وقت اليوم'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {language === 'en' ? 'View User Analytics' : 'عرض تحليلات المستخدمين'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Recent Orders' : 'الطلبات الأخيرة'}</CardTitle>
              <CardDescription>
                {language === 'en' ? 
                  'Latest orders and their status' : 
                  'أحدث الطلبات وحالتها'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Order ID' : 'رقم الطلب'}</TableHead>
                      <TableHead>{language === 'en' ? 'Customer' : 'العميل'}</TableHead>
                      <TableHead>{language === 'en' ? 'Product' : 'المنتج'}</TableHead>
                      <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
                      <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                      <TableHead className="text-right">{language === 'en' ? 'Amount' : 'المبلغ'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product[language]}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status.en === 'Completed' ? 'bg-green-100 text-green-800' : 
                            order.status.en === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status[language]}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{order.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {language === 'en' ? 'View All Orders' : 'عرض جميع الطلبات'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardFeatures;
