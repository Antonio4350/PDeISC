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
  authChecked: boolean; // NUEVO: para saber cuando ya se verificó la autenticación
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // NUEVO

  // Guardar usuario en storage (AMBOS: AsyncStorage y localStorage)
  const saveUserToStorage = async (userData: User) => {
    try {
      // Para React Native/AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        await AsyncStorage.setItem('token', userData.token);
      }
      
      // Para web - localStorage (IMPORTANTE PARA QUE FUNCIONE EN WEB)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) {
          localStorage.setItem('token', userData.token);
        }
        console.log('Token guardado en localStorage para web');
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  };

  // Remover usuario de storage (AMBOS)
  const removeUserFromStorage = async () => {
    try {
      // AsyncStorage
      await AsyncStorage.multiRemove(['user', 'token']);
      
      // localStorage (web)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      
      console.log('Usuario y token removidos de storage');
    } catch (error) {
      console.error('Error removiendo usuario:', error);
    }
  };

  // Cargar usuario desde storage (PRIMERO localStorage, LUEGO AsyncStorage)
  const loadUserFromStorage = async (): Promise<User | null> => {
    try {
      let userString: string | null = null;
      let token: string | null = null;
      
      // PRIMERO: Intentar localStorage (para web)
      if (typeof window !== 'undefined') {
        userString = localStorage.getItem('user');
        token = localStorage.getItem('token');
        if (userString && token) {
          console.log('Usuario cargado desde localStorage (web)');
          const userData = JSON.parse(userString);
          userData.token = token;
          return userData;
        }
      }
      
      // SEGUNDO: Intentar AsyncStorage (para móvil)
      const [asyncUser, asyncToken] = await AsyncStorage.multiGet(['user', 'token']);
      userString = asyncUser[1];
      token = asyncToken[1];
      
      if (userString && token) {
        console.log('📱 Usuario cargado desde AsyncStorage (móvil)');
        const userData = JSON.parse(userString);
        userData.token = token;
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error('Error cargando usuario:', error);
      return null;
    }
  };

  // Verificar si es admin/moderator
  const isAdmin = (): boolean => {
    if (!user) return false;
    return user.rol === 'admin' || user.rol === 'moderator' || user.rol === 'administrador';
  };

  // Login
  const login = async (userData: User, token?: string) => {
    console.log('Iniciando login...', userData.email);
    
    const userWithToken = {
      ...userData,
      token: token || userData.token
    };
    
    setUser(userWithToken);
    setIsAuthenticated(true);
    setAuthChecked(true); // Marcar como verificado
    await saveUserToStorage(userWithToken);
    console.log(`Usuario ${userData.email} logueado correctamente`);
  };

  // Logout
  const logout = async (): Promise<void> => {
    console.log('Iniciando logout...');
    
    try {
      // 1. Limpiar storage
      await removeUserFromStorage();
      
      // 2. Resetear estado
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true); // Marcar como verificado
      
      console.log('Logout completado');
    } catch (error) {
      console.error('Error en logout:', error);
      // Forzar reset del estado
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  // Verificar autenticación al iniciar la app
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log('Verificando autenticación...');
      const savedUser = await loadUserFromStorage();
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
        console.log(`Sesión recuperada: ${savedUser.email}`);
      } else {
        console.log('No hay sesión guardada');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      setAuthChecked(true); // IMPORTANTE: marcar que ya se verificó
      console.log('Verificación de autenticación completada');
    }
  };

  // Efecto para verificar autenticación al montar
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
    isAdmin,
    authChecked // NUEVO: exponer este estado
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;