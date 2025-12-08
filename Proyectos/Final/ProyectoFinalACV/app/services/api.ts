// app/services/api.ts - VERSIÓN PARA PRODUCCIÓN
import apiConfig from '../config/apiConfig';

// Usar la URL configurada dinámicamente
const API_URL = apiConfig.apiUrl;

console.log('🌍 API URL configurada en api.ts:', API_URL);
console.log('🔧 Entorno:', apiConfig.environment);

export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  rol?: string;
  avatar_url?: string;
  telefono?: string;
  token?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const url = `${API_URL}${endpoint}`;
      console.log(`🔄 Haciendo request a: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      console.log(`📊 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Response success:`, data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en la request:', error);
      throw error;
    }
  }

  // Login normal
  async login(loginData: LoginData): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const result = await this.makeRequest('/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });
      
      return result;
    } catch (error: any) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: `No se pudo conectar con el servidor. URL: ${API_URL}` 
      };
    }
  }

  // Registro normal
  async register(registerData: RegisterData): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const result = await this.makeRequest('/register', {
        method: 'POST',
        body: JSON.stringify(registerData),
      });
      
      return result;
    } catch (error: any) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: 'No se pudo conectar con el servidor' 
      };
    }
  }

  // Login con Google
  async googleLogin(tokens: { idToken?: string; accessToken?: string }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const result = await this.makeRequest('/googleLogin', {
        method: 'POST',
        body: JSON.stringify(tokens),
      });
      
      return result;
    } catch (error: any) {
      console.error('Error en Google login:', error);
      return { 
        success: false, 
        error: 'No se pudo conectar con el servidor' 
      };
    }
  }

  // Obtener perfil de usuario
  async getUserProfile(userId: number): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await this.makeRequest(`/user/${userId}`);
      return result;
    } catch (error: any) {
      console.error('Error obteniendo perfil:', error);
      return { 
        success: false, 
        error: 'No se pudo conectar con el servidor' 
      };
    }
  }

  // ========== MÉTODOS GENÉRICOS PARA COMPONENTES ==========
  
  // Obtener componentes por tipo
  async getComponents(tipo: string): Promise<any> {
    try {
      const result = await this.makeRequest(`/components/${tipo}`);
      return result;
    } catch (error: any) {
      console.error(`Error obteniendo componentes ${tipo}:`, error);
      throw error;
    }
  }

  // Obtener componente específico
  async getComponent(tipo: string, id: number): Promise<any> {
    try {
      const result = await this.makeRequest(`/components/${tipo}/${id}`);
      return result;
    } catch (error: any) {
      console.error(`Error obteniendo componente ${tipo} ${id}:`, error);
      throw error;
    }
  }

  // Crear componente
  async createComponent(tipo: string, data: any): Promise<any> {
    try {
      const result = await this.makeRequest(`/components/${tipo}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      console.error(`Error creando componente ${tipo}:`, error);
      throw error;
    }
  }

  // Actualizar componente
  async updateComponent(tipo: string, id: number, data: any): Promise<any> {
    try {
      const result = await this.makeRequest(`/components/${tipo}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      console.error(`Error actualizando componente ${tipo} ${id}:`, error);
      throw error;
    }
  }

  // Eliminar componente
  async deleteComponent(tipo: string, id: number): Promise<any> {
    try {
      const result = await this.makeRequest(`/components/${tipo}/${id}`, {
        method: 'DELETE',
      });
      return result;
    } catch (error: any) {
      console.error(`Error eliminando componente ${tipo} ${id}:`, error);
      throw error;
    }
  }

  // ========== MÉTODOS PARA PROYECTOS ==========
  
  async getProjects(token: string): Promise<any> {
    try {
      const result = await this.makeRequest('/api/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return result;
    } catch (error: any) {
      console.error('Error obteniendo proyectos:', error);
      throw error;
    }
  }

  async createProject(data: any, token: string): Promise<any> {
    try {
      const result = await this.makeRequest('/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      console.error('Error creando proyecto:', error);
      throw error;
    }
  }

  // ========== MÉTODOS PARA PROPIEDADES ==========
  
  async getProperties(): Promise<any> {
    try {
      const result = await this.makeRequest('/properties');
      return result;
    } catch (error: any) {
      console.error('Error obteniendo propiedades:', error);
      throw error;
    }
  }

  // ========== MÉTODO DE PRUEBA ==========
  
  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const result = await this.makeRequest('/health');
      return { success: true, message: 'Conexión exitosa con el backend' };
    } catch (error: any) {
      return { 
        success: false, 
        error: `No se pudo conectar al backend en ${API_URL}. Error: ${error.message}` 
      };
    }
  }
}

export default new ApiService();