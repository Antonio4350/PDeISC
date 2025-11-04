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
import componentService from '../services/components';

interface Component {
  id: number;
  marca: string;
  modelo: string;
  tipo: string;
  especificaciones: string;
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
  }, []);

  useEffect(() => {
    filterComponents();
  }, [searchQuery, selectedCategory, components]);

  const loadComponents = async () => {
    try {
      // Simular carga de componentes
      setTimeout(() => {
        const mockComponents: Component[] = [
          {
            id: 1,
            marca: 'Intel',
            modelo: 'Core i9-13900K',
            tipo: 'procesadores',
            especificaciones: '24 núcleos, 5.8GHz, LGA 1700'
          },
          {
            id: 2,
            marca: 'AMD',
            modelo: 'Ryzen 9 7950X',
            tipo: 'procesadores', 
            especificaciones: '16 núcleos, 5.7GHz, AM5'
          },
          {
            id: 3,
            marca: 'ASUS',
            modelo: 'ROG STRIX Z790-E',
            tipo: 'motherboards',
            especificaciones: 'LGA 1700, DDR5, WiFi 6E'
          },
          {
            id: 4,
            marca: 'Corsair',
            modelo: 'Vengeance RGB',
            tipo: 'memorias_ram',
            especificaciones: '32GB DDR5 6000MHz CL30'
          },
        ];
        setComponents(mockComponents);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error cargando componentes:', error);
      setLoading(false);
    }
  };

  const filterComponents = () => {
    let filtered = components;

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(comp => comp.tipo === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(comp =>
        comp.marca.toLowerCase().includes(query) ||
        comp.modelo.toLowerCase().includes(query) ||
        comp.especificaciones.toLowerCase().includes(query)
      );
    }

    setFilteredComponents(filtered);
  };

  const handleComponentPress = (component: Component) => {
    // Navegar a detalle del componente
    console.log('Abrir detalle:', component);
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
        </Text>
      </View>

      <ScrollView style={styles.componentsList}>
        {filteredComponents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No se encontraron componentes</Text>
            <Text style={styles.emptyText}>
              Probá con otros términos de búsqueda o otra categoría
            </Text>
          </View>
        ) : (
          filteredComponents.map((component) => (
            <TouchableOpacity
              key={component.id}
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
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Agregar a Build</Text>
                </TouchableOpacity>
                <Text style={styles.viewDetails}>Ver detalles →</Text>
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
  componentBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
  componentTypeBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewDetails: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
  },
});