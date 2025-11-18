import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, Easing } from 'react-native';
import { api } from '../api';

interface Statistic {
  id: number;
  jugador: string;
  goles: number;
  asistencias: number;
  tarjetas: number;
}

export default function StatisticsScreen() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    api.get('/statistics').then(res => setStatistics(res.data)).catch(() => setStatistics([]));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <Text style={styles.title}>Estadísticas</Text>
      <FlatList
        data={statistics}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.statCard}>
            <Text style={styles.player}>{item.jugador}</Text>
            <Text style={styles.stats}>Goles: {item.goles} | Asistencias: {item.asistencias} | Tarjetas: {item.tarjetas}</Text>
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
  statCard: {
    marginBottom: 12,
    backgroundColor: '#2E2E2E',
    padding: 12,
    borderRadius: 8,
  },
  player: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stats: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
});
