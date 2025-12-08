import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal
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
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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
      toast.error('Error de conexión');
      setProjects([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProjects();
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
    router.push({
      pathname: '/(tabs)/PcBuilder',
      params: { projectId: projectId.toString() }
    });
  };

  const handleDeleteClick = (project: Project, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (deletingId === project.id) return;
    
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    const projectId = projectToDelete.id;
    const projectName = projectToDelete.nombre;
    
    try {
      setDeletingId(projectId);
      setShowDeleteModal(false);
      
      const result = await projectService.deleteProject(projectId);
      
      if (result.success) {
        toast.success(`"${projectName}" eliminado`);
        setProjects(prev => prev.filter(p => p.id !== projectId));
      } else {
        toast.error(result.error || 'Error eliminando proyecto');
      }
    } catch (error: any) {
      toast.error('Error: ' + (error.message || 'Error de conexión'));
    } finally {
      setDeletingId(null);
      setProjectToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando tus proyectos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modal de confirmación */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🗑️ Eliminar Proyecto</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                ¿Estás seguro de eliminar{" "}
                <Text style={styles.projectNameHighlight}>
                  "{projectToDelete?.nombre}"
                </Text>?
              </Text>
              <Text style={styles.modalWarning}>
                Esta acción no se puede deshacer.
              </Text>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteModalButton]}
                onPress={confirmDelete}
                disabled={deletingId === projectToDelete?.id}
              >
                {deletingId === projectToDelete?.id ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.deleteModalButtonText}>Eliminar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
        <ScrollView 
          style={styles.projectsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#667eea']}
              tintColor="#667eea"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsCard}>
            <Text style={styles.statsText}>
              📊 Tenés {projects.length} proyecto{projects.length !== 1 ? 's' : ''} guardado{projects.length !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={loadProjects}
              disabled={refreshing}
            >
              <Text style={styles.refreshButtonText}>
                {refreshing ? '🔄' : '🔄 Actualizar'}
              </Text>
            </TouchableOpacity>
          </View>

          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectCard}
              onPress={() => handleOpenProject(project.id)}
              disabled={deletingId === project.id}
            >
              <View style={styles.projectHeader}>
                <View style={styles.projectTitleContainer}>
                  <Text style={styles.projectName} numberOfLines={1}>
                    {project.nombre}
                  </Text>
                  {deletingId === project.id && (
                    <View style={styles.deletingContainer}>
                      <ActivityIndicator size="small" color="#EF4444" />
                      <Text style={styles.deletingText}>Eliminando...</Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.deleteButton,
                    deletingId === project.id && styles.deleteButtonDisabled
                  ]}
                  onPress={(e) => handleDeleteClick(project, e)}
                  disabled={deletingId === project.id}
                >
                  <Text style={styles.deleteButtonText}>
                    {deletingId === project.id ? '⏳' : '🗑️'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {project.descripcion ? (
                <Text style={styles.projectDescription} numberOfLines={2}>
                  {project.descripcion}
                </Text>
              ) : null}
              
              <View style={styles.projectInfo}>
                <View style={styles.projectDateContainer}>
                  <Text style={styles.projectDateIcon}>📅</Text>
                  <Text style={styles.projectDate}>
                    {formatDate(project.fecha_actualizacion || project.fecha_creacion)}
                  </Text>
                </View>
                
                <View style={styles.componentsBadge}>
                  <Text style={styles.componentsBadgeText}>
                    {project.componentes_count || 0} componente{project.componentes_count !== 1 ? 's' : ''}
                  </Text>
                </View>
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
    lineHeight: 22,
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
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsText: {
    color: '#8b9cb3',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  refreshButtonText: {
    color: '#667eea',
    fontSize: 12,
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
  projectTitleContainer: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  deletingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  deletingText: {
    fontSize: 12,
    color: '#EF4444',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#EF4444',
  },
  projectDescription: {
    fontSize: 14,
    color: '#8b9cb3',
    marginBottom: 16,
    lineHeight: 20,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  projectDateIcon: {
    fontSize: 12,
  },
  projectDate: {
    fontSize: 12,
    color: '#8b9cb3',
  },
  componentsBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  componentsBadgeText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#667eea',
  },
  addProjectText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '700',
  },
  hintContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 40,
  },
  hintText: {
    color: '#ffd700',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1b27',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalBody: {
    padding: 24,
    paddingVertical: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#8b9cb3',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  projectNameHighlight: {
    color: '#ffffff',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  modalWarning: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    color: '#8b9cb3',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  deleteModalButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});