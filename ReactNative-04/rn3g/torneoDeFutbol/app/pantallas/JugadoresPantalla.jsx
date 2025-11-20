import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import { api } from '../servicios/api';

export default function JugadoresPantalla() {
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [jugadorEditando, setJugadorEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [formulario, setFormulario] = useState({
    nombre: '', apellido: '', edad: '', posicion: '', numero_casaca: '', equipo_id: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [datosJugadores, datosEquipos] = await Promise.all([
        api.obtenerJugadores(),
        api.obtenerEquipos()
      ]);
      setJugadores(datosJugadores);
      setEquipos(datosEquipos);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const guardarJugador = async () => {
    if (!formulario.nombre || !formulario.apellido || !formulario.equipo_id) {
      Alert.alert('Error', 'Nombre, apellido y equipo son obligatorios');
      return;
    }

    try {
      if (jugadorEditando) {
        await api.actualizarJugador(jugadorEditando.id, formulario);
        Alert.alert('Éxito', 'Jugador actualizado');
      } else {
        await api.crearJugador(formulario);
        Alert.alert('Éxito', 'Jugador creado');
      }
      setModalVisible(false);
      cargarDatos();
      limpiarFormulario();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el jugador');
    }
  };

  const eliminarJugador = (jugador) => {
    Alert.alert(
      'Confirmar',
      `¿Eliminar a ${jugador.nombre} ${jugador.apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.eliminarJugador(jugador.id);
              cargarDatos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el jugador');
            }
          }
        }
      ]
    );
  };

  const limpiarFormulario = () => {
    setFormulario({ nombre: '', apellido: '', edad: '', posicion: '', numero_casaca: '', equipo_id: '' });
    setJugadorEditando(null);
  };

  const abrirModal = (jugador = null) => {
    if (jugador) {
      setFormulario({
        nombre: jugador.nombre,
        apellido: jugador.apellido,
        edad: jugador.edad?.toString() || '',
        posicion: jugador.posicion || '',
        numero_casaca: jugador.numero_casaca?.toString() || '',
        equipo_id: jugador.equipo_id?.toString() || ''
      });
      setJugadorEditando(jugador);
    } else {
      limpiarFormulario();
    }
    setModalVisible(true);
  };

  const jugadoresFiltrados = jugadores.filter(jugador =>
    `${jugador.nombre} ${jugador.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={estilos.contenedor}>
      <TextInput
        style={estilos.buscador}
        placeholder="Buscar jugadores..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <TouchableOpacity style={estilos.botonAgregar} onPress={() => abrirModal()}>
        <Text style={estilos.textoBoton}>+ Agregar Jugador</Text>
      </TouchableOpacity>

      <FlatList
        data={jugadoresFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.itemJugador}>
            <View style={estilos.infoJugador}>
              <Text style={estilos.nombreJugador}>
                {item.nombre} {item.apellido}
              </Text>
              <Text>Equipo: {item.equipo_nombre}</Text>
              <Text>Posición: {item.posicion} | N°: {item.numero_casaca}</Text>
            </View>
            <View style={estilos.botonesAccion}>
              <TouchableOpacity onPress={() => abrirModal(item)}>
                <Text style={estilos.botonEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarJugador(item)}>
                <Text style={estilos.botonEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={estilos.modalContenedor}>
          <Text style={estilos.tituloModal}>
            {jugadorEditando ? 'Editar Jugador' : 'Nuevo Jugador'}
          </Text>

          <TextInput
            style={estilos.input}
            placeholder="Nombre"
            value={formulario.nombre}
            onChangeText={(texto) => setFormulario({...formulario, nombre: texto})}
          />

          <TextInput
            style={estilos.input}
            placeholder="Apellido"
            value={formulario.apellido}
            onChangeText={(texto) => setFormulario({...formulario, apellido: texto})}
          />

          <TextInput
            style={estilos.input}
            placeholder="Edad"
            value={formulario.edad}
            onChangeText={(texto) => setFormulario({...formulario, edad: texto})}
            keyboardType="numeric"
          />

          <TextInput
            style={estilos.input}
            placeholder="Posición"
            value={formulario.posicion}
            onChangeText={(texto) => setFormulario({...formulario, posicion: texto})}
          />

          <TextInput
            style={estilos.input}
            placeholder="Número de casaca"
            value={formulario.numero_casaca}
            onChangeText={(texto) => setFormulario({...formulario, numero_casaca: texto})}
            keyboardType="numeric"
          />

          <Text style={estilos.label}>Equipo:</Text>
          <View style={estilos.select}>
            {equipos.map(equipo => (
              <TouchableOpacity
                key={equipo.id}
                style={[
                  estilos.opcionSelect,
                  formulario.equipo_id === equipo.id.toString() && estilos.opcionSeleccionada
                ]}
                onPress={() => setFormulario({...formulario, equipo_id: equipo.id.toString()})}
              >
                <Text>{equipo.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={estilos.botonesModal}>
            <TouchableOpacity 
              style={estilos.botonCancelar} 
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={estilos.botonGuardar} 
              onPress={guardarJugador}
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
  itemJugador: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoJugador: { flex: 1 },
  nombreJugador: { fontWeight: 'bold', fontSize: 16 },
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
  label: { marginBottom: 5, fontWeight: 'bold' },
  select: { marginBottom: 15 },
  opcionSelect: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  opcionSeleccionada: { backgroundColor: '#e3f2fd', borderColor: '#007bff' },
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