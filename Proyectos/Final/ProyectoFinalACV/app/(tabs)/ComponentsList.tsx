import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
  Modal
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
  const { user, isAdmin, isLoading: authLoading, authChecked } = useAuth();
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
  const [accessDenied, setAccessDenied] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<Component | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    console.log('useEffect ejecutándose');
    console.log('authLoading:', authLoading);
    console.log('authChecked:', authChecked);
    console.log('user:', user);
    console.log('permissionChecked:', permissionChecked);
    
    // Esperar a que la verificación de autenticación haya terminado
    if (!authChecked) {
      console.log('Esperando verificación de autenticación...');
      return;
    }

    const verifyPermissions = () => {
      console.log('Verificando permisos...');
      
      if (!user) {
        console.log('No hay usuario autenticado');
        toast.error('Debés iniciar sesión para acceder');
        setAccessDenied(true);
        setTimeout(() => {
          router.push('/(tabs)/Login');
        }, 1500);
        return false;
      }
      
      const adminCheck = isAdmin();
      console.log('Es admin?', adminCheck);
      
      if (!adminCheck) {
        console.log('Usuario no es admin');
        toast.error('No tenés permisos de administrador');
        setAccessDenied(true);
        setTimeout(() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('./index');
          }
        }, 1500);
        return false;
      }
      
      console.log('Permisos verificados correctamente');
      setPermissionChecked(true);
      return true;
    };

    const hasPermission = verifyPermissions();
    
    if (hasPermission) {
      loadComponents();
    }
  }, [authChecked, user, componentType]);

  useEffect(() => {
    filterComponents();
  }, [searchQuery, components]);

  const loadComponents = async () => {
    try {
      setLoading(true);
      console.log(`Cargando componentes de tipo: ${componentType}`);
      
      let result: any;
      
      // USAR LOS MÉTODOS CORRECTOS (como en PcBuilder)
      switch (componentType) {
        case 'procesadores':
          result = await componentService.getProcessors();
          break;
        case 'motherboards':
          result = await componentService.getMotherboards();
          break;
        case 'memorias_ram':
          result = await componentService.getRAM();
          break;
        case 'tarjetas_graficas':
          result = await componentService.getGPUs();
          break;
        case 'almacenamiento':
          result = await componentService.getStorage();
          break;
        case 'fuentes_poder':
          result = await componentService.getPSUs();
          break;
        case 'gabinetes':
          result = await componentService.getCases();
          break;
        default:
          console.error(`Tipo no soportado: ${componentType}`);
          toast.error('Tipo de componente no válido');
          setComponents([]);
          setFilteredComponents([]);
          return;
      }
      
      if (result.success && result.data) {
        console.log(`Encontrados ${result.data.length} componentes`);
        // Mapear los componentes con el tipo correcto
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
    console.log(`Editando componente: ${component.id}, Tipo: ${componentType}`);
    
    // Verificar que el componente tenga ID válido
    if (!component.id || component.id <= 0) {
      toast.error('ID de componente inválido');
      return;
    }
    
    router.push({
      pathname: '/(tabs)/EditComponent',
      params: { 
        type: componentType, 
        id: component.id.toString() 
      }
    } as any);
  };

  const handleDelete = (component: Component) => {
    setComponentToDelete(component);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!componentToDelete) return;

    try {
      setDeleting(true);
      console.log(`🗑️ Eliminando componente: ${componentType}, ID: ${componentToDelete.id}`);
      
      let result: any;
      
      // USAR LOS MÉTODOS REALES DEL COMPONENT SERVICE
      switch (componentType) {
        case 'procesadores':
          result = await componentService.deleteProcessor(componentToDelete.id);
          break;
        case 'motherboards':
          result = await componentService.deleteMotherboard(componentToDelete.id);
          break;
        case 'memorias_ram':
          result = await componentService.deleteRAM(componentToDelete.id);
          break;
        case 'tarjetas_graficas':
          result = await componentService.deleteGPU(componentToDelete.id);
          break;
        case 'almacenamiento':
          result = await componentService.deleteStorage(componentToDelete.id);
          break;
        case 'fuentes_poder':
          result = await componentService.deletePSU(componentToDelete.id);
          break;
        case 'gabinetes':
          result = await componentService.deleteCase(componentToDelete.id);
          break;
        default:
          toast.error(`Tipo no soportado: ${componentType}`);
          setDeleteModalVisible(false);
          setComponentToDelete(null);
          setDeleting(false);
          return;
      }

      console.log(`Resultado eliminación:`, result);

      if (result?.success) {
        toast.success(`${componentToDelete.marca} ${componentToDelete.modelo} eliminado!`);
        
        const updatedComponents = components.filter(
          comp => comp.id !== componentToDelete.id
        );
        setComponents(updatedComponents);
        setFilteredComponents(updatedComponents);
        
      } else {
        toast.error(`Error: ${result?.error || 'Error al eliminar'}`);
      }
    } catch (err: any) {
      console.error(`Error eliminando:`, err);
      toast.error(`Error de conexión: ${err.message || 'Verifica el backend'}`);
    } finally {
      setDeleting(false);
      setDeleteModalVisible(false);
      setComponentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setComponentToDelete(null);
  };

  const getComponentIcon = () => {
    const icons: { [key: string]: string } = {
      procesadores: '⚡',
      motherboards: '🔌',
      memorias_ram: '💾',
      tarjetas_graficas: '🎮',
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
      router.push('/(tabs)/AdminPanel' as any);
    }
  };

  // Modal de confirmación de eliminación
  const DeleteConfirmationModal = () => {
    if (!componentToDelete) return null;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isMobile && styles.modalContainerMobile]}>
            <Text style={[styles.modalTitle, isMobile && styles.modalTitleMobile]}>
              🗑️ Eliminar Componente
            </Text>
            
            <View style={styles.modalContent}>
              <Text style={[styles.modalText, isMobile && styles.modalTextMobile]}>
                ¿Estás seguro de que querés eliminar?
              </Text>
              
              <View style={[styles.componentToDelete, isMobile && styles.componentToDeleteMobile]}>
                <Text style={[styles.deleteBrand, isMobile && styles.deleteBrandMobile]}>
                  {componentToDelete.marca}
                </Text>
                <Text style={[styles.deleteModel, isMobile && styles.deleteModelMobile]}>
                  {componentToDelete.modelo}
                </Text>
              </View>
              
              <Text style={[styles.warningText, isMobile && styles.warningTextMobile]}>
                ⚠️ Esta acción no se puede deshacer.
              </Text>
            </View>
            
            <View style={[styles.modalButtons, isMobile && styles.modalButtonsMobile]}>
              <TouchableOpacity
                style={[styles.cancelButton, isMobile && styles.cancelButtonMobile]}
                onPress={cancelDelete}
                disabled={deleting}
              >
                <Text style={[styles.cancelButtonText, isMobile && styles.cancelButtonTextMobile]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmDeleteButton, isMobile && styles.confirmDeleteButtonMobile]}
                onPress={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={[styles.confirmDeleteButtonText, isMobile && styles.confirmDeleteButtonTextMobile]}>
                    Eliminar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // 1. Mientras auth está cargando
  if (authLoading || !authChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>
          {authLoading ? 'Verificando autenticación...' : 'Cargando permisos...'}
        </Text>
      </View>
    );
  }

  // 2. Si el acceso fue denegado
  if (accessDenied) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Text style={styles.accessDeniedIcon}>🔒</Text>
        <Text style={styles.accessDeniedTitle}>Acceso Denegado</Text>
        <Text style={styles.accessDeniedText}>
          No tenés permisos para acceder a esta sección.
        </Text>
        <Text style={styles.accessDeniedSubtext}>
          Solo administradores pueden acceder.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Si todavía no se verificaron permisos
  if (!permissionChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Verificando permisos...</Text>
      </View>
    );
  }

  // 4. Loading de componentes
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando {componentName}...</Text>
      </View>
    );
  }

  // 5. Render normal
  return (
    <View style={styles.container}>
      <DeleteConfirmationModal />
      
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
                ? `No hay ${componentName.toLowerCase()}s en la base de datos`
                : 'Probá otros términos de búsqueda'
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
                {component.frecuencia_base && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>Frecuencia: {component.frecuencia_base}GHz</Text>
                )}
                {component.tecnologia && (
                  <Text style={[styles.detailText, isMobile && styles.detailTextMobile]}>Tecnología: {component.tecnologia}</Text>
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
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1117',
    padding: 20,
  },
  accessDeniedIcon: {
    fontSize: 64,
    marginBottom: 20,
    color: '#ef4444',
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#8b9cb3',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  accessDeniedSubtext: {
    fontSize: 14,
    color: '#8b9cb3',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
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
  backButtonMobile: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
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
    color: '#8b9cb3',
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
    color: '#8b9cb3',
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
    flexWrap: 'wrap',
  },
  componentDetailsMobile: {
    paddingTop: 8,
  },
  detailText: {
    color: '#8b9cb3',
    fontSize: 12,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  detailTextMobile: {
    fontSize: 10,
    marginBottom: 2,
  },
  // Modal de confirmación
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1b27',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContainerMobile: {
    padding: 16,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalTitleMobile: {
    fontSize: 18,
    marginBottom: 16,
  },
  modalContent: {
    marginBottom: 24,
  },
  modalText: {
    fontSize: 16,
    color: '#8b9cb3',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalTextMobile: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  componentToDelete: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 20,
    alignItems: 'center',
  },
  componentToDeleteMobile: {
    padding: 12,
    marginBottom: 16,
  },
  deleteBrand: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 4,
  },
  deleteBrandMobile: {
    fontSize: 16,
  },
  deleteModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  deleteModelMobile: {
    fontSize: 14,
  },
  warningText: {
    fontSize: 14,
    color: '#ffd700',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  warningTextMobile: {
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButtonsMobile: {
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonMobile: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#8b9cb3',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonTextMobile: {
    fontSize: 14,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmDeleteButtonMobile: {
    paddingVertical: 12,
  },
  confirmDeleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  confirmDeleteButtonTextMobile: {
    fontSize: 14,
  },
});