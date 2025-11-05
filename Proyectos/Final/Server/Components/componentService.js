const pool = require('./database');

class ComponentService {

    // ========== PROCESADORES ==========

    async getAllProcessors() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM procesadores WHERE estado = "activo" ORDER BY marca, modelo'
            );
            return rows;
        } catch (error) {
            console.error('Error obteniendo procesadores:', error);
            throw error;
        }
    }

    async getProcessorById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM procesadores WHERE id = ? AND estado = "activo"',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error obteniendo procesador:', error);
            throw error;
        }
    }

    async createProcessor(processorData) {
        const {
            marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos,
            frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria,
            velocidad_memoria_max, graficos_integrados, modelo_graficos,
            tecnologia, imagen_url
        } = processorData;

        try {
            const [result] = await pool.execute(
                `INSERT INTO procesadores 
                (marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos,
                 frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria,
                 velocidad_memoria_max, graficos_integrados, modelo_graficos,
                 tecnologia, imagen_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos,
                    frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria,
                    velocidad_memoria_max, graficos_integrados, modelo_graficos,
                    tecnologia, imagen_url
                ]
            );

            return { id: result.insertId, ...processorData };
        } catch (error) {
            console.error('Error creando procesador:', error);
            throw error;
        }
    }

    async updateProcessor(id, processorData) {
        const {
            marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos,
            frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria,
            velocidad_memoria_max, graficos_integrados, modelo_graficos,
            tecnologia, imagen_url
        } = processorData;

        try {
            const [result] = await pool.execute(
                `UPDATE procesadores SET 
                 marca = ?, modelo = ?, generacion = ?, año_lanzamiento = ?, socket = ?, 
                 nucleos = ?, hilos = ?, frecuencia_base = ?, frecuencia_turbo = ?, 
                 cache = ?, tdp = ?, tipo_memoria = ?, velocidad_memoria_max = ?, 
                 graficos_integrados = ?, modelo_graficos = ?, tecnologia = ?, imagen_url = ?
                 WHERE id = ? AND estado = "activo"`,
                [
                    marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos,
                    frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria,
                    velocidad_memoria_max, graficos_integrados, modelo_graficos,
                    tecnologia, imagen_url, id
                ]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            return { id: parseInt(id), ...processorData };
        } catch (error) {
            console.error('Error actualizando procesador:', error);
            throw error;
        }
    }

    async deleteProcessor(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE procesadores SET estado = "inactivo" WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error eliminando procesador:', error);
            throw error;
        }
    }

    // ========== MOTHERBOARDS ==========

    async getAllMotherboards() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM motherboards WHERE estado = "activo" ORDER BY marca, modelo'
            );
            return rows;
        } catch (error) {
            console.error('Error obteniendo motherboards:', error);
            throw error;
        }
    }

    async createMotherboard(motherboardData) {
        const {
            marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
            memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie,
            puertos_sata, puertos_m2, conectividad_red, audio, usb_puertos, imagen_url
        } = motherboardData;

        try {
            const [result] = await pool.execute(
                `INSERT INTO motherboards 
                (marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
                 memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie,
                 puertos_sata, puertos_m2, conectividad_red, audio, usb_puertos, imagen_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
                    memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie,
                    puertos_sata, puertos_m2, conectividad_red, audio, usb_puertos, imagen_url
                ]
            );

            return { id: result.insertId, ...motherboardData };
        } catch (error) {
            console.error('Error creando motherboard:', error);
            throw error;
        }
    }

    async updateMotherboard(id, motherboardData) {
        const {
            marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
            memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie,
            puertos_sata, puertos_m2, conectividad_red, audio, usb_puertos, imagen_url
        } = motherboardData;

        try {
            const [result] = await pool.execute(
                `UPDATE motherboards SET 
                 marca = ?, modelo = ?, socket = ?, chipset = ?, formato = ?, 
                 tipo_memoria = ?, slots_memoria = ?, memoria_maxima = ?, 
                 velocidad_memoria_soportada = ?, slots_pcie = ?, version_pcie = ?, 
                 puertos_sata = ?, puertos_m2 = ?, conectividad_red = ?, audio = ?, 
                 usb_puertos = ?, imagen_url = ?
                 WHERE id = ? AND estado = "activo"`,
                [
                    marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
                    memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie,
                    puertos_sata, puertos_m2, conectividad_red, audio, usb_puertos, imagen_url, id
                ]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            return { id: parseInt(id), ...motherboardData };
        } catch (error) {
            console.error('Error actualizando motherboard:', error);
            throw error;
        }
    }

    async deleteMotherboard(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE motherboards SET estado = "inactivo" WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error eliminando motherboard:', error);
            throw error;
        }
    }

    // ========== MEMORIAS RAM ==========

    async getAllRAM() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM memorias_ram WHERE estado = "activo" ORDER BY marca, modelo'
            );
            return rows;
        } catch (error) {
            console.error('Error obteniendo memorias RAM:', error);
            throw error;
        }
    }

    async createRAM(ramData) {
        const {
            marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
            latencia, voltaje, formato, rgb, imagen_url
        } = ramData;

        try {
            const [result] = await pool.execute(
                `INSERT INTO memorias_ram 
                (marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
                 latencia, voltaje, formato, rgb, imagen_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
                    latencia, voltaje, formato, rgb, imagen_url
                ]
            );

            return { id: result.insertId, ...ramData };
        } catch (error) {
            console.error('Error creando memoria RAM:', error);
            throw error;
        }
    }

    async updateRAM(id, ramData) {
        const {
            marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
            latencia, voltaje, formato, rgb, imagen_url
        } = ramData;

        try {
            const [result] = await pool.execute(
                `UPDATE memorias_ram SET 
                 marca = ?, modelo = ?, tipo = ?, capacidad = ?, velocidad_mhz = ?, 
                 velocidad_mt = ?, latencia = ?, voltaje = ?, formato = ?, rgb = ?, imagen_url = ?
                 WHERE id = ? AND estado = "activo"`,
                [
                    marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
                    latencia, voltaje, formato, rgb, imagen_url, id
                ]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            return { id: parseInt(id), ...ramData };
        } catch (error) {
            console.error('Error actualizando RAM:', error);
            throw error;
        }
    }

    async deleteRAM(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE memorias_ram SET estado = "inactivo" WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error eliminando RAM:', error);
            throw error;
        }
    }

    // ========== DELETE METHODS ==========

async deleteProcessor(id) {
  try {
    const [result] = await pool.execute(
      'UPDATE procesadores SET estado = "inactivo" WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error eliminando procesador:', error);
    throw error;
  }
}

async deleteMotherboard(id) {
  try {
    const [result] = await pool.execute(
      'UPDATE motherboards SET estado = "inactivo" WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error eliminando motherboard:', error);
    throw error;
  }
}

async deleteRAM(id) {
  try {
    const [result] = await pool.execute(
      'UPDATE memorias_ram SET estado = "inactivo" WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error eliminando RAM:', error);
    throw error;
  }
}
    // ========== COMPATIBILIDAD ==========

    async checkCPUCompatibility(cpuId, motherboardId) {
        try {
            const [cpu] = await pool.execute(
                'SELECT socket, tipo_memoria FROM procesadores WHERE id = ?',
                [cpuId]
            );

            const [motherboard] = await pool.execute(
                'SELECT socket, tipo_memoria FROM motherboards WHERE id = ?',
                [motherboardId]
            );

            if (cpu.length === 0 || motherboard.length === 0) {
                return { compatible: false, reason: 'Componente no encontrado' };
            }

            const compatibleSocket = cpu[0].socket === motherboard[0].socket;
            const compatibleMemory = cpu[0].tipo_memoria === motherboard[0].tipo_memoria;

            return {
                compatible: compatibleSocket && compatibleMemory,
                details: {
                    socket: compatibleSocket,
                    memory: compatibleMemory
                },
                issues: [
                    !compatibleSocket ? `Socket incompatible: CPU ${cpu[0].socket} vs Mother ${motherboard[0].socket}` : null,
                    !compatibleMemory ? `Memory incompatible: CPU ${cpu[0].tipo_memoria} vs Mother ${motherboard[0].tipo_memoria}` : null
                ].filter(Boolean)
            };
        } catch (error) {
            console.error('Error verificando compatibilidad:', error);
            throw error;
        }
    }

    // ========== COMPONENTES POR TIPO ==========

    async getComponentsByType(type) {
        const validTypes = ['procesadores', 'motherboards', 'memorias_ram', 'tarjetas_graficas', 'almacenamiento', 'fuentes_poder', 'gabinetes'];

        if (!validTypes.includes(type)) {
            throw new Error('Tipo de componente no válido');
        }

        try {
            const [rows] = await pool.execute(
                `SELECT * FROM ${type} WHERE estado = "activo" ORDER BY marca, modelo`
            );
            return rows;
        } catch (error) {
            console.error(`Error obteniendo ${type}:`, error);
            throw error;
        }
    }

    // ========== ESTADÍSTICAS ==========

    async getComponentStats() {
        try {
            console.log('Calculando estadísticas de componentes...');

            const [processors] = await pool.execute('SELECT COUNT(*) as total FROM procesadores WHERE estado = "activo"');
            const [motherboards] = await pool.execute('SELECT COUNT(*) as total FROM motherboards WHERE estado = "activo"');
            const [ram] = await pool.execute('SELECT COUNT(*) as total FROM memorias_ram WHERE estado = "activo"');
            const [gpus] = await pool.execute('SELECT COUNT(*) as total FROM tarjetas_graficas WHERE estado = "activo"');
            const [storage] = await pool.execute('SELECT COUNT(*) as total FROM almacenamiento WHERE estado = "activo"');
            const [psus] = await pool.execute('SELECT COUNT(*) as total FROM fuentes_poder WHERE estado = "activo"');
            const [cases] = await pool.execute('SELECT COUNT(*) as total FROM gabinetes WHERE estado = "activo"');

            const stats = {
                procesadores: processors[0].total,
                motherboards: motherboards[0].total,
                memorias_ram: ram[0].total,
                tarjetas_graficas: gpus[0].total,
                almacenamiento: storage[0].total,
                fuentes_poder: psus[0].total,
                gabinetes: cases[0].total
            };

            stats.total = Object.values(stats).reduce((sum, count) => sum + parseInt(count), 0);

            console.log('Estadísticas calculadas:', stats);
            return stats;

        } catch (error) {
            console.error('Error detallado obteniendo estadísticas:', error);
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }
}

module.exports = new ComponentService();