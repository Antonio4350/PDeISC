// app/config/apiConfig.ts - VERSIÓN SIMPLIFICADA
import Constants from 'expo-constants';

interface ApiConfig {
  apiUrl: string;
  isDevelopment: boolean;
  environment: 'local' | 'lan' | 'production';
}

function getApiConfig(): ApiConfig {
  // URL DE PRODUCCIÓN - REEMPLAZA ESTO CON TU URL REAL DE VERCEL
  const PRODUCTION_URL = 'https://proyectofinalacv-backend.vercel.app';
  
  // 1. Si hay variable de entorno, usarla (configurada en Vercel)
  const publicApiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (publicApiUrl && publicApiUrl.trim() && publicApiUrl !== 'undefined') {
    return {
      apiUrl: publicApiUrl,
      isDevelopment: publicApiUrl.includes('localhost') || publicApiUrl.includes('192.168'),
      environment: publicApiUrl.includes('localhost') ? 'local' : 
                   publicApiUrl.includes('192.168') ? 'lan' : 'production'
    };
  }
  
  // 2. Si estamos en desarrollo web local (localhost:8081, etc)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname.includes('192.168')) {
      return {
        apiUrl: 'https://proyectofinalacv-backend.vercel.app',
        isDevelopment: true,
        environment: 'local'
      };
    }
  }
  
  // 3. Si estamos en desarrollo con Expo Go
  const debuggerHost = Constants.expoConfig?.hostUri || '';
  
  if (__DEV__ && debuggerHost && debuggerHost.includes(':')) {
    const ipFromDebugger = debuggerHost.split(':')[0];
    
    if (ipFromDebugger === '127.0.0.1' || ipFromDebugger === 'localhost') {
      return {
        apiUrl: 'https://proyectofinalacv-backend.vercel.app',
        isDevelopment: true,
        environment: 'local'
      };
    }

    if (ipFromDebugger && ipFromDebugger !== 'localhost') {
      return {
        apiUrl: `http://${ipFromDebugger}:5000`,
        isDevelopment: true,
        environment: 'lan'
      };
    }
  }
  
  // 4. DEFAULT: PRODUCCIÓN
  return {
    apiUrl: PRODUCTION_URL,
    isDevelopment: false,
    environment: 'production'
  };
}

export const apiConfig = getApiConfig();

// Log solo en desarrollo
if (__DEV__) {
  console.log('📡 API Config:', apiConfig);
}

export default apiConfig;