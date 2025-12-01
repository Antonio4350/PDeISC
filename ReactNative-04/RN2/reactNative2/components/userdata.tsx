import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function UserData({ sendData }: { sendData: (data: FormData) => Promise<number> }) {
  const [error, setError] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  function validar() {
    setError('');
    let valido = true;
    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!emailRegex.test(mail)) {
      valido = false;
      setError('Email Inválido');
    }
    if (password.length < 6 || password.length > 24) {
      valido = false;
      setError('Contraseña debe tener entre 6 y 24 caracteres');
    }
    return valido;
  }

  async function send() {
    if (!validar()) return;
    const formData = new FormData();
    formData.append('password', password);
    formData.append('mail', mail);

    const respuesta = await sendData(formData);
    if (respuesta == 1) return;
    else setError('Usuario no Existente');
  }

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          placeholderTextColor="#999"
          onChangeText={setMail}
          value={mail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#999"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
      </View>

      {error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>⚠️ {error}</Text>
        </View>
      )}

      <Pressable onPress={send} style={styles.boton}>
        <Text style={styles.botonText}>Ingresar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginVertical: 20,
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B2CBF',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7B2CBF',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#F8F7FF',
    width: '100%',
    height: 50,
    borderColor: '#E0AAFF',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#4A4A4A',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFA5A5',
    marginBottom: 20,
  },
  error: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    fontWeight: '500',
  },
  boton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  botonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});