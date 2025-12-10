import React, { useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const API_URL = "https://proyecto-final-back-zeta.vercel.app";

interface GoogleOAuthProps {
  type: 'login' | 'register';
  onSuccess?: (response: any) => void;
}

export default function GoogleOAuth({ type, onSuccess }: GoogleOAuthProps) {
  const [loading, setLoading] = React.useState(false);
  
  // ✅ CORRECCIÓN: Configurar la URI de redirección específica para Android
  const redirectUri = Platform.OS === 'web'
    ? AuthSession.makeRedirectUri({ useProxy: false } as any)
    : AuthSession.makeRedirectUri({ 
        scheme: 'com.antonio4350.ProyectoFinalACV',
      });
    
  // ✅ CORRECCIÓN: Configurar la solicitud de autenticación con clientId específico para Android
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    Platform.OS === 'web'
      ? {
          clientId: "58585220959-fltgp46dkjjrcdo144gqeib2c5tqg58c",
          redirectUri,
          scopes: ['profile', 'email'],
          responseType: 'token',
          extraParams: { prompt: 'select_account' },
          usePKCE: false,
        }
      : {
          // ✅ Android usa este clientId específico
          clientId: "58585220959-8capru7gmaertcnsvoervkm3vsef6q3l",
          redirectUri,
          scopes: ['profile', 'email'],
          responseType: 'id_token',
          // ✅ Añadir 'prompt' también en Android
          extraParams: { 
            nonce: 'random_string',
            prompt: 'select_account'
          },
          usePKCE: false,
        },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  useEffect(() => {
    console.log('Respuesta de Google:', response);
    console.log('Plataforma:', Platform.OS);
    console.log('URI de redirección:', redirectUri);
    
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      console.log('Tokens recibidos:', { 
        has_id_token: !!id_token, 
        has_access_token: !!access_token,
        platform: Platform.OS
      });
      
      if (id_token || access_token) {
        handleGoogleLogin({ 
          idToken: id_token, 
          accessToken: access_token,
          platform: Platform.OS 
        });
      } else {
        console.error('No se recibieron tokens válidos');
      }
    } else if (response?.type === 'error') {
      console.error('Error en OAuth:', response.error);
      console.error('Error details:', response.params);
    }
  }, [response]);

  async function handleGoogleLogin(tokens: any) {
    try {
      setLoading(true);
      console.log('Enviando tokens al backend...', {
        ...tokens,
        timestamp: new Date().toISOString()
      });
      
      const res = await fetch(`${API_URL}/googleLogin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(tokens),
      });

      console.log('Respuesta del servidor status:', res.status);
      
      const data = await res.json();
      console.log('Respuesta del servidor:', data);

      if (data.success) {
        console.log('Login Google exitoso en', Platform.OS);
        
        if (onSuccess && data.user) {
          onSuccess(data);
        }
      } else {
        console.error('Error del servidor:', data.error);
      }
    } catch (e) {
      console.error('Error en handleGoogleLogin:', e);
    } finally {
      setLoading(false);
    }
  }

  const handlePress = async () => {
    try {
      console.log('Iniciando flujo de Google OAuth en', Platform.OS);
      console.log('ClientId usado:', Platform.OS === 'web' 
        ? "58585220959-fltgp46dkjjrcdo144gqeib2c5tqg58c" 
        : "58585220959-8capru7gmaertcnsvoervkm3vsef6q3l");
      
      const result = await promptAsync();
      console.log('Resultado de promptAsync:', result);
    } catch (error) {
      console.error('Error iniciando OAuth:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.googleButton, loading && styles.googleButtonDisabled]}
      onPress={handlePress}
      disabled={!request || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#374151" />
      ) : (
        <Text style={styles.googleButtonText}>
          {type === 'login' ? 'Iniciar sesión con Google' : 'Registrarse con Google'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    width: '100%',
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});