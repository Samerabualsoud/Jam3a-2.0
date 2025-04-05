import apiService from './api';

// Interface for group data
export interface Group {
  _id: string;
  name: string;
  description: string;
  category: string;
  targetSize: number;
  currentSize: number;
  creator: string;
  members: string[];
  status: 'open' | 'closed' | 'completed';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  productCategory: string;
  priceRange?: {
    min: number;
    max: number;
  };
  image?: string;
}

// Interface for group creation
export interface GroupInput {
  name: string;
  description: string;
  category: string;
  targetSize: number;
  productCategory: string;
  priceRange?: {
    min: number;
    max: number;
  };
  expiresAt?: string;
  image?: string;
}

// Group service for handling group-related API calls
class GroupService {
  private baseUrl = '/groups';
  
  // Get all groups with optional filtering
  async getGroups(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: 'open' | 'closed' | 'completed';
    search?: string;
  }): Promise<{ groups: Group[], total: number, pages: number }> {
    return apiService.get(this.baseUrl, { params });
  }
  
  // Get groups by category
  async getGroupsByCategory(category: string, params?: {
    page?: number;
    limit?: number;
    status?: 'open' | 'closed' | 'completed';
  }): Promise<{ groups: Group[], total: number, pages: number }> {
    return apiService.get(`${this.baseUrl}/category/${category}`, { params });
  }
  
  // Get a single group by ID
  async getGroup(id: string): Promise<Group> {
    return apiService.get(`${this.baseUrl}/${id}`);
  }
  
  // Create a new group
  async createGroup(group: GroupInput): Promise<Group> {
    return apiService.post(this.baseUrl, group);
  }
  
  // Update an existing group
  async updateGroup(id: string, group: Partial<GroupInput>): Promise<Group> {
    return apiService.put(`${this.baseUrl}/${id}`, group);
  }
  
  // Delete a group
  async deleteGroup(id: string): Promise<{ success: boolean, message: string }> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }
  
  // Join a group
  async joinGroup(id: string): Promise<Group> {
    return apiService.post(`${this.baseUrl}/${id}/join`);
  }
  
  // Leave a group
  async leaveGroup(id: string): Promise<Group> {
    return apiService.post(`${this.baseUrl}/${id}/leave`);
  }
  
  // Get groups created by current user
  async getMyGroups(params?: {
    page?: number;
    limit?: number;
    status?: 'open' | 'closed' | 'completed';
  }): Promise<{ groups: Group[], total: number, pages: number }> {
    return apiService.get(`${this.baseUrl}/my-groups`, { params });
  }
  
  // Get groups joined by current user
  async getJoinedGroups(params?: {
    page?: number;
    limit?: number;
    status?: 'open' | 'closed' | 'completed';
  }): Promise<{ groups: Group[], total: number, pages: number }> {
    return apiService.get(`${this.baseUrl}/joined`, { params });
  }
  
  // Upload group image
  async uploadGroupImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiService.uploadFile(`${this.baseUrl}/upload-image`, formData);
  }
  
  // Get group statistics
  async getGroupStats(): Promise<{
    totalGroups: number;
    openGroups: number;
    completedGroups: number;
    popularCategories: { category: string; count: number }[];
  }> {
    return apiService.get(`${this.baseUrl}/stats`);
  }
}

// Create and export a singleton instance
const groupService = new GroupService();
export default groupService;
