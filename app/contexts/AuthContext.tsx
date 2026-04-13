/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axiosClient';

interface User {
  username: string;
  email?: string;
  id?: number | string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isVerifying = useRef(false);

  const login = React.useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password,
      });

      if (response.data && response.data.data && response.data.data.token) {
        const { token } = response.data.data;

        // Save token
        localStorage.setItem('auth_token', token);

        // Fetch user info immediately after login
        const userResponse = await api.get('/api/auth/me');
        const userData = userResponse.data.data;

        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (isVerifying.current) return;
      isVerifying.current = true;

      const parseJwt = (token: string) => {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join(''),
          );
          return JSON.parse(jsonPayload);
        } catch (e) {
          return null;
        }
      };

      try {
        // 1. Check for token in URL parameters (iframe use case)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');

        if (urlToken) {
          const payload = parseJwt(urlToken);
          const currentTime = Math.floor(Date.now() / 1000);

          // Validation requirements: non-expired only
          if (payload && payload.exp && payload.exp > currentTime) {
            console.log('Valid URL token found, performing automatic demo login');
            const success = await login('demo', 'demo1234');
            
            if (success) {
              // Clean URL to prevent re-triggering and keep address bar clean
              const url = new URL(window.location.href);
              url.searchParams.delete('token');
              window.history.replaceState({}, '', url.pathname + url.search);
              
              setIsLoading(false);
              isVerifying.current = false;
              return; // Stop further verification as we are now logged in
            }
          } else {
            console.warn('Invalid or expired URL token');
            // Remove potential bad token from storage if it matches
            if (localStorage.getItem('auth_token') === urlToken) {
              localStorage.removeItem('auth_token');
            }
          }
        }

        // 2. Fallback to localStorage (standard flow)
        const storedToken = localStorage.getItem('auth_token');
        const tokenToVerify = storedToken;

        if (tokenToVerify && !user) {
          try {
            const response = await api.get('/api/auth/me');
            if (response.data && response.data.data) {
              setUser(response.data.data);
              localStorage.setItem('auth_user', JSON.stringify(response.data.data));
            } else {
              throw new Error('Invalid user data');
            }
          } catch (e) {
            console.error('Failed to verify token', e);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error during token verification process', err);
      } finally {
        setIsLoading(false);
        isVerifying.current = false;
      }
    };

    verifyToken();
  }, [login, user]);


  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
