// services/components.ts - VERSIÓN COMPLETA CORREGIDA
import apiConfig from '../config/apiConfig';

const API_URL = apiConfig.apiUrl;

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
      console.log(`[GET] Obteniendo componentes tipo: ${type}`);
      const response = await fetch(`${API_URL}/components/${type}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error obteniendo ${type}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión. Verifica que el servidor esté ejecutándose.' 
      };
    }
  }

  async getFormOptions(): Promise<ApiResponse<any>> {
    try {
      console.log('[GET] Obteniendo opciones de formulario...');
      const response = await fetch(`${API_URL}/components/form-options`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo opciones:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getStats(): Promise<ApiResponse<any>> {
    try {
      console.log('[GET] Obteniendo estadísticas...');
      const response = await fetch(`${API_URL}/components/stats`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo stats:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== PROCESADORES ==========

  async getProcessors(): Promise<ApiResponse<Procesador[]>> {
    try {
      console.log('[GET] Obteniendo procesadores...');
      const response = await fetch(`${API_URL}/components/processors`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo procesadores:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getProcessorById(id: number): Promise<ApiResponse<Procesador>> {
    try {
      console.log(`[GET] Obteniendo procesador ID: ${id}`);
      const response = await fetch(`${API_URL}/components/processors/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error obteniendo procesador ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createProcessor(processorData: Procesador): Promise<ApiResponse<Procesador>> {
    try {
      console.log('[POST] Creando procesador:', processorData.marca, processorData.modelo);
      const response = await fetch(`${API_URL}/components/processors`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(processorData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error creando procesador:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateProcessor(id: number, processorData: Procesador): Promise<ApiResponse<Procesador>> {
    try {
      console.log(`[PUT] Actualizando procesador ID: ${id}`);
      const response = await fetch(`${API_URL}/components/processors/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(processorData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error actualizando procesador ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteProcessor(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`[DELETE] Eliminando procesador ID: ${id}`);
      const response = await fetch(`${API_URL}/components/processors/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error eliminando procesador ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== MOTHERBOARDS ==========

  async getMotherboards(): Promise<ApiResponse<Motherboard[]>> {
    try {
      console.log('[GET] Obteniendo motherboards...');
      const response = await fetch(`${API_URL}/components/motherboards`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo motherboards:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getMotherboardById(id: number): Promise<ApiResponse<Motherboard>> {
    try {
      console.log(`[GET] Obteniendo motherboard ID: ${id}`);
      const response = await fetch(`${API_URL}/components/motherboards/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error obteniendo motherboard ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createMotherboard(motherboardData: Motherboard): Promise<ApiResponse<Motherboard>> {
    try {
      console.log('[POST] Creando motherboard:', motherboardData.marca, motherboardData.modelo);
      const response = await fetch(`${API_URL}/components/motherboards`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(motherboardData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error creando motherboard:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateMotherboard(id: number, motherboardData: Motherboard): Promise<ApiResponse<Motherboard>> {
    try {
      console.log(`[PUT] Actualizando motherboard ID: ${id}`);
      const response = await fetch(`${API_URL}/components/motherboards/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(motherboardData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error actualizando motherboard ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteMotherboard(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`[DELETE] Eliminando motherboard ID: ${id}`);
      const response = await fetch(`${API_URL}/components/motherboards/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error eliminando motherboard ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== MEMORIAS RAM ==========

  async getRAM(): Promise<ApiResponse<RAM[]>> {
    try {
      console.log('[GET] Obteniendo RAM...');
      const response = await fetch(`${API_URL}/components/ram`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo RAM:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getRAMById(id: number): Promise<ApiResponse<RAM>> {
    try {
      console.log(`[GET] Obteniendo RAM ID: ${id}`);
      const response = await fetch(`${API_URL}/components/ram/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error obteniendo RAM ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createRAM(ramData: RAM): Promise<ApiResponse<RAM>> {
    try {
      console.log('[POST] Creando RAM:', ramData.marca, ramData.modelo);
      const response = await fetch(`${API_URL}/components/ram`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(ramData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error creando RAM:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateRAM(id: number, ramData: RAM): Promise<ApiResponse<RAM>> {
    try {
      console.log(`[PUT] Actualizando RAM ID: ${id}`);
      const response = await fetch(`${API_URL}/components/ram/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(ramData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error actualizando RAM ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteRAM(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`[DELETE] Eliminando RAM ID: ${id}`);
      const response = await fetch(`${API_URL}/components/ram/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error eliminando RAM ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== TARJETAS GRÁFICAS ==========

  async getGPUs(): Promise<ApiResponse<GPU[]>> {
    try {
      console.log('[GET] Obteniendo tarjetas gráficas...');
      const response = await fetch(`${API_URL}/components/tarjetas_graficas`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo GPUs:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica que el servidor esté ejecutándose.' 
      };
    }
  }

  async getGPUById(id: number): Promise<ApiResponse<GPU>> {
    try {
      console.log(`[GET] Obteniendo GPU ID: ${id}`);
      const response = await fetch(`${API_URL}/components/tarjetas_graficas/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ERROR] HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[GET] GPU obtenida:`, result.data?.marca, result.data?.modelo);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] Error obteniendo GPU ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async createGPU(gpuData: GPU): Promise<ApiResponse<GPU>> {
    try {
      console.log('[POST] Creando GPU:', gpuData.marca, gpuData.modelo);
      const response = await fetch(`${API_URL}/components/tarjetas_graficas`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(gpuData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error creando GPU:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateGPU(id: number, gpuData: GPU): Promise<ApiResponse<GPU>> {
    try {
      console.log(`[PUT] Actualizando GPU ID: ${id}`, gpuData);
      const response = await fetch(`${API_URL}/components/tarjetas_graficas/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(gpuData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ERROR] HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[PUT] GPU actualizada:`, result);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] Error actualizando GPU ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async deleteGPU(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`[DELETE] Eliminando GPU ID: ${id}`);
      const response = await fetch(`${API_URL}/components/tarjetas_graficas/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error eliminando GPU ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== ALMACENAMIENTO ==========

  async getStorage(): Promise<ApiResponse<Almacenamiento[]>> {
    try {
      console.log('[GET] Obteniendo almacenamiento...');
      const response = await fetch(`${API_URL}/components/almacenamiento`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo almacenamiento:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica que el servidor esté ejecutándose.' 
      };
    }
  }

  async getStorageById(id: number): Promise<ApiResponse<Almacenamiento>> {
    try {
      console.log(`[GET] Obteniendo almacenamiento ID: ${id}`);
      const response = await fetch(`${API_URL}/components/almacenamiento/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ERROR] HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[GET] Almacenamiento obtenido:`, result.data?.marca, result.data?.modelo);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] Error obteniendo almacenamiento ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async createStorage(storageData: Almacenamiento): Promise<ApiResponse<Almacenamiento>> {
    try {
      console.log('[POST] Creando almacenamiento:', storageData.marca, storageData.modelo);
      const response = await fetch(`${API_URL}/components/almacenamiento`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(storageData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error creando almacenamiento:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateStorage(id: number, storageData: Almacenamiento): Promise<ApiResponse<Almacenamiento>> {
    try {
      console.log(`[PUT] Actualizando almacenamiento ID: ${id}`, storageData);
      const response = await fetch(`${API_URL}/components/almacenamiento/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(storageData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ERROR] HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[PUT] Almacenamiento actualizado:`, result);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] Error actualizando almacenamiento ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async deleteStorage(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`[DELETE] Eliminando almacenamiento ID: ${id}`);
      const response = await fetch(`${API_URL}/components/almacenamiento/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error eliminando almacenamiento ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== FUENTES DE PODER ==========

  async getPSUs(): Promise<ApiResponse<FuentePoder[]>> {
    try {
      console.log('[GET] Obteniendo fuentes de poder...');
      const response = await fetch(`${API_URL}/components/fuentes_poder`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo fuentes de poder:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica que el servidor esté ejecutándose.' 
      };
    }
  }

  async getPSUById(id: number): Promise<ApiResponse<FuentePoder>> {
    try {
      console.log(`[GET] Obteniendo PSU ID: ${id}`);
      const response = await fetch(`${API_URL}/components/fuentes_poder/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ERROR] HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[GET] PSU obtenida:`, result.data?.marca, result.data?.modelo);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] Error obteniendo PSU ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async createPSU(psuData: FuentePoder): Promise<ApiResponse<FuentePoder>> {
    try {
      console.log('[POST] Creando PSU:', psuData.marca, psuData.modelo);
      const response = await fetch(`${API_URL}/components/fuentes_poder`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(psuData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error creando PSU:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updatePSU(id: number, psuData: FuentePoder): Promise<ApiResponse<FuentePoder>> {
    try {
      console.log(`[PUT] Actualizando PSU ID: ${id}`, psuData);
      const response = await fetch(`${API_URL}/components/fuentes_poder/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(psuData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ERROR] HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[PUT] PSU actualizada:`, result);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] Error actualizando PSU ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async deletePSU(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`[DELETE] Eliminando PSU ID: ${id}`);
      const response = await fetch(`${API_URL}/components/fuentes_poder/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error eliminando PSU ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== GABINETES ==========

  async getCases(): Promise<ApiResponse<Gabinete[]>> {
    try {
      console.log('[GET] Obteniendo gabinetes...');
      const response = await fetch(`${API_URL}/components/gabinetes`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo gabinetes:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica que el servidor esté ejecutándose.' 
      };
    }
  }

  async getCaseById(id: number): Promise<ApiResponse<Gabinete>> {
    try {
      console.log(`[GET] Obteniendo gabinete ID: ${id}`);
      const response = await fetch(`${API_URL}/components/gabinetes/${id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ERROR] HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[GET] Gabinete obtenido:`, result.data?.marca, result.data?.modelo);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] Error obteniendo gabinete ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async createCase(caseData: Gabinete): Promise<ApiResponse<Gabinete>> {
    try {
      console.log('[POST] Creando gabinete:', caseData.marca, caseData.modelo);
      const response = await fetch(`${API_URL}/components/gabinetes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(caseData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error creando gabinete:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateCase(id: number, caseData: Gabinete): Promise<ApiResponse<Gabinete>> {
    try {
      console.log(`[PUT] Actualizando gabinete ID: ${id}`, caseData);
      const response = await fetch(`${API_URL}/components/gabinetes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(caseData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ERROR] HTTP error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[PUT] Gabinete actualizado:`, result);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] Error actualizando gabinete ${id}:`, error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión' 
      };
    }
  }

  async deleteCase(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`[DELETE] Eliminando gabinete ID: ${id}`);
      const response = await fetch(`${API_URL}/components/gabinetes/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`[ERROR] Error eliminando gabinete ${id}:`, error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== PROPIEDADES ==========

  async getPropertiesByType(type: string): Promise<ApiResponse<any>> {
    try {
      console.log(`[GET] Obteniendo propiedades tipo: ${type}`);
      const response = await fetch(`${API_URL}/properties/${type}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error obteniendo propiedades:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // ========== COMPATIBILIDAD ==========

  async checkCompatibility(cpuId: number, motherboardId: number): Promise<ApiResponse<any>> {
    try {
      console.log(`[POST] Verificando compatibilidad CPU:${cpuId}, Mobo:${motherboardId}`);
      const response = await fetch(`${API_URL}/components/compatibility`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ cpuId, motherboardId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('[ERROR] Error verificando compatibilidad:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }
}

export default new ComponentService();