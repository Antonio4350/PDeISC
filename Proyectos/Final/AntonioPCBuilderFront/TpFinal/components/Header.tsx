import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>AntonioPCBuilder</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push('/ComponentsScreen')}>
          <Ionicons name="hardware-chip-outline" size={22} color="#00ff88" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/ProfileScreen')}>
          <Ionicons name="person-circle-outline" size={22} color="#00ff88" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0a0a0a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  logo: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 18,
  },
});
