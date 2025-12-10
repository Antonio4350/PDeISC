import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
  TextInput
} from 'react-native';
import { useAuth } from '../AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import componentService, { ApiResponse } from '../services/components';
import projectService from '../services/projectService';
import toast from '../utils/toast';

interface Component {
  id: number;
  marca: string;
  modelo: string;
  tipo: string;
  especificaciones: string;
  socket?: string;
  tipo_memoria?: string;
  formato?: string;
  imagen_url?: string;
  [key: string]: any;
}

interface BuildComponent {
  id: string;
  type: string;
  name: string;
  component: Component | null;
  components: Component[];
  compatible: boolean;
}

interface ComponentCategory {
  type: string;
  name: string;
  icon: string;
  color: string;
  endpoint: string;
}

// Componentes separados para evitar re-renders
const ProjectNameInput = React.memo(({ 
  value, 
  onChangeText, 
  isEditingProject, 
  projectId 
}: { 
  value: string; 
  onChangeText: (text: string) => void;
  isEditingProject: boolean;
  projectId?: string;
}) => {
  const inputRef = useRef<TextInput>(null);
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (text: string) => {
    setLocalValue(text);
    onChangeText(text);
  };

  const handleBlur = () => {
    if (localValue.trim().length === 0 && !projectId) {
      const newValue = `Mi Build ${new Date().toLocaleDateString()}`;
      setLocalValue(newValue);
      onChangeText(newValue);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Nombre de la Build *</Text>
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        value={localValue}
        onChangeText={handleChange}
        onBlur={handleBlur}
        placeholder="Ej: Mi PC Gaming 2024"
        placeholderTextColor="#8b9cb3"
        maxLength={100}
        autoCorrect={false}
        autoCapitalize="words"
        returnKeyType="next"
        selectTextOnFocus={true}
      />
      {localValue.length === 0 && (
        <Text style={styles.inputErrorText}>El nombre es requerido</Text>
      )}
    </View>
  );
});

const ProjectDescriptionInput = React.memo(({ 
  value, 
  onChangeText 
}: { 
  value: string; 
  onChangeText: (text: string) => void;
}) => {
  const inputRef = useRef<TextInput>(null);
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (text: string) => {
    setLocalValue(text);
    onChangeText(text);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Descripción (opcional)</Text>
      <TextInput
        ref={inputRef}
        style={[styles.textInput, styles.textArea]}
        value={localValue}
        onChangeText={handleChange}
        placeholder="Describe tu build..."
        placeholderTextColor="#8b9cb3"
        multiline
        numberOfLines={3}
        maxLength={500}
        autoCorrect={true}
        autoCapitalize="sentences"
        returnKeyType="default"
        blurOnSubmit={true}
        selectTextOnFocus={true}
      />
      <Text style={styles.inputCharCount}>
        {localValue.length}/500 caracteres
      </Text>
    </View>
  );
});

const ProjectInfoSection = React.memo(({ 
  projectName, 
  setProjectName, 
  projectDescription, 
  setProjectDescription,
  isEditingProject,
  projectId
}: { 
  projectName: string;
  setProjectName: (text: string) => void;
  projectDescription: string;
  setProjectDescription: (text: string) => void;
  isEditingProject: boolean;
  projectId?: string;
}) => {
  return (
    <View style={styles.projectInfoSection}>
      <Text style={styles.projectInfoTitle}>
        {isEditingProject ? 'Editando Proyecto' : 'Nueva Build'}
      </Text>
      
      <ProjectNameInput
        value={projectName}
        onChangeText={setProjectName}
        isEditingProject={isEditingProject}
        projectId={projectId}
      />
      
      <ProjectDescriptionInput
        value={projectDescription}
        onChangeText={setProjectDescription}
      />
    </View>
  );
});

const BuildItem = React.memo(({ 
  item, 
  onRemove 
}: { 
  item: BuildComponent; 
  onRemove: () => void;
}) => (
  <View style={[
    styles.buildItem,
    item.component || item.components.length > 0 ? 
      (item.compatible ? styles.buildItemCompatible : styles.buildItemIncompatible) 
      : styles.buildItemEmpty
  ]}>
    <View style={styles.buildItemHeader}>
      <View style={styles.buildItemInfo}>
        <Text style={styles.buildItemName}>{item.name}</Text>
        {item.component ? (
          <Text style={styles.buildItemModel}>
            {item.component.marca} {item.component.modelo}
          </Text>
        ) : item.components.length > 0 ? (
          <View>
            <Text style={styles.buildItemModel}>
              {item.components.length} {item.name.toLowerCase()}
            </Text>
            {item.components.length > 1 && (
              <Text style={styles.componentList}>
                {item.components.map((comp, idx) => 
                  `${comp.marca} ${comp.modelo}${idx < item.components.length - 1 ? ', ' : ''}`
                )}
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.buildItemEmptyText}>
            Sin seleccionar
          </Text>
        )}
      </View>

      <View style={styles.buildItemActions}>
        {(item.component || item.components.length > 0) && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
        <View style={[
          styles.compatibilityCircle,
          item.component || item.components.length > 0 ?
            (item.compatible ? styles.compatibleCircle : styles.incompatibleCircle)
            : styles.emptyCircle
        ]} />
      </View>
    </View>

    {item.component && (
      <Text style={styles.buildItemSpecs}>
        {item.component.especificaciones}
      </Text>
    )}
  </View>
));

const CategoryButton = React.memo(({ 
  category, 
  isSelected, 
  hasSelection, 
  onPress 
}: { 
  category: ComponentCategory; 
  isSelected: boolean; 
  hasSelection: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[
      styles.categoryButton,
      { backgroundColor: category.color },
      isSelected && styles.categoryButtonActive,
      hasSelection && styles.categoryButtonSelected
    ]}
    onPress={onPress}
  >
    <Text style={styles.categoryIcon}>{category.icon}</Text>
    <Text style={styles.categoryName}>{category.name}</Text>
    {hasSelection && <View style={styles.categorySelectionDot} />}
  </TouchableOpacity>
));

export default function PcBuilder() {
  const { user } = useAuth();
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  
  const [allComponents, setAllComponents] = useState<{ [key: string]: Component[] }>({});
  const [filteredComponents, setFilteredComponents] = useState<{ [key: string]: Component[] }>({});
  const [build, setBuild] = useState<BuildComponent[]>([
    { id: '1', type: 'cpu', name: 'Procesador', component: null, components: [], compatible: true },
    { id: '2', type: 'motherboard', name: 'Motherboard', component: null, components: [], compatible: true },
    { id: '3', type: 'ram', name: 'Memoria RAM', component: null, components: [], compatible: true },
    { id: '4', type: 'gpu', name: 'Tarjeta Gráfica', component: null, components: [], compatible: true },
    { id: '5', type: 'storage', name: 'Almacenamiento', component: null, components: [], compatible: true },
    { id: '6', type: 'psu', name: 'Fuente de Poder', component: null, components: [], compatible: true },
    { id: '7', type: 'case', name: 'Gabinete', component: null, components: [], compatible: true }
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('cpu');
  const [activeTab, setActiveTab] = useState<'build' | 'components'>('components');
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [isEditingProject, setIsEditingProject] = useState<boolean>(false);
  const [initialProjectData, setInitialProjectData] = useState<any>(null);

  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;
  
  const componentCategories: ComponentCategory[] = [
    { type: 'cpu', name: 'Procesadores', icon: '⚡', color: '#FF6B6B', endpoint: 'processors' },
    { type: 'motherboard', name: 'Motherboards', icon: '🔌', color: '#4ECDC4', endpoint: 'motherboards' },
    { type: 'ram', name: 'Memoria RAM', icon: '💾', color: '#45B7D1', endpoint: 'ram' },
    { type: 'gpu', name: 'Tarjetas Gráficas', icon: '🎮', color: '#F7DC6F', endpoint: 'tarjetas_graficas' },
    { type: 'storage', name: 'Almacenamiento', icon: '💿', color: '#98D8C8', endpoint: 'almacenamiento' },
    { type: 'psu', name: 'Fuentes', icon: '🔋', color: '#FFEAA7', endpoint: 'fuentes_poder' },
    { type: 'case', name: 'Gabinetes', icon: '🖥️', color: '#DDA0DD', endpoint: 'gabinetes' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        
        if (projectId) {
          await Promise.all([
            loadExistingProject(parseInt(projectId)),
            loadAllComponents()
          ]);
        } else {
          await loadAllComponents();
          setProjectName(`Mi Build ${new Date().toLocaleDateString()}`);
          setProjectDescription(`Build creada el ${new Date().toLocaleString()}`);
        }
      } catch (error) {
        console.error('Error en inicialización:', error);
        toast.error('Error al cargar');
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [projectId]);

  // Solo cargar componentes una vez
  const loadAllComponents = async () => {
    try {
      const componentsData: { [key: string]: Component[] } = {};

      for (const category of componentCategories) {
        try {
          let result: ApiResponse<any[]>;

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

          if (result.success && result.data) {
            componentsData[category.type] = result.data.map((comp: any) => ({
              ...comp,
              id: comp.id,
              marca: comp.marca || 'Sin marca',
              modelo: comp.modelo || 'Sin modelo',
              tipo: category.type,
              especificaciones: generateSpecifications(comp, category.type),
              socket: comp.socket,
              tipo_memoria: comp.tipo_memoria || comp.tipo,
              formato: comp.formato,
              imagen_url: comp.imagen_url,
            }));
          } else {
            componentsData[category.type] = [];
          }
        } catch (error) {
          console.error(`Error cargando ${category.name}:`, error);
          componentsData[category.type] = [];
        }
      }

      setAllComponents(componentsData);
      setFilteredComponents(componentsData);
      return componentsData;
      
    } catch (error) {
      console.error('Error general cargando componentes:', error);
      toast.error('Error cargando componentes');
      return {};
    }
  };

  const loadExistingProject = async (id: number) => {
    try {
      const result = await projectService.getProjectById(id);
      
      if (result.success && result.data) {
        const project = result.data;
        setInitialProjectData(project);
        setProjectName(project.nombre || 'Sin nombre');
        setProjectDescription(project.descripcion || 'Sin descripción');
        setIsEditingProject(true);
        return project;
      } else {
        toast.error(result.error || 'Error cargando proyecto');
        return null;
      }
    } catch (error) {
      console.error('Error cargando proyecto:', error);
      toast.error('Error cargando proyecto');
      return null;
    }
  };

  // Función para generar especificaciones (sin dependencias de estado)
  const generateSpecifications = (component: any, type: string): string => {
    const specs = [];

    switch (type) {
      case 'cpu':
        if (component.nucleos) specs.push(`${component.nucleos} núcleos`);
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
        if (component.nucleos_cuda) specs.push(`${component.nucleos_cuda} núcleos`);
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
        if (component.formato) specs.push(`Soporta: ${component.formato}`);
        if (component.motherboards_soportadas) specs.push(component.motherboards_soportadas);
        break;
    }

    return specs.join(' • ') || 'Especificaciones no disponibles';
  };

  // Función simple para agregar componentes
  const handleAddComponent = (component: Component) => {
    setBuild(prevBuild => {
      const updatedBuild = prevBuild.map(item => {
        if (item.type !== component.tipo) return item;

        if (item.type === 'ram' || item.type === 'storage') {
          const alreadyExists = item.components.some(comp => comp.id === component.id);
          if (alreadyExists) {
            toast.info('Este componente ya está en tu build');
            return item;
          }
          
          const newComponents = [...item.components, component];
          
          return {
            ...item,
            components: newComponents,
            component: component,
            compatible: true // No verificar compatibilidad inmediatamente
          };
        }

        return { 
          ...item, 
          component, 
          components: [component],
          compatible: true // No verificar compatibilidad inmediatamente
        };
      });

      toast.success(`${component.marca} ${component.modelo} agregado`);
      return updatedBuild;
    });
  };

  // Función simple para remover componentes
  const handleRemoveComponent = (buildItemId: string, componentIndex?: number) => {
    setBuild(prevBuild => {
      const updatedBuild = prevBuild.map(item => {
        if (item.id !== buildItemId) return item;

        if (componentIndex !== undefined && (item.type === 'ram' || item.type === 'storage')) {
          const newComponents = item.components.filter((_, idx) => idx !== componentIndex);
          
          return {
            ...item,
            components: newComponents,
            component: newComponents.length > 0 ? newComponents[newComponents.length - 1] : null,
            compatible: true
          };
        }

        return {
          ...item,
          component: null,
          components: [],
          compatible: true
        };
      });

      toast.info('Componente removido');
      return updatedBuild;
    });
  };

  const handleSaveBuild = async () => {
    if (!user) {
      Alert.alert('Iniciar sesión requerido', 'Para guardar tu build necesitás iniciar sesión.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Iniciar sesión', onPress: () => router.push('/(tabs)/Login') }
      ]);
      return;
    }

    const selectedComponents = build.filter(item => item.component || item.components.length > 0);
    if (selectedComponents.length === 0) {
      toast.error('Agrega al menos un componente');
      return;
    }

    if (!projectName.trim()) {
      toast.error('Ingresá un nombre para tu build');
      return;
    }

    // Preparar componentes para enviar
    const componentes: any[] = [];
    const visto = new Set();
    
    for (const item of build) {
      if (item.component) {
        const key = `${item.type}-${item.component.id}`;
        if (!visto.has(key)) {
          visto.add(key);
          componentes.push({
            tipo_componente: item.type,
            componente_id: item.component.id
          });
        }
      }
      
      if (item.components.length > 0) {
        for (const component of item.components) {
          const key = `${item.type}-${component.id}`;
          if (!visto.has(key)) {
            visto.add(key);
            componentes.push({
              tipo_componente: item.type,
              componente_id: component.id
            });
          }
        }
      }
    }

    const projectData = {
      nombre: projectName.trim(),
      descripcion: projectDescription.trim() || `Build ${isEditingProject ? 'actualizada' : 'creada'} el ${new Date().toLocaleString()}`,
      componentes: componentes
    };

    try {
      setSaving(true);
      
      let result;
      
      if (isEditingProject && projectId) {
        result = await projectService.updateProject(parseInt(projectId), projectData);
      } else {
        result = await projectService.createProject(projectData);
      }
      
      if (result.success) {
        const successMessage = isEditingProject ? 'Proyecto actualizado exitosamente!' : 'Build guardada exitosamente!';
        toast.success(successMessage);
        
        setTimeout(() => {
          router.push('/(tabs)/Projects');
        }, 1500);
        
      } else {
        Alert.alert(
          'Error',
          `No se pudo ${isEditingProject ? 'actualizar' : 'guardar'} la build: ${result.error || 'Error desconocido'}`,
          [{ text: 'OK', style: 'default' }]
        );
      }
      
    } catch (error: any) {
      console.error('Error en la solicitud:', error);
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar al servidor. Verificá tu conexión a internet.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const getCurrentCategoryComponents = (): Component[] => {
    return allComponents[selectedCategory] || [];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>
          {projectId ? 'Cargando proyecto...' : 'Cargando componentes...'}
        </Text>
      </View>
    );
  }

  const currentComponents = getCurrentCategoryComponents();
  const selectedComponentsCount = build.filter(item => item.component || item.components.length > 0).length;

  // Render para móvil
  if (isMobile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {isEditingProject ? '✏️ Editar Build' : '🔧 Constructor de PC'}
            </Text>
            {!user && <Text style={styles.guestMode}>👤 Modo Invitado</Text>}
          </View>
          
          {isEditingProject && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.push('/(tabs)/Projects')}
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
          )}
        </View>

        {!user && (
          <View style={styles.guestInfoBox}>
            <Text style={styles.guestInfoText}>
              ⚠️ <Text style={styles.guestInfoBold}>Modo invitado:</Text> Iniciá sesión para guardar tus builds.
            </Text>
          </View>
        )}

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
          <ScrollView 
            style={styles.mobilePanel}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <ProjectInfoSection
              projectName={projectName}
              setProjectName={setProjectName}
              projectDescription={projectDescription}
              setProjectDescription={setProjectDescription}
              isEditingProject={isEditingProject}
              projectId={projectId}
            />

            <View style={styles.buildSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{selectedComponentsCount}</Text>
                <Text style={styles.summaryLabel}>Componentes</Text>
              </View>
            </View>

            <ScrollView style={styles.buildList} nestedScrollEnabled>
              {build.map((item) => (
                <BuildItem
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemoveComponent(item.id)}
                />
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.saveButton,
                selectedComponentsCount === 0 && styles.saveButtonDisabled,
                !user && styles.guestSaveButton,
                saving && styles.saveButtonDisabled
              ]}
              onPress={handleSaveBuild}
              disabled={selectedComponentsCount === 0 || saving || !projectName.trim()}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {user ? (isEditingProject ? '💾 Actualizar Build' : '💾 Guardar Build') : '🔒 Iniciar sesión para guardar'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.mobilePanel}>
            <View style={styles.categoriesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                {componentCategories.map((category) => (
                  <CategoryButton
                    key={category.type}
                    category={category}
                    isSelected={selectedCategory === category.type}
                    hasSelection={!!build.find(item => item.type === category.type)?.component}
                    onPress={() => setSelectedCategory(category.type)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.componentsSection}>
              <Text style={styles.componentsTitle}>
                {componentCategories.find(cat => cat.type === selectedCategory)?.name} ({currentComponents.length})
              </Text>

              <ScrollView 
                style={styles.componentsList}
                keyboardShouldPersistTaps="handled"
              >
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
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {isEditingProject ? '✏️ Editar Build' : '🔧 Constructor de PC'}
          </Text>
          {!user && <Text style={styles.guestMode}>👤 Modo Invitado</Text>}
        </View>
        
        {isEditingProject && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/Projects')}
          >
            <Text style={styles.backButtonText}>← Volver a Mis Proyectos</Text>
          </TouchableOpacity>
        )}
      </View>

      {!user && (
        <View style={styles.guestInfoBox}>
          <Text style={styles.guestInfoText}>
            ⚠️ <Text style={styles.guestInfoBold}>Modo invitado:</Text> Iniciá sesión para guardar tus builds.
          </Text>
        </View>
      )}

      <View style={styles.desktopContent}>
        {/* Panel izquierdo: Build */}
        <View style={styles.buildPanel}>
          <ScrollView 
            style={styles.buildPanelContent} 
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <ProjectInfoSection
              projectName={projectName}
              setProjectName={setProjectName}
              projectDescription={projectDescription}
              setProjectDescription={setProjectDescription}
              isEditingProject={isEditingProject}
              projectId={projectId}
            />

            <View style={styles.buildSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{selectedComponentsCount}</Text>
                <Text style={styles.summaryLabel}>Componentes</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Componentes Seleccionados</Text>
            
            <View style={styles.buildList}>
              {build.map((item) => (
                <BuildItem
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemoveComponent(item.id)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                selectedComponentsCount === 0 && styles.saveButtonDisabled,
                !user && styles.guestSaveButton,
                saving && styles.saveButtonDisabled
              ]}
              onPress={handleSaveBuild}
              disabled={selectedComponentsCount === 0 || saving || !projectName.trim()}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {user ? (isEditingProject ? '💾 Actualizar Build' : '💾 Guardar Build') : '🔒 Iniciar sesión para guardar'}
                </Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.spacer} />
          </ScrollView>
        </View>

        {/* Panel derecho: Componentes */}
        <View style={styles.componentsPanel}>
          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>Selecciona una categoría:</Text>
            <View style={styles.categoriesGrid}>
              {componentCategories.map((category) => (
                <CategoryButton
                  key={category.type}
                  category={category}
                  isSelected={selectedCategory === category.type}
                  hasSelection={!!build.find(item => item.type === category.type)?.component}
                  onPress={() => setSelectedCategory(category.type)}
                />
              ))}
            </View>
          </View>

          <View style={styles.componentsSection}>
            <Text style={styles.componentsTitle}>
              {componentCategories.find(cat => cat.type === selectedCategory)?.name} ({currentComponents.length})
            </Text>

            <ScrollView 
              style={styles.componentsList} 
              contentContainerStyle={styles.componentsListContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
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
                    <Text style={styles.addButton}>+ Agregar al Build</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {currentComponents.length === 0 && (
                <View style={styles.noComponents}>
                  <Text style={styles.noComponentsText}>
                    No hay componentes disponibles
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 70,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  backButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
    minWidth: 120,
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  guestMode: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  guestInfoBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  guestInfoText: {
    color: '#ffd700',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  guestInfoBold: {
    fontWeight: '700',
  },
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
    fontSize: 14,
  },
  tabTextActive: {
    color: '#667eea',
    fontWeight: '700',
  },
  desktopContent: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
  },
  buildPanel: {
    flex: 1,
    maxWidth: 450,
    backgroundColor: '#1a1b27',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  buildPanelContent: {
    flex: 1,
    padding: 20,
  },
  componentsPanel: {
    flex: 2,
    backgroundColor: '#1a1b27',
    minHeight: 0,
  },
  mobilePanel: {
    flex: 1,
    backgroundColor: '#1a1b27',
  },
  projectInfoSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  projectInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b9cb3',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  inputCharCount: {
    color: '#8b9cb3',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    marginTop: 8,
  },
  spacer: {
    height: 20,
  },
  buildSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
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
  buildList: {
    marginBottom: 20,
    minHeight: 300,
  },
  buildItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  buildItemEmpty: {
    borderLeftColor: '#8b9cb3',
    opacity: 0.7,
  },
  buildItemCompatible: {
    borderLeftColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
  componentList: {
    fontSize: 12,
    color: '#8b9cb3',
    marginTop: 2,
    fontStyle: 'italic',
  },
  buildItemEmptyText: {
    fontSize: 14,
    color: '#8b9cb3',
    fontStyle: 'italic',
  },
  buildItemSpecs: {
    fontSize: 12,
    color: '#8b9cb3',
    lineHeight: 16,
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
  saveButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#8b9cb3',
    opacity: 0.6,
  },
  guestSaveButton: {
    backgroundColor: '#ff6b6b',
    shadowColor: '#ff6b6b',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  categoriesContainer: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesSection: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoriesScroll: {},
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
    height: 70,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonActive: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryButtonSelected: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryName: {
    color: '#1a1b27',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  categorySelectionDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a1b27',
  },
  componentsSection: {
    flex: 1,
    padding: 20,
    minHeight: 0,
  },
  componentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  componentsList: {
    flex: 1,
    minHeight: 0,
  },
  componentsListContent: {
    paddingBottom: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentBrand: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  componentImagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  componentImageText: {
    fontSize: 20,
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
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noComponentsText: {
    color: '#8b9cb3',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noComponentsSubtext: {
    color: '#8b9cb3',
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});