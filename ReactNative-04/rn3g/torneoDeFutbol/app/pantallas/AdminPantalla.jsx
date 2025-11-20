import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { api } from '../servicios/api';

export default function AdminPantalla() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const datos = await api.obtenerUsuarios();
      setUsuarios(datos);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    }
  };

  const cambiarRol = async (usuario, nuevoRol) => {
    try {
      await api.cambiarRolUsuario(usuario.id, nuevoRol);
      Alert.alert('Éxito', 'Rol actualizado');
      cargarUsuarios();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el rol');
    }
  };

  const obtenerColorRol = (rol) => {
    switch (rol) {
      case 'admin': return '#dc3545';
      case 'director': return '#fd7e14';
      case 'jugador': return '#007bff';
      case 'seguidor': return '#28a745';
      default: return '#6c757d';
    }
  };

  const confirmarCambioRol = (usuario, nuevoRol) => {
    Alert.alert(
      'Cambiar Rol',
      `¿Cambiar rol de ${usuario.nombre} a ${nuevoRol}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cambiar', 
          onPress: () => cambiarRol(usuario, nuevoRol)
        }
      ]
    );
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Administración de Usuarios</Text>
      <Text style={estilos.subtitulo}>Total: {usuarios.length} usuarios</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.itemUsuario}>
            <View style={estilos.infoUsuario}>
              <Text style={estilos.nombreUsuario}>{item.nombre}</Text>
              <Text style={estilos.emailUsuario}>{item.email}</Text>
            </View>
            
            <View style={estilos.controlesRol}>
              <Text style={[estilos.rolActual, { backgroundColor: obtenerColorRol(item.rol) }]}>
                {item.rol}
              </Text>
              
              <View style={estilos.botonesRol}>
                <TouchableOpacity 
                  style={[estilos.botonRol, item.rol === 'admin' && estilos.botonRolActivo]}
                  onPress={() => confirmarCambioRol(item, 'admin')}
                >
                  <Text style={estilos.textoBotonRol}>Admin</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[estilos.botonRol, item.rol === 'director' && estilos.botonRolActivo]}
                  onPress={() => confirmarCambioRol(item, 'director')}
                >
                  <Text style={estilos.textoBotonRol}>Director</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[estilos.botonRol, item.rol === 'seguidor' && estilos.botonRolActivo]}
                  onPress={() => confirmarCambioRol(item, 'seguidor')}
                >
                  <Text style={estilos.textoBotonRol}>Seguidor</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={estilos.leyendaRoles}>
        <Text style={estilos.tituloLeyenda}>Leyenda de Roles:</Text>
        <View style={estilos.itemLeyenda}>
          <View style={[estilos.circuloRol, { backgroundColor: '#dc3545' }]} />
          <Text>Admin - Acceso total</Text>
        </View>
        <View style={estilos.itemLeyenda}>
          <View style={[estilos.circuloRol, { backgroundColor: '#fd7e14' }]} />
          <Text>Director - Gestiona equipos</Text>
        </View>
        <View style={estilos.itemLeyenda}>
          <View style={[estilos.circuloRol, { backgroundColor: '#28a745' }]} />
          <Text>Seguidor - Solo lectura</Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 15 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  subtitulo: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
  itemUsuario: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff'
  },
  infoUsuario: { marginBottom: 10 },
  nombreUsuario: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  emailUsuario: { color: '#666', fontSize: 14 },
  controlesRol: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rolActual: { 
    color: 'white', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 12, 
    fontSize: 12,
    fontWeight: 'bold'
  },
  botonesRol: { flexDirection: 'row', gap: 5 },
  botonRol: { 
    backgroundColor: '#e9ecef', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  botonRolActivo: { backgroundColor: '#007bff' },
  textoBotonRol: { fontSize: 10, fontWeight: 'bold', color: '#333' },
  leyendaRoles: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 20
  },
  tituloLeyenda: { fontWeight: 'bold', marginBottom: 10 },
  itemLeyenda: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  circuloRol: { width: 12, height: 12, borderRadius: 6, marginRight: 8 }
});