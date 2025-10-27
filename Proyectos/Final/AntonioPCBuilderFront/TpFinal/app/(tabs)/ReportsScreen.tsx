import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/footer';

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Reportes y Validaciones</Text>
        <Text style={styles.subtext}>Acá el admin verá los problemas pendientes con los componentes.</Text>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#00ff88', fontSize: 22, fontWeight: 'bold' },
  subtext: { color: '#888', textAlign: 'center', paddingHorizontal: 20, marginTop: 10 },
});
