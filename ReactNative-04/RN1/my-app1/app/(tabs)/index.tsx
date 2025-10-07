import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Keyboard } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Todos los campos son obligatorios");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch("http://192.168.100.203:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setError("");
        Keyboard.dismiss();
        router.push(`/home?user=${encodeURIComponent(username)}`);
      } else {
        setError(data.error);
        setSuccess("");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
      setSuccess("");
    }
  };

  const handleCreateUser = async () => {
    if (!username || !password || !password2) {
      setError("Todos los campos son obligatorios");
      setSuccess("");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch("http://192.168.100.203:4000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSuccess("");
      } else {
        setError("");
        setSuccess("Usuario creado correctamente. Ahora podés ingresar.");
        setUsername("");
        setPassword("");
        setPassword2("");
        setIsCreatingUser(false);
      }
    } catch {
      setError("Error al conectar con servidor");
      setSuccess("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>
        {isCreatingUser ? "Nuevo Usuario" : "Login"}
      </Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#d6b0ff99"
        value={username}
        onChangeText={setUsername}
        onSubmitEditing={isCreatingUser ? handleCreateUser : handleLogin}
        returnKeyType="done"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#d6b0ff99"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={isCreatingUser ? handleCreateUser : handleLogin}
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
          onSubmitEditing={handleCreateUser}
          returnKeyType="done"
        />
      )}

      {/* Botón principal */}
      <Button
        title={isCreatingUser ? "Crear Usuario" : "Ingresar"}
        color="#6b29ff"
        onPress={isCreatingUser ? handleCreateUser : handleLogin}
      />

      {/* Botón alternar Login/Nuevo usuario */}
      <TouchableOpacity
        style={styles.smallButton}
        onPress={() => {
          setIsCreatingUser(!isCreatingUser);
          setError("");
          setSuccess("");
          setUsername("");
          setPassword("");
          setPassword2("");
        }}
      >
        <Text style={styles.smallButtonText}>
          {isCreatingUser ? "Volver al Login" : "Nuevo usuario"}
        </Text>
      </TouchableOpacity>

      {/* Mensajes de error/éxito */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b0a2a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#d6b0ff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#300742",
    color: "#d6b0ff",
    marginBottom: 15,
  },
  smallButton: {
    marginTop: 10,
    backgroundColor: "#3c0d66",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  smallButtonText: {
    color: "#d6b0ff",
    fontSize: 14,
    textAlign: "center",
  },
  error: { color: "#ff6b6b", marginTop: 10, textAlign: "center" },
  success: { color: "#6bffb3", marginTop: 10, textAlign: "center" },
});
