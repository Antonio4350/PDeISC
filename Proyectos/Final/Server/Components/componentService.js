import pool from './database.js';

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

    // ========== TARJETAS GRÁFICAS ==========

    async getAllGPUs() {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM tarjetas_graficas WHERE estado = $1 ORDER BY marca, modelo',
                ['activo']
            );
            return rows;
        } catch (error) {
            console.error('Error obteniendo tarjetas gráficas:', error);
            throw error;
        }
    }

    async getGPUById(id) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM tarjetas_graficas WHERE id = $1 AND estado = $2',
                [id, 'activo']
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error obteniendo tarjeta gráfica:', error);
            throw error;
        }
    }

    async createGPU(gpuData) {
        const {
            marca, modelo, fabricante, memoria, tipo_memoria, bus_memoria,
            velocidad_memoria, nucleos_cuda, frecuencia_base, frecuencia_boost,
            tdp, conectores_alimentacion, salidas_video, longitud_mm, altura_mm,
            slots_ocupados, peso_kg, imagen_url
        } = gpuData;

        try {
            const { rows } = await pool.query(
                `INSERT INTO tarjetas_graficas 
                (marca, modelo, fabricante, memoria, tipo_memoria, bus_memoria,
                 velocidad_memoria, nucleos_cuda, frecuencia_base, frecuencia_boost,
                 tdp, conectores_alimentacion, salidas_video, longitud_mm, altura_mm,
                 slots_ocupados, peso_kg, imagen_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                RETURNING *`,
                [
                    marca, modelo, fabricante, memoria, tipo_memoria, bus_memoria,
                    velocidad_memoria, nucleos_cuda, frecuencia_base, frecuencia_boost,
                    tdp, conectores_alimentacion, salidas_video, longitud_mm, altura_mm,
                    slots_ocupados, peso_kg, imagen_url
                ]
            );

            return rows[0];
        } catch (error) {
            console.error('Error creando tarjeta gráfica:', error);
            throw error;
        }
    }

    async updateGPU(id, gpuData) {
        const {
            marca, modelo, fabricante, memoria, tipo_memoria, bus_memoria,
            velocidad_memoria, nucleos_cuda, frecuencia_base, frecuencia_boost,
            tdp, conectores_alimentacion, salidas_video, longitud_mm, altura_mm,
            slots_ocupados, peso_kg, imagen_url
        } = gpuData;

        try {
            const { rowCount, rows } = await pool.query(
                `UPDATE tarjetas_graficas SET 
                 marca = $1, modelo = $2, fabricante = $3, memoria = $4, tipo_memoria = $5, bus_memoria = $6,
                 velocidad_memoria = $7, nucleos_cuda = $8, frecuencia_base = $9, frecuencia_boost = $10,
                 tdp = $11, conectores_alimentacion = $12, salidas_video = $13, longitud_mm = $14, altura_mm = $15,
                 slots_ocupados = $16, peso_kg = $17, imagen_url = $18
                 WHERE id = $19 AND estado = $20
                 RETURNING *`,
                [
                    marca, modelo, fabricante, memoria, tipo_memoria, bus_memoria,
                    velocidad_memoria, nucleos_cuda, frecuencia_base, frecuencia_boost,
                    tdp, conectores_alimentacion, salidas_video, longitud_mm, altura_mm,
                    slots_ocupados, peso_kg, imagen_url, id, 'activo'
                ]
            );

            if (rowCount === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            console.error('Error actualizando tarjeta gráfica:', error);
            throw error;
        }
    }

    async deleteGPU(id) {
        try {
            const { rowCount } = await pool.query(
                'UPDATE tarjetas_graficas SET estado = $1 WHERE id = $2',
                ['inactivo', id]
            );

            return rowCount > 0;
        } catch (error) {
            console.error('Error eliminando tarjeta gráfica:', error);
            throw error;
        }
    }

// ========== ALMACENAMIENTO ==========

    async getAllStorage() {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM almacenamiento WHERE estado = $1 ORDER BY marca, modelo',
                ['activo']
            );
            return rows;
        } catch (error) {
            console.error('Error obteniendo almacenamiento:', error);
            throw error;
        }
    }

    async getStorageById(id) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM almacenamiento WHERE id = $1 AND estado = $2',
                [id, 'activo']
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error obteniendo almacenamiento:', error);
            throw error;
        }
    }

    async createStorage(storageData) {
        const {
            marca, modelo, capacidad, tipo, interfaz, velocidad_lectura,
            velocidad_escritura, formato, rpm, imagen_url
        } = storageData;

        try {
            const { rows } = await pool.query(
                `INSERT INTO almacenamiento 
                (marca, modelo, capacidad, tipo, interfaz, velocidad_lectura,
                 velocidad_escritura, formato, rpm, imagen_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *`,
                [
                    marca, modelo, capacidad, tipo, interfaz, velocidad_lectura,
                    velocidad_escritura, formato, rpm, imagen_url
                ]
            );

            return rows[0];
        } catch (error) {
            console.error('Error creando almacenamiento:', error);
            throw error;
        }
    }

    async updateStorage(id, storageData) {
        const {
            marca, modelo, capacidad, tipo, interfaz, velocidad_lectura,
            velocidad_escritura, formato, rpm, imagen_url
        } = storageData;

        try {
            const { rowCount, rows } = await pool.query(
                `UPDATE almacenamiento SET 
                 marca = $1, modelo = $2, capacidad = $3, tipo = $4, interfaz = $5, velocidad_lectura = $6,
                 velocidad_escritura = $7, formato = $8, rpm = $9, imagen_url = $10
                 WHERE id = $11 AND estado = $12
                 RETURNING *`,
                [
                    marca, modelo, capacidad, tipo, interfaz, velocidad_lectura,
                    velocidad_escritura, formato, rpm, imagen_url, id, 'activo'
                ]
            );

            if (rowCount === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            console.error('Error actualizando almacenamiento:', error);
            throw error;
        }
    }

    async deleteStorage(id) {
        try {
            const { rowCount } = await pool.query(
                'UPDATE almacenamiento SET estado = $1 WHERE id = $2',
                ['inactivo', id]
            );

            return rowCount > 0;
        } catch (error) {
            console.error('Error eliminando almacenamiento:', error);
            throw error;
        }
    }

// ========== FUENTES DE PODER ==========

    async getAllPSUs() {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM fuentes_poder WHERE estado = $1 ORDER BY marca, modelo',
                ['activo']
            );
            return rows;
        } catch (error) {
            console.error('Error obteniendo fuentes de poder:', error);
            throw error;
        }
    }

    async getPSUById(id) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM fuentes_poder WHERE id = $1 AND estado = $2',
                [id, 'activo']
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error obteniendo fuente de poder:', error);
            throw error;
        }
    }

    async createPSU(psuData) {
        const {
            marca, modelo, potencia, certificacion, modular, conectores_pcie,
            conectores_sata, conectores_molex, formato, protecciones, imagen_url
        } = psuData;

        try {
            const { rows } = await pool.query(
                `INSERT INTO fuentes_poder 
                (marca, modelo, potencia, certificacion, modular, conectores_pcie,
                 conectores_sata, conectores_molex, formato, protecciones, imagen_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *`,
                [
                    marca, modelo, potencia, certificacion, modular, conectores_pcie,
                    conectores_sata, conectores_molex, formato, protecciones, imagen_url
                ]
            );

            return rows[0];
        } catch (error) {
            console.error('Error creando fuente de poder:', error);
            throw error;
        }
    }

    async updatePSU(id, psuData) {
        const {
            marca, modelo, potencia, certificacion, modular, conectores_pcie,
            conectores_sata, conectores_molex, formato, protecciones, imagen_url
        } = psuData;

        try {
            const { rowCount, rows } = await pool.query(
                `UPDATE fuentes_poder SET 
                 marca = $1, modelo = $2, potencia = $3, certificacion = $4, modular = $5, conectores_pcie = $6,
                 conectores_sata = $7, conectores_molex = $8, formato = $9, protecciones = $10, imagen_url = $11
                 WHERE id = $12 AND estado = $13
                 RETURNING *`,
                [
                    marca, modelo, potencia, certificacion, modular, conectores_pcie,
                    conectores_sata, conectores_molex, formato, protecciones, imagen_url, id, 'activo'
                ]
            );

            if (rowCount === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            console.error('Error actualizando fuente de poder:', error);
            throw error;
        }
    }

    async deletePSU(id) {
        try {
            const { rowCount } = await pool.query(
                'UPDATE fuentes_poder SET estado = $1 WHERE id = $2',
                ['inactivo', id]
            );

            return rowCount > 0;
        } catch (error) {
            console.error('Error eliminando fuente de poder:', error);
            throw error;
        }
    }

    // ========== GABINETES ==========

    async createCase(caseData) {
        const {
            marca, modelo, formato, motherboards_soportadas, longitud_max_gpu,
            altura_max_cooler, bahias_35, bahias_25, slots_expansion,
            ventiladores_incluidos, ventiladores_soportados, radiador_soportado,
            panel_frontal, material, imagen_url
        } = caseData;

        try {
            const { rows } = await pool.query(
                `INSERT INTO gabinetes 
                (marca, modelo, formato, motherboards_soportadas, longitud_max_gpu,
                 altura_max_cooler, bahias_35, bahias_25, slots_expansion,
                 ventiladores_incluidos, ventiladores_soportados, radiador_soportado,
                 panel_frontal, material, imagen_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                RETURNING *`,
                [
                    marca, modelo, formato, motherboards_soportadas, longitud_max_gpu,
                    altura_max_cooler, bahias_35, bahias_25, slots_expansion,
                    ventiladores_incluidos, ventiladores_soportados, radiador_soportado,
                    panel_frontal, material, imagen_url
                ]
            );

            return rows[0];
        } catch (error) {
            console.error('Error creando gabinete:', error);
            throw error;
        }
    }

    async getAllCases() {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM gabinetes WHERE estado = $1 ORDER BY marca, modelo',
                ['activo']
            );
            return rows;
        } catch (error) {
            console.error('Error obteniendo gabinetes:', error);
            throw error;
        }
    }

    async getCaseById(id) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM gabinetes WHERE id = $1 AND estado = $2',
                [id, 'activo']
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error obteniendo gabinete:', error);
            throw error;
        }
    }

    async updateCase(id, caseData) {
        const {
            marca, modelo, formato, motherboards_soportadas, longitud_max_gpu,
            altura_max_cooler, bahias_35, bahias_25, slots_expansion,
            ventiladores_incluidos, ventiladores_soportados, radiador_soportado,
            panel_frontal, material, imagen_url
        } = caseData;

        try {
            const { rowCount, rows } = await pool.query(
                `UPDATE gabinetes SET 
                 marca = $1, modelo = $2, formato = $3, motherboards_soportadas = $4, longitud_max_gpu = $5,
                 altura_max_cooler = $6, bahias_35 = $7, bahias_25 = $8, slots_expansion = $9,
                 ventiladores_incluidos = $10, ventiladores_soportados = $11, radiador_soportado = $12,
                 panel_frontal = $13, material = $14, imagen_url = $15
                 WHERE id = $16 AND estado = $17
                 RETURNING *`,
                [
                    marca, modelo, formato, motherboards_soportadas, longitud_max_gpu,
                    altura_max_cooler, bahias_35, bahias_25, slots_expansion,
                    ventiladores_incluidos, ventiladores_soportados, radiador_soportado,
                    panel_frontal, material, imagen_url, id, 'activo'
                ]
            );

            if (rowCount === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            console.error('Error actualizando gabinete:', error);
            throw error;
        }
    }

    async deleteCase(id) {
        try {
            const { rowCount } = await pool.query(
                'UPDATE gabinetes SET estado = $1 WHERE id = $2',
                ['inactivo', id]
            );

            return rowCount > 0;
        } catch (error) {
            console.error('Error eliminando gabinete:', error);
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

export default new ComponentService();