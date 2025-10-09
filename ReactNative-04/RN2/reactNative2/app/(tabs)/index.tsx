import { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Keyboard, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Login tradicional
  const handleLogin = async () => {
    if (!username || !password) {
      setError("Todos los campos son obligatorios");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch("http://192.168.4.105:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setError("");
        Keyboard.dismiss();
        router.push(`/perfil?user=${encodeURIComponent(username)}`);
      } else {
        setError(data.error);
        setSuccess("");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
      setSuccess("");
    }
  };

  // Crear usuario
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

    // Validación de contraseña: 4+ chars, mayúscula, minúscula, número, max 20
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,20}$/;
    if (!regex.test(password)) {
      setError(
        "La contraseña debe tener 4-20 caracteres, al menos una mayúscula, una minúscula y un número."
      );
      setSuccess("");
      return;
    }

    try {
      const res = await fetch("http://192.168.4.105:4000/usuarios", {
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

  // Simulación login redes
  const handleSocialLogin = (red: string) => {
    Alert.alert("Login simulado", `Has ingresado con ${red}`);
    router.push(`/perfil?user=${encodeURIComponent(red + "_user")}`);
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

      <Text style={styles.orText}>O ingresar con redes</Text>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#db4437" }]}
          onPress={() => handleSocialLogin("Google")}
        >
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#3b5998" }]}
          onPress={() => handleSocialLogin("Facebook")}
        >
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#000000" }]}
          onPress={() => handleSocialLogin("Apple")}
        >
          <Text style={styles.socialText}>Apple</Text>
        </TouchableOpacity>
      </View>

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
  title: { fontSize: 32, color: "#d6b0ff", marginBottom: 20, textAlign: "center" },
  input: {
    width: "80%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#300742",
    color: "#d6b0ff",
    marginBottom: 15,
  },
  smallButton: { marginTop: 10, backgroundColor: "#3c0d66", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5 },
  smallButtonText: { color: "#d6b0ff", fontSize: 14, textAlign: "center" },
  orText: { color: "#d6b0ff", marginVertical: 10, fontSize: 16 },
  socialButtons: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  socialButton: { flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  socialText: { color: "#fff", fontSize: 14 },
  error: { color: "#ff6b6b", marginTop: 10, textAlign: "center" },
  success: { color: "#6bffb3", marginTop: 10, textAlign: "center" },
});
