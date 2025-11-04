import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useAuth } from '../AuthContext';

export default function PcBuilder() {
  const { user } = useAuth();
  const [selectedComponents, setSelectedComponents] = useState({});

  const components = [
    { type: 'cpu', name: 'Procesador', icon: '⚡' },
    { type: 'motherboard', name: 'Motherboard', icon: '🔌' },
    { type: 'ram', name: 'Memoria RAM', icon: '💾' },
    { type: 'gpu', name: 'Tarjeta Gráfica', icon: '🎯' },
    { type: 'storage', name: 'Almacenamiento', icon: '💿' },
    { type: 'psu', name: 'Fuente', icon: '🔋' },
    { type: 'case', name: 'Gabinete', icon: '🖥️' }
  ];

  const handleSelectComponent = (componentType: string) => {
    Alert.alert(
      `Seleccionar ${componentType}`,
      'Próximamente: Catálogo de componentes',
      [{ text: 'OK' }]
    );
  };

  const handleBuildPc = () => {
    if (Object.keys(selectedComponents).length === 0) {
      Alert.alert('Info', 'Selecciona al menos un componente para empezar');
      return;
    }
    Alert.alert('🚀 ¡Excelente!', 'Tu PC se está construyendo...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Constructor de PC</Text>
      <Text style={styles.subtitle}>
        Hola {user?.nombre}, armá tu PC ideal
      </Text>

      <ScrollView style={styles.componentsList}>
        {components.map((component, index) => (
          <TouchableOpacity
            key={index}
            style={styles.componentCard}
            onPress={() => handleSelectComponent(component.name)}
          >
            <Text style={styles.componentIcon}>{component.icon}</Text>
            <Text style={styles.componentName}>{component.name}</Text>
            <Text style={styles.componentAction}>Seleccionar →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.buildButton} onPress={handleBuildPc}>
        <Text style={styles.buildButtonText}>🚀 Construir Mi PC</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8b9cb3',
    textAlign: 'center',
    marginBottom: 30,
  },
  componentsList: {
    flex: 1,
  },
  componentCard: {
    backgroundColor: '#1a1b27',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  componentIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  componentName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  componentAction: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  buildButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buildButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});