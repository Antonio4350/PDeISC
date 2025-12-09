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
  const { user, isAdmin, isLoading: authLoading, authChecked } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    console.log('🔄 AdminPanel useEffect ejecutándose');
    console.log('authLoading:', authLoading);
    console.log('authChecked:', authChecked);
    console.log('user:', user);
    
    // Esperar a que la verificación de autenticación haya terminado
    if (!authChecked) {
      console.log('⏳ Esperando verificación de autenticación...');
      return;
    }

    const verifyPermissions = () => {
      console.log('🔍 Verificando permisos de admin...');
      
      if (!user) {
        console.log('❌ No hay usuario autenticado');
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
        console.log('❌ Usuario no es admin');
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
      
      console.log('✅ Permisos de admin verificados correctamente');
      return true;
    };

    const hasPermission = verifyPermissions();
    
    if (hasPermission) {
      loadStats();
    }
  }, [authChecked, user]);

  const loadStats = async () => {
  try {
    console.log('📊 Cargando estadísticas...');
    
    // ❌ EL PROBLEMA: componentService.getStats() usa un endpoint que no existe
    // ✅ SOLUCIÓN: Obtener stats manualmente contando componentes
    
    // 1. Cargar TODOS los componentes como hace ComponentsCatalog
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

    // 2. Crear stats manualmente
    const manualStats = {
      procesadores: processorsRes.success && processorsRes.data ? processorsRes.data.length : 0,
      motherboards: mothersRes.success && mothersRes.data ? mothersRes.data.length : 0,
      memorias_ram: ramRes.success && ramRes.data ? ramRes.data.length : 0,
      tarjetas_graficas: gpuRes.success && gpuRes.data ? gpuRes.data.length : 0,
      almacenamiento: storageRes.success && storageRes.data ? storageRes.data.length : 0,
      fuentes_poder: psuRes.success && psuRes.data ? psuRes.data.length : 0,
      gabinetes: casesRes.success && casesRes.data ? casesRes.data.length : 0
    };

    console.log('✅ Estadísticas calculadas:', manualStats);
    setStats(manualStats);
    
  } catch (error) {
    console.error('💥 Error cargando estadísticas:', error);
    
    // Valores por defecto si falla
    const defaultStats = {
      procesadores: 0,
      motherboards: 0,
      memorias_ram: 0,
      tarjetas_graficas: 0,
      almacenamiento: 0,
      fuentes_poder: 0,
      gabinetes: 0
    };
    
    setStats(defaultStats);
    toast.error('Error cargando estadísticas');
  } finally {
    setLoading(false);
  }
};

  const handleAddComponent = (type: string) => {
    console.log(`➕ Agregando componente tipo: ${type}`);
    router.push({
      pathname: '/(tabs)/AddComponent',
      params: { type: type }
    } as any);
  };

  const handleViewComponents = (type: string, name: string) => {
    console.log(`👁️ Viendo componentes tipo: ${type}`);
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
];

  // Acciones rápidas
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
  ];

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
          Solo administradores pueden acceder al Panel de Administración.
        </Text>
        <Text style={styles.accessDeniedSubtext}>
          Tu rol actual: {user?.rol || 'Invitado'}
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

  // 3. Loading de estadísticas
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


        {/* All Components List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Componentes del Sistema</Text>
            <Text style={styles.sectionCount}>
  Total: {allComponents.reduce((acc, comp) => acc + Number(comp.count || 0), 0)} componentes
</Text>
          </View>
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

        {/* Quick Actions */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
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
  welcomeSection: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  welcomeText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '700',
    color: '#667eea',
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#8b9cb3',
  },
  userRole: {
    color: '#ffd700',
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionCount: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
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
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8b9cb3',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});