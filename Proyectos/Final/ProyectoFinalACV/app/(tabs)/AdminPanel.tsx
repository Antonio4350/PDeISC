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
import { router } from 'expo-router';
import componentService from '../services/components';
import toast from '../utils/toast';

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('No tenés permisos para acceder a esta sección');
      // ✅ REDIRECCIÓN si no es admin
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

  const handleAddComponent = (type: string, name: string) => {
    toast.info(`Formulario para ${name} en desarrollo`);
    // ✅ En el futuro aquí navegarías al formulario correspondiente
    // router.push(`/(tabs)/Add${name}`);
  };

  const handleViewComponents = (type: string, name: string) => {
    toast.info(`Lista de ${name} en desarrollo`);
    // ✅ En el futuro aquí navegarías a la lista de componentes
    // router.push(`/(tabs)/ComponentsList?type=${type}`);
  };

  const componentTypes = [
    { 
      type: 'processor', 
      name: 'Procesador', 
      icon: '⚡', 
      color: '#FF6B6B',
      count: stats?.procesadores || 0
    },
    { 
      type: 'motherboard', 
      name: 'Motherboard', 
      icon: '🔌', 
      color: '#4ECDC4',
      count: stats?.motherboards || 0
    },
    { 
      type: 'ram', 
      name: 'Memoria RAM', 
      icon: '💾', 
      color: '#45B7D1',
      count: stats?.memorias_ram || 0
    },
    { 
      type: 'gpu', 
      name: 'Tarjeta Gráfica', 
      icon: '🎯', 
      color: '#F7DC6F',
      count: stats?.tarjetas_graficas || 0
    },
    { 
      type: 'storage', 
      name: 'Almacenamiento', 
      icon: '💿', 
      color: '#98D8C8',
      count: stats?.almacenamiento || 0
    },
    { 
      type: 'psu', 
      name: 'Fuente', 
      icon: '🔋', 
      color: '#FFEAA7',
      count: stats?.fuentes_poder || 0
    },
    { 
      type: 'case', 
      name: 'Gabinete', 
      icon: '🖥️', 
      color: '#96CEB4',
      count: stats?.gabinetes || 0
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>🔄 Cargando panel admin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👑 Panel de Administración</Text>
        <Text style={styles.subtitle}>
          Hola {user?.nombre}, gestioná los componentes del sistema
        </Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Resumen del Sistema</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.total || 0}</Text>
            <Text style={styles.statLabel}>Total Componentes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.procesadores || 0}</Text>
            <Text style={styles.statLabel}>Procesadores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.motherboards || 0}</Text>
            <Text style={styles.statLabel}>Mothers</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.componentsList}>
        <Text style={styles.sectionTitle}>🛠️ Gestión de Componentes</Text>
        <Text style={styles.sectionSubtitle}>
          Agregá nuevos componentes al catálogo
        </Text>

        {componentTypes.map((component, index) => (
          <View key={index} style={styles.componentRow}>
            <TouchableOpacity
              style={[styles.componentCard, { borderLeftColor: component.color }]}
              onPress={() => handleAddComponent(component.type, component.name)}
            >
              <View style={styles.componentHeader}>
                <Text style={styles.componentIcon}>{component.icon}</Text>
                <View style={styles.componentInfo}>
                  <Text style={styles.componentName}>{component.name}</Text>
                  <Text style={styles.componentCount}>
                    {component.count} componentes en sistema
                  </Text>
                </View>
                <Text style={styles.componentAction}>➕ Agregar</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewComponents(component.type, component.name)}
            >
              <Text style={styles.viewButtonText}>👁️ Ver</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.adminInfo}>
        <Text style={styles.adminRole}>Rol: {user?.rol?.toUpperCase()}</Text>
        <Text style={styles.adminEmail}>{user?.email}</Text>
      </View>
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
    color: '#8b9cb3',
    fontSize: 16,
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
  statsCard: {
    backgroundColor: '#1a1b27',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8b9cb3',
    textAlign: 'center',
  },
  componentsList: {
    flex: 1,
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
  componentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  componentCard: {
    backgroundColor: '#1a1b27',
    padding: 18,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    flex: 1,
    marginRight: 10,
  },
  componentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  componentIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  componentCount: {
    color: '#8b9cb3',
    fontSize: 12,
  },
  componentAction: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  viewButtonText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
  },
  adminInfo: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  adminRole: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  adminEmail: {
    color: '#8b9cb3',
    fontSize: 12,
  },
});