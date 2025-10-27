import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#0a0a0a', borderTopColor: '#111' },
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#00ff88',
      }}
    >
      <Tabs.Screen
        name="WelcomeScreen"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ComponentsScreen"
        options={{
          title: 'Componentes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
