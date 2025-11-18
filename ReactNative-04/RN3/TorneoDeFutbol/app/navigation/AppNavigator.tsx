import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TeamsScreen from '../screens/TeamsScreen';
import PlayersScreen from '../screens/PlayersScreen';
import MatchesScreen from '../screens/MatchesScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import UsersScreen from '../screens/UsersScreen';
import UserABMLScreen from '../screens/UserABMLScreen';
import AuthScreen from '../screens/AuthScreen';
import { useAuth } from '../../hooks/useAuth';

const Tab = createBottomTabNavigator();

function CustomHeader({ navigation }: any) {
  const { user, logout } = useAuth();
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Torneo de Fútbol</Text>
      <View style={styles.links}>
        <TouchableOpacity onPress={() => navigation.navigate('Equipos')}>
          <Text style={styles.link}>Equipos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Jugadores')}>
          <Text style={styles.link}>Jugadores</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Partidos')}>
          <Text style={styles.link}>Partidos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Estadísticas')}>
          <Text style={styles.link}>Estadísticas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Usuarios')}>
          <Text style={styles.link}>Usuarios</Text>
        </TouchableOpacity>
        {user?.role === 'admin' && (
          <TouchableOpacity onPress={() => navigation.navigate('ABML Usuarios')}>
            <Text style={styles.link}>ABML</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        tabBarStyle: {
          backgroundColor: '#222',
          borderTopColor: '#F0DB4F',
        },
        tabBarLabelStyle: {
          color: '#F0DB4F',
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Equipos" component={TeamsScreen} />
      <Tab.Screen name="Jugadores" component={PlayersScreen} />
      <Tab.Screen name="Partidos" component={MatchesScreen} />
      <Tab.Screen name="Estadísticas" component={StatisticsScreen} />
      <Tab.Screen name="Usuarios" component={UsersScreen} />
      {user?.role === 'admin' && (
        <Tab.Screen name="ABML Usuarios" component={UserABMLScreen} />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1E1E1E',
    paddingTop: 32,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#F0DB4F',
  },
  headerTitle: {
    color: '#F0DB4F',
    fontSize: 22,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    marginHorizontal: 8,
    fontSize: 16,
  },
  logout: {
    color: '#F44336',
    marginLeft: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
