import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import HardwareCard from '@/components/HardwareCard';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a AntonioPCBuilder</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Ver Componentes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  title: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#00ff88', padding: 10, borderRadius: 10 },
  buttonText: { color: '#000', fontWeight: 'bold' }
});
