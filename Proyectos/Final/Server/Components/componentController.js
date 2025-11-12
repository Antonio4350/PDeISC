import componentService from './componentService.js';
import propertyService from './propertyService.js';

class ComponentController {
  
  // ========== PROCESADORES ==========
  
  async getProcessors(req, res) {
    try {
      console.log('Obteniendo lista de procesadores...');
      const processors = await componentService.getAllProcessors();
      
      res.json({
        success: true,
        data: processors,
        count: processors.length
      });
    } catch (error) {
      console.error('Error obteniendo procesadores:', error);
      res.json({
        success: false,
        error: 'Error al obtener procesadores'
      });
    }
  }

  async getProcessorById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Obteniendo procesador ID: ${id}`);
      
      const processor = await componentService.getProcessorById(id);
      
      if (!processor) {
        return res.json({
          success: false,
          error: 'Procesador no encontrado'
        });
      }

      res.json({
        success: true,
        data: processor
      });
    } catch (error) {
      console.error('Error obteniendo procesador:', error);
      res.json({
        success: false,
        error: 'Error al obtener procesador'
      });
    }
  }

  async createProcessor(req, res) {
    try {
      const processorData = req.body;
      console.log('Creando nuevo procesador:', processorData.marca, processorData.modelo);
      
      if (!processorData.marca || !processorData.modelo || !processorData.socket) {
        return res.json({
          success: false,
          error: 'Marca, modelo y socket son requeridos'
        });
      }

      const newProcessor = await componentService.createProcessor(processorData);
      
      res.json({
        success: true,
        message: 'Procesador creado exitosamente',
        data: newProcessor
      });
    } catch (error) {
      console.error('Error creando procesador:', error);
      res.json({
        success: false,
        error: 'Error al crear procesador'
      });
    }
  }

  async updateProcessor(req, res) {
    try {
      const { id } = req.params;
      const processorData = req.body;
      console.log(`Actualizando procesador ID: ${id}`);
      
      const updatedProcessor = await componentService.updateProcessor(id, processorData);
      
      if (!updatedProcessor) {
        return res.json({
          success: false,
          error: 'Procesador no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Procesador actualizado exitosamente',
        data: updatedProcessor
      });
    } catch (error) {
      console.error('Error actualizando procesador:', error);
      res.json({
        success: false,
        error: 'Error al actualizar procesador'
      });
    }
  }

  async deleteProcessor(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando procesador ID: ${id}`);
      
      const result = await componentService.deleteProcessor(id);
      
      if (!result) {
        return res.json({
          success: false,
          error: 'Procesador no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Procesador eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando procesador:', error);
      res.json({
        success: false,
        error: 'Error al eliminar procesador'
      });
    }
  }

  // ========== MOTHERBOARDS ==========
  
  async getMotherboards(req, res) {
    try {
      console.log('Obteniendo lista de motherboards...');
      const motherboards = await componentService.getAllMotherboards();
      
      res.json({
        success: true,
        data: motherboards,
        count: motherboards.length
      });
    } catch (error) {
      console.error('Error obteniendo motherboards:', error);
      res.json({
        success: false,
        error: 'Error al obtener motherboards'
      });
    }
  }

  async createMotherboard(req, res) {
    try {
      const motherboardData = req.body;
      console.log('Creando nueva motherboard:', motherboardData.marca, motherboardData.modelo);
      
      if (!motherboardData.marca || !motherboardData.modelo || !motherboardData.socket) {
        return res.json({
          success: false,
          error: 'Marca, modelo y socket son requeridos'
        });
      }

      const newMotherboard = await componentService.createMotherboard(motherboardData);
      
      res.json({
        success: true,
        message: 'Motherboard creada exitosamente',
        data: newMotherboard
      });
    } catch (error) {
      console.error('Error creando motherboard:', error);
      res.json({
        success: false,
        error: 'Error al crear motherboard'
      });
    }
  }

  async updateMotherboard(req, res) {
    try {
      const { id } = req.params;
      const motherboardData = req.body;
      console.log(`Actualizando motherboard ID: ${id}`);
      
      const updatedMotherboard = await componentService.updateMotherboard(id, motherboardData);
      
      if (!updatedMotherboard) {
        return res.json({
          success: false,
          error: 'Motherboard no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Motherboard actualizada exitosamente',
        data: updatedMotherboard
      });
    } catch (error) {
      console.error('Error actualizando motherboard:', error);
      res.json({
        success: false,
        error: 'Error al actualizar motherboard'
      });
    }
  }

  async deleteMotherboard(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando motherboard ID: ${id}`);
      
      const result = await componentService.deleteMotherboard(id);
      
      if (!result) {
        return res.json({
          success: false,
          error: 'Motherboard no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Motherboard eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando motherboard:', error);
      res.json({
        success: false,
        error: 'Error al eliminar motherboard'
      });
    }
  }

  // ========== MEMORIAS RAM ==========
  
  async getRAM(req, res) {
    try {
      console.log('Obteniendo lista de memorias RAM...');
      const ram = await componentService.getAllRAM();
      
      res.json({
        success: true,
        data: ram,
        count: ram.length
      });
    } catch (error) {
      console.error('Error obteniendo memorias RAM:', error);
      res.json({
        success: false,
        error: 'Error al obtener memorias RAM'
      });
    }
  }

  async createRAM(req, res) {
    try {
      const ramData = req.body;
      console.log('Creando nueva memoria RAM:', ramData.marca, ramData.modelo);
      
      if (!ramData.marca || !ramData.modelo || !ramData.tipo || !ramData.capacidad) {
        return res.json({
          success: false,
          error: 'Marca, modelo, tipo y capacidad son requeridos'
        });
      }

      const newRAM = await componentService.createRAM(ramData);
      
      res.json({
        success: true,
        message: 'Memoria RAM creada exitosamente',
        data: newRAM
      });
    } catch (error) {
      console.error('Error creando memoria RAM:', error);
      res.json({
        success: false,
        error: 'Error al crear memoria RAM'
      });
    }
  }

  async updateRAM(req, res) {
    try {
      const { id } = req.params;
      const ramData = req.body;
      console.log(`Actualizando RAM ID: ${id}`);
      
      const updatedRAM = await componentService.updateRAM(id, ramData);
      
      if (!updatedRAM) {
        return res.json({
          success: false,
          error: 'Memoria RAM no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Memoria RAM actualizada exitosamente',
        data: updatedRAM
      });
    } catch (error) {
      console.error('Error actualizando RAM:', error);
      res.json({
        success: false,
        error: 'Error al actualizar memoria RAM'
      });
    }
  }

  async deleteRAM(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando RAM ID: ${id}`);
      
      const result = await componentService.deleteRAM(id);
      
      if (!result) {
        return res.json({
          success: false,
          error: 'Memoria RAM no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Memoria RAM eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando RAM:', error);
      res.json({
        success: false,
        error: 'Error al eliminar memoria RAM'
      });
    }
  }
 // ========== TARJETAS GRÁFICAS ==========

async getGPUs(req, res) {
  try {
    console.log('Obteniendo lista de tarjetas gráficas...');
    const gpus = await componentService.getAllGPUs();
    
    res.json({
      success: true,
      data: gpus,
      count: gpus.length
    });
  } catch (error) {
    console.error('Error obteniendo tarjetas gráficas:', error);
    res.json({
      success: false,
      error: 'Error al obtener tarjetas gráficas'
    });
  }
}

async getGPUById(req, res) {
  try {
    const { id } = req.params;
    console.log(`Obteniendo tarjeta gráfica ID: ${id}`);
    
    const gpu = await componentService.getGPUById(id);
    
    if (!gpu) {
      return res.json({
        success: false,
        error: 'Tarjeta gráfica no encontrada'
      });
    }

    res.json({
      success: true,
      data: gpu
    });
  } catch (error) {
    console.error('Error obteniendo tarjeta gráfica:', error);
    res.json({
      success: false,
      error: 'Error al obtener tarjeta gráfica'
    });
  }
}

async createGPU(req, res) {
  try {
    const gpuData = req.body;
    console.log('Creando nueva tarjeta gráfica:', gpuData.marca, gpuData.modelo);
    
    if (!gpuData.marca || !gpuData.modelo) {
      return res.json({
        success: false,
        error: 'Marca y modelo son requeridos'
      });
    }

    const newGPU = await componentService.createGPU(gpuData);
    
    res.json({
      success: true,
      message: 'Tarjeta gráfica creada exitosamente',
      data: newGPU
    });
  } catch (error) {
    console.error('Error creando tarjeta gráfica:', error);
    res.json({
      success: false,
      error: 'Error al crear tarjeta gráfica'
    });
  }
}

async updateGPU(req, res) {
  try {
    const { id } = req.params;
    const gpuData = req.body;
    console.log(`Actualizando tarjeta gráfica ID: ${id}`);
    
    const updatedGPU = await componentService.updateGPU(id, gpuData);
    
    if (!updatedGPU) {
      return res.json({
        success: false,
        error: 'Tarjeta gráfica no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarjeta gráfica actualizada exitosamente',
      data: updatedGPU
    });
  } catch (error) {
    console.error('Error actualizando tarjeta gráfica:', error);
    res.json({
      success: false,
      error: 'Error al actualizar tarjeta gráfica'
    });
  }
}

async deleteGPU(req, res) {
  try {
    const { id } = req.params;
    console.log(`Eliminando tarjeta gráfica ID: ${id}`);
    
    const result = await componentService.deleteGPU(id);
    
    if (!result) {
      return res.json({
        success: false,
        error: 'Tarjeta gráfica no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarjeta gráfica eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando tarjeta gráfica:', error);
    res.json({
      success: false,
      error: 'Error al eliminar tarjeta gráfica'
    });
  }
}

// ========== ALMACENAMIENTO ==========

async getStorage(req, res) {
  try {
    console.log('Obteniendo lista de almacenamiento...');
    const storage = await componentService.getAllStorage();
    
    res.json({
      success: true,
      data: storage,
      count: storage.length
    });
  } catch (error) {
    console.error('Error obteniendo almacenamiento:', error);
    res.json({
      success: false,
      error: 'Error al obtener almacenamiento'
    });
  }
}

async getStorageById(req, res) {
  try {
    const { id } = req.params;
    console.log(`Obteniendo almacenamiento ID: ${id}`);
    
    const storage = await componentService.getStorageById(id);
    
    if (!storage) {
      return res.json({
        success: false,
        error: 'Almacenamiento no encontrado'
      });
    }

    res.json({
      success: true,
      data: storage
    });
  } catch (error) {
    console.error('Error obteniendo almacenamiento:', error);
    res.json({
      success: false,
      error: 'Error al obtener almacenamiento'
    });
  }
}

async createStorage(req, res) {
  try {
    const storageData = req.body;
    console.log('Creando nuevo almacenamiento:', storageData.marca, storageData.modelo);
    
    if (!storageData.marca || !storageData.modelo || !storageData.capacidad || !storageData.tipo) {
      return res.json({
        success: false,
        error: 'Marca, modelo, capacidad y tipo son requeridos'
      });
    }

    const newStorage = await componentService.createStorage(storageData);
    
    res.json({
      success: true,
      message: 'Almacenamiento creado exitosamente',
      data: newStorage
    });
  } catch (error) {
    console.error('Error creando almacenamiento:', error);
    res.json({
      success: false,
      error: 'Error al crear almacenamiento'
    });
  }
}

async updateStorage(req, res) {
  try {
    const { id } = req.params;
    const storageData = req.body;
    console.log(`Actualizando almacenamiento ID: ${id}`);
    
    const updatedStorage = await componentService.updateStorage(id, storageData);
    
    if (!updatedStorage) {
      return res.json({
        success: false,
        error: 'Almacenamiento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Almacenamiento actualizado exitosamente',
      data: updatedStorage
    });
  } catch (error) {
    console.error('Error actualizando almacenamiento:', error);
    res.json({
      success: false,
      error: 'Error al actualizar almacenamiento'
    });
  }
}

async deleteStorage(req, res) {
  try {
    const { id } = req.params;
    console.log(`Eliminando almacenamiento ID: ${id}`);
    
    const result = await componentService.deleteStorage(id);
    
    if (!result) {
      return res.json({
        success: false,
        error: 'Almacenamiento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Almacenamiento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando almacenamiento:', error);
    res.json({
      success: false,
      error: 'Error al eliminar almacenamiento'
    });
  }
}

// ========== FUENTES DE PODER ==========

async getPSUs(req, res) {
  try {
    console.log('Obteniendo lista de fuentes de poder...');
    const psus = await componentService.getAllPSUs();
    
    res.json({
      success: true,
      data: psus,
      count: psus.length
    });
  } catch (error) {
    console.error('Error obteniendo fuentes de poder:', error);
    res.json({
      success: false,
      error: 'Error al obtener fuentes de poder'
    });
  }
}

async getPSUById(req, res) {
  try {
    const { id } = req.params;
    console.log(`Obteniendo fuente de poder ID: ${id}`);
    
    const psu = await componentService.getPSUById(id);
    
    if (!psu) {
      return res.json({
        success: false,
        error: 'Fuente de poder no encontrada'
      });
    }

    res.json({
      success: true,
      data: psu
    });
  } catch (error) {
    console.error('Error obteniendo fuente de poder:', error);
    res.json({
      success: false,
      error: 'Error al obtener fuente de poder'
    });
  }
}

async createPSU(req, res) {
  try {
    const psuData = req.body;
    console.log('Creando nueva fuente de poder:', psuData.marca, psuData.modelo);
    
    if (!psuData.marca || !psuData.modelo || !psuData.potencia) {
      return res.json({
        success: false,
        error: 'Marca, modelo y potencia son requeridos'
      });
    }

    const newPSU = await componentService.createPSU(psuData);
    
    res.json({
      success: true,
      message: 'Fuente de poder creada exitosamente',
      data: newPSU
    });
  } catch (error) {
    console.error('Error creando fuente de poder:', error);
    res.json({
      success: false,
      error: 'Error al crear fuente de poder'
    });
  }
}

async updatePSU(req, res) {
  try {
    const { id } = req.params;
    const psuData = req.body;
    console.log(`Actualizando fuente de poder ID: ${id}`);
    
    const updatedPSU = await componentService.updatePSU(id, psuData);
    
    if (!updatedPSU) {
      return res.json({
        success: false,
        error: 'Fuente de poder no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Fuente de poder actualizada exitosamente',
      data: updatedPSU
    });
  } catch (error) {
    console.error('Error actualizando fuente de poder:', error);
    res.json({
      success: false,
      error: 'Error al actualizar fuente de poder'
    });
  }
}

async deletePSU(req, res) {
  try {
    const { id } = req.params;
    console.log(`Eliminando fuente de poder ID: ${id}`);
    
    const result = await componentService.deletePSU(id);
    
    if (!result) {
      return res.json({
        success: false,
        error: 'Fuente de poder no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Fuente de poder eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando fuente de poder:', error);
    res.json({
      success: false,
      error: 'Error al eliminar fuente de poder'
    });
  }
}

// ========== GABINETES ==========

async getCases(req, res) {
  try {
    console.log('Obteniendo lista de gabinetes...');
    const cases = await componentService.getAllCases();
    
    res.json({
      success: true,
      data: cases,
      count: cases.length
    });
  } catch (error) {
    console.error('Error obteniendo gabinetes:', error);
    res.json({
      success: false,
      error: 'Error al obtener gabinetes'
    });
  }
}

async getCaseById(req, res) {
  try {
    const { id } = req.params;
    console.log(`Obteniendo gabinete ID: ${id}`);
    
    const caseComp = await componentService.getCaseById(id);
    
    if (!caseComp) {
      return res.json({
        success: false,
        error: 'Gabinete no encontrado'
      });
    }

    res.json({
      success: true,
      data: caseComp
    });
  } catch (error) {
    console.error('Error obteniendo gabinete:', error);
    res.json({
      success: false,
      error: 'Error al obtener gabinete'
    });
  }
}

async createCase(req, res) {
  try {
    const caseData = req.body;
    console.log('Creando nuevo gabinete:', caseData.marca, caseData.modelo);
    
    if (!caseData.marca || !caseData.modelo) {
      return res.json({
        success: false,
        error: 'Marca y modelo son requeridos'
      });
    }

    const newCase = await componentService.createCase(caseData);
    
    res.json({
      success: true,
      message: 'Gabinete creado exitosamente',
      data: newCase
    });
  } catch (error) {
    console.error('Error creando gabinete:', error);
    res.json({
      success: false,
      error: 'Error al crear gabinete'
    });
  }
}

async updateCase(req, res) {
  try {
    const { id } = req.params;
    const caseData = req.body;
    console.log(`Actualizando gabinete ID: ${id}`);
    
    const updatedCase = await componentService.updateCase(id, caseData);
    
    if (!updatedCase) {
      return res.json({
        success: false,
        error: 'Gabinete no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Gabinete actualizado exitosamente',
      data: updatedCase
    });
  } catch (error) {
    console.error('Error actualizando gabinete:', error);
    res.json({
      success: false,
      error: 'Error al actualizar gabinete'
    });
  }
}

async deleteCase(req, res) {
  try {
    const { id } = req.params;
    console.log(`Eliminando gabinete ID: ${id}`);
    
    const result = await componentService.deleteCase(id);
    
    if (!result) {
      return res.json({
        success: false,
        error: 'Gabinete no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Gabinete eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando gabinete:', error);
    res.json({
      success: false,
      error: 'Error al eliminar gabinete'
    });
  }
}
  // ========== COMPONENTES POR TIPO ==========
  
  async getComponentsByType(req, res) {
    try {
      const { type } = req.params;
      console.log(`Obteniendo componentes de tipo: ${type}`);
      
      const components = await componentService.getComponentsByType(type);
      
      res.json({
        success: true,
        data: components,
        count: components.length,
        type: type
      });
    } catch (error) {
      console.error(`Error obteniendo componentes tipo ${req.params.type}:`, error);
      res.json({
        success: false,
        error: `Error al obtener ${req.params.type}`
      });
    }
  }

  // ========== COMPATIBILIDAD ==========
  
  async checkCompatibility(req, res) {
    try {
      const { cpuId, motherboardId } = req.body;
      console.log(`Verificando compatibilidad CPU:${cpuId} - Mother:${motherboardId}`);
      
      if (!cpuId || !motherboardId) {
        return res.json({
          success: false,
          error: 'Se requieren CPU ID y Motherboard ID'
        });
      }

      const compatibility = await componentService.checkCPUCompatibility(cpuId, motherboardId);
      
      res.json({
        success: true,
        data: compatibility
      });
    } catch (error) {
      console.error('Error verificando compatibilidad:', error);
      res.json({
        success: false,
        error: 'Error al verificar compatibilidad'
      });
    }
  }

  // ========== ESTADÍSTICAS ==========
  
  async getComponentStats(req, res) {
    try {
      console.log('Obteniendo estadísticas de componentes...');
      
      const stats = await componentService.getComponentStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  }

  // ========== OPCIONES DE FORMULARIOS ==========
  
  async getFormOptions(req, res) {
    try {
        console.log('Obteniendo opciones para formularios...');
        
        const properties = await propertyService.getFormProperties();
        
        res.json({
            success: true,
            data: properties
        });
    } catch (error) {
        console.error('Error obteniendo opciones:', error);
        res.json({
            success: false,
            error: 'Error al obtener opciones'
        });
    }
  }
}

export default new ComponentController();