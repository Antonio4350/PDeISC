import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import GoogleOAuth from '@/components/GoogleOauth';

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    const { nombre, apellido, email, password, confirmPassword, telefono } = formData;

    // Validaciones
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Simulación de registro - luego conectaremos con el backend
      console.log('Register attempt:', formData);
      
      // Aquí irá la llamada al backend
      // const response = await registerUser(formData);
      
      // Simulamos un registro exitoso
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Éxito', 
          'Cuenta creada correctamente',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/Login')
            }
          ]
        );
      }, 1500);
      
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo crear la cuenta. Intenta nuevamente.');
    }
  };

  const handleGoogleSuccess = (email: string) => {
    console.log('Usuario registrado con Google:', email);
    Alert.alert('Éxito', `Cuenta creada para ${email}`);
    // router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Registrate para empezar a armar tu PC</Text>

      {/* Formulario */}
      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              value={formData.nombre}
              onChangeText={(value) => handleChange('nombre', value)}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Apellido *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu apellido"
              value={formData.apellido}
              onChangeText={(value) => handleChange('apellido', value)}
            />
          </View>
        </View>

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="+54 11 1234-5678"
          value={formData.telefono}
          onChangeText={(value) => handleChange('telefono', value)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Repetí tu contraseña"
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Separador */}
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>o registrate con</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Registro con Google */}
      <GoogleOAuth 
        type="register" 
        onSuccess={handleGoogleSuccess}
      />

      {/* Link a Login */}
      <View style={styles.loginLink}>
        <Text style={styles.loginText}>¿Ya tenés cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Login')}>
          <Text style={styles.loginLinkText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#6b7280',
  },
  form: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  registerButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  separatorText: {
    marginHorizontal: 15,
    color: '#6b7280',
    fontSize: 14,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
});