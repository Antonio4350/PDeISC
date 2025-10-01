import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  const params = useLocalSearchParams();
  const username = params.user || "Usuario";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, {username}!</Text>
      <Text style={styles.subtitle}>Has ingresado correctamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b0a2a", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, color: "#d6b0ff", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#a371ff" },
});
