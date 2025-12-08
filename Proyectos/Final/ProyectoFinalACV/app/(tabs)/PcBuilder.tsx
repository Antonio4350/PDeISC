// pcbuilder.tsx - VERSIÓN FINAL CORREGIDA CON INPUTS FUNCIONALES
import React, { useState, useEffect, useCallback } from 'react';
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

  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const componentCategories: ComponentCategory[] = [
    { type: 'cpu', name: 'Procesadores', icon: '⚡', color: '#FF6B6B', endpoint: 'processors' },
    { type: 'motherboard', name: 'Motherboards', icon: '🔌', color: '#4ECDC4', endpoint: 'motherboards' },
    { type: 'ram', name: 'Memoria RAM', icon: '💾', color: '#45B7D1', endpoint: 'ram' },
    { type: 'gpu', name: 'Tarjetas Gráficas', icon: '🎯', color: '#F7DC6F', endpoint: 'tarjetas_graficas' },
    { type: 'storage', name: 'Almacenamiento', icon: '💿', color: '#98D8C8', endpoint: 'almacenamiento' },
    { type: 'psu', name: 'Fuentes', icon: '🔋', color: '#FFEAA7', endpoint: 'fuentes_poder' },
    { type: 'case', name: 'Gabinetes', icon: '🖥️', color: '#DDA0DD', endpoint: 'gabinetes' }
  ];

  useEffect(() => {
    const init = async () => {
      if (projectId) {
        // Si hay projectId, cargar primero el proyecto
        await loadExistingProject(parseInt(projectId));
      } else {
        // Si es nuevo proyecto, cargar componentes y setear nombre por defecto
        await loadAllComponents();
        setProjectName(`Mi Build ${new Date().toLocaleDateString()}`);
        setProjectDescription(`Build creada el ${new Date().toLocaleString()}`);
        setLoading(false);
      }
    };
    
    init();
  }, [projectId]);

  const filterComponentsByCompatibility = useCallback(() => {
    console.log('🔄 Filtrando componentes por compatibilidad');
    
    const cpu = build.find(item => item.type === 'cpu')?.component;
    const motherboard = build.find(item => item.type === 'motherboard')?.component;

    const newFilteredComponents: { [key: string]: Component[] } = {};

    Object.keys(allComponents).forEach(type => {
      const components = allComponents[type] || [];
      let filtered = [...components];

      switch (type) {
        case 'motherboard':
          if (cpu && cpu.socket) {
            filtered = components.filter(mb => mb.socket === cpu.socket);
          }
          break;

        case 'ram':
          if (motherboard && motherboard.tipo_memoria) {
            filtered = components.filter(ram => 
              (ram.tipo_memoria || '').toLowerCase() === motherboard.tipo_memoria?.toLowerCase()
            );
          }
          break;

        case 'cpu':
          if (motherboard && motherboard.socket) {
            filtered = components.filter(cpuComp => cpuComp.socket === motherboard.socket);
          }
          break;

        case 'case':
          if (motherboard && motherboard.formato) {
            filtered = components.filter(caseItem => 
              isCaseCompatibleWithMotherboard(caseItem.formato, motherboard.formato)
            );
          }
          break;
      }

      newFilteredComponents[type] = filtered;
    });

    // Solo actualizar si realmente hay cambios
    setFilteredComponents(prev => {
      const prevJSON = JSON.stringify(prev);
      const newJSON = JSON.stringify(newFilteredComponents);
      if (prevJSON !== newJSON) {
        console.log('🔄 Actualizando filteredComponents');
        return newFilteredComponents;
      }
      return prev;
    });
  }, [build, allComponents]);

  useEffect(() => {
    if (allComponents && Object.keys(allComponents).length > 0) {
      filterComponentsByCompatibility();
    }
  }, [filterComponentsByCompatibility, allComponents]);

  const loadAllComponents = async () => {
    try {
      console.log('🔄 Cargando todos los componentes...');
      const componentsData: { [key: string]: Component[] } = {};

      for (const category of componentCategories) {
        try {
          console.log(`📥 Cargando ${category.name}...`);
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

          if (result.success && result.data && result.data.length > 0) {
            console.log(`✅ ${category.name}: ${result.data.length} componentes`);
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
            console.warn(`⚠️ ${category.name}: No hay componentes`);
            componentsData[category.type] = [];
          }
        } catch (error) {
          console.error(`❌ Error cargando ${category.name}:`, error);
          componentsData[category.type] = [];
        }
      }

      setAllComponents(componentsData);
      setFilteredComponents(componentsData);
      console.log('✅ Todos los componentes cargados');
    } catch (error) {
      console.error('💥 Error general cargando componentes:', error);
      const emptyData: { [key: string]: Component[] } = {};
      componentCategories.forEach(category => {
        emptyData[category.type] = [];
      });
      setAllComponents(emptyData);
      setFilteredComponents(emptyData);
    }
  };

  // ✅ CORREGIDO: Función simplificada para cargar proyecto existente
  const loadExistingProject = async (id: number) => {
    try {
      console.log(`📂 Cargando proyecto ID: ${id}`);
      
      const result = await projectService.getProjectById(id);
      
      if (result.success && result.data) {
        const project = result.data;
        
        // Establecer nombre y descripción
        setProjectName(project.nombre || '');
        setProjectDescription(project.descripcion || '');
        setIsEditingProject(true);
        
        // Ahora cargar todos los componentes para poder seleccionar otros después
        await loadAllComponents();
        
        // Cargar componentes del proyecto
        if (project.componentes && Array.isArray(project.componentes)) {
          console.log(`🔧 Componentes encontrados en proyecto:`, project.componentes);
          
          // Agrupar componentes del proyecto por tipo para manejar múltiples RAM y Storage
          const componentsByType: { [key: string]: Component[] } = {};
          
          // Crear componentes a partir de los datos que ya vienen del backend
          project.componentes.forEach((projectComp: any) => {
            const tipo = projectComp.tipo_componente?.toLowerCase();
            if (!tipo) return;
            
            // Crear objeto componente con los datos que ya tenemos
            const component: Component = {
              id: projectComp.componente_id,
              marca: projectComp.marca || 'Sin marca',
              modelo: projectComp.modelo || 'Sin modelo',
              tipo: tipo,
              especificaciones: generateSpecifications(projectComp, tipo),
              socket: projectComp.socket,
              tipo_memoria: projectComp.tipo_memoria,
              formato: projectComp.formato,
              imagen_url: projectComp.imagen_url,
            };
            
            if (!componentsByType[tipo]) {
              componentsByType[tipo] = [];
            }
            componentsByType[tipo].push(component);
          });
          
          console.log('📊 Componentes agrupados por tipo:', componentsByType);
          
          // Actualizar el estado build con los componentes encontrados
          const updatedBuild = build.map(buildItem => {
            const tipo = buildItem.type;
            const projectComponents = componentsByType[tipo] || [];
            
            console.log(`🔄 Actualizando ${tipo}:`, projectComponents.length, 'componentes');
            
            if (projectComponents.length > 0) {
              // Para RAM y Storage, mantener múltiples componentes
              if (tipo === 'ram' || tipo === 'storage') {
                return {
                  ...buildItem,
                  components: projectComponents,
                  component: projectComponents[0] // Mostrar el primero como principal
                };
              } else {
                // Para otros componentes, usar el primero encontrado
                return {
                  ...buildItem,
                  component: projectComponents[0],
                  components: [projectComponents[0]]
                };
              }
            }
            
            return buildItem;
          });
          
          setBuild(updatedBuild);
          checkCompatibility(updatedBuild);
          toast.success(`✅ Proyecto "${project.nombre}" cargado`);
          console.log('✅ Build actualizada exitosamente');
        }
      } else {
        console.error('❌ Error en respuesta:', result);
        toast.error(result.error || 'Error cargando proyecto');
      }
    } catch (error) {
      console.error('💥 Error cargando proyecto:', error);
      toast.error('Error cargando proyecto');
    } finally {
      setLoading(false);
    }
  };

  const isCaseCompatibleWithMotherboard = (caseFormat: string = '', mbFormat: string = ''): boolean => {
    const compatibilityMap: { [key: string]: string[] } = {
      'Mini-ITX': ['Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX'],
      'Micro-ATX': ['Micro-ATX', 'ATX', 'E-ATX'],
      'ATX': ['ATX', 'E-ATX'],
      'E-ATX': ['E-ATX'],
      'Mini Tower': ['Mini-ITX', 'Micro-ATX'],
      'Mid Tower': ['Micro-ATX', 'ATX'],
      'Full Tower': ['ATX', 'E-ATX']
    };

    const caseFormats = caseFormat?.split('/').map(f => f.trim()) || [];
    const supportedFormats = caseFormats.flatMap(format => compatibilityMap[format] || []);
    
    return supportedFormats.includes(mbFormat);
  };

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

  const handleAddComponent = (component: Component) => {
    const updatedBuild = build.map(item => {
      const shouldAdd = item.type === component.tipo;
      
      if (!shouldAdd) return item;

      if (item.type === 'ram' || item.type === 'storage') {
        return {
          ...item,
          components: [...item.components, component],
          component: component
        };
      }

      return { ...item, component, components: [component] };
    });

    setBuild(updatedBuild);
    toast.success(`${component.marca} ${component.modelo} agregado`);
    checkCompatibility(updatedBuild);
  };

  const handleRemoveComponent = (buildItem: BuildComponent, componentIndex?: number) => {
    const updatedBuild = build.map(item => {
      if (item.id !== buildItem.id) return item;

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

    setBuild(updatedBuild);
    toast.info('Componente removido');
    checkCompatibility(updatedBuild);
  };

  const checkCompatibility = useCallback((currentBuild: BuildComponent[]) => {
    console.log('🔍 Verificando compatibilidad');
    
    const cpu = currentBuild.find(i => i.type === 'cpu')?.component;
    const motherboard = currentBuild.find(i => i.type === 'motherboard')?.component;
    const ram = currentBuild.find(i => i.type === 'ram')?.component;

    const updatedBuild = currentBuild.map(item => {
      let compatible = true;

      if (!item.component && item.components.length === 0) {
        return { ...item, compatible: true };
      }

      switch (item.type) {
        case 'cpu':
          if (motherboard && item.component?.socket && motherboard.socket) {
            compatible = item.component.socket === motherboard.socket;
          }
          break;

        case 'motherboard':
          if (cpu && item.component?.socket && cpu.socket) {
            compatible = item.component.socket === cpu.socket;
          }
          
          if (ram && ram.tipo_memoria && item.component?.tipo_memoria) {
            compatible = compatible && (ram.tipo_memoria === item.component.tipo_memoria);
          }
          break;

        case 'ram':
          if (motherboard && item.component?.tipo_memoria && motherboard.tipo_memoria) {
            compatible = item.component.tipo_memoria === motherboard.tipo_memoria;
          }
          break;

        case 'case':
          if (motherboard && item.component?.formato && motherboard.formato) {
            compatible = isCaseCompatibleWithMotherboard(item.component.formato, motherboard.formato);
          }
          break;
      }

      return { ...item, compatible };
    });

    // Solo actualizar si hay cambios
    setBuild(prev => {
      const prevJSON = JSON.stringify(prev);
      const newJSON = JSON.stringify(updatedBuild);
      if (prevJSON !== newJSON) {
        console.log('🔄 Actualizando build por compatibilidad');
        return updatedBuild;
      }
      return prev;
    });
  }, []);

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

    const componentes: any[] = [];
    const visto = new Set();
    
    for (const item of build) {
      if (item.component) {
        const key = `${item.type}-${item.component.id}`;
        if (!visto.has(key)) {
          visto.add(key);
          componentes.push({ tipo_componente: item.type, componente_id: item.component.id });
        }
      }
      if (item.components.length > 0) {
        for (const component of item.components) {
          const key = `${item.type}-${component.id}`;
          if (!visto.has(key)) {
            visto.add(key);
            componentes.push({ tipo_componente: item.type, componente_id: component.id });
          }
        }
      }
    }

    const projectData = {
      nombre: projectName.trim(),
      descripcion: projectDescription.trim() || `Build modificada el ${new Date().toLocaleString()}`,
      componentes: componentes
    };

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('No hay sesión activa');
        router.push('/(tabs)/Login');
        return;
      }
      
      setSaving(true);
      
      let response;
      
      if (isEditingProject && projectId) {
        console.log(`🔄 Actualizando proyecto ID: ${projectId}`);
        response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          method: 'PUT',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(projectData)
        });
      } else {
        console.log('📝 Creando nuevo proyecto');
        response = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(projectData)
        });
      }
      
      const text = await response.text();
      
      if (response.ok) {
        const result = JSON.parse(text);
        
        toast.success(`✅ ${isEditingProject ? 'Proyecto actualizado' : 'Build guardada'} exitosamente!`);
        
        setTimeout(() => {
          router.push('/(tabs)/Projects');
        }, 1500);
        
      } else {
        const errorMsg = text || 'Error desconocido';
        toast.error(`Error al ${isEditingProject ? 'actualizar' : 'guardar'} la build`);
        
        Alert.alert(
          'Error',
          `No se pudo ${isEditingProject ? 'actualizar' : 'guardar'} la build: ${errorMsg}`,
          [{ text: 'OK', style: 'default' }]
        );
      }
      
    } catch (error: any) {
      toast.error('Error de conexión');
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar al servidor.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const getCurrentCategoryComponents = (): Component[] => {
    return filteredComponents[selectedCategory] || [];
  };

  // ✅ Componente ProjectInfoSection corregido
  const ProjectInfoSection = () => {
    const [localProjectName, setLocalProjectName] = useState(projectName);
    const [localProjectDescription, setLocalProjectDescription] = useState(projectDescription);

    // Sincronizar con el estado global cuando cambian
    useEffect(() => {
      setLocalProjectName(projectName);
    }, [projectName]);

    useEffect(() => {
      setLocalProjectDescription(projectDescription);
    }, [projectDescription]);

    // Debounce para actualizar el estado global (evitar re-renders excesivos)
    useEffect(() => {
      const timer = setTimeout(() => {
        if (localProjectName !== projectName) {
          console.log('📝 Actualizando nombre global:', localProjectName);
          setProjectName(localProjectName);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }, [localProjectName]);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (localProjectDescription !== projectDescription) {
          console.log('📝 Actualizando descripción global:', localProjectDescription);
          setProjectDescription(localProjectDescription);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }, [localProjectDescription]);

    return (
      <View style={styles.projectInfoSection}>
        <Text style={styles.projectInfoTitle}>
          {isEditingProject ? '📝 Editando Proyecto' : '📝 Nueva Build'}
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre de la Build *</Text>
          <TextInput
            style={styles.textInput}
            value={localProjectName}
            onChangeText={setLocalProjectName}
            placeholder="Ej: Mi PC Gaming 2024"
            placeholderTextColor="#8b9cb3"
            maxLength={100}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={() => {
              // Forzar actualización inmediata al presionar enter
              setProjectName(localProjectName);
            }}
          />
          {localProjectName.length === 0 && (
            <Text style={styles.inputErrorText}>El nombre es requerido</Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={localProjectDescription}
            onChangeText={setLocalProjectDescription}
            placeholder="Describe tu build..."
            placeholderTextColor="#8b9cb3"
            multiline
            numberOfLines={3}
            maxLength={500}
            autoCorrect={true}
            autoCapitalize="sentences"
            returnKeyType="default"
            blurOnSubmit={false}
          />
          <Text style={styles.inputCharCount}>
            {localProjectDescription.length}/500 caracteres
          </Text>
        </View>
      </View>
    );
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
  const incompatibleComponentsCount = build.filter(item => !item.compatible && (item.component || item.components.length > 0)).length;

  const BuildItem = ({ item }: { item: BuildComponent }) => (
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
              onPress={() => handleRemoveComponent(item)}
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
  );

  const CategoryButton = ({ category }: { category: ComponentCategory }) => {
    const hasSelection = build.find(item => item.type === category.type)?.component;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          { backgroundColor: category.color },
          selectedCategory === category.type && styles.categoryButtonActive,
          hasSelection && styles.categoryButtonSelected
        ]}
        onPress={() => setSelectedCategory(category.type)}
      >
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={styles.categoryName}>{category.name}</Text>
        {hasSelection && <View style={styles.categorySelectionDot} />}
      </TouchableOpacity>
    );
  };

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
          <ScrollView style={styles.mobilePanel}>
            <ProjectInfoSection />

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

            <ScrollView style={styles.buildList} nestedScrollEnabled>
              {build.map((item) => (
                <BuildItem key={item.id} item={item} />
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
              disabled={selectedComponentsCount === 0 || saving}
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
                  <CategoryButton key={category.type} category={category} />
                ))}
              </ScrollView>
            </View>

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
                      {selectedCategory === 'motherboard' && build.find(i => i.type === 'cpu')?.component ? 
                        'Intenta con otro procesador o remueve el actual' : 
                        'Esta categoría está vacía en la base de datos'
                      }
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

  // ✅ Render para Desktop - MEJORADO
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
          <ScrollView style={styles.buildPanelContent} showsVerticalScrollIndicator={true}>
            <ProjectInfoSection />

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

            <Text style={styles.sectionTitle}>Componentes Seleccionados</Text>
            
            <View style={styles.buildList}>
              {build.map((item) => (
                <BuildItem key={item.id} item={item} />
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
              disabled={selectedComponentsCount === 0 || saving}
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
                <CategoryButton key={category.type} category={category} />
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
            >
              {currentComponents.map((component) => (
                <TouchableOpacity
                  key={component.id}
                  style={styles.componentCard}
                  onPress={() => handleAddComponent(component)}
                >
                  <View style={styles.componentHeader}>
                    <Text style={styles.componentBrand}>{component.marca}</Text>
                    {component.imagen_url && (
                      <View style={styles.componentImagePlaceholder}>
                        <Text style={styles.componentImageText}>📷</Text>
                      </View>
                    )}
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
                    {selectedCategory === 'motherboard' && build.find(i => i.type === 'cpu')?.component ? 
                      'Intenta con otro procesador o remueve el actual' : 
                      'Esta categoría está vacía en la base de datos'
                    }
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

// ✅ ESTILOS COMPLETOS CON LOS NUEVOS AGREGADOS
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
    fontSize: 14,
  },
  tabTextActive: {
    color: '#667eea',
    fontWeight: '700',
  },
  // Layout desktop - MEJORADO
  desktopContent: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
  },
  // Paneles
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
  // Información del proyecto
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
  // Build Summary
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
  // Build List
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
  // Botón guardar
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
  // CATEGORÍAS
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
  // COMPONENTES - MEJORADO
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