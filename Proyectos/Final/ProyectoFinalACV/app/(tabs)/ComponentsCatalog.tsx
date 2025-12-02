import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
  Animated
} from 'react-native';
import { useAuth } from '../AuthContext';
import componentService, { ApiResponse } from '../services/components';
import toast from '../utils/toast';

const { width: screenWidth } = Dimensions.get('window');

interface Component {
  id: number;
  marca: string;
  modelo: string;
  tipo: string;
  especificaciones: string;
  [key: string]: any;
}

export default function ComponentsCatalog() {
  const { user } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  
  const categoriesScrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasLoadedAll = useRef(false);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🔍', color: '#667eea' },
    { id: 'procesadores', name: 'Procesadores', icon: '⚡', color: '#FF6B6B' },
    { id: 'motherboards', name: 'Motherboards', icon: '🔌', color: '#4ECDC4' },
    { id: 'memorias_ram', name: 'RAM', icon: '💾', color: '#45B7D1' },
    { id: 'tarjetas_graficas', name: 'Gráficas', icon: '🎮', color: '#F7DC6F' },
    { id: 'almacenamiento', name: 'Almacenamiento', icon: '💿', color: '#98D8C8' },
    { id: 'fuentes_poder', name: 'Fuentes', icon: '🔋', color: '#FFEAA7' },
    { id: 'gabinetes', name: 'Gabinetes', icon: '🖥️', color: '#96CEB4' },
  ];

  // Cargar componentes solo al inicio
  useEffect(() => {
    loadAllComponents();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filtrar componentes cuando cambia la categoría o búsqueda
  useEffect(() => {
    if (!hasLoadedAll.current) return;
    filterComponentsByCategoryAndSearch();
  }, [selectedCategory, searchQuery]);

  // Cargar TODOS los componentes una sola vez
  const loadAllComponents = async () => {
    try {
      setLoading(true);
      
      const [
        processorsRes,
        mothersRes,
        ramRes,
        gpuRes,
        storageRes,
        psuRes,
        casesRes
      ] = await Promise.all([
        componentService.getProcessors(),
        componentService.getMotherboards(),
        componentService.getRAM(),
        componentService.getGPUs(),
        componentService.getStorage(),
        componentService.getPSUs(),
        componentService.getCases()
      ]);

      const allComponents = [
        ...(processorsRes.success && processorsRes.data ? processorsRes.data.map((comp: any) => ({ 
          ...comp, 
          tipo: 'procesadores',
          especificaciones: generateSpecifications(comp, 'procesadores')
        })) : []),
        ...(mothersRes.success && mothersRes.data ? mothersRes.data.map((comp: any) => ({ 
          ...comp, 
          tipo: 'motherboards',
          especificaciones: generateSpecifications(comp, 'motherboards')
        })) : []),
        ...(ramRes.success && ramRes.data ? ramRes.data.map((comp: any) => ({ 
          ...comp, 
          tipo: 'memorias_ram',
          especificaciones: generateSpecifications(comp, 'memorias_ram')
        })) : []),
        ...(gpuRes.success && gpuRes.data ? gpuRes.data.map((comp: any) => ({ 
          ...comp, 
          tipo: 'tarjetas_graficas',
          especificaciones: generateSpecifications(comp, 'tarjetas_graficas')
        })) : []),
        ...(storageRes.success && storageRes.data ? storageRes.data.map((comp: any) => ({ 
          ...comp, 
          tipo: 'almacenamiento',
          especificaciones: generateSpecifications(comp, 'almacenamiento')
        })) : []),
        ...(psuRes.success && psuRes.data ? psuRes.data.map((comp: any) => ({ 
          ...comp, 
          tipo: 'fuentes_poder',
          especificaciones: generateSpecifications(comp, 'fuentes_poder')
        })) : []),
        ...(casesRes.success && casesRes.data ? casesRes.data.map((comp: any) => ({ 
          ...comp, 
          tipo: 'gabinetes',
          especificaciones: generateSpecifications(comp, 'gabinetes')
        })) : [])
      ];

      setComponents(allComponents);
      setFilteredComponents(allComponents);
      hasLoadedAll.current = true;
      
    } catch (error) {
      console.error('Error cargando componentes:', error);
      toast.error('Error de conexión');
      setComponents([]);
      setFilteredComponents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar componentes localmente
  const filterComponentsByCategoryAndSearch = () => {
    if (!components.length) {
      setFilteredComponents([]);
      return;
    }

    let filtered = [...components];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(comp => comp.tipo === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(comp =>
        comp.marca?.toLowerCase().includes(query) ||
        comp.modelo?.toLowerCase().includes(query) ||
        comp.especificaciones?.toLowerCase().includes(query)
      );
    }

    setFilteredComponents(filtered);
  };

  const generateSpecifications = (component: any, category: string): string => {
    const specs = [];

    switch (category) {
      case 'procesadores':
        if (component.nucleos) specs.push(`${component.nucleos} núcleos`);
        if (component.socket) specs.push(`Socket ${component.socket}`);
        if (component.tipo_memoria) specs.push(component.tipo_memoria);
        if (component.frecuencia_base) specs.push(`${component.frecuencia_base}GHz`);
        if (component.tdp) specs.push(`${component.tdp}W`);
        break;
      case 'motherboards':
        if (component.socket) specs.push(`Socket ${component.socket}`);
        if (component.tipo_memoria) specs.push(component.tipo_memoria);
        if (component.formato) specs.push(component.formato);
        if (component.chipset) specs.push(component.chipset);
        break;
      case 'memorias_ram':
        if (component.capacidad) specs.push(`${component.capacidad}GB`);
        if (component.tipo) specs.push(component.tipo);
        if (component.velocidad_mhz) specs.push(`${component.velocidad_mhz}MHz`);
        if (component.latencia) specs.push(component.latencia);
        break;
      case 'tarjetas_graficas':
        if (component.memoria) specs.push(`${component.memoria}GB`);
        if (component.tipo_memoria) specs.push(component.tipo_memoria);
        if (component.tdp) specs.push(`${component.tdp}W`);
        if (component.nucleos_cuda) specs.push(`${component.nucleos_cuda} núcleos`);
        break;
      case 'almacenamiento':
        if (component.capacidad) specs.push(`${component.capacidad}GB`);
        if (component.tipo) specs.push(component.tipo);
        if (component.interfaz) specs.push(component.interfaz);
        if (component.velocidad_lectura) specs.push(`${component.velocidad_lectura}MB/s`);
        break;
      case 'fuentes_poder':
        if (component.potencia) specs.push(`${component.potencia}W`);
        if (component.certificacion) specs.push(component.certificacion);
        if (component.modular) specs.push(component.modular);
        break;
      case 'gabinetes':
        if (component.formato) specs.push(component.formato);
        if (component.longitud_max_gpu) specs.push(`GPU: ${component.longitud_max_gpu}mm`);
        if (component.motherboards_soportadas) specs.push(component.motherboards_soportadas);
        break;
    }

    return specs.join(' • ') || 'Especificaciones disponibles';
  };

  const handleComponentPress = (component: Component) => {
    const detalles = Object.entries(component)
      .filter(([key, value]) =>
        !['id', 'marca', 'modelo', 'tipo', 'especificaciones', 'estado', 'fecha_creacion', 'imagen_url'].includes(key) &&
        value !== null &&
        value !== '' &&
        value !== undefined
      )
      .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}: ${value}`)
      .join('\n');

    const mensaje = `${component.marca} ${component.modelo}${detalles ? '\n\n' + detalles : '\n\nSin detalles adicionales'}`;
    toast.info(mensaje);
  };

  const scrollToCategory = (index: number) => {
    const categoryWidth = 95;
    const scrollPosition = index * categoryWidth;
    
    categoriesScrollRef.current?.scrollTo({
      x: scrollPosition,
      y: 0,
      animated: true
    });
  };

  const handleCategoryPress = (categoryId: string, index: number) => {
    setSelectedCategory(categoryId);
    scrollToCategory(index);
  };

  if (loading && !hasLoadedAll.current) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#8b9cb3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Categorías */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          ref={categoriesScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          snapToInterval={95}
          decelerationRate="fast"
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => handleCategoryPress(category.id, index)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resultados */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {filteredComponents.length} componente{filteredComponents.length !== 1 ? 's' : ''}
        </Text>
        {!user && (
          <Text style={styles.guestWarning}>⚠️ Invitado</Text>
        )}
      </View>

      {/* Lista de Componentes */}
      <Animated.ScrollView 
        style={[styles.componentsList, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.componentsListContent}
      >
        {filteredComponents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyText}>
              {selectedCategory === 'all'
                ? 'No hay componentes'
                : 'Probá otra búsqueda'
              }
            </Text>
          </View>
        ) : (
          filteredComponents.map((component) => (
            <TouchableOpacity
              key={`${component.tipo}-${component.id}`}
              style={styles.componentCard}
              onPress={() => handleComponentPress(component)}
              activeOpacity={0.7}
            >
              <View style={styles.componentHeader}>
                <View style={styles.componentBrandWrapper}>
                  <Text style={styles.componentBrand}>{component.marca}</Text>
                  <View style={[
                    styles.componentTypeBadge,
                    { backgroundColor: categories.find(cat => cat.id === component.tipo)?.color + '20' }
                  ]}>
                    <Text style={styles.componentTypeText}>
                      {categories.find(cat => cat.id === component.tipo)?.icon}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.componentModel}>{component.modelo}</Text>
              <Text style={styles.componentSpecs}>{component.especificaciones}</Text>

              <View style={styles.componentFooter}>
                <Text style={styles.viewDetails}>Ver detalles →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </Animated.ScrollView>
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
    marginTop: 12,
    fontSize: 14,
    color: '#8b9cb3',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#1a1b27',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  titleDesktop: {
    fontSize: 26,
  },
  titleTablet: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b9cb3',
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b27',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    color: '#ffffff',
    fontSize: 14,
  },
  searchIcon: {
    fontSize: 14,
    color: '#667eea',
    marginRight: 6,
  },
  clearIcon: {
    fontSize: 14,
    color: '#8b9cb3',
    padding: 4,
  },
  categoriesWrapper: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b27',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 90,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    color: '#8b9cb3',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultsTitle: {
    color: '#8b9cb3',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  guestWarning: {
    color: '#ffd700',
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  componentsList: {
    flex: 1,
  },
  componentsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#8b9cb3',
    textAlign: 'center',
    lineHeight: 18,
  },
  componentCard: {
    backgroundColor: '#1a1b27',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  componentHeader: {
    marginBottom: 8,
  },
  componentBrandWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentBrand: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667eea',
    flex: 1,
  },
  componentTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  componentTypeText: {
    fontSize: 12,
  },
  componentModel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 20,
  },
  componentSpecs: {
    fontSize: 12,
    color: '#8b9cb3',
    marginBottom: 10,
    lineHeight: 16,
  },
  componentFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  viewDetails: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
  },
});