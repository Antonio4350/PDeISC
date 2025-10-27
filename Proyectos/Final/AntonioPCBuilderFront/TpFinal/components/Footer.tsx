import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2025 AntonioPCBuilder</Text>
      <Text style={styles.subtext}>Arma tu PC a tu manera ⚙️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#111',
    paddingVertical: 10,
    alignItems: 'center',
  },
  text: {
    color: '#00ff88',
    fontWeight: '600',
  },
  subtext: {
    color: '#888',
    fontSize: 12,
  },
});
