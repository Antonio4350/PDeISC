import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import { StyleSheet } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const API_URL = "http://192.168.1.35:5000"; // Cambiar por tu IP local si es necesario

interface GoogleOAuthProps {
  type: 'login' | 'register';
  onSuccess?: (email: string) => void;
}

export default function GoogleOAuth({ type, onSuccess }: GoogleOAuthProps) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com",
    redirectUri: makeRedirectUri(),
    useProxy: true,
    responseType: ResponseType.Token,
    scopes: ['profile', 'email'],
  } as any);

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token, access_token } = response.params;
      
      if (id_token || access_token) {
        handleGoogleAuth({ idToken: id_token, accessToken: access_token });
      }
      
    } else if (response?.type === "error") {
      Alert.alert("Error", "Autenticación con Google cancelada o fallida.");
      console.error("Error en respuesta de Google:", response);
    }
  }, [response]);

  const handleGoogleAuth = async (tokens: any) => {
    try {
      const res = await fetch(`${API_URL}/googleLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tokens),
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Éxito", `${type === 'login' ? 'Login' : 'Registro'} con Google exitoso!`);
        
        if (onSuccess) {
          onSuccess(data.mail);
        }
        
      } else {
        Alert.alert("Error", data.error || `Error al ${type === 'login' ? 'iniciar sesión' : 'registrarse'} con Google`);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error de conexión con el servidor");
    }
  };

  return (
    <TouchableOpacity 
      style={styles.googleButton}
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <Text style={styles.googleButtonText}>
        {type === 'login' ? 'Iniciar sesión con Google' : 'Registrarse con Google'}
      </Text>
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
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});