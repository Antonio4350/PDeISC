const componentService = require('./componentService');
const propertyService = require('./propertyService');

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

module.exports = new ComponentController();