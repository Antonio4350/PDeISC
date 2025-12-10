// app/services/projectService.ts - VERSIÓN FINAL
import apiConfig from '../config/apiConfig';
import { getToken } from '../../storage'; // ✅ Usar la función del archivo común

const API_URL = apiConfig.apiUrl;

class ProjectService {
  
  async createProject(projectData: any): Promise<any> {
    try {
      console.log('📤 Enviando proyecto...');
      
      // ✅ Usar función universal
      const token = await getToken();
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('📤 URL:', `${API_URL}/api/projects`);
      console.log('📤 Token:', token ? 'Presente' : 'Ausente');
      
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify(projectData),
      });
      
      console.log('📥 Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        
        if (response.status === 401 || response.status === 403) {
          return { 
            success: false, 
            error: 'Sesión expirada. Iniciá sesión nuevamente.' 
          };
        }
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText || 'Error desconocido'}` 
        };
      }
      
      const result = await response.json();
      console.log('✅ Proyecto creado:', result);
      return result;
      
    } catch (error: any) {
      console.error('💥 Error de conexión:', error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión con el servidor' 
      };
    }
  }

  async getUserProjects(): Promise<any> {
    try {
      // ✅ Usar función universal
      const token = await getToken();
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('📥 Solicitando proyectos...');
      
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error obteniendo proyectos:', errorText);
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText || 'Error desconocido'}` 
        };
      }
      
      const result = await response.json();
      console.log('✅ Proyectos obtenidos:', result.data?.length || 0);
      return result;
      
    } catch (error: any) {
      console.error('💥 Error de conexión:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  async getProjectById(projectId: number): Promise<any> {
    try {
      // ✅ Usar función universal
      const token = await getToken();
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`📥 Obteniendo proyecto ID: ${projectId}`);
      
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error obteniendo proyecto:', errorText);
        
        if (response.status === 404) {
          return { 
            success: false, 
            error: 'Proyecto no encontrado' 
          };
        }
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText || 'Error desconocido'}` 
        };
      }
      
      const result = await response.json();
      console.log('✅ Proyecto obtenido');
      return result;
      
    } catch (error: any) {
      console.error('💥 Error obteniendo proyecto:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  async deleteProject(projectId: number): Promise<any> {
    try {
      // ✅ Usar función universal
      const token = await getToken();
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`🗑️ Eliminando proyecto ID: ${projectId}`);
      
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error eliminando proyecto:', errorText);
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText || 'Error desconocido'}` 
        };
      }
      
      const result = await response.json();
      console.log('✅ Proyecto eliminado');
      return result;
      
    } catch (error: any) {
      console.error('💥 Error eliminando proyecto:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  async updateProject(projectId: number, projectData: any): Promise<any> {
    try {
      console.log('📝 Actualizando proyecto...');
      
      // ✅ Usar función universal
      const token = await getToken();
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`📝 Actualizando proyecto ID: ${projectId}`);
      
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(projectData),
      });
      
      console.log('📥 Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error actualizando proyecto:', errorText);
        
        return { 
          success: false, 
          error: `Error ${response.status}: ${errorText || 'Error desconocido'}` 
        };
      }
      
      const result = await response.json();
      console.log('✅ Proyecto actualizado');
      return result;
      
    } catch (error: any) {
      console.error('💥 Error actualizando proyecto:', error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión con el servidor' 
      };
    }
  }
}

export default new ProjectService();