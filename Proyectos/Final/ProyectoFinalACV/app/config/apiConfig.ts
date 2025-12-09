// app/config/apiConfig.ts - VERSIÓN MEJORADA
import Constants from 'expo-constants';

interface ApiConfig {
  apiUrl: string;
  isDevelopment: boolean;
  environment: 'development' | 'production';
}

function getApiConfig(): ApiConfig {
  // 1. Obtener URL de las variables de entorno
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  console.log('🔍 EXPO_PUBLIC_API_URL desde .env:', envApiUrl);
  
  // 2. VALIDACIÓN ROBUSTA
  // Si la URL es localhost pero estamos corriendo en producción (ej: Vercel deployment)
  // o si la URL está vacía/undefined, usar el backend de Vercel
  let finalUrl = envApiUrl || '';
  
  // Limpiar la URL (quitar barra final si existe)
  if (finalUrl.endsWith('/')) {
    finalUrl = finalUrl.slice(0, -1);
  }
  
  // DECISIÓN INTELIGENTE:
  // - Si estamos en __DEV__ (modo desarrollo de Expo) PERO la URL es localhost
  //   y queremos conectar al backend de Vercel, forzar la URL de Vercel
  // - O si la URL está vacía, usar Vercel
  if (!finalUrl || finalUrl.includes('undefined') || 
      (finalUrl.includes('localhost') && __DEV__)) {
    console.warn('⚠️ Usando backend de Vercel como fallback');
    finalUrl = 'https://proyecto-final-back-zeta.vercel.app';
  }
  
  // Determinar ambiente
  const isDevelopment = finalUrl.includes('localhost') || 
                       finalUrl.includes('192.168') || 
                       __DEV__;
  
  return {
    apiUrl: finalUrl,
    isDevelopment,
    environment: isDevelopment ? 'development' : 'production'
  };
}

export const apiConfig = getApiConfig();

// Log para debugging
console.log('📡 API Config:', {
  url: apiConfig.apiUrl,
  isDevelopment: apiConfig.isDevelopment,
  environment: apiConfig.environment,
  mode: __DEV__ ? 'development' : 'production'
});

export default apiConfig;