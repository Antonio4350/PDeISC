import api from './api';

class ProjectService {
  
  // Obtener proyectos del usuario
  async getUserProjects() {
    try {
      const response = await api.get('/api/projects');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo proyectos:', error);
      throw error;
    }
  }

  // Crear nuevo proyecto
  async createProject(projectData) {
    try {
      const response = await api.post('/api/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creando proyecto:', error);
      throw error;
    }
  }

  // Obtener proyecto específico
  async getProjectById(projectId) {
    try {
      const response = await api.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo proyecto:', error);
      throw error;
    }
  }

  // Agregar componente a proyecto
  async addComponentToProject(projectId, componentData) {
    try {
      const response = await api.post(`/api/projects/${projectId}/components`, componentData);
      return response.data;
    } catch (error) {
      console.error('Error agregando componente:', error);
      throw error;
    }
  }

  // Remover componente de proyecto
  async removeComponentFromProject(projectId, tipoComponente) {
    try {
      const response = await api.delete(`/api/projects/${projectId}/components/${tipoComponente}`);
      return response.data;
    } catch (error) {
      console.error('Error removiendo componente:', error);
      throw error;
    }
  }

  // Verificar compatibilidad
  async checkCompatibility(projectId) {
    try {
      const response = await api.get(`/api/projects/${projectId}/compatibility`);
      return response.data;
    } catch (error) {
      console.error('Error verificando compatibilidad:', error);
      throw error;
    }
  }

  // Eliminar proyecto
  async deleteProject(projectId) {
    try {
      const response = await api.delete(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      throw error;
    }
  }
}

export default new ProjectService();