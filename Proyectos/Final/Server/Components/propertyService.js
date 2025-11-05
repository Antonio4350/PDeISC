const pool = require('./database');

class PropertyService {

    // Obtener todas las propiedades de un tipo de componente
    async getPropertiesByComponentType(componentType) {
        try {
            const [rows] = await pool.execute(
                `SELECT propiedad, GROUP_CONCAT(valor) as valores 
                 FROM propiedades_componentes 
                 WHERE tipo_componente = ? AND estado = 'activo' 
                 GROUP BY propiedad 
                 ORDER BY propiedad`,
                [componentType]
            );

            // Convertir a objeto con arrays
            const properties = {};
            rows.forEach(row => {
                properties[row.propiedad] = row.valores.split(',');
            });

            return properties;
        } catch (error) {
            console.error('Error obteniendo propiedades:', error);
            throw error;
        }
    }

    // Obtener todas las propiedades organizadas
    async getAllProperties() {
        try {
            const [rows] = await pool.execute(
                `SELECT tipo_componente, propiedad, valor 
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
                organized[row.tipo_componente][row.propiedad].push(row.valor);
            });

            return organized;
        } catch (error) {
            console.error('Error obteniendo todas las propiedades:', error);
            throw error;
        }
    }

    // Agregar nueva propiedad
    async addProperty(propertyData) {
        const { tipo_componente, propiedad, valor } = propertyData;

        try {
            // Verificar si ya existe
            const [existing] = await pool.execute(
                'SELECT id FROM propiedades_componentes WHERE tipo_componente = ? AND propiedad = ? AND valor = ? AND estado = "activo"',
                [tipo_componente, propiedad, valor]
            );

            if (existing.length > 0) {
                throw new Error('La propiedad ya existe');
            }

            const [result] = await pool.execute(
                'INSERT INTO propiedades_componentes (tipo_componente, propiedad, valor) VALUES (?, ?, ?)',
                [tipo_componente, propiedad, valor]
            );

            return { id: result.insertId, ...propertyData };
        } catch (error) {
            console.error('Error agregando propiedad:', error);
            throw error;
        }
    }

    // Eliminar propiedad (soft delete)
    async deleteProperty(id) {
        try {
            const [result] = await pool.execute(
                'UPDATE propiedades_componentes SET estado = "inactivo" WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error eliminando propiedad:', error);
            throw error;
        }
    }

async getFormProperties() {
    try {
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
            // Guardar objeto completo con ID
            organized[row.tipo_componente][row.propiedad].push({
                id: row.id,
                valor: row.valor
            });
        });

        return organized;
    } catch (error) {
        console.error('Error obteniendo propiedades para formularios:', error);
        throw error;
    }
}
}

module.exports = new PropertyService();