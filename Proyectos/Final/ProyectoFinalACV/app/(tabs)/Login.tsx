import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Animated,
  useWindowDimensions,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../AuthContext';
import GoogleOAuth from '../components/GoogleOAuth';
import apiService from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      const result = await apiService.login({ email, password });
      
      if (result.success && result.user) {
        await login(result.user);
        Alert.alert('Éxito', `¡Bienvenido ${result.user.nombre || result.user.email}!`);
      } else {
        Alert.alert('Error', result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (userData: any) => {
    try {
      await login(userData);
      Alert.alert('Éxito', `¡Bienvenido ${userData.nombre || userData.email}!`);
    } catch (error) {
      Alert.alert('Error', 'Error iniciando sesión con Google');
    }
  };

  const dynamicStyles = {
    container: {
      paddingHorizontal: isDesktop ? 100 : isTablet ? 60 : 20,
    },
    title: {
      fontSize: isDesktop ? 42 : isTablet ? 36 : 32,
    },
    input: {
      padding: isDesktop ? 18 : isTablet ? 16 : 14,
      fontSize: isDesktop ? 18 : 16,
    },
    loginButton: {
      paddingVertical: isDesktop ? 18 : isTablet ? 16 : 14,
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f1117" />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.contentContainer, dynamicStyles.container]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, dynamicStyles.title]}>
              🚀 Iniciar Sesión
            </Text>
            <Text style={styles.subtitle}>
              Ingresá a tu cuenta para continuar construyendo
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>📧 Email</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="tu@email.com"
                placeholderTextColor="#8b9cb3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>🔒 Contraseña</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Tu contraseña"
                placeholderTextColor="#8b9cb3"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>


            <TouchableOpacity 
              style={[styles.loginButton, dynamicStyles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? '🔄 Iniciando sesión...' : '🎯 Ingresar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Separador */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o continuar con</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Login con Google */}
          <GoogleOAuth 
            type="login" 
            onSuccess={handleGoogleSuccess}
          />

          {/* Link a Registro */}
          <View style={styles.registerLink}>
            <Text style={styles.registerText}>¿No tenés cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/Register')}>
              <Text style={styles.registerLinkText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  formContainer: {
    backgroundColor: '#1a1b27',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#8b9cb3',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#8b9cb3',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  separatorText: {
    marginHorizontal: 15,
    color: '#8b9cb3',
    fontSize: 14,
    fontWeight: '600',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  registerText: {
    color: '#8b9cb3',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
});