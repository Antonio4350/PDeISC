import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) router.push(`/home?user=${username}`);
      else setError(data.error || "Error en login");
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  const handleCreateUser = async () => {
    try {
      const res = await fetch("http://localhost:4000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        Alert.alert("Usuario creado", "Ahora podés ingresar con tus datos");
        setError("");
      }
    } catch {
      setError("Error al conectar con servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#d6b0ff99"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#d6b0ff99"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Ingresar" color="#6b29ff" onPress={handleLogin} />
      <TouchableOpacity style={styles.smallButton} onPress={handleCreateUser}>
        <Text style={styles.smallButtonText}>Crear usuario</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b0a2a", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 32, color: "#d6b0ff", marginBottom: 20 },
  input: { width: "80%", padding: 10, borderRadius: 5, backgroundColor: "#300742", color: "#d6b0ff", marginBottom: 15 },
  smallButton: { marginTop: 10, backgroundColor: "#3c0d66", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5 },
  smallButtonText: { color: "#d6b0ff", fontSize: 14 },
  error: { color: "#ff6b6b", marginTop: 10 },
});
