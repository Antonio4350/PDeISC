const pool = require('./database');
const bcrypt = require('bcryptjs');

class UserService {
  // Buscar usuario por email
  async findUserByEmail(email) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error buscando usuario por email:', error);
      throw error;
    }
  }

  // Buscar usuario por ID
  async findUserById(userId) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM usuarios WHERE id = $1',
        [userId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error buscando usuario por ID:', error);
      throw error;
    }
  }

  // Buscar usuario por Google ID
  async findUserByGoogleId(googleId) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM usuarios WHERE google_id = $1',
        [googleId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error buscando usuario por Google ID:', error);
      throw error;
    }
  }

  // Crear usuario normal CON ENCRIPCIÓN
  async createUser(userData) {
    const { email, nombre, apellido, telefono, password } = userData;
    
    try {
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const { rows } = await pool.query(
        `INSERT INTO usuarios (email, nombre, apellido, telefono, password) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [email, nombre, apellido, telefono, hashedPassword]
      );
      
      return rows[0];
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }

  // Verificar contraseña
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Crear usuario de Google
  async createGoogleUser(googleData) {
    const { email, nombre, google_id, avatar_url } = googleData;
    
    try {
      const { rows } = await pool.query(
        `INSERT INTO usuarios (email, nombre, google_id, avatar_url) 
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [email, nombre, google_id, avatar_url]
      );
      
      return rows[0];
    } catch (error) {
      console.error('Error creando usuario Google:', error);
      throw error;
    }
  }

  // Actualizar Google ID de usuario existente
  async updateGoogleId(userId, googleId) {
    try {
      const { rowCount } = await pool.query(
        'UPDATE usuarios SET google_id = $1 WHERE id = $2',
        [googleId, userId]
      );
      return rowCount > 0;
    } catch (error) {
      console.error('Error actualizando Google ID:', error);
      throw error;
    }
  }

  // Verificar conexión a la base de datos
  async checkDatabaseConnection() {
    try {
      const { rows } = await pool.query('SELECT 1 as connected');
      return true;
    } catch (error) {
      console.error('Error verificando conexión a BD:', error);
      throw error;
    }
  }
}

module.exports = new UserService();