'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials, AuthActions } from '@/types/auth';

interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthActionType =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthActionType): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// Mock API functions (replace with real API calls)
const authAPI = {
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      return {
        id: '1',
        email: credentials.email,
        name: 'Demo User',
        avatar: '/api/placeholder/40/40',
        isVerified: true,
        subscription: 'premium',
        createdAt: new Date(),
        preferences: {
          theme: 'dark',
          language: 'en',
          audioQuality: 'high',
          autoplay: true,
          crossfade: 2,
        },
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async signup(credentials: SignupCredentials): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.name,
      avatar: '/api/placeholder/40/40',
      isVerified: false,
      subscription: 'free',
      createdAt: new Date(),
      preferences: {
        theme: 'dark',
        language: 'en',
        audioQuality: 'medium',
        autoplay: true,
        crossfade: 0,
      },
    };
  },

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...updates };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  async getCurrentUser(): Promise<User | null> {
    // Simulate checking stored session
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('user');
      }
    }
    
    return null;
  },
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const user = await authAPI.login(credentials);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const user = await authAPI.signup(credentials);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Signup failed' 
      });
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await authAPI.logout();
      localStorage.removeItem('user');
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const updatedUser = await authAPI.updateProfile(updates);
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Update failed' 
      });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}