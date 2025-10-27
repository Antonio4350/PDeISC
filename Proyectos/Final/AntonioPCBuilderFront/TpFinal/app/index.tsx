import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";

export default function Index() {
  const handlePress = (name: string) => {
    Alert.alert("En construcción", `Abrir página de: ${name}`);
  };

  const handleLogin = () => {
    Alert.alert("Login", "Pantalla de login próximamente...");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>AntonioPC</Text>
        <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Tu Hardware Gamer Ideal</Text>
        <Text style={styles.heroSubtitle}>
          Explorá los mejores componentes del mercado directamente desde tu celular.
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {["Procesadores", "Placas de Video", "Memorias RAM", "Discos SSD"].map((name, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => handlePress(name)}>
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={styles.cardText}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 AntonioPC - Todos los derechos reservados</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f0f0f",
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    color: "#00ffff",
    fontSize: 26,
    fontWeight: "bold",
  },
  loginBtn: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00ffff",
  },
  loginText: {
    color: "#00ffff",
    fontSize: 16,
  },
  hero: {
    alignItems: "center",
    marginBottom: 40,
  },
  heroTitle: {
    color: "#00ffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  heroSubtitle: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  card: {
    backgroundColor: "#1a1a1a",
    width: "45%",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#00ffff33",
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardText: {
    color: "#00ffff",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#222",
    paddingTop: 10,
  },
  footerText: {
    color: "#555",
    fontSize: 12,
  },
});
