// app/utils/storage.ts - FUNCIONES UNIVERSALES PARA WEB Y MOBILE
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ✅ Función universal para obtener token (Web y Mobile)
export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Web: localStorage
      return localStorage.getItem('token');
    } else {
      // Mobile: AsyncStorage
      return await AsyncStorage.getItem('token');
    }
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    return null;
  }
};

// ✅ Función universal para guardar token
export const setToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Web: localStorage
      localStorage.setItem('token', token);
    } else {
      // Mobile: AsyncStorage
      await AsyncStorage.setItem('token', token);
    }
  } catch (error) {
    console.error('❌ Error guardando token:', error);
  }
};

// ✅ Función universal para eliminar token
export const removeToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Web: localStorage
      localStorage.removeItem('token');
    } else {
      // Mobile: AsyncStorage
      await AsyncStorage.removeItem('token');
    }
  } catch (error) {
    console.error('❌ Error eliminando token:', error);
  }
};

// ✅ Función para obtener cualquier item
export const getItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.error(`❌ Error obteniendo ${key}:`, error);
    return null;
  }
};

// ✅ Función para guardar cualquier item
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`❌ Error guardando ${key}:`, error);
  }
};

// ✅ Función para eliminar cualquier item
export const removeItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`❌ Error eliminando ${key}:`, error);
  }
};

// ✅ Función para limpiar todo el almacenamiento
export const clearStorage = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.clear();
    } else {
      await AsyncStorage.clear();
    }
  } catch (error) {
    console.error('❌ Error limpiando almacenamiento:', error);
  }
};