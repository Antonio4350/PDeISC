import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function TabsLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f1117" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f1117',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#0f1117',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          options={{ 
            title: 'Iniciar Sesión',
            headerBackTitle: 'Volver',
          }} 
        />
        <Stack.Screen 
          name="Register" 
          options={{ 
            title: '🎯 Crear Cuenta', 
            headerBackTitle: 'Volver',
          }} 
        />
        <Stack.Screen 
          name="PcBuilder" 
          options={{ 
            title: '🛠️ Constructor PC',
            headerBackTitle: 'Volver',
          }} 
        />
        <Stack.Screen 
          name="Projects" 
          options={{ 
            title: '📂 Mis Proyectos',
            headerBackTitle: 'Volver',
          }} 
        />
        <Stack.Screen 
          name="ComponentsCatalog" 
          options={{ 
            title: '🔧 Catálogo Componentes',
            headerBackTitle: 'Volver',
          }} 
        />
        <Stack.Screen 
          name="AdminPanel" 
          options={{ 
            title: 'Panel Admin',
            headerBackTitle: 'Volver',
          }} 
        />
        <Stack.Screen 
          name="AddComponent" 
          options={{ 
            title: '➕ Agregar Componente',
            headerBackTitle: 'Volver',
          }} 
        />
      </Stack>
    </>
  );
}