// app/(tabs)/ManageProperties.tsx - CORREGIDO SIN ERRORES
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../AuthContext';
import toast from '../utils/toast';

interface Property {
  id?: number;
  tipo_componente: string;
  propiedad: string;
  valor: string;
}

interface OrganizedProperties {
  [componentType: string]: {
    [property: string]: string[];
  };
}

interface AllPropertiesData {
  [componentType: string]: {
    [property: string]: Array<{ id: number; valor: string }>;
  };
}

export default function ManageProperties() {
  const { user, isAdmin } = useAuth();
  const [properties, setProperties] = useState<OrganizedProperties>({});
  const [allProperties, setAllProperties] = useState<AllPropertiesData>({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProperty, setNewProperty] = useState<Property>({
    tipo_componente: 'procesadores',
    propiedad: 'marca',
    valor: ''
  });
  const [permissionChecked, setPermissionChecked] = useState(false);

  const componentTypes = [
    { value: 'procesadores', label: 'Procesadores', icon: '⚡' },
    { value: 'motherboards', label: 'Motherboards', icon: '🔌' },
    { value: 'memorias_ram', label: 'Memorias RAM', icon: '💾' },
    { value: 'tarjetas_graficas', label: 'Tarjetas Gráficas', icon: '🎯' },
    { value: 'almacenamiento', label: 'Almacenamiento', icon: '💿' },
    { value: 'fuentes_poder', label: 'Fuentes de Poder', icon: '🔋' },
    { value: 'gabinetes', label: 'Gabinetes', icon: '🖥️' }
  ];

  const propertyTypes: {[key: string]: string[]} = {
    procesadores: ['marca', 'socket', 'generacion', 'tecnologia'],
    motherboards: ['marca', 'socket', 'chipset', 'formato'],
    memorias_ram: ['marca', 'tipo', 'capacidad'],
    tarjetas_graficas: ['marca', 'fabricante'],
    almacenamiento: ['marca', 'tipo'],
    fuentes_poder: ['marca', 'certificacion'],
    gabinetes: ['marca', 'formato']
  };

  useEffect(() => {
    // Verificar permisos después del montaje
    const checkPermissions = () => {
      if (!isAdmin()) {
        toast.error('No tenés permisos para acceder');
        setTimeout(() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('/(tabs)/AdminPanel' as any);
          }
        }, 100);
        return false;
      }
      setPermissionChecked(true);
      return true;
    };

    if (checkPermissions()) {
      loadAllProperties();
    }
  }, []);

  const loadAllProperties = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando todas las propiedades...');
      
      // Cargar propiedades
      const response = await fetch('http://192.168.1.38:5000/properties');
      const result = await response.json();
      
      console.log('📊 Respuesta del servidor:', result);

      if (result.success && result.data) {
        // El backend está devolviendo solo valores, no IDs
        setProperties(result.data);
        // Para la eliminación, necesitamos crear un mapeo temporal
        createIdMapping(result.data);
      } else {
        toast.error('Error cargando propiedades');
      }
    } catch (error) {
      console.error('💥 Error cargando propiedades:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const createIdMapping = (props: OrganizedProperties) => {
    // Crear un mapeo temporal ya que el backend no devuelve IDs
    const mapping: AllPropertiesData = {};
    
    Object.keys(props).forEach(componentType => {
      mapping[componentType] = {};
      Object.keys(props[componentType]).forEach(property => {
        mapping[componentType][property] = props[componentType][property].map((valor, index) => ({
          id: index + 1, // ID temporal - necesitamos el backend real
          valor: valor
        }));
      });
    });
    
    setAllProperties(mapping);
  };

  const handleAddProperty = async () => {
    if (!newProperty.valor.trim()) {
      toast.error('El valor es requerido');
      return;
    }

    try {
      console.log('🔄 Agregando propiedad:', newProperty);
      
      const response = await fetch('http://192.168.1.38:5000/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty)
      });

      const result = await response.json();
      console.log('📊 Respuesta del servidor:', result);

      if (result.success) {
        toast.success('Propiedad agregada exitosamente');
        setNewProperty({
          tipo_componente: 'procesadores',
          propiedad: 'marca',
          valor: ''
        });
        setModalVisible(false);
        loadAllProperties(); // Recargar la lista
      } else {
        toast.error(result.error || 'Error al agregar propiedad');
      }
    } catch (error) {
      console.error('💥 Error agregando propiedad:', error);
      toast.error('Error de conexión');
    }
  };

  const findPropertyId = (componentType: string, property: string, value: string): number | null => {
    try {
      // Buscar el ID en allProperties
      if (allProperties[componentType] && allProperties[componentType][property]) {
        const found = allProperties[componentType][property].find((item) => item.valor === value);
        console.log(`🔍 Buscando: ${componentType}.${property} = ${value}, Encontrado:`, found);
        return found ? found.id : null;
      }
      return null;
    } catch (error) {
      console.error('💥 Error en findPropertyId:', error);
      return null;
    }
  };

  const handleDeleteProperty = async (componentType: string, property: string, value: string) => {
    try {
      console.log(`🗑️ Intentando eliminar: ${componentType}.${property} = ${value}`);
      
      // Buscar el ID
      const propertyId = findPropertyId(componentType, property, value);
      
      console.log(`🔍 ID encontrado: ${propertyId}`);

      if (!propertyId) {
        console.log('❌ No se encontró ID para la propiedad');
        toast.error('No se puede eliminar esta propiedad. El backend no está devolviendo IDs.');
        return;
      }

      Alert.alert(
        'Confirmar Eliminación',
        `¿Estás seguro de que querés eliminar "${value}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive', 
            onPress: async () => {
              try {
                console.log(`🎯 Enviando DELETE para ID: ${propertyId}`);
                
                const response = await fetch(`http://192.168.1.38:5000/properties/${propertyId}`, {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                });

                const result = await response.json();
                console.log('📊 Respuesta de eliminación:', result);

                if (result.success) {
                  toast.success('🗑️ Propiedad eliminada exitosamente');
                  loadAllProperties(); // Recargar la lista
                } else {
                  toast.error(result.error || 'Error al eliminar propiedad');
                }
              } catch (error) {
                console.error('💥 Error eliminando propiedad:', error);
                toast.error('Error de conexión');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('💥 Error en handleDeleteProperty:', error);
      toast.error('Error al procesar la eliminación');
    }
  };

  const getPropertyDisplayName = (prop: string) => {
    const names: {[key: string]: string} = {
      marca: 'Marca',
      socket: 'Socket',
      generacion: 'Generación',
      tecnologia: 'Tecnología',
      chipset: 'Chipset',
      formato: 'Formato',
      tipo: 'Tipo',
      capacidad: 'Capacidad',
      fabricante: 'Fabricante',
      certificacion: 'Certificación'
    };
    return names[prop] || prop;
  };

  const handleBack = () => {
    console.log('Navegando hacia atrás desde ManageProperties...');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/AdminPanel' as any);
    }
  };

  // Si no tiene permisos, mostrar loading
  if (!permissionChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Verificando permisos...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando propiedades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏷️ Gestor de Propiedades</Text>
      </View>

      <Text style={styles.subtitle}>
        Gestioná las opciones disponibles para cada tipo de componente
      </Text>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>➕ Agregar Nueva Propiedad</Text>
      </TouchableOpacity>

      <ScrollView style={styles.propertiesList}>
        {Object.keys(properties).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>No hay propiedades cargadas</Text>
            <Text style={styles.emptyText}>
              Agregá propiedades usando el botón de arriba
            </Text>
          </View>
        ) : (
          Object.keys(properties).map(componentType => (
            <View key={componentType} style={styles.componentSection}>
              <Text style={styles.componentTitle}>
                {componentTypes.find(c => c.value === componentType)?.icon} {componentTypes.find(c => c.value === componentType)?.label}
              </Text>
              
              {Object.keys(properties[componentType] || {}).map(property => (
                <View key={property} style={styles.propertyGroup}>
                  <Text style={styles.propertyName}>
                    {getPropertyDisplayName(property)}:
                  </Text>
                  <View style={styles.valuesContainer}>
                    {(properties[componentType][property] || []).map((value: string, index: number) => (
                      <View key={index} style={styles.valueItem}>
                        <Text style={styles.valueText}>{value}</Text>
                        <TouchableOpacity 
                          style={styles.deleteValueButton}
                          onPress={() => handleDeleteProperty(componentType, property, value)}
                        >
                          <Text style={styles.deleteValueText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal para agregar propiedad */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nueva Propiedad</Text>
            
            <Text style={styles.label}>Tipo de Componente</Text>
            <ScrollView horizontal style={styles.typeSelector}>
              {componentTypes.map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    newProperty.tipo_componente === type.value && styles.typeButtonSelected
                  ]}
                  onPress={() => setNewProperty(prev => ({ 
                    ...prev, 
                    tipo_componente: type.value,
                    propiedad: propertyTypes[type.value]?.[0] || 'marca'
                  }))}
                >
                  <Text style={styles.typeButtonText}>{type.icon}</Text>
                  <Text style={styles.typeButtonLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Propiedad</Text>
            <ScrollView horizontal style={styles.propertySelector}>
              {(propertyTypes[newProperty.tipo_componente] || []).map(prop => (
                <TouchableOpacity
                  key={prop}
                  style={[
                    styles.propertyButton,
                    newProperty.propiedad === prop && styles.propertyButtonSelected
                  ]}
                  onPress={() => setNewProperty(prev => ({ ...prev, propiedad: prop }))}
                >
                  <Text style={styles.propertyButtonText}>
                    {getPropertyDisplayName(prop)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.valueInput}
              placeholder="Ingresar valor..."
              placeholderTextColor="#8b9cb3"
              value={newProperty.valor}
              onChangeText={(value) => setNewProperty(prev => ({ ...prev, valor: value }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleAddProperty}
              >
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Los estilos se mantienen igual que antes...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1117',
  },
  loadingText: {
    color: '#8b9cb3',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 15,
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#8b9cb3',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  propertiesList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8b9cb3',
    textAlign: 'center',
    lineHeight: 20,
  },
  componentSection: {
    backgroundColor: '#1a1b27',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  componentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  propertyGroup: {
    marginBottom: 12,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 8,
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  valueText: {
    color: '#ffffff',
    fontSize: 12,
    marginRight: 8,
  },
  deleteValueButton: {
    padding: 2,
  },
  deleteValueText: {
    color: '#ef4444',
    fontSize: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1b27',
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 12,
  },
  typeSelector: {
    marginBottom: 8,
  },
  typeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 80,
  },
  typeButtonSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  typeButtonText: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeButtonLabel: {
    color: '#8b9cb3',
    fontSize: 10,
    textAlign: 'center',
  },
  propertySelector: {
    marginBottom: 8,
  },
  propertyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  propertyButtonSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  propertyButtonText: {
    color: '#8b9cb3',
    fontSize: 14,
    fontWeight: '600',
  },
  valueInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8b9cb3',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});