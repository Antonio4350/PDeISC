import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function HardwareCard({ item }: { item: any }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image || 'https://cdn-icons-png.flaticon.com/512/3039/3039397.png' }} style={styles.image} />
      <Text style={styles.name}>{item.name || 'Componente desconocido'}</Text>
      <Text style={styles.price}>{item.price ? `$${item.price}` : 'Precio no disponible'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1c1c1c', borderRadius: 12, padding: 10, alignItems: 'center', width: 160, margin: 10 },
  image: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 },
  name: { color: '#fff', fontWeight: 'bold' },
  price: { color: '#00ff88', fontWeight: '600' }
});
