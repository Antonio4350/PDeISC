// services/api.ts - CORREGIDO
const API_URL = "http://localhost:5000";

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
        console.error(`❌ HTTP error! status: ${response.status}, body: ${errorText}`);
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
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: 'No se pudo conectar con el servidor. Verifica que esté ejecutándose en localhost:5000.' 
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return { 
        success: false, 
        error: 'No se pudo conectar con el servidor' 
      };
    }
  }
}

export default new ApiService();