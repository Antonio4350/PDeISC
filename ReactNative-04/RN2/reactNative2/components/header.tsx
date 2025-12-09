import { useRouter } from 'expo-router';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderReact() {
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.enlace,
          pressed && styles.enlacePressed
        ]} 
        onPress={() => { router.push("/profile"); }}
      >
        <Text style={styles.texto}>👤 {isMobile ? '' : 'Perfil'}</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.enlace,
          pressed && styles.enlacePressed
        ]} 
        onPress={() => { router.push("/userlist"); }}
      >
        <Text style={styles.texto}>👥 {isMobile ? '' : 'Usuarios'}</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.enlace,
          pressed && styles.enlacePressed
        ]} 
        onPress={() => { router.push("/documents"); }}
      >
        <Text style={styles.texto}>📄 {isMobile ? '' : 'Documentos'}</Text>
      </Pressable>
      
      <Pressable 
        style={({ pressed }) => [
          styles.enlace,
          pressed && styles.enlacePressed
        ]} 
        onPress={() => { router.push("/"); }}
      >
        <Text style={styles.texto}>🚪 {isMobile ? '' : 'Salir'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Cambié a space-between
    alignItems: 'center',
    backgroundColor: '#7B2CBF',
    width: '100%',
    height: Platform.OS === 'web' ? 70 : 65,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 12,
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#9D4EDD',
  },
  enlace: {
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    paddingHorizontal: Platform.OS === 'web' ? 15 : 10,
    borderRadius: 10,
    backgroundColor: '#9D4EDD',
    minWidth: Platform.OS === 'web' ? 90 : 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E0AAFF',
    flex: 1, // Cada botón ocupa espacio igual
    marginHorizontal: Platform.OS === 'web' ? 5 : 3, // Espacio entre botones
  },
  enlacePressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#7B2CBF',
  },
  texto: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});