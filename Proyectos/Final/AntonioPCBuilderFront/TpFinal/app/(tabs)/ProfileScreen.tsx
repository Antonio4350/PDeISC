import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/footer';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Perfil del Usuario</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#00ff88', fontSize: 22, fontWeight: 'bold' },
  button: { marginTop: 20, backgroundColor: '#00ff88', padding: 10, borderRadius: 10 },
  buttonText: { color: '#000', fontWeight: 'bold' },
});
