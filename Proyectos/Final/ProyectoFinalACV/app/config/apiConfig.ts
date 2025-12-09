import Constants from 'expo-constants';

interface ApiConfig {
  apiUrl: string;
  isDevelopment: boolean;
  environment: 'development' | 'production';
}

function getApiConfig(): ApiConfig {
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  console.log('EXPO_PUBLIC_API_URL desde .env:', envApiUrl);
  
  let finalUrl = envApiUrl || '';
  
  if (finalUrl.endsWith('/')) {
    finalUrl = finalUrl.slice(0, -1);
  }
  if (!finalUrl || finalUrl.includes('undefined') || 
      (finalUrl.includes('localhost') && __DEV__)) {
    console.warn('Usando backend de Vercel como fallback');
    finalUrl = 'https://proyecto-final-back-zeta.vercel.app';
  }
  
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
console.log('API Config:', {
  url: apiConfig.apiUrl,
  isDevelopment: apiConfig.isDevelopment,
  environment: apiConfig.environment,
  mode: __DEV__ ? 'development' : 'production'
});

export default apiConfig;