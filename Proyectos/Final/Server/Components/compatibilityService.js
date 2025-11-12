import pool from './database.js';

class CompatibilityService {
  
  /**
   * VALIDACIÓN 1: Socket CPU vs Motherboard
   */
  async validateSocketCompatibility(cpuId, motherboardId) {
    try {
      const [cpu, motherboard] = await Promise.all([
        pool.query('SELECT socket FROM procesadores WHERE id = $1', [cpuId]),
        pool.query('SELECT socket FROM motherboards WHERE id = $1', [motherboardId])
      ]);

      const cpuSocket = cpu.rows[0]?.socket;
      const mbSocket = motherboard.rows[0]?.socket;

      return {
        compatible: cpuSocket === mbSocket,
        cpuSocket,
        mbSocket,
        issue: cpuSocket !== mbSocket ? `Socket incompatible: CPU ${cpuSocket} vs Madre ${mbSocket}` : null
      };
    } catch (error) {
      console.error('Error validando socket:', error);
      throw error;
    }
  }

  /**
   * VALIDACIÓN 2: Tipo de RAM vs Motherboard
   */
  async validateRAMCompatibility(ramIds, motherboardId) {
    try {
      const motherboard = await pool.query(
        'SELECT tipo_memoria, slots_memoria, memoria_maxima_gb, velocidad_maxima_mhz FROM motherboards WHERE id = $1',
        [motherboardId]
      );

      const mb = motherboard.rows[0];
      if (!mb) return { compatible: false, issue: 'Motherboard no encontrada' };

      const rams = await pool.query(
        'SELECT id, tipo, capacidad, velocidad_mhz FROM memorias_ram WHERE id = ANY($1::int[])',
        [ramIds]
      );

      const issues = [];
      let totalCapacity = 0;

      for (const ram of rams.rows) {
        // Validar tipo
        if (ram.tipo !== mb.tipo_memoria) {
          issues.push(`RAM ${ram.id}: Tipo incompatible (${ram.tipo} vs ${mb.tipo_memoria})`);
        }

        // Validar velocidad
        if (ram.velocidad_mhz > mb.velocidad_maxima_mhz) {
          issues.push(`RAM ${ram.id}: Velocidad muy alta (${ram.velocidad_mhz}MHz > ${mb.velocidad_maxima_mhz}MHz) - funcionará a velocidad reducida`);
        }

        totalCapacity += ram.capacidad;
      }

      // Validar cantidad de slots
      if (ramIds.length > mb.slots_memoria) {
        issues.push(`Demasiadas RAMs: ${ramIds.length} RAMs > ${mb.slots_memoria} slots disponibles`);
      }

      // Validar capacidad total
      if (totalCapacity > mb.memoria_maxima_gb) {
        issues.push(`Capacidad total excedida: ${totalCapacity}GB > ${mb.memoria_maxima_gb}GB máximo`);
      }

      return {
        compatible: issues.length === 0,
        totalCapacity,
        ramCount: ramIds.length,
        maxSlots: mb.slots_memoria,
        maxCapacity: mb.memoria_maxima_gb,
        issues
      };
    } catch (error) {
      console.error('Error validando RAM:', error);
      throw error;
    }
  }

  /**
   * VALIDACIÓN 3: Almacenamiento vs Motherboard y Gabinete
   */
  async validateStorageCompatibility(storageIds, motherboardId, caseId) {
    try {
      const [mb, caseData, storages] = await Promise.all([
        pool.query('SELECT bahias_sata, puertos_m2 FROM motherboards WHERE id = $1', [motherboardId]),
        pool.query('SELECT bahias_2_5, bahias_3_5, slots_m2_backplane FROM gabinetes WHERE id = $1', [caseId]),
        pool.query('SELECT id, formato, interfaz, tipo FROM almacenamiento WHERE id = ANY($1::int[])', [storageIds])
      ]);

      const motherboard = mb.rows[0];
      const gabinete = caseData.rows[0];
      const issues = [];

      if (!motherboard) issues.push('Motherboard no encontrada');
      if (!gabinete) issues.push('Gabinete no encontrado');

      // Contar por tipo
      const sata25 = storages.rows.filter(s => s.formato === '2.5"' && s.interfaz === 'SATA III').length;
      const sata35 = storages.rows.filter(s => s.formato === '3.5"' && s.interfaz === 'SATA III').length;
      const nvme = storages.rows.filter(s => s.interfaz === 'NVMe').length;

      // Validar SATA
      if (sata25 + sata35 > (motherboard?.bahias_sata || 0)) {
        issues.push(`Demasiados SATA: ${sata25 + sata35} > ${motherboard?.bahias_sata || 0} puertos SATA en madre`);
      }

      // Validar M.2
      if (nvme > (motherboard?.puertos_m2 || 0)) {
        issues.push(`Demasiados NVMe: ${nvme} > ${motherboard?.puertos_m2 || 0} puertos M.2 en madre`);
      }

      // Validar bahías en gabinete
      if (sata25 > (gabinete?.bahias_2_5 || 0)) {
        issues.push(`No hay espacio para ${sata25} discos 2.5": solo ${gabinete?.bahias_2_5 || 0} bahías disponibles`);
      }

      if (sata35 > (gabinete?.bahias_3_5 || 0)) {
        issues.push(`No hay espacio para ${sata35} discos 3.5": solo ${gabinete?.bahias_3_5 || 0} bahías disponibles`);
      }

      return {
        compatible: issues.length === 0,
        breakdown: {
          sata25,
          sata35,
          nvme,
          maxSata: motherboard?.bahias_sata,
          maxM2: motherboard?.puertos_m2,
          case25: gabinete?.bahias_2_5,
          case35: gabinete?.bahias_3_5,
          caseM2: gabinete?.slots_m2_backplane
        },
        issues
      };
    } catch (error) {
      console.error('Error validando almacenamiento:', error);
      throw error;
    }
  }

