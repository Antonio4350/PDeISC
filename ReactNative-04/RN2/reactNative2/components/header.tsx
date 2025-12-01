import { useRouter } from 'expo-router';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderReact() {
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      <Pressable style={styles.enlace} onPress={() => { router.push("/profile"); }}>
        <Text style={styles.texto}>👤 {isMobile ? '' : 'Perfil'}</Text>
      </Pressable>
      <Pressable style={styles.enlace} onPress={() => { router.push("/userlist"); }}>
        <Text style={styles.texto}>👥 {isMobile ? '' : 'Usuarios'}</Text>
      </Pressable>
      <Pressable style={styles.enlace} onPress={() => { router.push("/documents"); }}>
        <Text style={styles.texto}>📄 {isMobile ? '' : 'Documentos'}</Text>
      </Pressable>
      <Pressable style={styles.enlace} onPress={() => { router.push("/"); }}>
        <Text style={styles.texto}>🚪 {isMobile ? '' : 'Salir'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#7B2CBF',
    width: '100%',
    height: 70,
    paddingHorizontal: 10,
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  enlace: {
    paddingVertical: 10,
    paddingHorizontal: Platform.OS === 'web' ? 15 : 10,
    borderRadius: 10,
    backgroundColor: '#9D4EDD',
    minWidth: Platform.OS === 'web' ? 110 : 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  texto: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});