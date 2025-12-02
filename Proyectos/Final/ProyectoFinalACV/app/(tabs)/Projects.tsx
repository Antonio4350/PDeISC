import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAuth } from '../AuthContext';
import { router } from 'expo-router';
import projectService from '../services/projectService';
import toast from '../utils/toast';

interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  componentes_count: number;
  presupuesto?: number;
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setLoading(false);
      setProjects([]);
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const result = await projectService.getUserProjects();
      
      if (result.success) {
        setProjects(result.data || []);
      } else {
        toast.error('Error cargando proyectos');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    if (!user) {
      router.push('/(tabs)/Login');
      toast.info('Iniciá sesión para crear proyectos');
      return;
    }
    router.push('/(tabs)/PcBuilder');
  };

  const handleOpenProject = (projectId: number) => {
    if (!user) {
      router.push('/(tabs)/Login');
      return;
    }
    router.push(`/(tabs)/PcBuilder?project=${projectId}`);
  };

  const handleDeleteProject = (project: Project) => {
    Alert.alert(
      'Eliminar Proyecto',
      `¿Estás seguro de eliminar "${project.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await projectService.deleteProject(project.id);
              if (result.success) {
                toast.success('Proyecto eliminado');
                loadProjects();
              } else {
                toast.error(result.error || 'Error eliminando proyecto');
              }
            } catch (error) {
              toast.error('Error eliminando proyecto');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR');
  };

  // Si no hay usuario logueado
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📂 Mis Proyectos</Text>
          <Text style={styles.subtitle}>
            Iniciá sesión para ver tus proyectos guardados
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔒</Text>
          <Text style={styles.emptyTitle}>Acceso restringido</Text>
          <Text style={styles.emptyText}>
            Necesitás iniciar sesión para ver y guardar tus proyectos
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/(tabs)/Login')}
          >
            <Text style={styles.createButtonText}>🚀 Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.createButton, styles.armarPcButton]}
            onPress={() => router.push('/(tabs)/PcBuilder')}
          >
            <Text style={styles.armarPcButtonText}>🔧 Armar PC</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando tus proyectos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📂 Mis Proyectos</Text>
        <Text style={styles.subtitle}>
          Hola {user?.nombre || user?.email?.split('@')[0]}, gestioná tus builds de PC
        </Text>
      </View>

      {projects.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛠️</Text>
          <Text style={styles.emptyTitle}>No tenés proyectos aún</Text>
          <Text style={styles.emptyText}>
            Creá tu primer build de PC personalizada
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateProject}
          >
            <Text style={styles.createButtonText}>🚀 Crear Primer Proyecto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.projectsList}>
          <View style={styles.statsCard}>
            <Text style={styles.statsText}>
              📊 Tenés {projects.length} proyecto{projects.length !== 1 ? 's' : ''} guardado{projects.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectCard}
              onPress={() => handleOpenProject(project.id)}
              onLongPress={() => handleDeleteProject(project)}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.nombre}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProject(project)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
              
              {project.descripcion ? (
                <Text style={styles.projectDescription}>{project.descripcion}</Text>
              ) : null}
              
              <View style={styles.projectInfo}>
                <Text style={styles.projectDate}>
                  📅 {formatDate(project.fecha_actualizacion || project.fecha_creacion)}
                </Text>
                <Text style={styles.componentsCount}>
                  {project.componentes_count || 0} componente{project.componentes_count !== 1 ? 's' : ''}
                </Text>
              </View>
              
              <View style={styles.projectFooter}>
                <Text style={styles.openProject}>Tocá para editar →</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            style={styles.addProjectCard}
            onPress={handleCreateProject}
          >
            <Text style={styles.addProjectIcon}>➕</Text>
            <Text style={styles.addProjectText}>Crear Nuevo Proyecto</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8b9cb3',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  armarPcButton: {
    backgroundColor: '#1a1b27',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  armarPcButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '700',
  },
  projectsList: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#1a1b27',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  statsText: {
    color: '#8b9cb3',
    fontSize: 14,
    fontWeight: '600',
  },
  projectCard: {
    backgroundColor: '#1a1b27',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
    opacity: 0.7,
  },
  projectDescription: {
    fontSize: 14,
    color: '#8b9cb3',
    marginBottom: 12,
    lineHeight: 20,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectDate: {
    fontSize: 12,
    color: '#8b9cb3',
  },
  componentsCount: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  openProject: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '700',
  },
  addProjectCard: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  addProjectIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  addProjectText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '700',
  },
});