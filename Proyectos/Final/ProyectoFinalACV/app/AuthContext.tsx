// app/AuthContext.tsx - VERSIÓN SIMPLE QUE FUNCIONA
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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
  authChecked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // ✅ Función universal para guardar en storage
  const saveUserToStorage = async (userData: User) => {
    try {
      const userString = JSON.stringify(userData);
      const token = userData.token || '';
      
      // Guardar en ambos storages para asegurar compatibilidad
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Web: localStorage
        localStorage.setItem('user', userString);
        if (token) {
          localStorage.setItem('token', token);
        }
      }
      
      // Mobile: AsyncStorage (siempre lo guardamos por si acaso)
      try {
        await AsyncStorage.setItem('user', userString);
        if (token) {
          await AsyncStorage.setItem('token', token);
        }
      } catch (asyncError) {
        console.log('⚠️ No se pudo guardar en AsyncStorage (probablemente web)');
      }
      
      console.log(`✅ Usuario guardado: ${userData.email}`);
    } catch (error) {
      console.error('❌ Error guardando usuario:', error);
    }
  };

  // ✅ Función universal para remover del storage
  const removeUserFromStorage = async () => {
    try {
      // Limpiar localStorage (web)
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      
      // Limpiar AsyncStorage (mobile)
      try {
        await AsyncStorage.multiRemove(['user', 'token']);
      } catch (asyncError) {
        console.log('⚠️ No se pudo limpiar AsyncStorage (probablemente web)');
      }
      
      console.log('✅ Storage limpiado');
    } catch (error) {
      console.error('❌ Error limpiando storage:', error);
    }
  };

  // ✅ Función universal para cargar usuario
  const loadUserFromStorage = async (): Promise<User | null> => {
    try {
      let userString: string | null = null;
      let token: string | null = null;
      
      // 1. PRIMERO intentar según la plataforma actual
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Estamos en web, usar localStorage
        userString = localStorage.getItem('user');
        token = localStorage.getItem('token');
        console.log('🌐 Intentando cargar desde localStorage (web)');
      } else {
        // Estamos en mobile, usar AsyncStorage
        try {
          const [asyncUser, asyncToken] = await AsyncStorage.multiGet(['user', 'token']);
          userString = asyncUser[1];
          token = asyncToken[1];
          console.log('📱 Intentando cargar desde AsyncStorage (mobile)');
        } catch (asyncError) {
          console.log('⚠️ Error con AsyncStorage, intentando localStorage');
          // Fallback a localStorage si estamos en web pero Platform.OS no detectó bien
          if (typeof window !== 'undefined') {
            userString = localStorage.getItem('user');
            token = localStorage.getItem('token');
          }
        }
      }
      
      // 2. Verificar si tenemos datos
      if (!userString || !token) {
        console.log('⚠️ No hay usuario o token guardados');
        return null;
      }
      
      // 3. Parsear y retornar usuario
      const userData = JSON.parse(userString);
      userData.token = token;
      
      console.log(`✅ Usuario cargado: ${userData.email}`);
      return userData;
      
    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
      return null;
    }
  };

  // ✅ Verificar si es admin/moderator
  const isAdmin = (): boolean => {
    if (!user) return false;
    const userRole = user.rol?.toLowerCase() || '';
    return userRole === 'admin' || userRole === 'moderator' || userRole === 'administrador';
  };

  // ✅ Login
  const login = async (userData: User, token?: string) => {
    console.log(`🔑 Iniciando login para: ${userData.email}`);
    
    const userWithToken = {
      ...userData,
      token: token || userData.token || ''
    };
    
    // Actualizar estado
    setUser(userWithToken);
    setIsAuthenticated(true);
    setAuthChecked(true);
    
    // Guardar en storage
    await saveUserToStorage(userWithToken);
    
    console.log(`✅ Usuario ${userData.email} logueado correctamente`);
  };

  // ✅ Logout
  const logout = async (): Promise<void> => {
    console.log('🚪 Iniciando logout...');
    
    try {
      // Limpiar storage
      await removeUserFromStorage();
      
      // Resetear estado
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
      
      console.log('✅ Logout completado');
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Forzar reset del estado
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  // ✅ Verificar autenticación
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Verificando autenticación...');
      
      const savedUser = await loadUserFromStorage();
      
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
        console.log(`✅ Sesión recuperada: ${savedUser.email}`);
      } else {
        console.log('⚠️ No hay sesión activa');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
      console.log('✅ Verificación completada');
    }
  };

  // ✅ Efecto para verificar al iniciar
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
    authChecked
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;