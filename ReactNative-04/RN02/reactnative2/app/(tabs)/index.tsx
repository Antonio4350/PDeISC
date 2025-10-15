import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

const API_URL = "http://10.0.7.210:4000"; // reemplaza con tu IP/puerto

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com",
    redirectUri: makeRedirectUri(),
    useProxy: true,
  });

  useEffect(() => {
    console.log("Redirect URI generada:", makeRedirectUri({ useProxy: true }));
    if (response?.type === "success") {
      const { id_token, access_token } = response.params;
      if (id_token || access_token) handleGoogleLogin({ idToken: id_token, accessToken: access_token });
    }
  }, [response]);

  const handleGoogleLogin = async (tokens: any) => {
    try {
      const res = await fetch(`${API_URL}/googleLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tokens),
      });

      const data = await res.json();

      if (data.success) {
        setError("");
        setSuccess("Login con Google exitoso!");
        if (Platform.OS === "web") localStorage.setItem("oldmail", data.mail);
        else await SecureStore.setItemAsync("oldmail", data.mail);

        router.push(`/perfil?user=${encodeURIComponent(data.mail)}`);
      } else {
        setError(data.error || "Error al iniciar sesión con Google");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
      setSuccess("");
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Todos los campos son obligatorios");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setError("");
        setSuccess("Login exitoso!");
        Keyboard.dismiss();
        router.push(`/perfil?user=${encodeURIComponent(username)}`);
      } else {
        setError(data.error);
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
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

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,20}$/;
    if (!regex.test(password)) {
      setError(
        "La contraseña debe tener entre 4 y 20 caracteres, con al menos una mayúscula, una minúscula y un número."
      );
      setSuccess("");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
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
    } catch (err) {
      console.error(err);
      setError("Error al conectar con servidor");
      setSuccess("");
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
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#d6b0ff99"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isCreatingUser && (
        <TextInput
          style={styles.input}
          placeholder="Repetir Contraseña"
          placeholderTextColor="#d6b0ff99"
          secureTextEntry
          value={password2}
          onChangeText={setPassword2}
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
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={styles.socialText}>Google</Text>
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
  title: { fontSize: 32, color: "#d6b0ff", marginBottom: 20 },
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
  smallButtonText: { color: "#d6b0ff", fontSize: 14, textAlign: "center" },
  orText: { color: "#d6b0ff", marginVertical: 10, fontSize: 16 },
  socialButtons: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  socialButton: { flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  socialText: { color: "#fff", fontSize: 14 },
  error: { color: "#ff6b6b", marginTop: 10, textAlign: "center" },
  success: { color: "#6bffb3", marginTop: 10, textAlign: "center" },
});
