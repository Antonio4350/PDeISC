import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (params.user) {
      setUsername(params.user as string);
    } else {
      const timer = setTimeout(() => router.replace("/"), 0);
      return () => clearTimeout(timer);
    }
  }, [params.user]);

  if (!username) return null;

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{`Bienvenido, ${username}`}</Text>
      <Text style={styles.subtitle}>Has ingresado correctamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b0a2a", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, color: "#d6b0ff", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#a371ff" },
  logoutButton: { position: "absolute", top: 40, right: 20, backgroundColor: "#3c0d66", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
  logoutText: { color: "#d6b0ff", fontSize: 14 },
});
