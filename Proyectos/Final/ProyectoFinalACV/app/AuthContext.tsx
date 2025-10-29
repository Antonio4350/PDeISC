import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  rol?: string;
  avatar_url?: string;
  telefono?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Guardar usuario en AsyncStorage
  const saveUserToStorage = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  };

  // Remover usuario de AsyncStorage
  const removeUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removiendo usuario:', error);
    }
  };

  // Cargar usuario desde AsyncStorage
  const loadUserFromStorage = async (): Promise<User | null> => {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error cargando usuario:', error);
      return null;
    }
  };

  // Login
  const login = async (userData: User) => {
    setUser(userData);
    await saveUserToStorage(userData);
  };

  // Logout
  const logout = async () => {
    setUser(null);
    await removeUserFromStorage();
  };

  // Verificar autenticación al iniciar la app
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const savedUser = await loadUserFromStorage();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};