/**
 * Enhanced authentication utility for Jam3a-2.0
 * Provides secure token handling and authentication functions
 */

import { createError, ErrorType } from './errorHandler';
import apiService from '@/services/enhancedApi';

// Token storage keys
const AUTH_TOKEN_KEY = 'jam3a_auth_token';
const REFRESH_TOKEN_KEY = 'jam3a_refresh_token';
const USER_DATA_KEY = 'jam3a_user_data';
const TOKEN_EXPIRY_KEY = 'jam3a_token_expiry';

// User interface
export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'vendor';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication response interface
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

// Authentication service
class AuthService {
  private user: User | null = null;
  private tokenExpiryTime: number = 0;
  private refreshTokenTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize from storage if available
    this.loadFromStorage();
    
    // Set up token refresh mechanism
    this.setupTokenRefresh();
  }

  // Load authentication data from storage
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Get token and check if it exists
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return;
      
      // Get user data
      const userData = localStorage.getItem(USER_DATA_KEY);
      if (userData) {
        this.user = JSON.parse(userData);
      }
      
      // Get token expiry
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (expiryTime) {
        this.tokenExpiryTime = parseInt(expiryTime, 10);
      }
      
      // Set token in API service
      apiService.setToken(token);
    } catch (error) {
      console.error('Error loading auth data from storage:', error);
      this.clearAuth();
    }
  }

  // Set up automatic token refresh
  private setupTokenRefresh(): void {
    if (typeof window === 'undefined') return;
    
    // Clear any existing timeout
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
    
    // Check if we have a token and expiry time
    if (!this.isAuthenticated() || !this.tokenExpiryTime) return;
    
    // Calculate time until token expires (with 5 minute buffer)
    const currentTime = Date.now();
    const timeUntilExpiry = this.tokenExpiryTime - currentTime - (5 * 60 * 1000);
    
    // If token is already expired or will expire soon, refresh now
    if (timeUntilExpiry <= 0) {
      this.refreshToken();
      return;
    }
    
    // Set timeout to refresh token before it expires
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken();
    }, timeUntilExpiry);
  }

  // Save authentication data to storage
  private saveToStorage(authData: AuthResponse): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(authData.user));
      
      // Calculate and store expiry time
      const expiryTime = Date.now() + (authData.expiresIn * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      this.tokenExpiryTime = expiryTime;
    } catch (error) {
      console.error('Error saving auth data to storage:', error);
    }
  }

  // Clear authentication data
  clearAuth(): void {
    this.user = null;
    this.tokenExpiryTime = 0;
    
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
    
    apiService.clearToken();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!token || !expiryTime) return false;
    
    // Check if token is expired
    const currentTime = Date.now();
    const tokenExpiry = parseInt(expiryTime, 10);
    
    return currentTime < tokenExpiry;
  }

  // Get current user
  getUser(): User | null {
    return this.user;
  }

  // Check if user has specific role
  hasRole(role: string | string[]): boolean {
    if (!this.user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(this.user.role);
    }
    
    return this.user.role === role;
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', {
        email,
        password
      });
      
      // Save auth data
      this.saveToStorage(response);
      
      // Set user and token
      this.user = response.user;
      apiService.setToken(response.token);
      
      // Set up token refresh
      this.setupTokenRefresh();
      
      return response.user;
    } catch (error) {
      throw createError(
        ErrorType.AUTHENTICATION,
        'Login failed',
        'Invalid email or password. Please try again.',
        'AUTH_LOGIN_FAILED',
        error
      );
    }
  }

  // Register new user
  async register(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
  }): Promise<User> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', userData);
      
      // Save auth data
      this.saveToStorage(response);
      
      // Set user and token
      this.user = response.user;
      apiService.setToken(response.token);
      
      // Set up token refresh
      this.setupTokenRefresh();
      
      return response.user;
    } catch (error) {
      throw createError(
        ErrorType.AUTHENTICATION,
        'Registration failed',
        'Unable to create account. Please check your information and try again.',
        'AUTH_REGISTER_FAILED',
        error
      );
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if authenticated
      if (this.isAuthenticated()) {
        await apiService.post('/auth/logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear auth data regardless of API call success
      this.clearAuth();
    }
  }

  // Refresh authentication token
  async refreshToken(): Promise<void> {
    try {
      // Get refresh token from storage
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        throw createError(
          ErrorType.AUTHENTICATION,
          'Token refresh failed',
          'No refresh token available',
          'AUTH_NO_REFRESH_TOKEN'
        );
      }
      
      // Call refresh token endpoint
      const response = await apiService.post<AuthResponse>('/auth/refresh-token', {
        refreshToken
      });
      
      // Save new auth data
      this.saveToStorage(response);
      
      // Update user and token
      this.user = response.user;
      apiService.setToken(response.token);
      
      // Set up next token refresh
      this.setupTokenRefresh();
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Clear auth data on refresh failure
      this.clearAuth();
      
      // Redirect to login if in browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  // Verify current token
  async verifyToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }
      
      const response = await apiService.get<{ valid: boolean }>('/auth/verify-token');
      return response.valid;
    } catch (error) {
      console.error('Token verification failed:', error);
      this.clearAuth();
      return false;
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiService.post('/auth/request-password-reset', { email });
    } catch (error) {
      throw createError(
        ErrorType.AUTHENTICATION,
        'Password reset request failed',
        'Unable to request password reset. Please try again later.',
        'AUTH_RESET_REQUEST_FAILED',
        error
      );
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/reset-password', {
        token,
        newPassword
      });
    } catch (error) {
      throw createError(
        ErrorType.AUTHENTICATION,
        'Password reset failed',
        'Unable to reset password. The link may be expired or invalid.',
        'AUTH_RESET_FAILED',
        error
      );
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<{ user: User }>('/users/profile', userData);
      
      // Update stored user data
      this.user = response.user;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      throw createError(
        ErrorType.AUTHENTICATION,
        'Profile update failed',
        'Unable to update profile. Please try again.',
        'AUTH_PROFILE_UPDATE_FAILED',
        error
      );
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      throw createError(
        ErrorType.AUTHENTICATION,
        'Password change failed',
        'Unable to change password. Please check your current password and try again.',
        'AUTH_PASSWORD_CHANGE_FAILED',
        error
      );
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
