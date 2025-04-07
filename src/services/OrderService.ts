import apiService from './api';

// Interface for order data
export interface Order {
  _id: string;
  user: string;
  group: string;
  products: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for order creation
export interface OrderInput {
  group: string;
  products: {
    product: string;
    quantity: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
}

// Order service for handling order-related API calls
class OrderService {
  private baseUrl = '/orders';
  
  // Get all orders with optional filtering (admin only)
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ orders: Order[], total: number, pages: number }> {
    return apiService.get(this.baseUrl, { params });
  }
  
  // Get a single order by ID
  async getOrder(id: string): Promise<Order> {
    return apiService.get(`${this.baseUrl}/${id}`);
  }
  
  // Create a new order
  async createOrder(order: OrderInput): Promise<Order> {
    return apiService.post(this.baseUrl, order);
  }
  
  // Update an existing order (admin only)
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    return apiService.put(`${this.baseUrl}/${id}`, updates);
  }
  
  // Cancel an order
  async cancelOrder(id: string): Promise<Order> {
    return apiService.post(`${this.baseUrl}/${id}/cancel`);
  }
  
  // Get orders for current user
  async getMyOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ orders: Order[], total: number, pages: number }> {
    return apiService.get(`${this.baseUrl}/my-orders`, { params });
  }
  
  // Get orders for a specific group
  async getGroupOrders(groupId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ orders: Order[], total: number, pages: number }> {
    return apiService.get(`${this.baseUrl}/group/${groupId}`, { params });
  }
  
  // Get order statistics (admin only)
  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Record<string, number>;
    recentOrders: Order[];
  }> {
    return apiService.get(`${this.baseUrl}/stats`);
  }
}

// Create and export a singleton instance
const orderService = new OrderService();
export default orderService;
