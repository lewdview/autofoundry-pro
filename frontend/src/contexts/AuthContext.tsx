import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_started';
  accountType: 'trial' | 'basic' | 'professional' | 'enterprise';
  credits: number;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  documents?: {
    id: string;
    type: 'drivers_license' | 'passport' | 'utility_bill' | 'bank_statement';
    status: 'pending' | 'approved' | 'rejected';
    uploadedAt: string;
  }[];
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  startKYC: () => Promise<boolean>;
  uploadDocument: (file: File, type: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token and get user data
          const userData = await validateToken(token);
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock API call - replace with actual backend call
      const response = await mockLogin(email, password);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock API call - replace with actual backend call
      const response = await mockSignup(userData);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // Mock API call - replace with actual backend call
      const response = await mockUpdateUser(userData);
      
      if (response.success && user) {
        setUser({ ...user, ...userData });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const startKYC = async (): Promise<boolean> => {
    try {
      // Mock API call to start KYC process
      const response = await mockStartKYC();
      
      if (response.success && user) {
        setUser({ ...user, kycStatus: 'pending' });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Start KYC error:', error);
      return false;
    }
  };

  const uploadDocument = async (file: File, type: string): Promise<boolean> => {
    try {
      // Mock API call to upload KYC document
      const response = await mockUploadDocument(file, type);
      
      if (response.success && user) {
        const newDocument = {
          id: Math.random().toString(36).substr(2, 9),
          type: type as any,
          status: 'pending' as const,
          uploadedAt: new Date().toISOString()
        };
        
        setUser({
          ...user,
          documents: [...(user.documents || []), newDocument]
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Upload document error:', error);
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (user) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await validateToken(token);
          if (userData) {
            setUser(userData);
          }
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    startKYC,
    uploadDocument,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API functions - replace with actual backend calls
async function mockLogin(email: string, password: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login
  return {
    success: true,
    token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
    user: {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      businessName: 'AutoFoundry Test Business',
      isVerified: false,
      kycStatus: 'not_started',
      accountType: 'trial',
      credits: 50,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    } as User
  };
}

async function mockSignup(userData: SignupData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
    user: {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      businessName: userData.businessName,
      isVerified: false,
      kycStatus: 'not_started',
      accountType: 'trial',
      credits: 50,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    } as User
  };
}

async function validateToken(token: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock token validation
  return {
    id: '1',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    businessName: 'AutoFoundry Test Business',
    isVerified: false,
    kycStatus: 'not_started',
    accountType: 'trial',
    credits: 50,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  } as User;
}

async function mockUpdateUser(userData: Partial<User>) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

async function mockStartKYC() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

async function mockUploadDocument(file: File, type: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}
