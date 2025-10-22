import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://10.0.7.210:4000";

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { user } = useLocalSearchParams<{ user: string }>();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/perfil/${user}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const perfil = data.data;
          setNombre(perfil.nombre || "");
          setDireccion(perfil.direccion || "");
          setTelefono(perfil.telefono || "");
          setFotoPerfil(perfil.foto_perfil || null);
          setDocumentos(perfil.documento || []);
        }
      });
  }, [user]);

  const elegirImagen = async (tipo: "foto" | "documento", desdeCamara = false) => {
    const permisos = await ImagePicker.requestCameraPermissionsAsync();
    if (permisos.status !== "granted") {
      return Alert.alert(
        "Permiso requerido",
        "Habilitá el acceso a la cámara o galería."
      );
    }

    const result = desdeCamara
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (tipo === "foto") setFotoPerfil(uri);
      else {
        if (documentos.length >= 2) {
          Alert.alert("Solo se permiten 2 documentos");
          return;
        }
        setDocumentos((prev) => [...prev, uri]);
      }
    }
  };

  const eliminarDocumento = (idx: number) => {
    const nuevosDocs = documentos.filter((_, i) => i !== idx);
    setDocumentos(nuevosDocs);
  };

  const guardarPerfil = async () => {
    if (!nombre || !direccion || !telefono) {
      return setMensaje("Completa todos los campos");
    }
    if (!fotoPerfil) return setMensaje("Selecciona una foto de perfil");
    if (documentos.length !== 2)
      return setMensaje("Se requieren exactamente 2 documentos");

    const formData = new FormData();
    formData.append("username", user as string);
    formData.append("nombre", nombre);
    formData.append("direccion", direccion);
    formData.append("telefono", telefono);

    // Foto de perfil
    formData.append("foto_perfil", {
      uri: fotoPerfil,
      type: "image/jpeg",
      name: `foto_${Date.now()}.jpg`,
    } as any);

    // Documentos
    documentos.forEach((doc, idx) => {
      formData.append("documento", {
        uri: doc,
        type: "image/jpeg",
        name: `documento_${idx}_${Date.now()}.jpg`,
      } as any);
    });

    try {
      const res = await fetch(`${API_URL}/perfil`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setMensaje("Información guardada correctamente ✅");
        router.replace({ pathname: "/perfil", params: { user } });
      } else {
        setMensaje(data.error || "Error al guardar información");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.logout} onPress={() => router.replace("/")}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.mainRow}>
        <View style={styles.leftColumn}>
          <Image
            source={{
              uri:
                fotoPerfil ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.btn} onPress={() => elegirImagen("foto", true)}>
              <Text style={styles.btnText}>Sacar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => elegirImagen("foto")}>
              <Text style={styles.btnText}>Galería</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.documentBox}>
            <Text style={styles.sectionTitle}>Documentos (2)</Text>
            <View style={styles.docRow}>
              {documentos.map((uri, idx) => (
                <View key={idx} style={{ position: "relative" }}>
                  <Image source={{ uri }} style={styles.docImage} />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => eliminarDocumento(idx)}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.btn} onPress={() => elegirImagen("documento", true)}>
                <Text style={styles.btnText}>Escanear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => elegirImagen("documento")}>
                <Text style={styles.btnText}>Galería</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#ccc"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            placeholderTextColor="#ccc"
            value={direccion}
            onChangeText={setDireccion}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={telefono}
            onChangeText={setTelefono}
          />

          <TouchableOpacity style={styles.save} onPress={guardarPerfil}>
            <Text style={styles.saveText}>Guardar información</Text>
          </TouchableOpacity>
          {mensaje ? <Text style={styles.msg}>{mensaje}</Text> : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#1b0a2a", padding: 20 },
  logout: { position: "absolute", top: 20, right: 20, backgroundColor: "#ff4b4b", padding: 8, borderRadius: 8, zIndex: 10 },
  title: { fontSize: 28, color: "#d6b0ff", marginBottom: 20, textAlign: "center" },
  mainRow: { flexDirection: "row", gap: 20 },
  leftColumn: { width: 400, alignItems: "center" },
  rightColumn: { flex: 1, justifyContent: "flex-start" },
  avatar: { width: 250, height: 250, borderRadius: 8, marginBottom: 10, borderWidth: 2, borderColor: "#a371ff" },
  buttonsRow: { flexDirection: "row", gap: 10, marginVertical: 5 },
  btn: { backgroundColor: "#6b29ff", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
  btnText: { color: "#fff", fontSize: 13 },
  documentBox: { width: "100%", marginTop: 15 },
  sectionTitle: { color: "#fff", fontWeight: "bold", marginBottom: 5 },
  docRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  docImage: { width: 150, height: 100, borderRadius: 8 },
  deleteBtn: { position: "absolute", top: 5, right: 5, backgroundColor: "#ff4b4b", width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center", zIndex: 5 },
  input: { backgroundColor: "#300742", color: "#fff", borderRadius: 8, padding: 10, marginVertical: 6 },
  save: { backgroundColor: "#a371ff", padding: 12, borderRadius: 8, marginTop: 15, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold" },
  msg: { marginTop: 10, color: "#6bffb3" },
});
