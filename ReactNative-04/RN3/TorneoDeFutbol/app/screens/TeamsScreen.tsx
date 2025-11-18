import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Animated, Easing } from 'react-native';
import { api } from '../api';

interface Team {
  id: number;
  nombre: string;
  escudo: string;
}

export default function TeamsScreen() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    api.get('/teams').then(res => setTeams(res.data)).catch(() => setTeams([]));

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>⚽ Equipos</Text>
      <FlatList
        data={teams}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.teamCard}>
            {item.escudo && <Image source={{ uri: item.escudo }} style={styles.logo} />}
            <Text style={styles.teamName}>{item.nombre}</Text>
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
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#2E2E2E',
    padding: 12,
    borderRadius: 8,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 25,
  },
  teamName: {
    fontSize: 18,
    color: '#fff',
  },
});
