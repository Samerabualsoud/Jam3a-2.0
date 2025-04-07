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
import axios from 'axios';
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
      const response = await axios.get(`${API_BASE_URL}/deals`);
      if (response.data && Array.isArray(response.data.data)) {
        setDeals(response.data.data);
      } else {
        console.error('Invalid response format:', response.data);
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
      const response = await axios.get(`${API_BASE_URL}/categories`);
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        console.error('Invalid categories response format:', response.data);
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

  // Open dialog for confirming deal deletion
  const handleDeleteConfirm = (deal: Deal) => {
    setCurrentDeal(deal);
    setIsDeleteDialogOpen(true);
  };

  // Submit form for creating or updating a deal
  const onSubmit = async (values: DealFormValues) => {
    try {
      if (currentDeal) {
        // Update existing deal
        await axios.put(`${API_BASE_URL}/deals/${currentDeal._id}`, {
          ...values,
          discountPercentage: Math.round(((values.regularPrice - values.jam3aPrice) / values.regularPrice) * 100),
        });
        toast({
          title: 'Deal updated',
          description: 'The deal has been updated successfully.',
        });
      } else {
        // Create new deal
        await axios.post(`${API_BASE_URL}/deals`, {
          ...values,
          discountPercentage: Math.round(((values.regularPrice - values.jam3aPrice) / values.regularPrice) * 100),
          currentParticipants: 0,
        });
        toast({
          title: 'Deal created',
          description: 'The deal has been created successfully.',
        });
      }
      setIsDialogOpen(false);
      fetchDeals();
    } catch (err) {
      console.error('Error saving deal:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save deal. Please try again.',
      });
    }
  };

  // Delete a deal
  const handleDeleteDeal = async () => {
    if (!currentDeal) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/deals/${currentDeal._id}`);
      toast({
        title: 'Deal deleted',
        description: 'The deal has been deleted successfully.',
      });
      setIsDeleteDialogOpen(false);
      fetchDeals();
    } catch (err) {
      console.error('Error deleting deal:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete deal. Please try again.',
      });
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (deal: Deal) => {
    try {
      await axios.put(`${API_BASE_URL}/deals/${deal._id}`, {
        ...deal,
        featured: !deal.featured,
      });
      toast({
        title: deal.featured ? 'Deal unfeatured' : 'Deal featured',
        description: `The deal has been ${deal.featured ? 'removed from' : 'added to'} featured deals.`,
      });
      fetchDeals();
    } catch (err) {
      console.error('Error toggling featured status:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update featured status. Please try again.',
      });
    }
  };

  // Filter deals based on search term and filters
  const filteredDeals = deals.filter(deal => {
    // Search term filter
    const searchMatch = 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.jam3aId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const categoryMatch = categoryFilter === 'all' || deal.category._id === categoryFilter;
    
    // Status filter
    const statusMatch = statusFilter === 'all' || deal.status === statusFilter;
    
    // Featured filter
    const featuredMatch = 
      featuredFilter === 'all' || 
      (featuredFilter === 'featured' && deal.featured) || 
      (featuredFilter === 'not-featured' && !deal.featured);
    
    // Participants filter
    let participantsMatch = true;
    if (participantsFilter === 'low') {
      participantsMatch = deal.currentParticipants < 5;
    } else if (participantsFilter === 'medium') {
      participantsMatch = deal.currentParticipants >= 5 && deal.currentParticipants < 10;
    } else if (participantsFilter === 'high') {
      participantsMatch = deal.currentParticipants >= 10;
    }
    
    return searchMatch && categoryMatch && statusMatch && featuredMatch && participantsMatch;
  });

  // Render loading state
  if (isLoading && deals.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Deals Management</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading deals...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error && deals.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Deals Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="text-lg font-semibold">Error Loading Deals</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">{error}</p>
            <Button onClick={fetchDeals} className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Deals Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals by title, description or ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
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
                <SelectValue placeholder="Filter by status" />
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
                <SelectValue placeholder="Filter by featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deals</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="not-featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={participantsFilter} onValueChange={setParticipantsFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by participants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Participants</SelectItem>
                <SelectItem value="low">Low (< 5)</SelectItem>
                <SelectItem value="medium">Medium (5-9)</SelectItem>
                <SelectItem value="high">High (10+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Create deal button */}
        <div className="mb-4">
          <Button onClick={handleCreateDeal}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Deal
          </Button>
        </div>
        
        {/* Deals table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jam3a ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Participants</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No deals found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeals.map((deal) => (
                  <TableRow key={deal._id}>
                    <TableCell className="font-medium">{deal.jam3aId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={deal.image} 
                          alt={deal.title} 
                          className="h-8 w-8 rounded-md object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Jam3a';
                          }}
                        />
                        <span className="truncate max-w-[150px]">{deal.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{deal.category?.name || 'Uncategorized'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm line-through text-muted-foreground">{deal.regularPrice} SAR</span>
                        <span className="font-medium">{deal.jam3aPrice} SAR</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {deal.currentParticipants}/{deal.maxParticipants}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={
                        deal.status === 'active' ? 'default' :
                        deal.status === 'pending' ? 'outline' :
                        deal.status === 'completed' ? 'success' : 'destructive'
                      }>
                        {deal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFeatured(deal)}
                        title={deal.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Star className={`h-4 w-4 ${deal.featured ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditDeal(deal)}
                          title="Edit deal"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteConfirm(deal)}
                          title="Delete deal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Create/Edit Deal Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentDeal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
              <DialogDescription>
                {currentDeal 
                  ? 'Update the details of an existing deal.' 
                  : 'Fill in the details to create a new Jam3a deal.'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="basic">Basic Information</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing & Participants</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
                  </TabsList>
                  
                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="jam3aId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jam3a ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="JAM-XXX-000" />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for this deal (format: JAM-XXX-000)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (English)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Deal title in English" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="titleAr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (Arabic)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Deal title in Arabic" dir="rtl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (English)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Deal description in English" 
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="descriptionAr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Arabic)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Deal description in Arabic" 
                                rows={4}
                                dir="rtl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
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
                            <Input {...field} placeholder="https://example.com/image.jpg" />
                          </FormControl>
                          <FormDescription>
                            URL to the deal's main image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  {/* Pricing & Participants Tab */}
                  <TabsContent value="pricing" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="regularPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Regular Price (SAR)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
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
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm font-medium mb-2">Discount Calculation</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {form.watch('regularPrice') && form.watch('jam3aPrice')
                            ? Math.round(((form.watch('regularPrice') - form.watch('jam3aPrice')) / form.watch('regularPrice')) * 100)
                            : 0}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({form.watch('regularPrice') - form.watch('jam3aPrice')} SAR savings)
                        </span>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Participants</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of people who can join this deal
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
                  
                  {/* Advanced Settings Tab */}
                  <TabsContent value="advanced" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Deal</FormLabel>
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
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
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
                            Current status of this deal
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentDeal ? 'Update Deal' : 'Create Deal'}
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
                Are you sure you want to delete this deal? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted p-4 rounded-md mb-4">
              <p className="font-medium">{currentDeal?.title}</p>
              <p className="text-sm text-muted-foreground">ID: {currentDeal?.jam3aId}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteDeal}>
                Delete Deal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DealsManager;
