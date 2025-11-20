import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { api } from '../servicios/api';

export default function PerfilPantalla({ navigation }) {
  const [estadisticas, setEstadisticas] = useState({
    totalEquipos: 0,
    totalJugadores: 0,
    totalPartidos: 0,
    partidosJugados: 0,
    partidosPendientes: 0
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [equipos, jugadores, partidos] = await Promise.all([
        api.obtenerEquipos(),
        api.obtenerJugadores(),
        api.obtenerPartidos()
      ]);

      const partidosJugados = partidos.filter(p => p.resultado && p.resultado !== '').length;
      const partidosPendientes = partidos.filter(p => !p.resultado || p.resultado === '').length;

      setEstadisticas({
        totalEquipos: equipos.length,
        totalJugadores: jugadores.length,
        totalPartidos: partidos.length,
        partidosJugados,
        partidosPendientes
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
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

  const manejarCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  return (
    <ScrollView style={estilos.contenedor}>
      <View style={estilos.tarjetaPerfil}>
        <View style={estilos.avatar}>
          <Text style={estilos.textoAvatar}>U</Text>
        </View>
        
        <Text style={estilos.nombreUsuario}>Usuario Actual</Text>
        
        <View style={[estilos.badgeRol, { backgroundColor: obtenerColorRol('admin') }]}>
          <Text style={estilos.textoBadge}>Administrador</Text>
        </View>
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Resumen del Torneo</Text>
        
        <View style={estilos.gridEstadisticas}>
          <View style={estilos.tarjetaEstadistica}>
            <Text style={estilos.numeroEstadistica}>{estadisticas.totalEquipos}</Text>
            <Text style={estilos.textoEstadistica}>Equipos</Text>
          </View>
          
          <View style={estilos.tarjetaEstadistica}>
            <Text style={estilos.numeroEstadistica}>{estadisticas.totalJugadores}</Text>
            <Text style={estilos.textoEstadistica}>Jugadores</Text>
          </View>
          
          <View style={estilos.tarjetaEstadistica}>
            <Text style={estilos.numeroEstadistica}>{estadisticas.totalPartidos}</Text>
            <Text style={estilos.textoEstadistica}>Partidos</Text>
          </View>
        </View>

        <View style={estilos.gridEstadisticas}>
          <View style={[estilos.tarjetaEstadistica, estilos.tarjetaVerde]}>
            <Text style={estilos.numeroEstadistica}>{estadisticas.partidosJugados}</Text>
            <Text style={estilos.textoEstadistica}>Jugados</Text>
          </View>
          
          <View style={[estilos.tarjetaEstadistica, estilos.tarjetaNaranja]}>
            <Text style={estilos.numeroEstadistica}>{estadisticas.partidosPendientes}</Text>
            <Text style={estilos.textoEstadistica}>Pendientes</Text>
          </View>
        </View>
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Acciones Rápidas</Text>
        
        <TouchableOpacity style={estilos.botonAccion}>
          <Text style={estilos.textoBotonAccion}>Ver Fixture Completo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={estilos.botonAccion}>
          <Text style={estilos.textoBotonAccion}>Estadísticas Detalladas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={estilos.botonAccion}>
          <Text style={estilos.textoBotonAccion}>Reportes</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={estilos.botonCerrarSesion} 
        onPress={manejarCerrarSesion}
      >
        <Text style={estilos.textoBotonCerrar}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#f8f9fa' },
  tarjetaPerfil: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  textoAvatar: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  nombreUsuario: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  badgeRol: { 
    paddingHorizontal: 15, 
    paddingVertical: 5, 
    borderRadius: 15 
  },
  textoBadge: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  seccion: { 
    backgroundColor: 'white', 
    margin: 15, 
    padding: 20, 
    borderRadius: 12 
  },
  tituloSeccion: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15,
    color: '#333'
  },
  gridEstadisticas: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 10
  },
  tarjetaEstadistica: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  tarjetaVerde: { backgroundColor: '#28a745' },
  tarjetaNaranja: { backgroundColor: '#fd7e14' },
  numeroEstadistica: { 
    color: 'white', 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 5
  },
  textoEstadistica: { 
    color: 'white', 
    fontSize: 12,
    textAlign: 'center'
  },
  botonAccion: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dee2e6'
  },
  textoBotonAccion: {
    color: '#007bff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  botonCerrarSesion: {
    backgroundColor: '#dc3545',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  textoBotonCerrar: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});