// app/(tabs)/ComponentsList.tsx - COMPLETAMENTE CORREGIDO
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../AuthContext';
import componentService from '../services/components';
import toast from '../utils/toast';

interface Component {
  id: number;
  marca: string;
  modelo: string;
  tipo: string;
  [key: string]: any;
}

export default function ComponentsList() {
  const { user, isAdmin } = useAuth();
  const params = useLocalSearchParams();
  const componentType = params.type as string;
  const componentName = params.name as string;
  
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {
    // Verificar permisos después de que el componente esté montado
    const checkPermissions = async () => {
      if (!isAdmin()) {
        toast.error('No tenés permisos para acceder');
        setTimeout(() => {
          router.back();
        }, 100);
        return false;
      }
      setPermissionChecked(true);
      return true;
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    if (permissionChecked) {
      loadComponents();
    }
  }, [componentType, permissionChecked]);

  useEffect(() => {
    filterComponents();
  }, [searchQuery, components]);

  const loadComponents = async () => {
    try {
      setLoading(true);
      console.log(`Cargando componentes de tipo: ${componentType}`);
      
      const result = await componentService.getComponents(componentType);
      
      if (result.success && result.data) {
        console.log(`Encontrados ${result.data.length} componentes`);
        const mappedComponents = result.data.map((comp: any) => ({
          ...comp,
          tipo: componentType
        }));
        
        setComponents(mappedComponents);
        setFilteredComponents(mappedComponents);
      } else {
        console.error('Error en la respuesta:', result.error);
        toast.error(result.error || 'Error cargando componentes');
        setComponents([]);
        setFilteredComponents([]);
      }
    } catch (error) {
      console.error('Error cargando componentes:', error);
      toast.error('Error de conexión');
      setComponents([]);
      setFilteredComponents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterComponents = () => {
    if (!components.length) {
      setFilteredComponents([]);
      return;
    }

    let filtered = [...components];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(comp =>
        comp.marca.toLowerCase().includes(query) ||
        comp.modelo.toLowerCase().includes(query)
      );
    }

    setFilteredComponents(filtered);
  };

  const handleEdit = (component: Component) => {
    console.log(`Editando componente: ${component.id}`);
    router.push({
      pathname: '/(tabs)/EditComponent',
      params: { type: componentType, id: component.id }
    } as any);
  };

  const handleDelete = (component: Component) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que querés eliminar ${component.marca} ${component.modelo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => deleteComponent(component.id) 
        }
      ]
    );
  };

  const deleteComponent = async (id: number) => {
    try {
      console.log(`Eliminando componente ID: ${id}, Tipo: ${componentType}`);
      
      let result;
      switch (componentType) {
        case 'procesadores':
          result = await componentService.deleteProcessor(id);
          break;
        case 'motherboards':
          result = await componentService.deleteMotherboard(id);
          break;
        case 'memorias_ram':
          result = await componentService.deleteRAM(id);
          break;
        default:
          toast.error('Tipo de componente no soportado');
          return;
      }

      console.log('Resultado de eliminación:', result);

      if (result.success) {
        toast.success('🗑️ Componente eliminado exitosamente');
        // Recargar la lista
        loadComponents();
      } else {
        toast.error(result.error || 'Error al eliminar componente');
      }
    } catch (error) {
      console.error('Error eliminando componente:', error);
      toast.error('Error de conexión');
    }
  };

  const getComponentIcon = () => {
    const icons: { [key: string]: string } = {
      procesadores: '⚡',
      motherboards: '🔌',
      memorias_ram: '💾',
      tarjetas_graficas: '🎯',
      almacenamiento: '💿',
      fuentes_poder: '🔋',
      gabinetes: '🖥️'
    };
    return icons[componentType] || '🔧';
  };

const handleBack = () => {
  console.log('Navegando hacia atrás...');
  if (router.canGoBack()) {
    router.back();
  } else {
    // Si no puede ir atrás, ir al admin panel
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
        <Text style={styles.loadingText}>Cargando {componentName}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {getComponentIcon()} {componentName}
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Buscar ${componentName.toLowerCase()}...`}
          placeholderTextColor="#8b9cb3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Resultados */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {filteredComponents.length} {componentName.toLowerCase()}{filteredComponents.length !== 1 ? 's' : ''} encontrado{filteredComponents.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.componentsList}>
        {filteredComponents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No se encontraron {componentName.toLowerCase()}s</Text>
            <Text style={styles.emptyText}>
              {components.length === 0 
                ? `No hay ${componentName.toLowerCase()}s en el sistema`
                : 'Probá con otros términos de búsqueda'
              }
            </Text>
          </View>
        ) : (
          filteredComponents.map((component) => (
            <View key={component.id} style={styles.componentCard}>
              <View style={styles.componentHeader}>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentBrand}>{component.marca}</Text>
                  <Text style={styles.componentModel}>{component.modelo}</Text>
                </View>
                <View style={styles.componentActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(component)}
                  >
                    <Text style={styles.editButtonText}>✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(component)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Información adicional */}
              <View style={styles.componentDetails}>
                {component.socket && (
                  <Text style={styles.detailText}>Socket: {component.socket}</Text>
                )}
                {component.tipo_memoria && (
                  <Text style={styles.detailText}>Memoria: {component.tipo_memoria}</Text>
                )}
                {component.nucleos && (
                  <Text style={styles.detailText}>Núcleos: {component.nucleos}</Text>
                )}
                {component.capacidad && (
                  <Text style={styles.detailText}>Capacidad: {component.capacidad}GB</Text>
                )}
                {component.tdp && (
                  <Text style={styles.detailText}>TDP: {component.tdp}W</Text>
                )}
                {component.chipset && (
                  <Text style={styles.detailText}>Chipset: {component.chipset}</Text>
                )}
                {component.formato && (
                  <Text style={styles.detailText}>Formato: {component.formato}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

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
    marginTop: 16,
    fontSize: 16,
    color: '#8b9cb3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
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
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#1a1b27',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    paddingLeft: 45,
    color: '#ffffff',
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 16,
    fontSize: 16,
  },
  resultsHeader: {
    marginBottom: 15,
  },
  resultsTitle: {
    color: '#8b9cb3',
    fontSize: 14,
    fontWeight: '600',
  },
  componentsList: {
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
  componentCard: {
    backgroundColor: '#1a1b27',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  componentInfo: {
    flex: 1,
  },
  componentBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 4,
  },
  componentModel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  componentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  editButtonText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  componentDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  detailText: {
    color: '#8b9cb3',
    fontSize: 12,
    marginBottom: 4,
  },
});