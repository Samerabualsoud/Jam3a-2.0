import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  Filter, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiService from '@/services/api';
import { API_BASE_URL } from '@/config';

// Define the Deal type
interface Deal {
  _id: string;
  jam3aId: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: {
    _id: string;
    name: string;
    nameAr?: string;
  };
  regularPrice: number;
  jam3aPrice: number;
  discountPercentage: number;
  currentParticipants: number;
  maxParticipants: number;
  timeRemaining: string;
  expiryDate: string;
  featured: boolean;
  image: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Define the Category type
interface Category {
  _id: string;
  name: string;
  nameAr?: string;
}

// Form schema for deal validation
const dealFormSchema = z.object({
  jam3aId: z.string().min(3, 'Jam3a ID is required'),
  title: z.string().min(3, 'Title is required'),
  titleAr: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  descriptionAr: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  regularPrice: z.coerce.number().min(1, 'Regular price is required'),
  jam3aPrice: z.coerce.number().min(1, 'Jam3a price is required'),
  maxParticipants: z.coerce.number().min(2, 'At least 2 participants are required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  featured: z.boolean().default(false),
  image: z.string().min(1, 'Image URL is required'),
  status: z.enum(['active', 'pending', 'completed', 'cancelled']).default('active'),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

const DealsManager: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState<Deal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [participantsFilter, setParticipantsFilter] = useState('all');
  const { toast } = useToast();

  // Initialize form
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      jam3aId: '',
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      categoryId: '',
      regularPrice: 0,
      jam3aPrice: 0,
      maxParticipants: 5,
      expiryDate: '',
      featured: false,
      image: '',
      status: 'active',
    },
  });

  // Fetch deals and categories on component mount
  useEffect(() => {
    fetchDeals();
    fetchCategories();
  }, []);

  // Fetch all deals
  const fetchDeals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get('/deals');
      console.log('Deals API response:', response);
      
