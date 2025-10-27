import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/footer';
export default function BuilderScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.text}>Zona de armado 🧠</Text>
        <Text style={styles.subtext}>Arrastrá y soltá tus componentes acá</Text>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#00ff88', fontSize: 20, fontWeight: 'bold' },
  subtext: { color: '#888', marginTop: 8 },
});
