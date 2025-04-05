import apiService from './api';

// Interface for payment data
export interface Payment {
  _id: string;
  user: string;
  order: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'moyasser' | 'cod' | 'bank_transfer';
  transactionId?: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Interface for payment creation
export interface PaymentInput {
  order: string;
  amount: number;
  currency: string;
  paymentMethod: 'moyasser' | 'cod' | 'bank_transfer';
}

// Interface for Moyasser payment initialization
export interface MoyasserPaymentInit {
  paymentUrl: string;
  paymentId: string;
}

// Payment service for handling payment-related API calls
class PaymentService {
  private baseUrl = '/payments';
  
  // Get all payments with optional filtering (admin only)
  async getPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentMethod?: string;
  }): Promise<{ payments: Payment[], total: number, pages: number }> {
    return apiService.get(this.baseUrl, { params });
  }
  
  // Get a single payment by ID
  async getPayment(id: string): Promise<Payment> {
    return apiService.get(`${this.baseUrl}/${id}`);
  }
  
  // Create a new payment
  async createPayment(payment: PaymentInput): Promise<Payment> {
    return apiService.post(this.baseUrl, payment);
  }
  
  // Get payments for current user
  async getMyPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ payments: Payment[], total: number, pages: number }> {
    return apiService.get(`${this.baseUrl}/my-payments`, { params });
  }
  
  // Initialize Moyasser payment
  async initializeMoyasserPayment(orderId: string): Promise<MoyasserPaymentInit> {
    return apiService.post(`${this.baseUrl}/moyasser/initialize`, { orderId });
  }
  
  // Verify Moyasser payment
  async verifyMoyasserPayment(paymentId: string): Promise<Payment> {
    return apiService.post(`${this.baseUrl}/moyasser/verify`, { paymentId });
  }
  
  // Process Moyasser webhook (server-side only)
  async processMoyasserWebhook(data: any): Promise<{ success: boolean }> {
    return apiService.post(`${this.baseUrl}/moyasser/webhook`, data);
  }
  
  // Request refund (admin only)
  async requestRefund(paymentId: string, reason: string): Promise<Payment> {
    return apiService.post(`${this.baseUrl}/${paymentId}/refund`, { reason });
  }
  
  // Get payment receipt
  async getPaymentReceipt(paymentId: string): Promise<Blob> {
    return apiService.get(`${this.baseUrl}/${paymentId}/receipt`, { responseType: 'blob' }) as unknown as Blob;
  }
  
  // Get payment statistics (admin only)
  async getPaymentStats(): Promise<{
    totalPayments: number;
    totalRevenue: number;
    paymentsByMethod: Record<string, number>;
    paymentsByStatus: Record<string, number>;
  }> {
    return apiService.get(`${this.baseUrl}/stats`);
  }
}

// Create and export a singleton instance
const paymentService = new PaymentService();
export default paymentService;
