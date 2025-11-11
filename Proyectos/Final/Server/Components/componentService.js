const pool = require('./database');

class ComponentService {

    // ========== PROCESADORES ==========

    async getAllProcessors() {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM procesadores WHERE estado = $1 ORDER BY marca, modelo',
                ['activo']
            );
            return rows;
        } catch (error) {
            console.error('Error obteniendo procesadores:', error);
            throw error;
        }
    }

    async getProcessorById(id) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM procesadores WHERE id = $1 AND estado = $2',
                [id, 'activo']
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
            const { rows } = await pool.query(
                `INSERT INTO procesadores 
                (marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos,
                 frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria,
                 velocidad_memoria_max, graficos_integrados, modelo_graficos,
                 tecnologia, imagen_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *`,
                [
                    marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos,
                    frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria,
                    velocidad_memoria_max, graficos_integrados, modelo_graficos,
                    tecnologia, imagen_url
                ]
            );

            return rows[0];
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
            const { rowCount, rows } = await pool.query(
                `UPDATE procesadores SET 
                 marca = $1, modelo = $2, generacion = $3, año_lanzamiento = $4, socket = $5, 
                 nucleos = $6, hilos = $7, frecuencia_base = $8, frecuencia_turbo = $9, 
                 cache = $10, tdp = $11, tipo_memoria = $12, velocidad_memoria_max = $13, 
                 graficos_integrados = $14, modelo_graficos = $15, tecnologia = $16, imagen_url = $17
                 WHERE id = $18 AND estado = $19
                 RETURNING *`,
                [
                    marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos,
                    frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria,
                    velocidad_memoria_max, graficos_integrados, modelo_graficos,
                    tecnologia, imagen_url, id, 'activo'
                ]
            );

            if (rowCount === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            console.error('Error actualizando procesador:', error);
            throw error;
        }
    }

    async deleteProcessor(id) {
        try {
            const { rowCount } = await pool.query(
                'UPDATE procesadores SET estado = $1 WHERE id = $2',
                ['inactivo', id]
            );

            return rowCount > 0;
        } catch (error) {
            console.error('Error eliminando procesador:', error);
            throw error;
        }
    }

    // ========== MOTHERBOARDS ==========

    async getAllMotherboards() {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM motherboards WHERE estado = $1 ORDER BY marca, modelo',
                ['activo']
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
            const { rows } = await pool.query(
                `INSERT INTO motherboards 
                (marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
                 memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie,
                 puertos_sata, puertos_m2, conectividad_red, audio, usb_puertos, imagen_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *`,
                [
                    marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
                    memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie,
                    puertos_sata, puertos_m2, conectividad_red, audio, usb_puertos, imagen_url
                ]
            );

            return rows[0];
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
            const { rowCount, rows } = await pool.query(
                `UPDATE motherboards SET 
                 marca = $1, modelo = $2, socket = $3, chipset = $4, formato = $5, 
                 tipo_memoria = $6, slots_memoria = $7, memoria_maxima = $8, 
                 velocidad_memoria_soportada = $9, slots_pcie = $10, version_pcie = $11, 
                 puertos_sata = $12, puertos_m2 = $13, conectividad_red = $14, audio = $15, 
                 usb_puertos = $16, imagen_url = $17
                 WHERE id = $18 AND estado = $19
                 RETURNING *`,
                [
                    marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
                    memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie,
                    puertos_sata, puertos_m2, conectividad_red, audio, usb_puertos, imagen_url, id, 'activo'
                ]
            );

            if (rowCount === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            console.error('Error actualizando motherboard:', error);
            throw error;
        }
    }

    async deleteMotherboard(id) {
        try {
            const { rowCount } = await pool.query(
                'UPDATE motherboards SET estado = $1 WHERE id = $2',
                ['inactivo', id]
            );

            return rowCount > 0;
        } catch (error) {
            console.error('Error eliminando motherboard:', error);
            throw error;
        }
    }

    // ========== MEMORIAS RAM ==========

    async getAllRAM() {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM memorias_ram WHERE estado = $1 ORDER BY marca, modelo',
                ['activo']
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
            const { rows } = await pool.query(
                `INSERT INTO memorias_ram 
                (marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
                 latencia, voltaje, formato, rgb, imagen_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *`,
                [
                    marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
                    latencia, voltaje, formato, rgb, imagen_url
                ]
            );

            return rows[0];
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
            const { rowCount, rows } = await pool.query(
                `UPDATE memorias_ram SET 
                 marca = $1, modelo = $2, tipo = $3, capacidad = $4, velocidad_mhz = $5, 
                 velocidad_mt = $6, latencia = $7, voltaje = $8, formato = $9, rgb = $10, imagen_url = $11
                 WHERE id = $12 AND estado = $13
                 RETURNING *`,
                [
                    marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
                    latencia, voltaje, formato, rgb, imagen_url, id, 'activo'
                ]
            );

            if (rowCount === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            console.error('Error actualizando RAM:', error);
            throw error;
        }
    }

    async deleteRAM(id) {
        try {
            const { rowCount } = await pool.query(
                'UPDATE memorias_ram SET estado = $1 WHERE id = $2',
                ['inactivo', id]
            );

            return rowCount > 0;
        } catch (error) {
            console.error('Error eliminando RAM:', error);
            throw error;
        }
    }

    // ========== COMPATIBILIDAD ==========

    async checkCPUCompatibility(cpuId, motherboardId) {
        try {
            const cpuResult = await pool.query(
                'SELECT socket, tipo_memoria FROM procesadores WHERE id = $1',
                [cpuId]
            );

            const motherboardResult = await pool.query(
                'SELECT socket, tipo_memoria FROM motherboards WHERE id = $1',
                [motherboardId]
            );

            if (cpuResult.rows.length === 0 || motherboardResult.rows.length === 0) {
                return { compatible: false, reason: 'Componente no encontrado' };
            }

            const cpu = cpuResult.rows[0];
            const motherboard = motherboardResult.rows[0];

            const compatibleSocket = cpu.socket === motherboard.socket;
            const compatibleMemory = cpu.tipo_memoria === motherboard.tipo_memoria;

            return {
                compatible: compatibleSocket && compatibleMemory,
                details: {
                    socket: compatibleSocket,
                    memory: compatibleMemory
                },
                issues: [
                    !compatibleSocket ? `Socket incompatible: CPU ${cpu.socket} vs Mother ${motherboard.socket}` : null,
                    !compatibleMemory ? `Memory incompatible: CPU ${cpu.tipo_memoria} vs Mother ${motherboard.tipo_memoria}` : null
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
            const { rows } = await pool.query(
                `SELECT * FROM ${type} WHERE estado = $1 ORDER BY marca, modelo`,
                ['activo']
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

            const processors = await pool.query('SELECT COUNT(*) as total FROM procesadores WHERE estado = $1', ['activo']);
            const motherboards = await pool.query('SELECT COUNT(*) as total FROM motherboards WHERE estado = $1', ['activo']);
            const ram = await pool.query('SELECT COUNT(*) as total FROM memorias_ram WHERE estado = $1', ['activo']);
            const gpus = await pool.query('SELECT COUNT(*) as total FROM tarjetas_graficas WHERE estado = $1', ['activo']);
            const storage = await pool.query('SELECT COUNT(*) as total FROM almacenamiento WHERE estado = $1', ['activo']);
            const psus = await pool.query('SELECT COUNT(*) as total FROM fuentes_poder WHERE estado = $1', ['activo']);
            const cases = await pool.query('SELECT COUNT(*) as total FROM gabinetes WHERE estado = $1', ['activo']);

            const stats = {
                procesadores: parseInt(processors.rows[0].total),
                motherboards: parseInt(motherboards.rows[0].total),
                memorias_ram: parseInt(ram.rows[0].total),
                tarjetas_graficas: parseInt(gpus.rows[0].total),
                almacenamiento: parseInt(storage.rows[0].total),
                fuentes_poder: parseInt(psus.rows[0].total),
                gabinetes: parseInt(cases.rows[0].total)
            };

            stats.total = Object.values(stats).reduce((sum, count) => sum + count, 0);

            console.log('Estadísticas calculadas:', stats);
            return stats;

        } catch (error) {
            console.error('Error detallado obteniendo estadísticas:', error);
            throw new Error(`Error en base de datos: ${error.message}`);
        }
    }
}

module.exports = new ComponentService();