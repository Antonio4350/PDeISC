import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>AntonioPCBuilder</Text>
      <Text style={styles.footerText}>Armá tu PC ideal con los mejores componentes</Text>
      <Text style={styles.footerCopyright}>© 2024 - Todos los derechos reservados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1f2937',
    padding: 20,
    alignItems: 'center',
  },
  footerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerText: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  footerCopyright: {
    color: '#9ca3af',
    fontSize: 12,
  },
});