import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, Easing } from 'react-native';
import { api } from '../api';

interface Player {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  posicion: string;
  numero_casaca: number;
  equipo_id: number;
}

export default function PlayersScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    api.get('/players').then(res => setPlayers(res.data)).catch(() => setPlayers([]));

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>⚽ Jugadores</Text>
      <FlatList
        data={players}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <Text style={styles.playerName}>{item.nombre} {item.apellido}</Text>
            <Text style={styles.playerDetails}>Edad: {item.edad} | Posición: {item.posicion} | Casaca: {item.numero_casaca}</Text>
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
  playerCard: {
    marginBottom: 12,
    backgroundColor: '#2E2E2E',
    padding: 12,
    borderRadius: 8,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerDetails: {
    fontSize: 14,
    color: '#aaa',
  },
});