      if (response && response.data) {
        setDeals(response.data);
      } else if (Array.isArray(response)) {
        setDeals(response);
      } else {
        console.error('Invalid response format:', response);
        setDeals([]);
        setError('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError('Failed to fetch deals. Please try again.');
      setDeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/categories');
      console.log('Categories API response:', response);
      
      if (response && response.data) {
        setCategories(response.data);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        console.error('Invalid categories response format:', response);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  // Open dialog for creating a new deal
  const handleCreateDeal = () => {
    form.reset({
      jam3aId: `JAM-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`,
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      categoryId: '',
      regularPrice: 0,
      jam3aPrice: 0,
      maxParticipants: 5,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      featured: false,
      image: '',
      status: 'active',
    });
    setCurrentDeal(null);
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing deal
  const handleEditDeal = (deal: Deal) => {
    form.reset({
      jam3aId: deal.jam3aId,
      title: deal.title,
      titleAr: deal.titleAr || '',
      description: deal.description,
      descriptionAr: deal.descriptionAr || '',
      categoryId: deal.category._id,
      regularPrice: deal.regularPrice,
      jam3aPrice: deal.jam3aPrice,
      maxParticipants: deal.maxParticipants,
      expiryDate: new Date(deal.expiryDate).toISOString().split('T')[0],
      featured: deal.featured,
      image: deal.image,
      status: deal.status,
    });
    setCurrentDeal(deal);
    setIsDialogOpen(true);
  };

  // Open dialog for deleting a deal
  const handleDeleteConfirm = (deal: Deal) => {
    setCurrentDeal(deal);
    setIsDeleteDialogOpen(true);
  };

  // Submit form for creating or updating a deal
  const onSubmit = async (values: DealFormValues) => {
    try {
      setIsLoading(true);
      
      // Calculate discount percentage
      const discountPercentage = ((values.regularPrice - values.jam3aPrice) / values.regularPrice) * 100;
      
      const dealData = {
        ...values,
        discountPercentage: Math.round(discountPercentage * 100) / 100,
      };
      
      if (currentDeal) {
        // Update existing deal
        const response = await apiService.put(`/deals/${currentDeal._id}`, dealData);
        
        if (response && response.data) {
          setDeals(prev => prev.map(d => d._id === currentDeal._id ? response.data : d));
          
          toast({
            title: 'Deal updated',
            description: `${values.title} has been updated successfully.`,
            variant: 'default',
          });
        }
      } else {
        // Create new deal
        const response = await apiService.post('/deals', dealData);
        
        if (response && response.data) {
          setDeals(prev => [...prev, response.data]);
          
          toast({
            title: 'Deal created',
            description: `${values.title} has been created successfully.`,
            variant: 'default',
          });
        }
      }
      
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving deal:', err);
      
      toast({
        title: 'Error',
        description: `Failed to ${currentDeal ? 'update' : 'create'} deal. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a deal
  const handleDelete = async () => {
    if (!currentDeal) return;
    
    try {
      setIsLoading(true);
      
      await apiService.delete(`/deals/${currentDeal._id}`);
      
      setDeals(prev => prev.filter(d => d._id !== currentDeal._id));
      
      toast({
        title: 'Deal deleted',
        description: `${currentDeal.title} has been deleted successfully.`,
        variant: 'default',
      });
      
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting deal:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to delete deal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter deals based on search term and filters
  const filteredDeals = deals.filter(deal => {
    // Search term filter
    const searchMatch = searchTerm === '' || 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.jam3aId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const categoryMatch = categoryFilter === 'all' || deal.category._id === categoryFilter;
    
    // Status filter
    const statusMatch = statusFilter === 'all' || deal.status === statusFilter;
    
    // Featured filter
    const featuredMatch = featuredFilter === 'all' || 
      (featuredFilter === 'featured' && deal.featured) || 
      (featuredFilter === 'not-featured' && !deal.featured);
    
    // Participants filter
    const participantsMatch = participantsFilter === 'all' || 
      (participantsFilter === 'low' && deal.currentParticipants < 5) ||
      (participantsFilter === 'medium' && deal.currentParticipants >= 5 && deal.currentParticipants < 10) ||
      (participantsFilter === 'high' && deal.currentParticipants >= 10);
    
    return searchMatch && categoryMatch && statusMatch && featuredMatch && participantsMatch;
  });

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Deals Management</h2>
        <Button onClick={handleCreateDeal}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Deal
        </Button>
      </div>
      
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search deals..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Deals</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="not-featured">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={participantsFilter} onValueChange={setParticipantsFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Participants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Participants</SelectItem>
                    <SelectItem value="low">Low (< 5)</SelectItem>
                    <SelectItem value="medium">Medium (5-9)</SelectItem>
                    <SelectItem value="high">High (10+)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={() => fetchDeals()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No deals found. Try adjusting your filters or create a new deal.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jam3a ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.map((deal) => (
                      <TableRow key={deal._id}>
                        <TableCell className="font-medium">{deal.jam3aId}</TableCell>
                        <TableCell>{deal.title}</TableCell>
                        <TableCell>{deal.category.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="line-through text-muted-foreground">SAR {deal.regularPrice}</span>
                            <span className="font-medium">SAR {deal.jam3aPrice}</span>
                            <span className="text-xs text-green-600">-{Math.round(deal.discountPercentage)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {deal.currentParticipants} / {deal.maxParticipants}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(deal.status)}
                        </TableCell>
                        <TableCell>
                          {deal.featured ? (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <Star className="h-5 w-5 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditDeal(deal)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteConfirm(deal)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Create/Edit Deal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentDeal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
            <DialogDescription>
              {currentDeal
                ? 'Update the details of an existing deal.'
                : 'Add a new deal to your platform.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing & Participants</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="jam3aId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jam3a ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this deal (format: JAM-XXX-XXX)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The main title of the deal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="titleAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arabic Title (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} dir="rtl" />
                        </FormControl>
                        <FormDescription>
                          Arabic version of the title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Describe the deal..."
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description of the deal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="descriptionAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arabic Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="وصف الصفقة..."
                            dir="rtl"
                          />
                        </FormControl>
                        <FormDescription>
                          Arabic version of the description
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The category this deal belongs to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          URL of the deal image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="pricing" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="regularPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regular Price (SAR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Original price before discount
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="jam3aPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jam3a Price (SAR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Discounted price for Jam3a participants
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('regularPrice') > 0 && form.watch('jam3aPrice') > 0 && (
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium">Discount: {Math.round(((form.watch('regularPrice') - form.watch('jam3aPrice')) / form.watch('regularPrice')) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Savings: SAR {(form.watch('regularPrice') - form.watch('jam3aPrice')).toFixed(2)}</p>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Participants</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="2"
                            step="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of participants for this deal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Date when this deal expires
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Featured Deal
                          </FormLabel>
                          <FormDescription>
                            Featured deals appear prominently on the homepage
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the deal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the deal "{currentDeal?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealsManager;
