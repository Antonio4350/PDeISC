import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Link, router } from 'expo-router';
import Footer from '@/components/Footer';

export default function Index() {
  const [user, setUser] = useState(null);

  const categories = [
    'Procesadores',
    'Motherboards', 
    'Memorias RAM',
    'Gabinetes',
    'Fuentes',
    'Periféricos',
    'Almacenamiento', 
    'Tarjetas Gráficas'
  ];

  const handleStartBuilding = () => {
    if (!user) {
      router.push('/(tabs)/Login');
    } else {
      alert('Ir a armar PC');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>AntonioPCBuilder</Text>
        
        <View style={styles.navLinks}>
          {!user ? (
            <>
              <Link href="/(tabs)/Login" asChild>
                <TouchableOpacity>
                  <Text style={styles.navLink}>Login</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/(tabs)/Register" asChild>
                <TouchableOpacity>
                  <Text style={styles.navLink}>Registrarse</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/(tabs)/Login" asChild>
                <TouchableOpacity>
                  <Text style={styles.navLink}>Proyectos</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/(tabs)/Login" asChild>
                <TouchableOpacity>
                  <Text style={styles.navLink}>Registros</Text>
                </TouchableOpacity>
              </Link>
            </>
          ) : (
            <>
              <TouchableOpacity>
                <Text style={styles.navLink}>Componentes</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.navLink}>Proyectos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setUser(null)}>
                <Text style={styles.navLink}>Salir</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* BODY */}
      <ScrollView style={styles.body}>
        <Text style={styles.sectionTitle}>Explorar Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>¿Listo para armar tu PC ideal?</Text>
          <Text style={styles.startSubtitle}>Seleccioná componentes compatibles y creá tu setup perfecto</Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStartBuilding}>
            <Text style={styles.startButtonText}>Empezar a armar tu PC</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 15,
  },
  navLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1f2937',
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoryCard: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  categoryText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  startContainer: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 25,
    borderRadius: 12,
    marginTop: 20,
  },
  startTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  startSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});