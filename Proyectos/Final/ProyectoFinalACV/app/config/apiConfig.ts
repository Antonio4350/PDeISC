/**
 * apiConfig.ts - Configuración dinámica de URL API
 * Detecta automáticamente el entorno y retorna la URL correcta
 * 
 * Casos:
 * 1. DEV LOCAL (localhost): http://localhost:5000
 * 2. DEV MOBILE (LAN): http://192.168.0.151:5000 (configurado en .env.local)
 * 3. PRODUCTION (Vercel): https://tu-api.vercel.app
 */

import Constants from 'expo-constants';

interface ApiConfig {
  apiUrl: string;
  isDevelopment: boolean;
  environment: 'local' | 'lan' | 'production';
}

function getApiConfig(): ApiConfig {
  // Leer variable de entorno pública (EXPO_PUBLIC_API_URL)
  const publicApiUrl = process.env.EXPO_PUBLIC_API_URL;

  // Si está configurada en .env.local o variables de entorno, usarla
  if (publicApiUrl && publicApiUrl.trim()) {
    return {
      apiUrl: publicApiUrl,
      isDevelopment: publicApiUrl.includes('localhost') || publicApiUrl.includes('192.168'),
      environment: publicApiUrl.includes('localhost') ? 'local' : 
                   publicApiUrl.includes('192.168') ? 'lan' : 'production'
    };
  }

  // FALLBACK: Detectar automáticamente en base a debugger
  const debuggerHost = Constants.expoConfig?.hostUri || '';
  
  if (debuggerHost && debuggerHost.includes(':')) {
    // Estamos en desarrollo con Expo
    // Extraer la IP del debuggerHost (ej: "192.168.0.151:19000" → "192.168.0.151")
    const ipFromDebugger = debuggerHost.split(':')[0];
    
    // Si la IP es 127.0.0.1 o localhost, usar localhost
    if (ipFromDebugger === '127.0.0.1' || ipFromDebugger === 'localhost') {
      return {
        apiUrl: 'http://localhost:5000',
        isDevelopment: true,
        environment: 'local'
      };
    }

    // Si hay IP detectada en la LAN, usarla
    if (ipFromDebugger && ipFromDebugger !== 'localhost') {
      return {
        apiUrl: `http://${ipFromDebugger}:5000`,
        isDevelopment: true,
        environment: 'lan'
      };
    }
  }

  // DEFAULT PRODUCTION
  // ⚠️ IMPORTANTE: Reemplaza esto con tu URL de Vercel/hosting cuando hagas deploy
  return {
    apiUrl: process.env.EXPO_PUBLIC_PRODUCTION_API_URL || 'https://api.example.com',
    isDevelopment: false,
    environment: 'production'
  };
}

// Exportar configuración
export const apiConfig = getApiConfig();

// Log para debugging (comentar en producción)
if (__DEV__) {
  console.log('📡 API Config:', {
    url: apiConfig.apiUrl,
    environment: apiConfig.environment,
    isDevelopment: apiConfig.isDevelopment
  });
}

export default apiConfig;
