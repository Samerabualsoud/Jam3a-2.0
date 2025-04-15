/**
 * Error handling utility functions for Jam3a-2.0
 * Provides consistent error handling across the application
 */

import { toast } from '@/hooks/use-toast';

// Error types
export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  SERVER = 'server',
  NETWORK = 'network',
  PAYMENT = 'payment',
  UNKNOWN = 'unknown'
}

// Error interface
export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string;
  originalError?: any;
}

// Create a standardized error object
export const createError = (
  type: ErrorType,
  message: string,
  details?: string,
  code?: string,
  originalError?: any
): AppError => {
  return {
    type,
    message,
    details,
    code,
    originalError
  };
};

// Handle API errors
export const handleApiError = (error: any): AppError => {
  // Check if it's an axios error with a response
  if (error.response) {
    const { status, data } = error.response;
    
    // Authentication errors
    if (status === 401) {
      return createError(
        ErrorType.AUTHENTICATION,
        'Authentication failed',
        data?.message || 'Your session has expired or you are not logged in',
        'AUTH_ERROR',
        error
      );
    }
    
    // Authorization errors
    if (status === 403) {
      return createError(
        ErrorType.AUTHORIZATION,
        'Access denied',
        data?.message || 'You do not have permission to perform this action',
        'FORBIDDEN',
        error
      );
    }
    
    // Validation errors
    if (status === 400 || status === 422) {
      return createError(
        ErrorType.VALIDATION,
        'Validation error',
        data?.message || 'Please check your input and try again',
        'VALIDATION_ERROR',
        error
      );
    }
    
    // Server errors
    if (status >= 500) {
      return createError(
        ErrorType.SERVER,
        'Server error',
        data?.message || 'Something went wrong on our end. Please try again later',
        `SERVER_${status}`,
        error
      );
    }
    
    // Other HTTP errors
    return createError(
      ErrorType.UNKNOWN,
      'Request failed',
      data?.message || `Error ${status}: ${data?.error || 'Unknown error'}`,
      `HTTP_${status}`,
      error
    );
  }
  
  // Network errors
  if (error.request) {
    return createError(
      ErrorType.NETWORK,
      'Network error',
      'Unable to connect to the server. Please check your internet connection',
      'NETWORK_ERROR',
      error
    );
  }
  
  // Payment processing errors
  if (error.message && error.message.toLowerCase().includes('payment')) {
    return createError(
      ErrorType.PAYMENT,
      'Payment error',
      error.message || 'There was an error processing your payment',
      'PAYMENT_ERROR',
      error
    );
  }
  
  // Unknown errors
  return createError(
    ErrorType.UNKNOWN,
    'Unknown error',
    error.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    error
  );
};

// Display error toast
export const showErrorToast = (error: AppError): void => {
  toast({
    title: error.message,
    description: error.details,
    variant: 'destructive',
  });
};

// Log error to console with additional details
export const logError = (error: AppError): void => {
  console.error(`[${error.type.toUpperCase()}] ${error.message}`, {
    details: error.details,
    code: error.code,
    originalError: error.originalError
  });
};

// Handle error with logging and toast notification
export const handleError = (error: any): AppError => {
  const appError = error.type ? error : handleApiError(error);
  logError(appError);
  showErrorToast(appError);
  return appError;
};

// Handle form validation errors
export const handleFormError = (error: any, setError: any): void => {
  // Handle Zod validation errors
  if (error.errors) {
    error.errors.forEach((err: any) => {
      if (err.path && err.path.length > 0) {
        setError(err.path[0], {
          type: 'manual',
          message: err.message
        });
      }
    });
  } 
  // Handle API validation errors
  else if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    Object.keys(errors).forEach(key => {
      setError(key, {
        type: 'manual',
        message: errors[key]
      });
    });
  } 
  // Handle general errors
  else {
    const appError = handleApiError(error);
    showErrorToast(appError);
  }
};
