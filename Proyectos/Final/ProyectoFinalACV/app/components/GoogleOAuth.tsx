import React, { useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const API_URL = "https://proyectofinalacv-backend.vercel.app";

interface GoogleOAuthProps {
  type: 'login' | 'register';
  onSuccess?: (response: any) => void;
}

export default function GoogleOAuth({ type, onSuccess }: GoogleOAuthProps) {
  const [loading, setLoading] = React.useState(false);
  
  // Configurar la URI de redirección
  const redirectUri = Platform.OS === 'web'
    ? AuthSession.makeRedirectUri({ useProxy: false } as any)
    : AuthSession.makeRedirectUri({ useProxy: true } as any);
    
  // Configurar la solicitud de autenticación (igual que en el proyecto que funciona)
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
          clientId: "58585220959-fltgp46dkjjrcdo144gqeib2c5tqg58c",
          redirectUri,
          scopes: ['profile', 'email'],
          responseType: 'id_token',
          extraParams: { nonce: 'random_string' },
          usePKCE: false,
        },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  useEffect(() => {
    console.log('🔍 Respuesta de Google:', response);
    
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      console.log('🔍 Tokens recibidos:', { 
        has_id_token: !!id_token, 
        has_access_token: !!access_token 
      });
      
      if (id_token || access_token) {
        handleGoogleLogin({ idToken: id_token, accessToken: access_token });
      }
    }
  }, [response]);

  async function handleGoogleLogin(tokens: any) {
    try {
      setLoading(true);
      console.log('🔍 Enviando tokens al backend...', tokens);
      
      const res = await fetch(`${API_URL}/googleLogin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(tokens),
      });

      console.log('🔍 Respuesta del servidor status:', res.status);
      
      const data = await res.json();
      console.log('🔍 Respuesta del servidor:', data);

      if (data.success) {
        console.log('✅ Login Google exitoso');
        
        if (onSuccess && data.user) {
          onSuccess(data);
        }
      } else {
        console.error('❌ Error del servidor:', data.error);
      }
    } catch (e) {
      console.error('❌ Error en handleGoogleLogin:', e);
    } finally {
      setLoading(false);
    }
  }

  const handlePress = async () => {
    try {
      console.log('🔍 Iniciando flujo de Google OAuth...');
      await promptAsync();
    } catch (error) {
      console.error('❌ Error iniciando OAuth:', error);
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