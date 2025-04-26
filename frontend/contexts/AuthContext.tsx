'use client';

import { createContext, useState, useContext, useEffect, ReactNode, JSX } from 'react';
import { 
  getAuthToken, 
  isAuthenticated as checkIsAuthenticated 
} from '@/utils/auth';

// Define user type
interface User {
  Username: string;
  Email: string;
}

// Define auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshAuthState: () => Promise<void>;
}

// Default context values
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  logout: () => {},
  refreshAuthState: async () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Function to logout user
  const logout = (): void => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Function to refresh authentication state
  const refreshAuthState = async (): Promise<void> => {
    setLoading(true);
    
    const authenticated = checkIsAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      try {
        // Fetch user profile data
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        });

        if (response.ok) {
          const userData = await response.json() as User;
          setUser(userData);
        } else {
          // If token is invalid, logout
          logout();
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }

    setLoading(false);
  };

  // Check authentication status on mount
  useEffect(() => {
    refreshAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      logout,
      refreshAuthState,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => useContext(AuthContext);