import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Keyboard } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setError("");
        Keyboard.dismiss();
        router.push(`/home?user=${username}`);
      } else {
        setError("Usuario o contraseña inválidos / usuario inexistente");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  const handleCreateUser = async () => {
    if (!username || !password || !password2) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

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
        setUsername("");
        setPassword("");
        setPassword2("");
        setIsCreatingUser(false);
      }
    } catch {
      setError("Error al conectar con servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isCreatingUser ? "Nuevo Usuario" : "Login"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#d6b0ff99"
        value={username}
        onChangeText={setUsername}
        onSubmitEditing={isCreatingUser ? handleCreateUser : handleLogin} // Enter dispara acción correcta
        returnKeyType="done"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#d6b0ff99"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={isCreatingUser ? handleCreateUser : handleLogin} // Enter dispara acción correcta
        returnKeyType="done"
      />

      {isCreatingUser && (
        <TextInput
          style={styles.input}
          placeholder="Repetir Contraseña"
          placeholderTextColor="#d6b0ff99"
          secureTextEntry
          value={password2}
          onChangeText={setPassword2}
          onSubmitEditing={handleCreateUser} // Enter dispara crear usuario
          returnKeyType="done"
        />
      )}

      <Button
        title={isCreatingUser ? "Crear Usuario" : "Ingresar"}
        color="#6b29ff"
        onPress={isCreatingUser ? handleCreateUser : handleLogin}
      />

      <TouchableOpacity
        style={styles.smallButton}
        onPress={() => {
          setIsCreatingUser(!isCreatingUser);
          setError("");
          setUsername("");
          setPassword("");
          setPassword2("");
        }}
      >
        <Text style={styles.smallButtonText}>
          {isCreatingUser ? "Volver al Login" : "Nuevo usuario"}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#1b0a2a", justifyContent: "center", alignItems: "center", padding: 20
  },
  title: { fontSize: 32, color: "#d6b0ff", marginBottom: 20 },
  input: {
    width: "80%", padding: 10, borderRadius: 5, backgroundColor: "#300742",
    color: "#d6b0ff", marginBottom: 15
  },
  smallButton: {
    marginTop: 10, backgroundColor: "#3c0d66", paddingVertical: 8,
    paddingHorizontal: 20, borderRadius: 5
  },
  smallButtonText: { color: "#d6b0ff", fontSize: 14 },
  error: { color: "#ff6b6b", marginTop: 10 },
});
