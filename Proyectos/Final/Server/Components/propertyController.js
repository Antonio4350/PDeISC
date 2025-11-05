const propertyService = require('./propertyService');

class PropertyController {

    // Obtener propiedades para un tipo específico de componente
    async getPropertiesByType(req, res) {
        try {
            const { type } = req.params;
            console.log(`Obteniendo propiedades para: ${type}`);

            const properties = await propertyService.getPropertiesByComponentType(type);
            
            res.json({
                success: true,
                data: properties
            });
        } catch (error) {
            console.error('Error obteniendo propiedades:', error);
            res.json({
                success: false,
                error: 'Error al obtener propiedades'
            });
        }
    }

    // Obtener todas las propiedades organizadas
    async getAllProperties(req, res) {
        try {
            console.log('Obteniendo todas las propiedades...');
            
            const properties = await propertyService.getAllProperties();
            
            res.json({
                success: true,
                data: properties
            });
        } catch (error) {
            console.error('Error obteniendo todas las propiedades:', error);
            res.json({
                success: false,
                error: 'Error al obtener propiedades'
            });
        }
    }

    // Obtener propiedades para formularios
    async getFormProperties(req, res) {
        try {
            console.log('Obteniendo propiedades para formularios...');
            
            const properties = await propertyService.getFormProperties();
            
            res.json({
                success: true,
                data: properties
            });
        } catch (error) {
            console.error('Error obteniendo propiedades para formularios:', error);
            res.json({
                success: false,
                error: 'Error al obtener propiedades'
            });
        }
    }

    // Agregar nueva propiedad
    async addProperty(req, res) {
        try {
            const propertyData = req.body;
            console.log('Agregando nueva propiedad:', propertyData);

            // Validación
            if (!propertyData.tipo_componente || !propertyData.propiedad || !propertyData.valor) {
                return res.json({
                    success: false,
                    error: 'Tipo de componente, propiedad y valor son requeridos'
                });
            }

            const newProperty = await propertyService.addProperty(propertyData);
            
            res.json({
                success: true,
                message: 'Propiedad agregada exitosamente',
                data: newProperty
            });
        } catch (error) {
            console.error('Error agregando propiedad:', error);
            res.json({
                success: false,
                error: error.message || 'Error al agregar propiedad'
            });
        }
    }

    // Eliminar propiedad
    async deleteProperty(req, res) {
        try {
            const { id } = req.params;
            console.log(`Eliminando propiedad ID: ${id}`);

            const result = await propertyService.deleteProperty(id);
            
            if (!result) {
                return res.json({
                    success: false,
                    error: 'Propiedad no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Propiedad eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error eliminando propiedad:', error);
            res.json({
                success: false,
                error: 'Error al eliminar propiedad'
            });
        }
    }
    async getAllPropertiesWithIds(req, res) {
    try {
        console.log('Obteniendo todas las propiedades con IDs...');
        
        const [rows] = await pool.execute(
            `SELECT id, tipo_componente, propiedad, valor 
             FROM propiedades_componentes 
             WHERE estado = 'activo' 
             ORDER BY tipo_componente, propiedad, valor`
        );

        // Organizar por tipo de componente
        const organized = {};
        rows.forEach(row => {
            if (!organized[row.tipo_componente]) {
                organized[row.tipo_componente] = {};
            }
            if (!organized[row.tipo_componente][row.propiedad]) {
                organized[row.tipo_componente][row.propiedad] = [];
            }
            organized[row.tipo_componente][row.propiedad].push({
                id: row.id,
                valor: row.valor
            });
        });

        res.json({
            success: true,
            data: organized
        });
    } catch (error) {
        console.error('Error obteniendo propiedades con IDs:', error);
        res.json({
            success: false,
            error: 'Error al obtener propiedades'
        });
    }
    async function getFormOptions(req, res) {
    try {
        console.log('Obteniendo opciones para formularios...');
        
        // Obtener propiedades CON IDs
        const [rows] = await pool.execute(
            `SELECT id, tipo_componente, propiedad, valor 
             FROM propiedades_componentes 
             WHERE estado = 'activo' 
             ORDER BY tipo_componente, propiedad, valor`
        );

        // Organizar por tipo de componente y propiedad
        const organized = {};
        rows.forEach(row => {
            if (!organized[row.tipo_componente]) {
                organized[row.tipo_componente] = {};
            }
            if (!organized[row.tipo_componente][row.propiedad]) {
                organized[row.tipo_componente][row.propiedad] = [];
            }
            // Guardar objeto con ID y valor
            organized[row.tipo_componente][row.propiedad].push({
                id: row.id,
                valor: row.valor
            });
        });

        res.json({
            success: true,
            data: organized
        });
    } catch (error) {
        console.error('Error obteniendo opciones:', error);
        res.json({
            success: false,
            error: 'Error al obtener opciones'
        });
    }
}
}
}

module.exports = new PropertyController();