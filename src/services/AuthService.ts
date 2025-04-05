import apiService from './api';

// Interface for user data
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'seller';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for registration data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

// Interface for auth responses
export interface AuthResponse {
  user: User;
  token: string;
}

// Authentication service for handling auth-related API calls
class AuthService {
  private baseUrl = '/auth';
  
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }
  
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(`${this.baseUrl}/register`, data);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }
  
  // Logout user
  async logout(): Promise<{ success: boolean }> {
    try {
      const response = await apiService.post<{ success: boolean }>(`${this.baseUrl}/logout`);
      
      // Remove token from localStorage
      localStorage.removeItem('auth_token');
      
      return response;
    } catch (error) {
      // Even if the API call fails, remove the token
      localStorage.removeItem('auth_token');
      throw error;
    }
  }
  
  // Get current user profile
  async getCurrentUser(): Promise<User> {
    return apiService.get<User>(`${this.baseUrl}/me`);
  }
  
  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiService.put<User>(`${this.baseUrl}/me`, data);
  }
  
  // Change password
  async changePassword(data: { currentPassword: string; newPassword: string; newPasswordConfirmation: string }): Promise<{ success: boolean }> {
    return apiService.post<{ success: boolean }>(`${this.baseUrl}/change-password`, data);
  }
  
  // Request password reset
  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    return apiService.post<{ success: boolean }>(`${this.baseUrl}/forgot-password`, { email });
  }
  
  // Reset password with token
  async resetPassword(data: { token: string; password: string; passwordConfirmation: string }): Promise<{ success: boolean }> {
    return apiService.post<{ success: boolean }>(`${this.baseUrl}/reset-password`, data);
  }
  
  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiService.uploadFile<{ avatarUrl: string }>(`${this.baseUrl}/upload-avatar`, formData);
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
