import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, Easing } from 'react-native';
import { api } from '../api';

interface Match {
  id: number;
  equipo_local: number;
  equipo_visitante: number;
  fecha: string;
  lugar: string;
  resultado: string;
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    api.get('/matches').then(res => setMatches(res.data)).catch(() => setMatches([]));

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Partidos</Text>
      <FlatList
        data={matches}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.matchCard}>
            <Text style={styles.matchInfo}>Local: {item.equipo_local} vs Visitante: {item.equipo_visitante}</Text>
            <Text style={styles.matchDetails}>Fecha: {item.fecha} | Lugar: {item.lugar}</Text>
            <Text style={styles.matchResult}>Resultado: {item.resultado}</Text>
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
  matchCard: {
    marginBottom: 12,
    backgroundColor: '#2E2E2E',
    padding: 12,
    borderRadius: 8,
  },
  matchInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  matchDetails: {
    fontSize: 14,
    color: '#aaa',
  },
  matchResult: {
    fontSize: 16,
    color: '#F0DB4F',
    marginTop: 8,
  },
});
