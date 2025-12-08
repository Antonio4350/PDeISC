import pool from './database.js';

class ProjectController {
  
  // Obtener proyectos del usuario
  async getUserProjects(req, res) {
    try {
      const userId = req.user.id;
      console.log(`📋 Obteniendo proyectos para usuario: ${userId}`);
      
      const { rows: projects } = await pool.query(
        `SELECT p.*, 
         COUNT(pc.componente_id) as componentes_count
         FROM proyectos p 
         LEFT JOIN proyecto_componentes pc ON p.id = pc.proyecto_id
         WHERE p.usuario_id = $1 AND p.estado = $2
         GROUP BY p.id
         ORDER BY p.fecha_actualizacion DESC`,
        [userId, 'activo']
      );

      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('❌ Error obteniendo proyectos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener proyectos'
      });
    }
  }

  // Crear nuevo proyecto CON COMPONENTES
  async createProject(req, res) {
    try {
      const userId = req.user.id;
      const { nombre, descripcion, componentes } = req.body;
      
      console.log(`🛠️ Creando proyecto para usuario: ${userId}`);
      console.log(`📝 Nombre: ${nombre}`);
      console.log(`🔧 Componentes recibidos:`, componentes);

      if (!nombre) {
        return res.status(400).json({
          success: false,
          error: 'El nombre del proyecto es requerido'
        });
      }

      if (!componentes || componentes.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Debe agregar al menos un componente al proyecto'
        });
      }

      // ELIMINAR DUPLICADOS
      const componentesUnicos = [];
      const visto = new Set();
      
      for (const componente of componentes) {
        const key = `${componente.tipo_componente}-${componente.componente_id}`;
        if (!visto.has(key)) {
          visto.add(key);
          componentesUnicos.push(componente);
        }
      }
      
      console.log(`🔍 Componentes únicos:`, componentesUnicos.length, 'de', componentes.length);

      // Iniciar transacción
      await pool.query('BEGIN');

      // 1. Crear el proyecto principal
      const { rows: projectRows } = await pool.query(
        `INSERT INTO proyectos (usuario_id, nombre, descripcion) 
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, nombre, descripcion || '']
      );

      const proyectoId = projectRows[0].id;
      console.log(`✅ Proyecto creado con ID: ${proyectoId}`);

      // 2. Insertar los componentes del proyecto (SIN DUPLICADOS)
      for (const componente of componentesUnicos) {
        const { tipo_componente, componente_id } = componente;
        
        // Mapear tipos de frontend a tablas de backend
        const tableMap = {
          'cpu': 'procesadores',
          'motherboard': 'motherboards', 
          'ram': 'memorias_ram',
          'gpu': 'tarjetas_graficas',
          'storage': 'almacenamiento',
          'psu': 'fuentes_poder',
          'case': 'gabinetes'
        };
        
        const tablaReal = tableMap[tipo_componente];
        
        if (!tablaReal) {
          throw new Error(`Tipo de componente no válido: ${tipo_componente}`);
        }

        // Verificar que el componente existe en su tabla
        const checkQuery = `SELECT id FROM ${tablaReal} WHERE id = $1`;
        console.log(`🔍 Verificando componente: ${tablaReal}.id = ${componente_id}`);
        
        try {
          const { rows: compRows } = await pool.query(checkQuery, [componente_id]);
          
          if (compRows.length === 0) {
            throw new Error(`Componente ${tipo_componente} con ID ${componente_id} no existe en tabla ${tablaReal}`);
          }

          // Insertar en proyecto_componentes
          await pool.query(
            `INSERT INTO proyecto_componentes (proyecto_id, tipo_componente, componente_id)
             VALUES ($1, $2, $3)`,
            [proyectoId, tipo_componente, componente_id]
          );
          
          console.log(`✅ Componente agregado: ${tipo_componente} (ID: ${componente_id})`);
        } catch (error) {
          console.error(`❌ Error con componente ${tipo_componente}-${componente_id}:`, error.message);
          throw error;
        }
      }

      // Commit de la transacción
      await pool.query('COMMIT');

      // 3. Obtener el proyecto completo con sus componentes
      const { rows: fullProject } = await pool.query(
        `SELECT p.* FROM proyectos p WHERE p.id = $1`,
        [proyectoId]
      );

      const { rows: projectComponents } = await pool.query(
        `SELECT pc.*, 
         COALESCE(
           proc.marca, mobo.marca, ram.marca, gpu.marca, stor.marca, psu.marca, gab.marca
         ) as marca,
         COALESCE(
           proc.modelo, mobo.modelo, ram.modelo, gpu.modelo, stor.modelo, psu.modelo, gab.modelo
         ) as modelo
         FROM proyecto_componentes pc
         LEFT JOIN procesadores proc ON pc.componente_id = proc.id AND pc.tipo_componente = 'cpu'
         LEFT JOIN motherboards mobo ON pc.componente_id = mobo.id AND pc.tipo_componente = 'motherboard'
         LEFT JOIN memorias_ram ram ON pc.componente_id = ram.id AND pc.tipo_componente = 'ram'
         LEFT JOIN tarjetas_graficas gpu ON pc.componente_id = gpu.id AND pc.tipo_componente = 'gpu'
         LEFT JOIN almacenamiento stor ON pc.componente_id = stor.id AND pc.tipo_componente = 'storage'
         LEFT JOIN fuentes_poder psu ON pc.componente_id = psu.id AND pc.tipo_componente = 'psu'
         LEFT JOIN gabinetes gab ON pc.componente_id = gab.id AND pc.tipo_componente = 'case'
         WHERE pc.proyecto_id = $1`,
        [proyectoId]
      );

      const project = fullProject[0];
      project.componentes = projectComponents;

      console.log(`🎉 Proyecto ${proyectoId} creado exitosamente con ${projectComponents.length} componentes`);

      res.status(201).json({
        success: true,
        message: 'Proyecto creado exitosamente',
        data: project
      });

    } catch (error) {
      // Rollback en caso de error
      await pool.query('ROLLBACK');
      
      console.error('❌ Error creando proyecto:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      res.status(500).json({
        success: false,
        error: 'Error al crear proyecto',
        details: error.message
      });
    }
  }

  // ✅ NUEVO: Actualizar proyecto existente
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { nombre, descripcion, componentes } = req.body;
      
      console.log(`🔄 Actualizando proyecto ID: ${id} para usuario: ${userId}`);
      console.log(`📝 Nuevo nombre: ${nombre}`);
      console.log(`🔧 Componentes recibidos:`, componentes);

      if (!nombre) {
        return res.status(400).json({
          success: false,
          error: 'El nombre del proyecto es requerido'
        });
      }

      if (!componentes || componentes.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Debe agregar al menos un componente al proyecto'
        });
      }

      // Verificar que el proyecto existe y pertenece al usuario
      const { rows: existingProject } = await pool.query(
        'SELECT id FROM proyectos WHERE id = $1 AND usuario_id = $2 AND estado = $3',
        [id, userId, 'activo']
      );

      if (existingProject.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Proyecto no encontrado'
        });
      }

      // ELIMINAR DUPLICADOS
      const componentesUnicos = [];
      const visto = new Set();
      
      for (const componente of componentes) {
        const key = `${componente.tipo_componente}-${componente.componente_id}`;
        if (!visto.has(key)) {
          visto.add(key);
          componentesUnicos.push(componente);
        }
      }
      
      console.log(`🔍 Componentes únicos:`, componentesUnicos.length, 'de', componentes.length);

      // Iniciar transacción
      await pool.query('BEGIN');

      // 1. Actualizar información básica del proyecto
      const { rows: updatedProject } = await pool.query(
        `UPDATE proyectos 
         SET nombre = $1, descripcion = $2, fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = $3 AND usuario_id = $4
         RETURNING *`,
        [nombre, descripcion || '', id, userId]
      );

      console.log(`✅ Proyecto actualizado: ${updatedProject[0].nombre}`);

      // 2. Eliminar todos los componentes existentes del proyecto
      await pool.query(
        'DELETE FROM proyecto_componentes WHERE proyecto_id = $1',
        [id]
      );

      console.log(`🗑️ Componentes anteriores eliminados`);

      // 3. Insertar los nuevos componentes del proyecto
      for (const componente of componentesUnicos) {
        const { tipo_componente, componente_id } = componente;
        
        // Mapear tipos de frontend a tablas de backend
        const tableMap = {
          'cpu': 'procesadores',
          'motherboard': 'motherboards', 
          'ram': 'memorias_ram',
          'gpu': 'tarjetas_graficas',
          'storage': 'almacenamiento',
          'psu': 'fuentes_poder',
          'case': 'gabinetes'
        };
        
        const tablaReal = tableMap[tipo_componente];
        
        if (!tablaReal) {
          throw new Error(`Tipo de componente no válido: ${tipo_componente}`);
        }

        // Verificar que el componente existe en su tabla
        const checkQuery = `SELECT id FROM ${tablaReal} WHERE id = $1`;
        
        try {
          const { rows: compRows } = await pool.query(checkQuery, [componente_id]);
          
          if (compRows.length === 0) {
            throw new Error(`Componente ${tipo_componente} con ID ${componente_id} no existe en tabla ${tablaReal}`);
          }

          // Insertar en proyecto_componentes
          await pool.query(
            `INSERT INTO proyecto_componentes (proyecto_id, tipo_componente, componente_id)
             VALUES ($1, $2, $3)`,
            [id, tipo_componente, componente_id]
          );
          
          console.log(`✅ Componente agregado: ${tipo_componente} (ID: ${componente_id})`);
        } catch (error) {
          console.error(`❌ Error con componente ${tipo_componente}-${componente_id}:`, error.message);
          throw error;
        }
      }

      // Commit de la transacción
      await pool.query('COMMIT');

      // 4. Obtener el proyecto completo actualizado con sus componentes
      const { rows: fullProject } = await pool.query(
        `SELECT p.* FROM proyectos p WHERE p.id = $1`,
        [id]
      );

      const { rows: projectComponents } = await pool.query(
        `SELECT pc.*, 
         COALESCE(
           proc.marca, mobo.marca, ram.marca, gpu.marca, stor.marca, psu.marca, gab.marca
         ) as marca,
         COALESCE(
           proc.modelo, mobo.modelo, ram.modelo, gpu.modelo, stor.modelo, psu.modelo, gab.modelo
         ) as modelo
         FROM proyecto_componentes pc
         LEFT JOIN procesadores proc ON pc.componente_id = proc.id AND pc.tipo_componente = 'cpu'
         LEFT JOIN motherboards mobo ON pc.componente_id = mobo.id AND pc.tipo_componente = 'motherboard'
         LEFT JOIN memorias_ram ram ON pc.componente_id = ram.id AND pc.tipo_componente = 'ram'
         LEFT JOIN tarjetas_graficas gpu ON pc.componente_id = gpu.id AND pc.tipo_componente = 'gpu'
         LEFT JOIN almacenamiento stor ON pc.componente_id = stor.id AND pc.tipo_componente = 'storage'
         LEFT JOIN fuentes_poder psu ON pc.componente_id = psu.id AND pc.tipo_componente = 'psu'
         LEFT JOIN gabinetes gab ON pc.componente_id = gab.id AND pc.tipo_componente = 'case'
         WHERE pc.proyecto_id = $1`,
        [id]
      );

      const project = fullProject[0];
      project.componentes = projectComponents;

      console.log(`🎉 Proyecto ${id} actualizado exitosamente con ${projectComponents.length} componentes`);

      res.json({
        success: true,
        message: 'Proyecto actualizado exitosamente',
        data: project
      });

    } catch (error) {
      // Rollback en caso de error
      await pool.query('ROLLBACK');
      
      console.error('❌ Error actualizando proyecto:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      res.status(500).json({
        success: false,
        error: 'Error al actualizar proyecto',
        details: error.message
      });
    }
  }

  // Obtener proyecto específico con componentes
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      console.log(`📋 Obteniendo proyecto ID: ${id} para usuario: ${userId}`);

      // Obtener información del proyecto
      const { rows: projects } = await pool.query(
        `SELECT p.* FROM proyectos p 
         WHERE p.id = $1 AND p.usuario_id = $2 AND p.estado = $3`,
        [id, userId, 'activo']
      );

      if (projects.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Proyecto no encontrado'
        });
      }

      const project = projects[0];

      // Obtener componentes del proyecto
      const { rows: components } = await pool.query(
        `SELECT pc.*, 
         COALESCE(
           proc.marca, mobo.marca, ram.marca, gpu.marca, stor.marca, psu.marca, gab.marca
         ) as marca,
         COALESCE(
           proc.modelo, mobo.modelo, ram.modelo, gpu.modelo, stor.modelo, psu.modelo, gab.modelo
         ) as modelo,
         COALESCE(
           proc.socket, mobo.socket, NULL, NULL, NULL, NULL, NULL
         ) as socket,
         COALESCE(
           NULL, mobo.tipo_memoria, ram.tipo, NULL, NULL, NULL, NULL
         ) as tipo_memoria
         FROM proyecto_componentes pc
         LEFT JOIN procesadores proc ON pc.componente_id = proc.id AND pc.tipo_componente = 'cpu'
         LEFT JOIN motherboards mobo ON pc.componente_id = mobo.id AND pc.tipo_componente = 'motherboard'
         LEFT JOIN memorias_ram ram ON pc.componente_id = ram.id AND pc.tipo_componente = 'ram'
         LEFT JOIN tarjetas_graficas gpu ON pc.componente_id = gpu.id AND pc.tipo_componente = 'gpu'
         LEFT JOIN almacenamiento stor ON pc.componente_id = stor.id AND pc.tipo_componente = 'storage'
         LEFT JOIN fuentes_poder psu ON pc.componente_id = psu.id AND pc.tipo_componente = 'psu'
         LEFT JOIN gabinetes gab ON pc.componente_id = gab.id AND pc.tipo_componente = 'case'
         WHERE pc.proyecto_id = $1
         ORDER BY pc.id`,
        [id]
      );

      project.componentes = components;

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('❌ Error obteniendo proyecto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener proyecto'
      });
    }
  }
  
// ✅ VERSIÓN CORREGIDA CON LOGS: Eliminar proyecto
async deleteProject(req, res) {
  try {
    console.log('\n=== 🗑️ INICIANDO ELIMINACIÓN DE PROYECTO ===');
    const { id } = req.params;
    const userId = req.user.id;
    
    console.log(`📋 Datos recibidos:`);
    console.log(`   Proyecto ID: ${id}`);
    console.log(`   Usuario ID: ${userId}`);
    console.log(`   Usuario email: ${req.user.email}`);

    if (!id || isNaN(id)) {
      console.log('❌ Error: ID de proyecto inválido');
      return res.status(400).json({
        success: false,
        error: 'ID de proyecto inválido'
      });
    }

    if (!userId) {
      console.log('❌ Error: Usuario no autenticado');
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    // Iniciar transacción
    console.log('🔄 Iniciando transacción...');
    await pool.query('BEGIN');

    // 1. Verificar que el proyecto existe y pertenece al usuario
    console.log(`🔍 Verificando existencia del proyecto ${id} para usuario ${userId}...`);
    const { rows: existingProject } = await pool.query(
      'SELECT id, nombre FROM proyectos WHERE id = $1 AND usuario_id = $2',
      [id, userId]
    );

    console.log(`📊 Resultado verificación: ${existingProject.length} proyectos encontrados`);
    
    if (existingProject.length === 0) {
      await pool.query('ROLLBACK');
      console.log('❌ Proyecto no encontrado o no pertenece al usuario');
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado'
      });
    }

    const projectName = existingProject[0].nombre;
    console.log(`✅ Proyecto encontrado: "${projectName}" (ID: ${id})`);

    // 2. Eliminar todos los componentes del proyecto
    console.log(`🗑️ Eliminando componentes del proyecto ${id}...`);
    const deleteComponentsResult = await pool.query(
      'DELETE FROM proyecto_componentes WHERE proyecto_id = $1 RETURNING id',
      [id]
    );

    console.log(`✅ Componentes eliminados: ${deleteComponentsResult.rowCount}`);

    // 3. Eliminar el proyecto
    console.log(`🗑️ Eliminando proyecto ${id}...`);
    const deleteProjectResult = await pool.query(
      'DELETE FROM proyectos WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [id, userId]
    );

    if (deleteProjectResult.rowCount === 0) {
      await pool.query('ROLLBACK');
      console.log('❌ Error: No se pudo eliminar el proyecto');
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar proyecto'
      });
    }

    // Commit de la transacción
    await pool.query('COMMIT');
    console.log(`✅ Transacción completada exitosamente`);

    console.log(`🎉 Proyecto "${projectName}" (ID: ${id}) eliminado completamente.`);
    console.log(`📊 Resumen: ${deleteComponentsResult.rowCount} componentes eliminados`);
    console.log('=== FIN ELIMINACIÓN ===\n');

    res.json({
      success: true,
      message: `Proyecto "${projectName}" eliminado exitosamente`,
      deletedProjectId: id,
      deletedComponentsCount: deleteComponentsResult.rowCount
    });
  } catch (error) {
    // Rollback en caso de error
    await pool.query('ROLLBACK');
    
    console.error('\n💥💥💥 ERROR ELIMINANDO PROYECTO 💥💥💥');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('=== FIN ERROR ===\n');
    
    res.status(500).json({
      success: false,
      error: 'Error al eliminar proyecto',
      details: error.message
    });
  }
}

  // Agregar componente a proyecto
  async addComponentToProject(req, res) {
    try {
      const { projectId } = req.params;
      const { componente_id, tipo_componente } = req.body;
      const userId = req.user.id;
      
      console.log(`➕ Agregando componente al proyecto: ${projectId}`, { componente_id, tipo_componente });

      // Verificar que el proyecto pertenece al usuario
      const { rows: projects } = await pool.query(
        'SELECT id FROM proyectos WHERE id = $1 AND usuario_id = $2 AND estado = $3',
        [projectId, userId, 'activo']
      );

      if (projects.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Proyecto no encontrado'
        });
      }

      // Verificar si ya existe un componente de este tipo en el proyecto
      const { rows: existing } = await pool.query(
        'SELECT id FROM proyecto_componentes WHERE proyecto_id = $1 AND tipo_componente = $2',
        [projectId, tipo_componente]
      );

      if (existing.length > 0) {
        // Actualizar componente existente
        await pool.query(
          'UPDATE proyecto_componentes SET componente_id = $1 WHERE proyecto_id = $2 AND tipo_componente = $3',
          [componente_id, projectId, tipo_componente]
        );
      } else {
        // Insertar nuevo componente
        await pool.query(
          'INSERT INTO proyecto_componentes (proyecto_id, componente_id, tipo_componente) VALUES ($1, $2, $3)',
          [projectId, componente_id, tipo_componente]
        );
      }

      // Actualizar fecha de modificación del proyecto
      await pool.query(
        'UPDATE proyectos SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $1',
        [projectId]
      );

      res.json({
        success: true,
        message: 'Componente agregado al proyecto'
      });
    } catch (error) {
      console.error('❌ Error agregando componente:', error);
      res.status(500).json({
        success: false,
        error: 'Error al agregar componente'
      });
    }
  }

  // Remover componente de proyecto
  async removeComponentFromProject(req, res) {
    try {
      const { projectId, tipoComponente } = req.params;
      const userId = req.user.id;
      
      console.log(`➖ Removiendo componente del proyecto: ${projectId}`, { tipoComponente });

      // Verificar que el proyecto pertenece al usuario
      const { rows: projects } = await pool.query(
        'SELECT id FROM proyectos WHERE id = $1 AND usuario_id = $2',
        [projectId, userId]
      );

      if (projects.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Proyecto no encontrado'
        });
      }

      await pool.query(
        'DELETE FROM proyecto_componentes WHERE proyecto_id = $1 AND tipo_componente = $2',
        [projectId, tipoComponente]
      );

      // Actualizar fecha de modificación del proyecto
      await pool.query(
        'UPDATE proyectos SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $1',
        [projectId]
      );

      res.json({
        success: true,
        message: 'Componente removido del proyecto'
      });
    } catch (error) {
      console.error('❌ Error removiendo componente:', error);
      res.status(500).json({
        success: false,
        error: 'Error al remover componente'
      });
    }
  }

  // Verificar compatibilidad de componentes en proyecto
  async checkProjectCompatibility(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;
      
      console.log(`🔍 Verificando compatibilidad para proyecto: ${projectId}`);

      // Obtener componentes del proyecto
      const { rows: components } = await pool.query(
        `SELECT pc.tipo_componente, 
         COALESCE(proc.socket, mobo.socket, NULL, NULL, NULL, NULL, NULL) as socket,
         COALESCE(NULL, mobo.tipo_memoria, ram.tipo, NULL, NULL, NULL, NULL) as tipo_memoria,
         COALESCE(NULL, mobo.formato, NULL, NULL, NULL, NULL, gab.formato) as formato,
         COALESCE(proc.marca, mobo.marca, ram.marca, gpu.marca, stor.marca, psu.marca, gab.marca) as marca,
         COALESCE(proc.modelo, mobo.modelo, ram.modelo, gpu.modelo, stor.modelo, psu.modelo, gab.modelo) as modelo
         FROM proyecto_componentes pc
         LEFT JOIN procesadores proc ON pc.componente_id = proc.id AND pc.tipo_componente = 'cpu'
         LEFT JOIN motherboards mobo ON pc.componente_id = mobo.id AND pc.tipo_componente = 'motherboard'
         LEFT JOIN memorias_ram ram ON pc.componente_id = ram.id AND pc.tipo_componente = 'ram'
         LEFT JOIN tarjetas_graficas gpu ON pc.componente_id = gpu.id AND pc.tipo_componente = 'gpu'
         LEFT JOIN almacenamiento stor ON pc.componente_id = stor.id AND pc.tipo_componente = 'storage'
         LEFT JOIN fuentes_poder psu ON pc.componente_id = psu.id AND pc.tipo_componente = 'psu'
         LEFT JOIN gabinetes gab ON pc.componente_id = gab.id AND pc.tipo_componente = 'case'
         WHERE pc.proyecto_id = $1`,
        [projectId]
      );

      const issues = [];
      const cpu = components.find(c => c.tipo_componente === 'cpu');
      const motherboard = components.find(c => c.tipo_componente === 'motherboard');
      const ram = components.find(c => c.tipo_componente === 'ram');
      const caseComp = components.find(c => c.tipo_componente === 'case');

      // Verificar compatibilidad CPU - Motherboard
      if (cpu && motherboard && cpu.socket && motherboard.socket && cpu.socket !== motherboard.socket) {
        issues.push({
          tipo: 'error',
          mensaje: `Incompatibilidad de socket: CPU ${cpu.socket} vs Motherboard ${motherboard.socket}`,
          componentes: ['cpu', 'motherboard']
        });
      }

      // Verificar compatibilidad RAM - Motherboard
      if (ram && motherboard && ram.tipo_memoria && motherboard.tipo_memoria && ram.tipo_memoria !== motherboard.tipo_memoria) {
        issues.push({
          tipo: 'error', 
          mensaje: `Incompatibilidad de RAM: ${ram.tipo_memoria} vs Motherboard ${motherboard.tipo_memoria}`,
          componentes: ['ram', 'motherboard']
        });
      }

      // Verificar compatibilidad Motherboard - Gabinete
      if (motherboard && caseComp && motherboard.formato && caseComp.formato && 
          !checkFormatoCompatibilidad(motherboard.formato, caseComp.formato)) {
        issues.push({
          tipo: 'advertencia',
          mensaje: `Posible incompatibilidad de formato: ${motherboard.formato} vs Gabinete ${caseComp.formato}`,
          componentes: ['motherboard', 'case']
        });
      }

      res.json({
        success: true,
        data: {
          issues,
          isCompatible: issues.filter(i => i.tipo === 'error').length === 0
        }
      });
    } catch (error) {
      console.error('❌ Error verificando compatibilidad:', error);
      res.status(500).json({
        success: false,
        error: 'Error al verificar compatibilidad'
      });
    }
  }
}

// Función auxiliar para verificar compatibilidad de formatos
function checkFormatoCompatibilidad(motherboardFormat, caseFormat) {
  const compatibility = {
    'Mini-ITX': ['Mini Tower', 'Mid Tower', 'Full Tower', 'Mini-ITX', 'Micro-ATX', 'ATX'],
    'Micro-ATX': ['Mini Tower', 'Mid Tower', 'Full Tower', 'Micro-ATX', 'ATX'], 
    'ATX': ['Mid Tower', 'Full Tower', 'ATX'],
    'E-ATX': ['Full Tower', 'E-ATX']
  };
  
  const caseSupports = compatibility[motherboardFormat] || [];
  return caseSupports.includes(caseFormat);
}

export default new ProjectController();