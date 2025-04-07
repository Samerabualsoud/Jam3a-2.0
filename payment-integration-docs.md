# Moyasser Payment Integration Documentation

## Architecture Overview

The Jam3a platform integrates with Moyasser payment gateway to provide secure payment processing for customers. The integration follows a modular architecture with clear separation of concerns between frontend components and backend services.

### Key Components

1. **Frontend Services**
   - `PaymentService.ts`: Interface with backend payment endpoints
   - `OrderService.ts`: Manage order data and status

2. **Backend Services**
   - `MoyasserService.js`: Core service for interacting with Moyasser API
   - `moyasser.js` (routes): API endpoints for payment operations

3. **UI Components**
   - `MoyasserPaymentForm`: Handles credit/debit card payments
   - `BankTransferForm`: Manages bank transfer payments
   - `CashOnDeliveryForm`: Processes cash on delivery orders
   - `PaymentStatus`: Displays payment status information
   - `PaymentVerificationHandler`: Processes payment callbacks

4. **Pages**
   - `Checkout.tsx`: Main checkout flow
   - `OrderConfirmation.tsx`: Order confirmation after payment

## Payment Flow

### Credit/Debit Card Payment (Moyasser)

1. **Initialization**
   - User selects "Credit/Debit Card" payment method on checkout page
   - Frontend calls `paymentService.initializeMoyasserPayment(orderId)`
   - Backend generates payment form data with `MoyasserService.generatePaymentForm()`
   - Frontend receives payment data including API key, amount, currency, etc.

2. **Payment Processing**
   - Moyasser JS SDK is loaded dynamically
   - Payment form is created and mounted to the DOM
   - User enters card details in the secure form
   - Form submits payment directly to Moyasser servers (PCI compliant)

3. **Verification**
   - On successful payment, Moyasser calls the callback URL
   - `PaymentVerificationHandler` component processes the callback
   - Backend verifies payment with `MoyasserService.verifyPayment()`
   - Order status is updated to "paid" if verification succeeds
   - User is redirected to order confirmation page

### Bank Transfer Payment

1. **Initialization**
   - User selects "Bank Transfer" payment method
   - Frontend displays bank account details
   - User confirms order with bank transfer

2. **Processing**
   - Frontend calls `paymentService.createPayment()` with `bank_transfer` method
   - Backend creates a pending payment record
   - Order status is set to "pending"

3. **Verification**
   - User completes bank transfer outside the platform
   - Admin manually verifies the transfer
   - Order status is updated to "paid" after verification

### Cash on Delivery Payment

1. **Initialization**
   - User selects "Cash on Delivery" payment method
   - Frontend displays COD information and additional fee

2. **Processing**
   - Frontend calls `paymentService.createPayment()` with `cod` method
   - Backend creates a pending payment record
   - Order status is set to "pending"

3. **Verification**
   - Payment is marked as completed upon delivery and cash collection
   - Order status is updated to "paid" after delivery

## Security Considerations

1. **PCI Compliance**
   - Card details are never processed or stored on Jam3a servers
   - Moyasser JS SDK handles all card data securely

2. **Webhook Verification**
   - All Moyasser webhooks are verified using HMAC signatures
   - `MoyasserService.verifyWebhookSignature()` validates authenticity

3. **Payment Verification**
   - All payments are verified with Moyasser before being marked as completed
   - Double verification through webhooks and API calls

## Error Handling

1. **Payment Initialization Errors**
   - Network issues, server errors, or invalid order data
   - User is shown error message with retry option

2. **Payment Processing Errors**
   - Card declined, insufficient funds, or technical issues
   - Error details from Moyasser are displayed to user

3. **Verification Errors**
   - Failed verification due to mismatch or technical issues
   - Admin is notified for manual intervention

## Testing

The payment integration includes comprehensive tests for all components:

1. **Unit Tests**
   - Tests for all payment form components
   - Tests for verification and callback handling

2. **Integration Tests**
   - End-to-end tests for complete payment flows
   - Error handling and edge case testing

## Configuration

The Moyasser integration can be configured through environment variables:

```
MOYASSER_API_KEY=your_api_key
MOYASSER_SECRET_KEY=your_secret_key
MOYASSER_API_URL=https://api.moyasser.com/v1
NODE_ENV=production|development
```

In development mode, the integration uses Moyasser's test environment.
