const pool = require('./database');

class ProjectController {
  
  // Obtener proyectos del usuario
  async getUserProjects(req, res) {
    try {
      const userId = req.user.id;
      console.log(`Obteniendo proyectos para usuario: ${userId}`);
      
      const [projects] = await pool.execute(
        `SELECT p.*, 
         COUNT(pc.componente_id) as componentes_count
         FROM proyectos p 
         LEFT JOIN proyecto_componentes pc ON p.id = pc.proyecto_id
         WHERE p.usuario_id = ? AND p.estado = 'activo'
         GROUP BY p.id
         ORDER BY p.fecha_actualizacion DESC`,
        [userId]
      );

      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('Error obteniendo proyectos:', error);
      res.json({
        success: false,
        error: 'Error al obtener proyectos'
      });
    }
  }

  // Crear nuevo proyecto
  async createProject(req, res) {
    try {
      const userId = req.user.id;
      const { nombre, descripcion, presupuesto } = req.body;
      
      console.log(`Creando proyecto para usuario: ${userId}`, { nombre, descripcion });

      if (!nombre) {
        return res.json({
          success: false,
          error: 'El nombre del proyecto es requerido'
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO proyectos (usuario_id, nombre, descripcion, presupuesto) 
         VALUES (?, ?, ?, ?)`,
        [userId, nombre, descripcion || '', presupuesto || null]
      );

      const [newProject] = await pool.execute(
        'SELECT * FROM proyectos WHERE id = ?',
        [result.insertId]
      );

      res.json({
        success: true,
        message: 'Proyecto creado exitosamente',
        data: newProject[0]
      });
    } catch (error) {
      console.error('Error creando proyecto:', error);
      res.json({
        success: false,
        error: 'Error al crear proyecto'
      });
    }
  }

  // Obtener proyecto específico con componentes
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      console.log(`Obteniendo proyecto ID: ${id} para usuario: ${userId}`);

      // Obtener información del proyecto
      const [projects] = await pool.execute(
        `SELECT p.* FROM proyectos p 
         WHERE p.id = ? AND p.usuario_id = ? AND p.estado = 'activo'`,
        [id, userId]
      );

      if (projects.length === 0) {
        return res.json({
          success: false,
          error: 'Proyecto no encontrado'
        });
      }

      const project = projects[0];

      // Obtener componentes del proyecto
      const [components] = await pool.execute(
        `SELECT pc.*, 
         c.marca, c.modelo, c.tipo_memoria, c.socket,
         c.nucleos, c.capacidad, c.velocidad_mhz,
         c.potencia, c.formato
         FROM proyecto_componentes pc
         LEFT JOIN procesadores c ON pc.componente_id = c.id AND pc.tipo_componente = 'procesadores'
         LEFT JOIN motherboards c ON pc.componente_id = c.id AND pc.tipo_componente = 'motherboards'
         LEFT JOIN memorias_ram c ON pc.componente_id = c.id AND pc.tipo_componente = 'memorias_ram'
         LEFT JOIN tarjetas_graficas c ON pc.componente_id = c.id AND pc.tipo_componente = 'tarjetas_graficas'
         LEFT JOIN almacenamiento c ON pc.componente_id = c.id AND pc.tipo_componente = 'almacenamiento'
         LEFT JOIN fuentes_poder c ON pc.componente_id = c.id AND pc.tipo_componente = 'fuentes_poder'
         LEFT JOIN gabinetes c ON pc.componente_id = c.id AND pc.tipo_componente = 'gabinetes'
         WHERE pc.proyecto_id = ?
         ORDER BY pc.orden`,
        [id]
      );

      project.componentes = components;

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error obteniendo proyecto:', error);
      res.json({
        success: false,
        error: 'Error al obtener proyecto'
      });
    }
  }

  // Agregar componente a proyecto
  async addComponentToProject(req, res) {
    try {
      const { projectId } = req.params;
      const { componente_id, tipo_componente } = req.body;
      const userId = req.user.id;
      
      console.log(`Agregando componente al proyecto: ${projectId}`, { componente_id, tipo_componente });

      // Verificar que el proyecto pertenece al usuario
      const [projects] = await pool.execute(
        'SELECT id FROM proyectos WHERE id = ? AND usuario_id = ?',
        [projectId, userId]
      );

      if (projects.length === 0) {
        return res.json({
          success: false,
          error: 'Proyecto no encontrado'
        });
      }

      // Verificar si ya existe un componente de este tipo en el proyecto
      const [existing] = await pool.execute(
        'SELECT id FROM proyecto_componentes WHERE proyecto_id = ? AND tipo_componente = ?',
        [projectId, tipo_componente]
      );

      if (existing.length > 0) {
        // Actualizar componente existente
        await pool.execute(
          'UPDATE proyecto_componentes SET componente_id = ? WHERE proyecto_id = ? AND tipo_componente = ?',
          [componente_id, projectId, tipo_componente]
        );
      } else {
        // Insertar nuevo componente
        await pool.execute(
          'INSERT INTO proyecto_componentes (proyecto_id, componente_id, tipo_componente, orden) VALUES (?, ?, ?, ?)',
          [projectId, componente_id, tipo_componente, getOrderForType(tipo_componente)]
        );
      }

      // Actualizar fecha de modificación del proyecto
      await pool.execute(
        'UPDATE proyectos SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
        [projectId]
      );

      res.json({
        success: true,
        message: 'Componente agregado al proyecto'
      });
    } catch (error) {
      console.error('Error agregando componente:', error);
      res.json({
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
      
      console.log(`Removiendo componente del proyecto: ${projectId}`, { tipoComponente });

      // Verificar que el proyecto pertenece al usuario
      const [projects] = await pool.execute(
        'SELECT id FROM proyectos WHERE id = ? AND usuario_id = ?',
        [projectId, userId]
      );

      if (projects.length === 0) {
        return res.json({
          success: false,
          error: 'Proyecto no encontrado'
        });
      }

      await pool.execute(
        'DELETE FROM proyecto_componentes WHERE proyecto_id = ? AND tipo_componente = ?',
        [projectId, tipoComponente]
      );

      // Actualizar fecha de modificación del proyecto
      await pool.execute(
        'UPDATE proyectos SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
        [projectId]
      );

      res.json({
        success: true,
        message: 'Componente removido del proyecto'
      });
    } catch (error) {
      console.error('Error removiendo componente:', error);
      res.json({
        success: false,
        error: 'Error al remover componente'
      });
    }
  }

  // Eliminar proyecto
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      console.log(`Eliminando proyecto ID: ${id} para usuario: ${userId}`);

      const [result] = await pool.execute(
        'UPDATE proyectos SET estado = "archivado" WHERE id = ? AND usuario_id = ?',
        [id, userId]
      );

      if (result.affectedRows === 0) {
        return res.json({
          success: false,
          error: 'Proyecto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Proyecto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      res.json({
        success: false,
        error: 'Error al eliminar proyecto'
      });
    }
  }

  // Verificar compatibilidad de componentes en proyecto
  async checkProjectCompatibility(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;
      
      console.log(`Verificando compatibilidad para proyecto: ${projectId}`);

      // Obtener componentes del proyecto
      const [components] = await pool.execute(
        `SELECT pc.tipo_componente, 
         c.socket, c.tipo_memoria, c.formato,
         c.marca, c.modelo
         FROM proyecto_componentes pc
         LEFT JOIN procesadores c ON pc.componente_id = c.id AND pc.tipo_componente = 'procesadores'
         LEFT JOIN motherboards c ON pc.componente_id = c.id AND pc.tipo_componente = 'motherboards'
         LEFT JOIN memorias_ram c ON pc.componente_id = c.id AND pc.tipo_componente = 'memorias_ram'
         LEFT JOIN gabinetes c ON pc.componente_id = c.id AND pc.tipo_componente = 'gabinetes'
         WHERE pc.proyecto_id = ?`,
        [projectId]
      );

      const issues = [];
      const cpu = components.find(c => c.tipo_componente === 'procesadores');
      const motherboard = components.find(c => c.tipo_componente === 'motherboards');
      const ram = components.find(c => c.tipo_componente === 'memorias_ram');
      const caseComp = components.find(c => c.tipo_componente === 'gabinetes');

      // Verificar compatibilidad CPU - Motherboard
      if (cpu && motherboard && cpu.socket !== motherboard.socket) {
        issues.push({
          tipo: 'error',
          mensaje: `Incompatibilidad de socket: Procesador ${cpu.socket} vs Motherboard ${motherboard.socket}`,
          componentes: ['procesadores', 'motherboards']
        });
      }

      // Verificar compatibilidad RAM - Motherboard
      if (ram && motherboard && ram.tipo_memoria !== motherboard.tipo_memoria) {
        issues.push({
          tipo: 'error', 
          mensaje: `Incompatibilidad de RAM: ${ram.tipo_memoria} vs Motherboard ${motherboard.tipo_memoria}`,
          componentes: ['memorias_ram', 'motherboards']
        });
      }

      // Verificar compatibilidad Motherboard - Gabinete
      if (motherboard && caseComp && !checkFormatoCompatibilidad(motherboard.formato, caseComp.formato)) {
        issues.push({
          tipo: 'advertencia',
          mensaje: `Posible incompatibilidad de formato: ${motherboard.formato} vs Gabinete ${caseComp.formato}`,
          componentes: ['motherboards', 'gabinetes']
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
      console.error('Error verificando compatibilidad:', error);
      res.json({
        success: false,
        error: 'Error al verificar compatibilidad'
      });
    }
  }
}

// Función auxiliar para orden de componentes
function getOrderForType(tipo) {
  const orderMap = {
    'procesadores': 1,
    'motherboards': 2, 
    'memorias_ram': 3,
    'tarjetas_graficas': 4,
    'almacenamiento': 5,
    'fuentes_poder': 6,
    'gabinetes': 7
  };
  return orderMap[tipo] || 99;
}

// Función auxiliar para verificar compatibilidad de formatos
function checkFormatoCompatibilidad(motherboardFormat, caseFormat) {
  const compatibility = {
    'Mini-ITX': ['Mini Tower', 'Mid Tower', 'Full Tower'],
    'Micro-ATX': ['Mini Tower', 'Mid Tower', 'Full Tower'], 
    'ATX': ['Mid Tower', 'Full Tower']
  };
  
  return compatibility[motherboardFormat]?.includes(caseFormat) || false;
}

module.exports = new ProjectController();