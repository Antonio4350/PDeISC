// app/services/api.ts - VERSIÓN COMPATIBLE WEB Y MOBILE
import apiConfig from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = apiConfig.apiUrl;

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

// ✅ Función universal para obtener token
const getTokenFromStorage = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Web: localStorage
      return localStorage.getItem('token');
    } else {
      // Mobile: AsyncStorage
      return await AsyncStorage.getItem('token');
    }
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}, requireAuth: boolean = false) {
    try {
      const url = `${API_URL}${endpoint}`;
      
      // Headers por defecto
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Agregar token si es requerido
      if (requireAuth) {
        const token = await getTokenFromStorage();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('⚠️ Token no disponible para solicitud autenticada');
        }
      }
      
      console.log(`📤 Enviando solicitud a: ${url}`);
      
      const response = await fetch(url, {
        headers,
        ...options,
      });
      
      const textResponse = await response.text();
      
      if (!response.ok) {
        console.error(`❌ Error ${response.status}: ${textResponse}`);
        throw new Error(`Error ${response.status}: ${textResponse || 'Error desconocido'}`);
      }
      
      // Intentar parsear como JSON
      try {
        const jsonResponse = JSON.parse(textResponse);
        console.log(`✅ Respuesta exitosa de ${endpoint}`);
        return jsonResponse;
      } catch (parseError) {
        console.error('❌ Error parseando respuesta JSON:', parseError);
        throw new Error('Respuesta inválida del servidor');
      }
      
    } catch (error) {
      console.error(`💥 Error en solicitud a ${endpoint}:`, error);
      throw error;
    }
  }

  async login(loginData: LoginData) {
    console.log('🔐 Iniciando login...', { email: loginData.email });
    return this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async register(registerData: RegisterData) {
    console.log('📝 Iniciando registro...', { email: registerData.email });
    return this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async googleLogin(tokens: { idToken?: string; accessToken?: string }) {
    console.log('🔐 Iniciando login con Google...');
    return this.makeRequest('/googleLogin', {
      method: 'POST',
      body: JSON.stringify(tokens),
    });
  }

  async getUserProfile(userId: number) {
    console.log(`👤 Obteniendo perfil del usuario ${userId}...`);
    return this.makeRequest(`/user/${userId}`, {}, true);
  }

  // ✅ Métodos para componentes
  async getComponents(type: string) {
    console.log(`🔧 Obteniendo componentes tipo: ${type}`);
    return this.makeRequest(`/components/${type}`, {}, true);
  }

  // ✅ Métodos para proyectos (requieren autenticación)
  async createProject(projectData: any) {
    console.log('📁 Creando proyecto...');
    return this.makeRequest('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }, true);
  }

  async updateProject(id: number, projectData: any) {
    console.log(`📁 Actualizando proyecto ${id}...`);
    return this.makeRequest(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }, true);
  }

  async getProjectById(id: number) {
    console.log(`📁 Obteniendo proyecto ${id}...`);
    return this.makeRequest(`/api/projects/${id}`, {}, true);
  }

  async getUserProjects() {
    console.log('📁 Obteniendo proyectos del usuario...');
    return this.makeRequest('/api/projects', {}, true);
  }

  async deleteProject(id: number) {
    console.log(`🗑️ Eliminando proyecto ${id}...`);
    return this.makeRequest(`/api/projects/${id}`, {
      method: 'DELETE',
    }, true);
  }
}

export default new ApiService();