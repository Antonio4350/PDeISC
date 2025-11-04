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

interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  componentes_count: number;
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    // Simular carga de proyectos
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          nombre: 'PC Gaming Ultimate',
          descripcion: 'Build para gaming en 4K',
          fecha_creacion: '2024-01-15',
          componentes_count: 7
        },
        {
          id: 2, 
          nombre: 'Workstation Profesional',
          descripcion: 'Para edición y renderizado',
          fecha_creacion: '2024-01-10',
          componentes_count: 6
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleCreateProject = () => {
    router.push('/(tabs)/PcBuilder');
  };

  const handleOpenProject = (projectId: number) => {
    router.push(`/(tabs)/PcBuilder?project=${projectId}`);
  };

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
          Hola {user?.nombre}, gestioná tus builds de PC
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
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.nombre}</Text>
                <Text style={styles.projectDate}>{project.fecha_creacion}</Text>
              </View>
              
              <Text style={styles.projectDescription}>{project.descripcion}</Text>
              
              <View style={styles.projectFooter}>
                <Text style={styles.componentsCount}>
                  {project.componentes_count} componentes seleccionados
                </Text>
                <Text style={styles.openProject}>Abrir →</Text>
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
  },
  createButtonText: {
    color: '#ffffff',
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
  projectDate: {
    fontSize: 12,
    color: '#8b9cb3',
  },
  projectDescription: {
    fontSize: 14,
    color: '#8b9cb3',
    marginBottom: 16,
    lineHeight: 20,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentsCount: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
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