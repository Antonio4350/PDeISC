import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { api } from '../servicios/api';

export default function PartidosPantalla() {
  const [partidos, setPartidos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [partidoEditando, setPartidoEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    equipo_local: '', equipo_visitante: '', fecha: '', lugar: '', resultado: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [datosPartidos, datosEquipos] = await Promise.all([
        api.obtenerPartidos(),
        api.obtenerEquipos()
      ]);
      setPartidos(datosPartidos);
      setEquipos(datosEquipos);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES') + ' ' + fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const guardarPartido = async () => {
    if (!formulario.equipo_local || !formulario.equipo_visitante || !formulario.fecha) {
      Alert.alert('Error', 'Equipos y fecha son obligatorios');
      return;
    }

    try {
      if (partidoEditando) {
        await api.actualizarPartido(partidoEditando.id, formulario);
        Alert.alert('Éxito', 'Partido actualizado');
      } else {
        await api.crearPartido(formulario);
        Alert.alert('Éxito', 'Partido creado');
      }
      setModalVisible(false);
      cargarDatos();
      limpiarFormulario();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el partido');
    }
  };

  const eliminarPartido = (partido) => {
    Alert.alert(
      'Confirmar',
      `¿Eliminar el partido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.eliminarPartido(partido.id);
              cargarDatos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el partido');
            }
          }
        }
      ]
    );
  };

  const limpiarFormulario = () => {
    setFormulario({ equipo_local: '', equipo_visitante: '', fecha: '', lugar: '', resultado: '' });
    setPartidoEditando(null);
  };

  const abrirModal = (partido = null) => {
    if (partido) {
      setFormulario({
        equipo_local: partido.equipo_local?.toString() || '',
        equipo_visitante: partido.equipo_visitante?.toString() || '',
        fecha: partido.fecha ? partido.fecha.slice(0, 16) : '',
        lugar: partido.lugar || '',
        resultado: partido.resultado || ''
      });
      setPartidoEditando(partido);
    } else {
      limpiarFormulario();
    }
    setModalVisible(true);
  };

  return (
    <View style={estilos.contenedor}>
      <TouchableOpacity style={estilos.botonAgregar} onPress={() => abrirModal()}>
        <Text style={estilos.textoBoton}>+ Agregar Partido</Text>
      </TouchableOpacity>

      <FlatList
        data={partidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.itemPartido}>
            <View style={estilos.infoPartido}>
              <Text style={estilos.equipos}>
                {item.equipo_local_nombre} vs {item.equipo_visitante_nombre}
              </Text>
              <Text style={estilos.resultado}>
                {item.resultado || 'Por jugarse'}
              </Text>
              <Text style={estilos.fecha}>
                {formatearFecha(item.fecha)} - {item.lugar}
              </Text>
            </View>
            <View style={estilos.botonesAccion}>
              <TouchableOpacity onPress={() => abrirModal(item)}>
                <Text style={estilos.botonEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarPartido(item)}>
                <Text style={estilos.botonEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={estilos.modalContenedor}>
          <Text style={estilos.tituloModal}>
            {partidoEditando ? 'Editar Partido' : 'Nuevo Partido'}
          </Text>

          <Text style={estilos.label}>Equipo Local:</Text>
          <View style={estilos.select}>
            {equipos.map(equipo => (
              <TouchableOpacity
                key={equipo.id}
                style={[
                  estilos.opcionSelect,
                  formulario.equipo_local === equipo.id.toString() && estilos.opcionSeleccionada
                ]}
                onPress={() => setFormulario({...formulario, equipo_local: equipo.id.toString()})}
              >
                <Text>{equipo.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={estilos.label}>Equipo Visitante:</Text>
          <View style={estilos.select}>
            {equipos.map(equipo => (
              <TouchableOpacity
                key={equipo.id}
                style={[
                  estilos.opcionSelect,
                  formulario.equipo_visitante === equipo.id.toString() && estilos.opcionSeleccionada
                ]}
                onPress={() => setFormulario({...formulario, equipo_visitante: equipo.id.toString()})}
              >
                <Text>{equipo.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={estilos.label}>Fecha y Hora:</Text>
          <TextInput
            style={estilos.input}
            placeholder="YYYY-MM-DDTHH:MM"
            value={formulario.fecha}
            onChangeText={(texto) => setFormulario({...formulario, fecha: texto})}
          />

          <TextInput
            style={estilos.input}
            placeholder="Lugar del partido"
            value={formulario.lugar}
            onChangeText={(texto) => setFormulario({...formulario, lugar: texto})}
          />

          <TextInput
            style={estilos.input}
            placeholder="Resultado (ej: 2-1)"
            value={formulario.resultado}
            onChangeText={(texto) => setFormulario({...formulario, resultado: texto})}
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
              onPress={guardarPartido}
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
  botonAgregar: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15
  },
  textoBoton: { color: 'white', fontWeight: 'bold' },
  itemPartido: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoPartido: { flex: 1 },
  equipos: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  resultado: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#007bff',
    marginBottom: 5
  },
  fecha: { color: '#666', fontSize: 12 },
  botonesAccion: { flexDirection: 'row', gap: 10 },
  botonEditar: { color: '#007bff', marginRight: 10 },
  botonEliminar: { color: '#dc3545' },
  modalContenedor: { flex: 1, padding: 20, justifyContent: 'center' },
  tituloModal: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
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