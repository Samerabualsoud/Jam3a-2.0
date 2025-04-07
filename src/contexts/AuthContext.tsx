import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/AuthService';

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isSeller?: boolean;
  roles?: string[];
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isSeller: boolean;
  hasRole: (role: string) => boolean;
  updateUser: (userData: Partial<User>) => Promise<User>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ id: '', name: '', email: '' }),
  register: async () => ({ id: '', name: '', email: '' }),
  logout: async () => {},
  isAdmin: false,
  isSeller: false,
  hasRole: () => false,
  updateUser: async () => ({ id: '', name: '', email: '' }),
  isLoading: false,
  error: null,
  clearError: () => {},
});

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize state from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('jam3a_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;
  const isSeller = user?.isSeller || false;

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('jam3a_user', JSON.stringify(user));
      
      // Set the token in the auth service for future API calls
      if (user.id) {
        const token = localStorage.getItem('jam3a_token');
        if (token) {
          authService.setToken(token);
        }
      }
    } else {
      localStorage.removeItem('jam3a_user');
      localStorage.removeItem('jam3a_token');
      authService.clearToken();
    }
  }, [user]);

  // Check token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('jam3a_token') || localStorage.getItem('auth_token');
      if (token && !user) {
        try {
          setIsLoading(true);
          // Set token in auth service
          authService.setToken(token);
          
          // Verify token and get user data
          const userData = await authService.verifyToken();
          
          // Map backend user to frontend user format
          const mappedUser: User = {
            id: userData._id,
            name: userData.name,
            email: userData.email,
            isAdmin: userData.role === 'admin',
            isSeller: userData.role === 'seller',
            roles: [userData.role]
          };
          
          setUser(mappedUser);
        } catch (err) {
          // Token is invalid, clear it
          authService.clearToken();
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    verifyToken();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the auth service login method with properly formatted object
      const response = await authService.login({
        email,
        password
      });
      
      // Save token to localStorage
      localStorage.setItem('jam3a_token', response.token);
      
      // Map backend user to frontend user format
      const userData: User = {
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
        isAdmin: response.user.role === 'admin',
        isSeller: response.user.role === 'seller',
        roles: [response.user.role]
      };
      
      // Ensure roles array exists
      const userWithRoles = {
        ...userData,
        roles: userData.roles || []
      };
      
      // Add role based on properties
      if (userData.isAdmin && !userWithRoles.roles.includes('admin')) {
        userWithRoles.roles.push('admin');
      }
      
      if (userData.isSeller && !userWithRoles.roles.includes('seller')) {
        userWithRoles.roles.push('seller');
      }
      
      setUser(userWithRoles);
      return userWithRoles;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the auth service register method with properly formatted object
      const response = await authService.register({
        name,
        email,
        password,
        passwordConfirmation: password // Since we already validated they match in the form
      });
      
      // Save token to localStorage
      localStorage.setItem('jam3a_token', response.token);
      
      // Map backend user to frontend user format
      const userData: User = {
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
        isAdmin: response.user.role === 'admin',
        isSeller: response.user.role === 'seller',
        roles: [response.user.role]
      };
      
      // Ensure roles array exists
      const userWithRoles = {
        ...userData,
        roles: userData.roles || []
      };
      
      setUser(userWithRoles);
      return userWithRoles;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Call the auth service logout method
      await authService.logout();
      
      // Clear user data and token
      setUser(null);
      localStorage.removeItem('jam3a_token');
      localStorage.removeItem('jam3a_user');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if the API call fails, we still want to clear the local user data
      setUser(null);
      localStorage.removeItem('jam3a_token');
      localStorage.removeItem('jam3a_user');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>): Promise<User> => {
    if (!user) throw new Error('No user logged in');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Map frontend user data to backend format
      const backendUserData = {
        name: userData.name,
        email: userData.email,
        // Other fields as needed
      };
      
      // Call the auth service update user method
      const response = await authService.updateProfile(backendUserData);
      
      // Map backend user to frontend user format
      const updatedUser: User = {
        ...user,
        name: response.name,
        email: response.email,
        // Update other fields as needed
        ...userData
      };
      
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Provide the context value
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register,
      logout, 
      isAdmin, 
      isSeller, 
      hasRole, 
      updateUser,
      isLoading,
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);
