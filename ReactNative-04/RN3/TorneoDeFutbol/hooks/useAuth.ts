import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ...existing code...

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  token?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from AsyncStorage on mount
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        // Ignore storage errors
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password,
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setError(null);
    await AsyncStorage.removeItem('user');
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, error, login, logout, setUser } },
    children
  );
};
