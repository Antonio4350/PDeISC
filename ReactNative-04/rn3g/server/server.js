const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'torneo_futbol'
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const [users] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

    await connection.end();
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/equipos', authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [equipos] = await connection.execute(`
      SELECT e.*, COUNT(j.id) as cantidad_jugadores 
      FROM equipos e 
      LEFT JOIN jugadores j ON e.id = j.equipo_id 
      GROUP BY e.id
    `);
    await connection.end();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
});

app.post('/api/equipos', authenticateToken, authorize(['admin', 'director']), async (req, res) => {
  try {
    const { nombre, escudo } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'INSERT INTO equipos (nombre, escudo, jugadores) VALUES (?, ?, ?)',
      [nombre, escudo, '']
    );

    await connection.end();
    res.json({ id: result.insertId, nombre, escudo });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear equipo' });
  }
});

app.put('/api/equipos/:id', authenticateToken, authorize(['admin', 'director']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, escudo } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE equipos SET nombre = ?, escudo = ? WHERE id = ?',
      [nombre, escudo, id]
    );

    await connection.end();
    res.json({ message: 'Equipo actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar equipo' });
  }
});

app.delete('/api/equipos/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM equipos WHERE id = ?', [id]);
    await connection.end();
    res.json({ message: 'Equipo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar equipo' });
  }
});

app.get('/api/jugadores', authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [jugadores] = await connection.execute(`
      SELECT j.*, e.nombre as equipo_nombre 
      FROM jugadores j 
      LEFT JOIN equipos e ON j.equipo_id = e.id
    `);
    await connection.end();
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener jugadores' });
  }
});

app.post('/api/jugadores', authenticateToken, authorize(['admin', 'director']), async (req, res) => {
  try {
    const { nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'INSERT INTO jugadores (nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto]
    );

    await connection.end();
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear jugador' });
  }
});

app.put('/api/jugadores/:id', authenticateToken, authorize(['admin', 'director']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE jugadores SET nombre = ?, apellido = ?, edad = ?, posicion = ?, numero_casaca = ?, equipo_id = ?, foto = ? WHERE id = ?',
      [nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto, id]
    );

    await connection.end();
    res.json({ message: 'Jugador actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar jugador' });
  }
});

app.delete('/api/jugadores/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM jugadores WHERE id = ?', [id]);
    await connection.end();
    res.json({ message: 'Jugador eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar jugador' });
  }
});

app.get('/api/partidos', authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [partidos] = await connection.execute(`
      SELECT p.*, 
             el.nombre as equipo_local_nombre,
             ev.nombre as equipo_visitante_nombre
      FROM partidos p
      LEFT JOIN equipos el ON p.equipo_local = el.id
      LEFT JOIN equipos ev ON p.equipo_visitante = ev.id
      ORDER BY p.fecha DESC
    `);
    await connection.end();
    res.json(partidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
});

app.post('/api/partidos', authenticateToken, authorize(['admin', 'director']), async (req, res) => {
  try {
    const { equipo_local, equipo_visitante, fecha, lugar, latitud, longitud } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'INSERT INTO partidos (equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [equipo_local, equipo_visitante, fecha, lugar, null, latitud, longitud]
    );

    await connection.end();
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear partido' });
  }
});

app.put('/api/partidos/:id', authenticateToken, authorize(['admin', 'director']), async (req, res) => {
  try {
    const { id } = req.params;
    const { equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE partidos SET equipo_local = ?, equipo_visitante = ?, fecha = ?, lugar = ?, resultado = ?, latitud = ?, longitud = ? WHERE id = ?',
      [equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud, id]
    );

    await connection.end();
    res.json({ message: 'Partido actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar partido' });
  }
});

app.delete('/api/partidos/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM partidos WHERE id = ?', [id]);
    await connection.end();
    res.json({ message: 'Partido eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar partido' });
  }
});

app.get('/api/usuarios', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [usuarios] = await connection.execute('SELECT id, nombre, email, rol FROM usuarios');
    await connection.end();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.put('/api/usuarios/:id/rol', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, id]);
    await connection.end();
    res.json({ message: 'Rol actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});