  /**
   * VALIDACIÓN 4: GPU vs Gabinete y Motherboard
   */
  async validateGPUCompatibility(gpuId, motherboardId, caseId) {
    try {
      const [gpu, mb, gabinete] = await Promise.all([
        pool.query('SELECT longitud_mm, altura_mm, slots_ocupados, potencia_requerida_w FROM tarjetas_graficas WHERE id = $1', [gpuId]),
        pool.query('SELECT slots_pcie FROM motherboards WHERE id = $1', [motherboardId]),
        pool.query('SELECT longitud_max_gpu_mm, altura_max_cooler_mm FROM gabinetes WHERE id = $1', [caseId])
      ]);

      const gpuData = gpu.rows[0];
      const mbData = mb.rows[0];
      const caseData = gabinete.rows[0];
      const issues = [];

      if (!gpuData) issues.push('GPU no encontrada');
      if (!mbData) issues.push('Motherboard no encontrada');
      if (!caseData) issues.push('Gabinete no encontrado');

      // Validar longitud
      if (gpuData?.longitud_mm > caseData?.longitud_max_gpu_mm) {
        issues.push(`GPU demasiado larga: ${gpuData.longitud_mm}mm > ${caseData.longitud_max_gpu_mm}mm máximo del gabinete`);
      }

      // Validar slots PCIe
      if (gpuData?.slots_ocupados > (mbData?.slots_pcie || 0)) {
        issues.push(`GPU requiere ${gpuData.slots_ocupados} slots PCIe, pero la madre solo tiene ${mbData?.slots_pcie || 0}`);
      }

      return {
        compatible: issues.length === 0,
        gpuLength: gpuData?.longitud_mm,
        maxLength: caseData?.longitud_max_gpu_mm,
        slotsNeeded: gpuData?.slots_ocupados,
        slotsAvailable: mbData?.slots_pcie,
        powerRequired: gpuData?.potencia_requerida_w,
        issues
      };
    } catch (error) {
      console.error('Error validando GPU:', error);
      throw error;
    }
  }

  /**
   * VALIDACIÓN 5: Formato Motherboard vs Gabinete
   */
  async validateFormatCompatibility(motherboardId, caseId) {
    try {
      const [mb, gabinete] = await Promise.all([
        pool.query('SELECT formato FROM motherboards WHERE id = $1', [motherboardId]),
        pool.query('SELECT formato_soportado FROM gabinetes WHERE id = $1', [caseId])
      ]);

      const mbFormat = mb.rows[0]?.formato;
      const caseFormats = gabinete.rows[0]?.formato_soportado?.split(',') || [];

      const compatible = caseFormats.includes(mbFormat);

      return {
        compatible,
        mbFormat,
        caseFormats,
        issue: !compatible ? `Formato incompatible: Madre ${mbFormat} no cabe en gabinete (soporta: ${caseFormats.join(', ')})` : null
      };
    } catch (error) {
      console.error('Error validando formato:', error);
      throw error;
    }
  }

