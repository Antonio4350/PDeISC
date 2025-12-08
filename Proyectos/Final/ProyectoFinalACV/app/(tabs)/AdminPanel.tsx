import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../AuthContext';
import { router } from 'expo-router';
import componentService from '../services/components';
import toast from '../utils/toast';

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('No tenés permisos para acceder a esta sección');
      setTimeout(() => {
        router.back();
      }, 1500);
      return;
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const result = await componentService.getStats();
      if (result.success) {
        setStats(result.data);
      } else {
        toast.error('Error cargando estadísticas');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComponent = (type: string) => {
    router.push({
      pathname: '/(tabs)/AddComponent',
      params: { type: type }
    } as any);
  };

  const handleViewComponents = (type: string, name: string) => {
    router.push({
      pathname: '/(tabs)/ComponentsList',
      params: { type: type, name: name }
    } as any);
  };

  // Lista de componentes SIN coolers
  const allComponents = [
    { 
      type: 'procesadores', 
      name: 'Procesadores', 
      icon: '⚡', 
      color: '#FF6B6B',
      count: stats?.procesadores || 0,
      description: 'CPU Intel/AMD'
    },
    { 
      type: 'motherboards', 
      name: 'Motherboards', 
      icon: '🔌', 
      color: '#4ECDC4',
      count: stats?.motherboards || 0,
      description: 'Placas base'
    },
    { 
      type: 'memorias_ram', 
      name: 'Memorias RAM', 
      icon: '💾', 
      color: '#45B7D1',
      count: stats?.memorias_ram || 0,
      description: 'DDR3/DDR4/DDR5'
    },
    { 
      type: 'tarjetas_graficas', 
      name: 'Tarjetas Gráficas', 
      icon: '🎮', 
      color: '#F7DC6F',
      count: stats?.tarjetas_graficas || 0,
      description: 'GPUs'
    },
    { 
      type: 'almacenamiento', 
      name: 'Almacenamiento', 
      icon: '💿', 
      color: '#98D8C8',
      count: stats?.almacenamiento || 0,
      description: 'SSD/HDD'
    },
    { 
      type: 'fuentes_poder', 
      name: 'Fuentes', 
      icon: '🔋', 
      color: '#FFA726',
      count: stats?.fuentes_poder || 0,
      description: 'Fuentes poder'
    },
    { 
      type: 'gabinetes', 
      name: 'Gabinetes', 
      icon: '🖥️', 
      color: '#AB47BC',
      count: stats?.gabinetes || 0,
      description: 'Torres PC'
    },
    // Coolers ha sido ELIMINADO de esta lista
  ];

  // Acciones rápidas SIN "Gestionar Propiedades"
  const quickActions = [
    {
      title: 'Ver Catálogo Completo',
      description: 'Todos los componentes',
      icon: '📋',
      route: '/(tabs)/ComponentsCatalog',
      color: '#4ECDC4'
    },
    {
      title: 'Armar PC',
      description: 'Constructor de computadoras',
      icon: '🔧',
      route: '/(tabs)/PcBuilder',
      color: '#FFA726'
    },
    {
      title: 'Mis Proyectos',
      description: 'PCs guardadas',
      icon: '💾',
      route: '/(tabs)/Projects',
      color: '#98D8C8'
    }
    // "Gestionar Propiedades" ha sido ELIMINADO de esta lista
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Título Principal */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Panel de Administración</Text>
          <Text style={styles.mainSubtitle}>Gestioná todos los componentes del sistema</Text>
        </View>

        {/* All Components List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Componentes del Sistema</Text>
          <Text style={styles.sectionSubtitle}>Administrá y agregá nuevos componentes</Text>
          
          <View style={styles.componentsList}>
            {allComponents.map((component, index) => (
              <View key={index} style={styles.componentCard}>
                <View style={styles.componentInfo}>
                  <View style={[styles.componentIcon, { backgroundColor: component.color }]}>
                    <Text style={styles.componentIconText}>{component.icon}</Text>
                  </View>
                  <View style={styles.componentDetails}>
                    <Text style={styles.componentName}>{component.name}</Text>
                    <Text style={styles.componentDescription}>{component.description}</Text>
                    <Text style={styles.componentCount}>{component.count} en sistema</Text>
                  </View>
                </View>
                
                <View style={styles.componentActions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewComponents(component.type, component.name)}
                  >
                    <Text style={styles.viewButtonText}>👁️ Ver</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddComponent(component.type)}
                  >
                    <Text style={styles.addButtonText}>➕ Agregar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions (ahora con solo 3 items) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <Text style={styles.sectionSubtitle}>Accesos directos a funciones principales</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Text style={styles.actionIconText}>{action.icon}</Text>
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
    color: '#8b9cb3',
    fontSize: 16,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#8b9cb3',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8b9cb3',
    marginBottom: 16,
  },
  componentsList: {
    gap: 12,
  },
  componentCard: {
    backgroundColor: '#1a1b27',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  componentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  componentIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  componentIconText: {
    fontSize: 20,
  },
  componentDetails: {
    flex: 1,
  },
  componentName: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 3,
  },
  componentDescription: {
    color: '#8b9cb3',
    fontSize: 13,
    marginBottom: 4,
  },
  componentCount: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '500',
  },
  componentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    backgroundColor: 'rgba(139, 156, 179, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 156, 179, 0.2)',
  },
  viewButtonText: {
    color: '#8b9cb3',
    fontSize: 13,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  addButtonText: {
    color: '#667eea',
    fontSize: 13,
    fontWeight: '600',
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#1a1b27',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 3,
  },
  actionDescription: {
    color: '#8b9cb3',
    fontSize: 13,
  },
});