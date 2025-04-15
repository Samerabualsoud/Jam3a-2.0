import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useSearchParams } from 'react-router-dom';
import { vi } from 'vitest';
import PaymentVerificationHandler from '@/components/payment/PaymentVerificationHandler';
import paymentService from '@/services/PaymentService';

// Mock the react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

// Mock the payment service
vi.mock('@/services/PaymentService', () => ({
  default: {
    verifyMoyasserPayment: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('PaymentVerificationHandler', () => {
  const mockNavigate = vi.fn();
  const mockSearchParams = new URLSearchParams();
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    mockSearchParams.set('payment_id', 'test-payment-id');
    useSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);
  });

  test('renders loading state initially', () => {
    paymentService.verifyMoyasserPayment.mockResolvedValueOnce({});
    
    render(
      <BrowserRouter>
        <PaymentVerificationHandler />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/verifying payment/i)).toBeInTheDocument();
    expect(screen.getByText(/please wait while we verify your payment/i)).toBeInTheDocument();
  });

  test('verifies payment and redirects on success', async () => {
    const mockPayment = { 
      _id: 'payment-id', 
      order: 'order-id',
      status: 'completed' 
    };
    
    paymentService.verifyMoyasserPayment.mockResolvedValueOnce(mockPayment);
    
    render(
      <BrowserRouter>
        <PaymentVerificationHandler />
      </BrowserRouter>
    );
    
    // Check if the payment service was called with correct parameters
    expect(paymentService.verifyMoyasserPayment).toHaveBeenCalledWith('test-payment-id');
    
    // Wait for the navigation to be called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        `/order-confirmation/${mockPayment.order}`,
        expect.objectContaining({ state: { payment: mockPayment } })
      );
    });
  });

  test('handles missing payment ID', async () => {
    // Clear the payment_id from search params
    mockSearchParams.delete('payment_id');
    
    render(
      <BrowserRouter>
        <PaymentVerificationHandler />
      </BrowserRouter>
    );
    
    // Wait for the navigation to be called (redirecting to home after error)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 4000 });
  });

  test('handles verification error', async () => {
    paymentService.verifyMoyasserPayment.mockRejectedValueOnce(new Error('Test error'));
    
    render(
      <BrowserRouter>
        <PaymentVerificationHandler />
      </BrowserRouter>
    );
    
    // Wait for the navigation to be called (redirecting to home after error)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 4000 });
  });
});
