import UserData from '@/components/userdata';
import UserDataFull from '@/components/userdatafull';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const [tipo, setTipo] = useState(false);
  const router = useRouter();

  const redirectUri = Platform.OS === 'web'
    ? AuthSession.makeRedirectUri({ useProxy: false } as any)
    : AuthSession.makeRedirectUri({ useProxy: true } as any);
    
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
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      if (id_token || access_token) {
        handleGoogleLogin({ idToken: id_token, accessToken: access_token });
      }
    }
  }, [response]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') localStorage.clear();
      else await SecureStore.deleteItemAsync('oldmail');
    })();
  }, []);

  async function handleGoogleLogin(tokens: any) {
    try {
      const res = await fetch('http://192.168.1.38:3031/googleLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokens),
      });

      const data = await res.json();

      if (data.success) {
        if (Platform.OS === 'web') localStorage.setItem('oldmail', data.mail);
        else await SecureStore.setItemAsync('oldmail', data.mail);
        router.push('/profile');
      } else {
        console.log('Error al iniciar sesión con Google:', data.error);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function inicio(formData: FormData): Promise<number> {
    try {
      const response = await fetch('http://192.168.1.38:3031/getUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mail: formData.get('mail'),
          password: formData.get('password')
        }),
      });

      if (!response.ok) {
        console.error('Error HTTP:', response.status);
        return 4;
      }

      const text = await response.text();
      console.log('Respuesta raw:', text);

      if (!text) {
        console.error('Respuesta vacía del servidor');
        return 4;
      }

      const data = JSON.parse(text);
      console.log('Datos parseados:', data);

      if (data == 1) {
        if (Platform.OS === 'web') localStorage.setItem('oldmail', formData.get('mail') as string);
        else await SecureStore.setItemAsync('oldmail', formData.get('mail') as string);
        router.push("/profile");
      }
      return data as number;
    } catch (error) {
      console.error('Error en inicio:', error);
      return 4;
    }
  }

  async function registro(formData: FormData): Promise<number> {
    try {
      console.log('Enviando datos de registro...');

      const response = await fetch('http://192.168.1.38:3031/addUsuario', {
        method: 'POST',
        body: formData,
      });

      console.log('Estado de respuesta:', response.status, response.statusText);

      if (!response.ok) {
        console.error('Error HTTP en registro:', response.status);
        return 4;
      }

      const responseText = await response.text();
      console.log('Respuesta raw del servidor:', responseText);

      if (!responseText || responseText.trim() === '') {
        console.error('Respuesta vacía del servidor');
        return 4;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        console.error('Contenido recibido:', responseText);
        return 4;
      }

      console.log('Datos parseados:', data);

      if (data == 0) {
        const email = formData.get('mail') as string;
        if (Platform.OS === 'web') {
          localStorage.setItem('oldmail', email);
        } else {
          await SecureStore.setItemAsync('oldmail', email);
        }
        router.push("/profile");
      }
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      return 4;
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeTitle}>Bienvenido a la Plataforma</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{tipo ? 'Registro' : 'Iniciar Sesión'}</Text>
            <Switch
              onValueChange={setTipo}
              value={tipo}
              trackColor={{ false: '#E0AAFF', true: '#9D4EDD' }}
              thumbColor={tipo ? '#7B2CBF' : '#7B2CBF'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>

        {tipo ? (
          <UserDataFull sendData={registro} inputData={new FormData()} />
        ) : (
          <UserData sendData={inicio} />
        )}

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>o continuar con</Text>
          <View style={styles.divider} />
        </View>

        <Pressable
          onPress={() => promptAsync()}
          disabled={!request}
          style={styles.googleButton}
        >
          <Image
            style={styles.googleIcon}
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png' }}
          />
          <Text style={styles.googleText}>Google</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B2CBF',
    textAlign: 'center',
    marginVertical: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E0AAFF',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B2CBF',
    marginRight: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0AAFF',
  },
  dividerText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0AAFF',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
  },
});