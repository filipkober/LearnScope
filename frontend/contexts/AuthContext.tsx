"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuthToken, removeAuthToken, isAuthenticated as checkAuth } from '@/utils/auth';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  updateUser: (userData: User) => void;
  checkAuthentication: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  logout: () => {},
  updateUser: () => {},
  checkAuthentication: () => Promise.resolve(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const checkAuthentication = useCallback( async () => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);

    if (authStatus) {
      try {
        // Fetch user data if authenticated
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If unable to fetch user data, logout
          handleLogout();
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
  },[]);

  // Check authentication status on initial load
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear tokens regardless of server response
      removeAuthToken();
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to login page
      router.push('/login');
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout: handleLogout, updateUser, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;