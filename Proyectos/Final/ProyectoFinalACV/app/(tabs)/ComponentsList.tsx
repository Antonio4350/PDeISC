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
  Alert,
  useWindowDimensions,
  Dimensions
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
  const { width } = useWindowDimensions();
  const isMobile = width < 400;
  
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

  const handleDelete = async (component: Component) => {
    Alert.alert(
      '🗑️ Eliminar Componente',
      `¿Querés eliminar a ${component.marca} ${component.modelo}?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteComponent(component.id);
          },
        },
      ],
    );
  };

  const deleteComponent = async (componentId: number) => {
    try {
      console.log(`[DELETE] Tipo: ${componentType}, ID: ${componentId}`);
      
      let result: any;
      
      switch (componentType) {
        case 'procesadores':
          result = await componentService.deleteProcessor(componentId);
          break;
        case 'motherboards':
          result = await componentService.deleteMotherboard(componentId);
          break;
        case 'memorias_ram':
          result = await componentService.deleteRAM(componentId);
          break;
        case 'tarjetas_graficas':
          result = await componentService.deleteGPU(componentId);
          break;
        case 'almacenamiento':
          result = await componentService.deleteStorage(componentId);
          break;
        case 'fuentes_poder':
          result = await componentService.deletePSU(componentId);
          break;
        case 'gabinetes':
          result = await componentService.deleteCase(componentId);
          break;
        default:
          toast.error(`Tipo no soportado: ${componentType}`);
          return;
      }

      console.log(`[DELETE RESULT]`, result);

      if (result?.success) {
        toast.success('✅ Eliminado!');
        setLoading(true);
        setTimeout(() => {
          loadComponents();
        }, 300);
      } else {
        toast.error(`Error: ${result?.error || 'Desconocido'}`);
      }
    } catch (err: any) {
      console.error(`[DELETE ERROR]`, err);
      toast.error(`Error de conexión`);
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
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <TouchableOpacity 
          style={[styles.backButton, isMobile && styles.backButtonMobile]} 
          onPress={handleBack}
        >
          <Text style={[styles.backButtonText, isMobile && styles.backButtonTextMobile]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          {getComponentIcon()} {isMobile ? componentName.substring(0, 10) : componentName}
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={[styles.searchContainer, isMobile && styles.searchContainerMobile]}>
        <TextInput
          style={[styles.searchInput, isMobile && styles.searchInputMobile]}
          placeholder={`Buscar ${componentName.toLowerCase()}...`}
          placeholderTextColor="#8b9cb3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Resultados */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsTitle, isMobile && styles.resultsTitleMobile]}>
          {filteredComponents.length} encontrado{filteredComponents.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.componentsList}>
        {filteredComponents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyTitle, isMobile && styles.emptyTitleMobile]}>No se encontraron</Text>
            <Text style={[styles.emptyText, isMobile && styles.emptyTextMobile]}>
              {components.length === 0 
                ? `No hay ${componentName.toLowerCase()}s`
                : 'Probá otros términos'
              }
            </Text>
          </View>
        ) : (
          filteredComponents.map((component) => (
            <View key={component.id} style={[styles.componentCard, isMobile && styles.componentCardMobile]}>
              <View style={[styles.componentHeader, isMobile && styles.componentHeaderMobile]}>
                <View style={styles.componentInfo}>
                  <Text style={[styles.componentBrand, isMobile && styles.componentBrandMobile]}>{component.marca}</Text>
                  <Text style={[styles.componentModel, isMobile && styles.componentModelMobile]}>{component.modelo}</Text>
                </View>
                <View style={[styles.componentActions, isMobile && styles.componentActionsMobile]}>
                  <TouchableOpacity
                    style={[styles.editButton, isMobile && styles.editButtonMobile]}
                    onPress={() => handleEdit(component)}
                  >
                    <Text style={[styles.editButtonText, isMobile && styles.editButtonTextMobile]}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deleteButton, isMobile && styles.deleteButtonMobile]}
                    onPress={() => handleDelete(component)}
                  >
                    <Text style={[styles.deleteButtonText, isMobile && styles.deleteButtonTextMobile]}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Información adicional */}
              <View style={[styles.componentDetails, isMobile && styles.componentDetailsMobile]}>
                {component.socket && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>Socket: {component.socket}</Text>
                )}
                {component.tipo_memoria && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>Memoria: {component.tipo_memoria}</Text>
                )}
                {component.nucleos && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>Núcleos: {component.nucleos}</Text>
                )}
                {component.capacidad && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>Cap: {component.capacidad}GB</Text>
                )}
                {component.tdp && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>TDP: {component.tdp}W</Text>
                )}
                {component.chipset && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>Chipset: {component.chipset}</Text>
                )}
                {component.formato && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>Formato: {component.formato}</Text>
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
  headerMobile: {
    marginBottom: 15,
    paddingHorizontal: 0,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 15,
  },
  backButtonMobile: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  backButtonTextMobile: {
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    flex: 1,
  },
  titleMobile: {
    fontSize: 16,
    fontWeight: '700',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchContainerMobile: {
    marginBottom: 12,
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
  searchInputMobile: {
    padding: 12,
    paddingLeft: 40,
    fontSize: 14,
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
  resultsTitleMobile: {
    fontSize: 12,
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
  emptyTitleMobile: {
    fontSize: 14,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#8b9cb3',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyTextMobile: {
    fontSize: 12,
    lineHeight: 16,
  },
  componentCard: {
    backgroundColor: '#1a1b27',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  componentCardMobile: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  componentHeaderMobile: {
    marginBottom: 10,
    flexWrap: 'wrap',
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
  componentBrandMobile: {
    fontSize: 12,
    marginBottom: 2,
  },
  componentModel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  componentModelMobile: {
    fontSize: 14,
    fontWeight: '600',
  },
  componentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  componentActionsMobile: {
    gap: 6,
  },
  editButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  editButtonMobile: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  editButtonTextMobile: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  deleteButtonMobile: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButtonTextMobile: {
    fontSize: 16,
  },
  componentDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  componentDetailsMobile: {
    paddingTop: 8,
  },
  detailText: {
    color: '#8b9cb3',
    fontSize: 12,
    marginBottom: 4,
  },
  detailTextMobile: {
    fontSize: 10,
    marginBottom: 2,
  },
});