  /**
   * VALIDACIÓN 6: Consumo Total vs PSU
   */
  async validatePowerSupply(cpuId, gpuId, ramIds, storageIds, psuId) {
    try {
      const [cpu, gpu, psu] = await Promise.all([
        pool.query('SELECT tdp FROM procesadores WHERE id = $1', [cpuId]),
        pool.query('SELECT potencia_requerida_w FROM tarjetas_graficas WHERE id = $1', [gpuId]),
        pool.query('SELECT potencia_w, certificacion FROM fuentes_poder WHERE id = $1', [psuId])
      ]);

      const cpuTDP = cpu.rows[0]?.tdp || 0;
      const gpuPower = gpu.rows[0]?.potencia_requerida_w || 0;
      
      // RAM: ~0.5W por GB
      const ramCountResult = await pool.query('SELECT SUM(capacidad) as total FROM memorias_ram WHERE id = ANY($1::int[])', [ramIds]);
      const ramCapacity = ramCountResult.rows[0]?.total || 0;
      const ramPower = ramCapacity * 0.5;

      // Almacenamiento: ~5W por disco
      const storagePower = (storageIds?.length || 0) * 5;

      // Otros componentes
      const motherboardPower = 20;
      const coolerPower = 10;
      const otherPower = 20;

      const totalTDP = cpuTDP + gpuPower + ramPower + storagePower + motherboardPower + coolerPower + otherPower;
      const recommended = Math.ceil(totalTDP * 1.25); // 25% de margen de seguridad
      const psuCapacity = psu.rows[0]?.potencia_w || 0;

      const issues = [];
      const warnings = [];

      if (totalTDP > psuCapacity) {
        issues.push(`¡PELIGRO! Consumo total (${totalTDP}W) excede capacidad de PSU (${psuCapacity}W)`);
      }

      if (totalTDP > psuCapacity * 0.85) {
        warnings.push(`Advertencia: PSU muy cargada. Solo ${Math.round((psuCapacity - totalTDP) / 10)}% de margen disponible`);
      }

      if (psuCapacity < recommended) {
        warnings.push(`PSU podría ser insuficiente. Se recomienda ${recommended}W, tienes ${psuCapacity}W`);
      }

      return {
        compatible: issues.length === 0,
        breakdown: {
          cpu: cpuTDP,
          gpu: gpuPower,
          ram: ramPower,
          storage: storagePower,
          motherboard: motherboardPower,
          cooler: coolerPower,
          other: otherPower,
          total: totalTDP
        },
        psuCapacity,
        recommended,
        efficiency: psu.rows[0]?.certificacion,
        margin: psuCapacity - totalTDP,
        marginPercent: Math.round(((psuCapacity - totalTDP) / psuCapacity) * 100),
        issues,
        warnings
      };
    } catch (error) {
      console.error('Error validando PSU:', error);
      throw error;
    }
  }

  /**
   * VALIDACIÓN COMPLETA DEL BUILD
   */
  async validateCompleteBuild(buildData) {
    const {
      cpuId,
      motherboardId,
      ramIds = [],
      gpuId,
      storageIds = [],
      psuId,
      cooler_disipador_id,
      caseId
    } = buildData;

    try {
      const results = {};
      const allIssues = [];
      const allWarnings = [];

      // 1. Socket
      if (cpuId && motherboardId) {
        results.socket = await this.validateSocketCompatibility(cpuId, motherboardId);
        if (!results.socket.compatible) allIssues.push(results.socket.issue);
      }

      // 2. RAM
      if (ramIds.length > 0 && motherboardId) {
        results.ram = await this.validateRAMCompatibility(ramIds, motherboardId);
        if (!results.ram.compatible) allIssues.push(...results.ram.issues);
      }

      // 3. Almacenamiento
      if (storageIds.length > 0 && motherboardId && caseId) {
        results.storage = await this.validateStorageCompatibility(storageIds, motherboardId, caseId);
        if (!results.storage.compatible) allIssues.push(...results.storage.issues);
      }

      // 4. GPU
      if (gpuId && motherboardId && caseId) {
        results.gpu = await this.validateGPUCompatibility(gpuId, motherboardId, caseId);
        if (!results.gpu.compatible) allIssues.push(...results.gpu.issues);
      }

      // 5. Formato
      if (motherboardId && caseId) {
        results.format = await this.validateFormatCompatibility(motherboardId, caseId);
        if (!results.format.compatible) allIssues.push(results.format.issue);
      }

      // 6. PSU
      if (cpuId && psuId) {
        results.power = await this.validatePowerSupply(cpuId, gpuId, ramIds, storageIds, psuId);
        if (!results.power.compatible) allIssues.push(...results.power.issues);
        if (results.power.warnings) allWarnings.push(...results.power.warnings);
      }

      return {
        compatible: allIssues.length === 0,
        validations: results,
        issues: allIssues,
        warnings: allWarnings,
        summary: {
          critical: allIssues.length,
          warnings: allWarnings.length,
          totalChecks: Object.keys(results).length,
          passedChecks: Object.values(results).filter(r => r.compatible !== false).length
        }
      };
    } catch (error) {
      console.error('Error en validación completa:', error);
      throw error;
    }
  }
}

export default new CompatibilityService();
