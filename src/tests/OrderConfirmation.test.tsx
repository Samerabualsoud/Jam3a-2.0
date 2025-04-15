import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useParams, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import OrderConfirmation from '@/pages/OrderConfirmation';
import orderService from '@/services/OrderService';
import paymentService from '@/services/PaymentService';
import { useAuth } from '@/contexts/AuthContext';

// Mock the react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
    useLocation: vi.fn(),
  };
});

// Mock the services
vi.mock('@/services/OrderService', () => ({
  default: {
    getOrder: vi.fn(),
  },
}));

vi.mock('@/services/PaymentService', () => ({
  default: {
    getPayment: vi.fn(),
    verifyMoyasserPayment: vi.fn(),
  },
}));

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('OrderConfirmation', () => {
  const mockNavigate = vi.fn();
  const mockParams = { orderId: 'test-order-id' };
  const mockLocation = { state: null };
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue(mockParams);
    useLocation.mockReturnValue(mockLocation);
    useAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });
  });

  test('renders loading state initially', () => {
    orderService.getOrder.mockResolvedValueOnce({});
    
    render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('redirects to login if not authenticated', async () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });
    
    render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/login',
        expect.objectContaining({ state: { from: '/order-confirmation/test-order-id' } })
      );
    });
  });

  test('fetches order and payment when no state is provided', async () => {
    const mockOrder = { 
      _id: 'test-order-id', 
      status: 'paid',
      paymentId: 'test-payment-id',
      totalAmount: 100,
      createdAt: new Date().toISOString(),
    };
    
    const mockPayment = {
      _id: 'test-payment-id',
      status: 'completed',
      paymentMethod: 'moyasser',
    };
    
    orderService.getOrder.mockResolvedValueOnce(mockOrder);
    paymentService.getPayment.mockResolvedValueOnce(mockPayment);
    
    render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );
    
    expect(orderService.getOrder).toHaveBeenCalledWith('test-order-id');
    
    await waitFor(() => {
      expect(paymentService.getPayment).toHaveBeenCalledWith('test-payment-id');
    });
    
    await waitFor(() => {
      expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    });
  });

  test('uses order and payment from location state when available', async () => {
    const mockOrder = { 
      _id: 'test-order-id', 
      status: 'paid',
      totalAmount: 100,
      createdAt: new Date().toISOString(),
    };
    
    const mockPayment = {
      _id: 'test-payment-id',
      status: 'completed',
      paymentMethod: 'moyasser',
    };
    
    // Set location state with order and payment
    mockLocation.state = { order: mockOrder, payment: mockPayment };
    
    render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );
    
    // Should not fetch order or payment
    expect(orderService.getOrder).not.toHaveBeenCalled();
    expect(paymentService.getPayment).not.toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    });
  });

  test('displays bank transfer instructions for bank transfer payments', async () => {
    const mockOrder = { 
      _id: 'test-order-id', 
      status: 'pending',
      totalAmount: 100,
      createdAt: new Date().toISOString(),
    };
    
    const mockPayment = {
      _id: 'test-payment-id',
      status: 'pending',
      paymentMethod: 'bank_transfer',
    };
    
    // Set location state with order and payment
    mockLocation.state = { order: mockOrder, payment: mockPayment };
    
    render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/awaiting payment/i)).toBeInTheDocument();
      expect(screen.getByText(/bank transfer instructions/i)).toBeInTheDocument();
      expect(screen.getByText(/saudi national bank/i)).toBeInTheDocument();
    });
  });

  test('displays cash on delivery information for COD payments', async () => {
    const mockOrder = { 
      _id: 'test-order-id', 
      status: 'pending',
      totalAmount: 100,
      createdAt: new Date().toISOString(),
    };
    
    const mockPayment = {
      _id: 'test-payment-id',
      status: 'pending',
      paymentMethod: 'cod',
    };
    
    // Set location state with order and payment
    mockLocation.state = { order: mockOrder, payment: mockPayment };
    
    render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
      expect(screen.getByText(/cash on delivery information/i)).toBeInTheDocument();
    });
  });

  test('verifies payment when needed', async () => {
    const mockOrder = { 
      _id: 'test-order-id', 
      status: 'pending',
      totalAmount: 100,
      createdAt: new Date().toISOString(),
    };
    
    const mockPayment = {
      _id: 'test-payment-id',
      status: 'pending',
      paymentMethod: 'moyasser',
    };
    
    const verifiedPayment = {
      ...mockPayment,
      status: 'completed',
    };
    
    // Set location state with order and payment
    mockLocation.state = { order: mockOrder, payment: mockPayment };
    
    paymentService.verifyMoyasserPayment.mockResolvedValueOnce(verifiedPayment);
    
    render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );
    
    expect(paymentService.verifyMoyasserPayment).toHaveBeenCalledWith('test-payment-id');
    
    await waitFor(() => {
      expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    });
  });
});
