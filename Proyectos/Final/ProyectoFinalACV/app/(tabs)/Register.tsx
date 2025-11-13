import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  useWindowDimensions,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../AuthContext';
import GoogleOAuth from '../components/GoogleOAuth';
import apiService from '../services/api';
import toast from '../utils/toast';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    const { nombre, apellido, email, password, confirmPassword, telefono } = formData;

    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await apiService.register({
        nombre,
        apellido,
        email,
        password,
        telefono
      });

      if (result.success && result.user) {
        await login(result.user, result.token);
        toast.success(`¡Cuenta creada para ${result.user.nombre}!`);
        
        setTimeout(() => {
          router.replace('/');
        }, 1000);
        
      } else {
        toast.error(result.error || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor. Verifica que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (userData: any) => {
    try {
      await login(userData);
      toast.success(`¡Bienvenido ${userData.nombre || userData.email}!`);
      setTimeout(() => {
        router.replace('/');
      }, 1000);
      
    } catch (error) {
      toast.error('Error registrando con Google');
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
    registerButton: {
      paddingVertical: isDesktop ? 18 : isTablet ? 16 : 14,
    },
    row: {
      gap: isDesktop ? 20 : isTablet ? 16 : 12,
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
          <View style={styles.header}>
            <Text style={[styles.title, dynamicStyles.title]}>
              🚀 Crear Cuenta
            </Text>
            <Text style={styles.subtitle}>
              Unite a nuestra comunidad de builders
            </Text>
          </View>

          <View style={styles.form}>
            <View style={[styles.row, dynamicStyles.row]}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>👤 Nombre *</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  placeholder="Tu nombre"
                  placeholderTextColor="#8b9cb3"
                  value={formData.nombre}
                  onChangeText={(value) => handleChange('nombre', value)}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>👥 Apellido *</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  placeholder="Tu apellido"
                  placeholderTextColor="#8b9cb3"
                  value={formData.apellido}
                  onChangeText={(value) => handleChange('apellido', value)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>📧 Email *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="tu@email.com"
                placeholderTextColor="#8b9cb3"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>📞 Teléfono</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="+54 11 1234-5678"
                placeholderTextColor="#8b9cb3"
                value={formData.telefono}
                onChangeText={(value) => handleChange('telefono', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>🔒 Contraseña *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#8b9cb3"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Contraseña *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Repetí tu contraseña"
                placeholderTextColor="#8b9cb3"
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.registerButton, dynamicStyles.registerButton, loading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? '🔄 Creando cuenta...' : '🎯 Crear Cuenta'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o registrate con</Text>
            <View style={styles.separatorLine} />
          </View>

          <GoogleOAuth 
            type="register" 
            onSuccess={handleGoogleSuccess}
          />

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/Login')}>
              <Text style={styles.loginLinkText}>Ingresar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Al crear una cuenta aceptás nuestros términos y condiciones de uso.
            </Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
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
  registerButton: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#8b9cb3',
  },
  registerButtonText: {
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
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  loginText: {
    color: '#8b9cb3',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    color: '#8b9cb3',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});