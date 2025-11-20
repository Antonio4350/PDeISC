import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import { api } from '../servicios/api';

export default function EquiposPantalla() {
  const [equipos, setEquipos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [formulario, setFormulario] = useState({ nombre: '', escudo: '' });

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const datos = await api.obtenerEquipos();
      setEquipos(datos);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los equipos');
    }
  };

  const guardarEquipo = async () => {
    if (!formulario.nombre) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    try {
      if (equipoEditando) {
        await api.actualizarEquipo(equipoEditando.id, formulario);
        Alert.alert('Éxito', 'Equipo actualizado');
      } else {
        await api.crearEquipo(formulario);
        Alert.alert('Éxito', 'Equipo creado');
      }
      setModalVisible(false);
      cargarEquipos();
      limpiarFormulario();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el equipo');
    }
  };

  const eliminarEquipo = (equipo) => {
    Alert.alert(
      'Confirmar',
      `¿Eliminar el equipo ${equipo.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.eliminarEquipo(equipo.id);
              cargarEquipos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el equipo');
            }
          }
        }
      ]
    );
  };

  const limpiarFormulario = () => {
    setFormulario({ nombre: '', escudo: '' });
    setEquipoEditando(null);
  };

  const abrirModal = (equipo = null) => {
    if (equipo) {
      setFormulario({ nombre: equipo.nombre, escudo: equipo.escudo || '' });
      setEquipoEditando(equipo);
    } else {
      limpiarFormulario();
    }
    setModalVisible(true);
  };

  const equiposFiltrados = equipos.filter(equipo =>
    equipo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={estilos.contenedor}>
      <TextInput
        style={estilos.buscador}
        placeholder="Buscar equipos..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <TouchableOpacity style={estilos.botonAgregar} onPress={() => abrirModal()}>
        <Text style={estilos.textoBoton}>+ Agregar Equipo</Text>
      </TouchableOpacity>

      <FlatList
        data={equiposFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.itemEquipo}>
            <View style={estilos.infoEquipo}>
              <Text style={estilos.nombreEquipo}>{item.nombre}</Text>
              <Text>Jugadores: {item.cantidad_jugadores || 0}</Text>
            </View>
            <View style={estilos.botonesAccion}>
              <TouchableOpacity onPress={() => abrirModal(item)}>
                <Text style={estilos.botonEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarEquipo(item)}>
                <Text style={estilos.botonEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={estilos.modalContenedor}>
          <Text style={estilos.tituloModal}>
            {equipoEditando ? 'Editar Equipo' : 'Nuevo Equipo'}
          </Text>

          <TextInput
            style={estilos.input}
            placeholder="Nombre del equipo"
            value={formulario.nombre}
            onChangeText={(texto) => setFormulario({...formulario, nombre: texto})}
          />

          <TextInput
            style={estilos.input}
            placeholder="URL del escudo (opcional)"
            value={formulario.escudo}
            onChangeText={(texto) => setFormulario({...formulario, escudo: texto})}
          />

          <View style={estilos.botonesModal}>
            <TouchableOpacity 
              style={estilos.botonCancelar} 
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={estilos.botonGuardar} 
              onPress={guardarEquipo}
            >
              <Text style={estilos.textoGuardar}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 15 },
  buscador: { 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  botonAgregar: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15
  },
  textoBoton: { color: 'white', fontWeight: 'bold' },
  itemEquipo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoEquipo: { flex: 1 },
  nombreEquipo: { fontWeight: 'bold', fontSize: 16 },
  botonesAccion: { flexDirection: 'row', gap: 10 },
  botonEditar: { color: '#007bff', marginRight: 10 },
  botonEliminar: { color: '#dc3545' },
  modalContenedor: { flex: 1, padding: 20, justifyContent: 'center' },
  tituloModal: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  botonesModal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  botonCancelar: { 
    backgroundColor: '#6c757d', 
    padding: 15, 
    borderRadius: 8, 
    flex: 1, 
    marginRight: 10,
    alignItems: 'center'
  },
  botonGuardar: { 
    backgroundColor: '#007bff', 
    padding: 15, 
    borderRadius: 8, 
    flex: 1, 
    marginLeft: 10,
    alignItems: 'center'
  },
  textoGuardar: { color: 'white', fontWeight: 'bold' }
});