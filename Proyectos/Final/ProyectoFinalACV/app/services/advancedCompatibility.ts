import apiConfig from '../config/apiConfig';

const API_URL = apiConfig.apiUrl;

export interface CompatibilityResult {
  compatible: boolean;
  issues: string[];
  warnings?: string[];
}

export interface BuildValidationResult {
  compatible: boolean;
  validations: {
    [key: string]: any;
  };
  issues: string[];
  warnings: string[];
  summary: {
    critical: number;
    warnings: number;
    totalChecks: number;
    passedChecks: number;
  };
}

class AdvancedCompatibilityService {
  
  /**
   * Validar Socket CPU vs Motherboard
   */
  async validateSocketCompatibility(cpuId: number, motherboardId: number): Promise<CompatibilityResult> {
    try {
      const response = await fetch(`${API_URL}/compatibility/socket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpuId, motherboardId })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const { compatible, issue } = data.data;
      return {
        compatible,
        issues: issue ? [issue] : [],
        warnings: []
      };
    } catch (error) {
      console.error('Error validando socket:', error);
      return {
        compatible: false,
        issues: ['Error al validar compatibilidad de socket'],
        warnings: []
      };
    }
  }

  /**
   * Validar RAM (múltiples)
   */
  async validateRAMCompatibility(ramIds: number[], motherboardId: number): Promise<CompatibilityResult> {
    try {
      const response = await fetch(`${API_URL}/compatibility/ram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ramIds, motherboardId })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const { compatible, issues, warnings } = data.data;
      return {
        compatible,
        issues: issues || [],
        warnings: warnings || []
      };
    } catch (error) {
      console.error('Error validando RAM:', error);
      return {
        compatible: false,
        issues: ['Error al validar compatibilidad de RAM'],
        warnings: []
      };
    }
  }

  /**
   * Validar Almacenamiento (múltiple)
   */
  async validateStorageCompatibility(
    storageIds: number[],
    motherboardId: number,
    caseId: number
  ): Promise<CompatibilityResult> {
    try {
      const response = await fetch(`${API_URL}/compatibility/storage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storageIds, motherboardId, caseId })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const { compatible, issues, warnings } = data.data;
      return {
        compatible,
        issues: issues || [],
        warnings: warnings || []
      };
    } catch (error) {
      console.error('Error validando almacenamiento:', error);
      return {
        compatible: false,
        issues: ['Error al validar compatibilidad de almacenamiento'],
        warnings: []
      };
    }
  }

  /**
   * Validar GPU
   */
  async validateGPUCompatibility(
    gpuId: number,
    motherboardId: number,
    caseId: number
  ): Promise<CompatibilityResult> {
    try {
      const response = await fetch(`${API_URL}/compatibility/gpu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gpuId, motherboardId, caseId })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const { compatible, issues, warnings } = data.data;
      return {
        compatible,
        issues: issues || [],
        warnings: warnings || []
      };
    } catch (error) {
      console.error('Error validando GPU:', error);
      return {
        compatible: false,
        issues: ['Error al validar compatibilidad de GPU'],
        warnings: []
      };
    }
  }

  /**
   * Validar Formato Motherboard vs Gabinete
   */
  async validateFormatCompatibility(motherboardId: number, caseId: number): Promise<CompatibilityResult> {
    try {
      const response = await fetch(`${API_URL}/compatibility/format`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motherboardId, caseId })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const { compatible, issue } = data.data;
      return {
        compatible,
        issues: issue ? [issue] : [],
        warnings: []
      };
    } catch (error) {
      console.error('Error validando formato:', error);
      return {
        compatible: false,
        issues: ['Error al validar compatibilidad de formato'],
        warnings: []
      };
    }
  }

  /**
   * Validar Consumo vs PSU
   */
  async validatePowerSupply(
    cpuId: number,
    psuId: number,
    gpuId?: number,
    ramIds: number[] = [],
    storageIds: number[] = []
  ): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/compatibility/power`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpuId, gpuId, ramIds, storageIds, psuId })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      return {
        compatible: data.data.compatible,
        issues: data.data.issues || [],
        warnings: data.data.warnings || [],
        breakdown: data.data.breakdown,
        psuCapacity: data.data.psuCapacity,
        recommended: data.data.recommended,
        margin: data.data.margin,
        marginPercent: data.data.marginPercent
      };
    } catch (error) {
      console.error('Error validando PSU:', error);
      return {
        compatible: false,
        issues: ['Error al validar compatibilidad de PSU'],
        warnings: [],
        breakdown: null
      };
    }
  }

  /**
   * Validación COMPLETA del Build
   */
  async validateCompleteBuild(buildData: {
    cpuId?: number;
    motherboardId?: number;
    ramIds?: number[];
    gpuId?: number;
    storageIds?: number[];
    psuId?: number;
    cooler_disipador_id?: number;
    caseId?: number;
  }): Promise<BuildValidationResult> {
    try {
      const response = await fetch(`${API_URL}/compatibility/complete-build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildData)
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      return data.data;
    } catch (error) {
      console.error('Error en validación completa:', error);
      return {
        compatible: false,
        validations: {},
        issues: ['Error al validar el build completo'],
        warnings: [],
        summary: {
          critical: 1,
          warnings: 0,
          totalChecks: 0,
          passedChecks: 0
        }
      };
    }
  }

  getSummaryInSpanish(validation: BuildValidationResult): string {
    const { compatible, summary, issues, warnings } = validation;

    if (compatible) {
      return `¡Build Compatible! Todas las verificaciones pasaron (${summary.totalChecks}/${summary.totalChecks})`;
    }

    const issuesText = summary.critical > 0 ? `${summary.critical} error(es) crítico(s)` : '';
    const warningsText = summary.warnings > 0 ? `${summary.warnings} advertencia(s)` : '';
    
    return `Build Incompatible | ${issuesText} ${warningsText}`.trim();
  }
}

export default new AdvancedCompatibilityService();
