import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// ⚠️ IMPORTANTE: Usa la IP de tu servidor Node.js
const API_URL = "http://192.168.100.113:4000";

export default function PerfilScreen() {
  const router = useRouter(); // 'user' es el username o email, pasado desde el login
  const { user } = useLocalSearchParams<{ user: string }>();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [documento, setDocumento] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");

  const elegirImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return Alert.alert(
        "Permiso requerido",
        "Necesitas permitir acceso a tus imágenes."
      ); // launchImageLibraryAsync es la función para abrir la galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setImagen(result.assets[0].uri);
  };

  const guardarPerfil = async () => {
    // Validación de campos de la UI
    if (!nombre.trim()) return setMensaje("El nombre no puede estar vacío.");
    if (!/^\d+$/.test(telefono) || telefono.length < 8)
      return setMensaje(
        "El teléfono debe tener solo números (mínimo 8 dígitos)."
      );

    // Asegurarse de que el usuario esté disponible
    if (!user)
      return setMensaje(
        "Error: No se encontró el usuario para guardar el perfil."
      );

    try {
      const res = await fetch(`${API_URL}/perfil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          nombre,
          direccion,
          telefono,
          documento,
          foto_perfil: imagen,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMensaje("Perfil actualizado correctamente.");
      } else {
        setMensaje(data.error || "Error al guardar perfil en el servidor.");
      }
    } catch (error) {
      console.error("Error de red al guardar perfil:", error);
      setMensaje("Error de conexión con el servidor.");
    }
  };

  const handleLogout = () => router.push("/");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {" "}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>     {" "}
      </TouchableOpacity>
      <Text style={styles.title}>Perfil de {user}</Text>     {" "}
      <TouchableOpacity onPress={elegirImagen}>
        {" "}
        <Image
          source={{
            uri:
              imagen ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.changePhoto}>Cambiar foto</Text>     {" "}
      </TouchableOpacity>
      {" "}
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#d6b0ff99"
        value={nombre}
        onChangeText={setNombre}
      />
      {" "}
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        placeholderTextColor="#d6b0ff99"
        value={direccion}
        onChangeText={setDireccion}
      />
      {" "}
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#d6b0ff99"
        keyboardType="numeric"
        value={telefono}
        onChangeText={setTelefono}
      />
      {" "}
      <TextInput
        style={styles.input}
        placeholder="Número de documento"
        placeholderTextColor="#d6b0ff99"
        keyboardType="numeric"
        value={documento}
        onChangeText={setDocumento}
      />
      {" "}
      <TouchableOpacity style={styles.saveButton} onPress={guardarPerfil}>
        <Text style={styles.saveText}>Guardar cambios</Text>     {" "}
      </TouchableOpacity>
      {mensaje ? <Text style={styles.message}>{mensaje}</Text> : null}   {" "}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1b0a2a",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#3c0d66",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutText: { color: "#d6b0ff", fontSize: 14 },
  title: {
    fontSize: 28,
    color: "#d6b0ff",
    marginBottom: 20,
    textAlign: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: "#a371ff",
    marginBottom: 10,
  },
  changePhoto: {
    color: "#a371ff",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "85%",
    backgroundColor: "#300742",
    color: "#d6b0ff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#6b29ff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  saveText: { color: "#fff", fontSize: 16 },
  message: { marginTop: 15, color: "#6bffb3", textAlign: "center" },
});
