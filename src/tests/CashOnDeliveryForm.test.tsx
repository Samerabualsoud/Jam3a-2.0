import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import CashOnDeliveryForm from '@/components/payment/CashOnDeliveryForm';
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

describe('CashOnDeliveryForm', () => {
  const mockProps = {
    orderId: 'test-order-id',
    amount: 100,
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders cash on delivery details correctly', () => {
    render(
      <BrowserRouter>
        <CashOnDeliveryForm {...mockProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/cash on delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/pay with cash when your order is delivered/i)).toBeInTheDocument();
    expect(screen.getByText(/please note:/i)).toBeInTheDocument();
    expect(screen.getByText(/delivery fee of 15 SAR/i)).toBeInTheDocument();
    expect(screen.getByText(/total to pay on delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/115.00 SAR/i)).toBeInTheDocument(); // 100 + 15 delivery fee
  });

  test('creates payment when confirm button is clicked', async () => {
    const mockPayment = { 
      _id: 'payment-id', 
      status: 'pending', 
      paymentMethod: 'cod' 
    };
    
    paymentService.createPayment.mockResolvedValueOnce(mockPayment);
    
    render(
      <BrowserRouter>
        <CashOnDeliveryForm {...mockProps} />
      </BrowserRouter>
    );
    
    // Click the confirm button
    fireEvent.click(screen.getByText(/confirm order with cash on delivery/i));
    
    // Check if the payment service was called with correct parameters
    expect(paymentService.createPayment).toHaveBeenCalledWith({
      order: mockProps.orderId,
      amount: mockProps.amount,
      currency: 'SAR',
      paymentMethod: 'cod',
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
        <CashOnDeliveryForm {...mockProps} />
      </BrowserRouter>
    );
    
    // Click the confirm button
    fireEvent.click(screen.getByText(/confirm order with cash on delivery/i));
    
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
        <CashOnDeliveryForm {...mockProps} />
      </BrowserRouter>
    );
    
    // Click the confirm button
    fireEvent.click(screen.getByText(/confirm order with cash on delivery/i));
    
    // Wait for the error callback to be called
    await waitFor(() => {
      expect(mockProps.onError).toHaveBeenCalled();
    });
  });
});
