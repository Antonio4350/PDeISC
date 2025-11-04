const API_URL = "http://192.168.100.156:5000";

export interface Componente {
  id?: number;
  marca: string;
  modelo: string;
  [key: string]: any;
}

export interface Procesador extends Componente {
  generacion?: string;
  año_lanzamiento?: number;
  socket: string;
  nucleos?: number;
  hilos?: number;
  frecuencia_base?: number;
  frecuencia_turbo?: number;
  cache?: string;
  tdp?: number;
  tipo_memoria?: string;
  velocidad_memoria_max?: number;
  graficos_integrados?: boolean;
  modelo_graficos?: string;
  tecnologia?: string;
  imagen_url?: string;
}

export interface Motherboard extends Componente {
  socket: string;
  chipset?: string;
  formato?: string;
  tipo_memoria?: string;
  slots_memoria?: number;
  memoria_maxima?: number;
  velocidad_memoria_soportada?: number;
  slots_pcie?: number;
  version_pcie?: string;
  puertos_sata?: number;
  puertos_m2?: number;
  conectividad_red?: string;
  audio?: string;
  usb_puertos?: string;
  imagen_url?: string;
}

export interface RAM extends Componente {
  tipo: string;
  capacidad: number;
  velocidad_mhz?: number;
  velocidad_mt?: number;
  latencia?: string;
  voltaje?: number;
  formato?: string;
  rgb?: boolean;
  imagen_url?: string;
}

class ComponentService {
  async getComponents(type: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/components/${type}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo componentes:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createProcessor(processorData: Procesador): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/components/processors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processorData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creando procesador:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createMotherboard(motherboardData: Motherboard): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/components/motherboards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(motherboardData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creando motherboard:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createRAM(ramData: RAM): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/components/ram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ramData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creando RAM:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/components/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo stats:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }
}

export default new ComponentService();