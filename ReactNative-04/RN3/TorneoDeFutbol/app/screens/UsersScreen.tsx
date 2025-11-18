import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, Easing } from 'react-native';
import { api } from '../api';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data)).catch(() => setUsers([]));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.nombre}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userRole}>Rol: {item.rol}</Text>
          </View>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0DB4F',
    marginBottom: 16,
    textAlign: 'center',
  },
  userCard: {
    marginBottom: 12,
    backgroundColor: '#2E2E2E',
    padding: 12,
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#aaa',
  },
  userRole: {
    fontSize: 16,
    color: '#F0DB4F',
    marginTop: 8,
  },
});
