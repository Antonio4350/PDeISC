import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Alert
} from 'react-native';
import { useAuth } from '../AuthContext';
import componentService, { ApiResponse } from '../services/components';
import advancedCompatibility from '../services/advancedCompatibility';
import toast from '../utils/toast';

interface Component {
  id: number;
  marca: string;
  modelo: string;
  tipo: string;
  especificaciones: string;
  socket?: string;
  tipo_memoria?: string;
  imagen_url?: string;
  [key: string]: any;
}

interface BuildComponent {
  id: string;
  type: string;
  name: string;
  component: Component | null;
  components: Component[]; // Para soportar múltiples (RAM, Storage)
  compatible: boolean;
  compatibilityIssues: string[];
  warnings: string[];
}

interface ComponentCategory {
  type: string;
  name: string;
  icon: string;
  color: string;
  endpoint: string;
}

export default function PcBuilder() {
  const { user } = useAuth();
  const [allComponents, setAllComponents] = useState<{ [key: string]: Component[] }>({});
  const [build, setBuild] = useState<BuildComponent[]>([
    { id: '1', type: 'cpu', name: 'Procesador', component: null, components: [], compatible: true, compatibilityIssues: [], warnings: [] },
    { id: '2', type: 'motherboard', name: 'Motherboard', component: null, components: [], compatible: true, compatibilityIssues: [], warnings: [] },
    { id: '3', type: 'ram', name: 'Memoria RAM', component: null, components: [], compatible: true, compatibilityIssues: [], warnings: [] },
    { id: '4', type: 'gpu', name: 'Tarjeta Grafica', component: null, components: [], compatible: true, compatibilityIssues: [], warnings: [] },
    { id: '5', type: 'storage', name: 'Almacenamiento', component: null, components: [], compatible: true, compatibilityIssues: [], warnings: [] },
    { id: '6', type: 'psu', name: 'Fuente de Poder', component: null, components: [], compatible: true, compatibilityIssues: [], warnings: [] },
    { id: '7', type: 'case', name: 'Gabinete', component: null, components: [], compatible: true, compatibilityIssues: [], warnings: [] }
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('cpu');
  const [activeTab, setActiveTab] = useState<'build' | 'components'>('components');

  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const componentCategories: ComponentCategory[] = [
    {
      type: 'cpu',
      name: 'Procesadores',
      icon: '⚡',
      color: '#FF6B6B',
      endpoint: 'processors'
    },
    {
      type: 'motherboard',
      name: 'Motherboards',
      icon: '🔌',
      color: '#4ECDC4',
      endpoint: 'motherboards'
    },
    {
      type: 'ram',
      name: 'Memoria RAM',
      icon: '💾',
      color: '#45B7D1',
      endpoint: 'ram'
    },
    {
      type: 'gpu',
      name: 'Tarjetas Graficas',
      icon: '🎯',
      color: '#F7DC6F',
      endpoint: 'tarjetas_graficas'
    },
    {
      type: 'storage',
      name: 'Almacenamiento',
      icon: '💿',
      color: '#98D8C8',
      endpoint: 'almacenamiento'
    },
    {
      type: 'psu',
      name: 'Fuentes',
      icon: '🔋',
      color: '#FFEAA7',
      endpoint: 'fuentes_poder'
    },
    {
      type: 'case',
      name: 'Gabinetes',
      icon: '🖥️',
      color: '#DDA0DD',
      endpoint: 'gabinetes'
    }
  ];

  useEffect(() => {
    loadAllComponents();
  }, []);

  const loadAllComponents = async () => {
    try {
      setLoading(true);
      const componentsData: { [key: string]: Component[] } = {};

      for (const category of componentCategories) {
        try {
          console.log(`Cargando componentes de: ${category.endpoint}`);
          let result: ApiResponse<any[]>;

          // Usar los métodos específicos para cada tipo
          switch (category.endpoint) {
            case 'processors':
              result = await componentService.getProcessors();
              break;
            case 'motherboards':
              result = await componentService.getMotherboards();
              break;
            case 'ram':
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
              result = { success: false, error: 'Endpoint no válido' };
          }

          console.log(`Resultado para ${category.endpoint}:`, result);

          if (result.success && result.data && result.data.length > 0) {
            componentsData[category.type] = result.data.map((comp: any) => ({
              ...comp,
              id: comp.id,
              marca: comp.marca || 'Sin marca',
              modelo: comp.modelo || 'Sin modelo',
              tipo: category.type,  // Override the 'tipo' from API with the category type
              especificaciones: generateSpecifications(comp, category.type),
              socket: comp.socket,
              tipo_memoria: comp.tipo_memoria,
              imagen_url: comp.imagen_url,
            }));
            console.log(`${category.name}: ${componentsData[category.type].length} componentes cargados`);
            console.log(`First component of ${category.type}:`, componentsData[category.type][0]);
          } else {
            console.log(`❌ ${category.name}: No hay datos o error en la respuesta`, result.error);
            componentsData[category.type] = [];
          }
        } catch (error) {
          console.error(`Error cargando ${category.name}:`, error);
          componentsData[category.type] = [];
        }
      }

      setAllComponents(componentsData);
    } catch (error) {
      console.error('Error general cargando componentes:', error);
      const emptyData: { [key: string]: Component[] } = {};
      componentCategories.forEach(category => {
        emptyData[category.type] = [];
      });
      setAllComponents(emptyData);
    } finally {
      setLoading(false);
    }
  };

  const generateSpecifications = (component: any, type: string): string => {
    const specs = [];

    console.log(`Generating specs for ${type}:`, { 
      type, 
      capacidad: component.capacidad, 
      tipo: component.tipo,
      velocidad_mhz: component.velocidad_mhz,
      interfaz: component.interfaz 
    });

    switch (type) {
      case 'cpu':
        if (component.nucleos) specs.push(`${component.nucleos} nucleos`);
        if (component.socket) specs.push(`Socket ${component.socket}`);
        if (component.tipo_memoria) specs.push(component.tipo_memoria);
        if (component.frecuencia_base) specs.push(`${component.frecuencia_base}GHz`);
        break;
      case 'motherboard':
        if (component.socket) specs.push(`Socket ${component.socket}`);
        if (component.tipo_memoria) specs.push(component.tipo_memoria);
        if (component.formato) specs.push(component.formato);
        if (component.chipset) specs.push(component.chipset);
        break;
      case 'ram':
        if (component.capacidad) specs.push(`${component.capacidad}GB`);
        if (component.tipo) specs.push(component.tipo);
        if (component.velocidad_mhz) specs.push(`${component.velocidad_mhz}MHz`);
        if (component.velocidad_mt) specs.push(`${component.velocidad_mt}MT/s`);
        if (component.latencia) specs.push(`CL${component.latencia}`);
        break;
      case 'gpu':
        if (component.memoria) specs.push(`${component.memoria}GB`);
        if (component.tipo_memoria) specs.push(component.tipo_memoria);
        if (component.nucleos_cuda) specs.push(`${component.nucleos_cuda} nucleos`);
        break;
      case 'storage':
        if (component.capacidad) specs.push(`${component.capacidad}GB`);
        if (component.tipo) specs.push(component.tipo);
        if (component.interfaz) specs.push(component.interfaz);
        break;
      case 'psu':
        if (component.potencia) specs.push(`${component.potencia}W`);
        if (component.certificacion) specs.push(component.certificacion);
        break;
      case 'case':
        if (component.formato) specs.push(component.formato);
        if (component.motherboards_soportadas) specs.push(component.motherboards_soportadas);
        break;
    }

    const result = specs.join(' • ') || 'Especificaciones no disponibles';
    console.log(`Generated specs for ${type}: ${result}`);
    return result;
  };

  const handleAddComponent = (component: Component) => {
    console.log(`Agregando componente:`, { component, tipo: component.tipo });
    
    const updatedBuild = build.map(item => {
      const shouldAdd = item.type === component.tipo || item.type === (component as any).type;
      
      if (!shouldAdd) return item;

      // Para RAM y Storage, agregar a la lista de múltiples componentes
      if (item.type === 'ram' || item.type === 'storage') {
        return {
          ...item,
          components: [...item.components, component],
          component: component // También guardar el último agregado
        };
      }

      // Para otros componentes, reemplazar el actual
      return { ...item, component, components: [component] };
    });

    setBuild(updatedBuild);
    toast.success(`${component.marca} ${component.modelo} agregado`);

    setTimeout(() => checkAllCompatibility(updatedBuild), 100);
  };

  const handleRemoveComponent = (buildItem: BuildComponent, componentIndex?: number) => {
    const updatedBuild = build.map(item => {
      if (item.id !== buildItem.id) return item;

      // Si hay índice específico, es para eliminar de la lista de múltiples
      if (componentIndex !== undefined && (item.type === 'ram' || item.type === 'storage')) {
        const newComponents = item.components.filter((_, idx) => idx !== componentIndex);
        return {
          ...item,
          components: newComponents,
          component: newComponents.length > 0 ? newComponents[newComponents.length - 1] : null,
          compatible: true,
          compatibilityIssues: [],
          warnings: []
        };
      }

      // Si no hay índice, limpiar todo
      return {
        ...item,
        component: null,
        components: [],
        compatible: true,
        compatibilityIssues: [],
        warnings: []
      };
    });

    setBuild(updatedBuild);
    toast.info('Componente removido');
    checkAllCompatibility(updatedBuild);
  };

  const checkAllCompatibility = async (currentBuild: BuildComponent[]) => {
    try {
      const cpu = currentBuild.find(i => i.type === 'cpu')?.component;
      const motherboard = currentBuild.find(i => i.type === 'motherboard')?.component;
      const rams = currentBuild.find(i => i.type === 'ram')?.components || [];
      const gpu = currentBuild.find(i => i.type === 'gpu')?.component;
      const storages = currentBuild.find(i => i.type === 'storage')?.components || [];
      const psu = currentBuild.find(i => i.type === 'psu')?.component;
      const caseComponent = currentBuild.find(i => i.type === 'case')?.component;

      let compatibilityResults: { [key: string]: any } = {};

      // Socket validation
      if (cpu && motherboard && cpu.id && motherboard.id) {
        const socketResult = await advancedCompatibility.validateSocketCompatibility(
          cpu.id,
          motherboard.id
        );
        compatibilityResults['socket'] = socketResult;
      }

      // RAM validation
      if (rams.length > 0 && motherboard && motherboard.id) {
        const ramIds = rams.map(r => r.id);
        const ramResult = await advancedCompatibility.validateRAMCompatibility(
          ramIds,
          motherboard.id
        );
        compatibilityResults['ram'] = ramResult;
      }

      // Storage validation
      if (storages.length > 0 && motherboard && motherboard.id && caseComponent && caseComponent.id) {
        const storageIds = storages.map(s => s.id);
        const storageResult = await advancedCompatibility.validateStorageCompatibility(
          storageIds,
          motherboard.id,
          caseComponent.id
        );
        compatibilityResults['storage'] = storageResult;
      }

      // GPU validation
      if (gpu && gpu.id && motherboard && motherboard.id && caseComponent && caseComponent.id) {
        const gpuResult = await advancedCompatibility.validateGPUCompatibility(
          gpu.id,
          motherboard.id,
          caseComponent.id
        );
        compatibilityResults['gpu'] = gpuResult;
      }

      // Power validation
      if (psu && psu.id && cpu && cpu.id) {
        const powerResult = await advancedCompatibility.validatePowerSupply(
          cpu.id,
          psu.id,
          gpu?.id,
          rams.map(r => r.id),
          storages.map(s => s.id)
        );
        compatibilityResults['power'] = powerResult;
      }

      // Update build with compatibility info
      const updatedBuild = currentBuild.map(item => {
        let compatible = true;
        const issues: string[] = [];
        const warnings: string[] = [];

        // Check compatibility results for this item type
        for (const [key, result] of Object.entries(compatibilityResults)) {
          if (result && !result.compatible) {
            if (key === item.type || (item.type === 'ram' && key === 'ram') || (item.type === 'storage' && key === 'storage')) {
              compatible = false;
              if (result.issues) {
                issues.push(...result.issues);
              }
            }
          }
          if (result && result.warnings) {
            warnings.push(...result.warnings);
          }
        }

        return {
          ...item,
          compatible,
          compatibilityIssues: issues,
          warnings
        };
      });

      setBuild(updatedBuild);
    } catch (error) {
      console.error('Error checking compatibility:', error);
      // Fallback to basic compatibility check
      const updatedBuild = currentBuild.map(item => {
        const issues: string[] = [];
        let compatible = true;

        if (!item.component && item.components.length === 0) {
          return { ...item, compatible: true, compatibilityIssues: [], warnings: [] };
        }

        const cpu = currentBuild.find(i => i.type === 'cpu')?.component;
        const motherboard = currentBuild.find(i => i.type === 'motherboard')?.component;
        const ram = currentBuild.find(i => i.type === 'ram')?.component;

        switch (item.type) {
          case 'cpu':
            if (motherboard && item.component?.socket && motherboard.socket && item.component.socket !== motherboard.socket) {
              issues.push(`Socket incompatible (${item.component.socket} vs ${motherboard.socket})`);
              compatible = false;
            }
            break;
          case 'motherboard':
            if (cpu && item.component?.socket && cpu.socket && item.component.socket !== cpu.socket) {
              issues.push(`Socket incompatible (${item.component.socket} vs ${cpu.socket})`);
              compatible = false;
            }
            break;
          case 'ram':
            if (motherboard && ram?.tipo_memoria && motherboard.tipo_memoria && ram.tipo_memoria !== motherboard.tipo_memoria) {
              issues.push(`Tipo de memoria incompatible`);
              compatible = false;
            }
            break;
        }

        if (issues.length === 0 && (item.component || item.components.length > 0)) {
          compatible = true;
        }

        return { ...item, compatible, compatibilityIssues: issues, warnings: [] };
      });

      setBuild(updatedBuild);
    }
  };

  const handleSaveBuild = () => {
    const selectedComponents = build.filter(item => item.component);
    if (selectedComponents.length === 0) {
      toast.error('Agrega al menos un componente');
      return;
    }

    const incompatibleComponents = build.filter(item => !item.compatible && item.component);
    if (incompatibleComponents.length > 0) {
      Alert.alert(
        'Problemas de compatibilidad',
        'Hay componentes incompatibles en tu build. ¿Estas seguro de querer guardar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Guardar',
            onPress: () => {
              toast.success('Build guardado!');
            }
          }
        ]
      );
    } else {
      toast.success('Build guardado!');
    }
  };

  const getCurrentCategoryComponents = (): Component[] => {
    const components = allComponents[selectedCategory] || [];
    console.log(`getCurrentCategoryComponents for ${selectedCategory}:`, {
      count: components.length,
      firstComponent: components[0],
      selectedCategory,
      allComponentsKeys: Object.keys(allComponents)
    });
    return components;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando componentes...</Text>
      </View>
    );
  }

  const currentComponents = getCurrentCategoryComponents();
  const selectedComponentsCount = build.filter(item => item.component).length;
  const incompatibleComponentsCount = build.filter(item => !item.compatible && item.component).length;

  // Render para móvil
  if (isMobile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Constructor de PC</Text>
        </View>

        {/* TABS PARA MÓVIL - AHORA MÁS ARRIBA */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'components' && styles.tabActive]}
            onPress={() => setActiveTab('components')}
          >
            <Text style={[styles.tabText, activeTab === 'components' && styles.tabTextActive]}>
              Componentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'build' && styles.tabActive]}
            onPress={() => setActiveTab('build')}
          >
            <Text style={[styles.tabText, activeTab === 'build' && styles.tabTextActive]}>
              Mi Build ({selectedComponentsCount})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'build' ? (
          /* PANEL BUILD PARA MÓVIL - CONTENIDO MÁS ARRIBA */
          <View style={styles.mobilePanel}>
            <View style={styles.buildSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{selectedComponentsCount}</Text>
                <Text style={styles.summaryLabel}>Componentes</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[
                  styles.summaryNumber,
                  incompatibleComponentsCount > 0 ? styles.summaryNumberError : styles.summaryNumberSuccess
                ]}>
                  {incompatibleComponentsCount}
                </Text>
                <Text style={styles.summaryLabel}>Incompatibles</Text>
              </View>
            </View>

            <ScrollView style={styles.buildList}>
              {build.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.buildItem,
                    !item.compatible && styles.buildItemIncompatible,
                    !item.component && styles.buildItemEmpty
                  ]}
                >
                  <View style={styles.buildItemHeader}>
                    <View style={styles.buildItemInfo}>
                      <Text style={styles.buildItemName}>{item.name}</Text>
                      {item.component ? (
                        <Text style={styles.buildItemModel}>
                          {item.component.marca} {item.component.modelo}
                        </Text>
                      ) : (
                        <Text style={styles.buildItemEmptyText}>
                          Sin seleccionar
                        </Text>
                      )}
                    </View>

                    <View style={styles.buildItemActions}>
                      {item.component && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveComponent(item)}
                        >
                          <Text style={styles.removeButtonText}>✕</Text>
                        </TouchableOpacity>
                      )}
                      <View style={[
                        styles.compatibilityCircle,
                        item.component ?
                          (item.compatible ? styles.compatibleCircle : styles.incompatibleCircle)
                          : styles.emptyCircle
                      ]} />
                    </View>
                  </View>

                  {item.component && item.compatibilityIssues.length > 0 && (
                    <View style={styles.compatibilityDetails}>
                      {item.compatibilityIssues.map((issue, index) => (
                        <Text
                          key={index}
                          style={[
                            styles.compatibilityIssue,
                            issue.includes('Compatible') ? styles.compatibilitySuccess : styles.compatibilityError
                          ]}
                        >
                          {issue}
                        </Text>
                      ))}
                    </View>
                  )}

                  {item.component && (
                    <Text style={styles.buildItemSpecs}>
                      {item.component.especificaciones}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.saveButton,
                selectedComponentsCount === 0 && styles.saveButtonDisabled
              ]}
              onPress={handleSaveBuild}
              disabled={selectedComponentsCount === 0}
            >
              <Text style={styles.saveButtonText}>Guardar Build</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* PANEL COMPONENTES PARA MÓVIL - CONTENIDO MÁS ARRIBA */
          <View style={styles.mobilePanel}>
            {/* CATEGORÍAS MÁS ARRIBA */}
            <View style={styles.categoriesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                {componentCategories.map((category) => (
                  <TouchableOpacity
                    key={category.type}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: category.color },
                      selectedCategory === category.type && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category.type)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* COMPONENTES INMEDIATAMENTE DEBAJO DE LAS CATEGORÍAS */}
            <View style={styles.componentsSection}>
              <Text style={styles.componentsTitle}>
                {componentCategories.find(cat => cat.type === selectedCategory)?.name} ({currentComponents.length})
              </Text>

              <ScrollView style={styles.componentsList}>
                {currentComponents.map((component) => (
                  <TouchableOpacity
                    key={component.id}
                    style={styles.componentCard}
                    onPress={() => handleAddComponent(component)}
                  >
                    <View style={styles.componentHeader}>
                      <Text style={styles.componentBrand}>{component.marca}</Text>
                    </View>

                    <Text style={styles.componentModel}>{component.modelo}</Text>
                    <Text style={styles.componentSpecs}>{component.especificaciones}</Text>

                    <View style={styles.componentFooter}>
                      <Text style={styles.addButton}>+ Agregar</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {currentComponents.length === 0 && (
                  <View style={styles.noComponents}>
                    <Text style={styles.noComponentsText}>
                      No hay componentes disponibles
                    </Text>
                    <Text style={styles.noComponentsSubtext}>
                      Esta categoria esta vacia en la base de datos
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  }

  // Render para Desktop/Tablet - ESTRUCTURA MEJORADA
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Constructor de PC</Text>
      </View>

      <View style={styles.desktopContent}>
        {/* PANEL IZQUIERDO - BUILD */}
        <View style={styles.buildPanel}>
          <Text style={styles.panelTitle}>Tu Build</Text>

          <View style={styles.buildSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{selectedComponentsCount}</Text>
              <Text style={styles.summaryLabel}>Componentes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[
                styles.summaryNumber,
                incompatibleComponentsCount > 0 ? styles.summaryNumberError : styles.summaryNumberSuccess
              ]}>
                {incompatibleComponentsCount}
              </Text>
              <Text style={styles.summaryLabel}>Incompatibles</Text>
            </View>
          </View>

          <ScrollView style={styles.buildList}>
            {build.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.buildItem,
                  !item.compatible && styles.buildItemIncompatible,
                  !item.component && styles.buildItemEmpty
                ]}
              >
                <View style={styles.buildItemHeader}>
                  <View style={styles.buildItemInfo}>
                    <Text style={styles.buildItemName}>{item.name}</Text>
                    {item.component ? (
                      <Text style={styles.buildItemModel}>
                        {item.component.marca} {item.component.modelo}
                      </Text>
                    ) : (
                      <Text style={styles.buildItemEmptyText}>
                        Sin seleccionar
                      </Text>
                    )}
                  </View>

                  <View style={styles.buildItemActions}>
                    {item.component && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveComponent(item)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    )}
                    <View style={[
                      styles.compatibilityCircle,
                      item.component ?
                        (item.compatible ? styles.compatibleCircle : styles.incompatibleCircle)
                        : styles.emptyCircle
                    ]} />
                  </View>
                </View>

                {item.component && item.compatibilityIssues.length > 0 && (
                  <View style={styles.compatibilityDetails}>
                    {item.compatibilityIssues.map((issue, index) => (
                      <Text
                        key={index}
                        style={[
                          styles.compatibilityIssue,
                          issue.includes('Compatible') ? styles.compatibilitySuccess : styles.compatibilityError
                        ]}
                      >
                        {issue}
                      </Text>
                    ))}
                  </View>
                )}

                {item.component && (
                  <Text style={styles.buildItemSpecs}>
                    {item.component.especificaciones}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.saveButton,
              selectedComponentsCount === 0 && styles.saveButtonDisabled
            ]}
            onPress={handleSaveBuild}
            disabled={selectedComponentsCount === 0}
          >
            <Text style={styles.saveButtonText}>Guardar Build</Text>
          </TouchableOpacity>
        </View>

        {/* PANEL DERECHO - COMPONENTES CON MEJOR ESTRUCTURA */}
        <View style={styles.componentsPanel}>
          {/* CATEGORÍAS EN LA PARTE SUPERIOR */}
          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>Selecciona una categoria:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {componentCategories.map((category) => (
                <TouchableOpacity
                  key={category.type}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: category.color },
                    selectedCategory === category.type && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.type)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* COMPONENTES INMEDIATAMENTE DEBAJO */}
          <View style={styles.componentsSection}>
            <Text style={styles.componentsTitle}>
              {componentCategories.find(cat => cat.type === selectedCategory)?.name} ({currentComponents.length})
            </Text>

            <ScrollView style={styles.componentsList}>
              {currentComponents.map((component) => (
                <TouchableOpacity
                  key={`${component.tipo}-${component.id}`}
                  style={styles.componentCard}
                  onPress={() => handleAddComponent(component)}
                >
                  <View style={styles.componentHeader}>
                    <Text style={styles.componentBrand}>{component.marca}</Text>
                  </View>

                  <Text style={styles.componentModel}>{component.modelo}</Text>
                  <Text style={styles.componentSpecs}>{component.especificaciones}</Text>

                  <View style={styles.componentFooter}>
                    <Text style={styles.addButton}>+ Agregar al Build</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {currentComponents.length === 0 && (
                <View style={styles.noComponents}>
                  <Text style={styles.noComponentsText}>
                    No hay componentes disponibles
                  </Text>
                  <Text style={styles.noComponentsSubtext}>
                    Esta categoria esta vacia en la base de datos
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
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
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#1a1b27',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  // Tabs para móvil
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1b27',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
  },
  tabText: {
    color: '#8b9cb3',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#667eea',
    fontWeight: '700',
  },
  // Layout desktop
  desktopContent: {
    flex: 1,
    flexDirection: 'row',
  },
  // Paneles
  buildPanel: {
    flex: 1,
    maxWidth: 400,
    backgroundColor: '#1a1b27',
    padding: 16,
  },
  componentsPanel: {
    flex: 2,
    backgroundColor: '#1a1b27',
    padding: 0, // Eliminamos padding general para control específico
  },
  mobilePanel: {
    flex: 1,
    backgroundColor: '#1a1b27',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  // Build Summary
  buildSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  summaryNumberSuccess: {
    color: '#10B981',
  },
  summaryNumberError: {
    color: '#EF4444',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8b9cb3',
    fontWeight: '600',
  },
  // Build List
  buildList: {
    flex: 1,
    marginBottom: 16,
  },
  buildItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  buildItemEmpty: {
    borderLeftColor: '#8b9cb3',
    opacity: 0.7,
  },
  buildItemIncompatible: {
    borderLeftColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  buildItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  buildItemInfo: {
    flex: 1,
  },
  buildItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  buildItemModel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  buildItemEmptyText: {
    fontSize: 14,
    color: '#8b9cb3',
    fontStyle: 'italic',
  },
  buildItemSpecs: {
    fontSize: 12,
    color: '#8b9cb3',
    marginTop: 8,
  },
  buildItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  // Círculos de compatibilidad
  compatibilityCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  compatibleCircle: {
    backgroundColor: '#10B981',
  },
  incompatibleCircle: {
    backgroundColor: '#EF4444',
  },
  emptyCircle: {
    backgroundColor: '#8b9cb3',
  },
  compatibilityDetails: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
  },
  compatibilityIssue: {
    fontSize: 11,
    marginBottom: 2,
  },
  compatibilitySuccess: {
    color: '#10B981',
  },
  compatibilityError: {
    color: '#EF4444',
  },
  // Botón guardar
  saveButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#8b9cb3',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // CATEGORÍAS MEJOR POSICIONADAS
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesSection: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  categoriesScroll: {
    // El scroll ahora está contenido dentro de su sección
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
    height: 80,
  },
  categoryButtonActive: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryName: {
    color: '#1a1b27',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  // COMPONENTES MEJOR POSICIONADOS
  componentsSection: {
    flex: 1,
    padding: 16,
    paddingTop: 8, // Menos espacio arriba para estar más cerca de las categorías
  },
  componentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  componentsList: {
    flex: 1,
  },
  componentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  componentHeader: {
    marginBottom: 8,
  },
  componentBrand: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  componentModel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  componentSpecs: {
    color: '#8b9cb3',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  componentFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
  noComponents: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noComponentsText: {
    color: '#8b9cb3',
    fontSize: 16,
    marginBottom: 8,
  },
  noComponentsSubtext: {
    color: '#8b9cb3',
    fontSize: 14,
    opacity: 0.7,
  },
});