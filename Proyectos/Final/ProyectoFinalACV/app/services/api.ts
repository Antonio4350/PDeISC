import apiConfig from '../config/apiConfig';
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

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const url = `${API_URL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async login(loginData: LoginData) {
    return this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async register(registerData: RegisterData) {
    return this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async googleLogin(tokens: { idToken?: string; accessToken?: string }) {
    return this.makeRequest('/googleLogin', {
      method: 'POST',
      body: JSON.stringify(tokens),
    });
  }

  async getUserProfile(userId: number) {
    return this.makeRequest(`/user/${userId}`);
  }
}

export default new ApiService();