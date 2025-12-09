import compatibilityService from './compatibilityService.js';

class CompatibilityController {

  async validateSocket(req, res) {
    try {
      const { cpuId, motherboardId } = req.body;

      if (!cpuId || !motherboardId) {
        return res.json({
          success: false,
          error: 'Se requieren CPU ID y Motherboard ID'
        });
      }

      const result = await compatibilityService.validateSocketCompatibility(cpuId, motherboardId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validando socket:', error);
      res.json({
        success: false,
        error: 'Error al validar compatibilidad de socket'
      });
    }
  }

  /**
   * Validar compatibilidad de RAM
   */
  async validateRAM(req, res) {
    try {
      const { ramIds, motherboardId } = req.body;

      if (!ramIds || !Array.isArray(ramIds) || !motherboardId) {
        return res.json({
          success: false,
          error: 'Se requieren ramIds (array) y motherboardId'
        });
      }

      const result = await compatibilityService.validateRAMCompatibility(ramIds, motherboardId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validando RAM:', error);
      res.json({
        success: false,
        error: 'Error al validar compatibilidad de RAM'
      });
    }
  }

  /**
   * Validar compatibilidad de Almacenamiento
   */
  async validateStorage(req, res) {
    try {
      const { storageIds, motherboardId, caseId } = req.body;

      if (!storageIds || !Array.isArray(storageIds) || !motherboardId || !caseId) {
        return res.json({
          success: false,
          error: 'Se requieren storageIds (array), motherboardId y caseId'
        });
      }

      const result = await compatibilityService.validateStorageCompatibility(storageIds, motherboardId, caseId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validando almacenamiento:', error);
      res.json({
        success: false,
        error: 'Error al validar compatibilidad de almacenamiento'
      });
    }
  }

  /**
   * Validar compatibilidad de GPU
   */
  async validateGPU(req, res) {
    try {
      const { gpuId, motherboardId, caseId } = req.body;

      if (!gpuId || !motherboardId || !caseId) {
        return res.json({
          success: false,
          error: 'Se requieren gpuId, motherboardId y caseId'
        });
      }

      const result = await compatibilityService.validateGPUCompatibility(gpuId, motherboardId, caseId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validando GPU:', error);
      res.json({
        success: false,
        error: 'Error al validar compatibilidad de GPU'
      });
    }
  }

  /**
   * Validar formato Motherboard vs Gabinete
   */
  async validateFormat(req, res) {
    try {
      const { motherboardId, caseId } = req.body;

      if (!motherboardId || !caseId) {
        return res.json({
          success: false,
          error: 'Se requieren motherboardId y caseId'
        });
      }

      const result = await compatibilityService.validateFormatCompatibility(motherboardId, caseId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validando formato:', error);
      res.json({
        success: false,
        error: 'Error al validar compatibilidad de formato'
      });
    }
  }

  /**
   * Validar consumo vs PSU
   */
  async validatePower(req, res) {
    try {
      const { cpuId, gpuId, ramIds, storageIds, psuId } = req.body;

      if (!cpuId || !psuId) {
        return res.json({
          success: false,
          error: 'Se requieren cpuId y psuId'
        });
      }

      const result = await compatibilityService.validatePowerSupply(
        cpuId,
        gpuId,
        ramIds || [],
        storageIds || [],
        psuId
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validando PSU:', error);
      res.json({
        success: false,
        error: 'Error al validar compatibilidad de PSU'
      });
    }
  }

  /**
   * Validación completa del Build
   */
  async validateCompleteBuild(req, res) {
    try {
      const buildData = req.body;

      // Validar que al menos haya algo para validar
      if (!buildData.cpuId && !buildData.motherboardId && !buildData.ramIds?.length) {
        return res.json({
          success: false,
          error: 'Agrega al menos algunos componentes para validar'
        });
      }

      const result = await compatibilityService.validateCompleteBuild(buildData);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error en validación completa:', error);
      res.json({
        success: false,
        error: 'Error al validar el build completo'
      });
    }
  }
}

export default new CompatibilityController();
