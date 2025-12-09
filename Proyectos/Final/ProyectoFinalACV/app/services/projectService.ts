import apiConfig from '../config/apiConfig';
const API_URL = apiConfig.apiUrl;

class ProjectService {
  
  async createProject(projectData: any): Promise<any> {
    try {
      console.log('Enviando proyecto...');
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify(projectData),
      });
      
      console.log('Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error:', errorText);
        
        if (response.status === 401 || response.status === 403) {
          return { 
            success: false, 
            error: 'Sesión expirada. Iniciá sesión nuevamente.' 
          };
        }
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText}` 
        };
      }
      
      const result = await response.json();
      console.log('Proyecto creado:', result);
      return result;
      
    } catch (error: any) {
      console.error('Error:', error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async getUserProjects(): Promise<any> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error obteniendo proyectos:', errorText);
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText}` 
        };
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // NUEVO MÉTODO: Obtener proyecto por ID
  async getProjectById(projectId: number): Promise<any> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error obteniendo proyecto:', errorText);
        
        if (response.status === 404) {
          return { 
            success: false, 
            error: 'Proyecto no encontrado' 
          };
        }
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText}` 
        };
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error obteniendo proyecto:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // NUEVO MÉTODO: Eliminar proyecto
  async deleteProject(projectId: number): Promise<any> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error eliminando proyecto:', errorText);
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText}` 
        };
      }
      
      const result = await response.json();
      console.log('Proyecto eliminado:', result);
      return result;
      
    } catch (error: any) {
      console.error('Error eliminando proyecto:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // NUEVO MÉTODO: Actualizar proyecto
  async updateProject(projectId: number, projectData: any): Promise<any> {
    try {
      console.log('Actualizando proyecto...');
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(projectData),
      });
      
      console.log('Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error actualizando proyecto:', errorText);
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText}` 
        };
      }
      
      const result = await response.json();
      console.log('Proyecto actualizado:', result);
      return result;
      
    } catch (error: any) {
      console.error('Error actualizando proyecto:', error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }
}

export default new ProjectService();