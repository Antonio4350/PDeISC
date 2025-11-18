import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import RegisterScreen from '../screens/RegisterScreen';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  if (showRegister) {
    return <RegisterScreen />;
  }

  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true,
  }).start();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>⚽ Bienvenido</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowRegister(true)}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0DB4F',
    marginBottom: 24,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#2E2E2E',
    color: '#fff',
  },
  button: {
    width: '90%',
    backgroundColor: '#F0DB4F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#1E1E1E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#F0DB4F',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;
