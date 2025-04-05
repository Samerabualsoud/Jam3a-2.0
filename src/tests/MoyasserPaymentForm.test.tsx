import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MoyasserPaymentForm from '@/components/payment/MoyasserPaymentForm';
import paymentService from '@/services/PaymentService';

// Mock the payment service
vi.mock('@/services/PaymentService', () => ({
  default: {
    initializeMoyasserPayment: vi.fn(),
    verifyMoyasserPayment: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('MoyasserPaymentForm', () => {
  const mockProps = {
    orderId: 'test-order-id',
    amount: 100,
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    paymentService.initializeMoyasserPayment.mockResolvedValueOnce({});
    
    render(
      <BrowserRouter>
        <MoyasserPaymentForm {...mockProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/initializing payment/i)).toBeInTheDocument();
  });

  test('initializes payment on mount', () => {
    paymentService.initializeMoyasserPayment.mockResolvedValueOnce({});
    
    render(
      <BrowserRouter>
        <MoyasserPaymentForm {...mockProps} />
      </BrowserRouter>
    );
    
    expect(paymentService.initializeMoyasserPayment).toHaveBeenCalledWith(mockProps.orderId);
  });

  test('shows error state when initialization fails', async () => {
    paymentService.initializeMoyasserPayment.mockRejectedValueOnce(new Error('Test error'));
    
    render(
      <BrowserRouter>
        <MoyasserPaymentForm {...mockProps} />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/payment error/i)).toBeInTheDocument();
    });
    
    expect(mockProps.onError).toHaveBeenCalled();
  });

  test('allows retrying payment when in error state', async () => {
    paymentService.initializeMoyasserPayment.mockRejectedValueOnce(new Error('Test error'));
    
    render(
      <BrowserRouter>
        <MoyasserPaymentForm {...mockProps} />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });
    
    // Clear the mock to prepare for the retry
    paymentService.initializeMoyasserPayment.mockClear();
    paymentService.initializeMoyasserPayment.mockResolvedValueOnce({});
    
    // Click the retry button
    fireEvent.click(screen.getByText(/try again/i));
    
    expect(paymentService.initializeMoyasserPayment).toHaveBeenCalledWith(mockProps.orderId);
  });

  // Additional tests would be added for script loading, form mounting, payment success/failure handling
});
