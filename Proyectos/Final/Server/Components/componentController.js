const componentService = require('./componentService');

class ComponentController {
  
  // ========== PROCESADORES ==========
  
  // Obtener todos los procesadores
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

  // Obtener procesador por ID
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

  // Crear nuevo procesador (solo admin)
  async createProcessor(req, res) {
    try {
      const processorData = req.body;
      console.log('Creando nuevo procesador:', processorData.marca, processorData.modelo);
      
      // Validación básica
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

  // ========== MOTHERBOARDS ==========
  
  // Obtener todas las motherboards
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

  // Crear nueva motherboard (solo admin)
  async createMotherboard(req, res) {
    try {
      const motherboardData = req.body;
      console.log('Creando nueva motherboard:', motherboardData.marca, motherboardData.modelo);
      
      // Validación básica
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

  // ========== MEMORIAS RAM ==========
  
  // Obtener todas las memorias RAM
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

  // Crear nueva memoria RAM (solo admin)
  async createRAM(req, res) {
    try {
      const ramData = req.body;
      console.log('Creando nueva memoria RAM:', ramData.marca, ramData.modelo);
      
      // Validación básica
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

  // ========== COMPONENTES POR TIPO ==========
  
  // Obtener componentes por tipo
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
  
  // Verificar compatibilidad CPU - Motherboard
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
  
  // Obtener estadísticas de componentes
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
}

module.exports = new ComponentController();