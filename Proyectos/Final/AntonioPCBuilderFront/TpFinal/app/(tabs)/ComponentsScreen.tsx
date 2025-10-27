import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import HardwareCard from '@/components/HardwareCard';

export default function ComponentsScreen() {
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    // Datos falsos hasta conectar con la base de datos
    setComponents([
      { id: 1, name: 'RTX 4070 Ti', price: 950000, image: '' },
      { id: 2, name: 'Ryzen 7 5800X', price: 420000, image: '' },
      { id: 3, name: 'Mother ASUS X570', price: 300000, image: '' },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={components}
        renderItem={({ item }) => <HardwareCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  list: { padding: 10, alignItems: 'center' },
});
