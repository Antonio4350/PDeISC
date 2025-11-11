// services/projectService.js - CORREGIDO
const API_URL = "http://localhost:5000";

class ProjectService {
  
  // Obtener proyectos del usuario
  async getUserProjects() {
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo proyectos:', error);
      throw error;
    }
  }

  // Crear nuevo proyecto
  async createProject(projectData) {
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando proyecto:', error);
      throw error;
    }
  }

  // Obtener proyecto específico
  async getProjectById(projectId) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo proyecto:', error);
      throw error;
    }
  }

  // Agregar componente a proyecto
  async addComponentToProject(projectId, componentData) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/components`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(componentData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error agregando componente:', error);
      throw error;
    }
  }

  // Remover componente de proyecto
  async removeComponentFromProject(projectId, tipoComponente) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/components/${tipoComponente}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removiendo componente:', error);
      throw error;
    }
  }

  // Verificar compatibilidad
  async checkCompatibility(projectId) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/compatibility`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error verificando compatibilidad:', error);
      throw error;
    }
  }

  // Eliminar proyecto
  async deleteProject(projectId) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      throw error;
    }
  }
}

export default new ProjectService();