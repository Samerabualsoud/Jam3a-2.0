import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Filter, 
  RefreshCw, 
  X, 
  Check, 
  Download, 
  Upload 
} from 'lucide-react';

// Define the Deal type
interface Deal {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice: number;
  jam3aId: string;
  featured: boolean;
  jam3aStatus: 'active' | 'pending' | 'completed';
  targetUsers: number;
  currentUsers: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Empty deal template
const emptyDeal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  category: '',
  price: 0,
  discountPrice: 0,
  jam3aId: '',
  featured: false,
  jam3aStatus: 'pending',
  targetUsers: 0,
  currentUsers: 0,
  imageUrl: ''
};

const DealsManager: React.FC = () => {
  // State for deals
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for editing
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentDeal, setCurrentDeal] = useState<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>(emptyDeal);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  
  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [minUsers, setMinUsers] = useState<string>('');
  const [maxUsers, setMaxUsers] = useState<string>('');
  const [featuredFilter, setFeaturedFilter] = useState<string>('');
  
  // State for bulk operations
  const [selectedDeals, setSelectedDeals] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  
  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState<boolean>(false);
  
  // Fetch deals from API
  const fetchDeals = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/deals');
      setDeals(response.data);
      applyFilters(response.data);
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError('Failed to fetch deals. Please try again.');
      // Use sample data as fallback
      try {
        const fallbackResponse = await axios.get('/data/deals.json');
        setDeals(fallbackResponse.data);
        applyFilters(fallbackResponse.data);
        toast.warning('Using cached deal data. Connection to server failed.');
      } catch (fallbackErr) {
        console.error('Error fetching fallback deals data:', fallbackErr);
        setError('Failed to fetch deals data. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters to deals
  const applyFilters = (dealsData: Deal[] = deals) => {
    let filtered = [...dealsData];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal => 
        deal.name.toLowerCase().includes(query) || 
        deal.description.toLowerCase().includes(query) ||
        deal.jam3aId.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(deal => deal.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(deal => deal.jam3aStatus === statusFilter);
    }
    
    // Apply users count filter
    if (minUsers) {
      filtered = filtered.filter(deal => deal.currentUsers >= parseInt(minUsers));
    }
    
    if (maxUsers) {
      filtered = filtered.filter(deal => deal.currentUsers <= parseInt(maxUsers));
    }
    
    // Apply featured filter
    if (featuredFilter) {
      const isFeatured = featuredFilter === 'true';
      filtered = filtered.filter(deal => deal.featured === isFeatured);
    }
    
    setFilteredDeals(filtered);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
    setMinUsers('');
    setMaxUsers('');
    setFeaturedFilter('');
    setFilteredDeals(deals);
  };
  
  // Add a new deal
  const addDeal = async () => {
    try {
      const response = await axios.post('/api/deals', currentDeal);
      setDeals([...deals, response.data]);
      applyFilters([...deals, response.data]);
      setCurrentDeal(emptyDeal);
      setIsAddDialogOpen(false);
      toast.success('Deal added successfully');
    } catch (err) {
      console.error('Error adding deal:', err);
      toast.error('Failed to add deal. Please try again.');
    }
  };
  
  // Update an existing deal
  const updateDeal = async () => {
    if (!selectedDealId) return;
    
    try {
      const response = await axios.put(`/api/deals/${selectedDealId}`, currentDeal);
      const updatedDeals = deals.map(deal => 
        deal.id === selectedDealId ? response.data : deal
      );
      setDeals(updatedDeals);
      applyFilters(updatedDeals);
      setCurrentDeal(emptyDeal);
      setSelectedDealId(null);
      setIsEditing(false);
      setIsAddDialogOpen(false);
      toast.success('Deal updated successfully');
    } catch (err) {
      console.error('Error updating deal:', err);
      toast.error('Failed to update deal. Please try again.');
    }
  };
  
  // Delete a deal
  const deleteDeal = async (id: number) => {
    try {
      await axios.delete(`/api/deals/${id}`);
      const updatedDeals = deals.filter(deal => deal.id !== id);
      setDeals(updatedDeals);
      applyFilters(updatedDeals);
      setIsDeleteDialogOpen(false);
      toast.success('Deal deleted successfully');
    } catch (err) {
      console.error('Error deleting deal:', err);
      toast.error('Failed to delete deal. Please try again.');
    }
  };
  
  // Bulk delete deals
  const bulkDeleteDeals = async () => {
    try {
      await axios.post('/api/deals/bulk', {
        action: 'delete',
        ids: selectedDeals
      });
      const updatedDeals = deals.filter(deal => !selectedDeals.includes(deal.id));
      setDeals(updatedDeals);
      applyFilters(updatedDeals);
      setSelectedDeals([]);
      setSelectAll(false);
      setIsBulkDeleteDialogOpen(false);
      toast.success(`${selectedDeals.length} deals deleted successfully`);
    } catch (err) {
      console.error('Error bulk deleting deals:', err);
      toast.error('Failed to delete deals. Please try again.');
    }
  };
  
  // Toggle featured status
  const toggleFeatured = async (id: number, featured: boolean) => {
    try {
      const response = await axios.put(`/api/deals/${id}`, { featured: !featured });
      const updatedDeals = deals.map(deal => 
        deal.id === id ? response.data : deal
      );
      setDeals(updatedDeals);
      applyFilters(updatedDeals);
      toast.success(`Deal ${!featured ? 'featured' : 'unfeatured'} successfully`);
    } catch (err) {
      console.error('Error toggling featured status:', err);
      toast.error('Failed to update featured status. Please try again.');
    }
  };
  
  // Handle edit button click
  const handleEdit = (deal: Deal) => {
    setIsEditing(true);
    setSelectedDealId(deal.id);
    setCurrentDeal({
      name: deal.name,
      description: deal.description,
      category: deal.category,
      price: deal.price,
      discountPrice: deal.discountPrice,
      jam3aId: deal.jam3aId,
      featured: deal.featured,
      jam3aStatus: deal.jam3aStatus,
      targetUsers: deal.targetUsers,
      currentUsers: deal.currentUsers,
      imageUrl: deal.imageUrl
    });
    setIsAddDialogOpen(true);
  };
  
  // Handle checkbox change for bulk operations
  const handleCheckboxChange = (id: number) => {
    setSelectedDeals(prev => {
      if (prev.includes(id)) {
        return prev.filter(dealId => dealId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(filteredDeals.map(deal => deal.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Get unique categories for filter dropdown
  const getUniqueCategories = () => {
    const categories = deals.map(deal => deal.category);
    return [...new Set(categories)];
  };
  
  // Effect to fetch deals on component mount
  useEffect(() => {
    fetchDeals();
  }, []);
  
  // Effect to apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, categoryFilter, statusFilter, minUsers, maxUsers, featuredFilter]);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Deals Management</CardTitle>
          <CardDescription>
            Manage all Jam3a deals, including featured status and Jam3a IDs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search deals..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDeals}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {selectedDeals.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsBulkDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedDeals.length})
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentDeal(emptyDeal);
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deal
                </Button>
              </div>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                <div>
                  <Label htmlFor="category-filter">Category</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger id="category-filter">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {getUniqueCategories().map((category, index) => (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status-filter">Jam3a Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="featured-filter">Featured Status</Label>
                  <Select
                    value={featuredFilter}
                    onValueChange={setFeaturedFilter}
                  >
                    <SelectTrigger id="featured-filter">
                      <SelectValue placeholder="All Deals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Deals</SelectItem>
                      <SelectItem value="true">Featured</SelectItem>
                      <SelectItem value="false">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="min-users">Min Users</Label>
                  <Input
                    id="min-users"
                    type="number"
                    placeholder="Min"
                    value={minUsers}
                    onChange={(e) => setMinUsers(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-users">Max Users</Label>
                  <Input
                    id="max-users"
                    type="number"
                    placeholder="Max"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading deals...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[120px]">Jam3a ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="w-[80px]">Featured</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center">
                          No deals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDeals.map((deal) => (
                        <TableRow key={deal.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedDeals.includes(deal.id)}
                              onCheckedChange={() => handleCheckboxChange(deal.id)}
                            />
                          </TableCell>
                          <TableCell>{deal.id}</TableCell>
                          <TableCell>{deal.jam3aId}</TableCell>
                          <TableCell>{deal.name}</TableCell>
                          <TableCell>{deal.category}</TableCell>
                          <TableCell>${deal.price.toFixed(2)}</TableCell>
                          <TableCell>${deal.discountPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              deal.jam3aStatus === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : deal.jam3aStatus === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {deal.jam3aStatus.charAt(0).toUpperCase() + deal.jam3aStatus.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {deal.currentUsers}/{deal.targetUsers}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFeatured(deal.id, deal.featured)}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  deal.featured ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(deal)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedDealId(deal.id);
                                  setIsDeleteDialogOpen(true);
                                }}
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
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredDeals.length} of {deals.length} deals
            </p>
          </div>
        </CardFooter>
      </Card>
      
      {/* Add/Edit Deal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details of the existing deal' 
                : 'Fill in the details to create a new deal'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="jam3a">Jam3a Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={currentDeal.name}
                    onChange={(e) => setCurrentDeal({...currentDeal, name: e.target.value})}
                    placeholder="Deal name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={currentDeal.description}
                    onChange={(e) => setCurrentDeal({...currentDeal, description: e.target.value})}
                    placeholder="Deal description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={currentDeal.category}
                    onChange={(e) => setCurrentDeal({...currentDeal, category: e.target.value})}
                    placeholder="Deal category"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={currentDeal.imageUrl}
                    onChange={(e) => setCurrentDeal({...currentDeal, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={currentDeal.featured}
                    onCheckedChange={(checked) => 
                      setCurrentDeal({...currentDeal, featured: checked as boolean})
                    }
                  />
                  <Label htmlFor="featured">Featured Deal</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={currentDeal.price}
                    onChange={(e) => setCurrentDeal({
                      ...currentDeal, 
                      price: parseFloat(e.target.value) || 0
                    })}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price ($)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    value={currentDeal.discountPrice}
                    onChange={(e) => setCurrentDeal({
                      ...currentDeal, 
                      discountPrice: parseFloat(e.target.value) || 0
                    })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="jam3a" className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jam3aId">Jam3a ID</Label>
                  <Input
                    id="jam3aId"
                    value={currentDeal.jam3aId}
                    onChange={(e) => setCurrentDeal({...currentDeal, jam3aId: e.target.value})}
                    placeholder="JAM-XXX-000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jam3aStatus">Jam3a Status</Label>
                  <Select
                    value={currentDeal.jam3aStatus}
                    onValueChange={(value: 'active' | 'pending' | 'completed') => 
                      setCurrentDeal({...currentDeal, jam3aStatus: value})
                    }
                  >
                    <SelectTrigger id="jam3aStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetUsers">Target Users</Label>
                    <Input
                      id="targetUsers"
                      type="number"
                      value={currentDeal.targetUsers}
                      onChange={(e) => setCurrentDeal({
                        ...currentDeal, 
                        targetUsers: parseInt(e.target.value) || 0
                      })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentUsers">Current Users</Label>
                    <Input
                      id="currentUsers"
                      type="number"
                      value={currentDeal.currentUsers}
                      onChange={(e) => setCurrentDeal({
                        ...currentDeal, 
                        currentUsers: parseInt(e.target.value) || 0
                      })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setCurrentDeal(emptyDeal);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={isEditing ? updateDeal : addDeal}>
              {isEditing ? 'Update' : 'Add'} Deal
            </Button>
          </DialogFooter>
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedDealId && deleteDeal(selectedDealId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDeals.length} deals? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={bulkDeleteDeals}
            >
              Delete {selectedDeals.length} Deals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealsManager;
