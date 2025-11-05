// services/components.ts - COMPLETAMENTE ACTUALIZADO
const API_URL = "http://192.168.1.35:5000";

export interface Componente {
  id?: number;
  marca: string;
  modelo: string;
  tipo?: string;
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

export interface GPU extends Componente {
  fabricante?: string;
  memoria?: number;
  tipo_memoria?: string;
  bus_memoria?: number;
  velocidad_memoria?: number;
  nucleos_cuda?: number;
  frecuencia_base?: number;
  frecuencia_boost?: number;
  tdp?: number;
  conectores_alimentacion?: string;
  salidas_video?: string;
  longitud_mm?: number;
  altura_mm?: number;
  slots_ocupados?: number;
  peso_kg?: number;
  imagen_url?: string;
}

export interface Almacenamiento extends Componente {
  capacidad: number;
  tipo: string;
  interfaz?: string;
  velocidad_lectura?: number;
  velocidad_escritura?: number;
  formato?: string;
  rpm?: number;
  imagen_url?: string;
}

export interface FuentePoder extends Componente {
  potencia: number;
  certificacion?: string;
  modular?: string;
  conectores_pcie?: string;
  conectores_sata?: number;
  conectores_molex?: number;
  formato?: string;
  protecciones?: string;
  imagen_url?: string;
}

export interface Gabinete extends Componente {
  formato?: string;
  motherboards_soportadas?: string;
  longitud_max_gpu?: number;
  altura_max_cooler?: number;
  bahias_35?: number;
  bahias_25?: number;
  slots_expansion?: number;
  ventiladores_incluidos?: string;
  ventiladores_soportados?: string;
  radiador_soportado?: string;
  panel_frontal?: string;
  material?: string;
  imagen_url?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  type?: string;
  message?: string;
}

class ComponentService {
  
  // ========== MÉTODOS GENERALES ==========

  async getComponents(type: string): Promise<ApiResponse<any[]>> {
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

  async getFormOptions(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_URL}/components/form-options`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo opciones:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getStats(): Promise<ApiResponse<any>> {
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

  // ========== PROCESADORES ==========

  async getProcessors(): Promise<ApiResponse<Procesador[]>> {
    try {
      const response = await fetch(`${API_URL}/components/processors`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo procesadores:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getProcessorById(id: number): Promise<ApiResponse<Procesador>> {
    try {
      const response = await fetch(`${API_URL}/components/processors/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo procesador:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createProcessor(processorData: Procesador): Promise<ApiResponse<Procesador>> {
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

  async updateProcessor(id: number, processorData: Procesador): Promise<ApiResponse<Procesador>> {
    try {
      const response = await fetch(`${API_URL}/components/processors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processorData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando procesador:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteProcessor(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/components/processors/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando procesador:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== MOTHERBOARDS ==========

  async getMotherboards(): Promise<ApiResponse<Motherboard[]>> {
    try {
      const response = await fetch(`${API_URL}/components/motherboards`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo motherboards:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getMotherboardById(id: number): Promise<ApiResponse<Motherboard>> {
    try {
      const response = await fetch(`${API_URL}/components/motherboards/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo motherboard:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createMotherboard(motherboardData: Motherboard): Promise<ApiResponse<Motherboard>> {
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

  async updateMotherboard(id: number, motherboardData: Motherboard): Promise<ApiResponse<Motherboard>> {
    try {
      const response = await fetch(`${API_URL}/components/motherboards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(motherboardData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando motherboard:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteMotherboard(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/components/motherboards/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando motherboard:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== MEMORIAS RAM ==========

  async getRAM(): Promise<ApiResponse<RAM[]>> {
    try {
      const response = await fetch(`${API_URL}/components/ram`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo RAM:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getRAMById(id: number): Promise<ApiResponse<RAM>> {
    try {
      const response = await fetch(`${API_URL}/components/ram/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo RAM:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createRAM(ramData: RAM): Promise<ApiResponse<RAM>> {
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

  async updateRAM(id: number, ramData: RAM): Promise<ApiResponse<RAM>> {
    try {
      const response = await fetch(`${API_URL}/components/ram/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ramData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando RAM:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteRAM(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/components/ram/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando RAM:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== TARJETAS GRÁFICAS ==========

  async getGPUs(): Promise<ApiResponse<GPU[]>> {
    try {
      const response = await fetch(`${API_URL}/components/tarjetas_graficas`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo GPUs:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createGPU(gpuData: GPU): Promise<ApiResponse<GPU>> {
    try {
      const response = await fetch(`${API_URL}/components/tarjetas_graficas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gpuData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creando GPU:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateGPU(id: number, gpuData: GPU): Promise<ApiResponse<GPU>> {
    try {
      const response = await fetch(`${API_URL}/components/tarjetas_graficas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gpuData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando GPU:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteGPU(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/components/tarjetas_graficas/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando GPU:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== ALMACENAMIENTO ==========

  async getStorage(): Promise<ApiResponse<Almacenamiento[]>> {
    try {
      const response = await fetch(`${API_URL}/components/almacenamiento`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo almacenamiento:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createStorage(storageData: Almacenamiento): Promise<ApiResponse<Almacenamiento>> {
    try {
      const response = await fetch(`${API_URL}/components/almacenamiento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storageData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creando almacenamiento:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateStorage(id: number, storageData: Almacenamiento): Promise<ApiResponse<Almacenamiento>> {
    try {
      const response = await fetch(`${API_URL}/components/almacenamiento/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storageData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando almacenamiento:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteStorage(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/components/almacenamiento/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando almacenamiento:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== FUENTES DE PODER ==========

  async getPSUs(): Promise<ApiResponse<FuentePoder[]>> {
    try {
      const response = await fetch(`${API_URL}/components/fuentes_poder`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo fuentes de poder:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createPSU(psuData: FuentePoder): Promise<ApiResponse<FuentePoder>> {
    try {
      const response = await fetch(`${API_URL}/components/fuentes_poder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(psuData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creando fuente de poder:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updatePSU(id: number, psuData: FuentePoder): Promise<ApiResponse<FuentePoder>> {
    try {
      const response = await fetch(`${API_URL}/components/fuentes_poder/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(psuData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando fuente de poder:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deletePSU(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/components/fuentes_poder/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando fuente de poder:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== GABINETES ==========

  async getCases(): Promise<ApiResponse<Gabinete[]>> {
    try {
      const response = await fetch(`${API_URL}/components/gabinetes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo gabinetes:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createCase(caseData: Gabinete): Promise<ApiResponse<Gabinete>> {
    try {
      const response = await fetch(`${API_URL}/components/gabinetes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creando gabinete:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateCase(id: number, caseData: Gabinete): Promise<ApiResponse<Gabinete>> {
    try {
      const response = await fetch(`${API_URL}/components/gabinetes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando gabinete:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteCase(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/components/gabinetes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando gabinete:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getPropertiesByType(type: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/properties/${type}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo propiedades:', error);
    return { success: false, error: 'Error de conexión' };
  }
}

  // ========== COMPATIBILIDAD ==========

  async checkCompatibility(cpuId: number, motherboardId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_URL}/components/compatibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpuId, motherboardId }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error verificando compatibilidad:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }
}

export default new ComponentService();