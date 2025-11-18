import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';

interface User {
  id: number;
  nombre: string;
  email: string;
  role: string;
}

export default function UserABMLScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('comun');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get('/users').then((res: { data: User[] }) => setUsers(res.data)).catch(() => setUsers([]));
  };

  const handleAdd = async () => {
    try {
      await api.post('/users', { nombre, email, password, role });
      fetchUsers();
      setNombre(''); setEmail(''); setPassword(''); setRole('comun');
    } catch {
      Alert.alert('Error', 'No se pudo crear el usuario');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el usuario');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await api.put(`/users/${id}`, { nombre, email, password, role });
      fetchUsers();
      setNombre(''); setEmail(''); setPassword(''); setRole('comun');
    } catch {
      Alert.alert('Error', 'No se pudo modificar el usuario');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No tienes permisos para modificar usuarios.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ABML Usuarios</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Rol (admin/comun)" value={role} onChangeText={setRole} />
      <Button title="Agregar Usuario" onPress={handleAdd} />
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text>{item.nombre} - {item.email} - {item.role}</Text>
            <Button title="Eliminar" onPress={() => handleDelete(item.id)} />
            <Button title="Modificar" onPress={() => handleUpdate(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 8 },
  userCard: { marginBottom: 12 },
});
