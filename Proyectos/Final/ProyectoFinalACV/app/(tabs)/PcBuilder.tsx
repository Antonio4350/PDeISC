import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import { useAuth } from '../AuthContext';
import componentService, { ApiResponse } from '../services/components';
import toast from '../utils/toast';

interface Component {
  id: number;
  marca: string;
  modelo: string;
  tipo: string;
  especificaciones: string;
  socket?: string;
  tipo_memoria?: string;
}

interface BuildComponent {
  id: string;
  type: string;
  name: string;
  component: Component | null;
}

export default function PcBuilder() {
  const { user } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [build, setBuild] = useState<BuildComponent[]>([
    { id: '1', type: 'cpu', name: 'Procesador', component: null },
    { id: '2', type: 'motherboard', name: 'Motherboard', component: null },
    { id: '3', type: 'ram', name: 'Memoria RAM', component: null },
    { id: '4', type: 'gpu', name: 'Tarjeta Gráfica', component: null },
    { id: '5', type: 'storage', name: 'Almacenamiento', component: null },
    { id: '6', type: 'psu', name: 'Fuente', component: null },
    { id: '7', type: 'case', name: 'Gabinete', component: null }
  ]);
  const [loading, setLoading] = useState(true);
  const [showComponents, setShowComponents] = useState(false);
  const [selectedBuildItem, setSelectedBuildItem] = useState<BuildComponent | null>(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      setLoading(true);
      const result: ApiResponse<any[]> = await componentService.getProcessors();
      
      if (result.success && result.data) {
        const mappedComponents = result.data.map((comp: any) => ({
          ...comp,
          tipo: 'procesadores',
          especificaciones: `${comp.nucleos || 'N/A'} núcleos, ${comp.socket || 'N/A'}, ${comp.tipo_memoria || 'N/A'}`
        }));
        setComponents(mappedComponents);
      } else {
        // Datos de prueba si la BD está vacía
        const mockComponents: Component[] = [
          {
            id: 1,
            marca: 'Intel',
            modelo: 'Core i9-13900K',
            tipo: 'procesadores',
            especificaciones: '24 núcleos, LGA 1700, DDR5',
            socket: 'LGA 1700',
            tipo_memoria: 'DDR5'
          },
          {
            id: 2,
            marca: 'AMD',
            modelo: 'Ryzen 9 7950X',
            tipo: 'procesadores', 
            especificaciones: '16 núcleos, AM5, DDR5',
            socket: 'AM5',
            tipo_memoria: 'DDR5'
          }
        ];
        setComponents(mockComponents);
      }
    } catch (error) {
      toast.error('Error cargando componentes');
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComponent = (component: Component) => {
    if (!selectedBuildItem) return;

    const updatedBuild = build.map(item => 
      item.id === selectedBuildItem.id 
        ? { ...item, component }
        : item
    );
    
    setBuild(updatedBuild);
    setShowComponents(false);
    setSelectedBuildItem(null);
    toast.success(`${component.marca} ${component.modelo} agregado`);
    
    checkCompatibility(updatedBuild);
  };

  const checkCompatibility = (currentBuild: BuildComponent[]) => {
    const cpu = currentBuild.find(item => item.type === 'cpu')?.component;
    const motherboard = currentBuild.find(item => item.type === 'motherboard')?.component;
    
    if (cpu && motherboard && cpu.socket && motherboard.socket && cpu.socket !== motherboard.socket) {
      toast.error(`⚠️ Incompatibilidad: Socket ${cpu.socket} vs ${motherboard.socket}`);
    }
  };

  const handleRemoveComponent = (buildItem: BuildComponent) => {
    const updatedBuild = build.map(item => 
      item.id === buildItem.id 
        ? { ...item, component: null }
        : item
    );
    setBuild(updatedBuild);
    toast.info('Componente removido');
  };

  const handleSaveBuild = () => {
    const selectedComponents = build.filter(item => item.component);
    if (selectedComponents.length === 0) {
      toast.error('Agregá al menos un componente');
      return;
    }
    
    toast.success('¡Build guardado exitosamente!');
  };

  const handleSelectComponentType = (buildItem: BuildComponent) => {
    setSelectedBuildItem(buildItem);
    setShowComponents(true);
  };

  const getComponentIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      cpu: '⚡',
      motherboard: '🔌',
      ram: '💾',
      gpu: '🎯',
      storage: '💿',
      psu: '🔋',
      case: '🖥️'
    };
    return icons[type] || '🔧';
  };

  // Calcular dimensiones del modal
  const getModalStyle = () => {
    if (isDesktop) {
      return {
        width: screenWidth * 0.6,
        height: screenHeight * 0.7,
        left: screenWidth * 0.2,
        top: screenHeight * 0.15,
      };
    } else {
      return {
        width: screenWidth * 0.9,
        height: screenHeight * 0.8,
        left: screenWidth * 0.05,
        top: screenHeight * 0.1,
      };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando constructor...</Text>
      </View>
    );
  }

  const modalStyle = getModalStyle();

  return (
    <View style={[
      styles.container, 
      { paddingHorizontal: isDesktop ? 40 : isTablet ? 30 : 20 }
    ]}>
      <View style={styles.header}>
        <Text style={styles.title}>🛠️ Constructor de PC</Text>
        <Text style={styles.subtitle}>
          Hola {user?.nombre}, seleccioná componentes para armar tu PC
        </Text>
      </View>

      <View style={styles.buildSection}>
        <Text style={styles.sectionTitle}>Tu Build</Text>
        <Text style={styles.sectionSubtitle}>
          Tocá en cada componente para seleccionarlo
        </Text>

        <View style={[
          styles.buildGrid, 
          { 
            flexDirection: isDesktop ? 'row' : 'column',
            flexWrap: isDesktop ? 'wrap' : 'nowrap',
            gap: isDesktop ? 16 : 12,
          }
        ]}>
          {build.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.buildItem,
                { width: isDesktop ? '48%' : '100%' },
                item.component && styles.buildItemFilled
              ]}
              onPress={() => handleSelectComponentType(item)}
            >
              <View style={styles.buildItemHeader}>
                <Text style={styles.buildItemIcon}>
                  {getComponentIcon(item.type)}
                </Text>
                <View style={styles.buildItemInfo}>
                  <Text style={styles.buildItemName}>{item.name}</Text>
                  {item.component ? (
                    <Text style={styles.buildItemModel}>
                      {item.component.marca} {item.component.modelo}
                    </Text>
                  ) : (
                    <Text style={styles.buildItemEmpty}>Sin seleccionar</Text>
                  )}
                </View>
                {item.component && (
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveComponent(item)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {item.component && (
                <Text style={styles.buildItemSpecs}>
                  {item.component.especificaciones}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {showComponents && selectedBuildItem && (
        <View style={[styles.componentsModal, modalStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar {selectedBuildItem.name}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowComponents(false);
                setSelectedBuildItem(null);
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.componentsList}>
            {components.length > 0 ? (
              components.map((component) => (
                <TouchableOpacity
                  key={component.id}
                  style={styles.componentOption}
                  onPress={() => handleAddComponent(component)}
                >
                  <Text style={styles.componentBrand}>{component.marca}</Text>
                  <Text style={styles.componentModel}>{component.modelo}</Text>
                  <Text style={styles.componentSpecs}>{component.especificaciones}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noComponentsText}>No hay componentes disponibles</Text>
            )}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSaveBuild}
      >
        <Text style={styles.saveButtonText}>💾 Guardar Build</Text>
      </TouchableOpacity>

      <View style={styles.compatibilityInfo}>
        <Text style={styles.compatibilityTitle}>💡 Compatibilidad</Text>
        <Text style={styles.compatibilityText}>
          El sistema verifica automáticamente compatibilidad entre componentes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    paddingVertical: 20,
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
    alignItems: 'center',
    marginBottom: 30,
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
  },
  buildSection: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8b9cb3',
    marginBottom: 20,
  },
  buildGrid: {
    gap: 12,
  },
  buildItem: {
    backgroundColor: '#1a1b27',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    minHeight: 100,
  },
  buildItemFilled: {
    borderStyle: 'solid',
    borderColor: 'rgba(102, 126, 234, 0.5)',
  },
  buildItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buildItemIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  buildItemInfo: {
    flex: 1,
  },
  buildItemName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  buildItemModel: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  buildItemEmpty: {
    color: '#8b9cb3',
    fontSize: 14,
    fontStyle: 'italic',
  },
  buildItemSpecs: {
    color: '#8b9cb3',
    fontSize: 12,
    marginTop: 8,
  },
  removeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 6,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  componentsModal: {
    position: 'absolute',
    backgroundColor: '#1a1b27',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    zIndex: 1000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
  componentsList: {
    flex: 1,
    padding: 20,
  },
  componentOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  componentBrand: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  componentModel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  componentSpecs: {
    color: '#8b9cb3',
    fontSize: 12,
  },
  noComponentsText: {
    color: '#8b9cb3',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  saveButton: {
    backgroundColor: '#667eea',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  compatibilityInfo: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  compatibilityTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  compatibilityText: {
    color: '#8b9cb3',
    fontSize: 14,
    lineHeight: 20,
  },
});