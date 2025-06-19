export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
  subscription?: 'free' | 'premium' | 'family';
  createdAt: Date;
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    audioQuality: 'low' | 'medium' | 'high' | 'lossless';
    autoplay: boolean;
    crossfade: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}