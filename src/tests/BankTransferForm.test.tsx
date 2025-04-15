import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import BankTransferForm from '@/components/payment/BankTransferForm';
import paymentService from '@/services/PaymentService';

// Mock the payment service
vi.mock('@/services/PaymentService', () => ({
  default: {
    createPayment: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('BankTransferForm', () => {
  const mockProps = {
    orderId: 'test-order-id',
    amount: 100,
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders bank transfer details correctly', () => {
    render(
      <BrowserRouter>
        <BankTransferForm {...mockProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/bank transfer details/i)).toBeInTheDocument();
    expect(screen.getByText(/saudi national bank/i)).toBeInTheDocument();
    expect(screen.getByText(/jam3a trading company/i)).toBeInTheDocument();
    expect(screen.getByText(/amount to transfer/i)).toBeInTheDocument();
    expect(screen.getByText(/100.00 sar/i)).toBeInTheDocument();
  });

  test('creates payment when confirm button is clicked', async () => {
    const mockPayment = { 
      _id: 'payment-id', 
      status: 'pending', 
      paymentMethod: 'bank_transfer' 
    };
    
    paymentService.createPayment.mockResolvedValueOnce(mockPayment);
    
    render(
      <BrowserRouter>
        <BankTransferForm {...mockProps} />
      </BrowserRouter>
    );
    
    // Click the confirm button
    fireEvent.click(screen.getByText(/confirm order with bank transfer/i));
    
    // Check if the payment service was called with correct parameters
    expect(paymentService.createPayment).toHaveBeenCalledWith({
      order: mockProps.orderId,
      amount: mockProps.amount,
      currency: 'SAR',
      paymentMethod: 'bank_transfer',
    });
    
    // Wait for the success callback to be called
    await waitFor(() => {
      expect(mockProps.onSuccess).toHaveBeenCalledWith(mockPayment);
    });
  });

  test('shows loading state during payment processing', async () => {
    // Delay the payment creation to show loading state
    paymentService.createPayment.mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ _id: 'payment-id' });
        }, 100);
      });
    });
    
    render(
      <BrowserRouter>
        <BankTransferForm {...mockProps} />
      </BrowserRouter>
    );
    
    // Click the confirm button
    fireEvent.click(screen.getByText(/confirm order with bank transfer/i));
    
    // Check if loading state is shown
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    
    // Wait for the processing to complete
    await waitFor(() => {
      expect(mockProps.onSuccess).toHaveBeenCalled();
    });
  });

  test('handles payment creation error', async () => {
    paymentService.createPayment.mockRejectedValueOnce(new Error('Test error'));
    
    render(
      <BrowserRouter>
        <BankTransferForm {...mockProps} />
      </BrowserRouter>
    );
    
    // Click the confirm button
    fireEvent.click(screen.getByText(/confirm order with bank transfer/i));
    
    // Wait for the error callback to be called
    await waitFor(() => {
      expect(mockProps.onError).toHaveBeenCalled();
    });
  });
});
