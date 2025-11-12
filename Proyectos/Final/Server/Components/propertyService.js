import pool from './database.js';

class PropertyService {

    // Obtener todas las propiedades de un tipo de componente
    async getPropertiesByComponentType(componentType) {
        try {
            const { rows } = await pool.query(
                `SELECT propiedad, STRING_AGG(valor, ',') as valores 
                 FROM propiedades_componentes 
                 WHERE tipo_componente = $1 AND estado = $2 
                 GROUP BY propiedad 
                 ORDER BY propiedad`,
                [componentType, 'activo']
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
            const { rows } = await pool.query(
                `SELECT tipo_componente, propiedad, valor 
                 FROM propiedades_componentes 
                 WHERE estado = $1 
                 ORDER BY tipo_componente, propiedad, valor`,
                ['activo']
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
            const { rows: existing } = await pool.query(
                'SELECT id FROM propiedades_componentes WHERE tipo_componente = $1 AND propiedad = $2 AND valor = $3 AND estado = $4',
                [tipo_componente, propiedad, valor, 'activo']
            );

            if (existing.length > 0) {
                throw new Error('La propiedad ya existe');
            }

            const { rows } = await pool.query(
                'INSERT INTO propiedades_componentes (tipo_componente, propiedad, valor) VALUES ($1, $2, $3) RETURNING *',
                [tipo_componente, propiedad, valor]
            );

            return rows[0];
        } catch (error) {
            console.error('Error agregando propiedad:', error);
            throw error;
        }
    }

    // Eliminar propiedad (soft delete)
    async deleteProperty(id) {
        try {
            const { rowCount } = await pool.query(
                'UPDATE propiedades_componentes SET estado = $1 WHERE id = $2',
                ['inactivo', id]
            );

            return rowCount > 0;
        } catch (error) {
            console.error('Error eliminando propiedad:', error);
            throw error;
        }
    }

    async getFormProperties() {
        try {
            // Obtener propiedades CON IDs
            const { rows } = await pool.query(
                `SELECT id, tipo_componente, propiedad, valor 
                 FROM propiedades_componentes 
                 WHERE estado = $1 
                 ORDER BY tipo_componente, propiedad, valor`,
                ['activo']
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

export default new PropertyService();