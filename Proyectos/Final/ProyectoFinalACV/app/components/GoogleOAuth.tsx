import React from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { StyleSheet } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const API_URL = "http://192.168.1.38:5000";

const GOOGLE_ANDROID_CLIENT_ID = "58585220959-8capru7gmaertcnsvoervkm3vsef6q3l.apps.googleusercontent.com";

const GOOGLE_WEB_CLIENT_ID = "58585220959-8capru7gmaertcnsvoervkm3vsef6q3l.apps.googleusercontent.com"; // Mismo por ahora

interface GoogleOAuthProps {
  type: 'login' | 'register';
  onSuccess?: (response: any) => void;
}

export default function GoogleOAuth({ type, onSuccess }: GoogleOAuthProps) {
  const [loading, setLoading] = React.useState(false);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Platform.select({
      android: GOOGLE_ANDROID_CLIENT_ID,
      ios: GOOGLE_ANDROID_CLIENT_ID, // Usar el mismo temporalmente
      default: GOOGLE_ANDROID_CLIENT_ID
    }),
    redirectUri: makeRedirectUri({
      scheme: 'exp',
      path: 'oauth'
    }),
    scopes: ['openid', 'profile', 'email'],
  });

  React.useEffect(() => {
    console.log('🔍 Google Auth Response:', response);
    console.log('🔍 Platform:', Platform.OS);
    console.log('🔍 Redirect URI:', makeRedirectUri({ 
      scheme: 'exp', 
      path: 'oauth'
    }));
    
    handleResponse();
  }, [response]);

  const handleResponse = async () => {
    if (response?.type === "success") {
      setLoading(true);
      try {
        const { authentication } = response;
        console.log('🔍 Authentication data:', authentication);
        
        if (authentication?.accessToken) {
          await handleGoogleAuth(authentication.accessToken);
        } else {
          Alert.alert("Error", "No se pudo obtener el token de acceso");
        }
      } catch (error) {
        console.error("Error manejando respuesta:", error);
        Alert.alert("Error", "Ocurrió un error inesperado");
      } finally {
        setLoading(false);
      }
    } else if (response?.type === "error") {
      console.error("Error en Google OAuth:", response.error);
      Alert.alert("Error", `Autenticación fallida: ${response.error?.message || 'Error desconocido'}`);
    }
  };

  const handleGoogleAuth = async (accessToken: string) => {
    try {
      console.log("Enviando token al servidor...");
      
      const res = await fetch(`${API_URL}/googleLogin`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          accessToken,
          type: type
        }),
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (data.success && data.user) {
        Alert.alert("Éxito", `${type === 'login' ? 'Login' : 'Registro'} con Google exitoso!`);
        
        if (onSuccess) {
          onSuccess(data);
        }
        
      } else {
        const errorMsg = data.error || `Error al ${type === 'login' ? 'iniciar sesión' : 'registrarse'} con Google`;
        Alert.alert("Error", errorMsg);
      }
    } catch (err) {
      console.error("Error en handleGoogleAuth:", err);
      Alert.alert("Error", "Error de conexión con el servidor");
    }
  };

  const handlePress = async () => {
    try {
      console.log('🔍 Iniciando OAuth flow...');
      const result = await promptAsync();
      console.log('🔍 Prompt result:', result);
    } catch (error) {
      console.error("Error iniciando OAuth:", error);
      Alert.alert("Error", "No se pudo iniciar la autenticación con Google");
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