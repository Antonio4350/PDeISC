import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './services/api';

export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  rol?: string;
  avatar_url?: string;
  telefono?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Guardar usuario en AsyncStorage
  const saveUserToStorage = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        await AsyncStorage.setItem('token', userData.token);
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  };

  // Remover usuario de AsyncStorage
  const removeUserFromStorage = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'token']);
      console.log('✅ Usuario y token removidos de AsyncStorage');
    } catch (error) {
      console.error('Error removiendo usuario:', error);
    }
  };

  // Cargar usuario desde AsyncStorage
  const loadUserFromStorage = async (): Promise<User | null> => {
    try {
      const [userString, token] = await AsyncStorage.multiGet(['user', 'token']);
      const userData = userString[1] ? JSON.parse(userString[1]) : null;
      
      if (userData && token[1]) {
        userData.token = token[1];
      }
      
      return userData;
    } catch (error) {
      console.error('Error cargando usuario:', error);
      return null;
    }
  };

  // Verificar si es admin/moderator
  const isAdmin = (): boolean => {
    return user?.rol === 'admin' || user?.rol === 'moderator';
  };

  // Login mejorado
  const login = async (userData: User, token?: string) => {
    console.log('🔐 Iniciando login...', userData.email);
    
    const userWithToken = {
      ...userData,
      token: token || userData.token
    };
    
    setUser(userWithToken);
    setIsAuthenticated(true);
    await saveUserToStorage(userWithToken);
    console.log(`✅ Usuario ${userData.email} logueado correctamente`);
  };

  // Logout
  const logout = async (): Promise<void> => {
    return new Promise(async (resolve) => {
      console.log('🚪 Iniciando logout...');
      
      try {
        // 1. Limpiar AsyncStorage primero
        await removeUserFromStorage();
        
        // 2. Resetear estado de React
        setUser(null);
        setIsAuthenticated(false);
        
        console.log('✅ Logout completado - Estado limpiado');
        resolve();
      } catch (error) {
        console.error('❌ Error en logout:', error);
        // Forzar reset del estado incluso si hay error
        setUser(null);
        setIsAuthenticated(false);
        resolve();
      }
    });
  };

  // Verificar autenticación al iniciar la app
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const savedUser = await loadUserFromStorage();
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
        console.log(`✅ Sesión recuperada: ${savedUser.email}`);
      } else {
        console.log('🔍 No hay sesión guardada');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;