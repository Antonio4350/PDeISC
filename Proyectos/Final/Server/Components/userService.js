const pool = require('./database');

class UserService {
  // Buscar usuario por email
  async findUserByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE email = ?',
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
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE id = ?',
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
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE google_id = ?',
        [googleId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error buscando usuario por Google ID:', error);
      throw error;
    }
  }

  // Crear usuario normal
  async createUser(userData) {
    const { email, nombre, apellido, telefono, password } = userData;
    
    try {
      const [result] = await pool.execute(
        `INSERT INTO usuarios (email, nombre, apellido, telefono, password) 
         VALUES (?, ?, ?, ?, ?)`,
        [email, nombre, apellido, telefono, password]
      );
      
      return { 
        id: result.insertId, 
        email, 
        nombre, 
        apellido, 
        telefono,
        rol: 'user'
      };
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }

  // Crear usuario de Google
  async createGoogleUser(googleData) {
    const { email, nombre, google_id, avatar_url } = googleData;
    
    try {
      const [result] = await pool.execute(
        `INSERT INTO usuarios (email, nombre, google_id, avatar_url) 
         VALUES (?, ?, ?, ?)`,
        [email, nombre, google_id, avatar_url]
      );
      
      return { 
        id: result.insertId, 
        email, 
        nombre, 
        google_id,
        avatar_url,
        rol: 'user'
      };
    } catch (error) {
      console.error('Error creando usuario Google:', error);
      throw error;
    }
  }

  // Actualizar Google ID de usuario existente
  async updateGoogleId(userId, googleId) {
    try {
      await pool.execute(
        'UPDATE usuarios SET google_id = ? WHERE id = ?',
        [googleId, userId]
      );
      return true;
    } catch (error) {
      console.error('Error actualizando Google ID:', error);
      throw error;
    }
  }

  // Verificar conexión a la base de datos
  async checkDatabaseConnection() {
    try {
      const [rows] = await pool.execute('SELECT 1 as connected');
      return true;
    } catch (error) {
      console.error('Error verificando conexión a BD:', error);
      throw error;
    }
  }
}

module.exports = new UserService();