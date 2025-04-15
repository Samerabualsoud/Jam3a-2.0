/**
 * Validation utility functions for Jam3a-2.0
 * Contains reusable validation functions for forms and input fields
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation with support for Saudi formats
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove any spaces or special characters
  const cleanedPhone = phone.replace(/\s+|-|\(|\)/g, '');
  
  // Saudi mobile formats:
  // 05xxxxxxxx (Saudi mobile with leading zero)
  // 5xxxxxxxx (Saudi mobile without leading zero)
  // +9665xxxxxxxx (International format)
  const saudiMobileRegex = /^(05\d{8}|\+9665\d{8}|5\d{8})$/;
  
  return saudiMobileRegex.test(cleanedPhone);
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('966')) {
    // International format: +966 5x xxx xxxx
    return `+966 ${digits.substring(3, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  } else if (digits.startsWith('05')) {
    // Local format with leading zero: 05x xxx xxxx
    return `${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
  } else if (digits.length === 9 && digits.startsWith('5')) {
    // Local format without leading zero: 5xx xxx xxxx
    return `0${digits.substring(0, 1)} ${digits.substring(1, 4)} ${digits.substring(4)}`;
  }
  
  // Return original if no format matches
  return phone;
};

// Credit card validation using Luhn algorithm
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  // Luhn algorithm implementation
  let sum = 0;
  let shouldDouble = false;
  
  // Loop from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

// Format credit card number with spaces
export const formatCreditCardNumber = (cardNumber: string): string => {
  // Remove existing spaces
  const digits = cardNumber.replace(/\s/g, '');
  
  // Add a space after every 4 digits
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Validate expiry date (MM/YY format)
export const isValidExpiryDate = (expiry: string): boolean => {
  // Check format
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return false;
  }
  
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000; // Convert YY to 20YY
  
  // Check if month is valid
  if (month < 1 || month > 12) {
    return false;
  }
  
  // Get current date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Check if the card is not expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

// Format expiry date to MM/YY
export const formatExpiryDate = (input: string): string => {
  // Remove non-digits
  const digits = input.replace(/\D/g, '');
  
  if (digits.length <= 2) {
    return digits;
  }
  
  // Format as MM/YY
  return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
};

// Validate CVV (3-4 digits)
export const isValidCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

// Password strength validation
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) {
    return 'weak';
  }
  
  let strength = 0;
  
  // Has lowercase letters
  if (/[a-z]/.test(password)) {
    strength += 1;
  }
  
  // Has uppercase letters
  if (/[A-Z]/.test(password)) {
    strength += 1;
  }
  
  // Has numbers
  if (/\d/.test(password)) {
    strength += 1;
  }
  
  // Has special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
  }
  
  if (strength < 3) {
    return 'weak';
  } else if (strength === 3) {
    return 'medium';
  } else {
    return 'strong';
  }
};

// Validate required field
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Validate minimum length
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Validate maximum length
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// Validate numeric value
export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

// Validate decimal value
export const isDecimal = (value: string): boolean => {
  return /^\d+(\.\d+)?$/.test(value);
};

// Validate URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Validate Saudi IBAN
export const isValidSaudiIBAN = (iban: string): boolean => {
  // Remove spaces
  const cleanedIban = iban.replace(/\s/g, '');
  
  // Saudi IBAN format: SA followed by 22 digits
  return /^SA\d{22}$/.test(cleanedIban);
};

// Format Saudi IBAN with spaces for readability
export const formatSaudiIBAN = (iban: string): string => {
  // Remove existing spaces
  const cleaned = iban.replace(/\s/g, '');
  
  // Format as SA00 0000 0000 0000 0000 0000
  if (cleaned.length >= 2) {
    let formatted = cleaned.substring(0, 2);
    
    for (let i = 2; i < cleaned.length; i += 4) {
      formatted += ' ' + cleaned.substring(i, i + 4);
    }
    
    return formatted.trim();
  }
  
  return iban;
};
