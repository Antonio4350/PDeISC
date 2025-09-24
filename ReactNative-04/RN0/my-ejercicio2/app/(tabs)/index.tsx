import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          Listado de componentes nativos de React Native
        </ThemedText>

        <ThemedText>- View → contenedor genérico, similar a un &lt;div&gt;.</ThemedText>
        <ThemedText>- Text → muestra texto en pantalla.</ThemedText>
        <ThemedText>- Image → renderiza imágenes.</ThemedText>
        <ThemedText>- TextInput → campo de entrada de texto.</ThemedText>
        <ThemedText>- ScrollView → vista con desplazamiento.</ThemedText>
        <ThemedText>- FlatList → lista optimizada para muchos elementos.</ThemedText>
        <ThemedText>- SectionList → lista con secciones.</ThemedText>
        <ThemedText>- Pressable → detecta interacciones táctiles.</ThemedText>
        <ThemedText>- TouchableOpacity → botón táctil con efecto de opacidad.</ThemedText>
        <ThemedText>- TouchableHighlight → botón táctil con resaltado.</ThemedText>
        <ThemedText>- TouchableWithoutFeedback → detecta toque sin animación.</ThemedText>
        <ThemedText>- Button → botón básico.</ThemedText>
        <ThemedText>- Switch → interruptor on/off.</ThemedText>
        <ThemedText>- ActivityIndicator → spinner de carga.</ThemedText>
        <ThemedText>- Modal → ventana emergente sobre la vista.</ThemedText>
        <ThemedText>- StatusBar → controla la barra de estado.</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda la pantalla
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    gap: 10,
  },
  title: {
    marginBottom: 20,
  },
});
