import pool from './database.js';

class ComponentController {
  
  // ========== PROCESADORES ==========
  
  async getProcessors(req, res) {
    try {
      console.log('Obteniendo lista de procesadores...');
      const { rows } = await pool.query('SELECT * FROM procesadores ORDER BY marca, modelo');
      
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error obteniendo procesadores:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener procesadores'
      });
    }
  }

  async getProcessorById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Obteniendo procesador ID: ${id}`);
      
      const { rows } = await pool.query(
        'SELECT * FROM procesadores WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Procesador no encontrado'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error obteniendo procesador:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener procesador'
      });
    }
  }

  async createProcessor(req, res) {
    try {
      const processorData = req.body;
      console.log('➕ Creando nuevo procesador:', processorData.marca, processorData.modelo);
      
      if (!processorData.marca || !processorData.modelo || !processorData.socket) {
        return res.status(400).json({
          success: false,
          error: 'Marca, modelo y socket son requeridos'
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO procesadores (marca, modelo, generacion, año_lanzamiento, socket, nucleos, hilos, 
         frecuencia_base, frecuencia_turbo, cache, tdp, tipo_memoria, velocidad_memoria_max, 
         graficos_integrados, modelo_graficos, tecnologia, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         RETURNING *`,
        [
          processorData.marca,
          processorData.modelo,
          processorData.generacion,
          processorData.año_lanzamiento,
          processorData.socket,
          processorData.nucleos,
          processorData.hilos,
          processorData.frecuencia_base,
          processorData.frecuencia_turbo,
          processorData.cache,
          processorData.tdp,
          processorData.tipo_memoria,
          processorData.velocidad_memoria_max,
          processorData.graficos_integrados,
          processorData.modelo_graficos,
          processorData.tecnologia,
          processorData.imagen_url
        ]
      );

      res.json({
        success: true,
        message: 'Procesador creado exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error creando procesador:', error);
      res.status(500).json({
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
      
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      // Construir SET dinámicamente
      const fields = [
        'marca', 'modelo', 'generacion', 'año_lanzamiento', 'socket',
        'nucleos', 'hilos', 'frecuencia_base', 'frecuencia_turbo', 'cache',
        'tdp', 'tipo_memoria', 'velocidad_memoria_max', 'graficos_integrados',
        'modelo_graficos', 'tecnologia', 'imagen_url'
      ];

      fields.forEach(field => {
        if (processorData[field] !== undefined) {
          setClauses.push(`${field} = $${paramCount}`);
          values.push(processorData[field]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos para actualizar'
        });
      }

      values.push(id);
      
      const query = `
        UPDATE procesadores 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const { rows } = await pool.query(query, values);
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Procesador no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Procesador actualizado exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error actualizando procesador:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar procesador'
      });
    }
  }

  async deleteProcessor(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando procesador ID: ${id}`);
      
      const { rows } = await pool.query(
        'DELETE FROM procesadores WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
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
      res.status(500).json({
        success: false,
        error: 'Error al eliminar procesador'
      });
    }
  }

  // ========== MOTHERBOARDS ==========
  
  async getMotherboards(req, res) {
    try {
      console.log('Obteniendo lista de motherboards...');
      const { rows } = await pool.query('SELECT * FROM motherboards ORDER BY marca, modelo');
      
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error obteniendo motherboards:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener motherboards'
      });
    }
  }

  async getMotherboardById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Obteniendo motherboard ID: ${id}`);
      
      const { rows } = await pool.query(
        'SELECT * FROM motherboards WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Motherboard no encontrado'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error obteniendo motherboard:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener motherboard'
      });
    }
  }

  async createMotherboard(req, res) {
    try {
      const motherboardData = req.body;
      console.log('➕ Creando nueva motherboard:', motherboardData.marca, motherboardData.modelo);
      
      if (!motherboardData.marca || !motherboardData.modelo || !motherboardData.socket) {
        return res.status(400).json({
          success: false,
          error: 'Marca, modelo y socket son requeridos'
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO motherboards (marca, modelo, socket, chipset, formato, tipo_memoria, slots_memoria,
         memoria_maxima, velocidad_memoria_soportada, slots_pcie, version_pcie, puertos_sata,
         puertos_m2, conectividad_red, audio, usb_puertos, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         RETURNING *`,
        [
          motherboardData.marca,
          motherboardData.modelo,
          motherboardData.socket,
          motherboardData.chipset,
          motherboardData.formato,
          motherboardData.tipo_memoria,
          motherboardData.slots_memoria,
          motherboardData.memoria_maxima,
          motherboardData.velocidad_memoria_soportada,
          motherboardData.slots_pcie,
          motherboardData.version_pcie,
          motherboardData.puertos_sata,
          motherboardData.puertos_m2,
          motherboardData.conectividad_red,
          motherboardData.audio,
          motherboardData.usb_puertos,
          motherboardData.imagen_url
        ]
      );

      res.json({
        success: true,
        message: 'Motherboard creada exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error creando motherboard:', error);
      res.status(500).json({
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
      
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      const fields = [
        'marca', 'modelo', 'socket', 'chipset', 'formato',
        'tipo_memoria', 'slots_memoria', 'memoria_maxima',
        'velocidad_memoria_soportada', 'slots_pcie', 'version_pcie',
        'puertos_sata', 'puertos_m2', 'conectividad_red',
        'audio', 'usb_puertos', 'imagen_url'
      ];

      fields.forEach(field => {
        if (motherboardData[field] !== undefined) {
          setClauses.push(`${field} = $${paramCount}`);
          values.push(motherboardData[field]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos para actualizar'
        });
      }

      values.push(id);
      
      const query = `
        UPDATE motherboards 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const { rows } = await pool.query(query, values);
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Motherboard no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Motherboard actualizada exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error actualizando motherboard:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar motherboard'
      });
    }
  }

  async deleteMotherboard(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando motherboard ID: ${id}`);
      
      const { rows } = await pool.query(
        'DELETE FROM motherboards WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
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
      res.status(500).json({
        success: false,
        error: 'Error al eliminar motherboard'
      });
    }
  }

  // ========== MEMORIAS RAM ==========
  
  async getRAM(req, res) {
    try {
      console.log('Obteniendo lista de memorias RAM...');
      const { rows } = await pool.query('SELECT * FROM memorias_ram ORDER BY marca, modelo');
      
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error obteniendo memorias RAM:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener memorias RAM'
      });
    }
  }

  async getRAMById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Obteniendo RAM ID: ${id}`);
      
      const { rows } = await pool.query(
        'SELECT * FROM memorias_ram WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Memoria RAM no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error obteniendo RAM:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener RAM'
      });
    }
  }

  async createRAM(req, res) {
    try {
      const ramData = req.body;
      console.log('➕ Creando nueva memoria RAM:', ramData.marca, ramData.modelo);
      
      if (!ramData.marca || !ramData.modelo || !ramData.tipo || !ramData.capacidad) {
        return res.status(400).json({
          success: false,
          error: 'Marca, modelo, tipo y capacidad son requeridos'
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO memorias_ram (marca, modelo, tipo, capacidad, velocidad_mhz, velocidad_mt,
         latencia, voltaje, formato, rgb, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          ramData.marca,
          ramData.modelo,
          ramData.tipo,
          ramData.capacidad,
          ramData.velocidad_mhz,
          ramData.velocidad_mt,
          ramData.latencia,
          ramData.voltaje,
          ramData.formato,
          ramData.rgb,
          ramData.imagen_url
        ]
      );

      res.json({
        success: true,
        message: 'Memoria RAM creada exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error creando memoria RAM:', error);
      res.status(500).json({
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
      
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      const fields = [
        'marca', 'modelo', 'tipo', 'capacidad', 'velocidad_mhz',
        'velocidad_mt', 'latencia', 'voltaje', 'formato', 'rgb', 'imagen_url'
      ];

      fields.forEach(field => {
        if (ramData[field] !== undefined) {
          setClauses.push(`${field} = $${paramCount}`);
          values.push(ramData[field]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos para actualizar'
        });
      }

      values.push(id);
      
      const query = `
        UPDATE memorias_ram 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const { rows } = await pool.query(query, values);
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Memoria RAM no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Memoria RAM actualizada exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error actualizando RAM:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar memoria RAM'
      });
    }
  }

  async deleteRAM(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando RAM ID: ${id}`);
      
      const { rows } = await pool.query(
        'DELETE FROM memorias_ram WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
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
      res.status(500).json({
        success: false,
        error: 'Error al eliminar memoria RAM'
      });
    }
  }

  // ========== TARJETAS GRÁFICAS ==========

  async getGPUs(req, res) {
    try {
      console.log('Obteniendo lista de tarjetas gráficas...');
      const { rows } = await pool.query('SELECT * FROM tarjetas_graficas ORDER BY marca, modelo');
      
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error obteniendo tarjetas gráficas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tarjetas gráficas'
      });
    }
  }

  async getGPUById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Obteniendo GPU ID: ${id}`);
      
      const { rows } = await pool.query(
        'SELECT * FROM tarjetas_graficas WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Tarjeta gráfica no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error obteniendo GPU:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tarjeta gráfica'
      });
    }
  }

  async createGPU(req, res) {
    try {
      const gpuData = req.body;
      console.log('➕ Creando nueva tarjeta gráfica:', gpuData.marca, gpuData.modelo);
      
      if (!gpuData.marca || !gpuData.modelo) {
        return res.status(400).json({
          success: false,
          error: 'Marca y modelo son requeridos'
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO tarjetas_graficas (marca, modelo, fabricante, memoria, tipo_memoria, bus_memoria,
         velocidad_memoria, nucleos_cuda, frecuencia_base, frecuencia_boost, tdp, conectores_alimentacion,
         salidas_video, longitud_mm, altura_mm, slots_ocupados, peso_kg, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
         RETURNING *`,
        [
          gpuData.marca,
          gpuData.modelo,
          gpuData.fabricante,
          gpuData.memoria,
          gpuData.tipo_memoria,
          gpuData.bus_memoria,
          gpuData.velocidad_memoria,
          gpuData.nucleos_cuda,
          gpuData.frecuencia_base,
          gpuData.frecuencia_boost,
          gpuData.tdp,
          gpuData.conectores_alimentacion,
          gpuData.salidas_video,
          gpuData.longitud_mm,
          gpuData.altura_mm,
          gpuData.slots_ocupados,
          gpuData.peso_kg,
          gpuData.imagen_url
        ]
      );

      res.json({
        success: true,
        message: 'Tarjeta gráfica creada exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error creando GPU:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear tarjeta gráfica'
      });
    }
  }

  async updateGPU(req, res) {
    try {
      const { id } = req.params;
      const gpuData = req.body;
      console.log(`Actualizando GPU ID: ${id}`);
      
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      const fields = [
        'marca', 'modelo', 'fabricante', 'memoria', 'tipo_memoria',
        'bus_memoria', 'velocidad_memoria', 'nucleos_cuda',
        'frecuencia_base', 'frecuencia_boost', 'tdp', 'conectores_alimentacion',
        'salidas_video', 'longitud_mm', 'altura_mm', 'slots_ocupados',
        'peso_kg', 'imagen_url'
      ];

      fields.forEach(field => {
        if (gpuData[field] !== undefined) {
          setClauses.push(`${field} = $${paramCount}`);
          values.push(gpuData[field]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos para actualizar'
        });
      }

      values.push(id);
      
      const query = `
        UPDATE tarjetas_graficas 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const { rows } = await pool.query(query, values);
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Tarjeta gráfica no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Tarjeta gráfica actualizada exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error actualizando GPU:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar tarjeta gráfica'
      });
    }
  }

  async deleteGPU(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando GPU ID: ${id}`);
      
      const { rows } = await pool.query(
        'DELETE FROM tarjetas_graficas WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Tarjeta gráfica no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Tarjeta gráfica eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando GPU:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar tarjeta gráfica'
      });
    }
  }

  // ========== ALMACENAMIENTO ==========

  async getStorage(req, res) {
    try {
      console.log('Obteniendo lista de almacenamiento...');
      const { rows } = await pool.query('SELECT * FROM almacenamiento ORDER BY marca, modelo');
      
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error obteniendo almacenamiento:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener almacenamiento'
      });
    }
  }

  async getStorageById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Obteniendo almacenamiento ID: ${id}`);
      
      const { rows } = await pool.query(
        'SELECT * FROM almacenamiento WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Almacenamiento no encontrado'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error obteniendo almacenamiento:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener almacenamiento'
      });
    }
  }

  async createStorage(req, res) {
    try {
      const storageData = req.body;
      console.log('➕ Creando nuevo almacenamiento:', storageData.marca, storageData.modelo);
      
      if (!storageData.marca || !storageData.modelo || !storageData.capacidad || !storageData.tipo) {
        return res.status(400).json({
          success: false,
          error: 'Marca, modelo, capacidad y tipo son requeridos'
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO almacenamiento (marca, modelo, capacidad, tipo, interfaz, velocidad_lectura,
         velocidad_escritura, formato, rpm, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          storageData.marca,
          storageData.modelo,
          storageData.capacidad,
          storageData.tipo,
          storageData.interfaz,
          storageData.velocidad_lectura,
          storageData.velocidad_escritura,
          storageData.formato,
          storageData.rpm,
          storageData.imagen_url
        ]
      );

      res.json({
        success: true,
        message: 'Almacenamiento creado exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error creando almacenamiento:', error);
      res.status(500).json({
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
      
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      const fields = [
        'marca', 'modelo', 'capacidad', 'tipo', 'interfaz',
        'velocidad_lectura', 'velocidad_escritura', 'formato', 'rpm', 'imagen_url'
      ];

      fields.forEach(field => {
        if (storageData[field] !== undefined) {
          setClauses.push(`${field} = $${paramCount}`);
          values.push(storageData[field]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos para actualizar'
        });
      }

      values.push(id);
      
      const query = `
        UPDATE almacenamiento 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const { rows } = await pool.query(query, values);
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Almacenamiento no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Almacenamiento actualizado exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error actualizando almacenamiento:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar almacenamiento'
      });
    }
  }

  async deleteStorage(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando almacenamiento ID: ${id}`);
      
      const { rows } = await pool.query(
        'DELETE FROM almacenamiento WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
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
      res.status(500).json({
        success: false,
        error: 'Error al eliminar almacenamiento'
      });
    }
  }

  // ========== FUENTES DE PODER ==========

  async getPSUs(req, res) {
    try {
      console.log('Obteniendo lista de fuentes de poder...');
      const { rows } = await pool.query('SELECT * FROM fuentes_poder ORDER BY marca, modelo');
      
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error obteniendo fuentes de poder:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener fuentes de poder'
      });
    }
  }

  async getPSUById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Obteniendo PSU ID: ${id}`);
      
      const { rows } = await pool.query(
        'SELECT * FROM fuentes_poder WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Fuente de poder no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error obteniendo PSU:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener fuente de poder'
      });
    }
  }

  async createPSU(req, res) {
    try {
      const psuData = req.body;
      console.log('➕ Creando nueva fuente de poder:', psuData.marca, psuData.modelo);
      
      if (!psuData.marca || !psuData.modelo || !psuData.potencia) {
        return res.status(400).json({
          success: false,
          error: 'Marca, modelo y potencia son requeridos'
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO fuentes_poder (marca, modelo, potencia, certificacion, modular, conectores_pcie,
         conectores_sata, conectores_molex, formato, protecciones, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          psuData.marca,
          psuData.modelo,
          psuData.potencia,
          psuData.certificacion,
          psuData.modular,
          psuData.conectores_pcie,
          psuData.conectores_sata,
          psuData.conectores_molex,
          psuData.formato,
          psuData.protecciones,
          psuData.imagen_url
        ]
      );

      res.json({
        success: true,
        message: 'Fuente de poder creada exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error creando PSU:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear fuente de poder'
      });
    }
  }

  async updatePSU(req, res) {
    try {
      const { id } = req.params;
      const psuData = req.body;
      console.log(`Actualizando PSU ID: ${id}`);
      
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      const fields = [
        'marca', 'modelo', 'potencia', 'certificacion', 'modular',
        'conectores_pcie', 'conectores_sata', 'conectores_molex',
        'formato', 'protecciones', 'imagen_url'
      ];

      fields.forEach(field => {
        if (psuData[field] !== undefined) {
          setClauses.push(`${field} = $${paramCount}`);
          values.push(psuData[field]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos para actualizar'
        });
      }

      values.push(id);
      
      const query = `
        UPDATE fuentes_poder 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const { rows } = await pool.query(query, values);
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Fuente de poder no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Fuente de poder actualizada exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error actualizando PSU:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar fuente de poder'
      });
    }
  }

  async deletePSU(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando PSU ID: ${id}`);
      
      const { rows } = await pool.query(
        'DELETE FROM fuentes_poder WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Fuente de poder no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Fuente de poder eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando PSU:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar fuente de poder'
      });
    }
  }

  // ========== GABINETES ==========

  async getCases(req, res) {
    try {
      console.log('Obteniendo lista de gabinetes...');
      const { rows } = await pool.query('SELECT * FROM gabinetes ORDER BY marca, modelo');
      
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      console.error('Error obteniendo gabinetes:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener gabinetes'
      });
    }
  }

  async getCaseById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Obteniendo gabinete ID: ${id}`);
      
      const { rows } = await pool.query(
        'SELECT * FROM gabinetes WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Gabinete no encontrado'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error obteniendo gabinete:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener gabinete'
      });
    }
  }

  async createCase(req, res) {
    try {
      const caseData = req.body;
      console.log('➕ Creando nuevo gabinete:', caseData.marca, caseData.modelo);
      
      if (!caseData.marca || !caseData.modelo) {
        return res.status(400).json({
          success: false,
          error: 'Marca y modelo son requeridos'
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO gabinetes (marca, modelo, formato, motherboards_soportadas, longitud_max_gpu,
         altura_max_cooler, bahias_35, bahias_25, slots_expansion, ventiladores_incluidos,
         ventiladores_soportados, radiador_soportado, panel_frontal, material, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          caseData.marca,
          caseData.modelo,
          caseData.formato,
          caseData.motherboards_soportadas,
          caseData.longitud_max_gpu,
          caseData.altura_max_cooler,
          caseData.bahias_35,
          caseData.bahias_25,
          caseData.slots_expansion,
          caseData.ventiladores_incluidos,
          caseData.ventiladores_soportados,
          caseData.radiador_soportado,
          caseData.panel_frontal,
          caseData.material,
          caseData.imagen_url
        ]
      );

      res.json({
        success: true,
        message: 'Gabinete creado exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error creando gabinete:', error);
      res.status(500).json({
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
      
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      const fields = [
        'marca', 'modelo', 'formato', 'motherboards_soportadas', 'longitud_max_gpu',
        'altura_max_cooler', 'bahias_35', 'bahias_25', 'slots_expansion',
        'ventiladores_incluidos', 'ventiladores_soportados', 'radiador_soportado',
        'panel_frontal', 'material', 'imagen_url'
      ];

      fields.forEach(field => {
        if (caseData[field] !== undefined) {
          setClauses.push(`${field} = $${paramCount}`);
          values.push(caseData[field]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No hay datos para actualizar'
        });
      }

      values.push(id);
      
      const query = `
        UPDATE gabinetes 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const { rows } = await pool.query(query, values);
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Gabinete no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Gabinete actualizado exitosamente',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error actualizando gabinete:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar gabinete'
      });
    }
  }

  async deleteCase(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando gabinete ID: ${id}`);
      
      const { rows } = await pool.query(
        'DELETE FROM gabinetes WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
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
      res.status(500).json({
        success: false,
        error: 'Error al eliminar gabinete'
      });
    }
  }

  // ========== MÉTODOS GENERALES ==========

  async getComponentsByType(req, res) {
    try {
      const { type } = req.params;
      console.log(`Obteniendo componentes de tipo: ${type}`);
      
      const tableMap = {
        'procesadores': 'procesadores',
        'processors': 'procesadores',
        'motherboards': 'motherboards',
        'memorias_ram': 'memorias_ram',
        'ram': 'memorias_ram',
        'tarjetas_graficas': 'tarjetas_graficas',
        'gpus': 'tarjetas_graficas',
        'gpu': 'tarjetas_graficas',
        'almacenamiento': 'almacenamiento',
        'storage': 'almacenamiento',
        'fuentes_poder': 'fuentes_poder',
        'psus': 'fuentes_poder',
        'psu': 'fuentes_poder',
        'gabinetes': 'gabinetes',
        'cases': 'gabinetes',
        'case': 'gabinetes'
      };

      const tableName = tableMap[type.toLowerCase()];
      
      if (!tableName) {
        return res.status(400).json({
          success: false,
          error: `Tipo de componente no válido: ${type}`
        });
      }

      const { rows } = await pool.query(`SELECT * FROM ${tableName} ORDER BY marca, modelo`);
      
      res.json({
        success: true,
        data: rows,
        count: rows.length,
        type: type
      });
    } catch (error) {
      console.error(`Error obteniendo componentes tipo ${req.params.type}:`, error);
      res.status(500).json({
        success: false,
        error: `Error al obtener ${req.params.type}`
      });
    }
  }

  async checkCompatibility(req, res) {
    try {
      const { cpuId, motherboardId } = req.body;
      console.log(`Verificando compatibilidad CPU:${cpuId} - Mother:${motherboardId}`);
      
      if (!cpuId || !motherboardId) {
        return res.status(400).json({
          success: false,
          error: 'Se requieren CPU ID y Motherboard ID'
        });
      }

      // Obtener información del CPU
      const { rows: cpuRows } = await pool.query(
        'SELECT socket, marca, modelo FROM procesadores WHERE id = $1',
        [cpuId]
      );
      
      if (cpuRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'CPU no encontrado'
        });
      }

      // Obtener información de la motherboard
      const { rows: moboRows } = await pool.query(
        'SELECT socket, marca, modelo FROM motherboards WHERE id = $1',
        [motherboardId]
      );
      
      if (moboRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Motherboard no encontrada'
        });
      }

      const cpu = cpuRows[0];
      const mobo = moboRows[0];
      
      const isCompatible = cpu.socket === mobo.socket;
      
      res.json({
        success: true,
        data: {
          compatible: isCompatible,
          cpu: cpu,
          motherboard: mobo,
          message: isCompatible 
            ? `Compatible: ${cpu.socket} = ${mobo.socket}` 
            : `Incompatible: ${cpu.socket} ≠ ${mobo.socket}`
        }
      });
    } catch (error) {
      console.error('Error verificando compatibilidad:', error);
      res.status(500).json({
        success: false,
        error: 'Error al verificar compatibilidad'
      });
    }
  }

  async getComponentStats(req, res) {
    try {
      console.log('Obteniendo estadísticas de componentes...');
      
      // Obtener conteos de cada tipo de componente
      const counts = {
        procesadores: (await pool.query('SELECT COUNT(*) FROM procesadores')).rows[0].count,
        motherboards: (await pool.query('SELECT COUNT(*) FROM motherboards')).rows[0].count,
        memorias_ram: (await pool.query('SELECT COUNT(*) FROM memorias_ram')).rows[0].count,
        tarjetas_graficas: (await pool.query('SELECT COUNT(*) FROM tarjetas_graficas')).rows[0].count,
        almacenamiento: (await pool.query('SELECT COUNT(*) FROM almacenamiento')).rows[0].count,
        fuentes_poder: (await pool.query('SELECT COUNT(*) FROM fuentes_poder')).rows[0].count,
        gabinetes: (await pool.query('SELECT COUNT(*) FROM gabinetes')).rows[0].count
      };
      
      res.json({
        success: true,
        data: counts
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  }

  async getFormOptions(req, res) {
    try {
      console.log('⚙️ Obteniendo opciones para formularios...');
      
      // Obtener propiedades únicas de cada tabla para formularios
      const options = {
        procesadores: {
          marcas: (await pool.query('SELECT DISTINCT marca FROM procesadores ORDER BY marca')).rows.map(r => ({ id: r.marca, valor: r.marca })),
          sockets: (await pool.query('SELECT DISTINCT socket FROM procesadores ORDER BY socket')).rows.map(r => ({ id: r.socket, valor: r.socket }))
        },
        motherboards: {
          marcas: (await pool.query('SELECT DISTINCT marca FROM motherboards ORDER BY marca')).rows.map(r => ({ id: r.marca, valor: r.marca })),
          sockets: (await pool.query('SELECT DISTINCT socket FROM motherboards ORDER BY socket')).rows.map(r => ({ id: r.socket, valor: r.socket })),
          formatos: (await pool.query("SELECT DISTINCT formato FROM motherboards WHERE formato IS NOT NULL AND formato != '' ORDER BY formato")).rows.map(r => ({ id: r.formato, valor: r.formato }))
        },
        memorias_ram: {
          marcas: (await pool.query('SELECT DISTINCT marca FROM memorias_ram ORDER BY marca')).rows.map(r => ({ id: r.marca, valor: r.marca })),
          tipos: (await pool.query("SELECT DISTINCT tipo FROM memorias_ram WHERE tipo IS NOT NULL AND tipo != '' ORDER BY tipo")).rows.map(r => ({ id: r.tipo, valor: r.tipo }))
        },
        tarjetas_graficas: {
          marcas: (await pool.query('SELECT DISTINCT marca FROM tarjetas_graficas ORDER BY marca')).rows.map(r => ({ id: r.marca, valor: r.marca }))
        },
        almacenamiento: {
          marcas: (await pool.query('SELECT DISTINCT marca FROM almacenamiento ORDER BY marca')).rows.map(r => ({ id: r.marca, valor: r.marca })),
          tipos: (await pool.query("SELECT DISTINCT tipo FROM almacenamiento WHERE tipo IS NOT NULL AND tipo != '' ORDER BY tipo")).rows.map(r => ({ id: r.tipo, valor: r.tipo }))
        },
        fuentes_poder: {
          marcas: (await pool.query('SELECT DISTINCT marca FROM fuentes_poder ORDER BY marca')).rows.map(r => ({ id: r.marca, valor: r.marca }))
        },
        gabinetes: {
          marcas: (await pool.query('SELECT DISTINCT marca FROM gabinetes ORDER BY marca')).rows.map(r => ({ id: r.marca, valor: r.marca }))
        }
      };

      res.json({
        success: true,
        data: options
      });
    } catch (error) {
      console.error('Error obteniendo opciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener opciones'
      });
    }
  }
}

export default new ComponentController();