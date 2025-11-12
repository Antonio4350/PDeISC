import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
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
  [key: string]: any;
}

export default function ComponentsCatalog() {
  const { user } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: '🔍' },
    { id: 'procesadores', name: 'Procesadores', icon: '⚡' },
    { id: 'motherboards', name: 'Motherboards', icon: '🔌' },
    { id: 'memorias_ram', name: 'Memorias RAM', icon: '💾' },
    { id: 'tarjetas_graficas', name: 'Gráficas', icon: '🎯' },
    { id: 'almacenamiento', name: 'Almacenamiento', icon: '💿' },
    { id: 'fuentes_poder', name: 'Fuentes', icon: '🔋' },
    { id: 'gabinetes', name: 'Gabinetes', icon: '🖥️' },
  ];

  useEffect(() => {
    loadComponents();
  }, [selectedCategory]);

  useEffect(() => {
    filterComponents();
  }, [searchQuery, components]);

  const loadComponents = async () => {
    try {
      setLoading(true);

      let result: ApiResponse<any[]>;

      if (selectedCategory === 'all') {
        // Cargar todos los tipos de componentes
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
          ...(processorsRes.success && processorsRes.data ? processorsRes.data.map((comp: any) => ({ ...comp, tipo: 'procesadores' })) : []),
          ...(mothersRes.success && mothersRes.data ? mothersRes.data.map((comp: any) => ({ ...comp, tipo: 'motherboards' })) : []),
          ...(ramRes.success && ramRes.data ? ramRes.data.map((comp: any) => ({ ...comp, tipo: 'memorias_ram' })) : []),
          ...(gpuRes.success && gpuRes.data ? gpuRes.data.map((comp: any) => ({ ...comp, tipo: 'tarjetas_graficas' })) : []),
          ...(storageRes.success && storageRes.data ? storageRes.data.map((comp: any) => ({ ...comp, tipo: 'almacenamiento' })) : []),
          ...(psuRes.success && psuRes.data ? psuRes.data.map((comp: any) => ({ ...comp, tipo: 'fuentes_poder' })) : []),
          ...(casesRes.success && casesRes.data ? casesRes.data.map((comp: any) => ({ ...comp, tipo: 'gabinetes' })) : [])
        ];

        setComponents(allComponents);
        setFilteredComponents(allComponents);
        return;
      } else {
        // Cargar componentes específicos por categoría
        switch (selectedCategory) {
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
            result = { success: false, error: 'Categoría no válida' };
        }
      }

      if (result.success && result.data) {
        const mappedComponents = result.data.map((comp: any) => ({
          id: comp.id,
          marca: comp.marca || 'Sin marca',
          modelo: comp.modelo || 'Sin modelo',
          tipo: selectedCategory,
          especificaciones: generateSpecifications(comp, selectedCategory),
          // Agregar todos los datos originales para el detalle
          ...comp
        }));

        setComponents(mappedComponents);
        setFilteredComponents(mappedComponents);
      } else {
        console.log(`Error cargando ${selectedCategory}:`, result.error);
        toast.error(result.error || `Error cargando ${selectedCategory}`);
        setComponents([]);
        setFilteredComponents([]);
      }
    } catch (error) {
      console.error('Error cargando componentes:', error);
      toast.error('Error de conexión con el servidor');
      setComponents([]);
      setFilteredComponents([]);
    } finally {
      setLoading(false);
    }
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

    return specs.join(' • ') || 'Especificaciones técnicas disponibles';
  };

  const filterComponents = () => {
    if (!components.length) {
      setFilteredComponents([]);
      return;
    }

    let filtered = [...components];

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

  const handleComponentPress = (component: Component) => {
    // Mostrar todos los detalles del componente
    const detalles = Object.entries(component)
      .filter(([key, value]) =>
        !['id', 'marca', 'modelo', 'tipo', 'especificaciones', 'estado', 'fecha_creacion', 'imagen_url'].includes(key) &&
        value !== null &&
        value !== '' &&
        value !== undefined
      )
      .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}: ${value}`)
      .join('\n');

    const mensaje = `Detalles de ${component.marca} ${component.modelo}${detalles ? '\n\n' + detalles : '\n\nNo hay detalles adicionales disponibles'}`;

    toast.info(mensaje);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando catálogo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Catálogo de Componentes</Text>
        <Text style={styles.subtitle}>
          Hola {user?.nombre}, explorá nuestro inventario completo
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar componentes..."
          placeholderTextColor="#8b9cb3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Categorías */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
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

      {/* Resultados */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {filteredComponents.length} componente{filteredComponents.length !== 1 ? 's' : ''} encontrado{filteredComponents.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` en ${categories.find(cat => cat.id === selectedCategory)?.name}`}
        </Text>
      </View>

      <ScrollView style={styles.componentsList}>
        {filteredComponents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No se encontraron componentes</Text>
            <Text style={styles.emptyText}>
              {selectedCategory === 'all'
                ? 'No hay componentes en el inventario'
                : 'Probá con otros términos de búsqueda o seleccioná otra categoría'
              }
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadComponents}
            >
              <Text style={styles.retryButtonText}>Reintentar carga</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredComponents.map((component) => (
            <TouchableOpacity
              key={`${component.tipo}-${component.id}`}
              style={styles.componentCard}
              onPress={() => handleComponentPress(component)}
            >
              <View style={styles.componentHeader}>
                <Text style={styles.componentBrand}>{component.marca}</Text>
                <View style={styles.componentTypeBadge}>
                  <Text style={styles.componentTypeText}>
                    {categories.find(cat => cat.id === component.tipo)?.icon}
                  </Text>
                </View>
              </View>

              <Text style={styles.componentModel}>{component.modelo}</Text>
              <Text style={styles.componentSpecs}>{component.especificaciones}</Text>

              <View style={styles.componentFooter}>
                <Text style={styles.viewDetails}>Tocar para ver detalles completos →</Text>
              </View>
            </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 25,
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
  categoriesContainer: {
    marginBottom: 25,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b27',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: '#8b9cb3',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
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
    opacity: 0.7,
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  componentBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
    flex: 1,
  },
  componentTypeBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  componentTypeText: {
    fontSize: 12,
  },
  componentModel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  componentSpecs: {
    fontSize: 14,
    color: '#8b9cb3',
    marginBottom: 16,
    lineHeight: 20,
  },
  componentFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewDetails: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
  },
});