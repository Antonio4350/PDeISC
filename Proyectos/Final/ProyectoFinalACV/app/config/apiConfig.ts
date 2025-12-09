// app/config/apiConfig.ts - VERSIÓN OPTIMIZADA PARA TUS .env
import Constants from 'expo-constants';

interface ApiConfig {
  apiUrl: string;
  isDevelopment: boolean;
  environment: 'local' | 'production';
}

function getApiConfig(): ApiConfig {
  // 1. PRIMERO: Usar la variable de entorno (Expo la carga automáticamente)
  // Expo automáticamente carga .env.local en desarrollo y .env.production en producción
  const publicApiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  console.log('🔍 EXPO_PUBLIC_API_URL desde .env:', publicApiUrl);
  
  // Verificar que la URL sea válida
  if (!publicApiUrl || publicApiUrl === 'undefined' || publicApiUrl.trim() === '') {
    console.warn('⚠️ EXPO_PUBLIC_API_URL no está definida, usando fallback');
    
    // Fallback para desarrollo
    if (__DEV__) {
      return {
        apiUrl: 'http://localhost:5000',
        isDevelopment: true,
        environment: 'local'
      };
    }
    
    // Fallback para producción
    return {
      apiUrl: 'https://proyecto-final-back-zeta.vercel.app',
      isDevelopment: false,
      environment: 'production'
    };
  }
  
  // Determinar si es desarrollo o producción basado en la URL
  const isDev = publicApiUrl.includes('localhost') || publicApiUrl.includes('192.168');
  
  return {
    apiUrl: publicApiUrl,
    isDevelopment: isDev,
    environment: isDev ? 'local' : 'production'
  };
}

export const apiConfig = getApiConfig();

// Log para debugging (solo en desarrollo)
if (__DEV__) {
  console.log('📡 API Config cargada:', {
    url: apiConfig.apiUrl,
    source: 'process.env.EXPO_PUBLIC_API_URL',
    isDevelopment: apiConfig.isDevelopment,
    environment: apiConfig.environment
  });
}

export default apiConfig;