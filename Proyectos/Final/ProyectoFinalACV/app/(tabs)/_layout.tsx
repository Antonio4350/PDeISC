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
            title: '🚀 Iniciar Sesión',
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
      </Stack>
    </>
  );
}